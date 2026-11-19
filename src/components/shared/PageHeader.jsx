import PropTypes from "prop-types";

export function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div className="min-w-0 space-y-1.5">
        <h1 className="heading-page break-words">{title}</h1>
        {description}
      </div>
      {actions}
    </div>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.node,
  actions: PropTypes.node,
};
