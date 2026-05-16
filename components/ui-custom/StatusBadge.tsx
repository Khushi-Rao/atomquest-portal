import { cn } from "@/lib/utils";

export type Status =
  | "approved"
  | "submitted"
  | "draft"
  | "returned"
  | "on_track"
  | "completed"
  | "not_started"
  | "shared";

const statusStyles: Record<Status, string> = {
  approved: "bg-success-light text-success-text",
  submitted: "bg-warning-light text-warning-text",
  draft: "bg-gray-100 text-gray-500",
  returned: "bg-danger-light text-danger-text",
  on_track: "bg-success-light text-success-text",
  completed: "bg-success-light text-success-text",
  not_started: "bg-gray-100 text-gray-400",
  shared: "bg-primary-light text-primary-text",
};

const statusLabels: Record<Status, string> = {
  approved: "Approved",
  submitted: "Submitted",
  draft: "Draft",
  returned: "Returned",
  on_track: "On track",
  completed: "Completed",
  not_started: "Not started",
  shared: "Shared",
};

type StatusBadgeProps = {
  status: Status;
  className?: string;
  label?: string;
};

export function StatusBadge({ status, className, label }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium",
        statusStyles[status],
        className
      )}
    >
      {label ?? statusLabels[status]}
    </span>
  );
}
