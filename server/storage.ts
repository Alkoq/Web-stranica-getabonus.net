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
  type Comparison,
  type InsertComparison,
  type Game,
  type InsertGame,
  users, casinos, bonuses, reviews, expertReviews, blogPosts, newsletterSubscribers, comparisons, games
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

  // Comparisons
  createComparison(comparison: InsertComparison): Promise<Comparison>;
  getComparison(id: string): Promise<Comparison | undefined>;

  // Games
  getGames(filters?: GameFilters): Promise<Game[]>;
  getGame(id: string): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;

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

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private casinos: Map<string, Casino> = new Map();
  private bonuses: Map<string, Bonus> = new Map();
  private reviews: Map<string, Review> = new Map();
  private expertReviews: Map<string, ExpertReview> = new Map();
  private blogPosts: Map<string, BlogPost> = new Map();
  private newsletterSubscribers: Map<string, NewsletterSubscriber> = new Map();
  private comparisons: Map<string, Comparison> = new Map();
  private games: Map<string, Game> = new Map();

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

    // Add more casinos for better competition
    const rollbitCasino: Casino = {
      id: randomUUID(),
      name: "Rollbit",
      description: "Innovative crypto casino with NFT integration, sports betting, and provably fair games with high cashback rewards.",
      logoUrl: "https://images.unsplash.com/photo-1634704784915-aacf363b021e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
      websiteUrl: "https://rollbit.com",
      affiliateUrl: "https://rollbit.com/r/GetABonus",
      safetyIndex: "8.8",
      userRating: "4.7",
      totalReviews: 892,
      establishedYear: 2020,
      license: "Curacao eGaming",
      paymentMethods: ["Bitcoin", "Ethereum", "USDT", "Solana"],
      supportedCurrencies: ["BTC", "ETH", "USDT", "SOL", "BNB"],
      gameProviders: ["Pragmatic Play", "Evolution", "Hacksaw Gaming", "Rollbit Originals"],
      features: ["NFT Integration", "High Cashback", "Sports Betting", "Provably Fair"],
      isFeatured: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const bitcasinoCasino: Casino = {
      id: randomUUID(),
      name: "Bitcasino",
      description: "Pioneer in Bitcoin gaming since 2014, offering instant deposits, anonymous play, and exclusive Bitcoin bonuses.",
      logoUrl: "https://images.unsplash.com/photo-1621761158633-eeab96aaeebc?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
      websiteUrl: "https://bitcasino.io",
      affiliateUrl: "https://bitcasino.io/ref/GetABonus",
      safetyIndex: "9.0",
      userRating: "4.6",
      totalReviews: 2156,
      establishedYear: 2014,
      license: "Curacao eGaming",
      paymentMethods: ["Bitcoin", "Ethereum", "Litecoin", "Tether"],
      supportedCurrencies: ["BTC", "ETH", "LTC", "USDT", "EUR", "USD"],
      gameProviders: ["Evolution", "Pragmatic Play", "NetEnt", "Microgaming"],
      features: ["Anonymous Play", "Instant Deposits", "VIP Rewards", "Live Dealer"],
      isFeatured: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const fortunejackCasino: Casino = {
      id: randomUUID(),
      name: "FortuneJack",
      description: "Established crypto casino with extensive game library, competitive sports betting, and loyalty program rewards.",
      logoUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
      websiteUrl: "https://fortunejack.com",
      affiliateUrl: "https://fortunejack.com/?ref=GetABonus",
      safetyIndex: "8.6",
      userRating: "4.4",
      totalReviews: 1789,
      establishedYear: 2014,
      license: "Curacao eGaming",
      paymentMethods: ["Bitcoin", "Ethereum", "Dogecoin", "Monero"],
      supportedCurrencies: ["BTC", "ETH", "DOGE", "XMR", "LTC"],
      gameProviders: ["NetEnt", "Microgaming", "Betsoft", "Amatic"],
      features: ["Loyalty Program", "Sports Betting", "Live Casino", "Jackpot Games"],
      isFeatured: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const cloudBetCasino: Casino = {
      id: randomUUID(),
      name: "CloudBet",
      description: "Premium crypto sportsbook and casino offering competitive odds, live betting, and comprehensive crypto support.",
      logoUrl: "https://images.unsplash.com/photo-1640161704729-cbe966a08476?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
      websiteUrl: "https://cloudbet.com",
      affiliateUrl: "https://cloudbet.com/ref/GetABonus",
      safetyIndex: "8.9",
      userRating: "4.5",
      totalReviews: 1432,
      establishedYear: 2013,
      license: "Curacao eGaming",
      paymentMethods: ["Bitcoin", "Bitcoin Cash", "Ethereum", "Litecoin"],
      supportedCurrencies: ["BTC", "BCH", "ETH", "LTC", "USDT"],
      gameProviders: ["Evolution", "Pragmatic Play", "Red Tiger", "Yggdrasil"],
      features: ["Live Betting", "Competitive Odds", "Mobile App", "Fast Withdrawals"],
      isFeatured: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const bitStarzCasino: Casino = {
      id: randomUUID(),
      name: "BitStarz",
      description: "Award-winning hybrid casino accepting both crypto and fiat, known for fast payouts and excellent customer service.",
      logoUrl: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
      websiteUrl: "https://bitstarz.com",
      affiliateUrl: "https://bitstarz.com/ref/GetABonus",
      safetyIndex: "9.1",
      userRating: "4.7",
      totalReviews: 3421,
      establishedYear: 2014,
      license: "Curacao eGaming",
      paymentMethods: ["Bitcoin", "Ethereum", "Credit Card", "Bank Transfer"],
      supportedCurrencies: ["BTC", "ETH", "EUR", "USD", "CAD", "AUD"],
      gameProviders: ["NetEnt", "Microgaming", "Betsoft", "Evolution"],
      features: ["Hybrid Casino", "Fast Payouts", "24/7 Support", "Mobile Optimized"],
      isFeatured: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const duelbitsCasino: Casino = {
      id: randomUUID(),
      name: "Duelbits",
      description: "Modern crypto casino with battles feature, extensive game selection, and generous bonuses for cryptocurrency players.",
      logoUrl: "https://images.unsplash.com/photo-1634757439710-1da5d4be4c4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
      websiteUrl: "https://duelbits.com",
      affiliateUrl: "https://duelbits.com/ref/GetABonus",
      safetyIndex: "8.5",
      userRating: "4.3",
      totalReviews: 756,
      establishedYear: 2020,
      license: "Curacao eGaming",
      paymentMethods: ["Bitcoin", "Ethereum", "Litecoin", "Dogecoin"],
      supportedCurrencies: ["BTC", "ETH", "LTC", "DOGE", "USDT"],
      gameProviders: ["Pragmatic Play", "Hacksaw Gaming", "BGaming", "Relax Gaming"],
      features: ["Battles Feature", "Crypto Focus", "Regular Promotions", "User-Friendly"],
      isFeatured: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.casinos.set(stakeCasino.id, stakeCasino);
    this.casinos.set(roobetCasino.id, roobetCasino);
    this.casinos.set(bcGameCasino.id, bcGameCasino);
    this.casinos.set(rollbitCasino.id, rollbitCasino);
    this.casinos.set(bitcasinoCasino.id, bitcasinoCasino);
    this.casinos.set(fortunejackCasino.id, fortunejackCasino);
    this.casinos.set(cloudBetCasino.id, cloudBetCasino);
    this.casinos.set(bitStarzCasino.id, bitStarzCasino);
    this.casinos.set(duelbitsCasino.id, duelbitsCasino);

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

    // Add bonuses for new casinos
    const rollbitBonus: Bonus = {
      id: randomUUID(),
      casinoId: rollbitCasino.id,
      title: "100% Welcome Bonus + NFTs",
      description: "Get bonus funds plus exclusive NFT rewards and high cashback rates",
      type: "welcome",
      amount: "100% + NFTs",
      wageringRequirement: "30x",
      terms: "New players only. 18+. T&Cs apply.",
      isFeatured: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const bitcasinoBonus: Bonus = {
      id: randomUUID(),
      casinoId: bitcasinoCasino.id,
      title: "Bitcoin Welcome Package",
      description: "Exclusive Bitcoin bonuses with instant deposits and anonymous play",
      type: "welcome",
      amount: "BTC Welcome Package",
      terms: "New players only. 18+. T&Cs apply.",
      isFeatured: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const fortunejackBonus: Bonus = {
      id: randomUUID(),
      casinoId: fortunejackCasino.id,
      title: "Loyalty Program Rewards",
      description: "Earn points with every bet and unlock exclusive rewards",
      type: "loyalty",
      amount: "Loyalty Points",
      terms: "Active players. 18+. T&Cs apply.",
      isFeatured: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const cloudBetBonus: Bonus = {
      id: randomUUID(),
      casinoId: cloudBetCasino.id,
      title: "Sports & Casino Combo",
      description: "Bonus for both sportsbook and casino with competitive odds",
      type: "welcome",
      amount: "Combo Bonus",
      terms: "New players only. 18+. T&Cs apply.",
      isFeatured: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const bitStarzBonus: Bonus = {
      id: randomUUID(),
      casinoId: bitStarzCasino.id,
      title: "Hybrid Casino Bonus",
      description: "Bonus for both crypto and fiat deposits with fast payouts",
      type: "welcome",
      amount: "Hybrid Bonus",
      terms: "New players only. 18+. T&Cs apply.",
      isFeatured: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const duelbitsBonus: Bonus = {
      id: randomUUID(),
      casinoId: duelbitsCasino.id,
      title: "Battle Bonus Package",
      description: "Special bonus for battles feature and regular promotions",
      type: "welcome",
      amount: "Battle Package",
      terms: "New players only. 18+. T&Cs apply.",
      isFeatured: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.bonuses.set(stakeBonus.id, stakeBonus);
    this.bonuses.set(roobetBonus.id, roobetBonus);
    this.bonuses.set(bcGameBonus.id, bcGameBonus);
    this.bonuses.set(rollbitBonus.id, rollbitBonus);
    this.bonuses.set(bitcasinoBonus.id, bitcasinoBonus);
    this.bonuses.set(fortunejackBonus.id, fortunejackBonus);
    this.bonuses.set(cloudBetBonus.id, cloudBetBonus);
    this.bonuses.set(bitStarzBonus.id, bitStarzBonus);
    this.bonuses.set(duelbitsBonus.id, duelbitsBonus);

    // Initialize sample games data
    const sampleGames = [
      {
        id: randomUUID(),
        name: "Book of Dead",
        description: "Adventure-themed slot with expanding symbols and free spins",
        provider: "Play'n GO",
        type: "slot",
        rtp: "96.21",
        volatility: "High",
        minBet: "0.01",
        maxBet: "100.00",
        imageUrl: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=300&h=200&fit=crop",
        demoUrl: "#",
        tags: ["adventure", "egypt", "expanding wilds"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        name: "Starburst",
        description: "Classic arcade-style slot with expanding wilds",
        provider: "NetEnt",
        type: "slot",
        rtp: "96.09",
        volatility: "Low",
        minBet: "0.10",
        maxBet: "100.00",
        imageUrl: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=300&h=200&fit=crop",
        demoUrl: "#",
        tags: ["classic", "arcade", "wilds"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        name: "Lightning Roulette",
        description: "Live roulette with random lightning multipliers up to 500x",
        provider: "Evolution Gaming",
        type: "live",
        rtp: "97.30",
        volatility: "Medium",
        minBet: "0.20",
        maxBet: "5000.00",
        imageUrl: "https://images.unsplash.com/photo-1521130726557-5e7e0c665fd3?w=300&h=200&fit=crop",
        demoUrl: "#",
        tags: ["roulette", "live", "multipliers"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        name: "Blackjack Classic",
        description: "Classic blackjack with optimal strategy hints",
        provider: "NetEnt",
        type: "table",
        rtp: "99.28",
        volatility: "Low",
        minBet: "1.00",
        maxBet: "1000.00",
        imageUrl: "https://images.unsplash.com/photo-1569819563721-99d144ffa9b1?w=300&h=200&fit=crop",
        demoUrl: "#",
        tags: ["blackjack", "strategy", "classic"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        name: "Mega Moolah",
        description: "Progressive jackpot slot with life-changing wins",
        provider: "Microgaming",
        type: "slot",
        rtp: "88.12",
        volatility: "Medium",
        minBet: "0.25",
        maxBet: "6.25",
        imageUrl: "https://images.unsplash.com/photo-1607048771931-75af7b9c85ae?w=300&h=200&fit=crop",
        demoUrl: "#",
        tags: ["progressive", "jackpot", "safari"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        name: "Crazy Time",
        description: "Live game show with bonus rounds and multipliers",
        provider: "Evolution Gaming",
        type: "live",
        rtp: "96.08",
        volatility: "High",
        minBet: "0.10",
        maxBet: "2500.00",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
        demoUrl: "#",
        tags: ["game show", "bonus rounds", "multipliers"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        name: "European Roulette",
        description: "Classic European roulette with single zero",
        provider: "NetEnt",
        type: "table",
        rtp: "97.30",
        volatility: "Medium",
        minBet: "0.10",
        maxBet: "5000.00",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
        demoUrl: "#",
        tags: ["roulette", "european", "single zero"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        name: "Gates of Olympus",
        description: "Zeus-themed slot with multipliers and tumbling reels",
        provider: "Pragmatic Play",
        type: "slot",
        rtp: "96.50",
        volatility: "High",
        minBet: "0.20",
        maxBet: "125.00",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
        demoUrl: "#",
        tags: ["mythology", "multipliers", "tumbling reels"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    sampleGames.forEach(game => this.games.set(game.id, game));

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

    const blogPost3: BlogPost = {
      id: randomUUID(),
      title: "Best Crypto Casinos 2025: Complete Guide to Bitcoin Gambling",
      slug: "best-crypto-casinos-2025-bitcoin-gambling-guide",
      excerpt: "Discover the top cryptocurrency casinos of 2025, featuring the best Bitcoin gambling sites with proven fairness, excellent bonuses, and secure transactions.",
      content: "Complete crypto casino guide content...",
      featuredImage: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80",
      category: "Guide",
      tags: ["Crypto Casino", "Bitcoin", "Gambling", "2025"],
      readTime: 12,
      isPublished: true,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const blogPost4: BlogPost = {
      id: randomUUID(),
      title: "Provably Fair Games Explained: How Crypto Casinos Ensure Fairness",
      slug: "provably-fair-games-crypto-casinos-fairness",
      excerpt: "Learn how provably fair technology works in crypto casinos and why it's revolutionary for online gambling transparency and trust.",
      content: "Provably fair technology explanation...",
      featuredImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80",
      category: "Education",
      tags: ["Provably Fair", "Technology", "Crypto", "Fairness"],
      readTime: 8,
      isPublished: true,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const blogPost5: BlogPost = {
      id: randomUUID(),
      title: "Crypto Casino Bonuses Guide: Maximize Your Bitcoin Winnings",
      slug: "crypto-casino-bonuses-guide-bitcoin-winnings",
      excerpt: "Master the art of crypto casino bonuses. Learn about welcome bonuses, cashback offers, and VIP rewards to boost your cryptocurrency gambling profits.",
      content: "Comprehensive bonus guide content...",
      featuredImage: "https://images.unsplash.com/photo-1634704784915-aacf363b021e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80",
      category: "Strategy",
      tags: ["Bonuses", "Strategy", "Bitcoin", "Winnings"],
      readTime: 10,
      isPublished: true,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.blogPosts.set(blogPost1.id, blogPost1);
    this.blogPosts.set(blogPost2.id, blogPost2);
    this.blogPosts.set(blogPost3.id, blogPost3);
    this.blogPosts.set(blogPost4.id, blogPost4);
    this.blogPosts.set(blogPost5.id, blogPost5);

    // Initialize Expert Reviews for first few casinos
    const casinos = Array.from(this.casinos.values());
    if (casinos.length > 0) {
      // Create expert review for Stake
      const stakeExpertReview: ExpertReview = {
        id: randomUUID(),
        casinoId: casinos[0].id,
        authorId: randomUUID(),
        bonusesRating: "9.1",
        bonusesExplanation: "Excellent bonus variety with VIP program and regular promotions. Crypto bonuses are particularly strong.",
        designRating: "8.8",
        designExplanation: "Modern, sleek design with excellent user experience. Dark theme works well for crypto audience.",
        payoutsRating: "9.5",
        payoutsExplanation: "Instant crypto withdrawals and competitive RTP rates. Outstanding payout speed.",
        customerSupportRating: "8.7",
        customerSupportExplanation: "24/7 live chat support with knowledgeable agents. Response times could be faster.",
        gameSelectionRating: "9.2",
        gameSelectionExplanation: "Massive game library with exclusive Stake originals and top providers.",
        mobileExperienceRating: "9.0",
        mobileExperienceExplanation: "Excellent mobile optimization with full feature parity.",
        overallRating: "9.0",
        summary: "Stake sets the gold standard for crypto casinos with provably fair games, instant payouts, and an exceptional VIP program.",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Create expert review for Roobet
      const roobetExpertReview: ExpertReview = {
        id: randomUUID(),
        casinoId: casinos[1].id,
        authorId: randomUUID(),
        bonusesRating: "8.5",
        bonusesExplanation: "Solid welcome package and regular reload bonuses. Strong focus on community rewards.",
        designRating: "8.9",
        designExplanation: "Vibrant, gaming-focused design that appeals to streaming community.",
        payoutsRating: "8.8",
        payoutsExplanation: "Fast crypto withdrawals with competitive processing times.",
        customerSupportRating: "8.4",
        customerSupportExplanation: "Good support team with focus on community engagement.",
        gameSelectionRating: "8.6",
        gameSelectionExplanation: "Great selection of original games plus popular slots.",
        mobileExperienceRating: "8.7",
        mobileExperienceExplanation: "Good mobile experience with most features available.",
        overallRating: "8.6",
        summary: "Roobet excels in community building and original games, making it popular among streamers and social gamers.",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.expertReviews.set(stakeExpertReview.id, stakeExpertReview);
      this.expertReviews.set(roobetExpertReview.id, roobetExpertReview);

      // Add some user reviews for first two casinos
      const stakeUserReview1: Review = {
        id: randomUUID(),
        casinoId: casinos[0].id,
        userId: randomUUID(),
        title: "Excellent crypto casino experience",
        content: "Been playing here for over a year. Lightning fast withdrawals and great game selection.",
        overallRating: 9,
        bonusesRating: 8,
        designRating: 9,
        payoutsRating: 10,
        customerSupportRating: 8,
        gameSelectionRating: 9,
        mobileExperienceRating: 9,
        userName: "CryptoPlayer23",
        pros: ["Fast withdrawals", "Great games", "VIP program"],
        cons: ["Support could be faster"],
        isVerified: true,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const stakeUserReview2: Review = {
        id: randomUUID(),
        casinoId: casinos[0].id,
        userId: randomUUID(),
        title: "Best crypto casino",
        content: "Amazing bonuses and provably fair games. Highly recommend!",
        overallRating: 8,
        bonusesRating: 9,
        designRating: 8,
        payoutsRating: 9,
        customerSupportRating: 7,
        gameSelectionRating: 8,
        mobileExperienceRating: 8,
        userName: "BitcoinFan",
        pros: ["Provably fair", "Good bonuses"],
        cons: ["Limited fiat options"],
        isVerified: false,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const roobetUserReview: Review = {
        id: randomUUID(),
        casinoId: casinos[1].id,
        userId: randomUUID(),
        title: "Great for streamers",
        content: "Love the community aspect and original games. Perfect for streaming.",
        overallRating: 8,
        bonusesRating: 8,
        designRating: 9,
        payoutsRating: 8,
        customerSupportRating: 8,
        gameSelectionRating: 7,
        mobileExperienceRating: 8,
        userName: "StreamerGuy",
        pros: ["Original games", "Community features"],
        cons: ["Limited game providers"],
        isVerified: true,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.reviews.set(stakeUserReview1.id, stakeUserReview1);
      this.reviews.set(stakeUserReview2.id, stakeUserReview2);
      this.reviews.set(roobetUserReview.id, roobetUserReview);

      // Add sample bonus and game reviews to demonstrate rating system
      const stakeBonus = Array.from(this.bonuses.values()).find(b => b.casinoId === casinos[0].id);
      if (stakeBonus) {
        const stakeBonusReview: Review = {
          id: randomUUID(),
          bonusId: stakeBonus.id,
          userId: randomUUID(),
          title: "Excellent welcome bonus",
          content: "Amazing 560,000 Gold Coins plus $56 Stake Cash. Very fair wagering at 1x!",
          overallRating: 9,
          userName: "BonusHunter22",
          isVerified: true,
          isPublished: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.reviews.set(stakeBonusReview.id, stakeBonusReview);
      }

      const bookOfDead = Array.from(this.games.values()).find(g => g.name === "Book of Dead");
      if (bookOfDead) {
        const bookOfDeadReview: Review = {
          id: randomUUID(),
          gameId: bookOfDead.id,
          userId: randomUUID(),
          title: "Great adventure slot",
          content: "Love the expanding symbols and free spins. High volatility but worth it for big wins!",
          overallRating: 8,
          userName: "SlotFan99",
          isVerified: false,
          isPublished: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.reviews.set(bookOfDeadReview.id, bookOfDeadReview);
      }
    }
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

  async getReviewsByBonusId(bonusId: string): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.bonusId === bonusId && review.isPublished)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getReviewsByGameId(gameId: string): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.gameId === gameId && review.isPublished)
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
      helpfulVotes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.reviews.set(id, review);
    return review;
  }

  async addHelpfulVote(reviewId: string): Promise<Review> {
    const review = this.reviews.get(reviewId);
    if (!review) {
      throw new Error("Review not found");
    }
    
    const updatedReview: Review = {
      ...review,
      helpfulVotes: (review.helpfulVotes || 0) + 1,
      updatedAt: new Date(),
    };
    
    this.reviews.set(reviewId, updatedReview);
    return updatedReview;
  }

  // Calculate user reviews average rating for casino
  async getUserReviewsAverageRating(casinoId: string): Promise<number> {
    const reviews = await this.getReviewsByCasino(casinoId);
    if (reviews.length === 0) return 0;
    
    const sum = reviews.reduce((acc, review) => acc + review.overallRating, 0);
    return Math.round((sum / reviews.length) * 10) / 10; // Round to 1 decimal
  }

  // Calculate user reviews average rating for bonus
  async getBonusUserReviewsAverageRating(bonusId: string): Promise<number> {
    const reviews = await this.getReviewsByBonusId(bonusId);
    if (reviews.length === 0) return 0;
    
    const sum = reviews.reduce((acc, review) => acc + review.overallRating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }

  // Calculate user reviews average rating for game
  async getGameUserReviewsAverageRating(gameId: string): Promise<number> {
    const reviews = await this.getReviewsByGameId(gameId);
    if (reviews.length === 0) return 0;
    
    const sum = reviews.reduce((acc, review) => acc + review.overallRating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }

  // Calculate safety rating (average of expert rating and user reviews average)
  async getCasinoSafetyRating(casinoId: string): Promise<number> {
    const expertReviews = await this.getExpertReviewsByCasino(casinoId);
    const userReviewsAverage = await this.getUserReviewsAverageRating(casinoId);
    
    if (expertReviews.length === 0 && userReviewsAverage === 0) return 0;
    
    const expertRating = expertReviews.length > 0 ? parseFloat(expertReviews[0].overallRating.toString()) : 0;
    const safetyRating = expertRating > 0 && userReviewsAverage > 0 
      ? (expertRating + userReviewsAverage) / 2
      : expertRating > 0 ? expertRating : userReviewsAverage;
    
    return Math.round(safetyRating * 10) / 10;
  }

  // Expert Review methods
  async getExpertReviewsByCasino(casinoId: string): Promise<ExpertReview[]> {
    return Array.from(this.expertReviews.values())
      .filter(review => review.casinoId === casinoId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getExpertReview(id: string): Promise<ExpertReview | undefined> {
    return this.expertReviews.get(id);
  }

  async createExpertReview(insertReview: InsertExpertReview): Promise<ExpertReview> {
    const id = randomUUID();
    const review: ExpertReview = {
      ...insertReview,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.expertReviews.set(id, review);
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

  // Game methods
  async getGames(filters?: GameFilters): Promise<Game[]> {
    let games = Array.from(this.games.values()).filter(game => game.isActive);
    
    if (filters) {
      if (filters.type) {
        games = games.filter(game => game.type.toLowerCase() === filters.type!.toLowerCase());
      }
      if (filters.provider) {
        games = games.filter(game => game.provider.toLowerCase().includes(filters.provider!.toLowerCase()));
      }
      if (filters.volatility) {
        games = games.filter(game => game.volatility?.toLowerCase() === filters.volatility!.toLowerCase());
      }
      if (filters.minRtp) {
        games = games.filter(game => game.rtp && parseFloat(game.rtp) >= filters.minRtp!);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        games = games.filter(game => 
          game.name.toLowerCase().includes(searchLower) ||
          game.provider.toLowerCase().includes(searchLower) ||
          game.description?.toLowerCase().includes(searchLower) ||
          game.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
    }
    
    return games.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getGame(id: string): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const id = randomUUID();
    const game: Game = {
      ...insertGame,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.games.set(id, game);
    return game;
  }

  async getStats() {
    return {
      totalCasinos: this.casinos.size,
      totalBonuses: this.bonuses.size,
      totalGames: this.games.size,
      totalUsers: 24500  // Mock value for now
    };
  }
}

// Database Storage Implementation using Drizzle ORM
export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Casinos
  async getCasinos(filters?: CasinoFilters): Promise<Casino[]> {
    const allCasinos = await db.select().from(casinos).where(eq(casinos.isActive, true));
    
    if (!filters) {
      return allCasinos;
    }

    let filteredCasinos = allCasinos;

    if (filters.safetyIndex) {
      filteredCasinos = filteredCasinos.filter(casino => casino.safetyIndex === filters.safetyIndex);
    }
    
    if (filters.features && filters.features.length > 0) {
      filteredCasinos = filteredCasinos.filter(casino => 
        casino.features && filters.features!.every(feature => casino.features!.includes(feature))
      );
    }
    
    if (filters.paymentMethods && filters.paymentMethods.length > 0) {
      filteredCasinos = filteredCasinos.filter(casino => 
        casino.paymentMethods && filters.paymentMethods!.some(method => casino.paymentMethods!.includes(method))
      );
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredCasinos = filteredCasinos.filter(casino => 
        casino.name.toLowerCase().includes(searchLower) ||
        casino.description?.toLowerCase().includes(searchLower)
      );
    }

    return filteredCasinos;
  }

  async getFeaturedCasinos(): Promise<Casino[]> {
    return await db.select().from(casinos).where(and(eq(casinos.isFeatured, true), eq(casinos.isActive, true)));
  }

  async getCasino(id: string): Promise<Casino | undefined> {
    const [casino] = await db.select().from(casinos).where(eq(casinos.id, id));
    return casino || undefined;
  }

  async createCasino(insertCasino: InsertCasino): Promise<Casino> {
    const [casino] = await db.insert(casinos).values(insertCasino).returning();
    return casino;
  }

  async updateCasino(id: string, updates: Partial<InsertCasino>): Promise<Casino> {
    const [casino] = await db.update(casinos).set({ ...updates, updatedAt: new Date() }).where(eq(casinos.id, id)).returning();
    return casino;
  }

  // Bonuses
  async getBonuses(casinoId?: string): Promise<Bonus[]> {
    if (casinoId) {
      return await db.select().from(bonuses).where(and(eq(bonuses.casinoId, casinoId), eq(bonuses.isActive, true)));
    }
    return await db.select().from(bonuses).where(eq(bonuses.isActive, true));
  }

  async getFeaturedBonuses(): Promise<Bonus[]> {
    return await db.select().from(bonuses).where(and(eq(bonuses.isFeatured, true), eq(bonuses.isActive, true)));
  }

  async getBonus(id: string): Promise<Bonus | undefined> {
    const [bonus] = await db.select().from(bonuses).where(eq(bonuses.id, id));
    return bonus || undefined;
  }

  async createBonus(insertBonus: InsertBonus): Promise<Bonus> {
    const [bonus] = await db.insert(bonuses).values(insertBonus).returning();
    return bonus;
  }

  // Reviews
  async getReviewsByCasino(casinoId: string): Promise<Review[]> {
    return await db.select().from(reviews)
      .where(and(eq(reviews.casinoId, casinoId), eq(reviews.isPublished, true)))
      .orderBy(desc(reviews.createdAt));
  }

  async getReviewsByBonusId(bonusId: string): Promise<Review[]> {
    return await db.select().from(reviews)
      .where(and(eq(reviews.bonusId, bonusId), eq(reviews.isPublished, true)))
      .orderBy(desc(reviews.createdAt));
  }

  async getReviewsByGameId(gameId: string): Promise<Review[]> {
    return await db.select().from(reviews)
      .where(and(eq(reviews.gameId, gameId), eq(reviews.isPublished, true)))
      .orderBy(desc(reviews.createdAt));
  }

  async getReview(id: string): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review || undefined;
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const reviewData = {
      ...insertReview,
      id: randomUUID(),
      helpfulVotes: 0,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const [review] = await db.insert(reviews).values(reviewData).returning();
    return review;
  }

  async addHelpfulVote(reviewId: string): Promise<Review> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, reviewId));
    if (!review) {
      throw new Error("Review not found");
    }

    const [updatedReview] = await db.update(reviews)
      .set({ 
        helpfulVotes: (review.helpfulVotes || 0) + 1,
        updatedAt: new Date()
      })
      .where(eq(reviews.id, reviewId))
      .returning();
    
    return updatedReview;
  }

  // Calculate user reviews average rating for casino
  async getUserReviewsAverageRating(casinoId: string): Promise<number> {
    const casinoReviews = await this.getReviewsByCasino(casinoId);
    if (casinoReviews.length === 0) return 0;
    
    const sum = casinoReviews.reduce((acc, review) => acc + review.overallRating, 0);
    return Math.round((sum / casinoReviews.length) * 10) / 10;
  }

  // Calculate user reviews average rating for bonus
  async getBonusUserReviewsAverageRating(bonusId: string): Promise<number> {
    const bonusReviews = await this.getReviewsByBonusId(bonusId);
    if (bonusReviews.length === 0) return 0;
    
    const sum = bonusReviews.reduce((acc, review) => acc + review.overallRating, 0);
    return Math.round((sum / bonusReviews.length) * 10) / 10;
  }

  // Calculate user reviews average rating for game
  async getGameUserReviewsAverageRating(gameId: string): Promise<number> {
    const gameReviews = await this.getReviewsByGameId(gameId);
    if (gameReviews.length === 0) return 0;
    
    const sum = gameReviews.reduce((acc, review) => acc + review.overallRating, 0);
    return Math.round((sum / gameReviews.length) * 10) / 10;
  }

  // Get expert game review
  async getExpertGameReview(gameId: string): Promise<{ overall_rating: number } | null> {
    const result = await db.execute(sql`
      SELECT overall_rating 
      FROM expert_game_reviews 
      WHERE game_id = ${gameId} 
      LIMIT 1
    `);
    
    return result.rows[0] as { overall_rating: number } || null;
  }

  // Get fixed expert game rating - expert rating should remain constant
  async getCombinedGameRating(gameId: string): Promise<number> {
    const expertReview = await this.getExpertGameReview(gameId);
    
    if (!expertReview) {
      // Ako nema expert review, vratiti default expert rating
      return 8.2;
    }
    
    // Vratiti fiksni expert rating - ne mijenja se sa user reviews
    return parseFloat(expertReview.overall_rating.toString());
  }

  async getCasinoSafetyRating(casinoId: string): Promise<number> {
    const casino = await this.getCasino(casinoId);
    if (!casino) return 0;
    
    // Map safety index to numeric ratings
    const safetyMap: { [key: string]: number } = {
      'Vrlo visok': 10,
      'Visok': 8,
      'Umeren': 6,
      'Nizak': 4,
      'Vrlo nizak': 2
    };
    
    return safetyMap[casino.safetyIndex] || 6;
  }

  // Expert Reviews
  async getExpertReviewsByCasino(casinoId: string): Promise<ExpertReview[]> {
    return await db.select().from(expertReviews)
      .where(eq(expertReviews.casinoId, casinoId))
      .orderBy(desc(expertReviews.createdAt));
  }

  async getExpertReview(id: string): Promise<ExpertReview | undefined> {
    const [review] = await db.select().from(expertReviews).where(eq(expertReviews.id, id));
    return review || undefined;
  }

  async createExpertReview(insertReview: InsertExpertReview): Promise<ExpertReview> {
    const [review] = await db.insert(expertReviews).values(insertReview).returning();
    return review;
  }

  // Blog Posts
  async getBlogPosts(published = true): Promise<BlogPost[]> {
    if (published) {
      return await db.select().from(blogPosts)
        .where(eq(blogPosts.isPublished, true))
        .orderBy(desc(blogPosts.publishedAt));
    }
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db.insert(blogPosts).values(insertBlogPost).returning();
    return post;
  }

  // Newsletter
  async subscribeNewsletter(insertSubscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const [subscriber] = await db.insert(newsletterSubscribers).values(insertSubscriber).returning();
    return subscriber;
  }

  async getNewsletterSubscriber(email: string): Promise<NewsletterSubscriber | undefined> {
    const [subscriber] = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, email));
    return subscriber || undefined;
  }

  // Comparisons
  async createComparison(insertComparison: InsertComparison): Promise<Comparison> {
    const [comparison] = await db.insert(comparisons).values(insertComparison).returning();
    return comparison;
  }

  async getComparison(id: string): Promise<Comparison | undefined> {
    const [comparison] = await db.select().from(comparisons).where(eq(comparisons.id, id));
    return comparison || undefined;
  }

  // Games
  async getGames(filters?: GameFilters): Promise<Game[]> {
    let query = db.select().from(games).where(eq(games.isActive, true));
    let allGames = await query;
    
    if (filters) {
      if (filters.type) {
        allGames = allGames.filter(game => game.type.toLowerCase() === filters.type!.toLowerCase());
      }
      if (filters.provider) {
        allGames = allGames.filter(game => game.provider.toLowerCase().includes(filters.provider!.toLowerCase()));
      }
      if (filters.volatility) {
        allGames = allGames.filter(game => game.volatility?.toLowerCase() === filters.volatility!.toLowerCase());
      }
      if (filters.minRtp) {
        allGames = allGames.filter(game => game.rtp && parseFloat(game.rtp) >= filters.minRtp!);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        allGames = allGames.filter(game => 
          game.name.toLowerCase().includes(searchLower) ||
          game.provider.toLowerCase().includes(searchLower) ||
          game.description?.toLowerCase().includes(searchLower) ||
          game.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
    }
    
    return allGames.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getGame(id: string): Promise<Game | undefined> {
    const [game] = await db.select().from(games).where(eq(games.id, id));
    return game || undefined;
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const [game] = await db.insert(games).values(insertGame).returning();
    return game;
  }

  async getStats() {
    const [casinoCount] = await db.select({ count: casinos.id }).from(casinos);
    const [bonusCount] = await db.select({ count: bonuses.id }).from(bonuses);
    const [gameCount] = await db.select({ count: games.id }).from(games);
    
    return {
      totalCasinos: casinoCount ? 1 : 0,
      totalBonuses: bonusCount ? 1 : 0,
      totalGames: gameCount ? 1 : 0,
      totalUsers: 24500  // Mock value for now
    };
  }
}

export const storage = new DatabaseStorage();
