import express from 'express';
import {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  createAnswer,
  updateAnswer,
  deleteAnswer,
  upvoteQuestion,
  upvoteAnswer,
  markBestAnswer,
  addComment,
  deleteComment,
} from '../controllers/qa.controller.mjs';
import { protect } from '../middleware/auth.middleware.mjs';

const router = express.Router();

// Protect all routes
router.use(protect);

// ==================== Question Routes ====================
router.post('/questions', createQuestion);
router.get('/questions', getAllQuestions);
router.get('/questions/:questionId', getQuestionById);
router.put('/questions/:questionId', updateQuestion);
router.delete('/questions/:questionId', deleteQuestion);

// ==================== Question Voting Routes ====================
router.post('/questions/:questionId/upvote', upvoteQuestion);

// ==================== Answer Routes ====================
router.post('/answers', createAnswer);
router.put('/answers/:answerId', updateAnswer);
router.delete('/answers/:answerId', deleteAnswer);

// ==================== Answer Voting Routes ====================
router.post('/answers/:answerId/upvote', upvoteAnswer);

// ==================== Best Answer Routes ====================
router.put('/answers/:answerId/best-answer', markBestAnswer);

// ==================== Comment Routes ====================
router.post('/comments', addComment);
router.delete('/answers/:answerId/comments/:commentId', deleteComment);

export default router;
