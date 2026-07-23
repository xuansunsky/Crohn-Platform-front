---
name: verify
summary: Build and visually drive the Vue/Capacitor frontend in headless Chrome.
---

# Frontend verification

1. Build with enough Node heap:
   `NODE_OPTIONS="--max-old-space-size=4096" npm run build`
2. Start Vite from the project root: `npm run dev -- --host 127.0.0.1`.
3. Open `http://127.0.0.1:5173/dashboard` in Chrome mobile viewport (430×900).
4. Seed a non-expired local JWT and `lastActiveTab=flow`. For an isolated diary check, intercept XHR for `/dance/entries`, `/dance/entry`, and `users/getRole` with deterministic local responses.
5. Drive the surface by clicking the three feeling cards, simple/rich modes, save, and the newest history item. Capture homepage, writer, and detail screenshots.

Gotchas:
- `dist/` is generated output; durable art belongs under `public/`.
- The build may fail with memory allocation errors without `NODE_OPTIONS`.
- The frontend has no Playwright dependency; Chrome DevTools Protocol via a local headless Chrome is the fallback.
