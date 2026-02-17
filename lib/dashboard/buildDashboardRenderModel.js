const CATEGORY_PRIORITY = {
  event_alert: 6,
  limited_merch: 5,
  crowds: 4,
  entertainment: 3,
  food: 2,
  other: 1,
};

const CONFIDENCE_SCORE = { high: 1, med: 0, low: -10 };
const MEANINGFUL_THRESHOLD = 2;

const PARK_META = {
  MK: { name: 'Magic Kingdom', color: 'blue' },
  EPCOT: { name: 'EPCOT', color: 'purple' },
  DHS: { name: 'Hollywood Studios', color: 'red' },
  AK: { name: 'Animal Kingdom', color: 'green' },
};

function nowIso() {
  return new Date().toISOString();
}

function isExpired(item, now) {
  return Boolean(item.expires_at && new Date(item.expires_at).getTime() <= now);
}

function isLowConfidence(item) {
  return item.confidence === 'low';
}

function scoreItem(item, now) {
  const base = CATEGORY_PRIORITY[item.category] || 0;
  const urgencyBoost = item.urgency === 'must_see_today' ? 4 : 0;
  const confidence = CONFIDENCE_SCORE[item.confidence || 'med'] || 0;
  const ageHours = Math.max(0, (now - new Date(item.updated_at).getTime()) / (1000 * 60 * 60));
  const recencyBoost = Math.max(0, 2 - ageHours / 6);
  return base + urgencyBoost + confidence + recencyBoost;
}

function sanitizeItems(items, now) {
  return (items || []).filter((item) => item && item.id && !isExpired(item, now) && !isLowConfidence(item));
}

function toRenderItem(item) {
  return {
    id: item.id,
    category: item.category,
    park: item.park,
    short: item.short,
    long: item.long,
    updatedAt: item.updated_at,
  };
}

function stickyList({ candidates, previous = [], limit, now }) {
  const candidateMap = new Map(candidates.map((c) => [c.id, c]));
  const prevIds = previous.map((p) => p.id).filter((id) => candidateMap.has(id));
  const prevItems = prevIds.map((id) => candidateMap.get(id));

  const fresh = candidates
    .filter((c) => !prevIds.includes(c.id))
    .sort((a, b) => scoreItem(b, now) - scoreItem(a, now));

  if (!prevItems.length) {
    return fresh.slice(0, limit);
  }

  let ordered = [...prevItems];

  if (fresh.length) {
    const bestFresh = fresh[0];
    const currentFirst = ordered[0];
    if (scoreItem(bestFresh, now) - scoreItem(currentFirst, now) >= MEANINGFUL_THRESHOLD) {
      ordered = [bestFresh, ...ordered.filter((x) => x.id !== bestFresh.id)];
    } else {
      ordered.push(...fresh);
    }
  }

  return ordered.slice(0, limit);
}

function buildCrowdTile(crowds) {
  const parks = Object.values(crowds.parks || {});
  const highest = parks.sort((a, b) => (b.score || 0) - (a.score || 0))[0];
  const rising = parks.find((p) => (p.score || 0) >= 8);
  const headline = rising ? `Crowds rising at ${PARK_META[rising.park]?.name || rising.park}` : 'Crowds steady';
  const short = highest ? `${highest.label} (${highest.score}/10)` : 'Data limited';
  return {
    id: 'hot-crowds',
    category: 'crowds',
    title: 'Crowds',
    short,
    long: headline,
    updatedAt: crowds.generated_at || nowIso(),
  };
}

function coerceCrowd(park, crowd, previousCrowd) {
  const quality = crowd?.data_quality || 'limited';
  const badData = quality === 'bad' || crowd == null;
  if (badData && previousCrowd) {
    return {
      ...previousCrowd,
      note: 'Data limited',
      dataQuality: 'limited',
    };
  }

  return {
    park,
    score: Math.max(1, Math.min(10, crowd?.score || previousCrowd?.score || 5)),
    label: crowd?.label || previousCrowd?.label || 'Moderate',
    avgWaitMin: crowd?.avg_wait_min ?? previousCrowd?.avgWaitMin ?? 0,
    dataQuality: quality,
    generatedAt: crowd?.generated_at || previousCrowd?.generatedAt || nowIso(),
    note: quality !== 'good' ? 'Data limited' : undefined,
  };
}

function pickCategoryItem(pool, category, now, previousItems = [], limit = 1) {
  const candidates = pool.filter((item) => item.category === category);
  return stickyList({ candidates, previous: previousItems, limit, now });
}

function normalizeHotTile(item) {
  return {
    id: `hot-${item.id}`,
    category: item.category,
    title: item.category === 'event_alert' ? 'Events & Alerts' : item.category === 'limited_merch' ? 'Limited Merch' : 'Crowds',
    short: item.short,
    long: item.long,
    updatedAt: item.updated_at,
  };
}

function buildDashboardRenderModel(newsletterRaw, crowdsRaw, previousModel) {
  const now = Date.now();
  const previous = previousModel || {};
  const home = newsletterRaw?.home || {};
  const parksRaw = newsletterRaw?.parks || {};

  const homePool = sanitizeItems([...(home.mustSee || []), ...(home.topStories || []), ...(home.hotTiles || [])], now);
  const resortPool = sanitizeItems(home.resortsBlurb || [], now);

  const mustSeeCandidates = sanitizeItems(home.mustSee || [], now).filter((item) => item.urgency === 'must_see_today');
  const mustSee = stickyList({
    candidates: mustSeeCandidates.sort((a, b) => scoreItem(b, now) - scoreItem(a, now)),
    previous: previous.home?.mustSee || [],
    limit: 1,
    now,
  }).map(toRenderItem);

  const hotEvent = pickCategoryItem(homePool, 'event_alert', now, (previous.home?.hotTiles || []).filter((x) => x.category === 'event_alert'), 1);
  const hotMerch = pickCategoryItem(homePool, 'limited_merch', now, (previous.home?.hotTiles || []).filter((x) => x.category === 'limited_merch'), 1);
  const hotTiles = [
    ...(hotEvent[0] ? [normalizeHotTile(hotEvent[0])] : [{ id: 'hot-event-fallback', category: 'event_alert', title: 'Events & Alerts', short: 'No urgent alerts', long: 'No urgent alerts right now.', updatedAt: newsletterRaw.generated_at }]),
    ...(hotMerch[0] ? [normalizeHotTile(hotMerch[0])] : [{ id: 'hot-merch-fallback', category: 'limited_merch', title: 'Limited Merch', short: 'No merch alerts', long: 'No limited merch alert right now.', updatedAt: newsletterRaw.generated_at }]),
    buildCrowdTile(crowdsRaw),
  ];

  const topStories = stickyList({
    candidates: sanitizeItems(home.topStories || [], now).sort((a, b) => scoreItem(b, now) - scoreItem(a, now)),
    previous: previous.home?.topStories || [],
    limit: 5,
    now,
  }).map(toRenderItem);

  const resortSpotlight = stickyList({
    candidates: resortPool.sort((a, b) => scoreItem(b, now) - scoreItem(a, now)),
    previous: previous.home?.resortSpotlight || [],
    limit: 2,
    now,
  }).map(toRenderItem);

  const parkSnapshots = ['MK', 'EPCOT', 'DHS', 'AK'].map((park) => {
    const summary = (home.parksSummary || []).find((p) => p.park === park);
    const parkHeadlines = sanitizeItems(parksRaw[park]?.headlines || [], now);
    const previousSnap = (previous.home?.parkSnapshots || []).find((p) => p.park === park);
    const crowd = coerceCrowd(park, crowdsRaw?.parks?.[park], previousSnap?.crowd);
    return {
      park,
      name: PARK_META[park].name,
      color: PARK_META[park].color,
      crowd,
      headline: summary?.headline || parkHeadlines[0]?.short || 'No major updates',
    };
  });

  const parks = {};
  ['MK', 'EPCOT', 'DHS', 'AK'].forEach((park) => {
    const source = parksRaw[park] || { mustSee: [], hot: [], headlines: [], resortBlurbs: [] };
    const pool = sanitizeItems([...(source.hot || []), ...(source.headlines || []), ...(source.mustSee || [])], now);

    const parkMustSee = stickyList({
      candidates: sanitizeItems(source.mustSee || [], now)
        .filter((item) => item.urgency === 'must_see_today')
        .sort((a, b) => scoreItem(b, now) - scoreItem(a, now)),
      previous: previous.parks?.[park]?.mustSee || [],
      limit: 1,
      now,
    }).map(toRenderItem);

    const parkHot = [
      ...pickCategoryItem(pool, 'event_alert', now, (previous.parks?.[park]?.hot || []).filter((x) => x.category === 'event_alert'), 1),
      ...pickCategoryItem(pool, 'limited_merch', now, (previous.parks?.[park]?.hot || []).filter((x) => x.category === 'limited_merch'), 1),
      ...pickCategoryItem(pool, 'crowds', now, (previous.parks?.[park]?.hot || []).filter((x) => x.category === 'crowds'), 1),
    ].slice(0, 3).map(toRenderItem);

    const parkHeadlines = stickyList({
      candidates: sanitizeItems(source.headlines || [], now).sort((a, b) => scoreItem(b, now) - scoreItem(a, now)),
      previous: previous.parks?.[park]?.headlines || [],
      limit: 6,
      now,
    }).map(toRenderItem);

    const resortTieIns = stickyList({
      candidates: sanitizeItems(source.resortBlurbs || [], now).sort((a, b) => scoreItem(b, now) - scoreItem(a, now)),
      previous: previous.parks?.[park]?.resortTieIns || [],
      limit: 3,
      now,
    }).map(toRenderItem);

    parks[park] = {
      park,
      crowd: coerceCrowd(park, crowdsRaw?.parks?.[park], previous.parks?.[park]?.crowd),
      todayVibe: source.todayVibe || `${PARK_META[park].name} feels ${coerceCrowd(park, crowdsRaw?.parks?.[park], previous.parks?.[park]?.crowd).label.toLowerCase()} today.`,
      mustSee: parkMustSee,
      hot: parkHot,
      headlines: parkHeadlines,
      resortTieIns,
    };
  });

  return {
    generatedAt: newsletterRaw?.generated_at || nowIso(),
    crowdGeneratedAt: crowdsRaw?.generated_at || nowIso(),
    home: {
      mustSee,
      hotTiles,
      topStories,
      parkSnapshots,
      resortSpotlight,
    },
    parks,
  };
}

const __internal = {
  scoreItem,
  stickyList,
  buildCrowdTile,
};

module.exports = { buildDashboardRenderModel, __internal };
