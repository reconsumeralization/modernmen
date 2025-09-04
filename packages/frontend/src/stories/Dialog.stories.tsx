import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/Dialog';
import { Button } from '../../components/ui/Button';

export default {
  title: 'UI/Dialog',
  component: Dialog,
} as ComponentMeta<typeof Dialog>;

const Template: ComponentStory<typeof Dialog> = (args) => (
    <Dialog {...args}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>
                    This is a dialog description.
                </DialogDescription>
            </DialogHeader>
            <p>This is the dialog content.</p>
        </DialogContent>
    </Dialog>
);

export const Default = Template.bind({});
Default.args = {
    open: true,
};