import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/Avatar';

export default {
  title: 'UI/Avatar',
  component: Avatar,
} as ComponentMeta<typeof Avatar>;

const Template: ComponentStory<typeof Avatar> = (args) => (
    <Avatar {...args}>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
    </Avatar>
);

export const Default = Template.bind({});
Default.args = {};