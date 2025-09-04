// Storybook Stories Index
// This file exports all story configurations for the Modern Men Hair Salon UI components

// Core UI Component Stories
export { default as AlertStories } from './Alert.stories'
export { default as AvatarStories } from './Avatar.stories'
export { default as BadgeStories } from './Badge.stories'
export { default as ButtonStories } from './Button.stories'
export { default as CardStories } from './Card.stories'
export { default as CheckboxStories } from './Checkbox.stories'
export { default as DialogStories } from './Dialog.stories'
export { default as InputStories } from './Input.stories'

// TODO: Create missing story files for additional components
// export { default as LabelStories } from './Label.stories'
// export { default as SelectStories } from './Select.stories'
// export { default as SeparatorStories } from './Separator.stories'
// export { default as SliderStories } from './Slider.stories'
// export { default as SwitchStories } from './Switch.stories'
// export { default as TabsStories } from './Tabs.stories'
// export { default as TextareaStories } from './Textarea.stories'
// export { default as TooltipStories } from './Tooltip.stories'

// Layout & Navigation Stories
// TODO: Create missing story files
// export { default as CollapsibleStories } from './Collapsible.stories'
// export { default as DropdownMenuStories } from './DropdownMenu.stories'
// export { default as ScrollAreaStories } from './ScrollArea.stories'
// export { default as SheetStories } from './Sheet.stories'

// Feedback & Status Stories
// TODO: Create missing story files
// export { default as LoadingStories } from './Loading.stories'
// export { default as NotificationCenterStories } from './NotificationCenter.stories'
// export { default as ToastStories } from './Toast.stories'

// Data Display Stories
// TODO: Create missing story files
// export { default as ChartStories } from './Chart.stories'
// export { default as TestimonialsStories } from './Testimonials.stories'

// Form & Input Stories
// TODO: Create missing story files
// export { default as AdvancedSearchStories } from './AdvancedSearch.stories'
// export { default as SearchInputStories } from './SearchInput.stories'
// export { default as SearchResultsStories } from './SearchResults.stories'
// export { default as TestimonialFormStories } from './TestimonialForm.stories'

// Specialized Component Stories
// TODO: Create missing story files
// export { default as IconsStories } from './Icons.stories'
// export { default as InstagramFeedStories } from './InstagramFeed.stories'
// export { default as TeamFiltersStories } from './TeamFilters.stories'
// export { default as ThemeToggleStories } from './ThemeToggle.stories'

// Error Handling Stories
// TODO: Create missing story files
// export { default as AsyncErrorHandlerStories } from './AsyncErrorHandler.stories'
// export { default as ErrorBoundaryStories } from './ErrorBoundary.stories'
// export { default as GlobalErrorBoundaryStories } from './GlobalErrorBoundary.stories'

// Story Categories for Storybook Organization
export const storyCategories = {
  'Core UI': [
    'Alert', 'Avatar', 'Badge', 'Button', 'Card', 'Checkbox',
    'Dialog', 'Input'
  ],
  // TODO: Add more categories when corresponding story files are created
  // 'Forms & Inputs': [
  //   'Label', 'Select', 'Separator', 'Slider', 'Switch', 'Tabs', 'Textarea', 'Tooltip'
  // ],
  // TODO: Add categories when corresponding story files are created
  // 'Layout & Navigation': [
  //   'Collapsible', 'DropdownMenu', 'ScrollArea', 'Sheet'
  // ],
  // 'Feedback & Status': [
  //   'Loading', 'NotificationCenter', 'Toast'
  // ],
  // 'Data Display': [
  //   'Chart', 'Testimonials'
  // ],
  // 'Forms & Search': [
  //   'AdvancedSearch', 'SearchInput', 'SearchResults', 'TestimonialForm'
  // ],
  // 'Specialized': [
  //   'Icons', 'InstagramFeed', 'TeamFilters', 'ThemeToggle'
  // ],
  // 'Error Handling': [
  //   'AsyncErrorHandler', 'ErrorBoundary', 'GlobalErrorBoundary'
  // ]
}
