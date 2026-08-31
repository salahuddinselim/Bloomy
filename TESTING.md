# Testing

100% test coverage is the key to great vibe coding. Tests let you move fast, trust
your instincts, and ship with confidence — without them, vibe coding is just yolo
coding. With tests, it's a superpower.

## Framework

[Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/react)
(`jsdom` environment).

## Running tests

```bash
npm test
```

## Test layers

- **Unit tests** — pure functions in `lib/` (encoding, composition math, utils).
  Colocated as `*.test.ts` next to the source file.
- **Component tests** — React components via Testing Library, when a component has
  meaningful conditional rendering or interaction logic worth locking down.
- **Regression tests** — added by `/qa` when it fixes a bug, named
  `{name}.regression-N.test.ts`, with a comment linking back to the QA report.

This project has no e2e test runner yet (browser QA is instead done live via the
`browse` skill during `/qa` runs).

## Conventions

- File naming: `*.test.ts` / `*.test.tsx`, colocated next to the file under test.
- `describe`/`it` blocks, one `describe` per exported function/component.
- Assert real behavior and output values — never `toBeDefined()`/`toBeTruthy()` as
  the only assertion.
