// types/project.ts — VideoNova Studio
// Définition complète des types TypeScript du projet vidéo

// ─────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────

export type VideoFormat = "16:9" | "9:16" | "1:1";
export type VideoResolution = "720p" | "1080p";
export type ElementType =
  | "video"
  | "image"
  | "audio"
  | "text"
  | "logo"
  | "subtitle"
  | "avatar";
export type TransitionType =
  | "none"
  | "fade"
  | "slide-left"
  | "slide-right"
  | "zoom"
  | "dissolve";
export type TextAlign = "left" | "center" | "right";
export type AnimationType =
  | "none"
  | "fadeIn"
  | "slideUp"
  | "slideDown"
  | "zoomIn"
  | "bounce";

// ─────────────────────────────────────────
// POSITION & DIMENSION
// ─────────────────────────────────────────

export interface Position {
  x: number; // % de la largeur (0–100)
  y: number; // % de la hauteur (0–100)
}

export interface Dimension {
  width: number;  // % de la largeur (0–100)
  height: number; // % de la hauteur (0–100)
}

// ─────────────────────────────────────────
// BACKGROUND
// ─────────────────────────────────────────

export type BackgroundType = "color" | "image" | "video" | "gradient";

export interface Background {
  type: BackgroundType;
  value: string; // couleur hex, URL image/vidéo, ou gradient CSS
}

// ─────────────────────────────────────────
// STYLE TEXTE
// ─────────────────────────────────────────

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
  color: string;
  backgroundColor?: string;
  textAlign: TextAlign;
  letterSpacing?: number;
  lineHeight?: number;
  textShadow?: string;
  opacity?: number;
  padding?: number;
  borderRadius?: number;
}

// ─────────────────────────────────────────
// ANIMATION
// ─────────────────────────────────────────

export interface Animation {
  type: AnimationType;
  duration: number; // secondes
  delay?: number;
  easing?: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out";
}

// ─────────────────────────────────────────
// ÉLÉMENTS DE SCÈNE
// ─────────────────────────────────────────

export interface BaseElement {
  id: string;
  type: ElementType;
  position: Position;
  dimension: Dimension;
  startTime: number; // secondes depuis le début de la scène
  duration: number;  // secondes
  opacity: number;   // 0–1
  zIndex: number;
  animationIn?: Animation;
  animationOut?: Animation;
  locked?: boolean;
  visible?: boolean;
}

export interface VideoElement extends BaseElement {
  type: "video";
  src: string;      // URL du fichier
  assetId: string;  // ID dans MediaAsset
  volume: number;   // 0–1
  muted: boolean;
  loop: boolean;
  trimStart?: number;
  trimEnd?: number;
  fadeIn?: number;
  fadeOut?: number;
  filters?: string[];
}

export interface ImageElement extends BaseElement {
  type: "image";
  src: string;
  assetId: string;
  objectFit: "cover" | "contain" | "fill" | "none";
  borderRadius?: number;
  filters?: string[];
}

export interface AudioElement extends BaseElement {
  type: "audio";
  src: string;
  assetId: string;
  volume: number;
  muted: boolean;
  loop: boolean;
  fadeIn?: number;
  fadeOut?: number;
  trimStart?: number;
  trimEnd?: number;
}

export interface TextElement extends BaseElement {
  type: "text";
  content: string;
  style: TextStyle;
}

export interface LogoElement extends BaseElement {
  type: "logo";
  src: string;
  assetId: string;
  objectFit: "contain" | "cover";
}

export interface SubtitleElement extends BaseElement {
  type: "subtitle";
  content: string;
  style: TextStyle;
  language: string;
}

export interface AvatarElement extends BaseElement {
  type: "avatar";
  avatarId: string;
  src: string;
  voiceText?: string;
  voiceId?: string;
  audioUrl?: string;
  position2D: "left" | "right" | "center";
}

export type SceneElement =
  | VideoElement
  | ImageElement
  | AudioElement
  | TextElement
  | LogoElement
  | SubtitleElement
  | AvatarElement;

// ─────────────────────────────────────────
// TRANSITION
// ─────────────────────────────────────────

export interface Transition {
  type: TransitionType;
  duration: number; // secondes
}

// ─────────────────────────────────────────
// SCÈNE
// ─────────────────────────────────────────

export interface Scene {
  id: string;
  order: number;
  name: string;
  duration: number;    // secondes
  background: Background;
  elements: SceneElement[];
  transition?: Transition; // transition vers la scène suivante
}

// ─────────────────────────────────────────
// PARAMÈTRES D'EXPORT
// ─────────────────────────────────────────

export interface ExportSettings {
  format: VideoFormat;
  resolution: VideoResolution;
  fps: 24 | 25 | 30 | 60;
  quality: "low" | "medium" | "high" | "ultra";
  codec: "h264" | "h265" | "vp9";
  audioBitrate: "128k" | "192k" | "320k";
  addWatermark: boolean;
}

// ─────────────────────────────────────────
// MÉTADONNÉES
// ─────────────────────────────────────────

export interface ProjectMeta {
  author: string;
  authorId: string;
  tags?: string[];
  language: string;
  templateId?: string;
  description?: string;
}

// ─────────────────────────────────────────
// PROJET COMPLET (structure JSON sauvegardée)
// ─────────────────────────────────────────

export interface VideoProject {
  id: string;
  version: string;    // format de fichier, ex: "1.0"
  name: string;
  format: VideoFormat;
  resolution: VideoResolution;
  duration: number;   // durée totale calculée
  scenes: Scene[];
  exportSettings: ExportSettings;
  meta: ProjectMeta;
  createdAt: string;  // ISO 8601
  updatedAt: string;
}

// ─────────────────────────────────────────
// ÉTAT GLOBAL ÉDITEUR (store Zustand)
// ─────────────────────────────────────────

export interface EditorState {
  project: VideoProject | null;
  selectedElementId: string | null;
  selectedSceneId: string | null;
  currentTime: number;
  isPlaying: boolean;
  zoom: number;        // zoom timeline (1 = normal)
  undoStack: VideoProject[];
  redoStack: VideoProject[];
  isSaving: boolean;
  isDirty: boolean;    // modifications non sauvegardées
}

// ─────────────────────────────────────────
// PLAN UTILISATEUR
// ─────────────────────────────────────────

export interface PlanLimits {
  maxProjects: number;
  maxExportsPerMonth: number;
  maxStorageMb: number;
  maxVideoDurationSeconds: number;
  watermark: boolean;
  hdExport: boolean;
  templates: "basic" | "all";
  aiFeatures: boolean;
}

export const PLAN_LIMITS: Record<"FREE" | "PREMIUM" | "ENTERPRISE", PlanLimits> = {
  FREE: {
    maxProjects: 5,
    maxExportsPerMonth: 3,
    maxStorageMb: 500,
    maxVideoDurationSeconds: 120,
    watermark: true,
    hdExport: false,
    templates: "basic",
    aiFeatures: false,
  },
  PREMIUM: {
    maxProjects: 100,
    maxExportsPerMonth: 50,
    maxStorageMb: 10000,
    maxVideoDurationSeconds: 3600,
    watermark: false,
    hdExport: true,
    templates: "all",
    aiFeatures: true,
  },
  ENTERPRISE: {
    maxProjects: 99999,
    maxExportsPerMonth: 99999,
    maxStorageMb: 100000,
    maxVideoDurationSeconds: 99999,
    watermark: false,
    hdExport: true,
    templates: "all",
    aiFeatures: true,
  },
};
