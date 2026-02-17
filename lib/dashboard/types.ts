export type Category = 'event_alert' | 'limited_merch' | 'crowds' | 'entertainment' | 'food' | 'other';
export type Urgency = 'must_see_today' | 'normal';
export type ParkCode = 'HOME' | 'MK' | 'EPCOT' | 'DHS' | 'AK' | 'RESORTS';
export type Confidence = 'high' | 'med' | 'low';

export interface NewsletterItem {
  id: string;
  category: Category;
  urgency: Urgency;
  park: ParkCode;
  short: string;
  long: string;
  updated_at: string;
  confidence?: Confidence;
  expires_at?: string;
}

export interface NewsletterRaw {
  generated_at: string;
  home: {
    mustSee: NewsletterItem[];
    hotTiles?: NewsletterItem[];
    topStories: NewsletterItem[];
    parksSummary: Array<{
      park: Exclude<ParkCode, 'HOME' | 'RESORTS'>;
      headline: string;
      updated_at: string;
    }>;
    resortsBlurb: NewsletterItem[];
  };
  parks: Record<Exclude<ParkCode, 'HOME' | 'RESORTS'>, {
    todayVibe?: string;
    mustSee: NewsletterItem[];
    hot: NewsletterItem[];
    headlines: NewsletterItem[];
    resortBlurbs: NewsletterItem[];
  }>;
}

export interface CrowdPark {
  park: Exclude<ParkCode, 'HOME' | 'RESORTS'>;
  score: number;
  label: string;
  avg_wait_min: number;
  data_quality?: 'good' | 'limited' | 'bad';
  generated_at: string;
}

export interface CrowdsRaw {
  generated_at: string;
  parks: Record<Exclude<ParkCode, 'HOME' | 'RESORTS'>, CrowdPark>;
}

export interface RenderItem {
  id: string;
  category: Category;
  park: ParkCode;
  short: string;
  long: string;
  updatedAt: string;
}

export interface RenderCrowd {
  park: Exclude<ParkCode, 'HOME' | 'RESORTS'>;
  score: number;
  label: string;
  avgWaitMin: number;
  dataQuality: 'good' | 'limited' | 'bad';
  generatedAt: string;
  note?: string;
}

export interface DashboardRenderModel {
  generatedAt: string;
  crowdGeneratedAt: string;
  home: {
    mustSee: RenderItem[];
    hotTiles: Array<{
      id: string;
      category: 'event_alert' | 'limited_merch' | 'crowds';
      title: string;
      short: string;
      long: string;
      updatedAt: string;
    }>;
    topStories: RenderItem[];
    parkSnapshots: Array<{
      park: Exclude<ParkCode, 'HOME' | 'RESORTS'>;
      name: string;
      color: 'blue' | 'purple' | 'red' | 'green';
      crowd: RenderCrowd;
      headline: string;
    }>;
    resortSpotlight: RenderItem[];
  };
  parks: Record<Exclude<ParkCode, 'HOME' | 'RESORTS'>, {
    park: Exclude<ParkCode, 'HOME' | 'RESORTS'>;
    crowd: RenderCrowd;
    todayVibe: string;
    mustSee: RenderItem[];
    hot: RenderItem[];
    headlines: RenderItem[];
    resortTieIns: RenderItem[];
  }>;
}
