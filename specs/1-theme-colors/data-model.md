# Data Model: Docusaurus Color Theme

## Color Theme Entity
Represents the complete color scheme with primary, secondary, background, surface, text, and semantic colors for both light and dark modes

### Attributes
- **id**: string (unique identifier for the theme)
- **name**: string (theme name, e.g., "light", "dark")
- **primary**: ColorObject
- **secondary**: ColorObject
- **background**: ColorObject
- **surface**: ColorObject
- **text**: ColorObject
- **semantic**: SemanticColorsObject

### ColorObject
- **default**: string (hex color code)
- **dark**: string (darker variant)
- **darker**: string (even darker variant)
- **darkest**: string (darkest variant)
- **light**: string (lighter variant)
- **lighter**: string (even lighter variant)
- **lightest**: string (lightest variant)

### SemanticColorsObject
- **success**: string (e.g., #10B981 for green)
- **info**: string (e.g., #3B82F6 for blue)
- **warning**: string (e.g., #F59E0B for amber)
- **danger**: string (e.g., #EF4444 for red)

## Current Implementation Structure
### Light Mode Colors
- **Primary**: #1A73E8 (blue)
- **Primary Dark Variants**: #0B62C8, #0A4F99
- **Primary Light Variants**: #4C8BF5, #A3C4F3
- **Background**: #F5F7FA
- **Text**: #1A1A1A

### Dark Mode Colors
- **Primary**: #4C8BF5 (lighter blue)
- **Background**: #1E1E1E
- **Text**: #FFFFFF

## Relationships
- Each ColorTheme has multiple ColorObjects
- ColorObjects follow a hierarchy with variants for different UI states
- SemanticColorsObject provides meaning for different types of feedback

## Validation Rules
- All text colors must maintain WCAG 2.1 AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Primary colors must have accessible contrast against background colors
- Color transitions must be smooth and not cause accessibility issues
- All color variants must maintain visual consistency across the theme