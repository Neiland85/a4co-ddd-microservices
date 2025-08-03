import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'success', 'ghost', 'outline'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    isLoading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// Historia por defecto
export const Default: Story = {
  args: {
    children: 'Button',
  },
}

// Variantes
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
}

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger Button',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success Button',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
}

// Tamaños
export const Small: Story = {
  args: {
    size: 'small',
    children: 'Small Button',
  },
}

export const Medium: Story = {
  args: {
    size: 'medium',
    children: 'Medium Button',
  },
}

export const Large: Story = {
  args: {
    size: 'large',
    children: 'Large Button',
  },
}

// Estados
export const Loading: Story = {
  args: {
    isLoading: true,
    children: 'Loading...',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
}

// Con iconos
export const WithIcon: Story = {
  args: {
    children: 'Download',
    leftIcon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
  },
}

export const WithRightIcon: Story = {
  args: {
    children: 'Next',
    rightIcon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    ),
  },
}

// Full width
export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Full Width Button',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
}

// Grupo de botones
export const ButtonGroup: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="primary">Save</Button>
      <Button variant="outline">Cancel</Button>
    </div>
  ),
}