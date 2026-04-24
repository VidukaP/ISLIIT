import { ref } from "vue";

const quizzes = ref<any[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const userAttempts = ref<Record<string, any>>({});

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export function useQuizzesStore() {
  const fetchQuizzes = async () => {
    loading.value = true;
    error.value = null;
    console.log('[QuizzesStore] Fetching quizzes...');

    try {
      const response = await fetch(`${apiUrl}/api/quizzes`);
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      const data = await response.json();
      quizzes.value = Array.isArray(data) ? data : [];
      console.log('[QuizzesStore] Quizzes fetched:', quizzes.value.length);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      console.error('[QuizzesStore] Error fetching quizzes:', error.value);
    } finally {
      loading.value = false;
    }
  };

  const getQuiz = async (quizId: string) => {
    try {
      console.log('[QuizzesStore] Loading quiz:', quizId);
      const response = await fetch(`${apiUrl}/api/quizzes/${quizId}`);
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      const data = await response.json();
      console.log('[QuizzesStore] Quiz loaded:', data);
      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      console.error('[QuizzesStore] Error loading quiz:', error.value);
      return null;
    }
  };

  const getQuizzesByMaterial = async (materialId: string) => {
    try {
      console.log('[QuizzesStore] Loading quizzes for material:', materialId);
      const response = await fetch(`${apiUrl}/api/quizzes/material/${materialId}`);
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      const data = await response.json();
      console.log('[QuizzesStore] Quizzes for material loaded:', data);
      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      console.error('[QuizzesStore] Error loading quizzes for material:', error.value);
      return null;
    }
  };

  const generateQuizFromMaterial = async (
    materialId: string,
    title: string,
    fileData: string,
    fileName: string
  ) => {
    try {
      console.log('[QuizzesStore] Generating quiz from material...');
      const response = await fetch(`${apiUrl}/api/quizzes/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          materialId,
          title,
          fileData,
          fileName,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('[QuizzesStore] Quiz generated:', data);
      
      // Add to quizzes array if not already there
      if (!quizzes.value.find(q => q._id === data._id)) {
        quizzes.value.push(data);
      }
      
      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      console.error('[QuizzesStore] Error generating quiz:', error.value);
      return null;
    }
  };

  const submitQuizAttempt = async (quizId: string, username: string, answers: any[]) => {
    try {
      console.log('[QuizzesStore] Submitting quiz attempt...');
      const response = await fetch(`${apiUrl}/api/quizzes/${quizId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          answers,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('[QuizzesStore] Quiz attempt submitted:', data);
      
      // Store attempt in userAttempts
      if (!userAttempts.value[quizId]) {
        userAttempts.value[quizId] = [];
      }
      userAttempts.value[quizId].push(data);
      
      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      console.error('[QuizzesStore] Error submitting quiz attempt:', error.value);
      return null;
    }
  };

  const getUserAttempts = async (quizId: string, username: string) => {
    try {
      console.log('[QuizzesStore] Loading user attempts for quiz:', quizId);
      const response = await fetch(
        `${apiUrl}/api/quizzes/${quizId}/attempts?username=${username}`
      );

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('[QuizzesStore] User attempts loaded:', data);
      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      console.error('[QuizzesStore] Error loading user attempts:', error.value);
      return null;
    }
  };

  const getQuizStats = async (quizId: string) => {
    try {
      console.log('[QuizzesStore] Loading quiz stats:', quizId);
      const response = await fetch(`${apiUrl}/api/quizzes/stats/${quizId}`);

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('[QuizzesStore] Quiz stats loaded:', data);
      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      console.error('[QuizzesStore] Error loading quiz stats:', error.value);
      return null;
    }
  };

  const deleteQuiz = async (quizId: string): Promise<boolean> => {
    try {
      console.log('[QuizzesStore] Deleting quiz:', quizId);
      const response = await fetch(`${apiUrl}/api/quizzes/${quizId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      // Remove from quizzes array
      quizzes.value = quizzes.value.filter(q => q._id !== quizId);
      
      console.log('[QuizzesStore] Quiz deleted successfully');
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      console.error('[QuizzesStore] Error deleting quiz:', error.value);
      return false;
    }
  };

  return {
    quizzes,
    loading,
    error,
    userAttempts,
    fetchQuizzes,
    getQuiz,
    getQuizzesByMaterial,
    generateQuizFromMaterial,
    submitQuizAttempt,
    getUserAttempts,
    getQuizStats,
    deleteQuiz,
  };
}
