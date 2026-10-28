/**
 * TRADEMIND ACADEMY — SERVER ACCOUNTS & SECURITY SUBSYSTEM
 * Handles user profiles, password updates, security audits, quota enforcement, and account deletion.
 */

import crypto from 'node:crypto';
import { db } from './db.js';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + '_trademind_salt_2026').digest('hex');
}

export function updateProfile(userId, profileData) {
  const user = db.getUserById(userId);
  if (!user) throw new Error('USER_NOT_FOUND');

  const { firstName, lastName, country, city, phone, address, birthDate } = profileData;
  if (firstName !== undefined) user.firstName = String(firstName).trim();
  if (lastName !== undefined) user.lastName = String(lastName).trim();
  if (country !== undefined) user.country = String(country).trim();
  if (city !== undefined) user.city = String(city).trim();
  if (phone !== undefined) user.phone = String(phone).trim();
  if (address !== undefined) user.address = String(address).trim();
  if (birthDate !== undefined) user.birthDate = String(birthDate).trim();

  db.saveUser(user);
  return {
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
  };
}

export function changePassword(userId, currentPassword, newPassword, confirmPassword) {
  const user = db.getUserById(userId);
  if (!user) throw new Error('USER_NOT_FOUND');

  if (user.passwordHash !== hashPassword(currentPassword)) {
    throw new Error('CURRENT_PASSWORD_INCORRECT');
  }

  if (!newPassword || newPassword.length < 8) {
    throw new Error('PASSWORD_TOO_SHORT');
  }

  if (newPassword !== confirmPassword) {
    throw new Error('PASSWORDS_DO_NOT_MATCH');
  }

  user.passwordHash = hashPassword(newPassword);
  db.saveUser(user);
  return { success: true };
}

export function getSecurityOverview(userId) {
  const user = db.getUserById(userId);
  if (!user) throw new Error('USER_NOT_FOUND');

  const activeSessions = user.sessions.filter(s => !s.revoked).length;
  return {
    activeSessions,
    role: user.role,
    tradeMindId: user.tradeMindId,
    emailVerified: Boolean(user.emailVerified),
    phoneVerified: Boolean(user.phoneVerified)
  };
}

export function deleteAccount(userId, password) {
  const user = db.getUserById(userId);
  if (!user) throw new Error('USER_NOT_FOUND');

  if (user.role === 'OWNER') {
    throw new Error('CANNOT_DELETE_OWNER_ACCOUNT');
  }

  if (user.passwordHash !== hashPassword(password)) {
    throw new Error('PASSWORD_INCORRECT');
  }

  return db.deleteUser(userId);
}

export function enforceTradeQuota(userId) {
  const user = db.getUserById(userId);
  if (!user) throw new Error('USER_NOT_FOUND');

  const currentMonth = new Date().toISOString().slice(0, 7);
  if (user.monthlyTradesMonth !== currentMonth) {
    user.monthlyTradesMonth = currentMonth;
    user.monthlyTradesCount = 0;
  }

  const quotas = { FREE: 10, PRO: 30, 'PRO MAX': 50, ELITE: Infinity };
  const maxQuota = user.role === 'OWNER' ? Infinity : (quotas[user.plan] || 10);

  if (user.monthlyTradesCount >= maxQuota) {
    return {
      allowed: false,
      code: 'TRADE_LIMIT_REACHED',
      current: user.monthlyTradesCount,
      limit: maxQuota
    };
  }

  user.monthlyTradesCount += 1;
  db.saveUser(user);

  return {
    allowed: true,
    current: user.monthlyTradesCount,
    limit: Number.isFinite(maxQuota) ? maxQuota : null
  };
}
