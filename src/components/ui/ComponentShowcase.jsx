import { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Input,
  SearchInput,
  Badge,
  PriorityBadge,
  StatusBadge,
  Modal,
  ModalBody,
  ModalFooter,
  useToast,
  Breadcrumb,
  BreadcrumbSlash,
  Header
} from './index';

/**
 * Component Showcase - Demo of all UI components
 * This file demonstrates how to use each UI component
 */
export default function ComponentShowcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { addToast } = useToast();

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Components', href: '/components' },
    { label: 'Showcase' }
  ];

  const navigation = [
    { label: 'Showcase', href: '/showcase' },
    { label: 'Documentation', href: '/docs' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        title="UI Components"
        navigation={navigation}
        rightContent={
          <Button size="sm" variant="primary">
            Get Started
          </Button>
        }
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Component Showcase
        </h1>

        <div className="space-y-12">
          {/* Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="outline">Outline</Button>
                  <Button disabled>Disabled</Button>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-w-md">
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  helperText="Must be at least 8 characters"
                />

                <Input
                  label="Error State"
                  error="This field is required"
                />

                <SearchInput
                  placeholder="Search components..."
                  onSearch={setSearchValue}
                />
                {searchValue && (
                  <p className="text-sm text-gray-600">
                    Searching for: {searchValue}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="danger">Danger</Badge>
                  <Badge variant="info">Info</Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="success" dot>With Dot</Badge>
                  <Badge variant="warning" dot>Warning</Badge>
                  <Badge variant="danger" dot>Error</Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                  <PriorityBadge priority={1} />
                  <PriorityBadge priority={2} />
                  <PriorityBadge priority={3} />
                  <PriorityBadge priority={4} />
                </div>

                <div className="flex flex-wrap gap-2">
                  <StatusBadge status="active" />
                  <StatusBadge status="pending" />
                  <StatusBadge status="completed" />
                  <StatusBadge status="inactive" />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge size="sm">Small</Badge>
                  <Badge size="md">Medium</Badge>
                  <Badge size="lg">Large</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card hoverable>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Hoverable Card
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Hover over this card to see the effect
                  </p>
                </Card>

                <Card padding="sm">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Small Padding
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Card with small padding
                  </p>
                </Card>

                <Card padding="lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Large Padding
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Card with large padding
                  </p>
                </Card>
              </div>

              <div className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Card with All Sections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      This card demonstrates all available card sections.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost">Cancel</Button>
                    <Button>Save</Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Modal & Toast */}
          <Card>
            <CardHeader>
              <CardTitle>Modal & Toast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => setModalOpen(true)}>
                  Open Modal
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => addToast('Success message!', 'success')}
                >
                  Show Success Toast
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => addToast('Error occurred!', 'error')}
                >
                  Show Error Toast
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => addToast('Warning message!', 'warning')}
                >
                  Show Warning Toast
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => addToast('Info message!', 'info')}
                >
                  Show Info Toast
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Breadcrumbs */}
          <Card>
            <CardHeader>
              <CardTitle>Breadcrumbs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Arrow Separator (default)
                  </p>
                  <Breadcrumb items={breadcrumbItems} />
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Slash Separator
                  </p>
                  <BreadcrumbSlash items={breadcrumbItems} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Modal Example */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Example Modal"
        size="md"
      >
        <ModalBody>
          <p className="text-gray-600 mb-4">
            This is an example modal dialog. It includes focus trapping,
            keyboard navigation, and can be closed by clicking outside or
            pressing Escape.
          </p>

          <Input
            label="Your Name"
            placeholder="Enter your name"
          />
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            setModalOpen(false);
            addToast('Action confirmed!', 'success');
          }}>
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
