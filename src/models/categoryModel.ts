import { prisma } from "../config/prisma.js";

type CategoryShowDeletedFilter = "true" | "false" | "onlyDeleted" | undefined;

export const getAllCategories = async (showDeleted?: CategoryShowDeletedFilter) => {
  let where: any = {};

  if (showDeleted === "onlyDeleted") {
    where.deleted_at = { not: null };
  } else if (showDeleted === "true") {
    // hepsi
  } else {
    where.deleted_at = null;
  }

  return prisma.category.findMany({
    where,
    select: {
      id: true,
      name: true,
      created_at: true,
      deleted_at: true,
    },
  });
};

export const createCategory = async (name: string) => {
  return prisma.category.create({
    data: { name },
    select: {
      id: true,
      name: true,
    },
  });
};

export const updateCategory = async (id: number, data: Partial<{ name: string }>) => {
  return prisma.category.updateMany({
    where: {
      id,
      deleted_at: null,
    },
    data,
  });
};

export const deleteCategory = async (id: number) => {
  return prisma.category.updateMany({
    where: {
      id,
      deleted_at: null,
    },
    data: {
      deleted_at: new Date(),
    },
  });
};

export const getCategoryById = async (id: number) => {
  return prisma.category.findFirst({
    where: {
      id,
      deleted_at: null,
    },
  });
};
