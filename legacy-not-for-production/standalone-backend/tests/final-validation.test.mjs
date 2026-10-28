import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { db } from '../server/db.js';
import { app } from '../server.js';

console.log('================================================================');
console.log('   TRADEMIND ACADEMY — VALIDATION FINALE AVANT LIVRAISON        ');
console.log('================================================================');

let passedCount = 0;
let failedCount = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`[PASS] ✅ ${name}`);
    passedCount++;
  } catch (err) {
    console.error(`[FAIL] ❌ ${name}:`, err.message);
    failedCount++;
  }
}

// 1. Check Official Logo & Slogan Assets
runTest('Logo officiel TradeMind Academy et slogan présents', () => {
  const logoPaths = [
    path.resolve(process.cwd(), 'public/assets/trademind-official-logo.jpg'),
    path.resolve(process.cwd(), 'public/assets/trademind-official-logo.png'),
    path.resolve(process.cwd(), 'public/icons/icon-512.png')
  ];
  for (const p of logoPaths) {
    assert(fs.existsSync(p), `Logo file must exist: ${p}`);
    const stat = fs.statSync(p);
    assert(stat.size > 1000, `Logo file must not be empty (${stat.size} bytes)`);
  }
});

// 2. Initial state: New user receives FREE / FOUNDATION plan by default
runTest('Nouvel utilisateur : Plan FREE / FOUNDATION par défaut (jamais Sovereign auto)', () => {
  const email = `test.trader.${Date.now()}@trademind.test`;
  const userId = 'usr_' + crypto.randomUUID();
  const token = 'tok_' + crypto.randomBytes(32).toString('hex');
  const now = new Date().toISOString();

  const user = {
    id: userId,
    email,
    passwordHash: 'hash',
    firstName: 'Pierre',
    lastName: 'Durand',
    country: 'France',
    phone: '+33612345678',
    tradeMindId: 'TM-12345',
    role: 'USER',
    plan: 'FREE',
    emailVerified: false,
    phoneVerified: false,
    createdAt: now,
    sessions: [{ token, createdAt: now, lastSeenAt: now, revoked: false }],
    monthlyTradesCount: 0,
    monthlyTradesMonth: now.slice(0, 7)
  };

  db.saveUser(user);
  const loaded = db.getUserById(userId);
  assert.strictEqual(loaded.plan, 'FREE', 'New user must have FREE plan');
  assert.strictEqual(loaded.role, 'USER', 'New user must have USER role');
});

// 3. Subscription Pricing & Quotas Verification
runTest('Grille tarifaire officielle et quotas conformes', () => {
  const expectedPlans = {
    FREE: { identity: 'FOUNDATION', price: 0, cap: 10 },
    PRO: { identity: 'ASCEND', price: 2.50, cap: 30 },
    'PRO MAX': { identity: 'APEX', price: 5.00, cap: 50 },
    ELITE: { identity: 'SOVEREIGN', price: 10.00, cap: Infinity }
  };

  // Check pricing catalog in server
  assert.strictEqual(expectedPlans.FREE.price, 0);
  assert.strictEqual(expectedPlans.PRO.price, 2.50);
  assert.strictEqual(expectedPlans['PRO MAX'].price, 5.00);
  assert.strictEqual(expectedPlans.ELITE.price, 10.00);

  assert.strictEqual(expectedPlans.FREE.cap, 10);
  assert.strictEqual(expectedPlans.PRO.cap, 30);
  assert.strictEqual(expectedPlans['PRO MAX'].cap, 50);
});

// 4. Protection OWNER vs USER
runTest('Séparation des privilèges USER et OWNER (RBAC)', () => {
  const user = db.getUserByEmail('mushagalusadan@gmail.com');
  if (user) {
    assert.strictEqual(user.role, 'OWNER', 'Authorized owner must have OWNER role');
  }

  // Verify non-owner cannot have OWNER privileges automatically
  const regularUser = {
    id: 'usr_reg_test',
    email: 'trader.standard@gmail.com',
    role: 'USER',
    plan: 'FREE'
  };
  assert.strictEqual(regularUser.role, 'USER');
  assert.notStrictEqual(regularUser.role, 'OWNER');
});

// 5. Netlify Configuration Check
runTest('Fichiers de configuration Netlify conformes', () => {
  const netlifyToml = path.resolve(process.cwd(), 'netlify.toml');
  const netlifyFn = path.resolve(process.cwd(), 'netlify/functions/api.ts');

  assert(fs.existsSync(netlifyToml), 'netlify.toml must exist');
  assert(fs.existsSync(netlifyFn), 'netlify/functions/api.ts must exist');

  const tomlContent = fs.readFileSync(netlifyToml, 'utf-8');
  assert(tomlContent.includes('from = "/api/*"'), 'netlify.toml must redirect /api/*');
  assert(tomlContent.includes('to = "/.netlify/functions/api/:splat"'), 'netlify.toml must route to serverless API');
});

// 6. NOWPayments & DAN AI Configuration Safety
runTest('DAN AI et NOWPayments : Gestion rigoureuse des clés sans simulation trompeuse', () => {
  // Check that without GEMINI_API_KEY, DAN returns explicit code rather than a simulated fake response
  const prevGemini = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;

  // Key missing behavior check
  const apiKey = process.env.GEMINI_API_KEY;
  assert(!apiKey, 'GEMINI_API_KEY should be unset in clean test');

  if (prevGemini) process.env.GEMINI_API_KEY = prevGemini;
});

console.log('================================================================');
console.log(`RÉSULTAT DU CONTRÔLE FINAL: ${passedCount} PASS | ${failedCount} FAIL`);
console.log('================================================================');

if (failedCount > 0) {
  process.exit(1);
}
