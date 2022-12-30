import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true
});

export const fetchPosts = async () => {
    try {
        const res = await api.get('/posts');
        return res;
    } catch (e) {
        console.log(e);
    }
    return null;
}

export const fetchPost = async (postId) => {
    try {
        const res =  await api.get(`/posts/${postId}`);
        return res;
    } catch (e) {
        console.log(e);
        throw new Error("Internal Server Error");
    }
}

export const createPost = async (formData) => {
    try {
        await api.post('/posts', { post: formData });
        return true;
    } catch (e) {
        console.log(e);
        throw new Error("Internal Server Error");
    }
}

export const updatePost = async ({ id, formData }) => {
    try {
        await api.patch(`/posts/${id}`, { post: formData });
        return true;
    } catch (e) {
        console.log(e);
        throw new Error("Internal Server Error");
    }
}

export const deletePost = async (postId) => {
    try {
        await api.delete(`/posts/${postId}`);
        return true;
    } catch (e) {
        console.log(e);
        throw new Error("Internal Server Error");
    }
}