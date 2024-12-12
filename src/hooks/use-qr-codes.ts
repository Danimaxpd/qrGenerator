import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useQRCodes() {
  const { data, error, isLoading, mutate } = useSWR('/api/qr-list', fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 5000, // Optional: auto-refresh every 5 seconds
  });

  return {
    qrCodes: data?.qrCodes || [],
    isLoading,
    error,
    mutate,
  };
}
