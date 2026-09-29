import { JobCategory, JobPosting, JobStatus } from "@/types";

const JOB_CATEGORIES: readonly JobCategory[] = [
  "government", "private", "admit-card", "result", "answer-key",
  "scholarship", "scheme", "internship", "apprenticeship", "work-from-home",
];
const JOB_STATUSES: readonly JobStatus[] = [
  "OPEN", "ENDING_SOON", "CLOSED", "ADMIT_CARD_OUT", "RESULT_OUT", "ANSWER_KEY_OUT",
];
const MAX_BULK_ITEMS = 100;
const MAX_ARRAY_ITEMS = 100;
const MAX_TEXT_LENGTH = 10_000;
const ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type RecordValue = Record<string, unknown>;

function record(value: unknown, name: string): RecordValue {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${name} must be an object.`);
  return value as RecordValue;
}

function optionalString(value: unknown, name: string, max = MAX_TEXT_LENGTH): void {
  if (value !== undefined && (typeof value !== "string" || value.trim().length > max)) {
    throw new Error(`${name} must be a string of at most ${max} characters.`);
  }
}

function requiredString(value: unknown, name: string, max = MAX_TEXT_LENGTH): void {
  if (typeof value !== "string" || value.trim().length === 0 || value.trim().length > max) {
    throw new Error(`${name} is required and must be at most ${max} characters.`);
  }
}

function optionalBoolean(value: unknown, name: string): void {
  if (value !== undefined && typeof value !== "boolean") throw new Error(`${name} must be a boolean.`);
}

function optionalArray(value: unknown, name: string, max = MAX_ARRAY_ITEMS): void {
  if (value === undefined) return;
  if (!Array.isArray(value) || value.length > max || value.some((item) => typeof item !== "string" || item.length > MAX_TEXT_LENGTH)) {
    throw new Error(`${name} must be an array of at most ${max} strings.`);
  }
}

function validateJobFields(value: unknown, partial: boolean): void {
  const data = record(value, "Job data");
  const required = (name: string, max?: number) => partial ? optionalString(data[name], name, max) : requiredString(data[name], name, max);
  required("title", 255);
  required("shortSummary");
  required("organization", 255);
  required("location", 255);
  required("salaryOrStipend");
  required("qualificationSummary");
  if (data.slug !== undefined && (typeof data.slug !== "string" || !SLUG_PATTERN.test(data.slug))) throw new Error("slug must be a lowercase URL-safe value.");
  if (data.category !== undefined && (typeof data.category !== "string" || !JOB_CATEGORIES.includes(data.category as JobCategory))) throw new Error("category is invalid.");
  if (!partial && !JOB_CATEGORIES.includes(data.category as JobCategory)) throw new Error("category is required and invalid.");
  if (data.status !== undefined && (typeof data.status !== "string" || !JOB_STATUSES.includes(data.status as JobStatus))) throw new Error("status is invalid.");
  if (!partial && !JOB_STATUSES.includes(data.status as JobStatus)) throw new Error("status is required and invalid.");
  for (const field of ["department", "organizationLogo", "jobType", "applicationMode"]) optionalString(data[field], field, 255);
  for (const field of ["qualificationsList", "selectionProcess", "howToApplySteps", "requiredDocuments"]) optionalArray(data[field], field);
  for (const field of ["vacancyBreakdown", "importantLinks", "faqs"]) {
    if (data[field] !== undefined && (!Array.isArray(data[field]) || data[field].length > MAX_ARRAY_ITEMS)) throw new Error(`${field} must contain at most ${MAX_ARRAY_ITEMS} items.`);
  }
  optionalBoolean(data.isFeatured, "isFeatured");
  optionalBoolean(data.isTrending, "isTrending");
  optionalBoolean(data.isVerified, "isVerified");
  if (!partial && (!data.importantDates || typeof data.importantDates !== "object" || Array.isArray(data.importantDates))) throw new Error("importantDates is required.");
  if (!partial && (!Array.isArray(data.importantLinks) || data.importantLinks.length === 0)) throw new Error("importantLinks is required.");
}

export function assertValidId(value: unknown, name = "id"): asserts value is string {
  if (typeof value !== "string" || !ID_PATTERN.test(value)) throw new Error(`${name} is invalid.`);
}

export function assertValidBulkIds(value: unknown, name = "ids"): asserts value is string[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_BULK_ITEMS || value.some((id) => typeof id !== "string" || !ID_PATTERN.test(id))) {
    throw new Error(`${name} must contain 1-${MAX_BULK_ITEMS} valid IDs.`);
  }
}

export function assertValidJobCreate(value: unknown): asserts value is Partial<JobPosting> { validateJobFields(value, false); }
export function assertValidJobUpdate(value: unknown): asserts value is Partial<JobPosting> {
  const data = record(value, "Job updates");
  if (Object.keys(data).length === 0) throw new Error("At least one job field is required.");
  validateJobFields(data, true);
}

export function assertValidJobStatus(value: unknown): asserts value is JobStatus {
  if (typeof value !== "string" || !JOB_STATUSES.includes(value as JobStatus)) throw new Error("status is invalid.");
}

function validateMasterData(value: unknown, kind: "category" | "organization", partial: boolean): void {
  const data = record(value, `${kind} data`);
  const required = (name: string, max = 255) => partial ? optionalString(data[name], name, max) : requiredString(data[name], name, max);
  required("name");
  if (kind === "organization") required("shortName", 64);
  if (data.slug !== undefined && (typeof data.slug !== "string" || !SLUG_PATTERN.test(data.slug))) throw new Error("slug must be a lowercase URL-safe value.");
  for (const field of kind === "category" ? ["description", "icon"] : ["logoUrl", "website", "description", "state", "categoryType"]) optionalString(data[field], field);
  optionalBoolean(data.isActive, "isActive");
  optionalBoolean(data.isFeatured, "isFeatured");
}

export function assertValidCategoryCreate(value: unknown): asserts value is Partial<import("@/types").CategoryMaster> { validateMasterData(value, "category", false); }
export function assertValidCategoryUpdate(value: unknown): asserts value is Partial<import("@/types").CategoryMaster> { validateMasterData(value, "category", true); }
export function assertValidOrganizationCreate(value: unknown): asserts value is Partial<import("@/types").OrganizationMaster> { validateMasterData(value, "organization", false); }
export function assertValidOrganizationUpdate(value: unknown): asserts value is Partial<import("@/types").OrganizationMaster> { validateMasterData(value, "organization", true); }

export function assertValidBoolean(value: unknown, name: string): asserts value is boolean {
  if (typeof value !== "boolean") throw new Error(`${name} must be a boolean.`);
}