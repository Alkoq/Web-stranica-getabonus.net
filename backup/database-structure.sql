-- GetABonus.net Database Structure
-- Casino Affiliate Platform Database Schema

-- Create database (if needed)
-- CREATE DATABASE getabonus_net;
-- USE getabonus_net;

-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (gen_random_uuid()),
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admins table for admin management
CREATE TABLE admins (
    id VARCHAR(36) PRIMARY KEY DEFAULT (gen_random_uuid()),
    username VARCHAR(50) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'admin',
    created_by VARCHAR(36),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES admins(id)
);

-- Casinos table
CREATE TABLE casinos (
    id VARCHAR(36) PRIMARY KEY DEFAULT (gen_random_uuid()),
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    website_url TEXT NOT NULL,
    affiliate_url TEXT,
    safety_index NUMERIC NOT NULL,
    user_rating NUMERIC DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    established_year INTEGER,
    license TEXT,
    payment_methods JSONB DEFAULT '[]',
    supported_currencies JSONB DEFAULT '[]',
    game_providers JSONB DEFAULT '[]',
    features JSONB DEFAULT '[]',
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bonuses table
CREATE TABLE bonuses (
    id VARCHAR(36) PRIMARY KEY DEFAULT (gen_random_uuid()),
    casino_id VARCHAR(36) NOT NULL,
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (casino_id) REFERENCES casinos(id) ON DELETE CASCADE
);

-- Games table
CREATE TABLE games (
    id VARCHAR(36) PRIMARY KEY DEFAULT (gen_random_uuid()),
    name TEXT NOT NULL,
    description TEXT,
    provider TEXT NOT NULL,
    type TEXT NOT NULL,
    rtp NUMERIC,
    volatility TEXT,
    min_bet NUMERIC,
    max_bet NUMERIC,
    image_url TEXT,
    demo_url TEXT,
    tags JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Casino-Games junction table
CREATE TABLE casino_games (
    casino_id VARCHAR(36) NOT NULL,
    game_id VARCHAR(36) NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (casino_id, game_id),
    FOREIGN KEY (casino_id) REFERENCES casinos(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- Reviews table (user reviews)
CREATE TABLE reviews (
    id VARCHAR(36) PRIMARY KEY DEFAULT (gen_random_uuid()),
    casino_id VARCHAR(36),
    bonus_id VARCHAR(36),
    game_id VARCHAR(36),
    user_id VARCHAR(36),
    user_name TEXT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER,
    overall_rating INTEGER,
    bonuses_rating INTEGER,
    design_rating INTEGER,
    payouts_rating INTEGER,
    customer_support_rating INTEGER,
    game_selection_rating INTEGER,
    mobile_experience_rating INTEGER,
    pros JSONB DEFAULT '[]',
    cons JSONB DEFAULT '[]',
    helpful_votes INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (casino_id) REFERENCES casinos(id) ON DELETE CASCADE,
    FOREIGN KEY (bonus_id) REFERENCES bonuses(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Expert Reviews table
CREATE TABLE expert_reviews (
    id VARCHAR(36) PRIMARY KEY DEFAULT (gen_random_uuid()),
    casino_id VARCHAR(36) NOT NULL,
    author_id VARCHAR(36) NOT NULL,
    bonuses_rating NUMERIC NOT NULL,
    bonuses_explanation TEXT NOT NULL,
    design_rating NUMERIC NOT NULL,
    design_explanation TEXT NOT NULL,
    payouts_rating NUMERIC NOT NULL,
    payouts_explanation TEXT NOT NULL,
    customer_support_rating NUMERIC NOT NULL,
    customer_support_explanation TEXT NOT NULL,
    game_selection_rating NUMERIC NOT NULL,
    game_selection_explanation TEXT NOT NULL,
    mobile_experience_rating NUMERIC NOT NULL,
    mobile_experience_explanation TEXT NOT NULL,
    overall_rating NUMERIC NOT NULL,
    summary TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (casino_id) REFERENCES casinos(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES admins(id)
);

-- Expert Game Reviews table
CREATE TABLE expert_game_reviews (
    id VARCHAR(36) PRIMARY KEY DEFAULT (gen_random_uuid()),
    game_id VARCHAR(36) NOT NULL,
    author_id VARCHAR(36) NOT NULL,
    overall_rating NUMERIC NOT NULL,
    summary TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES admins(id)
);

-- Blog Posts table
CREATE TABLE blog_posts (
    id VARCHAR(36) PRIMARY KEY DEFAULT (gen_random_uuid()),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    author_id VARCHAR(36),
    category TEXT NOT NULL,
    tags JSONB DEFAULT '[]',
    read_time INTEGER,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES admins(id)
);

-- Casino Ratings table (for quick access to aggregated ratings)
CREATE TABLE casino_ratings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (gen_random_uuid()),
    casino_id VARCHAR(36) NOT NULL,
    bonuses_rating NUMERIC NOT NULL,
    design_rating NUMERIC NOT NULL,
    payouts_rating NUMERIC NOT NULL,
    customer_support_rating NUMERIC NOT NULL,
    game_selection_rating NUMERIC NOT NULL,
    mobile_experience_rating NUMERIC NOT NULL,
    overall_rating NUMERIC NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (casino_id) REFERENCES casinos(id) ON DELETE CASCADE
);

-- Newsletter Subscribers table
CREATE TABLE newsletter_subscribers (
    id VARCHAR(36) PRIMARY KEY DEFAULT (gen_random_uuid()),
    email TEXT NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Interactions table (for analytics)
CREATE TABLE user_interactions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (gen_random_uuid()),
    session_id TEXT NOT NULL,
    interaction_type TEXT NOT NULL,
    target_id TEXT,
    target_type TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comparisons table (user comparison lists)
CREATE TABLE comparisons (
    id VARCHAR(36) PRIMARY KEY DEFAULT (gen_random_uuid()),
    user_id VARCHAR(36),
    casino_ids JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_casinos_active ON casinos(is_active);
CREATE INDEX idx_casinos_featured ON casinos(is_featured);
CREATE INDEX idx_bonuses_casino_id ON bonuses(casino_id);
CREATE INDEX idx_bonuses_active ON bonuses(is_active);
CREATE INDEX idx_bonuses_featured ON bonuses(is_featured);
CREATE INDEX idx_games_active ON games(is_active);
CREATE INDEX idx_games_provider ON games(provider);
CREATE INDEX idx_games_type ON games(type);
CREATE INDEX idx_reviews_casino_id ON reviews(casino_id);
CREATE INDEX idx_reviews_bonus_id ON reviews(bonus_id);
CREATE INDEX idx_reviews_game_id ON reviews(game_id);
CREATE INDEX idx_reviews_published ON reviews(is_published);
CREATE INDEX idx_expert_reviews_casino_id ON expert_reviews(casino_id);
CREATE INDEX idx_blog_posts_published ON blog_posts(is_published);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_user_interactions_type ON user_interactions(interaction_type);
CREATE INDEX idx_user_interactions_target ON user_interactions(target_id, target_type);

-- Insert initial admin user
INSERT INTO admins (username, password, role, is_active) VALUES 
('alkox', '$2a$10$encrypted_password_hash', 'owner', true);

-- Insert sample casinos
INSERT INTO casinos (id, name, description, website_url, safety_index, established_year, license, is_featured, is_active) VALUES 
('casino-001', 'GetABonus Casino', 'Premium online kazino sa najboljim bonusima i igrama. Licenciran i bezbedan za igranje.', 'https://getabonus.casino', 9.2, 2020, 'Malta Gaming Authority (MGA), UK Gambling Commission', true, true),
('casino-002', 'Bonus King Casino', 'Kraljevski tretman za sve igrače sa ekskluzivnim bonusima i premium uslugom.', 'https://bonusking.casino', 8.9, 2019, 'Curacao Gaming License', true, true);

-- Insert sample bonuses
INSERT INTO bonuses (casino_id, title, description, type, amount, wagering_requirement, min_deposit, code, is_featured, is_active) VALUES 
('casino-001', 'Dobrodošlica Bonus 200% + 50 Free Spins', 'Ekskluzivni dobrodošlica paket za nove igrače', 'welcome', '200% do €500', '35x', '€20', 'WELCOME200', true, true);

-- Insert sample games
INSERT INTO games (name, description, provider, type, rtp, volatility, is_active) VALUES 
('Starburst', 'Popularan slot sa NetEnt provajderom', 'NetEnt', 'slot', 96.1, 'low', true),
('Book of Dead', 'Avanturski slot sa Play\'n GO', 'Play\'n GO', 'slot', 96.2, 'high', true),
('Lightning Roulette', 'Live roulette sa Evolution Gaming', 'Evolution Gaming', 'live', 97.3, 'medium', true);

-- Insert sample expert review
INSERT INTO expert_reviews (
    casino_id, author_id, 
    bonuses_rating, bonuses_explanation,
    design_rating, design_explanation,
    payouts_rating, payouts_explanation,
    customer_support_rating, customer_support_explanation,
    game_selection_rating, game_selection_explanation,
    mobile_experience_rating, mobile_experience_explanation,
    overall_rating, summary
) VALUES (
    'casino-001', (SELECT id FROM admins WHERE username = 'alkox' LIMIT 1),
    9.0, 'Odličan izbor bonusa sa fer uslovima',
    8.5, 'Moderan i intuitivan dizajn',
    9.2, 'Brze isplate, obično u roku od 24h',
    8.8, '24/7 podrška na više jezika',
    9.1, 'Preko 2000 igara od top provajdera',
    8.7, 'Odlična mobilna verzija',
    8.9, 'GetABonus Casino je odličan izbor za sve tipove igrača.'
);