import React, { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface IntroSplashProps {
  onFinish: () => void;
  brandSlogan?: string;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({
  onFinish,
  brandSlogan = 'Master your trading. Master yourself.'
}) => {
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress bar over 1.8 seconds
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 90);

    // Auto-transition after 2 seconds
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(onFinish, 400);
    }, 2100);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onFinish]);

  const handleManualEnter = () => {
    setFading(true);
    setTimeout(onFinish, 200);
  };

  return (
    <div
      onClick={handleManualEnter}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between px-6 py-10 bg-[#030508] text-white cursor-pointer select-none transition-opacity duration-400 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(13, 148, 136, 0.18), transparent 70%), radial-gradient(circle 350px at 50% 50%, rgba(20, 24, 38, 0.6), transparent)'
      }}
    >
      {/* Top ambient pill */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[11px] font-mono tracking-wider text-slate-300">
        <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
        <span>TRADEMIND ACADEMY · OFFICIAL OS</span>
      </div>

      {/* Centerpiece: Official Logo with subtle luxury glow & slogan */}
      <div className="flex flex-col items-center text-center max-w-md w-full my-auto animate-in fade-in zoom-in-95 duration-700">
        <div className="relative mb-6">
          {/* Subtle ambient halo */}
          <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/20 via-cyan-500/10 to-amber-500/20 rounded-3xl blur-2xl opacity-60 animate-pulse" />

          {/* Official logo frame */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border border-white/15 bg-black/90 shadow-2xl p-0.5">
            <img
              src="/assets/trademind-official-logo.png"
              onError={(e) => {
                // Fallback to jpg version if png fails
                const img = e.currentTarget as HTMLImageElement;
                if (!img.src.includes('.jpg')) {
                  img.src = '/assets/trademind-official-logo.jpg';
                }
              }}
              alt="TradeMind Academy Official Logo"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Brand name */}
        <div className="space-y-1 mb-4">
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            TRADEMIND ACADEMY
          </h1>
          <p className="text-[11px] uppercase tracking-widest text-teal-400 font-mono font-semibold">
            Discipline · Strategy · Mastery
          </p>
        </div>

        {/* Slogan */}
        <div className="relative px-6 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm mb-6">
          <p className="text-sm sm:text-base font-medium text-slate-200 italic tracking-wide">
            « {brandSlogan} »
          </p>
        </div>

        {/* Enter prompt button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleManualEnter();
          }}
          type="button"
          className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-[#020b09] text-xs font-bold uppercase tracking-wider shadow-lg shadow-teal-500/20 hover:opacity-95 transition-all"
        >
          <span>Accéder à l'Espace</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Footer loading progress & bypass notice */}
      <div className="w-full max-w-xs flex flex-col items-center gap-2">
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-400 font-mono">
          Touchez l'écran pour passer
        </p>
      </div>
    </div>
  );
};
