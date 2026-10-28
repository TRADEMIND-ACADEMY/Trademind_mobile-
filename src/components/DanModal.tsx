import { api } from '../lib/api.js';
import React, { useState, useRef, useEffect } from 'react';
import { useTrading } from '../context/TradingContext.js';
import { useAuth } from '../context/AuthContext.js';
import { X, Send, Bot, AlertTriangle, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface DanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
}

export const DanModal: React.FC<DanModalProps> = ({ isOpen, onClose }) => {
  const { trades, stats, activePlan, isDemoMode, settings } = useTrading();
  const { user } = useAuth();
  const isFr = settings.lang === 'fr';

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: isFr
        ? 'Bonjour. Je suis DAN, votre navigateur de discipline et d intelligence de trading TradeMind. Je peux auditer votre processus, le respect de vos critères, vos paramètres Guardian et votre gestion du risque.'
        : 'Hello. I am DAN, your TradeMind trading intelligence and discipline navigator. I can evaluate your process, criteria adherence, Guardian limits, and risk management.'
    }
  ]);

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = input.trim();
    if (!query || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setLoading(true);

    if (isDemoMode) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: isFr
              ? 'Réponse du mode DÉMO : Vous êtes actuellement dans l espace virtuel avec des données simulées. En mode RÉEL, DAN analyse précisément vos vrais trades persistés, vos confluences et vos règles Guardian.'
              : 'DEMO mode response: You are currently exploring simulated workspace data. In REAL mode, DAN precisely assesses your persisted trades, confluences, and Guardian parameters.'
          }
        ]);
        setLoading(false);
      }, 500);
      return;
    }

    try {
      const context = {
        totalTrades: stats.totalTrades,
        winRate: stats.winRate,
        profitFactor: stats.profitFactor,
        maxDrawdown: stats.maxDrawdown,
        activePlanName: activePlan?.name || 'Aucun',
        planCriteriaCount: activePlan?.criteria.length || 0,
        guardianStatus: stats.losses >= (settings.guardian.maxConsecutiveLosses || 3) ? 'warning' : 'aligned',
        recentTrades: trades.slice(0, 5).map(t => ({
          symbol: t.symbol,
          pnl: t.pnl,
          rMultiple: t.rMultiple,
          guardianStatus: t.guardianStatus,
          planScore: t.score
        }))
      };

      const res = await api('POST', '/api/dan/chat', { message: query, lang: settings.lang, context });
      const data: any = res.json || {};
      if (!res.ok) {
        let msg = data.error || 'Erreur DAN';
        if (data.code === 'DAN_NOT_CONFIGURED') {
          msg = isFr
            ? "Service DAN non configuré : La clé GEMINI_API_KEY n'a pas encore été injectée sur le serveur. Pour l'activer, configurez GEMINI_API_KEY dans vos secrets d'environnement."
            : 'DAN AI Service not configured: GEMINI_API_KEY has not been configured in server secrets yet.';
        } else if (data.code === 'DAN_LOCKED') {
          msg = isFr
            ? "DAN est accessible avec le plan ASCEND ou SOVEREIGN. Consultez votre profil pour mettre à niveau votre abonnement."
            : 'DAN is available with ASCEND or SOVEREIGN. Check your profile to upgrade.';
        }
        setMessages(prev => [...prev, { role: 'assistant', content: msg, isError: true }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: isFr ? 'Impossible de joindre le serveur DAN.' : 'Unable to connect to DAN server.',
          isError: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div
        className="w-full max-w-lg bg-[var(--surface-elevated)] border border-[var(--border)] rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh] sm:max-h-[580px]"
        style={{
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)'
        }}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-sm text-[var(--text-primary)]">
                  DAN · Trader Intelligence
                </h3>
                {isDemoMode ? (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold">
                    DEMO
                  </span>
                ) : (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold">
                    REAL
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[var(--text-secondary)]">
                Discipline & Analysis Navigator
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[var(--accent)] text-[#04110f] font-medium rounded-tr-sm'
                    : m.isError
                    ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300 rounded-tl-sm'
                    : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] rounded-tl-sm'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl px-4 py-2 text-xs text-[var(--text-secondary)] animate-pulse font-mono">
                {isFr ? 'DAN examine votre discipline...' : 'DAN analyzing process adherence...'}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 border-t border-[var(--border)] bg-[var(--surface)] flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={isFr ? 'Interroger DAN sur votre risque, plan ou discipline...' : 'Ask DAN about risk, plan, or discipline...'}
            disabled={loading}
            className="flex-1 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2.5 rounded-xl bg-[var(--accent)] text-[#04110f] disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
