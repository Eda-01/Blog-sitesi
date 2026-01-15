import type { Role } from "@prisma/client";
import { prisma } from "../config/database";
import type { User } from "../generated/prisma/client";

export const createUser = async (name: string, username: string, hashed_password: string, role: Role) => {
 const user = { name, username, hashed_password};
 return prisma.user.create({ data: user });
}

export const getAllUsers = async () => {
 return prisma.user.findMany(
    {
        select: { id: true,username: true },
        where: { deleted_at: null },
        orderBy: { username: 'asc' }
    
    }
);
}

export const getUserByUsername = async (username: string) => {
 return prisma.user.findFirst({
    where: { username, deleted_at: null }
 });
}

export const getUserById = async (id: number, getAll: boolean=false): Promise<Partial<User>   | null> => {
    if (getAll) {
 return prisma.user.findUnique({
    where: { id, deleted_at: null },
   
 });    }else {
    return prisma.user.findUnique({
        where: { id, deleted_at: null },
        select: { id: true, username: true, name: true, role: true, created_at: true }
     });    
 }
};


export const updateUser = async (id: number, user: Partial<User>) => {
 return prisma.user.update({
    where: { id, deleted_at: null },
    data: user
 });
}

export const deleteUser = async (id: number) => {
 return prisma.user.update({
    where: { id, deleted_at: null },
    data: { deleted_at: new Date() }
 });
}


