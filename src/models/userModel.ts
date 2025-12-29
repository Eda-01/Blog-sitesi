import { prisma } from "../config/prisma.js";
import { hash } from "@node-rs/argon2";

type UserShowDeletedFilter = "true" | "false" | "onlyDeleted" | undefined;

export const getAllUsers = async (showDeleted?: UserShowDeletedFilter) => {
  let where: any = {};

  if (showDeleted === "onlyDeleted") {
    where.deletedAt = { not: null };
  } else if (showDeleted === "true") {
    // hepsi
  } else {
    where.deletedAt = null;
  }

  return prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      username: true,
      role: true,
      createdAt: true,
      deletedAt: true,
    },
  });
};

export const createUser = async (name: string, username: string, password: string) => {
  const hashedPassword = await hash(password);
  return prisma.user.create({
    data: {
      name,
      username,
      hashedPassword,
    },
    select: {
      id: true,
      name: true,
      username: true,
      role: true,
    },
  });
};

export const updateUser = async (id: number, data: Partial<{ name: string; username: string; password?: string }>) => {
  if (data.password) {
    data.password = await hash(data.password);
  }
  return prisma.user.updateMany({
    where: {
      id,
      deletedAt: null,
    },
    data: {
      name: data.name,
      username: data.username,
      hashedPassword: data.password, // This needs to be data.hashedPassword if we decide to store it that way
    },
  });
};

export const deleteUser = async (id: number) => {
  return prisma.user.updateMany({
    where: {
      id,
      deletedAt: null,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};

export const getUserById = async (id: number) => {
  return prisma.user.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      username: true,
      role: true,
      createdAt: true,
      deletedAt: true,
    },
  });
};

export const getUserByUsername = async (username: string) => {
  return prisma.user.findUnique({
    where: {
      username,
    },
  });
};

