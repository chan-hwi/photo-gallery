import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import postsRouter from './routers/postsRouter.js';
import authRouter from './routers/authRouter.js';
import { AuthMiddleware } from './middlewares/auth.js';

dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: '500mb' })); 
app.use(express.urlencoded( { limit: '500mb', extended : true } ));
app.use(AuthMiddleware);
app.use('/posts', postsRouter);
app.use('/auth', authRouter);

mongoose.connect(`mongodb+srv://${process.env.MONGOOSE_USERNAME}:${process.env.MONGOOSE_PASSWORD}@webstoragecluster.wodwouq.mongodb.net/?retryWrites=true&w=majority`)
    .then(res => console.log("DB connected successfully"))
    .catch(console.log);

app.listen(process.env.PORT, async () => {
    console.log(`Server running on port ${process.env.PORT}.`);
});

app.get('/', (req, res) => {
    res.send('Welcome!');
});