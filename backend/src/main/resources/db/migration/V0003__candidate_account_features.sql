CREATE TABLE candidate_profiles (
    id varchar(128) PRIMARY KEY,
    user_id varchar(128) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    avatar_url varchar(1024),
    preferred_state varchar(255),
    preferred_category varchar(255),
    qualification varchar(255),
    profile_visible boolean NOT NULL DEFAULT true,
    show_mobile boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE candidate_notification_preferences (
    id varchar(128) PRIMARY KEY,
    user_id varchar(128) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category varchar(64) NOT NULL,
    label varchar(255) NOT NULL,
    email_enabled boolean NOT NULL DEFAULT false,
    whatsapp_enabled boolean NOT NULL DEFAULT false,
    push_enabled boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (user_id, category)
);

CREATE TABLE candidate_notifications (
    id varchar(128) PRIMARY KEY,
    user_id varchar(128) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category varchar(64) NOT NULL,
    title varchar(255) NOT NULL,
    message text NOT NULL,
    link_url varchar(1024),
    is_read boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    read_at timestamp with time zone
);

CREATE INDEX candidate_profiles_user_id_idx ON candidate_profiles (user_id);
CREATE INDEX candidate_notification_preferences_user_id_idx ON candidate_notification_preferences (user_id);
CREATE INDEX candidate_notifications_user_id_idx ON candidate_notifications (user_id);
CREATE INDEX candidate_notifications_created_at_idx ON candidate_notifications (created_at DESC);
