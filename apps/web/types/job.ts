export type JobCategory =
  | "government"
  | "private"
  | "admit-card"
  | "result"
  | "answer-key"
  | "scholarship"
  | "scheme"
  | "internship"
  | "apprenticeship"
  | "work-from-home";

export type JobStatus =
  | "OPEN"
  | "ENDING_SOON"
  | "CLOSED"
  | "ADMIT_CARD_OUT"
  | "RESULT_OUT"
  | "ANSWER_KEY_OUT";

export interface VacancyDetail {
  postName: string;
  totalVacancies: number | string;
  qualification: string;
  payScale?: string;
}

export interface ImportantDates {
  notificationDate?: string;
  applicationStartDate?: string;
  applicationEndDate?: string;
  lastDateFeePayment?: string;
  correctionWindowDate?: string;
  examDate?: string;
  admitCardDate?: string;
  resultDate?: string;
  answerKeyDate?: string;
}

export interface FeeStructure {
  general?: string;
  obcEws?: string;
  scStPwd?: string;
  female?: string;
  paymentMode?: string;
  exemptionNotes?: string;
}

export interface AgeLimit {
  minAge?: number;
  maxAge?: number;
  asOnDate?: string;
  relaxationNotes?: string;
}

export interface ImportantLink {
  label: string;
  url: string;
  linkType:
    | "apply_online"
    | "official_notification_pdf"
    | "admit_card"
    | "result_merit_list"
    | "answer_key"
    | "official_website"
    | "correction_portal";
  isExternal?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface JobPosting {
  id: string;
  slug: string;
  title: string;
  shortSummary: string;
  organization: string;
  organizationLogo?: string;
  department?: string;
  category: JobCategory;
  status: JobStatus;
  location: string;
  totalVacancies: number | string;
  salaryOrStipend: string;
  qualificationSummary: string;
  importantDates: ImportantDates;
  feeStructure?: FeeStructure;
  ageLimit?: AgeLimit;
  vacancyBreakdown?: VacancyDetail[];
  selectionProcess?: string[];
  howToApplySteps?: string[];
  requiredDocuments?: string[];
  importantLinks: ImportantLink[];
  faqs?: FAQItem[];
  viewsCount: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type JobSortOption =
  | "latest"
  | "deadline"
  | "views"
  | "alphabetical"
  | "createdAt"
  | "viewsCount"
  | "applicationEndDate";

export interface JobSearchParams {
  query?: string;
  category?: JobCategory | "all";
  status?: JobStatus | "all";
  location?: string;
  qualification?: string;
  page?: number;
  limit?: number;
  sortBy?: JobSortOption;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
