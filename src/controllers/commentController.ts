import { Request, Response } from 'express';
import db from '../database/connection';
import { CreateCommentDto, UpdateCommentDto } from '../types';

export const createComment = async (req: Request, res: Response) => {
  try {
    const { post_id, content, commenter_name }: CreateCommentDto = req.body;

    if (!post_id || !content || !commenter_name) {
      return res.status(400).json({ error: 'post_id, content, and commenter_name are required' });
    }

    // Gönderinin var olup olmadığını kontrol et (soft delete kontrolü yapmıyoruz, belirtilmiş gibi)
    const post = await db('posts').where({ id: post_id }).first();

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const [comment] = await db('comments')
      .insert({
        post_id,
        content,
        commenter_name,
      })
      .returning('*');

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const { post, commenter } = req.query;

    let query = db('comments').select('*');

    // Post filtreleme
    if (post) {
      query = query.where({ post_id: post });
    }

    // Yorumcu filtreleme
    if (commenter) {
      query = query.where({ commenter_name: commenter });
    }

    const comments = await query.orderBy('created_at', 'desc');

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCommentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const comment = await db('comments').where({ id }).first();

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json(comment);
  } catch (error) {
    console.error('Error fetching comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: UpdateCommentDto = req.body;

    // Önce yorumu kontrol et
    const comment = await db('comments').where({ id }).first();

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const [updated] = await db('comments')
      .where({ id })
      .update(updateData)
      .returning('*');

    res.json(updated);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Önce yorumu kontrol et
    const comment = await db('comments').where({ id }).first();

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    await db('comments').where({ id }).delete();

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

