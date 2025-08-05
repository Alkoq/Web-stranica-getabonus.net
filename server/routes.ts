import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import jwt from 'jsonwebtoken';
import { insertNewsletterSubscriberSchema, insertComparisonSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";

// Simple admin credentials (in production use environment variables)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'getabonus2024!'
};

const JWT_SECRET = process.env.JWT_SECRET || 'getabonus-jwt-secret-key-2024';

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication routes
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const token = jwt.sign(
        { username, isAdmin: true },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({ 
        success: true, 
        token,
        message: 'Uspješna prijava'
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'Neispravni podaci za prijavu' 
      });
    }
  });

  app.get('/api/auth/verify', (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Token nije pronađen' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded.isAdmin) {
        res.json({ success: true, user: decoded });
      } else {
        res.status(403).json({ success: false, message: 'Nemate admin privilegije' });
      }
    } catch (error) {
      res.status(401).json({ success: false, message: 'Nevažeći token' });
    }
  });
  
  // Statistics route
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Casino routes
  app.get("/api/casinos", async (req, res) => {
    try {
      const filters = {
        minSafetyIndex: req.query.minSafetyIndex ? parseFloat(req.query.minSafetyIndex as string) : undefined,
        license: req.query.license as string,
        paymentMethods: req.query.paymentMethods ? (req.query.paymentMethods as string).split(',') : undefined,
        features: req.query.features ? (req.query.features as string).split(',') : undefined,
        search: req.query.search as string,
      };

      const casinos = await storage.getCasinos(filters);
      res.json(casinos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch casinos" });
    }
  });

  app.get("/api/casinos/featured", async (req, res) => {
    try {
      const casinos = await storage.getFeaturedCasinos();
      res.json(casinos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured casinos" });
    }
  });

  app.get("/api/casinos/:id", async (req, res) => {
    try {
      const casino = await storage.getCasino(req.params.id);
      if (!casino) {
        return res.status(404).json({ message: "Casino not found" });
      }
      res.json(casino);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch casino" });
    }
  });

  // Bonus routes
  app.get("/api/bonuses", async (req, res) => {
    try {
      const casinoId = req.query.casinoId as string;
      const bonuses = await storage.getBonuses(casinoId);
      res.json(bonuses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bonuses" });
    }
  });

  app.get("/api/bonuses/featured", async (req, res) => {
    try {
      const bonuses = await storage.getFeaturedBonuses();
      res.json(bonuses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured bonuses" });
    }
  });

  // Review routes
  app.get("/api/reviews/casino/:casinoId", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByCasino(req.params.casinoId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Add a new review
  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid review data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create review" });
      }
    }
  });

  // Expert Review routes
  app.get("/api/expert-reviews/casino/:casinoId", async (req, res) => {
    try {
      const expertReviews = await storage.getExpertReviewsByCasino(req.params.casinoId);
      res.json(expertReviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch expert reviews" });
    }
  });

  // Game routes
  app.get("/api/games", async (req, res) => {
    try {
      const filters = {
        type: req.query.type as string,
        provider: req.query.provider as string,
        minRtp: req.query.minRtp ? parseFloat(req.query.minRtp as string) : undefined,
        volatility: req.query.volatility as string,
        search: req.query.search as string,
      };

      const games = await storage.getGames(filters);
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch games" });
    }
  });

  app.get("/api/games/:id", async (req, res) => {
    try {
      const game = await storage.getGame(req.params.id);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      res.json(game);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch game" });
    }
  });

  // Blog routes
  app.get("/api/blog", async (req, res) => {
    try {
      const published = req.query.published !== 'false';
      const posts = await storage.getBlogPosts(published);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Newsletter subscription
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const validatedData = insertNewsletterSubscriberSchema.parse(req.body);
      
      // Check if already subscribed
      const existing = await storage.getNewsletterSubscriber(validatedData.email);
      if (existing) {
        return res.status(409).json({ message: "Email already subscribed" });
      }

      const subscriber = await storage.subscribeNewsletter(validatedData);
      res.json({ message: "Successfully subscribed", subscriber });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid email address" });
      }
      res.status(500).json({ message: "Failed to subscribe" });
    }
  });

  // Casino comparison
  app.post("/api/comparisons", async (req, res) => {
    try {
      const validatedData = insertComparisonSchema.parse(req.body);
      const comparison = await storage.createComparison(validatedData);
      res.json(comparison);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comparison data" });
      }
      res.status(500).json({ message: "Failed to create comparison" });
    }
  });

  app.get("/api/comparisons/:id", async (req, res) => {
    try {
      const comparison = await storage.getComparison(req.params.id);
      if (!comparison) {
        return res.status(404).json({ message: "Comparison not found" });
      }
      res.json(comparison);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comparison" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
