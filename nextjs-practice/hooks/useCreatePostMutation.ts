'use client';

import { useQueryClient, useMutation } from 'react-query';
import useAxiosPrivate from './useAxiosPrivate';
import type { PostType } from '@/types/models';

const useCreatePostMutation = () => {
    const api = useAxiosPrivate();
    const queryClient = useQueryClient();

    const createPost = async (formData : Partial<PostType>) => {
        const res = await api.post('/posts', { post: formData });
        return res.data;
    };

    return useMutation(createPost, {
        onSuccess: res => {
            queryClient.invalidateQueries(["infinitePosts"]);
        }
    });
    
};

export default useCreatePostMutation;