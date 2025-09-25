import { signal, computed } from '@preact/signals-react';

// Unified state for dashboard metrics
// Shape: { data: array, loading: boolean, error: string|null, iteration: number, intervalId: number|null }
const initialState = {
  data: [],
  loading: true,
  error: null,
  iteration: 0,
  intervalId: null,
};
export const dashboardState = signal({ ...initialState });

// Derived selectors
export const metrics = computed(() => dashboardState.value.data);
export const loading = computed(() => dashboardState.value.loading);
export const error = computed(() => dashboardState.value.error);
export const iteration = computed(() => dashboardState.value.iteration);

async function fetchMetrics(cid, n) {
  try {
    const res = await fetch(`/api/campaigns/${cid}?number=${n}`);
    if (!res.ok) throw new Error('Failed to fetch metrics');
    const data = await res.json();
    const prev = dashboardState.value;
    dashboardState.value = {
      ...prev,
      data: [...prev.data, data],
      iteration: n,
      error: null,
    };
  } catch {
    dashboardState.value = {
      ...dashboardState.value,
      error: 'Failed to fetch metrics',
    };
  } finally {
    // Loading is controlled by the orchestration; don't force false here
  }
}

export function startPolling(
  cid,
  { poll = true, minSkeletonMs = 200, pollingIntervalMs = 5000 } = {}
) {
  // Reset state, preserve loading true to show skeleton immediately
  stopPolling();
  dashboardState.value = { ...initialState, loading: true };

  const startTs = Date.now();
  const settleLoading = () => {
    const elapsed = Date.now() - startTs;
    const delay = Math.max(0, minSkeletonMs - elapsed);
    setTimeout(() => {
      dashboardState.value = { ...dashboardState.value, loading: false };
    }, delay);
  };

  // First fetch (n = 0)
  fetchMetrics(cid, 0)
    .catch(() => void 0)
    .finally(() => settleLoading());

  if (poll) {
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      fetchMetrics(cid, n).catch(() => void 0);
    }, pollingIntervalMs);
    dashboardState.value = {
      ...dashboardState.value,
      intervalId: id,
    };
  }
}

export function stopPolling() {
  const { intervalId } = dashboardState.value;
  if (intervalId) {
    clearInterval(intervalId);
  }
  dashboardState.value = { ...dashboardState.value, intervalId: null };
}
