/**
 * TRADEMIND ACADEMY — SERVER BILLING SUBSYSTEM
 * Handles catalog, manual settlement orders (Airtel Money, USDT BEP-20/ERC-20, BTC Native SegWit)
 * and server-authoritative plan activation upon payment confirmation.
 */

import crypto from 'node:crypto';
import { db } from './db.js';

export const BILLING_CATALOG = {
  plans: [
    {
      code: 'FREE',
      identity: 'FOUNDATION',
      name: 'Foundation',
      price: 0,
      cap: 10,
      features: ['10 trades/mois', 'Générateur de plans sur mesure', 'Calculateur de risque', 'Guardian Risk Monitor']
    },
    {
      code: 'PRO',
      identity: 'ASCEND',
      name: 'Ascend',
      price: 2.50,
      cap: 30,
      features: ['30 trades/mois', 'DAN Coach Intelligence', 'Analyses multidimensionnelles', 'Synchronisation multi-appareils']
    },
    {
      code: 'PRO MAX',
      identity: 'APEX',
      name: 'Apex',
      price: 5.00,
      cap: 50,
      features: ['50 trades/mois', 'DAN Diagnostic Avancé', 'Analyses de confluences', 'Support prioritaire']
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
      id: 'airtel_money',
      name: 'Airtel Money',
      number: '+243970000000',
      instructions: 'Transférez le montant exact via Airtel Money avec votre TradeMind ID en référence.'
    },
    {
      id: 'usdt_bep20',
      name: 'USDT (BNB Smart Chain BEP-20)',
      address: '0x71C849f8003A1b8994740088857dF981',
      network: 'BEP-20 (Binance Smart Chain)'
    },
    {
      id: 'usdt_erc20',
      name: 'USDT (Ethereum ERC-20)',
      address: '0x43F849f8003B2c9994740088857dE123',
      network: 'ERC-20 (Ethereum)'
    },
    {
      id: 'btc',
      name: 'Bitcoin (BTC Native SegWit)',
      address: 'bc1qtm94281trademindacademy2026',
      network: 'Bitcoin Native SegWit'
    }
  ]
};

export function getCatalog() {
  return BILLING_CATALOG;
}

export function createOrder(userId, planCode, methodId) {
  const plan = BILLING_CATALOG.plans.find(p => p.code === planCode);
  if (!plan) throw new Error('INVALID_PLAN');

  const method = BILLING_CATALOG.methods.find(m => m.id === methodId);
  if (!method) throw new Error('INVALID_METHOD');

  const orderId = 'ord_' + crypto.randomBytes(8).toString('hex');
  const order = {
    id: orderId,
    userId,
    plan: plan.code,
    method: methodId,
    amount: plan.price,
    currency: 'USD',
    status: 'pending',
    instructions: method,
    createdAt: new Date().toISOString()
  };

  db.saveOrder(order);
  return order;
}

export function reportOrderPayment(userId, orderId, txRef) {
  const orders = db.getOrders();
  const order = orders[orderId];
  if (!order || order.userId !== userId) throw new Error('ORDER_NOT_FOUND');

  order.txRef = String(txRef || '').trim();
  order.status = 'reported';
  order.reportedAt = new Date().toISOString();
  db.saveOrder(order);
  return order;
}

export function cancelOrder(userId, orderId) {
  const orders = db.getOrders();
  const order = orders[orderId];
  if (!order || order.userId !== userId) throw new Error('ORDER_NOT_FOUND');

  order.status = 'cancelled';
  order.cancelledAt = new Date().toISOString();
  db.saveOrder(order);
  return order;
}

export function confirmOrderAdmin(orderId) {
  const orders = db.getOrders();
  const order = orders[orderId];
  if (!order) throw new Error('ORDER_NOT_FOUND');

  order.status = 'confirmed';
  order.confirmedAt = new Date().toISOString();
  db.saveOrder(order);

  // Upgrade user plan server-side
  const user = db.getUserById(order.userId);
  if (user) {
    user.plan = order.plan;
    db.saveUser(user);
  }
  return order;
}
