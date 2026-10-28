import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useTrading } from '../context/TradingContext.js';
import { PasswordInput } from './PasswordInput.js';
import { ShieldCheck, AlertCircle, ArrowRight, Play, Sparkles, KeyRound, UserCheck } from 'lucide-react';

interface AuthScreenProps {
  onSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const { login, register } = useAuth();
  const { setDemoMode, settings } = useTrading();
  const isFr = settings.lang === 'fr';

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('France');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    let res: { success: boolean; error?: string };

    if (mode === 'login') {
      res = await login(email, password);
    } else {
      if (password.length < 8) {
        setErrorMsg(isFr ? 'Le mot de passe doit comporter au moins 8 caractères.' : 'Password must be at least 8 characters.');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg(isFr ? 'Les deux mots de passe ne correspondent pas.' : 'Passwords do not match.');
        setLoading(false);
        return;
      }
      res = await register({
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        country,
        phone
      });
    }

    setLoading(false);
    if (res.success) {
      onSuccess();
    } else {
      setErrorMsg(res.error || (isFr ? 'Erreur d’authentification' : 'Authentication error'));
    }
  };

  const handleQuickDemo = () => {
    setDemoMode(true);
    onSuccess();
  };

  const handleOwnerDemoFill = () => {
    setEmail('mushagalusadan@gmail.com');
    setPassword('TradeMind2026!');
  };

  return (
    <div className="min-h-screen w-full bg-[#03060b] text-[var(--text-primary)] flex flex-col justify-between py-6 px-4 sm:px-6 relative overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with official logo & brand */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 bg-black shadow-lg flex-shrink-0">
            <img
              src="/assets/trademind-official-logo.png"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                if (!img.src.includes('.jpg')) img.src = '/assets/trademind-official-logo.jpg';
              }}
              alt="TradeMind Academy"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm tracking-wider text-white">TRADEMIND</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30 font-semibold">
                ACADEMY
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Discipline · Strategy · Mastery</p>
          </div>
        </div>

        {/* Quick Demo Access pill */}
        <button
          onClick={handleQuickDemo}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-mono font-bold hover:bg-amber-500/20 transition-all shadow-sm"
          title="Explorer l'application en mode Démo immédiatement"
        >
          <Play className="w-3 h-3 fill-amber-400" />
          <span>{isFr ? 'Mode Démo' : 'Demo Mode'}</span>
        </button>
      </div>

      {/* Main Auth Card */}
      <div className="max-w-md w-full mx-auto my-auto z-10 py-6">
        <div className="rounded-2xl border border-[var(--border)] bg-[#080d16]/90 backdrop-blur-xl shadow-2xl p-6 sm:p-7">
          {/* Slogan & Title */}
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
              {mode === 'login'
                ? (isFr ? 'Connexion Espace Privé' : 'Sign In to Workspace')
                : (isFr ? 'Créer votre Compte' : 'Create Trader Account')}
            </h2>
            <p className="text-xs text-slate-400 mt-1 italic">
              « Master your trading. Master yourself. »
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-white/5 border border-white/10 mb-5">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(null); }}
              className={`py-2 rounded-lg text-xs font-bold font-mono transition-all ${
                mode === 'login'
                  ? 'bg-[var(--accent)] text-[#04110f] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isFr ? 'Connexion' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg(null); }}
              className={`py-2 rounded-lg text-xs font-bold font-mono transition-all ${
                mode === 'register'
                  ? 'bg-[var(--accent)] text-[#04110f] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isFr ? 'Inscription' : 'Register'}
            </button>
          </div>

          {/* Error notice */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 uppercase block mb-1">
                      {isFr ? 'Prénom' : 'First Name'} *
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      required
                      placeholder="Alex"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 uppercase block mb-1">
                      {isFr ? 'Nom' : 'Last Name'}
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="Trader"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 uppercase block mb-1">
                      {isFr ? 'Pays' : 'Country'} *
                    </label>
                    <select
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      className="w-full bg-[#0a0f18] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--accent)]"
                    >
                      <option value="France">France</option>
                      <option value="Belgique">Belgique</option>
                      <option value="Suisse">Suisse</option>
                      <option value="Canada">Canada</option>
                      <option value="RDC">RDC</option>
                      <option value="Cameroun">Cameroun</option>
                      <option value="Sénégal">Sénégal</option>
                      <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                      <option value="Maroc">Maroc</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 uppercase block mb-1">
                      {isFr ? 'Téléphone' : 'Phone'}
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+33..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-[11px] font-semibold text-slate-300 uppercase block mb-1">
                {isFr ? 'Adresse Email' : 'Email Address'} *
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="votre.email@domaine.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <PasswordInput
              label={isFr ? 'Mot de passe' : 'Password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
            />

            {mode === 'register' && (
              <PasswordInput
                label={isFr ? 'Confirmer le mot de passe' : 'Confirm Password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-[#020b09] text-xs font-bold uppercase tracking-wider shadow-lg shadow-teal-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>{isFr ? 'Vérification...' : 'Verifying...'}</span>
              ) : (
                <>
                  <span>{mode === 'login' ? (isFr ? 'Se Connecter' : 'Sign In') : (isFr ? 'Créer mon Compte' : 'Create Account')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Test / Owner helper prefill */}
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <button
              type="button"
              onClick={handleOwnerDemoFill}
              className="text-teal-400 hover:underline flex items-center gap-1 font-mono text-[10px]"
            >
              <UserCheck className="w-3 h-3" />
              <span>{isFr ? 'Compte Propriétaire (Pré-remplir)' : 'Owner Account (Pre-fill)'}</span>
            </button>

            <span className="font-mono text-[10px] text-slate-400">
              Session persistée 30j
            </span>
          </div>
        </div>
      </div>

      {/* Footer safe area note */}
      <div className="max-w-md w-full mx-auto text-center text-[10px] text-slate-400 font-mono z-10 pb-2">
        <span>TRADEMIND ACADEMY · SECURE TRADING OS & JOURNAL</span>
      </div>
    </div>
  );
};
