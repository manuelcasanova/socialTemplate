-- Insert roles with hierarchical structure
INSERT INTO roles (role_name) VALUES 
  ('User_not_subscribed'),    
  ('User_subscribed'),           
  ('Moderator'),                 
  ('Admin'),                     
  ('SuperAdmin');               


INSERT INTO users (username, email, password, is_verified, is_selected, is_active, profile_picture, location) VALUES 
  ('Superadministrator', 'superadmin@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, true, true, 'admin_pic.jpg', 'Super Admin City')
;

INSERT INTO user_roles (user_id, role_id, assigned_by_user_id) VALUES
  (1, 1, 1),
  (1, 5, 1);  


-- For testing expired subscription:

-- INSERT INTO subscriptions (user_id, start_date, renewal_due_date, is_active, created_by_user_id) 
-- VALUES 
-- (4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '2 seconds', true, 4);




