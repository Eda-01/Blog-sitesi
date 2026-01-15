import { type Request, type Response } from "express";
import { getAllPosts, createPost, updatePost, deletePost, getPostById } from "../models/postModel.js";
import { addTagToPost, removeTagFromPost } from "../models/postTagModel.js";
import { getTagById } from "../models/tagModel.js";
import { getUserById } from "../models/userModel.js";

export const getAllPostsController = async (req: Request, res: Response) => {
  try {
    const { showDeleted, category, status, tags } = req.query;
    const tagIds = tags?.toString().split(',').map(Number);
    const items = await getAllPosts(showDeleted as string, Number(category), status as string, tagIds as number[]);
    res.json(items);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const createPostController = async (req: Request, res: Response) => {
  try {
    const newItem = await createPost(req.body, req.user?.userId as number);
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const updatePostController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await getPostById(Number(id));
    if (!item) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const requestUser = await getUserById(req.user?.userId as number);
    if (requestUser?.role !== 'ADMIN' && requestUser?.id !== item.user_id && requestUser?.role !== 'MODERATOR') {
      return res.status(403).json({ message: 'You are not authorized to update this user' });
    }

    const updatedItem = await updatePost(Number(id), req.body);
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const deletePostController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await getPostById(Number(id));
    if (!item) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const requestUser = await getUserById(req.user?.userId as number);
    if (requestUser?.role !== 'ADMIN' && requestUser?.id !== item.user_id) {
      return res.status(403).json({ message: 'You are not authorized to delete this user' });
    }
    const deletedItem = await deletePost(Number(id));
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const getPostByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await getPostById(Number(id));
    if (!item) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.status(200).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const addTagToPostController = async (req: Request, res: Response) => {
  try {

    const { id } = req.params;
    const post = await getPostById(Number(id));
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const requestUser = await getUserById(req.user?.userId as number);
    if (requestUser?.role !== 'MODERATOR' && requestUser?.role !== 'ADMIN' && requestUser?.id !== post.user_id) {
      return res.status(403).json({ message: 'You are not authorized to delete this user' });
    }


    const { tagId } = req.body;
    const tag = await getTagById(Number(tagId));
    if (!tag) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }
    const item = await addTagToPost(Number(id), Number(tagId));
    res.status(201).json(item);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const removeTagFromPostController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await getPostById(Number(id));
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const requestUser = await getUserById(req.user?.userId as number);
    if (requestUser?.role !== 'MODERATOR' && requestUser?.role !== 'ADMIN' && requestUser?.id !== post.user_id) {
      return res.status(403).json({ message: 'You are not authorized to delete this user' });
    }
    const { tagId } = req.body;
    const tag = await getTagById(Number(tagId));
    if (!tag) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }
    await removeTagFromPost(Number(id), Number(tagId));
    res.status(204).send();
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}



