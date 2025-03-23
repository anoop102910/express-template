import { Router } from "express";
import { PostController } from "./post.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { createPostSchema } from "./post.validation";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();
const postController = new PostController();

// Public routes
router.get("/", asyncHandler(postController.getPosts.bind(postController)));

// Protected routes
router.use(authMiddleware);
router.post(
  "/",
  validate(createPostSchema),
  asyncHandler(postController.createPost.bind(postController))
);
router.get(
  "/me",
  asyncHandler(postController.getUserPosts.bind(postController))
);

export default router; 