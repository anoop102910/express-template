import { Request, Response } from "express";
import { PostService } from "./post.service";
import { ApiResponse } from "../utils/ApiResponse";
import { HTTP_STATUS } from "../utils/httpStatus";

export class PostController {
  private postService: PostService;

  constructor() {
    this.postService = new PostService();
  }

  async createPost(req: Request, res: Response) {
    const post = await this.postService.createPost(req.body, req.user._id);
    res.status(HTTP_STATUS.CREATED).json(
      new ApiResponse(HTTP_STATUS.CREATED, post, "Post created successfully")
    );
  }

  async getPosts(req: Request, res: Response) {
    const posts = await this.postService.getPosts();
    res.json(
      new ApiResponse(HTTP_STATUS.OK, posts, "Posts fetched successfully")
    );
  }

  async getUserPosts(req: Request, res: Response) {
    const posts = await this.postService.getUserPosts(req.user._id);
    res.json(
      new ApiResponse(HTTP_STATUS.OK, posts, "User posts fetched successfully")
    );
  }
} 