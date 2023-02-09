import jwt from 'jsonwebtoken';

export const AuthMiddleware = (req, res, next) => {
    if (req?.headers['authorization']) {
        const token = req.headers['authorization'].split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
            if (err) return next();
            req.user = user;
            next();
        });
    } else next();
}