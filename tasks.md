# Upgrade Threebox to modern Three.js & Mapbox GL JS

- [ ] Replace the bundled `src/three.js` (r132 UMD build) with the official `three@0.180.0` package and wire our sources to import from it.
- [ ] Update the build pipeline (currently Browserify/tinyify) to a bundler that supports ESM (`three` and `mapbox-gl` now ship `"type": "module"` packages). Adjust `package.json` scripts accordingly.
- [ ] Swap the in-repo copies of `Line2`, `CSS2DRenderer`, and loader modules (`OBJLoader`, `MTLLoader`, `FBXLoader`, `GLTFLoader`, `ColladaLoader`) with the current `three/examples/jsm` implementations. Refactor our wrappers to consume the new BufferGeometry-based APIs.
- [ ] Refactor legacy Three.js usages:
  - `THREE.WebGLRenderer.outputEncoding` ➔ `outputColorSpace` (`Threebox.js`)
  - Ensure material/color helpers still use normalized color values.
- [ ] Audit and update code paths that read Mapbox internals:
  - `BuildingShadows` should locate sources via `style.getOwnSourceCaches()` instead of `style.sourceCaches/_otherSourceCaches`.
  - Review every access to `map.transform._*` inside `CameraSync` and replace them with supported getters where available (e.g. `map.getPitch()`, `map.transform.getFreeCamera()`). Verify near/far plane math on Mapbox GL v3 terrain/globe.
- [ ] Confirm event wiring uses public APIs (e.g. switch `map.onContextMenu =` to `map.on('contextmenu', …)`).
- [ ] After refactors, update examples/tests to install `mapbox-gl@3.16.0` and validate the integration.
