# Quickstart: Docusaurus Theme Colors

## Overview
This guide explains how to implement and customize the new color theme for the Docusaurus documentation site.

## Prerequisites
- Node.js 18+ installed
- Docusaurus project already set up
- Basic knowledge of CSS variables and Tailwind CSS

## Setup Process

### 1. Update CSS Variables
Modify `src/css/custom.css` to include the new color palette:

```css
:root {
  /* Light mode colors */
  --ifm-color-primary: #1A73E8;
  --ifm-color-primary-dark: #0B62C8;
  --ifm-color-primary-darker: #0A4F99;
  --ifm-color-primary-darkest: #093D76;
  --ifm-color-primary-light: #4C8BF5;
  --ifm-color-primary-lighter: #A3C4F3;
  --ifm-color-primary-lightest: #D6E4F9;
  --ifm-color-background: #F5F7FA;
  --ifm-color-text: #1A1A1A;
}

[data-theme='dark'] {
  /* Dark mode colors */
  --ifm-color-primary: #4C8BF5;
  --ifm-color-primary-dark: #1A73E8;
  --ifm-color-primary-darker: #0B62C8;
  --ifm-color-primary-darkest: #0A4F99;
  --ifm-color-background: #1E1E1E;
  --ifm-color-text: #FFFFFF;
}
```

### 2. Update Tailwind Configuration
Add the new colors to `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        'primary-blue': '#1A73E8',
        'primary-blue-dark': '#0B62C8',
        'primary-blue-darker': '#0A4F99',
        'primary-blue-light': '#4C8BF5',
        'primary-blue-lighter': '#A3C4F3',
        'light-bg': '#F5F7FA',
        'dark-bg': '#1E1E1E',
        'text-dark': '#1A1A1A',
        'text-light': '#FFFFFF',
      }
    },
  },
}
```

### 3. Test Accessibility
Verify that all text elements meet WCAG 2.1 AA contrast ratios:
- Normal text: minimum 4.5:1 contrast ratio
- Large text: minimum 3:1 contrast ratio

## Integration Scenarios

### Theme Switching
The theme switcher component should automatically apply the appropriate color scheme based on user preference (light/dark mode).

### Component Styling
All Docusaurus components (navbar, sidebar, buttons, links, etc.) will automatically inherit the new color scheme through CSS variables.

### Responsive Design
Colors will adapt appropriately across different screen sizes and devices while maintaining accessibility standards.