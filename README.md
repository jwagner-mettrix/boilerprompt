# BoilerPrompt - React/TypeScript + Node.js/Express Boilerplate

This project provides a solid foundation for building modern web applications using a React/TypeScript frontend (powered by Vite) and a Node.js/Express/TypeScript backend.

It includes common configurations, build scripts, and development setups to get you started quickly.

## Features

**Client (Vite + React + TypeScript)**

*   Fast development server with Hot Module Replacement (HMR) via Vite.
*   TypeScript for type safety.
*   Tailwind CSS for utility-first styling.
*   `shadcn/ui` for pre-built, accessible UI components.
*   Path aliases (`@/*`) configured for cleaner imports.
*   Proxy setup in Vite to forward API requests to the backend during development.

**Server (Node.js + Express + TypeScript)**

*   Express framework for building the API.
*   TypeScript for type safety.
*   SWC for fast TypeScript compilation (used by `ts-node` for development).
*   Path aliases (`@/*`) configured.
*   Environment variable management using `dotenv` and `config/environment.ts`.
*   Structured project layout (controllers, services, routes, etc.).
*   Basic global error handling middleware (`middleware/errorHandler.ts`).
*   Placeholder database connection logic (using `pg`).
*   Configured `nodemon` for automatic server restarts during development.
*   CORS configured for development (allowing Vite dev server) and production (same-origin or configured origin).
*   Production build compiles TypeScript to JavaScript (`dist/`).

**Shared**

*   `concurrently` to run both client and server development servers with a single command.
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
│   └── tsconfig.json
├── out/            # Build output directory (created by `npm run build`)
│   ├── client/     # Compiled frontend assets
│   └── server/     # Compiled backend code + package.json
├── .gitignore
├── build.js        # Root build script
├── package.json    # Root package file (for dev/build scripts)
└── README.md
```

## Prerequisites

*   Node.js (LTS version recommended, e.g., v18 or v20+)

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

To start both the client (Vite dev server) and server (Node.js/nodemon) in development mode simultaneously:

```bash
# Run from the root directory
npm run dev
```

*   Client will be available at `http://localhost:5173` (or the configured port).
*   Server API will be available at `http://localhost:3000` (or the configured port).
*   API requests from the client (to `/api/...`) will be proxied to the backend by Vite.

## Building for Production

To build both the client and server for production:

```bash
# Run from the root directory
npm run build
```

This command will:
1.  Clean the `/out` directory.
2.  Build the client into `/client/dist`.
3.  Build the server into `/server/dist`.
4.  Copy `/client/dist` to `/out/client`.
5.  Copy `/server/dist` to `/out/server`.
6.  Copy `/server/package.json` and `/server/package-lock.json` (if exists) to `/out/server`.

## Running in Production

After running `npm run build`:

1.  **Navigate to the production server directory:**
    ```bash
    cd out/server
    ```

2.  **Install Production Dependencies:**
    ```bash
    npm install --production
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
