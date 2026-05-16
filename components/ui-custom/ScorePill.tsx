import { cn } from "@/lib/utils";
import { getScoreTone, scoreToneStyles } from "@/lib/scoring";

type ScorePillProps = {
  score: number | null;
  className?: string;
};

export function ScorePill({ score, className }: ScorePillProps) {
  const tone = getScoreTone(score);
  const display = score === null ? "—" : `${Math.round(score)}%`;

  return (
    <span
      className={cn(
        "inline-block min-w-[42px] rounded-full px-2 py-0.5 text-center text-[11px] font-medium",
        scoreToneStyles[tone].pill,
        className
      )}
    >
      {display}
    </span>
  );
}
