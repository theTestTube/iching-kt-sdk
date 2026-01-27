## HexagramCard Component

The `HexagramCard` component is a miniaturized, reusable hexagram display component extracted from the HexagramDetailView. It's designed to show hexagram information in compact views such as HoursView, while respecting the user's translation source preferences.

### Key Features

1. **Translation Source Awareness**: Automatically uses the user's selected translation source (Wilhelm, Legge, or Zhouyi) to display hexagram names in their preferred language and translation style.

2. **Consistent with User Preferences**: Uses `getTranslationSourceForLanguage()` to read from `context.translationPreferences`, ensuring that the same translation source used in HexagramDetailView is used across all places displaying hexagrams.

3. **Multi-Language Support**: Works with English (en), Spanish (es), and Chinese (zh) languages, with appropriate translation sources for each.

4. **Reusable**: Can be imported and used in any component that needs to display a miniaturized hexagram card.

### Usage

```tsx
import { HexagramCard } from '@iching-kt/hours';

// Basic usage
<HexagramCard
  context={context}
  hexagramNumber={23}
/>

// With custom label and handlers
<HexagramCard
  context={context}
  hexagramNumber={23}
  label="Sovereign Hexagram"
  onPress={() => context.emitOutput('hexagram', 23)}
  onLongPress={() => context.showKnowletSelector('hexagram', 23)}
  style={styles.customStyle}
/>
```

### Props

- **context** (`KnowletContext`, required): The knowlet context providing language, translation preferences, and color scheme settings.
- **hexagramNumber** (`number`, required): The hexagram number (1-64) to display.
- **label** (`string`, optional): A custom label to display above the hexagram information (e.g., "Sovereign Hexagram").
- **onPress** (`() => void`, optional): Callback function when the card is pressed.
- **onLongPress** (`() => void`, optional): Callback function when the card is long-pressed.
- **style** (`any`, optional): Custom style overrides for the card container.

### Translation Behavior

The component determines which translation to use based on:

1. **Language**: From `context.language`
2. **User Preference**: From `context.translationPreferences[language]`
3. **Source**: Resolved via `getTranslationSourceForLanguage()`

#### Examples

**English with Wilhelm translation (default)**:
```tsx
<HexagramCard
  context={{ language: 'en', translationPreferences: { en: 'wilhelm', es: 'wilhelm', zh: 'zhouyi' }, ... }}
  hexagramNumber={23}
/>
// Displays: "Splitting Apart"
```

**Spanish with Legge translation**:
```tsx
<HexagramCard
  context={{ language: 'es', translationPreferences: { en: 'wilhelm', es: 'legge', zh: 'zhouyi' }, ... }}
  hexagramNumber={23}
/>
// Displays: "Po" (Legge translation)
```

**Chinese with Zhouyi translation**:
```tsx
<HexagramCard
  context={{ language: 'zh', translationPreferences: { en: 'wilhelm', es: 'wilhelm', zh: 'zhouyi' }, ... }}
  hexagramNumber={23}
/>
// Displays: "剝" (Chinese character with pinyin)
```

### Component Structure

The card displays:
- **Label**: Optional custom label (e.g., "Sovereign Hexagram")
- **Unicode Symbol**: Large hexagram unicode character (䷖ for #23)
- **Number**: Hexagram number (#23)
- **Name**: Translated hexagram name according to user preferences
- **Chinese**: Original Chinese character with pinyin pronunciation (e.g., 剝 (bō))

### Responsive Design

- The component is fully responsive and uses React Native's Flexbox layout
- Adapts to light and dark color schemes via `getThemeColors()`
- Works with custom style props for fine-tuning layout

### Integration with HoursView

The component is used in HoursView to display the "Sovereign Hexagram" for the current hour (shichen):

```tsx
<HexagramCard
  context={context}
  hexagramNumber={sovereignMapping.hexagramNumber}
  label={t.labels.sovereignHexagram}
  onPress={handleHexagramPress}
  onLongPress={handleHexagramLongPress}
  style={styles.hexagramCard}
/>
```

This replaces the previous inline JSX that was mixed with HoursView logic, making the code more maintainable and the component reusable.

### Related Components

- **HexagramDetailView**: Full-detail view of a hexagram with judgments, images, and trigram analysis
- **HexagramView**: Part of the hexagrams knowlet package
- **ActionableElement**: Base component used for interactive elements

### Translation System

The component uses the shared translation utilities from `@iching-kt/core`:
- `getTranslationSourceForLanguage()`: Determines the translation source based on language and user preferences
- `getHexagramTranslationBySource()`: Retrieves the specific translation
- `getTranslationKey()`: Constructs the translation lookup key

For more details on the translation system, see the [core package documentation](../../core/src/translations.ts).

### Testing

Comprehensive test suite available in `HexagramCard.test.tsx` covers:
- Translation source preference handling
- Multi-language support (English, Spanish, Chinese)
- Display content accuracy
- Color scheme support
- Error handling for invalid hexagrams
- User interaction handlers

Run tests:
```bash
npm test -- --testPathPattern=HexagramCard
```

### Performance Considerations

- Uses memoization through `getHexagram()` and `getHexagramTranslationBySource()` caching
- Minimal re-renders when context properties remain stable
- Consider wrapping with `React.memo()` if used in frequently-updating parent components

### Accessibility

The component inherits accessibility features from `ActionableElement`:
- Proper touch targets for mobile interaction
- Long-press support for alternative actions (knowlet selector)
- Works with screen readers through proper text semantics
