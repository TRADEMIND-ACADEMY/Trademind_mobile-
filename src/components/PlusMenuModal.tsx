import React from 'react';
import { useTrading } from '../context/TradingContext.js';
import { useAuth } from '../context/AuthContext.js';
import {
  X,
  Sliders,
  Grid3X3,
  Calendar as CalendarIcon,
  User,
  Shield,
  CreditCard,
  Calculator,
  ChevronRight,
  Sparkles,
  Bot,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';
import { ActiveTab } from './BottomNav.js';

interface PlusMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenCalculator: () => void;
  onOpenDan: () => void;
  onOpenSubscription: () => void;
}

export const PlusMenuModal: React.FC<PlusMenuModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onOpenCalculator,
  onOpenDan,
  onOpenSubscription
}) => {
  const { settings, isDemoMode, updateSettings } = useTrading();
  const { user, logout } = useAuth();
  const isFr = settings.lang === 'fr';

  if (!isOpen) return null;

  const items = [
    {
      id: 'plans' as const,
      label: isFr ? 'Plans de Trading & Stratégies' : 'Trading Plans & Strategies',
      desc: isFr ? 'Score du plan, critères et règles de risque' : 'Plan score, criteria and risk rules',
      icon: Sliders,
      action: () => { onSelectTab('plans'); onClose(); }
    },
    {
      id: 'matrix' as const,
      label: isFr ? "Matrice d'Évolution" : 'Evolution Matrix',
      desc: isFr ? 'Analyse croisée multi-dimensionnelle et confluences' : 'Multidimensional cross-analysis & confluences',
      icon: Grid3X3,
      action: () => { onSelectTab('matrix'); onClose(); }
    },
    {
      id: 'calendar' as const,
      label: isFr ? 'Calendrier de Performance' : 'Performance Calendar',
      desc: isFr ? 'P&L quotidien, discipline par jour et régularité' : 'Daily P&L, day-by-day discipline & consistency',
      icon: CalendarIcon,
      action: () => { onSelectTab('calendar'); onClose(); }
    },
    {
      id: 'profile' as const,
      label: isFr ? 'Profil & Identité Trader' : 'Profile & Trader ID',
      desc: isFr ? 'Informations personnelles, TradeMind ID' : 'Personal information, TradeMind ID',
      icon: User,
      action: () => { onSelectTab('profile'); onClose(); }
    },
    {
      id: 'security' as const,
      label: isFr ? 'Sécurité & Mot de Passe' : 'Security & Password',
      desc: isFr ? 'Changement de mot de passe et sessions' : 'Password updates & session control',
      icon: Shield,
      action: () => { onSelectTab('profile'); onClose(); }
    },
    {
      id: 'subscription' as const,
      label: isFr ? 'Abonnement & Accès VIP' : 'Membership & VIP Access',
      desc: isFr ? 'Plans Foundation, Ascend, Apex et Sovereign' : 'Foundation, Ascend, Apex & Sovereign plans',
      icon: CreditCard,
      highlight: true,
      action: () => { onOpenSubscription(); onClose(); }
    }
  ];

  const tile = 'flex flex-col items-center justify-center gap-2 min-h-[92px] p-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] text-[12px] font-semibold text-center active:scale-95 hover:border-[var(--accent)] transition-all';
  const shortLabel: Record<string, string> = {
    plans: isFr ? 'Plans' : 'Plans',
    matrix: isFr ? 'Matrice' : 'Matrix',
    calendar: isFr ? 'Calendrier' : 'Calendar',
    profile: isFr ? 'Profil' : 'Profile',
    security: isFr ? 'Sécurité' : 'Security',
    subscription: isFr ? 'Abonnement' : 'Plan'
  };
  const isNight = settings.theme !== 'day';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isFr ? 'Menu Plus' : 'More menu'}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg border border-[var(--accent)]/30 border-b-0 sm:border-b rounded-t-[30px] sm:rounded-3xl p-4 sm:p-6 space-y-3.5 max-h-[92vh] overflow-y-auto"
        style={{
          background: 'var(--surface-elevated)',
          boxShadow: '0 -20px 60px rgba(0,0,0,0.5), 0 -2px 40px var(--accent-soft)',
          paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom, 12px))'
        }}
      >
        <div className="mx-auto w-11 h-1.5 rounded-full bg-[var(--text-secondary)]/40" aria-hidden="true" />

        {/* Carte profil */}
        <div className="flex items-center gap-3 p-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--purple)] text-[var(--on-accent)] flex items-center justify-center font-bold text-lg">
            {user?.firstName ? user.firstName[0].toUpperCase() : 'T'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-display font-bold text-sm truncate text-[var(--text-primary)]">{user?.firstName || (isFr ? 'Mode démo' : 'Demo mode')}</div>
            <div className="font-mono text-[11px] text-[var(--text-secondary)] truncate">{user?.tradeMindId || (isDemoMode ? 'DEMO' : '')}</div>
          </div>
          <button type="button" onClick={onClose} aria-label={isFr ? 'Fermer' : 'Close'} className="w-10 h-10 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Outils rapides */}
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => { onOpenDan(); onClose(); }} className="min-h-[56px] p-3 rounded-2xl bg-[var(--purple)]/10 border border-[var(--purple)]/35 text-[var(--purple)] flex items-center gap-2.5 text-xs font-semibold hover:bg-[var(--purple)]/20 transition-colors">
            <Bot className="w-5 h-5" />
            <div className="text-left"><div className="font-bold">DAN AI</div><div className="text-[10px] opacity-80">{isFr ? 'Assistant discipline' : 'Discipline coach'}</div></div>
          </button>
          <button type="button" onClick={() => { onOpenCalculator(); onClose(); }} className="min-h-[56px] p-3 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/35 text-[var(--accent)] flex items-center gap-2.5 text-xs font-semibold hover:bg-[var(--accent)]/20 transition-colors">
            <Calculator className="w-5 h-5" />
            <div className="text-left"><div className="font-bold">{isFr ? 'Calculateur' : 'Calculator'}</div><div className="text-[10px] opacity-80">{isFr ? 'Risque & lots' : 'Risk & lots'}</div></div>
          </button>
        </div>

        {/* Grille de destinations */}
        <div className="grid grid-cols-3 gap-2.5">
          {items.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.action}
                title={item.desc}
                className={item.highlight ? `${tile} !border-[var(--accent)]/60 bg-gradient-to-br from-[var(--accent)]/15 to-[var(--purple)]/15 tm-glow` : tile}
              >
                <Icon className={`w-6 h-6 ${item.highlight ? 'text-[var(--accent)]' : item.id === 'matrix' || item.id === 'profile' ? 'text-[var(--purple)]' : 'text-[var(--accent)]'}`} />
                <span>{shortLabel[item.id]}</span>
              </button>
            );
          })}
        </div>

        {/* Réglages rapides */}
        <div className="grid grid-cols-2 gap-2.5">
          <button type="button" onClick={() => updateSettings({ lang: settings.lang === 'fr' ? 'en' : 'fr' })} className="h-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] text-[13px] font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all">
            {settings.lang === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}
          </button>
          <button type="button" onClick={() => updateSettings({ theme: isNight ? 'day' : 'night' })} className="h-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] text-[13px] font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all">
            {isNight ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isNight ? (isFr ? 'Mode clair' : 'Light mode') : (isFr ? 'Mode sombre' : 'Dark mode')}
          </button>
        </div>

        {user && (
          <button type="button" onClick={async () => { await logout(); onClose(); }} className="w-full h-12 rounded-2xl border border-[var(--danger)]/40 bg-[var(--danger)]/10 text-[var(--danger)] text-[13px] font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all">
            <LogOut className="w-4 h-4" />{isFr ? 'Se déconnecter' : 'Sign out'}
          </button>
        )}
      </div>
    </div>
  );
};
