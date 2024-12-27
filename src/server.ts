import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import userRoutes from './routes/user.routes';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve Static Files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/users', userRoutes);

// Serve Documentation Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
