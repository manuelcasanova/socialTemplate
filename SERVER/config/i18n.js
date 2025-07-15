const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');
const path = require('path');

// Define and log the load path
const loadPath = path.join(__dirname, '../../CLIENT/public/locales/{{lng}}/translation.json');
console.log('Resolved i18next loadPath:', loadPath);

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en', 'es'],
    backend: {
      loadPath: loadPath
    }
  });

module.exports = i18next;
