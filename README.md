# 30-Day Data Engineering Study Plan

A production-ready, single-page progressive web app to track your 30-day data engineering journey. No build tools, no frameworks — just open `index.html` in any browser.

---

## Features

- **30 collapsible day cards** with topic, tasks, and estimated time
- **Progress tracking** saved to `localStorage` (persists on reload)
- **Progress bar** showing % complete and days done
- **Weekly quick-action buttons** to mark an entire week complete
- **Weekly milestones** summary panel
- **End-to-end project** section with pipeline diagram and deliverables
- **Export PDF** via browser print dialog
- **Fully responsive** — works on mobile, tablet, and desktop
- **Accessible** — keyboard navigable, ARIA attributes, semantic HTML

---

## Local Usage

1. **Download** all four files into the same folder:
   ```
   index.html
   styles.css
   script.js
   README.md
   ```
2. **Open** `index.html` in any modern browser (Chrome, Firefox, Safari, Edge).
3. No internet connection required after the Google Fonts load on first visit (fonts fall back gracefully offline).

---

## GitHub Pages Hosting

Host the app publicly for free in a few minutes:

1. **Create a GitHub repository**
   - Go to [github.com](https://github.com) → click **New repository**
   - Give it a name, e.g. `de-study-plan`
   - Set visibility to **Public**
   - Click **Create repository**

2. **Upload the files**
   - Click **Add file → Upload files**
   - Drag and drop `index.html`, `styles.css`, `script.js`, and `README.md`
   - Click **Commit changes**

3. **Enable GitHub Pages**
   - Go to your repo → **Settings** → **Pages** (left sidebar)
   - Under **Source**, select **Deploy from a branch**
   - Choose branch: `main`, folder: `/ (root)`
   - Click **Save**

4. **Open your published URL**
   - After ~1 minute, GitHub shows:  
     `Your site is live at https://<your-username>.github.io/<repo-name>/`
   - Click the link to view your live study plan

> **Note:** GitHub Pages serves static files only, which is exactly what this app uses.

---

## Editing the Study Plan

All plan content lives in the `PLAN` array near the top of `script.js`.

### Structure of each entry

```js
{ day: 1, topic: "Linux Basics", tasks: "Learn filesystem, ls, cd, grep; create project folders", time: "3h" },
```

| Field   | Type   | Description                                        |
|---------|--------|----------------------------------------------------|
| `day`   | number | Day number (used as unique ID for progress storage)|
| `topic` | string | Short headline shown on the collapsed card         |
| `tasks` | string | Full description shown when the card is expanded   |
| `time`  | string | Estimated study time displayed as a badge          |

### Adding a day

Copy an existing line and update all four fields:

```js
{ day: 31, topic: "Advanced dbt", tasks: "Implement custom macros and tests", time: "4h" },
```

### Removing a day

Delete the corresponding object from the array. Any saved progress for that day number is silently ignored.

### Changing week labels

Week labels are defined in the `WEEK_LABELS` object just below the `PLAN` array:

```js
const WEEK_LABELS = {
  1: "Week 1 — Foundation",
  2: "Week 2 — Pipelines",
  ...
};
```

---

## How Progress Works

1. When a day's checkbox is ticked, `setFlag(day, true)` writes `"true"` to `localStorage` under the key `de30_day_N`.
2. On every change, `updateProgress()` counts all days with a `true` flag and updates the progress bar.
3. On page load, each card reads its flag via `getFlag(day)` and renders as checked / completed if the flag is set.
4. If `localStorage` is unavailable (e.g. private browsing with strict settings), the app falls back to an in-memory store — progress works for the session but is lost on page refresh.

---

## Customising the Theme

All colours and fonts are defined as CSS variables at the top of `styles.css`:

```css
:root {
  --primary: #2563eb;   /* Blue accent */
  --bg:      #f0f4fa;   /* Page background */
  --text:    #111827;   /* Body text */
  ...
}
```

Change these values to retheme the entire app instantly.

---

## File Structure

```
de-study-plan/
├── index.html   – Page structure and semantic markup
├── styles.css   – All styles, responsive breakpoints, print styles
├── script.js    – Plan data, card rendering, progress logic
└── README.md    – This file
```

---

## Browser Support

Works in all modern browsers. No polyfills required.

| Browser | Minimum Version |
|---------|-----------------|
| Chrome  | 80+             |
| Firefox | 75+             |
| Safari  | 13.1+           |
| Edge    | 80+             |
