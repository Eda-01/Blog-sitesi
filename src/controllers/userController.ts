import { type Request, type Response } from 'express';
import { createUser, getAllUsers, getUserByUsername, getUserById, updateUser, deleteUser } from '../models/userModel';
import { hashPassword } from '../utils/hashPassword';

export const getAllUsersController = async (req: Request, res: Response) => {
    try {
        const items = await getAllUsers();
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createUserController = async (req: Request, res: Response) => {
    try {
        const user = await getUserById(req.user?.userId as number);
        if (!user || user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'You are not authorized to create a new user' });
        }
        const { name, username, password, role } = req.body;
        if (!name || !username || !password || !role) {
            return res.status(400).json({ message: 'Name, username, and password are required' });
        }
        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const hashedPassword = await hashPassword(password);
        await createUser(name, username, hashedPassword, role);
        res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUserByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await getUserById(Number(id));
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateUserController = async (req: Request, res: Response) => {
    try {
         const { id } = req.params;
        const requestUser = await getUserById(req.user?.userId as number);
        if (requestUser?.role !== 'ADMIN' && requestUser?.id !== Number(req.params.id)) {
            return res.status(403).json({ message: 'You are not authorized to update this user' });
        }
        const { name, username, password } = req.body;
        if (!name && !username && !password) {
            return res.status(400).json({ message: 'Name, username, and password are required' });
        }
        const user = await getUserById(Number(id), true);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (username && username !== user.username) {
            const existingUser = await getUserByUsername(username);
            if (existingUser) {
                return res.status(400).json({ message: 'Username already exists' });
            }
            user.username = username;
        }
        if (password) {
            const hashedPassword = await hashPassword(password);
            user.hashed_password = hashedPassword;
        }
        if (name) {
            user.name = name;
        }
        await updateUser(Number(id), user);
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteUserController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const requestUser = await getUserById(req.user?.userId as number);
        if (requestUser?.role !== 'ADMIN' && requestUser?.id !== Number(req.params.id)) {
            return res.status(403).json({ message: 'You are not authorized to update this user' });
        }
        const user = await getUserById(Number(id));
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await deleteUser(Number(id));
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const meController = async (req: Request, res: Response) => {
    try {
        const user = await getUserById(req.user!.userId);
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};