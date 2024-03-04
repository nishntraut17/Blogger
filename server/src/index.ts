import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user';
import blogRoutes from './routes/blog';
import dotenv from 'dotenv';
import client from './db/conn';
import { redisClient } from './db/redis';

const app = express();
dotenv.config();
client;

app.use(cors());
app.use(express.json());
app.use('/user', userRoutes);
app.use('/blog', blogRoutes);


app.listen(process.env.PORT, () => {
    console.log('Server running on port ', process.env.PORT);
});