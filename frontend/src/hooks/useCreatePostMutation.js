import { useCallback } from 'react';
import { useQueryClient, useMutation } from 'react-query';
import useAxiosPrivate from './useAxiosPrivate';

const useCreatePostMutation = () => {
    const api = useAxiosPrivate();
    const queryClient = useQueryClient();

    const createPost = useCallback(async (formData) => {
        try {
            await api.post('/posts', { post: formData });
            return true;
        } catch (e) {
            console.log(e);
            throw new Error("Internal Server Error");
        }
    }, [api]);

    return useMutation(createPost, {
        onSuccess: res => {
            console.log(res);
            queryClient.invalidateQueries(["infinitePosts"]);
        }
    });
    
};

export default useCreatePostMutation;