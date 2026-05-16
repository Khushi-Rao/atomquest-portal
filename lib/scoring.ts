export type UomTypeName = "MIN" | "MAX" | "TIMELINE" | "ZERO";

export type ScoreTone = "success" | "warning" | "danger" | "neutral";

/** Achievement score (0–100) by unit of measure. */
export function calculateAchievementScore(
  uomType: UomTypeName,
  target: number,
  actual: number | null,
  options?: { deadline?: Date | null; completionDate?: Date | null }
): number | null {
  if (actual === null) return null;

  switch (uomType) {
    case "MIN":
      if (target <= 0) return actual >= target ? 100 : 0;
      return Math.min(100, Math.round((actual / target) * 100));
    case "MAX":
      if (actual <= 0) return 100;
      if (target <= 0) return actual <= target ? 100 : 0;
      return Math.min(100, Math.round((target / actual) * 100));
    case "ZERO":
      return actual === 0 ? 100 : 0;
    case "TIMELINE": {
      const { deadline, completionDate } = options ?? {};
      if (!deadline || !completionDate) return null;
      if (completionDate <= deadline) return 100;
      const daysLate = Math.ceil(
        (completionDate.getTime() - deadline.getTime()) / 86_400_000
      );
      return Math.max(0, 100 - daysLate * 5);
    }
    default:
      return null;
  }
}

export function getScoreTone(score: number | null): ScoreTone {
  if (score === null) return "neutral";
  if (score >= 80) return "success";
  if (score >= 50) return "warning";
  return "danger";
}

export const scoreToneStyles = {
  success: {
    pill: "bg-success-light text-success-text",
    bar: "bg-success",
  },
  warning: {
    pill: "bg-warning-light text-warning-text",
    bar: "bg-warning",
  },
  danger: {
    pill: "bg-danger-light text-danger-text",
    bar: "bg-danger",
  },
  neutral: {
    pill: "bg-gray-100 text-gray-400",
    bar: "bg-gray-300",
  },
} as const;
