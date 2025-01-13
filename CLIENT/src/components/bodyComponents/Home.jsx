import React, { useState } from 'react';import { Link } from 'react-router-dom';
import '../../css/centeredContainer.css';

export default function Home({ isNavOpen }) {


  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>

      <div className="centered-container">
        <h2>Welcome to the public page</h2>

        <p>This template provides a solid foundation for any full-stack web development project:</p>

        <ul>
          <li><strong>Secure login/logout functionality</strong> — Protect access with user authentication.</li>
          <li><strong>User management with a database</strong> — Handle user data and roles with PostgreSQL.</li>
          <li><strong>Role-based access control</strong> — Control access for different users across the app.</li>
          <li><strong>Responsive layout with a navigation bar</strong> — A clean, mobile-friendly interface powered by ReactJS.</li>
        </ul>

        <p>Technologies used:</p>
        <ul>
          <li><strong>Backend:</strong> ExpressJS and Node.js</li>
          <li><strong>Frontend:</strong> ReactJS</li>
          <li><strong>Database:</strong> PostgreSQL</li>
        </ul>


          <div className="interaction-box">
            <h3>How to get started:</h3>
            <ul>
              <li><strong>Sign Up:</strong> <Link to="/template/signup">Create an account</Link> to get started.</li>
              <li><strong>Sign In:</strong> Log in to access your account and dashboard. Visit the "User" section to explore more features.</li>
              <li><strong>Explore scenarios:</strong>
                <ul>
                  <li>- After signing up, skip email verification and try to sign up again with the same email.</li>
                  <li>- Try signing in with a forgotten password.</li>
                  <li>- Test the app’s responsiveness across devices: desktop, tablet, and mobile.</li>
                  <li>- Sign in with or without selecting the "Trust this device" checkbox, then try reloading the page.</li>

                </ul>
              </li>
            </ul>
          </div>

      </div>
    </div>
  );
}
