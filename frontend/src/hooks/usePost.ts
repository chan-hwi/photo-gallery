import { axiosInstance as api } from '../apis/index';
import { useQuery } from 'react-query';
import type { PostType } from '../types/models';

const fetchPost = async (postId : string) => {
    const res = await api.get(`/posts/${postId}`);
    return res.data;
}

const usePost = (postId : string = '') => {
    const { data: post, ...queryParams } = useQuery<PostType>(["posts", postId], () => fetchPost(postId), {
        onSuccess: console.log,
        onError: console.log
    });

    return { post, queryParams };
};

export default usePost;