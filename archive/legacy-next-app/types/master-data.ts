export interface CategoryMaster {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  isActive: boolean;
  isFeatured: boolean;
  jobCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMaster {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  logoUrl?: string;
  website: string;
  description: string;
  state: string;
  categoryType: string;
  isActive: boolean;
  jobCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategorySearchParams {
  query?: string;
  status?: "all" | "active" | "inactive";
  featured?: "all" | "featured" | "standard";
  page?: number;
  limit?: number;
  sortBy?: "name" | "jobs" | "createdAt" | "latest";
  sortOrder?: "asc" | "desc";
}

export interface OrganizationSearchParams {
  query?: string;
  state?: string | "all";
  categoryType?: string | "all";
  status?: "all" | "active" | "inactive";
  page?: number;
  limit?: number;
  sortBy?: "name" | "shortName" | "jobs" | "createdAt" | "latest";
  sortOrder?: "asc" | "desc";
}
