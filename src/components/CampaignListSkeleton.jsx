import Skeleton from '@mui/material/Skeleton';

function CampaignListSkeleton() {
  return (
    <div
      className='container'
      aria-busy='true'
      data-testid='campaign-list-skeleton'
    >
      <h2 className='skeleton-title'>
        <Skeleton width={200} height={32} />
      </h2>
      <ul className='campaign-list'>
        {[...Array(6)].map((_, i) => (
          <li key={i} className='campaign-item'>
            <Skeleton
              variant='rectangular'
              width={220}
              height={60}
              style={{ borderRadius: '6px' }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CampaignListSkeleton;
