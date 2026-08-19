export interface OrganizationFaqItem {
  question: string;
  answer: string;
}

export interface OrganizationStats {
  activeVacanciesCount: number;
  totalPostsCount: number;
  admitCardsCount: number;
  resultsCount: number;
}

export interface OrganizationProfile {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  categoryType: string;
  headquarters: string;
  establishedYear: number;
  state: string;
  website: string;
  verified: boolean;
  logoUrl?: string;
  tagline: string;
  description: string;
  aboutDetails: string[];
  selectionProcess: string[];
  keyDepartments: string[];
  faqs: OrganizationFaqItem[];
  stats: OrganizationStats;
}
