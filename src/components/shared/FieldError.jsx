import PropTypes from "prop-types";

export function FieldError({ id, children }) {
  if (!children) return null;

  return (
    <p id={id} role="alert" className="text-copy-13 text-destructive">
      {children}
    </p>
  );
}

FieldError.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
};
