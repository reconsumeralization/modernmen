import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Alert, AlertTitle, AlertDescription } from '../../components/ui/alert';

const meta = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryFn<typeof Alert>;

const Template: Story = (args: React.JSX.IntrinsicAttributes) => (
    <Alert {...args}>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
            You can add components to your app using the cli.
        </AlertDescription>
    </Alert>
);

export const Default: Story = {
  args: {
    variant: 'default',
  },
  render: Template,
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
  },
  render: Template,
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
  render: Template,
};