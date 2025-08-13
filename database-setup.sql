-- GetABonus.net Database Setup Script
-- Run this script on your PostgreSQL server to create all required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Casinos table
CREATE TABLE IF NOT EXISTS casinos (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    website_url TEXT NOT NULL,
    affiliate_url TEXT,
    safety_index DECIMAL(3,1) NOT NULL,
    user_rating DECIMAL(3,1) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    established_year INTEGER,
    license TEXT,
    payment_methods JSONB DEFAULT '[]'::jsonb,
    supported_currencies JSONB DEFAULT '[]'::jsonb,
    game_providers JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Games table
CREATE TABLE IF NOT EXISTS games (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    provider TEXT NOT NULL,
    category TEXT NOT NULL,
    rtp DECIMAL(4,2),
    volatility TEXT,
    max_win TEXT,
    min_bet TEXT,
    max_bet TEXT,
    paylines INTEGER,
    demo_url TEXT,
    image_url TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Bonuses table
CREATE TABLE IF NOT EXISTS bonuses (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    casino_id VARCHAR REFERENCES casinos(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    amount TEXT,
    wagering_requirement TEXT,
    min_deposit TEXT,
    max_win TEXT,
    valid_until TIMESTAMP,
    terms TEXT,
    code TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Casino Games junction table
CREATE TABLE IF NOT EXISTS casino_games (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    casino_id VARCHAR REFERENCES casinos(id) NOT NULL,
    game_id VARCHAR REFERENCES games(id) NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(casino_id, game_id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    casino_id VARCHAR REFERENCES casinos(id),
    bonus_id VARCHAR REFERENCES bonuses(id),
    game_id VARCHAR REFERENCES games(id),
    user_id VARCHAR REFERENCES users(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    overall_rating INTEGER NOT NULL,
    bonuses_rating INTEGER,
    design_rating INTEGER,
    payouts_rating INTEGER,
    customer_support_rating INTEGER,
    game_selection_rating INTEGER,
    mobile_experience_rating INTEGER,
    user_name TEXT,
    pros JSONB DEFAULT '[]'::jsonb,
    cons JSONB DEFAULT '[]'::jsonb,
    helpful_votes INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Expert Reviews table
CREATE TABLE IF NOT EXISTS expert_reviews (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    casino_id VARCHAR REFERENCES casinos(id) NOT NULL,
    author_id VARCHAR REFERENCES users(id) NOT NULL,
    bonuses_rating DECIMAL(3,1) NOT NULL,
    bonuses_explanation TEXT NOT NULL,
    design_rating DECIMAL(3,1) NOT NULL,
    design_explanation TEXT NOT NULL,
    payouts_rating DECIMAL(3,1) NOT NULL,
    payouts_explanation TEXT NOT NULL,
    customer_support_rating DECIMAL(3,1) NOT NULL,
    customer_support_explanation TEXT NOT NULL,
    game_selection_rating DECIMAL(3,1) NOT NULL,
    game_selection_explanation TEXT NOT NULL,
    mobile_experience_rating DECIMAL(3,1) NOT NULL,
    mobile_experience_explanation TEXT NOT NULL,
    overall_rating DECIMAL(3,1) NOT NULL,
    summary TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Blog Posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    content_media JSONB DEFAULT '[]'::jsonb,
    author_id VARCHAR REFERENCES users(id),
    category TEXT NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    read_time INTEGER,
    meta_description TEXT,
    related_casinos JSONB DEFAULT '[]'::jsonb,
    related_games JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User Interactions table
CREATE TABLE IF NOT EXISTS user_interactions (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id VARCHAR,
    user_agent TEXT,
    ip_address TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Newsletter Subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Casino Ratings table (for detailed rating breakdowns)
CREATE TABLE IF NOT EXISTS casino_ratings (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    casino_id VARCHAR REFERENCES casinos(id) NOT NULL,
    bonuses_rating DECIMAL(3,1) DEFAULT 0,
    design_rating DECIMAL(3,1) DEFAULT 0,
    payouts_rating DECIMAL(3,1) DEFAULT 0,
    customer_support_rating DECIMAL(3,1) DEFAULT 0,
    game_selection_rating DECIMAL(3,1) DEFAULT 0,
    mobile_experience_rating DECIMAL(3,1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(casino_id)
);

-- Comparisons table (for casino comparison feature)
CREATE TABLE IF NOT EXISTS comparisons (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    casino_ids JSONB NOT NULL,
    created_by VARCHAR REFERENCES users(id),
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Helpful Votes table (for review voting)
CREATE TABLE IF NOT EXISTS helpful_votes (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id VARCHAR REFERENCES reviews(id) NOT NULL,
    user_id VARCHAR,
    session_id VARCHAR,
    vote_type TEXT CHECK (vote_type IN ('helpful', 'not_helpful')) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(review_id, COALESCE(user_id, session_id))
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_casinos_is_active ON casinos(is_active);
CREATE INDEX IF NOT EXISTS idx_casinos_is_featured ON casinos(is_featured);
CREATE INDEX IF NOT EXISTS idx_bonuses_casino_id ON bonuses(casino_id);
CREATE INDEX IF NOT EXISTS idx_bonuses_is_active ON bonuses(is_active);
CREATE INDEX IF NOT EXISTS idx_games_category ON games(category);
CREATE INDEX IF NOT EXISTS idx_games_provider ON games(provider);
CREATE INDEX IF NOT EXISTS idx_reviews_casino_id ON reviews(casino_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_published ON blog_posts(is_published);

-- Insert default admin user (alkox)
INSERT INTO admins (username, password, role) 
VALUES ('alkox', '$2b$10$K5yX8jBVJwvQ4vZ3T8oQAuVEcF/Vl0FjXrLr5Kv3A8dVhP2wQ9r6C', 'owner') 
ON CONFLICT (username) DO NOTHING;

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_casinos_updated_at BEFORE UPDATE ON casinos FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_bonuses_updated_at BEFORE UPDATE ON bonuses FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_expert_reviews_updated_at BEFORE UPDATE ON expert_reviews FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_casino_ratings_updated_at BEFORE UPDATE ON casino_ratings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

COMMENT ON DATABASE getabonus IS 'GetABonus.net Casino Affiliate Platform Database';