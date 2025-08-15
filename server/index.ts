import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";

// Load environment variables from .env file
try {
  const dotenv = await import('dotenv');
  dotenv.config();
} catch (error) {
  console.log('Environment variables loaded from system');
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Setup development or production mode
  if (process.env.NODE_ENV === "development") {
    // Dynamic import for vite functions only in development
    try {
      const { setupVite } = await import('./vite.js');
      await setupVite(app, server);
    } catch (error) {
      console.warn('Vite setup failed, serving static files instead');
      // Fallback to static serving if vite fails
      app.use(express.static('dist/public'));
      app.get('*', (_req, res) => {
        res.sendFile('dist/public/index.html', { root: process.cwd() });
      });
    }
  } else {
    // Production: serve static files
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    
    // Handle different environments for __dirname
    let __dirname: string;
    try {
      if (import.meta.url) {
        __dirname = path.dirname(fileURLToPath(import.meta.url));
      } else {
        // Fallback for compiled environments
        __dirname = process.cwd();
      }
    } catch (error) {
      // Final fallback
      __dirname = process.cwd();
    }
    
    const distPath = path.join(__dirname, '../dist/public');
    
    app.use(express.static(distPath));
    
    // Fallback for SPA routing
    app.get('*', (_req, res) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(distPath, 'index.html'));
      }
    });
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    console.log(`GetABonus.net server running on port ${port}`);
  });
})();
