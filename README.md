# Skill Matrix — Vanderbilt Career Pathways Explorer

A single-page app built on Vanderbilt's **Skills-Based Job Architecture** (SBJA). Pick your
current role and a destination role, and the matrix shows:

- **Core competencies** (gold) — the six competencies every Vanderbilt staff member shares
- **Skills that carry** (gold) — exact matches between the two roles
- **Bridge skills** (oak) — destination skills with a near neighbor in your current role
  (same skill sub-category or category)
- **Skills to grow** (black outline) — new ground, covered by the learning plan
- **Probable skills** (dashed grey) — AI-inferred skills likely held in each role but not
  part of the official framework
- **A three-phase transition plan** with recommended learning per growth skill: Vanderbilt
  Course Library courses first, then LinkedIn Learning, YouTube, podcasts, certifications,
  white papers, and Coursera

Click any skill pill for its definition and expected proficiency by career level
(Service & Support, Individual Contributor, Project Management, Management, Executive).
Selections are stored in the URL hash, so a path like
`#from=Dining%20Services&to=Network%20Support` can be shared or bookmarked.

## Data

`assets/data/sbja.json` is extracted from the SBJA workbook (`SBJA + LEARNING.xlsx`):

| Source sheet | Used for |
|---|---|
| Job Family Skills | 18 job families, 92 roles (job sub-families), 954 skill mappings with proficiency levels |
| Core Skills | The six core competencies |
| Skills Library (Post-feedback) | 4,410-skill library used to infer per-role probable skills |

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
