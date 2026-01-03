import { useEffect, useState, useSyncExternalStore } from 'react';
import { SituationData, SituationProvider } from './types';

export function useSituation<T extends SituationData>(
  provider: SituationProvider<T>
): T {
  return useSyncExternalStore(
    provider.subscribe,
    provider.getCurrentData,
    provider.getCurrentData
  );
}

export function useSituations(
  providers: SituationProvider[]
): Record<string, SituationData> {
  const [data, setData] = useState<Record<string, SituationData>>(() => {
    const initial: Record<string, SituationData> = {};
    for (const p of providers) {
      initial[p.id] = p.getCurrentData();
    }
    return initial;
  });

  useEffect(() => {
    const unsubscribes = providers.map((provider) =>
      provider.subscribe((newData) => {
        setData((prev) => ({ ...prev, [provider.id]: newData }));
      })
    );
    return () => unsubscribes.forEach((unsub) => unsub());
  }, [providers]);

  return data;
}
