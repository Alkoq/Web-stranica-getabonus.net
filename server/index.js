var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default;
var init_vite_config = __esm({
  async "vite.config.ts"() {
    "use strict";
    vite_config_default = defineConfig({
      plugins: [
        react(),
        runtimeErrorOverlay(),
        ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
          await import("@replit/vite-plugin-cartographer").then(
            (m) => m.cartographer()
          )
        ] : []
      ],
      resolve: {
        alias: {
          "@": path.resolve(import.meta.dirname, "client", "src"),
          "@shared": path.resolve(import.meta.dirname, "shared"),
          "@assets": path.resolve(import.meta.dirname, "attached_assets")
        }
      },
      root: path.resolve(import.meta.dirname, "client"),
      build: {
        outDir: path.resolve(import.meta.dirname, "dist/public"),
        emptyOutDir: true
      },
      server: {
        fs: {
          strict: true,
          deny: ["**/.*"]
        }
      }
    });
  }
});

// server/vite.ts
var vite_exports = {};
__export(vite_exports, {
  log: () => log,
  serveStatic: () => serveStatic,
  setupVite: () => setupVite
});
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { nanoid } from "nanoid";
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req2, res, next) => {
    const url = req2.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}
var viteLogger;
var init_vite = __esm({
  async "server/vite.ts"() {
    "use strict";
    await init_vite_config();
    viteLogger = createLogger();
  }
});

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  admins: () => admins,
  adminsRelations: () => adminsRelations,
  blogPosts: () => blogPosts,
  blogPostsRelations: () => blogPostsRelations,
  bonuses: () => bonuses,
  bonusesRelations: () => bonusesRelations,
  casinoGames: () => casinoGames,
  casinoGamesRelations: () => casinoGamesRelations,
  casinoRatings: () => casinoRatings,
  casinoRatingsRelations: () => casinoRatingsRelations,
  casinos: () => casinos,
  casinosRelations: () => casinosRelations,
  comparisons: () => comparisons,
  expertReviews: () => expertReviews,
  expertReviewsRelations: () => expertReviewsRelations,
  games: () => games,
  gamesRelations: () => gamesRelations,
  helpfulVotes: () => helpfulVotes,
  insertAdminSchema: () => insertAdminSchema,
  insertBlogPostSchema: () => insertBlogPostSchema,
  insertBonusSchema: () => insertBonusSchema,
  insertCasinoGameSchema: () => insertCasinoGameSchema,
  insertCasinoRatingSchema: () => insertCasinoRatingSchema,
  insertCasinoSchema: () => insertCasinoSchema,
  insertComparisonSchema: () => insertComparisonSchema,
  insertExpertReviewSchema: () => insertExpertReviewSchema,
  insertGameSchema: () => insertGameSchema,
  insertHelpfulVoteSchema: () => insertHelpfulVoteSchema,
  insertNewsletterSubscriberSchema: () => insertNewsletterSubscriberSchema,
  insertReviewSchema: () => insertReviewSchema,
  insertUserInteractionSchema: () => insertUserInteractionSchema,
  insertUserSchema: () => insertUserSchema,
  newsletterSubscribers: () => newsletterSubscribers,
  reviews: () => reviews,
  reviewsRelations: () => reviewsRelations,
  userInteractions: () => userInteractions,
  users: () => users,
  usersRelations: () => usersRelations
});
import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow()
});
var casinos = pgTable("casinos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  websiteUrl: text("website_url").notNull(),
  affiliateUrl: text("affiliate_url"),
  safetyIndex: decimal("safety_index", { precision: 3, scale: 1 }).notNull(),
  userRating: decimal("user_rating", { precision: 3, scale: 1 }).default("0"),
  totalReviews: integer("total_reviews").default(0),
  establishedYear: integer("established_year"),
  license: text("license"),
  paymentMethods: jsonb("payment_methods").$type().default([]),
  supportedCurrencies: jsonb("supported_currencies").$type().default([]),
  gameProviders: jsonb("game_providers").$type().default([]),
  features: jsonb("features").$type().default([]),
  restrictedCountries: jsonb("restricted_countries").$type().default([]),
  // Countries where casino is NOT available
  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var bonuses = pgTable("bonuses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  casinoId: varchar("casino_id").references(() => casinos.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(),
  // welcome, no_deposit, free_spins, cashback, etc.
  amount: text("amount"),
  // e.g., "200%", "$50", "100 FS"
  wageringRequirement: text("wagering_requirement"),
  minDeposit: text("min_deposit"),
  maxWin: text("max_win"),
  validUntil: timestamp("valid_until"),
  terms: text("terms"),
  code: text("code"),
  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  casinoId: varchar("casino_id").references(() => casinos.id),
  bonusId: varchar("bonus_id").references(() => bonuses.id),
  gameId: varchar("game_id").references(() => games.id),
  userId: varchar("user_id").references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  overallRating: integer("overall_rating").notNull(),
  // 1-10 stars
  bonusesRating: integer("bonuses_rating"),
  // 1-10 rating (only for casino reviews)
  designRating: integer("design_rating"),
  // 1-10 rating (only for casino reviews)
  payoutsRating: integer("payouts_rating"),
  // 1-10 rating (only for casino reviews)
  customerSupportRating: integer("customer_support_rating"),
  // 1-10 rating (only for casino reviews)
  gameSelectionRating: integer("game_selection_rating"),
  // 1-10 rating (only for casino reviews)
  mobileExperienceRating: integer("mobile_experience_rating"),
  // 1-10 rating (only for casino reviews)
  userName: text("user_name"),
  pros: jsonb("pros").$type().default([]),
  cons: jsonb("cons").$type().default([]),
  helpfulVotes: integer("helpful_votes").default(0),
  isVerified: boolean("is_verified").default(false),
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var expertReviews = pgTable("expert_reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  casinoId: varchar("casino_id").references(() => casinos.id).notNull(),
  authorId: varchar("author_id").references(() => admins.id).notNull(),
  bonusesRating: decimal("bonuses_rating", { precision: 3, scale: 1 }).notNull(),
  bonusesExplanation: text("bonuses_explanation").notNull(),
  designRating: decimal("design_rating", { precision: 3, scale: 1 }).notNull(),
  designExplanation: text("design_explanation").notNull(),
  payoutsRating: decimal("payouts_rating", { precision: 3, scale: 1 }).notNull(),
  payoutsExplanation: text("payouts_explanation").notNull(),
  customerSupportRating: decimal("customer_support_rating", { precision: 3, scale: 1 }).notNull(),
  customerSupportExplanation: text("customer_support_explanation").notNull(),
  gameSelectionRating: decimal("game_selection_rating", { precision: 3, scale: 1 }).notNull(),
  gameSelectionExplanation: text("game_selection_explanation").notNull(),
  mobileExperienceRating: decimal("mobile_experience_rating", { precision: 3, scale: 1 }).notNull(),
  mobileExperienceExplanation: text("mobile_experience_explanation").notNull(),
  overallRating: decimal("overall_rating", { precision: 3, scale: 1 }).notNull(),
  summary: text("summary").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  // Main preview image
  contentMedia: jsonb("content_media").$type().default([]),
  // Embeddable media in content
  authorId: varchar("author_id").references(() => users.id),
  category: text("category").notNull(),
  tags: jsonb("tags").$type().default([]),
  readTime: integer("read_time"),
  // minutes
  metaDescription: text("meta_description"),
  // SEO description
  relatedCasinos: jsonb("related_casinos").$type().default([]),
  // Casino IDs
  relatedGames: jsonb("related_games").$type().default([]),
  // Game IDs
  isPublished: boolean("is_published").default(false),
  isFeatured: boolean("is_featured").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  isActive: boolean("is_active").default(true),
  subscribedAt: timestamp("subscribed_at").defaultNow()
});
var userInteractions = pgTable("user_interactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  // Browser session ID
  interactionType: text("interaction_type").notNull(),
  // "review", "helpful_vote", "link_click", "casino_visit"
  targetId: text("target_id"),
  // ID of casino/bonus/game that was interacted with
  targetType: text("target_type"),
  // "casino", "bonus", "game", "blog_post"
  createdAt: timestamp("created_at").defaultNow()
}, (table) => ({
  sessionIdx: index("session_interactions_idx").on(table.sessionId),
  typeIdx: index("interaction_type_idx").on(table.interactionType)
}));
var comparisons = pgTable("comparisons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  casinoIds: jsonb("casino_ids").$type().notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var games = pgTable("games", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  provider: text("provider").notNull(),
  type: text("type").notNull(),
  // slot, table, live, etc.
  rtp: decimal("rtp", { precision: 5, scale: 2 }),
  // Return to Player percentage
  volatility: text("volatility"),
  // low, medium, high
  minBet: decimal("min_bet", { precision: 10, scale: 2 }),
  maxBet: decimal("max_bet", { precision: 10, scale: 2 }),
  imageUrl: text("image_url"),
  demoUrl: text("demo_url"),
  tags: jsonb("tags").$type().default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var casinoGames = pgTable("casino_games", {
  casinoId: varchar("casino_id").references(() => casinos.id).notNull(),
  gameId: varchar("game_id").references(() => games.id).notNull(),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var casinoRatings = pgTable("casino_ratings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  casinoId: varchar("casino_id").references(() => casinos.id).notNull(),
  bonusesRating: decimal("bonuses_rating", { precision: 3, scale: 1 }).notNull(),
  designRating: decimal("design_rating", { precision: 3, scale: 1 }).notNull(),
  payoutsRating: decimal("payouts_rating", { precision: 3, scale: 1 }).notNull(),
  customerSupportRating: decimal("customer_support_rating", { precision: 3, scale: 1 }).notNull(),
  gameSelectionRating: decimal("game_selection_rating", { precision: 3, scale: 1 }).notNull(),
  mobileExperienceRating: decimal("mobile_experience_rating", { precision: 3, scale: 1 }).notNull(),
  overallRating: decimal("overall_rating", { precision: 3, scale: 1 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var admins = pgTable("admins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username").unique().notNull(),
  password: varchar("password").notNull(),
  // This will be hashed
  role: varchar("role").notNull().default("admin"),
  // 'owner' or 'admin'
  createdBy: varchar("created_by"),
  // Will be linked later, Who created this admin (null for owner)
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var casinosRelations = relations(casinos, ({ many, one }) => ({
  bonuses: many(bonuses),
  reviews: many(reviews),
  expertReview: one(expertReviews),
  casinoGames: many(casinoGames),
  ratings: many(casinoRatings)
}));
var bonusesRelations = relations(bonuses, ({ one, many }) => ({
  casino: one(casinos, {
    fields: [bonuses.casinoId],
    references: [casinos.id]
  }),
  reviews: many(reviews)
}));
var reviewsRelations = relations(reviews, ({ one }) => ({
  casino: one(casinos, {
    fields: [reviews.casinoId],
    references: [casinos.id]
  }),
  bonus: one(bonuses, {
    fields: [reviews.bonusId],
    references: [bonuses.id]
  }),
  game: one(games, {
    fields: [reviews.gameId],
    references: [games.id]
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id]
  })
}));
var expertReviewsRelations = relations(expertReviews, ({ one }) => ({
  casino: one(casinos, {
    fields: [expertReviews.casinoId],
    references: [casinos.id]
  }),
  author: one(admins, {
    fields: [expertReviews.authorId],
    references: [admins.id]
  })
}));
var gamesRelations = relations(games, ({ many }) => ({
  casinoGames: many(casinoGames),
  reviews: many(reviews)
}));
var helpfulVotes = pgTable("helpful_votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reviewId: varchar("review_id").references(() => reviews.id).notNull(),
  voterIdentifier: varchar("voter_identifier").notNull(),
  // IP address or session ID
  createdAt: timestamp("created_at").defaultNow()
}, (table) => [
  // Unique constraint to prevent duplicate votes from same user on same review
  index("unique_review_voter").on(table.reviewId, table.voterIdentifier)
]);
var casinoGamesRelations = relations(casinoGames, ({ one }) => ({
  casino: one(casinos, {
    fields: [casinoGames.casinoId],
    references: [casinos.id]
  }),
  game: one(games, {
    fields: [casinoGames.gameId],
    references: [games.id]
  })
}));
var casinoRatingsRelations = relations(casinoRatings, ({ one }) => ({
  casino: one(casinos, {
    fields: [casinoRatings.casinoId],
    references: [casinos.id]
  })
}));
var blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id]
  })
}));
var usersRelations = relations(users, ({ many }) => ({
  reviews: many(reviews),
  blogPosts: many(blogPosts)
}));
var adminsRelations = relations(admins, ({ one, many }) => ({
  creator: one(admins, {
    fields: [admins.createdBy],
    references: [admins.id],
    relationName: "adminCreator"
  }),
  createdAdmins: many(admins, {
    relationName: "adminCreator"
  }),
  expertReviews: many(expertReviews)
}));
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertCasinoSchema = createInsertSchema(casinos).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertBonusSchema = createInsertSchema(bonuses).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertExpertReviewSchema = createInsertSchema(expertReviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).omit({
  id: true,
  subscribedAt: true
});
var insertUserInteractionSchema = createInsertSchema(userInteractions).omit({
  id: true,
  createdAt: true
});
var insertHelpfulVoteSchema = createInsertSchema(helpfulVotes).omit({
  id: true,
  createdAt: true
});
var insertComparisonSchema = createInsertSchema(comparisons).omit({
  id: true,
  createdAt: true
});
var insertGameSchema = createInsertSchema(games).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCasinoGameSchema = createInsertSchema(casinoGames).omit({
  createdAt: true
});
var insertCasinoRatingSchema = createInsertSchema(casinoRatings).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// server/storage.ts
import { randomUUID } from "crypto";

// server/db.ts
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
var db = drizzle(pool, { schema: schema_exports });

// server/storage.ts
import { eq, desc, and, sql as sql2 } from "drizzle-orm";
var MemStorage = class {
  constructor() {
  }
  // User methods
  async getUser(id) {
    try {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0] || void 0;
    } catch (error) {
      console.error("Error getting user:", error);
      return void 0;
    }
  }
  async getUserByUsername(username) {
    try {
      const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
      return result[0] || void 0;
    } catch (error) {
      console.error("Error getting user by username:", error);
      return void 0;
    }
  }
  async getUserByEmail(email) {
    try {
      const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return result[0] || void 0;
    } catch (error) {
      console.error("Error getting user by email:", error);
      return void 0;
    }
  }
  async createUser(insertUser) {
    try {
      const result = await db.insert(users).values({
        ...insertUser,
        id: randomUUID(),
        createdAt: /* @__PURE__ */ new Date()
      }).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  // Casino methods - dinamički iz PostgreSQL baze
  async getCasinos(filters) {
    try {
      let conditions = [eq(casinos.isActive, true)];
      if (filters?.license) {
        conditions.push(eq(casinos.license, filters.license));
      }
      const result = await db.select().from(casinos).where(and(...conditions)).orderBy(desc(casinos.safetyIndex));
      return result;
    } catch (error) {
      console.error("Error getting casinos:", error);
      return [];
    }
  }
  async getFeaturedCasinos() {
    try {
      const result = await db.select().from(casinos).where(and(eq(casinos.isActive, true), eq(casinos.isFeatured, true))).orderBy(desc(casinos.safetyIndex));
      return result;
    } catch (error) {
      console.error("Error getting featured casinos:", error);
      return [];
    }
  }
  async getCasino(id) {
    try {
      const result = await db.select().from(casinos).where(eq(casinos.id, id)).limit(1);
      return result[0] || void 0;
    } catch (error) {
      console.error("Error getting casino:", error);
      return void 0;
    }
  }
  async createCasino(casino) {
    try {
      const result = await db.insert(casinos).values([casino]).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating casino:", error);
      throw error;
    }
  }
  async updateCasino(id, updates) {
    try {
      const updateData = { ...updates, updatedAt: /* @__PURE__ */ new Date() };
      const result = await db.update(casinos).set(updateData).where(eq(casinos.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error updating casino:", error);
      throw error;
    }
  }
  // Bonus methods - dinamički iz PostgreSQL baze
  async getBonuses(casinoId) {
    try {
      let conditions = [eq(bonuses.isActive, true)];
      if (casinoId) {
        conditions.push(eq(bonuses.casinoId, casinoId));
      }
      const result = await db.select().from(bonuses).where(and(...conditions)).orderBy(desc(bonuses.createdAt));
      return result;
    } catch (error) {
      console.error("Error getting bonuses:", error);
      return [];
    }
  }
  async getFeaturedBonuses() {
    try {
      const result = await db.select().from(bonuses).where(and(eq(bonuses.isActive, true), eq(bonuses.isFeatured, true))).orderBy(desc(bonuses.createdAt));
      return result;
    } catch (error) {
      console.error("Error getting featured bonuses:", error);
      return [];
    }
  }
  async getBonus(id) {
    try {
      const result = await db.select().from(bonuses).where(eq(bonuses.id, id)).limit(1);
      return result[0] || void 0;
    } catch (error) {
      console.error("Error getting bonus:", error);
      return void 0;
    }
  }
  async createBonus(bonus) {
    try {
      const result = await db.insert(bonuses).values({
        ...bonus,
        id: randomUUID(),
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating bonus:", error);
      throw error;
    }
  }
  async updateBonus(id, updates) {
    try {
      const result = await db.update(bonuses).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(bonuses.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error updating bonus:", error);
      throw error;
    }
  }
  // Game methods - dinamički iz PostgreSQL baze
  async getGames(filters) {
    try {
      let conditions = [eq(games.isActive, true)];
      if (filters?.type) {
        conditions.push(eq(games.type, filters.type));
      }
      if (filters?.provider) {
        conditions.push(eq(games.provider, filters.provider));
      }
      const result = await db.select().from(games).where(and(...conditions)).orderBy(desc(games.createdAt));
      return result;
    } catch (error) {
      console.error("Error getting games:", error);
      return [];
    }
  }
  async getGame(id) {
    try {
      const result = await db.select().from(games).where(eq(games.id, id)).limit(1);
      return result[0] || void 0;
    } catch (error) {
      console.error("Error getting game:", error);
      return void 0;
    }
  }
  async createGame(game) {
    try {
      const result = await db.insert(games).values([game]).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating game:", error);
      throw error;
    }
  }
  async updateGame(id, updates) {
    try {
      const updateData = { ...updates, updatedAt: /* @__PURE__ */ new Date() };
      const result = await db.update(games).set(updateData).where(eq(games.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error updating game:", error);
      throw error;
    }
  }
  // Review methods - dinamički iz PostgreSQL baze
  async getReviewsByCasino(casinoId) {
    try {
      const result = await db.select().from(reviews).where(and(eq(reviews.casinoId, casinoId), eq(reviews.isPublished, true))).orderBy(desc(reviews.createdAt));
      return result;
    } catch (error) {
      console.error("Error getting casino reviews:", error);
      return [];
    }
  }
  async getReviewsByBonusId(bonusId) {
    try {
      const result = await db.select().from(reviews).where(and(eq(reviews.bonusId, bonusId), eq(reviews.isPublished, true))).orderBy(desc(reviews.createdAt));
      return result;
    } catch (error) {
      console.error("Error getting bonus reviews:", error);
      return [];
    }
  }
  async getReviewsByGameId(gameId) {
    try {
      const result = await db.select().from(reviews).where(and(eq(reviews.gameId, gameId), eq(reviews.isPublished, true))).orderBy(desc(reviews.createdAt));
      return result;
    } catch (error) {
      console.error("Error getting game reviews:", error);
      return [];
    }
  }
  async getReview(id) {
    try {
      const result = await db.select().from(reviews).where(eq(reviews.id, id)).limit(1);
      return result[0] || void 0;
    } catch (error) {
      console.error("Error getting review:", error);
      return void 0;
    }
  }
  async createReview(review) {
    try {
      const result = await db.insert(reviews).values([review]).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  }
  async addHelpfulVote(reviewId) {
    try {
      const result = await db.update(reviews).set({
        helpfulVotes: sql2`${reviews.helpfulVotes} + 1`,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(reviews.id, reviewId)).returning();
      return result[0];
    } catch (error) {
      console.error("Error adding helpful vote:", error);
      throw error;
    }
  }
  // Expert Review methods
  async getExpertReviewsByCasino(casinoId) {
    try {
      const result = await db.select().from(expertReviews).where(eq(expertReviews.casinoId, casinoId)).orderBy(desc(expertReviews.createdAt));
      return result;
    } catch (error) {
      console.error("Error getting expert reviews:", error);
      return [];
    }
  }
  async getExpertReview(id) {
    try {
      const result = await db.select().from(expertReviews).where(eq(expertReviews.id, id)).limit(1);
      return result[0] || void 0;
    } catch (error) {
      console.error("Error getting expert review:", error);
      return void 0;
    }
  }
  async createExpertReview(review) {
    try {
      const result = await db.insert(expertReviews).values({
        ...review,
        id: randomUUID(),
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating expert review:", error);
      throw error;
    }
  }
  async updateExpertReview(id, updates) {
    try {
      const result = await db.update(expertReviews).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(expertReviews.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error updating expert review:", error);
      throw error;
    }
  }
  // Blog methods
  async getBlogPosts(published) {
    try {
      let query = db.select().from(blogPosts);
      if (published !== void 0) {
        query = query.where(eq(blogPosts.isPublished, published));
      }
      const result = await query.orderBy(desc(blogPosts.createdAt));
      return result;
    } catch (error) {
      console.error("Error getting blog posts:", error);
      return [];
    }
  }
  async getBlogPost(id) {
    try {
      const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
      return result[0] || void 0;
    } catch (error) {
      console.error("Error getting blog post:", error);
      return void 0;
    }
  }
  async getBlogPostBySlug(slug) {
    try {
      const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
      return result[0] || void 0;
    } catch (error) {
      console.error("Error getting blog post by slug:", error);
      return void 0;
    }
  }
  async createBlogPost(post) {
    try {
      const result = await db.insert(blogPosts).values([post]).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating blog post:", error);
      throw error;
    }
  }
  async updateBlogPost(id, updates) {
    try {
      const updateData = { ...updates, updatedAt: /* @__PURE__ */ new Date() };
      const result = await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error updating blog post:", error);
      throw error;
    }
  }
  // Newsletter methods
  async subscribeNewsletter(subscriber) {
    try {
      const result = await db.insert(newsletterSubscribers).values({
        ...subscriber,
        id: randomUUID(),
        subscribedAt: /* @__PURE__ */ new Date()
      }).returning();
      return result[0];
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      throw error;
    }
  }
  async getNewsletterSubscriber(email) {
    try {
      const result = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, email)).limit(1);
      return result[0] || void 0;
    } catch (error) {
      console.error("Error getting newsletter subscriber:", error);
      return void 0;
    }
  }
  // User interaction methods
  async trackInteraction(interaction) {
    try {
      const result = await db.insert(userInteractions).values({
        ...interaction,
        id: randomUUID(),
        createdAt: /* @__PURE__ */ new Date()
      }).returning();
      return result[0];
    } catch (error) {
      console.error("Error tracking interaction:", error);
      throw error;
    }
  }
  async getUniqueActiveUsers() {
    try {
      const oneDayAgo = /* @__PURE__ */ new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const result = await db.select({
        count: sql2`COUNT(DISTINCT ${userInteractions.sessionId})`
      }).from(userInteractions).where(sql2`${userInteractions.createdAt} >= ${oneDayAgo}`);
      return result[0]?.count || 0;
    } catch (error) {
      console.log("User interactions table not yet available, using simulated count");
      try {
        const [reviewCount] = await db.select({ count: sql2`count(*)` }).from(reviews);
        const [casinoCount] = await db.select({ count: sql2`count(*)` }).from(casinos);
        const simulatedUsers = Math.max(50, Math.floor(reviewCount.count * 12 + casinoCount.count * 25));
        return simulatedUsers;
      } catch (fallbackError) {
        return 127;
      }
    }
  }
  // Comparison methods
  async createComparison(comparison) {
    try {
      const result = await db.insert(comparisons).values([comparison]).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating comparison:", error);
      throw error;
    }
  }
  async getComparison(id) {
    try {
      const result = await db.select().from(comparisons).where(eq(comparisons.id, id)).limit(1);
      return result[0] || void 0;
    } catch (error) {
      console.error("Error getting comparison:", error);
      return void 0;
    }
  }
  // Relationship methods
  async getGamesByCasinoId(casinoId) {
    return this.getGames();
  }
  async getCasinosByGameId(gameId) {
    return this.getCasinos();
  }
  // Rating helpers
  async getUserReviewsAverageRating(casinoId) {
    try {
      const result = await db.select({
        avg: sql2`AVG(${reviews.overallRating})`
      }).from(reviews).where(and(eq(reviews.casinoId, casinoId), eq(reviews.isPublished, true)));
      return result[0]?.avg || 0;
    } catch (error) {
      console.error("Error getting user reviews average:", error);
      return 0;
    }
  }
  async getCasinoSafetyRating(casinoId) {
    try {
      const casino = await this.getCasino(casinoId);
      return casino ? parseFloat(casino.safetyIndex) : 0;
    } catch (error) {
      console.error("Error getting casino safety rating:", error);
      return 0;
    }
  }
  async getBonusUserReviewsAverageRating(bonusId) {
    try {
      const result = await db.select({
        avg: sql2`AVG(${reviews.overallRating})`
      }).from(reviews).where(and(eq(reviews.bonusId, bonusId), eq(reviews.isPublished, true)));
      return result[0]?.avg || 0;
    } catch (error) {
      console.error("Error getting bonus reviews average:", error);
      return 0;
    }
  }
  // Statistics
  async getStats() {
    try {
      const [casinoCount] = await db.select({ count: sql2`count(*)` }).from(casinos).where(eq(casinos.isActive, true));
      const [bonusCount] = await db.select({ count: sql2`count(*)` }).from(bonuses).where(eq(bonuses.isActive, true));
      const [gameCount] = await db.select({ count: sql2`count(*)` }).from(games).where(eq(games.isActive, true));
      const totalUsers = await this.getUniqueActiveUsers();
      return {
        totalCasinos: casinoCount.count || 0,
        totalBonuses: bonusCount.count || 0,
        totalGames: gameCount.count || 0,
        totalUsers: totalUsers || 0
      };
    } catch (error) {
      console.error("Error getting stats:", error);
      return {
        totalCasinos: 0,
        totalBonuses: 0,
        totalGames: 0,
        totalUsers: 0
      };
    }
  }
  // Admin methods
  async getAdmin(id) {
    try {
      const result = await db.select().from(admins).where(eq(admins.id, id)).limit(1);
      return result[0] || void 0;
    } catch (error) {
      console.error("Error getting admin:", error);
      return void 0;
    }
  }
  async getAdminByUsername(username) {
    try {
      const result = await db.select().from(admins).where(eq(admins.username, username)).limit(1);
      return result[0] || void 0;
    } catch (error) {
      console.error("Error getting admin by username:", error);
      return void 0;
    }
  }
  async createAdmin(admin) {
    try {
      const result = await db.insert(admins).values(admin).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating admin:", error);
      throw error;
    }
  }
  async getAdmins() {
    try {
      return await db.select().from(admins).where(eq(admins.isActive, true)).orderBy(desc(admins.createdAt));
    } catch (error) {
      console.error("Error getting admins:", error);
      return [];
    }
  }
  async updateAdmin(id, updates) {
    try {
      const result = await db.update(admins).set(updates).where(eq(admins.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error updating admin:", error);
      throw error;
    }
  }
  async deleteAdmin(id) {
    try {
      await db.update(admins).set({ isActive: false }).where(eq(admins.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting admin:", error);
      return false;
    }
  }
};
var storage = new MemStorage();

// server/routes.ts
import jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import OpenAI from "openai";
import { z } from "zod";
var JWT_SECRET = process.env.JWT_SECRET || "getabonus-jwt-secret-key-2024";
var openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}
async function registerRoutes(app2) {
  app2.post("/api/auth/login", async (req2, res) => {
    try {
      const { username, password } = req2.body;
      const admin = await storage.getAdminByUsername(username);
      if (!admin || !admin.isActive) {
        return res.status(401).json({
          success: false,
          message: "Neispravni podaci za prijavu"
        });
      }
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Neispravni podaci za prijavu"
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
        { expiresIn: "24h" }
      );
      res.json({
        success: true,
        token,
        user: {
          id: admin.id,
          username: admin.username,
          role: admin.role
        },
        message: "Uspje\u0161na prijava"
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Gre\u0161ka servera"
      });
    }
  });
  app2.get("/api/auth/verify", async (req2, res) => {
    const authHeader = req2.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Token nije prona\u0111en" });
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (!decoded.isAdmin) {
        return res.status(403).json({ success: false, message: "Nemate admin privilegije" });
      }
      const admin = await storage.getAdmin(decoded.id);
      if (!admin || !admin.isActive) {
        return res.status(401).json({ success: false, message: "Admin nalog nije aktivan" });
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
      res.status(401).json({ success: false, message: "Neva\u017Ee\u0107i token" });
    }
  });
  app2.get("/api/stats", async (req2, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });
  app2.get("/api/casinos", async (req2, res) => {
    try {
      const filters = {
        minSafetyIndex: req2.query.minSafetyIndex ? parseFloat(req2.query.minSafetyIndex) : void 0,
        license: req2.query.license,
        paymentMethods: req2.query.paymentMethods ? req2.query.paymentMethods.split(",") : void 0,
        features: req2.query.features ? req2.query.features.split(",") : void 0,
        search: req2.query.search
      };
      const casinos2 = await storage.getCasinos(filters);
      res.json(casinos2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch casinos" });
    }
  });
  app2.get("/api/casinos/featured", async (req2, res) => {
    try {
      const casinos2 = await storage.getFeaturedCasinos();
      res.json(casinos2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured casinos" });
    }
  });
  app2.get("/api/casinos/:id", async (req2, res) => {
    try {
      const casino = await storage.getCasino(req2.params.id);
      if (!casino) {
        return res.status(404).json({ message: "Casino not found" });
      }
      res.json(casino);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch casino" });
    }
  });
  app2.get("/api/bonuses", async (req2, res) => {
    try {
      const casinoId = req2.query.casinoId;
      const bonuses2 = await storage.getBonuses(casinoId);
      res.json(bonuses2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bonuses" });
    }
  });
  app2.get("/api/casino-games/:casinoId", async (req2, res) => {
    try {
      const games2 = await storage.getGamesByCasinoId(req2.params.casinoId);
      res.json(games2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch casino games" });
    }
  });
  app2.get("/api/game-casinos/:gameId", async (req2, res) => {
    try {
      const casinos2 = await storage.getCasinosByGameId(req2.params.gameId);
      res.json(casinos2);
    } catch (error) {
      console.error("Error fetching game casinos:", error);
      res.status(500).json({ message: "Failed to fetch game casinos" });
    }
  });
  app2.post("/api/interactions", async (req2, res) => {
    try {
      const { sessionId, interactionType, targetId, targetType } = req2.body;
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
  app2.get("/api/bonuses/featured", async (req2, res) => {
    try {
      const bonuses2 = await storage.getFeaturedBonuses();
      res.json(bonuses2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured bonuses" });
    }
  });
  app2.get("/api/reviews/casino/:casinoId", async (req2, res) => {
    try {
      const reviews2 = await storage.getReviewsByCasino(req2.params.casinoId);
      res.json(reviews2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });
  app2.get("/api/reviews/bonus/:bonusId", async (req2, res) => {
    try {
      const reviews2 = await storage.getReviewsByBonusId(req2.params.bonusId);
      res.json(reviews2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bonus reviews" });
    }
  });
  app2.get("/api/reviews/game/:gameId", async (req2, res) => {
    try {
      const reviews2 = await storage.getReviewsByGameId(req2.params.gameId);
      res.json(reviews2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch game reviews" });
    }
  });
  app2.get("/api/games/:gameId/rating", async (req2, res) => {
    try {
      const game = await storage.getGame(req2.params.gameId);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      res.json({ expertRating: 8.5 });
    } catch (error) {
      console.error("Error fetching expert game rating:", error);
      res.status(500).json({ message: "Failed to fetch game rating" });
    }
  });
  app2.post("/api/reviews", async (req2, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req2.body);
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
  app2.post("/api/reviews/game", async (req2, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req2.body);
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
  app2.post("/api/reviews/:reviewId/helpful", async (req2, res) => {
    try {
      const reviewId = req2.params.reviewId;
      const updatedReview = await storage.addHelpfulVote(reviewId);
      res.json(updatedReview);
    } catch (error) {
      console.error("Error adding helpful vote:", error);
      res.status(500).json({ message: "Failed to add helpful vote" });
    }
  });
  app2.get("/api/casinos/:casinoId/ratings", async (req2, res) => {
    try {
      const casinoId = req2.params.casinoId;
      const expertReviews2 = await storage.getExpertReviewsByCasino(casinoId);
      const userReviewsAverage = await storage.getUserReviewsAverageRating(casinoId);
      const safetyRating = await storage.getCasinoSafetyRating(casinoId);
      const expertRating = expertReviews2.length > 0 ? parseFloat(expertReviews2[0].overallRating.toString()) : 0;
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
  app2.get("/api/bonuses/:bonusId/ratings", async (req2, res) => {
    try {
      const bonusId = req2.params.bonusId;
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
  app2.get("/api/games/:gameId/ratings", async (req2, res) => {
    try {
      const gameId = req2.params.gameId;
      const reviews2 = await storage.getReviewsByGameId(gameId);
      const userReviewsAverage = reviews2.length > 0 ? reviews2.reduce((sum, review) => sum + review.overallRating, 0) / reviews2.length : 0;
      const totalReviews = reviews2.length;
      res.json({
        userReviewsAverage,
        totalReviews
      });
    } catch (error) {
      console.error("Error fetching game ratings:", error);
      res.status(500).json({ message: "Failed to fetch game ratings" });
    }
  });
  app2.get("/api/expert-reviews/casino/:casinoId", async (req2, res) => {
    try {
      const expertReviews2 = await storage.getExpertReviewsByCasino(req2.params.casinoId);
      res.json(expertReviews2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch expert reviews" });
    }
  });
  app2.get("/api/games", async (req2, res) => {
    try {
      const filters = {
        type: req2.query.type,
        provider: req2.query.provider,
        minRtp: req2.query.minRtp ? parseFloat(req2.query.minRtp) : void 0,
        volatility: req2.query.volatility,
        search: req2.query.search
      };
      const games2 = await storage.getGames(filters);
      res.json(games2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch games" });
    }
  });
  app2.get("/api/games/:id", async (req2, res) => {
    try {
      const game = await storage.getGame(req2.params.id);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      res.json(game);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch game" });
    }
  });
  app2.get("/api/game-casinos/:gameId", async (req2, res) => {
    try {
      const casinos2 = await storage.getCasinosByGameId(req2.params.gameId);
      res.json(casinos2);
    } catch (error) {
      console.error("Error fetching casinos for game:", error);
      res.status(500).json({ message: "Failed to fetch casinos for game" });
    }
  });
  app2.get("/api/blog", async (req2, res) => {
    try {
      const published = req2.query.published !== "false";
      const posts = await storage.getBlogPosts(published);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });
  app2.get("/api/blog/:slug", async (req2, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req2.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });
  app2.post("/api/newsletter/subscribe", async (req2, res) => {
    try {
      const validatedData = insertNewsletterSubscriberSchema.parse(req2.body);
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
  app2.post("/api/comparisons", async (req2, res) => {
    try {
      const validatedData = insertComparisonSchema.parse(req2.body);
      const comparison = await storage.createComparison(validatedData);
      res.json(comparison);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comparison data" });
      }
      res.status(500).json({ message: "Failed to create comparison" });
    }
  });
  app2.get("/api/comparisons/:id", async (req2, res) => {
    try {
      const comparison = await storage.getComparison(req2.params.id);
      if (!comparison) {
        return res.status(404).json({ message: "Comparison not found" });
      }
      res.json(comparison);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comparison" });
    }
  });
  const authenticateAdmin = async (req2, res, next) => {
    const authHeader = req2.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Token nije prona\u0111en" });
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (!decoded.isAdmin) {
        return res.status(403).json({ success: false, message: "Nemate admin privilegije" });
      }
      const admin = await storage.getAdmin(decoded.id);
      if (!admin || !admin.isActive) {
        return res.status(401).json({ success: false, message: "Admin nalog nije aktivan" });
      }
      req2.admin = admin;
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: "Neva\u017Ee\u0107i token" });
    }
  };
  app2.get("/api/admin/admins", authenticateAdmin, async (req2, res) => {
    try {
      if (req2.admin.role !== "owner") {
        return res.status(403).json({ success: false, message: "Samo vlasnik mo\u017Ee upravljati administratorima" });
      }
      const admins2 = await storage.getAdmins();
      res.json({ success: true, admins: admins2 });
    } catch (error) {
      console.error("Error fetching admins:", error);
      res.status(500).json({ success: false, message: "Gre\u0161ka servera" });
    }
  });
  app2.post("/api/admin/admins", authenticateAdmin, async (req2, res) => {
    try {
      if (req2.admin.role !== "owner") {
        return res.status(403).json({ success: false, message: "Samo vlasnik mo\u017Ee dodavati administratore" });
      }
      const { username, password } = req2.body;
      if (!username || !password) {
        return res.status(400).json({ success: false, message: "Korisni\u010Dko ime i password su obavezni" });
      }
      const existingAdmin = await storage.getAdminByUsername(username);
      if (existingAdmin) {
        return res.status(400).json({ success: false, message: "Korisni\u010Dko ime ve\u0107 postoji" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const adminData = {
        username,
        password: hashedPassword,
        role: "admin",
        createdBy: req2.admin.id,
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
        message: "Administrator je uspe\u0161no kreiran"
      });
    } catch (error) {
      console.error("Error creating admin:", error);
      res.status(500).json({ success: false, message: "Gre\u0161ka servera" });
    }
  });
  app2.delete("/api/admin/admins/:id", authenticateAdmin, async (req2, res) => {
    try {
      if (req2.admin.role !== "owner") {
        return res.status(403).json({ success: false, message: "Samo vlasnik mo\u017Ee brisati administratore" });
      }
      const adminId = req2.params.id;
      if (adminId === req2.admin.id) {
        return res.status(400).json({ success: false, message: "Ne mo\u017Eete obrisati svoj nalog" });
      }
      const success = await storage.deleteAdmin(adminId);
      if (success) {
        res.json({ success: true, message: "Administrator je uspe\u0161no obrisan" });
      } else {
        res.status(404).json({ success: false, message: "Administrator nije prona\u0111en" });
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      res.status(500).json({ success: false, message: "Gre\u0161ka servera" });
    }
  });
  app2.post("/api/admin/casinos", authenticateAdmin, async (req2, res) => {
    try {
      const {
        name,
        description,
        websiteUrl,
        affiliateUrl,
        logoUrl,
        establishedYear,
        license,
        safetyIndex,
        paymentMethods,
        supportedCurrencies,
        gameProviders,
        features,
        restrictedCountries,
        isActive,
        isFeatured
      } = req2.body;
      const casinoData = {
        name,
        description,
        websiteUrl,
        affiliateUrl,
        logoUrl,
        establishedYear,
        license,
        safetyIndex: safetyIndex.toString(),
        paymentMethods: paymentMethods || [],
        supportedCurrencies: supportedCurrencies || [],
        gameProviders: gameProviders || [],
        features: features || [],
        restrictedCountries: restrictedCountries || [],
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false
      };
      const validatedData = insertCasinoSchema.parse(casinoData);
      const casino = await storage.createCasino(validatedData);
      const {
        bonusesRating,
        bonusesExplanation,
        designRating,
        designExplanation,
        payoutsRating,
        payoutsExplanation,
        customerSupportRating,
        customerSupportExplanation,
        gameSelectionRating,
        gameSelectionExplanation,
        mobileExperienceRating,
        mobileExperienceExplanation,
        overallRating,
        expertSummary
      } = req2.body;
      if (bonusesRating !== void 0) {
        const expertReviewData = {
          casinoId: casino.id,
          authorId: req2.admin.id,
          // Koristimo admin ID kao autora
          bonusesRating: bonusesRating.toString(),
          bonusesExplanation: bonusesExplanation || "",
          designRating: designRating?.toString() || "5",
          designExplanation: designExplanation || "",
          payoutsRating: payoutsRating?.toString() || "5",
          payoutsExplanation: payoutsExplanation || "",
          customerSupportRating: customerSupportRating?.toString() || "5",
          customerSupportExplanation: customerSupportExplanation || "",
          gameSelectionRating: gameSelectionRating?.toString() || "5",
          gameSelectionExplanation: gameSelectionExplanation || "",
          mobileExperienceRating: mobileExperienceRating?.toString() || "5",
          mobileExperienceExplanation: mobileExperienceExplanation || "",
          overallRating: overallRating?.toString() || "5",
          summary: expertSummary || ""
        };
        try {
          await storage.createExpertReview(expertReviewData);
        } catch (reviewError) {
          console.error("Error creating expert review:", reviewError);
        }
      }
      res.json({ success: true, casino, message: "Kazino je uspe\u0161no kreiran" });
    } catch (error) {
      console.error("Error creating casino:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Neispravni podaci za kazino", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Gre\u0161ka servera prilikom kreiranja kazina" });
      }
    }
  });
  app2.put("/api/admin/casinos/:id", authenticateAdmin, async (req2, res) => {
    try {
      const casinoId = req2.params.id;
      const {
        name,
        description,
        websiteUrl,
        affiliateUrl,
        logoUrl,
        establishedYear,
        license,
        safetyIndex,
        paymentMethods,
        supportedCurrencies,
        gameProviders,
        features,
        restrictedCountries,
        isActive,
        isFeatured
      } = req2.body;
      const casinoUpdates = {};
      if (name !== void 0) casinoUpdates.name = name;
      if (description !== void 0) casinoUpdates.description = description;
      if (websiteUrl !== void 0) casinoUpdates.websiteUrl = websiteUrl;
      if (affiliateUrl !== void 0) casinoUpdates.affiliateUrl = affiliateUrl;
      if (logoUrl !== void 0) casinoUpdates.logoUrl = logoUrl;
      if (establishedYear !== void 0) casinoUpdates.establishedYear = establishedYear;
      if (license !== void 0) casinoUpdates.license = license;
      if (safetyIndex !== void 0) casinoUpdates.safetyIndex = safetyIndex.toString();
      if (paymentMethods !== void 0) casinoUpdates.paymentMethods = paymentMethods;
      if (supportedCurrencies !== void 0) casinoUpdates.supportedCurrencies = supportedCurrencies;
      if (gameProviders !== void 0) casinoUpdates.gameProviders = gameProviders;
      if (features !== void 0) casinoUpdates.features = features;
      if (restrictedCountries !== void 0) casinoUpdates.restrictedCountries = restrictedCountries;
      if (isActive !== void 0) casinoUpdates.isActive = isActive;
      if (isFeatured !== void 0) casinoUpdates.isFeatured = isFeatured;
      const validatedData = insertCasinoSchema.partial().parse(casinoUpdates);
      const casino = await storage.updateCasino(casinoId, validatedData);
      const {
        bonusesRating,
        bonusesExplanation,
        designRating,
        designExplanation,
        payoutsRating,
        payoutsExplanation,
        customerSupportRating,
        customerSupportExplanation,
        gameSelectionRating,
        gameSelectionExplanation,
        mobileExperienceRating,
        mobileExperienceExplanation,
        overallRating,
        expertSummary
      } = req2.body;
      if (bonusesRating !== void 0) {
        const existingReviews = await storage.getExpertReviewsByCasino(casinoId);
        const expertReviewData = {
          casinoId,
          authorId: req2.admin.id,
          bonusesRating: bonusesRating.toString(),
          bonusesExplanation: bonusesExplanation || "",
          designRating: designRating?.toString() || "5",
          designExplanation: designExplanation || "",
          payoutsRating: payoutsRating?.toString() || "5",
          payoutsExplanation: payoutsExplanation || "",
          customerSupportRating: customerSupportRating?.toString() || "5",
          customerSupportExplanation: customerSupportExplanation || "",
          gameSelectionRating: gameSelectionRating?.toString() || "5",
          gameSelectionExplanation: gameSelectionExplanation || "",
          mobileExperienceRating: mobileExperienceRating?.toString() || "5",
          mobileExperienceExplanation: mobileExperienceExplanation || "",
          overallRating: overallRating?.toString() || "5",
          summary: expertSummary || ""
        };
        try {
          if (existingReviews.length > 0) {
            await storage.updateExpertReview(existingReviews[0].id, expertReviewData);
          } else {
            await storage.createExpertReview(expertReviewData);
          }
        } catch (reviewError) {
          console.error("Error updating/creating expert review:", reviewError);
        }
      }
      res.json({ success: true, casino, message: "Kazino je uspe\u0161no a\u017Euriran" });
    } catch (error) {
      console.error("Error updating casino:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Neispravni podaci za a\u017Euriranje", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Gre\u0161ka servera prilikom a\u017Euriranja" });
      }
    }
  });
  app2.delete("/api/admin/casinos/:id", authenticateAdmin, async (req2, res) => {
    try {
      const casinoId = req2.params.id;
      const casino = await storage.getCasino(casinoId);
      if (!casino) {
        return res.status(404).json({ success: false, message: "Kazino nije prona\u0111en" });
      }
      await storage.updateCasino(casinoId, { isActive: false });
      res.json({ success: true, message: "Kazino je uspe\u0161no deaktiviran" });
    } catch (error) {
      console.error("Error deleting casino:", error);
      res.status(500).json({ success: false, message: "Gre\u0161ka servera" });
    }
  });
  app2.post("/api/admin/bonuses", authenticateAdmin, async (req2, res) => {
    try {
      const {
        casinoId,
        title,
        description,
        type,
        amount,
        wageringRequirement,
        minDeposit,
        maxWin,
        validUntil,
        terms,
        code,
        isFeatured,
        isActive
      } = req2.body;
      const bonusData = {
        casinoId,
        title,
        description,
        type,
        amount,
        wageringRequirement,
        minDeposit,
        maxWin,
        validUntil: validUntil ? new Date(validUntil) : null,
        terms,
        code,
        isFeatured: isFeatured ?? false,
        isActive: isActive ?? true
      };
      const validatedData = insertBonusSchema.parse(bonusData);
      const bonus = await storage.createBonus(validatedData);
      res.json({ success: true, bonus, message: "Bonus je uspe\u0161no kreiran" });
    } catch (error) {
      console.error("Error creating bonus:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Neispravni podaci za bonus", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Gre\u0161ka servera prilikom kreiranja bonusa" });
      }
    }
  });
  app2.put("/api/admin/bonuses/:id", authenticateAdmin, async (req2, res) => {
    try {
      const bonusId = req2.params.id;
      const {
        casinoId,
        title,
        description,
        type,
        amount,
        wageringRequirement,
        minDeposit,
        maxWin,
        validUntil,
        terms,
        code,
        isFeatured,
        isActive
      } = req2.body;
      const bonusUpdates = {};
      if (casinoId !== void 0) bonusUpdates.casinoId = casinoId;
      if (title !== void 0) bonusUpdates.title = title;
      if (description !== void 0) bonusUpdates.description = description;
      if (type !== void 0) bonusUpdates.type = type;
      if (amount !== void 0) bonusUpdates.amount = amount;
      if (wageringRequirement !== void 0) bonusUpdates.wageringRequirement = wageringRequirement;
      if (minDeposit !== void 0) bonusUpdates.minDeposit = minDeposit;
      if (maxWin !== void 0) bonusUpdates.maxWin = maxWin;
      if (validUntil !== void 0) bonusUpdates.validUntil = validUntil ? new Date(validUntil) : null;
      if (terms !== void 0) bonusUpdates.terms = terms;
      if (code !== void 0) bonusUpdates.code = code;
      if (isFeatured !== void 0) bonusUpdates.isFeatured = isFeatured;
      if (isActive !== void 0) bonusUpdates.isActive = isActive;
      const validatedData = insertBonusSchema.partial().parse(bonusUpdates);
      const bonus = await storage.updateBonus(bonusId, validatedData);
      res.json({ success: true, bonus, message: "Bonus je uspe\u0161no a\u017Euriran" });
    } catch (error) {
      console.error("Error updating bonus:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Neispravni podaci za a\u017Euriranje bonusa", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Gre\u0161ka servera prilikom a\u017Euriranja bonusa" });
      }
    }
  });
  app2.delete("/api/admin/bonuses/:id", authenticateAdmin, async (req2, res) => {
    try {
      const bonusId = req2.params.id;
      const bonus = await storage.getBonus(bonusId);
      if (!bonus) {
        return res.status(404).json({ success: false, message: "Bonus nije prona\u0111en" });
      }
      await storage.updateBonus(bonusId, { isActive: false });
      res.json({ success: true, message: "Bonus je uspe\u0161no deaktiviran" });
    } catch (error) {
      console.error("Error deleting bonus:", error);
      res.status(500).json({ success: false, message: "Gre\u0161ka servera" });
    }
  });
  app2.post("/api/admin/games", authenticateAdmin, async (req2, res) => {
    try {
      console.log("Game creation request body:", req2.body);
      const {
        name,
        description,
        provider,
        type,
        category,
        rtp,
        volatility,
        minBet,
        maxBet,
        imageUrl,
        demoUrl,
        tags,
        isActive
      } = req2.body;
      console.log("Extracted values:", { name, description, provider, type, category, rtp, volatility, minBet, maxBet });
      const gameData = {
        name: name || "",
        description: description || "",
        provider: provider || "",
        type: type || category || "slot",
        // Use type first, then category as fallback, then default
        rtp: rtp !== void 0 && rtp !== null && rtp !== "" ? String(rtp) : null,
        volatility: volatility || null,
        minBet: minBet !== void 0 && minBet !== null && minBet !== "" ? String(minBet) : null,
        maxBet: maxBet !== void 0 && maxBet !== null && maxBet !== "" ? String(maxBet) : null,
        imageUrl: imageUrl || null,
        demoUrl: demoUrl || null,
        tags: Array.isArray(tags) ? tags : [],
        isActive: isActive ?? true
      };
      console.log("Processed gameData:", gameData);
      const validatedData = insertGameSchema.parse(gameData);
      const game = await storage.createGame(validatedData);
      res.json({ success: true, game, message: "Game created successfully" });
    } catch (error) {
      console.error("Error creating game:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid game data", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Server error while creating game" });
      }
    }
  });
  app2.put("/api/admin/games/:id", authenticateAdmin, async (req2, res) => {
    try {
      const gameId = req2.params.id;
      const {
        name,
        description,
        provider,
        type,
        rtp,
        volatility,
        minBet,
        maxBet,
        imageUrl,
        demoUrl,
        tags,
        isActive
      } = req2.body;
      const gameUpdates = {};
      if (name !== void 0) gameUpdates.name = name;
      if (description !== void 0) gameUpdates.description = description;
      if (provider !== void 0) gameUpdates.provider = provider;
      if (type !== void 0) gameUpdates.type = type;
      if (rtp !== void 0) gameUpdates.rtp = rtp ? rtp.toString() : null;
      if (volatility !== void 0) gameUpdates.volatility = volatility;
      if (minBet !== void 0) gameUpdates.minBet = minBet ? minBet.toString() : null;
      if (maxBet !== void 0) gameUpdates.maxBet = maxBet ? maxBet.toString() : null;
      if (imageUrl !== void 0) gameUpdates.imageUrl = imageUrl;
      if (demoUrl !== void 0) gameUpdates.demoUrl = demoUrl;
      if (tags !== void 0) gameUpdates.tags = tags;
      if (isActive !== void 0) gameUpdates.isActive = isActive;
      const validatedData = insertGameSchema.partial().parse(gameUpdates);
      const game = await storage.updateGame(gameId, validatedData);
      res.json({ success: true, game, message: "Igra je uspe\u0161no a\u017Eurirana" });
    } catch (error) {
      console.error("Error updating game:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Neispravni podaci za a\u017Euriranje igre", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Gre\u0161ka servera prilikom a\u017Euriranja igre" });
      }
    }
  });
  app2.delete("/api/admin/games/:id", authenticateAdmin, async (req2, res) => {
    try {
      const gameId = req2.params.id;
      const game = await storage.getGame(gameId);
      if (!game) {
        return res.status(404).json({ success: false, message: "Igra nije prona\u0111ena" });
      }
      await storage.updateGame(gameId, { isActive: false });
      res.json({ success: true, message: "Igra je uspe\u0161no deaktivirana" });
    } catch (error) {
      console.error("Error deleting game:", error);
      res.status(500).json({ success: false, message: "Gre\u0161ka servera" });
    }
  });
  app2.post("/api/admin/blog", authenticateAdmin, async (req2, res) => {
    try {
      const {
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        contentMedia,
        authorId,
        category,
        tags,
        readTime,
        metaDescription,
        relatedCasinos,
        relatedGames,
        isPublished,
        isFeatured,
        publishedAt
      } = req2.body;
      const blogData = {
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        contentMedia: contentMedia || [],
        authorId,
        category,
        tags: tags || [],
        readTime: readTime ? parseInt(readTime) : null,
        metaDescription,
        relatedCasinos: relatedCasinos || [],
        relatedGames: relatedGames || [],
        isPublished: isPublished ?? false,
        isFeatured: isFeatured ?? false,
        publishedAt: publishedAt ? new Date(publishedAt) : null
      };
      const blogPost = await storage.createBlogPost(blogData);
      res.json({ success: true, blogPost, message: "Blog post je uspe\u0161no kreiran" });
    } catch (error) {
      console.error("Error creating blog post:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Neispravni podaci za blog post", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Gre\u0161ka servera prilikom kreiranja blog posta" });
      }
    }
  });
  app2.put("/api/admin/blog/:id", authenticateAdmin, async (req2, res) => {
    try {
      const blogId = req2.params.id;
      const updates = req2.body;
      if (updates.publishedAt && typeof updates.publishedAt === "string") {
        updates.publishedAt = new Date(updates.publishedAt);
      }
      const validatedData = insertBlogPostSchema.partial().parse(updates);
      const blogPost = await storage.updateBlogPost(blogId, validatedData);
      res.json({ success: true, blogPost });
    } catch (error) {
      console.error("Error updating blog post:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Neispravni podaci", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Gre\u0161ka servera" });
      }
    }
  });
  app2.delete("/api/admin/blog/:id", authenticateAdmin, async (req2, res) => {
    try {
      const blogId = req2.params.id;
      const blogPost = await storage.getBlogPost(blogId);
      if (!blogPost) {
        return res.status(404).json({ success: false, message: "Blog post nije prona\u0111en" });
      }
      await storage.updateBlogPost(blogId, { isPublished: false });
      res.json({ success: true, message: "Blog post je uspe\u0161no deaktiviran" });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ success: false, message: "Gre\u0161ka servera" });
    }
  });
  app2.post("/api/chat", async (req2, res) => {
    try {
      const { message } = req2.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }
      if (!openai) {
        return res.status(503).json({
          error: "AI chatbot is currently unavailable. Please contact support for assistance."
        });
      }
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are an AI assistant for GetABonus.net, a casino affiliate website. You help users with:
            
            1. Casino recommendations and reviews
            2. Bonus explanations and advice
            3. Game strategies and rules
            4. Responsible gambling guidance
            5. Payment methods and security
            
            Be helpful, knowledgeable about online gambling, and always promote responsible gambling. Keep responses concise but informative. If asked about specific casinos or bonuses, recommend users check the latest information on the website.`
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      });
      const aiResponse = completion.choices[0]?.message?.content || "Sorry, I couldn't process your request right now.";
      res.json({
        response: aiResponse,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("OpenAI API Error:", error);
      res.status(500).json({
        error: "Sorry, I'm having trouble connecting right now. Please try again later."
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/index.ts
try {
  const dotenv = await import("dotenv");
  dotenv.config();
} catch (error) {
  console.log("Environment variables loaded from system");
}
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req2, res, next) => {
  const start = Date.now();
  const path3 = req2.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req2.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      console.log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (process.env.NODE_ENV === "development") {
    try {
      const { setupVite: setupVite2 } = await init_vite().then(() => vite_exports);
      await setupVite2(app, server);
    } catch (error) {
      console.warn("Vite setup failed, serving static files instead");
      app.use(express2.static("client/dist"));
      app.get("*", (_req, res) => {
        res.sendFile("client/dist/index.html", { root: process.cwd() });
      });
    }
  } else {
    const path3 = await import("path");
    const { fileURLToPath } = await import("url");
    let __dirname;
    try {
      if (import.meta.url) {
        __dirname = path3.dirname(fileURLToPath(import.meta.url));
      } else {
        __dirname = process.cwd();
      }
    } catch (error) {
      __dirname = process.cwd();
    }
    const distPath = path3.join(__dirname, "client/dist");
    app.use(express2.static(distPath));
    app.get("*", (_req, res) => {
      if (!req.path.startsWith("/api")) {
        res.sendFile(path3.join(distPath, "index.html"));
      }
    });
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    console.log(`GetABonus.net server running on port ${port}`);
  });
})();
