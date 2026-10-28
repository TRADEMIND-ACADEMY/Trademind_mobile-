import fs from 'node:fs';
import path from 'node:path';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  country: string;
  city?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  tradeMindId: string;
  role: 'USER' | 'OWNER';
  plan: 'FREE' | 'PRO' | 'PRO MAX' | 'ELITE';
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  sessions: { token: string; createdAt: string; lastSeenAt: string; userAgent?: string; revoked?: boolean }[];
  monthlyTradesCount: number;
  monthlyTradesMonth: string; // YYYY-MM
}

export interface TradeRecord {
  id: string;
  userId: string;
  date: string;
  time?: string;
  symbol: string;
  direction: 'buy' | 'sell';
  entryPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  size?: number;
  risk?: number;
  pnl?: number;
  result?: 'win' | 'loss' | 'be';
  rMultiple?: number;
  session?: string;
  setup?: string;
  planId?: string;
  planName?: string;
  planSnapshot?: any;
  score?: number | null;
  psychology?: string[];
  notes?: string;
  guardianStatus?: 'aligned' | 'warning' | 'breach';
  violations?: string[];
  mode?: 'REAL' | 'DEMO';
  demo?: boolean;
  deleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  userId: string;
  startingBalance: number;
  currency: string;
  theme: 'night' | 'day' | 'auto';
  lang: 'fr' | 'en';
  activePlanId?: string;
  guardian?: {
    maxRiskPerTrade: number;
    maxDailyLoss: number;
    maxTradesPerDay: number;
    minRR: number;
    maxConsecutiveLosses: number;
  };
  updatedAt: string;
}

export interface BillingOrder {
  id: string;
  userId: string;
  plan: 'PRO' | 'PRO MAX' | 'ELITE';
  method: 'airtel_money' | 'usdt_bep20' | 'usdt_erc20' | 'btc';
  amount: number;
  currency: string;
  status: 'pending' | 'reported' | 'confirmed' | 'cancelled';
  txRef?: string;
  instructions: any;
  createdAt: string;
  confirmedAt?: string;
}

interface DatabaseSchema {
  users: Record<string, User>;
  trades: Record<string, TradeRecord[]>; // keyed by userId
  settings: Record<string, UserSettings>; // keyed by userId
  orders: Record<string, BillingOrder>;
  syncTombstones: Record<string, { id: string; userId: string; deletedAt: string }[]>;
}

function resolveDataDir(): string {
  if (process.env.NETLIFY || process.env.LAMBDA_TASK_ROOT || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return '/tmp/trademind_data';
  }
  const defaultDir = path.resolve(process.cwd(), 'data');
  try {
    if (!fs.existsSync(defaultDir)) {
      fs.mkdirSync(defaultDir, { recursive: true });
    }
    fs.accessSync(defaultDir, fs.constants.W_OK);
    return defaultDir;
  } catch {
    return '/tmp/trademind_data';
  }
}

const DATA_DIR = resolveDataDir();
const DB_FILE = path.join(DATA_DIR, 'trademind_db.json');
const SEED_FILE = path.resolve(process.cwd(), 'data', 'trademind_db.json');

class Database {
  private data: DatabaseSchema = {
    users: {},
    trades: {},
    settings: {},
    orders: {},
    syncTombstones: {}
  };

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else if (fs.existsSync(SEED_FILE)) {
        const raw = fs.readFileSync(SEED_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        this.persist();
      } else {
        this.persist();
      }
    } catch (e) {
      console.error('[DB] Failed to load data file, starting with fresh in-memory data', e);
    }
  }

  public persist() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('[DB] Persist error', e);
    }
  }

  public getUsers(): Record<string, User> {
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users[id];
  }

  public getUserByEmail(email: string): User | undefined {
    const clean = email.trim().toLowerCase();
    return Object.values(this.data.users).find(u => u.email.toLowerCase() === clean);
  }

  public getUserBySessionToken(token: string): { user: User; session: User['sessions'][0] } | null {
    if (!token) return null;
    for (const user of Object.values(this.data.users)) {
      const session = user.sessions.find(s => s.token === token && !s.revoked);
      if (session) {
        return { user, session };
      }
    }
    return null;
  }

  public saveUser(user: User): User {
    this.data.users[user.id] = user;
    this.persist();
    return user;
  }

  public deleteUser(userId: string): boolean {
    if (this.data.users[userId]) {
      delete this.data.users[userId];
      delete this.data.trades[userId];
      delete this.data.settings[userId];
      delete this.data.syncTombstones[userId];
      this.persist();
      return true;
    }
    return false;
  }

  public getUserTrades(userId: string): TradeRecord[] {
    return this.data.trades[userId] || [];
  }

  public setUserTrades(userId: string, trades: TradeRecord[]) {
    this.data.trades[userId] = trades;
    this.persist();
  }

  public getUserSettings(userId: string): UserSettings {
    if (!this.data.settings[userId]) {
      this.data.settings[userId] = {
        userId,
        startingBalance: 10000,
        currency: '$',
        theme: 'night',
        lang: 'fr',
        guardian: {
          maxRiskPerTrade: 1,
          maxDailyLoss: 3,
          maxTradesPerDay: 5,
          minRR: 1.5,
          maxConsecutiveLosses: 3
        },
        updatedAt: new Date().toISOString()
      };
      this.persist();
    }
    return this.data.settings[userId];
  }

  public saveUserSettings(userId: string, settings: Partial<UserSettings>): UserSettings {
    const current = this.getUserSettings(userId);
    const updated = {
      ...current,
      ...settings,
      userId,
      updatedAt: new Date().toISOString()
    };
    this.data.settings[userId] = updated;
    this.persist();
    return updated;
  }

  public getOrders(): Record<string, BillingOrder> {
    return this.data.orders;
  }

  public saveOrder(order: BillingOrder): BillingOrder {
    this.data.orders[order.id] = order;
    this.persist();
    return order;
  }

  public getTombstones(userId: string) {
    return this.data.syncTombstones[userId] || [];
  }

  public addTombstone(userId: string, tradeId: string) {
    if (!this.data.syncTombstones[userId]) {
      this.data.syncTombstones[userId] = [];
    }
    this.data.syncTombstones[userId].push({
      id: tradeId,
      userId,
      deletedAt: new Date().toISOString()
    });
    this.persist();
  }

  public clearAll() {
    this.data = {
      users: {},
      trades: {},
      settings: {},
      orders: {},
      syncTombstones: {}
    };
    this.persist();
  }
}

export const db = new Database();
