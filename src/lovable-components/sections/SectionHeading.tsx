import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: Props) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="mt-4 text-3xl leading-[1.15] text-ivory sm:text-4xl md:text-5xl">{title}</h2>
      {description ? (
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </Reveal>
  );
}
