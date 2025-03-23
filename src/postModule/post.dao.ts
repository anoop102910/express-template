import mongoose from 'mongoose';
import { IPost, IPostInput } from './post.model';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mediaUrl: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

const PostModel = mongoose.model<IPost>('Post', postSchema);

export class PostDao {
  async createPost(postInput: IPostInput, userId: string): Promise<IPost> {
    const post = new PostModel({
      ...postInput,
      author: userId
    });
    return await post.save();
  }

  async getPosts(): Promise<IPost[]> {
    return await PostModel.find().populate('author', 'username email').sort({ createdAt: -1 });
  }

  async getUserPosts(userId: string): Promise<IPost[]> {
    return await PostModel.find({ author: userId }).sort({ createdAt: -1 });
  }
} 