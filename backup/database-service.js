// Database Service - Direktan pristup podacima preko ID-jeva
class DatabaseService {
  constructor() {
    // Simulira bazu podataka u memoriji
    this.casinos = new Map();
    this.bonuses = new Map();
    this.games = new Map();
    this.blogPosts = new Map();
    this.reviews = new Map();
    this.expertReviews = new Map();
    this.admins = new Map();
    this.userInteractions = new Map();
    
    // Inicijalizuj sa postojećim podacima
    this.initializeData();
  }

  // Casino operacije
  getCasinoById(id) {
    return this.casinos.get(id);
  }

  getAllCasinos() {
    return Array.from(this.casinos.values()).filter(casino => casino.isActive);
  }

  getFeaturedCasinos() {
    return Array.from(this.casinos.values()).filter(casino => casino.isFeatured && casino.isActive);
  }

  createCasino(casinoData) {
    const id = this.generateId();
    const casino = {
      id,
      ...casinoData,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };
    this.casinos.set(id, casino);
    return casino;
  }

  updateCasino(id, updates) {
    const casino = this.casinos.get(id);
    if (!casino) return null;
    
    const updatedCasino = {
      ...casino,
      ...updates,
      updatedAt: new Date()
    };
    this.casinos.set(id, updatedCasino);
    return updatedCasino;
  }

  deleteCasino(id) {
    return this.updateCasino(id, { isActive: false });
  }

  // Bonus operacije
  getBonusById(id) {
    return this.bonuses.get(id);
  }

  getAllBonuses() {
    return Array.from(this.bonuses.values()).filter(bonus => bonus.isActive);
  }

  getBonusesByCasinoId(casinoId) {
    return Array.from(this.bonuses.values()).filter(bonus => 
      bonus.casinoId === casinoId && bonus.isActive
    );
  }

  getFeaturedBonuses() {
    return Array.from(this.bonuses.values()).filter(bonus => bonus.isFeatured && bonus.isActive);
  }

  createBonus(bonusData) {
    const id = this.generateId();
    const bonus = {
      id,
      ...bonusData,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };
    this.bonuses.set(id, bonus);
    return bonus;
  }

  updateBonus(id, updates) {
    const bonus = this.bonuses.get(id);
    if (!bonus) return null;
    
    const updatedBonus = {
      ...bonus,
      ...updates,
      updatedAt: new Date()
    };
    this.bonuses.set(id, updatedBonus);
    return updatedBonus;
  }

  deleteBonus(id) {
    return this.updateBonus(id, { isActive: false });
  }

  // Game operacije
  getGameById(id) {
    return this.games.get(id);
  }

  getAllGames() {
    return Array.from(this.games.values()).filter(game => game.isActive);
  }

  getGamesByProvider(provider) {
    return Array.from(this.games.values()).filter(game => 
      game.provider === provider && game.isActive
    );
  }

  getGamesByType(type) {
    return Array.from(this.games.values()).filter(game => 
      game.type === type && game.isActive
    );
  }

  createGame(gameData) {
    const id = this.generateId();
    const game = {
      id,
      ...gameData,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };
    this.games.set(id, game);
    return game;
  }

  updateGame(id, updates) {
    const game = this.games.get(id);
    if (!game) return null;
    
    const updatedGame = {
      ...game,
      ...updates,
      updatedAt: new Date()
    };
    this.games.set(id, updatedGame);
    return updatedGame;
  }

  deleteGame(id) {
    return this.updateGame(id, { isActive: false });
  }

  // Blog operacije
  getBlogPostById(id) {
    return this.blogPosts.get(id);
  }

  getAllBlogPosts() {
    return Array.from(this.blogPosts.values()).filter(post => post.isPublished);
  }

  getBlogPostBySlug(slug) {
    return Array.from(this.blogPosts.values()).find(post => 
      post.slug === slug && post.isPublished
    );
  }

  createBlogPost(postData) {
    const id = this.generateId();
    const post = {
      id,
      ...postData,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublished: false
    };
    this.blogPosts.set(id, post);
    return post;
  }

  updateBlogPost(id, updates) {
    const post = this.blogPosts.get(id);
    if (!post) return null;
    
    const updatedPost = {
      ...post,
      ...updates,
      updatedAt: new Date()
    };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  deleteBlogPost(id) {
    return this.updateBlogPost(id, { isPublished: false });
  }

  // Review operacije
  getReviewById(id) {
    return this.reviews.get(id);
  }

  getReviewsByCasinoId(casinoId) {
    return Array.from(this.reviews.values()).filter(review => 
      review.casinoId === casinoId && review.isPublished
    );
  }

  getReviewsByBonusId(bonusId) {
    return Array.from(this.reviews.values()).filter(review => 
      review.bonusId === bonusId && review.isPublished
    );
  }

  getReviewsByGameId(gameId) {
    return Array.from(this.reviews.values()).filter(review => 
      review.gameId === gameId && review.isPublished
    );
  }

  createReview(reviewData) {
    const id = this.generateId();
    const review = {
      id,
      ...reviewData,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublished: true,
      helpfulVotes: 0
    };
    this.reviews.set(id, review);
    return review;
  }

  updateReview(id, updates) {
    const review = this.reviews.get(id);
    if (!review) return null;
    
    const updatedReview = {
      ...review,
      ...updates,
      updatedAt: new Date()
    };
    this.reviews.set(id, updatedReview);
    return updatedReview;
  }

  // Expert Review operacije
  getExpertReviewById(id) {
    return this.expertReviews.get(id);
  }

  getExpertReviewByCasinoId(casinoId) {
    return Array.from(this.expertReviews.values()).find(review => 
      review.casinoId === casinoId
    );
  }

  createExpertReview(reviewData) {
    const id = this.generateId();
    const review = {
      id,
      ...reviewData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.expertReviews.set(id, review);
    return review;
  }

  updateExpertReview(id, updates) {
    const review = this.expertReviews.get(id);
    if (!review) return null;
    
    const updatedReview = {
      ...review,
      ...updates,
      updatedAt: new Date()
    };
    this.expertReviews.set(id, updatedReview);
    return updatedReview;
  }

  // Admin operacije
  getAdminById(id) {
    return this.admins.get(id);
  }

  getAdminByUsername(username) {
    return Array.from(this.admins.values()).find(admin => 
      admin.username === username && admin.isActive
    );
  }

  getAllAdmins() {
    return Array.from(this.admins.values()).filter(admin => admin.isActive);
  }

  createAdmin(adminData) {
    const id = this.generateId();
    const admin = {
      id,
      ...adminData,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };
    this.admins.set(id, admin);
    return admin;
  }

  updateAdmin(id, updates) {
    const admin = this.admins.get(id);
    if (!admin) return null;
    
    const updatedAdmin = {
      ...admin,
      ...updates,
      updatedAt: new Date()
    };
    this.admins.set(id, updatedAdmin);
    return updatedAdmin;
  }

  deleteAdmin(id) {
    return this.updateAdmin(id, { isActive: false });
  }

  // Statistike
  getStats() {
    return {
      totalCasinos: Array.from(this.casinos.values()).filter(c => c.isActive).length.toString(),
      totalBonuses: Array.from(this.bonuses.values()).filter(b => b.isActive).length.toString(),
      totalGames: Array.from(this.games.values()).filter(g => g.isActive).length.toString(),
      totalUsers: Array.from(this.userInteractions.values()).length.toString()
    };
  }

  // Helper metode
  generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  initializeData() {
    // Inicijalizuj sa osnovnim podacima
    
    // Kazina
    const casino1Id = this.generateId();
    const casino2Id = this.generateId();
    
    this.casinos.set(casino1Id, {
      id: casino1Id,
      name: "GetABonus Casino",
      description: "Premium online kazino sa najboljim bonusima i igrama. Licenciran i bezbedan za igranje.",
      logoUrl: "https://via.placeholder.com/200x100/1a1a2e/16a085?text=GetABonus",
      websiteUrl: "https://getabonus.casino",
      affiliateUrl: "https://getabonus.casino/ref/123",
      safetyIndex: 9.2,
      userRating: 8.8,
      totalReviews: 245,
      establishedYear: 2020,
      license: "Malta Gaming Authority (MGA), UK Gambling Commission",
      paymentMethods: ["Visa", "Mastercard", "Skrill", "Neteller", "Bitcoin"],
      supportedCurrencies: ["EUR", "USD", "GBP", "BTC"],
      gameProviders: ["NetEnt", "Microgaming", "Evolution Gaming", "Pragmatic Play"],
      features: ["Live Chat 24/7", "Mobile App", "VIP Program", "Fast Withdrawals"],
      isFeatured: true,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    });

    this.casinos.set(casino2Id, {
      id: casino2Id,
      name: "Bonus King Casino",
      description: "Kraljevski tretman za sve igrače sa ekskluzivnim bonusima i premium uslugom.",
      logoUrl: "https://via.placeholder.com/200x100/2c3e50/f39c12?text=BonusKing",
      websiteUrl: "https://bonusking.casino",
      affiliateUrl: "https://bonusking.casino/ref/456",
      safetyIndex: 8.9,
      userRating: 8.5,
      totalReviews: 189,
      establishedYear: 2019,
      license: "Curacao Gaming License",
      paymentMethods: ["Visa", "Mastercard", "PayPal", "Bitcoin", "Ethereum"],
      supportedCurrencies: ["EUR", "USD", "CAD", "BTC", "ETH"],
      gameProviders: ["Play'n GO", "Quickspin", "Red Tiger", "Big Time Gaming"],
      features: ["Weekly Cashback", "Tournament Mode", "Cryptocurrency Support"],
      isFeatured: true,
      isActive: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date()
    });

    // Bonusi
    const bonus1Id = this.generateId();
    this.bonuses.set(bonus1Id, {
      id: bonus1Id,
      casinoId: casino1Id,
      title: "Dobrodošlica Bonus 200% + 50 Free Spins",
      description: "Ekskluzivni dobrodošlica paket za nove igrače",
      type: "welcome",
      amount: "200% do €500",
      wageringRequirement: "35x",
      minDeposit: "€20",
      maxWin: "€5000",
      validUntil: new Date('2024-12-31'),
      terms: "Važi za nove igrače. Minimum depozit €20. Wagering 35x.",
      code: "WELCOME200",
      isFeatured: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Igre
    const game1Id = this.generateId();
    this.games.set(game1Id, {
      id: game1Id,
      name: "Starburst",
      description: "Popularan slot sa NetEnt provajderom",
      provider: "NetEnt",
      type: "slot",
      rtp: 96.1,
      volatility: "low",
      minBet: 0.10,
      maxBet: 100.00,
      imageUrl: "https://via.placeholder.com/300x200/6a0dad/ffffff?text=Starburst",
      demoUrl: "https://demo.netent.com/starburst",
      tags: ["popular", "low-volatility", "classic"],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Expert Reviews
    const expertReview1Id = this.generateId();
    this.expertReviews.set(expertReview1Id, {
      id: expertReview1Id,
      casinoId: casino1Id,
      authorId: "expert_001",
      bonusesRating: 9.0,
      bonusesExplanation: "Odličan izbor bonusa sa fer uslovima",
      designRating: 8.5,
      designExplanation: "Moderan i intuitivan dizajn",
      payoutsRating: 9.2,
      payoutsExplanation: "Brze isplate, obično u roku od 24h",
      customerSupportRating: 8.8,
      customerSupportExplanation: "24/7 podrška na više jezika",
      gameSelectionRating: 9.1,
      gameSelectionExplanation: "Preko 2000 igara od top provajdera",
      mobileExperienceRating: 8.7,
      mobileExperienceExplanation: "Odlična mobilna verzija",
      overallRating: 8.9,
      summary: "GetABonus Casino je odličan izbor za sve tipove igrača.",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Admin korisnik
    const adminId = this.generateId();
    this.admins.set(adminId, {
      id: adminId,
      username: "alkox",
      password: "$2a$10$encrypted_password_hash", // u realnosti treba hash
      role: "owner",
      createdBy: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}

// Globalna instanca
window.db = new DatabaseService();