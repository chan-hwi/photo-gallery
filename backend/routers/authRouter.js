import express from 'express';
import { login, register, refresh, getUserInfo, logout } from '../apis/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/refresh', refresh);
router.get('/userinfo', getUserInfo);
router.post('/logout', logout);

export default router;