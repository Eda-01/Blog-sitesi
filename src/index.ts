import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import categoryRoutes from './routes/categoryRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/categories', categoryRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

// Health check
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Blog Backend API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

