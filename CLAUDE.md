# CLAUDE.md

This file guides Claude Code (claude.ai/code) when it works in this repository. That includes the
review and assistant workflows in `.github/workflows/`.

## Repository

`iching-kt-sdk` is the public, MIT-licensed SDK of I-Ching KT: a pnpm workspace of TypeScript
packages under `packages/*`. `packages/core` holds the shared contracts and components. The
other packages are built-in knowlets, providers and data. Applications consume them as packages.

## Commands

```bash
pnpm i                 # Install
pnpm run typecheck     # Typecheck every package
pnpm test              # Vitest, once
pnpm run test:watch    # Vitest, watch mode
pnpm run build         # Build every package that has a build script
```

Vitest runs in `jsdom` with `react-native` aliased to `react-native-web`. It collects
`packages/*/src/**/*.test.{ts,tsx}`. CI (`.github/workflows/ci.yml`) runs install, typecheck and
test on every push and pull request to `develop`.

## Conventions

- `develop` is the trunk; pull requests target it.
- Commit messages are prefix-based and at most 128 characters: `add:`, `upd:`, `rm:`, `fix:`,
  `wip:`, `merge:`.
- Repository documents are written in English.
- This repository's own contributions are licensed under MIT (see `LICENSE`). Do not add text
  whose rights would not allow that. Link to it instead.
- The maintainers keep design rationale in a wiki outside this repository. Contributing does not
  require it. See [WIKI.md](WIKI.md).
