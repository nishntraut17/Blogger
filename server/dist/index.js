"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const blog_1 = __importDefault(require("./routes/blog"));
const dotenv_1 = __importDefault(require("dotenv"));
const conn_1 = __importDefault(require("./db/conn"));
const error_middleware_1 = __importDefault(require("./middleware/error-middleware"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
    }
});
conn_1.default;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/user', user_1.default);
app.use('/blog', blog_1.default);
app.use(error_middleware_1.default);
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
});
server.listen(process.env.PORT, () => {
    console.log('Server running on port ', process.env.PORT);
});
