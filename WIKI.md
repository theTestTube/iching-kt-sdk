# WIKI.md

**Contributors can skip this file.** To contribute, open an issue or a pull request against
`develop`. Nothing described here is a prerequisite: the rules a change must follow are in
[CLAUDE.md](CLAUDE.md) and in the code.

The maintainers keep the design rationale behind these packages (why they are shaped the way they
are) in a wiki outside this repository. **It is a maintenance surface, not an execution-time
read:** consult it when changing why the SDK is shaped the way it is; do not route ordinary SDK
work through it.

## For wiki maintainers

1. **Pages:** in the wiki repository, wiki root `.wiki/`, pages in `.wiki/wiki/concepts/`. Pages
   about SDK code are compiled there, not here.
2. **Collection:** `iching-kt-sdk`. Manifests are `.wiki/raw/repos/iching-kt-sdk-<YYYY-MM-DD>.md`
   (a second one on the same day takes a `-<short revision>` suffix). The wiki's `_index.md`
   § *Collections* lists which one is current. The first is `iching-kt-sdk-2026-09-13`, pinned
   at `19a6272` on `origin/develop`. A manifest lists this repository's paths and blob SHAs only
   and copies no bytes from it. Manifests are write-once, and each new one supersedes the last.
3. **Update:** from inside a checkout of the wiki repository and **never with `--wiki`**, write a
   new manifest at this repository's `origin/develop`, as the wiki's `schema.md` describes:

   ```bash
   git -C <sdk checkout> fetch origin develop
   git -C <sdk checkout> ls-tree -r origin/develop -- <paths>   # the Path | Blob SHA rows
   ```

   Verify every row with the wiki repository's `foreign-manifests` gate, then recompile the pages
   that cite the old manifest, and lint. Pin `origin/develop`, never the branch a local checkout
   happens to be on.
4. **No wiki here:** this repository holds no `.wiki/` directory and no compiled page. Do not
   create one. The wiki tooling resolves a `.wiki/` in the working directory before its registry,
   so every session started here would read and write that copy instead of the real one.
5. **License:** this repository's own contributions are licensed under MIT (see `LICENSE`), so
   nothing is copied from the wiki into it.
