import { format, parseISO } from 'date-fns';

export const formatRating = (value: number | null, fallback = '—') => {
  if (value === null || Number.isNaN(value)) {
    return fallback;
  }
  return value.toFixed(1);
};

export const formatDate = (value: string | null, fallback = '—') => {
  if (!value) return fallback;
  try {
    return format(parseISO(value), 'dd MMM yyyy');
  } catch {
    return fallback;
  }
};

export const compactNumber = (value: number) => {
  return new Intl.NumberFormat('en', { notation: 'compact' }).format(value);
};

