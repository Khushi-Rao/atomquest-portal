export type ScoreTone = "success" | "warning" | "danger" | "neutral";

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
