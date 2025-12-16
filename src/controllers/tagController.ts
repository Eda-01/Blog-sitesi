import { type Request, type Response } from "express";
import {
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
  getTagById,
  addTagToPost,
  removeTagFromPost,
} from "../models/tagModel.js";

export const getAllTagsController = async (_req: Request, res: Response) => {
  try {
    const items = await getAllTags();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve tags" });
  }
};

export const createTagController = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const item = await createTag(name);
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create tag" });
  }
};

export const updateTagController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await updateTag(Number(id), req.body);

    if (result.count === 0) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }

    res.status(200).json({ updated: result.count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update tag" });
  }
};

export const deleteTagController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await deleteTag(Number(id));

    if (result.count === 0) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }

    res.status(204).json({ deleted: result.count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete tag" });
  }
};

export const getTagByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await getTagById(Number(id));
    if (!item) {
      res.status(404).json({ error: "Tag not found" });
    } else {
      res.status(200).json(item);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve tag" });
  }
};

export const addTagToPostController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tag_id } = req.body;

    // tag_id kontrolü
    if (tag_id === undefined || tag_id === null) {
      res.status(400).json({ error: "tag_id is required in request body" });
      return;
    }

    const tagIdNumber = Number(tag_id);
    if (Number.isNaN(tagIdNumber)) {
      res.status(400).json({ error: "tag_id must be a valid number" });
      return;
    }

    const postIdNumber = Number(id);
    if (Number.isNaN(postIdNumber)) {
      res.status(400).json({ error: "Invalid post id" });
      return;
    }

    const item = await addTagToPost(postIdNumber, tagIdNumber);
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add tag to post" });
  }
};

export const removeTagFromPostController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tag_id } = req.body;

    const result = await removeTagFromPost(Number(id), Number(tag_id));

    if (result.count === 0) {
      res.status(404).json({ message: "Post tag not found" });
      return;
    }

    res.status(204).json({ deleted: result.count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove tag from post" });
  }
};


