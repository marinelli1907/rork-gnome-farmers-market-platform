# Gnome Web

A React and TypeScript web app for Gnome, a neighborhood marketplace for finding, sharing, and selling local food and garden goods.

## Repository layout

- [web/](web/): Vite application.
- [web/src/pages/](web/src/pages/): browsing, listings, markets, garden planning, pricing, and informational pages.
- [web/src/components/](web/src/components/): shared UI and marketplace components.
- [web/src/test/](web/src/test/): tests.

## Local development

The app includes a Bun lockfile.

```sh
cd web
bun install --frozen-lockfile
bun run dev
```

Use runtime versions compatible with [web/package.json](web/package.json).

## Checks and builds

Run these from `web/`:

- `bun run lint`
- `bun run build`
- `bun run test`
- `bun run test:browser:run`
- `bun run preview`

Browser tests use Playwright Chromium, which must be available in the test environment.

## Related source

The separate [Gnome repository](https://github.com/marinelli1907/Gnome) contains a mobile app, a Next.js web app, an admin app, and Supabase backend code. This Vite app is a distinct source tree. Confirm the intended application and deployment before copying changes between them.

This README describes the checked-in application, not verified production services.
