import { useQueryClient, useMutation } from 'react-query';
import useAxiosPrivate from './useAxiosPrivate';

const useUpdatePostMutation = () => {
    const api = useAxiosPrivate();
    const queryClient = useQueryClient();

    const updatePost = async ({ id, formData }) => {
        const res = await api.patch(`/posts/${id}`, { post: formData });
        return res.data;
    };

    return useMutation(updatePost, {
        onSuccess: res => {
            queryClient.invalidateQueries(["infinitePosts"]);
        }
    });
    
};

export default useUpdatePostMutation;