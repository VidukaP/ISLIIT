<template>
  <AdminLayout>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Questions & Answers</h1>
              <p class="text-gray-600 dark:text-gray-400 mt-2">
                Ask questions and get answers from your peers
              </p>
            </div>
            <RouterLink
              to="/kuppi-sessions/qa/create"
              class="inline-flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <PlusIcon class="w-5 h-5 mr-2" />
              Ask Question
            </RouterLink>
          </div>
        </div>

        <!-- Search and Filter Section -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Search Input -->
            <div class="md:col-span-2">
              <input
                v-model="qaStore.searchQuery"
                type="text"
                placeholder="Search questions..."
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                @input="handleSearch"
              />
            </div>

            <!-- Sort Dropdown -->
            <div>
              <select
                v-model="qaStore.sortBy"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                @change="handleSort"
              >
                <option value="newest">Newest</option>
                <option value="popular">Popular</option>
                <option value="unanswered">Unanswered</option>
                <option value="mostAnswered">Most Answered</option>
              </select>
            </div>
          </div>

          <!-- Clear Filters Button -->
          <div class="mt-4">
            <button
              @click="handleClearFilters"
              class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="qaStore.loading && questions.length === 0" class="text-center py-12">
          <div class="inline-flex items-center justify-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p class="text-gray-600 dark:text-gray-400 mt-4">Loading questions...</p>
        </div>

        <!-- Error State -->
        <div v-if="qaStore.error" class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
          {{ qaStore.error }}
        </div>

        <!-- Questions List -->
        <div v-if="!qaStore.loading && questions.length > 0" class="space-y-4">
          <div
            v-for="question in questions"
            :key="question._id"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <RouterLink
              :to="`/kuppi-sessions/qa/${question._id}`"
              class="group"
            >
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {{ question.title }}
              </h3>
            </RouterLink>

            <p class="text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
              {{ question.description }}
            </p>

            <!-- Tags -->
            <div v-if="question.tags.length > 0" class="flex flex-wrap gap-2 mt-3">
              <span
                v-for="tag in question.tags"
                :key="tag"
                class="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full"
              >
                {{ tag }}
              </span>
            </div>

            <!-- Stats Footer -->
            <div class="flex flex-wrap items-center gap-6 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
              <div class="flex items-center gap-2">
                <span class="font-semibold text-gray-900 dark:text-white">{{ question.votes.totalVotes }}</span>
                <span>{{ question.votes.totalVotes === 1 ? 'Vote' : 'Votes' }}</span>
              </div>

              <div class="flex items-center gap-2">
                <span class="font-semibold text-gray-900 dark:text-white">{{ question.answerCount }}</span>
                <span>{{ question.answerCount === 1 ? 'Answer' : 'Answers' }}</span>
              </div>

              <div class="flex items-center gap-2">
                <span class="font-semibold text-gray-900 dark:text-white">{{ question.views }}</span>
                <span>{{ question.views === 1 ? 'View' : 'Views' }}</span>
              </div>

              <div class="ml-auto text-gray-500 dark:text-gray-500">
                Asked by
                <span class="font-semibold text-gray-900 dark:text-white">{{ question.askedBy?.username }}</span>
                {{ formatDate(question.createdAt) }}
              </div>
            </div>

            <!-- Best Answer Badge -->
            <div v-if="question.bestAnswerId" class="mt-4 flex items-center gap-2">
              <CheckIcon class="w-5 h-5 text-green-600" />
              <span class="text-sm text-green-600 font-medium">Has best answer</span>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!qaStore.loading && questions.length === 0" class="text-center py-12">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
            <ChatIcon class="w-8 h-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ searchQuery ? 'No questions found' : 'No questions yet' }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ searchQuery
              ? 'Try adjusting your search terms'
              : 'Be the first to ask a question!' }}
          </p>
          <RouterLink
            v-if="!searchQuery"
            to="/kuppi-sessions/qa/create"
            class="inline-flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Ask the first question
          </RouterLink>
        </div>

        <!-- Pagination -->
        <div v-if="!qaStore.loading && questions.length > 0" class="flex items-center justify-center gap-4 mt-8">
          <button
            :disabled="pagination.currentPage === 1"
            @click="prevPage"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Previous
          </button>

          <div class="text-gray-600 dark:text-gray-400">
            Page {{ pagination.currentPage }} of {{ pagination.totalPages }}
          </div>

          <button
            :disabled="pagination.currentPage === pagination.totalPages"
            @click="nextPage"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useQAStore } from '@/store/qaStore';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import PlusIcon from '@/icons/PlusIcon.vue';
import ChatIcon from '@/icons/ChatIcon.vue';
import CheckIcon from '@/icons/CheckIcon.vue';

const qaStore = useQAStore();
const currentPage = ref(1);

const questions = computed(() => qaStore.questions);
const pagination = computed(() => qaStore.pagination);
const searchQuery = computed(() => qaStore.searchQuery);

const formatDate = (date: string) => {
  const d = new Date(date);
  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
    Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    'day'
  );
};

const handleSearch = async () => {
  currentPage.value = 1;
  await qaStore.fetchQuestions(1, 10);
};

const handleSort = async () => {
  currentPage.value = 1;
  await qaStore.fetchQuestions(1, 10);
};

const handleClearFilters = async () => {
  qaStore.resetFilters();
  currentPage.value = 1;
  await qaStore.fetchQuestions(1, 10);
};

const nextPage = async () => {
  if (currentPage.value < pagination.value.totalPages) {
    currentPage.value++;
    await qaStore.fetchQuestions(currentPage.value, 10);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const prevPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    await qaStore.fetchQuestions(currentPage.value, 10);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

onMounted(async () => {
  await qaStore.fetchQuestions(1, 10);
});
</script>
