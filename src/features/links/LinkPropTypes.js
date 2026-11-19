import PropTypes from "prop-types";

/** Shape of a row from the `urls` table. */
export const linkShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  title: PropTypes.string,
  original_url: PropTypes.string.isRequired,
  short_url: PropTypes.string.isRequired,
  custom_url: PropTypes.string,
  qr: PropTypes.string,
  created_at: PropTypes.string,
});
