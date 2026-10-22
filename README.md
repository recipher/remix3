# Remix3

A minimal Remix application starter with a home page.

## Starter Shape

- `app/actions/controller.tsx` owns the top-level route actions.
- `app/actions/home-page.tsx` and `app/actions/document.tsx` render the route-owned starter UI.
- `app/actions/public/` contains the browser runtime entry.
- `app/routes.ts` defines the shared route contract used by server and browser modules for type-safe hrefs.
- `app/router.ts` wires routes to handlers and installs the standard Remix component renderer used by actions.
- `app/assets.ts` owns the server-side asset pipeline used by the asset route and render middleware.
- Root `public/` contains static files served unchanged from the app root, including the generated `tailwind.css`.
- `app/ui/` holds shared UI, including the Tailwind layout components and the `CopyButton` browser component.
- `app/actions/signup/`, `app/actions/login/` and `app/actions/account/` implement signup, login, logout and the protected account page.
- `app/db.ts`, `app/data/` and `db/migrations/` hold the SQLite database, table definitions, and SQL migrations.
- `app/session.ts` configures the session cookie.

## Localization

The app ships with English (`en`) and Spanish (`es`). The locale is chosen per request from, in order: the `locale` cookie (set by the language switcher), the `Accept-Language` header, then `en`.

- `app/i18n/messages/en.ts` is the source of truth for message keys. Other locales (for example `es.ts`) are typed against it, so a missing key is a type error.
- Use `context.i18n.t('key', { param })` in actions and pass `i18n` to pages. `{param}` placeholders are interpolated.
- `app/ui/locale-switcher.tsx` renders the language switcher in every page through `Document`. It posts to `/locale`, which saves the cookie and redirects back.
- To add a language, add an entry to `LOCALE_NAMES` in `app/i18n/index.ts` and create `app/i18n/messages/<locale>.ts`.

## Growing The App

- Put top-level route actions in `app/actions/controller.tsx`.
- Add `app/actions/<route-key>/controller.tsx` when a nested route map needs its own actions or middleware.
- Add directories like `app/data/` or `test/` when the app actually needs them.
- Move shared UI into `app/ui/` once more than one route needs it.

## Commands

```sh
npm i
npm run dev
npm run hmr
npm run start
npm test
npm run typecheck
npm run css:build
npm run css:watch
npm run db:migrate
npm run db:status
npm run db:rollback
```

### Development and production

| Script          | What it does                                                                                                    |
| --------------- | --------------------------------------------------------------------------------------------------------------- |
| `npm run dev`   | Builds the CSS once, then runs the Tailwind watcher and a server that restarts on file changes.                 |
| `npm run hmr`   | Builds the CSS once, then runs the Tailwind watcher and the server with live server and browser updates.        |
| `npm run start` | Builds the CSS once, then runs the server in production mode. `SESSION_SECRET` must be set in the environment.  |

### Styles (Tailwind)

| Script              | What it does                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| `npm run css:build` | Compiles `app/styles/app.css` to a minified `public/tailwind.css` (generated and gitignored).           |
| `npm run css:watch` | Rebuilds `public/tailwind.css` whenever a class name in `app/` changes. `dev` and `hmr` start this for you. |

### Database (SQLite)

The database lives at `db/app.sqlite` and is configured in `remix.json`. Migrations are plain SQL in `db/migrations/<number>_<name>/up.sql` and `down.sql`. The app also applies pending migrations on startup.

| Script                 | What it does                                                                                              |
| ---------------------- | --------------------------------------------------------------------------------------------------------- |
| `npm run db:migrate`   | Applies all pending migrations.                                                                           |
| `npm run db:status`    | Lists each migration as applied or pending.                                                               |
| `npm run db:rollback`  | Reverts the most recent migration. Pass flags after `--`, for example `npm run db:rollback -- --step 2`. |

### Tests and type checking

| Script              | What it does                                      |
| ------------------- | ------------------------------------------------- |
| `npm test`          | Runs server and end-to-end tests (`NODE_ENV=test`, in-memory database). |
| `npm run typecheck` | Runs `tsc --noEmit`.                              |

`npm test` accepts Remix test runner flags after `--`:

```sh
npm test -- --type server                 # router and unit tests only
npm test -- --type e2e --project chromium # Playwright end-to-end tests only
npm test -- --watch                       # re-run on changes
npm test -- --coverage                    # report coverage
```

End-to-end tests (`*.test.e2e.ts`) use Playwright. Install the browser once with `npx playwright install chromium` (add `--with-deps` on a fresh Linux machine or CI image).

### Environment variables

| Variable         | Used by                | Notes                                                              |
| ---------------- | ---------------------- | ------------------------------------------------------------------ |
| `SESSION_SECRET` | `dev`, `hmr`, `start`  | Signs the session cookie. Required in production; dev has a fallback. |
| `PORT`           | `dev`, `hmr`, `start`  | Server port. Defaults to `44100`.                                  |
