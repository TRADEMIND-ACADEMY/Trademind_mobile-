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

  const syncLabel = syncStatus.isSyncing ? 'SYNC' : !syncStatus.isOnline ? 'OFFLINE' : syncStatus.conflictCount > 0 ? (isFr ? 'CONFLIT' : 'CONFLICT') : syncStatus.rejectedCount > 0 ? (isFr ? 'À VOIR' : 'CHECK') : syncStatus.state === 'error' ? (isFr ? 'ERREUR' : 'ERROR') : 'CLOUD';
  const syncTitle = syncStatus.conflictCount > 0
    ? (isFr ? 'Une modification faite sur un autre appareil a remplacé une version locale (conservée). Touchez pour resynchroniser.' : 'An edit made on another device replaced a local version (kept). Tap to resync.')
    : syncStatus.rejectedCount > 0
      ? (isFr ? 'Certaines données restent locales (quota du plan atteint ou données refusées par le serveur).' : 'Some data stays local (plan quota reached or data rejected by the server).')
      : syncStatus.isSyncing ? (isFr ? 'Synchronisation...' : 'Syncing...') : (isFr ? 'Synchroniser maintenant' : 'Sync now');

  const iconBtn = 'w-10 h-10 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] flex items-center justify-center transition-colors';

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-[var(--border)] backdrop-blur-xl transition-colors"
      style={{ background: 'var(--bar-bg)', paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center gap-2 sm:gap-3">
        {/* ZONE 1 — Marque */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-[var(--accent)]/50 shadow-[0_0_18px_var(--accent-soft)] flex-shrink-0 bg-black">
            <img
              src="/assets/trademind-official-logo.jpg"
              alt="TRADEMIND ACADEMY"
              className="w-full h-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div className="min-w-0 leading-tight">
            <div className="font-display font-bold tracking-[0.14em] text-[13px] sm:text-base text-[var(--text-primary)] truncate">TRADEMIND</div>
            <div className="text-[10px] tracking-[0.34em] text-[var(--accent)] font-semibold">ACADEMY</div>
          </div>
        </div>

        {/* ZONE 2 — Outils (écrans larges uniquement ; sur téléphone ils sont dans « Plus ») */}
        <div className="hidden md:flex items-center gap-2">
          <button onClick={onOpenCalculator} type="button" className={iconBtn} title={isFr ? 'Calculateur de Risque' : 'Risk Calculator'} aria-label={isFr ? 'Calculateur de risque' : 'Risk calculator'}>
            <Calculator className="w-4 h-4" />
          </button>
          <button onClick={onOpenDan} type="button" className="hidden lg:flex h-10 items-center gap-1.5 px-3 rounded-xl border border-[var(--purple)]/40 bg-[var(--purple)]/10 text-[var(--purple)] hover:bg-[var(--purple)]/20 transition-all font-mono text-xs font-semibold" title="DAN Intelligence">
            <Bot className="w-4 h-4" /><span>DAN</span>
          </button>
          <button onClick={toggleLang} type="button" className="h-10 px-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-xs font-mono font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" title={isFr ? 'Passer en anglais' : 'Switch to French'}>
            {settings.lang === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}
          </button>
          <button onClick={toggleTheme} type="button" className={iconBtn} title={settings.theme === 'night' ? (isFr ? 'Mode jour' : 'Light mode') : (isFr ? 'Mode nuit' : 'Dark mode')} aria-label={isFr ? 'Changer de thème' : 'Toggle theme'}>
            {settings.theme === 'night' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* ZONE 3 — Statut + compte */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            onClick={handleToggleMode}
            type="button"
            className={`h-9 flex items-center gap-1.5 px-2.5 rounded-full text-[11px] font-mono font-bold tracking-wider transition-all border ${
              isDemoMode ? 'bg-amber-500/15 text-amber-500 border-amber-500/40' : 'bg-emerald-500/15 text-emerald-500 border-emerald-500/40'
            }`}
            title={isDemoMode ? (isFr ? 'Mode Démo actif (0 envoi serveur)' : 'Demo Mode active (0 server push)') : (isFr ? 'Mode Réel actif' : 'Real Mode active')}
          >
            <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span>{isDemoMode ? 'DEMO' : 'REAL'}</span>
          </button>

          {!isDemoMode && (
            <button onClick={triggerManualSync} type="button" className="h-9 min-w-9 px-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center gap-1 transition-colors" title={syncTitle} aria-label={syncTitle}>
              {syncStatus.isSyncing ? <RefreshCw className="w-4 h-4 animate-spin text-[var(--accent)]" /> : syncStatus.isOnline ? <Cloud className="w-4 h-4 text-emerald-500" /> : <CloudOff className="w-4 h-4 text-rose-500" />}
              <span className="hidden sm:inline text-[10px] font-mono">{syncLabel}</span>
              {(syncStatus.conflictCount > 0 || syncStatus.rejectedCount > 0 || syncStatus.state === 'error') && <span className="sm:hidden w-1.5 h-1.5 rounded-full bg-amber-400" />}
            </button>
          )}

          {user ? (
            <button onClick={onOpenProfile} type="button" className="h-10 flex items-center gap-2 pl-1.5 pr-1.5 md:pr-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] hover:border-[var(--accent)] transition-colors" aria-label={isFr ? 'Mon profil' : 'My profile'}>
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--purple)] text-[var(--on-accent)] flex items-center justify-center font-bold text-xs">
                {user.firstName ? user.firstName[0].toUpperCase() : 'T'}
              </div>
              <div className="text-left hidden md:block leading-tight">
                <p className="text-xs font-bold text-[var(--text-primary)]">{user.firstName || 'Trader'}</p>
                <p className="text-[10px] font-mono text-[var(--text-secondary)]">{user.tradeMindId}</p>
              </div>
            </button>
          ) : (
            <button onClick={onOpenAuth} type="button" className="h-10 flex items-center gap-1.5 px-3 rounded-xl bg-[var(--accent)] text-[var(--on-accent)] font-semibold text-xs transition-opacity hover:opacity-90">
              <UserIcon className="w-3.5 h-3.5" />
              <span>{isFr ? 'Connexion' : 'Sign In'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
