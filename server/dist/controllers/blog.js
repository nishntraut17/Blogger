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
exports.getBlog = exports.getBlogs = exports.createBlog = void 0;
const blog_1 = __importDefault(require("../models/blog"));
const redis_1 = require("../db/redis");
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const rateLimit = yield redis_1.redisClient.get(`RATE_LIMIT:${(_a = req.user) === null || _a === void 0 ? void 0 : _a._id}`);
        if (rateLimit && parseInt(rateLimit) >= 5) {
            return res.status(429).json('Too many requests');
        }
        yield redis_1.redisClient.del('blogs');
        const newBlog = new blog_1.default({
            title: req.body.title,
            content: req.body.content,
            author: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id
        });
        yield redis_1.redisClient.setex(`RATE_LIMIT:${(_c = req.user) === null || _c === void 0 ? void 0 : _c._id}`, 60, '0');
        const savedBlog = yield newBlog.save();
        res.status(201).json(savedBlog);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createBlog = createBlog;
const getBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cachedBlogs = yield redis_1.redisClient.get('blogs');
        if (cachedBlogs) {
            return res.status(200).json(JSON.parse(cachedBlogs));
        }
        const blogs = yield blog_1.default.find();
        yield redis_1.redisClient.setex('blogs', 3600, JSON.stringify(blogs));
        res.status(200).json(blogs);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getBlogs = getBlogs;
const getBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cachedBlog = yield redis_1.redisClient.get(`blog:${req.params.id}`);
        if (cachedBlog) {
            return res.status(200).json(JSON.parse(cachedBlog));
        }
        const blogPost = yield blog_1.default.findById(req.params.id);
        if (!blogPost) {
            return res.status(404).json('Blog not found');
        }
        yield redis_1.redisClient.setex(`blog:${req.params.id}`, 3600, JSON.stringify(blogPost));
        res.status(200).json(blogPost);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getBlog = getBlog;
