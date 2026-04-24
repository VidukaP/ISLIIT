import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a question title'],
      trim: true,
      maxlength: [200, 'Question title cannot exceed 200 characters'],
      minlength: [10, 'Question title must have at least 10 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a question description'],
      minlength: [20, 'Description must have at least 20 characters'],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    askedBy: {
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
    views: {
      type: Number,
      default: 0,
    },
    answerCount: {
      type: Number,
      default: 0,
    },
    bestAnswerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Answer',
      default: null,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search and sorting
questionSchema.index({ title: 'text', description: 'text' });
questionSchema.index({ tags: 1 });
questionSchema.index({ askedBy: 1, createdAt: -1 });
questionSchema.index({ 'votes.totalVotes': -1, createdAt: -1 });

export const Question = mongoose.model('Question', questionSchema);
