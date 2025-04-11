import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import alias from '@rollup/plugin-alias';
import path from 'path';
import { fileURLToPath } from 'url';

// Use createRequire to import JSON in ESM
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

// Get current directory path in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the project root directory (which is the same as __dirname in this case)
const projectRootDir = __dirname;

export default {
  input: 'src/server.ts', // Entry point of your application
  output: {
    file: pkg.main, // Output file specified in package.json (e.g., dist/server.js)
    format: 'cjs', // Output format: CommonJS for Node.js
    sourcemap: false, // Never generate sourcemaps for production build
  },
  plugins: [
    alias({
      entries: [
        { find: '@', replacement: path.resolve(projectRootDir, 'src') }
      ]
    }),
    resolve({ // Helps Rollup find external modules
      preferBuiltins: true, // Prefer Node.js built-ins like 'path', 'fs'
    }),
    commonjs(), // Convert CommonJS modules to ES6
    json(), // Allow importing JSON files
    typescript({ // Compile TypeScript
      tsconfig: './tsconfig.json',
    //   sourceMap: false, // Do not generate TS source maps
      // plugin-typescript should handle path aliases defined in tsconfig
    }),
    terser(), // Always minify the output
  ],
  // External dependencies (production only)
  // Ensure only actual node_modules are externalized
  external: Object.keys(pkg.dependencies || {}),
    // Add check to ensure local paths like './src' or '@/...' are not accidentally externalized
    // This function checks if the import ID is a node module or a built-in
    // id => !id.startsWith('.') && !path.isAbsolute(id),
}; 