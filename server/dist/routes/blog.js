"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_1 = require("../controllers/blog");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.Router)();
router.post("/", auth_1.default, blog_1.createBlog);
router.get("/", blog_1.getBlogs);
router.get("/:id", blog_1.getBlog);
exports.default = router;
