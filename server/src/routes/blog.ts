import { Router } from "express";
import { createBlog, getBlogs, getBlog } from "../controllers/blog";

const router = Router();

router.post("/", createBlog);
router.get("/", getBlogs);
router.get("/:id", getBlog);

export default router;