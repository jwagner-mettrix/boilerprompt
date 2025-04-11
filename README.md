# BoilerPrompt - React/TypeScript + Node.js/Express Boilerplate

This project provides a solid foundation for building modern web applications using a React/TypeScript frontend (powered by Vite) and a Node.js/Express/TypeScript backend.

It includes common configurations, build scripts, and development setups to get you started quickly.

## Features

**Client (Vite + React + TypeScript)**

*   Fast development server with Hot Module Replacement (HMR) via Vite.
*   TypeScript for type safety.
*   Tailwind CSS v4 for utility-first styling.
*   `shadcn/ui` for pre-built, accessible UI components.
*   Path aliases (`@/*`) configured for cleaner imports.
*   Proxy setup in Vite to forward API requests to the backend during development.

**Server (Node.js + Express + TypeScript)**

*   Express framework for building the API.
*   TypeScript for type safety.
*   `@swc-node/register` for fast TypeScript execution during development (via `nodemon`).
*   **Rollup** for optimized production bundling.
*   Rollup plugins configured (`@rollup/plugin-alias`, `@rollup/plugin-typescript`, `@rollup/plugin-commonjs`, `@rollup/plugin-node-resolve`, `@rollup/plugin-json`, `@rollup/plugin-terser`).
*   Path aliases (`@/*`) configured and handled by `@swc-node/register` (dev) and `@rollup/plugin-alias` (build).
*   Modern ES Module setup (`"module": "ESNext"`, `"moduleResolution": "Bundler"` in `tsconfig.json`).
*   Environment variable management using `dotenv` and `config/environment.ts`.
*   Structured project layout (config, controllers, middleware, routes, utils).
*   Basic global error handling middleware (`middleware/errorHandler.ts`).
*   Placeholder database connection logic (using `pg`).
*   Configured `nodemon` for automatic server restarts during development.
*   CORS configured for development (allowing Vite dev server) and production (same-origin or configured origin).
*   Production build bundles and minifies TypeScript to JavaScript (`dist/`).

**Shared**

*   `npm run dev` to run both client and server development servers with a single command.
*   Root build script (`build.js` / `npm run build`) to automate building both client and server and consolidating output into an `/out` directory.

## Directory Structure

```
/
├── client/         # Vite React frontend application
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── server/         # Node.js Express backend application
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/      # (Optional, for DB models)
│   │   ├── routes/
│   │   ├── services/    # (Optional, for business logic)
│   │   └── utils/
│   ├── package.json
│   ├── tsconfig.json
│   └── rollup.config.mjs
├── out/            # Build output directory (created by `npm run build`)
│   ├── client/     # Compiled frontend assets
│   └── server/     # Compiled backend code + package.json
├── .gitignore
├── build.js        # Root build script
├── package.json    # Root package file (for dev/build scripts)
└── README.md
```

## Prerequisites

*   Node.js (LTS version recommended, e.g., v20+ needed for ESM features like import assertions)
*   npm (comes with Node.js)

## Setup

1.  **Clone the repository (if applicable):**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install Root Dependencies:**
    (Installs `concurrently`)
    ```bash
    npm install
    ```

3.  **Install Client Dependencies:**
    ```bash
    cd client
    npm install
    cd ..
    ```

4.  **Install Server Dependencies:**
    ```bash
    cd server
    npm install
    cd ..
    ```

5.  **Configure Server Environment (Development):**
    *   Copy the example environment file:
        ```bash
        cp server/.env.example server/.env
        ```
    *   Edit `server/.env` and fill in the required values (at minimum `SESSION_SECRET`, potentially `DATABASE_URL` if connecting to a DB).

## Development

To start both the client (Vite dev server) and server (Node.js/nodemon with SWC) in development mode simultaneously:

```bash
# Run from the root directory
npm run dev
```

*   Client will be available at `http://localhost:5173` (or the configured port).
*   Server API will be available at `http://localhost:3000` (or the configured port).
*   The server uses `nodemon` and `@swc-node/register` for fast restarts on file changes.
*   API requests from the client (to `/api/...`) will be proxied to the backend by Vite.

## Building for Production

To build both the client and server for production using Vite and Rollup:

```bash
# Run from the root directory
npm run build
```

This command executes the `build.js` script, which:
1.  Cleans the `/out`, `/client/dist`, and `/server/dist` directories.
2.  Builds the client using `npm run build` in `/client` (Vite).
3.  Builds the server using `npm run build` in `/server` (Rollup, configured for production).
4.  Copies `/client/dist` to `/out/client`.
5.  Copies `/server/dist` to `/out/server`.
6.  Copies `/server/package.json` and `/server/package-lock.json` (if exists) to `/out/server`.

## Running in Production

After running `npm run build`:

1.  **Navigate to the production server directory:**
    ```bash
    cd out/server
    ```

2.  **Install Production Dependencies:**
    ```bash
    npm install --omit=dev
    ```

3.  **Configure Environment Variables:**
    Set the required environment variables in your production environment (hosting platform, server OS, Docker, etc.). Refer to `server/.env.example` for the list. **Crucially, you must set:**
    *   `NODE_ENV=production`
    *   `PORT` (e.g., 8080 or as required by your host)
    *   `SESSION_SECRET` (a strong, unique secret)
    *   `DATABASE_URL` (if applicable)
    *   `CORS_ORIGIN` (optional, only needed if accessed by other origins; defaults work for same-origin)

4.  **Start the Server:**
    ```bash
    node server.js
    ```

The server will now serve the client application from `/out/client` and the API from `/api` on the configured `PORT`.
