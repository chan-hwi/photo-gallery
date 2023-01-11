import useAxiosPrivate from "./useAxiosPrivate";
import { useQueryClient, useMutation } from 'react-query';

const useFavoritePostMutation = (postId) => {
    const api = useAxiosPrivate();
    const queryClient = useQueryClient();

    return useMutation(async () => {
        const res = await api.patch(`/posts/${postId}/favorites`);
        return res;
    }, {
        onSuccess: res => {
            queryClient.invalidateQueries(["infinitePosts"]);
        },
        onError: console.log
    });
}

export default useFavoritePostMutation;