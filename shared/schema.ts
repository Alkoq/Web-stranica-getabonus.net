import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
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
  casinoId: varchar("casino_id").references(() => casinos.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  pros: jsonb("pros").$type<string[]>().default([]),
  cons: jsonb("cons").$type<string[]>().default([]),
  isVerified: boolean("is_verified").default(false),
  isPublished: boolean("is_published").default(true),
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

// Relations
export const casinosRelations = relations(casinos, ({ many }) => ({
  bonuses: many(bonuses),
  reviews: many(reviews),
}));

export const bonusesRelations = relations(bonuses, ({ one }) => ({
  casino: one(casinos, {
    fields: [bonuses.casinoId],
    references: [casinos.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  casino: one(casinos, {
    fields: [reviews.casinoId],
    references: [casinos.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
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

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).omit({
  id: true,
  subscribedAt: true,
});

export const insertComparisonSchema = createInsertSchema(comparisons).omit({
  id: true,
  createdAt: true,
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

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;

export type Comparison = typeof comparisons.$inferSelect;
export type InsertComparison = z.infer<typeof insertComparisonSchema>;
