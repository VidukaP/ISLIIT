import { ref } from "vue";
import type { MongoStudyMaterial } from "@/ts/mongo";

const materials = ref<MongoStudyMaterial[]>([]);
const categories = ref<string[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export function useStudyMaterialsStore() {
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${apiUrl}/study-materials/categories`);
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      categories.value = await response.json();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
    }
  };

  const fetchMaterials = async (category?: string) => {
    loading.value = true;
    error.value = null;

    try {
      const url = category
        ? `${apiUrl}/study-materials?category=${encodeURIComponent(category)}`
        : `${apiUrl}/study-materials`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      materials.value = await response.json();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
    } finally {
      loading.value = false;
    }
  };

  const fetchMaterialsByCategory = async (category: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(
        `${apiUrl}/study-materials/category/${encodeURIComponent(category)}`
      );
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      materials.value = await response.json();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
    } finally {
      loading.value = false;
    }
  };

  const uploadMaterial = async (
    payload: Omit<MongoStudyMaterial, "_id" | "createdAt" | "updatedAt"> & { fileData?: string }
  ): Promise<boolean> => {
    error.value = null;

    try {
      const response = await fetch(`${apiUrl}/study-materials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? `Request failed: ${response.status}`);
      }

      const created = await response.json();
      materials.value = [created, ...materials.value];
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      console.error("[Store] Upload error:", error.value);
      return false;
    }
  };

  const deleteMaterial = async (id: string): Promise<boolean> => {
    error.value = null;

    try {
      const response = await fetch(`${apiUrl}/study-materials/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      materials.value = materials.value.filter(m => m._id !== id);
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      return false;
    }
  };

  return {
    materials,
    categories,
    loading,
    error,
    fetchCategories,
    fetchMaterials,
    fetchMaterialsByCategory,
    uploadMaterial,
    deleteMaterial,
  };
}
