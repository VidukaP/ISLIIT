<template>
  <AdminLayout>
    <div class="p-6">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Study Materials</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Explore study resources organized by category</p>
          </div>
        </div>
        <div class="h-1 w-20 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full"></div>
      </div>

      <!-- Stats Bar -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-lg">
          <p class="text-sm opacity-90">Total Materials</p>
          <p class="text-2xl font-bold">{{ materials.length }}</p>
        </div>
        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white shadow-lg">
          <p class="text-sm opacity-90">Categories</p>
          <p class="text-2xl font-bold">{{ categories.length }}</p>
        </div>
        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white shadow-lg">
          <p class="text-sm opacity-90">Most Used</p>
          <p class="text-2xl font-bold">{{ getMostUsedCategory().count }}</p>
        </div>
        <router-link
          to="/kuppi-sessions/study-materials/upload"
          class="bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg p-4 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center cursor-pointer group"
        >
          <div class="text-center">
            <svg class="w-6 h-6 mx-auto mb-1 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <p class="text-sm font-semibold">Upload New</p>
          </div>
        </router-link>
      </div>

      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="text-center">
          <svg class="animate-spin w-12 h-12 text-brand-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p class="text-gray-500 dark:text-gray-400">Loading categories...</p>
        </div>
      </div>

      <!-- Categories Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link
          v-for="(cat, idx) in categories"
          :key="idx"
          :to="`/kuppi-sessions/study-materials/${cat.toLowerCase().replace(/\\s+/g, '-')}`"
          :class="[
            'group relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1',
            getGradientClass(idx),
            'text-white p-8 min-h-48 flex flex-col justify-between'
          ]"
        >
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-10">
            <svg class="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="2" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#pattern)" />
            </svg>
          </div>

          <div class="relative z-10">
            <!-- Icon -->
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm mb-4">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path v-if="cat === 'Notes'" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" />
                <path v-else-if="cat === 'Short Notes'" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" />
                <path v-else-if="cat === 'Past Papers'" d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17c0 5.523 4.477 10 10 10s10-4.477 10-10c0-6.002-4.5-10.747-10-10.747z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" />
                <path v-else-if="cat === 'Model Papers'" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" />
                <path v-else-if="cat === 'Quizzes'" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" />
              </svg>
            </div>

            <!-- Title -->
            <h3 class="text-2xl font-bold mb-2 group-hover:text-white transition-colors">{{ cat }}</h3>
            <p class="text-white/80 text-sm">{{ getMaterialCount(cat) }} {{ getMaterialCount(cat) === 1 ? 'material' : 'materials' }}</p>
          </div>

          <!-- Arrow -->
          <div class="relative z-10 flex justify-end">
            <svg class="w-6 h-6 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </router-link>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import { useStudyMaterialsStore } from "@/store/studyMaterials";

const store = useStudyMaterialsStore();
const { categories, materials, loading, fetchCategories, fetchMaterials } = store;
const isLoading = ref(true);

const getMaterialCount = (category: string) => {
  return materials.value.filter(m => m.category === category).length;
};

const getMostUsedCategory = () => {
  let maxCount = 0;
  let maxCategory = "Notes";
  for (const cat of categories.value) {
    const count = getMaterialCount(cat);
    if (count > maxCount) {
      maxCount = count;
      maxCategory = cat;
    }
  }
  return { category: maxCategory, count: maxCount };
};

const getGradientClass = (index: number) => {
  const gradients = [
    "bg-gradient-to-br from-blue-500 to-blue-600",
    "bg-gradient-to-br from-purple-500 to-purple-600",
    "bg-gradient-to-br from-pink-500 to-pink-600",
    "bg-gradient-to-br from-green-500 to-green-600",
    "bg-gradient-to-br from-orange-500 to-orange-600",
  ];
  return gradients[index % gradients.length];
};

onMounted(async () => {
  isLoading.value = true;
  await Promise.all([fetchCategories(), fetchMaterials()]);
  isLoading.value = false;
});
</script>
