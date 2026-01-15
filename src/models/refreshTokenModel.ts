import { prisma } from "../config/database";
import type { RefreshToken } from "../generated/prisma/client";


export const createRefreshToken = async (refreshToken: Partial<RefreshToken>) => {
return await prisma.refreshToken.create({
    data: refreshToken as any });
}

export const getRefreshTokenByUserId = async (userId: number) => {
    return prisma.refreshToken.findFirst({
        where: { user_id: userId, revoked_at: null, expires_at: { gt: new Date() } },
    });
}

export const revokeRefreshToken = async (id: number) => {
    return prisma.refreshToken.update({
        where: { id },
        data: { revoked_at: new Date() },
    });
}