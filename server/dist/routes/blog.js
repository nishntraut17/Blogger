"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_1 = require("../controllers/blog");
const router = (0, express_1.Router)();
router.post("/", blog_1.createBlog);
router.get("/", blog_1.getBlogs);
router.get("/:id", blog_1.getBlog);
exports.default = router;
