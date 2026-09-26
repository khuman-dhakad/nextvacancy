import {
  assertValidBulkIds,
  assertValidCategoryCreate,
  assertValidJobCreate,
  assertValidJobStatus,
  assertValidOrganizationCreate,
} from "../lib/validations/admin";

function expectFailure(label: string, callback: () => void) {
  try {
    callback();
  } catch {
    return;
  }
  throw new Error(`${label} was accepted`);
}

const validJob = {
  title: "Test vacancy",
  shortSummary: "A valid test vacancy",
  organization: "Test Organization",
  location: "All India",
  salaryOrStipend: "As per rules",
  qualificationSummary: "Graduation",
  category: "government" as const,
  status: "OPEN" as const,
  importantDates: {},
  importantLinks: [{ label: "Official site", url: "https://example.com", linkType: "official_website" as const }],
};

assertValidJobCreate(validJob);
assertValidCategoryCreate({ name: "Test category", slug: "test-category" });
assertValidOrganizationCreate({ name: "Test organization", shortName: "TEST", slug: "test-organization" });
assertValidJobStatus("OPEN");
assertValidBulkIds(["job-test-1", "job-test-2"]);

expectFailure("empty job title", () => assertValidJobCreate({ ...validJob, title: "" }));
expectFailure("invalid job status", () => assertValidJobStatus("DROP TABLE"));
expectFailure("malicious slug", () => assertValidCategoryCreate({ name: "Bad", slug: "<script>alert(1)</script>" }));
expectFailure("oversized bulk request", () => assertValidBulkIds(Array.from({ length: 101 }, (_, index) => `job-${index}`)));
expectFailure("missing organization short name", () => assertValidOrganizationCreate({ name: "Missing short name", slug: "missing-short-name" }));

console.log("Admin validation tests passed.");