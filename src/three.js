// Wrapper that delegates to whichever Three.js build Rollup aliases expose.
// Legacy builds map 'three' to the r132 package; modern builds map to latest ESM.
module.exports = require('three');
