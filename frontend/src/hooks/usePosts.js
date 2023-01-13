import { axiosInstance as api } from '../apis/index';
import { useQuery } from 'react-query';

const fetchPosts = async () => {
    try {
        const res = await api.get('/posts');
        return res.data;
    } catch (e) {
        console.log(e);
    }
    return null;
}

function usePosts() {
    const { data: posts, ...queryParams } = useQuery(["posts"], fetchPosts, {
        onSuccess: console.log,
        onError: console.log
    });

    return { posts, queryParams };
};

export default usePosts;
