import { useContext, createContext, useReducer } from "react";
import { UserContext } from './UserProvider';
import usePosts from '../hooks/usePosts';

export const actions = {
    'SET_POSTS': 0, 
    'SET_POST': 1
};

function reducer (state, action) {
    switch (action.type) {
        case actions.SET_POSTS:
            return { ...state, posts: action.payload };
        case actions.SET_POST:
            return { ...state, post: action.payload };
        default:
            return state;
    }
};

export const PostContext = createContext();

function PostProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, { post: null, posts: [] });
    const { api } = useContext(UserContext);
    const { fetchPosts, fetchPost, createPost, updatePost, deletePost } = usePosts({ api });

    return (
        <PostContext.Provider value={{
            state,
            dispatch,
            fetchPosts,
            fetchPost,
            createPost,
            updatePost,
            deletePost
        }}>
            {children}
        </PostContext.Provider>
    )
}

export default PostProvider;