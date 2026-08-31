import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import {
  ImportantDates,
  FeeStructure,
  AgeLimit,
  VacancyDetail,
  ImportantLink,
  FAQItem,
  OrganizationFaqItem,
} from "@/types";

/* -------------------------------------------------------------------------- */
/*                                CATEGORIES                                  */
/* -------------------------------------------------------------------------- */

export const categories = pgTable(
  "categories",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    icon: varchar("icon", { length: 128 }),
    isActive: boolean("is_active").default(true).notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    jobCount: integer("job_count").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("categories_slug_idx").on(table.slug),
    index("categories_is_active_idx").on(table.isActive),
    index("categories_is_featured_idx").on(table.isFeatured),
  ]
);

/* -------------------------------------------------------------------------- */
/*                              ORGANIZATIONS                                 */
/* -------------------------------------------------------------------------- */

export const organizations = pgTable(
  "organizations",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    shortName: varchar("short_name", { length: 64 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    logoUrl: text("logo_url"),
    website: text("website"),
    description: text("description"),
    state: varchar("state", { length: 128 }),
    categoryType: varchar("category_type", { length: 128 }),
    headquarters: varchar("headquarters", { length: 255 }),
    establishedYear: integer("established_year"),
    verified: boolean("verified").default(true).notNull(),
    tagline: text("tagline"),
    aboutDetails: jsonb("about_details").$type<string[]>(),
    selectionProcess: jsonb("selection_process").$type<string[]>(),
    keyDepartments: jsonb("key_departments").$type<string[]>(),
    faqs: jsonb("faqs").$type<OrganizationFaqItem[]>(),
    isActive: boolean("is_active").default(true).notNull(),
    jobCount: integer("job_count").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("organizations_slug_idx").on(table.slug),
    index("organizations_short_name_idx").on(table.shortName),
    index("organizations_is_active_idx").on(table.isActive),
  ]
);

/* -------------------------------------------------------------------------- */
/*                                   JOBS                                     */
/* -------------------------------------------------------------------------- */

export const jobs = pgTable(
  "jobs",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    title: text("title").notNull(),
    shortSummary: text("short_summary").notNull(),
    organization: varchar("organization", { length: 255 }).notNull(),
    organizationLogo: text("organization_logo"),
    department: varchar("department", { length: 255 }),
    category: varchar("category", { length: 64 }).notNull(),
    status: varchar("status", { length: 64 }).notNull(),
    location: varchar("location", { length: 255 }).notNull(),
    totalVacancies: text("total_vacancies").notNull(),
    salaryOrStipend: text("salary_or_stipend").notNull(),
    jobType: varchar("job_type", { length: 64 }),
    applicationMode: varchar("application_mode", { length: 64 }),
    qualificationSummary: text("qualification_summary").notNull(),
    qualificationsList: jsonb("qualifications_list").$type<string[]>(),
    importantDates: jsonb("important_dates").$type<ImportantDates>().notNull(),
    feeStructure: jsonb("fee_structure").$type<FeeStructure>(),
    ageLimit: jsonb("age_limit").$type<AgeLimit>(),
    vacancyBreakdown: jsonb("vacancy_breakdown").$type<VacancyDetail[]>(),
    selectionProcess: jsonb("selection_process").$type<string[]>(),
    howToApplySteps: jsonb("how_to_apply_steps").$type<string[]>(),
    requiredDocuments: jsonb("required_documents").$type<string[]>(),
    importantLinks: jsonb("important_links").$type<ImportantLink[]>().notNull(),
    faqs: jsonb("faqs").$type<FAQItem[]>(),
    viewsCount: integer("views_count").default(0).notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    isTrending: boolean("is_trending").default(false).notNull(),
    isVerified: boolean("is_verified").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("jobs_slug_idx").on(table.slug),
    index("jobs_category_idx").on(table.category),
    index("jobs_status_idx").on(table.status),
    index("jobs_organization_idx").on(table.organization),
    index("jobs_created_at_idx").on(table.createdAt),
    index("jobs_is_featured_idx").on(table.isFeatured),
    index("jobs_is_trending_idx").on(table.isTrending),
  ]
);

/* -------------------------------------------------------------------------- */
/*                                   USERS                                    */
/* -------------------------------------------------------------------------- */

export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    mobile: varchar("mobile", { length: 32 }),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    role: varchar("role", { length: 64 }).default("CANDIDATE").notNull(),
    isEmailVerified: boolean("is_email_verified").default(false).notNull(),
    failedLoginAttempts: integer("failed_login_attempts").default(0).notNull(),
    lockedUntil: timestamp("locked_until", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("users_email_idx").on(table.email),
    index("users_role_idx").on(table.role),
  ]
);

/* -------------------------------------------------------------------------- */
/*                                SAVED JOBS                                  */
/* -------------------------------------------------------------------------- */

export const savedJobs = pgTable(
  "saved_jobs",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    userId: varchar("user_id", { length: 128 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    jobId: varchar("job_id", { length: 128 })
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    savedAt: timestamp("saved_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("saved_jobs_user_id_idx").on(table.userId),
    index("saved_jobs_job_id_idx").on(table.jobId),
  ]
);

/* -------------------------------------------------------------------------- */
/*                                AUDIT LOGS                                  */
/* -------------------------------------------------------------------------- */

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    actor: varchar("actor", { length: 255 }).notNull(),
    action: varchar("action", { length: 64 }).notNull(),
    entity: varchar("entity", { length: 64 }).notNull(),
    entityId: varchar("entity_id", { length: 128 }),
    entityTitle: text("entity_title"),
    details: text("details"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("audit_logs_actor_idx").on(table.actor),
    index("audit_logs_entity_idx").on(table.entity),
    index("audit_logs_timestamp_idx").on(table.timestamp),
  ]
);

/* -------------------------------------------------------------------------- */
/*                                RELATIONS                                   */
/* -------------------------------------------------------------------------- */

export const usersRelations = relations(users, ({ many }) => ({
  savedJobs: many(savedJobs),
}));

export const savedJobsRelations = relations(savedJobs, ({ one }) => ({
  user: one(users, {
    fields: [savedJobs.userId],
    references: [users.id],
  }),
  job: one(jobs, {
    fields: [savedJobs.jobId],
    references: [jobs.id],
  }),
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type SavedJob = typeof savedJobs.$inferSelect;
export type NewSavedJob = typeof savedJobs.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
