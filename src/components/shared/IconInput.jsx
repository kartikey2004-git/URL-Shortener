import { forwardRef } from "react";
import PropTypes from "prop-types";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";


export const IconInput = forwardRef(function IconInput(
  { icon: Icon, className, ...props },
  ref
) {
  return (
    <div className="relative">
      <Icon
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input ref={ref} className={cn("pl-9", className)} {...props} />
    </div>
  );
});

IconInput.propTypes = {
  icon: PropTypes.elementType.isRequired,
  className: PropTypes.string,
};
