import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const casinos = pgTable("casinos", {
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
  paymentMethods: jsonb("payment_methods").$type<string[]>().default([]),
  supportedCurrencies: jsonb("supported_currencies").$type<string[]>().default([]),
  gameProviders: jsonb("game_providers").$type<string[]>().default([]),
  features: jsonb("features").$type<string[]>().default([]),
  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const bonuses = pgTable("bonuses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  casinoId: varchar("casino_id").references(() => casinos.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // welcome, no_deposit, free_spins, cashback, etc.
  amount: text("amount"), // e.g., "200%", "$50", "100 FS"
  wageringRequirement: text("wagering_requirement"),
  minDeposit: text("min_deposit"),
  maxWin: text("max_win"),
  validUntil: timestamp("valid_until"),
  terms: text("terms"),
  code: text("code"),
  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  casinoId: varchar("casino_id").references(() => casinos.id),
  bonusId: varchar("bonus_id").references(() => bonuses.id),
  gameId: varchar("game_id").references(() => games.id),
  userId: varchar("user_id").references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  overallRating: integer("overall_rating").notNull(), // 1-10 stars
  bonusesRating: integer("bonuses_rating"), // 1-10 rating (only for casino reviews)
  designRating: integer("design_rating"), // 1-10 rating (only for casino reviews)
  payoutsRating: integer("payouts_rating"), // 1-10 rating (only for casino reviews)
  customerSupportRating: integer("customer_support_rating"), // 1-10 rating (only for casino reviews)
  gameSelectionRating: integer("game_selection_rating"), // 1-10 rating (only for casino reviews)
  mobileExperienceRating: integer("mobile_experience_rating"), // 1-10 rating (only for casino reviews)
  userName: text("user_name"),
  pros: jsonb("pros").$type<string[]>().default([]),
  cons: jsonb("cons").$type<string[]>().default([]),
  helpfulVotes: integer("helpful_votes").default(0),
  isVerified: boolean("is_verified").default(false),
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Expert reviews table for our portal's professional reviews
export const expertReviews = pgTable("expert_reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  casinoId: varchar("casino_id").references(() => casinos.id).notNull(),
  authorId: varchar("author_id").references(() => users.id).notNull(),
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  authorId: varchar("author_id").references(() => users.id),
  category: text("category").notNull(),
  tags: jsonb("tags").$type<string[]>().default([]),
  readTime: integer("read_time"), // minutes
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  isActive: boolean("is_active").default(true),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
});

export const comparisons = pgTable("comparisons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  casinoIds: jsonb("casino_ids").$type<string[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const games = pgTable("games", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  provider: text("provider").notNull(),
  type: text("type").notNull(), // slot, table, live, etc.
  rtp: decimal("rtp", { precision: 5, scale: 2 }), // Return to Player percentage
  volatility: text("volatility"), // low, medium, high
  minBet: decimal("min_bet", { precision: 10, scale: 2 }),
  maxBet: decimal("max_bet", { precision: 10, scale: 2 }),
  imageUrl: text("image_url"),
  demoUrl: text("demo_url"),
  tags: jsonb("tags").$type<string[]>().default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const casinoGames = pgTable("casino_games", {
  casinoId: varchar("casino_id").references(() => casinos.id).notNull(),  
  gameId: varchar("game_id").references(() => games.id).notNull(),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const casinoRatings = pgTable("casino_ratings", {
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const casinosRelations = relations(casinos, ({ many, one }) => ({
  bonuses: many(bonuses),
  reviews: many(reviews),
  expertReview: one(expertReviews),
  casinoGames: many(casinoGames),
  ratings: many(casinoRatings),
}));

export const bonusesRelations = relations(bonuses, ({ one, many }) => ({
  casino: one(casinos, {
    fields: [bonuses.casinoId],
    references: [casinos.id],
  }),
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  casino: one(casinos, {
    fields: [reviews.casinoId],
    references: [casinos.id],
  }),
  bonus: one(bonuses, {
    fields: [reviews.bonusId],
    references: [bonuses.id],
  }),
  game: one(games, {
    fields: [reviews.gameId],
    references: [games.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const expertReviewsRelations = relations(expertReviews, ({ one }) => ({
  casino: one(casinos, {
    fields: [expertReviews.casinoId],
    references: [casinos.id],
  }),
  author: one(users, {
    fields: [expertReviews.authorId],
    references: [users.id],
  }),
}));

export const gamesRelations = relations(games, ({ many }) => ({
  casinoGames: many(casinoGames),
  reviews: many(reviews),
}));

// Table to track who voted helpful on which review (prevent multiple votes)
export const helpfulVotes = pgTable("helpful_votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reviewId: varchar("review_id").references(() => reviews.id).notNull(),
  voterIdentifier: varchar("voter_identifier").notNull(), // IP address or session ID
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  // Unique constraint to prevent duplicate votes from same user on same review
  index("unique_review_voter").on(table.reviewId, table.voterIdentifier),
]);

export const casinoGamesRelations = relations(casinoGames, ({ one }) => ({
  casino: one(casinos, {
    fields: [casinoGames.casinoId],
    references: [casinos.id],
  }),
  game: one(games, {
    fields: [casinoGames.gameId],
    references: [games.id],
  }),
}));

export const casinoRatingsRelations = relations(casinoRatings, ({ one }) => ({
  casino: one(casinos, {
    fields: [casinoRatings.casinoId],
    references: [casinos.id],
  }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  reviews: many(reviews),
  blogPosts: many(blogPosts),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCasinoSchema = createInsertSchema(casinos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBonusSchema = createInsertSchema(bonuses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertExpertReviewSchema = createInsertSchema(expertReviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).omit({
  id: true,
  subscribedAt: true,
});

export const insertHelpfulVoteSchema = createInsertSchema(helpfulVotes).omit({
  id: true,
  createdAt: true,
});

export const insertComparisonSchema = createInsertSchema(comparisons).omit({
  id: true,
  createdAt: true,
});

export const insertGameSchema = createInsertSchema(games).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCasinoGameSchema = createInsertSchema(casinoGames).omit({
  createdAt: true,
});

export const insertCasinoRatingSchema = createInsertSchema(casinoRatings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Casino = typeof casinos.$inferSelect;
export type InsertCasino = z.infer<typeof insertCasinoSchema>;

export type Bonus = typeof bonuses.$inferSelect;
export type InsertBonus = z.infer<typeof insertBonusSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type ExpertReview = typeof expertReviews.$inferSelect;
export type InsertExpertReview = z.infer<typeof insertExpertReviewSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;

export type Comparison = typeof comparisons.$inferSelect;
export type InsertComparison = z.infer<typeof insertComparisonSchema>;

export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;

export type CasinoGame = typeof casinoGames.$inferSelect;
export type InsertCasinoGame = z.infer<typeof insertCasinoGameSchema>;

export type CasinoRating = typeof casinoRatings.$inferSelect;
export type InsertCasinoRating = z.infer<typeof insertCasinoRatingSchema>;
