# Agricultural Data Collection App - UI Design Specification

## Overview

This document defines the complete UI system for a React Native/Expo agricultural data collection application. The design prioritizes accessibility, user satisfaction through the Peak-End Rule, and visual consistency using the 60-30-10 rule.

---

## 1. Typography System (60-30-10 Rule)

The typography hierarchy follows the 60-30-10 distribution rule to create clear visual hierarchy and comfortable reading experience.

### Typography Distribution

| Tier | Percentage | Usage | Examples |
|------|------------|-------|----------|
| Primary | 60% | Body text, descriptions, content | Field descriptions, capture notes, instructions |
| Secondary | 30% | Labels, metadata, supporting info | Form labels, timestamps, status indicators |
| Accent | 10% | Headers, CTAs, emphasis | Screen titles, action buttons, alerts |

### Font Specifications

#### Primary Text (60%)
```javascript
export const primaryText = {
  fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
  fontSize: 16,
  lineHeight: 24,           // 1.5x multiplier for readability
  fontWeight: '400',        // Regular
  color: '#212121',         // Primary text color
  letterSpacing: 0.15,
};

// Variant: Primary Small
export const primaryTextSmall = {
  ...primaryText,
  fontSize: 14,
  lineHeight: 20,
};
```

#### Secondary Text (30%)
```javascript
export const secondaryText = {
  fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
  fontSize: 14,
  lineHeight: 20,           // 1.43x multiplier
  fontWeight: '400',        // Regular
  color: '#757575',         // Secondary text color
  letterSpacing: 0.25,
};

// Variant: Secondary Small (metadata)
export const secondaryTextSmall = {
  ...secondaryText,
  fontSize: 12,
  lineHeight: 16,
  color: '#9E9E9E',
};

// Variant: Labels
export const labelText = {
  ...secondaryText,
  fontSize: 12,
  lineHeight: 16,
  fontWeight: '500',        // Medium weight for labels
  letterSpacing: 0.4,
  textTransform: 'uppercase',
};
```

#### Accent Text (10%)
```javascript
// Screen Headers (H1)
export const headerH1 = {
  fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
  fontSize: 28,
  lineHeight: 36,
  fontWeight: '700',        // Bold
  color: '#1B5E20',         // Dark green for headers
  letterSpacing: 0,
};

// Section Headers (H2)
export const headerH2 = {
  fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
  fontSize: 22,
  lineHeight: 28,
  fontWeight: '600',        // Semi-bold
  color: '#2E7D32',         // Accessible green
  letterSpacing: 0,
};

// Card Headers (H3)
export const headerH3 = {
  fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
  fontSize: 18,
  lineHeight: 24,
  fontWeight: '600',
  color: '#212121',
  letterSpacing: 0.15,
};

// Call-to-Action Text
export const ctaText = {
  fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
  fontSize: 16,
  lineHeight: 24,
  fontWeight: '600',        // Semi-bold for emphasis
  color: '#FFFFFF',         // White on colored buttons
  letterSpacing: 0.5,
  textTransform: 'uppercase',
};

// Button Text (Secondary)
export const buttonTextSecondary = {
  ...ctaText,
  fontWeight: '500',
  color: '#2E7D32',         // Green for outlined buttons
  textTransform: 'none',
};
```

### Complete Typography Scale

| Style Name | Size | Line Height | Weight | Color | Use Case |
|------------|------|-------------|--------|-------|----------|
| `headerH1` | 28px | 36px | 700 | #1B5E20 | Screen titles |
| `headerH2` | 22px | 28px | 600 | #2E7D32 | Section headers |
| `headerH3` | 18px | 24px | 600 | #212121 | Card titles |
| `primaryText` | 16px | 24px | 400 | #212121 | Body content |
| `primaryTextSmall` | 14px | 20px | 400 | #212121 | Compact body |
| `secondaryText` | 14px | 20px | 400 | #757575 | Descriptions |
| `secondaryTextSmall` | 12px | 16px | 400 | #9E9E9E | Metadata |
| `labelText` | 12px | 16px | 500 | #757575 | Form labels |
| `ctaText` | 16px | 24px | 600 | #FFFFFF | Primary buttons |
| `buttonTextSecondary` | 16px | 24px | 500 | #2E7D32 | Secondary buttons |

---

## 2. Icon System (Ionicons via @expo/vector-icons)

### Implementation

```javascript
import Ionicons from '@expo/vector-icons/Ionicons';

// Usage example
<Ionicons name="camera-outline" size={24} color="#2E7D32" />
```

### Icon Reference Table

| Function | Filled Icon | Outline Icon | Sharp Icon | Recommended |
|----------|-------------|--------------|------------|-------------|
| **Camera/Capture** | `camera` | `camera-outline` | `camera-sharp` | `camera-outline` |
| **Location/GPS** | `location` | `location-outline` | `location-sharp` | `location-outline` |
| **Crops/Leaf** | `leaf` | `leaf-outline` | `leaf-sharp` | `leaf-outline` |
| **Export/Share** | `share` | `share-outline` | `share-sharp` | `share-outline` |
| **Settings** | `settings` | `settings-outline` | `settings-sharp` | `settings-outline` |
| **Delete/Trash** | `trash` | `trash-outline` | `trash-sharp` | `trash-outline` |
| **Checkmark** | `checkmark-circle` | `checkmark-circle-outline` | `checkmark-circle-sharp` | `checkmark-circle` |
| **Retry/Refresh** | `refresh` | `refresh-outline` | `refresh-sharp` | `refresh` |
| **Home** | `home` | `home-outline` | `home-sharp` | `home-outline` |
| **List/Review** | `list` | `list-outline` | `list-sharp` | `list-outline` |

### Additional Useful Icons for Agriculture App

| Function | Icon Name | Alternative |
|----------|-----------|-------------|
| **Add/New** | `add-circle-outline` | `add` |
| **Edit** | `create-outline` | `pencil` |
| **Save** | `save-outline` | `checkmark` |
| **Back** | `arrow-back` | `chevron-back` |
| **Forward** | `arrow-forward` | `chevron-forward` |
| **Close** | `close` | `close-circle-outline` |
| **Menu** | `menu` | `ellipsis-horizontal` |
| **Search** | `search-outline` | `search` |
| **Calendar/Date** | `calendar-outline` | `calendar` |
| **Time** | `time-outline` | `time` |
| **Image/Photo** | `image-outline` | `images-outline` |
| **Crop Type** | `nutrition-outline` | `leaf-outline` |
| **Weather** | `partly-sunny-outline` | `cloudy-outline` |
| **Water/Irrigation** | `water-outline` | `water` |
| **Warning** | `warning-outline` | `alert-circle-outline` |
| **Info** | `information-circle-outline` | `information` |
| **Success** | `checkmark-done` | `checkmark-circle` |
| **Error** | `close-circle` | `alert-circle` |

### Icon Sizing Standards

```javascript
export const iconSizes = {
  small: 16,      // Inline with text, metadata
  medium: 24,     // Standard UI elements, buttons
  large: 32,      // Tab bar, prominent actions
  xlarge: 48,     // Feature icons, empty states
  xxlarge: 64,    // Splash screens, onboarding
};
```

### Icon Color States

```javascript
export const iconColors = {
  primary: '#2E7D32',       // Active/selected state
  secondary: '#757575',     // Default/inactive state
  disabled: '#BDBDBD',      // Disabled state
  onPrimary: '#FFFFFF',     // On colored backgrounds
  error: '#D32F2F',         // Error/destructive actions
  success: '#388E3C',       // Success states
  warning: '#F57C00',       // Warning states
};
```

---

## 3. Peak-End Rule UX Design

### Understanding the Peak-End Rule

The Peak-End Rule, discovered by Nobel laureate Daniel Kahneman, states that people judge experiences based on:
1. **Peak Moments**: The most emotionally intense points (positive or negative)
2. **End Moments**: How the experience concludes

Users remember these moments disproportionately, not the average of the entire experience.

### Application to Agricultural Data Capture Flow

#### User Journey Map

```
[Home] -> [Select Capture Type] -> [Camera] -> [GPS Location] -> [Add Details] -> [Review] -> [Save] -> [Confirmation]
            |                        |           |                |               |          |         |
            |                       PEAK 1      PEAK 2            |              PEAK 3      |        END
            |                                                     |                          |
            Standard                                           Standard                    PEAK 4
```

### Peak Moments Design

#### PEAK 1: Camera Shot (Capture Success)
**Emotional Goal**: Excitement, accomplishment, "I got it!"

**Visual Feedback**:
```javascript
// Camera capture success animation
const captureSuccessAnimation = {
  // Flash effect
  flashOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    duration: 150,
    easing: 'ease-out',
  },
  // Checkmark animation
  checkmark: {
    icon: 'checkmark-circle',
    color: '#4CAF50',
    size: 64,
    animation: 'scale-bounce',
    duration: 400,
  },
  // Border pulse
  imageBorder: {
    borderColor: '#4CAF50',
    borderWidth: 3,
    animation: 'pulse',
    duration: 600,
  },
};
```

**Haptic Feedback**:
```javascript
import * as Haptics from 'expo-haptics';

// On successful capture
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
```

**Sound (Optional)**:
- Subtle camera shutter sound (system default)
- Brief success chime (user-configurable)

#### PEAK 2: GPS Lock Acquired
**Emotional Goal**: Confidence, precision, "Location confirmed"

**Visual Feedback**:
```javascript
const gpsLockAnimation = {
  // Location pin animation
  locationPin: {
    icon: 'location',
    animation: 'drop-bounce',
    color: '#2E7D32',
    duration: 500,
  },
  // Accuracy ring
  accuracyRing: {
    animation: 'pulse-shrink',
    color: 'rgba(76, 175, 80, 0.3)',
    duration: 800,
  },
  // Coordinates fade-in
  coordinatesText: {
    animation: 'fade-slide-up',
    duration: 300,
    delay: 200,
  },
};
```

**Haptic Feedback**:
```javascript
// On GPS lock
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
```

#### PEAK 3: Review Screen (Data Validation)
**Emotional Goal**: Satisfaction, completeness, "Everything looks good"

**Visual Feedback**:
```javascript
const reviewScreenDesign = {
  // Summary card
  card: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  // Image thumbnail
  thumbnail: {
    borderRadius: 8,
    animation: 'subtle-zoom',
    duration: 300,
  },
  // Validation checkmarks
  validationItems: {
    icon: 'checkmark-circle',
    color: '#4CAF50',
    animation: 'stagger-fade-in',
    staggerDelay: 100,
  },
};
```

#### PEAK 4: Save Success
**Emotional Goal**: Achievement, completion, "It's saved!"

**Visual Feedback**:
```javascript
const saveSuccessAnimation = {
  // Full-screen success overlay (brief)
  overlay: {
    backgroundColor: 'rgba(76, 175, 80, 0.95)',
    duration: 1500,
  },
  // Large checkmark with circle
  successIcon: {
    icon: 'checkmark-circle',
    size: 96,
    color: '#FFFFFF',
    animation: 'scale-bounce-rotate',
    duration: 600,
  },
  // "Saved!" text
  successText: {
    text: 'Saved Successfully!',
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    animation: 'fade-slide-up',
    delay: 200,
  },
};
```

**Haptic Feedback**:
```javascript
// Strong success haptic
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
```

### End Moment Design

#### Confirmation Screen (The "End")
**Emotional Goal**: Satisfaction, closure, accomplishment, "Job well done"

**Design Principles**:
1. Clear visual hierarchy showing what was accomplished
2. Positive reinforcement messaging
3. Easy path to next action
4. Summary of captured data

**Screen Layout**:
```javascript
const confirmationScreen = {
  // Header
  header: {
    icon: 'checkmark-done',
    iconSize: 64,
    iconColor: '#4CAF50',
    title: 'Capture Complete!',
    subtitle: 'Your field data has been saved',
  },

  // Capture summary card
  summaryCard: {
    backgroundColor: '#F1F8E9',  // Light green tint
    borderRadius: 12,
    padding: 16,
    elements: [
      { label: 'Photo', icon: 'image', status: 'saved' },
      { label: 'Location', icon: 'location', status: 'recorded' },
      { label: 'Crop Type', icon: 'leaf', status: 'identified' },
      { label: 'Timestamp', icon: 'time', status: 'logged' },
    ],
  },

  // Statistics (gamification element)
  stats: {
    todayCount: 12,
    totalCount: 847,
    message: "You've captured 12 entries today!",
  },

  // Action buttons
  actions: {
    primary: {
      text: 'Capture Another',
      icon: 'camera-outline',
      color: '#4CAF50',
    },
    secondary: {
      text: 'View All Captures',
      icon: 'list-outline',
      color: '#757575',
    },
    tertiary: {
      text: 'Return Home',
      icon: 'home-outline',
    },
  },
};
```

**Animation Sequence**:
```javascript
const confirmationAnimationSequence = [
  { element: 'icon', animation: 'scale-bounce', duration: 500, delay: 0 },
  { element: 'title', animation: 'fade-slide-up', duration: 300, delay: 200 },
  { element: 'subtitle', animation: 'fade-slide-up', duration: 300, delay: 300 },
  { element: 'summaryCard', animation: 'fade-slide-up', duration: 400, delay: 400 },
  { element: 'stats', animation: 'fade-in', duration: 300, delay: 600 },
  { element: 'actions', animation: 'stagger-fade-in', duration: 300, delay: 800 },
];
```

### Negative Peak Prevention

To avoid creating negative peak memories, address these pain points:

| Pain Point | Prevention Strategy |
|------------|---------------------|
| **Camera failure** | Clear error message + immediate retry option |
| **GPS timeout** | Progress indicator + manual entry fallback |
| **Save failure** | Auto-retry + offline queue + clear status |
| **Data loss** | Auto-save drafts + recovery options |
| **Slow loading** | Skeleton screens + progress feedback |

### Haptic Feedback Summary

```javascript
// Expo Haptics implementation
import * as Haptics from 'expo-haptics';

export const hapticPatterns = {
  // Success actions
  captureSuccess: () => Haptics.notificationAsync(
    Haptics.NotificationFeedbackType.Success
  ),
  saveSuccess: () => Haptics.notificationAsync(
    Haptics.NotificationFeedbackType.Success
  ),

  // Feedback actions
  buttonPress: () => Haptics.impactAsync(
    Haptics.ImpactFeedbackStyle.Light
  ),
  gpsLock: () => Haptics.impactAsync(
    Haptics.ImpactFeedbackStyle.Medium
  ),

  // Selection changes
  selection: () => Haptics.selectionAsync(),

  // Warnings/Errors
  warning: () => Haptics.notificationAsync(
    Haptics.NotificationFeedbackType.Warning
  ),
  error: () => Haptics.notificationAsync(
    Haptics.NotificationFeedbackType.Error
  ),

  // Destructive actions
  delete: () => Haptics.impactAsync(
    Haptics.ImpactFeedbackStyle.Heavy
  ),
};
```

---

## 4. Color Palette

### Primary Palette

Based on the requested primary color #4CAF50 with accessibility considerations.

#### Core Colors

```javascript
export const colors = {
  // Primary Green (Brand)
  primary: {
    main: '#4CAF50',          // Material Green 500 - Use for backgrounds, large areas
    light: '#81C784',         // Material Green 300 - Hover states, highlights
    dark: '#2E7D32',          // Material Green 800 - Text on white (WCAG AA)
    darker: '#1B5E20',        // Material Green 900 - Headers, high contrast
    contrast: '#FFFFFF',      // Text on primary backgrounds
  },

  // Secondary (Earth/Brown Tones for Agriculture)
  secondary: {
    main: '#795548',          // Brown 500 - Earthy accent
    light: '#A1887F',         // Brown 300 - Subtle accents
    dark: '#5D4037',          // Brown 700 - Dark accents
    contrast: '#FFFFFF',
  },

  // Background Colors
  background: {
    primary: '#FFFFFF',       // Main background
    secondary: '#FAFAFA',     // Card backgrounds, sections
    tertiary: '#F5F5F5',      // Input fields, disabled areas
    surface: '#FFFFFF',       // Elevated surfaces
    greenTint: '#F1F8E9',     // Success states, highlights (Green 50)
  },

  // Text Colors
  text: {
    primary: '#212121',       // Primary text (87% opacity equiv)
    secondary: '#757575',     // Secondary text (54% opacity equiv)
    tertiary: '#9E9E9E',      // Disabled, hints (38% opacity equiv)
    disabled: '#BDBDBD',      // Disabled text
    inverse: '#FFFFFF',       // Text on dark/colored backgrounds
    link: '#2E7D32',          // Link text (accessible green)
  },

  // Semantic Colors
  success: {
    main: '#388E3C',          // Green 700 - Success states
    light: '#A5D6A7',         // Green 200 - Success backgrounds
    dark: '#1B5E20',          // Green 900 - Success emphasis
    background: '#E8F5E9',    // Green 50 - Success containers
  },

  error: {
    main: '#D32F2F',          // Red 700 - Error states
    light: '#EF9A9A',         // Red 200 - Error backgrounds
    dark: '#B71C1C',          // Red 900 - Error emphasis
    background: '#FFEBEE',    // Red 50 - Error containers
  },

  warning: {
    main: '#F57C00',          // Orange 700 - Warning states
    light: '#FFCC80',         // Orange 200 - Warning backgrounds
    dark: '#E65100',          // Orange 900 - Warning emphasis
    background: '#FFF3E0',    // Orange 50 - Warning containers
  },

  info: {
    main: '#1976D2',          // Blue 700 - Info states
    light: '#90CAF9',         // Blue 200 - Info backgrounds
    dark: '#0D47A1',          // Blue 900 - Info emphasis
    background: '#E3F2FD',    // Blue 50 - Info containers
  },

  // Neutral/Gray Scale
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Dividers & Borders
  divider: {
    light: '#E0E0E0',         // Standard dividers
    dark: '#BDBDBD',          // Emphasis dividers
  },

  // Overlay Colors
  overlay: {
    light: 'rgba(255, 255, 255, 0.8)',
    dark: 'rgba(0, 0, 0, 0.5)',
    success: 'rgba(76, 175, 80, 0.95)',
  },
};
```

### Accessibility Contrast Ratios

| Foreground | Background | Ratio | WCAG AA | WCAG AAA | Use Case |
|------------|------------|-------|---------|----------|----------|
| #212121 | #FFFFFF | 16.1:1 | Pass | Pass | Primary text on white |
| #757575 | #FFFFFF | 4.6:1 | Pass | Fail | Secondary text on white |
| #2E7D32 | #FFFFFF | 5.1:1 | Pass | Fail | Green text/links on white |
| #1B5E20 | #FFFFFF | 8.2:1 | Pass | Pass | Headers on white |
| #FFFFFF | #4CAF50 | 2.4:1 | Fail | Fail | White text on primary (use dark) |
| #FFFFFF | #2E7D32 | 5.1:1 | Pass | Fail | White text on dark green |
| #FFFFFF | #1B5E20 | 8.2:1 | Pass | Pass | White text on darker green |
| #212121 | #4CAF50 | 6.7:1 | Pass | Fail | Dark text on primary green |
| #D32F2F | #FFFFFF | 4.9:1 | Pass | Fail | Error text on white |
| #FFFFFF | #D32F2F | 4.9:1 | Pass | Fail | White text on error |

### Color Usage Guidelines

#### Primary Color (#4CAF50) Usage

**DO USE for**:
- Large background areas with dark text (#212121)
- Icon fills on white backgrounds
- Progress indicators
- Success states (combined with darker variants)
- Borders and accents

**DO NOT USE for**:
- White text on #4CAF50 background (fails WCAG)
- Small text elements
- Critical action buttons (use #2E7D32 instead)

#### Accessible Primary Button

```javascript
export const primaryButton = {
  backgroundColor: '#2E7D32',  // Dark green (passes WCAG AA)
  textColor: '#FFFFFF',
  pressedBackgroundColor: '#1B5E20',
  disabledBackgroundColor: '#A5D6A7',
  disabledTextColor: '#757575',
};
```

### 60-30-10 Color Application

```javascript
export const colorDistribution = {
  // 60% - Dominant (Backgrounds, large areas)
  dominant: {
    colors: ['#FFFFFF', '#FAFAFA', '#F5F5F5'],
    usage: 'Page backgrounds, card backgrounds, content areas',
  },

  // 30% - Secondary (Supporting elements)
  secondary: {
    colors: ['#E0E0E0', '#757575', '#F1F8E9'],
    usage: 'Borders, secondary text, dividers, subtle highlights',
  },

  // 10% - Accent (Action items, emphasis)
  accent: {
    colors: ['#4CAF50', '#2E7D32', '#1B5E20'],
    usage: 'Buttons, icons, headers, links, active states',
  },
};
```

### Dark Mode Palette (Future Implementation)

```javascript
export const darkModeColors = {
  primary: {
    main: '#81C784',          // Lighter green for dark mode
    dark: '#4CAF50',
    contrast: '#000000',
  },

  background: {
    primary: '#121212',
    secondary: '#1E1E1E',
    tertiary: '#2C2C2C',
    surface: '#1E1E1E',
  },

  text: {
    primary: '#FFFFFF',
    secondary: '#B0B0B0',
    tertiary: '#757575',
  },
};
```

---

## 5. Component Specifications

### Buttons

```javascript
export const buttonStyles = {
  // Primary CTA Button
  primary: {
    backgroundColor: colors.primary.dark,   // #2E7D32
    textColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    minHeight: 48,                          // Touch target
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    pressed: {
      backgroundColor: '#1B5E20',
      elevation: 4,
    },
    disabled: {
      backgroundColor: '#A5D6A7',
      textColor: '#757575',
    },
  },

  // Secondary/Outlined Button
  secondary: {
    backgroundColor: 'transparent',
    textColor: colors.primary.dark,
    borderWidth: 2,
    borderColor: colors.primary.dark,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,

    pressed: {
      backgroundColor: 'rgba(46, 125, 50, 0.1)',
    },
    disabled: {
      borderColor: '#BDBDBD',
      textColor: '#BDBDBD',
    },
  },

  // Text/Ghost Button
  text: {
    backgroundColor: 'transparent',
    textColor: colors.primary.dark,
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 40,

    pressed: {
      backgroundColor: 'rgba(46, 125, 50, 0.1)',
    },
  },

  // Destructive Button
  destructive: {
    backgroundColor: colors.error.main,
    textColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    minHeight: 48,

    pressed: {
      backgroundColor: colors.error.dark,
    },
  },

  // Floating Action Button (Capture)
  fab: {
    backgroundColor: colors.primary.dark,
    size: 64,
    borderRadius: 32,
    elevation: 6,
    iconSize: 28,
    iconColor: '#FFFFFF',

    pressed: {
      backgroundColor: '#1B5E20',
      elevation: 8,
    },
  },
};
```

### Cards

```javascript
export const cardStyles = {
  // Standard Card
  standard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  // Capture Card (with image)
  capture: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3,

    image: {
      height: 180,
      width: '100%',
    },
    content: {
      padding: 16,
    },
  },

  // Success Card
  success: {
    backgroundColor: '#F1F8E9',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
  },
};
```

### Input Fields

```javascript
export const inputStyles = {
  // Standard Text Input
  standard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 48,
    fontSize: 16,
    color: '#212121',

    focused: {
      borderColor: '#4CAF50',
      borderWidth: 2,
    },
    error: {
      borderColor: '#D32F2F',
      borderWidth: 2,
    },
  },

  // Label
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#757575',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  // Helper/Error Text
  helper: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#D32F2F',
    marginTop: 4,
  },
};
```

---

## 6. Spacing System

```javascript
export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};
```

---

## 7. Animation Specifications

### Reanimated Configuration

```javascript
import { withSpring, withTiming, withSequence, withDelay } from 'react-native-reanimated';

export const animationConfigs = {
  // Spring animations (bouncy, organic feel)
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },

  // Quick spring (snappy)
  springQuick: {
    damping: 20,
    stiffness: 300,
  },

  // Timing animations
  timing: {
    fast: 150,
    normal: 300,
    slow: 500,
  },

  // Easing functions
  easing: {
    enter: 'ease-out',
    exit: 'ease-in',
    move: 'ease-in-out',
  },
};

// Success checkmark animation
export const successCheckAnimation = {
  initial: { scale: 0, opacity: 0 },
  animate: withSpring(
    { scale: 1, opacity: 1 },
    { damping: 12, stiffness: 200 }
  ),
  duration: 400,
};
```

### Lottie Animation Assets (Recommended)

| Animation | Use Case | Duration | Source |
|-----------|----------|----------|--------|
| Success Checkmark | Save completion | 1.5s | LottieFiles |
| Camera Flash | Photo capture | 0.3s | Custom |
| Location Pin Drop | GPS lock | 0.8s | LottieFiles |
| Loading Spinner | Data sync | Loop | LottieFiles |
| Empty State | No captures | Loop | LottieFiles |

---

## 8. Implementation Checklist

### Typography
- [ ] Create `theme/typography.ts` with all text styles
- [ ] Create `Text` component wrapper with variant prop
- [ ] Test font scaling with system accessibility settings

### Icons
- [ ] Install `@expo/vector-icons` (default with Expo)
- [ ] Create `Icon` component wrapper with size presets
- [ ] Create icon reference documentation for team

### Colors
- [ ] Create `theme/colors.ts` with full palette
- [ ] Implement dark mode toggle (future)
- [ ] Test all color combinations with contrast checker

### Haptics
- [ ] Install `expo-haptics`
- [ ] Create `haptics.ts` utility with named patterns
- [ ] Add user preference to enable/disable haptics

### Animations
- [ ] Install `react-native-reanimated`
- [ ] Create animation presets
- [ ] Consider `lottie-react-native` for complex animations

### Peak-End UX
- [ ] Implement camera success feedback
- [ ] Implement GPS lock feedback
- [ ] Design and build confirmation screen
- [ ] Add haptic feedback to all peak moments
- [ ] User test the emotional journey

---

## 9. Sources and References

### Expo/React Native Documentation
- [Expo Vector Icons Guide](https://docs.expo.dev/guides/icons/)
- [Expo Haptics Documentation](https://docs.expo.dev/versions/latest/sdk/haptics/)
- [Expo Reanimated Documentation](https://docs.expo.dev/versions/latest/sdk/reanimated/)
- [React Native Text Documentation](https://reactnative.dev/docs/text)

### Icon Resources
- [Ionicons Official Site](https://ionic.io/ionicons)
- [@expo/vector-icons Directory](https://icons.expo.fyi/)

### UX Research
- [Peak-End Rule - Laws of UX](https://lawsofux.com/peak-end-rule/)
- [Peak-End Rule - Nielsen Norman Group](https://www.nngroup.com/articles/peak-end-rule/)
- [60-30-10 Rule in UI Design - LogRocket](https://blog.logrocket.com/ux-design/60-30-10-rule/)

### Accessibility
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WCAG 2.1 Contrast Requirements](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [WebAIM Contrast and Color Accessibility](https://webaim.org/articles/contrast/)

### Color and Design
- [Material Design Color System](https://material.io/design/color/)
- [Agriculture Color Palettes - Octet Design](https://octet.design/colors/industry-specific/agriculture/)

---

*Document Version: 1.0*
*Last Updated: January 2026*
*For: Agricultural Data Collection App - React Native/Expo*
