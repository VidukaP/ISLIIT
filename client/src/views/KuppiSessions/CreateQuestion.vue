<template>
  <AdminLayout>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-12">
          <RouterLink to="/kuppi-sessions/qa" class="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium mb-6 transition-colors">
            <ChevronRightIcon class="w-4 h-4 rotate-180" />
            <span>Back to Q&A Forum</span>
          </RouterLink>
          <div class="space-y-3">
            <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Share Your Question
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-400">
              Help others learn and get answers from the community
            </p>
          </div>
        </div>

        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Main Form -->
          <div class="lg:col-span-2">
            <!-- Form -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 backdrop-blur-sm">
            <form @submit.prevent="handleSubmit" class="space-y-7">
              <!-- Title Field -->
              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <label for="title" class="block text-sm font-semibold text-gray-900 dark:text-white">
                    Question Title <span class="text-red-500">*</span>
                  </label>
                </div>
                <input
                  id="title"
                  v-model="formData.title"
                  type="text"
                  placeholder="e.g., How to implement authentication in Vue 3?"
                  maxlength="200"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                  :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-500': errors.title }"
                  @blur="validateField('title')"
                />
                <div class="flex justify-between items-start gap-2">
                  <p v-if="errors.title" class="text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-1">
                    <span>⚠</span>
                    {{ errors.title }}
                  </p>
                  <div class="ml-auto">
                    <span class="text-xs font-medium" :class="formData.title.length > 180 ? 'text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400'">
                      {{ formData.title.length }}/200
                    </span>
                  </div>
                </div>
              </div>

              <!-- Description Field -->
              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <label for="description" class="block text-sm font-semibold text-gray-900 dark:text-white">
                    Question Description <span class="text-red-500">*</span>
                  </label>
                </div>
                <textarea
                  id="description"
                  v-model="formData.description"
                  placeholder="Provide context, code snippets, error messages, and what you've already tried..."
                  rows="8"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200 resize-none placeholder-gray-400 dark:placeholder-gray-500"
                  :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-500': errors.description }"
                  @blur="validateField('description')"
                />
                <div class="flex justify-between items-start gap-2">
                  <p v-if="errors.description" class="text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-1">
                    <span>⚠</span>
                    {{ errors.description }}
                  </p>
                  <div class="ml-auto">
                    <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {{ formData.description.length }} characters
                    </span>
                  </div>
                </div>
              </div>

              <!-- Tags Field -->
              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <label class="block text-sm font-semibold text-gray-900 dark:text-white">
                    Tags <span class="text-gray-500 dark:text-gray-400 font-normal">(Optional)</span>
                  </label>
                </div>
                <div class="mb-3">
                  <input
                    v-model="newTag"
                    type="text"
                    placeholder="Add tags to categorize your question (e.g., vue3, typescript)"
                    class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 text-sm"
                    @keydown.enter.prevent="addTag"
                  />
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Press Enter to add a tag</p>
                </div>

                <!-- Selected Tags -->
                <div v-if="formData.tags.length > 0" class="flex flex-wrap gap-2">
                  <span
                    v-for="(tag, index) in formData.tags"
                    :key="index"
                    class="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 text-emerald-700 dark:text-emerald-300 text-sm font-medium rounded-full border border-emerald-300 dark:border-emerald-700 hover:shadow-sm transition-all"
                  >
                    <span>{{ tag }}</span>
                    <button
                      type="button"
                      @click="removeTag(index)"
                      class="hover:text-emerald-900 dark:hover:text-emerald-100 hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-full p-0.5 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </span>
                </div>

                <!-- Tag Suggestions -->
                <div class="pt-2">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Popular tags:
                    <span
                      v-for="(tag, idx) in popularTags.filter(t => !formData.tags.includes(t)).slice(0, 5)"
                      :key="idx"
                      class="inline-block ml-1"
                    >
                      <button
                        type="button"
                        @click.prevent="() => { newTag = ''; formData.tags.push(tag); }"
                        class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
                      >
                        {{ tag }}{{ idx < 4 ? ',' : '' }}
                      </button>
                    </span>
                  </p>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  <span class="inline-block">{{ formData.tags.length }}/5 tags added</span>
                </p>
              </div>

              <!-- Preview Section -->
              <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-2 mb-4">
                  <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Preview</h3>
                </div>
                <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700 space-y-3">
                  <h4 class="text-lg font-bold text-gray-900 dark:text-white">
                    {{ formData.title || 'Your question title...' }}
                  </h4>
                  <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {{ formData.description || 'Your detailed question description will appear here...' }}
                  </p>
                  <div v-if="formData.tags.length > 0" class="flex flex-wrap gap-2 pt-3">
                    <span
                      v-for="tag in formData.tags"
                      :key="tag"
                      class="inline-block px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Error Messages -->
              <div v-if="generalError" class="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg border border-red-200 dark:border-red-800 flex gap-3">
                <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                <div>
                  <p class="font-medium">Error</p>
                  <p class="text-sm">{{ generalError }}</p>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-3 pt-6">
                <button
                  type="submit"
                  :disabled="loading"
                  class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <svg v-if="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span v-if="!loading">Ask Question</span>
                  <span v-else class="flex items-center gap-2">
                    <svg class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.581 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Publishing...
                  </span>
                </button>
                <RouterLink
                  to="/kuppi-sessions/qa"
                  class="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center"
                >
                  Cancel
                </RouterLink>
              </div>
                </form>
            </div>
          </div>

          <!-- Sidebar Tips -->
          <div class="lg:col-span-1">
            <div class="sticky top-8 space-y-6">
              <!-- Tips Card -->
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-bold text-blue-900 dark:text-blue-300">Writing Tips</h3>
                </div>
                <ul class="space-y-3">
                  <li class="flex gap-3 text-sm text-blue-800 dark:text-blue-300">
                    <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 10 10.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                    <span><strong>Be specific</strong> - Clearly state what you're trying to achieve</span>
                  </li>
                  <li class="flex gap-3 text-sm text-blue-800 dark:text-blue-300">
                    <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 10 10.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                    <span><strong>Include context</strong> - Share relevant code, error messages, and what you've tried</span>
                  </li>
                  <li class="flex gap-3 text-sm text-blue-800 dark:text-blue-300">
                    <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 10 10.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                    <span><strong>Use tags</strong> - Help others find your question with relevant tags</span>
                  </li>
                  <li class="flex gap-3 text-sm text-blue-800 dark:text-blue-300">
                    <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 10 10.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                    <span><strong>Check duplicates</strong> - Search for similar questions first</span>
                  </li>
                </ul>
              </div>

              <!-- Best Practices Card -->
              <div class="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                    <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-bold text-emerald-900 dark:text-emerald-300">Best Practices</h3>
                </div>
                <ul class="space-y-2 text-sm text-emerald-800 dark:text-emerald-300">
                  <li class="flex gap-2">
                    <span class="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                    <span>One main topic per question</span>
                  </li>
                  <li class="flex gap-2">
                    <span class="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                    <span>Be polite and respectful</span>
                  </li>
                  <li class="flex gap-2">
                    <span class="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                    <span>Avoid homework dumps</span>
                  </li>
                  <li class="flex gap-2">
                    <span class="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                    <span>Format code properly</span>
                  </li>
                </ul>
              </div>

              <!-- What to Avoid Card -->
              <div class="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
                    <svg class="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-bold text-orange-900 dark:text-orange-300">Avoid These</h3>
                </div>
                <ul class="space-y-2 text-sm text-orange-800 dark:text-orange-300">
                  <li class="flex gap-2">
                    <span class="text-orange-600 dark:text-orange-400 font-bold">✗</span>
                    <span>Vague titles like "Help" or "Error"</span>
                  </li>
                  <li class="flex gap-2">
                    <span class="text-orange-600 dark:text-orange-400 font-bold">✗</span>
                    <span>Screenshots of code (paste text)</span>
                  </li>
                  <li class="flex gap-2">
                    <span class="text-orange-600 dark:text-orange-400 font-bold">✗</span>
                    <span>External links as solutions</span>
                  </li>
                  <li class="flex gap-2">
                    <span class="text-orange-600 dark:text-orange-400 font-bold">✗</span>
                    <span>Multiple unrelated questions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useQAStore } from '@/store/qaStore';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import ChevronRightIcon from '@/icons/ChevronRightIcon.vue';

const router = useRouter();
const qaStore = useQAStore();

const loading = ref(false);
const generalError = ref('');
const newTag = ref('');

const formData = reactive({
  title: '',
  description: '',
  tags: [] as string[],
});

const errors = reactive({
  title: '',
  description: '',
});

const popularTags = [
  'vue3',
  'typescript',
  'authentication',
  'database',
  'api',
  'javascript',
  'tailwind',
  'nodejs',
];

const validateField = (field: string) => {
  if (field === 'title') {
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      errors.title = 'Title must be at least 10 characters';
    } else if (formData.title.length > 200) {
      errors.title = 'Title cannot exceed 200 characters';
    } else {
      errors.title = '';
    }
  } else if (field === 'description') {
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      errors.description = 'Description must be at least 20 characters';
    } else {
      errors.description = '';
    }
  }
};

const validateForm = () => {
  validateField('title');
  validateField('description');
  return !errors.title && !errors.description;
};

const addTag = () => {
  const tag = newTag.value.trim().toLowerCase();
  if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
    formData.tags.push(tag);
    newTag.value = '';
  }
};

const removeTag = (index: number) => {
  formData.tags.splice(index, 1);
};

const suggestTags = () => {
  const available = popularTags.filter((t) => !formData.tags.includes(t));
  if (available.length > 0) {
    formData.tags.push(available[0]);
  }
};

const handleSubmit = async () => {
  generalError.value = '';

  if (!validateForm()) {
    return;
  }

  loading.value = true;

  try {
    const newQuestion = await qaStore.createQuestion({
      title: formData.title.trim(),
      description: formData.description.trim(),
      tags: formData.tags,
    });

    // Redirect to question detail page
    await router.push(`/kuppi-sessions/qa/${newQuestion._id}`);
  } catch (error: any) {
    generalError.value = error.message || 'Failed to create question. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
