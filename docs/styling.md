# Styling

The app uses a **neo-brutalist** design. Brutalism on the web borrows its name from the architecture style: it leaves the structure showing instead of polishing it away. In practice that means:

- thick black borders around everything
- hard shadows with no blur, offset down and to the right
- flat, loud colors and no gradients
- square corners
- a heavy display font for the title, monospace for everything else

It's also a good style to learn CSS with. There are no images, icon fonts or UI libraries, so everything you see comes from a few short stylesheets.

## Where styles live

| File                                                                  | Applies to       | Contents                                                       |
| --------------------------------------------------------------------- | ---------------- | -------------------------------------------------------------- |
| [`src/styles.scss`](../src/styles.scss)                               | The whole page   | Design tokens, CSS reset, page background, buttons, focus ring |
| [`app.scss`](../src/app/app.scss)                                     | `App` only       | Page layout, header and title                                  |
| [`todo-input.scss`](../src/app/components/todo-input/todo-input.scss) | `TodoInput` only | The form row and text field                                    |
| [`todos.scss`](../src/app/components/todos/todos.scss)                | `Todos` only     | The list, rows, checkbox, Delete button and empty state        |

Angular scopes component styles to their component (see [view encapsulation](angular-concepts.md#component-styles)), so a rule in `todos.scss` can't affect the form. Global styles reach every component, which is why only app-wide basics go in `styles.scss`.

The files are SCSS, a superset of CSS. The only SCSS feature they use is nesting: `&:hover` inside `button { }` means `button:hover`.

## Design tokens

Every color, font, border and shadow is a CSS custom property (a CSS variable) defined on `:root` in [`styles.scss`](../src/styles.scss). Components read them with `var(--name)` instead of repeating raw values.

| Token             | Value                     | Used for                          |
| ----------------- | ------------------------- | --------------------------------- |
| `--color-ink`     | `#111`                    | Text, borders and shadows         |
| `--color-paper`   | `#fff`                    | List and text field backgrounds   |
| `--color-canvas`  | `#f4efe1`                 | Page background                   |
| `--color-grid`    | `rgb(17 17 17 / 7%)`      | Graph-paper lines                 |
| `--color-primary` | `#ffd60a`                 | Header and Add button             |
| `--color-danger`  | `#ff5c5c`                 | Delete buttons                    |
| `--color-done`    | `#8ee6b0`                 | Completed rows                    |
| `--color-hover`   | `#fff4b8`                 | Hovered rows, focused text field  |
| `--color-focus`   | `#2f54eb`                 | Keyboard focus ring               |
| `--font-display`  | Arial Black and fallbacks | The title                         |
| `--font-mono`     | System monospace fonts    | Everything else                   |
| `--border`        | `3px solid` ink           | Every border                      |
| `--shadow`        | `4px 4px 0` ink           | Controls: buttons, the text field |
| `--shadow-lg`     | `6px 6px 0` ink           | Panels: the header and the list   |

The fonts are ones already installed on most computers, so the app downloads none. To use a web font instead, add its `<link>` from [Google Fonts](https://fonts.google.com) to [`src/index.html`](../src/index.html) and put its name first in `--font-display` or `--font-mono`.

## Techniques

### Hard shadows

A brutalist shadow is a `box-shadow` with zero blur:

```scss
box-shadow: 6px 6px 0 var(--color-ink);
//          x   y   blur
```

### Buttons you can press

The base `button` in `styles.scss` uses its shadow as depth. On hover it moves 2px up and left while the shadow grows by 2px, so it seems to lift off the page while the shadow stays put. On click it moves onto the shadow and the shadow disappears, so it looks pressed flat:

```scss
button {
  box-shadow: var(--shadow); // 4px

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: var(--shadow-lg); // 6px
  }

  &:active {
    transform: translate(4px, 4px);
    box-shadow: none;
  }
}
```

### A custom checkbox

`appearance: none` removes the browser's own checkbox drawing and leaves a plain box you can style with `width`, `height`, `border` and `background`. When the box is `:checked`, its background turns ink-black with a white tick, drawn by a tiny SVG embedded in the CSS. The real `<input type="checkbox">` is still there, so keyboard use, screen readers and the `<label>` click area all keep working.

### The graph-paper background

Two gradients, one horizontal and one vertical, each draw a 1px line at the edge of a 32px tile. The browser repeats the tile across the page:

```scss
background-image:
  linear-gradient(var(--color-grid) 1px, transparent 1px),
  linear-gradient(90deg, var(--color-grid) 1px, transparent 1px);
background-size: 32px 32px;
```

## Accessibility

A loud style still has to work for everyone:

- **Contrast.** All text is near-black on light colors, or yellow on black, and passes the WCAG AA contrast ratio of 4.5:1.
- **Focus.** Every control shows a blue outline when you reach it with the keyboard (`:focus-visible`), so the whole app works with Tab, Space and Enter.
- **Labels.** The text field has an `aria-label`, each checkbox is labelled by its todo text, and each Delete button is announced as "Delete" plus the todo's text rather than just "Delete".
- **Motion.** Button and row transitions turn off when the operating system's "reduce motion" setting is on.

## Make it yours

Tokens make restyling quick. Try these in order with the dev server running:

1. Set `--color-primary` to `#ff90e8` (pink) or `#7df9ff` (cyan).
2. Set `--border` to `5px solid var(--color-ink)` for an even heavier look.
3. Set `--shadow-lg` to `10px 10px 0 var(--color-ink)`.
4. Tilt the header: add `transform: rotate(-1deg);` to `.header` in [`app.scss`](../src/app/app.scss).

If you change the text or class names in a template, run `npm test` afterwards: the tests find elements by class names like `.todo` and `.delete`.
