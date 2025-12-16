import { prisma } from "../config/prisma.js";

interface CommentFilters {
  post?: number;
  commenter?: string;
}

export const getAllComments = async (filters: CommentFilters = {}) => {
  const where: any = {};

  if (typeof filters.post === "number") {
    where.post_id = filters.post;
  }

  if (typeof filters.commenter === "string" && filters.commenter.trim() !== "") {
    where.commenter_name = filters.commenter;
  }

  return prisma.comment.findMany({
    where,
    select: {
      id: true,
      post_id: true,
      content: true,
      commenter_name: true,
      created_at: true,
    },
  });
};

export const createComment = async (data: {
  post_id: number;
  content: string;
  commenter_name: string;
}) => {
  return prisma.comment.create({
    data,
  });
};

export const updateComment = async (
  id: number,
  data: Partial<{ post_id: number; content: string; commenter_name: string }>
) => {
  return prisma.comment.updateMany({
    where: { id },
    data,
  });
};

export const deleteComment = async (id: number) => {
  return prisma.comment.deleteMany({
    where: { id },
  });
};

export const getCommentById = async (id: number) => {
  return prisma.comment.findFirst({
    where: { id },
  });
};
