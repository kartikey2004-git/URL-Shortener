import PropTypes from "prop-types";

import { Label } from "@/components/ui/label";
import { FieldError } from "./FieldError";
import { IconInput } from "./IconInput";


export function TextField({ id, label, icon, error, labelAction, ...inputProps }) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        {labelAction}
      </div>
      <IconInput
        id={id}
        icon={icon}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}

TextField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  error: PropTypes.string,
  labelAction: PropTypes.node,
};
