import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 bg-destructive/10 text-destructive",
        success: "border-success/50 bg-success/10 text-success",
        warning: "border-warning/50 bg-warning/10 text-warning",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/** Inline, page-level message. Announced to assistive tech via `role="alert"`. */
const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

export { Alert };
