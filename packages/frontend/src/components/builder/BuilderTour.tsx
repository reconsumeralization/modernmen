
"use client"

import Joyride, { type Step } from 'react-joyride';

interface BuilderTourProps {
  run: boolean;
  onTourEnd: () => void;
}

export const BuilderTour = ({ run, onTourEnd }: BuilderTourProps) => {
  const steps: Step[] = [
    {
      target: '#tour-step-1-components',
      content: 'This is the component library. You can drag and drop these components onto the canvas to build your page.',
      disableBeacon: true,
    },
    {
      target: '#tour-step-2-canvas',
      content: 'This is the canvas. Your page comes to life here.',
    },
    {
      target: '#tour-step-3-preview-controls',
      content: 'Use these controls to preview your page on different screen sizes.',
    },
    {
        target: '#tour-step-4-properties-panel',
        content: 'When you select a component on the canvas, you can edit its properties here.',
    },
    {
      target: '#tour-step-5-save-publish',
      content: 'Once you are happy with your page, you can save it as a draft or publish it to the world.',
    },
  ];

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={({ status }) => {
        if (status === 'finished' || status === 'skipped') {
          onTourEnd();
        }
      }}
      styles={{
        options: {
          arrowColor: '#ef4444',
          backgroundColor: '#1f2937',
          overlayColor: 'rgba(0, 0, 0, 0.8)',
          primaryColor: '#ef4444',
          textColor: '#ffffff',
          zIndex: 1000,
        },
      }}
    />
  );
};
