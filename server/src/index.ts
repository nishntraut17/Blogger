import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import userRoutes from './routes/user';
import blogRoutes from './routes/blog';
import dotenv from 'dotenv';
import client from './db/conn';
import errorMiddleware from './middleware/error-middleware';
dotenv.config();

const app = express();
const server = createServer(app);


const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
    }
});
client;

app.use(cors());
app.use(express.json());
app.use('/user', userRoutes);
app.use('/blog', blogRoutes);
app.use(errorMiddleware);

io.on("connection", (socket) => {
    console.log('User connected', socket.id);
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
    socket.on('message', (message) => {
        console.log('Message received', message);
        socket.broadcast.emit('message', message);
    });
    socket.emit(`'welcome', 'Welcome to the server, your id is ${socket.id}`);
})

server.listen(process.env.PORT, () => {
    console.log('Server running on port ', process.env.PORT);
});
