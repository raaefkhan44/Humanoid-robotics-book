---
id: 1
title: "physical-ai-textbook-unification"
stage: "spec"
date_iso: "2025-12-07"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "textbook-unification"
branch: "001-textbook-unification"
user: "user"
command: "/sp.specify Physical AI & Humanoid Robotics Textbook (Unified Specification)..."
labels: ["specification", "textbook", "robotics", "documentation"]
links:
  spec: "specs/001-textbook-unification/spec.md"
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "specs/001-textbook-unification/spec.md"
  - "specs/001-textbook-unification/checklists/requirements.md"
tests_yaml: []
---

## Prompt Text

```
Physical AI & Humanoid Robotics Textbook (Unified Specification)

## 1. Objective
Normalize, clean, and update the *Physical AI & Humanoid Robotics Textbook* so the project has a single unified structure. All updates follow these rules:

- Do **not** create new folders unless allowed.
- Update existing files.
- Delete outdated folders/files.
- Rename folders to standardized module naming.
- Update sidebar, content, and theme.
- Ensure correctness when collaborator directory differs.

---

## 2. Directory Normalization Rules

### 2.1 Canonical Module Folders
Rename existing folders to these EXACT names:

- `docs/ros2-nervous-system` → **docs/module1-ros2-nervous-system**
- `docs/digital-twin-simulation` → **docs/module2-digital-twin-simulation**
- `docs/ai-brain-isaac` → **docs/module3-ai-brain-isaac**
- `docs/vla-robotics` → **docs/module4-vla-robotics**

No duplicate module folders should remain.

---

### 2.2 Deletions (Only if they exist)
Delete these files:

- `docs/final-exam.md`
- `docs/glossary.md`
- `docs/hardware.md`
- `docs/overview.md`

Delete these folders (entire folder):

- `docs/module1-ros2-nervous-system` (old)
- `docs/module2-digital-twin-simulation` (old)
- `docs/module3-ai-brain-nvidia-isaac` (old)
- `docs/module4-vision-language-action-robotics` (old)
- `specs/001-book-content-update`

---

## 3. Content Update Rules

### 3.1 Update intro.md
- Add title, description, book purpose.
- Add module overview preview.
- Add hero text + image placeholder.
- Add CTA: **Start Reading**.

### 3.2 Update weekly-roadmap.md
Include 1–13 week learning roadmap:
- Weeks 1–3 → ROS 2
- Weeks 4–5 → Digital Twin
- Weeks 6–7 → Isaac AI Brain
- Weeks 8–9 → VLA
- Weeks 10–13 → Capstone

### 3.3 Update "Additional Materials"
Update these files with complete content:
- `index.md`
- `cloud.md`
- `hardware.md`
- `final_materials.md`

### 3.4 Update Module Index Pages
For each:

- `module1-ros2-nervous-system/index.md`
- `module2-digital-twin-simulation/index.md`
- `module3-ai-brain-isaac/index.md`
- `module4-vla-robotics/index.md`

Add:
- Module intro
- Learning outcomes
- Tools required
- Architecture diagrams
- Chapter navigation links
- Summary

### 3.5 Review and improve module chapters
- Fix formatting
- Improve clarity
- Add missing explanations
- Add diagrams

---

## 4. Sidebar Update Rules

Sidebar must follow **exact structure**:

1. Physical AI & Humanoid Robotics Textbook
2. Module 1: ROS 2 Nervous System
3. Module 2: Digital Twin Simulation
4. Module 3: AI Brain (NVIDIA Isaac)
5. Module 4: Vision-Language-Action Robotics
6. Capstone Project
7. Additional Materials
8. Weekly Roadmap

Remove any leftover sidebar groups from deleted folders.

---

## 5. Front Page (`src/pages/index.tsx`)

Create this file (allowed):

### Must include:
- Book title
- Short description
- Start Reading → `/docs/intro`
- Four module cards
  - Icon
  - Title
  - Description
  - Link

### Frontend Requirements:
- Tailwind CSS
- Clean, modern robotics theme
- Responsive
- Neon blue/purple theme

---

## 6. Theme & Branding Rules
- Apply consistent theme across markdown pages.
- Use blue/purple neon accents.
- Add diagrams for key sections:
  - ROS graph
  - Digital Twin flow
  - Isaac pipeline
  - VLA model

---

## 7. Sp introduction
- Add hero section
- Add module preview cards

### Weekly Roadmap
- Add 1–13 week roadmap
- Add diagrams

### Additional Materials
Update:
- cloud.md
- hardware.md
- final_materials.md
- index.md

### Module Index Pages
Add:
- Module overview
- Learning objectives
- Tools
- Diagrams
- Links to chapters

### Module Chapters
- Improve structure
- Fix formatting
- Add visuals

---

## C. Sidebar Update
Rewrite sidebars.js to:


---

## D. Specs Folder Update
Update ONLY (do not create new):

- spec.md
- tasks.md
- plan.md
- research.md
- quickstart.md

---

## E. Front Page Creation (`index.tsx`)
- Title
- Description
- Start Reading button
- 4 Module cards
- Tailwind layout
- Icons
- Responsive

---

## F. Final QA
- Remove dead links
- Ensure sidebar works
- Ensure renamed folders referenced correctly
- Ensure Docusaurus builds with no errors

---

# End of Combined Markdown File
```

## Response Text

Created a comprehensive specification for the Physical AI & Humanoid Robotics Textbook unification project. The specification includes:

- User scenarios for students, educators, and developers with clear priorities and acceptance criteria
- Functional requirements covering all aspects of the textbook reorganization (folder renaming, content updates, navigation structure, theme application)
- Success criteria with measurable outcomes for content organization, navigation efficiency, and user satisfaction
- Key entities definition for modules, content pages, navigation structure, and learning paths

The specification addresses all aspects of the textbook unification including:
- Standardized module naming (module1-4)
- Content updates for intro, roadmap, and additional materials
- Module index pages with learning outcomes and tools
- Consistent sidebar structure
- Front page with module cards
- Theme application with visual aids
- Quality assurance for dead links and build processes

## Outcome

Specification successfully created at specs/001-textbook-unification/spec.md with validation checklist. The spec is ready for planning phase.