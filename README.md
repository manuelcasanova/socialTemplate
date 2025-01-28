*** INTRODUCTION ***

Here’s a template for a full-stack web development project that provides a solid foundation for any application.

It features user login and logout functionality, a database connection for user management, social features for user interaction and messaging, role-based access controls for different subpages, and a basic layout complete with a navigation bar.

It is built using a PostgreSQL database, with ExpressJS and Node.js powering the backend, and ReactJS handling the frontend.

*** FEATURES ***

  *** Roles and Role Administration ***

There are five distinct roles in the system:

SuperAdmin: The highest-level role, with access to all administrative functionalities.
Admin: A role with significant permissions, but limited in terms of managing SuperAdmin roles.
Moderator: A role typically used for managing content or user interactions, but with fewer privileges than Admins.
Subscribed: A role for users who are subscribed (e.g., via a paid option).
NotSubscribed: A role for registered users who have not subscribed.

SuperAdmin permissions:

SuperAdmins can grant or revoke any role, including Admin, Moderator, Subscribed, and NotSubscribed.
SuperAdmins cannot revoke their own SuperAdmin role.
A SuperAdmin can only revoke the SuperAdmin role if they were the one who assigned it. They cannot revoke it if another SuperAdmin granted the role. The only exception is the SuperAdmin with userId 1, ensuring that there is always someone with the authority to make this change.

Admin permissions:

Admins can assign and revoke roles for Moderator, Subscribed, and NotSubscribed users.
Admins cannot assign or revoke the SuperAdmin or Admin roles. Only SuperAdmins can manage Admin roles.

  *** Role Logs ***

Whenever a role is assigned or revoked, a log is created detailing who performed the modification, to whom it was applied, the type of modification (assignment or revocation), and the timestamp. This log is accessible to SuperAdmins in the admin section of the app. Typically, only Admins and SuperAdmins can modify roles, with one exception: when a user subscribes to the app. After the payment is processed, the "User_subscribed" role is automatically added on behalf of the user, and this is recorded in the log accordingly.

 *** Other Logs ***

SuperAdmins have the ability to view the login history for all users. They can filter the history based on user ID, username, email, date, and time.


  *** Protected routes ***

The system includes protected routes, and roles are not hierarchical. This means that:

A user with the Admin role does not automatically have access to routes assigned to lower roles like Moderator or Subscribed.
For access to protected routes associated with these roles, the user must have the specific role assigned to them in addition to their Admin privileges.


*** Registration ***

Users can register by providing a unique username, email, and password. Upon successful registration, the account is created with an "inactive" status, and a verification email is sent to the provided address to activate the account. This helps prevent unauthorized registrations.

Passwords are encrypted before being stored, and the app developers do not have access to the plain text password.

If the user doesn't receive the email, accidentally deletes it, or the activation window expires, they can request a new verification email from the sign-in page.

*** Password Recovery ***

If the user forgets their password, they can easily recover it by requesting a password reset email.

  *** Subscriptions ***

Users may subscribe to gain access to specific routes. The "User_subscribed" role is assigned to all subscribed users and serves to bypass the RequireAuth middleware. However, additional safeguards are in place. A user may temporarily (see "Scheduled Subscription Updates" on this README.md file for details) retain the "User_subscribed" role even if their subscription has expired or become inactive. In such cases, access to these routes is denied through mechanisms outside of RequireAuth.

Administrators also have the authority to revoke a user's subscription status. While revoking an active subscription—especially one a user has paid for—may seem unfair, this capability is necessary to address situations such as policy violations or fraudulent activity. To ensure accountability, all role changes, including subscription revocations, are logged as previously described.

  *** Profile Management ***

Users have the ability to manage their profiles, including:

Modifying their username, email, and password.
Uploading or updating their profile picture.
Deleting their account entirely.

  *** Deleting an account - Soft Deletion (User) ***

Users can delete their accounts, but the process involves a soft deletion. When an account is deleted, its status is set to inactive, the email is modified to inactive-TIMESTAMP-email@email.com and the username is modified to inactive-TIMESTAMP-username. If the user attempts to sign up again with the same email address, they will see a prompt offering two options:

Restore the Previous Account: This will reactivate their old account (including its original ID and all associated records).

Create a New Account: This will create a completely new account with a fresh ID and no connection to the previous records.

Currently, Admins and SuperAdmins cannot delete user accounts. However, they can revoke the "User_subscribed" role, which limits the user’s access to public pages only.

*** Deleting an account – "Hard" Deletion (Anonymized, Not Fully Removed) by Administrator ***

Administrators, including SuperAdmins, may need to perform a hard deletion of an account, either upon request from the user or as part of compliance with privacy laws. In certain jurisdictions, laws may require the app to offer users the ability to delete their accounts.

While we comply with these privacy regulations, we may still need to retain logs for record-keeping and auditing purposes. To ensure compliance, these logs will be anonymized, with personal information such as names and emails replaced with non-identifiable data.

*** Scheduled Subscription Updates ***

To manage user subscriptions, the system automatically checks the status of subscriptions once every 24 hours. If a user's subscription has expired (based on their renewal date), their subscription is marked as inactive. Additionally, the "User_subscribed" role is removed from users whose subscriptions are no longer active. This ensures that only active subscribers retain access to certain features.

*** ENVIRONMENTAL VARIABLES ***

  *** Backend ***

  #PORT
PORT=

#BACKEND URL
REMOTE_CLIENT_APP = http://...

#ALLOWED ORIGINS, FOR CORS
ALLOWED_ORIGINS=http://...

#POSTGRESQL
DB_USER=
DB_HOST=
DB_DATABASE=
DB_PASSWORD=
DB_PORT=

# JWT Secrets 
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

# RESET PASSWORD
RESET_EMAIL_PASSWORD=
RESET_EMAIL_CLIENT=
RESET_EMAIL_PORT=
RESET_EMAIL = 

  *** Frontend ***

# BACKEND URL

REACT_APP_BACKEND_URL=http://...
