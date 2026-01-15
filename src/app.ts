import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import categoryRoutes from './routes/categoryRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';


 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/healthcheck', (req: Request, res: Response) => {
  res.status(200).json({ message: 'OK' });
});


app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/tags', tagRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
