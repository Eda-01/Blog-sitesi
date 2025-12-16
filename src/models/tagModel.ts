import { prisma } from "../config/prisma.js";

export const getAllTags = async () => {
  return prisma.tag.findMany();
};

export const createTag = async (name: string) => {
  return prisma.tag.create({
    data: { name },
  });
};

export const updateTag = async (id: number, data: Partial<{ name: string }>) => {
  return prisma.tag.updateMany({
    where: { id },
    data,
  });
};

export const deleteTag = async (id: number) => {
  return prisma.tag.deleteMany({
    where: { id },
  });
};

export const getTagById = async (id: number) => {
  return prisma.tag.findFirst({
    where: { id },
  });
};

export const addTagToPost = async (postId: number, tagId: number) => {
  return prisma.postTag.create({
    data: {
      post_id: postId,
      tag_id: tagId,
    },
  });
};

export const removeTagFromPost = async (postId: number, tagId: number) => {
  return prisma.postTag.deleteMany({
    where: {
      post_id: postId,
      tag_id: tagId,
    },
  });
};


