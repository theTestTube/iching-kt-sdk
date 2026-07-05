# UI Testing for Square Package

This directory contains UI tests using two complementary testing frameworks:

## 1. Vitest + Testing Library (Unit/Integration Tests)

**Files:** `*.test.tsx`

Suites run under the workspace-root Vitest config (`vitest.config.ts`): jsdom
environment, `react-native` aliased to `react-native-web`, and globals enabled
(`describe`/`it`/`expect`/`vi` — no imports needed). Components render with
`@testing-library/react`; the DOM they produce comes from react-native-web.

### Purpose
- Component unit tests
- State transition testing
- Props and callback verification
- Accessibility testing

### Running Tests
```bash
# From the workspace root — all packages
pnpm test

# Watch mode
pnpm test:watch

# Run specific test file(s) by filter
npx vitest run HeTuView

# Run only this package's suites
npx vitest run packages/square

# With coverage
npx vitest run --coverage
```

### Key Test Cases
- **Rendering**: Verifies all elements render correctly
- **Localization**: Tests English and Spanish translations
- **State Transitions**: Tests active element changes when time branch changes
- **Interactions**: Verifies press and long-press callbacks
- **Edge Cases**: Handles missing data gracefully
- **Board cards**: Compact CardView miniatures (`*CardView.test.tsx`) — active
  highlighting from frozen situations, and adopted `inputData` precedence

---

## 2. Maestro (E2E Tests)

**Files:** `*.maestro.yaml`

### Purpose
- End-to-end user flow testing
- Visual regression testing
- Cross-device compatibility
- Real device interaction testing

### Installation
```bash
# macOS/Linux
curl -Ls "https://get.maestro.mobile.dev" | bash

# Windows (via WSL)
curl -Ls "https://get.maestro.mobile.dev" | bash
```

### Running Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run single flow
maestro test src/__tests__/HeTuView.maestro.yaml

# Record new flows interactively
npm run test:e2e:record

# Run with studio (visual debugger)
maestro studio
```

### Key Test Flows
1. **Element Rendering**: Verifies all five elements display correctly
2. **Tap Interactions**: Tests element tap behavior
3. **Long Press**: Tests knowlet selector display
4. **State Transitions**: Captures before/after screenshots during time changes
5. **Localization**: Tests Spanish language display
6. **Visual Regression**: Baseline screenshots for Earth element
7. **Stress Test**: Rapid interactions to detect glitches

---

## Test Coverage Focus: State Transitions

The primary bug being tested is the **Earth element visual glitch during state transitions**.

### Scenario
When the active element changes from Earth (branches: chen, xu, chou, wei) to Water (branches: zi, hai), the Earth element may incorrectly retain a "grey box" appearance without text or indicators.

### Root Cause
The `ActionableElement` component uses `useRef` for animation values that persist across re-renders. Without proper reset on state change, animations could leave elements in inconsistent visual states.

### Fix Applied
Added `useEffect` hook in `ActionableElement.tsx`:
```tsx
useEffect(() => {
  scaleAnim.setValue(1);
  opacityAnim.setValue(0);
}, [isActive, scaleAnim, opacityAnim]);
```

### Test Verification
- `HeTuView.test.tsx`: "State Transitions" describe block
- `HeTuView.maestro.yaml`: Flow 4 (state transitions) and Flow 6 (Earth element visual regression)
