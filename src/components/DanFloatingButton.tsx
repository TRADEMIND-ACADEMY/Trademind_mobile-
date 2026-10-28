import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { useTrading } from '../context/TradingContext.js';

interface DanFloatingButtonProps {
  onClick: () => void;
}

export const DanFloatingButton: React.FC<DanFloatingButtonProps> = ({ onClick }) => {
  const { isDemoMode, settings } = useTrading();
  const isFr = settings.lang === 'fr';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Ouvrir l'assistant DAN AI"
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-30 group flex items-center gap-2 pl-3 pr-3.5 py-2.5 rounded-full bg-[#0a0718]/90 hover:bg-[#140e2e] border border-purple-500/40 text-purple-300 shadow-xl shadow-purple-950/40 backdrop-blur-xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400"
      style={{
        marginBottom: 'env(safe-area-inset-bottom, 0px)'
      }}
    >
      <div className="relative">
        <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform">
          <Bot className="w-4 h-4" />
        </div>
        {isDemoMode && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-black" />
        )}
      </div>

      <div className="text-left leading-none">
        <div className="flex items-center gap-1">
          <span className="font-display font-bold text-xs tracking-wide text-white">DAN</span>
          <Sparkles className="w-2.5 h-2.5 text-purple-400 animate-pulse" />
        </div>
        <span className="text-[9px] font-mono text-purple-300/80 uppercase">AI</span>
      </div>
    </button>
  );
};
