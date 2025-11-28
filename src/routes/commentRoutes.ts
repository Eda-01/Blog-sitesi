import { Router } from 'express';
import * as commentController from '../controllers/commentController';

const router = Router();

router.post('/', commentController.createComment);
router.get('/', commentController.getComments);
router.get('/:id', commentController.getCommentById);
router.patch('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

export default router;

