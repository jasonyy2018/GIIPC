# Typography System Guide

## Overview

The GIIP website uses a comprehensive typography system based on the Helvetica Neue font stack, optimized for readability across all devices. This guide explains the typography standards and how to use them.

## Font Stack

### Desktop
```css
font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
```

### Mobile (iOS/Android optimized)
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
```

## Base Typography Settings

### Body Text
- **Font Size**: 16px (1rem)
- **Line Height**: 1.6
- **Font Weight**: 400 (normal)
- **Color**: #424242

### Mobile Body Text
- **Font Size**: 16px (maintained for readability)
- **Line Height**: 1.6
- **Uses system font stack for better performance**

## Font Sizes

### Desktop Scale
| Name | Size | Usage |
|------|------|-------|
| text-xs | 12px | Small labels, captions |
| text-sm | 14px | Buttons, metadata |
| text-md | 15px | Secondary text |
| text-base | 16px | Body text (default) |
| text-lg | 18px | Emphasized text |
| text-xl | 20px | Section subtitles |
| text-2xl | 24px | Card titles |
| text-3xl | 30px | Section headings |
| text-4xl | 36px | Page titles |

### Mobile Adjustments
- Hero H1: 22px (from 2.8rem)
- Section H2: 20px (from 2.2rem)
- Card H3: 17px (from 1.4rem)
- About H3: 19px (from 1.8rem)
- Body text: 15-16px maintained

## Line Heights

| Name | Value | Usage |
|------|-------|-------|
| leading-tight | 1.2 | Large headings |
| leading-snug | 1.3 | Section titles |
| leading-normal | 1.4 | Card titles, labels |
| leading-relaxed | 1.5 | Metadata, small text |
| leading-loose | 1.6 | Body text, paragraphs |
| leading-extra | 1.7 | Long-form content |

## Font Weights

| Name | Value | Usage |
|------|-------|-------|
| font-normal | 400 | Body text |
| font-medium | 500 | Navigation links |
| font-semibold | 600 | Headings, emphasis |
| font-bold | 700 | Hero titles, dates |

## Component Typography

### Navigation
```css
font-size: 16px;
font-weight: 500;
line-height: 1.4;
```

### Buttons
```css
font-size: 14px;
font-weight: 600;
line-height: 1.4;
letter-spacing: 0.5px;
```

### Hero Section
**Desktop:**
```css
h1: 2.8rem, font-weight: 700, line-height: 1.2
p: 1.2rem, line-height: 1.6
```

**Mobile:**
```css
h1: 22px, font-weight: 700, line-height: 1.3
p: 16px, line-height: 1.6
```

### Section Titles
**Desktop:**
```css
h2: 2.2rem, font-weight: 600, line-height: 1.3
p: 0.95rem, line-height: 1.6
```

**Mobile:**
```css
h2: 20px, font-weight: 600, line-height: 1.3
p: 15px, line-height: 1.6
```

### News Cards
**Desktop:**
```css
date: 14px, font-weight: 600, line-height: 1.4
h3: 1.4rem, font-weight: 600, line-height: 1.4
p: 16px, line-height: 1.6
```

**Mobile:**
```css
date: 14px, font-weight: 600, line-height: 1.4
h3: 17px, font-weight: 600, line-height: 1.4
p: 15px, line-height: 1.6
```

### Conference Cards
**Desktop:**
```css
date: 14px, font-weight: 600, line-height: 1.4
h3: 1.4rem, font-weight: 600, line-height: 1.4
location: 15px, line-height: 1.5
p: 16px, line-height: 1.6
```

**Mobile:**
```css
date: 14px, font-weight: 600, line-height: 1.4
h3: 17px, font-weight: 600, line-height: 1.4
location: 15px, line-height: 1.5
p: 15px, line-height: 1.6
```

### Event Items
**Desktop:**
```css
day: 1.6rem, font-weight: 700, line-height: 1
month: 0.8rem, line-height: 1.2
h3: 1.1rem, font-weight: 600, line-height: 1.4
meta: 0.85rem, line-height: 1.5
description: 0.85rem, line-height: 1.6
```

**Mobile:**
```css
day: 28px, font-weight: 700, line-height: 1
month: 14px, line-height: 1.2
h3: 17px, font-weight: 600, line-height: 1.4
meta: 14px, line-height: 1.5
description: 15px, line-height: 1.6
```

### Footer
**Desktop:**
```css
h3: 1.2rem, font-weight: 600, line-height: 1.4
links: 0.9rem, line-height: 1.5
copyright: 0.85rem, line-height: 1.5
```

**Mobile:**
```css
h3: 17px, font-weight: 600, line-height: 1.4
links: 15px, line-height: 1.5
copyright: 14px, line-height: 1.5
```

## Responsive Breakpoints

### Mobile (≤768px)
- Switches to system font stack
- Reduces heading sizes
- Maintains 16px body text for readability
- Adjusts line heights for better mobile reading

### Small Mobile (≤480px)
- Further reduces body text to 15px
- Hero H1: 20px
- Section H2: 19px

## Usage Examples

### Using Utility Classes
```html
<p class="text-base leading-loose">Body text with comfortable reading</p>
<h2 class="text-3xl font-semibold leading-snug">Section heading</h2>
<span class="text-sm font-medium">Metadata label</span>
```

### Using CSS Variables
```css
.custom-element {
    font-size: var(--text-base);
    line-height: var(--leading-loose);
    font-weight: var(--font-medium);
}
```

## Best Practices

1. **Maintain Hierarchy**: Use consistent font sizes for similar content types
2. **Readable Line Heights**: Body text should use 1.6 line height minimum
3. **Mobile Optimization**: Test on actual devices, not just browser resize
4. **Performance**: System fonts load faster on mobile devices
5. **Accessibility**: Maintain minimum 16px font size for body text
6. **Consistency**: Use defined variables instead of arbitrary values

## Accessibility Considerations

- Minimum body text size: 16px (meets WCAG AA standards)
- Line height for body text: 1.6 (exceeds WCAG 1.5 minimum)
- Sufficient color contrast maintained
- Scalable units (rem) used for better zoom support
- System fonts improve readability on native platforms

## Implementation

The typography system is implemented in `css/typography.css` and should be included in all HTML pages:

```html
<link rel="stylesheet" href="css/typography.css">
```

This file is loaded before other stylesheets to establish base typography that can be overridden if needed.

## Testing Checklist

- [ ] Test on desktop browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices (iOS Safari, Android Chrome)
- [ ] Test at different zoom levels (100%, 125%, 150%)
- [ ] Verify readability in different lighting conditions
- [ ] Check line length (45-75 characters optimal)
- [ ] Validate with screen readers
- [ ] Test with browser font size adjustments

## References

- Based on Helvetica Neue design system
- Follows WCAG 2.1 AA accessibility standards
- Optimized for multi-device readability
- Inspired by modern web typography best practices
