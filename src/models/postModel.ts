import { prisma } from "../config/prisma.js";

type PostStatusFilter = "published" | "draft" | "all" | undefined;
type PostShowDeletedFilter = "true" | "false" | "onlyDeleted" | undefined;

interface PostFilters {
  category?: number;
  status?: PostStatusFilter;
  showDeleted?: PostShowDeletedFilter;
  tags?: number[]; // eklenecek tag filtreleri icin
}

export const getAllPosts = async (filters: PostFilters = {}) => {
  const where: any = {};

  if (filters.showDeleted === "onlyDeleted") {
    where.deleted_at = { not: null };
  } else if (filters.showDeleted === "true") {
    // hepsi
  } else {
    where.deleted_at = null;
  }

  if (filters.status === "published") {
    where.published_at = { not: null };
  } else if (filters.status === "draft") {
    where.published_at = null;
  }

  if (typeof filters.category === "number") {
    where.category_id = filters.category;
  }

  if (filters.tags && filters.tags.length > 0) {
    where.tags = {
      some: {
        tag_id: { in: filters.tags },
      },
    };
  }

  return prisma.post.findMany({
    where,
    select: {
      id: true,
      title: true,
      category_id: true,
      content: true,
      created_at: true,
      published_at: true,
      deleted_at: true,
    },
  });
};

export const createPost = async (data: {
  category_id: number;
  title: string;
  content: string;
  published_at?: Date | null;
}) => {
  return prisma.post.create({
    data,
  });
};

export const updatePost = async (
  id: number,
  data: Partial<{
    category_id: number;
    title: string;
    content: string;
    published_at: Date | null;
  }>
) => {
  return prisma.post.updateMany({
    where: {
      id,
      deleted_at: null,
    },
    data,
  });
};

export const deletePost = async (id: number) => {
  return prisma.post.updateMany({
    where: {
      id,
      deleted_at: null,
    },
    data: {
      deleted_at: new Date(),
    },
  });
};

export const getPostById = async (id: number) => {
  return prisma.post.findFirst({
    where: {
      id,
      deleted_at: null,
    },
  });
};
