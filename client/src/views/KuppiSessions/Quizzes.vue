<template>
  <AdminLayout>
    <div class="p-6">
      <!-- Header Section -->
      <div class="mb-8">
        <router-link
          to="/kuppi-sessions/study-materials"
          class="inline-flex items-center text-brand-600 hover:text-brand-700 font-medium mb-4 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Study Materials
        </router-link>

        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Quizzes</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">{{ quizzes.length }} {{ quizzes.length === 1 ? 'quiz' : 'quizzes' }} available</p>
          </div>
          <button
            @click="showUploadModal = true"
            class="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Upload Material
          </button>
        </div>
        <div class="h-1 w-20 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full mt-4"></div>
      </div>

      <!-- Filters & Sort Bar -->
      <div class="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div class="flex gap-2">
          <button
            @click="sortBy = 'newest'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all',
              sortBy === 'newest'
                ? 'bg-brand-500 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
            ]"
          >
            Newest
          </button>
          <button
            @click="sortBy = 'oldest'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all',
              sortBy === 'oldest'
                ? 'bg-brand-500 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
            ]"
          >
            Oldest
          </button>
          <button
            @click="sortBy = 'mostAttempted'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all',
              sortBy === 'mostAttempted'
                ? 'bg-brand-500 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
            ]"
          >
            Most Attempted
          </button>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ new Date().toLocaleDateString() }}</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="text-center">
          <svg class="animate-spin w-12 h-12 text-brand-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p class="text-gray-500 dark:text-gray-400">Loading quizzes...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="sortedQuizzes.length === 0" class="flex justify-center items-center h-64">
        <div class="text-center">
          <svg class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No quizzes yet</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">Upload a lecture material to generate quizzes automatically</p>
          <button
            @click="showUploadModal = true"
            class="inline-flex items-center px-6 py-3 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-all"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Upload Material
          </button>
        </div>
      </div>

      <!-- Quizzes Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link
          v-for="quiz in sortedQuizzes"
          :key="quiz._id"
          :to="`/kuppi-sessions/quizzes/${quiz._id}`"
          class="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    getDifficultyColor(quiz.difficulty)
                  ]"
                >
                  {{ quiz.difficulty }}
                </span>
                <span v-if="quiz.generatedBy === 'automatic'" class="px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  Auto-Generated
                </span>
              </div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-600 transition-colors">
                {{ quiz.title }}
              </h3>
            </div>
          </div>

          <!-- Description -->
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {{ quiz.description }}
          </p>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-3 mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div class="text-center">
              <p class="text-xs text-gray-500 dark:text-gray-400">Questions</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">{{ quiz.questions.length }}</p>
            </div>
            <div class="text-center">
              <p class="text-xs text-gray-500 dark:text-gray-400">Attempts</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">{{ quiz.totalAttempts || 0 }}</p>
            </div>
            <div class="text-center">
              <p class="text-xs text-gray-500 dark:text-gray-400">Avg Score</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">{{ quiz.averageScore || 0 }}%</p>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="quiz.tags && quiz.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="(tag, idx) in quiz.tags.slice(0, 2)"
              :key="idx"
              class="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              {{ tag }}
            </span>
          </div>

          <!-- CTA -->
          <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(quiz.createdAt) }}</span>
            <svg class="w-5 h-5 text-brand-500 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Upload Modal -->
    <transition name="fade">
      <div
        v-if="showUploadModal"
        class="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="showUploadModal = false"
      >
        <div class="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Upload Lecture Material</h2>
            <button
              @click="showUploadModal = false"
              class="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Content -->
          <form @submit.prevent="handleUpload" class="px-6 py-5 space-y-4">
            <!-- Error Alert -->
            <div
              v-if="uploadError"
              class="px-4 py-3 rounded-lg bg-error-50 border border-error-200 text-error-700 text-sm dark:bg-error-900/20"
            >
              {{ uploadError }}
            </div>

            <!-- Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Material Title <span class="text-error-500">*</span>
              </label>
              <input
                v-model="uploadForm.title"
                type="text"
                placeholder="e.g. Python Programming Fundamentals"
                class="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                required
              />
            </div>

            <!-- File Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Upload File <span class="text-error-500">*</span>
              </label>
              <div
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleFileDrop"
                :class="[
                  'relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
                  isDragging
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-brand-500'
                ]"
              >
                <input
                  ref="fileInput"
                  type="file"
                  @change="handleFileSelect"
                  class="hidden"
                  accept=".pdf,.docx,.doc,.txt"
                  required
                />
                <svg class="w-10 h-10 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ uploadForm.fileName ? uploadForm.fileName : 'Drag and drop your file here, or click to select' }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Supported: PDF, DOCX, DOC, TXT (Max 50MB)
                </p>
                <button
                  type="button"
                  @click="$refs.fileInput?.click()"
                  class="mt-3 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Select File
                </button>
              </div>
            </div>

            <!-- Number of Questions -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Generate Questions (optional)
              </label>
              <select
                v-model="uploadForm.questionCount"
                class="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              >
                <option value="5">5 Questions</option>
                <option value="10">10 Questions</option>
                <option value="15">15 Questions</option>
                <option value="20">20 Questions</option>
              </select>
            </div>

            <!-- Info Box -->
            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p class="text-xs text-blue-700 dark:text-blue-300">
                <svg class="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 10-2 0 1 1 0 002 0zM8 8a1 1 0 000 2h6a1 1 0 100-2H8zm0 3a1 1 0 100 2h3a1 1 0 100-2H8z" clip-rule="evenodd" />
                </svg>
                Upload a lecture material to automatically generate quiz questions from its content.
              </p>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                @click="showUploadModal = false"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="uploadSubmitting || !uploadForm.fileName || !uploadForm.title"
                class="px-5 py-2 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
              >
                <svg v-if="uploadSubmitting" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                {{ uploadSubmitting ? "Processing..." : "Generate Quiz" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from "vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import { useQuizzesStore } from "@/store/quizzesStore";

const { quizzes, loading, fetchQuizzes, generateQuizFromMaterial } = useQuizzesStore();

const showUploadModal = ref(false);
const isDragging = ref(false);
const uploadSubmitting = ref(false);
const uploadError = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const sortBy = ref("newest");

const uploadForm = reactive({
  title: "",
  fileName: "",
  fileData: "",
  questionCount: "5",
});

const sortedQuizzes = computed(() => {
  const sorted = [...quizzes.value];
  
  if (sortBy.value === "newest") {
    sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sortBy.value === "oldest") {
    sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else if (sortBy.value === "mostAttempted") {
    sorted.sort((a, b) => (b.totalAttempts || 0) - (a.totalAttempts || 0));
  }
  
  return sorted;
});

const getDifficultyColor = (difficulty: string) => {
  const colors = {
    easy: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    medium: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
    hard: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  };
  return colors[difficulty] || colors.medium;
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    processFile(file);
  }
};

const handleFileDrop = (event: DragEvent) => {
  isDragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) {
    processFile(file);
  }
};

const processFile = async (file: File) => {
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    uploadError.value = "File size exceeds 50MB limit";
    return;
  }

  const validTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/plain",
  ];

  if (!validTypes.includes(file.type)) {
    uploadError.value = "Invalid file type. Supported: PDF, DOCX, DOC, TXT";
    return;
  }

  uploadForm.fileName = file.name;
  uploadError.value = null;

  // Read file as base64
  const reader = new FileReader();
  reader.onload = (e) => {
    const result = e.target?.result as string;
    uploadForm.fileData = result.split(",")[1]; // Remove data:application/pdf;base64, prefix
  };
  reader.readAsDataURL(file);
};

const handleUpload = async () => {
  if (!uploadForm.title.trim() || !uploadForm.fileName) {
    uploadError.value = "Please fill in all required fields";
    return;
  }

  uploadSubmitting.value = true;
  uploadError.value = null;

  console.log('[Quizzes] Uploading material and generating quiz...');
  const result = await generateQuizFromMaterial(
    "material-" + Date.now(),
    uploadForm.title.trim(),
    uploadForm.fileData,
    uploadForm.fileName
  );

  uploadSubmitting.value = false;

  if (result) {
    console.log('[Quizzes] Quiz generated successfully, ID:', result._id);
    showUploadModal.value = false;
    // Reset form
    uploadForm.title = "";
    uploadForm.fileName = "";
    uploadForm.fileData = "";
    uploadForm.questionCount = "5";
    
    // Refresh the quiz list after generation
    console.log('[Quizzes] Refreshing quiz list...');
    await fetchQuizzes();
    
    alert("Quiz generated successfully!");
  } else {
    uploadError.value = "Failed to generate quiz. Please try again.";
    console.error('[Quizzes] Error generating quiz');
  }
};

onMounted(() => {
  console.log('[Quizzes] Component mounted, fetching quizzes...');
  fetchQuizzes();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
