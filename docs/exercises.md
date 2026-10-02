# Exercises

Ready to write some Angular? These exercises add features to the app, from easy to harder. Each one lists what you'll practice, some hints and an idea for a test. There are no full solutions on purpose. The hints point you to the right Angular features, and [Angular concepts](angular-concepts.md) and the linked angular.dev guides fill in the rest.

Before you start:

- Work on a branch so you can always get back to the original: `git switch -c exercises`.
- Keep `npm run dev` and `npm test` running in two terminals while you work.

## 1. Count what's left

**Level:** easy. **Practice:** `computed()`, interpolation.

Show how many todos are still open, like "2 left", in the header.

- In `App`, derive the count from `todos` with `computed`. Angular recalculates it only when `todos` changes:
  ```ts
  protected readonly remaining = computed(
    () => this.todos().filter((todo) => !todo.isCompleted).length,
  );
  ```
  Remember to import `computed` from `@angular/core`.
- Show it in `app.html` with `{{ remaining() }}`, and style it in `app.scss` as a sticker: a border, the paper color and a slight rotation.
- Bonus: write "1 item left" but "2 items left", using `@if`.

**Test idea:** in `app.spec.ts`, tick a checkbox and expect the count to drop by one.

## 2. Clear completed todos

**Level:** easy. **Practice:** updating a signal, event binding, `@if`.

Add a "Clear done" button that removes every completed todo.

- Add a `clearCompleted()` method to `App` that uses `todos.update(...)` with `filter`, just like `remove`.
- Only show the button when there's something to clear: wrap it in `@if (...)`, using a `computed` that counts completed todos.

**Test idea:** click the button and expect only the open todos to remain. The starting list already has one completed todo.

## 3. Filter the list

**Level:** medium. **Practice:** generating a component, inputs and outputs, `computed` with two signals.

Add three buttons, All, Active and Done, that change which todos are shown.

- Generate the component: `npx ng generate component components/todo-filter`.
- Describe the options with a type: `type Filter = 'all' | 'active' | 'done';`.
- `TodoFilter` takes the current filter as an input and emits the new one through an output when a button is clicked. Highlight the current button with `[class.active]`, and tell screen readers with `[attr.aria-pressed]`.
- `App` keeps `filter = signal<Filter>('all')` and a `visibleTodos = computed(...)` that reads both `todos()` and `filter()`. Pass `visibleTodos()` to `<app-todos>`.
- Add `TodoFilter` to the `imports` of `App`.

**Test idea:** in `todo-filter.spec.ts`, click Done and expect the output to emit `'done'`. In `app.spec.ts`, pick Active and expect completed todos to disappear.

## 4. Remember todos after a reload

**Level:** medium. **Practice:** `effect()`, `localStorage`, `JSON.stringify` and `JSON.parse`.

Right now, reloading the page brings back the two starter todos. Save the list in the browser's `localStorage` instead.

- Save on every change with an effect in the constructor of `App`. An effect re-runs whenever a signal it reads changes:
  ```ts
  constructor() {
    effect(() => localStorage.setItem('todos', JSON.stringify(this.todos())));
  }
  ```
- Load on startup: write a `loadTodos()` function that parses `localStorage.getItem('todos')`, or returns `INITIAL_TODOS` when nothing is saved yet. Use it as the signal's initial value.
- `nextId` must start above the highest id in the loaded list, not just in `INITIAL_TODOS`.
- jsdom has a `localStorage` too, and it keeps its contents between tests. Call `localStorage.clear()` in `beforeEach` so tests can't affect each other.

**Test idea:** add a todo, `await fixture.whenStable()`, then create a second `App` with `TestBed.createComponent(App)` and expect the new todo in its list.

## 5. Edit a todo

**Level:** harder. **Practice:** component state, keyboard events, a new output, conditional templates.

Double-click a todo's text to edit it. Enter saves, Escape cancels.

- In `Todos`, remember which todo is being edited: `editingId = signal<number | null>(null)`.
- In the template, `@if (editingId() === todo.id)` shows an `<input>` in place of the text.
- Angular can filter key events for you: `(keydown.enter)="..."` and `(keydown.escape)="..."`.
- Add an `edit` output that emits `{ id, content }`, and an `edit(id, content)` method in `App` that maps over the list like `toggleComplete` does.
- Watch out: clicking the text toggles the checkbox, because both are inside the `<label>`. A double-click toggles it twice. You may want to move the text out of the label and give the checkbox its own `aria-label`.

**Test idea:** dispatch a `dblclick` event on the text, type a new value, dispatch `new KeyboardEvent('keydown', { key: 'Enter' })` and check what the `edit` output emitted.

## Going further

- [Learn Angular](https://angular.dev/tutorials/learn-angular), the official tutorial, runs in the browser and covers routing, forms and dependency injection.
- When you add a second page with the [router](https://angular.dev/guide/routing), move the todos into a service and `inject()` it where it's needed.
