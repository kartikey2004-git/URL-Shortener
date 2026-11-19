import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Inline loading indicator; inherits the current text color. */
export function Spinner({ className, ...props }) {
  return (
    <Loader2
      aria-hidden="true"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}
