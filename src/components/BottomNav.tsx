import React from 'react';
import { LayoutDashboard, BookOpen, Sliders, TrendingUp, MoreHorizontal } from 'lucide-react';
import { useTrading } from '../context/TradingContext.js';

export type ActiveTab = 'dashboard' | 'journal' | 'plans' | 'matrix' | 'calendar' | 'performance' | 'profile';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  onOpenPlus: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab, onOpenPlus }) => {
  const { settings } = useTrading();
  const isFr = settings.lang === 'fr';

  const items = [
    { id: 'dashboard' as const, label: isFr ? 'Accueil' : 'Home', icon: LayoutDashboard },
    { id: 'journal' as const, label: isFr ? 'Journal' : 'Journal', icon: BookOpen },
    { id: 'plans' as const, label: isFr ? 'Plans' : 'Plans', icon: Sliders },
    { id: 'performance' as const, label: isFr ? 'Performance' : 'Analytics', icon: TrendingUp },
  ];

  const isPlusActive = activeTab === 'matrix' || activeTab === 'calendar' || activeTab === 'profile';

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#05060a]/95 backdrop-blur-xl border-t border-[var(--border)] px-1 sm:px-3 pt-2 md:hidden transition-colors shadow-2xl"
      style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom, 12px))' }}
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl min-w-[62px] min-h-[48px] transition-all relative ${
                isActive
                  ? 'text-[var(--accent)] font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] active:scale-95'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" strokeWidth={isActive ? 2.3 : 1.75} />
              <span className="text-[10px] tracking-tight font-sans font-medium">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-3 h-0.5 rounded-full bg-[var(--accent)] shadow-sm" />
              )}
            </button>
          );
        })}

        {/* 5th Tab: Plus */}
        <button
          type="button"
          onClick={onOpenPlus}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl min-w-[62px] min-h-[48px] transition-all relative ${
            isPlusActive
              ? 'text-[var(--accent)] font-bold'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] active:scale-95'
          }`}
          title={isFr ? 'Plus d options' : 'More options'}
        >
          <MoreHorizontal className="w-5 h-5 mb-1" strokeWidth={isPlusActive ? 2.3 : 1.75} />
          <span className="text-[10px] tracking-tight font-sans font-medium">{isFr ? 'Plus' : 'More'}</span>
          {isPlusActive && (
            <span className="absolute bottom-0 w-3 h-0.5 rounded-full bg-[var(--accent)] shadow-sm" />
          )}
        </button>
      </div>
    </nav>
  );
};
