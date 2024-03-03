"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const blog_1 = __importDefault(require("./routes/blog"));
const dotenv_1 = __importDefault(require("dotenv"));
const conn_1 = __importDefault(require("./db/conn"));
const app = (0, express_1.default)();
dotenv_1.default.config();
conn_1.default;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/user', user_1.default);
app.use('/blog', blog_1.default);
app.listen(process.env.PORT, () => {
    console.log('Server running on port ', process.env.PORT);
});