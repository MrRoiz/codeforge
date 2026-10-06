---
name: add-exercise
description: Add a new coding exercise to the codeforge TUI and prove the tests are strong before committing. Use this whenever the user wants to add, create, contribute, scaffold, or register an exercise or problem for codeforge (e.g. "add a two-sum exercise", "add a new leetcode-style problem", "contribute a sliding-window question"), or asks to check, strengthen, or validate an exercise's generated tests. Covers choosing a non-duplicate problem, the Exercise schema, barrel registration, tricky edge-case tests, and running a reference solution plus deliberately-wrong solutions through the real generator and test runner.
---

# Add a codeforge exercise

Adding an exercise is not "write one file" — the tests are the *only* contract, so a weak
test set silently marks wrong solutions as solved. The job is: define the exercise, register
it, then **prove** its test suite accepts correct solutions and rejects plausible wrong ones.

Repo facts you need (from `AGENTS.md`; read it for the full map):

- One file per exercise in `src/exercises/<kebab-id>.ts`, registered in `src/exercises/index.ts`.
- `pnpm test` is node's built-in runner for the tool's own unit tests — it does **not** run an
  exercise's suite. Exercise suites are run programmatically by `src/utils/runTests.ts`, which spawns
  `node --test` (with the `testReporter` support module).
- The TUI exits when stdin isn't a TTY, so never try to validate by running `pnpm dev`.

## Workflow

1. **Pick the problem.** Search `src/exercises/index.ts` first and reject anything already there.
   Prefer transferable patterns (arrays, two pointers, intervals, graphs, DP, design) with a real
   interview pedigree. Watch the difficulty mix (hard exercises are underrepresented) and reuse an
   existing `type` category string when one fits.
2. **Write `src/exercises/<kebab-id>.ts`** exporting a single `Exercise` (schema below).
3. **Register it in `src/exercises/index.ts` in all three places**: a named `export`, a named
   `import`, and an entry in the `exercises` array under the right difficulty. Missing any one
   breaks the build or hides the exercise.
4. **Validate it** (next section) — this is the part people skip.
5. **Run `pnpm lint`, `pnpm typecheck`, `pnpm test`.** CI is lint → typecheck → test, and the
   pre-commit hook runs lint + test, so fix these before claiming done.
6. **Report** what you added: the file, the barrel diff, the validation results (reference passed,
   every mutant caught), and the three green commands.

## The Exercise schema

See `src/exercises/types.ts` for the source of truth. Read a few existing files first — `two-sum.ts`
for the simple case, `move-zeroes.ts` for in-place, `lru-cache.ts` for a class.

- `id`: kebab-case, matches the filename.
- `createdAt`: today's date as `YYYY-MM-DD`.
- `difficulty`: `'easy' | 'medium' | 'hard'`.
- `functionSignature`: must include `export` and be a function declaration. The generator parses the
  name with `/function\s+(\w+)/` and the generated test does `import { name } from './exercise.ts'`.
  If the signature doesn't match, generation throws "Bad function signature".
- `stub`: for classes/interfaces/tree/list problems (LRU Cache, MinStack, Binary Tree nodes), provide
  the full file body here instead of a one-line signature, and supply the tests via `fileBody` too —
  a class can only be exercised through a sequence of calls, not a single spread of arguments.
- `description`: plain prose; backticks are fine. It's written into a `/* ... */` header, so avoid
  `*/` inside it.
- `examples`: `{ input, output, explanation? }`; the generator labels and indents them for you.
- `constraints`: an array of strings, shown verbatim.
- `hints`: ordered from brute force toward the intended optimal approach.

### Tests

```ts
tests: {
  cases: [{ input: [arg1, arg2], expected: ..., sorted?: boolean }],
  mutatesInput?: boolean,        // solution mutates args[0] in place (may return void)
  mutatesInputPrefix?: boolean,  // ...and returns a length; compare args[0].slice(0, result)
  fileBody?: string,             // full test file, replaces generated tests
}
```

`input` is spread into the function: `{ input: [[2, 7], 9] }` calls `fn([2, 7], 9)`. The generated
test deep-normalizes `-0` to `0`, so you don't need to defend against negative zero.

Choose the comparison mode deliberately:

- Default: exact deep equality. Use it only when there is **exactly one** valid answer.
- `sorted: true`: order-insensitive comparison. Sorts an array of primitives, or an array of arrays
  **by JSON while keeping inner order** — so it's right for `[0,1]`-style returns and for permutation
  sets, wrong when the inner arrays themselves can be in any order.
- `mutatesInput` / `mutatesInputPrefix`: for in-place problems (`move-zeroes`, `string-compression`).
- `fileBody`: when answers are "any valid X". Write a validator inside the test and assert on it
  (see `dependency-graph-ordering.ts`), or expose a class API (`lru-cache.ts`). A `fileBody` test
  must import `describe`/`it` from `node:test`, `assert` from `node:assert/strict`, and the solution
  from `./exercise.ts` — it runs on Node's built-in runner.

## Validate: reference must pass, wrong solutions must fail

The generator and test runner are exposed through `src/lib.ts`. There is no CLI to run one exercise,
so write a throwaway harness that generates the exercise into a temp dir, drops a candidate solution
in, and runs the real suite. Write the harness **in the OS temp dir** (e.g. `/tmp/check-<id>.ts`) and
run it with `pnpm exec tsx /tmp/check-<id>.ts` **from the repo root** — this both resolves the `@`
aliases and keeps the harness out of `biome check .`, which scans the whole repo (a root-level or
`scripts/` harness will fail lint unless formatted).

```ts
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { getExerciseById } from '@exercises';
import { ensureGenerated, exerciseDir } from '@utils/generate';
import { runTests } from '@utils/runTests';

async function trial(exercise: NonNullable<ReturnType<typeof getExerciseById>>, source: string) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'codeforge-check-'));
  const { exerciseFile } = await ensureGenerated(exercise, root); // writes stub + generated test
  await fs.writeFile(exerciseFile, source); // replace the stub with the candidate
  const result = await runTests(exerciseDir(exercise.id, root));
  await fs.rm(root, { recursive: true, force: true });
  return result;
}
// main: trial(exercise, reference) must have passed === true && numTotal > 0,
// then trial(exercise, eachMutant) must have passed === false.
```

The candidate solution must export the exact symbol the test imports (`exercise.ts`). Because
generation writes to a temp dir, this never touches the user's real exercises or `~/.codeforge`
state.

Harness gotchas that cost time on every run:

- `runTests(rootDir)` wants the **per-exercise** directory (the `dir` returned by `ensureGenerated`),
  not the temp parent. Passing the parent makes the runner find no `exercise.test.ts` and returns
  `0/0` with `rawError: "The test runner exited without producing results."`.
- Success is `result.passed === true && result.numTotal > 0`. A run that executes zero cases is a
  harness bug, not a passing suite.
- Candidates run through Node's native TypeScript type stripping, so they must be **erasable** — no
  `enum`, `namespace`, or constructor parameter properties (`constructor(private x)`). A candidate
  using those fails to load and shows up as a `rawError`, not a test failure.
- Run the harness from the repo root so the `@` aliases resolve. (No `--tsconfig` is needed; the
  spawned `node --test` child does not read `TSX_TSCONFIG_PATH`.)
- The untouched stub should **fail** the suite (it throws `Not implemented`). Run the suite against
  the generated stub once; if it passes, the tests aren't actually exercising the implementation.

**Step 1 — reference solution passes.** Write your best correct solution and confirm every generated
case is green. If the reference fails, the *exercise* is wrong (ambiguous case, wrong `expected`,
bad signature), not the solution.

**Step 2 — mutants are caught.** For each plausible bug, write a deliberately-wrong variant and
confirm the suite fails. A mutant that passes means your tests are too weak: add a case that
distinguishes it, then rerun. Target the specific traps of the pattern, e.g.:

- Off-by-one / empty and single-element inputs.
- Duplicates, negatives, and zero (the classic "works on the happy path only" bugs).
- `k` greater than length, or `k = 0` (rotate/modulo problems).
- Window/interval boundaries and touching endpoints.
- Multi-digit counts (compression hits 10+).
- For "any valid answer": a result that is the right *set* but an invalid *order/structure*.

**Step 3 — don't overfit.** A correct alternative approach (e.g. a brute force or a different valid
ordering) must still pass. If your mutants are caught only because a test assumes one specific
correct implementation, loosen it with `sorted`/`fileBody` rather than adding more brittle cases.
And keep the contract unambiguous: if two reasonable solutions would disagree, fix the statement or
switch to a validator.

## Tricky test-case playbook

Add cases that would trip a half-correct solution, not just more happy paths. Good sources:

| Pattern | Cases worth adding |
| --- | --- |
| Arrays / hashing | negatives, zeros, duplicates, all-equal, single element, a match that excludes the first element |
| Two pointers / in-place | already-correct input, all-same, length 1, trailing leftovers |
| Sliding window | repeats, window at both ends, single char, all-unique |
| Intervals | touching endpoints, nested, unsorted, single, duplicates |
| DP / recursion | smallest bases (0, 1), unreachable state, a case that needs both branches |
| Trees / graphs | empty/null, single node, disconnected, cycle, deep chain |
| Design / class | capacity 1, update-existing, eviction order, missing key, op sequences, interleaved writes where a later value must not leak backwards |

A test case should be *justified*: it should encode a bug someone might actually write. Prefer 6–12
sharp cases over 20 near-duplicates — but if a constraint in your own `constraints` array is
untested, add a case for it (and never test outside those constraints).

## Definition of done

- `src/exercises/<id>.ts` exists, exports one `Exercise`, all fields present and consistent.
- Registered in `exercises/index.ts` in all three places; the export name matches.
- Reference solution passes all generated cases.
- At least a few mutants representing real bugs each fail a case; none slips through.
- An alternative correct implementation passes (no overfitting).
- `pnpm lint`, `pnpm typecheck`, `pnpm test` are green.
- One exercise per change; do not edit `CHANGELOG.md`, the version, or `exercise.test.ts` (it's
  regenerated). Use a Conventional Commit, e.g. `feat(exercises): add <name>`.
