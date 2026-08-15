---
name: testing-las-homepage
description: How to run and browser-test the LAS Club homepage (Vite 7 + React 19 + GSAP/ScrollTrigger) — Node 22 startup, breakpoint/reduced-motion/throttling emulation, and the console probes that verify motion state, scroll lock and overflow.
---

# Testing the LAS Club homepage

App lives in `LAS-website/` (Vite 7 + React 19 + TS + GSAP/ScrollTrigger). No auth,
no backend, no secrets. There is no test suite, so verification is browser-driven.

## Starting the app

The shell default Node may be older than the blueprint's Node 22 (e.g. v20.18.1,
which only warns). Always select 22 first:

```bash
source ~/.nvm/nvm.sh && nvm use 22
cd LAS-website && npm install
npm run dev        # http://localhost:5173
```

For anything network-timing related (throttling, blocked assets), test the
**production bundle** instead of the dev server:

```bash
npm run build && npm run preview   # http://localhost:4173
```

Reason: under Chrome "Slow 3G" the dev server's unbundled ES-module graph transfers
so slowly that React may not mount at all within a reasonable wait. That is a
dev-server artifact, not a product bug — do not report it as a preloader failure.
The built bundle (~340 kB JS / ~28 kB CSS) loads in ~4 s on Slow 3G.

## Breakpoints and emulation

Breakpoints come from `src/lib/motion.ts`: `BREAKPOINTS = { tablet: 768, desktop: 1200 }`
— mobile `<768`, tablet `768–1199`, desktop `>=1200`. Each section builds its own
GSAP context keyed on breakpoint, so changing width re-inits motion.

Use the DevTools device toolbar (`Ctrl+Shift+M`) responsive **width field** for exact
viewports. This is required: 390px is below Chrome's minimum window width, and the
physical display (often 1600x1200) cannot provide those sizes. Typing a new width in
that field is also the way to exercise mid-session breakpoint re-init **without a reload**.

- Network throttling: DevTools Network panel throttling dropdown.
- Request blocking: `Ctrl+Shift+P` → "blocking" → "Show Network request blocking" →
  add a pattern such as `*hero-figure.webp*`. Remember to disable the rule afterwards.
- Reduced motion: DevTools **Rendering** panel → "Emulate CSS media feature
  prefers-reduced-motion" → `prefers-reduced-motion: reduce`.

Beware: the throttling dropdown can swallow keyboard input aimed at the address bar.
If navigation attempts fail, open a fresh tab and navigate there.

## Useful runtime probes

Scroll lock is exposed as an attribute, so preloader release is directly assertable:

```js
document.body.dataset.scrollLocked   // 'true' while locked, 'false' after release
document.querySelector('.preloader')  // null once removed
```

The preloader (`src/components/SitePreloader.tsx`) races `[data-hero-art]` decode
against a 2500 ms cap; the reduced-motion branch releases after ~200 ms. Both paths
call `lockScroll(false)`, so a blocked/404 hero image must still release (verify
`heroNaturalW === 0` alongside `scrollLocked === 'false'`).

Sticky framework scene (`FrameworkScene.tsx`): the resting stagger lives in JS as
`CARD_REST = [0, -6, 4]` (% of card width) and is applied by the scrubbed timeline, so
assert the final transforms rather than eyeballing alignment:

```js
[...document.querySelectorAll('[data-scene-card]')].map(c => ({
  w: c.getBoundingClientRect().width,
  right: Math.round(c.getBoundingClientRect().right),
  tx: getComputedStyle(c).transform,
  op: getComputedStyle(c).opacity,
}))
```

Expected: desktop (380px cards) `0 / -22.8px / +15.2px`; tablet (333px cards)
`0 / -20.0px / +13.3px`; mobile all `0` with flat full-width cards. Note the stagger
is timeline-driven, so on the **mobile branch and under reduced motion the timeline is
skipped and all three cards sit flush** — that is expected, not the pre-fix bug, but
it is worth flagging to reviewers since the staggered composition is lost there.
Scrub the scene fully (all cards `opacity: 1`) before measuring, and re-measure after
scrolling back up and down to catch leftover mid-animation transforms.

`document.querySelectorAll('.pin-spacer').length === 0` is a good check that
ScrollTrigger pinning is genuinely disabled (mobile / reduced motion). CSS `position:
sticky` on `.scene__stage` remains in those modes by design — sticky is not
scroll-jacking, so do not report it as one.

## Overflow probe (and its known false positives)

```js
const over = [...document.querySelectorAll('main *, footer *')]
  .filter(e => e.getBoundingClientRect().right > innerWidth + 1)
  .map(e => e.tagName + ' right=' + Math.round(e.getBoundingClientRect().right));
({ iw: innerWidth, sw: document.documentElement.scrollWidth, over })
```

Judge real horizontal overflow by `document.documentElement.scrollWidth <= innerWidth + 1`
(i.e. no page-level horizontal scrollbar). Decorative dithered-device SVGs
(`.finale__device`, hero/finale ornaments) legitimately extend past the viewport edge at
every width but sit inside an `overflow: hidden` ancestor. Always walk up the parent
chain and report the ancestor's `overflow` value before calling such a hit a bug.

Also probe for content stuck mid-animation:

```js
[...document.querySelectorAll('main *')].filter(e => {
  const r = e.getBoundingClientRect();
  return r.width > 0 && r.height > 0 && parseFloat(getComputedStyle(e).opacity) === 0;
}).length   // expect 0 after scrolling a section into view
```

## Gotchas

- In the DevTools/CDP console, wrap measurements in an expression and
  `console.log(JSON.stringify(...))`; a snippet whose last statement is a `const`
  declaration evaluates to `undefined`.
- To observe fast CSS transitions (e.g. the stacked-label CTA hover on "Join the club"),
  temporarily inject a slow-down style and remove it afterwards:
  `.btn__label{transition-duration:2.5s !important}`.
- Reloads can briefly show a blank page while Vite compiles — wait before concluding.

## Devin Secrets Needed

None.
