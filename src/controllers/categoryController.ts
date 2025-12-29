import { Request, Response } from 'express';
import prisma from '../utils/prismaClient.js';

export const getAllCategoriesController = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: { deleted_at: null },
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Kategoriler getirilemedi.' });
  }
};

export const createCategoryController = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const newCategory = await prisma.category.create({
      data: { name },
    });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: 'Kategori oluşturulamadı.' });
  }
};

export const updateCategoryController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: { name },
    });
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: 'Kategori güncellenemedi.' });
  }
};

export const deleteCategoryController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.category.update({
      where: { id: Number(id) },
      data: { deleted_at: new Date() },
    });
    res.json({ message: 'Kategori başarıyla silindi.' });
  } catch (error) {
    res.status(500).json({ error: 'Kategori silinemedi.' });
  }
};

export const getCategoryByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.findFirst({
      where: { 
        id: Number(id),
        deleted_at: null 
      },
    });
    if (!category) return res.status(404).json({ message: 'Kategori bulunamadı.' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Hata oluştu.' });
  }
};
