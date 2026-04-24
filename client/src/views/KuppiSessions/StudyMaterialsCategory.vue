<template>
  <AdminLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-8">
        <router-link
          to="/kuppi-sessions/study-materials"
          class="inline-flex items-center text-brand-600 hover:text-brand-700 font-medium mb-4 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </router-link>

        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white capitalize">{{ formatCategoryName(categorySlug) }}</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">{{ materials.length }} {{ materials.length === 1 ? 'material' : 'materials' }} available</p>
          </div>
          <router-link
            :to="`/kuppi-sessions/study-materials/upload?category=${encodeURIComponent(categoryName)}`"
            class="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Upload New
          </router-link>
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
          <p class="text-gray-500 dark:text-gray-400">Loading materials...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="sortedMaterials.length === 0" class="flex justify-center items-center h-64">
        <div class="text-center">
          <svg class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No materials yet</h3>
          <p class="text-gray-500 dark:text-gray-500 mb-6">Be the first to upload {{ formatCategoryName(categorySlug).toLowerCase() }}</p>
          <router-link
            :to="`/kuppi-sessions/study-materials/upload?category=${encodeURIComponent(categoryName)}`"
            class="inline-flex items-center px-6 py-3 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors"
          >
            Upload Material
          </router-link>
        </div>
      </div>

      <!-- Materials Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="material in sortedMaterials"
          :key="material._id"
          class="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
        >
          <!-- Header with Color Band -->
          <div class="h-2 bg-gradient-to-r from-brand-400 to-brand-600"></div>

          <!-- Content -->
          <div class="p-6 flex flex-col flex-grow">
            <!-- Icon -->
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/30 mb-4">
              <svg class="w-6 h-6 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>

            <!-- Title and Description -->
            <h3 class="font-semibold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
              {{ material.title }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-grow">
              {{ material.description || 'No description provided' }}
            </p>

            <!-- Metadata -->
            <div class="space-y-2 mb-4 text-xs text-gray-500 dark:text-gray-500">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ formatDate(material.createdAt) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ material.fileName }}</span>
              </div>
            </div>

            <!-- Category Badge -->
            <div class="flex gap-2 mb-4">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300">
                {{ material.category }}
              </span>
            </div>
          </div>

          <!-- Footer with Actions -->
          <div class="border-t border-gray-200 dark:border-gray-700 p-4 flex gap-2">
            <a
              :href="`${apiUrl}/api/study-materials/download/${material._id}`"
              download
              class="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </a>
            <button
              @click="() => deleteMaterial(material._id!)"
              class="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from "vue";
import { useRoute } from "vue-router";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import { useStudyMaterialsStore } from "@/store/studyMaterials";

const route = useRoute();
const store = useStudyMaterialsStore();
const { materials, loading, fetchMaterialsByCategory, deleteMaterial } = store;
const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const categorySlug = route.params.category as string;
const sortBy = ref<"newest" | "oldest">("newest");

const categoryName = computed(() => {
  return formatCategoryName(categorySlug);
});

const sortedMaterials = computed(() => {
  const sorted = [...materials.value];
  if (sortBy.value === "newest") {
    return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else {
    return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
});

const formatCategoryName = (slug: string) => {
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatDate = (date?: string) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

onMounted(async () => {
  await fetchMaterialsByCategory(categoryName.value);
});
</script>
