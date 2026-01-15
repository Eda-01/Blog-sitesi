import { type Request, type Response } from "express";
import { getAllTags, createTag, updateTag, deleteTag, getTagById } from "../models/tagModel.js";
import { getUserById } from "../models/userModel.js";

export const createItem = async (req: Request, res: Response) => {
    try {
        const requestUser = await getUserById(req.user?.userId as number);
        if (requestUser?.role !== 'ADMIN') {
            return res.status(403).json({ message: 'You are not authorized to create a new tag' });
        }
        const { name } = req.body;
        const item = await createTag(name);
        res.status(201).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
}

export const listItems = async (req: Request, res: Response) => {
    try {
        const items = await getAllTags();
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
}

export const itemDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const item = await getTagById(Number(id));
        if (!item) {
            res.status(404).json({ error: 'Item not found' });
            return;
        }
        res.status(200).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const updateItem = async (req: Request, res: Response) => {
    try {
        const requestUser = await getUserById(req.user?.userId as number);
        if (requestUser?.role !== 'ADMIN') {
            return res.status(403).json({ message: 'You are not authorized to create a new tag' });
        }

        const { id } = req.params;
        const { name } = req.body;
        const item = await updateTag(Number(id), name);
        if (!item) {
            res.status(404).json({ error: 'Tag not found' });
            return;
        }
        res.status(200).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' }
        )
    }

}

export const deleteItem = async (req: Request, res: Response) => {
    try {

        const requestUser = await getUserById(req.user?.userId as number);
        if (requestUser?.role !== 'ADMIN') {
            return res.status(403).json({ message: 'You are not authorized to create a new tag' });
        }
        const { id } = req.params;
        const item = await deleteTag(Number(id));
        if (!deleteItem) {
            res.status(404).json({ error: 'Tag not found' });
            return;
        }
        res.status(200).json(deleteItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}