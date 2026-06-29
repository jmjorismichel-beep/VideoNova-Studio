// tests/setup.ts
// Configuration globale pour les tests Vitest

import { vi } from "vitest";

// Mock Prisma client pour éviter les appels BDD dans les tests unitaires
vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    project: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    exportJob: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    mediaAsset: {
      findMany: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    subscription: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    usageLog: {
      create: vi.fn(),
    },
    $transaction: vi.fn((fns) => Promise.all(fns)),
  },
}));
