# Design System — The Museum of Incorrect Physics

## Color Palette (Locked Identity)
- **Background (Canvas):** `#080b17` (Deep Obsidian Void) / `#0d1020`
- **Surface Elevated:** `#151936`
- **Electric Lavender:** `#B5A3FF` (Curatorial Anomaly Accent)
- **Radiant Purple / Deep Violet:** `#9588FF` / `#6E5AE8`
- **Text (Primary):** `#F5F1E8` (Archival Alabaster)
- **Muted Structural Borders & Hairlines:** `rgba(245, 241, 232, 0.12)`
- **Secondary Caption / Metadata Text:** `rgba(245, 241, 232, 0.60)`
- **Subtle Surface Container:** `rgba(181, 163, 255, 0.04)`
- **Cyan:** 0% (Strictly forbidden — replaced across all visuals by lavender and purple)

## Typography
- **Headings & Display:** `Playfair Display`, serif (Weights: 400, 600, 700)
- **Metadata, Labels, Equations & Telemetry:** `IBM Plex Mono`, monospace (Weights: 300, 400, 500)
- **Body & Interpretive Prose:** `Playfair Display` (for curated quotes / lead paragraphs) and neutral editorial serif/mono hierarchy

## Motion & Dynamics
- Calm, controlled, scientific.
- Anomalies should feel rare, unsettling, and meaningful.
- Routine micro-feedback $\le 200\text{ms}$ with smooth settling curves (`cubic-bezier(0.16, 1, 0.3, 1)`).
- Strict adherence to `prefers-reduced-motion`.

## Layout Principles
- Large editorial typography with negative space.
- Hairline architectural dividers (`1px solid rgba(245, 241, 232, 0.12)`).
- Zero-pill discipline: No static tags in pill enclosures; clean typographic separators (`·` or `/`).
- Curatorial catalog accession schema: Catalog ID, physical constant, deviation indicator.
- Museum installation spatial presence.
