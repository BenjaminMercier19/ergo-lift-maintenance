# Hero videos

`hero-entretien.mp4` and `hero-reparation.mp4` are the source site's own
real footage (owner-authorized reuse), already wired into the
`/entretien` and `/reparation` hero sections.

## Homepage hero (still pending)

The source site has no video on its homepage, so there is nothing to
reuse there. Drop a clip here once shot, using these exact filenames:

- `hero.mp4` (H.264, for Safari/most browsers)
- `hero.webm` (VP9, smaller, for Chrome/Firefox)

The homepage hero already references both. Until they exist, the page
silently falls back to the current static hero photo — no code change
needed on either end.

## Shot spec

- **Duration:** 6 to 10s, loopable (first and last frame should match
  reasonably well so the loop isn't jarring).
- **Content:** a real intervention in progress (cleaning or repairing
  a Concept2 machine or a bar), medium shot, hands/tool visible.
- **Orientation:** landscape, at least 1920x1080. Steady shot or slow
  handheld, no fast pans (it plays silently, small, behind text - fast
  motion just reads as noisy).
- **Audio:** irrelevant, the tag is `muted` - shoot without worrying
  about sound.
- **Export:** no audio track, under ~4MB if possible (compress with
  Handbrake or similar, CRF 28 to 32 is normally invisible at this
  size/duration).
