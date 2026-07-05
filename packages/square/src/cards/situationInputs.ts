import type { KnowletContext } from '@iching-kt/core';
import type { SolarTimeData, EarthlyBranch } from '@iching-kt/provider-solar-time';

/**
 * Resolve the earthly branch a board card should render for.
 *
 * Cards are pure functions of their context: pinned cards receive frozen
 * situations (and possibly adopted inputData) instead of live provider data,
 * so no subscription happens here (frozen pinned parameters, 2026-04-07).
 */
export function resolveActiveBranch(context: KnowletContext): EarthlyBranch | undefined {
  const solar = context.situations['solar-time'] as SolarTimeData | undefined;
  return solar?.shichen?.branch ?? solar?.earthlyBranch;
}

/**
 * Resolve what a board card should highlight, honoring the adoption contract:
 * an adopted input of the card's native type is authoritative — even when it
 * maps to nothing (the card then highlights nothing rather than falling back
 * to situations). Only without an adopted input do situations apply.
 */
export function resolveCardHighlight<T>(
  context: KnowletContext,
  inputType: string,
  fromAdopted: (value: unknown) => T | undefined,
  fromBranch: (branch: EarthlyBranch) => T | undefined,
): T | undefined {
  if (context.inputData?.type === inputType) {
    return fromAdopted(context.inputData.value);
  }
  const branch = resolveActiveBranch(context);
  return branch !== undefined ? fromBranch(branch) : undefined;
}
