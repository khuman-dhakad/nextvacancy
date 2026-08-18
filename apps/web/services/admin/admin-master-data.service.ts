import {
  CategoryMaster,
  OrganizationMaster,
  CategorySearchParams,
  OrganizationSearchParams,
  PaginatedResponse,
} from "@/types";

/**
 * NEXTVACANCY Admin Master Data Service
 * Full CRUD, search, filter, pagination, slug generator, and status toggling for Categories and Organizations.
 * Built for direct mapping to normalized relational backend (Spring Boot + PostgreSQL).
 */

let categoriesStore: CategoryMaster[] = [
  {
    id: "cat-1",
    name: "Government Jobs",
    slug: "government-jobs",
    description: "Central, State, PSU, and Autonomous bodies public sector recruitment circulars.",
    icon: "Building2",
    isActive: true,
    isFeatured: true,
    jobCount: 1450,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-08-15T12:00:00.000Z",
  },
  {
    id: "cat-2",
    name: "Private & IT Jobs",
    slug: "private-jobs",
    description: "Verified corporate vacancies across software engineering, analytics, fintech, and operations.",
    icon: "TrendingUp",
    isActive: true,
    isFeatured: true,
    jobCount: 820,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-08-14T10:00:00.000Z",
  },
  {
    id: "cat-3",
    name: "Railway (RRB & RRC)",
    slug: "railway",
    description: "Indian Railways Centralized Employment Notices (CEN) for NTPC, ALP, Group D, and Technicians.",
    icon: "Train",
    isActive: true,
    isFeatured: true,
    jobCount: 340,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-08-16T09:00:00.000Z",
  },
  {
    id: "cat-4",
    name: "Staff Selection Commission (SSC)",
    slug: "ssc",
    description: "All Staff Selection Commission examinations including CGL, CHSL, MTS, GD, CPO, and Stenographer.",
    icon: "Award",
    isActive: true,
    isFeatured: true,
    jobCount: 420,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-08-17T11:00:00.000Z",
  },
  {
    id: "cat-5",
    name: "UPSC & Civil Services",
    slug: "upsc",
    description: "Union Public Service Commission examinations for IAS, IPS, IFS, NDA, CDS, and Engineering Services.",
    icon: "ShieldCheck",
    isActive: true,
    isFeatured: true,
    jobCount: 190,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-08-12T14:00:00.000Z",
  },
  {
    id: "cat-6",
    name: "Banking & Insurance",
    slug: "banking",
    description: "IBPS, SBI, RBI, NABARD, LIC, and public sector bank probationary officers and clerical drives.",
    icon: "Landmark",
    isActive: true,
    isFeatured: true,
    jobCount: 510,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-08-15T15:00:00.000Z",
  },
  {
    id: "cat-7",
    name: "Defence & Police Services",
    slug: "defence",
    description: "Indian Army, Indian Navy, Indian Air Force, CAPF, Delhi Police, and State Police Constable / SI posts.",
    icon: "Shield",
    isActive: true,
    isFeatured: false,
    jobCount: 280,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-08-10T08:00:00.000Z",
  },
  {
    id: "cat-8",
    name: "Teaching & Faculty",
    slug: "teaching",
    description: "CTET, UGC NET, KVS, NVS, State Teacher Eligibility Tests, Assistant Professors, and school teachers.",
    icon: "GraduationCap",
    isActive: true,
    isFeatured: false,
    jobCount: 310,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-08-11T16:00:00.000Z",
  },
  {
    id: "cat-9",
    name: "National Scholarships",
    slug: "scholarship",
    description: "Ministry-sponsored higher education grants, post-matric fellowships, and merit assistance programs.",
    icon: "Sparkles",
    isActive: true,
    isFeatured: true,
    jobCount: 160,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-08-13T10:00:00.000Z",
  },
  {
    id: "cat-10",
    name: "Internships & Apprenticeships",
    slug: "internship",
    description: "Prime Minister Internship Scheme, NATS, and PSU trade apprenticeship circulars for freshers.",
    icon: "Briefcase",
    isActive: true,
    isFeatured: false,
    jobCount: 240,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-08-14T11:00:00.000Z",
  },
];

let organizationsStore: OrganizationMaster[] = [
  {
    id: "org-1",
    name: "Staff Selection Commission",
    shortName: "SSC",
    slug: "staff-selection-commission",
    website: "https://ssc.gov.in",
    description: "Premier government recruiting agency for Group B and Group C non-technical posts in Central Ministries.",
    state: "Central / New Delhi",
    categoryType: "Central Commission",
    isActive: true,
    jobCount: 18,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-08-16T10:00:00.000Z",
  },
  {
    id: "org-2",
    name: "Union Public Service Commission",
    shortName: "UPSC",
    slug: "union-public-service-commission",
    website: "https://upsc.gov.in",
    description: "India's premier central recruitment agency for all Group A Civil Services and Defence examinations.",
    state: "Central / New Delhi",
    categoryType: "Central Commission",
    isActive: true,
    jobCount: 12,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-08-15T09:00:00.000Z",
  },
  {
    id: "org-3",
    name: "Institute of Banking Personnel Selection",
    shortName: "IBPS",
    slug: "institute-of-banking-personnel-selection",
    website: "https://ibps.in",
    description: "Autonomous agency conducting common recruitment for 11 participating Public Sector Banks and RRBs.",
    state: "Maharashtra",
    categoryType: "Banking",
    isActive: true,
    jobCount: 9,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-08-14T14:00:00.000Z",
  },
  {
    id: "org-4",
    name: "State Bank of India",
    shortName: "SBI",
    slug: "state-bank-of-india",
    website: "https://sbi.co.in/careers",
    description: "India's largest public sector bank hiring Probationary Officers, Junior Associates, and Specialist Cadre Officers.",
    state: "Maharashtra",
    categoryType: "Banking",
    isActive: true,
    jobCount: 6,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-08-13T12:00:00.000Z",
  },
  {
    id: "org-5",
    name: "Railway Recruitment Boards",
    shortName: "RRB",
    slug: "railway-recruitment-boards",
    website: "https://indianrailways.gov.in",
    description: "Apex body overseeing 21 zonal recruitment boards for Indian Railways technical and non-technical cadres.",
    state: "Central / New Delhi",
    categoryType: "Railways",
    isActive: true,
    jobCount: 14,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-08-17T08:00:00.000Z",
  },
  {
    id: "org-6",
    name: "Indian Space Research Organisation",
    shortName: "ISRO",
    slug: "indian-space-research-organisation",
    website: "https://isro.gov.in/careers",
    description: "National space agency under Department of Space hiring Scientists, Engineers, Technical Assistants, and Draughtsmen.",
    state: "Karnataka",
    categoryType: "PSU / Research",
    isActive: true,
    jobCount: 5,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-08-12T11:00:00.000Z",
  },
  {
    id: "org-7",
    name: "Defence Research & Development Organisation",
    shortName: "DRDO",
    slug: "defence-research-and-development-organisation",
    website: "https://drdo.gov.in",
    description: "Military research agency under Ministry of Defence hiring Scientists 'B' (RAC) and CEPTAM technical staff.",
    state: "Central / New Delhi",
    categoryType: "Defence",
    isActive: true,
    jobCount: 8,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-08-11T13:00:00.000Z",
  },
  {
    id: "org-8",
    name: "National Testing Agency",
    shortName: "NTA",
    slug: "national-testing-agency",
    website: "https://nta.ac.in",
    description: "Premier testing agency conducting national eligibility entrance and recruitment examinations.",
    state: "Central / New Delhi",
    categoryType: "Education / Testing",
    isActive: true,
    jobCount: 11,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-08-15T16:00:00.000Z",
  },
  {
    id: "org-9",
    name: "Madhya Pradesh Public Service Commission",
    shortName: "MPPSC",
    slug: "madhya-pradesh-public-service-commission",
    website: "https://mppsc.mp.gov.in",
    description: "State recruitment authority for Madhya Pradesh State Service Exam, State Forest Exam, and Medical Officers.",
    state: "Madhya Pradesh",
    categoryType: "State PSC",
    isActive: true,
    jobCount: 7,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-08-10T10:00:00.000Z",
  },
  {
    id: "org-10",
    name: "Uttar Pradesh Public Service Commission",
    shortName: "UPPSC",
    slug: "uttar-pradesh-public-service-commission",
    website: "https://uppsc.up.nic.in",
    description: "State civil services recruitment body for UP Combined State / Upper Subordinate Services (PCS) & RO/ARO.",
    state: "Uttar Pradesh",
    categoryType: "State PSC",
    isActive: true,
    jobCount: 10,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-08-13T14:00:00.000Z",
  },
  {
    id: "org-11",
    name: "Bihar Public Service Commission",
    shortName: "BPSC",
    slug: "bihar-public-service-commission",
    website: "https://bpsc.bih.nic.in",
    description: "State body conducting Bihar Combined Competitive Examination (CCE), Teacher Recruitment Examination (TRE).",
    state: "Bihar",
    categoryType: "State PSC",
    isActive: true,
    jobCount: 15,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-08-14T09:00:00.000Z",
  },
  {
    id: "org-12",
    name: "Indian Army (Join Indian Army)",
    shortName: "Indian Army",
    slug: "indian-army",
    website: "https://joinindianarmy.nic.in",
    description: "Agniveer General Duty, Technical, Clerk, Nursing Assistant, and Officer Entry recruitment drives.",
    state: "All India",
    categoryType: "Defence",
    isActive: true,
    jobCount: 16,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-08-16T12:00:00.000Z",
  },
];

/**
 * Helper to generate SEO-optimized unique slug
 */
export function generateUniqueSlug(text: string, existingSlugs: string[] = []): string {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!existingSlugs.includes(base)) {
    return base;
  }

  let counter = 2;
  while (existingSlugs.includes(`${base}-${counter}`)) {
    counter++;
  }
  return `${base}-${counter}`;
}

// ----------------------------------------------------
// Category Master Services
// ----------------------------------------------------

export async function getAdminCategories(
  params: CategorySearchParams = {}
): Promise<PaginatedResponse<CategoryMaster>> {
  let results = [...categoriesStore];

  // 1. Text Search
  if (params.query && params.query.trim()) {
    const q = params.query.toLowerCase().trim();
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }

  // 2. Status Filter
  if (params.status && params.status !== "all") {
    const isActive = params.status === "active";
    results = results.filter((c) => c.isActive === isActive);
  }

  // 3. Featured Filter
  if (params.featured && params.featured !== "all") {
    const isFeatured = params.featured === "featured";
    results = results.filter((c) => c.isFeatured === isFeatured);
  }

  // 4. Sorting
  const sortBy = params.sortBy || "latest";
  const isAsc = params.sortOrder === "asc";

  results.sort((a, b) => {
    if (sortBy === "name") {
      return isAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
    if (sortBy === "jobs") {
      return isAsc ? a.jobCount - b.jobCount : b.jobCount - a.jobCount;
    }
    // Default: latest updated
    const timeA = new Date(a.updatedAt).getTime();
    const timeB = new Date(b.updatedAt).getTime();
    return isAsc ? timeA - timeB : timeB - timeA;
  });

  // 5. Pagination
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.limit || 10);
  const total = results.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const offset = (page - 1) * pageSize;
  const items = results.slice(offset, offset + pageSize);

  return { items, total, page, pageSize, totalPages };
}

export async function getCategoryById(id: string): Promise<CategoryMaster | null> {
  const item = categoriesStore.find((c) => c.id === id || c.slug === id);
  return item ? JSON.parse(JSON.stringify(item)) : null;
}

export async function createCategory(
  data: Partial<CategoryMaster>
): Promise<CategoryMaster> {
  const existingSlugs = categoriesStore.map((c) => c.slug);
  const slug = data.slug?.trim() || generateUniqueSlug(data.name || "new-category", existingSlugs);
  const now = new Date().toISOString();

  const newCat: CategoryMaster = {
    id: `cat-${Date.now()}`,
    name: data.name?.trim() || "Untitled Category",
    slug,
    description: data.description?.trim() || "",
    icon: data.icon || "Briefcase",
    isActive: data.isActive !== undefined ? data.isActive : true,
    isFeatured: data.isFeatured !== undefined ? data.isFeatured : false,
    jobCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  categoriesStore.unshift(newCat);
  return newCat;
}

export async function updateCategory(
  id: string,
  updates: Partial<CategoryMaster>
): Promise<CategoryMaster | null> {
  const index = categoriesStore.findIndex((c) => c.id === id);
  if (index === -1) return null;

  const existing = categoriesStore[index];
  const now = new Date().toISOString();

  const updated: CategoryMaster = {
    ...existing,
    ...updates,
    id: existing.id,
    slug: updates.slug?.trim() || existing.slug,
    updatedAt: now,
  };

  categoriesStore[index] = updated;
  return updated;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const index = categoriesStore.findIndex((c) => c.id === id);
  if (index === -1) return false;
  categoriesStore.splice(index, 1);
  return true;
}

export async function toggleCategoryActive(id: string): Promise<CategoryMaster | null> {
  const index = categoriesStore.findIndex((c) => c.id === id);
  if (index === -1) return null;
  categoriesStore[index].isActive = !categoriesStore[index].isActive;
  categoriesStore[index].updatedAt = new Date().toISOString();
  return categoriesStore[index];
}

export async function toggleCategoryFeatured(id: string): Promise<CategoryMaster | null> {
  const index = categoriesStore.findIndex((c) => c.id === id);
  if (index === -1) return null;
  categoriesStore[index].isFeatured = !categoriesStore[index].isFeatured;
  categoriesStore[index].updatedAt = new Date().toISOString();
  return categoriesStore[index];
}

export async function bulkUpdateCategoryStatus(ids: string[], isActive: boolean): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const cat = categoriesStore.find((c) => c.id === id);
    if (cat) {
      cat.isActive = isActive;
      cat.updatedAt = new Date().toISOString();
      count++;
    }
  }
  return count;
}

export async function bulkDeleteCategories(ids: string[]): Promise<number> {
  const initial = categoriesStore.length;
  categoriesStore = categoriesStore.filter((c) => !ids.includes(c.id));
  return initial - categoriesStore.length;
}

// ----------------------------------------------------
// Organization Master Services
// ----------------------------------------------------

export async function getAdminOrganizations(
  params: OrganizationSearchParams = {}
): Promise<PaginatedResponse<OrganizationMaster>> {
  let results = [...organizationsStore];

  // 1. Text Search
  if (params.query && params.query.trim()) {
    const q = params.query.toLowerCase().trim();
    results = results.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.shortName.toLowerCase().includes(q) ||
        o.slug.toLowerCase().includes(q) ||
        o.state.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q)
    );
  }

  // 2. State Filter
  if (params.state && params.state !== "all") {
    results = results.filter((o) => o.state.toLowerCase().includes(params.state!.toLowerCase()));
  }

  // 3. Category Type Filter
  if (params.categoryType && params.categoryType !== "all") {
    results = results.filter((o) => o.categoryType === params.categoryType);
  }

  // 4. Status Filter
  if (params.status && params.status !== "all") {
    const isActive = params.status === "active";
    results = results.filter((o) => o.isActive === isActive);
  }

  // 5. Sorting
  const sortBy = params.sortBy || "latest";
  const isAsc = params.sortOrder === "asc";

  results.sort((a, b) => {
    if (sortBy === "name") {
      return isAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
    if (sortBy === "shortName") {
      return isAsc ? a.shortName.localeCompare(b.shortName) : b.shortName.localeCompare(a.shortName);
    }
    if (sortBy === "jobs") {
      return isAsc ? a.jobCount - b.jobCount : b.jobCount - a.jobCount;
    }
    // Default: latest updated
    const timeA = new Date(a.updatedAt).getTime();
    const timeB = new Date(b.updatedAt).getTime();
    return isAsc ? timeA - timeB : timeB - timeA;
  });

  // 6. Pagination
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.limit || 10);
  const total = results.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const offset = (page - 1) * pageSize;
  const items = results.slice(offset, offset + pageSize);

  return { items, total, page, pageSize, totalPages };
}

export async function getOrganizationById(id: string): Promise<OrganizationMaster | null> {
  const item = organizationsStore.find((o) => o.id === id || o.slug === id);
  return item ? JSON.parse(JSON.stringify(item)) : null;
}

export async function createOrganization(
  data: Partial<OrganizationMaster>
): Promise<OrganizationMaster> {
  const existingSlugs = organizationsStore.map((o) => o.slug);
  const slug = data.slug?.trim() || generateUniqueSlug(data.name || "new-org", existingSlugs);
  const now = new Date().toISOString();

  const newOrg: OrganizationMaster = {
    id: `org-${Date.now()}`,
    name: data.name?.trim() || "Untitled Organization",
    shortName: data.shortName?.trim() || (data.name?.slice(0, 5).toUpperCase() || "ORG"),
    slug,
    website: data.website?.trim() || "https://gov.in",
    description: data.description?.trim() || "",
    state: data.state?.trim() || "Central / New Delhi",
    categoryType: data.categoryType || "Central Commission",
    logoUrl: data.logoUrl,
    isActive: data.isActive !== undefined ? data.isActive : true,
    jobCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  organizationsStore.unshift(newOrg);
  return newOrg;
}

export async function updateOrganization(
  id: string,
  updates: Partial<OrganizationMaster>
): Promise<OrganizationMaster | null> {
  const index = organizationsStore.findIndex((o) => o.id === id);
  if (index === -1) return null;

  const existing = organizationsStore[index];
  const now = new Date().toISOString();

  const updated: OrganizationMaster = {
    ...existing,
    ...updates,
    id: existing.id,
    slug: updates.slug?.trim() || existing.slug,
    updatedAt: now,
  };

  organizationsStore[index] = updated;
  return updated;
}

export async function deleteOrganization(id: string): Promise<boolean> {
  const index = organizationsStore.findIndex((o) => o.id === id);
  if (index === -1) return false;
  organizationsStore.splice(index, 1);
  return true;
}

export async function toggleOrganizationActive(id: string): Promise<OrganizationMaster | null> {
  const index = organizationsStore.findIndex((o) => o.id === id);
  if (index === -1) return null;
  organizationsStore[index].isActive = !organizationsStore[index].isActive;
  organizationsStore[index].updatedAt = new Date().toISOString();
  return organizationsStore[index];
}

export async function bulkUpdateOrganizationStatus(ids: string[], isActive: boolean): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const org = organizationsStore.find((o) => o.id === id);
    if (org) {
      org.isActive = isActive;
      org.updatedAt = new Date().toISOString();
      count++;
    }
  }
  return count;
}

export async function bulkDeleteOrganizations(ids: string[]): Promise<number> {
  const initial = organizationsStore.length;
  organizationsStore = organizationsStore.filter((o) => !ids.includes(o.id));
  return initial - organizationsStore.length;
}
