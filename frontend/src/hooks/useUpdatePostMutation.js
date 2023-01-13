import { useCallback } from 'react';
import { useQueryClient, useMutation } from 'react-query';
import useAxiosPrivate from './useAxiosPrivate';

const useUpdatePostMutation = () => {
    const api = useAxiosPrivate();
    const queryClient = useQueryClient();

    const updatePost = useCallback(async ({ id, formData }) => {
        try {
            await api.patch(`/posts/${id}`, { post: formData });
            return true;
        } catch (e) {
            console.log(e);
            throw new Error("Internal Server Error");
        }
    }, [api]);

    return useMutation(updatePost, {
        onSuccess: res => {
            console.log(res);
            queryClient.invalidateQueries(["infinitePosts"]);
        }
    });
    
};

export default useUpdatePostMutation;