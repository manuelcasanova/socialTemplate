
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS login_history CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;

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

CREATE TABLE login_history (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,  -- Remove login history when user is deleted
  login_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP  -- Store UTC time with timezone support
);

CREATE TABLE user_roles (
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  role_id INT REFERENCES roles(role_id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);