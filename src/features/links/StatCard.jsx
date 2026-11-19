import PropTypes from "prop-types";

/** Dashboard summary tile: caption, icon and a single large number. */
export function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="surface flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <h3 className="eyebrow">{label}</h3>
        <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
      </div>
      <div className="text-heading-32">{value}</div>
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  icon: PropTypes.elementType.isRequired,
};
