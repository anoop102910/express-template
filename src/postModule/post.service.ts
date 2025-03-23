import { PostDao } from "./post.dao";
import { IPostInput } from "./post.model";

export class PostService {
  private postDao: PostDao;

  constructor() {
    this.postDao = new PostDao();
  }

  async createPost(postInput: IPostInput, userId: string) {
      return await this.postDao.createPost(postInput, userId);
  }

  async getPosts() {
      return await this.postDao.getPosts();
  }

  async getUserPosts(userId: string) {
      return await this.postDao.getUserPosts(userId);
  }
} 