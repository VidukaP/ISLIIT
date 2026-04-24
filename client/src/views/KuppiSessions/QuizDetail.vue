<template>
  <AdminLayout>
    <div class="p-6">
      <!-- Header with Back Button -->
      <router-link
        to="/kuppi-sessions/quizzes"
        class="inline-flex items-center text-brand-600 hover:text-brand-700 font-medium mb-6 transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Quizzes
      </router-link>

      <div v-if="loading" class="flex justify-center items-center h-96">
        <div class="text-center">
          <svg class="animate-spin w-12 h-12 text-brand-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p class="text-gray-500 dark:text-gray-400">Loading quiz...</p>
        </div>
      </div>

      <div v-else-if="!quiz" class="text-center py-12">
        <p class="text-gray-600 dark:text-gray-400 text-lg">Quiz not found</p>
        <p v-if="loadError" class="text-red-600 dark:text-red-400 text-sm mt-2">{{ loadError }}</p>
      </div>

      <!-- Quiz Content -->
      <div v-else>
        <!-- Quiz Header -->
        <div class="mb-8">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ quiz.title }}</h1>
              <p class="text-gray-600 dark:text-gray-400 max-w-2xl">{{ quiz.description }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span
                :class="[
                  'px-4 py-2 rounded-full text-sm font-semibold',
                  getDifficultyColor(quiz.difficulty)
                ]"
              >
                {{ quiz.difficulty }}
              </span>
              <span v-if="quiz.generatedBy === 'automatic'" class="px-4 py-2 rounded-full text-sm font-semibold bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                Auto-Generated
              </span>
            </div>
          </div>
          <div class="h-1 w-20 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full"></div>
        </div>

        <!-- Quiz Info & Previous Attempts -->
        <div v-if="!isQuizAttempt" class="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <p class="text-sm text-gray-600 dark:text-gray-400">Questions</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-1">{{ quiz.questions.length }}</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <p class="text-sm text-gray-600 dark:text-gray-400">Attempts</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-1">{{ quiz.totalAttempts || 0 }}</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <p class="text-sm text-gray-600 dark:text-gray-400">Average Score</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-1">{{ quiz.averageScore || 0 }}%</p>
          </div>
        </div>

        <!-- Quiz Attempt Section -->
        <div v-if="isQuizAttempt" class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <!-- Progress Bar -->
          <div class="h-1 bg-gray-200 dark:bg-gray-700">
            <div
              :style="{ width: (currentQuestionIndex + 1) / quiz.questions.length * 100 + '%' }"
              class="h-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all"
            />
          </div>

          <div class="p-8">
            <!-- Question Counter -->
            <div class="mb-6 flex items-center justify-between">
              <span class="text-sm font-medium text-brand-600">
                Question {{ currentQuestionIndex + 1 }} of {{ quiz.questions.length }}
              </span>
              <button
                @click="toggleQuestionView"
                class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-600 transition-colors"
              >
                {{ showAllQuestions ? "Show One at a Time" : "Show All Questions" }}
              </button>
            </div>

            <!-- Show All Questions View -->
            <div v-if="showAllQuestions">
              <div v-for="(question, qIdx) in quiz.questions" :key="qIdx" class="mb-8 pb-8 last:mb-0 last:pb-0 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-base font-semibold text-gray-900 dark:text-white">{{ qIdx + 1 }}. {{ question.question }}</h3>
                  <span
                    v-if="submittedAnswers[qIdx] !== undefined"
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-medium',
                      answers[qIdx] === question.correctAnswerIndex
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                    ]"
                  >
                    {{ answers[qIdx] === question.correctAnswerIndex ? "Correct" : "Incorrect" }}
                  </span>
                </div>

                <div class="space-y-3">
                  <label
                    v-for="(option, oIdx) in question.options"
                    :key="oIdx"
                    class="flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all"
                    :class="[
                      submittedAnswers[qIdx] !== undefined
                        ? oIdx === question.correctAnswerIndex
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                          : oIdx === answers[qIdx] && answers[qIdx] !== question.correctAnswerIndex
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                        : answers[qIdx] === oIdx
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-brand-300'
                    ]"
                  >
                    <input
                      type="radio"
                      :name="`question-${qIdx}`"
                      :value="oIdx"
                      v-model.number="answers[qIdx]"
                      :disabled="submittedAnswers[qIdx] !== undefined"
                      class="mr-3"
                    />
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ option }}</span>
                  </label>
                </div>

                <p v-if="submittedAnswers[qIdx] !== undefined && question.explanation" class="mt-4 text-sm text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 italic">
                  💡 {{ question.explanation }}
                </p>
              </div>
            </div>

            <!-- Single Question View -->
            <div v-else>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                {{ currentQuestion.question }}
              </h3>

              <div class="space-y-3 mb-8">
                <label
                  v-for="(option, oIdx) in currentQuestion.options"
                  :key="oIdx"
                  class="flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all"
                  :class="[
                    submittedAnswers[currentQuestionIndex] !== undefined
                      ? oIdx === currentQuestion.correctAnswerIndex
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                        : oIdx === answers[currentQuestionIndex] && answers[currentQuestionIndex] !== currentQuestion.correctAnswerIndex
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                      : answers[currentQuestionIndex] === oIdx
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-brand-300'
                  ]"
                >
                  <input
                    type="radio"
                    :name="`question-current`"
                    :value="oIdx"
                    v-model.number="answers[currentQuestionIndex]"
                    :disabled="submittedAnswers[currentQuestionIndex] !== undefined"
                    class="mr-3"
                  />
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ option }}</span>
                </label>
              </div>

              <p v-if="submittedAnswers[currentQuestionIndex] !== undefined && currentQuestion.explanation" class="mb-6 text-sm text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 italic">
                💡 {{ currentQuestion.explanation }}
              </p>
            </div>

            <!-- Action Buttons -->
            <div v-if="submittedAnswers.length === 0" class="flex justify-between mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <button
                v-if="currentQuestionIndex > 0 && !showAllQuestions"
                @click="currentQuestionIndex--"
                class="px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium transition-colors flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <div v-else></div>

              <button
                @click="submitQuiz"
                :disabled="answers.length === 0 || answers.some(a => a === undefined)"
                class="px-6 py-3 rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium transition-colors"
              >
                Submit Quiz
              </button>

              <button
                v-if="currentQuestionIndex < quiz.questions.length - 1 && !showAllQuestions"
                @click="currentQuestionIndex++"
                class="px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium transition-colors flex items-center gap-2"
              >
                Next
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div v-else></div>
            </div>
          </div>
        </div>

        <!-- Results Section -->
        <div v-if="quizResults" class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <!-- Result Header -->
          <div class="bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-8 text-white">
            <h2 class="text-2xl font-bold mb-4">Quiz Completed!</h2>
            <div class="grid grid-cols-3 gap-4">
              <div>
                <p class="text-sm opacity-90">Your Score</p>
                <p class="text-4xl font-bold">{{ quizResults.score }}%</p>
              </div>
              <div>
                <p class="text-sm opacity-90">Correct Answers</p>
                <p class="text-4xl font-bold">{{ quizResults.correctAnswers }}/{{ quizResults.totalQuestions }}</p>
              </div>
              <div>
                <p class="text-sm opacity-90">Performance</p>
                <p class="text-2xl font-bold">{{ getPerformanceLabel(quizResults.score) }}</p>
              </div>
            </div>
          </div>

          <!-- Results Content -->
          <div class="px-8 py-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Review Your Answers</h3>

            <div class="space-y-6">
              <div
                v-for="(result, idx) in quizResults.results"
                :key="idx"
                class="border-l-4 rounded-lg p-6"
                :class="result.isCorrect
                  ? 'border-l-green-500 bg-green-50 dark:bg-green-900/10'
                  : 'border-l-red-500 bg-red-50 dark:bg-red-900/10'"
              >
                <div class="flex items-start justify-between mb-2">
                  <h4 class="font-semibold text-gray-900 dark:text-white">
                    {{ idx + 1 }}. {{ quiz.questions[result.questionIndex].question }}
                  </h4>
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-4',
                      result.isCorrect
                        ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-100'
                    ]"
                  >
                    {{ result.isCorrect ? "✓ Correct" : "✗ Incorrect" }}
                  </span>
                </div>

                <p class="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  <span class="font-medium">Your answer:</span>
                  {{ quiz.questions[result.questionIndex].options[result.selectedOptionIndex] }}
                </p>

                <p v-if="!result.isCorrect" class="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  <span class="font-medium text-green-700 dark:text-green-400">Correct answer:</span>
                  {{ quiz.questions[result.questionIndex].options[result.correctOptionIndex] }}
                </p>

                <p v-if="result.explanation" class="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700/50 rounded p-3 italic">
                  💡 {{ result.explanation }}
                </p>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex gap-4">
              <button
                @click="retakeQuiz"
                class="flex-1 px-6 py-3 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors"
              >
                Retake Quiz
              </button>
              <router-link
                to="/kuppi-sessions/quizzes"
                class="flex-1 px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold transition-colors text-center"
              >
                Back to Quizzes
              </router-link>
            </div>
          </div>
        </div>

        <!-- CTA to Start Quiz -->
        <div v-if="!isQuizAttempt && !quizResults" class="mt-8 bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-8 text-white text-center">
          <h3 class="text-2xl font-bold mb-2">Ready to test your knowledge?</h3>
          <p class="text-brand-100 mb-6">Answer all {{ quiz.questions.length }} questions and see how well you know this material.</p>
          <button
            @click="startQuiz"
            class="px-8 py-3 rounded-lg bg-white hover:bg-gray-100 text-brand-600 font-bold transition-colors inline-flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import { useQuizzesStore } from "@/store/quizzesStore";
import { readAuthUser } from "@/composables/useAuthUser";

const route = useRoute();
const { getQuiz, error: storeError } = useQuizzesStore();

const loading = ref(true);
const quiz = ref<any | null>(null);
const loadError = ref<string | null>(null);
const isQuizAttempt = ref(false);
const showAllQuestions = ref(false);
const currentQuestionIndex = ref(0);
const answers = ref<(number | undefined)[]>([]);
const submittedAnswers = ref<any[]>([]);
const quizResults = ref<any | null>(null);

const currentQuestion = computed(() => {
  if (quiz.value && currentQuestionIndex.value < quiz.value.questions.length) {
    return quiz.value.questions[currentQuestionIndex.value];
  }
  return null;
});

const getDifficultyColor = (difficulty: string) => {
  const colors = {
    easy: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    medium: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
    hard: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  };
  return colors[difficulty] || colors.medium;
};

const getPerformanceLabel = (score: number) => {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 70) return "Fair";
  if (score >= 60) return "Pass";
  return "Try Again";
};

const startQuiz = () => {
  isQuizAttempt.value = true;
  answers.value = new Array(quiz.value.questions.length).fill(undefined);
};

const toggleQuestionView = () => {
  showAllQuestions.value = !showAllQuestions.value;
};

const submitQuiz = async () => {
  const authUser = readAuthUser();
  if (!authUser) {
    alert("You must be logged in to submit a quiz");
    return;
  }

  const { submitQuizAttempt } = useQuizzesStore();
  
  const formattedAnswers = answers.value.map((selectedOptionIndex, questionIndex) => ({
    questionIndex,
    selectedOptionIndex,
  }));

  const result = await submitQuizAttempt(quiz.value._id, authUser.username, formattedAnswers);

  if (result) {
    submittedAnswers.value = result.results;
    quizResults.value = result;
    isQuizAttempt.value = false;
  }
};

const retakeQuiz = () => {
  isQuizAttempt.value = true;
  currentQuestionIndex.value = 0;
  answers.value = new Array(quiz.value.questions.length).fill(undefined);
  submittedAnswers.value = [];
  quizResults.value = null;
  showAllQuestions.value = false;
};

onMounted(async () => {
  const quizId = route.params.id as string;
  console.log('[QuizDetail] Loading quiz with ID:', quizId);
  
  if (!quizId) {
    loadError.value = "Quiz ID not found in URL";
    loading.value = false;
    console.error('[QuizDetail] Error: Quiz ID is missing');
    return;
  }

  try {
    const data = await getQuiz(quizId);
    console.log('[QuizDetail] Quiz data received:', data);
    
    if (!data) {
      loadError.value = storeError.value || "Failed to load quiz. Please check the server connection.";
      console.error('[QuizDetail] Error loading quiz:', loadError.value);
    } else {
      quiz.value = data;
      console.log('[QuizDetail] Quiz loaded successfully');
    }
  } catch (err) {
    loadError.value = err instanceof Error ? err.message : "An error occurred while loading the quiz";
    console.error('[QuizDetail] Error:', loadError.value);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
input[type="radio"] {
  accent-color: rgb(var(--brand-rgb, 59 130 246));
}
</style>
