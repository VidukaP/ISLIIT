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
          Back to Study Materials
        </router-link>

        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Upload Study Material</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Share knowledge with your peers</p>
        <div class="h-1 w-20 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full mt-4"></div>
      </div>

      <!-- Main Form Card -->
      <div class="max-w-3xl mx-auto">
        <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
          <!-- Form Header Band -->
          <div class="h-1 bg-gradient-to-r from-brand-400 to-brand-600"></div>

          <form @submit.prevent="handleSubmit" class="p-8 space-y-8">
            <!-- Step Indicator (Optional) -->
            <div class="flex items-center justify-between mb-8">
              <div class="flex items-center gap-4 flex-1">
                <div class="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center text-sm font-bold">1</div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Category & Info</span>
              </div>
              <div class="flex-1 h-1 bg-gray-200 dark:bg-gray-700 mx-2"></div>
              <div class="flex items-center gap-4">
                <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex items-center justify-center text-sm font-bold">2</div>
                <span class="text-sm font-medium text-gray-500 dark:text-gray-500">Upload File</span>
              </div>
            </div>

            <!-- Category Selection -->
            <div class="bg-gradient-to-br from-brand-50 to-brand-50/50 dark:from-brand-900/20 dark:to-brand-900/10 rounded-xl p-6">
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                <svg class="w-4 h-4 inline mr-2 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 012-2h6a2 2 0 012 2v2h2a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h2V3z" />
                </svg>
                Category *
              </label>
              <select
                v-model="form.category"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                required
              >
                <option value="">Select a category</option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
              <p class="text-xs text-gray-600 dark:text-gray-400 mt-2">Selected: {{ form.category || "Not selected" }}</p>
            </div>

            <!-- Title Input -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                <svg class="w-4 h-4 inline mr-2 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2H4V5zm14 0V3a1 1 0 00-1-1H5a1 1 0 00-1 1v2h12zM2 9v6a2 2 0 002 2h12a2 2 0 002-2V9H2z" />
                </svg>
                Material Title *
              </label>
              <input
                v-model="form.title"
                type="text"
                placeholder="E.g., Calculus Chapter 5 Notes"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <!-- Description Input -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                <svg class="w-4 h-4 inline mr-2 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                </svg>
                Description *
              </label>
              <textarea
                v-model="form.description"
                placeholder="Describe what this material is about, key topics covered, etc..."
                rows="4"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all resize-none"
                required
              />
            </div>

            <!-- File Upload with Drag & Drop -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                <svg class="w-4 h-4 inline mr-2 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0-4a1 1 0 011-1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 110 2H4a1 1 0 01-1-1zM14 7a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                </svg>
                Upload File *
              </label>

              <div
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop"
                :class="[
                  'relative border-2 border-dashed rounded-xl p-8 transition-all duration-300',
                  isDragging
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 shadow-lg'
                    : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-brand-400'
                ]"
              >
                <input
                  ref="fileInput"
                  type="file"
                  class="hidden"
                  accept=".pdf,.doc,.docx,.txt,.xlsx,.ppt,.pptx,.jpg,.png,.jpeg"
                  @change="handleFileSelect"
                />

                <div v-if="!selectedFile" @click="$refs.fileInput?.click()" class="cursor-pointer text-center">
                  <svg class="w-16 h-16 mx-auto mb-4 text-brand-400 dark:text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Drag and drop your file here</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">or <span class="text-brand-600 dark:text-brand-400 font-medium">click to browse</span></p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Supported: PDF, DOC, DOCX, TXT, XLSX, PPT, PPTX, JPG, PNG</p>
                </div>

                <div v-else class="space-y-4">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                      <svg class="w-6 h-6 text-brand-600 dark:text-brand-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5z" />
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ selectedFile.name }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatFileSize(selectedFile.size) }}</p>
                    </div>
                    <button
                      type="button"
                      @click.prevent="selectedFile = null"
                      class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div class="bg-gradient-to-r from-brand-400 to-brand-600 h-2 rounded-full" style="width: 100%;"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex gap-3">
              <svg class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              <p class="text-sm text-red-700 dark:text-red-400">{{ errorMessage }}</p>
            </div>

            <!-- Success Message -->
            <div v-if="successMessage" class="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex gap-3">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <p class="text-sm text-green-700 dark:text-green-400">{{ successMessage }}</p>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 pt-4">
              <button
                type="submit"
                :disabled="isSubmitting || !authUser.authUser.value"
                :title="!authUser.authUser.value ? 'Please log in to upload' : ''"
                class="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <svg v-if="!isSubmitting" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <svg v-else class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                {{ isSubmitting ? "Uploading..." : "Upload Material" }}
              </button>
              <router-link
                to="/kuppi-sessions/study-materials"
                class="px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold transition-all"
              >
                Cancel
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import { useStudyMaterialsStore } from "@/store/studyMaterials";
import { useAuthUser } from "@/composables/useAuthUser";

const route = useRoute();
const router = useRouter();
const store = useStudyMaterialsStore();
const { categories, fetchCategories, uploadMaterial } = store;
const authUser = useAuthUser();

const form = ref({
  title: "",
  description: "",
  category: "",
  fileName: "",
  uploadedBy: "",
});

const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    selectedFile.value = input.files[0];
  }
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  if (event.dataTransfer?.files?.length) {
    selectedFile.value = event.dataTransfer.files[0];
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

const handleSubmit = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  if (!form.value.title.trim()) {
    errorMessage.value = "Please enter a title";
    return;
  }

  if (!form.value.description.trim()) {
    errorMessage.value = "Please enter a description";
    return;
  }

  if (!form.value.category) {
    errorMessage.value = "Please select a category";
    return;
  }

  if (!selectedFile.value) {
    errorMessage.value = "Please select a file to upload";
    return;
  }

  if (!authUser.authUser.value) {
    errorMessage.value = "You must be logged in to upload materials. Please log in first.";
    return;
  }

  isSubmitting.value = true;

  try {
    // Read file as base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64String = e.target?.result as string;
      const fileData = base64String.includes(",") ? base64String.split(",")[1] : base64String;

      console.log("[Upload] File data prepared:", {
        fileName: selectedFile.value!.name,
        fileDataSize: fileData.length,
        hasFileData: !!fileData,
      });

      const payload = {
        title: form.value.title,
        description: form.value.description,
        category: form.value.category,
        fileName: selectedFile.value!.name,
        uploadedBy: authUser.authUser.value?.username || authUser.authUser.value?.student_id || "unknown",
        fileData: fileData,
      };

      const result = await uploadMaterial(payload);

      if (result) {
        successMessage.value = "Material uploaded successfully!";
        form.value = { title: "", description: "", category: "", fileName: "", uploadedBy: "" };
        selectedFile.value = null;
        setTimeout(() => {
          router.push("/kuppi-sessions/study-materials");
        }, 1500);
      } else {
        errorMessage.value = store.error || "Failed to upload material";
      }

      isSubmitting.value = false;
    };

    reader.onerror = () => {
      console.error("[Upload] FileReader error");
      errorMessage.value = "Error reading file";
      isSubmitting.value = false;
    };

    reader.readAsDataURL(selectedFile.value);
  } catch (error) {
    console.error("[Upload] Error:", error);
    errorMessage.value = "Error reading file";
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  await fetchCategories();
  const categoryParam = route.query.category as string;
  if (categoryParam) {
    form.value.category = decodeURIComponent(categoryParam);
  }

  // Check if user is logged in
  if (!authUser.authUser.value) {
    errorMessage.value = "You must be logged in to upload materials. Please log in first.";
  }
});
</script>
