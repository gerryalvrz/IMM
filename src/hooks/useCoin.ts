import client from '@/data/utils';
import { API_ENDPOINTS } from '@/data/utils/endpoints';
import { CoinPaginator, CoinPrice, CryptoQueryOptions } from '@/types';
import {
  useQuery,
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';

export function useCoins(
  options?: Partial<CryptoQueryOptions>,
  config?: UseInfiniteQueryOptions<CoinPaginator, Error>,
) {
  const {
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    ...result
  } = useInfiniteQuery({
    queryKey: [API_ENDPOINTS.PRICING, options],
    queryFn: ({ pageParam }) =>
      client.coins.all({ ...options, page: pageParam }),
    initialPageParam: 1,
    ...options,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) =>
      null,
    getPreviousPageParam: (
      firstPage,
      allPages,
      firstPageParam,
      allPageParams,
    ) => null,
  });

  return {
    coins: result,
    paginatorInfo: Array.isArray(result.data?.pages)
      ? result.data?.pages[result.data.pages.length - 1]
      : null,
    isLoading: result.isLoading,
    error: result.error,
    hasNextPage,
    isFetching: result.isFetching,
    isLoadingMore: isFetchingNextPage,
    loadMore: fetchNextPage(),
  };
}

export function useCoin(id: string) {
  const { data, isLoading, error } = useQuery<CoinPrice, Error>({
    queryKey: [API_ENDPOINTS.PRICING, { id }],
    queryFn: () => client.coins.get({ id }),
  });

  return {
    coin: data,
    isLoading,
    error,
  };
}

export function useMarketChart(id: string) {
  const { data, isLoading, error } = useQuery<CoinPrice, Error>({
    queryKey: [API_ENDPOINTS.PRICING, { id }],
    queryFn: () => client.marketChart.get({ id }),
  });

  return {
    chart: data,
    isLoading,
    error,
  };
}
