# To do list with Angular

A small to do list app built to teach Angular. If this is your first Angular app, start here: the code is short enough to read in one sitting, and the docs explain every Angular feature it uses, with links to the exact files.

It runs on Angular 22 with standalone components and signals, and it has a neo-brutalist look: thick black borders, hard shadows and loud, flat colors.

![The app: a yellow header, a text field with an Add button, and a list of todos with square checkboxes and red Delete buttons](docs/images/screenshot.png)

## Quick start

You need [Node.js](https://nodejs.org) 22 (22.22.3 or later), 24 (24.15.0 or later) or 26+.

```bash
npm install
npm run dev
```

Open http://localhost:4200, then try changing the title in `src/app/app.html`. The page reloads every time you save.

## What you will learn

| Concept                                                                | Where to look                                                              |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Components: a TypeScript class, an HTML template and a stylesheet      | [src/app/components/todos/](src/app/components/todos/)                     |
| Signals to hold and update state                                       | [src/app/app.ts](src/app/app.ts)                                           |
| Inputs and outputs to pass data between components                     | [src/app/components/todos/todos.ts](src/app/components/todos/todos.ts)     |
| Template syntax: `{{ }}`, `[property]`, `(event)`, `@for` and `@empty` | [src/app/components/todos/todos.html](src/app/components/todos/todos.html) |
| Global styles, component styles and CSS variables                      | [src/styles.scss](src/styles.scss)                                         |
| Unit tests with Vitest                                                 | The `*.spec.ts` file next to each component                                |

## Learning path

The docs are meant to be read in this order:

1. [Getting started](docs/getting-started.md): install, run, a tour of the files and your first change
2. [Angular concepts](docs/angular-concepts.md): each Angular feature in this app, explained with its code
3. [Architecture](docs/architecture.md): how the pieces fit together and how data moves between them
4. [Styling](docs/styling.md): the brutalist design and how to make it your own
5. [Testing](docs/testing.md): how the tests work and how to write your own
6. [Exercises](docs/exercises.md): features to build next, from easy to harder
