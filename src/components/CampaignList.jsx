import { useEffect } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { useNavigate } from 'react-router-dom';
import { campaignColors } from '../utils/campaignColors';
import CampaignListSkeleton from './CampaignListSkeleton';
import {
  campaigns,
  loading,
  error,
  fetchCampaigns,
} from '../signals/campaignsSignals';

const CampaignList = () => {
  useSignals();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  if (loading.value) return <CampaignListSkeleton />;
  if (error.value) return <div className='error'>{error.value}</div>;

  return (
    <section aria-labelledby='campaigns-heading' className='container'>
      <h2 id='campaigns-heading'>Campaigns</h2>
      <ul className='campaign-list'>
        {campaigns.value.map((c) => {
          const colors = campaignColors[c.name] || campaignColors.Default;
          return (
            <li key={c.id} className='campaign-item'>
              <button
                style={{
                  background: colors.bg,
                  color: colors.label,
                  width: '200px',
                  height: '80px',
                  fontWeight: 'bold',
                  fontSize: '1em',
                  borderRadius: '4px',
                  border: 'none',
                  margin: '0.5em',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onClick={() => navigate(`/dashboard/${c.id}/${c.name}`)}
                aria-label={`View dashboard for ${c.name}`}
              >
                {c.id}: {c.name}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default CampaignList;
