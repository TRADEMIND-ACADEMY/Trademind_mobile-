import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useTrading } from '../context/TradingContext.js';
import { api } from '../lib/api.js';
import { X, Check, CreditCard, Shield, Zap, Sparkles, Copy, ExternalLink, AlertCircle, RefreshCw, Clock, ArrowRight } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPlan?: 'FREE' | 'PRO' | 'PRO MAX' | 'ELITE';
}

interface PlanDetail {
  code: 'FREE' | 'PRO' | 'PRO MAX' | 'ELITE';
  identity: string;
  name: string;
  price: number;
  priceDisplay: string;
  cap: number;
  capDisplay: string;
  danLevel: string;
  badge?: string;
  features: string[];
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  preselectedPlan = 'PRO'
}) => {
  const { user, refreshUser } = useAuth();
  const { settings } = useTrading();
  const isFr = settings.lang === 'fr';

  const [selectedPlanCode, setSelectedPlanCode] = useState<'FREE' | 'PRO' | 'PRO MAX' | 'ELITE'>(preselectedPlan);
  // Moyens de paiement : TOUJOURS ceux du serveur (/api/billing/catalog). Aucune adresse ni numéro n'est codé en dur dans l'application.
  interface ServerMethod { id: string; name: string; mode: 'AUTOMATIC' | 'MANUAL'; network?: string; asset?: string; address?: string; receiver?: string; warning?: string }
  interface ServerPlan { code: string; identity: string; priceUsdMonthly: number; tradeLimit: number | null; features?: string[] }
  const [methods, setMethods] = useState<ServerMethod[]>([]);
  const [serverPlans, setServerPlans] = useState<ServerPlan[]>([]);
  const [catalogError, setCatalogError] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Active / created order state
  const [currentOrder, setCurrentOrder] = useState<any | null>(null);
  const [txRefInput, setTxRefInput] = useState('');
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  // Update selected plan if preselectedPlan changes
  useEffect(() => {
    if (preselectedPlan) setSelectedPlanCode(preselectedPlan);
  }, [preselectedPlan]);

  const fetchCatalog = async () => {
    try {
      const res = await api('GET', '/api/billing/catalog');
      if (res.ok && res.json) {
        setMethods(res.json.methods || []);
        setServerPlans(res.json.plans || []);
        setCatalogError(false);
        setSelectedMethod(prev => prev || (res.json.methods && res.json.methods[0] ? res.json.methods[0].id : ''));
      } else setCatalogError(true);
    } catch { setCatalogError(true); }
  };

  // Fetch recent orders
  const fetchOrders = async () => {
    if (!user) return;
    try {
      const res = await api('GET', '/api/billing/orders');
      if (res.ok) setRecentOrders(res.json?.orders || []);
    } catch {}
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
      fetchCatalog();
    }
  }, [isOpen, user]);

  // Real, verified catalog with exact site prices
  const basePlans: PlanDetail[] = [
    {
      code: 'FREE',
      identity: 'FOUNDATION',
      name: 'Foundation',
      price: 0,
      priceDisplay: '0 $',
      cap: 10,
      capDisplay: isFr ? '10 trades / mois' : '10 trades / mo',
      danLevel: isFr ? 'Statistiques de base' : 'Basic analytics',
      features: isFr ? [
        '10 trades enregistrés par mois',
        'Création libre de plans de trading',
        'Calculateur de risque intégré',
        'Guardian Risk Monitor'
      ] : [
        '10 recorded trades per month',
        'Custom trading plan builder',
        'Built-in risk calculator',
        'Guardian Risk Monitor'
      ]
    },
    {
      code: 'PRO',
      identity: 'ASCEND',
      name: 'Ascend',
      price: 2.50,
      priceDisplay: '2,50 $',
      cap: 30,
      capDisplay: isFr ? '30 trades / mois' : '30 trades / mo',
      danLevel: isFr ? 'DAN Coach IA' : 'DAN AI Coach',
      badge: isFr ? 'POPULAIRE' : 'POPULAR',
      features: isFr ? [
        '30 trades enregistrés par mois',
        'Intelligence DAN Coach interactive',
        'Analyses de confluences & psychologie',
        'Synchronisation multi-appareils chiffrée'
      ] : [
        '30 recorded trades per month',
        'Interactive DAN Coach Intelligence',
        'Confluence & psychological analytics',
        'Encrypted multi-device synchronization'
      ]
    },
    {
      code: 'PRO MAX',
      identity: 'APEX',
      name: 'Apex',
      price: 5.00,
      priceDisplay: '5,00 $',
      cap: 50,
      capDisplay: isFr ? '50 trades / mois' : '50 trades / mo',
      danLevel: isFr ? 'DAN Diagnostic Avancé' : 'DAN Advanced Diagnostic',
      features: isFr ? [
        '50 trades enregistrés par mois',
        'DAN Diagnostic Avancé & matrice',
        'Matrice multi-dimensionnelle complète',
        'Historique étendu & support prioritaire'
      ] : [
        '50 recorded trades per month',
        'DAN Advanced Diagnostics & matrix',
        'Complete multidimensional matrix',
        'Extended history & priority support'
      ]
    },
    {
      code: 'ELITE',
      identity: 'SOVEREIGN',
      name: 'Sovereign',
      price: 10.00,
      priceDisplay: '10,00 $',
      cap: Infinity,
      capDisplay: isFr ? 'Trades illimités' : 'Unlimited trades',
      danLevel: isFr ? 'DAN Sovereign IA Intégrale' : 'DAN Sovereign Full AI',
      badge: 'VIP',
      features: isFr ? [
        'Trades illimités sans restriction',
        'DAN Sovereign Intelligence maximale',
        'Espace privé VIP intégral',
        'Support direct et instantanés illimités'
      ] : [
        'Unlimited trades without restriction',
        'DAN Sovereign Maximum Intelligence',
        'Full VIP private workspace',
        'Direct support and unlimited snapshots'
      ]
    }
  ];

  // Prix, plafonds et fonctionnalités : ceux du serveur quand il répond (source unique avec le site) ; sinon les libellés ci-dessus.
  const plans: PlanDetail[] = basePlans.map(p => {
    const sp = serverPlans.find(x => x.code === p.code);
    if (!sp) return p;
    const price = Number(sp.priceUsdMonthly);
    const cap = sp.tradeLimit === null ? Infinity : sp.tradeLimit;
    const dan = p.code === 'PRO' ? 'DAN Coach' : p.code === 'ELITE' ? 'DAN Sovereign' : (isFr ? 'Sans DAN' : 'No DAN');
    return {
      ...p,
      price,
      priceDisplay: price === 0 ? '0 $' : `${price.toFixed(2).replace('.', isFr ? ',' : '.')} $`,
      cap,
      capDisplay: cap === Infinity ? (isFr ? 'Trades illimités' : 'Unlimited trades') : (isFr ? `${cap} trades / mois` : `${cap} trades / mo`),
      danLevel: dan,
      features: sp.features && sp.features.length ? sp.features : p.features
    };
  });

  const selectedPlan = plans.find(p => p.code === selectedPlanCode) || plans[0];
  const userPlanCode = user?.role === 'OWNER' ? 'ELITE' : (user?.plan || 'FREE');
  const isCurrentActivePlan = userPlanCode === selectedPlanCode;

  const copyText = (txt: string, id: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Foundation est le plan gratuit par défaut : il n'y a rien à acheter ni à activer côté serveur.
  const handleSelectFree = async () => {
    setErrorMsg(null);
    setSuccessMsg(isFr
      ? 'Foundation est votre plan gratuit par défaut. Un abonnement payant revient à Foundation à son expiration.'
      : 'Foundation is your default free plan. A paid plan returns to Foundation when it expires.');
    setTimeout(() => { setSuccessMsg(null); onClose(); }, 2200);
  };

  const handleCreateOrder = async () => {
    if (!user) {
      setErrorMsg(isFr ? 'Veuillez vous connecter pour souscrire un abonnement.' : 'Please sign in to subscribe.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      if (!selectedMethod) { setErrorMsg(isFr ? 'Choisissez un moyen de paiement.' : 'Choose a payment method.'); return; }
      const res = await api('POST', '/api/billing/orders', { plan: selectedPlan.code, method: selectedMethod });
      const data: any = res.json || {};
      if (!res.ok) {
        throw new Error(data.error || (isFr ? 'Erreur lors de la création de la commande' : 'Could not create the order'));
      }

      setCurrentOrder(data.order);
      await fetchOrders();

      if (data.order?.invoiceUrl) {
        window.open(data.order.invoiceUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReportPayment = async (orderId: string) => {
    if (!txRefInput.trim()) {
      setErrorMsg(isFr ? 'Veuillez saisir votre référence ou hash de transaction.' : 'Please enter your transaction reference or hash.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api('POST', `/api/billing/orders/${orderId}/report`, { txRef: txRefInput.trim() });
      const data: any = res.json || {};
      if (!res.ok) throw new Error(data.error || 'Erreur');

      setCurrentOrder(data.order);
      setTxRefInput('');
      setSuccessMsg(isFr ? 'Paiement signalé avec succès ! Vérification en cours.' : 'Payment reported! Verification in progress.');
      await fetchOrders();
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const res = await api('POST', `/api/billing/orders/${orderId}/cancel`, {});
      if (res.ok) {
        setCurrentOrder(null);
        await fetchOrders();
      }
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-4xl bg-[var(--surface-elevated)] border border-[var(--border)] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-[var(--accent)] flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-[var(--text-primary)]">
                {isFr ? 'Abonnements & Accès TradeMind' : 'TradeMind Memberships & Access'}
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                {isFr ? 'Tarification transparente · Quotas appliqués par le serveur' : 'Transparent pricing · Server-enforced quotas'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Notifications */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
              <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 4 Interactive Clickable Plan Cards */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-3">
              {isFr ? '1. Choisissez votre plan' : '1. Choose your plan'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {plans.map(p => {
                const isSelected = selectedPlanCode === p.code;
                const isUserCurrent = userPlanCode === p.code;

                return (
                  <button
                    key={p.code}
                    type="button"
                    onClick={() => {
                      setSelectedPlanCode(p.code);
                      setErrorMsg(null);
                    }}
                    className={`relative text-left p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[var(--surface)] border-[var(--accent)] shadow-lg shadow-[var(--accent)]/10 ring-1 ring-[var(--accent)]'
                        : 'bg-[var(--surface)]/60 border-[var(--border)] hover:border-white/20 hover:bg-[var(--surface)]'
                    }`}
                  >
                    {/* Badge */}
                    {p.badge && (
                      <span className="absolute -top-2.5 right-3 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--accent)] text-[#04110f] shadow-sm">
                        {p.badge}
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-display font-bold text-sm text-[var(--text-primary)]">
                          {p.name}
                        </span>
                        {isUserCurrent && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {isFr ? 'ACTIF' : 'ACTIVE'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-1 my-2">
                        <span className="text-2xl font-mono font-bold text-[var(--text-primary)]">
                          {p.priceDisplay}
                        </span>
                        {p.price > 0 && (
                          <span className="text-[11px] text-[var(--text-secondary)] font-mono">
                            {isFr ? '/ mois' : '/ mo'}
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-mono font-semibold text-[var(--accent)] mb-3">
                        {p.capDisplay}
                      </p>

                      <ul className="space-y-1.5 text-[11px] text-[var(--text-secondary)]">
                        {p.features.map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
                      <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">
                        {isSelected ? (isFr ? 'Sélectionné' : 'Selected') : (isFr ? 'Choisir' : 'Select')}
                      </span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-[var(--accent)] bg-[var(--accent)] text-[#04110f]' : 'border-[var(--border)]'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Plan Action & Checkout Section */}
          <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[var(--accent)] font-semibold">
                  {isFr ? 'RÉCAPITULATIF DU PLAN' : 'PLAN SUMMARY'}
                </span>
                <h4 className="text-base font-bold text-[var(--text-primary)]">
                  {selectedPlan.identity} ({selectedPlan.name}) — {selectedPlan.priceDisplay} {selectedPlan.price > 0 ? (isFr ? '/ mois' : '/ mo') : ''}
                </h4>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs font-mono text-[var(--text-secondary)] block">
                  {isFr ? 'Capacité mensuelle :' : 'Monthly quota:'}
                </span>
                <strong className="text-xs font-mono text-[var(--text-primary)]">
                  {selectedPlan.capDisplay}
                </strong>
              </div>
            </div>

            {/* If FREE Plan Selected */}
            {selectedPlan.code === 'FREE' ? (
              <div className="space-y-3">
                <p className="text-xs text-[var(--text-secondary)]">
                  {isFr
                    ? 'Le plan Foundation est gratuit pour toujours, avec un quota de 10 trades par mois. Il comprend l accès complet au générateur de stratégies, au calculateur de risque et au moniteur Guardian.'
                    : 'The Foundation plan is free forever, with 10 trades per month. It includes the strategy builder, risk calculator, and Guardian monitor.'}
                </p>
                {isCurrentActivePlan ? (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center">
                    {isFr ? 'Vous utilisez actuellement le plan Foundation.' : 'You are currently using the Foundation plan.'}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSelectFree}
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[var(--accent)] text-[#04110f] font-bold text-xs hover:opacity-95"
                  >
                    {isFr ? 'Revenir au Plan Gratuit (Foundation)' : 'Switch to Free Plan (Foundation)'}
                  </button>
                )}
              </div>
            ) : (
              /* If Paid Plan Selected (PRO, PRO MAX, ELITE) */
              <div className="space-y-4">
                <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  {isFr ? '2. Mode de paiement' : '2. Payment method'}
                </h5>

                {catalogError && (
                  <p className="text-xs text-rose-300">
                    {isFr ? 'Impossible de charger les moyens de paiement du serveur. Réessayez.' : 'Could not load payment methods from the server. Try again.'}
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {methods.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMethod(m.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedMethod === m.id
                          ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text-primary)]'
                          : 'border-[var(--border)] bg-black/20 text-[var(--text-secondary)] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-[var(--text-primary)]">{m.name}</span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${m.mode === 'AUTOMATIC' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-[var(--text-secondary)]'}`}>
                          {m.mode === 'AUTOMATIC' ? (isFr ? 'Automatique' : 'Automatic') : (isFr ? 'Manuel' : 'Manual')}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] truncate">{m.network || m.asset || ''}</p>
                    </button>
                  ))}
                </div>

                {/* Active Order Details or Proceed Button */}
                {!currentOrder ? (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleCreateOrder}
                      disabled={loading}
                      className="w-full py-3 rounded-xl bg-[var(--accent)] text-[#04110f] font-bold text-xs sm:text-sm shadow-lg shadow-[var(--accent)]/20 hover:opacity-95 flex items-center justify-center gap-2 transition-opacity"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{isFr ? 'Préparation...' : 'Preparing...'}</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          <span>
                            {isFr ? `Souscrire au plan ${selectedPlan.name} (${selectedPlan.priceDisplay} / mois)` : `Subscribe to ${selectedPlan.name} (${selectedPlan.priceDisplay} / mo)`}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  /* When an order is created */
                  <div className="p-4 rounded-xl bg-black/40 border border-[var(--border)] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-[var(--accent)] font-bold">
                        {isFr ? 'COMMANDE EN COURS :' : 'ORDER IN PROGRESS:'} #{currentOrder.id}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold uppercase">
                        {currentOrder.status}
                      </span>
                    </div>

                    <div className="text-xs text-[var(--text-primary)] space-y-1 font-mono">
                      <div>{isFr ? 'Montant à régler :' : 'Amount to pay:'} <strong>${currentOrder.amount} USD</strong></div>
                      <div>{isFr ? 'Méthode :' : 'Method:'} <strong>{currentOrder.method?.name || ''}</strong></div>
                    </div>

                    {/* NOWPayments Invoice Link */}
                    {currentOrder.invoiceUrl && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                        <p className="text-xs text-emerald-300">
                          {isFr
                            ? 'Page de paiement sécurisée NOWPayments générée. Cliquez ci-dessous si elle ne s est pas ouverte automatiquement :'
                            : 'NOWPayments secure page generated. Click below if it didn’t open automatically:'}
                        </p>
                        <a
                          href={currentOrder.invoiceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 text-black text-xs font-bold"
                        >
                          <span>{isFr ? 'Payer maintenant sur NOWPayments' : 'Pay now on NOWPayments'}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}

                    {/* Instructions de règlement manuel : toujours celles de la commande renvoyée par le serveur */}
                    {currentOrder.method?.receiver && (
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[var(--text-secondary)]">{currentOrder.method.name} :</span>
                          <strong className="text-[var(--text-primary)]">{currentOrder.method.receiver}</strong>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)]">
                          {isFr ? 'Indiquez impérativement votre référence TradeMind :' : 'Include your TradeMind reference:'} <strong>{user?.tradeMindId || 'TM-ID'}</strong>
                        </p>
                      </div>
                    )}

                    {currentOrder.method?.address && (
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono space-y-2">
                        <span className="text-[10px] text-[var(--text-secondary)] uppercase block">
                          {isFr ? 'Adresse de dépôt' : 'Deposit address'} — {currentOrder.method.network}
                        </span>
                        <div className="flex items-center justify-between gap-2 p-2 rounded bg-black/40 border border-white/10">
                          <code className="text-xs text-[var(--accent)] break-all">{currentOrder.method.address}</code>
                          <button
                            type="button"
                            onClick={() => copyText(currentOrder.method.address, 'addr')}
                            className="p-1 text-[var(--text-secondary)] hover:text-white"
                          >
                            {copiedId === 'addr' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    )}

                    <p className="text-[11px] text-amber-300">
                      {isFr
                        ? "Signaler un paiement n'active pas le plan : il est activé uniquement après confirmation par le serveur (notification signée) ou par l'administrateur."
                        : 'Reporting a payment does not activate the plan: it is activated only after server confirmation (signed notification) or administrator verification.'}
                    </p>

                    {/* Report Tx Ref Form */}
                    {!['CONFIRMED', 'ACTIVATED'].includes(currentOrder.status) && (
                      <div className="pt-2 border-t border-[var(--border)] space-y-2">
                        <label className="text-[11px] font-mono text-[var(--text-secondary)] block">
                          {isFr ? 'Référence ou Hash de transaction après votre paiement :' : 'Transaction reference or hash after payment:'}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={txRefInput}
                            onChange={e => setTxRefInput(e.target.value)}
                            placeholder={isFr ? 'Ex: 0x9b3... ou Réf SMS Airtel' : 'Ex: 0x9b3... or SMS ref'}
                            className="flex-1 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)]"
                          />
                          <button
                            type="button"
                            onClick={() => handleReportPayment(currentOrder.id)}
                            disabled={loading || !txRefInput.trim()}
                            className="px-4 py-2 rounded-xl bg-[var(--accent)] text-[#04110f] text-xs font-bold disabled:opacity-40"
                          >
                            {isFr ? 'Signaler le paiement' : 'Report payment'}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => handleCancelOrder(currentOrder.id)}
                        className="text-xs text-rose-400 hover:underline"
                      >
                        {isFr ? 'Annuler la commande' : 'Cancel order'}
                      </button>

                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Orders History */}
          {recentOrders.length > 0 && (
            <div className="pt-2">
              <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                {isFr ? 'Historique des commandes récentes' : 'Recent order history'}
              </h5>
              <div className="space-y-2">
                {recentOrders.slice(0, 4).map(o => (
                  <div
                    key={o.id}
                    className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-[var(--text-primary)]">{o.id}</strong>
                        <span className="text-[var(--accent)]">{o.plan}</span>
                        <span className="text-[var(--text-secondary)]">${o.amount} USD</span>
                      </div>
                      <span className="text-[10px] text-[var(--text-secondary)] block">
                        {new Date(o.createdAt).toLocaleDateString(isFr ? 'fr-FR' : 'en-US')} · {o.method?.name || o.methodName || ''}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        ['CONFIRMED', 'ACTIVATED'].includes(o.status)
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : o.reported === true || o.status === 'PAYMENT_DETECTED'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-white/5 text-[var(--text-secondary)]'
                      }`}>
                        {o.status}
                      </span>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
