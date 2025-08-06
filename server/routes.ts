import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { insertNewsletterSubscriberSchema, insertComparisonSchema, insertReviewSchema, insertAdminSchema } from "@shared/schema";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || 'getabonus-jwt-secret-key-2024';

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Find admin by username
      const admin = await storage.getAdminByUsername(username);
      
      if (!admin || !admin.isActive) {
        return res.status(401).json({ 
          success: false, 
          message: 'Neispravni podaci za prijavu' 
        });
      }
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false, 
          message: 'Neispravni podaci za prijavu' 
        });
      }
      
      const token = jwt.sign(
        { 
          id: admin.id,
          username: admin.username, 
          role: admin.role,
          isAdmin: true 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({ 
        success: true, 
        token,
        user: {
          id: admin.id,
          username: admin.username,
          role: admin.role
        },
        message: 'Uspješna prijava'
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Greška servera' 
      });
    }
  });

  app.get('/api/auth/verify', async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Token nije pronađen' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      if (!decoded.isAdmin) {
        return res.status(403).json({ success: false, message: 'Nemate admin privilegije' });
      }
      
      // Verify admin still exists and is active
      const admin = await storage.getAdmin(decoded.id);
      if (!admin || !admin.isActive) {
        return res.status(401).json({ success: false, message: 'Admin nalog nije aktivan' });
      }
      
      res.json({ 
        success: true, 
        user: {
          id: admin.id,
          username: admin.username,
          role: admin.role
        }
      });
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

  // Casino games route
  app.get("/api/casino-games/:casinoId", async (req, res) => {
    try {
      const games = await storage.getGamesByCasinoId(req.params.casinoId);
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch casino games" });
    }
  });

  // Get casinos that have a specific game
  app.get("/api/game-casinos/:gameId", async (req, res) => {
    try {
      const casinos = await storage.getCasinosByGameId(req.params.gameId);
      res.json(casinos);
    } catch (error) {
      console.error("Error fetching game casinos:", error);
      res.status(500).json({ message: "Failed to fetch game casinos" });
    }
  });

  // Track user interaction
  app.post("/api/interactions", async (req, res) => {
    try {
      const { sessionId, interactionType, targetId, targetType } = req.body;
      
      if (!sessionId || !interactionType) {
        return res.status(400).json({ message: "sessionId and interactionType are required" });
      }

      const interaction = await storage.trackInteraction({
        sessionId,
        interactionType,
        targetId,
        targetType
      });

      res.json(interaction);
    } catch (error) {
      console.error("Error tracking interaction:", error);
      res.status(500).json({ message: "Failed to track interaction" });
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

  app.get("/api/reviews/bonus/:bonusId", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByBonusId(req.params.bonusId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bonus reviews" });
    }
  });

  app.get("/api/reviews/game/:gameId", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByGameId(req.params.gameId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch game reviews" });
    }
  });

  // Get expert game rating (fixed rating)
  app.get("/api/games/:gameId/rating", async (req, res) => {
    try {
      const game = await storage.getGame(req.params.gameId);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      // Return fixed expert rating for the game
      res.json({ expertRating: 8.5 });
    } catch (error) {
      console.error("Error fetching expert game rating:", error);
      res.status(500).json({ message: "Failed to fetch game rating" });
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

  // POST endpoint specifically for game reviews
  app.post("/api/reviews/game", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating game review:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid game review data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create game review" });
      }
    }
  });

  // Add helpful vote to review
  app.post("/api/reviews/:reviewId/helpful", async (req, res) => {
    try {
      const reviewId = req.params.reviewId;
      const updatedReview = await storage.addHelpfulVote(reviewId);
      res.json(updatedReview);
    } catch (error) {
      console.error("Error adding helpful vote:", error);
      res.status(500).json({ message: "Failed to add helpful vote" });
    }
  });

  // Get casino ratings (expert + user average + safety)
  app.get("/api/casinos/:casinoId/ratings", async (req, res) => {
    try {
      const casinoId = req.params.casinoId;
      const expertReviews = await storage.getExpertReviewsByCasino(casinoId);
      const userReviewsAverage = await storage.getUserReviewsAverageRating(casinoId);
      const safetyRating = await storage.getCasinoSafetyRating(casinoId);
      
      const expertRating = expertReviews.length > 0 ? parseFloat(expertReviews[0].overallRating.toString()) : 0;
      
      res.json({
        expertRating,
        userReviewsAverage,
        safetyRating,
        totalUserReviews: (await storage.getReviewsByCasino(casinoId)).length
      });
    } catch (error) {
      console.error("Error fetching casino ratings:", error);
      res.status(500).json({ message: "Failed to fetch casino ratings" });
    }
  });

  // Get bonus ratings
  app.get("/api/bonuses/:bonusId/ratings", async (req, res) => {
    try {
      const bonusId = req.params.bonusId;
      const userReviewsAverage = await storage.getBonusUserReviewsAverageRating(bonusId);
      const totalReviews = (await storage.getReviewsByBonusId(bonusId)).length;
      
      res.json({
        userReviewsAverage,
        totalReviews
      });
    } catch (error) {
      console.error("Error fetching bonus ratings:", error);
      res.status(500).json({ message: "Failed to fetch bonus ratings" });
    }
  });

  // Get game ratings
  app.get("/api/games/:gameId/ratings", async (req, res) => {
    try {
      const gameId = req.params.gameId;
      const reviews = await storage.getReviewsByGameId(gameId);
      const userReviewsAverage = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.overallRating, 0) / reviews.length 
        : 0;
      const totalReviews = reviews.length;
      
      res.json({
        userReviewsAverage,
        totalReviews
      });
    } catch (error) {
      console.error("Error fetching game ratings:", error);
      res.status(500).json({ message: "Failed to fetch game ratings" });
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

  // Get casinos that have a specific game
  app.get("/api/game-casinos/:gameId", async (req, res) => {
    try {
      const casinos = await storage.getCasinosByGameId(req.params.gameId);
      res.json(casinos);
    } catch (error) {
      console.error("Error fetching casinos for game:", error);
      res.status(500).json({ message: "Failed to fetch casinos for game" });
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

  // Admin authentication middleware
  const authenticateAdmin = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Token nije pronađen' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      if (!decoded.isAdmin) {
        return res.status(403).json({ success: false, message: 'Nemate admin privilegije' });
      }
      
      // Verify admin still exists and is active
      const admin = await storage.getAdmin(decoded.id);
      if (!admin || !admin.isActive) {
        return res.status(401).json({ success: false, message: 'Admin nalog nije aktivan' });
      }
      
      req.admin = admin;
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: 'Nevažeći token' });
    }
  };

  // Admin management routes (only owner can manage admins)
  app.get('/api/admin/admins', authenticateAdmin, async (req: any, res) => {
    try {
      if (req.admin.role !== 'owner') {
        return res.status(403).json({ success: false, message: 'Samo vlasnik može upravljati administratorima' });
      }
      
      const admins = await storage.getAdmins();
      res.json({ success: true, admins });
    } catch (error) {
      console.error('Error fetching admins:', error);
      res.status(500).json({ success: false, message: 'Greška servera' });
    }
  });

  app.post('/api/admin/admins', authenticateAdmin, async (req: any, res) => {
    try {
      if (req.admin.role !== 'owner') {
        return res.status(403).json({ success: false, message: 'Samo vlasnik može dodavati administratore' });
      }
      
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Korisničko ime i password su obavezni' });
      }
      
      // Check if username already exists
      const existingAdmin = await storage.getAdminByUsername(username);
      if (existingAdmin) {
        return res.status(400).json({ success: false, message: 'Korisničko ime već postoji' });
      }
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const adminData = {
        username,
        password: hashedPassword,
        role: 'admin' as const,
        createdBy: req.admin.id,
        isActive: true
      };
      
      const newAdmin = await storage.createAdmin(adminData);
      
      res.json({ 
        success: true, 
        admin: {
          id: newAdmin.id,
          username: newAdmin.username,
          role: newAdmin.role,
          createdAt: newAdmin.createdAt
        },
        message: 'Administrator je uspešno kreiran'
      });
    } catch (error) {
      console.error('Error creating admin:', error);
      res.status(500).json({ success: false, message: 'Greška servera' });
    }
  });

  app.delete('/api/admin/admins/:id', authenticateAdmin, async (req: any, res) => {
    try {
      if (req.admin.role !== 'owner') {
        return res.status(403).json({ success: false, message: 'Samo vlasnik može brisati administratore' });
      }
      
      const adminId = req.params.id;
      
      // Don't allow deleting yourself
      if (adminId === req.admin.id) {
        return res.status(400).json({ success: false, message: 'Ne možete obrisati svoj nalog' });
      }
      
      const success = await storage.deleteAdmin(adminId);
      if (success) {
        res.json({ success: true, message: 'Administrator je uspešno obrisan' });
      } else {
        res.status(404).json({ success: false, message: 'Administrator nije pronađen' });
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      res.status(500).json({ success: false, message: 'Greška servera' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
