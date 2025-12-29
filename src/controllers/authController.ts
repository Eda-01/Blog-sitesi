import { Request, Response } from 'express';
import prisma from '../utils/prismaClient.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'gizli-anahtar';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh-gizli-anahtar';

export const registerController = async (req: Request, res: Response) => {
  const { name, username, password, role } = req.body;
  try {
    const hashedPassword = await argon2.hash(password);
    
    const user = await prisma.user.create({
      data: {
        name,
        username,
        hashed_password: hashedPassword,
        role: role || 'member', // Eğer rol gönderilmezse varsayılan 'member' olsun
      },
    });

    res.status(201).json({ message: 'Kullanıcı oluşturuldu', userId: user.id });
  } catch (error) {
    res.status(500).json({ error: 'Kayıt işlemi başarısız.' });
  }
};

export const loginController = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    
    if (!user || !(await argon2.verify(user.hashed_password, password))) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
    }

    const accessToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '7d' });

    // Refresh Token'ı veritabanına kaydet
    await prisma.refreshToken.create({
      data: {
        user_id: user.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 gün
      },
    });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: 'Giriş yapılamadı.' });
  }
};