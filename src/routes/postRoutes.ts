import { Router } from 'express';
import * as postController from '../controllers/postController';

const router = Router();

router.post('/', postController.createPost);
router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);
router.patch('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

export default router;

