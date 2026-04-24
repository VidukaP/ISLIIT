<template>
  <AdminLayout>
    <div class="p-6 max-w-5xl mx-auto">
      <!-- Page Header -->
      <div class="mb-8">
        <button
          id="btn-back-from-create"
          @click="router.push('/kuppi-sessions')"
          class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 mb-6 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Browse Sessions
        </button>
        
        <div>
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Create a New Kuppi Session</h1>
          <p class="text-gray-600 dark:text-gray-300 mt-2 text-lg">Organize peer-tutoring sessions and help your classmates learn</p>
        </div>
      </div>

      <!-- Two-column layout: Form and Preview -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Form Section (2 columns) -->
        <div class="lg:col-span-2">
          <!-- Progress Steps -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Progress</h2>
              <span class="text-xs font-medium text-brand-600 dark:text-brand-400">{{ completionPercentage }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                class="bg-brand-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: completionPercentage + '%' }"
              ></div>
            </div>
          </div>

          <!-- Form Container -->
          <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 md:p-8">
            <!-- Success Banner -->
            <div
              v-if="successMessage"
              class="mb-6 px-4 py-3 rounded-lg bg-success-50 border border-success-200 text-success-700 text-sm dark:bg-success-900/20 dark:border-success-800 dark:text-success-400 flex items-start gap-3"
            >
              <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span>{{ successMessage }}</span>
            </div>

            <!-- Error Banner -->
            <div
              v-if="formError"
              class="mb-6 px-4 py-3 rounded-lg bg-error-50 border border-error-200 text-error-700 text-sm dark:bg-error-900/20 dark:border-error-800 dark:text-error-400 flex items-start gap-3"
            >
              <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              <span>{{ formError }}</span>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="space-y-8">
              <!-- Section: Session Info -->
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span class="flex items-center justify-center w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 text-sm font-semibold">1</span>
                  Session Information
                </h3>

                <div class="space-y-5">
                  <!-- Title -->
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <span class="flex items-center gap-2">
                          <svg class="w-4 h-4 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                          </svg>
                          Session Title <span class="text-error-500">*</span>
                        </span>
                      </label>
                      <span class="text-xs text-gray-500 dark:text-gray-400">{{ form.title.length }}/80</span>
                    </div>
                    <input
                      id="create-kuppi-title"
                      v-model="form.title"
                      type="text"
                      maxlength="80"
                      placeholder="e.g. Data Structures Revision Session"
                      class="w-full px-4 py-3 rounded-lg border transition-all"
                      :class="[
                        form.title.length > 0 ? 'border-green-300 dark:border-green-600' : 'border-gray-300 dark:border-gray-600',
                        'bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
                      ]"
                      required
                    />
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Give your session a clear, descriptive title</p>
                  </div>

                  <!-- Description -->
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <span class="flex items-center gap-2">
                          <svg class="w-4 h-4 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                          </svg>
                          Description <span class="text-error-500">*</span>
                        </span>
                      </label>
                      <span class="text-xs text-gray-500 dark:text-gray-400">{{ form.description.length }}/300</span>
                    </div>
                    <textarea
                      id="create-kuppi-description"
                      v-model="form.description"
                      rows="5"
                      maxlength="300"
                      placeholder="Describe what topics will be covered, learning objectives, or any important details..."
                      class="w-full px-4 py-3 rounded-lg border transition-all resize-none"
                      :class="[
                        form.description.length > 0 ? 'border-green-300 dark:border-green-600' : 'border-gray-300 dark:border-gray-600',
                        'bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
                      ]"
                      required
                    ></textarea>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Help other students understand what they'll learn</p>
                  </div>

                  <!-- Subject / Module -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <span class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        Subject / Module <span class="text-error-500">*</span>
                      </span>
                    </label>
                    <input
                      id="create-kuppi-subject"
                      v-model="form.subject"
                      type="text"
                      placeholder="e.g. CS2020 — Algorithms & Data Structures"
                      class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                      required
                    />
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Enter the course code and name</p>
                  </div>
                </div>
              </div>

              <!-- Divider -->
              <div class="border-t border-gray-100 dark:border-gray-700"></div>

              <!-- Section: Academic Details -->
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span class="flex items-center justify-center w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 text-sm font-semibold">2</span>
                  Academic Details
                </h3>

                <div class="grid grid-cols-2 gap-5">
                  <!-- Year -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <span class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6-4a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                        Year <span class="text-error-500">*</span>
                      </span>
                    </label>
                    <select
                      id="create-kuppi-year"
                      v-model="form.year"
                      class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                      required
                    >
                      <option value="">Select year</option>
                      <option value="Year 1">Year 1</option>
                      <option value="Year 2">Year 2</option>
                      <option value="Year 3">Year 3</option>
                      <option value="Year 4">Year 4</option>
                    </select>
                  </div>

                  <!-- Semester -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <span class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v2h16V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5H4v8a2 2 0 002 2h12a2 2 0 002-2V7h-2v1a1 1 0 11-2 0V7H9v1a1 1 0 11-2 0V7H6v1a1 1 0 11-2 0V7z" />
                        </svg>
                        Semester <span class="text-error-500">*</span>
                      </span>
                    </label>
                    <select
                      id="create-kuppi-semester"
                      v-model="form.semester"
                      class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                      required
                    >
                      <option value="">Select semester</option>
                      <option value="Semester 1">Semester 1</option>
                      <option value="Semester 2">Semester 2</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Divider -->
              <div class="border-t border-gray-100 dark:border-gray-700"></div>

              <!-- Section: Session Schedule -->
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span class="flex items-center justify-center w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 text-sm font-semibold">3</span>
                  Session Schedule
                </h3>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <!-- Date -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <span class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v2h16V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5H4v8a2 2 0 002 2h12a2 2 0 002-2V7h-2v1a1 1 0 11-2 0V7H9v1a1 1 0 11-2 0V7H6v1a1 1 0 11-2 0V7z" />
                        </svg>
                        Date <span class="text-error-500">*</span>
                      </span>
                    </label>
                    <input
                      id="create-kuppi-date"
                      v-model="form.date"
                      type="date"
                      class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                      :min="todayDate"
                      required
                    />
                  </div>

                  <!-- Time -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <span class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00-.447.894l1.005 3.015a1 1 0 001.898 0l1.005-3.015A1 1 0 0011 6v-4z" clip-rule="evenodd" />
                        </svg>
                        Start Time <span class="text-error-500">*</span>
                      </span>
                    </label>
                    <input
                      id="create-kuppi-time"
                      v-model="form.time"
                      type="time"
                      class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                      required
                    />
                  </div>

                  <!-- Duration -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <span class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clip-rule="evenodd" />
                        </svg>
                        Duration <span class="text-error-500">*</span>
                      </span>
                    </label>
                    <select
                      id="create-kuppi-duration"
                      v-model="form.duration"
                      class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                      required
                    >
                      <option value="">Select duration</option>
                      <option value="30 minutes">30 minutes</option>
                      <option value="1 hour">1 hour</option>
                      <option value="1.5 hours">1.5 hours</option>
                      <option value="2 hours">2 hours</option>
                      <option value="2.5 hours">2.5 hours</option>
                      <option value="3 hours">3 hours</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Divider -->
              <div class="border-t border-gray-100 dark:border-gray-700"></div>

              <!-- Section: Meeting Link -->
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span class="flex items-center justify-center w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 text-sm font-semibold">4</span>
                  Meeting Details
                </h3>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <span class="flex items-center gap-2">
                      <svg class="w-4 h-4 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                      Microsoft Teams Meeting Link <span class="text-error-500">*</span>
                    </span>
                  </label>
                  <input
                    id="create-kuppi-teams-link"
                    v-model="form.teamsLink"
                    type="url"
                    placeholder="https://teams.microsoft.com/l/meetup-join/..."
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                    required
                  />
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Participants will use this link to join the session</p>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="flex justify-between items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  @click="router.push('/kuppi-sessions')"
                  class="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="btn-create-kuppi-submit"
                  type="submit"
                  :disabled="submitting"
                  class="inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <svg v-if="submitting" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  <span>{{ submitting ? 'Creating Session...' : 'Create Session' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Preview Section (1 column) -->
        <div class="lg:col-span-1">
          <div class="sticky top-6">
            <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-sm p-6">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <svg class="w-5 h-5 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                </svg>
                Session Preview
              </h3>

              <!-- Preview Content -->
              <div class="space-y-4">
                <!-- Title Preview -->
                <div v-if="form.title" class="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <p class="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">TITLE</p>
                  <p class="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">{{ form.title || 'Your session title will appear here' }}</p>
                </div>

                <!-- Description Preview -->
                <div v-if="form.description" class="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <p class="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">DESCRIPTION</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{{ form.description }}</p>
                </div>

                <!-- Subject Preview -->
                <div v-if="form.subject" class="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <p class="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">SUBJECT</p>
                  <p class="text-sm font-medium text-brand-600 dark:text-brand-400">{{ form.subject }}</p>
                </div>

                <!-- Metadata Preview -->
                <div v-if="form.year || form.semester" class="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <p class="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2">ACADEMIC DETAILS</p>
                  <div class="flex flex-wrap gap-2">
                    <span v-if="form.year" class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">{{ form.year }}</span>
                    <span v-if="form.semester" class="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">{{ form.semester }}</span>
                  </div>
                </div>

                <!-- Schedule Preview -->
                <div v-if="form.date || form.time" class="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <p class="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2">SCHEDULE</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    <span v-if="form.date">📅 {{ formatDate(form.date) }}</span>
                    <span v-if="form.time"> at {{ form.time }}</span>
                  </p>
                  <p v-if="form.duration" class="text-sm text-gray-600 dark:text-gray-400">⏱️ {{ form.duration }}</p>
                </div>

                <!-- Info Box -->
                <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p class="text-xs text-blue-700 dark:text-blue-300">
                    <svg class="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 10-2 0 1 1 0 002 0zM8 8a1 1 0 000 2h6a1 1 0 100-2H8zm0 3a1 1 0 100 2h3a1 1 0 100-2H8z" clip-rule="evenodd" />
                    </svg>
                    All fields must be filled to create your session
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import { useKuppiSessionsStore } from '@/store/kuppiSessions';

const router = useRouter();
const { error, createKuppiSession } = useKuppiSessionsStore();

const submitting = ref(false);
const formError = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const blankForm = () => ({
  title: '',
  description: '',
  subject: '',
  year: '',
  semester: '',
  date: '',
  time: '',
  duration: '',
  teamsLink: '',
});

const form = reactive(blankForm());

const todayDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

// Calculate completion percentage for progress bar
const completionPercentage = computed(() => {
  const fields = [
    form.title.trim().length > 0,
    form.description.trim().length > 0,
    form.subject.trim().length > 0,
    form.year.length > 0,
    form.semester.length > 0,
    form.date.length > 0,
    form.time.length > 0,
    form.duration.length > 0,
    form.teamsLink.trim().length > 0,
  ];
  const completed = fields.filter(Boolean).length;
  return Math.round((completed / fields.length) * 100);
});

const readAuthUser = () => {
  const raw = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
};

const handleSubmit = async () => {
  if (!form.title.trim() || !form.description.trim() || !form.subject.trim() || 
      !form.year.trim() || !form.semester.trim() || !form.date || 
      !form.time || !form.duration.trim() || !form.teamsLink.trim()) {
    formError.value = 'All fields are required';
    successMessage.value = null;
    console.warn('[CreateKuppiSession] Validation failed - missing fields');
    return;
  }

  const selectedDate = new Date(form.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    formError.value = 'Session date cannot be in the past';
    successMessage.value = null;
    console.warn('[CreateKuppiSession] Date is in the past:', form.date);
    return;
  }

  try {
    new URL(form.teamsLink);
  } catch {
    formError.value = 'Please enter a valid URL for the Teams link';
    successMessage.value = null;
    console.warn('[CreateKuppiSession] Invalid Teams link:', form.teamsLink);
    return;
  }

  submitting.value = true;
  formError.value = null;
  successMessage.value = null;

  const authUser = readAuthUser();
  console.log('[CreateKuppiSession] Auth user:', authUser);
  
  if (!authUser) {
    formError.value = 'You must be logged in to create a session';
    submitting.value = false;
    return;
  }

  const payload = {
    ...form,
    createdBy: authUser?.username ?? 'Unknown',
  };
  
  console.log('[CreateKuppiSession] Submitting payload:', payload);
  const result = await createKuppiSession(payload);
  console.log('[CreateKuppiSession] API response:', result);
  console.log('[CreateKuppiSession] Store error:', error.value);

  submitting.value = false;

  if (result) {
    successMessage.value = '✓ Session created successfully! Redirecting...';
    console.log('[CreateKuppiSession] Success! Redirecting to:', `/kuppi-sessions/${result._id}`);
    setTimeout(() => {
      router.push(`/kuppi-sessions/${result._id}`);
    }, 800);
  } else {
    formError.value = error.value ?? 'Failed to create session. Please try again.';
    console.error('[CreateKuppiSession] Failed to create session:', error.value);
  }
};
</script>

<style scoped>
input:focus,
textarea:focus,
select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 0 0 2px rgba(59, 130, 246, 1);
}

/* Smooth transitions for form elements */
input,
textarea,
select {
  transition: all 0.2s ease;
}

input:hover:not(:disabled),
textarea:hover:not(:disabled),
select:hover:not(:disabled) {
  border-color: rgb(219, 234, 254);
}

/* Dark mode adjustments */
:dark input:hover:not(:disabled),
:dark textarea:hover:not(:disabled),
:dark select:hover:not(:disabled) {
  border-color: rgb(30, 58, 138);
}

/* Success state styling */
input[value]:not([value=""]),
textarea[value]:not([value=""]) {
  --tw-border-opacity: 1;
}

/* Animated progress bar */
@keyframes slideRight {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.bg-brand-500 {
  animation: slideRight 0.6s ease-out;
}

/* Smooth staggered animation for sections */
@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

h3 {
  animation: fadeSlideIn 0.4s ease-out backwards;
}

h3:nth-of-type(1) { animation-delay: 0.05s; }
h3:nth-of-type(2) { animation-delay: 0.1s; }
h3:nth-of-type(3) { animation-delay: 0.15s; }
h3:nth-of-type(4) { animation-delay: 0.2s; }
</style>
