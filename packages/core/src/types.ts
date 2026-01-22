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

export interface KnowletSettingsSchema {
  [key: string]: {
    type: 'boolean' | 'string' | 'number' | 'select';
    label: string;
    default: unknown;
    options?: { label: string; value: unknown }[];
  };
}

export interface KnowletContext {
  situations: Record<string, SituationData>;
  settings: KnowletSettings;
  language: string;
  /** Current color scheme */
  colorScheme: ColorScheme;
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
