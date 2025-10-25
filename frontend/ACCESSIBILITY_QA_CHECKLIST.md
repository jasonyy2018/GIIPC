# Accessibility QA Checklist - Upcoming Events Feature

## Overview
This checklist ensures the Upcoming Events feature meets WCAG 2.1 Level AA accessibility standards.

## Keyboard Navigation Testing

### Homepage Upcoming Events Section
- [ ] Tab key navigates through all event cards
- [ ] Enter/Space activates event card links
- [ ] Focus indicators are clearly visible
- [ ] Tab order is logical (left to right, top to bottom)
- [ ] "Learn More" link is keyboard accessible
- [ ] No keyboard traps

### Events Page
- [ ] Tab key navigates through all events
- [ ] Sort dropdown is keyboard accessible
- [ ] Arrow keys work in dropdown
- [ ] Enter/Space activates event cards
- [ ] Focus returns to appropriate element after actions
- [ ] Skip to main content link works

### Event Detail Page
- [ ] Tab key navigates through all form fields
- [ ] Registration form is fully keyboard accessible
- [ ] Submit button activates with Enter/Space
- [ ] Login/Register buttons keyboard accessible
- [ ] Modal can be closed with Escape key
- [ ] Focus trapped in modal when open
- [ ] Focus returns to trigger element after modal closes

## Screen Reader Testing

### NVDA (Windows)
- [ ] Page title announced correctly
- [ ] Headings announced with proper levels
- [ ] Event cards announced with all information
- [ ] Form labels announced correctly
- [ ] Error messages announced
- [ ] Success messages announced
- [ ] Loading states announced
- [ ] Button purposes clear

### JAWS (Windows)
- [ ] Same checks as NVDA
- [ ] Forms mode works correctly
- [ ] ARIA live regions announce updates

### VoiceOver (macOS/iOS)
- [ ] Same checks as NVDA
- [ ] Rotor navigation works
- [ ] Touch gestures work on iOS

## Visual Accessibility

### Color Contrast
- [ ] Text on background: minimum 4.5:1 ratio
- [ ] Large text (18pt+): minimum 3:1 ratio
- [ ] Interactive elements: minimum 3:1 ratio
- [ ] Focus indicators: minimum 3:1 ratio
- [ ] Date badge text readable
- [ ] Error messages have sufficient contrast

### Visual Indicators
- [ ] Focus indicators visible on all interactive elements
- [ ] Focus indicators have 2px minimum thickness
- [ ] Hover states don't rely solely on color
- [ ] Error states indicated by more than color
- [ ] Required fields marked clearly
- [ ] Loading states visible

### Text and Typography
- [ ] Minimum font size 16px for body text
- [ ] Line height at least 1.5 for body text
- [ ] Paragraph spacing at least 2x font size
- [ ] Text can be resized to 200% without loss of content
- [ ] No horizontal scrolling at 200% zoom
- [ ] Text doesn't overlap at 200% zoom

## Semantic HTML

### Structure
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Only one h1 per page
- [ ] Main landmark present
- [ ] Navigation landmark present
- [ ] Form landmark present where applicable
- [ ] Section elements used appropriately

### Interactive Elements
- [ ] Buttons use `<button>` element
- [ ] Links use `<a>` element
- [ ] Form inputs have associated `<label>`
- [ ] Form groups use `<fieldset>` and `<legend>`
- [ ] Lists use `<ul>`, `<ol>`, `<li>`

## ARIA Attributes

### Labels and Descriptions
- [ ] `aria-label` on icon-only buttons
- [ ] `aria-labelledby` for complex labels
- [ ] `aria-describedby` for additional context
- [ ] `aria-required` on required form fields
- [ ] `aria-invalid` on fields with errors

### Live Regions
- [ ] `aria-live="polite"` for non-critical updates
- [ ] `aria-live="assertive"` for critical updates
- [ ] Loading states use `aria-busy="true"`
- [ ] Dynamic content changes announced

### States and Properties
- [ ] `aria-expanded` on expandable elements
- [ ] `aria-hidden="true"` on decorative elements
- [ ] `aria-current` on current page/section
- [ ] `aria-disabled` on disabled elements

## Forms Accessibility

### Event Registration Form
- [ ] All inputs have visible labels
- [ ] Labels properly associated with inputs
- [ ] Required fields marked with `required` attribute
- [ ] Required fields marked visually (not just with *)
- [ ] Error messages associated with fields
- [ ] Error messages descriptive and helpful
- [ ] Success messages announced
- [ ] Form can be submitted with keyboard
- [ ] Validation errors prevent submission
- [ ] Focus moves to first error on validation failure

### Input Types
- [ ] Correct input types used (email, text, etc.)
- [ ] Autocomplete attributes where appropriate
- [ ] Placeholder text not used as labels
- [ ] Help text available and associated

## Touch Target Sizes

### Mobile Devices
- [ ] All buttons minimum 44x44px
- [ ] Event cards minimum 44px height
- [ ] Adequate spacing between touch targets (8px minimum)
- [ ] No overlapping touch targets
- [ ] Swipe gestures have alternatives

## Images and Media

### Images
- [ ] All images have alt text
- [ ] Decorative images have empty alt (`alt=""`)
- [ ] Alt text is descriptive and concise
- [ ] Complex images have long descriptions
- [ ] Icons have text alternatives

### Date Badges
- [ ] Date information available to screen readers
- [ ] Not relying solely on visual presentation
- [ ] Text alternatives provided

## Error Handling

### Error Messages
- [ ] Errors announced to screen readers
- [ ] Error messages descriptive
- [ ] Errors associated with form fields
- [ ] Error summary at top of form
- [ ] Errors don't rely solely on color
- [ ] Icons supplement text, not replace it

### Loading States
- [ ] Loading announced to screen readers
- [ ] Loading indicators visible
- [ ] Loading doesn't block keyboard navigation
- [ ] Timeout warnings provided

## Responsive and Zoom

### Zoom Testing
- [ ] Content readable at 200% zoom
- [ ] No horizontal scrolling at 200% zoom
- [ ] All functionality available at 200% zoom
- [ ] Text doesn't overlap at 200% zoom
- [ ] Images scale appropriately

### Responsive Design
- [ ] Content reflows on small screens
- [ ] No loss of information on mobile
- [ ] Touch targets appropriate size
- [ ] Orientation changes supported
- [ ] Content readable in landscape and portrait

## Animation and Motion

### Motion Preferences
- [ ] Respect `prefers-reduced-motion`
- [ ] Animations can be paused
- [ ] No auto-playing content
- [ ] Parallax effects have alternatives
- [ ] Transitions don't cause seizures (no flashing)

## Testing Tools

### Automated Tools
- [ ] WAVE browser extension
- [ ] axe DevTools
- [ ] Lighthouse accessibility audit
- [ ] HTML validator
- [ ] Color contrast checker

### Manual Testing
- [ ] Keyboard-only navigation
- [ ] Screen reader testing
- [ ] Zoom testing
- [ ] Mobile device testing
- [ ] Real user testing with disabilities

## Common Issues to Check

### Potential Problems
- [ ] Missing alt text
- [ ] Poor color contrast
- [ ] Missing form labels
- [ ] Keyboard traps
- [ ] Missing focus indicators
- [ ] Improper heading hierarchy
- [ ] Empty links or buttons
- [ ] Redundant links
- [ ] Missing skip links
- [ ] Inaccessible modals

## Documentation

### For Developers
- [ ] Accessibility requirements documented
- [ ] ARIA patterns documented
- [ ] Keyboard shortcuts documented
- [ ] Known issues documented
- [ ] Remediation plans documented

## Sign-off

**Tested By**: _______________
**Date**: _______________
**Tools Used**: _______________
**Issues Found**: _______________
**Status**: [ ] Pass [ ] Fail [ ] Needs Work
**Notes**: _______________
