# WIKI.md

This repo's design knowledge is compiled into the I-Ching KT wiki. **It is a maintenance
surface, not an execution-time read:** consult it when changing why the SDK is shaped the way it
is; do not route ordinary SDK work through it.

1. **Pages:** `theTestTube/iching-kt` (private), wiki root `.wiki/`, pages in
   `.wiki/wiki/concepts/`. Pages about SDK code are compiled there, in that repository's
   migration slices.
2. **Collection:** `iching-kt-sdk`. Current manifest `iching-kt-sdk-2026-09-13`
   (`.wiki/raw/repos/iching-kt-sdk-2026-09-13.md`, pinned at `19a6272` on `origin/develop`). A
   manifest lists paths and blob SHAs only; it copies no bytes from this repository. Manifests
   are write-once, and each new one supersedes the last.
3. **Update:** from inside an `iching-kt` checkout and **never with `--wiki`**, write a new
   manifest at this repository's `origin/develop` as `.wiki/schema.md` § *The raw layer is a
   manifest* says, and verify it with `scripts/gates/run.sh foreign-manifests`. Then recompile
   the pages that cite the old manifest and lint. Pin `origin/develop`, never the branch a local
   checkout happens to be on.
4. **No wiki here:** this repository holds no `.wiki/` directory and no compiled page. Do not
   create one. The wiki tooling resolves a `.wiki/` in the working directory before its registry,
   so every session started here would read and write that copy instead of the real one.
5. **Licence:** everything committed here is released under this repository's MIT licence, so
   nothing is copied from the wiki into this repository.
