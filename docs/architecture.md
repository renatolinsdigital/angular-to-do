# Architecture

This page explains how the app fits together: which component does what, where the data lives and what happens when you click something.

## The big picture

The app is a small, zoneless Angular 22 application built with standalone components and signals. It has no NgModules, services or routes.

It follows one rule: **one component owns the data, and the others display it and report what the user did.** `App` owns the list of todos. `TodoInput` and `Todos` never change it. They send events up to `App` and receive the updated list back down. This pattern is often called "lifting state up", and it keeps every change to the list in one place.

## Project structure

```
src/
├── index.html                  # The only HTML page; contains <app-root>
├── main.ts                     # Bootstraps App with appConfig
├── styles.scss                 # Global styles and design tokens
└── app/
    ├── app.ts / .html / .scss  # Root component, owns the todo list
    ├── app.config.ts           # Application-wide providers
    ├── models/
    │   └── todo.model.ts       # Todo interface
    └── components/
        ├── todo-input/         # Form that emits new todo text
        └── todos/              # Renders the list, emits toggle and remove
public/                         # Static files copied as-is (favicon)
docs/                           # Project documentation
```

## Data model

A todo is a plain object, described by an interface in [`todo.model.ts`](../src/app/models/todo.model.ts):

```ts
export interface Todo {
  id: number;
  content: string;
  isCompleted: boolean;
}
```

An interface only exists while TypeScript compiles. It catches mistakes like a misspelled `isComplete`, then disappears from the JavaScript that runs in the browser.

## Components

### `App` (`app-root`)

[`app.ts`](../src/app/app.ts) holds the list in a `signal<Todo[]>` and is the only place it changes. Every update is immutable: `todos.update(...)` always returns a new array, and a changed todo is a new object.

| Method               | What it does                              |
| -------------------- | ----------------------------------------- |
| `add(content)`       | Appends a todo with the next available id |
| `toggleComplete(id)` | Flips `isCompleted` for the matching todo |
| `remove(id)`         | Drops the matching todo                   |

Ids come from `nextId`, a counter that starts one above the highest id in `INITIAL_TODOS`. It's a plain field rather than a signal because nothing on screen shows it.

### `TodoInput` (`app-todo-input`)

[`todo-input.ts`](../src/app/components/todo-input/todo-input.ts) is a form with a text field, and keeps the field's text in its own `text` signal. On submit (the Add button or Enter) it calls `event.preventDefault()` so the browser doesn't reload the page, trims the text, ignores blank values, emits the text through its `add` output and clears the field. It knows nothing about ids or the list.

### `Todos` (`app-todos`)

[`todos.ts`](../src/app/components/todos/todos.ts) is a presentational list. It receives `todos` as a required input and emits a todo's id through `toggleComplete` (the checkbox) and `remove` (the Delete button). Each checkbox sits in a `<label>` with the todo text, so clicking the text toggles it too. When the list is empty, `@empty` shows a message instead.

## Data flow

```
              add(content)
TodoInput ───────────────────▶ App ──[todos]──▶ Todos
                               ▲                  │
                               └── toggleComplete(id), remove(id)
```

Data flows down through inputs. Events flow up through outputs.

### What happens when you tick a checkbox

1. The browser fires a `change` event on the checkbox in [`todos.html`](../src/app/components/todos/todos.html).
2. The event binding `(change)="toggleComplete.emit(todo.id)"` emits the todo's id from `Todos`.
3. In [`app.html`](../src/app/app.html), `(toggleComplete)="toggleComplete($event)"` receives the id and calls `App.toggleComplete(id)`.
4. `toggleComplete` calls `todos.update(...)`, which builds a new array where that todo is replaced by a copy with `isCompleted` flipped.
5. The `todos` signal has a new value, so Angular re-renders `App`, which passes the new array to `Todos` through `[todos]="todos()"`.
6. `Todos` re-renders. Because of `track todo.id`, Angular keeps the existing `<li>` elements and only updates what changed: the ticked row gets the `done` class, a green background and a line through its text.

Adding and removing follow the same path, starting from the form's `add` output or a Delete button's `remove` output.

## Why build it this way

- **One place to look.** Every change to the list happens in `App`, so when something goes wrong there's one file to check.
- **Reusable pieces.** `Todos` works with any list of todos from any parent, because it doesn't know where the data comes from.
- **Easy to test.** You can test `Todos` by giving it an input and checking what it emits, without the rest of the app. See [Testing](testing.md).

As the app grows, for example when a second page needs the same todos, the usual next step is to move the signal and its methods out of `App` into a service, and `inject()` that service wherever it's needed.
