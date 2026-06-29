// tests/unit/project-validation.test.ts
// Tests de validation de la structure d'un projet VideoNova

import { describe, it, expect } from "vitest";

// Fonction utilitaire de validation du format JSON projet
function validateProjectJSON(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (typeof data !== "object" || data === null) {
    return { valid: false, errors: ["Le fichier doit être un objet JSON"] };
  }

  const project = data as Record<string, unknown>;

  if (!project.id || typeof project.id !== "string") errors.push("id manquant ou invalide");
  if (!project.nom || typeof project.nom !== "string") errors.push("nom manquant");
  if (!project.version || typeof project.version !== "number") errors.push("version manquante");
  if (!project.format || !["16:9", "9:16", "1:1"].includes(project.format as string)) {
    errors.push("format invalide (doit être 16:9, 9:16 ou 1:1)");
  }
  if (!Array.isArray(project.scenes)) errors.push("scenes doit être un tableau");

  return { valid: errors.length === 0, errors };
}

describe("Validation de projet JSON", () => {
  const validProject = {
    id: "proj-123",
    nom: "Mon projet test",
    version: 1,
    format: "16:9",
    resolution: "720p",
    scenes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it("accepte un projet valide", () => {
    const result = validateProjectJSON(validProject);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejette un projet sans nom", () => {
    const { nom: _nom, ...sans } = validProject;
    const result = validateProjectJSON(sans);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("nom manquant");
  });

  it("rejette un format invalide", () => {
    const result = validateProjectJSON({ ...validProject, format: "4:3" });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("format"))).toBe(true);
  });

  it("rejette un projet sans scenes tableau", () => {
    const result = validateProjectJSON({ ...validProject, scenes: "pas un tableau" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("scenes doit être un tableau");
  });

  it("rejette null", () => {
    const result = validateProjectJSON(null);
    expect(result.valid).toBe(false);
  });
});
