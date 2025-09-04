import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default {
  title: 'UI/Card',
  component: Card,
} as ComponentMeta<typeof Card>;

const Template: ComponentStory<typeof Card> = (args) => (
    <Card {...args}>
        <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
            <p>Card Content</p>
        </CardContent>
        <CardFooter>
            <Button>Learn More</Button>
        </CardFooter>
    </Card>
);

export const Default = Template.bind({});
Default.args = {};