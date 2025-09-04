import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from '../../components/ui/Button';

export default {
  title: 'UI/Button',
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Button',
  variant: 'default',
};

export const Destructive = Template.bind({});
Destructive.args = {
    children: 'Button',
    variant: 'destructive',
};

export const Outline = Template.bind({});
Outline.args = {
    children: 'Button',
    variant: 'outline',
};

export const Secondary = Template.bind({});
Secondary.args = {
    children: 'Button',
    variant: 'secondary',
};

export const Ghost = Template.bind({});
Ghost.args = {
    children: 'Button',
    variant: 'ghost',
};

export const Link = Template.bind({});
Link.args = {
    children: 'Button',
    variant: 'link',
};

export const Gradient = Template.bind({});
Gradient.args = {
    children: 'Button',
    variant: 'gradient',
};

export const Small = Template.bind({});
Small.args = {
    children: 'Button',
    size: 'sm',
};

export const Large = Template.bind({});
Large.args = {
    children: 'Button',
    size: 'lg',
};

export const ExtraLarge = Template.bind({});
ExtraLarge.args = {
    children: 'Button',
    size: 'xl',
};

export const Icon = Template.bind({});
Icon.args = {
    children: 'B',
    size: 'icon',
};