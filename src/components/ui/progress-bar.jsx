import { cn } from "@/lib/utils";

/** Indeterminate progress bar that fills the width of its container. */
export function ProgressBar({ className }) {
  return (
    <div
      role="progressbar"
      aria-label="Loading"
      className={cn("h-0.5 w-full overflow-hidden bg-primary/20", className)}
    >
      <div className="h-full w-1/3 animate-progress-slide bg-primary" />
    </div>
  );
}
