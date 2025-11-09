import usersApi from '@/api/usersApi';
import { UserProfile } from '@/type/user.type';
import { useQuery } from '@tanstack/react-query';

const USERS_QUERY_KEY = ['products'];

export const useUsers = () => {
  const { data, isFetching, isError, error, refetch } = useQuery<UserProfile[]>({
    queryKey: USERS_QUERY_KEY,
    queryFn: usersApi.getAll,
    retry: 1,
  });

  return {
    users: data ?? [],
    isLoading: isFetching,
    isError,
    error,
    refetch,
  };
};
