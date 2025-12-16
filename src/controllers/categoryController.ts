import { type Request, type Response } from 'express';
import { getAllCategories, createCategory, updateCategory, deleteCategory, getCategoryById } from '../models/categoryModel.js';

export const getAllCategoriesController = async (req: Request, res: Response) => {
  try {
    const { showDeleted } = req.query;
    const items = await getAllCategories(showDeleted as 'true' | 'false' | 'onlyDeleted' | undefined);
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve categories' });
  }
};

export const createCategoryController = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const item = await createCategory(name);
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export const updateCategoryController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await updateCategory(Number(id), req.body);

    if (result.count === 0) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.status(200).json({ updated: result.count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

export const deleteCategoryController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await deleteCategory(Number(id));

    if (result.count === 0) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.status(204).json({ deleted: result.count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

export const getCategoryByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await getCategoryById(Number(id));
    if (!item) {
      res.status(404).json({ error: 'Category not found' });
    } else {
      res.status(200).json(item);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve category' });
  }
};
