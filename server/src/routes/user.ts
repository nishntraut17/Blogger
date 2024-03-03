import { Router } from "express";
import * as user from "../controllers/user";

const router = Router();

router.post("/register", user.register);
router.post("/login", user.login);

export default router;