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

// Knowlet Types
export interface KnowletMeta {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  requiredProviders: string[];
  supportedLanguages: string[];
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
  jumpTo: (knowletId: string) => void;
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
