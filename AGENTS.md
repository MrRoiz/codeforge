# AGENTS.md

`codeforge` is a TypeScript/Ink TUI for practicing coding-interview exercises. It generates
exercise + Jest files into a user directory and runs them in a child process. Node >= 20, pnpm only
(`pnpm-lock.yaml`, `packageManager: pnpm@10.33.4`).

## Commands

```bash
pnpm install        # also runs `prepare` -> husky && tsup (builds dist/)
pnpm dev            # tsx src/index.tsx — TUI from source, no build needed
pnpm build          # tsup -> dist/index.js, dist/lib.js, dist/jestRunner.js
pnpm typecheck      # tsc --noEmit
pnpm test           # node --import tsx --test over src/**/*.test.ts
pnpm lint           # biome check .   (also formats: pnpm lint:fix)
```

CI order is **lint -> typecheck -> test** (`.github/workflows/pr-checks.yml`). `.husky/pre-commit`
runs `pnpm lint` then `pnpm test`. Run lint, typecheck, and test before finishing a change.

## Non-obvious constraints

- **The TUI cannot run headless.** `src/index.tsx` exits if `!process.stdin.isTTY`, so `pnpm dev`
  and `node dist/index.js` only work in a real terminal. Do not try to smoke-test the TUI in CI or
  from an agent shell. Verify via unit tests or the programmatic API in `src/lib.ts`.
- **`pnpm test` is node's built-in runner, not Jest.** Jest/ts-jest are only used *programmatically*
  by `src/utils/jestRunner.ts` (spawned as a child process to run a user's generated
  `exercise.test.ts`). There is no jest config file — do not add one or invoke the `jest` CLI.
- Only `src/utils/state` and `src/utils/complexity` have unit tests. There is no test suite for the
  TUI or for individual exercises.
- Tests import with a **`.js` extension** (`from './index.js'`) even though the source is `.ts`.
  Match this in new test files. Bundler-style extensionless imports are for `@`-aliased source only.
- `dist/` is gitignored build output; never edit it.

## Architecture

- `src/index.tsx` — Ink/React TUI entry + bin. `src/lib.ts` — programmatic API (exports exercises,
  generate, runTests, state, complexity).
- `src/app/` — screens, action hooks, Jotai atoms. `src/components/` — shared Ink UI.
- `src/exercises/` — one file per exercise + barrel `index.ts`. `types.ts` defines `Exercise`.
- `src/utils/generate.ts` renders `exercise.ts` and the test file. It **never overwrites an existing
  `exercise.ts`** (protects user work) but **always regenerates `exercise.test.ts`**.
- `src/utils/runTests.ts` spawns `jestRunner`; under `pnpm dev` it spawns the TS runner via tsx, so
  no build is required for local exercise runs.

## Adding an exercise

1. Create `src/exercises/<kebab-case-id>.ts` exporting an `Exercise` (see `types.ts`).
2. Register it in `src/exercises/index.ts` in **three** places: a named `export`, a named `import`,
   and the `exercises` array. (README says "one line"; it is three.)
3. `functionSignature` must be an exported function declaration — `generate.ts` parses the name with
   `/function\s+(\w+)/` and the generated test does `import { fn } from './exercise.js'`. For
   classes/interfaces (LRU Cache, MinStack, tree/list nodes, …) provide a full `stub` string instead.
4. Test flags: `sorted: true` for order-insensitive arrays, `mutatesInput` for in-place solutions
   (e.g. move-zeroes), `mutatesInputPrefix` (e.g. string-compression), `fileBody` to hand-write a
   test file. Generated tests normalize `-0` to `0`.

## Path aliases

`@app/*`, `@components/*`, `@exercises`, `@exercises/*`, `@utils/*` — declared in `tsconfig.json`
only and resolved by tsup/esbuild and tsx. Import them **without file extensions**.

## Persistence (runtime, outside the repo)

- `~/.codeforge/state.json` — progress + notes (`statePath()`); writes are atomic (tmp + rename).
- `~/.codeforge/backups/<timestamp>/state.json` — written before `resetExercise` / `resetAll`.
- `~/.codeforge/exercises/` — default exercise output dir.
- `<config dir>/codeforge/config.json` — `~/.config` on Linux, `%APPDATA%` on Windows.
- `CODEFORGE_DIR` env var overrides the exercises directory (highest priority).

## Conventions

- **Conventional Commits are mandatory** — pushes to `main` auto-release via semantic-release
  (`.releaserc.json`), which bumps `package.json`, rewrites `CHANGELOG.md`, tags, and *stages* the
  npm package for 2FA approval. Never hand-edit `CHANGELOG.md` or version fields.
- One focused change (or one exercise) per PR. Commit/PR type drives the version bump
  (`fix:`/`refactor:` patch, `feat:` minor, `feat!:`/`BREAKING CHANGE:` major).
- Lint + format is Biome (`biome.json`): 2-space indent, single quotes (double in JSX), semicolons,
  trailing commas, 100-col width. No ESLint/Prettier.
- Apply **KISS, DRY, YAGNI**: prefer the simplest thing that works, avoid duplicating logic, and
  don't build abstractions, options, or dependencies for speculative future needs.
