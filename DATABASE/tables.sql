DROP TABLE IF EXISTS login_history CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

CREATE TABLE roles (
  role_id SERIAL PRIMARY KEY NOT NULL,
  role_name VARCHAR(50) UNIQUE NOT NULL  -- e.g., 'Admin', 'User', 'Moderator'
);

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY NOT NULL,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  password_reset_token VARCHAR(255),  -- for password reset functionality
  password_reset_expires TIMESTAMP,    -- when the reset token expires
  is_verified BOOLEAN DEFAULT false,  -- for email/phone verification
  role_id INT REFERENCES roles(role_id) ON DELETE RESTRICT,  -- Prevent deleting roles if users reference them
  is_selected BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  refresh_token VARCHAR(255),
  profile_picture VARCHAR(255),
  location VARCHAR(255),
  last_login TIMESTAMP
);

CREATE TABLE login_history (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,  -- Remove login history when user is deleted
  login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
