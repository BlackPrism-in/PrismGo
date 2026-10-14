import { useQuery } from '@tanstack/react-query';
import { getHealth } from '../lib/api';

export function ApiStatus() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
    refetchInterval: 15_000,
  });

  const label = isLoading
    ? 'Checking API…'
    : isError || !data
      ? 'API unreachable'
      : data.status === 'ok'
        ? 'API online'
        : `API degraded (db ${data.db}, redis ${data.redis})`;
  const ok = data?.status === 'ok';

  return (
    <span
      role="status"
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
        ok ? 'bg-mint-100 text-mint-700' : 'bg-amber-50 text-amber-700'
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${ok ? 'bg-mint-1000' : 'bg-amber-500'}`} />
      {label}
    </span>
  );
}
