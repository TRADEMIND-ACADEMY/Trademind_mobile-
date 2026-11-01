import React from 'react';
import { LayoutDashboard, BookOpen, TrendingUp, MoreHorizontal, Plus } from 'lucide-react';
import { useTrading } from '../context/TradingContext.js';

export type ActiveTab = 'dashboard' | 'journal' | 'plans' | 'matrix' | 'calendar' | 'performance' | 'profile';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  onOpenPlus: () => void;
  onOpenNewTrade: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab, onOpenPlus, onOpenNewTrade }) => {
  const { settings } = useTrading();
  const isFr = settings.lang === 'fr';

  const left = [
    { id: 'dashboard' as const, label: isFr ? 'Accueil' : 'Home', icon: LayoutDashboard },
    { id: 'journal' as const, label: 'Journal', icon: BookOpen },
  ];
  const right = [
    { id: 'performance' as const, label: isFr ? 'Analyse' : 'Analytics', icon: TrendingUp },
  ];

  const isPlusActive = activeTab === 'plans' || activeTab === 'matrix' || activeTab === 'calendar' || activeTab === 'profile';

  const tabBtn = (id: ActiveTab, label: string, Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>) => {
    const active = activeTab === id;
    return (
      <button
        key={id}
        type="button"
        onClick={() => onChangeTab(id)}
        aria-current={active ? 'page' : undefined}
        className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] h-[52px] rounded-2xl text-[10px] font-medium transition-all active:scale-95 ${
          active ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        }`}
      >
        <Icon className="w-[22px] h-[22px]" strokeWidth={active ? 2.3 : 1.8} />
        <span>{label}</span>
      </button>
    );
  };

  return (
    <nav
      aria-label={isFr ? 'Navigation principale' : 'Main navigation'}
      className="md:hidden fixed z-40 left-3 right-3 h-[70px] rounded-[26px] border border-[var(--border)] backdrop-blur-xl flex items-center justify-around px-1.5"
      style={{
        background: 'var(--dock-bg)',
        boxShadow: 'var(--dock-shadow)',
        bottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))'
      }}
    >
      {left.map(i => tabBtn(i.id, i.label, i.icon))}

      <button
        type="button"
        onClick={onOpenNewTrade}
        aria-label={isFr ? 'Ajouter un trade' : 'Add a trade'}
        className="tm-fab w-[60px] h-[60px] -mt-7 rounded-full border-2 border-white/20 flex items-center justify-center text-[var(--on-accent)] active:scale-95 transition-transform"
      >
        <Plus className="w-7 h-7" strokeWidth={2.8} />
      </button>

      {right.map(i => tabBtn(i.id, i.label, i.icon))}

      <button
        type="button"
        onClick={onOpenPlus}
        aria-haspopup="dialog"
        className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] h-[52px] rounded-2xl text-[10px] font-medium transition-all active:scale-95 ${
          isPlusActive ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        }`}
      >
        <MoreHorizontal className="w-[22px] h-[22px]" strokeWidth={isPlusActive ? 2.3 : 1.8} />
        <span>Plus</span>
      </button>
    </nav>
  );
};
