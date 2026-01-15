import { type Request, type Response } from "express";
import { getAllComments, createComment, updateComment, deleteComment, getCommentById } from "../models/commentModel.js";
import { getUserById } from "../models/userModel.js";
import { getPostById } from "../models/postModel.js";

export const getAllCommentController = async (req: Request, res: Response) => {
  try {
    const { post, commenter } = req.query;
    const items = await getAllComments(Number(post), commenter as string);
    res.json(items);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });

  }
}

export const createCommentController = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.userId; // <- burada userId alıyoruz
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { post_id, content } = req.body;
    const newItem = await createComment({ post_id, content }, userId);
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const updateCommentController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await getCommentById(Number(id));
    if (!item) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }
    const requestUser = await getUserById(req.user!.userId);
    if ( requestUser?.id !==item.user_id ) {
      res.status(403).json({ message: "You are not authorized to update this comment" });
      return;
    }
    const updatedItem = await updateComment(Number(id), req.body);
    res.status(200).json(updatedItem);

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });

  }
}

export const deleteCommentController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await getCommentById(Number(id));
    if (!item) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }
    const post = await getPostById(item.post_id);
    if (!post) {
      res.status(404).json({ message: "Associated post not found" });
      return;
    }
    const requestUser = await getUserById(req.user!.userId);
    if ( requestUser?.id !==item.user_id
       && requestUser?.role !== 'ADMIN'
        && requestUser?.role !== 'MODERATOR'
      && post.user_id !== requestUser?.id) {
      res.status(403).json({ message: "You are not authorized to delete this comment" });
      return;
    }
    const deletedItem = await deleteComment(Number(id));
    res.status(204).json(deletedItem);
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });

  }
}

export const getCommentByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await getCommentById(Number(id));
    if (!item) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });

  }
}