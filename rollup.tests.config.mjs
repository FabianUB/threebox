import {defineConfig} from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import alias from '@rollup/plugin-alias';

const target = process.env.TB_TARGET || 'legacy';
const isLegacy = target === 'legacy';

export default defineConfig({
    input: 'tests/threebox-tests.js',
    output: {
        file: 'tests/threebox-tests-bundle.js',
        format: 'iife',
        name: 'ThreeboxTests',
        exports: 'auto',
        sourcemap: true
    },
    plugins: [
        alias({
            entries: [
                {find: 'three', replacement: isLegacy ? 'three-legacy' : 'three-modern'},
                {find: 'mapbox-gl', replacement: isLegacy ? 'mapbox-gl-v2' : 'mapbox-gl-v3'}
            ]
        }),
        nodePolyfills(),
        resolve({
            browser: true,
            preferBuiltins: false
        }),
        commonjs({
            transformMixedEsModules: true
        }),
        json()
    ],
    context: 'window'
});
