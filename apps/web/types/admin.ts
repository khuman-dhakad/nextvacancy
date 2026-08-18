import { JobCategory, JobStatus, JobPosting } from "./job";

export interface AdminAnalyticsStats {
  totalJobs: number;
  govtJobs: number;
  privateJobs: number;
  admitCards: number;
  results: number;
  scholarships: number;
  internships: number;
  draftsCount: number;
  totalViews: number;
}

export type AdminActionType =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "PUBLISH"
  | "UNPUBLISH"
  | "DUPLICATE"
  | "LOGIN";

export interface AdminActivityLog {
  id: string;
  action: AdminActionType;
  entityTitle: string;
  timestamp: string;
  adminUser: string;
  details: string;
}

export interface AdminJobSearchParams {
  query?: string;
  category?: JobCategory | "all";
  status?: JobStatus | "all";
  page?: number;
  limit?: number;
  sortBy?: "latest" | "title" | "organization" | "deadline" | "views";
  sortOrder?: "asc" | "desc";
}

export interface AdminSession {
  isAuthenticated: boolean;
  username: string;
  email: string;
  role: "ADMIN";
  loginTime: string;
  token?: string;
}

export interface AdminJobFormData extends Omit<JobPosting, "id" | "viewsCount" | "createdAt" | "updatedAt"> {
  id?: string;
  viewsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}
