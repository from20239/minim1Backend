import { Router } from 'express';
import { 
  sendMessage, 
  getConversation, 
  getUserConversations,
  markMessageAsRead,
  deleteMessage
} from '../controllers/message.controller';

const router = Router();

router.post('/messages', sendMessage);
router.get('/conversations/:userId', getUserConversations);
router.get('/messages/:user1/:user2', getConversation);
router.put('/messages/:id/read', markMessageAsRead);
router.delete('/messages/:id', deleteMessage);

export default router;