import blog from "../models/blog";
import { Request, Response } from 'express';

interface AuthRequest extends Request {
    user?: {
        _id: string,
        name: string,
    };
}

const createBlog = async (req: AuthRequest, res: Response) => {
    try {
        const newBlog = new blog({
            title: req.body.title,
            content: req.body.content,
            author: req.user?._id
        });
        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    }
    catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

const getBlogs = async (req: Request, res: Response) => {
    try {
        const blogs = await blog.find();
        res.status(200).json(blogs);
    }
    catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

const getBlog = async (req: Request, res: Response) => {
    try {
        const blogPost = await blog.findById(req.params.id);
        res.status(200).json(blogPost);
    }
    catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export { createBlog, getBlogs, getBlog };