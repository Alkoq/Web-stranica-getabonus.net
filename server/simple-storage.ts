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
  type InsertAdmin
} from "@shared/schema";
import { randomUUID } from "crypto";
import fs from 'fs/promises';
import path from 'path';

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

class SimpleStorage {
  private dataPath = path.join(process.cwd(), 'server/local-data.json');
  
  async loadData() {
    try {
      const data = await fs.readFile(this.dataPath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return { users: [], casinos: [], bonuses: [], games: [], reviews: [], expertReviews: [], blogPosts: [], newsletterSubscribers: [], userInteractions: [], comparisons: [], admins: [] };
    }
  }

  async saveData(data: any) {
    await fs.writeFile(this.dataPath, JSON.stringify(data, null, 2));
  }

  async getUser(id: string): Promise<User | undefined> {
    const data = await this.loadData();
    return data.users.find((u: any) => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const data = await this.loadData();
    return data.users.find((u: any) => u.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const data = await this.loadData();
    return data.users.find((u: any) => u.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const data = await this.loadData();
    const user = { ...insertUser, id: randomUUID(), createdAt: new Date() };
    data.users.push(user);
    await this.saveData(data);
    return user as User;
  }

  async getCasinos(filters?: CasinoFilters): Promise<Casino[]> {
    const data = await this.loadData();
    let casinos = data.casinos.filter((c: any) => c.isActive);
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      casinos = casinos.filter((c: any) => 
        c.name.toLowerCase().includes(searchLower) ||
        (c.description && c.description.toLowerCase().includes(searchLower))
      );
    }
    return casinos;
  }

  async getFeaturedCasinos(): Promise<Casino[]> {
    const data = await this.loadData();
    return data.casinos.filter((c: any) => c.isActive && c.isFeatured);
  }

  async getCasino(id: string): Promise<Casino | undefined> {
    const data = await this.loadData();
    return data.casinos.find((c: any) => c.id === id);
  }

  async createCasino(casino: InsertCasino): Promise<Casino> {
    const data = await this.loadData();
    const newCasino = { ...casino, id: randomUUID(), createdAt: new Date(), updatedAt: new Date() };
    data.casinos.push(newCasino);
    await this.saveData(data);
    return newCasino as Casino;
  }

  async updateCasino(id: string, updates: Partial<InsertCasino>): Promise<Casino> {
    const data = await this.loadData();
    const index = data.casinos.findIndex((c: any) => c.id === id);
    if (index === -1) throw new Error('Casino not found');
    data.casinos[index] = { ...data.casinos[index], ...updates, updatedAt: new Date() };
    await this.saveData(data);
    return data.casinos[index];
  }

  async getBonuses(casinoId?: string): Promise<Bonus[]> {
    const data = await this.loadData();
    let bonuses = data.bonuses.filter((b: any) => b.isActive);
    if (casinoId) {
      bonuses = bonuses.filter((b: any) => b.casinoId === casinoId);
    }
    return bonuses;
  }

  async getFeaturedBonuses(): Promise<Bonus[]> {
    const data = await this.loadData();
    return data.bonuses.filter((b: any) => b.isActive && b.isFeatured);
  }

  async getBonus(id: string): Promise<Bonus | undefined> {
    const data = await this.loadData();
    return data.bonuses.find((b: any) => b.id === id);
  }

  async createBonus(bonus: InsertBonus): Promise<Bonus> {
    const data = await this.loadData();
    const newBonus = { ...bonus, id: randomUUID(), createdAt: new Date(), updatedAt: new Date() };
    data.bonuses.push(newBonus);
    await this.saveData(data);
    return newBonus as Bonus;
  }

  async updateBonus(id: string, updates: Partial<InsertBonus>): Promise<Bonus> {
    const data = await this.loadData();
    const index = data.bonuses.findIndex((b: any) => b.id === id);
    if (index === -1) throw new Error('Bonus not found');
    data.bonuses[index] = { ...data.bonuses[index], ...updates, updatedAt: new Date() };
    await this.saveData(data);
    return data.bonuses[index];
  }

  async getGames(filters?: GameFilters): Promise<Game[]> {
    const data = await this.loadData();
    let games = data.games.filter((g: any) => g.isActive);
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      games = games.filter((g: any) => 
        g.name.toLowerCase().includes(searchLower) ||
        (g.description && g.description.toLowerCase().includes(searchLower))
      );
    }
    return games;
  }

  async getGame(id: string): Promise<Game | undefined> {
    const data = await this.loadData();
    return data.games.find((g: any) => g.id === id);
  }

  async createGame(game: InsertGame): Promise<Game> {
    const data = await this.loadData();
    const newGame = { ...game, id: randomUUID(), createdAt: new Date(), updatedAt: new Date() };
    data.games.push(newGame);
    await this.saveData(data);
    return newGame as Game;
  }

  async updateGame(id: string, updates: Partial<InsertGame>): Promise<Game> {
    const data = await this.loadData();
    const index = data.games.findIndex((g: any) => g.id === id);
    if (index === -1) throw new Error('Game not found');
    data.games[index] = { ...data.games[index], ...updates, updatedAt: new Date() };
    await this.saveData(data);
    return data.games[index];
  }

  async getGamesByCasinoId(casinoId: string): Promise<Game[]> {
    const data = await this.loadData();
    return data.games.filter((g: any) => g.isActive);
  }

  async getCasinosByGameId(gameId: string): Promise<Casino[]> {
    const data = await this.loadData();
    return data.casinos.filter((c: any) => c.isActive);
  }

  async getReviewsByCasino(casinoId: string): Promise<Review[]> {
    const data = await this.loadData();
    return data.reviews.filter((r: any) => r.casinoId === casinoId);
  }

  async getReviewsByBonusId(bonusId: string): Promise<Review[]> {
    const data = await this.loadData();
    return data.reviews.filter((r: any) => r.bonusId === bonusId);
  }

  async getReviewsByGameId(gameId: string): Promise<Review[]> {
    const data = await this.loadData();
    return data.reviews.filter((r: any) => r.gameId === gameId);
  }

  async getReview(id: string): Promise<Review | undefined> {
    const data = await this.loadData();
    return data.reviews.find((r: any) => r.id === id);
  }

  async createReview(review: InsertReview): Promise<Review> {
    const data = await this.loadData();
    const newReview = { ...review, id: randomUUID(), helpfulVotes: 0, createdAt: new Date(), updatedAt: new Date() };
    data.reviews.push(newReview);
    await this.saveData(data);
    return newReview as Review;
  }

  async addHelpfulVote(reviewId: string): Promise<Review> {
    const data = await this.loadData();
    const review = data.reviews.find((r: any) => r.id === reviewId);
    if (!review) throw new Error('Review not found');
    review.helpfulVotes = (review.helpfulVotes || 0) + 1;
    await this.saveData(data);
    return review;
  }

  async getExpertReviewsByCasino(casinoId: string): Promise<ExpertReview[]> {
    const data = await this.loadData();
    return data.expertReviews.filter((r: any) => r.casinoId === casinoId);
  }

  async getExpertReview(id: string): Promise<ExpertReview | undefined> {
    const data = await this.loadData();
    return data.expertReviews.find((r: any) => r.id === id);
  }

  async createExpertReview(review: InsertExpertReview): Promise<ExpertReview> {
    const data = await this.loadData();
    const newReview = { ...review, id: randomUUID(), createdAt: new Date(), updatedAt: new Date() };
    data.expertReviews.push(newReview);
    await this.saveData(data);
    return newReview as ExpertReview;
  }

  async getBlogPosts(published?: boolean): Promise<BlogPost[]> {
    const data = await this.loadData();
    let posts = data.blogPosts;
    if (published !== undefined) {
      posts = posts.filter((p: any) => p.isPublished === published);
    }
    return posts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const data = await this.loadData();
    return data.blogPosts.find((p: any) => p.id === id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const data = await this.loadData();
    return data.blogPosts.find((p: any) => p.slug === slug);
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const data = await this.loadData();
    const newPost = { ...post, id: randomUUID(), createdAt: new Date(), updatedAt: new Date() };
    data.blogPosts.push(newPost);
    await this.saveData(data);
    return newPost as BlogPost;
  }

  async updateBlogPost(id: string, updates: Partial<InsertBlogPost>): Promise<BlogPost> {
    const data = await this.loadData();
    const index = data.blogPosts.findIndex((p: any) => p.id === id);
    if (index === -1) throw new Error('Blog post not found');
    data.blogPosts[index] = { ...data.blogPosts[index], ...updates, updatedAt: new Date() };
    await this.saveData(data);
    return data.blogPosts[index];
  }

  async subscribeNewsletter(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const data = await this.loadData();
    const newSubscriber = { ...subscriber, id: randomUUID(), isActive: true, subscribedAt: new Date() };
    data.newsletterSubscribers.push(newSubscriber);
    await this.saveData(data);
    return newSubscriber as NewsletterSubscriber;
  }

  async getNewsletterSubscriber(email: string): Promise<NewsletterSubscriber | undefined> {
    const data = await this.loadData();
    return data.newsletterSubscribers.find((s: any) => s.email === email);
  }

  async trackInteraction(interaction: InsertUserInteraction): Promise<UserInteraction> {
    const data = await this.loadData();
    const newInteraction = { ...interaction, id: randomUUID(), createdAt: new Date() };
    data.userInteractions.push(newInteraction);
    await this.saveData(data);
    return newInteraction as UserInteraction;
  }

  async getUniqueActiveUsers(): Promise<number> {
    const data = await this.loadData();
    const uniqueUsers = new Set(data.userInteractions.map((i: any) => i.userId));
    return uniqueUsers.size;
  }

  async createComparison(comparison: InsertComparison): Promise<Comparison> {
    const data = await this.loadData();
    const newComparison = { ...comparison, id: randomUUID(), createdAt: new Date() };
    data.comparisons.push(newComparison);
    await this.saveData(data);
    return newComparison as Comparison;
  }

  async getComparison(id: string): Promise<Comparison | undefined> {
    const data = await this.loadData();
    return data.comparisons.find((c: any) => c.id === id);
  }

  async getUserReviewsAverageRating(casinoId: string): Promise<number> {
    const data = await this.loadData();
    const reviews = data.reviews.filter((r: any) => r.casinoId === casinoId);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc: number, review: any) => acc + (review.overallRating || 0), 0);
    return sum / reviews.length;
  }

  async getCasinoSafetyRating(casinoId: string): Promise<number> {
    const data = await this.loadData();
    const casino = data.casinos.find((c: any) => c.id === casinoId);
    return casino ? parseFloat(casino.safetyIndex || '0') : 0;
  }

  async getBonusUserReviewsAverageRating(bonusId: string): Promise<number> {
    const data = await this.loadData();
    const reviews = data.reviews.filter((r: any) => r.bonusId === bonusId);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc: number, review: any) => acc + (review.overallRating || 0), 0);
    return sum / reviews.length;
  }

  async getStats(): Promise<{ totalCasinos: number; totalBonuses: number; totalGames: number; totalUsers: number; }> {
    const data = await this.loadData();
    return {
      totalCasinos: data.casinos.filter((c: any) => c.isActive).length,
      totalBonuses: data.bonuses.filter((b: any) => b.isActive).length,
      totalGames: data.games.filter((g: any) => g.isActive).length,
      totalUsers: data.users.length,
    };
  }

  async getAdmin(id: string): Promise<Admin | undefined> {
    const data = await this.loadData();
    return data.admins.find((a: any) => a.id === id);
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const data = await this.loadData();
    return data.admins.find((a: any) => a.username === username);
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const data = await this.loadData();
    const newAdmin = { ...admin, id: randomUUID(), createdAt: new Date() };
    data.admins.push(newAdmin);
    await this.saveData(data);
    return newAdmin as Admin;
  }

  async getAdmins(): Promise<Admin[]> {
    const data = await this.loadData();
    return data.admins.filter((a: any) => a.isActive);
  }

  async updateAdmin(id: string, updates: Partial<InsertAdmin>): Promise<Admin> {
    const data = await this.loadData();
    const index = data.admins.findIndex((a: any) => a.id === id);
    if (index === -1) throw new Error('Admin not found');
    data.admins[index] = { ...data.admins[index], ...updates };
    await this.saveData(data);
    return data.admins[index];
  }

  async deleteAdmin(id: string): Promise<boolean> {
    const data = await this.loadData();
    const index = data.admins.findIndex((a: any) => a.id === id);
    if (index === -1) return false;
    data.admins[index].isActive = false;
    await this.saveData(data);
    return true;
  }
}

export const storage = new SimpleStorage();