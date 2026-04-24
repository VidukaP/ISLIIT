import { ObjectId } from "mongodb";
import { getDb } from "../config/db.mjs";
import { validateStudyMaterialPayload, getCategories } from "../models/study-material.model.mjs";

const toObjectId = (id) => {
  try {
    return new ObjectId(id);
  } catch (error) {
    return null;
  }
};

export async function getCategories_handler(req, res, next) {
  try {
    const categories = getCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
}

export async function listStudyMaterials(req, res, next) {
  try {
    const db = await getDb();
    const category = req.query.category;

    let query = {};
    if (category) {
      query.category = category;
    }

    const materials = await db
      .collection("study_materials")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    res.json(materials);
  } catch (error) {
    next(error);
  }
}

export async function getStudyMaterial(req, res, next) {
  try {
    const materialId = toObjectId(req.params.id);
    if (!materialId) {
      res.status(400).json({ error: "Invalid material id" });
      return;
    }

    const db = await getDb();
    const material = await db
      .collection("study_materials")
      .findOne({ _id: materialId });

    if (!material) {
      res.status(404).json({ error: "Study material not found" });
      return;
    }

    res.json(material);
  } catch (error) {
    next(error);
  }
}

export async function getStudyMaterialsByCategory(req, res, next) {
  try {
    const category = req.params.category;

    const db = await getDb();
    const materials = await db
      .collection("study_materials")
      .find({ category })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(materials);
  } catch (error) {
    next(error);
  }
}

export async function createStudyMaterial(req, res, next) {
  try {
    const { valid, errors, value } = validateStudyMaterialPayload(req.body);
    if (!valid) {
      console.error("[Study Materials] Validation failed:", errors);
      res.status(400).json({ error: "Validation failed", details: errors });
      return;
    }

    console.log("[Study Materials] Creating material:", {
      title: value.title,
      category: value.category,
      fileName: value.fileName,
      hasFileData: !!value.fileData,
      fileDataSize: value.fileData ? value.fileData.length : 0,
    });

    const material = {
      title: value.title,
      description: value.description,
      category: value.category,
      fileName: value.fileName,
      uploadedBy: value.uploadedBy,
      fileData: value.fileData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const db = await getDb();
    const result = await db.collection("study_materials").insertOne(material);
    
    console.log("[Study Materials] Material created successfully:", result.insertedId);
    
    // Return material without fileData in response (it's large)
    const { fileData, ...materialWithoutContent } = material;
    res.status(201).json({ _id: result.insertedId, ...materialWithoutContent });
  } catch (error) {
    console.error("[Study Materials] Create error:", error);
    next(error);
  }
}

export async function downloadStudyMaterial(req, res, next) {
  try {
    const materialId = toObjectId(req.params.id);
    if (!materialId) {
      console.error("[Study Materials] Invalid material ID:", req.params.id);
      res.status(400).json({ error: "Invalid material id" });
      return;
    }

    const db = await getDb();
    const material = await db
      .collection("study_materials")
      .findOne({ _id: materialId });

    console.log("[Study Materials] Download request for:", materialId);

    if (!material) {
      console.error("[Study Materials] Material not found:", materialId);
      res.status(404).json({ error: "Study material not found" });
      return;
    }

    console.log("[Study Materials] Found material:", {
      title: material.title,
      fileName: material.fileName,
      hasFileData: !!material.fileData,
      fileDataSize: material.fileData ? material.fileData.length : 0,
    });

    if (!material.fileData) {
      console.error("[Study Materials] No file data for material:", materialId);
      res.status(404).json({ error: "File not found" });
      return;
    }

    // fileData is base64 encoded
    const buffer = Buffer.from(material.fileData, "base64");
    res.setHeader("Content-Type", "application/octet-stream");
    
    // Properly encode filename for Content-Disposition header
    const fileName = material.fileName || "download";
    const encodedFileName = encodeURIComponent(fileName);
    res.setHeader("Content-Disposition", `attachment; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`);
    res.setHeader("Content-Length", buffer.length);
    
    res.send(buffer);
  } catch (error) {
    console.error("[Study Materials] Download error:", error);
    next(error);
  }
}

export async function updateStudyMaterial(req, res, next) {
  try {
    const materialId = toObjectId(req.params.id);
    if (!materialId) {
      res.status(400).json({ error: "Invalid material id" });
      return;
    }

    const { valid, errors, value } = validateStudyMaterialPayload(req.body, { partial: true });
    if (!valid) {
      res.status(400).json({ error: "Validation failed", details: errors });
      return;
    }

    value.updatedAt = new Date();

    const db = await getDb();
    const result = await db
      .collection("study_materials")
      .findOneAndUpdate(
        { _id: materialId },
        { $set: value },
        { returnDocument: "after" }
      );

    if (!result.value) {
      res.status(404).json({ error: "Study material not found" });
      return;
    }

    res.json(result.value);
  } catch (error) {
    next(error);
  }
}

export async function deleteStudyMaterial(req, res, next) {
  try {
    const materialId = toObjectId(req.params.id);
    if (!materialId) {
      res.status(400).json({ error: "Invalid material id" });
      return;
    }

    const db = await getDb();
    const result = await db
      .collection("study_materials")
      .deleteOne({ _id: materialId });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Study material not found" });
      return;
    }

    res.json({ message: "Study material deleted successfully" });
  } catch (error) {
    next(error);
  }
}
