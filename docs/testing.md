# Testing

Unit tests run on [Vitest](https://vitest.dev) through the Angular CLI unit test builder (`@angular/build:unit-test`), using `jsdom` as the DOM environment. No browser is needed.

```bash
npm test                  # watch mode
npx ng test --watch=false # single run, e.g. for CI
```

Spec files sit next to the code they cover (`*.spec.ts`) and are compiled with `tsconfig.spec.json`.

## What is covered

- `app.spec.ts`: renders the initial list, and adds, toggles and removes todos through the real child components
- `todo-input.spec.ts`: emits trimmed text, clears the field and ignores blank input
- `todos.spec.ts`: renders completed state and emits the right id on toggle and remove

## Writing tests

The app is zoneless, so tests do not rely on `fakeAsync` or zone-based change detection. After interacting with the DOM, wait for the view to update with `await fixture.whenStable()`. Inputs on a component under test are set with `fixture.componentRef.setInput(...)`.
