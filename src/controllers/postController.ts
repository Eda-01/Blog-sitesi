import { type Request, type Response } from "express";
import { getAllPosts, createPost, deletePost, getPostById, updatePost } from "../models/postModel.js";

export const getAllPostController = async (req: Request, res: Response) => {
  try {
    const { category, status, showDeleted, tags } = req.query;

    const tagIds =
      typeof tags === "string" && tags.trim() !== ""
        ? tags
            .split(",")
            .map((t) => Number(t))
            .filter((n) => !Number.isNaN(n))
        : undefined;

    const filters = {
      category: category ? Number(category) : undefined,
      status: status as "published" | "draft" | "all" | undefined,
      showDeleted: showDeleted as "true" | "false" | "onlyDeleted" | undefined,
      tags: tagIds,
    };

    const items = await getAllPosts(filters);
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve Posts" });
  }
};

export const createPostController = async (req: Request, res: Response) => {
  try {
    const newItem = await createPost(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create Post" });
  }
};

export const updatePostController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await updatePost(Number(id), req.body);

    if (result.count === 0) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    res.status(200).json({ updated: result.count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update Post" });
  }
};

export const deletePostController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await deletePost(Number(id));

    if (result.count === 0) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    res.status(204).json({ deleted: result.count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete Post" });
  }
};

export const getPostByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await getPostById(Number(id));
    if (!item) {
      res.status(404).json({ error: "Post not found" });
    } else {
      res.status(200).json(item);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve Post" });
  }
};
