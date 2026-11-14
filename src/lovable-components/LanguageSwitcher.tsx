import { useI18n } from "@/i18n/I18nProvider";
import { locales } from "@/i18n/translations";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();
  return (
    <div role="group" aria-label={t.meta.switchTo} className={cn("flex items-center text-[0.72rem] tracking-[0.2em]", className)}>
      {locales.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span className="px-2 text-muted-foreground/50">|</span>}
          <button
            type="button"
            onClick={() => setLocale(l)}
            aria-pressed={locale === l}
            className={cn(
              "min-h-8 px-1 uppercase transition-colors",
              locale === l ? "text-gold" : "text-muted-foreground hover:text-ivory",
            )}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
