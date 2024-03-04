"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidator = void 0;
const zod_1 = require("zod");
exports.authValidator = zod_1.z.object({
    name: zod_1.z.string({ required_error: 'Name is required' }).trim().min(3, { message: 'Name must be at least 3 characters long' }).max(255, { message: 'Name must be at most 255 characters long' }),
    email: zod_1.z.string().email({ message: 'Invalid email' }).max(255, { message: 'Email must be at most 255 characters long' }),
    password: zod_1.z.string({ required_error: 'Password is required' }).min(8, { message: 'Password must be at least 8 characters long' }).max(255, { message: 'Password must be at most 255 characters long' }),
});
