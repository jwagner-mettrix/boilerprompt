const fs = require('fs/promises');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

// Define paths
const rootDir = __dirname;
const clientDir = path.resolve(rootDir, 'client');
const serverDir = path.resolve(rootDir, 'server');
const outDir = path.resolve(rootDir, 'out');
const clientDist = path.resolve(clientDir, 'dist');
const serverDist = path.resolve(serverDir, 'dist');
const outClientDir = path.resolve(outDir, 'client');
const outServerDir = path.resolve(outDir, 'server');

// Helper function to run npm scripts
async function runScript(command, cwd, scriptName) {
  console.log(`Running ${scriptName} build in ${path.relative(rootDir, cwd)}...`);
  try {
    const { stdout, stderr } = await execPromise(command, { cwd });
    if (stdout) console.log(`stdout:
${stdout}`);
    if (stderr) console.error(`stderr:
${stderr}`);
    console.log(`${scriptName} build completed successfully.`);
  } catch (error) {
    console.error(`Error running ${scriptName} build in ${path.relative(rootDir, cwd)}:`);
    console.error(error);
    throw new Error(`${scriptName} build failed.`); // Stop the process if a build fails
  }
}

// Main build function
async function build() {
  console.log('Starting the build process...');

  try {
    // 1. Clean previous output directory
    console.log(`Cleaning output directory: ${outDir}`);
    await fs.rm(outDir, { recursive: true, force: true });
    console.log('Output directory cleaned.');

    // 2. Clean previous client dist directory
    console.log(`Cleaning client dist directory: ${clientDist}`);
    await fs.rm(clientDist, { recursive: true, force: true });
    console.log('Client dist directory cleaned.');

    // 3. Clean previous server dist directory
    console.log(`Cleaning server dist directory: ${serverDist}`);
    await fs.rm(serverDist, { recursive: true, force: true });
    console.log('Server dist directory cleaned.');

    // 4. Create the main output directory
    await fs.mkdir(outDir);
    console.log(`Created output directory: ${outDir}`);

    // 5. Run client build
    await runScript('npm run build', clientDir, 'Client');

    // 6. Run server build
    await runScript('npm run build', serverDir, 'Server');

    // 7. Create output subdirectories
    await fs.mkdir(outClientDir);
    await fs.mkdir(outServerDir);
    console.log('Created output subdirectories.');

    // 8. Copy client dist to out/client
    console.log(`Copying ${clientDist} to ${outClientDir}...`);
    await fs.cp(clientDist, outClientDir, { recursive: true });
    console.log('Client distribution copied.');

    // 9. Copy server dist to out/server
    console.log(`Copying ${serverDist} to ${outServerDir}...`);
    await fs.cp(serverDist, outServerDir, { recursive: true });
    console.log('Server distribution copied.');

    // 10. Copy necessary server files for production start
    console.log('Copying server package files...');
    await fs.copyFile(path.resolve(serverDir, 'package.json'), path.resolve(outServerDir, 'package.json'));
    // Copy lock file if it exists
    try {
      await fs.copyFile(path.resolve(serverDir, 'package-lock.json'), path.resolve(outServerDir, 'package-lock.json'));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error; // Ignore if lock file doesn't exist
      console.log('No package-lock.json found in server directory, skipping copy.');
    }
    console.log('Server package files copied.');

    console.log('----------------------------------------');
    console.log('Build process completed successfully!');
    console.log(`Output available in: ${outDir}`);
    console.log(`To run the production server:`);
    console.log(`  cd ${path.relative(rootDir, outServerDir)}`);
    console.log('  npm install --omit=dev');
    console.log('  node server.js');
    console.log('----------------------------------------');

  } catch (error) {
    console.error('----------------------------------------');
    console.error('Build process failed:', error.message || error);
    console.error('----------------------------------------');
    process.exit(1); // Exit with error code
  }
}

// Run the build
build();
