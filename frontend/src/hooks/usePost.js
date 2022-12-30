import { axiosInstance as api } from '../apis/index';
import { useQuery } from 'react-query';

const fetchPost = async (postId) => {
    const res = await api.get(`/posts/${postId}`);
    return res.data;
}

const usePost = (postId) => {
    const { data: post, ...queryParams } = useQuery(["posts", postId], () => fetchPost(postId), {
        onSuccess: console.log,
        onError: console.log
    });

    return { post, queryParams };
};

export default usePost;