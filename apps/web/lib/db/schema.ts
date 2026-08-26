import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
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
} from "@/types";

export const userRoleEnum = pgEnum("user_role", [
  "CANDIDATE",
  "ADMIN",
  "MODERATOR",
]);

export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    mobile: varchar("mobile", { length: 32 }),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    role: userRoleEnum("role").default("CANDIDATE").notNull(),
    isEmailVerified: boolean("is_email_verified").default(false).notNull(),
    failedLoginAttempts: integer("failed_login_attempts").default(0).notNull(),
    lockedUntil: timestamp("locked_until", { withTimezone: true }),
    emailVerificationTokenHash: varchar("email_verification_token_hash", { length: 255 }),
    emailVerificationTokenExpiresAt: timestamp("email_verification_token_expires_at", { withTimezone: true }),
    passwordResetTokenHash: varchar("password_reset_token_hash", { length: 255 }),
    passwordResetTokenExpiresAt: timestamp("password_reset_token_expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("users_email_idx").on(table.email),
    index("users_role_idx").on(table.role),
  ]
);

export const sessions = pgTable(
  "sessions",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    userId: varchar("user_id", { length: 128 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: varchar("token_hash", { length: 255 }).notNull().unique(),
    ipAddress: varchar("ip_address", { length: 64 }),
    userAgent: text("user_agent"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("sessions_token_hash_idx").on(table.tokenHash),
    index("sessions_user_id_idx").on(table.userId),
    index("sessions_expires_at_idx").on(table.expiresAt),
  ]
);

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
    index("jobs_created_at_idx").on(table.createdAt),
    index("jobs_is_featured_idx").on(table.isFeatured),
    index("jobs_is_trending_idx").on(table.isTrending),
  ]
);

export const organizations = pgTable(
  "organizations",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    shortName: varchar("short_name", { length: 64 }),
    categoryType: varchar("category_type", { length: 128 }),
    headquarters: varchar("headquarters", { length: 255 }),
    establishedYear: integer("established_year"),
    state: varchar("state", { length: 128 }),
    website: text("website"),
    verified: boolean("verified").default(true).notNull(),
    tagline: text("tagline"),
    description: text("description"),
    aboutDetails: jsonb("about_details").$type<string[]>(),
    selectionProcess: jsonb("selection_process").$type<string[]>(),
    keyDepartments: jsonb("key_departments").$type<string[]>(),
    faqs: jsonb("faqs").$type<FAQItem[]>(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("organizations_slug_idx").on(table.slug),
    index("organizations_name_idx").on(table.name),
  ]
);

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

export const notifications = pgTable(
  "notifications",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    userId: varchar("user_id", { length: 128 }).references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    organization: varchar("organization", { length: 255 }),
    category: varchar("category", { length: 64 }).notNull(),
    tag: varchar("tag", { length: 64 }),
    actionUrl: text("action_url").notNull(),
    actionLabel: varchar("action_label", { length: 128 }).notNull(),
    urgency: varchar("urgency", { length: 32 }).default("NORMAL").notNull(),
    isRead: boolean("is_read").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("notifications_user_id_idx").on(table.userId),
    index("notifications_is_read_idx").on(table.isRead),
    index("notifications_created_at_idx").on(table.createdAt),
  ]
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    actor: varchar("actor", { length: 255 }).notNull(),
    action: varchar("action", { length: 64 }).notNull(),
    entity: varchar("entity", { length: 64 }).notNull(),
    entityId: varchar("entity_id", { length: 128 }),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("audit_logs_actor_idx").on(table.actor),
    index("audit_logs_entity_idx").on(table.entity),
    index("audit_logs_timestamp_idx").on(table.timestamp),
  ]
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  savedJobs: many(savedJobs),
  notifications: many(notifications),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
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

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
export type SavedJob = typeof savedJobs.$inferSelect;
export type NewSavedJob = typeof savedJobs.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
