# Quickstart Guide: Physical AI & Humanoid Robotics Textbook

**Feature**: 001-textbook-unification
**Version**: 1.0.0
**Created**: 2025-12-07

## Overview

This quickstart guide provides a rapid introduction to the Physical AI & Humanoid Robotics Textbook project structure and development workflow. The textbook is organized into 4 standardized modules covering ROS 2, Digital Twin Simulation, AI Brain (NVIDIA Isaac), and Vision-Language-Action Robotics.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Git for version control
- Basic understanding of Docusaurus documentation framework

## Project Setup

### 1. Clone and Initialize
```bash
# Clone the repository
git clone <repository-url>
cd <repository-name>

# Install dependencies
npm install
# or
yarn install
```

### 2. Local Development Server
```bash
# Start the development server
npm run start
# or
yarn start

# The textbook will be available at http://localhost:3000
```

### 3. Production Build
```bash
# Build the static site
npm run build
# or
yarn build

# Serve the built site locally for testing
npm run serve
# or
yarn serve
```

## Textbook Structure

### Module Organization
The textbook follows a standardized 4-module structure:

```
docs/
├── module1-ros2-nervous-system/     # ROS 2 fundamentals
│   ├── index.md                    # Module overview
│   └── [chapter files]             # Individual lessons
├── module2-digital-twin-simulation/ # Simulation and modeling
│   ├── index.md
│   └── [chapter files]
├── module3-ai-brain-isaac/         # NVIDIA Isaac AI
│   ├── index.md
│   └── [chapter files]
├── module4-vla-robotics/           # Vision-Language-Action
│   ├── index.md
│   └── [chapter files]
├── intro.md                       # Introduction page
├── weekly-roadmap.md              # 13-week learning path
└── additional-materials/          # Extra resources
    ├── index.md
    ├── cloud.md
    ├── hardware.md
    └── final_materials.md
```

### Content Standards
Each module must include:
- Learning outcomes
- Tools required
- Architecture diagrams
- Chapter navigation links
- Summary section

## Development Workflow

### 1. Adding New Content
1. Create markdown files in the appropriate module directory
2. Follow the standardized content template
3. Update the module's index.md to include navigation links
4. Verify all links in the sidebar navigation

### 2. Updating Module Structure
1. Update content files with standardized structure
2. Ensure all learning outcomes are defined
3. Add required diagrams with appropriate alt text
4. Test navigation and links

### 3. Theming and Styling
- Apply the blue/purple neon theme consistently
- Use Tailwind CSS classes for responsive design
- Maintain visual consistency across all pages
- Test on different device sizes

## Key Configuration Files

### sidebars.js
Controls the navigation structure with the exact 8-item format:
1. Physical AI & Humanoid Robotics Textbook
2. Module 1: ROS 2 Nervous System
3. Module 2: Digital Twin Simulation
4. Module 3: AI Brain (NVIDIA Isaac)
5. Module 4: Vision-Language-Action Robotics
6. Capstone Project
7. Additional Materials
8. Weekly Roadmap

### docusaurus.config.js
Contains site configuration, theme settings, and plugin configurations.

## Quality Assurance

### Before Committing Changes
1. Run `npm run build` to ensure the site builds without errors
2. Verify all navigation links work correctly
3. Check that content follows the standardized structure
4. Ensure diagrams and images load properly
5. Test responsive behavior on different screen sizes

### Content Validation
- All content must align with official ROS/Gazebo/Isaac documentation
- Technical accuracy must be maintained
- Consistency in style and structure across modules
- All code examples must be valid and runnable

## Common Tasks

### Creating a New Chapter
```bash
# Create a new markdown file in the appropriate module directory
# Follow this template:
---
title: Chapter Title
description: Brief description of the chapter
sidebar_position: [number]
---

# Chapter Title

## Learning Objectives
- Objective 1
- Objective 2

## Content
[Your chapter content here]

## Summary
[Chapter summary and key takeaways]
```

### Updating the Weekly Roadmap
Edit `docs/weekly-roadmap.md` to maintain the 13-week learning structure:
- Weeks 1–3 → ROS 2
- Weeks 4–5 → Digital Twin
- Weeks 6–7 → Isaac AI Brain
- Weeks 8–9 → VLA
- Weeks 10–13 → Capstone

## Troubleshooting

### Build Errors
- Check for broken links or missing files
- Verify markdown syntax in content files
- Ensure all required frontmatter is present

### Navigation Issues
- Verify sidebars.js follows the exact structure
- Check that all paths in navigation resolve correctly
- Ensure no duplicate or conflicting navigation items

### Theme Problems
- Verify Tailwind CSS integration is working
- Check that custom styles are applied consistently
- Test responsive behavior across different devices