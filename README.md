# Talent Marketplace — Vanderbilt Career Pathways Explorer

A single-page app built on Vanderbilt's **Skills-Based Job Architecture** (SBJA).

Staff know their **job title**, not their job sub-family, so every experience starts with a
type-ahead over the 1,098 active job titles in the Oracle org-structure export. Each title
resolves to the SBJA sub-family and career level whose skill profile drives everything else —
covering 98% of active headcount. Titles the framework hasn't profiled yet (Executive,
Temporary Services) still get the seven core competencies, free-entry development areas and a
transfer plan toward any profiled role.

Pick a role and a destination and the portal shows:

- **Core competencies** (gold) — Vanderbilt's seven competencies: four shared by all staff,
  three applying at management and executive levels
- **Skills that carry** (gold) — exact matches between the two roles
- **Bridge skills** (oak) — destination skills with a near neighbor in your current role
  (same skill sub-category or category)
- **Skills to grow** (black outline) — new ground, covered by the learning plan
- **Probable skills** (dashed grey) — AI-inferred skills likely held in each role but not
  part of the official framework
- **Three ways in**, all driven by search:
  - **My role** — find your job title, confirm your level, then a self-audit: every mapped
    skill shows the proficiency the framework expects, you rate where you actually are, and
    choose a direction (grow in this role, step to the next level, or transfer to another
    title). The plan builds from the gaps.
  - **My skills** — pick up to 10 library skills (search, optionally narrowed to a category),
    3 core strengths and 5 in your own words; get five best-fit roles.
  - **My team** — the same audit engine with manager copy, one person at a time, no names.
    Add as many people as you manage; each keeps their own ratings and plan.
- **A printable Learning & Development Plan** with recommended learning per growth skill:
  Oracle Learning deep links first (matched from the active course catalog), then named
  podcasts and industry certifications curated per skill category, YouTube, and white
  papers — plus a step-by-step Oracle playbook (Talent Profile, Oracle Grow, Oracle
  Learning, Opportunity Marketplace)

Click any skill pill for its definition and expected proficiency by career level
(Service & Support, Individual Contributor, Project Management, Management, Executive).
Selections are stored in the URL hash, so a path like
`#from=Dining%20Services&to=Network%20Support` can be shared or bookmarked.

## Data

`assets/data/sbja.json` is extracted from the SBJA workbook (`SBJA + LEARNING.xlsx`):

| Source sheet | Used for |
|---|---|
| Job Family Skills | 18 job families, 92 roles (job sub-families), 954 skill mappings with proficiency levels |
| Core Skills | The seven core competencies |
| Skills Library (Post-feedback) | 4,410-skill library used to infer per-role probable skills |

`assets/data/jobroles.json` is built by `tools/build_jobroles.py` from the Oracle
org-structure export joined to the framework:

```bash
python3 tools/build_jobroles.py <org_export.xlsx> <SBJA + LEARNING.xlsx> assets/data/jobroles.json
```

The export abbreviates sub-families (`AcadAdv`, `CuInstDe`), so the script scores each code
against the SBJA sub-family names in the same family and falls back to an explicit override
table for the cases abbreviation matching can't see. It also normalizes the export's
`SS2/SS3/SS4` career levels to the framework's `S2/S3/S4`. Re-run it whenever either
workbook is refreshed; it prints coverage and every unprofiled family so regressions are
visible.

Probable skills are precomputed: for each role, unmapped library skills are ranked by how
strongly their sub-category and category appear in the role's official skill profile
(sub-category ×3 + category, qualifications excluded, top 8). They are rendered in dashed
grey — never gold — to keep AI-inferred content visually distinct from the official
framework.

## Design

Vanderbilt FLH visual identity: black `#1C1C1C` / white / flat gold `#CFAE70`, metallic
gold gradient reserved for the hero, Libre Caslon Display headlines with one italic
emphasis, Inter body, Antonio eyebrows. Fonts are self-hosted; logo PNGs are derived from
the official EPS masters. Shares its design system with the
[Course Library](https://me5231979.github.io/Course_Library/).

## Run

Static site — no build step. Serve the repo root:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Or enable GitHub Pages on this repository and it works as-is.
