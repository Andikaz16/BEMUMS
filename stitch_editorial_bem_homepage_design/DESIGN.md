---
name: Editorial Impact
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#5d3f3c'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#926e6b'
  outline-variant: '#e7bdb8'
  surface-tint: '#c00015'
  primary: '#b90014'
  on-primary: '#ffffff'
  primary-container: '#e31b23'
  on-primary-container: '#fff9f8'
  inverse-primary: '#ffb4ac'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2e1'
  on-secondary-container: '#656464'
  tertiary: '#5b5b5a'
  on-tertiary: '#ffffff'
  tertiary-container: '#747373'
  on-tertiary-container: '#fdfaf9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ac'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#93000d'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474746'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Anton
    fontSize: 96px
    fontWeight: '400'
    lineHeight: 90px
  display-lg-mobile:
    fontFamily: Anton
    fontSize: 56px
    fontWeight: '400'
    lineHeight: 52px
  headline-xl:
    fontFamily: Anton
    fontSize: 64px
    fontWeight: '400'
    lineHeight: 60px
  headline-lg:
    fontFamily: Anton
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 44px
  headline-md:
    fontFamily: Anton
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
spacing:
  unit: 4px
  gutter: 32px
  margin-desktop: 64px
  margin-mobile: 20px
  block-gap: 48px
---

## Brand & Style
The design system is built for a high-stakes editorial environment. It prioritizes clarity, authority, and urgency, mimicking the physical presence of avant-garde print journalism. The personality is unapologetically bold and direct, designed to provoke an emotional response of importance and professional rigor.

The aesthetic blends **Modern Brutalism** with a refined **Swiss Style** layout. It relies on extreme contrast—pure whites against deep blacks and vibrant reds—to create a visual hierarchy that guides the reader through complex information. The interface avoids "softness," instead opting for sharp edges, massive typography, and intentional asymmetry to create a dynamic, rhythmic user experience.

## Colors
The palette is restrictive and high-contrast to maintain editorial focus. 

- **Vibrant Red (#E31B23):** Used exclusively for high-priority actions, critical highlights, and structural accents like top borders or section markers.
- **Deep Black (#111111) & Charcoal (#222222):** Form the foundation of the structural blocks. Use these for heavy footer sections, header bars, or large typography.
- **Pure White (#FFFFFF):** The canvas. High whitespace is required to let the heavy typography breathe.
- **Dark & Light Gray:** Used for secondary text and subtle structural divisions that don't require the visual weight of black.

## Typography
Typography is the primary design element. The system uses **Anton** for all display and headline roles to create a condensed, "breaking news" feel.

- **Headlines:** Must always be uppercase with tight line-height. This creates solid "blocks" of text that function as graphic elements.
- **Body Copy:** **Inter** provides a neutral, highly readable counterpoint to the aggressive headlines. It should be set with generous line-spacing to ensure legibility against the bold surroundings.
- **Section Tags:** Use `label-sm` in **Vibrant Red** with uppercase styling and increased letter spacing. This acts as a clear marker for categorization.

## Layout & Spacing
The layout follows a **12-column asymmetric grid**. Content should not always be centered; instead, utilize empty columns to create tension and focal points.

- **Grid:** Use a 12-column layout on desktop with large 32px gutters. Elements should span varying column widths (e.g., a headline spanning 8 columns while the body text below spans only 6) to create an editorial flow.
- **Rhythm:** Use a 4px baseline grid. Components and blocks should be separated by large vertical gaps (`block-gap`) to maintain the "Minimalist" clarity.
- **Mobile:** Transition to a 4-column grid. Display typography should scale down significantly but maintain its condensed, uppercase impact.

## Elevation & Depth
This design system is strictly **Flat**. There are no ambient shadows, blurs, or gradients. Depth is communicated through **Layering and Borders** rather than lighting physics.

- **Tonal Stacking:** Use solid blocks of Deep Black or Vibrant Red to "lift" content. A red block positioned slightly offset behind a white card creates a sense of depth without using shadows.
- **Bold Outlines:** Use 2px or 3px solid black borders to define interactive areas and input fields. 
- **High Contrast:** Elements "pop" from the background through color theory (Red vs. White) rather than Z-axis elevation.

## Shapes
The shape language is defined by **sharpness**. All corners are 0px radius (Sharp). 

This applies to:
- Buttons
- Input Fields
- Cards and Containers
- Image frames

The only exception to this "rectilinear" rule is for circular icon buttons or specialized "stamp" labels, but even these should feel industrial rather than "friendly."

## Components

### Buttons
- **Primary:** Solid Deep Black background with White uppercase Inter text. On hover, the background switches to Vibrant Red.
- **Secondary:** Transparent background with a 2px Deep Black border.
- **Shape:** Strictly rectangular with no rounded corners.
- **Padding:** Generous horizontal padding (32px) to emphasize the blocky nature.

### Input Fields
- **Style:** 2px solid Black border, white background. 
- **Focus State:** Border changes to Vibrant Red with a 1px inner offset "ghost" border.
- **Labels:** Always use the `label-sm` style (Red, uppercase, small caps) positioned above the field.

### Cards
- **Editorial Card:** No border by default. Uses a large image with a sharp 0px radius, followed by a Red section tag and an Anton headline.
- **Feature Card:** Solid Black background with White text and a 4px Red top-border accent.

### Chips & Tags
- **Style:** Rectangular, small, with solid Red background and White text. No rounded corners. Used for categories or status indicators.

### Progress Indicators
- **Style:** Thick, 8px flat bars. The "filled" portion is Vibrant Red; the "unfilled" portion is Light Gray. No rounded caps.

### Navigation
- **Top Bar:** Fixed, White background with a 4px Deep Black bottom border. Links use `label-sm` style and turn Red on hover.