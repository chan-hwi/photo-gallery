import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useQuery } from 'react-query';

function useFavoritePosts() {
    const api = useAxiosPrivate();
    const { data: posts, ...queryParams } = useQuery(["posts", "favorites"], async () => {
        const res = await api.get('/posts/favorites');
        return res.data;
    });

    return { posts, queryParams };
};

export default useFavoritePosts;
