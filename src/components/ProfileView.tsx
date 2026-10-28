import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useTrading } from '../context/TradingContext.js';
import { PasswordInput } from './PasswordInput.js';
import { SubscriptionModal } from './SubscriptionModal.js';
import { User, Shield, KeyRound, CreditCard, LogOut, Trash2, CheckCircle2, AlertTriangle, Copy, Check, ExternalLink, ArrowRight } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, logout, updateProfile, changePassword, deleteAccount } = useAuth();
  const { settings, updateSettings, isDemoMode } = useTrading();
  const isFr = settings.lang === 'fr';

  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [selectedSubPlan, setSelectedSubPlan] = useState<'FREE' | 'PRO' | 'PRO MAX' | 'ELITE'>('PRO');

  // Profile Form state
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [country, setCountry] = useState(user?.country || 'France');
  const [city, setCity] = useState(user?.city || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [profileMsg, setProfileMsg] = useState<{ text: string; error?: boolean } | null>(null);

  // Password Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; error?: boolean } | null>(null);

  // Delete account state
  const [deletePass, setDeletePass] = useState('');
  const [deleteMsg, setDeleteMsg] = useState<string | null>(null);

  // Copied address feedback
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateProfile({ firstName, lastName, country, city, phone, address });
    if (res.success) {
      setProfileMsg({ text: isFr ? 'Profil mis à jour avec succès.' : 'Profile updated successfully.' });
    } else {
      setProfileMsg({ text: res.error || 'Erreur', error: true });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordMsg({ text: isFr ? 'Le nouveau mot de passe doit comporter au moins 8 caractères.' : 'New password must have at least 8 characters.', error: true });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: isFr ? 'Les mots de passe ne correspondent pas.' : 'Passwords do not match.', error: true });
      return;
    }

    const res = await changePassword(currentPassword, newPassword, confirmPassword);
    if (res.success) {
      setPasswordMsg({ text: isFr ? 'Mot de passe modifié avec succès.' : 'Password updated successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordMsg({ text: res.error || 'Erreur', error: true });
    }
  };

  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm(isFr ? 'Confirmer la suppression irréversible de votre compte ?' : 'Confirm permanent account deletion?')) return;
    const res = await deleteAccount(deletePass);
    if (!res.success) {
      setDeleteMsg(res.error || 'Erreur lors de la suppression');
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(id);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const planQuota = {
    FREE: '10 trades / mois',
    PRO: '30 trades / mois',
    'PRO MAX': '50 trades / mois',
    ELITE: 'Illimité'
  }[user?.plan || 'FREE'];

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Top Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-primary)]">
          {isFr ? 'Compte, Sécurité & Abonnements' : 'Account, Security & Subscriptions'}
        </h2>
        <p className="text-xs text-[var(--text-secondary)]">
          {isFr ? 'Gérez vos données personnelles, vos accès et vos préférences de compte.' : 'Manage your personal details, credentials, and account settings.'}
        </p>
      </div>

      {/* Account Overview Card */}
      <div className="p-5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-[var(--accent)] flex items-center justify-center font-bold text-lg font-mono">
              {user ? (user.firstName ? user.firstName[0].toUpperCase() : 'T') : 'D'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                  {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Trader TradeMind' : (isFr ? 'Utilisateur Démo' : 'Demo Trader')}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30">
                  {user?.role === 'OWNER' ? 'SOVEREIGN · OWNER' : user?.plan || 'FOUNDATION'}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">
                {user ? user.email : 'demo@trademind.local'} · TradeMind ID: <span className="text-[var(--text-primary)] font-bold">{user?.tradeMindId || 'TM-DEMO'}</span>
              </p>
            </div>
          </div>

          {user && (
            <button
              onClick={logout}
              type="button"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isFr ? 'Déconnexion' : 'Log out'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Details Form */}
        <div className="p-5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-md space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="font-display font-bold text-sm sm:text-base text-[var(--text-primary)]">
              {isFr ? 'Informations Personnelles' : 'Personal Information'}
            </h3>
          </div>

          {profileMsg && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${profileMsg.error ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300' : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'}`}>
              {profileMsg.error ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold uppercase text-[var(--text-secondary)]">{isFr ? 'Prénom' : 'First Name'}</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase text-[var(--text-secondary)]">{isFr ? 'Nom' : 'Last Name'}</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold uppercase text-[var(--text-secondary)]">{isFr ? 'Pays' : 'Country'}</label>
                <input
                  type="text"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase text-[var(--text-secondary)]">{isFr ? 'Ville' : 'City'}</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase text-[var(--text-secondary)]">{isFr ? 'Téléphone' : 'Phone'}</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+33..."
                className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase text-[var(--text-secondary)]">{isFr ? 'Adresse' : 'Address'}</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[var(--accent)] text-[#04110f] text-xs font-bold hover:opacity-95 transition-opacity"
            >
              {isFr ? 'Enregistrer les Modifications' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Password & Security Form with Accessible PasswordInput */}
        <div className="p-5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-md space-y-4">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="font-display font-bold text-sm sm:text-base text-[var(--text-primary)]">
              {isFr ? 'Sécurité & Mot de Passe' : 'Security & Password'}
            </h3>
          </div>

          {passwordMsg && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${passwordMsg.error ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300' : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'}`}>
              {passwordMsg.error ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <PasswordInput
              label={isFr ? 'Mot de passe actuel' : 'Current Password'}
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
              lang={settings.lang}
            />

            <PasswordInput
              label={isFr ? 'Nouveau mot de passe (min 8 car.)' : 'New Password (min 8 chars)'}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              lang={settings.lang}
            />

            <PasswordInput
              label={isFr ? 'Confirmer le nouveau mot de passe' : 'Confirm New Password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              lang={settings.lang}
            />

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl border border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold hover:bg-[var(--accent)]/20 transition-all"
            >
              {isFr ? 'Mettre à Jour le Mot de Passe' : 'Update Password'}
            </button>
          </form>

          {/* Delete Account (Protected for Owner) */}
          {user?.role !== 'OWNER' && (
            <div className="pt-4 border-t border-[var(--border)] space-y-2">
              <h4 className="text-xs font-bold text-rose-400">{isFr ? 'Suppression du Compte' : 'Delete Account'}</h4>
              <p className="text-[11px] text-[var(--text-secondary)]">
                {isFr
                  ? 'Suppression définitive : vos sessions et quotas serveur sont purgés.'
                  : 'Permanent: server sessions and quota records are purged.'}
              </p>
              {deleteMsg && <p className="text-xs text-rose-400">{deleteMsg}</p>}
              <form onSubmit={handleDeleteSubmit} className="flex gap-2">
                <input
                  type="password"
                  placeholder={isFr ? 'Votre mot de passe' : 'Your password'}
                  value={deletePass}
                  onChange={e => setDeletePass(e.target.value)}
                  required
                  className="flex-1 bg-[var(--surface)] border border-rose-500/30 rounded-xl px-3 py-1.5 text-xs text-[var(--text-primary)]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-400 text-xs font-semibold hover:bg-rose-500/20"
                >
                  {isFr ? 'Supprimer' : 'Delete'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Membership & Payment Readiness */}
      <div className="p-5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="font-display font-bold text-sm sm:text-base text-[var(--text-primary)]">
              {isFr ? 'Abonnements & Tarification Officielle' : 'Memberships & Official Pricing'}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => { setSelectedSubPlan('PRO'); setIsSubModalOpen(true); }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--accent)] text-[#04110f] text-xs font-bold shadow-md hover:opacity-95"
          >
            <span>{isFr ? 'Gérer / Changer d abonnement' : 'Manage / Upgrade Plan'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-xs text-[var(--text-secondary)]">
          {isFr
            ? 'Tarifs réels du projet TradeMind Academy. Cliquez sur une carte pour voir les détails, les quotas autorisés et souscrire via NOWPayments ou règlement manuel.'
            : 'Verified official TradeMind Academy rates. Click any card to review details, quotas, and subscribe via NOWPayments or manual confirmation.'}
        </p>

        {/* 4 Interactive Clickable Plan Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {[
            { name: 'FOUNDATION', price: isFr ? '0 $ (Gratuit)' : '0 $ (Free)', cap: isFr ? '10 trades / mois' : '10 trades / mo', code: 'FREE' as const, desc: isFr ? 'Plan de départ' : 'Starter plan' },
            { name: 'ASCEND', price: '2,50 $ / mois', cap: isFr ? '30 trades / mois' : '30 trades / mo', code: 'PRO' as const, desc: isFr ? 'DAN Coach IA' : 'DAN AI Coach' },
            { name: 'APEX', price: '5,00 $ / mois', cap: isFr ? '50 trades / mois' : '50 trades / mo', code: 'PRO MAX' as const, desc: isFr ? 'Analyses & Matrice' : 'Deep Analytics' },
            { name: 'SOVEREIGN', price: '10,00 $ / mois', cap: isFr ? 'Trades illimités' : 'Unlimited trades', code: 'ELITE' as const, desc: isFr ? 'Espace VIP Intégral' : 'VIP Workspace' }
          ].map(p => {
            const isUserCurrent = user ? (user.role === 'OWNER' ? p.code === 'ELITE' : user.plan === p.code) : p.code === 'FREE';

            return (
              <button
                key={p.code}
                type="button"
                onClick={() => {
                  setSelectedSubPlan(p.code);
                  setIsSubModalOpen(true);
                }}
                className={`p-4 rounded-xl border text-left transition-all relative group cursor-pointer ${
                  isUserCurrent
                    ? 'bg-[var(--accent)]/10 border-[var(--accent)] shadow-md ring-1 ring-[var(--accent)]/50'
                    : 'bg-[var(--surface)] border-[var(--border)] hover:border-white/20 hover:bg-[var(--surface-elevated)]'
                } space-y-2`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-sm text-[var(--text-primary)]">{p.name}</span>
                  {isUserCurrent && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--accent)] text-[#04110f] font-bold">
                      {isFr ? 'ACTIF' : 'ACTIVE'}
                    </span>
                  )}
                </div>
                <div className="text-lg font-mono font-bold text-[var(--text-primary)]">{p.price}</div>
                <div className="text-xs font-mono text-[var(--text-secondary)]">{p.cap}</div>
                <div className="text-[11px] text-[var(--accent)]/90 pt-1 border-t border-[var(--border)] flex items-center justify-between">
                  <span>{p.desc}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Manual Payment Details */}
        <div className="mt-4 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
            {isFr ? 'Coordonnées de Règlement Manuel' : 'Manual Settlement Coordinates'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] text-[var(--text-secondary)] block">AIRTEL MONEY</span>
              <strong className="text-[var(--text-primary)] block">+243 970 000 000</strong>
              <small className="text-[10px] text-[var(--text-secondary)] block">{isFr ? 'Mentionnez votre TradeMind ID' : 'Mention your TradeMind ID'}</small>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] text-[var(--text-secondary)] block">USDT (BEP-20 BNB SMART CHAIN)</span>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[var(--text-primary)] truncate max-w-[150px]">0x71C849f8003...2026</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('0x71C849f8003A1b8994740088857dF981', 'usdt')}
                  className="p-1 rounded text-[var(--accent)] hover:bg-white/10"
                >
                  {copiedAddress === 'usdt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] text-[var(--text-secondary)] block">BITCOIN (BTC NATIVE SEGWIT)</span>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[var(--text-primary)] truncate max-w-[150px]">bc1qtm94281...build2026</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('bc1qtm94281trademindacademy2026', 'btc')}
                  className="p-1 rounded text-[var(--accent)] hover:bg-white/10"
                >
                  {copiedAddress === 'btc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Modal Mounted */}
      <SubscriptionModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        preselectedPlan={selectedSubPlan}
      />
    </div>
  );
};
