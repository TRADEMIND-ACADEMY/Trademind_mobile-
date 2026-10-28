import React from 'react';
import { useTrading } from '../context/TradingContext.js';
import { useAuth } from '../context/AuthContext.js';
import { Cloud, CloudOff, RefreshCw, Moon, Sun, Calculator, Bot, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  onOpenDan: () => void;
  onOpenCalculator: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenDan,
  onOpenCalculator,
  onOpenAuth,
  onOpenProfile
}) => {
  const { isDemoMode, setDemoMode, syncStatus, triggerManualSync, settings, updateSettings } = useTrading();
  const { user } = useAuth();

  const isFr = settings.lang === 'fr';

  const handleToggleMode = () => {
    if (isDemoMode) {
      if (window.confirm(isFr ? 'Passer en mode RÉEL ? Vos vrais trades enregistrés seront chargés.' : 'Switch to REAL MODE? Your authorized account trades will load.')) {
        setDemoMode(false);
      }
    } else {
      if (window.confirm(isFr ? 'Passer en mode DÉMO ? Aucune donnée ne sera transmise au serveur.' : 'Switch to DEMO MODE? Synthetic data will be used and no trades will touch the server.')) {
        setDemoMode(true);
      }
    }
  };

  const toggleTheme = () => {
    const next = settings.theme === 'night' ? 'day' : 'night';
    updateSettings({ theme: next });
  };

  const toggleLang = () => {
    const next = settings.lang === 'fr' ? 'en' : 'fr';
    updateSettings({ lang: next });
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#05060a]/85 border-b border-[var(--border)] px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-white/10 shadow-lg flex-shrink-0 bg-black">
            <img
              src="/assets/trademind-official-logo.jpg"
              alt="TRADEMIND ACADEMY"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback icon if asset fails to load
                (e.currentTarget as any).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold tracking-wider text-sm sm:text-base text-[var(--text-primary)]">
                TRADEMIND
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30 font-semibold">
                ACADEMY
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-[var(--text-secondary)] tracking-tight">
              Master your trading. Master yourself.
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* DEMO / REAL Mode Toggle */}
          <button
            onClick={handleToggleMode}
            type="button"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold transition-all border ${
              isDemoMode
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25'
                : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
            }`}
            title={isDemoMode ? (isFr ? 'Mode Démo actif (0 envoi serveur)' : 'Demo Mode active (0 server push)') : (isFr ? 'Mode Réel actif' : 'Real Mode active')}
          >
            <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span>{isDemoMode ? 'DEMO' : 'REAL'}</span>
          </button>

          {/* Cloud Sync Status */}
          {!isDemoMode && (
            <button
              onClick={triggerManualSync}
              type="button"
              className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono px-1.5 sm:px-2 py-1 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              title={
                syncStatus.conflictCount > 0
                  ? (isFr ? 'Une modification faite sur un autre appareil a remplacé une version locale (conservée). Touchez pour resynchroniser.' : 'An edit made on another device replaced a local version (kept). Tap to resync.')
                  : syncStatus.rejectedCount > 0
                    ? (isFr ? 'Certaines données restent locales (quota du plan atteint ou données refusées par le serveur).' : 'Some data stays local (plan quota reached or data rejected by the server).')
                    : syncStatus.isSyncing ? (isFr ? 'Synchronisation...' : 'Syncing...') : (isFr ? 'Synchroniser maintenant' : 'Sync now')
              }
            >
              {syncStatus.isSyncing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[var(--accent)]" />
              ) : syncStatus.isOnline ? (
                <Cloud className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <CloudOff className="w-3.5 h-3.5 text-rose-400" />
              )}
              <span>{syncStatus.isSyncing ? 'SYNC' : !syncStatus.isOnline ? 'OFFLINE' : syncStatus.conflictCount > 0 ? (isFr ? 'CONFLIT' : 'CONFLICT') : syncStatus.rejectedCount > 0 ? (isFr ? 'À VOIR' : 'CHECK') : syncStatus.state === 'error' ? (isFr ? 'ERREUR' : 'ERROR') : 'CLOUD'}</span>
            </button>
          )}

          {/* Risk Calculator button */}
          <button
            onClick={onOpenCalculator}
            type="button"
            className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors"
            title={isFr ? 'Calculateur de Risque' : 'Risk Calculator'}
          >
            <Calculator className="w-4 h-4" />
          </button>

          {/* DAN AI trigger (Desktop only, mobile has discrete floating button) */}
          <button
            onClick={onOpenDan}
            type="button"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[var(--purple)]/40 bg-[var(--purple)]/10 text-[var(--purple)] hover:bg-[var(--purple)]/20 transition-all font-mono text-xs font-semibold"
            title="DAN Intelligence"
          >
            <Bot className="w-4 h-4" />
            <span>DAN</span>
          </button>

          {/* Language toggle */}
          <button
            onClick={toggleLang}
            type="button"
            className="px-2 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-xs font-mono font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title={isFr ? 'Passer en anglais' : 'Switch to French'}
          >
            {settings.lang === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            type="button"
            className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title={settings.theme === 'night' ? (isFr ? 'Mode jour' : 'Light mode') : (isFr ? 'Mode nuit' : 'Dark mode')}
          >
            {settings.theme === 'night' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Account / Login */}
          {user ? (
            <button
              onClick={onOpenProfile}
              type="button"
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] hover:border-[var(--accent)] transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-[var(--accent)]/20 border border-[var(--accent)]/40 text-[var(--accent)] flex items-center justify-center font-bold text-[10px]">
                {user.firstName ? user.firstName[0].toUpperCase() : 'T'}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-bold leading-tight text-[var(--text-primary)]">{user.firstName || 'Trader'}</p>
                <p className="text-[10px] font-mono text-[var(--text-secondary)]">{user.tradeMindId}</p>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--accent)] text-[#04110f] font-semibold text-xs transition-opacity hover:opacity-90"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>{isFr ? 'Connexion' : 'Sign In'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
