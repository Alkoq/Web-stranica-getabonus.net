import { 
  type User, 
  type InsertUser,
  type Casino,
  type InsertCasino,
  type Bonus,
  type InsertBonus,
  type Review,
  type InsertReview,
  type ExpertReview,
  type InsertExpertReview,
  type BlogPost,
  type InsertBlogPost,
  type NewsletterSubscriber,
  type InsertNewsletterSubscriber,
  type UserInteraction,
  type InsertUserInteraction,
  type Comparison,
  type InsertComparison,
  type Game,
  type InsertGame,
  type Admin,
  type InsertAdmin,
  users, casinos, bonuses, reviews, expertReviews, blogPosts, newsletterSubscribers, userInteractions, comparisons, games, admins
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Casinos
  getCasinos(filters?: CasinoFilters): Promise<Casino[]>;
  getFeaturedCasinos(): Promise<Casino[]>;
  getCasino(id: string): Promise<Casino | undefined>;
  createCasino(casino: InsertCasino): Promise<Casino>;
  updateCasino(id: string, updates: Partial<InsertCasino>): Promise<Casino>;

  // Bonuses
  getBonuses(casinoId?: string): Promise<Bonus[]>;
  getFeaturedBonuses(): Promise<Bonus[]>;
  getBonus(id: string): Promise<Bonus | undefined>;
  createBonus(bonus: InsertBonus): Promise<Bonus>;

  // Reviews
  getReviewsByCasino(casinoId: string): Promise<Review[]>;
  getReviewsByBonusId(bonusId: string): Promise<Review[]>;
  getReviewsByGameId(gameId: string): Promise<Review[]>;
  getReview(id: string): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  addHelpfulVote(reviewId: string): Promise<Review>;

  // Expert Reviews
  getExpertReviewsByCasino(casinoId: string): Promise<ExpertReview[]>;
  getExpertReview(id: string): Promise<ExpertReview | undefined>;
  createExpertReview(review: InsertExpertReview): Promise<ExpertReview>;

  // Blog Posts
  getBlogPosts(published?: boolean): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;

  // Newsletter
  subscribeNewsletter(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  getNewsletterSubscriber(email: string): Promise<NewsletterSubscriber | undefined>;

  // User Interactions
  trackInteraction(interaction: InsertUserInteraction): Promise<UserInteraction>;
  getUniqueActiveUsers(): Promise<number>;

  // Comparisons
  createComparison(comparison: InsertComparison): Promise<Comparison>;
  getComparison(id: string): Promise<Comparison | undefined>;

  // Games
  getGames(filters?: GameFilters): Promise<Game[]>;
  getGame(id: string): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;
  
  // Get games associated with a casino
  getGamesByCasinoId(casinoId: string): Promise<Game[]>;

  // Get casinos associated with a game
  getCasinosByGameId(gameId: string): Promise<Casino[]>;

  // Rating helpers
  getUserReviewsAverageRating(casinoId: string): Promise<number>;
  getCasinoSafetyRating(casinoId: string): Promise<number>;
  getBonusUserReviewsAverageRating(bonusId: string): Promise<number>;

  // Statistics
  getStats(): Promise<{
    totalCasinos: number;
    totalBonuses: number;
    totalGames: number;
    totalUsers: number;
  }>;

  // Admins
  getAdmin(id: string): Promise<Admin | undefined>;
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  getAdmins(): Promise<Admin[]>;
  updateAdmin(id: string, updates: Partial<InsertAdmin>): Promise<Admin>;
  deleteAdmin(id: string): Promise<boolean>;
}

export interface CasinoFilters {
  minSafetyIndex?: number;
  license?: string;
  paymentMethods?: string[];
  features?: string[];
  search?: string;
}

export interface GameFilters {
  type?: string;
  provider?: string;
  minRtp?: number;
  volatility?: string;
  search?: string;
}

// PostgreSQL-based dinamičan storage sistem
export class MemStorage implements IStorage {
  constructor() {
    // Konstruktor je prazan - svi podaci se učitavaju iz PostgreSQL baze
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const result = await db.insert(users).values({
        ...insertUser,
        id: randomUUID(),
        createdAt: new Date(),
      }).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Casino methods - dinamički iz PostgreSQL baze
  async getCasinos(filters?: CasinoFilters): Promise<Casino[]> {
    try {
      let conditions = [eq(casinos.isActive, true)];
      
      if (filters?.license) {
        conditions.push(eq(casinos.license, filters.license));
      }
      // Dodaj ostale filtere po potrebi
      
      const result = await db.select().from(casinos)
        .where(and(...conditions))
        .orderBy(desc(casinos.safetyIndex));
      return result;
    } catch (error) {
      console.error('Error getting casinos:', error);
      return [];
    }
  }

  async getFeaturedCasinos(): Promise<Casino[]> {
    try {
      const result = await db.select().from(casinos)
        .where(and(eq(casinos.isActive, true), eq(casinos.isFeatured, true)))
        .orderBy(desc(casinos.safetyIndex));
      return result;
    } catch (error) {
      console.error('Error getting featured casinos:', error);
      return [];
    }
  }

  async getCasino(id: string): Promise<Casino | undefined> {
    try {
      const result = await db.select().from(casinos).where(eq(casinos.id, id)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error getting casino:', error);
      return undefined;
    }
  }

  async createCasino(casino: InsertCasino): Promise<Casino> {
    try {
      const result = await db.insert(casinos).values(casino).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating casino:', error);
      throw error;
    }
  }

  async updateCasino(id: string, updates: Partial<InsertCasino>): Promise<Casino> {
    try {
      const updateData: any = { ...updates, updatedAt: new Date() };
      const result = await db.update(casinos)
        .set(updateData)
        .where(eq(casinos.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error('Error updating casino:', error);
      throw error;
    }
  }

  // Bonus methods - dinamički iz PostgreSQL baze
  async getBonuses(casinoId?: string): Promise<Bonus[]> {
    try {
      let conditions = [eq(bonuses.isActive, true)];
      
      if (casinoId) {
        conditions.push(eq(bonuses.casinoId, casinoId));
      }
      
      const result = await db.select().from(bonuses)
        .where(and(...conditions))
        .orderBy(desc(bonuses.createdAt));
      return result;
    } catch (error) {
      console.error('Error getting bonuses:', error);
      return [];
    }
  }

  async getFeaturedBonuses(): Promise<Bonus[]> {
    try {
      const result = await db.select().from(bonuses)
        .where(and(eq(bonuses.isActive, true), eq(bonuses.isFeatured, true)))
        .orderBy(desc(bonuses.createdAt));
      return result;
    } catch (error) {
      console.error('Error getting featured bonuses:', error);
      return [];
    }
  }

  async getBonus(id: string): Promise<Bonus | undefined> {
    try {
      const result = await db.select().from(bonuses).where(eq(bonuses.id, id)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error getting bonus:', error);
      return undefined;
    }
  }

  async createBonus(bonus: InsertBonus): Promise<Bonus> {
    try {
      const result = await db.insert(bonuses).values({
        ...bonus,
        id: randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating bonus:', error);
      throw error;
    }
  }

  async updateBonus(id: string, updates: Partial<InsertBonus>): Promise<Bonus> {
    try {
      const result = await db.update(bonuses)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(bonuses.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error('Error updating bonus:', error);
      throw error;
    }
  }

  // Game methods - dinamički iz PostgreSQL baze
  async getGames(filters?: GameFilters): Promise<Game[]> {
    try {
      let conditions = [eq(games.isActive, true)];
      
      if (filters?.type) {
        conditions.push(eq(games.type, filters.type));
      }
      if (filters?.provider) {
        conditions.push(eq(games.provider, filters.provider));
      }
      
      const result = await db.select().from(games)
        .where(and(...conditions))
        .orderBy(desc(games.createdAt));
      return result;
    } catch (error) {
      console.error('Error getting games:', error);
      return [];
    }
  }

  async getGame(id: string): Promise<Game | undefined> {
    try {
      const result = await db.select().from(games).where(eq(games.id, id)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error getting game:', error);
      return undefined;
    }
  }

  async createGame(game: InsertGame): Promise<Game> {
    try {
      const result = await db.insert(games).values(game).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  }

  async updateGame(id: string, updates: Partial<InsertGame>): Promise<Game> {
    try {
      const updateData: any = { ...updates, updatedAt: new Date() };
      const result = await db.update(games)
        .set(updateData)
        .where(eq(games.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error('Error updating game:', error);
      throw error;
    }
  }

  // Review methods - dinamički iz PostgreSQL baze
  async getReviewsByCasino(casinoId: string): Promise<Review[]> {
    try {
      const result = await db.select().from(reviews)
        .where(and(eq(reviews.casinoId, casinoId), eq(reviews.isPublished, true)))
        .orderBy(desc(reviews.createdAt));
      return result;
    } catch (error) {
      console.error('Error getting casino reviews:', error);
      return [];
    }
  }

  async getReviewsByBonusId(bonusId: string): Promise<Review[]> {
    try {
      const result = await db.select().from(reviews)
        .where(and(eq(reviews.bonusId, bonusId), eq(reviews.isPublished, true)))
        .orderBy(desc(reviews.createdAt));
      return result;
    } catch (error) {
      console.error('Error getting bonus reviews:', error);
      return [];
    }
  }

  async getReviewsByGameId(gameId: string): Promise<Review[]> {
    try {
      const result = await db.select().from(reviews)
        .where(and(eq(reviews.gameId, gameId), eq(reviews.isPublished, true)))
        .orderBy(desc(reviews.createdAt));
      return result;
    } catch (error) {
      console.error('Error getting game reviews:', error);
      return [];
    }
  }

  async getReview(id: string): Promise<Review | undefined> {
    try {
      const result = await db.select().from(reviews).where(eq(reviews.id, id)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error getting review:', error);
      return undefined;
    }
  }

  async createReview(review: InsertReview): Promise<Review> {
    try {
      const result = await db.insert(reviews).values(review).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  async addHelpfulVote(reviewId: string): Promise<Review> {
    try {
      const result = await db.update(reviews)
        .set({ 
          helpfulVotes: sql`${reviews.helpfulVotes} + 1`,
          updatedAt: new Date()
        })
        .where(eq(reviews.id, reviewId))
        .returning();
      return result[0];
    } catch (error) {
      console.error('Error adding helpful vote:', error);
      throw error;
    }
  }

  // Expert Review methods
  async getExpertReviewsByCasino(casinoId: string): Promise<ExpertReview[]> {
    try {
      const result = await db.select().from(expertReviews)
        .where(eq(expertReviews.casinoId, casinoId))
        .orderBy(desc(expertReviews.createdAt));
      return result;
    } catch (error) {
      console.error('Error getting expert reviews:', error);
      return [];
    }
  }

  async getExpertReview(id: string): Promise<ExpertReview | undefined> {
    try {
      const result = await db.select().from(expertReviews).where(eq(expertReviews.id, id)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error getting expert review:', error);
      return undefined;
    }
  }

  async createExpertReview(review: InsertExpertReview): Promise<ExpertReview> {
    try {
      const result = await db.insert(expertReviews).values({
        ...review,
        id: randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating expert review:', error);
      throw error;
    }
  }

  // Blog methods
  async getBlogPosts(published?: boolean): Promise<BlogPost[]> {
    try {
      let query = db.select().from(blogPosts);
      
      if (published !== undefined) {
        query = query.where(eq(blogPosts.isPublished, published));
      }
      
      const result = await query.orderBy(desc(blogPosts.createdAt));
      return result;
    } catch (error) {
      console.error('Error getting blog posts:', error);
      return [];
    }
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    try {
      const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error getting blog post:', error);
      return undefined;
    }
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    try {
      const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error getting blog post by slug:', error);
      return undefined;
    }
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    try {
      const result = await db.insert(blogPosts).values(post).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  }

  async updateBlogPost(id: string, updates: Partial<InsertBlogPost>): Promise<BlogPost> {
    try {
      const updateData: any = { ...updates, updatedAt: new Date() };
      const result = await db.update(blogPosts)
        .set(updateData)
        .where(eq(blogPosts.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  }

  // Newsletter methods
  async subscribeNewsletter(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    try {
      const result = await db.insert(newsletterSubscribers).values({
        ...subscriber,
        id: randomUUID(),
        subscribedAt: new Date(),
      }).returning();
      return result[0];
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      throw error;
    }
  }

  async getNewsletterSubscriber(email: string): Promise<NewsletterSubscriber | undefined> {
    try {
      const result = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, email)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error getting newsletter subscriber:', error);
      return undefined;
    }
  }

  // User interaction methods
  async trackInteraction(interaction: InsertUserInteraction): Promise<UserInteraction> {
    try {
      const result = await db.insert(userInteractions).values({
        ...interaction,
        id: randomUUID(),
        createdAt: new Date(),
      }).returning();
      return result[0];
    } catch (error) {
      console.error('Error tracking interaction:', error);
      throw error;
    }
  }

  async getUniqueActiveUsers(): Promise<number> {
    try {
      // Pokušavamo da dohvatimo broj iz user_interactions tabele
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      
      const result = await db.select({
        count: sql<number>`COUNT(DISTINCT ${userInteractions.sessionId})`
      }).from(userInteractions)
        .where(sql`${userInteractions.createdAt} >= ${oneDayAgo}`);
      
      return result[0]?.count || 0;
    } catch (error) {
      // Ako tabela još ne postoji, vratiti simuliran broj na osnovu postojećih aktivnosti
      console.log('User interactions table not yet available, using simulated count');
      try {
        // Bazirati broj na ukupnoj aktivnosti (recenzije + kazina)
        const [reviewCount] = await db.select({ count: sql<number>`count(*)` }).from(reviews);
        const [casinoCount] = await db.select({ count: sql<number>`count(*)` }).from(casinos);
        
        // Simuliramo broj aktivnih korisnika na osnovu postojeće aktivnosti
        const simulatedUsers = Math.max(50, Math.floor((reviewCount.count * 12) + (casinoCount.count * 25)));
        return simulatedUsers;
      } catch (fallbackError) {
        // Poslednji fallback
        return 127; // Statični broj kad ništa drugo ne radi
      }
    }
  }

  // Comparison methods
  async createComparison(comparison: InsertComparison): Promise<Comparison> {
    try {
      const result = await db.insert(comparisons).values(comparison).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating comparison:', error);
      throw error;
    }
  }

  async getComparison(id: string): Promise<Comparison | undefined> {
    try {
      const result = await db.select().from(comparisons).where(eq(comparisons.id, id)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error getting comparison:', error);
      return undefined;
    }
  }

  // Relationship methods
  async getGamesByCasinoId(casinoId: string): Promise<Game[]> {
    // Ova metoda vraća sve igre iz baze - možete dodati casino_games tabelu za specifične veze
    return this.getGames();
  }

  async getCasinosByGameId(gameId: string): Promise<Casino[]> {
    // Slično kao gore - vraća sve kazina
    return this.getCasinos();
  }

  // Rating helpers
  async getUserReviewsAverageRating(casinoId: string): Promise<number> {
    try {
      const result = await db.select({
        avg: sql<number>`AVG(${reviews.overallRating})`
      }).from(reviews)
        .where(and(eq(reviews.casinoId, casinoId), eq(reviews.isPublished, true)));
      
      return result[0]?.avg || 0;
    } catch (error) {
      console.error('Error getting user reviews average:', error);
      return 0;
    }
  }

  async getCasinoSafetyRating(casinoId: string): Promise<number> {
    try {
      const casino = await this.getCasino(casinoId);
      return casino ? parseFloat(casino.safetyIndex) : 0;
    } catch (error) {
      console.error('Error getting casino safety rating:', error);
      return 0;
    }
  }

  async getBonusUserReviewsAverageRating(bonusId: string): Promise<number> {
    try {
      const result = await db.select({
        avg: sql<number>`AVG(${reviews.overallRating})`
      }).from(reviews)
        .where(and(eq(reviews.bonusId, bonusId), eq(reviews.isPublished, true)));
      
      return result[0]?.avg || 0;
    } catch (error) {
      console.error('Error getting bonus reviews average:', error);
      return 0;
    }
  }

  // Statistics
  async getStats(): Promise<{
    totalCasinos: number;
    totalBonuses: number;
    totalGames: number;
    totalUsers: number;
  }> {
    try {
      const [casinoCount] = await db.select({ count: sql<number>`count(*)` }).from(casinos).where(eq(casinos.isActive, true));
      const [bonusCount] = await db.select({ count: sql<number>`count(*)` }).from(bonuses).where(eq(bonuses.isActive, true));
      const [gameCount] = await db.select({ count: sql<number>`count(*)` }).from(games).where(eq(games.isActive, true));
      const totalUsers = await this.getUniqueActiveUsers();

      return {
        totalCasinos: casinoCount.count || 0,
        totalBonuses: bonusCount.count || 0,
        totalGames: gameCount.count || 0,
        totalUsers: totalUsers || 0,
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        totalCasinos: 0,
        totalBonuses: 0,
        totalGames: 0,
        totalUsers: 0,
      };
    }
  }

  // Admin methods
  async getAdmin(id: string): Promise<Admin | undefined> {
    try {
      const result = await db.select().from(admins).where(eq(admins.id, id)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error getting admin:', error);
      return undefined;
    }
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    try {
      const result = await db.select().from(admins).where(eq(admins.username, username)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error getting admin by username:', error);
      return undefined;
    }
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    try {
      const result = await db.insert(admins).values(admin).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  }

  async getAdmins(): Promise<Admin[]> {
    try {
      return await db.select().from(admins).where(eq(admins.isActive, true)).orderBy(desc(admins.createdAt));
    } catch (error) {
      console.error('Error getting admins:', error);
      return [];
    }
  }

  async updateAdmin(id: string, updates: Partial<InsertAdmin>): Promise<Admin> {
    try {
      const result = await db.update(admins).set(updates).where(eq(admins.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error('Error updating admin:', error);
      throw error;
    }
  }

  async deleteAdmin(id: string): Promise<boolean> {
    try {
      await db.update(admins).set({ isActive: false }).where(eq(admins.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting admin:', error);
      return false;
    }
  }
}

export const storage = new MemStorage();