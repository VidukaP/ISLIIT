const CATEGORIES = ["Notes", "Short Notes", "Past Papers", "Model Papers", "Quizzes"];

const studyMaterialFields = ["title", "description", "category", "fileName", "uploadedBy", "fileData"];

export function validateStudyMaterialPayload(payload, { partial = false } = {}) {
  const errors = [];
  const value = {};

  // Validate standard fields
  for (const field of ["title", "description", "category", "fileName", "uploadedBy"]) {
    const hasField = Object.prototype.hasOwnProperty.call(payload ?? {}, field);
    if (!hasField && !partial) {
      errors.push(`${field} is required`);
      continue;
    }

    if (hasField) {
      const raw = String(payload[field]).trim();
      if (!raw) {
        errors.push(`${field} is required`);
        continue;
      }

      if (field === "category" && !CATEGORIES.includes(raw)) {
        errors.push(`category must be one of: ${CATEGORIES.join(", ")}`);
        continue;
      }

      value[field] = raw;
    }
  }

  // Handle fileData separately (base64 string)
  if (Object.prototype.hasOwnProperty.call(payload ?? {}, "fileData")) {
    const fileData = payload.fileData;
    if (fileData && typeof fileData === "string" && fileData.length > 0) {
      value.fileData = fileData;
    } else if (!partial) {
      errors.push("fileData is required");
    }
  } else if (!partial) {
    errors.push("fileData is required");
  }

  return {
    valid: errors.length === 0,
    errors,
    value,
  };
}

export function getCategories() {
  return CATEGORIES;
}
