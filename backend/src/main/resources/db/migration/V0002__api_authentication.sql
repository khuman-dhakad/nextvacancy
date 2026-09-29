CREATE TABLE api_sessions (
    id varchar(128) PRIMARY KEY,
    principal_id varchar(128) NOT NULL,
    role varchar(64) NOT NULL,
    refresh_token_hash varchar(128) NOT NULL UNIQUE,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    revoked_at timestamp with time zone
);

CREATE INDEX api_sessions_principal_id_idx ON api_sessions (principal_id);
CREATE INDEX api_sessions_expires_at_idx ON api_sessions (expires_at);

CREATE TABLE auth_rate_limits (
    key_hash varchar(64) PRIMARY KEY,
    window_started_at timestamp with time zone NOT NULL,
    attempts integer NOT NULL CHECK (attempts >= 1)
);

CREATE INDEX auth_rate_limits_window_idx ON auth_rate_limits (window_started_at);
