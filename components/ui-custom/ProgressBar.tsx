import { cn } from "@/lib/utils";
import { getScoreTone, scoreToneStyles } from "@/lib/scoring";

type ProgressBarProps = {
  value: number;
  size?: "sm" | "md";
  className?: string;
};

export function ProgressBar({
  value,
  size = "sm",
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const tone = getScoreTone(clamped);

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-full bg-gray-100",
        size === "sm" ? "h-[5px]" : "h-2",
        className
      )}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-300",
          scoreToneStyles[tone].bar
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
