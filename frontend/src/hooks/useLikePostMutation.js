import useAxiosPrivate from "./useAxiosPrivate";
import { useQueryClient, useMutation } from 'react-query';

const useLikePostMutation = (postId) => {
    const api = useAxiosPrivate();
    const queryClient = useQueryClient();

    return useMutation(async () => {
        const res = await api.patch(`/posts/${postId}/likes`);
        return res;
    }, {
        onSuccess: res => {
            queryClient.invalidateQueries(["posts", postId]);
        },
        onError: console.log
    });
}

export default useLikePostMutation;