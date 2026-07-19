# Study Planner — Term 3 Weighted Assessments

A small static website that turns the Dunman Secondary Sec 2 Term 3 Weighted
Assessment Schedule into a day-by-day study plan — built around your subject
band, your Mother Tongue language, and whatever homework/tuition commitments
you add yourself (saved right in your browser, nothing is uploaded anywhere).

No build step, no dependencies. Just HTML, CSS and JavaScript.

## What it does

- Reads the fixed test weeks from the schedule (History in Week 6, Maths &
  Geography in Week 7, Science/Lit/D&T in Week 8, Mother Tongue & Art in
  Week 9) plus the flexible English performance tasks from Weeks 1–4.
- Lets you pick your band (G1/G2/G3) and Mother Tongue language so you only
  see what applies to you.
- Lets you add recurring or one-off commitments (tuition, homework, CCA) —
  the planner builds study blocks *around* them, never on top.
- Generates 45-minute study blocks with 10-minute breaks in your free time,
  weighting subjects by how many marks they're worth and how close the test
  is, so revision naturally intensifies as a test approaches.
- Treats Sundays as light/rest days with just one short review block.
- Everything is stored in your browser's `localStorage` — it stays on your
  device and isn't sent anywhere.

## Running it locally

Just open `index.html` in a browser. That's it — there's no server or build
process required.

## Publishing it on GitHub Pages

1. Create a new repository on GitHub (e.g. `study-schedule-planner`).
2. Upload the contents of this folder to the repository (`index.html`,
   `styles.css`, `app.js`, `.nojekyll`).
3. In the repository, go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to `Deploy from a branch`,
   branch `main`, folder `/ (root)`. Save.
5. GitHub will publish the site at:
   `https://<your-username>.github.io/study-schedule-planner/`
   (this can take a minute or two the first time.)

## Editing the test data

All the assessment data lives at the top of `app.js` in the `TESTS` array.
If your school schedule changes, or you want to add another term, just edit
the entries there — each one has a subject, level/band, topic, marks,
format, and date range.

## Files

```
index.html     – page structure & controls
styles.css     – Claude-inspired warm styling, Roboto Slab typography
app.js         – test data, the scheduling algorithm, and rendering
.nojekyll      – tells GitHub Pages not to run Jekyll processing
README.md      – this file
```
