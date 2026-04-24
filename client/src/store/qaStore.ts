import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Helper to get auth token/userId from localStorage
const getAuthHeaders = () => {
  const authUserStr = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
  if (!authUserStr) {
    return {};
  }
  try {
    const authUser = JSON.parse(authUserStr);
    // Try different possible ID fields
    const userId = authUser._id || authUser.id || authUser.student_id || authUser.faculty_id;
    if (userId) {
      return { 'x-user-id': userId };
    }
  } catch (e) {
    console.error('Failed to parse auth user:', e);
  }
  return {};
};

// Create axios instance with default headers
const apiClient = axios.create({
  baseURL: API_URL,
});

// Add interceptor to include auth headers in all requests
apiClient.interceptors.request.use((config) => {
  const headers = getAuthHeaders();
  if (headers['x-user-id']) {
    config.headers['x-user-id'] = headers['x-user-id'];
  }
  return config;
});

// Type definitions
interface Vote {
  upvotes: string[];
  downvotes: string[];
  totalVotes: number;
}

interface Question {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  askedBy: { _id: string; username: string; email: string; avatar?: string };
  votes: Vote;
  views: number;
  answerCount: number;
  bestAnswerId?: string;
  isClosed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  _id: string;
  content: string;
  userId: { _id: string; username: string; email: string };
  createdAt: string;
}

interface Answer {
  _id: string;
  questionId: string;
  content: string;
  answeredBy: { _id: string; username: string; email: string };
  votes: Vote;
  isBestAnswer: boolean;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalQuestions: number;
}

export const useQAStore = defineStore('qa', () => {
  // State
  const questions = ref<Question[]>([]);
  const currentQuestion = ref<Question | null>(null);
  const answers = ref<Answer[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref<Pagination>({ currentPage: 1, totalPages: 1, totalQuestions: 0 });
  const searchQuery = ref('');
  const sortBy = ref('newest');
  const selectedTag = ref<string | null>(null);

  // Computed
  const questionsCount = computed(() => questions.value.length);
  const filteredQuestions = computed(() => {
    if (!searchQuery.value && !selectedTag.value) {
      return questions.value;
    }
    return questions.value.filter((q: Question) => {
      const matchesSearch =
        !searchQuery.value ||
        q.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        q.description.toLowerCase().includes(searchQuery.value.toLowerCase());
      const matchesTag = !selectedTag.value || q.tags.includes(selectedTag.value);
      return matchesSearch && matchesTag;
    });
  });

  // Fetch all questions
  const fetchQuestions = async (page: number = 1, limit: number = 10) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get(`/qa/questions`, {
        params: {
          page,
          limit,
          search: searchQuery.value || undefined,
          sort: sortBy.value,
          tag: selectedTag.value || undefined,
        },
      });
      questions.value = response.data.data;
      pagination.value = response.data.pagination;
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<any>;
      error.value = axiosError.response?.data?.message || 'Failed to fetch questions';
      console.error('Fetch questions error:', axiosError);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Fetch single question with answers
  const fetchQuestionDetails = async (questionId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get(`/qa/questions/${questionId}`);
      currentQuestion.value = response.data.data.question;
      answers.value = response.data.data.answers;
      return response.data.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<any>;
      error.value = axiosError.response?.data?.message || 'Failed to fetch question details';
      console.error('Fetch question details error:', axiosError);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Create question
  const createQuestion = async (questionData: any) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.post(`/qa/questions`, questionData);
      questions.value.unshift(response.data.data);
      return response.data.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<any>;
      error.value = axiosError.response?.data?.message || 'Failed to create question';
      console.error('Create question error:', axiosError);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Update question
  const updateQuestion = async (questionId: string, questionData: any) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.put(`/qa/questions/${questionId}`, questionData);
      const index = questions.value.findIndex((q) => q._id === questionId);
      if (index !== -1) {
        questions.value[index] = response.data.data;
      }
      if (currentQuestion.value?._id === questionId) {
        currentQuestion.value = response.data.data;
      }
      return response.data.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<any>;
      error.value = axiosError.response?.data?.message || 'Failed to update question';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Delete question
  const deleteQuestion = async (questionId: string) => {
    loading.value = true;
    error.value = null;
    try {
      await apiClient.delete(`/qa/questions/${questionId}`);
      questions.value = questions.value.filter((q) => q._id !== questionId);
      if (currentQuestion.value?._id === questionId) {
        currentQuestion.value = null;
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<any>;
      error.value = axiosError.response?.data?.message || 'Failed to delete question';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Create answer
  const createAnswer = async (answerer: any) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.post(`/qa/answers`, answerer);
      answers.value.push(response.data.data);
      if (currentQuestion.value) {
        currentQuestion.value.answerCount += 1;
      }
      return response.data.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<any>;
      error.value = axiosError.response?.data?.message || 'Failed to create answer';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Update answer
  const updateAnswer = async (answerId: string, answerData: any) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.put(`/qa/answers/${answerId}`, answerData);
      const index = answers.value.findIndex((a) => a._id === answerId);
      if (index !== -1) {
        answers.value[index] = response.data.data;
      }
      return response.data.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<any>;
      error.value = axiosError.response?.data?.message || 'Failed to update answer';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Delete answer
  const deleteAnswer = async (answerId: string) => {
    loading.value = true;
    error.value = null;
    try {
      await apiClient.delete(`/qa/answers/${answerId}`);
      answers.value = answers.value.filter((a) => a._id !== answerId);
      if (currentQuestion.value) {
        currentQuestion.value.answerCount -= 1;
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<any>;
      error.value = axiosError.response?.data?.message || 'Failed to delete answer';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Upvote question
  const upvoteQuestion = async (questionId: string) => {
    error.value = null;
    try {
      const response = await apiClient.post(`/qa/questions/${questionId}/upvote`);
      const index = questions.value.findIndex((q) => q._id === questionId);
      if (index !== -1) {
        questions.value[index].votes = response.data.data.votes;
      }
      if (currentQuestion.value?._id === questionId) {
        currentQuestion.value.votes = response.data.data.votes;
      }
      return response.data.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<any>;
      error.value = axiosError.response?.data?.message || 'Failed to upvote question';
      throw err;
    }
  };

  // Upvote answer
  const upvoteAnswer = async (answerId: string) => {
    error.value = null;
    try {
      const response = await apiClient.post(`/qa/answers/${answerId}/upvote`);
      const index = answers.value.findIndex((a) => a._id === answerId);
      if (index !== -1) {
        answers.value[index].votes = response.data.data.votes;
      }
      return response.data.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<any>;
      error.value = axiosError.response?.data?.message || 'Failed to upvote answer';
      throw err;
    }
  };

  // Mark best answer
  const markBestAnswer = async (answerId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.put(`/qa/answers/${answerId}/best-answer`);
      const index = answers.value.findIndex((a) => a._id === answerId);
      if (index !== -1) {
        answers.value.forEach((a) => (a.isBestAnswer = false));
        answers.value[index].isBestAnswer = true;
        // Sort with best answer first
        answers.value.sort((a, b) => {
          if (a.isBestAnswer) return -1;
          if (b.isBestAnswer) return 1;
          return b.votes.totalVotes - a.votes.totalVotes;
        });
      }
      if (currentQuestion.value) {
        currentQuestion.value.bestAnswerId = answerId;
      }
      return response.data.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<any>;
      error.value = axiosError.response?.data?.message || 'Failed to mark best answer';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Add comment
  const addComment = async (answerId: string, content: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.post(`/qa/comments`, {
        answerId,
        content,
      });
      const index = answers.value.findIndex((a) => a._id === answerId);
      if (index !== -1) {
        answers.value[index].comments = response.data.data.comments;
      }
      return response.data.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<any>;
      error.value = axiosError.response?.data?.message || 'Failed to add comment';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Delete comment
  const deleteComment = async (answerId: string, commentId: string) => {
    loading.value = true;
    error.value = null;
    try {
      await apiClient.delete(`/qa/answers/${answerId}/comments/${commentId}`);
      const index = answers.value.findIndex((a) => a._id === answerId);
      if (index !== -1) {
        answers.value[index].comments = answers.value[index].comments.filter(
          (c) => c._id !== commentId
        );
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<any>;
      error.value = axiosError.response?.data?.message || 'Failed to delete comment';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Set search query
  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
  };

  // Set sort
  const setSortBy = (sort: string) => {
    sortBy.value = sort;
  };

  // Set selected tag
  const setSelectedTag = (tag: string | null) => {
    selectedTag.value = tag;
  };

  // Reset filters
  const resetFilters = () => {
    searchQuery.value = '';
    sortBy.value = 'newest';
    selectedTag.value = null;
  };

  return {
    // State
    questions,
    currentQuestion,
    answers,
    loading,
    error,
    pagination,
    searchQuery,
    sortBy,
    selectedTag,

    // Computed
    questionsCount,
    filteredQuestions,

    // Actions
    fetchQuestions,
    fetchQuestionDetails,
    createQuestion,
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
    setSearchQuery,
    setSortBy,
    setSelectedTag,
    resetFilters,
  };
});
