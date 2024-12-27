import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create User
export const createUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Get All Users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};
