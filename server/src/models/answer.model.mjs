import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Please provide comment content'],
      minlength: [3, 'Comment must have at least 3 characters'],
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide answer content'],
      minlength: [20, 'Answer must have at least 20 characters'],
    },
    answeredBy: {
      type: String,
      required: true,
    },
    votes: {
      upvotes: [
        {
          type: String,
        },
      ],
      downvotes: [
        {
          type: String,
        },
      ],
      totalVotes: {
        type: Number,
        default: 0,
      },
    },
    isBestAnswer: {
      type: Boolean,
      default: false,
    },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

// Index for sorting by votes and date
answerSchema.index({ questionId: 1, 'votes.totalVotes': -1, createdAt: -1 });
answerSchema.index({ answeredBy: 1, createdAt: -1 });

export const Answer = mongoose.model('Answer', answerSchema);
