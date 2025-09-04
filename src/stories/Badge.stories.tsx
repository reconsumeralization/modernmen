import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Badge } from '../../components/ui/Badge';

export default {
  title: 'UI/Badge',
  component: Badge,
} as ComponentMeta<typeof Badge>;

const Template: ComponentStory<typeof Badge> = (args) => <Badge {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Badge',
  variant: 'default',
};

export const Secondary = Template.bind({});
Secondary.args = {
    children: 'Badge',
    variant: 'secondary',
};

export const Destructive = Template.bind({});
Destructive.args = {
    children: 'Badge',
    variant: 'destructive',
};

export const Outline = Template.bind({});
Outline.args = {
    children: 'Badge',
    variant: 'outline',
};