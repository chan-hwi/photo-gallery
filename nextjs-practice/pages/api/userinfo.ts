import { isAxiosError } from "axios";
import { privateAxiosInstance as api } from "@/apis";
import { NextApiRequest, NextApiResponse } from "next";

const userinfo = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('cookie', req.cookies);

    try {
        console.log('hereere', req.headers);
        const serverRes = await api.get('/auth/userinfo', { headers: req.headers });
        res.status(200).json(serverRes.data);
    } catch (err: any) {
        // console.log('err', err);
        if (isAxiosError(err) && err.response) res.status(err.response.status).send(err);
        else res.send(err);
    }
};

export default userinfo;