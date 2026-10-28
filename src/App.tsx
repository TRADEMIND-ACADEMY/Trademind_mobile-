import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { TradingProvider, useTrading } from './context/TradingContext.js';
import { Navbar } from './components/Navbar.js';
import { BottomNav, ActiveTab } from './components/BottomNav.js';
import { DashboardView } from './components/DashboardView.js';
import { JournalView } from './components/JournalView.js';
import { PlanBuilderView } from './components/PlanBuilderView.js';
import { PerformanceView } from './components/PerformanceView.js';
import { ProfileView } from './components/ProfileView.js';
import { MatrixView } from './components/MatrixView.js';
import { CalendarView } from './components/CalendarView.js';
import { TradeModal } from './components/TradeModal.js';
import { RiskCalculatorModal } from './components/RiskCalculatorModal.js';
import { DanModal } from './components/DanModal.js';
import { DanFloatingButton } from './components/DanFloatingButton.js';
import { AuthModal } from './components/AuthModal.js';
import { SubscriptionModal } from './components/SubscriptionModal.js';
import { PlusMenuModal } from './components/PlusMenuModal.js';
import { IntroSplash } from './components/IntroSplash.js';
import { AuthScreen } from './components/AuthScreen.js';
import { Trade } from './types/index.js';
import {
  LayoutDashboard,
  BookOpen,
  Sliders,
  TrendingUp,
  User,
  Grid3X3,
  Calendar as CalendarIcon,
  CreditCard
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { settings, isDemoMode, setDemoMode } = useTrading();
  const { user, loading } = useAuth();
  const isFr = settings.lang === 'fr';

  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return !sessionStorage.getItem('tm_intro_seen');
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [tradeToEdit, setTradeToEdit] = useState<Trade | null>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isDanOpen, setIsDanOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);

  const handleOpenNewTrade = () => {
    setTradeToEdit(null);
    setIsTradeModalOpen(true);
  };

  const handleEditTrade = (trade: Trade) => {
    setTradeToEdit(trade);
    setIsTradeModalOpen(true);
  };

  // Extended desktop navigation tabs
  const desktopNavItems = [
    { id: 'dashboard' as const, label: isFr ? 'Accueil' : 'Dashboard', icon: LayoutDashboard },
    { id: 'journal' as const, label: isFr ? 'Journal' : 'Journal', icon: BookOpen },
    { id: 'plans' as const, label: isFr ? 'Plans de Trading' : 'Trading Plans', icon: Sliders },
    { id: 'matrix' as const, label: isFr ? "Matrice d'Évolution" : 'Evolution Matrix', icon: Grid3X3 },
    { id: 'calendar' as const, label: isFr ? 'Calendrier' : 'Calendar', icon: CalendarIcon },
    { id: 'performance' as const, label: isFr ? 'Performance' : 'Performance', icon: TrendingUp },
    { id: 'profile' as const, label: isFr ? 'Profil & Sécurité' : 'Profile & Security', icon: User }
  ];

  // 1. Fluid Premium Introduction Screen
  if (showIntro) {
    return (
      <IntroSplash
        onFinish={() => {
          setShowIntro(false);
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('tm_intro_seen', '1');
          }
        }}
      />
    );
  }

  // 2. Loading Session Indicator
  if (loading) {
    return (
      <div className="min-h-screen bg-[#03060b] flex flex-col items-center justify-center gap-4 text-white">
        <div className="w-12 h-12 rounded-xl border border-white/10 bg-black overflow-hidden shadow-2xl p-0.5">
          <img
            src="/assets/trademind-official-logo.png"
            onError={(e) => {
              (e.currentTarget as any).src = '/assets/trademind-official-logo.jpg';
            }}
            alt="TradeMind"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono text-slate-400">Restauration de la session...</p>
      </div>
    );
  }

  // 3. Direct Login / Registration Screen if not authenticated and not explicitly in demo mode
  if (!user && !isDemoMode) {
    return (
      <AuthScreen
        onSuccess={() => {
          setActiveTab('dashboard');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] flex flex-col font-sans transition-colors duration-300">
      {/* Top Navbar */}
      <Navbar
        onOpenDan={() => setIsDanOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setActiveTab('profile')}
      />

      {/* Main Container with generous bottom padding for Android & Mobile safe areas */}
      <main
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-28 md:pb-12"
        style={{
          paddingBottom: 'calc(5.5rem + env(safe-area-inset-bottom, 16px))'
        }}
      >
        {/* Desktop Navigation Tabs (Hidden on mobile) */}
        <div className="hidden md:flex items-center justify-between border-b border-[var(--border)] pb-3 mb-6 gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {desktopNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold font-mono tracking-tight transition-all ${
                    isActive
                      ? 'bg-[var(--surface-elevated)] text-[var(--accent)] border border-[var(--accent)] shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Subscribe Button on Desktop */}
          <button
            type="button"
            onClick={() => setIsSubModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-mono font-bold hover:bg-[var(--accent)]/20 transition-all flex-shrink-0"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{isFr ? 'Abonnement' : 'Subscription'}</span>
          </button>
        </div>

        {/* View Router */}
        {activeTab === 'dashboard' && (
          <DashboardView
            onOpenNewTrade={handleOpenNewTrade}
            onGoToJournal={() => setActiveTab('journal')}
            onOpenPlans={() => setActiveTab('plans')}
          />
        )}

        {activeTab === 'journal' && (
          <JournalView
            onOpenNewTrade={handleOpenNewTrade}
            onEditTrade={handleEditTrade}
          />
        )}

        {activeTab === 'plans' && (
          <PlanBuilderView />
        )}

        {activeTab === 'matrix' && (
          <MatrixView />
        )}

        {activeTab === 'calendar' && (
          <CalendarView onEditTrade={handleEditTrade} />
        )}

        {activeTab === 'performance' && (
          <PerformanceView />
        )}

        {activeTab === 'profile' && (
          <ProfileView />
        )}
      </main>

      {/* Discrete Floating DAN AI button (Safely positioned above mobile bottom nav) */}
      <DanFloatingButton onClick={() => setIsDanOpen(true)} />

      {/* Mobile Bottom Navigation (Fixed at bottom with safe-area support) */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenPlus={() => setIsPlusMenuOpen(true)}
      />

      {/* Mobile Plus Action Sheet */}
      <PlusMenuModal
        isOpen={isPlusMenuOpen}
        onClose={() => setIsPlusMenuOpen(false)}
        onSelectTab={setActiveTab}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenDan={() => setIsDanOpen(true)}
        onOpenSubscription={() => setIsSubModalOpen(true)}
      />

      {/* Interactive Modals */}
      <TradeModal
        isOpen={isTradeModalOpen}
        onClose={() => setIsTradeModalOpen(false)}
        tradeToEdit={tradeToEdit}
      />

      <RiskCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      <DanModal
        isOpen={isDanOpen}
        onClose={() => setIsDanOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <SubscriptionModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <TradingProvider>
        <AppContent />
      </TradingProvider>
    </AuthProvider>
  );
}
