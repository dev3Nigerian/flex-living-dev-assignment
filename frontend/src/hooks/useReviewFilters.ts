import { useState } from 'react';
import type { ReviewFilters } from '../lib/types';

const defaultFilters: ReviewFilters = {
  channel: 'all',
  minRating: 0,
  maxRating: 5,
  dateRange: {},
  search: '',
};

export const useReviewFilters = () => {
  const [filters, setFilters] = useState<ReviewFilters>(defaultFilters);

  const updateFilter = <K extends keyof ReviewFilters>(key: K, value: ReviewFilters[K]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({ ...defaultFilters });
  };

  return {
    filters,
    updateFilter,
    resetFilters,
  };
};

