const test = require('node:test');
const assert = require('node:assert/strict');
const newsletter = require('./data/fixtures/newsletter-latest.json');
const crowds = require('./data/fixtures/crowds-latest.json');
const { buildDashboardRenderModel } = require('./lib/dashboard/buildDashboardRenderModel.js');

test('enforces list limits', () => {
  const model = buildDashboardRenderModel(newsletter, crowds, null);
  assert.ok(model.home.mustSee.length <= 1);
  assert.equal(model.home.hotTiles.length, 3);
  assert.ok(model.home.topStories.length <= 5);
  assert.ok(model.home.resortSpotlight.length <= 2);
  assert.equal(model.home.parkSnapshots.length, 4);
  for (const parkCode of ['MK', 'EPCOT', 'DHS', 'AK']) {
    assert.ok(model.parks[parkCode].headlines.length <= 6);
    assert.ok(model.parks[parkCode].resortTieIns.length <= 3);
    assert.ok(model.parks[parkCode].mustSee.length <= 1);
  }
});

test('sticky ordering preserves previous top story order when no stronger candidate', () => {
  const first = buildDashboardRenderModel(newsletter, crowds, null);
  const modified = JSON.parse(JSON.stringify(newsletter));
  modified.home.topStories = [...modified.home.topStories].reverse();
  const second = buildDashboardRenderModel(modified, crowds, first);
  assert.deepEqual(
    second.home.topStories.map((x) => x.id),
    first.home.topStories.map((x) => x.id)
  );
});

test('must-see selection prefers must_see_today', () => {
  const model = buildDashboardRenderModel(newsletter, crowds, null);
  assert.equal(model.home.mustSee.length, 1);
  assert.equal(model.home.mustSee[0].id, 'home-must-1');
});

test('crowds tile behavior reflects rising crowds', () => {
  const model = buildDashboardRenderModel(newsletter, crowds, null);
  const crowdsTile = model.home.hotTiles.find((x) => x.category === 'crowds');
  assert.ok(crowdsTile);
  assert.match(crowdsTile.long, /Crowds rising at/);
});
