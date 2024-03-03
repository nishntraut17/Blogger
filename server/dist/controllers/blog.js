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
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const newBlog = new blog_1.default({
            title: req.body.title,
            content: req.body.content,
            author: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id
        });
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
        const blogs = yield blog_1.default.find();
        res.status(200).json(blogs);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getBlogs = getBlogs;
const getBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogPost = yield blog_1.default.findById(req.params.id);
        res.status(200).json(blogPost);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getBlog = getBlog;
