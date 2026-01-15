import { prisma } from "../config/database";

export const createTag = async (name: string) => {
  return prisma.tag.create({data: { name }  });
};

export const getAllTags = async () => {
  return prisma.tag.findMany({select: {id: true, name: true}});
};

export const getTagById = async (id: number) => {
  return prisma.tag.findUnique({where: {id}});
};

export const updateTag = async (id: number, name: string) => {
  return prisma.tag.update({where: {id}, data: {name}});
};

export const deleteTag = async (id: number) => {
  return prisma.tag.delete({where: {id}});
};

