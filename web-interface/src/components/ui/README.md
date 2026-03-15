# UI Components Library

A collection of reusable UI components with Apple/Airbnb aesthetic, built with React and Tailwind CSS.

## Design Principles

- **Clean & Minimal**: Inspired by Apple and Airbnb design systems
- **Inter Font**: Consistent typography throughout
- **Accessibility First**: Proper ARIA labels, keyboard navigation, and focus states
- **Smooth Interactions**: 200ms transitions and subtle hover effects
- **Consistent Spacing**: Using Tailwind's spacing scale
- **Focus States**: Blue ring with offset for clear keyboard navigation

## Components

### Button

Primary, secondary, ghost, danger, and outline button variants with multiple sizes.

```jsx
import { Button } from '@/components/ui';

// Basic usage
<Button onClick={handleClick}>Click Me</Button>

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button variant="outline">Outline</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Disabled state
<Button disabled>Disabled</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `disabled`: boolean
- `onClick`: function
- `type`: 'button' | 'submit' | 'reset' (default: 'button')
- `className`: string

---

### Card

Clean card component with shadow and hover effects.

```jsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui';

// Basic usage
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>

// With subcomponents
<Card hoverable>
  <CardHeader>
    <CardTitle>Dashboard Stats</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Your content here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Custom padding
<Card padding="none">...</Card>
<Card padding="sm">...</Card>
<Card padding="lg">...</Card>
```

**Props:**
- `hoverable`: boolean - Adds hover lift effect
- `padding`: 'none' | 'sm' | 'default' | 'lg' (default: 'default')
- `className`: string

---

### Input

Text input and search input components with label, error, and icon support.

```jsx
import { Input, SearchInput } from '@/components/ui';

// Basic input
<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
/>

// With error
<Input
  label="Password"
  type="password"
  error="Password is required"
/>

// With helper text
<Input
  label="Username"
  helperText="Choose a unique username"
/>

// With icons
<Input
  leftIcon={<SearchIcon />}
  placeholder="Search..."
/>

// Search input
<SearchInput
  placeholder="Search projects..."
  onSearch={(value) => console.log(value)}
/>
```

**Props:**
- `label`: string
- `type`: string (default: 'text')
- `error`: string
- `helperText`: string
- `leftIcon`: ReactNode
- `rightIcon`: ReactNode
- `disabled`: boolean
- `className`: string
- `containerClassName`: string

---

### Badge

Status badges with variants for priority levels and states.

```jsx
import { Badge, PriorityBadge, StatusBadge } from '@/components/ui';

// Basic badges
<Badge>Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="info">Info</Badge>

// With dot indicator
<Badge variant="success" dot>Active</Badge>

// Priority badges
<PriorityBadge priority={1} /> {/* Low */}
<PriorityBadge priority={2} /> {/* Medium */}
<PriorityBadge priority={3} /> {/* High */}
<PriorityBadge priority={4} /> {/* Critical */}

// Status badges
<StatusBadge status="active" />
<StatusBadge status="pending" />
<StatusBadge status="completed" />
<StatusBadge status="inactive" />

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

**Props:**
- `variant`: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'low' | 'medium' | 'high' | 'critical' | 'active' | 'inactive' | 'pending' | 'completed'
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `dot`: boolean - Shows colored dot indicator
- `className`: string

---

### Modal

Clean modal dialog with focus trap and accessibility features.

```jsx
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui';

const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  size="md"
>
  <ModalBody>
    <p>Are you sure you want to proceed?</p>
  </ModalBody>
  <ModalFooter>
    <Button variant="ghost" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleConfirm}>
      Confirm
    </Button>
  </ModalFooter>
</Modal>
```

**Props:**
- `isOpen`: boolean (required)
- `onClose`: function (required)
- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full' (default: 'md')
- `showCloseButton`: boolean (default: true)
- `closeOnOutsideClick`: boolean (default: true)
- `closeOnEscape`: boolean (default: true)
- `className`: string

**Features:**
- Focus trap (keyboard navigation contained within modal)
- Escape key to close
- Click outside to close
- Body scroll lock when open
- Smooth animations

---

### Toast

Success/error notifications with provider pattern.

```jsx
import { ToastProvider, useToast } from '@/components/ui';

// 1. Wrap your app with ToastProvider
function App() {
  return (
    <ToastProvider>
      <YourApp />
    </ToastProvider>
  );
}

// 2. Use toast in your components
function MyComponent() {
  const { addToast } = useToast();

  const handleSuccess = () => {
    addToast('Operation successful!', 'success', 3000);
  };

  const handleError = () => {
    addToast('Something went wrong', 'error', 3000);
  };

  const handleWarning = () => {
    addToast('Warning message', 'warning', 3000);
  };

  const handleInfo = () => {
    addToast('Info message', 'info', 3000);
  };

  return (
    <div>
      <Button onClick={handleSuccess}>Show Success</Button>
      <Button onClick={handleError}>Show Error</Button>
    </div>
  );
}
```

**API:**
- `addToast(message, type, duration)`: Add a new toast notification
  - `message`: string (required)
  - `type`: 'success' | 'error' | 'warning' | 'info' (default: 'info')
  - `duration`: number in milliseconds (default: 3000, 0 = no auto-dismiss)
- `removeToast(id)`: Manually remove a toast

---

### Breadcrumb

Navigation breadcrumb with arrow or slash separators.

```jsx
import { Breadcrumb, BreadcrumbSlash } from '@/components/ui';

// Arrow separator (default)
<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'Current Project' }
  ]}
/>

// Slash separator
<BreadcrumbSlash
  items={[
    { label: 'Home', href: '/' },
    { label: 'Settings', href: '/settings' },
    { label: 'Profile' }
  ]}
/>

// With onClick handlers
<Breadcrumb
  items={[
    { label: 'Home', onClick: () => navigate('/') },
    { label: 'Current Page' }
  ]}
/>
```

**Props:**
- `items`: array of objects (required)
  - `label`: string (required)
  - `href`: string (for Link navigation)
  - `onClick`: function (for custom navigation)
- `className`: string

---

### Header

App header with navigation and mobile menu.

```jsx
import { Header, SimpleHeader, HeaderWithSearch } from '@/components/ui';

// Full header with navigation
<Header
  title="AgriCapture"
  logo="/logo.png"
  navigation={[
    { label: 'Dashboard', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'Reports', href: '/reports' }
  ]}
  rightContent={
    <>
      <Button variant="ghost">Sign In</Button>
      <Button>Sign Up</Button>
    </>
  }
  sticky
/>

// Simple header
<SimpleHeader
  title="Dashboard"
  leftContent={<BackButton />}
  rightContent={<UserMenu />}
/>

// Header with search
<HeaderWithSearch
  title="Projects"
  searchPlaceholder="Search projects..."
  onSearch={(value) => console.log(value)}
  navigation={[
    { label: 'All', href: '/projects' },
    { label: 'Active', href: '/projects/active' }
  ]}
  rightContent={<Button>New Project</Button>}
/>
```

**Props:**
- `title`: string
- `logo`: string (URL) or ReactNode
- `navigation`: array of { label, href }
- `rightContent`: ReactNode
- `sticky`: boolean (default: true)
- `className`: string

**Features:**
- Responsive mobile menu
- Active route highlighting
- Sticky header option
- Search integration variant

---

## Usage Examples

### Complete Form

```jsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Input, Button } from '@/components/ui';

function LoginForm() {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Sign In</Button>
      </CardFooter>
    </Card>
  );
}
```

### Dashboard Layout

```jsx
import { Header, Card, Badge, Button } from '@/components/ui';

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="AgriCapture"
        navigation={[
          { label: 'Dashboard', href: '/' },
          { label: 'Projects', href: '/projects' }
        ]}
        rightContent={<Button>New Project</Button>}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverable>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Projects</p>
                <p className="text-3xl font-bold mt-2">24</p>
              </div>
              <Badge variant="success" dot>Active</Badge>
            </div>
          </Card>
          {/* More cards... */}
        </div>
      </main>
    </div>
  );
}
```

## Customization

All components accept a `className` prop for custom styling:

```jsx
<Button className="w-full mt-4">
  Full Width Button
</Button>

<Card className="border-2 border-emerald-500">
  Custom Border Card
</Card>
```

## Accessibility

All components include:
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus states with visible rings
- Screen reader friendly markup
- Semantic HTML elements

## Font Setup

Ensure Inter font is loaded in your project. Add to your main CSS:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}
```

Or in Tailwind config:

```js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
}
```
