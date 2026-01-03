import {
  Knowlet,
  KnowletRegistry,
  ProviderRegistry,
  SituationData,
  SituationProvider,
} from './types';

export function createKnowletRegistry(): KnowletRegistry {
  const knowlets = new Map<string, Knowlet>();

  return {
    register(knowlet: Knowlet) {
      knowlets.set(knowlet.meta.id, knowlet);
    },
    get(id: string) {
      return knowlets.get(id);
    },
    getAll() {
      return Array.from(knowlets.values());
    },
    getCompatible(providerIds: string[]) {
      const providerSet = new Set(providerIds);
      return this.getAll().filter((k) =>
        k.meta.requiredProviders.every((p) => providerSet.has(p))
      );
    },
  };
}

export function createProviderRegistry(): ProviderRegistry {
  const providers = new Map<string, SituationProvider>();

  return {
    register<T extends SituationData>(provider: SituationProvider<T>) {
      providers.set(provider.id, provider);
    },
    get<T extends SituationData>(id: string) {
      return providers.get(id) as SituationProvider<T> | undefined;
    },
    getAll() {
      return Array.from(providers.values());
    },
  };
}
