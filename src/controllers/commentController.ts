import { type Request, type Response } from 'express';
import { getAllComments, createComment, updateComment, deleteComment, getCommentById } from '../models/commentModel.js';

export const getAllCommentController = async (req: Request, res: Response) => {
  try {
    const { post, commenter } = req.query;

    const filters = {
      ...(post ? { post: Number(post) } : {}),
      ...(commenter ? { commenter: commenter as string } : {}),
    };

    const items = await getAllComments(filters);
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve comments' });
  }
};

export const createCommentController = async (req: Request, res: Response) => {
  try {
    const newItem = await createComment(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

export const updateCommentController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await updateComment(Number(id), req.body);

    if (result.count === 0) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    res.status(200).json({ updated: result.count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
};

export const deleteCommentController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await deleteComment(Number(id));

    if (result.count === 0) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    res.status(204).json({ deleted: result.count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

export const getCommentByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await getCommentById(Number(id));
    if (!item) {
      res.status(404).json({ error: 'Comment not found' });
    } else {
      res.status(200).json(item);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve comment' });
  }
};
