import { privateAxiosInstance as api } from '@/apis';
import { NextApiRequest, NextApiResponse } from 'next';

const login = async (req : NextApiRequest, res: NextApiResponse) => {
    try {
        const serverRes = await api.post('http://localhost:5000/auth/login', req.body, { headers: req.headers });
    
        api.defaults.headers.Authorization = `Bearer ${serverRes.data.token}`;
        console.log('login headers', serverRes.headers);
        Object.entries(serverRes.headers).forEach(([key, value]) => res.setHeader(key, value));
        console.log('login headers', res.getHeader('set-cookie'));

        res.status(200).json(serverRes.data);
    } catch (err : any) {
        res.status(err.response.status).json(err);
    }
};

export default login;