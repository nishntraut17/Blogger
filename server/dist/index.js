"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const notification_1 = __importDefault(require("./models/notification"));
const notification_2 = __importDefault(require("./controllers/notification"));
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
app.get('/user/notifications', notification_2.default);
io.on("connection", (socket) => {
    console.log('User connected', socket.id);
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
    socket.on('name', (name) => {
        socket.broadcast.emit('name', name);
    });
    socket.on('notification', (name) => __awaiter(void 0, void 0, void 0, function* () {
        io.emit('notification', { message: `${name} has added new blog`, read: false });
        yield notification_1.default.create({ message: `${name} has added new blog` });
    }));
});
server.listen(process.env.PORT, () => {
    console.log('Server running on port ', process.env.PORT);
});
