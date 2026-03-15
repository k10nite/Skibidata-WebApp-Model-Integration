# Component Index - Fertilizer Recommendation App

## Quick Reference Guide

### Core UI Components

| Component | Purpose | Variants | Usage |
|-----------|---------|----------|-------|
| **Button** | Primary interaction element | primary, secondary, outline, text | CTAs, form submissions, navigation |
| **Card** | Content container | elevated, outlined, flat | Group related content, display information |
| **Input** | Text input field | N/A | User text input, forms |
| **Select** | Dropdown selection | N/A | Plant selection, option choosing |
| **Container** | Layout wrapper | sm, md, lg, xl, full | Page width constraints |
| **Header** | Page navigation | N/A | App header with back button |

### Specialized Components

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| **StatusIndicator** | Display status levels | 3 modes (badge, bar, card), 3 statuses (low, medium, high) |
| **NPKCard** | Show NPK nutrient levels | Grid layout, integrated status indicators |
| **FertilizerCard** | Display fertilizer recommendations | Recommended badge, NPK ratio, dosage info |
| **LoadingSpinner** | Processing state display | Animated spinner, step indicators |

### Screen Components

| Screen | Key Components Used | Primary Purpose |
|--------|-------------------|-----------------|
| **LocationScreen** | Button, Card | GPS location selection |
| **PlantSelectionScreen** | Select, Card | Crop type selection |
| **ProcessingScreen** | LoadingSpinner | Show processing steps |
| **SoilStatusScreen** | NPKCard, StatusIndicator, Card | Display soil analysis |
| **PlantRequirementsScreen** | Card, StatusIndicator | Show plant NPK needs |
| **RecommendationsScreen** | FertilizerCard | List fertilizer options |
| **EndActionsScreen** | Button, Card | Final user actions |

## Component Hierarchy

```
App
├── Header
│   └── Container
├── LocationScreen
│   ├── Container
│   ├── Card
│   │   └── Map Component
│   └── Button (x2)
├── PlantSelectionScreen
│   ├── Container
│   ├── Card
│   │   ├── Select
│   │   └── Input
│   └── Button
├── ProcessingScreen
│   ├── Container
│   └── LoadingSpinner
├── SoilStatusScreen
│   ├── Container
│   ├── NPKCard
│   │   ├── Card
│   │   └── StatusIndicator (x3)
│   └── Card (pH information)
├── PlantRequirementsScreen
│   ├── Container
│   ├── Card
│   │   └── StatusIndicator (x3)
│   └── Button
├── RecommendationsScreen
│   ├── Container
│   ├── FertilizerCard (multiple)
│   └── Button
└── EndActionsScreen
    ├── Container
    ├── Card
    └── Button (x2-3)
```

## Color Usage Matrix

### Status Colors Application

| Element | Low (Red) | Medium (Yellow) | High (Green) |
|---------|-----------|-----------------|--------------|
| Background | #FFEBEE | #FFF8E1 | #E8F5E9 |
| Main Color | #F44336 | #FFC107 | #4CAF50 |
| Dark Shade | #C62828 | #FFA000 | #388E3C |
| Border | Red main | Yellow main | Green main |
| Text | Red dark | Yellow dark | Green dark |
| Icon | Red main | Yellow main | Green main |

### 60-30-10 Distribution

**60% Neutral (Backgrounds & Structure)**
- Page background: #FAFAFA
- Card backgrounds: #FFFFFF
- Large container areas: Gray-50 to Gray-100
- Input field backgrounds: White

**30% Supporting (Secondary Elements)**
- Section dividers: Gray-200
- Card borders: Gray-300
- Status backgrounds: Light versions of red/yellow/green
- Hover states: Gray-200/300
- Secondary text: Gray-600

**10% Accent (Interactive Elements)**
- Primary buttons: #4CAF50
- Active states: Primary green
- Links: Primary green
- Progress indicators: Primary green
- Success messages: Primary green
- CTAs: Primary green

## Typography Scale Usage

### Headings

```css
H1 - Screen Titles
  Font: 36px (2.25rem)
  Weight: 700 (Bold)
  Usage: Main page titles

H2 - Section Headers
  Font: 30px (1.875rem)
  Weight: 700 (Bold)
  Usage: Major sections

H3 - Card Titles
  Font: 24px (1.5rem)
  Weight: 600 (Semibold)
  Usage: Card headers, subsections

H4 - Subsection Headers
  Font: 20px (1.25rem)
  Weight: 600 (Semibold)
  Usage: Component titles

H5 - Component Labels
  Font: 18px (1.125rem)
  Weight: 600 (Semibold)
  Usage: Form labels, list headers

H6 - Small Headers
  Font: 16px (1rem)
  Weight: 600 (Semibold)
  Usage: Inline headers
```

### Body Text

```css
Body1 - Primary Body Text
  Font: 16px (1rem)
  Weight: 400 (Regular)
  Usage: Main content, descriptions

Body2 - Secondary Body Text
  Font: 14px (0.875rem)
  Weight: 400 (Regular)
  Usage: Supporting text, helper text

Caption - Small Text
  Font: 12px (0.75rem)
  Weight: 400 (Regular)
  Usage: Captions, footnotes, metadata

Button Text
  Font: 14px (0.875rem)
  Weight: 600 (Semibold)
  Transform: Uppercase
  Usage: All buttons

Overline - Labels
  Font: 12px (0.75rem)
  Weight: 600 (Semibold)
  Transform: Uppercase
  Usage: Section labels, tags
```

## Spacing System

### Component Spacing

| Use Case | Spacing Value | Pixels |
|----------|---------------|--------|
| Tight inline gaps | spacing-1 | 4px |
| Small gaps (icons + text) | spacing-2 | 8px |
| Default gaps | spacing-3 | 12px |
| Medium gaps (form fields) | spacing-4 | 16px |
| Large gaps (cards) | spacing-6 | 24px |
| Section gaps | spacing-8 | 32px |
| Major sections | spacing-12 | 48px |

### Padding Standards

| Component | Padding |
|-----------|---------|
| Button (sm) | 0 16px |
| Button (md) | 0 24px |
| Button (lg) | 0 32px |
| Card (sm) | 12px |
| Card (md) | 24px |
| Card (lg) | 32px |
| Input | 0 16px |
| Container (mobile) | 0 16px |
| Container (desktop) | 0 32px |

## Responsive Breakpoints

```javascript
Mobile First Approach:

Base (< 640px)     - Single column, full width
sm (640px+)        - Small tablets
md (768px+)        - Tablets, landscape phones
lg (1024px+)       - Small laptops, large tablets
xl (1280px+)       - Desktops
2xl (1536px+)      - Large desktops
```

### Component Responsive Behavior

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| Button Actions | Stacked (column) | Row | Row |
| NPK Grid | 1 column | 2 columns | 3 columns |
| Fertilizer Cards | 1 column | 2 columns | 2-3 columns |
| Container Padding | 16px | 24px | 32px |
| Font Sizes | Base scale | Base scale | +1 step |

## Shadow/Elevation System

| Level | Usage | Components |
|-------|-------|------------|
| none | Flat elements | Outlined cards, dividers |
| sm | Subtle elevation | Badges, chips |
| base | Standard cards | Card default, inputs |
| md | Hover states | Card hover, dropdowns |
| lg | Floating elements | Modals, popovers |
| xl | Maximum elevation | Full-screen overlays |

## State Specifications

### Button States

```css
Default
  - Defined background color
  - Defined text color
  - Shadow: sm

Hover (non-disabled)
  - Background: darker shade
  - Shadow: md
  - Transform: translateY(-1px)

Active (non-disabled)
  - Transform: translateY(0)
  - Shadow: sm

Disabled
  - Opacity: 0.5
  - Cursor: not-allowed
  - No hover effects

Focus
  - Outline: 2px primary color
  - Outline-offset: 2px
```

### Card States

```css
Default
  - Background: white
  - Shadow: base (elevated) or border (outlined)

Hoverable + Hover
  - Shadow: md
  - Transform: translateY(-2px)

Clickable + Active
  - Transform: translateY(0)
  - Shadow: base

Selected/Active (if applicable)
  - Border: 2px primary color
  - Background tint: light primary
```

### Input States

```css
Default
  - Border: 2px light gray
  - Background: white

Focus
  - Border: 2px primary color
  - Box-shadow: 0 0 0 3px primary (10% opacity)

Error
  - Border: 2px error color
  - Helper text: error color

Disabled
  - Opacity: 0.5
  - Cursor: not-allowed
```

## Animation Guidelines

### Transitions

```css
Fast (150ms)
  - Color changes
  - Opacity changes
  - Small transforms

Base (250ms)
  - Most interactions
  - Hover states
  - Shadow changes

Slow (350ms)
  - Complex animations
  - Layout changes
  - Loading states
```

### Loading Animations

```css
Spinner Rotation
  - Duration: 1s
  - Timing: linear
  - Infinite loop

Step Progress
  - Duration: 250ms
  - Timing: ease-in-out
  - Triggered on step change

Skeleton Loading
  - Background shimmer
  - Duration: 1.5s
  - Infinite loop
```

## Accessibility Checklist

### Color & Contrast

- [ ] Text color contrast ≥ 4.5:1 for normal text
- [ ] Large text contrast ≥ 3:1
- [ ] Interactive element contrast ≥ 3:1
- [ ] Status indicators use both color AND icon/text
- [ ] Focus indicators are visible (2px outline)

### Keyboard Navigation

- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical
- [ ] Focus visible on all interactive elements
- [ ] No keyboard traps
- [ ] Escape key closes modals/overlays

### Screen Readers

- [ ] Semantic HTML used (nav, main, section, article)
- [ ] Images have alt text
- [ ] Form inputs have labels
- [ ] ARIA labels where needed
- [ ] Status messages announced
- [ ] Loading states announced

### Touch & Mobile

- [ ] Touch targets ≥ 40px height
- [ ] Adequate spacing between interactive elements
- [ ] Gestures have alternatives
- [ ] Viewport meta tag set correctly
- [ ] Content readable without zoom

## Icon Recommendations

### Ionicons 5+ Icons

```javascript
// Location & Navigation
import {
  IoLocationSharp,      // GPS location
  IoMapOutline,         // Map view
  IoNavigateOutline,    // Navigation
  IoArrowBackOutline,   // Back button
} from 'react-icons/io5';

// Plant & Agriculture
import {
  IoLeafOutline,        // Plant/crop
  IoFlowerOutline,      // Flower/plant
  IoWaterOutline,       // Water/irrigation
} from 'react-icons/io5';

// Status & Indicators
import {
  IoCheckmarkCircle,    // Success
  IoWarningOutline,     // Warning
  IoInformationCircle,  // Information
  IoArrowUpCircle,      // High status
  IoArrowDownCircle,    // Low status
  IoRemoveCircle,       // Medium status
} from 'react-icons/io5';

// Actions
import {
  IoSearchOutline,      // Search
  IoRefreshOutline,     // Refresh
  IoDownloadOutline,    // Download
  IoShareOutline,       // Share
  IoBookmarkOutline,    // Save
} from 'react-icons/io5';

// UI Elements
import {
  IoCloseOutline,       // Close
  IoMenuOutline,        // Menu
  IoChevronDown,        // Dropdown arrow
  IoChevronForward,     // Next
  IoChevronBack,        // Previous
} from 'react-icons/io5';
```

## Implementation Checklist

### Phase 1: Setup Design System

- [ ] Install dependencies (react-icons, etc.)
- [ ] Create globals.css with CSS variables
- [ ] Create design token files (colors, typography, spacing)
- [ ] Set up component folder structure
- [ ] Create Container and Header layout components

### Phase 2: Core Components

- [ ] Build Button component with all variants
- [ ] Build Card component with sub-components
- [ ] Build Input component
- [ ] Build Select component
- [ ] Test all components in isolation

### Phase 3: Specialized Components

- [ ] Build StatusIndicator with all modes
- [ ] Build NPKCard component
- [ ] Build FertilizerCard component
- [ ] Build LoadingSpinner component
- [ ] Test component interactions

### Phase 4: Screen Implementation

- [ ] Build LocationScreen
- [ ] Build PlantSelectionScreen
- [ ] Build ProcessingScreen
- [ ] Build SoilStatusScreen
- [ ] Build PlantRequirementsScreen
- [ ] Build RecommendationsScreen
- [ ] Build EndActionsScreen

### Phase 5: Polish & Testing

- [ ] Add loading states
- [ ] Add error states
- [ ] Test responsive behavior
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Performance optimization
- [ ] Cross-browser testing

## Common Patterns

### Form Pattern

```jsx
<Container maxWidth="md">
  <Card padding="lg">
    <Card.Header>
      <h2>Form Title</h2>
    </Card.Header>
    <Card.Body>
      <Input
        label="Field Label"
        placeholder="Enter value"
        required
      />
      <Select
        label="Dropdown Label"
        options={options}
        required
      />
    </Card.Body>
    <Card.Footer>
      <Button variant="primary" fullWidth>
        Submit
      </Button>
    </Card.Footer>
  </Card>
</Container>
```

### Status Display Pattern

```jsx
<Container maxWidth="lg">
  <Card>
    <Card.Header>
      <h3>Status Title</h3>
    </Card.Header>
    <Card.Body>
      <div className="status-grid">
        <StatusIndicator
          mode="card"
          status="low"
          label="Metric 1"
          value={100}
          unit=" unit"
        />
        <StatusIndicator
          mode="card"
          status="high"
          label="Metric 2"
          value={200}
          unit=" unit"
        />
      </div>
    </Card.Body>
  </Card>
</Container>
```

### Action Pattern

```jsx
<Container maxWidth="md">
  <Card>
    <Card.Body>
      <p>Action description text</p>
    </Card.Body>
    <Card.Footer>
      <Button variant="primary" fullWidth>
        Primary Action
      </Button>
      <Button variant="outline" fullWidth>
        Secondary Action
      </Button>
    </Card.Footer>
  </Card>
</Container>
```

## Testing Recommendations

### Unit Testing

- Test component rendering with different props
- Test state changes
- Test event handlers
- Test conditional rendering
- Test accessibility attributes

### Visual Regression Testing

- Screenshot tests for each component state
- Responsive breakpoint screenshots
- Color contrast validation
- Focus state visibility

### Integration Testing

- Test screen flows
- Test form submissions
- Test navigation
- Test loading states
- Test error handling

### Accessibility Testing

- Automated: axe-core, jest-axe
- Manual: Keyboard navigation
- Screen reader: NVDA, VoiceOver
- Color contrast: WebAIM tools
- Touch target sizes

## Performance Optimization

### Best Practices

1. **Code Splitting**
   - Lazy load screen components
   - Dynamic imports for heavy libraries
   - Route-based splitting

2. **Image Optimization**
   - Use appropriate formats (WebP)
   - Lazy load images
   - Responsive images with srcset
   - Compress images

3. **CSS Optimization**
   - Use CSS variables for theming
   - Minimize CSS bundle size
   - Remove unused CSS
   - Use CSS containment

4. **React Optimization**
   - Memoize expensive calculations
   - Use React.memo for pure components
   - Optimize re-renders with useMemo/useCallback
   - Virtualize long lists

## Browser Support

### Target Browsers

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile Safari (iOS 13+)
- Chrome Mobile (Android 8+)

### Polyfills Needed

- CSS custom properties (IE11 if needed)
- Intersection Observer (for lazy loading)
- ResizeObserver (for responsive components)

## Design Handoff Notes

### For Designers

- All colors defined in CSS variables
- Typography scale follows 1.25 ratio
- Spacing uses 4px base unit
- Shadows follow material design principles
- Components are modular and reusable

### For Developers

- Use CSS variables for all colors
- Follow component prop interfaces
- Test all states (hover, active, disabled, error)
- Implement keyboard navigation
- Add ARIA labels where needed
- Follow responsive breakpoints
- Use semantic HTML

### For QA

- Test all interactive states
- Verify keyboard navigation
- Check screen reader compatibility
- Test on target devices
- Verify color contrast
- Check touch target sizes
- Test loading and error states
