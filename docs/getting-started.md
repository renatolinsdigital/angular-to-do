# Getting started

This page gets the app running on your machine, shows you around the files and walks you through your first change.

## What you need

- **Node.js** 22 (22.22.3 or later), 24 (24.15.0 or later) or 26+. These are the versions Angular 22 supports. Check yours with `node -v`. If it's too old, install the current LTS from [nodejs.org](https://nodejs.org), or use a version manager such as [nvm](https://github.com/nvm-sh/nvm), [nvm-windows](https://github.com/coreybutler/nvm-windows) or [fnm](https://github.com/Schniz/fnm).
- **npm**, which comes with Node.js.
- **An editor.** [VS Code](https://code.visualstudio.com) works well. When you open this folder it suggests the Angular Language Service extension, which adds autocomplete and error checking inside templates.

You don't need to install the Angular CLI globally. It's a dev dependency of this project, so the npm scripts and `npx ng <command>` use the local copy.

## Run the app

```bash
npm install   # download dependencies into node_modules (once, and after package.json changes)
npm run dev   # start the dev server
```

Open http://localhost:4200. The dev server watches `src/`: save a file and the page reloads with your change. Stop the server with `Ctrl+C`.

## Scripts

| Command          | What it does                                                   |
| ---------------- | -------------------------------------------------------------- |
| `npm run dev`    | Starts the dev server (`ng serve`) at http://localhost:4200    |
| `npm run build`  | Creates an optimized production build in `dist/to-do`          |
| `npm run watch`  | Rebuilds in development mode on every change, without a server |
| `npm test`       | Runs the unit tests with Vitest (see [Testing](testing.md))    |
| `npm run format` | Formats every file with Prettier                               |

## A tour of the files

When the browser opens the app, these files run in this order:

1. [`src/index.html`](../src/index.html) is the only HTML page. Its body holds a single tag, `<app-root>`, which stays empty until Angular fills it.
2. [`src/main.ts`](../src/main.ts) is the entry point. `bootstrapApplication(App, appConfig)` starts Angular and renders the `App` component into `<app-root>`.
3. [`src/app/app.ts`](../src/app/app.ts) is the root component. It holds the list of todos, and its template, [`app.html`](../src/app/app.html), places the two child components on the page.
4. The child components in [`src/app/components/`](../src/app/components/) draw the form and the list.

Each component is a folder of files that share a name:

```
todos/
├── todos.ts       # the class: data and behavior
├── todos.html     # the template: what it renders
├── todos.scss     # the styles: only apply to this component
└── todos.spec.ts  # the tests
```

The rest is configuration you'll rarely touch:

| File                           | Purpose                                                              |
| ------------------------------ | -------------------------------------------------------------------- |
| `angular.json`                 | Tells the Angular CLI how to build, serve and test the app           |
| `tsconfig*.json`               | TypeScript settings. Strict mode and strict template checking are on |
| `package.json`                 | Dependencies and npm scripts                                         |
| `.prettierrc`, `.editorconfig` | Formatting rules                                                     |
| `public/`                      | Files copied into the build as-is, like the favicon                  |

## Your first change

Keep the dev server running, make these three edits, and watch the browser after each save.

1. **Change the title.** In [`src/app/app.html`](../src/app/app.html), replace `To do List` inside the `<h1>` with a title of your own.
2. **Add a starting todo.** In [`src/app/app.ts`](../src/app/app.ts), add a third entry to `INITIAL_TODOS`:
   ```ts
   { id: 2, content: 'Learn Angular', isCompleted: false },
   ```
3. **Change the main color.** In [`src/styles.scss`](../src/styles.scss), set `--color-primary` to `#ff90e8`. The header and the Add button both turn pink, because they read their color from that one variable.

Now run `npm test`. One test fails: `App > renders the title and the initial todos` still expects the old title and two todos. That's the tests doing their job: the app no longer behaves the way they describe. Update the expectations in [`app.spec.ts`](../src/app/app.spec.ts) to match, or undo your edits.

## Generating new files

The Angular CLI can create a component with all four files for you:

```bash
npx ng generate component components/todo-filter
```

This creates `src/app/components/todo-filter/` with a `.ts`, `.html`, `.scss` and `.spec.ts` file. Add `--dry-run` to see what it would create without writing anything.

## Troubleshooting

**npm or `ng` complains about the Node.js version.** Install one of the supported versions listed above, then run `npm install` again.

**Port 4200 is already in use.** Another dev server is probably still running. Stop it, or pick another port: `npm run dev -- --port 4300`.

**The page is blank.** Check the terminal running the dev server and the browser's developer console (F12). Template and TypeScript errors show up there with a file name and line number.

**Changes don't show up.** Make sure the file is saved and the dev server is still running. A hard refresh (`Ctrl+Shift+R`, or `Cmd+Shift+R` on macOS) bypasses the browser cache.
