import { privateAxiosInstance as api } from '@/apis';
import { NextApiRequest, NextApiResponse } from 'next';

const refresh = async (req : NextApiRequest, res : NextApiResponse) => {
    try {
        console.log('refresh', req.cookies);
        const serverRes = await api.get('http://localhost:5000/auth/refresh', { headers: req.headers, withCredentials: true });

        console.log('refresh', serverRes.headers);
        Object.entries(serverRes.headers).forEach(([key, value]) => res.setHeader(key, value));

        res.status(200).json(serverRes.data);
    } catch (err : any) {
        console.log(err);
        res.json(err);
    }
};

export default refresh;
