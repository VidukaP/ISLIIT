<template>
  <AdminLayout>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Back Button -->
        <RouterLink to="/kuppi-sessions/qa" class="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2 mb-6">
          <ChevronRightIcon class="w-5 h-5 rotate-180" />
          Back to Questions
        </RouterLink>

        <!-- Loading State -->
        <div v-if="qaStore.loading && !currentQuestion" class="text-center py-12">
          <div class="inline-flex items-center justify-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p class="text-gray-600 dark:text-gray-400 mt-4">Loading question...</p>
        </div>

        <!-- Error State -->
        <div v-if="qaStore.error && !currentQuestion" class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {{ qaStore.error }}
        </div>

        <!-- Question Content -->
        <div v-if="currentQuestion" class="space-y-8">
          <!-- Question Card -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <!-- Title and Tags -->
            <div class="mb-4">
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {{ currentQuestion.title }}
              </h1>

              <div v-if="currentQuestion.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
                <span
                  v-for="tag in currentQuestion.tags"
                  :key="tag"
                  class="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- Description -->
            <div class="prose prose-sm dark:prose-invert max-w-none mb-6">
              <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {{ currentQuestion.description }}
              </p>
            </div>

            <!-- Stats and Actions Footer -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div class="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div class="flex items-center gap-1">
                  <span class="font-semibold text-gray-900 dark:text-white">{{ currentQuestion.votes.totalVotes }}</span>
                  {{ currentQuestion.votes.totalVotes === 1 ? 'vote' : 'votes' }}
                </div>
                <div class="flex items-center gap-1">
                  <span class="font-semibold text-gray-900 dark:text-white">{{ currentQuestion.views }}</span>
                  {{ currentQuestion.views === 1 ? 'view' : 'views' }}
                </div>
              </div>

              <div class="flex items-center gap-2">
                <span class="text-gray-600 dark:text-gray-400">
                  Asked by
                  <span class="font-semibold text-gray-900 dark:text-white">{{ currentQuestion.askedBy?.username }}</span>
                </span>
                <span class="text-gray-500">{{ formatDate(currentQuestion.createdAt) }}</span>
              </div>
            </div>

            <!-- Vote Button and Actions -->
            <div class="mt-6 flex gap-3">
              <button
                @click="handleUpvoteQuestion"
                :disabled="qaStore.loading"
                class="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                :class="{ 'bg-blue-50 dark:bg-blue-900/20 border-blue-500': isQuestionUpvoted }"
              >
                <span class="text-2xl">👍</span>
                {{ currentQuestion.votes.totalVotes }}
              </button>

              <!-- Edit Button (only for question creator) -->
              <button
                v-if="isQuestionAsker"
                @click="handleEditQuestion"
                :disabled="qaStore.loading"
                class="px-4 py-2 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-50"
              >
                Edit
              </button>

              <!-- Delete Button (only for question creator) -->
              <button
                v-if="isQuestionAsker"
                @click="handleDeleteQuestion"
                :disabled="qaStore.loading"
                class="px-4 py-2 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>

          <!-- Answers Section -->
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {{ currentQuestion.answerCount }} {{ currentQuestion.answerCount === 1 ? 'Answer' : 'Answers' }}
            </h2>

            <!-- Answers List -->
            <div class="space-y-6">
              <div
                v-for="answer in answers"
                :key="answer._id"
                class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8"
                :class="{ 'border-2 border-green-500': answer.isBestAnswer }"
              >
                <!-- Best Answer Badge -->
                <div v-if="answer.isBestAnswer" class="flex items-center gap-2 mb-4 pb-4 border-b border-green-200 dark:border-green-900">
                  <CheckIcon class="w-5 h-5 text-green-600" />
                  <span class="text-green-600 font-semibold">Best Answer</span>
                </div>

                <!-- Answer Content -->
                <div class="prose prose-sm dark:prose-invert max-w-none mb-4">
                  <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {{ answer.content }}
                  </p>
                </div>

                <!-- Answer Meta -->
                <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 py-4 border-t border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <span class="font-semibold text-gray-900 dark:text-white">{{ answer.answeredBy?.username }}</span>
                    answered {{ formatDate(answer.createdAt) }}
                  </div>
                </div>

                <!-- Vote and Actions -->
                <div class="mt-4 flex items-center gap-3">
                  <button
                    @click="handleUpvoteAnswer(answer._id)"
                    :disabled="qaStore.loading"
                    class="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    :class="{ 'bg-blue-50 dark:bg-blue-900/20 border-blue-500': isAnswerUpvoted(answer._id) }"
                  >
                    <span class="text-2xl">👍</span>
                    {{ answer.votes.totalVotes }}
                  </button>

                  <!-- Mark as Best Answer Button (only for question asker) -->
                  <button
                    v-if="isQuestionAsker && !answer.isBestAnswer"
                    @click="handleMarkBestAnswer(answer._id)"
                    :disabled="qaStore.loading"
                    class="px-4 py-2 border border-green-500 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors disabled:opacity-50"
                  >
                    Mark as Best
                  </button>

                  <!-- Delete Button (only for answer author) -->
                  <button
                    v-if="isAnswerAuthor(answer.answeredBy?._id)"
                    @click="handleDeleteAnswer(answer._id)"
                    :disabled="qaStore.loading"
                    class="ml-auto px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>

                <!-- Comments Section -->
                <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 class="font-semibold text-gray-900 dark:text-white mb-4">
                    Comments ({{ answer.comments.length }})
                  </h4>

                  <!-- Comments List -->
                  <div v-if="answer.comments.length > 0" class="space-y-3 mb-4">
                    <div
                      v-for="comment in answer.comments"
                      :key="comment._id"
                      class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg"
                    >
                      <div class="flex items-start justify-between mb-2">
                        <div class="text-sm">
                          <span class="font-semibold text-gray-900 dark:text-white">
                            {{ comment.userId.username }}
                          </span>
                          <span class="text-gray-500 ml-2 text-xs">
                            {{ formatDate(comment.createdAt) }}
                          </span>
                        </div>
                        <button
                          v-if="isCommentAuthor(comment.userId)"
                          @click="handleDeleteComment(answer._id, comment._id)"
                          class="text-red-600 dark:text-red-400 hover:underline text-sm"
                        >
                          Delete
                        </button>
                      </div>
                      <p class="text-gray-700 dark:text-gray-300 text-sm">
                        {{ comment.content }}
                      </p>
                    </div>
                  </div>

                  <!-- Add Comment Form -->
                  <div class="flex gap-2">
                    <input
                      v-model="commentText[answer._id]"
                      type="text"
                      placeholder="Add a comment..."
                      class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                    />
                    <button
                      @click="handleAddComment(answer._id)"
                      :disabled="!commentText[answer._id]?.trim() || qaStore.loading"
                      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Answers -->
            <div v-if="answers.length === 0 && !qaStore.loading" class="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <ChatIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-600 dark:text-gray-400 mb-6">
                No answers yet. Be the first to answer this question!
              </p>
            </div>
          </div>

          <!-- Answer Form -->
          <div v-if="!qaStore.loading || answers.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Your Answer
            </h3>

            <form @submit.prevent="handleSubmitAnswer" class="space-y-4">
              <textarea
                v-model="answerContent"
                placeholder="Share your answer here... (minimum 20 characters)"
                rows="6"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                :class="{ 'border-red-500': answerError }"
              />

              <p v-if="answerError" class="text-red-600 dark:text-red-400 text-sm">
                {{ answerError }}
              </p>

              <button
                type="submit"
                :disabled="qaStore.loading || !answerContent.trim() || answerContent.length < 20"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {{ qaStore.loading ? 'Submitting...' : 'Post Your Answer' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useQAStore } from '@/store/qaStore';
import { useAuthUser, refreshAuthUser } from '@/composables/useAuthUser';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import ChevronRightIcon from '@/icons/ChevronRightIcon.vue';
import CheckIcon from '@/icons/CheckIcon.vue';
import ChatIcon from '@/icons/ChatIcon.vue';

const route = useRoute();
const router = useRouter();
const qaStore = useQAStore();
const { authUser } = useAuthUser();

const questionId = route.params.questionId as string;
const answerContent = ref('');
const answerError = ref('');
const commentText = ref<{ [key: string]: string }>({});

const currentQuestion = computed(() => qaStore.currentQuestion);
const answers = computed(() => qaStore.answers);

const isQuestionAsker = computed(() => {
  const qId = currentQuestion.value?.askedBy?._id;
  const uId = authUser.value?._id;
  return !!(qId && uId && qId === uId);
});

const isQuestionUpvoted = computed(() => {
  const userIdStr = authUser.value?._id;
  return currentQuestion.value?.votes?.upvotes.some((id: any) => id === userIdStr) || false;
});

const isAnswerAuthor = (authorId: string) => {
  return authorId === authUser.value?._id;
};

const isAnswerUpvoted = (answerId: string) => {
  const answer = answers.value.find((a) => a._id === answerId);
  const userIdStr = authUser.value?._id;
  return answer?.votes?.upvotes.some((id: any) => id === userIdStr) || false;
};

const isCommentAuthor = (userId: any) => {
  return userId === authUser.value?._id;
};

const formatDate = (date: string) => {
  const d = new Date(date);
  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
    Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    'day'
  );
};

const handleUpvoteQuestion = async () => {
  try {
    await qaStore.upvoteQuestion(questionId);
  } catch (error) {
    console.error('Failed to upvote question:', error);
  }
};

const handleEditQuestion = async () => {
  // Future: Navigate to edit page or open edit modal
  // For now, show a message
  console.log('Edit question:', questionId);
  // TODO: Implement question edit functionality
};

const handleDeleteQuestion = async () => {
  if (confirm('Are you sure you want to delete this question? This will also delete all answers and comments.')) {
    try {
      await qaStore.deleteQuestion(questionId);
      // Navigate back to QA page after deletion
      router.push('/kuppi-sessions/qa');
    } catch (error) {
      console.error('Failed to delete question:', error);
    }
  }
};

const handleUpvoteAnswer = async (answerId: string) => {
  try {
    await qaStore.upvoteAnswer(answerId);
  } catch (error) {
    console.error('Failed to upvote answer:', error);
  }
};

const handleMarkBestAnswer = async (answerId: string) => {
  try {
    await qaStore.markBestAnswer(answerId);
  } catch (error) {
    console.error('Failed to mark best answer:', error);
  }
};

const handleDeleteAnswer = async (answerId: string) => {
  if (confirm('Are you sure you want to delete this answer?')) {
    try {
      await qaStore.deleteAnswer(answerId);
    } catch (error) {
      console.error('Failed to delete answer:', error);
    }
  }
};

const handleAddComment = async (answerId: string) => {
  const comment = commentText.value[answerId]?.trim();
  if (!comment) return;

  try {
    await qaStore.addComment(answerId, comment);
    commentText.value[answerId] = '';
  } catch (error) {
    console.error('Failed to add comment:', error);
  }
};

const handleDeleteComment = async (answerId: string, commentId: string) => {
  if (confirm('Are you sure you want to delete this comment?')) {
    try {
      await qaStore.deleteComment(answerId, commentId);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  }
};

const handleSubmitAnswer = async () => {
  answerError.value = '';

  if (!answerContent.value.trim()) {
    answerError.value = 'Answer cannot be empty';
    return;
  }

  if (answerContent.value.length < 20) {
    answerError.value = 'Answer must be at least 20 characters';
    return;
  }

  try {
    await qaStore.createAnswer({
      questionId,
      content: answerContent.value.trim(),
    });
    answerContent.value = '';
  } catch (error: any) {
    answerError.value = error.message || 'Failed to post answer. Please try again.';
  }
};

onMounted(async () => {
  refreshAuthUser();
  await qaStore.fetchQuestionDetails(questionId);
});
</script>
