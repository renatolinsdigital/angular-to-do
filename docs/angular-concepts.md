# Angular concepts

This page walks through every Angular feature the app uses, roughly in the order you meet them when reading the code. Each section shows the real code, explains what it does and links to the official guide on [angular.dev](https://angular.dev).

- [Bootstrapping](#bootstrapping)
- [Components](#components)
- [Templates and bindings](#templates-and-bindings)
- [Control flow: `@for` and `@empty`](#control-flow-for-and-empty)
- [Signals](#signals)
- [Inputs and outputs](#inputs-and-outputs)
- [Change detection](#change-detection)
- [Component styles](#component-styles)

## Bootstrapping

[`src/main.ts`](../src/main.ts) starts the app:

```ts
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
```

`App` is the root component. Angular finds the element that matches its selector, `<app-root>` in [`index.html`](../src/index.html), and renders `App` inside it.

`appConfig`, from [`app.config.ts`](../src/app/app.config.ts), lists the app's **providers**: app-wide services and settings. This app only registers `provideBrowserGlobalErrorListeners()`, which sends uncaught browser errors to Angular's error handler. When you add routing or HTTP calls later, their providers (`provideRouter(...)`, `provideHttpClient()`) go in the same list.

## Components

A component is a TypeScript class with a `@Component` decorator that tells Angular how to render it. Here is [`todos.ts`](../src/app/components/todos/todos.ts):

```ts
@Component({
  selector: 'app-todos',
  templateUrl: './todos.html',
  styleUrl: './todos.scss',
})
export class Todos {
  readonly todos = input.required<Todo[]>();
  readonly toggleComplete = output<number>();
  readonly remove = output<number>();
}
```

- `selector` is the HTML tag that puts this component on a page: `<app-todos />`. The `app-` prefix (set in `angular.json`) avoids clashes with real HTML elements.
- `templateUrl` points to the HTML the component renders.
- `styleUrl` points to its styles.

Components are **standalone**: there are no NgModules. To use a component inside another one, add it to the parent's `imports` and use its tag in the parent's template. That's what [`app.ts`](../src/app/app.ts) does:

```ts
@Component({
  selector: 'app-root',
  imports: [TodoInput, Todos],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
```

If you forget the `imports` entry, the build fails with error `NG8001: 'app-todos' is not a known element`.

**`protected` and `readonly`.** In `App`, the members only the template uses (`todos`, `add`, `toggleComplete`, `remove`) are `protected`: the template can reach them, other classes can't. A component's public API, like the inputs and outputs of `Todos`, stays public. `readonly` stops a signal or output from being replaced by accident; the signal's value can still change through `set` and `update`.

Guide: [Components](https://angular.dev/guide/components)

## Templates and bindings

A template is HTML plus a few kinds of **binding** that connect it to the class. [`todos.html`](../src/app/components/todos/todos.html) uses all of them:

| Syntax                | Name              | Example from the app                           | What it does                           |
| --------------------- | ----------------- | ---------------------------------------------- | -------------------------------------- |
| `{{ expr }}`          | Interpolation     | `{{ todo.content }}`                           | Writes the value as text               |
| `[prop]="expr"`       | Property binding  | `[checked]="todo.isCompleted"`                 | Sets a DOM property                    |
| `[class.name]="expr"` | Class binding     | `[class.done]="todo.isCompleted"`              | Adds the class while the value is true |
| `[attr.name]="expr"`  | Attribute binding | `[attr.aria-label]="'Delete ' + todo.content"` | Sets an HTML attribute                 |
| `(event)="statement"` | Event binding     | `(click)="remove.emit(todo.id)"`               | Runs code when the event fires         |

Bindings keep themselves up to date: when `todo.isCompleted` changes, Angular updates the checkbox and the `done` class for you. You never touch the DOM by hand.

**`$event`.** Inside an event binding, `$event` holds the event. For a component's output, it's the value the component emitted. In [`app.html`](../src/app/app.html), `(add)="add($event)"` passes the text that `TodoInput` emitted to `App.add`.

**`$any`.** [`todo-input.html`](../src/app/components/todo-input/todo-input.html) reads the text field like this:

```html
(input)="text.set($any($event.target).value)"
```

TypeScript types `$event.target` as `EventTarget | null`, which has no `value` property, so strict template checking rejects `$event.target.value`. `$any(...)` turns off type checking for that one expression. It works, but it's an escape hatch. A fully typed alternative is a **template reference variable**, which gives you the element itself:

```html
<input #field (input)="text.set(field.value)" />
```

Guide: [Templates](https://angular.dev/guide/templates)

## Control flow: `@for` and `@empty`

<!-- prettier-ignore -->
```html
@for (todo of todos(); track todo.id) {
  <li class="todo">...</li>
} @empty {
  <li class="empty">Nothing to do. Add something above.</li>
}
```

`@for` repeats its block once per item. `track todo.id` tells Angular how to recognize the same item from one render to the next, so when one todo changes it updates that `<li>` instead of rebuilding the whole list. Track by something unique that never changes; an id is ideal. `@empty` renders when the list has no items.

Angular has two more blocks you'll want soon: `@if (...) { } @else { }` and `@switch`. The [exercises](exercises.md) use `@if`.

Guide: [Control flow](https://angular.dev/guide/templates/control-flow)

## Signals

A **signal** is a value that tells Angular when it changes. The app's whole state is one signal in [`app.ts`](../src/app/app.ts):

```ts
protected readonly todos = signal<Todo[]>(INITIAL_TODOS);
```

- **Read** a signal by calling it: `this.todos()` in the class, `todos()` in a template.
- **Replace** its value with `set`. `TodoInput` clears its field with `this.text.set('')`.
- **Compute** the next value from the current one with `update`:

```ts
protected remove(id: number): void {
  this.todos.update((todos) => todos.filter((todo) => todo.id !== id));
}
```

**Always return a new array.** A signal only notifies Angular when the new value is a different object from the old one, so changing the array in place goes unnoticed:

```ts
// Wrong: changes the existing array and returns it. Same array, so no notification.
this.todos.update((todos) => {
  todos.push(todo);
  return todos;
});

// Right: returns a new array.
this.todos.update((todos) => [...todos, todo]);
```

The same goes for the objects inside: `toggleComplete` creates a new todo with `{ ...todo, isCompleted: !todo.isCompleted }` rather than flipping the flag on the existing one.

Signals have two companions this app doesn't use yet: `computed()` for values derived from other signals, and `effect()` for side effects such as saving to `localStorage`. Both appear in the [exercises](exercises.md).

Guide: [Signals](https://angular.dev/guide/signals)

## Inputs and outputs

Components talk to each other through **inputs** (data in) and **outputs** (events out). `Todos` declares one input and two outputs:

```ts
readonly todos = input.required<Todo[]>();
readonly toggleComplete = output<number>();
readonly remove = output<number>();
```

`input()` creates a read-only signal that the parent fills in, read like any other signal: `todos()`. `.required` makes it mandatory: using `<app-todos>` without `[todos]` fails the build with `NG8008: Required input 'todos' from component Todos must be specified`.

`output()` creates an event the component fires with `.emit(value)`. `Todos` emits the todo's id: `remove.emit(todo.id)`.

The parent connects both sides in [`app.html`](../src/app/app.html):

<!-- prettier-ignore -->
```html
<app-todos
  [todos]="todos()"
  (toggleComplete)="toggleComplete($event)"
  (remove)="remove($event)"
/>
```

`[todos]="todos()"` passes the current array, not the signal. And `Todos` never changes the list itself: it reports what the user did and lets `App` decide what happens. [Architecture](architecture.md#data-flow) explains why.

Guides: [Inputs](https://angular.dev/guide/components/inputs), [Outputs](https://angular.dev/guide/components/outputs)

## Change detection

Change detection is how Angular keeps the screen in sync with your data. Angular 22 has two defaults that make it predictable:

- **Zoneless.** Older Angular apps loaded a library called zone.js, which patched browser APIs like timers and events to guess when data might have changed. This app doesn't load it. Older tutorials mention "zones" a lot; you can skip those parts.
- **OnPush.** Angular re-renders a component only when it's told something may have changed: a signal its template reads gets a new value, one of its inputs gets a new value, or an event bound in its template fires.

Signals fit this model exactly: change a signal and Angular knows which components to update. It's also another reason for immutable updates. A new array is a new input value for `Todos`; the same array, changed in place, is not.

Guide: [Zoneless](https://angular.dev/guide/zoneless)

## Component styles

A component's `.scss` file only affects that component's template. Angular adds a unique attribute to the component's elements and rewrites its selectors to match, so the `.content` rule in `todos.scss` can't leak into the form. This is called **view encapsulation**.

Two more pieces complete the picture:

- `:host` targets the component's own element, like `<app-todos>`. Custom elements are inline by default, so both child components set `:host { display: block; }`.
- [`src/styles.scss`](../src/styles.scss) holds **global** styles that apply everywhere: the CSS reset, the base `button` and the design tokens (CSS variables) every component reads.

[Styling](styling.md) covers the design itself.

Guide: [Styling components](https://angular.dev/guide/components/styling)
