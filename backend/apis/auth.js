import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const getProfile = (userDoc) => {
    const profile = {
        id: userDoc._id,
        username: userDoc.username,
        nickname: userDoc.nickname,
        email: userDoc.email,
        profilesrc: userDoc.profilesrc,
        registeredAt: userDoc.registeredAt
    };

    return profile;
}

export const login = async (req, res) => {
    const { username, password } = req.body;

    console.log('here');
    if (req.user) return res.status(403).send({ success: false, message: "User already logged in" });
    try {
        const currentUser = await User.findOne({ username });
        if (!currentUser) return res.status(403).json({ success: false, message: "User doesn't exist" });
        
        const result = await bcrypt.compare(password, currentUser.password);
        if (!result) return res.status(403).json({ success: false, message: "Password incorrect" });

        const tokenPayload = { userId: currentUser._id };
        const access_token = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
        const refresh_token = jwt.sign(tokenPayload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '10m' });

        res.cookie('refresh_token', refresh_token, { maxAge: 10 * 60 * 1000, httpOnly: true, secure: false });

        currentUser.refreshTokens.push(refresh_token);
        await currentUser.save();

        console.log('refresh access_token', access_token);
        console.log('refresh refresh_token', refresh_token);

        return res.status(200).json({ token: access_token, profile: getProfile(currentUser) });
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
}

export const register = async (req, res) => {
    const { user } = req.body;
    
    if (req.user) return res.status(403).send({ success: false, message: "User already logged in" });
    try {
        console.log(user);
        const existingUser = await User.findOne({ username: user.username });
        if (existingUser) return res.status(403).send({ success: false, message: "User already exists" });

        const encryptedPassword = await bcrypt.hash(user.password, parseInt(process.env.SALT_ROUNDS));
        user.password = encryptedPassword;
        const userDoc = new User(user);

        const tokenPayload = { userId: userDoc._id };
        const access_token = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
        const refresh_token = jwt.sign(tokenPayload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '10m' });

        res.cookie('refresh_token', refresh_token, { maxAge: 10 * 60 * 1000, httpOnly: true, secure: false });
        
        userDoc.refreshTokens.push(refresh_token);
        await userDoc.save();

        return res.status(200).json({ token: access_token, profile: getProfile(userDoc) });
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
}

export const refresh = async (req, res) => {
    const { refresh_token } = req.cookies;

    if (req?.user) return res.status(403).json({ success: false, message: "Already Logged in" });

    try {
        if (!refresh_token) return res.status(403).json({ success: false, message: "token expired" });

        const { userId } = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
        const currentUser = await User.findById(userId);
        
        let updatedRefreshTokens = [];
        currentUser.refreshTokens.forEach(token => {
            try {
                jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
                updatedRefreshTokens.push(token);
            } catch (e) {}
        });

        if (!updatedRefreshTokens.find(token => token === refresh_token))
            return res.status(403).json({ success: false, message: "invalid token" });

        updatedRefreshTokens = updatedRefreshTokens.filter(token => token !== refresh_token);

        const tokenPayload = { userId };
        const new_access_token = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
        const new_refresh_token = jwt.sign(tokenPayload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '10m' });

        res.cookie('refresh_token', new_refresh_token, { maxAge: 10 * 60 * 1000, httpOnly: true, secure: false });

        updatedRefreshTokens.push(new_refresh_token);
        currentUser.refreshTokens = updatedRefreshTokens;

        await currentUser.save();

        return res.status(200).json({ token: new_access_token });
    } catch (err) {
        console.log(err);
        if (err?.name === 'TokenExpiredError') res.status(403).json({ success: false, message: "token expired" });
        else if (err?.name === 'JsonWebTokenError') res.status(403).json({ success: false, message: err?.message });
        else res.status(500).send("Internal Server Error");
    }
}

export const getUserInfo = async (req, res) => {
    if (!req.user) return res.status(401).send({ success: false, message: 'Login Required' });
    try {
        const currentUser = await User.findById(req.user.userId);
        res.status(200).json({ token: req?.headers['authorization'].split(' ')[1], profile: getProfile(currentUser) });
    } catch (err) {
        console.log(err);
        if (err?.name === 'TokenExpiredError') res.status(401).json({ success: false, message: "token expired" });
        else if (err?.name === 'JsonWebTokenError') res.status(403).json({ success: false, message: err?.message });
        else res.status(500).send("Internal Server Error");
    }
}

export const logout = async (req, res) => {
    if (!req.user) return res.status(401).send({ success: false, message: 'Not logged in' });

    try {
        const { refresh_token } = req.cookies;

        const currentUser = await User.findById(req.user.userId);

        const updatedRefreshTokens = [];
        currentUser.refreshTokens.forEach(refreshToken => {
            try {
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                if (refreshToken !== refresh_token) updatedRefreshTokens.push(refreshToken);
            } catch(e) {}
        });

        res.clearCookie('refresh_token');
        currentUser.refreshTokens = updatedRefreshTokens;
        await currentUser.save();

        res.json({ success: true });
    } catch(err) {
        console.log(err);
        if (err?.name === 'TokenExpiredError') res.status(401).json({ success: false, message: "token expired" });
        else if (err?.name === 'JsonWebTokenError') res.status(403).json({ success: false, message: err?.message });
        else res.status(500).send("Internal Server Error");
    }
}