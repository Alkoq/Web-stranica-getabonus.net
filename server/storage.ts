import { 
  type User, 
  type InsertUser,
  type Casino,
  type InsertCasino,
  type Bonus,
  type InsertBonus,
  type Review,
  type InsertReview,
  type BlogPost,
  type InsertBlogPost,
  type NewsletterSubscriber,
  type InsertNewsletterSubscriber,
  type Comparison,
  type InsertComparison
} from "@shared/schema";
import { randomUUID } from "crypto";

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
  getReview(id: string): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;

  // Blog Posts
  getBlogPosts(published?: boolean): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;

  // Newsletter
  subscribeNewsletter(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  getNewsletterSubscriber(email: string): Promise<NewsletterSubscriber | undefined>;

  // Comparisons
  createComparison(comparison: InsertComparison): Promise<Comparison>;
  getComparison(id: string): Promise<Comparison | undefined>;
}

export interface CasinoFilters {
  minSafetyIndex?: number;
  license?: string;
  paymentMethods?: string[];
  features?: string[];
  search?: string;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private casinos: Map<string, Casino> = new Map();
  private bonuses: Map<string, Bonus> = new Map();
  private reviews: Map<string, Review> = new Map();
  private blogPosts: Map<string, BlogPost> = new Map();
  private newsletterSubscribers: Map<string, NewsletterSubscriber> = new Map();
  private comparisons: Map<string, Comparison> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize with real casino data based on the web-sourced content
    const stakeCasino: Casino = {
      id: randomUUID(),
      name: "Stake",
      description: "Stake is one of the most reputable Bitcoin casinos, offering provably fair games, sports betting, and exclusive VIP rewards.",
      logoUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
      websiteUrl: "https://stake.com",
      affiliateUrl: "https://stake.com/?c=jGfXsQoX",
      safetyIndex: "9.2",
      userRating: "4.8",
      totalReviews: 1234,
      establishedYear: 2017,
      license: "Curacao eGaming",
      paymentMethods: ["Bitcoin", "Ethereum", "Litecoin", "Dogecoin"],
      supportedCurrencies: ["BTC", "ETH", "LTC", "DOGE", "USD"],
      gameProviders: ["Pragmatic Play", "Evolution", "NetEnt", "Play'n GO"],
      features: ["Crypto Casino", "Provably Fair", "Mobile Optimized", "VIP Program", "Sports Betting"],
      isFeatured: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const roobetCasino: Casino = {
      id: randomUUID(),
      name: "Roobet",
      description: "Roobet features original crypto games, regular promotions, and strong presence in the streaming community.",
      logoUrl: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
      websiteUrl: "https://roobet.com",
      affiliateUrl: "https://roobet.com/?ref=alkox",
      safetyIndex: "8.9",
      userRating: "4.6",
      totalReviews: 987,
      establishedYear: 2019,
      license: "Curacao eGaming",
      paymentMethods: ["Bitcoin", "Ethereum", "Litecoin"],
      supportedCurrencies: ["BTC", "ETH", "LTC"],
      gameProviders: ["Roobet Originals", "Pragmatic Play", "Evolution"],
      features: ["Multi-Crypto", "Original Games", "Streaming Community", "Mobile Optimized"],
      isFeatured: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const bcGameCasino: Casino = {
      id: randomUUID(),
      name: "BC.Game",
      description: "Accepting 60+ coins, BC.Game provides generous welcome bonuses, a task system, and daily spin rewards for crypto players.",
      logoUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
      websiteUrl: "https://bc.game",
      affiliateUrl: "https://bc.game/i-3abbzjemx-n/",
      safetyIndex: "8.7",
      userRating: "4.5",
      totalReviews: 1567,
      establishedYear: 2017,
      license: "Curacao eGaming",
      paymentMethods: ["Bitcoin", "Ethereum", "60+ Cryptocurrencies"],
      supportedCurrencies: ["BTC", "ETH", "USDT", "BNB", "ADA", "DOT"],
      gameProviders: ["Pragmatic Play", "Evolution", "Hacksaw Gaming", "BGaming"],
      features: ["60+ Cryptocurrencies", "Task System", "Daily Rewards", "Mobile Optimized"],
      isFeatured: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.casinos.set(stakeCasino.id, stakeCasino);
    this.casinos.set(roobetCasino.id, roobetCasino);
    this.casinos.set(bcGameCasino.id, bcGameCasino);

    // Initialize bonuses
    const stakeBonus: Bonus = {
      id: randomUUID(),
      casinoId: stakeCasino.id,
      title: "Up to 560,000 GC + $56 Stake Cash",
      description: "Exclusive welcome package with Gold Coins and Stake Cash plus 5% rakeback",
      type: "welcome",
      amount: "560,000 GC + $56 SC",
      wageringRequirement: "1x",
      terms: "New players only. 18+. T&Cs apply.",
      isFeatured: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const roobetBonus: Bonus = {
      id: randomUUID(),
      casinoId: roobetCasino.id,
      title: "Welcome Package",
      description: "Exclusive bonus + regular promotions for new players",
      type: "welcome",
      amount: "Welcome Package",
      terms: "New players only. 18+. T&Cs apply.",
      isFeatured: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const bcGameBonus: Bonus = {
      id: randomUUID(),
      casinoId: bcGameCasino.id,
      title: "300% Welcome Bonus",
      description: "Generous welcome bonus with daily spin rewards and task system",
      type: "welcome",
      amount: "300%",
      terms: "New players only. 18+. T&Cs apply.",
      isFeatured: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.bonuses.set(stakeBonus.id, stakeBonus);
    this.bonuses.set(roobetBonus.id, roobetBonus);
    this.bonuses.set(bcGameBonus.id, bcGameBonus);

    // Initialize blog posts based on web content
    const blogPost1: BlogPost = {
      id: randomUUID(),
      title: "🥇 Stake vs Roobet: The Ultimate Crypto Casino Showdown of 2025",
      slug: "stake-vs-roobet-crypto-casino-showdown-2025",
      excerpt: "If you're wondering which is the better choice between Stake and Roobet casinos, you've come to the right place. In the competitive world of crypto casinos, these two names often dominate the discussion.",
      content: "Complete comparison content...",
      featuredImage: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80",
      category: "Review",
      tags: ["Stake", "Roobet", "Crypto Casino", "Comparison"],
      readTime: 5,
      isPublished: true,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const blogPost2: BlogPost = {
      id: randomUUID(),
      title: "Is Rollbit Legal in 2025? Bonus Codes, Cashback, and Geo-Restrictions Explained",
      slug: "rollbit-legal-2025-bonus-codes-cashback",
      excerpt: "Rollbit has rapidly grown into one of the most talked-about crypto casinos and gambling platforms online. Its unique combination of provably fair games, high-volume trading options, NFT integrations, and generous cashback systems has positioned it as a favorite among crypto gamblers.",
      content: "Complete legal analysis content...",
      featuredImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80",
      category: "Guide",
      tags: ["Rollbit", "Legal", "Crypto Casino", "Regulations"],
      readTime: 8,
      isPublished: true,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.blogPosts.set(blogPost1.id, blogPost1);
    this.blogPosts.set(blogPost2.id, blogPost2);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Casino methods
  async getCasinos(filters?: CasinoFilters): Promise<Casino[]> {
    let casinos = Array.from(this.casinos.values()).filter(casino => casino.isActive);
    
    if (filters) {
      if (filters.minSafetyIndex) {
        casinos = casinos.filter(casino => parseFloat(casino.safetyIndex) >= filters.minSafetyIndex!);
      }
      if (filters.license) {
        casinos = casinos.filter(casino => casino.license === filters.license);
      }
      if (filters.paymentMethods && filters.paymentMethods.length > 0) {
        casinos = casinos.filter(casino => 
          filters.paymentMethods!.some(method => casino.paymentMethods.includes(method))
        );
      }
      if (filters.features && filters.features.length > 0) {
        casinos = casinos.filter(casino => 
          filters.features!.some(feature => casino.features.includes(feature))
        );
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        casinos = casinos.filter(casino => 
          casino.name.toLowerCase().includes(search) ||
          casino.description?.toLowerCase().includes(search)
        );
      }
    }
    
    return casinos.sort((a, b) => parseFloat(b.safetyIndex) - parseFloat(a.safetyIndex));
  }

  async getFeaturedCasinos(): Promise<Casino[]> {
    return Array.from(this.casinos.values())
      .filter(casino => casino.isFeatured && casino.isActive)
      .sort((a, b) => parseFloat(b.safetyIndex) - parseFloat(a.safetyIndex));
  }

  async getCasino(id: string): Promise<Casino | undefined> {
    return this.casinos.get(id);
  }

  async createCasino(insertCasino: InsertCasino): Promise<Casino> {
    const id = randomUUID();
    const casino: Casino = {
      ...insertCasino,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.casinos.set(id, casino);
    return casino;
  }

  async updateCasino(id: string, updates: Partial<InsertCasino>): Promise<Casino> {
    const casino = this.casinos.get(id);
    if (!casino) {
      throw new Error(`Casino with id ${id} not found`);
    }
    const updatedCasino = { ...casino, ...updates, updatedAt: new Date() };
    this.casinos.set(id, updatedCasino);
    return updatedCasino;
  }

  // Bonus methods
  async getBonuses(casinoId?: string): Promise<Bonus[]> {
    let bonuses = Array.from(this.bonuses.values()).filter(bonus => bonus.isActive);
    if (casinoId) {
      bonuses = bonuses.filter(bonus => bonus.casinoId === casinoId);
    }
    return bonuses.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getFeaturedBonuses(): Promise<Bonus[]> {
    return Array.from(this.bonuses.values())
      .filter(bonus => bonus.isFeatured && bonus.isActive)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getBonus(id: string): Promise<Bonus | undefined> {
    return this.bonuses.get(id);
  }

  async createBonus(insertBonus: InsertBonus): Promise<Bonus> {
    const id = randomUUID();
    const bonus: Bonus = {
      ...insertBonus,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.bonuses.set(id, bonus);
    return bonus;
  }

  // Review methods
  async getReviewsByCasino(casinoId: string): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.casinoId === casinoId && review.isPublished)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getReview(id: string): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = {
      ...insertReview,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.reviews.set(id, review);
    return review;
  }

  // Blog methods
  async getBlogPosts(published = true): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => !published || post.isPublished)
      .sort((a, b) => (b.publishedAt || b.createdAt).getTime() - (a.publishedAt || a.createdAt).getTime());
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }

  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const blogPost: BlogPost = {
      ...insertBlogPost,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }

  // Newsletter methods
  async subscribeNewsletter(insertSubscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const id = randomUUID();
    const subscriber: NewsletterSubscriber = {
      ...insertSubscriber,
      id,
      subscribedAt: new Date(),
    };
    this.newsletterSubscribers.set(id, subscriber);
    return subscriber;
  }

  async getNewsletterSubscriber(email: string): Promise<NewsletterSubscriber | undefined> {
    return Array.from(this.newsletterSubscribers.values()).find(sub => sub.email === email);
  }

  // Comparison methods
  async createComparison(insertComparison: InsertComparison): Promise<Comparison> {
    const id = randomUUID();
    const comparison: Comparison = {
      ...insertComparison,
      id,
      createdAt: new Date(),
    };
    this.comparisons.set(id, comparison);
    return comparison;
  }

  async getComparison(id: string): Promise<Comparison | undefined> {
    return this.comparisons.get(id);
  }
}

export const storage = new MemStorage();
