# Architecture

The app is a small, zoneless Angular 22 application built with standalone components and signals. There are no NgModules, services or routes: all state lives in the root component and flows down through inputs.

## Project structure

```
src/
├── index.html
├── main.ts                     # Bootstraps App with appConfig
├── styles.scss                 # Global styles (reset, typography, buttons)
└── app/
    ├── app.ts / .html / .scss  # Root component, owns the todo list state
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

```ts
interface Todo {
  id: number;
  content: string;
  isCompleted: boolean;
}
```

## Components

### `App` (`app-root`)

Holds the list in a `signal<Todo[]>` and is the only place where it changes. Updates are immutable (`todos.update(...)` always returns a new array with new objects), so child components never mutate shared state.

- `add(content)`: appends a todo with the next available id
- `toggleComplete(id)`: flips `isCompleted` for the matching todo
- `remove(id)`: drops the matching todo

### `TodoInput` (`app-todo-input`)

A form with a text field. On submit (button click or Enter) it trims the text, ignores blank values, emits it through the `add` output and clears the field. It only knows about text, not about ids or the list.

### `Todos` (`app-todos`)

A presentational list. It receives `todos` as a required input and emits the todo id through `toggleComplete` (clicking the text) and `remove` (the Delete button). The todo text is rendered as a button so it can be toggled with the keyboard, with `aria-pressed` reflecting the completed state.

## Data flow

```
              add(content)
TodoInput ───────────────────▶ App ──[todos]──▶ Todos
                               ▲                  │
                               └── toggleComplete(id), remove(id)
```
