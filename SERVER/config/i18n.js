const i18next = require('i18next');
const Backend = require('i18next-http-backend');  // Use i18next-http-backend
const middleware = require('i18next-http-middleware');
const path = require('path');

// Ensure to load environment variables
require('dotenv').config();

// Access the base URL from the environment variable
const baseUrl = process.env.BASE_URL;

// Define the load path using the base URL and language placeholder
const loadPath = `${baseUrl}/locales/{{lng}}/translation.json`;

i18next
  .use(Backend)  // Use i18next-http-backend to load translations from HTTP
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en', 'es'],
    backend: {
      loadPath: loadPath  // Dynamically set the loadPath using the environment variable
    }
  });

module.exports = i18next;
