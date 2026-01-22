# UI Testing for Square Package

This directory contains UI tests using two complementary testing frameworks:

## 1. Jest + React Native Testing Library (Unit/Integration Tests)

**Files:** `*.test.tsx`

### Purpose
- Component unit tests
- State transition testing
- Props and callback verification
- Accessibility testing

### Installation
```bash
npm install --save-dev @testing-library/react-native jest @types/jest react-test-renderer
```

### Running Tests
```bash
# Run all tests
npm test

# Run with watch mode
npm run test:watch

# Run specific test file
npm test -- --testPathPattern=HeTuView

# Run with coverage
npm test -- --coverage
```

### Key Test Cases
- **Rendering**: Verifies all elements render correctly
- **Localization**: Tests English and Spanish translations
- **State Transitions**: Tests active element changes when time branch changes
- **Interactions**: Verifies press and long-press callbacks
- **Edge Cases**: Handles missing data gracefully

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

---

## CI Integration

### GitHub Actions Example
```yaml
name: UI Tests
on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm install
      - run: npm test -- --coverage

  e2e-tests:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: mobile-dev-inc/action-maestro-cloud@v1
        with:
          api-key: ${{ secrets.MAESTRO_CLOUD_API_KEY }}
          app-file: app-release.apk
```
