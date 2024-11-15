// import React, { useState } from 'react';

// // Predefined users
// const testUsers = [
//   { name: 'User', email: 'user_not_subscribed@example.com', password: 'Password1!' },
//   { name: 'Subscribed', email: 'user_subscribed@example.com', password: 'Password1!' },
//   { name: 'Moderator', email: 'moderator@example.com', password: 'Password1!' },
//   { name: 'Admin', email: 'admin@example.com', password: 'Password1!' },
//   { name: 'Superadmin', email: 'superadmin@example.com', password: 'Password1!' },
// ];

// export default function MockSignIn({ onUserSelect }) {
//   const [selectedUser, setSelectedUser] = useState(null); // Store the selected user

//   const handleCheckboxChange = (user) => {
//     setSelectedUser(user);
//     if (onUserSelect) {
//       onUserSelect(user.email, user.password); // Pass email and password to the parent component
//     }
//   };

//   return (
//     <div className="mock-sign-in">
//       {/* Checkboxes to select a user */}
//       <div>
//         {testUsers.map((user, index) => (
//           <div key={index}>
//             <label>
//               <input
//                 type="checkbox"
//                 checked={selectedUser?.email === user.email}
//                 onChange={() => handleCheckboxChange(user)}
//               />
//               {user.name}
//             </label>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
