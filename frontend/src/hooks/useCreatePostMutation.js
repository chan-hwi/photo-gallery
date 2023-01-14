import { useQueryClient, useMutation } from 'react-query';
import useAxiosPrivate from './useAxiosPrivate';

const useCreatePostMutation = () => {
    const api = useAxiosPrivate();
    const queryClient = useQueryClient();

    const createPost = async (formData) => {
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