// tests/unit/crypto.test.ts
// Tests des fonctions de hachage de mot de passe

import { describe, it, expect } from "vitest";
import { hashPassword, comparePassword } from "@/lib/crypto";

describe("crypto", () => {
  it("hashPassword retourne un hash différent du mot de passe original", async () => {
    const password = "MonMotDePasse123!";
    const hash = await hashPassword(password);
    expect(hash).not.toBe(password);
    expect(hash.startsWith("$2")).toBe(true); // hash bcrypt
  });

  it("comparePassword retourne true pour le bon mot de passe", async () => {
    const password = "MonMotDePasse123!";
    const hash = await hashPassword(password);
    const result = await comparePassword(password, hash);
    expect(result).toBe(true);
  });

  it("comparePassword retourne false pour un mauvais mot de passe", async () => {
    const password = "MonMotDePasse123!";
    const hash = await hashPassword(password);
    const result = await comparePassword("MauvaisMotDePasse", hash);
    expect(result).toBe(false);
  });

  it("deux hashes du même mot de passe sont différents (salt aléatoire)", async () => {
    const password = "MonMotDePasse123!";
    const hash1 = await hashPassword(password);
    const hash2 = await hashPassword(password);
    expect(hash1).not.toBe(hash2);
  });
});
