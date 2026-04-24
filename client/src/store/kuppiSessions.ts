import { ref } from "vue";
import type { MongoKuppiSession } from "@/ts/mongo";

const sessions = ref<MongoKuppiSession[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// Registration state
const sessionParticipants = ref<Record<string, number>>({});
const userRegistrations = ref<Record<string, boolean>>({});
const isRegistering = ref(false);
const registrationError = ref<string | null>(null);

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export function useKuppiSessionsStore() {
  const fetchKuppiSessions = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${apiUrl}/kuppi-sessions`);
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      const data = await response.json();
      sessions.value = Array.isArray(data) ? data : [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
    } finally {
      loading.value = false;
    }
  };

  const getKuppiSession = async (id: string): Promise<MongoKuppiSession | null> => {
    try {
      const response = await fetch(`${apiUrl}/kuppi-sessions/${id}`);
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      return null;
    }
  };

  const createKuppiSession = async (
    payload: Omit<MongoKuppiSession, "_id" | "status" | "createdAt">
  ): Promise<MongoKuppiSession | null> => {
    error.value = null;

    try {
      const response = await fetch(`${apiUrl}/kuppi-sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? `Request failed: ${response.status}`);
      }

      const created: MongoKuppiSession = await response.json();
      sessions.value = [created, ...sessions.value];
      return created;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      return null;
    }
  };

  const registerForSession = async (
    sessionId: string,
    userId: string,
    studentId: string,
    year: string,
    semester: string
  ): Promise<boolean> => {
    isRegistering.value = true;
    registrationError.value = null;

    try {
      const response = await fetch(`${apiUrl}/kuppi-sessions/${sessionId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: String(userId),
          studentId: String(studentId),
          year: String(year),
          semester: String(semester)
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        if (response.status === 409) {
          throw new Error("Already registered for this session");
        }
        throw new Error(data?.error ?? `Request failed: ${response.status}`);
      }

      userRegistrations.value[sessionId] = true;
      await getSessionParticipantCount(sessionId);
      return true;
    } catch (err) {
      registrationError.value =
        err instanceof Error ? err.message : "Unknown error";
      return false;
    } finally {
      isRegistering.value = false;
    }
  };

  const checkUserRegistration = async (
    sessionId: string,
    userId: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `${apiUrl}/kuppi-sessions/${sessionId}/check-registration?userId=${userId}`
      );

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      userRegistrations.value[sessionId] = data.isRegistered ?? false;
      return data.isRegistered ?? false;
    } catch (err) {
      console.warn("Failed to check registration:", err);
      return false;
    }
  };

  const getSessionParticipantCount = async (sessionId: string): Promise<number> => {
    try {
      const response = await fetch(
        `${apiUrl}/kuppi-sessions/${sessionId}/participants`
      );

      if (!response.ok) {
        return 0;
      }

      const data = await response.json();
      const count = data?.count ?? 0;
      sessionParticipants.value[sessionId] = count;
      return count;
    } catch (err) {
      console.warn("Failed to fetch participant count:", err);
      return 0;
    }
  };

  const updateKuppiSession = async (
    sessionId: string,
    payload: Partial<Omit<MongoKuppiSession, "_id" | "createdAt">>
  ): Promise<MongoKuppiSession | null> => {
    error.value = null;

    try {
      console.log('[Store] Updating session:', sessionId, 'with payload:', payload);
      const response = await fetch(`${apiUrl}/kuppi-sessions/${sessionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        console.error('[Store] Update failed:', data);
        throw new Error(data?.error ?? `Request failed: ${response.status}`);
      }

      const updated: MongoKuppiSession = await response.json();
      console.log('[Store] Update successful:', updated);
      // Update the session in the list
      const index = sessions.value.findIndex(s => s._id === sessionId);
      if (index !== -1) {
        sessions.value[index] = updated;
      }
      return updated;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      console.error('[Store] Update error:', error.value);
      return null;
    }
  };

  const deleteKuppiSession = async (
    sessionId: string,
    createdBy: string
  ): Promise<boolean> => {
    error.value = null;

    try {
      console.log('[Store] Deleting session:', sessionId, 'createdBy:', createdBy);
      const response = await fetch(`${apiUrl}/kuppi-sessions/${sessionId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ createdBy }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        console.error('[Store] Delete failed:', data);
        throw new Error(data?.error ?? `Request failed: ${response.status}`);
      }

      console.log('[Store] Delete successful');
      // Remove the session from the list
      sessions.value = sessions.value.filter(s => s._id !== sessionId);
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      console.error('[Store] Delete error:', error.value);
      return false;
    }
  };

  return {
    sessions,
    loading,
    error,
    sessionParticipants,
    userRegistrations,
    isRegistering,
    registrationError,
    fetchKuppiSessions,
    getKuppiSession,
    createKuppiSession,
    updateKuppiSession,
    deleteKuppiSession,
    registerForSession,
    checkUserRegistration,
    getSessionParticipantCount,
    apiUrl,
  };
}

