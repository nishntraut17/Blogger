import blog from "../models/blog";
import { Request, Response } from 'express';
import { redisClient } from "../db/redis";

interface AuthRequest extends Request {
    user?: {
        _id: string,
        name: string,
    };
}

const createBlog = async (req: AuthRequest, res: Response) => {
    try {
        const rateLimit = await redisClient.get(`RATE_LIMIT:${req.user?._id}`);
        if (rateLimit && parseInt(rateLimit) >= 5) {
            return res.status(429).json('Too many requests');
        }
        await redisClient.del('blogs');
        const newBlog = new blog({
            title: req.body.title,
            content: req.body.content,
            author: req.user?._id
        });
        await redisClient.setex(`RATE_LIMIT:${req.user?._id}`, 60, '0');
        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    }
    catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

const getBlogs = async (req: Request, res: Response) => {
    try {
        const cachedBlogs = await redisClient.get('blogs');
        if (cachedBlogs) {
            return res.status(200).json(JSON.parse(cachedBlogs));
        }
        const blogs = await blog.find();
        await redisClient.setex('blogs', 3600, JSON.stringify(blogs));
        res.status(200).json(blogs);
    }
    catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

const getBlog = async (req: Request, res: Response) => {
    try {
        const cachedBlog = await redisClient.get(`blog:${req.params.id}`);
        if (cachedBlog) {
            return res.status(200).json(JSON.parse(cachedBlog));
        }
        const blogPost = await blog.findById(req.params.id);
        if (!blogPost) {
            return res.status(404).json('Blog not found');
        }
        await redisClient.setex(`blog:${req.params.id}`, 3600, JSON.stringify(blogPost));
        res.status(200).json(blogPost);
    }
    catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export { createBlog, getBlogs, getBlog };