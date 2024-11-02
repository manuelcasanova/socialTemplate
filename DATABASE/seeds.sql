INSERT INTO roles (role_name) VALUES 
('User'),
('Moderator'),
('Admin'),
('SuperAdmin');

INSERT INTO users (username, email, password, is_verified, role_id, is_selected, is_active, profile_picture, location, last_login) VALUES 
('Manuel_super_admin_user', 'manuel@example.com', 'hashed_password_123', true, 4, true, true, 'admin_pic.jpg', 'Admin City', CURRENT_TIMESTAMP),
('Laura_admin', 'laura@example.com', 'hashed_password_123', true, 3, true, true, 'admin_pic.jpg', 'Admin City', CURRENT_TIMESTAMP),
('Aurora_regular_user', 'aurora@example.com', 'hashed_password_456', true, 1, false, true, 'user_pic.jpg', 'User Town', CURRENT_TIMESTAMP - INTERVAL '1 day'),
('Vanesa_mod_user', 'vanessa@example.com', 'hashed_password_789', true, 2, false, true, 'mod_pic.jpg', 'Moderator City', CURRENT_TIMESTAMP - INTERVAL '2 days');


INSERT INTO login_history (user_id, login_time) VALUES
(1, CURRENT_TIMESTAMP - INTERVAL '10 minutes'),
(1, CURRENT_TIMESTAMP - INTERVAL '1 day'),
(2, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(3, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(3, CURRENT_TIMESTAMP - INTERVAL '5 days');
