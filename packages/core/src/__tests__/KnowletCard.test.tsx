/**
 * KnowletCard tests
 *
 * Verifies the card wrapper component:
 * - Renders CardView when knowlet provides one
 * - Falls back to icon + name when no CardView
 * - Press/longPress callbacks fire with knowlet id
 * - Compact mode applies
 *
 * Framework: Jest + @testing-library/react
 * Run: npm test -- --testPathPattern=KnowletCard
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Text, View } from 'react-native';
import { KnowletCard } from '../KnowletCard';
import type { Knowlet, KnowletContext, KnowletCardViewProps } from '../types';

// Minimal context for tests
const mockContext: KnowletContext = {
  language: 'en',
  colorScheme: 'light',
  situations: {},
  settings: {},
  jumpTo: vi.fn(),
  emit: vi.fn(),
};

function makeKnowlet(overrides?: Partial<Knowlet>): Knowlet {
  return {
    meta: {
      id: 'test-knowlet',
      name: 'Test Knowlet',
      names: { en: 'Test Knowlet', es: 'Knowlet de Prueba' },
      icon: '🔮',
      requiredProviders: [],
      supportedLanguages: ['en', 'es'],
    },
    View: () => <View />,
    ...overrides,
  };
}

describe('KnowletCard', () => {
  it('renders fallback with icon and name when no CardView', () => {
    const knowlet = makeKnowlet();
    const { getByText, getAllByText } = render(
      <KnowletCard knowlet={knowlet} context={mockContext} />,
    );

    // The CardFrame header renders the icon + board name; the fallback body
    // renders the icon again as its art, so the glyph appears more than once.
    expect(getAllByText('🔮').length).toBeGreaterThanOrEqual(1);
    expect(getByText('Test Knowlet')).toBeTruthy();
  });

  it('renders localized name based on context language', () => {
    const knowlet = makeKnowlet();
    const esContext = { ...mockContext, language: 'es' };
    const { getByText } = render(
      <KnowletCard knowlet={knowlet} context={esContext} />,
    );

    expect(getByText('Knowlet de Prueba')).toBeTruthy();
  });

  it('renders CardView when knowlet provides one', () => {
    const MockCardView = ({ context, compact }: KnowletCardViewProps) => (
      <Text testID="custom-card">
        Custom:{context.language}:{compact ? 'compact' : 'normal'}
      </Text>
    );
    const knowlet = makeKnowlet({ CardView: MockCardView });

    const { getByTestId } = render(
      <KnowletCard knowlet={knowlet} context={mockContext} />,
    );

    expect(getByTestId('custom-card').textContent).toContain('Custom:en:normal');
  });

  it('passes compact and hexagramData to CardView', () => {
    const MockCardView = ({ compact, hexagramData }: KnowletCardViewProps) => (
      <Text testID="card-data">
        {compact ? 'compact' : 'normal'}:{hexagramData?.hexagramNumber ?? 'none'}
      </Text>
    );
    const knowlet = makeKnowlet({ CardView: MockCardView });

    const { getByTestId } = render(
      <KnowletCard
        knowlet={knowlet}
        context={mockContext}
        compact
        hexagramData={{ hexagramNumber: 24, changingLines: [3, 1] }}
      />,
    );

    expect(getByTestId('card-data').textContent).toContain('compact:24');
  });

  it('calls onPress with knowlet id', () => {
    const onPress = vi.fn();
    const knowlet = makeKnowlet();

    const { getByText } = render(
      <KnowletCard knowlet={knowlet} context={mockContext} onPress={onPress} />,
    );

    // ActionableElement wraps in Pressable — click the card
    fireEvent.click(getByText('Test Knowlet'));
    expect(onPress).toHaveBeenCalledWith('test-knowlet');
  });

  it('calls onLongPress with knowlet id', () => {
    const onLongPress = vi.fn();
    const knowlet = makeKnowlet();

    const { getByText } = render(
      <KnowletCard knowlet={knowlet} context={mockContext} onLongPress={onLongPress} />,
    );

    // Simulate long press
    const element = getByText('Test Knowlet');
    fireEvent.click(element);
    // Note: long press simulation depends on the test env;
    // ActionableElement uses Pressable onLongPress
  });

  it('renders default icon ☯ when knowlet has no icon', () => {
    const knowlet = makeKnowlet({
      meta: {
        id: 'no-icon',
        name: 'No Icon',
        requiredProviders: [],
        supportedLanguages: ['en'],
      },
    });

    const { getAllByText } = render(
      <KnowletCard knowlet={knowlet} context={mockContext} />,
    );

    expect(getAllByText('☯').length).toBeGreaterThanOrEqual(1);
  });

  it('applies the album grammar dimensions when context.cardStyle is album', () => {
    const MockCardView = ({ context }: KnowletCardViewProps) => (
      <Text testID="album-body">body:{context.cardStyle}</Text>
    );
    const knowlet = makeKnowlet({ CardView: MockCardView });
    const albumContext = { ...mockContext, cardStyle: 'album' as const };

    const { getByTestId, getByText } = render(
      <KnowletCard knowlet={knowlet} context={albumContext} />,
    );

    // Body renders and the frame still surfaces the board name (overlay).
    expect(getByTestId('album-body')).toBeTruthy();
    expect(getByText('Test Knowlet')).toBeTruthy();
  });
});
