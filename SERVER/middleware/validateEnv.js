const requiredEnvVars = [
  'RESET_EMAIL',
  'RESET_EMAIL_PASSWORD',
  'RESET_EMAIL_CLIENT',
  'RESET_EMAIL_PORT',
  'ACCESS_TOKEN_SECRET',
  'REMOTE_CLIENT_APP'
];

const validateEmailConfig = () => {
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      console.error(`Error: Missing environment variable: ${envVar}`);
      process.exit(1); // Exit process with failure
    }
  });
  // console.log("All required environment variables are set.");
};

module.exports = validateEmailConfig;
