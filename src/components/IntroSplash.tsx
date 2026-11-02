import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

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
    const interval = setInterval(() => setProgress(p => Math.min(100, p + 3)), 90);
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(onFinish, 450);
    }, 3300);
    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [onFinish]);

  const enter = () => { setFading(true); setTimeout(onFinish, 250); };

  return (
    <div
      onClick={enter}
      data-theme="night"
      className={`tm-intro fixed inset-0 z-50 flex flex-col items-center justify-between px-6 py-10 text-white cursor-pointer select-none transition-opacity duration-500 ${fading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="tm-intro-grid" aria-hidden="true" />
      <div className="tm-intro-pill">TRADEMIND ACADEMY · OFFICIAL OS</div>

      <div className="flex flex-col items-center text-center w-full max-w-sm my-auto">
        <div className="tm-stage" aria-hidden="true">
          <span className="tm-ring tm-ring-a" />
          <span className="tm-ring tm-ring-b" />
          <span className="tm-ring tm-ring-c" />
          <div className="tm-cube">
            <div className="tm-face tm-front">
              <img src="/assets/trademind-official-logo.png" alt="" onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                if (!img.src.includes('.jpg')) img.src = '/assets/trademind-official-logo.jpg';
              }} />
              <span className="tm-shine" />
            </div>
            <div className="tm-face tm-back"><img src="/assets/trademind-official-logo.png" alt="" /></div>
            <div className="tm-edge tm-edge-l" /><div className="tm-edge tm-edge-r" />
          </div>
          <span className="tm-shadow" />
        </div>

        <h1 className="tm-title">TRADEMIND ACADEMY</h1>
        <p className="tm-sub">Discipline · Strategy · Mastery</p>
        <p className="tm-slogan">« {brandSlogan} »</p>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); enter(); }}
          className="tm-enter"
        >
          <span>Accéder à l'Espace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="w-full max-w-xs flex flex-col items-center gap-2">
        <div className="tm-bar"><div style={{ width: `${progress}%` }} /></div>
        <p className="text-[10.5px] text-slate-400 font-mono">Touchez l'écran pour passer</p>
      </div>
    </div>
  );
};
