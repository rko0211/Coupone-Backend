import { Router } from 'express';
import { createUser, getAllUsers } from '../controllers/user.controller';

const router = Router();

// Define routes
router.post('/', createUser);       // POST /users
router.get('/', getAllUsers);       // GET /users

export default router;
