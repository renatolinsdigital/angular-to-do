# Getting started

## Requirements

- Node.js `^22.22.3`, `^24.15.0` or `>=26.0.0` (the versions supported by Angular 22)
- npm (bundled with Node.js)

The Angular CLI is installed as a dev dependency, so a global install is not required. Use `npx ng <command>` or the npm scripts below.

## Setup

```bash
npm install
npm start
```

The dev server runs at http://localhost:4200 and reloads on file changes.

## Scripts

| Command          | What it does                                                |
| ---------------- | ----------------------------------------------------------- |
| `npm start`      | Starts the dev server (`ng serve`)                          |
| `npm run build`  | Creates a production build in `dist/to-do`                  |
| `npm run watch`  | Rebuilds in development mode on every change                |
| `npm test`       | Runs the unit tests with Vitest (see [Testing](testing.md)) |
| `npm run format` | Formats the codebase with Prettier                          |
