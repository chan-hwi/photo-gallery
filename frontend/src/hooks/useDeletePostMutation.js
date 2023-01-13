import { useCallback } from 'react';
import { useQueryClient, useMutation } from 'react-query';
import useAxiosPrivate from './useAxiosPrivate';

const useDeletePostMutation = () => {
    const api = useAxiosPrivate();
    const queryClient = useQueryClient();

    const deletePost = useCallback(async (postId) => {
        try {
            await api.delete(`/posts/${postId}`);
            return true;
        } catch (e) {
            console.log(e);
            throw new Error("Internal Server Error");
        }
    }, [api]);

    return useMutation(deletePost, {
        onSuccess: res => {
            console.log(res);
            queryClient.invalidateQueries(["infinitePosts"]);
        }
    });
    
};

export default useDeletePostMutation;