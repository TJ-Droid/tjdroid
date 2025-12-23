const path = require('path');

// Ensure Expo Router looks for routes inside src/app
process.env.EXPO_ROUTER_APP_ROOT = path.resolve(__dirname, 'src/app');

module.exports = require('./app.json');
