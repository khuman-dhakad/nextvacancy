CREATE TABLE audit_logs (
    id varchar(128) PRIMARY KEY NOT NULL,
    actor varchar(255) NOT NULL,
    action varchar(64) NOT NULL,
    entity varchar(64) NOT NULL,
    entity_id varchar(128),
    entity_title text,
    details text,
    metadata jsonb,
    timestamp timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX audit_logs_actor_idx ON audit_logs (actor);
CREATE INDEX audit_logs_entity_idx ON audit_logs (entity);
CREATE INDEX audit_logs_timestamp_idx ON audit_logs (timestamp);

CREATE TABLE categories (
    id varchar(128) PRIMARY KEY NOT NULL,
    name varchar(255) NOT NULL,
    slug varchar(255) NOT NULL UNIQUE,
    description text,
    icon varchar(128),
    is_active boolean NOT NULL DEFAULT true,
    is_featured boolean NOT NULL DEFAULT false,
    job_count integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX categories_is_active_idx ON categories (is_active);
CREATE INDEX categories_is_featured_idx ON categories (is_featured);

CREATE TABLE jobs (
    id varchar(128) PRIMARY KEY NOT NULL,
    slug varchar(255) NOT NULL UNIQUE,
    title text NOT NULL,
    short_summary text NOT NULL,
    organization varchar(255) NOT NULL,
    organization_logo text,
    department varchar(255),
    category varchar(64) NOT NULL,
    status varchar(64) NOT NULL,
    location varchar(255) NOT NULL,
    total_vacancies text NOT NULL,
    salary_or_stipend text NOT NULL,
    job_type varchar(64),
    application_mode varchar(64),
    qualification_summary text NOT NULL,
    qualifications_list jsonb,
    important_dates jsonb NOT NULL,
    fee_structure jsonb,
    age_limit jsonb,
    vacancy_breakdown jsonb,
    selection_process jsonb,
    how_to_apply_steps jsonb,
    required_documents jsonb,
    important_links jsonb NOT NULL,
    faqs jsonb,
    views_count integer NOT NULL DEFAULT 0,
    is_featured boolean NOT NULL DEFAULT false,
    is_trending boolean NOT NULL DEFAULT false,
    is_verified boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX jobs_category_idx ON jobs (category);
CREATE INDEX jobs_status_idx ON jobs (status);
CREATE INDEX jobs_organization_idx ON jobs (organization);
CREATE INDEX jobs_created_at_idx ON jobs (created_at);
CREATE INDEX jobs_is_featured_idx ON jobs (is_featured);
CREATE INDEX jobs_is_trending_idx ON jobs (is_trending);

CREATE TABLE organizations (
    id varchar(128) PRIMARY KEY NOT NULL,
    name varchar(255) NOT NULL,
    short_name varchar(64) NOT NULL,
    slug varchar(255) NOT NULL UNIQUE,
    logo_url text,
    website text,
    description text,
    state varchar(128),
    category_type varchar(128),
    headquarters varchar(255),
    established_year integer,
    verified boolean NOT NULL DEFAULT true,
    tagline text,
    about_details jsonb,
    selection_process jsonb,
    key_departments jsonb,
    faqs jsonb,
    is_active boolean NOT NULL DEFAULT true,
    job_count integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX organizations_short_name_idx ON organizations (short_name);
CREATE INDEX organizations_is_active_idx ON organizations (is_active);

CREATE TABLE users (
    id varchar(128) PRIMARY KEY NOT NULL,
    full_name varchar(255) NOT NULL,
    email varchar(255) NOT NULL UNIQUE,
    mobile varchar(32),
    password_hash varchar(255) NOT NULL,
    role varchar(64) NOT NULL DEFAULT 'CANDIDATE',
    is_email_verified boolean NOT NULL DEFAULT false,
    failed_login_attempts integer NOT NULL DEFAULT 0,
    locked_until timestamp with time zone,
    email_verification_token_hash varchar(128),
    email_verification_token_expires_at timestamp with time zone,
    password_reset_token_hash varchar(128),
    password_reset_token_expires_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX users_role_idx ON users (role);

CREATE TABLE saved_jobs (
    id varchar(128) PRIMARY KEY NOT NULL,
    user_id varchar(128) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id varchar(128) NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    saved_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX saved_jobs_user_id_idx ON saved_jobs (user_id);
CREATE INDEX saved_jobs_job_id_idx ON saved_jobs (job_id);

CREATE TABLE sessions (
    id varchar(128) PRIMARY KEY NOT NULL,
    user_id varchar(128) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash varchar(128) NOT NULL UNIQUE,
    expires_at timestamp with time zone NOT NULL,
    ip_address varchar(64),
    user_agent text,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX sessions_user_id_idx ON sessions (user_id);
CREATE INDEX sessions_expires_at_idx ON sessions (expires_at);
