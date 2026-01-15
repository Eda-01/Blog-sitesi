import { type Request, type Response } from 'express';
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from "../models/categoryModel.js"
import { getUserById } from '../models/userModel.js';


export const getAllCategoriesController = async (req: Request, res: Response) => {
  try {
    const { showDeleted } = req.query;
    const items = await getAllCategories(showDeleted as string);
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kategoriler alınırken bir hata oluştu.' });
  }
};


export const createCategoryController = async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.user?.userId as number);
            if (!user || user.role !== 'ADMIN') {
                return res.status(403).json({ message: 'You are not authorized to create a new user' });
            }
   const {name} = req.body;
   const item = await createCategory(name);
    res.status(201).json(item);
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
 

export const updateCategoryController = async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.user?.userId as number);
        if (!user || user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'You are not authorized to create a new user' });
        }
    const { id } = req.params;
    const item = await updateCategory(Number(id), req.body);
 res.status(200).json(item);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

};




export const deleteCategoryController = async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.user?.userId as number);
        if (!user || user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'You are not authorized to create a new user' });
        }
    const { id } = req.params;
    const item = await deleteCategory(Number(id));
    res.status(200).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getCategoryByIdController = async (req: Request, res: Response) => {

  try {
    const { id } = req.params;
    const item = await getCategoryById(Number(id));

    if (!item) {
      res.status(404).json({ message: 'Kategori bulunamadı.' });
      return;
    }
    res.status(200).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
