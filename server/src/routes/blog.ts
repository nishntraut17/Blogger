import { Router } from "express";
import { createBlog, getBlogs, getBlog } from "../controllers/blog";
import auth from "../middleware/auth";

const router = Router();

router.post("/", auth, createBlog);
router.get("/", getBlogs);
router.get("/:id", getBlog);

export default router;