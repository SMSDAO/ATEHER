import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: text('role').default('user'),
  avatar: text('avatar'),
  bio: text('bio'),
  walletAddress: text('wallet_address'),
  twoFactorEnabled: integer('two_factor_enabled', { mode: 'boolean' }).default(false),
  planId: text('plan_id'),
  resetToken: text('reset_token'),
  resetTokenExpires: integer('reset_token_expires', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const teams = sqliteTable('teams', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  ownerId: text('owner_id').references(() => users.id),
  status: text('status').default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const socialAccounts = sqliteTable('social_accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  platform: text('platform').notNull(), // twitter, instagram, facebook, linkedin, tiktok, youtube
  accountName: text('account_name').notNull(),
  accountId: text('account_id').notNull(),
  avatarUrl: text('avatar_url'),
  status: text('status').default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id'),
  accountId: text('account_id').references(() => socialAccounts.id),
  platform: text('platform').notNull().default('twitter'),
  content: text('content').notNull(),
  mediaUrls: text('media_urls'), // JSON string array
  firstComment: text('first_comment'),
  tags: text('tags'), // JSON string array
  campaign: text('campaign'),
  status: text('status').notNull().default('draft'), // draft, scheduled, pending_approval, published, failed
  createdBy: text('created_by').references(() => users.id),
  approvedBy: text('approved_by'),
  scheduledAt: integer('scheduled_at', { mode: 'timestamp' }),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const vcards = sqliteTable('vcards', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  templateId: text('template_id').notNull().default('cyber-dark'),
  fullName: text('full_name').notNull(),
  jobTitle: text('job_title'),
  company: text('company'),
  bio: text('bio'),
  email: text('email'),
  phone: text('phone'),
  website: text('website'),
  address: text('address'),
  socialLinks: text('social_links'), // JSON
  themeColors: text('theme_colors'), // JSON
  slug: text('slug').notNull().unique(),
  qrCode: text('qr_code'),
  isPublished: integer('is_published', { mode: 'boolean' }).default(true),
  viewsCount: integer('views_count').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const whatsappStores = sqliteTable('whatsapp_stores', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  storeName: text('store_name').notNull(),
  description: text('description'),
  whatsappNumber: text('whatsapp_number').notNull(),
  currency: text('currency').default('USD'),
  templateId: text('template_id').default('neon-cyber'),
  storeUrl: text('store_url').unique(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const whatsappProducts = sqliteTable('whatsapp_products', {
  id: text('id').primaryKey(),
  storeId: text('store_id').references(() => whatsappStores.id),
  name: text('name').notNull(),
  price: real('price').notNull(),
  category: text('category').default('General'),
  description: text('description'),
  imageUrl: text('image_url'),
  inStock: integer('in_stock', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const plans = sqliteTable('plans', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  price: real('price').notNull(),
  interval: text('interval').default('month'),
  features: text('features'), // JSON string array
  isPopular: integer('is_popular', { mode: 'boolean' }).default(false),
});

export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  planId: text('plan_id').references(() => plans.id),
  status: text('status').default('active'),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp' }),
  paymentGateway: text('payment_gateway').default('Stripe'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const invoices = sqliteTable('invoices', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  invoiceNumber: text('invoice_number').notNull().unique(),
  amount: real('amount').notNull(),
  currency: text('currency').default('USD'),
  status: text('status').default('paid'),
  paidAt: integer('paid_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  status: text('status').notNull(),
  priority: text('priority').default('Medium'),
  category: text('category').default('Cyber AI'),
  userId: text('user_id').references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const contentItems = sqliteTable('content_items', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  type: text('type').notNull(),
  content: text('content').notNull(),
  status: text('status').notNull().default('Published'),
  author: text('author').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const systemSettings = sqliteTable('system_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  description: text('description'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  action: text('action').notNull(),
  userEmail: text('user_email').notNull(),
  level: text('level').notNull().default('INFO'),
  ipAddress: text('ip_address'),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
});

export const errorLogs = sqliteTable('error_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  userEmail: text('user_email'),
  message: text('message').notNull(),
  stack: text('stack'),
  context: text('context'), // JSON string for extra info
  url: text('url'),
  userAgent: text('user_agent'),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
});
