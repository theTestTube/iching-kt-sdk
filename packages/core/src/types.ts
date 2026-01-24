import { ReactNode } from 'react';

// Situation Provider Types
export interface SituationData {
  [key: string]: unknown;
}

export interface SituationProvider<T extends SituationData = SituationData> {
  id: string;
  name: string;
  subscribe: (callback: (data: T) => void) => () => void;
  getCurrentData: () => T;
}

// Theme
/** Resolved color scheme (actual theme in use) */
export type ColorScheme = 'light' | 'dark';
/** User preference for color scheme (includes 'system' option) */
export type ColorSchemePreference = 'light' | 'dark' | 'system';

// Knowlet Categories
export type KnowletCategory = 'board' | 'data' | 'tool';

// Output Types for Producer/Consumer Architecture
export type OutputType =
  | 'time'      // TimeData from provider-time
  | 'gps'       // GPS coordinates
  | 'rotation'  // Device rotation/compass
  | 'hexagram'  // Hexagram number (1-64)
  | 'trigram'   // Trigram id
  | 'yinyang'   // 'yin' | 'yang'
  | 'element'   // 'wood' | 'fire' | 'earth' | 'metal' | 'water'
  | 'animal';   // Earthly branch animal

// Knowlet Types
export interface KnowletMeta {
  id: string;
  name: string;
  names?: Record<string, string>;
  description?: string;
  descriptions?: Record<string, string>;
  icon?: string;
  requiredProviders: string[];
  supportedLanguages: string[];
  /** What output types this knowlet can receive as input */
  consumes?: OutputType[];
  /** What output types this knowlet can emit */
  produces?: OutputType[];
  /** Category: 'board' for panels, 'data' for viewers, 'tool' for utilities */
  category?: KnowletCategory;
}

export interface KnowletSettings {
  [key: string]: unknown;
}

/** Localizable string: either a plain string or language-keyed record */
export type LocalizableString = string | Record<string, string>;

export interface KnowletSettingsSchema {
  [key: string]: {
    type: 'boolean' | 'string' | 'number' | 'select';
    /** Label can be a string or localized { en: '...', es: '...', zh: '...' } */
    label: LocalizableString;
    default: unknown;
    options?: { label: LocalizableString; value: unknown }[];
  };
}

/** Translation source for English content */
export type EnglishSource = 'wilhelm' | 'legge';
/** Translation source for Spanish content (all Claude-translated at build time) */
export type SpanishSource = 'zh-claude' | 'legge-claude' | 'wilhelm-claude';

/**
 * User's translation source preferences per language.
 * - Chinese (zh): Always original 周易 (no preference needed)
 * - English (en): Wilhelm-Baynes or Legge (untranslated, direct from source)
 * - Spanish (es): Claude translations from Chinese, Legge, or Wilhelm
 */
export interface TranslationPreferences {
  en: EnglishSource;
  es: SpanishSource;
}

export interface KnowletContext {
  situations: Record<string, SituationData>;
  settings: KnowletSettings;
  language: string;
  /** Current color scheme */
  colorScheme: ColorScheme;
  /** User's translation source preferences */
  translationPreferences: TranslationPreferences;
  jumpTo: (knowletId: string) => void;
  /** Navigate to a detail view within the knowlet */
  pushView: (viewId: string, params?: Record<string, unknown>) => void;
  /** Go back to the previous view */
  popView: () => void;
  /** Current view state (null = main view) */
  currentView: { id: string; params?: Record<string, unknown> } | null;
  /** Emit output to trigger navigation to consuming knowlets */
  emitOutput: (type: OutputType, value: unknown) => void;
  /** Show selector modal to choose a consuming knowlet for the output */
  showKnowletSelector: (type: OutputType, value: unknown) => void;
  /** Input data passed from another knowlet (if navigated via output emission) */
  inputData?: { type: OutputType; value: unknown };
}

export interface Knowlet {
  meta: KnowletMeta;
  settingsSchema?: KnowletSettingsSchema;
  View: React.ComponentType<{ context: KnowletContext }>;
  SettingsView?: React.ComponentType<{
    settings: KnowletSettings;
    onChange: (settings: KnowletSettings) => void;
  }>;
}

// GeoLocator Types (for Solar Time calculation)
/** Precision level for geographic location */
export type LocationPrecision = 'high' | 'medium' | 'low';

/** Geographic position with precision metadata */
export interface GeoPosition {
  /** Longitude in degrees (-180 to 180) */
  longitude: number;
  /** Latitude in degrees (-90 to 90) */
  latitude: number;
  /** Precision level of this position */
  precision: LocationPrecision;
  /** Timestamp when position was acquired */
  timestamp: Date;
  /** Optional: accuracy in meters (when available from platform) */
  accuracyMeters?: number;
}

/** Permission state for location access */
export type LocationPermissionState =
  | 'undetermined'  // User has not been asked yet
  | 'granted'       // User granted permission
  | 'denied'        // User denied permission
  | 'restricted';   // System-level restriction (parental controls, etc.)

/** GeoLocator status */
export interface GeoLocatorStatus {
  permissionState: LocationPermissionState;
  isAvailable: boolean;  // Whether location services are enabled on device
  currentPrecision: LocationPrecision;
}

/** GeoLocator interface - abstracts platform-specific location services */
export interface GeoLocator {
  /** Unique identifier for this locator implementation */
  readonly id: string;

  /** Human-readable name */
  readonly name: string;

  /** Maximum precision this locator can provide */
  readonly maxPrecision: LocationPrecision;

  /** Current cached position for sync access. Null if no position acquired yet. */
  readonly currentPosition?: GeoPosition | null;

  /** Get current status */
  getStatus(): GeoLocatorStatus;

  /** Request location permission (if needed) */
  requestPermission(): Promise<LocationPermissionState>;

  /** Get current position (one-shot) */
  getCurrentPosition(): Promise<GeoPosition>;

  /** Subscribe to position updates (continuous tracking) */
  subscribe(callback: (position: GeoPosition) => void): () => void;

  /** Stop all tracking and release resources */
  dispose(): void;
}

// Translation Metadata Types (for attribution display)
/** Known translation sources */
export type TranslationSource =
  | 'wilhelm'          // Wilhelm-Baynes translation
  | 'legge'            // James Legge translation (1882)
  | 'claude'           // Claude (Anthropic) AI translation
  | 'original-chinese' // Original Zhouyi text
  | 'project';         // Original project content

/** License classification for translated content */
export type TranslationLicense =
  | 'public-domain'    // No copyright restrictions
  | 'mit'              // MIT licensed (project-owned derivatives)
  | 'proprietary';     // App-exclusive content

/** Original language of the source text */
export type SourceLanguage = 'zh' | 'en' | 'de' | 'es';

/**
 * Metadata attached to translatable content for attribution display.
 * Per decision: 2026-01-22-ux-pattern-for-translation-source-attribution-display.md
 */
export interface TranslationMetadata {
  /** Primary source of this translation */
  source: TranslationSource;
  /** Human-readable translator name (e.g., "Richard Wilhelm", "Claude (Anthropic)") */
  translator?: string;
  /** Year of translation */
  year?: number;
  /** License classification */
  license: TranslationLicense;
  /** Original language the translation was made from */
  originalLanguage: SourceLanguage;
  /** Reference translations consulted (for Claude translations) */
  referenceTranslations?: string[];
}

/**
 * Content with attached translation metadata.
 * Use this interface for any user-facing I-Ching text content.
 */
export interface TranslatableContent {
  /** The actual text content */
  text: string;
  /** Translation metadata for attribution */
  metadata: TranslationMetadata;
}

/**
 * Multi-language content with per-language translation metadata.
 * Each language entry has its own attribution.
 */
export interface LocalizedContent {
  /** Content keyed by language code (e.g., 'en', 'es', 'zh') */
  [languageCode: string]: TranslatableContent;
}

// Registry Types
export interface KnowletRegistry {
  register: (knowlet: Knowlet) => void;
  get: (id: string) => Knowlet | undefined;
  getAll: () => Knowlet[];
  getCompatible: (providerIds: string[]) => Knowlet[];
}

export interface ProviderRegistry {
  register: <T extends SituationData>(provider: SituationProvider<T>) => void;
  get: <T extends SituationData>(id: string) => SituationProvider<T> | undefined;
  getAll: () => SituationProvider[];
}
