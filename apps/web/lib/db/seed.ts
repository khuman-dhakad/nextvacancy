import { db, jobs, categories, organizations, pool } from "./index";
import { MOCK_JOB_POSTINGS } from "../../services/jobs/jobs.mock";
import { MOCK_ORGANIZATION_PROFILES } from "../../services/organization/organization-profile.service";

const INITIAL_CATEGORIES = [
  {
    id: "cat-1",
    name: "Government Jobs",
    slug: "government",
    description: "Central, State, PSU, and Autonomous bodies public sector recruitment circulars.",
    icon: "Building2",
    isActive: true,
    isFeatured: true,
  },
  {
    id: "cat-2",
    name: "Private & IT Jobs",
    slug: "private",
    description: "Verified corporate vacancies across software engineering, analytics, fintech, and operations.",
    icon: "TrendingUp",
    isActive: true,
    isFeatured: true,
  },
  {
    id: "cat-3",
    name: "Admit Cards & Hall Tickets",
    slug: "admit-card",
    description: "Download official commission call letters, exam city intimations, and hall tickets.",
    icon: "FileCheck",
    isActive: true,
    isFeatured: true,
  },
  {
    id: "cat-4",
    name: "Exam Results & Merit Lists",
    slug: "result",
    description: "Check final selection scorecards, cut-off marks, and provisional merit rankings.",
    icon: "Award",
    isActive: true,
    isFeatured: true,
  },
  {
    id: "cat-5",
    name: "Official Answer Keys",
    slug: "answer-key",
    description: "Provisional and final answer key PDFs with objection raising window trackers.",
    icon: "Key",
    isActive: true,
    isFeatured: true,
  },
  {
    id: "cat-6",
    name: "National Scholarships",
    slug: "scholarship",
    description: "Ministry-sponsored higher education grants, post-matric fellowships, and merit assistance programs.",
    icon: "GraduationCap",
    isActive: true,
    isFeatured: true,
  },
  {
    id: "cat-7",
    name: "Internships & Apprenticeships",
    slug: "internship",
    description: "Prime Minister Internship Scheme, NATS, and PSU trade apprenticeship circulars for freshers.",
    icon: "Sparkles",
    isActive: true,
    isFeatured: false,
  },
  {
    id: "cat-8",
    name: "Trade Apprenticeships",
    slug: "apprenticeship",
    description: "ITI and Diploma trade apprenticeships across Indian Railways, DRDO, ISRO, and PSUs.",
    icon: "Users",
    isActive: true,
    isFeatured: false,
  },
];

export async function seedDatabase() {
  console.log("🌱 Starting NEXTVACANCY database seed...");

  try {
    // 1. Seed Categories
    console.log("Inserting categories...");
    for (const cat of INITIAL_CATEGORIES) {
      await db
        .insert(categories)
        .values({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          icon: cat.icon,
          isActive: cat.isActive,
          isFeatured: cat.isFeatured,
          jobCount: 0,
        })
        .onConflictDoNothing({ target: categories.slug });
    }

    // 2. Seed Organizations
    console.log("Inserting organizations...");
    for (const org of MOCK_ORGANIZATION_PROFILES) {
      await db
        .insert(organizations)
        .values({
          id: org.id,
          name: org.name,
          shortName: org.shortName,
          slug: org.slug,
          logoUrl: org.logoUrl || null,
          website: org.website,
          description: org.description,
          state: org.state,
          categoryType: org.categoryType,
          headquarters: org.headquarters,
          establishedYear: org.establishedYear,
          verified: org.verified,
          tagline: org.tagline,
          aboutDetails: org.aboutDetails,
          selectionProcess: org.selectionProcess,
          keyDepartments: org.keyDepartments,
          faqs: org.faqs,
          isActive: true,
          jobCount: 0,
        })
        .onConflictDoNothing({ target: organizations.slug });
    }

    // 3. Seed Jobs
    console.log("Inserting recruitment job postings...");
    for (const job of MOCK_JOB_POSTINGS) {
      await db
        .insert(jobs)
        .values({
          id: job.id,
          slug: job.slug,
          title: job.title,
          shortSummary: job.shortSummary,
          organization: job.organization,
          organizationLogo: job.organizationLogo || null,
          department: job.department || null,
          category: job.category,
          status: job.status,
          location: job.location,
          totalVacancies: String(job.totalVacancies),
          salaryOrStipend: job.salaryOrStipend,
          jobType: job.jobType || "Full Time",
          applicationMode: job.applicationMode || "Online",
          qualificationSummary: job.qualificationSummary,
          qualificationsList: job.qualificationsList || [],
          importantDates: job.importantDates,
          feeStructure: job.feeStructure || null,
          ageLimit: job.ageLimit || null,
          vacancyBreakdown: job.vacancyBreakdown || [],
          selectionProcess: job.selectionProcess || [],
          howToApplySteps: job.howToApplySteps || [],
          requiredDocuments: job.requiredDocuments || [],
          importantLinks: job.importantLinks,
          faqs: job.faqs || [],
          viewsCount: job.viewsCount || 0,
          isFeatured: Boolean(job.isFeatured),
          isTrending: Boolean(job.isTrending),
          isVerified: Boolean(job.isVerified ?? true),
          createdAt: new Date(job.createdAt),
          updatedAt: new Date(job.updatedAt),
        })
        .onConflictDoNothing({ target: jobs.slug });
    }

    console.log("✅ NEXTVACANCY database seeded successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Allow direct CLI execution: `npx tsx lib/db/seed.ts`
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
