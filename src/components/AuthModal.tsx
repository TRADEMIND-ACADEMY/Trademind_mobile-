import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useTrading } from '../context/TradingContext.js';
import { PasswordInput } from './PasswordInput.js';
import { X, AlertTriangle, Shield } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const { settings } = useTrading();
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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    let res: { success: boolean; error?: string };

    if (mode === 'login') {
      res = await login(email, password);
    } else {
      if (password.length < 8) {
        setErrorMsg(isFr ? 'Le mot de passe doit comporter au moins 8 caractères.' : 'Password must have at least 8 characters.');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg(isFr ? 'Les mots de passe ne correspondent pas.' : 'Passwords do not match.');
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
      onClose();
    } else {
      setErrorMsg(res.error || 'Erreur d authentification');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-md bg-[var(--surface-elevated)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden my-4">
        {/* Header with official logo */}
        <div className="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10 bg-black flex-shrink-0">
              <img src="/assets/trademind-official-logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                {mode === 'login' ? (isFr ? 'Connexion Espace Privé' : 'Sign In to Workspace') : (isFr ? 'Créer un Compte' : 'Create an Account')}
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">TRADEMIND ACADEMY</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'register' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">{isFr ? 'Prénom' : 'First Name'} *</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                    placeholder="Alex"
                    className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">{isFr ? 'Nom' : 'Last Name'}</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Trader"
                    className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">{isFr ? 'Pays' : 'Country'}</label>
                  <input
                    type="text"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">{isFr ? 'Téléphone' : 'Phone'}</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+33..."
                    className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">Email *</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="trader@domain.com"
              className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2 text-xs text-[var(--text-primary)]"
            />
          </div>

          <PasswordInput
            label={isFr ? 'Mot de passe' : 'Password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            lang={settings.lang}
          />

          {mode === 'register' && (
            <PasswordInput
              label={isFr ? 'Confirmer le mot de passe' : 'Confirm Password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              lang={settings.lang}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[var(--accent)] text-[#04110f] text-xs font-bold hover:opacity-95 transition-opacity disabled:opacity-50 mt-2"
          >
            {loading ? (isFr ? 'Vérification...' : 'Processing...') : mode === 'login' ? (isFr ? 'Se Connecter' : 'Sign In') : (isFr ? 'Créer mon Espace' : 'Create My Account')}
          </button>

          <div className="pt-2 text-center text-xs text-[var(--text-secondary)]">
            {mode === 'login' ? (
              <p>
                {isFr ? 'Pas encore de compte ?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMsg(null); }}
                  className="text-[var(--accent)] font-semibold hover:underline"
                >
                  {isFr ? 'Créer un compte' : 'Register now'}
                </button>
              </p>
            ) : (
              <p>
                {isFr ? 'Déjà inscrit ?' : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(null); }}
                  className="text-[var(--accent)] font-semibold hover:underline"
                >
                  {isFr ? 'Se connecter' : 'Sign in'}
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
