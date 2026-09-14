# ⚒ codeforge

> A terminal forge for live-coding interview practice.

In an era where more and more code is written by prompting, a quiet gap is
growing: the ability to sit in front of a blank function, under a timer, and
reason your way to a working solution — out loud, from scratch. AI coding
is great at shipping features. It does not train the muscles an interview
actually measures: problem decomposition, data-structure fluency, edge-case
instinct, and the confidence to write code while someone watches.

**codeforge** exists to close that gap. It drops a real interview-style exercise
into your working directory — problem statement, examples, constraints, hints,
and a hidden test suite — then gets out of your way. You solve it in your own
editor, your own way. When you're ready, codeforge runs the tests and tells you
the truth: pass or fail, with the exact cases that broke.

The gap it closes and the value it brings
are real. The exercises are curated from real interview reports, the tests are
unforgiving, and the only thing that counts is the output.

## Why a TUI

The terminal is where developers already live, and this is a *selector*, not an
IDE. codeforge never tries to be your editor, format your code, or manage your
solution. You decide your editor, your plugins, your keybindings, your
workflow — run it in `vim`, `neovim`, `VS Code`, `Cursor`, `Zed`, `Helix`,
whatever you love. **codeforge only checks the output.** That is the whole
contract.

## What you get

- **A growing library of curated algorithmic exercises** across Easy, Medium,
  and Hard, chosen for relevance to senior backend interviews — the kind GoDaddy
  and similar companies run in HackerRank / live sessions. Highlights: Two Sum,
  Valid Parentheses, Two Pointers & Sliding Window (Longest Substring, Minimum
  Window Substring), Prefix/Suffix & Intervals (Product Except Self, Merge
  Intervals, Meeting Rooms II), Graph/Grid (Number of Islands, Dependency Graph
  Ordering), DP (Word Break, Unique Paths II, Perfect Squares, Longest
  Palindromic Substring), design (LRU Cache), plus practical-logic tasks
  (Weighted Voting, Top-N Frequent IPs, Ticket Itinerary, Most-Used Route Per
  Courier).
- **TypeScript-first** exercise templates and **Jest** test suites.
- **Keyboard-driven TUI** with a game-flavored feel: browse by difficulty, get a
  random challenge, read the statement, reveal hints, and forge your solution.
- **Honest testing** — the test file is regenerated every run, so you cannot
  "fix" the tests to make yourself pass.

## Install & run

```bash
pnpm install
pnpm dev            # local dev — runs from source, no build step
```

To build and run the distributable CLI:

```bash
pnpm build
node dist/index.js
# or link it globally:
pnpm link --global
codeforge
```

> Interactive TUI — run it directly in a terminal (not piped).

## How to practice

1. Launch `codeforge`.
2. (Optional) Open **Settings** to choose where exercises are created. Defaults
   to `~/codeforge`.
3. **Train** to browse by difficulty, or **Random Challenge** for a surprise.
4. Open an exercise to **read it** — nothing is written yet. You can browse the
   statement, examples, constraints, hints (`h`), and the full graded test cases
   (`c`) to decide whether to attempt it.
5. Press **`s`** to start it (or **`t`** to start and run immediately). codeforge
   then creates the files under `<settings-dir>/<exercise-id>/`:

   ```
   ~/codeforge/two-sum/
     exercise.ts        ← your solution (yours to edit)
     exercise.test.ts   ← the test suite (auto-generated, don't touch)
   ```

6. Open `exercise.ts` in **your** editor and implement the function. The problem
   statement, examples, constraints, and hints are all in the file header.
7. Back in the TUI, press **`t`** to run the tests. Press **`r`** on the results
   screen to run them again after another edit.
8. Green bar = you're done. Red bar = read the failing cases and go again.

## Settings

**⚙ Settings** lets you set the directory where exercises are created. The path
is validated and created (`mkdir -p`), then saved to a config file so it
persists across runs:

| Platform      | Config file                              |
| ------------- | ---------------------------------------- |
| Linux / macOS | `$XDG_CONFIG_HOME/codeforge/config.json` (defaults to `~/.config/…`) |
| Windows       | `%APPDATA%\codeforge\config.json`         |

Resolution order (highest first):

1. `CODEFORGE_DIR` environment variable — handy for scripting/CI
2. the directory saved in Settings
3. the default, `~/codeforge`

`~` is expanded, and relative paths are resolved against the current directory.

## Keys

| Key        | Action                          |
| ---------- | ------------------------------- |
| `↑` / `↓`  | Navigate                        |
| `↵`        | Select / open                   |
| `s`        | Start exercise (create files)   |
| `t`        | Run tests (starts it if needed) |
| `c`        | Show/hide the graded test cases |
| `h`        | Toggle hints                    |
| `r`        | Re-run tests (on results)       |
| `esc`      | Back                            |
| `q`        | Quit                            |

## Exercise folder layout

```
src/
  exercises/         one file per exercise + a barrel (index.ts)
    types.ts         the Exercise interface
    two-sum.ts
    number-of-islands.ts
    ...
  utils/
    generate.ts      renders exercise.ts + the Jest test file
    runTests.ts      spawns the isolated Jest runner
    jestRunner.ts    runs Jest in a child process, returns JSON results
  app/               TUI screens (Ink + React)
  components/        logo, selector, shared UI
  lib.ts             programmatic API (packaged as dist/lib.js)
  index.tsx          TUI entry / bin (packaged as dist/index.js)
tsup.config.ts       bundler config (entry points, ESM, Node target)
```

Adding an exercise is one file plus one line in the barrel.

## Path aliases

Imports use `@` aliases with **no file extensions** — no more `../../` chains:

| Alias          | Points to           |
| -------------- | ------------------- |
| `@app/*`       | `src/app/*`         |
| `@components/*`| `src/components/*`  |
| `@exercises`   | the exercise barrel |
| `@exercises/*` | `src/exercises/*`   |
| `@utils/*`     | `src/utils/*`       |

They are declared once in `tsconfig.json` (`paths`) and resolved natively by the
**tsup**/esbuild build (`tsup.config.ts`), which bundles the source into
`dist/index.js`, `dist/lib.js`, and `dist/jestRunner.js`. `tsx` resolves the same
aliases in dev. No extension-rewriting step, no runtime loader. (Node's native
subpath imports only accept `#`, and `tsc` never rewrites `paths`, so a bundler
is the clean way to keep `@` aliases extensionless.)

## Notes

- Tests run through Jest in an isolated child process, so the TUI never gets
  clobbered by test output.
- Existing solutions are **never overwritten** — codeforge only creates
  `exercise.ts` if it is missing. Your work is safe.
- The test suite is always refreshed, so it stays in sync with the exercise
  definition.
- Generated tests normalize `-0` to `0`, so implementations that produce
  negative zero (e.g. Product of Array Except Self) aren't failed unfairly.

## Contributing

Contributions are very welcome — the best part of this project is the exercise
library, and it gets better with every real interview problem people add.

### Add an exercise

1. Create `src/exercises/<kebab-case-id>.ts` using the shared interface:

   ```ts
   import type { Exercise } from '@exercises/types';

   export const myExercise: Exercise = {
     id: 'my-exercise',
     name: 'My Exercise',
     difficulty: 'medium', // 'easy' | 'medium' | 'hard'
     type: 'Arrays + Hashing',
     time: '20-30 min',
     description: '...', // plain text; the generator writes it into the file header
     examples: [{ input: '...', output: '...', explanation: '...' }],
     constraints: ['...'],
     // NOTE: include `export` — the generated tests import this function
     functionSignature: 'export function myFn(nums: number[]): number',
     hints: ['...'],
     // optional: set to true if the solution mutates its input instead of returning (e.g. reverse-string)
     mutatesInput: false,
     tests: [
       { input: [[1, 2, 3]], expected: 6 },
       // optional: set `sorted: true` when the answer is an array in any order
       { input: [[3, 1, 2]], expected: [1, 2, 3], sorted: true },
     ],
   };
   ```

2. Register it in the barrel `src/exercises/index.ts` (export it and add it to
   the `exercises` array).

That's it — the TUI, the generator, and the Jest suite all pick it up
automatically.

### Guidelines

- **Real interview relevance over novelty.** Prefer problems actually seen in
  live coding rounds (HackerRank, live sessions) — especially senior backend
  flavors. This is a forge for interviews, not a puzzle dump.
- **Correct, unambiguous tests.** Every case must have exactly one valid
  answer (or mark `sorted: true` when order doesn't matter). Add edge cases:
  empty input, duplicates, negatives, boundaries.
- **Respect the stated constraints.** Don't add tests that violate your own
  `constraints` (e.g. testing `n = 0` when the constraint says `1 <= n`).
- **Keep dependencies minimal.** The runtime is `ink` + `react`; testing is
  `jest` + `ts-jest`. Please don't add libraries for things the standard
  library already does.
- **No solution in the TUI.** codeforge generates the problem and checks the
  output — solving happens in the user's own editor. Keep it that way.
- **TypeScript-first**, formatted with the project's existing style.

### Provenance labels

Every exercise shows where it came from, declared **inline on the exercise
object**. Omit it and the label defaults to **`AI checked`** (tests reviewed by
AI only). Levels:

| Level        | Meaning                                                   |
| ------------ | --------------------------------------------------------- |
| `ai-checked` | default — tests reviewed by AI, no human confirmation      |
| `reported`   | seen in public candidate reports / aggregators             |
| `verified`   | a human confirmed it was used in a real interview          |

`validation` is a **list**, so an exercise can accumulate provenance over time:

```ts
// src/exercises/two-sum.ts
export const twoSum: Exercise = {
  id: 'two-sum',
  validation: [
    { level: 'reported', source: 'GoDaddy' },
    // a human later confirmed it was asked at EPAM:
    // { level: 'verified', source: 'EPAM' },
  ],
  ...
};
```

That renders as `GoDaddy (reported) · AI checked`. Add a `verified` entry and it
becomes `GoDaddy (reported) · EPAM (human-verified) · AI checked`. Please don't
claim `verified` without first-hand knowledge.

### Development

For local development no build is needed — run straight from source:

```bash
pnpm install
pnpm dev            # tsx, runs the TUI from src (resolves @ aliases directly)
pnpm typecheck      # tsc --noEmit
```

`pnpm dev` also spawns the TypeScript test runner via tsx, so exercising
solutions works without building.

To produce the distributable CLI:

```bash
pnpm build          # tsup → dist/index.js, dist/lib.js, dist/jestRunner.js
node dist/index.js  # run the TUI from the build
```

`src/lib.ts` is a programmatic API (`exercises`, `ensureGenerated`, `runJest`,
…) and is what the verification harness drives.

There is no separate test suite for the tool itself yet — the fastest
verification is to add an exercise, generate it, implement the reference
solution, and confirm the suite goes green (and red when you break it).

### Pull requests

- One exercise or one focused change per PR, please.
- In the PR description, note the source/context for any exercise you add
  (e.g. "seen in a senior backend live session") and confirm you verified both
  a passing and a failing run.

---

Built because shipping features and passing interviews are different skills.
Practice the one you're about to be measured on.
