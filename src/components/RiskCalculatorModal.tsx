import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext.js';
import { X, Calculator, Info } from 'lucide-react';

interface RiskCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RiskCalculatorModal: React.FC<RiskCalculatorModalProps> = ({ isOpen, onClose }) => {
  const { settings } = useTrading();
  const isFr = settings.lang === 'fr';

  const [capital, setCapital] = useState<number>(settings.startingBalance || 10000);
  const [riskPct, setRiskPct] = useState<number>(1.0);
  const [entryPrice, setEntryPrice] = useState<string>('1.0850');
  const [stopLoss, setStopLoss] = useState<string>('1.0820');
  const [takeProfit, setTakeProfit] = useState<string>('1.0910');
  const [assetType, setAssetType] = useState<'forex' | 'gold' | 'crypto' | 'indices'>('forex');

  if (!isOpen) return null;

  const entry = parseFloat(entryPrice) || 0;
  const sl = parseFloat(stopLoss) || 0;
  const tp = parseFloat(takeProfit) || 0;

  const riskAmount = (capital * (riskPct / 100));
  const slDistance = entry && sl ? Math.abs(entry - sl) : 0;
  const tpDistance = entry && tp ? Math.abs(tp - entry) : 0;
  const rr = slDistance > 0 && tpDistance > 0 ? (tpDistance / slDistance).toFixed(2) : '0';
  const rewardAmount = parseFloat(rr) > 0 ? (riskAmount * parseFloat(rr)).toFixed(2) : '0';

  // Position sizing with explicit assumptions explained
  let estimatedSize = '0';
  let assumptionNote = '';

  if (slDistance > 0) {
    if (assetType === 'forex') {
      // 1 standard lot = 100,000 units. 1 pip on EURUSD = $10. Pip distance = slDistance * 10000
      const pips = slDistance * 10000;
      if (pips > 0) {
        const lot = (riskAmount / (pips * 10)).toFixed(2);
        estimatedSize = `${lot} lots`;
        assumptionNote = isFr
          ? 'Hypothèse Forex standard : 1 lot = 100 000 unités de devise de base, valeur de pip standard (~$10/lot sur EUR/USD).'
          : 'Standard Forex assumption: 1 lot = 100,000 base units, standard pip value (~$10/lot on EUR/USD).';
      }
    } else if (assetType === 'gold') {
      // 1 lot Gold = 100 oz. $1 move in gold = $100 per lot
      const lot = (riskAmount / (slDistance * 100)).toFixed(2);
      estimatedSize = `${lot} lots`;
      assumptionNote = isFr
        ? 'Hypothèse Or (XAUUSD) : 1 lot standard = 100 onces, variation de 1.00$ = 100$ par lot.'
        : 'Gold (XAUUSD) assumption: 1 standard lot = 100 oz, $1.00 move = $100 per lot.';
    } else {
      // Direct unit size = riskAmount / slDistance
      const units = (riskAmount / slDistance).toFixed(4);
      estimatedSize = `${units} unités`;
      assumptionNote = isFr
        ? 'Hypothèse linéaire : Taille = Montant risqué / Distance de Stop-Loss.'
        : 'Linear assumption: Size = Risk Amount / Stop-Loss Distance.';
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[var(--surface-elevated)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden my-4">
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
              {isFr ? 'Calculateur de Risque & Taille de Position' : 'Risk & Position Size Calculator'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">
                {isFr ? 'Capital du Compte' : 'Account Capital'}
              </label>
              <input
                type="number"
                value={capital}
                onChange={e => setCapital(parseFloat(e.target.value) || 0)}
                className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs font-mono text-[var(--text-primary)]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">
                {isFr ? 'Risque (%)' : 'Risk (%)'}
              </label>
              <input
                type="number"
                step="0.1"
                value={riskPct}
                onChange={e => setRiskPct(parseFloat(e.target.value) || 0)}
                className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs font-mono text-[var(--text-primary)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">{isFr ? 'Entrée' : 'Entry'}</label>
              <input
                type="number"
                step="any"
                value={entryPrice}
                onChange={e => setEntryPrice(e.target.value)}
                className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-2.5 py-2 text-xs font-mono text-[var(--text-primary)]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">Stop Loss</label>
              <input
                type="number"
                step="any"
                value={stopLoss}
                onChange={e => setStopLoss(e.target.value)}
                className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-2.5 py-2 text-xs font-mono text-[var(--text-primary)]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">Take Profit</label>
              <input
                type="number"
                step="any"
                value={takeProfit}
                onChange={e => setTakeProfit(e.target.value)}
                className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-2.5 py-2 text-xs font-mono text-[var(--text-primary)]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase block mb-1">
              {isFr ? 'Type d instrument' : 'Instrument Type'}
            </label>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {(['forex', 'gold', 'crypto', 'indices'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAssetType(type)}
                  className={`py-1.5 rounded-lg border font-mono capitalize text-[11px] transition-all ${
                    assetType === type
                      ? 'bg-[var(--accent)] text-[#04110f] border-transparent font-bold'
                      : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">{isFr ? 'Montant risqué :' : 'Risk Amount :'}</span>
              <strong className="text-[var(--danger)]">
                {settings.currency}{riskAmount.toFixed(2)} ({riskPct}%)
              </strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">{isFr ? 'Ratio Risque / Récompense :' : 'Risk:Reward Ratio :'}</span>
              <strong className="text-[var(--accent)]">1 : {rr}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">{isFr ? 'Gain théorique au TP :' : 'Theoretical Profit at TP :'}</span>
              <strong className="text-[var(--success)]">+{settings.currency}{rewardAmount}</strong>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-sm">
              <span className="font-bold text-[var(--text-primary)]">{isFr ? 'Taille recommandée :' : 'Suggested Size :'}</span>
              <strong className="text-[var(--accent)] text-base font-bold">{estimatedSize}</strong>
            </div>
          </div>

          {/* Explicit assumption note */}
          <div className="p-3 rounded-xl bg-white/5 border border-[var(--border)] text-[11px] text-[var(--text-secondary)] flex items-start gap-2">
            <Info className="w-4 h-4 text-[var(--accent)] flex-shrink-0 mt-0.5" />
            <p>{assumptionNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
