DROP TABLE IF EXISTS posts_reactions CASCADE;
DROP TABLE IF EXISTS posts_comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS user_messages CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS role_change_logs CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS login_history CASCADE;
DROP TABLE IF EXISTS muted CASCADE;
DROP TABLE IF EXISTS followers CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;



CREATE TABLE roles (
  role_id SERIAL PRIMARY KEY NOT NULL,
  role_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY NOT NULL,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  password_reset_token VARCHAR(255),  -- for password reset functionality
  password_reset_expires TIMESTAMPTZ,  -- when the reset token expires, use TIMESTAMPTZ to store in UTC
  is_verified BOOLEAN DEFAULT false,  -- for email/phone verification
  is_selected BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  refresh_token VARCHAR(255),
  profile_picture VARCHAR(255),
  location VARCHAR(255)
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

CREATE TABLE role_change_logs (
    id SERIAL PRIMARY KEY,
    user_that_modified INT, 
    user_modified INT,       -- ID of the user whose role was changed
    role VARCHAR(255) NOT NULL,       -- Role that was changed
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,  -- Timestamp of the action
    FOREIGN KEY (user_that_modified) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (user_modified) REFERENCES users(user_id) ON DELETE SET NULL,
    action_type VARCHAR(20) CHECK (action_type IN ('assigned', 'unassigned')) NOT NULL
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
    content TEXT,
    date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'read', 'deleted')),
    is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    sender INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    visibility VARCHAR(20) NOT NULL CHECK (visibility IN ('public', 'followers', 'private')),
    is_deleted BOOLEAN DEFAULT false,
    UNIQUE(id, sender)
);

CREATE TABLE posts_reactions (
    message_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) NOT NULL,  -- e.g. 'like', 'love', 'laugh', etc.
    reacted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (message_id, user_id)
);

CREATE TABLE posts_comments (
    id SERIAL PRIMARY KEY,
    message_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    commenter INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT false
);

