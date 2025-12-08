# Data Model: Physical AI & Humanoid Robotics Textbook (Unified Specification)

**Feature**: 001-textbook-unification
**Model Version**: 1.0.0
**Created**: 2025-12-07
**Status**: Draft

## Overview

This document defines the conceptual data model for the Physical AI & Humanoid Robotics Textbook. Since this is a documentation system, the "data" consists of content organization and navigation structures rather than traditional database entities.

## Core Entities

### 1. Module

**Description**: Represents a major section of the textbook containing related content focused on a specific topic area.

**Attributes**:
- `id`: string (unique identifier, e.g., "module1-ros2")
- `name`: string (canonical name, e.g., "module1-ros2-nervous-system")
- `title`: string (display title, e.g., "Module 1: ROS 2 Nervous System")
- `description`: string (brief overview of the module content)
- `learningOutcomes`: array of strings (list of learning objectives)
- `toolsRequired`: array of strings (tools and technologies needed)
- `navigationOrder`: integer (position in the overall sequence: 1-4)
- `chapters`: array of Chapter references (content pages in the module)
- `diagrams`: array of Diagram references (visual aids for the module)

**Relationships**:
- Contains 0..n Chapter entities
- Contains 0..n Diagram entities
- Belongs to 1 Textbook entity (composition)

**Validation Rules**:
- id must follow pattern: "module[1-4]-[topic-area]"
- name must match canonical naming convention
- navigationOrder must be between 1 and 4
- learningOutcomes must contain at least 2 items
- title must be unique across all modules

### 2. Chapter

**Description**: Represents an individual content page within a module, containing specific learning materials.

**Attributes**:
- `id`: string (unique identifier within the module)
- `title`: string (chapter title)
- `content`: string (markdown content of the chapter)
- `navigationOrder`: integer (position within the module)
- `module`: Module reference (parent module)
- `prerequisites`: array of Chapter references (chapters that should be read first)
- `learningObjectives`: array of strings (specific learning goals for this chapter)
- `durationEstimate`: integer (estimated reading time in minutes)

**Relationships**:
- Belongs to 1 Module entity
- References 0..n Diagram entities
- References 0..n CodeExample entities
- May have 0..n prerequisite Chapter entities

**Validation Rules**:
- navigationOrder must be unique within the parent module
- title must be non-empty
- content must follow markdown format
- durationEstimate must be positive

### 3. Diagram

**Description**: Represents a visual aid used to explain technical concepts within modules and chapters.

**Attributes**:
- `id`: string (unique identifier)
- `title`: string (title of the diagram)
- `description`: string (explanation of what the diagram shows)
- `type`: string (category: "architecture", "flow", "pipeline", "model", etc.)
- `filePath`: string (path to the diagram file)
- `module`: Module reference (primary module it belongs to)
- `chapters`: array of Chapter references (chapters that reference this diagram)
- `altText`: string (accessibility description)

**Relationships**:
- Belongs to 1 Module entity (primary association)
- Referenced by 0..n Chapter entities
- Belongs to 1 Textbook entity

**Validation Rules**:
- filePath must point to a valid image file
- type must be one of the predefined categories
- altText must be provided for accessibility

### 4. CodeExample

**Description**: Represents a code snippet or example used to demonstrate technical concepts.

**Attributes**:
- `id`: string (unique identifier)
- `title`: string (brief description of the example)
- `code`: string (the actual code content)
- `language`: string (programming language, e.g., "python", "cpp", "bash")
- `explanation`: string (explanation of what the code does)
- `chapter`: Chapter reference (parent chapter)
- `module`: Module reference (parent module)

**Relationships**:
- Belongs to 1 Chapter entity
- Belongs to 1 Module entity (via chapter)
- Belongs to 1 Textbook entity

**Validation Rules**:
- code must be syntactically valid for the specified language
- language must be one of the supported languages
- title and explanation must be non-empty

### 5. Textbook

**Description**: Represents the complete textbook structure containing all modules and their relationships.

**Attributes**:
- `id`: string (unique identifier: "physical-ai-humanoid-robotics-textbook")
- `title`: string (full title of the textbook)
- `description`: string (overall description of the textbook)
- `version`: string (textbook version)
- `modules`: array of Module references (all modules in the textbook)
- `navigationStructure`: NavigationItem (root of the sidebar navigation)
- `theme`: string (theme identifier, e.g., "blue-purple-neon")

**Relationships**:
- Contains 4 Module entities (composition)
- Contains all Chapter, Diagram, and CodeExample entities through modules
- Contains NavigationItem structure

**Validation Rules**:
- Must contain exactly 4 modules
- title must be "Physical AI & Humanoid Robotics Textbook"
- version must follow semantic versioning
- modules must be ordered sequentially (1-4)

### 6. NavigationItem

**Description**: Represents an item in the sidebar navigation structure.

**Attributes**:
- `id`: string (unique identifier)
- `label`: string (display text in the sidebar)
- `path`: string (URL path for the navigation item)
- `type`: string ("category" or "doc")
- `children`: array of NavigationItem references (sub-items if type is category)
- `module`: Module reference (if this item represents a module)
- `priority`: integer (ordering priority in the sidebar)
- `collapsed`: boolean (whether the category is collapsed by default)

**Relationships**:
- Belongs to 1 Textbook entity
- May contain 0..n child NavigationItem entities
- May reference 1 Module entity
- May reference 1 Chapter entity

**Validation Rules**:
- path must be a valid relative path
- type must be either "category" or "doc"
- if type is "category", children array must not be empty
- priority must be unique within the same parent level

## Entity Relationships

```
Textbook (1) ── Contains ── (4) Module
Module (1) ── Contains ── (n) Chapter
Module (1) ── Contains ── (n) Diagram
Chapter (1) ── Contains ── (n) CodeExample
Chapter (1) ── References ── (n) Diagram
Module (1) ── References ── (n) NavigationItem
Textbook (1) ── Contains ── (1) NavigationStructure
```

## State Transitions

### Module State Transitions
- `draft` → `review` → `published` → `archived`
- Only published modules appear in the final textbook

### Chapter State Transitions
- `outline` → `content-draft` → `review` → `final` → `published`
- Only published chapters are included in the live textbook

## Access Patterns

### Primary Access Patterns
1. **Sequential Learning**: Textbook → Module → Chapter (ordered by navigationOrder)
2. **Topic-Based Access**: Textbook → Module (by topic area)
3. **Search-Based Access**: Textbook → Chapter (by content search)
4. **Navigation-Based Access**: NavigationItem → Content (via sidebar)

### Performance Considerations
- Navigation structure should be pre-computed and cached
- Diagram assets should be optimized for fast loading
- Chapter content should be efficiently indexed for search
- Module summaries should be pre-generated for quick access

## Validation Rules Summary

### Content Validation
- All content must follow the established textbook structure
- Learning outcomes must be clearly defined for each module
- All code examples must be valid and runnable
- Diagrams must have appropriate alt text for accessibility

### Structural Validation
- Sidebar must follow the exact 8-item structure specified
- Module naming must follow canonical conventions
- All navigation paths must resolve to valid content
- No orphaned content pages should exist

### Quality Validation
- All content must align with official ROS/Gazebo/Isaac documentation
- Technical accuracy must be verified
- Consistency in style and structure across all modules
- All visual aids must be clear and informative