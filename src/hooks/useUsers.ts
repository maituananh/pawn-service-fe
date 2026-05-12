import usersApi from "@/api/usersApi";
import { UserProfile } from "@/type/user.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

const USERS_QUERY_KEY = ["users"];

export const useUsers = () => {
    const queryClient = useQueryClient();
    const { data, isFetching, isError, error, refetch } = useQuery<UserProfile[]>({
        queryKey: USERS_QUERY_KEY,
        queryFn: usersApi.getAll,
        retry: 1
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => usersApi.delete(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: USERS_QUERY_KEY
            });

            message.success("Xoá khách hàng thành công!");
        },

        onError: (err: any) => {
            message.error("Xoá thất bại: " + (err.response?.data?.message || err.message));
        }
    });

    return {
        users: data ?? [],
        isLoading: isFetching,
        isError,
        error,
        refetch,
        deleteUser: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending
    };
};
