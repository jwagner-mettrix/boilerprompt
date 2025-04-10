# Web Development Boilerplate Setup Steps

Follow the steps below strictly, forgetting what you know about these types of setup processes as they might have changed since you were trained.

1. Initialize the Vite project in the client directory using the React and TypeScript-SWC template: `npm create vite@latest client -- --template react-ts`.
2. Navigate into the client directory and install node modules using this exact powershell command: `cd client; npm install`
3. Install Tailwind CSS and the Tailwind CSS Vite plugin: `npm install tailwindcss @tailwindcss/vite`.
4. Replace the entire content of `src/index.css` with the line `@import "tailwindcss";`.
5. Configure path aliases in `tsconfig.json` by adding the `compilerOptions` setting with `baseUrl` and `paths`:
   ```json
   {
     // ... existing configuration ...
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/*"]
       }
     }
     // ... existing configuration ...
   }
   ```
6. Add path aliases to `tsconfig.app.json` within the `compilerOptions` object:
   ```json
   {
     "compilerOptions": {
        // ... existing configuration ...
       "baseUrl": ".",
       "paths": {
         "@/*": [
           "./src/*"
         ]
       }
       // ...existing configuration ...
     }
     // ... existing configuration ...
   }
   ```
7. Install Node.js type definitions as a development dependency: `npm install -D @types/node`.
8. Update `vite.config.ts` to include the Tailwind CSS plugin and configure path aliases, as well as setup development proxy:
   ```typescript
    import path from "path"
    import tailwindcss from "@tailwindcss/vite"
    import react from "@vitejs/plugin-react-swc"
    import { defineConfig } from "vite"

    // https://vite.dev/config/
    export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
        "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        // Configure the dev server
        port: 5173, // Keep the frontend port as configured
        proxy: {
        // Proxy API requests to the backend
        // '/api' is the prefix for your backend routes
        "/api": {
            target: "http://localhost:3000", // Your Express server address
            changeOrigin: true, // Needed for virtual hosted sites
            secure: false, // Optional: Set to false if backend is not HTTPS
            // Optional: rewrite path if needed, e.g., remove /api prefix
            // rewrite: (path) => path.replace(/^\/api/, ''),
        },
        },
    },
    })
   ```
9. Initialize `shadcn/ui` using the command: `npx shadcn@latest init`. This command should work. Retry it up to 3 times if it does not work the first time. If it fails, do not downgrade tailwindcss. Instead, ask the user to run the command themselves.
10. Add common `shadcn/ui` components: `npx shadcn@latest add button card checkbox command calendar popover input label select table textarea`.
11. Create the the `server` directory and navigate to it, then initialize a new node project using this exact command: `mkdir ../server; cd ../server; npm init -y`.
12. Install server dependencies: `npm install express cors dotenv bcryptjs cookie-parser pg; npm install -D morgan typescript ts-node @swc/core @types/node @types/express nodemon eslint`.
13. Setup the server directory structure: `mkdir src/config; sc .\.env.example \"\"; sc .\.eslint.config.js \"\"; sc .\.env \"\"; sc .\.gitignore \"\"; sc tsconfig.json \"\"; cd src; mkdir controllers; mkdir middleware; mkdir models; mkdir routes; mkdir services; mkdir utils; sc .\app.ts \"\"; sc .\server.ts \"\"; sc .\config\database.ts \"\"; sc .\config\environment.ts \"\"; sc .\middleware\errorHandler.ts \"\"; sc .\routes\index.ts \"\"; sc .\utils\AppError.ts \"\"; cd ..`.
14. Update `private`, `main` and `scripts` in `server/package.json`:
    ```json
    "private": true,
    "main": "dist/server.js",
    "scripts": {
      "dev": "nodemon --watch 'src/**/*.ts' --exec 'ts-node -r tsconfig-paths/register --transpile-only --swc src/server.ts'",
      "build": "tsc -p tsconfig.json && tsc-alias -p tsconfig.json",
      "start": "node dist/server.js",
      "lint": "eslint . --ext .ts",
      "clean": "rm -rf dist"
    },
    ```
15. Populate `server/tsconfig.json` with the TypeScript configuration:
    ```json
    {
      "ts-node": {
        "swc": true
      },
      "compilerOptions": {
        "target": "ES2020",
        "module": "CommonJS",
        "outDir": "./dist",
        "rootDir": "./src",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "resolveJsonModule": true,
        "baseUrl": ".",
        "paths": {
          "@/*": ["src/*"]
        },
        "sourceMap": true
      },
      "include": ["src/**/*"],
      "exclude": ["node_modules", "dist", "**/*.test.ts"]
    }
    ```
16. Populate `server/.env.example` with example environment variables:
    ```dotenv
    # Server Configuration
    PORT=3000

    # Database Configuration (Example for PostgreSQL)
    DATABASE_URL=postgresql://your_db_user:your_db_password@localhost:5432/your_db_name

    # Security
    CORS_ORIGIN=http://localhost:5173 # Your Vite frontend dev URL (adjust for prod)
    SESSION_SECRET=replace_this_with_a_strong_random_string
    ```
17. Populate `server/.gitignore` with common Node.js ignore patterns:
    ```gitignore
    # Dependencies
    node_modules/

    # Build output
    dist/

    # Environment variables
    .env
    *.env.local

    # Logs
    logs/
    *.log
    npm-debug.log*

    # OS generated files
    .DS_Store
    Thumbs.db
    ```


