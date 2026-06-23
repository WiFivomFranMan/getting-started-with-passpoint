# Getting Started with Passpoint

Published static site for **Getting Started with Passpoint** — a plain-language primer for Access
Network Providers (ANPs), hosted on GitHub Pages.

Live: `https://wifivomfranman.github.io/getting-started-with-passpoint/`

## Files

- `index.html` - the guide. A single self-contained page: an accordion learning map with expandable
  sections, inline infographics (SVG), an FAQ, a glossary, and a standards/resource shelf. All content
  lives in the `sections` array near the bottom of the file and is rendered client-side.
- `assets/diagrams/` - the four diagram SVGs (Evolution, Connection process, Identifier map, RADIUS/RadSec).
- `assets/logos/` - WBA logo used in the top navigation.
- `styles/plain-language/` - redirect stub kept so the previously shared review URL still resolves to the guide.
- `wordpress/` - WordPress embed handoff kit (iframe snippets + optional shortcode plugin).
- `.nojekyll` - serves the site as plain static files on GitHub Pages.

## Editing the content

Open `index.html` and edit the `sections` array:

- Each section is `{ id, title, theme, visual, summary, meaning[], decisions[], note, links[] }`.
- The FAQ section uses `faqItems[]` instead of `meaning[]`.
- The Glossary section uses `glossary[]` (`{ abbr, term }`) instead of `meaning[]`.
- Section headings in the detail panel: **Completed Thought**, **ANP Checklist**, **Go Deeper**.
- The left rail and section numbering are generated automatically from the array order.

## Content intent

The guide is a primer, not a full standard or vendor configuration guide. It keeps the surface
readable while sending technical readers to Wi-Fi Alliance, IEEE, IETF, WBA, OpenRoaming, and vendor
documents for exact requirements and implementation detail.

## WBA-aligned visual rules

- Primary blue `#0b74b1` for navigation, links, and section accents.
- Action green `#25d66c` only for the primary call to action.
- Neutral background `#f2f2f2`, white cards, subtle borders, light shadows.
- 4px button/badge radius, 8px card/panel radius, restrained system typography.
