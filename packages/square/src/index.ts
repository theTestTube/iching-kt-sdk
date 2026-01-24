import React from 'react';
import { Knowlet, KnowletContext, KnowletSettingsSchema } from '@iching-kt/core';
import { LoShuView } from './views/LoShuView';
import { HeTuView } from './views/HeTuView';
import { BranchesCircleView } from './views/BranchesCircleView';
import { HexagramMatrixView } from './views/HexagramMatrixView';

export type SquareViewMode = 'loshu' | 'hetu' | 'branches' | 'matrix';

const VIEW_COMPONENTS: Record<SquareViewMode, React.ComponentType<{ context: KnowletContext }>> = {
  loshu: LoShuView,
  hetu: HeTuView,
  branches: BranchesCircleView,
  matrix: HexagramMatrixView,
};

function SquareKnowletView({ context }: { context: KnowletContext }) {
  const viewMode = (context.settings.viewMode as SquareViewMode) || 'loshu';
  const ViewComponent = VIEW_COMPONENTS[viewMode] || LoShuView;
  return React.createElement(ViewComponent, { context });
}

export const squareSettingsSchema: KnowletSettingsSchema = {
  viewMode: {
    type: 'select',
    label: { en: 'View Mode', es: 'Modo de Vista', zh: '檢視模式' },
    default: 'loshu',
    options: [
      { label: { en: 'Lo Shu (3x3 Magic Square)', es: 'Lo Shu (Cuadrado Mágico 3x3)', zh: '洛書（三三宮格）' }, value: 'loshu' },
      { label: { en: 'He Tu (River Map)', es: 'He Tu (Mapa del Río)', zh: '河圖' }, value: 'hetu' },
      { label: { en: '12 Branches Circle', es: 'Círculo de 12 Ramas', zh: '十二支圓環' }, value: 'branches' },
      { label: { en: 'Hexagram Matrix (8x8)', es: 'Matriz de Hexagramas (8x8)', zh: '六十四卦矩陣' }, value: 'matrix' },
    ],
  },
};

export const squareKnowlet: Knowlet = {
  meta: {
    id: 'boards',
    name: 'Boards',
    names: {
      en: 'Boards',
      es: 'Paneles',
      zh: '面板',
    },
    description: 'Traditional I-Ching diagrams: Lo Shu, He Tu, and more',
    descriptions: {
      en: 'Traditional I-Ching diagrams: Lo Shu, He Tu, and more',
      es: 'Diagramas tradicionales del I-Ching: Lo Shu, He Tu, y más',
      zh: '傳統易經圖：洛書、河圖等',
    },
    requiredProviders: ['solar-time'],
    supportedLanguages: ['en', 'es', 'zh'],
    consumes: ['hexagram', 'trigram', 'time'],
    produces: ['hexagram', 'trigram'],
    category: 'board',
  },
  settingsSchema: squareSettingsSchema,
  View: SquareKnowletView,
};

export { LoShuView, HeTuView, BranchesCircleView, HexagramMatrixView };
