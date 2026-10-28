import express, { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import crypto from 'node:crypto';
import dotenv from 'dotenv';
import { db, User } from './server/db.js';
import { ServerSyncEngine } from './server/sync.js';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
export { app };

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Netlify Functions URL normalization: rewrite /.netlify/functions/api/* to /api/*
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.url.startsWith('/.netlify/functions/api')) {
    req.url = req.url.replace('/.netlify/functions/api', '/api');
  }
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Simple cookie parser helper
app.use((req: any, _res: Response, next: NextFunction) => {
  const cookieHeader = req.headers.cookie || '';
  req.cookies = {};
  cookieHeader.split(';').forEach((cookie: string) => {
    const parts = cookie.split('=');
    if (parts.length >= 2) {
      req.cookies[parts[0].trim()] = decodeURIComponent(parts.slice(1).join('=').trim());
    }
  });
  next();
});

// Helper: Extract current user from Authorization header, custom header, or cookie
function getAuthenticatedUser(req: Request): { user: User; session: User['sessions'][0] } | null {
  const authHeader = req.headers.authorization || '';
  let token = '';
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else if (req.headers['x-session-token']) {
    token = String(req.headers['x-session-token']).trim();
  } else if ((req as any).cookies && (req as any).cookies.tm_session) {
    token = (req as any).cookies.tm_session;
  }

  if (!token) return null;
  const sessionData = db.getUserBySessionToken(token);
  if (!sessionData || sessionData.session.revoked) return null;
  return sessionData;
}

// Password hashing: scrypt with a unique random salt.
// Legacy SHA-256 hashes are accepted only for migration on successful login.
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${derived}`;
}

function verifyPassword(password: string, storedHash: string): { valid: boolean; upgradedHash?: string } {
  if (storedHash.startsWith('scrypt$')) {
    const [, salt, expectedHex] = storedHash.split('$');
    if (!salt || !expectedHex) return { valid: false };
    try {
      const actual = crypto.scryptSync(password, salt, 64);
      const expected = Buffer.from(expectedHex, 'hex');
      return { valid: expected.length === actual.length && crypto.timingSafeEqual(actual, expected) };
    } catch {
      return { valid: false };
    }
  }

  // Backward compatibility for accounts created by the previous release.
  const legacy = crypto.createHash('sha256').update(password + '_trademind_salt_2026').digest('hex');
  const valid = storedHash.length === legacy.length && crypto.timingSafeEqual(Buffer.from(storedHash), Buffer.from(legacy));
  return valid ? { valid: true, upgradedHash: hashPassword(password) } : { valid: false };
}

// Generate unique TradeMind ID (e.g. TM-74892)
function generateTradeMindId(): string {
  return 'TM-' + Math.floor(10000 + Math.random() * 90000);
}

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

app.get('/api/auth/me', (req: Request, res: Response) => {
  const sessionData = getAuthenticatedUser(req);
  if (!sessionData) {
    return res.status(401).json({ authenticated: false });
  }

  const { user, session } = sessionData;
  session.lastSeenAt = new Date().toISOString();
  db.saveUser(user);

  const activeSessionsCount = user.sessions.filter(s => !s.revoked).length;

  res.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      country: user.country,
      city: user.city || '',
      phone: user.phone || '',
      address: user.address || '',
      birthDate: user.birthDate || '',
      tradeMindId: user.tradeMindId,
      role: user.role,
      plan: user.plan,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      activeSessions: activeSessionsCount,
      monthlyTradesCount: user.monthlyTradesCount || 0
    }
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { firstName, lastName, country, phone, email, password, confirmPassword } = req.body;

  if (!email || !password || password.length < 8) {
    return res.status(400).json({ error: 'Email and password (min 8 chars) are required.' });
  }

  if (confirmPassword && password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  // Public registration must never grant OWNER privileges. Provision the owner separately
  // through a trusted server-side administrative process; never infer ownership from email text.
  const userId = 'usr_' + crypto.randomUUID();
  const token = 'tok_' + crypto.randomBytes(32).toString('hex');
  const now = new Date().toISOString();

  const newUser: User = {
    id: userId,
    email: email.trim().toLowerCase(),
    passwordHash: hashPassword(password),
    firstName: (firstName || '').trim() || 'Trader',
    lastName: (lastName || '').trim(),
    country: (country || '').trim() || 'France',
    phone: (phone || '').trim(),
    tradeMindId: generateTradeMindId(),
    role: 'USER',
    plan: 'FREE',
    emailVerified: false,
    phoneVerified: false,
    createdAt: now,
    sessions: [{
      token,
      createdAt: now,
      lastSeenAt: now,
      userAgent: req.headers['user-agent'] || '',
      revoked: false
    }],
    monthlyTradesCount: 0,
    monthlyTradesMonth: now.slice(0, 7)
  };

  db.saveUser(newUser);

  res.cookie('tm_session', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 30 * 24 * 3600 * 1000
  });

  res.json({
    success: true,
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      country: newUser.country,
      tradeMindId: newUser.tradeMindId,
      role: newUser.role,
      plan: newUser.plan
    }
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required.' });
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }
  const passwordCheck = verifyPassword(password, user.passwordHash);
  if (!passwordCheck.valid) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }
  if (passwordCheck.upgradedHash) user.passwordHash = passwordCheck.upgradedHash;

  const token = 'tok_' + crypto.randomBytes(32).toString('hex');
  const now = new Date().toISOString();

  user.sessions.push({
    token,
    createdAt: now,
    lastSeenAt: now,
    userAgent: req.headers['user-agent'] || '',
    revoked: false
  });
  db.saveUser(user);

  res.cookie('tm_session', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 30 * 24 * 3600 * 1000
  });

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      country: user.country,
      tradeMindId: user.tradeMindId,
      role: user.role,
      plan: user.plan
    }
  });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const sessionData = getAuthenticatedUser(req);
  if (sessionData) {
    sessionData.session.revoked = true;
    db.saveUser(sessionData.user);
  }
  res.clearCookie('tm_session');
  res.json({ success: true });
});

app.post('/api/auth/forgot', (_req: Request, res: Response) => {
  // Do not claim a reset email was sent until a real email provider and token workflow exist.
  res.status(503).json({
    success: false,
    code: 'PASSWORD_RESET_NOT_CONFIGURED',
    error: 'Password recovery is not configured yet. Please contact support.'
  });
});

app.post('/api/auth/reset', (_req: Request, res: Response) => {
  // No secure, expiring, single-use reset-token workflow is implemented in this build.
  res.status(503).json({
    success: false,
    code: 'PASSWORD_RESET_NOT_CONFIGURED',
    error: 'Password reset is not configured yet. No password was changed.'
  });
});

// ==========================================
// ACCOUNT SETTINGS & SECURITY
// ==========================================

app.patch('/api/account/profile', (req: Request, res: Response) => {
  const sessionData = getAuthenticatedUser(req);
  if (!sessionData) return res.status(401).json({ error: 'Unauthorized' });

  const { user } = sessionData;
  const { firstName, lastName, country, city, phone, address, birthDate } = req.body;

  if (firstName !== undefined) user.firstName = String(firstName).trim();
  if (lastName !== undefined) user.lastName = String(lastName).trim();
  if (country !== undefined) user.country = String(country).trim();
  if (city !== undefined) user.city = String(city).trim();
  if (phone !== undefined) user.phone = String(phone).trim();
  if (address !== undefined) user.address = String(address).trim();
  if (birthDate !== undefined) user.birthDate = String(birthDate).trim();

  db.saveUser(user);

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      country: user.country,
      city: user.city,
      phone: user.phone,
      address: user.address,
      birthDate: user.birthDate,
      tradeMindId: user.tradeMindId,
      role: user.role,
      plan: user.plan
    }
  });
});

app.post('/api/account/password', (req: Request, res: Response) => {
  const sessionData = getAuthenticatedUser(req);
  if (!sessionData) return res.status(401).json({ error: 'Unauthorized' });

  const { user } = sessionData;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  const currentPasswordCheck = verifyPassword(currentPassword, user.passwordHash);
  if (!currentPasswordCheck.valid) {
    return res.status(400).json({ error: 'Current password is incorrect.' });
  }

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must have at least 8 characters.' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'New passwords do not match.' });
  }

  user.passwordHash = hashPassword(newPassword);
  db.saveUser(user);

  res.json({ success: true, message: 'Password updated successfully.' });
});

app.get('/api/account/security', (req: Request, res: Response) => {
  const sessionData = getAuthenticatedUser(req);
  if (!sessionData) return res.status(401).json({ error: 'Unauthorized' });

  const { user } = sessionData;
  const activeSessions = user.sessions.filter(s => !s.revoked).length;

  res.json({
    activeSessions,
    role: user.role,
    emailVerified: user.emailVerified,
    phoneVerified: user.phoneVerified
  });
});

app.post('/api/account/delete', (req: Request, res: Response) => {
  const sessionData = getAuthenticatedUser(req);
  if (!sessionData) return res.status(401).json({ error: 'Unauthorized' });

  const { user } = sessionData;
  const { password } = req.body;

  if (user.role === 'OWNER') {
    return res.status(403).json({ error: 'OWNER accounts cannot be deleted directly.' });
  }

  if (!verifyPassword(password, user.passwordHash).valid) {
    return res.status(400).json({ error: 'Password confirmation failed.' });
  }

  db.deleteUser(user.id);
  res.clearCookie('tm_session');
  res.json({ success: true });
});

// ==========================================
// TRADE LIMIT & RECORD QUOTA (Server-authoritative)
// ==========================================

const PLAN_QUOTAS: Record<string, number> = {
  FREE: 10,
  PRO: 30,
  'PRO MAX': 50,
  ELITE: Infinity
};

app.post('/api/trades/record', (req: Request, res: Response) => {
  const sessionData = getAuthenticatedUser(req);
  if (!sessionData) return res.status(401).json({ error: 'Unauthorized' });

  const { user } = sessionData;
  const currentMonth = new Date().toISOString().slice(0, 7);

  if (user.monthlyTradesMonth !== currentMonth) {
    user.monthlyTradesMonth = currentMonth;
    user.monthlyTradesCount = 0;
  }

  const quota = user.role === 'OWNER' ? Infinity : (PLAN_QUOTAS[user.plan] || 10);
  if (user.monthlyTradesCount >= quota) {
    return res.status(403).json({
      code: 'TRADE_LIMIT_REACHED',
      error: `Monthly quota reached (${user.monthlyTradesCount}/${quota} trades).`
    });
  }

  user.monthlyTradesCount += 1;
  db.saveUser(user);

  res.json({
    success: true,
    monthlyTradesCount: user.monthlyTradesCount,
    quota: Number.isFinite(quota) ? quota : null
  });
});

// ==========================================
// BILLING & CATALOG (Exact Site Pricing)
// ==========================================

const BILLING_CATALOG = {
  plans: [
    {
      code: 'FREE',
      identity: 'FOUNDATION',
      name: 'Foundation',
      price: 0,
      cap: 10,
      features: ['10 trades / mois', 'Générateur de plans sur mesure', 'Calculateur de risque', 'Guardian Risk Monitor']
    },
    {
      code: 'PRO',
      identity: 'ASCEND',
      name: 'Ascend',
      price: 2.50,
      cap: 30,
      features: ['30 trades / mois', 'DAN Coach Intelligence', 'Analyses de confluences', 'Synchronisation multi-appareils']
    },
    {
      code: 'PRO MAX',
      identity: 'APEX',
      name: 'Apex',
      price: 5.00,
      cap: 50,
      features: ['50 trades / mois', 'DAN Diagnostic Avancé', 'Analyses de confluences & Matrice', 'Support prioritaire']
    },
    {
      code: 'ELITE',
      identity: 'SOVEREIGN',
      name: 'Sovereign',
      price: 10.00,
      cap: Infinity,
      features: ['Trades illimités', 'DAN Sovereign Intelligence', 'Espace de trading privé intégral', 'Architecture VIP']
    }
  ],
  methods: [
    {
      id: 'nowpayments',
      name: 'NOWPayments (Paiement automatique crypto)',
      mode: 'AUTOMATIC',
      network: 'USDT / BTC / ETH',
      description: 'Paiement automatique crypto avec activation dès confirmation réseau.'
    },
    {
      id: 'airtel_money',
      name: 'Airtel Money',
      mode: 'MANUAL',
      receiver: '+243 970 000 000',
      instructions: 'Envoyez le montant exact via Airtel Money avec votre TradeMind ID en référence.'
    },
    {
      id: 'usdt_bep20',
      name: 'USDT (BNB Smart Chain BEP-20)',
      mode: 'MANUAL',
      address: '0x71C849f8003A1b8994740088857dF981',
      network: 'BEP-20 (Binance Smart Chain)'
    },
    {
      id: 'usdt_erc20',
      name: 'USDT (Ethereum ERC-20)',
      mode: 'MANUAL',
      address: '0x43F849f8003B2c9994740088857dE123',
      network: 'ERC-20 (Ethereum)'
    },
    {
      id: 'btc',
      name: 'Bitcoin (BTC Native SegWit)',
      mode: 'MANUAL',
      address: 'bc1qtm94281trademindacademy2026',
      network: 'Bitcoin Native SegWit'
    }
  ]
};

app.get('/api/billing/catalog', (_req: Request, res: Response) => {
  res.json(BILLING_CATALOG);
});

app.get('/api/billing/orders', (req: Request, res: Response) => {
  const sessionData = getAuthenticatedUser(req);
  if (!sessionData) return res.status(401).json({ error: 'Unauthorized' });

  const allOrders = Object.values(db.getOrders());
  const userOrders = allOrders.filter(o => o.userId === sessionData.user.id);
  res.json({ orders: userOrders });
});

app.post('/api/billing/orders', async (req: Request, res: Response) => {
  const sessionData = getAuthenticatedUser(req);
  if (!sessionData) return res.status(401).json({ error: 'Unauthorized' });

  const { plan, method } = req.body;
  const planInfo = BILLING_CATALOG.plans.find(p => p.code === plan);
  if (!planInfo) return res.status(400).json({ error: 'Invalid plan.' });

  if (planInfo.code === 'FREE') {
    // Free plan is always available without payment
    sessionData.user.plan = 'FREE';
    db.saveUser(sessionData.user);
    return res.json({ success: true, message: 'Plan FREE / Foundation activé.' });
  }

  const methodInfo = BILLING_CATALOG.methods.find(m => m.id === method);
  if (!methodInfo) return res.status(400).json({ error: 'Invalid payment method.' });

  const orderId = 'ord_' + crypto.randomBytes(8).toString('hex');
  let invoiceUrl: string | undefined = undefined;

  // Handle Automatic NOWPayments checkout
  if (method === 'nowpayments') {
    const apiKey = process.env.NOWPAYMENTS_API_KEY || process.env.NOW_PAYMENTS_API_KEY || process.env.NOWPAYMENTS_KEY;
    if (!apiKey || apiKey === 'MY_NOWPAYMENTS_API_KEY') {
      return res.status(400).json({
        code: 'PAYMENT_PROVIDER_NOT_CONFIGURED',
        error: "Le paiement automatique NOWPayments n'est pas encore activé sur ce serveur (clé NOWPAYMENTS_API_KEY non configurée). Utilisez l'un des règlements manuels vérifiés (Airtel Money, USDT ou Bitcoin)."
      });
    }

    try {
      const appUrl = process.env.APP_URL || process.env.URL || process.env.DEPLOY_URL || process.env.DEPLOY_PRIME_URL || 'https://ais-dev-6eqzuncwufeywuyxbkn2lc-94740088857.europe-west1.run.app';
      const nowRes = await fetch('https://api.nowpayments.io/v1/invoice', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          price_amount: planInfo.price,
          price_currency: 'usd',
          pay_currency: 'usdttrc20',
          ipn_callback_url: `${appUrl}/api/billing/webhook/nowpayments`,
          order_id: orderId,
          order_description: `TradeMind Academy - Plan ${planInfo.identity}`
        })
      });
      const nowData = (await nowRes.json()) as any;
      if (nowData.invoice_url) {
        invoiceUrl = nowData.invoice_url;
      }
    } catch (e: any) {
      console.error('[NOWPayments API Error]', e);
    }
  }

  const newOrder: any = {
    id: orderId,
    userId: sessionData.user.id,
    plan: planInfo.code,
    method,
    amount: planInfo.price,
    currency: 'USD',
    status: 'pending',
    instructions: methodInfo,
    invoiceUrl,
    createdAt: new Date().toISOString()
  };

  db.saveOrder(newOrder);
  res.json({ success: true, order: newOrder });
});

app.get('/api/billing/orders/:id', (req: Request, res: Response) => {
  const sessionData = getAuthenticatedUser(req);
  if (!sessionData) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.params;
  const orders = db.getOrders();
  const order = orders[id];
  if (!order || order.userId !== sessionData.user.id) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  res.json({ order });
});

app.post('/api/billing/orders/:id/report', (req: Request, res: Response) => {
  const sessionData = getAuthenticatedUser(req);
  if (!sessionData) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.params;
  const { txRef } = req.body;

  if (!txRef || String(txRef).trim().length < 6) {
    return res.status(400).json({ error: 'Saisissez la référence ou le hash de la transaction (au moins 6 caractères).' });
  }

  const orders = db.getOrders();
  const order = orders[id];
  if (!order || order.userId !== sessionData.user.id) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  order.txRef = String(txRef || '').trim();
  order.status = 'reported';
  db.saveOrder(order);

  res.json({ success: true, order });
});

app.post('/api/billing/orders/:id/cancel', (req: Request, res: Response) => {
  const sessionData = getAuthenticatedUser(req);
  if (!sessionData) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.params;
  const orders = db.getOrders();
  const order = orders[id];
  if (!order || order.userId !== sessionData.user.id) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  order.status = 'cancelled';
  db.saveOrder(order);

  res.json({ success: true, order });
});

// Admin / Owner Order Activation (Server Verified)
app.post('/api/billing/orders/:id/activate', (req: Request, res: Response) => {
  const sessionData = getAuthenticatedUser(req);
  if (!sessionData) return res.status(401).json({ error: 'Unauthorized' });

  // Only OWNER can manually confirm/activate orders
  if (sessionData.user.role !== 'OWNER') {
    return res.status(403).json({ error: 'Forbidden. Owner privilege required to activate orders.' });
  }

  const { id } = req.params;
  const orders = db.getOrders();
  const order = orders[id];
  if (!order) return res.status(404).json({ error: 'Order not found.' });

  order.status = 'ACTIVATED' as any;
  order.confirmedAt = new Date().toISOString();
  db.saveOrder(order);

  // Upgrade target user plan
  const targetUser = db.getUserById(order.userId);
  if (targetUser) {
    targetUser.plan = order.plan as any;
    db.saveUser(targetUser);
  }

  res.json({ success: true, order });
});

// Webhook for NOWPayments IPN
app.post('/api/billing/webhook/nowpayments', (req: Request, res: Response) => {
  const secret = process.env.NOWPAYMENTS_IPN_SECRET || process.env.NOWPAYMENTS_SECRET || process.env.NOW_PAYMENTS_IPN_SECRET;
  const signature = req.headers['x-nowpayments-sig'];

  if (secret && signature) {
    const hmac = crypto.createHmac('sha512', secret);
    hmac.update(JSON.stringify(req.body, Object.keys(req.body).sort()));
    const digest = hmac.digest('hex');
    if (digest !== signature) {
      return res.status(400).send('Invalid signature');
    }
  }

  const { payment_status, order_id } = req.body;
  if (order_id && (payment_status === 'confirmed' || payment_status === 'finished')) {
    const orders = db.getOrders();
    const order = orders[order_id];
    if (order) {
      order.status = 'ACTIVATED' as any;
      order.confirmedAt = new Date().toISOString();
      db.saveOrder(order);

      const targetUser = db.getUserById(order.userId);
      if (targetUser) {
        targetUser.plan = order.plan as any;
        db.saveUser(targetUser);
      }
    }
  }

  res.status(200).send('OK');
});

// ==========================================
// SYNCHRONIZATION API (Controls 1-28 + Control 20)
// ==========================================

app.get('/api/sync/pull', (req: Request, res: Response) => {
  const authCheck = ServerSyncEngine.authenticateRequest(req);
  if (!authCheck.ok) {
    return res.status(authCheck.status).json({ error: authCheck.error, code: authCheck.code });
  }

  const since = Number(req.query.since) || 0;
  const result = ServerSyncEngine.handlePull(authCheck.user.id, since);
  res.json(result);
});

app.post('/api/sync/push', (req: Request, res: Response) => {
  const authCheck = ServerSyncEngine.authenticateRequest(req);
  if (!authCheck.ok) {
    return res.status(authCheck.status).json({ error: authCheck.error, code: authCheck.code });
  }

  const result = ServerSyncEngine.handlePush(authCheck.user.id, req.body);
  res.json(result);
});

// ==========================================
// DAN AI CHAT API (Private Intelligence)
// ==========================================

app.post('/api/dan/chat', async (req: Request, res: Response) => {
  const sessionData = getAuthenticatedUser(req);
  if (!sessionData) return res.status(401).json({ error: 'Unauthorized' });

  const { user } = sessionData;
  const isAllowedPlan = user.role === 'OWNER' || user.plan === 'PRO' || user.plan === 'PRO MAX' || user.plan === 'ELITE';
  if (!isAllowedPlan) {
    return res.status(403).json({
      code: 'DAN_LOCKED',
      error: 'DAN Intelligence is available with ASCEND, APEX or SOVEREIGN.'
    });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return res.status(503).json({
      code: 'DAN_NOT_CONFIGURED',
      error: "DAN n'est pas encore activé sur ce serveur. L'administrateur doit configurer GEMINI_API_KEY."
    });
  }

  const { message, lang = 'fr', context } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required.' });

  try {
    const ai = new GoogleGenAI({ apiKey });
    const systemPrompt = `You are DAN, the private trading intelligence navigator for TradeMind Academy ("Master your trading. Master yourself.").
You analyze the user's trading journal, risk parameters, Guardian compliance, psychology, and plan adherence.
You are NOT a financial advisor, you NEVER give copy trading signals or price forecasts.
You focus entirely on the trader's process, discipline, risk management, execution adherence, and emotional patterns.
Respond in ${lang === 'fr' ? 'French' : 'English'}, with crisp, professional fintech tone.
Context: ${JSON.stringify(context || {})}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }] }
      ]
    });

    const reply = response.text || (lang === 'fr' ? 'Analyse indisponible.' : 'Analysis unavailable.');
    res.json({ reply });
  } catch (err: any) {
    console.error('[DAN API Error]', err);
    res.status(500).json({ code: 'DAN_PROVIDER_ERROR', error: 'DAN encountered an error processing your query.' });
  }
});

// ==========================================
// VITE DEV SERVER / STATIC ASSETS
// ==========================================

async function startServer() {
  // Serve static assets from public
  app.use(express.static(path.resolve(process.cwd(), 'public')));

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TradeMind] Server running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.NETLIFY && (!process.argv[1] || process.argv[1].endsWith('server.ts') || process.argv[1].endsWith('server.js'))) {
  startServer();
}
