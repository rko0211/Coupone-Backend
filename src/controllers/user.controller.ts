import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import asyncHandler from '../utils/asyncHandler';

const prisma = new PrismaClient();

// Create User
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email } = req.body;

  const user = await prisma.user.create({
    data: { name, email },
  });
  res.json(user);
});

// Get All Users
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});
