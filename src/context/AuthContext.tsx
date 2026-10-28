import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount } from '../types/index.js';
import { api, clearToken, getToken, setToken } from '../lib/api.js';

interface AuthContextType {
  user: UserAccount | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserAccount>) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: (password: string) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const readLang = (): 'fr' | 'en' => {
  try { return JSON.parse(localStorage.getItem('dtj_settings') || '{}').lang === 'en' ? 'en' : 'fr'; } catch { return 'fr'; }
};

const networkError = (code?: string) =>
  code === 'API_NOT_CONFIGURED'
    ? "L'application n'est pas reliée à un serveur (VITE_API_BASE_URL manquant à la compilation)."
    : 'Serveur injoignable. Vérifiez votre connexion.';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);

  const remember = (u: UserAccount | null) => {
    try {
      if (u) {
        (window as any).tmAccount = u;
        localStorage.setItem('tm_current_user', u.id);
        localStorage.setItem('tm_current_plan', u.plan || 'FREE');
      } else {
        delete (window as any).tmAccount;
        localStorage.removeItem('tm_current_user');
        localStorage.removeItem('tm_current_plan');
      }
    } catch { /* stockage indisponible */ }
  };

  const refreshUser = async () => {
    try {
      if (!getToken()) { setUser(null); return; }
      const res = await api('GET', '/api/auth/me');
      if (res.ok && res.json?.user) {
        setUser(res.json.user);
        remember(res.json.user);
      } else if (res.status === 401) {
        clearToken(); setUser(null); remember(null);
      }
      // Autre erreur (réseau, 5xx) : on garde la session locale telle quelle, sans déconnecter.
    } catch {
      // Hors ligne : l'utilisateur mémorisé reste utilisable en lecture ; la synchro reprendra au retour du réseau.
      try {
        const cached = (window as any).tmAccount;
        if (cached) setUser(cached);
      } catch { /* ignore */ }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
    const onExpired = () => { setUser(null); remember(null); };
    window.addEventListener('tm:session-expired', onExpired);
    return () => window.removeEventListener('tm:session-expired', onExpired);
  }, []);

  const authenticate = async (path: string, body: unknown, fallback: string) => {
    try {
      const res = await api('POST', path, body);
      if (!res.ok) return { success: false, error: res.json?.error || (res.status === 0 ? networkError(res.json?.code) : fallback) };
      if (!res.json?.token || !res.json?.user) return { success: false, error: fallback };
      setToken(res.json.token);
      setUser(res.json.user);
      remember(res.json.user);
      return { success: true };
    } catch {
      return { success: false, error: networkError() };
    }
  };

  const login = (email: string, password: string) => authenticate('/api/auth/login', { email, password }, 'Erreur de connexion');
  const register = (formData: any) => authenticate('/api/auth/register', { ...formData, language: readLang() }, "Erreur d'inscription");

  const logout = async () => {
    try { await api('POST', '/api/auth/logout', {}); } catch { /* hors ligne : le jeton est tout de même retiré localement */ }
    clearToken();
    setUser(null);
    remember(null);
  };

  const simple = async (method: string, path: string, body: unknown, fallback: string) => {
    try {
      const res = await api(method, path, body);
      if (!res.ok) return { res, error: res.json?.error || fallback };
      return { res };
    } catch {
      return { error: networkError() } as any;
    }
  };

  const updateProfile = async (profileData: Partial<UserAccount>) => {
    const { res, error } = await simple('PATCH', '/api/account/profile', profileData, 'Erreur de mise à jour');
    if (error) return { success: false, error };
    if (res?.json?.user) { setUser(prev => ({ ...(prev as UserAccount), ...res.json.user })); }
    return { success: true };
  };

  const changePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    const { error } = await simple('POST', '/api/account/password', { currentPassword, newPassword, confirmPassword }, 'Erreur de changement de mot de passe');
    return error ? { success: false, error } : { success: true };
  };

  const deleteAccount = async (password: string) => {
    const { error } = await simple('POST', '/api/account/delete', { password }, 'Erreur de suppression du compte');
    if (error) return { success: false, error };
    clearToken();
    setUser(null);
    remember(null);
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, changePassword, deleteAccount, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
