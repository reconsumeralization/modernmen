import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Alert, AlertTitle, AlertDescription } from '../../components/ui/Alert';

export default {
  title: 'UI/Alert',
  component: Alert,
} as ComponentMeta<typeof Alert>;

const Template: ComponentStory<typeof Alert> = (args) => (
    <Alert {...args}>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
            You can add components to your app using the cli.
        </AlertDescription>
    </Alert>
);

export const Default = Template.bind({});
Default.args = {
  variant: 'default',
};

export const Destructive = Template.bind({});
Destructive.args = {
    variant: 'destructive',
};

export const Secondary = Template.bind({});
Secondary.args = {
    variant: 'secondary',
};