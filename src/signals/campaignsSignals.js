import { signal, computed } from '@preact/signals-react';

// Unified campaigns state
// Shape: { data: array, loading: boolean, error: string | null }
export const campaignsState = signal({ data: [], loading: false, error: null });

// Derived selectors
export const campaigns = computed(() => campaignsState.value.data);
export const loading = computed(() => campaignsState.value.loading);
export const error = computed(() => campaignsState.value.error);

export const fetchCampaigns = async () => {
  try {
    campaignsState.value = {
      ...campaignsState.value,
      loading: true,
      error: null,
    };

    // Optional small dev delay to simulate network
    if (import.meta.env.DEV) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    const res = await fetch('/api/campaigns');
    if (!res.ok) throw new Error('Failed to fetch campaigns');
    const data = await res.json();
    campaignsState.value = { data, loading: true, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Unknown error occurred';
    campaignsState.value = { data: [], loading: true, error: message };
  } finally {
    campaignsState.value = { ...campaignsState.value, loading: false };
  }
};
