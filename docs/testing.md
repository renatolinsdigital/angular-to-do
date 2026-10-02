# Testing

Every component has a test file next to it: `todos.ts` is tested by `todos.spec.ts`. The tests click buttons, type into fields and check what's on screen, just as you would by hand, but all of them finish in about a second.

## Running the tests

```bash
npm test                                    # watch mode: re-runs when you save
npx ng test --watch=false                   # run once and exit, e.g. in CI
npx ng test --include app/components/todos  # only the tests in one folder
npx ng test --filter "delete"               # only tests whose name matches
```

`--include` paths are relative to `src/`.

## The tools

- [Vitest](https://vitest.dev) runs the tests and provides `describe`, `it`, `beforeEach` and `expect`. They're globals, so spec files don't import them.
- Angular's **TestBed** (from `@angular/core/testing`) creates components the same way the real app does, with templates compiled and bindings live.
- [jsdom](https://github.com/jsdom/jsdom) simulates a browser DOM inside Node.js, so no real browser opens.

The Angular CLI ties them together through its unit test builder (`@angular/build:unit-test` in `angular.json`). Spec files compile with `tsconfig.spec.json`.

## Anatomy of a test

Here is part of [`todos.spec.ts`](../src/app/components/todos/todos.spec.ts), with comments added:

```ts
// describe groups related tests under one name.
describe('Todos', () => {
  // A handle on the rendered component, and its DOM element.
  let fixture: ComponentFixture<Todos>;
  let element: HTMLElement;

  const todos: Todo[] = [
    { id: 3, content: 'Open', isCompleted: false },
    { id: 7, content: 'Done', isCompleted: true },
  ];

  // Runs before every test, so each test starts with a fresh component.
  beforeEach(async () => {
    fixture = TestBed.createComponent(Todos);
    // Does what [todos]="..." does in a parent's template.
    fixture.componentRef.setInput('todos', todos);
    element = fixture.nativeElement;
    // Waits until Angular has rendered.
    await fixture.whenStable();
  });

  it('emits the todo id on toggle and on delete', () => {
    // Arrange: record everything the outputs emit
    const toggled: number[] = [];
    const removed: number[] = [];
    fixture.componentInstance.toggleComplete.subscribe((id) => toggled.push(id));
    fixture.componentInstance.remove.subscribe((id) => removed.push(id));

    // Act: click like a user would
    const second = element.querySelectorAll('.todo')[1];
    second.querySelector<HTMLInputElement>('.toggle')!.click();
    second.querySelector<HTMLButtonElement>('.delete')!.click();

    // Assert: check the outcome
    expect(toggled).toEqual([7]);
    expect(removed).toEqual([7]);
  });
});
```

Most tests follow these three steps, often called **arrange, act, assert**: set the component up, do something to it, check the result.

## Patterns you'll reuse

| To...                         | Write                                                                   |
| ----------------------------- | ----------------------------------------------------------------------- |
| Render a component            | `TestBed.createComponent(MyComponent)`                                  |
| Set an input                  | `fixture.componentRef.setInput('name', value)`                          |
| Listen to an output           | `fixture.componentInstance.name.subscribe((value) => ...)`              |
| Find elements                 | `element.querySelector('.class')`, `element.querySelectorAll('.class')` |
| Click something               | `button.click()`                                                        |
| Type into a field             | Set `input.value`, then `input.dispatchEvent(new Event('input'))`       |
| Submit a form                 | `form.dispatchEvent(new Event('submit', { cancelable: true }))`         |
| Wait for the screen to update | `await fixture.whenStable()`                                            |

**Always `await fixture.whenStable()` after changing something.** Angular updates the DOM shortly after a signal changes, not instantly, so checking the DOM straight after a click would see the old screen.

Older tutorials use `fakeAsync`, `tick` and `fixture.detectChanges()`. `fakeAsync` and `tick` depend on zone.js, which this app doesn't load. `await fixture.whenStable()` is all you need.

## Two levels of tests

- [`todo-input.spec.ts`](../src/app/components/todo-input/todo-input.spec.ts) and [`todos.spec.ts`](../src/app/components/todos/todos.spec.ts) test one component on its own: give it inputs, interact with it, check its outputs. They don't need `App`.
- [`app.spec.ts`](../src/app/app.spec.ts) renders `App` with its real child components and tests whole features: type a todo, submit it and check that it appears in the list.

You want both. Isolated tests point straight at the component that broke; the `App` tests prove the pieces work together.

## What is covered

- `app.spec.ts`: renders the title and initial todos, and adds, toggles (with the checkbox and by clicking the text) and removes todos through the real child components
- `todo-input.spec.ts`: emits trimmed text, clears the field and ignores blank input
- `todos.spec.ts`: renders the completed state, emits the right id on toggle and delete, names each Delete button after its todo and shows a message when the list is empty

## Writing your own

1. Pick the smallest component that owns the behavior.
2. Describe the behavior in the test name, like `it('ignores blank submissions', ...)`.
3. Arrange, act, `await fixture.whenStable()`, assert.
4. Make the test fail once on purpose, for example by changing an expected value, to prove it can catch a bug.

The tests find elements by CSS class (`.todo`, `.toggle`, `.delete`). If you rename a class in a template, update the tests too.
