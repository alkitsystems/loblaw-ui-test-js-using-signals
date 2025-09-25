import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSignals } from '@preact/signals-react/runtime';
import { useParams } from 'react-router-dom';
import DashboardSkeleton from './DashboardSkeleton';
import MetricTile from './MetricTile';
import { campaignColors } from '../utils/campaignColors';
import {
  metrics,
  loading,
  error,
  iteration,
  startPolling,
  stopPolling,
} from '../signals/dashboardSignals';

Dashboard.propTypes = {
  disablePolling: PropTypes.bool,
  pollingIntervalMs: PropTypes.number,
};

function Dashboard({ disablePolling = false, pollingIntervalMs }) {
  useSignals();
  const { cid, cname } = useParams();

  useEffect(() => {
    startPolling(cid, { poll: !disablePolling, pollingIntervalMs });
    return () => stopPolling();
  }, [cid, disablePolling, pollingIntervalMs]);

  if (loading.value) return <DashboardSkeleton />;
  if (error.value) return <div className='error'>{error.value}</div>;

  const totalImpressions = metrics.value.reduce(
    (sum, m) => sum + (m.impressions || 0),
    0
  );
  const totalClicks = metrics.value.reduce(
    (sum, m) => sum + (m.clicks || 0),
    0
  );
  const totalUsers = metrics.value.reduce((sum, m) => sum + (m.users || 0), 0);
  const totalCTR = totalImpressions
    ? ((totalClicks / totalImpressions) * 100).toFixed(2)
    : '0.00';
  const recent = metrics.value[metrics.value.length - 1] || {};

  const tiles = [
    { label: 'Total Impressions', value: totalImpressions },
    { label: 'Total Clicks', value: totalClicks },
    { label: 'Total CTR (%)', value: totalCTR },
    { label: 'Total Users', value: totalUsers },
    { label: 'Current Number', value: iteration.value },
    { label: 'Most Recent Impressions', value: recent.impressions ?? '-' },
    { label: 'Most Recent Clicks', value: recent.clicks ?? '-' },
    {
      label: 'Most Recent CTR (%)',
      value: recent.impressions
        ? ((recent.clicks / recent.impressions) * 100).toFixed(2)
        : '-',
    },
    { label: 'Most Recent Users', value: recent.users ?? '-' },
  ];

  // Get colors for current campaign
  const colors = campaignColors[cname] || campaignColors.Default;

  return (
    <main aria-labelledby='dashboard-title' className='container'>
      <h2 id='dashboard-title'>Dashboard for {cname} Campaign</h2>
      <div className='tiles' role='region' aria-label='Campaign metrics'>
        {tiles.map((tile, idx) => (
          <MetricTile
            key={idx}
            label={tile.label}
            value={tile.value}
            bgColor={colors.bg}
            labelColor={colors.label}
            aria-label={`${tile.label}: ${tile.value}`}
          />
        ))}
      </div>
    </main>
  );
}

export default Dashboard;
