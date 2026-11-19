import PropTypes from "prop-types";

export function FieldError({ id, children }) {
  if (!children) return null;

  return (
    <p id={id} role="alert" className="text-2xs font-bold uppercase tracking-tight text-destructive">
      {children}
    </p>
  );
}

FieldError.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
};
