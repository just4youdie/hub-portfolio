## What changed

<!-- One or two lines. Title tip: feat: / fix: / content: / docs: / ci: -->

## Checklist

- [ ] `npm run validate` passes locally (or the **Site / Validate** check is green)
- [ ] New images are WebP, in **two sizes** - full (≤1400px) and `thumbs/` (≤640px), same filename
- [ ] New projects in `PROJECTS` have a unique `id` (not needed for commissions)
- [ ] New copy is translated: a key in **both** languages in `i18n.js`, or an `i18n: { pt: ... }` block on the project
- [ ] Checked the page in **EN and PT** (the switch is in the header)
- [ ] New commission page: every `[BRACKETED]` placeholder replaced, and it's linked from `PROJECTS.commissions`
- [ ] Checked on a phone-sized window (`npm run serve`, then shrink the browser)
