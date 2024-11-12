module.exports = {
  presets: [
    "@babel/preset-env",  // Transpile ES modules
    "@babel/preset-react",  // For React JSX support
  ],
  plugins: [
    "@babel/plugin-transform-modules-commonjs",  // Transpile ES Modules to CommonJS
  ],
};
