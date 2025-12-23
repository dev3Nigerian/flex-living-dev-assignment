import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSelection, updateSelection } from '../lib/api';

export const useSelections = () => {
  const queryClient = useQueryClient();

  const selectionQuery = useQuery({
    queryKey: ['selected-reviews'],
    queryFn: fetchSelection,
  });

  const mutation = useMutation({
    mutationFn: updateSelection,
    onSuccess: (data) => {
      queryClient.setQueryData(['selected-reviews'], data);
    },
  });

  const toggleSelection = (reviewId: number) => {
    const next = new Set(selectionQuery.data?.selectedIds ?? []);
    if (next.has(reviewId)) {
      next.delete(reviewId);
    } else {
      next.add(reviewId);
    }
    mutation.mutate(Array.from(next));
  };

  return {
    selection: selectionQuery.data,
    isLoading: selectionQuery.isLoading,
    isUpdating: mutation.isPending,
    toggleSelection,
  };
};

