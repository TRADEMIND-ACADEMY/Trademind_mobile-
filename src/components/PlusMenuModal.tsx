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
  Bot
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
  const { settings, isDemoMode } = useTrading();
  const { user } = useAuth();
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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm">
      <div
        className="w-full max-w-lg bg-[var(--surface-elevated)] border-t sm:border border-[var(--border)] rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto"
        style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 16px))' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center font-bold">
              +
            </div>
            <div>
              <h3 className="font-display font-bold text-sm sm:text-base text-[var(--text-primary)]">
                {isFr ? 'Navigation Approfondie' : 'Expanded Navigation'}
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                {isFr ? 'Toutes les fonctionnalités de TradeMind Academy' : 'All TradeMind Academy modules'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Tools Bar */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => { onOpenDan(); onClose(); }}
            className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-300 flex items-center gap-2.5 text-xs font-semibold hover:bg-purple-500/20 transition-all text-left"
          >
            <Bot className="w-4 h-4 text-purple-400" />
            <div>
              <div className="font-bold">DAN AI</div>
              <div className="text-[10px] text-purple-300/80">{isFr ? 'Discipline' : 'Navigator'}</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => { onOpenCalculator(); onClose(); }}
            className="p-3 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] flex items-center gap-2.5 text-xs font-semibold hover:bg-[var(--accent)]/20 transition-all text-left"
          >
            <Calculator className="w-4 h-4" />
            <div>
              <div className="font-bold">{isFr ? 'Calculateur' : 'Calculator'}</div>
              <div className="text-[10px] text-[var(--accent)]/80">{isFr ? 'Risque & Lots' : 'Risk & Lots'}</div>
            </div>
          </button>
        </div>

        {/* Destination List */}
        <div className="space-y-1.5">
          {items.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.action}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all ${
                  item.highlight
                    ? 'bg-[var(--accent)]/10 border-[var(--accent)]/40 hover:bg-[var(--accent)]/15 text-[var(--text-primary)]'
                    : 'bg-[var(--surface)] border-[var(--border)] hover:border-white/20 hover:bg-[var(--surface-elevated)] text-[var(--text-primary)]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    item.highlight ? 'bg-[var(--accent)] text-[#04110f]' : 'bg-white/5 text-[var(--accent)]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs sm:text-sm truncate">{item.label}</div>
                    <div className="text-[11px] text-[var(--text-secondary)] truncate">{item.desc}</div>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-[var(--text-secondary)] flex-shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
