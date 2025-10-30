import {defineConfig} from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';
import terser from '@rollup/plugin-terser';
import alias from '@rollup/plugin-alias';

const target = process.env.TB_TARGET || 'legacy';
const isLegacy = target === 'legacy';

const dependencyAliases = alias({
    entries: [
        {find: 'three', replacement: isLegacy ? 'three-legacy' : 'three-modern'},
        {find: 'mapbox-gl', replacement: isLegacy ? 'mapbox-gl-v2' : 'mapbox-gl-v3'}
    ]
});

const basePlugins = [
    dependencyAliases,
    resolve({
        browser: true,
        preferBuiltins: false
    }),
    commonjs({
        transformMixedEsModules: true
    }),
    json()
];

export default defineConfig([
    {
        input: 'main.js',
        output: [
            {
                file: 'dist/threebox.cjs',
                format: 'cjs',
                exports: 'named',
                sourcemap: true
            },
            {
                file: 'dist/threebox.esm.js',
                format: 'es',
                sourcemap: true
            }
        ],
        plugins: [
            ...basePlugins,
            copy({
                targets: [
                    {
                        src: 'examples/css/threebox.css',
                        dest: 'dist',
                        rename: 'threebox.css'
                    }
                ],
                hook: 'writeBundle'
            })
        ],
        onwarn(warning, warn) {
            if (warning.code === 'THIS_IS_UNDEFINED') return;
            warn(warning);
        }
    },
    {
        input: 'exports.js',
        output: {
            file: 'dist/threebox.js',
            format: 'iife',
            name: 'ThreeboxBundle',
            exports: 'auto',
            sourcemap: true
        },
        plugins: basePlugins,
        context: 'window'
    },
    {
        input: 'exports.js',
        output: {
            file: 'dist/threebox.min.js',
            format: 'iife',
            name: 'ThreeboxBundle',
            exports: 'auto',
            sourcemap: true
        },
        plugins: [
            ...basePlugins,
            terser()
        ],
        context: 'window'
    }
]);
