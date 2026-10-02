import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import fs from 'fs';
import path from 'path';

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const sqlite = new Database(path.join(dataDir, 'sqlite.db'));
export const db = drizzle(sqlite, { schema });

// Initialize database schema
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    avatar TEXT,
    bio TEXT,
    wallet_address TEXT,
    two_factor_enabled INTEGER DEFAULT 0,
    plan_id TEXT,
    reset_token TEXT,
    reset_token_expires INTEGER,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    owner_id TEXT,
    status TEXT DEFAULT 'active',
    created_at INTEGER NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS social_accounts (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    platform TEXT NOT NULL,
    account_name TEXT NOT NULL,
    account_id TEXT NOT NULL,
    avatar_url TEXT,
    status TEXT DEFAULT 'active',
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    workspace_id TEXT,
    account_id TEXT,
    platform TEXT NOT NULL DEFAULT 'twitter',
    content TEXT NOT NULL,
    media_urls TEXT,
    first_comment TEXT,
    tags TEXT,
    campaign TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    created_by TEXT,
    approved_by TEXT,
    scheduled_at INTEGER,
    published_at INTEGER,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (account_id) REFERENCES social_accounts(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS vcards (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    template_id TEXT NOT NULL DEFAULT 'cyber-dark',
    full_name TEXT NOT NULL,
    job_title TEXT,
    company TEXT,
    bio TEXT,
    email TEXT,
    phone TEXT,
    website TEXT,
    address TEXT,
    social_links TEXT,
    theme_colors TEXT,
    slug TEXT NOT NULL UNIQUE,
    qr_code TEXT,
    is_published INTEGER DEFAULT 1,
    views_count INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS whatsapp_stores (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    store_name TEXT NOT NULL,
    description TEXT,
    whatsapp_number TEXT NOT NULL,
    currency TEXT DEFAULT 'USD',
    template_id TEXT DEFAULT 'neon-cyber',
    store_url TEXT UNIQUE,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS whatsapp_products (
    id TEXT PRIMARY KEY,
    store_id TEXT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT DEFAULT 'General',
    description TEXT,
    image_url TEXT,
    in_stock INTEGER DEFAULT 1,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (store_id) REFERENCES whatsapp_stores(id)
  );

  CREATE TABLE IF NOT EXISTS plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    interval TEXT DEFAULT 'month',
    features TEXT,
    is_popular INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    plan_id TEXT,
    status TEXT DEFAULT 'active',
    start_date INTEGER NOT NULL,
    end_date INTEGER,
    payment_gateway TEXT DEFAULT 'Stripe',
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (plan_id) REFERENCES plans(id)
  );

  CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    invoice_number TEXT NOT NULL UNIQUE,
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'paid',
    paid_at INTEGER,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT NOT NULL,
    priority TEXT DEFAULT 'Medium',
    category TEXT DEFAULT 'Cyber AI',
    user_id TEXT,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS content_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Published',
    author TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    user_email TEXT NOT NULL,
    level TEXT NOT NULL DEFAULT 'INFO',
    ip_address TEXT,
    timestamp INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS error_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    user_email TEXT,
    message TEXT NOT NULL,
    stack TEXT,
    context TEXT,
    url TEXT,
    user_agent TEXT,
    timestamp INTEGER NOT NULL
  );
`);

// Safe column migrations
const safeAlter = (table: string, column: string, typeDef: string) => {
  try {
    const cols = sqlite.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
    const exists = cols.some(c => c.name === column);
    if (!exists) {
      sqlite.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${typeDef}`);
    }
  } catch (e) {}
};

safeAlter('users', 'role', 'TEXT DEFAULT "user"');
safeAlter('users', 'avatar', 'TEXT');
safeAlter('users', 'bio', 'TEXT');
safeAlter('users', 'wallet_address', 'TEXT');
safeAlter('users', 'two_factor_enabled', 'INTEGER DEFAULT 0');
safeAlter('users', 'plan_id', 'TEXT');
safeAlter('users', 'reset_token', 'TEXT');
safeAlter('users', 'reset_token_expires', 'INTEGER');

safeAlter('posts', 'platform', 'TEXT DEFAULT "twitter"');
safeAlter('posts', 'media_urls', 'TEXT');
safeAlter('posts', 'first_comment', 'TEXT');
safeAlter('posts', 'tags', 'TEXT');
safeAlter('posts', 'campaign', 'TEXT');
safeAlter('posts', 'approved_by', 'TEXT');

// Seed default plans and sample Stackposts records if empty
try {
  const planCount = sqlite.prepare('SELECT COUNT(*) as count FROM plans').get() as { count: number };
  if (!planCount || planCount.count === 0) {
    const now = Date.now();
    sqlite.exec(`
      INSERT INTO plans (id, name, price, interval, features, is_popular) VALUES
      ('plan_starter', 'Starter Cyber', 19.00, 'month', '["5 Social Accounts", "50 Scheduled Posts/mo", "Basic AI Copywriter", "1 vCard Digital Pass", "Standard Analytics"]', 0),
      ('plan_pro', 'Professional Agency', 49.00, 'month', '["25 Social Accounts", "Unlimited Scheduling", "GPT-4 & Gemini AI Engine", "10 vCards + QR Engine", "WhatsApp Catalog Store", "Team Approval Workflows"]', 1),
      ('plan_enterprise', 'Enterprise Matrix', 149.00, 'month', '["Unlimited Multi-Chain Accounts", "Autonomous AI Agents", "Custom Domain WhatsApp Store", "Dedicated HSM Key Custody", "24/7 Quantum SLA Support", "White-Label Portals"]', 0);

      INSERT INTO social_accounts (id, platform, account_name, account_id, avatar_url, status, created_at) VALUES
      ('acc_x_01', 'twitter', '@AetherEnterprise', '17841400', 'https://api.dicebear.com/7.x/bottts/svg?seed=x', 'active', ${now}),
      ('acc_ig_01', 'instagram', 'aether_cybernet', '17841401', 'https://api.dicebear.com/7.x/bottts/svg?seed=ig', 'active', ${now}),
      ('acc_li_01', 'linkedin', 'Aether Cyber Intelligence', '17841402', 'https://api.dicebear.com/7.x/bottts/svg?seed=li', 'active', ${now}),
      ('acc_tt_01', 'tiktok', '@aether.quantum', '17841403', 'https://api.dicebear.com/7.x/bottts/svg?seed=tt', 'active', ${now});

      INSERT INTO posts (id, platform, content, tags, campaign, status, scheduled_at, created_at) VALUES
      ('pst_01', 'twitter', '🚀 Launching the next-generation autonomous AI multi-chain custody terminal. Real-time Sharpe modeling and BIP-39 key entropy generation.', '["#AI", "#Crypto", "#Stackposts"]', 'Q4 Product Reveal', 'scheduled', ${now + 86400000}, ${now}),
      ('pst_02', 'instagram', 'Zero-trust architecture meets institutional portfolio analytics. Discover how AETHER safeguards enterprise liquidity pools.', '["#DeFi", "#Cybersecurity", "#Web3"]', 'Security Awareness', 'pending_approval', ${now + 172800000}, ${now}),
      ('pst_03', 'linkedin', 'We are thrilled to announce Stackposts Enterprise integration with WhatsApp Commerce and interactive vCard digital identities.', '["#Enterprise", "#Marketing", "#Tech"]', 'Ecosystem Expansion', 'published', ${now - 3600000}, ${now});

      INSERT INTO vcards (id, template_id, full_name, job_title, company, bio, email, phone, website, address, social_links, theme_colors, slug, views_count, created_at) VALUES
      ('vc_01', 'cyber-blue', 'Alex Vance', 'Chief Quantum Architect', 'AETHER Dynamics Inc.', 'Pioneering decentralized AI networks, neural prompt pipelines, and multi-chain liquidity routing.', 'alex.vance@aether.corp', '+1 (555) 019-2834', 'https://aether.corp', 'San Francisco, CA', '{"twitter":"https://x.com/aether","linkedin":"https://linkedin.com","github":"https://github.com"}', '{"primary":"#00f0ff","secondary":"#ff8c00","background":"#030712"}', 'alex-vance', 342, ${now});

      INSERT INTO whatsapp_stores (id, store_name, description, whatsapp_number, currency, template_id, store_url, created_at) VALUES
      ('wa_store_01', 'AETHER Cyber Gear & AI Licenses', 'Official enterprise merchandise, HSM cold key fobs, and AI compute vouchers.', '+15550192834', 'USD', 'neon-cyber', 'aether-cyber-gear', ${now});

      INSERT INTO whatsapp_products (id, store_id, name, price, category, description, image_url, in_stock, created_at) VALUES
      ('prod_01', 'wa_store_01', 'Hardware Enclave HSM Key Fob', 129.00, 'Hardware', 'Air-gapped BIP-39 biometric hardware key with OLED display.', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80', 1, ${now}),
      ('prod_02', 'wa_store_01', 'AI Quantum Compute Credits (1M Tokens)', 49.00, 'Subscriptions', 'Instant API key voucher for high-throughput Gemini & GPT-4 models.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80', 1, ${now}),
      ('prod_03', 'wa_store_01', 'Enterprise vCard NFC Smart Card', 35.00, 'Identity', 'Matte black steel NFC smart business card with laser-etched QR code.', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80', 1, ${now});

      INSERT INTO invoices (id, invoice_number, amount, currency, status, paid_at, created_at) VALUES
      ('inv_01', 'INV-2026-0091', 49.00, 'USD', 'paid', ${now - 86400000}, ${now - 86400000}),
      ('inv_02', 'INV-2026-0092', 149.00, 'USD', 'paid', ${now - 172800000}, ${now - 172800000});
    `);
  }
} catch (e) {
  console.error('Stackposts seeding error', e);
}
