import { Request, Response } from 'express';
import db from '../database/connection';
import { CreateCategoryDto, UpdateCategoryDto } from '../types';

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name }: CreateCategoryDto = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const [category] = await db('categories')
      .insert({ name })
      .returning('*');

    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const { showDeleted, onlyDeleted } = req.query;

    let query = db('categories').select('*');

    // Soft delete filtreleme
    if (onlyDeleted === 'true') {
      query = query.whereNotNull('deleted_at');
    } else if (showDeleted !== 'true') {
      query = query.whereNull('deleted_at');
    }

    const categories = await query.orderBy('created_at', 'desc');

    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await db('categories')
      .where({ id })
      .whereNull('deleted_at')
      .first();

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: UpdateCategoryDto = req.body;

    // Önce kategoriyi kontrol et (soft delete kontrolü)
    const category = await db('categories')
      .where({ id })
      .whereNull('deleted_at')
      .first();

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const [updated] = await db('categories')
      .where({ id })
      .whereNull('deleted_at')
      .update(updateData)
      .returning('*');

    res.json(updated);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Önce kategoriyi kontrol et (soft delete kontrolü)
    const category = await db('categories')
      .where({ id })
      .whereNull('deleted_at')
      .first();

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    await db('categories')
      .where({ id })
      .update({ deleted_at: new Date() });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

