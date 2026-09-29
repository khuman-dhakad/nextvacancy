ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email_verification_token_hash" varchar(128);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email_verification_token_expires_at" timestamp with time zone;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password_reset_token_hash" varchar(128);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password_reset_token_expires_at" timestamp with time zone;

CREATE TABLE IF NOT EXISTS "sessions" (
  "id" varchar(128) PRIMARY KEY NOT NULL,
  "user_id" varchar(128) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "token_hash" varchar(128) NOT NULL UNIQUE,
  "expires_at" timestamp with time zone NOT NULL,
  "ip_address" varchar(64),
  "user_agent" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "sessions_token_hash_idx" ON "sessions" USING btree ("token_hash");
CREATE INDEX IF NOT EXISTS "sessions_user_id_idx" ON "sessions" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "sessions_expires_at_idx" ON "sessions" USING btree ("expires_at");