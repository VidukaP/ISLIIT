import { Question } from '../models/question.model.mjs';
import { Answer } from '../models/answer.model.mjs';
import mongoose from 'mongoose';

// ==================== Question Controllers ====================

export const createQuestion = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const userId = req.userId;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required',
      });
    }

    const question = await Question.create({
      title,
      description,
      tags: tags || [],
      askedBy: userId,
    });

    // Populate user info
    await question.populate('askedBy', '_id username email avatar');

    res.status(201).json({
      success: true,
      data: question,
      message: 'Question created successfully',
    });
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllQuestions = async (req, res) => {
  try {
    const { search, sort = 'newest', page = 1, limit = 10, tag } = req.query;

    let filter = {};

    // Search by title, description, or tags
    if (search) {
      filter = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
        ],
      };
    }

    // Filter by tag
    if (tag) {
      filter.tags = tag;
    }

    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'popular':
        sortOption = { 'votes.totalVotes': -1, createdAt: -1 };
        break;
      case 'unanswered':
        filter.answerCount = 0;
        sortOption = { createdAt: -1 };
        break;
      case 'mostAnswered':
        sortOption = { answerCount: -1, createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    const questions = await Question.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('askedBy', '_id username email avatar')
      .populate('bestAnswerId');

    const totalQuestions = await Question.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: questions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalQuestions / limit),
        totalQuestions,
      },
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    // Check if it's a connection timeout error
    if (error.message?.includes('buffering timed out') || error.message?.includes('connection')) {
      return res.status(503).json({
        success: false,
        message: 'Database service temporarily unavailable. Please try again in a few moments.',
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch questions',
    });
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const { questionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID',
      });
    }

    const question = await Question.findByIdAndUpdate(
      questionId,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('askedBy', '_id username email avatar')
      .populate('bestAnswerId');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    // Get all answers for this question
    const answers = await Answer.find({ questionId })
      .populate('answeredBy', 'username email avatar')
      .sort({ isBestAnswer: -1, 'votes.totalVotes': -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        question,
        answers,
      },
    });
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { title, description, tags } = req.body;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID',
      });
    }

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    // Check if user is the question asker or admin
    if (question.askedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this question',
      });
    }

    if (title) question.title = title;
    if (description) question.description = description;
    if (tags) question.tags = tags;

    await question.save();
    await question.populate('askedBy', '_id username email avatar');

    res.status(200).json({
      success: true,
      data: question,
      message: 'Question updated successfully',
    });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID',
      });
    }

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    // Check if user is the question asker or admin
    if (question.askedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this question',
      });
    }

    // Delete all answers related to this question
    await Answer.deleteMany({ questionId });

    await Question.findByIdAndDelete(questionId);

    res.status(200).json({
      success: true,
      message: 'Question and its answers deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== Answer Controllers ====================

export const createAnswer = async (req, res) => {
  try {
    const { questionId, content } = req.body;
    const userId = req.userId;

    if (!questionId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Question ID and content are required',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID',
      });
    }

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    // Create answer
    const answer = await Answer.create({
      questionId,
      content,
      answeredBy: userId,
    });

    // Increment answer count
    question.answerCount += 1;
    await question.save();

    await answer.populate('answeredBy', 'username email avatar');

    res.status(201).json({
      success: true,
      data: answer,
      message: 'Answer created successfully',
    });
  } catch (error) {
    console.error('Error creating answer:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(answerId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid answer ID',
      });
    }

    const answer = await Answer.findById(answerId);

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found',
      });
    }

    // Check if user is the answer author
    if (answer.answeredBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this answer',
      });
    }

    if (content) answer.content = content;

    await answer.save();
    await answer.populate('answeredBy', 'username email avatar');

    res.status(200).json({
      success: true,
      data: answer,
      message: 'Answer updated successfully',
    });
  } catch (error) {
    console.error('Error updating answer:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(answerId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid answer ID',
      });
    }

    const answer = await Answer.findById(answerId);

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found',
      });
    }

    // Check if user is the answer author
    if (answer.answeredBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this answer',
      });
    }

    const questionId = answer.questionId;

    // Update question's answer count and best answer if this was the best
    const question = await Question.findById(questionId);
    if (question) {
      question.answerCount -= 1;
      if (answer.isBestAnswer) {
        question.bestAnswerId = null;
      }
      await question.save();
    }

    await Answer.findByIdAndDelete(answerId);

    res.status(200).json({
      success: true,
      message: 'Answer deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting answer:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== Voting Controllers ====================

export const upvoteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const userId = req.userId; // Already a string

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID',
      });
    }

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    // Remove from downvotes if exists
    const downvoteIndex = question.votes.downvotes.indexOf(userId);
    if (downvoteIndex > -1) {
      question.votes.downvotes.splice(downvoteIndex, 1);
      question.votes.totalVotes += 1;
    }

    // Add to upvotes if not already there
    if (!question.votes.upvotes.includes(userId)) {
      question.votes.upvotes.push(userId);
      if (downvoteIndex === -1) {
        question.votes.totalVotes += 1;
      }
    } else {
      // Remove upvote
      const upvoteIndex = question.votes.upvotes.indexOf(userId);
      question.votes.upvotes.splice(upvoteIndex, 1);
      question.votes.totalVotes -= 1;
    }

    await question.save();

    res.status(200).json({
      success: true,
      data: question,
      message: 'Vote updated successfully',
    });
  } catch (error) {
    console.error('Error upvoting question:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const upvoteAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;
    const userId = req.userId; // Already a string

    if (!mongoose.Types.ObjectId.isValid(answerId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid answer ID',
      });
    }

    const answer = await Answer.findById(answerId);

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found',
      });
    }

    // Remove from downvotes if exists
    const downvoteIndex = answer.votes.downvotes.indexOf(userId);
    if (downvoteIndex > -1) {
      answer.votes.downvotes.splice(downvoteIndex, 1);
      answer.votes.totalVotes += 1;
    }

    // Add to upvotes if not already there
    if (!answer.votes.upvotes.includes(userId)) {
      answer.votes.upvotes.push(userId);
      if (downvoteIndex === -1) {
        answer.votes.totalVotes += 1;
      }
    } else {
      // Remove upvote
      const upvoteIndex = answer.votes.upvotes.indexOf(userId);
      answer.votes.upvotes.splice(upvoteIndex, 1);
      answer.votes.totalVotes -= 1;
    }

    await answer.save();

    res.status(200).json({
      success: true,
      data: answer,
      message: 'Vote updated successfully',
    });
  } catch (error) {
    console.error('Error upvoting answer:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== Best Answer Controllers ====================

export const markBestAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(answerId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid answer ID',
      });
    }

    const answer = await Answer.findById(answerId);

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found',
      });
    }

    const question = await Question.findById(answer.questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    // Check if user is the question asker
    if (question.askedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the question asker can mark the best answer',
      });
    }

    // Unmark previous best answer
    if (question.bestAnswerId) {
      const previousBestAnswer = await Answer.findById(question.bestAnswerId);
      if (previousBestAnswer) {
        previousBestAnswer.isBestAnswer = false;
        await previousBestAnswer.save();
      }
    }

    // Mark current as best
    answer.isBestAnswer = true;
    question.bestAnswerId = answerId;

    await answer.save();
    await question.save();

    await answer.populate('answeredBy', 'username email avatar');

    res.status(200).json({
      success: true,
      data: answer,
      message: 'Answer marked as best successfully',
    });
  } catch (error) {
    console.error('Error marking best answer:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== Comment Controllers ====================

export const addComment = async (req, res) => {
  try {
    const { answerId, content } = req.body;
    const userId = req.userId;

    if (!answerId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Answer ID and content are required',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(answerId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid answer ID',
      });
    }

    const answer = await Answer.findById(answerId);

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found',
      });
    }

    answer.comments.push({
      content,
      userId,
    });

    await answer.save();
    await answer.populate('answeredBy', 'username email avatar');

    res.status(201).json({
      success: true,
      data: answer,
      message: 'Comment added successfully',
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { answerId, commentId } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(answerId) || !mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid answer or comment ID',
      });
    }

    const answer = await Answer.findById(answerId);

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found',
      });
    }

    const commentIndex = answer.comments.findIndex((c) => c._id.toString() === commentId);

    if (commentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check if user is the comment author
    if (answer.comments[commentIndex].userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this comment',
      });
    }

    answer.comments.splice(commentIndex, 1);
    await answer.save();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
