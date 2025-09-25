import PropTypes from 'prop-types';

MetricTile.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bgColor: PropTypes.string,
  labelColor: PropTypes.string,
  'aria-label': PropTypes.string,
};

function MetricTile({ label, value, bgColor, labelColor, ...props }) {
  return (
    <div
      className='tile'
      data-testid='tile'
      style={{ background: bgColor }}
      aria-label={props['aria-label'] || `${label}: ${value}`}
      role='group'
    >
      <div
        className='tile-label'
        style={{ color: labelColor }}
        data-testid={`tile-label-${label.replace(/ /g, '-').toLowerCase()}`}
      >
        {label}
      </div>
      <div className='tile-value'>{value}</div>
    </div>
  );
}

export default MetricTile;
