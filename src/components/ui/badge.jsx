import { cn } from "@/lib/utils";
import { badgeVariants } from "./badge-variants";

function Badge({ className, variant, ...props }) {
  return (
    <span
      data-slot="badge"
      data-variant={variant ?? "default"}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge };
