# Visual Testing Guide
## GIIP Frontend Application

**Purpose:** Visual verification checklist for manual testing  
**Date:** October 18, 2025

---

## 🎨 Visual Testing Checklist

This guide helps you visually verify that the frontend looks correct across different devices and browsers.

---

## Desktop View (1920px)

### Header / Navigation
```
Expected Visual:
┌─────────────────────────────────────────────────────────────┐
│ [LOGO] GIIP    Home News Events Conferences ... Contact Us  │
└─────────────────────────────────────────────────────────────┘
```

**Checklist:**
- [ ] Logo visible on left (40px height)
- [ ] "GIIP" text next to logo
- [ ] 7 navigation links horizontal
- [ ] Links have hover effect (red underline)
- [ ] Header sticky on scroll
- [ ] Background: Dark green (#0B4D3E)
- [ ] Text: White

### Hero Section
```
Expected Visual:
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│         Global Innovation and Intellectual Property          │
│    Firm Strategies and Policy Challenges in a Rapidly...     │
│                                                               │
│         [UPCOMING EVENTS]  [CONTACT US]                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Checklist:**
- [ ] Background image visible
- [ ] Dark overlay on image
- [ ] Large heading (2.8rem)
- [ ] Subtitle below heading
- [ ] Two buttons side by side
- [ ] Buttons have hover effect (lift up)
- [ ] Centered content
- [ ] Padding: 100px top/bottom

### News Section
```
Expected Visual:
┌─────────────────────────────────────────────────────────────┐
│                      Latest News                              │
│    Stay updated with the latest trends, insights...          │
│                                                               │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                     │
│  │ [Image] │  │ [Image] │  │ [Image] │                     │
│  │ Date    │  │ Date    │  │ Date    │                     │
│  │ Title   │  │ Title   │  │ Title   │                     │
│  │ Content │  │ Content │  │ Content │                     │
│  └─────────┘  └─────────┘  └─────────┘                     │
│                                                               │
│              [Read More News]                                 │
└─────────────────────────────────────────────────────────────┘
```

**Checklist:**
- [ ] Section heading centered
- [ ] Underline accent under heading
- [ ] 3 cards in grid layout
- [ ] Cards have shadow
- [ ] Cards lift on hover
- [ ] Images 200px height
- [ ] Date in red (#E63946)
- [ ] "Read More" button centered
- [ ] Gap: 30px between cards

### Events Section
```
Expected Visual:
┌─────────────────────────────────────────────────────────────┐
│                    Upcoming Events                            │
│    Join our global community for insightful...               │
│                                                               │
│  ┌──┬────────────────────────────────────────────────────┐  │
│  │15│ Global IP Summit 2023                              │  │
│  │Oct Geneva, Switzerland  500+ Attendees                │  │
│  │  │ Join leading IP experts...                         │  │
│  │  │ [Register Now]                                     │  │
│  └──┴────────────────────────────────────────────────────┘  │
│                                                               │
│  [More events...]                                             │
└─────────────────────────────────────────────────────────────┘
```

**Checklist:**
- [ ] Section heading centered
- [ ] Events in horizontal layout
- [ ] Date badge on left (70px width)
- [ ] Badge: Green background, white text
- [ ] Content on right
- [ ] Location and attendees with icons
- [ ] "Register Now" button
- [ ] Cards lift on hover
- [ ] Gap: 15px between events

### Conferences Section
```
Expected Visual:
┌─────────────────────────────────────────────────────────────┐
│                   Past Conferences                            │
│    Explore our archive of previous events...                 │
│                                                               │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                     │
│  │ [Image] │  │ [Image] │  │ [Image] │                     │
│  │ Date    │  │ Date    │  │ Date    │                     │
│  │ Title   │  │ Title   │  │ Title   │                     │
│  │ Location│  │ Location│  │ Location│                     │
│  │ Summary │  │ Summary │  │ Summary │                     │
│  └─────────┘  └─────────┘  └─────────┘                     │
└─────────────────────────────────────────────────────────────┘
```

**Checklist:**
- [ ] Section heading centered
- [ ] 3 cards in grid layout
- [ ] Cards have shadow
- [ ] Cards lift on hover
- [ ] Images 200px height
- [ ] Date in red
- [ ] Location with icon
- [ ] Gap: 30px between cards

### Footer
```
Expected Visual:
┌─────────────────────────────────────────────────────────────┐
│  About Us      Quick Links    Resources      Contact         │
│  - Mission     - Home          - Blog         - Email        │
│  - Team        - News          - Papers       - Phone        │
│  - Partners    - Events        - Reports      - Address      │
│                                                               │
│         © 2023 GIIP. All rights reserved.                    │
└─────────────────────────────────────────────────────────────┘
```

**Checklist:**
- [ ] 4 columns
- [ ] Column headings bold
- [ ] Links in each column
- [ ] Social icons (if present)
- [ ] Copyright centered at bottom
- [ ] Background: Light gray
- [ ] Links have hover effect

---

## Tablet View (768px)

### Header / Navigation
```
Expected Visual:
┌─────────────────────────────────────┐
│ [LOGO] GIIP              [☰]        │
└─────────────────────────────────────┘
```

**Checklist:**
- [ ] Logo visible on left
- [ ] Hamburger menu (☰) on right
- [ ] Desktop nav hidden
- [ ] Header sticky on scroll

### Mobile Menu (When Open)
```
Expected Visual:
┌──────────────────┐
│                  │
│  Home            │
│  ───────────     │
│  News            │
│  ───────────     │
│  Events          │
│  ───────────     │
│  Conferences     │
│  ───────────     │
│  ...             │
│                  │
└──────────────────┘
```

**Checklist:**
- [ ] Drawer slides from left
- [ ] Width: 85% (max 320px)
- [ ] Dark green background
- [ ] Links stack vertically
- [ ] Dividers between links
- [ ] Overlay visible behind drawer
- [ ] Smooth animation (0.4s)

### News Section (Slider Active)
```
Expected Visual:
┌─────────────────────────────────────┐
│         Latest News                 │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [Image]                     │   │
│  │ Date                        │   │
│  │ Title                       │   │
│  │ Content                     │   │
│  └─────────────────────────────┘   │
│                                     │
│         ● ○ ○                       │
└─────────────────────────────────────┘
```

**Checklist:**
- [ ] Single card visible
- [ ] Horizontal slider
- [ ] Swipe left/right works
- [ ] Indicators below (● ○ ○)
- [ ] Active indicator filled
- [ ] Auto-play every 5 seconds
- [ ] Smooth transitions

### Events Section
```
Expected Visual:
┌─────────────────────────────────────┐
│       Upcoming Events               │
│                                     │
│  ┌──┐                               │
│  │15│ Global IP Summit 2023         │
│  │Oct Geneva, Switzerland           │
│  └──┘ 500+ Attendees                │
│      Join leading IP experts...     │
│      [Register Now]                 │
│                                     │
│  [More events...]                   │
└─────────────────────────────────────┘
```

**Checklist:**
- [ ] Date badge on top
- [ ] Content below badge
- [ ] Vertical stacking
- [ ] Full-width cards
- [ ] Touch-friendly buttons

---

## Mobile View (375px)

### Header / Navigation
```
Expected Visual:
┌───────────────────────────┐
│ [LOGO] GIIP      [☰]      │
└───────────────────────────┘
```

**Checklist:**
- [ ] Logo smaller but visible
- [ ] Hamburger menu visible
- [ ] Fits viewport width
- [ ] No horizontal scroll

### Hero Section
```
Expected Visual:
┌───────────────────────────┐
│                           │
│  Global Innovation and    │
│  Intellectual Property    │
│                           │
│  Firm Strategies and...   │
│                           │
│  [UPCOMING EVENTS]        │
│  [CONTACT US]             │
│                           │
└───────────────────────────┘
```

**Checklist:**
- [ ] Heading readable (22px)
- [ ] Subtitle readable (16px)
- [ ] Buttons stack vertically
- [ ] Buttons full-width or centered
- [ ] Background image visible
- [ ] Padding: 60px top/bottom

### News Section
```
Expected Visual:
┌───────────────────────────┐
│     Latest News           │
│                           │
│  ┌───────────────────┐   │
│  │ [Image]           │   │
│  │ Date              │   │
│  │ Title             │   │
│  │ Content           │   │
│  └───────────────────┘   │
│                           │
│       ● ○ ○               │
└───────────────────────────┘
```

**Checklist:**
- [ ] Single card visible
- [ ] Card fits viewport
- [ ] Swipe gestures work
- [ ] Indicators visible
- [ ] Auto-play works
- [ ] No horizontal scroll

### Events Section
```
Expected Visual:
┌───────────────────────────┐
│   Upcoming Events         │
│                           │
│  ┌──┐                     │
│  │15│ Global IP Summit    │
│  │Oct 2023                │
│  └──┘                     │
│  Geneva, Switzerland      │
│  500+ Attendees           │
│  Join leading IP...       │
│  [Register Now]           │
│                           │
│  [More events...]         │
└───────────────────────────┘
```

**Checklist:**
- [ ] Compact layout
- [ ] Date badge smaller
- [ ] Content stacks vertically
- [ ] Button full-width
- [ ] Touch-friendly (44x44px)
- [ ] No horizontal scroll

### Footer
```
Expected Visual:
┌───────────────────────────┐
│  About Us                 │
│  - Mission                │
│  - Team                   │
│                           │
│  Quick Links              │
│  - Home                   │
│  - News                   │
│                           │
│  [More sections...]       │
│                           │
│  © 2023 GIIP              │
└───────────────────────────┘
```

**Checklist:**
- [ ] Single column
- [ ] Sections stack vertically
- [ ] All links visible
- [ ] Touch-friendly links
- [ ] Copyright at bottom

---

## Color Verification

### Primary Colors
- [ ] Primary Dark: #0B4D3E (Dark green)
- [ ] Primary: #1B5E20 (Green)
- [ ] Accent: #E63946 (Red)
- [ ] Text: #424242 (Dark gray)
- [ ] Background: #FFFFFF (White)

### Usage
- [ ] Header: Primary dark background
- [ ] Navigation links: White text
- [ ] Hover: Accent color
- [ ] Headings: Primary dark
- [ ] Body text: Text color
- [ ] Dates: Accent color
- [ ] Buttons: Accent background

---

## Typography Verification

### Font Family
- [ ] Sans-serif: Helvetica Neue, Helvetica, Arial

### Font Sizes (Desktop)
- [ ] H1 (Hero): 2.8rem (44.8px)
- [ ] H2 (Section): 2.2rem (35.2px)
- [ ] H3 (Card): 1.4rem (22.4px)
- [ ] Body: 16px
- [ ] Small: 14px

### Font Sizes (Mobile)
- [ ] H1: 22px
- [ ] H2: 20px
- [ ] H3: 17px
- [ ] Body: 15px
- [ ] Small: 14px

### Font Weights
- [ ] Headings: 600-700 (Semibold/Bold)
- [ ] Body: 400 (Regular)
- [ ] Buttons: 600 (Semibold)

---

## Spacing Verification

### Padding
- [ ] Container: 20px horizontal
- [ ] Sections: 80px vertical (desktop), 50px (mobile)
- [ ] Cards: 25px (desktop), 20px (mobile)
- [ ] Buttons: 12px 30px (desktop), 10px 20px (mobile)

### Margins
- [ ] Section headings: 40px bottom
- [ ] Card titles: 15px bottom
- [ ] Paragraphs: 20px bottom

### Gaps
- [ ] Grid: 30px
- [ ] Flex: 15px
- [ ] List items: 15px

---

## Animation Verification

### Hover Effects
- [ ] Navigation links: Underline slides in from left
- [ ] Cards: Lift up (-10px translateY)
- [ ] Buttons: Lift up (-2px translateY)
- [ ] Images: Scale up (1.1x)

### Transitions
- [ ] Duration: 0.3s (most)
- [ ] Easing: ease or cubic-bezier
- [ ] Smooth, not jarring

### Slider
- [ ] Auto-play: 5 seconds
- [ ] Transition: 0.5s ease
- [ ] Smooth slide animation

### Mobile Menu
- [ ] Slide duration: 0.4s
- [ ] Easing: cubic-bezier(0.4, 0, 0.2, 1)
- [ ] Overlay fade: 0.3s

---

## Accessibility Visual Checks

### Focus Indicators
- [ ] Visible on all interactive elements
- [ ] 3px red outline
- [ ] 2px offset from element
- [ ] High contrast

### Skip Link
- [ ] Hidden by default
- [ ] Visible on Tab focus
- [ ] Positioned at top center
- [ ] Red background, white text

### Touch Targets
- [ ] Minimum 44x44px
- [ ] Adequate spacing between targets
- [ ] Easy to tap on mobile

### Color Contrast
- [ ] Text readable on backgrounds
- [ ] Sufficient contrast (4.5:1 minimum)
- [ ] Links distinguishable

---

## Browser-Specific Checks

### Chrome
- [ ] All styles render correctly
- [ ] Smooth animations
- [ ] No console errors

### Firefox
- [ ] All styles render correctly
- [ ] Smooth animations
- [ ] No console errors

### Safari
- [ ] All styles render correctly
- [ ] Smooth animations
- [ ] Webkit prefixes work
- [ ] No console errors

### Edge
- [ ] All styles render correctly
- [ ] Smooth animations
- [ ] No console errors

---

## Common Visual Issues to Check

### Layout Issues
- [ ] No horizontal scrolling (mobile)
- [ ] Content doesn't overflow
- [ ] Proper alignment
- [ ] Consistent spacing

### Image Issues
- [ ] Images load correctly
- [ ] No broken images
- [ ] Proper aspect ratios
- [ ] Fallback images work

### Text Issues
- [ ] No text overflow
- [ ] Proper line breaks
- [ ] Readable font sizes
- [ ] Correct line height

### Interactive Issues
- [ ] Hover states work
- [ ] Click/tap feedback
- [ ] Focus states visible
- [ ] Animations smooth

---

## Testing Workflow

### 1. Desktop Testing (1920px)
1. Open application in browser
2. Verify header and navigation
3. Check hero section
4. Scroll through all sections
5. Test hover effects
6. Click all interactive elements
7. Verify footer

### 2. Tablet Testing (768px)
1. Resize browser to 768px
2. Verify layout switches
3. Test mobile menu
4. Test sliders
5. Verify touch targets
6. Check all sections

### 3. Mobile Testing (375px)
1. Resize browser to 375px
2. Verify mobile layout
3. Test mobile menu
4. Test swipe gestures
5. Verify no horizontal scroll
6. Check all sections

### 4. Cross-Browser Testing
1. Test in Chrome
2. Test in Firefox
3. Test in Safari
4. Test in Edge
5. Compare results

---

## Sign-Off Checklist

- [ ] Desktop view verified
- [ ] Tablet view verified
- [ ] Mobile view verified
- [ ] All colors correct
- [ ] Typography correct
- [ ] Spacing correct
- [ ] Animations smooth
- [ ] Accessibility features visible
- [ ] Cross-browser compatible
- [ ] No visual bugs found

---

**Tester:** _______________  
**Date:** _______________  
**Status:** _______________  
**Notes:** _______________

---

**Last Updated:** October 18, 2025
