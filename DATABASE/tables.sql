DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS followers CASCADE;
DROP TABLE IF EXISTS muted CASCADE;
DROP TABLE IF EXISTS login_history CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS role_admin_logs CASCADE;
DROP TABLE IF EXISTS role_change_logs CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS user_messages CASCADE;

DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS posts_reactions CASCADE;
DROP TABLE IF EXISTS posts_comments CASCADE;
DROP TABLE IF EXISTS posts_comments_reactions;

DROP TABLE IF EXISTS post_reports CASCADE;
DROP TABLE IF EXISTS post_report_history CASCADE;

DROP TABLE IF EXISTS post_comments_reports CASCADE;
DROP TABLE IF EXISTS post_comment_report_history;

DROP TABLE IF EXISTS global_provider_settings;
DROP TABLE IF EXISTS admin_settings;


CREATE TABLE users (
  user_id SERIAL PRIMARY KEY NOT NULL,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  password_reset_token VARCHAR(255),  -- for password reset functionality
  password_reset_expires TIMESTAMPTZ,  -- when the reset token expires, use TIMESTAMPTZ to store in UTC
  is_verified BOOLEAN DEFAULT false,  -- for email/phone verification
  is_active BOOLEAN DEFAULT true,
  refresh_token VARCHAR(255),
  profile_picture VARCHAR(255),
  location VARCHAR(255),
  language VARCHAR(10) DEFAULT 'en'
);

CREATE TABLE roles (
  role_id SERIAL PRIMARY KEY NOT NULL,
  role_name VARCHAR(25) UNIQUE NOT NULL,
  is_system_role BOOLEAN DEFAULT TRUE,
  created_by INTEGER REFERENCES users(user_id) ON DELETE SET NULL
); 

CREATE TABLE followers (
  follower_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  followee_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  status VARCHAR(20),
  lastmodification TIMESTAMPTZ,
  newrequest boolean DEFAULT false,
  PRIMARY KEY (follower_id, followee_id),
  CHECK (follower_id <> followee_id) -- Users cannot follow themselves
);

CREATE TABLE muted (
  muter INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  mutee INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  mute boolean DEFAULT false,
  PRIMARY KEY (muter, mutee),
  CHECK (muter <> mutee) -- Users cannot mute themselves
);

CREATE TABLE login_history (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  login_time TIMESTAMPTZ
);

CREATE TABLE user_roles (
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  role_id INT REFERENCES roles(role_id) ON DELETE CASCADE,
  assigned_by_user_id INT,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_assigned_by_user FOREIGN KEY (assigned_by_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE role_admin_logs (
  id SERIAL PRIMARY KEY,
  role_id INTEGER,
  old_role_id INTEGER,
  old_role_name VARCHAR(25),
  new_role_name VARCHAR(25),
  action_type VARCHAR(10) CHECK (action_type IN ('created', 'updated', 'deleted')) NOT NULL,
  performed_by INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
  timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE SET NULL
);

CREATE TABLE role_change_logs (
    id SERIAL PRIMARY KEY,
    user_that_modified INT, 
    user_modified INT,       -- ID of the user whose role was changed
    role VARCHAR(255) NOT NULL,       -- Role that was changed
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,  -- Timestamp of the action
    FOREIGN KEY (user_that_modified) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (user_modified) REFERENCES users(user_id) ON DELETE SET NULL,
    action_type VARCHAR(20) CHECK (action_type IN ('assigned', 'unassigned', 'transferred')) NOT NULL
);

CREATE TABLE subscriptions (
  subscription_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  start_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, 
  renewal_due_date TIMESTAMPTZ NOT NULL,           
  is_active BOOLEAN DEFAULT true,                  
  created_by_user_id INT,                        
  FOREIGN KEY (created_by_user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE user_messages (
    id SERIAL PRIMARY KEY,
    sender INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    receiver INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    content VARCHAR(5000),
    date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'read', 'deleted')),
    is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    sender INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    content VARCHAR(5000) NOT NULL,
    date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    visibility VARCHAR(20) NOT NULL CHECK (visibility IN ('public', 'followers', 'private')),
    is_deleted BOOLEAN DEFAULT false,
    UNIQUE(id, sender)
);

CREATE TABLE posts_reactions (
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) NOT NULL,  -- e.g. 'like', 'love', 'laugh', etc.
    date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, user_id)
);

CREATE TABLE posts_comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    commenter INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    content VARCHAR(5000) NOT NULL,
    date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE post_comments_reports (
    id SERIAL PRIMARY KEY,
    comment_id INTEGER UNIQUE REFERENCES posts_comments(id) ON DELETE CASCADE,
    reported_by INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    reported_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'Reported' CHECK (status IN ('Reported', 'Inappropriate', 'Ok')),
    reason TEXT
);


CREATE TABLE posts_comments_reactions (
    comment_id INTEGER REFERENCES posts_comments(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) NOT NULL,  -- e.g. 'like', 'laugh', 'angry', etc.
    date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (comment_id, user_id)
);

CREATE TABLE post_reports (
    id SERIAL PRIMARY KEY,
    post_id INTEGER UNIQUE REFERENCES posts(id) ON DELETE CASCADE,
    reported_by INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    reported_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'Reported' CHECK (status IN ('Reported', 'Inappropriate', 'Ok')),
    reason TEXT
);

CREATE TABLE post_report_history (
    id SERIAL PRIMARY KEY,
    report_id INTEGER REFERENCES post_reports(id) ON DELETE CASCADE,
    changed_by INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    changed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    new_status VARCHAR(20) CHECK (new_status IN ('Reported', 'Inappropriate', 'Ok')),
    note TEXT
);

CREATE TABLE post_comment_report_history (
    id SERIAL PRIMARY KEY,
    report_id INTEGER REFERENCES post_comments_reports(id) ON DELETE CASCADE,
    changed_by INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    changed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    new_status VARCHAR(20) CHECK (new_status IN ('Reported', 'Inappropriate', 'Ok')),
    note TEXT
);

CREATE TABLE global_provider_settings (
  id SERIAL PRIMARY KEY,
  show_posts_feature BOOLEAN NOT NULL DEFAULT TRUE,
  
  allow_user_post BOOLEAN NOT NULL DEFAULT TRUE,
  allow_admin_post BOOLEAN NOT NULL DEFAULT TRUE,
  
  allow_post_interactions BOOLEAN NOT NULL DEFAULT TRUE,
  allow_comments BOOLEAN NOT NULL DEFAULT TRUE,
  allow_post_reactions BOOLEAN NOT NULL DEFAULT TRUE,
  allow_comment_reactions BOOLEAN NOT NULL DEFAULT TRUE,
  allow_delete_posts BOOLEAN NOT NULL DEFAULT TRUE,
  allow_flag_posts BOOLEAN NOT NULL DEFAULT TRUE,
  allow_delete_comments BOOLEAN NOT NULL DEFAULT TRUE,
  allow_flag_comments BOOLEAN NOT NULL DEFAULT TRUE,

  show_messages_feature BOOLEAN NOT NULL DEFAULT TRUE,
  allow_send_messages BOOLEAN NOT NULL DEFAULT TRUE,
  allow_delete_messages BOOLEAN NOT NULL DEFAULT TRUE,

  show_social_feature BOOLEAN NOT NULL DEFAULT TRUE,
  allow_follow BOOLEAN NOT NULL DEFAULT TRUE,
  allow_mute BOOLEAN NOT NULL DEFAULT TRUE,

  allow_manage_roles BOOLEAN NOT NULL DEFAULT TRUE,
  allow_delete_users BOOLEAN NOT NULL DEFAULT TRUE,

  show_profile_feature BOOLEAN NOT NULL DEFAULT TRUE,
  allow_edit_username BOOLEAN NOT NULL DEFAULT TRUE,
  allow_edit_email BOOLEAN NOT NULL DEFAULT TRUE,
  allow_edit_password BOOLEAN NOT NULL DEFAULT TRUE,
  allow_delete_my_user BOOLEAN NOT NULL DEFAULT TRUE,
  allow_modify_profile_picture BOOLEAN NOT NULL DEFAULT TRUE,

  show_subscriber_feature BOOLEAN NOT NULL DEFAULT TRUE,

  show_manage_roles_feature BOOLEAN NOT NULL DEFAULT TRUE,
  allow_admin_create_custom_role BOOLEAN NOT NULL DEFAULT TRUE,
  allow_admin_edit_custom_role BOOLEAN NOT NULL DEFAULT TRUE,
  allow_admin_delete_custom_role BOOLEAN NOT NULL DEFAULT TRUE

);

CREATE TABLE admin_settings (
  id SERIAL PRIMARY KEY,
  show_posts_feature BOOLEAN NOT NULL DEFAULT TRUE,
  
  allow_user_post BOOLEAN NOT NULL DEFAULT TRUE,
  allow_admin_post BOOLEAN NOT NULL DEFAULT TRUE,
  
  allow_post_interactions BOOLEAN NOT NULL DEFAULT TRUE,
  allow_comments BOOLEAN NOT NULL DEFAULT TRUE,
  allow_post_reactions BOOLEAN NOT NULL DEFAULT TRUE,
  allow_comment_reactions BOOLEAN NOT NULL DEFAULT TRUE,
  allow_delete_posts BOOLEAN NOT NULL DEFAULT TRUE,
  allow_flag_posts BOOLEAN NOT NULL DEFAULT TRUE,
  allow_delete_comments BOOLEAN NOT NULL DEFAULT TRUE,
  allow_flag_comments BOOLEAN NOT NULL DEFAULT TRUE,

  show_messages_feature BOOLEAN NOT NULL DEFAULT TRUE,
  allow_send_messages BOOLEAN NOT NULL DEFAULT TRUE,
  allow_delete_messages BOOLEAN NOT NULL DEFAULT TRUE,

  show_social_feature BOOLEAN NOT NULL DEFAULT TRUE,
  allow_follow BOOLEAN NOT NULL DEFAULT TRUE,
  allow_mute BOOLEAN NOT NULL DEFAULT TRUE,

  show_profile_feature BOOLEAN NOT NULL DEFAULT TRUE,
  allow_edit_username BOOLEAN NOT NULL DEFAULT TRUE,
  allow_edit_email BOOLEAN NOT NULL DEFAULT TRUE,
  allow_edit_password BOOLEAN NOT NULL DEFAULT TRUE,
  allow_delete_my_user BOOLEAN NOT NULL DEFAULT TRUE,
  allow_modify_profile_picture BOOLEAN NOT NULL DEFAULT TRUE

);



-- =======================
-- Grants to udokm633_manuelcasanova
-- =======================

-- Allow connecting to the database
GRANT CONNECT ON DATABASE udokm633_fullstack_social_template_database TO udokm633_manuelcasanova;

-- Allow usage of the public schema
GRANT USAGE ON SCHEMA public TO udokm633_manuelcasanova;

-- Grant all privileges on all existing tables with grant option
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO udokm633_manuelcasanova WITH GRANT OPTION;

-- Ensure all new tables in the schema grant all privileges by default with grant option
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL PRIVILEGES ON TABLES TO udokm633_manuelcasanova WITH GRANT OPTION;

-- Grant all privileges on all existing sequences
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO udokm633_manuelcasanova;

-- Ensure all new sequences grant all privileges by default
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL PRIVILEGES ON SEQUENCES TO udokm633_manuelcasanova;


-- =======================
-- Grants to udokm633
-- =======================

-- Allow connecting to the database
GRANT CONNECT ON DATABASE udokm633_fullstack_social_template_database TO udokm633;

-- Allow usage of the public schema
GRANT USAGE ON SCHEMA public TO udokm633;

-- Grant all privileges on all existing tables with grant option
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO udokm633 WITH GRANT OPTION;

-- Ensure all new tables in the schema grant all privileges by default with grant option
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL PRIVILEGES ON TABLES TO udokm633 WITH GRANT OPTION;

-- Grant all privileges on all existing sequences
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO udokm633;

-- Ensure all new sequences grant all privileges by default
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL PRIVILEGES ON SEQUENCES TO udokm633;

