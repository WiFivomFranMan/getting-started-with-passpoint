# Passpoint Quick Start Figma Package

This package converts `PQSG - Structure and flow 20260505.docx` into a polished learning-map concept for Access Network Providers.

## Files

- `passpoint-quick-start-prototype.html` - reviewable accordion prototype with expandable sections, modern infographics, and standards/resource links.
- `figma-plugin/manifest.json` - local Figma development plugin manifest.
- `figma-plugin/code.js` - generator that creates the desktop and mobile Figma frames.
- Published site assets include four existing diagram SVGs under `assets/diagrams/`.
- The top navigation uses the WBA logo extracted from `WBA_Whitepaper_Template_Latest_V1.0.0.docx` and bundled under `assets/logos/`.
- `styles/` - review pages for alternate writing styles.
- `tools/build_style_versions.js` - generator for the alternate writing-style review pages.

## Writing Style Review Links

Use these links to compare voice and tone while keeping the same structure, visual design, and reference links:

- `styles/plain-language/` - Plain-Language Learner
- `styles/operator-playbook/` - Operator Playbook
- `styles/wba-formal/` - Standards-Neutral WBA Formal
- `styles/executive/` - Executive Summary
- `styles/support-faq/` - Support and FAQ
- `styles/comedic-plainspoken/` - Comedic Plainspoken review draft

## Figma Import

1. Open Figma.
2. Go to `Plugins > Development > Import plugin from manifest`.
3. Select `figma-plugin/manifest.json`.
4. Run `Passpoint Quick Start Generator`.

The plugin creates:

- `01 Desktop - Passpoint Learning Map`
- `02 Mobile - Accordion Review`

Each guide section is written as a completed summary plus an expanded detail area with:

- completed thought
- ANP checkpoints
- operator note
- go-deeper links

## Content Intent

The artifact is a primer, not a full standard or vendor configuration guide. It keeps the surface readable while sending technical readers to Wi-Fi Alliance, IEEE, IETF, WBA, OpenRoaming, and vendor documents for exact requirements and implementation detail.

## Source Material Used

- `WBA Dallas/PQSG - Structure and flow 20260505.docx`
- `Passpoint Quick Start Guide - WBA Format v1.5.docx`
- `/Users/kevinfranman/Downloads/design-guidelines.md`
- Existing diagram assets in `diagrams/`
- Public standards/resource links embedded in the prototype and Figma generator

## WBA-Aligned Visual Rules Applied

- Primary blue `#0b74b1` for navigation, links, section accents, and secondary interactive elements.
- Action green `#25d66c` only for the primary CTA.
- Neutral page background `#f2f2f2`, white cards, subtle borders, and light shadows.
- 4px button/badge radius, 8px card/panel radius, and restrained system typography.
