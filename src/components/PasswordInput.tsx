import React, { useState, useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  lang?: 'fr' | 'en';
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  lang = 'fr',
  className = '',
  id,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const inputId = id || 'pw_' + Math.random().toString(36).slice(2, 8);
  const showLabel = lang === 'fr' ? 'Afficher le mot de passe' : 'Show password';
  const hideLabel = lang === 'fr' ? 'Masquer le mot de passe' : 'Hide password';

  const toggleVisibility = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    setShowPassword(prev => {
      const next = !prev;
      // Preserve cursor position and focus
      setTimeout(() => {
        if (inputRef.current) {
          const len = inputRef.current.value.length;
          inputRef.current.focus();
          inputRef.current.setSelectionRange(len, len);
        }
      }, 0);
      return next;
    });
  };

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        <input
          {...props}
          ref={inputRef}
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          className={`w-full bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl px-4 py-2.5 pr-11 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)] transition-colors ${className}`}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          aria-label={showPassword ? hideLabel : showLabel}
          aria-pressed={showPassword}
          title={showPassword ? hideLabel : showLabel}
          className="absolute right-2.5 p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4 stroke-[1.75]" aria-hidden="true" />
          ) : (
            <Eye className="w-4 h-4 stroke-[1.75]" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
};
