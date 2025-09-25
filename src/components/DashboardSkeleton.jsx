import Skeleton from '@mui/material/Skeleton';

function DashboardSkeleton() {
  return (
    <div
      className='container'
      aria-busy='true'
      data-testid='dashboard-skeleton'
    >
      <h2 className='skeleton-title'>
        <Skeleton width={300} height={32} />
      </h2>
      <div className='tiles'>
        {[...Array(9)].map((_, i) => (
          <Skeleton
            key={i}
            variant='rectangular'
            width='100%'
            height={100}
            style={{ borderRadius: '6px', margin: '0.5em 0' }}
          />
        ))}
      </div>
    </div>
  );
}

export default DashboardSkeleton;
