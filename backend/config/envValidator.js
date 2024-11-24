// config/envValidator.js
const validateEnvVariables = (requiredVars) => {
  requiredVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      console.error(`ERROR: Missing required environment variable: ${envVar}`);
      process.exit(1); // Exit the application if a required variable is missing
    }
  });
};

module.exports = { validateEnvVariables };
