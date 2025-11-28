import { Request, Response } from 'express';
import db from '../database/connection';
import { CreatePostDto, UpdatePostDto } from '../types';

export const createPost = async (req: Request, res: Response) => {
  try {
    const { category_id, title, content, published_at }: CreatePostDto = req.body;

    if (!category_id || !title || !content) {
      return res.status(400).json({ error: 'category_id, title, and content are required' });
    }

    // Kategorinin var olup olmadığını kontrol et
    const category = await db('categories')
      .where({ id: category_id })
      .whereNull('deleted_at')
      .first();

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const [post] = await db('posts')
      .insert({
        category_id,
        title,
        content,
        published_at: published_at || null,
      })
      .returning('*');

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { category, status, showDeleted, onlyDeleted } = req.query;

    let query = db('posts').select('*');

    // Kategori filtreleme
    if (category) {
      query = query.where({ category_id: category });
    }

    // Status filtreleme
    if (status === 'published') {
      query = query.whereNotNull('published_at');
    } else if (status === 'draft') {
      query = query.whereNull('published_at');
    }
    // status === 'all' veya undefined ise tümü

    // Soft delete filtreleme
    if (onlyDeleted === 'true') {
      query = query.whereNotNull('deleted_at');
    } else if (showDeleted !== 'true') {
      query = query.whereNull('deleted_at');
    }

    const posts = await query.orderBy('created_at', 'desc');

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await db('posts')
      .where({ id })
      .whereNull('deleted_at')
      .first();

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: UpdatePostDto = req.body;

    // Önce gönderiyi kontrol et (soft delete kontrolü)
    const post = await db('posts')
      .where({ id })
      .whereNull('deleted_at')
      .first();

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Eğer category_id güncelleniyorsa, yeni kategoriyi kontrol et
    if (updateData.category_id) {
      const category = await db('categories')
        .where({ id: updateData.category_id })
        .whereNull('deleted_at')
        .first();

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
    }

    const [updated] = await db('posts')
      .where({ id })
      .whereNull('deleted_at')
      .update(updateData)
      .returning('*');

    res.json(updated);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Önce gönderiyi kontrol et (soft delete kontrolü)
    const post = await db('posts')
      .where({ id })
      .whereNull('deleted_at')
      .first();

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await db('posts')
      .where({ id })
      .update({ deleted_at: new Date() });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

