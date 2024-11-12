

module.exports = {
  roots: ['<rootDir>/client/tests'], // Add the path to your tests folder
  testMatch: [
    '**/?(*.)+(spec|test).[jt]s?(x)', // Make sure Jest picks up all test files
  ],
  // Other configurations as needed
};
