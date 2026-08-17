// Vercel discovers files in /api as Serverless Functions.
// The Express app is exported rather than listening on its own port.
module.exports = require('../src/app');
