export interface AccessibilityPreferences {
  highContrast: boolean
  largeText: boolean
  reducedMotion: boolean
  screenReader: boolean
  keyboardNavigation: boolean
  colorBlindFriendly: boolean
  focusIndicators: boolean
  autoComplete: boolean
  voiceCommands: boolean
  hapticFeedback: boolean
}

export interface ScreenReaderAnnouncement {
  message: string
  priority: 'polite' | 'assertive'
  role?: string
  liveRegion?: boolean
}

export interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  description: string
  action: () => void
  category: 'navigation' | 'chat' | 'accessibility' | 'general'
}

export interface FocusManagement {
  currentElement?: HTMLElement
  focusHistory: HTMLElement[]
  focusableElements: NodeListOf<HTMLElement>
  skipLinks: Array<{
    target: string
    label: string
  }>
}

export interface VoiceCommand {
  command: string
  alternatives: string[]
  action: string
  context?: string
  confidence: number
}

export class AccessibilityService {
  private preferences: AccessibilityPreferences = {
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    colorBlindFriendly: false,
    focusIndicators: true,
    autoComplete: true,
    voiceCommands: false,
    hapticFeedback: false
  }

  private keyboardShortcuts: Map<string, KeyboardShortcut> = new Map()
  private focusManagement: FocusManagement = {
    focusHistory: [],
    focusableElements: document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
    skipLinks: []
  }

  private screenReaderAnnouncements: ScreenReaderAnnouncement[] = []
  private voiceCommands: VoiceCommand[] = []

  constructor() {
    this.initializeKeyboardShortcuts()
    this.initializeVoiceCommands()
    this.loadUserPreferences()
    this.setupEventListeners()
  }

  private initializeKeyboardShortcuts(): void {
    const shortcuts: KeyboardShortcut[] = [
      // Navigation shortcuts
      {
        key: 'h',
        ctrlKey: true,
        description: 'Go to home page',
        action: () => window.location.href = '/',
        category: 'navigation'
      },
      {
        key: 'c',
        ctrlKey: true,
        description: 'Focus chat input',
        action: () => this.focusChatInput(),
        category: 'chat'
      },
      {
        key: 's',
        ctrlKey: true,
        description: 'Skip to main content',
        action: () => this.skipToMainContent(),
        category: 'navigation'
      },
      {
        key: 'Escape',
        description: 'Close modal or dialog',
        action: () => this.closeModal(),
        category: 'general'
      },
      // Accessibility shortcuts
      {
        key: '1',
        altKey: true,
        description: 'Toggle high contrast mode',
        action: () => this.toggleHighContrast(),
        category: 'accessibility'
      },
      {
        key: '2',
        altKey: true,
        description: 'Toggle large text mode',
        action: () => this.toggleLargeText(),
        category: 'accessibility'
      },
      {
        key: '3',
        altKey: true,
        description: 'Toggle reduced motion',
        action: () => this.toggleReducedMotion(),
        category: 'accessibility'
      },
      // Chat shortcuts
      {
        key: 'Enter',
        description: 'Send message (when in chat input)',
        action: () => this.sendChatMessage(),
        category: 'chat'
      },
      {
        key: 'ArrowUp',
        description: 'Previous message in chat history',
        action: () => this.navigateChatHistory('up'),
        category: 'chat'
      },
      {
        key: 'ArrowDown',
        description: 'Next message in chat history',
        action: () => this.navigateChatHistory('down'),
        category: 'chat'
      }
    ]

    shortcuts.forEach(shortcut => {
      const key = this.generateShortcutKey(shortcut)
      this.keyboardShortcuts.set(key, shortcut)
    })
  }

  private initializeVoiceCommands(): void {
    this.voiceCommands = [
      {
        command: 'open chat',
        alternatives: ['start chat', 'begin conversation', 'talk to assistant'],
        action: 'open_chat',
        confidence: 0.9
      },
      {
        command: 'close chat',
        alternatives: ['end chat', 'stop talking', 'exit conversation'],
        action: 'close_chat',
        confidence: 0.9
      },
      {
        command: 'send message',
        alternatives: ['send', 'submit', 'post message'],
        action: 'send_message',
        confidence: 0.8
      },
      {
        command: 'book appointment',
        alternatives: ['make booking', 'schedule appointment', 'set up appointment'],
        action: 'book_appointment',
        confidence: 0.9
      },
      {
        command: 'show services',
        alternatives: ['view services', 'list services', 'what services'],
        action: 'show_services',
        confidence: 0.8
      },
      {
        command: 'help',
        alternatives: ['get help', 'show help', 'what can you do'],
        action: 'show_help',
        confidence: 0.9
      },
      {
        command: 'toggle high contrast',
        alternatives: ['high contrast mode', 'contrast mode'],
        action: 'toggle_high_contrast',
        confidence: 0.8
      },
      {
        command: 'toggle large text',
        alternatives: ['large text mode', 'big text'],
        action: 'toggle_large_text',
        confidence: 0.8
      }
    ]
  }

  private generateShortcutKey(shortcut: KeyboardShortcut): string {
    const parts = []
    if (shortcut.ctrlKey) parts.push('ctrl')
    if (shortcut.altKey) parts.push('alt')
    if (shortcut.shiftKey) parts.push('shift')
    parts.push(shortcut.key.toLowerCase())
    return parts.join('+')
  }

  private setupEventListeners(): void {
    // Keyboard event listener
    document.addEventListener('keydown', this.handleKeyboardEvent.bind(this))

    // Focus management
    document.addEventListener('focusin', this.handleFocusChange.bind(this))

    // Screen reader announcements
    this.setupScreenReaderAnnouncements()

    // Voice command listener (if supported)
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      this.setupVoiceCommandListener()
    }
  }

  private handleKeyboardEvent(event: KeyboardEvent): void {
    const shortcutKey = this.generateShortcutKey({
      key: event.key,
      ctrlKey: event.ctrlKey,
      altKey: event.altKey,
      shiftKey: event.shiftKey
    })

    const shortcut = this.keyboardShortcuts.get(shortcutKey)
    if (shortcut) {
      event.preventDefault()
      shortcut.action()

      // Announce action to screen readers
      this.announceToScreenReader(`${shortcut.description} activated`, 'polite')
    }
  }

  private handleFocusChange(event: FocusEvent): void {
    const target = event.target as HTMLElement
    if (target && this.isFocusableElement(target)) {
      this.focusManagement.currentElement = target
      this.focusManagement.focusHistory.push(target)

      // Keep only last 10 focus changes
      if (this.focusManagement.focusHistory.length > 10) {
        this.focusManagement.focusHistory.shift()
      }
    }
  }

  private isFocusableElement(element: HTMLElement): boolean {
    return element.matches('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
  }

  private setupScreenReaderAnnouncements(): void {
    // Create live region for announcements
    const liveRegion = document.createElement('div')
    liveRegion.setAttribute('aria-live', 'polite')
    liveRegion.setAttribute('aria-atomic', 'true')
    liveRegion.className = 'sr-only'
    liveRegion.id = 'accessibility-live-region'
    document.body.appendChild(liveRegion)

    // Process announcements queue
    setInterval(() => {
      if (this.screenReaderAnnouncements.length > 0) {
        const announcement = this.screenReaderAnnouncements.shift()
        if (announcement) {
          liveRegion.textContent = announcement.message
        }
      }
    }, 100)
  }

  private setupVoiceCommandListener(): void {
    // Voice command processing would integrate with the existing voice service
    // This is a placeholder for the integration point
    console.log('Voice command listener initialized')
  }

  // Public API methods
  announceToScreenReader(
    message: string,
    priority: 'polite' | 'assertive' = 'polite',
    role?: string
  ): void {
    this.screenReaderAnnouncements.push({
      message,
      priority,
      role,
      liveRegion: true
    })
  }

  setPreferences(newPreferences: Partial<AccessibilityPreferences>): void {
    this.preferences = { ...this.preferences, ...newPreferences }
    this.saveUserPreferences()
    this.applyAccessibilitySettings()
  }

  getPreferences(): AccessibilityPreferences {
    return { ...this.preferences }
  }

  addKeyboardShortcut(shortcut: KeyboardShortcut): void {
    const key = this.generateShortcutKey(shortcut)
    this.keyboardShortcuts.set(key, shortcut)
  }

  removeKeyboardShortcut(key: string): void {
    this.keyboardShortcuts.delete(key)
  }

  getKeyboardShortcuts(): KeyboardShortcut[] {
    return Array.from(this.keyboardShortcuts.values())
  }

  addSkipLink(target: string, label: string): void {
    this.focusManagement.skipLinks.push({ target, label })
  }

  focusElement(selector: string): void {
    const element = document.querySelector(selector) as HTMLElement
    if (element) {
      element.focus()
      this.announceToScreenReader(`Focused on ${element.textContent || element.getAttribute('aria-label') || 'element'}`, 'polite')
    }
  }

  trapFocus(container: HTMLElement): () => void {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus()
            e.preventDefault()
          }
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)

    // Focus first element
    if (firstElement) {
      firstElement.focus()
    }

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }

  // Voice command processing
  processVoiceCommand(transcript: string): VoiceCommand | null {
    const lowerTranscript = transcript.toLowerCase()

    for (const command of this.voiceCommands) {
      if (lowerTranscript.includes(command.command) ||
          command.alternatives.some(alt => lowerTranscript.includes(alt))) {
        return command
      }
    }

    return null
  }

  // Action handlers for shortcuts and voice commands
  private focusChatInput(): void {
    const chatInput = document.querySelector('[data-chat-input]') as HTMLInputElement
    if (chatInput) {
      chatInput.focus()
      this.announceToScreenReader('Chat input focused', 'polite')
    }
  }

  private skipToMainContent(): void {
    const mainContent = document.querySelector('main') || document.querySelector('[role="main"]')
    if (mainContent) {
      (mainContent as HTMLElement).focus()
      this.announceToScreenReader('Skipped to main content', 'polite')
    }
  }

  private closeModal(): void {
    const modal = document.querySelector('[role="dialog"][aria-modal="true"]') as HTMLElement
    if (modal) {
      const closeButton = modal.querySelector('[aria-label="Close"]') as HTMLElement
      if (closeButton) {
        closeButton.click()
        this.announceToScreenReader('Modal closed', 'polite')
      }
    }
  }

  private toggleHighContrast(): void {
    this.preferences.highContrast = !this.preferences.highContrast
    this.applyAccessibilitySettings()
    this.announceToScreenReader(
      `High contrast mode ${this.preferences.highContrast ? 'enabled' : 'disabled'}`,
      'polite'
    )
  }

  private toggleLargeText(): void {
    this.preferences.largeText = !this.preferences.largeText
    this.applyAccessibilitySettings()
    this.announceToScreenReader(
      `Large text mode ${this.preferences.largeText ? 'enabled' : 'disabled'}`,
      'polite'
    )
  }

  private toggleReducedMotion(): void {
    this.preferences.reducedMotion = !this.preferences.reducedMotion
    this.applyAccessibilitySettings()
    this.announceToScreenReader(
      `Reduced motion ${this.preferences.reducedMotion ? 'enabled' : 'disabled'}`,
      'polite'
    )
  }

  private sendChatMessage(): void {
    const chatInput = document.querySelector('[data-chat-input]') as HTMLInputElement
    if (chatInput && document.activeElement === chatInput) {
      const form = chatInput.closest('form')
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true }))
      }
    }
  }

  private navigateChatHistory(direction: 'up' | 'down'): void {
    // Implementation would integrate with chat history navigation
    this.announceToScreenReader(`Navigated ${direction} in chat history`, 'polite')
  }

  private applyAccessibilitySettings(): void {
    const root = document.documentElement

    // High contrast mode
    if (this.preferences.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    // Large text mode
    if (this.preferences.largeText) {
      root.classList.add('large-text')
    } else {
      root.classList.remove('large-text')
    }

    // Reduced motion
    if (this.preferences.reducedMotion) {
      root.classList.add('reduced-motion')
    } else {
      root.classList.remove('reduced-motion')
    }

    // Focus indicators
    if (this.preferences.focusIndicators) {
      root.classList.add('focus-indicators')
    } else {
      root.classList.remove('focus-indicators')
    }

    // Color blind friendly
    if (this.preferences.colorBlindFriendly) {
      root.classList.add('color-blind-friendly')
    } else {
      root.classList.remove('color-blind-friendly')
    }

    this.saveUserPreferences()
  }

  private loadUserPreferences(): void {
    try {
      const stored = localStorage.getItem('accessibility-preferences')
      if (stored) {
        this.preferences = { ...this.preferences, ...JSON.parse(stored) }
        this.applyAccessibilitySettings()
      }
    } catch (error) {
      console.error('Failed to load accessibility preferences:', error)
    }
  }

  private saveUserPreferences(): void {
    try {
      localStorage.setItem('accessibility-preferences', JSON.stringify(this.preferences))
    } catch (error) {
      console.error('Failed to save accessibility preferences:', error)
    }
  }

  // ARIA utilities
  setAriaLive(element: HTMLElement, live: 'off' | 'polite' | 'assertive'): void {
    element.setAttribute('aria-live', live)
  }

  setAriaLabel(element: HTMLElement, label: string): void {
    element.setAttribute('aria-label', label)
  }

  setAriaDescription(element: HTMLElement, description: string): void {
    element.setAttribute('aria-describedby', description)
  }

  // Focus management utilities
  getFocusableElements(container?: HTMLElement): HTMLElement[] {
    const scope = container || document
    return Array.from(scope.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ))
  }

  moveFocus(direction: 'next' | 'previous' | 'first' | 'last'): void {
    const focusableElements = this.getFocusableElements()
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement)

    let nextIndex: number

    switch (direction) {
      case 'next':
        nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0
        break
      case 'previous':
        nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1
        break
      case 'first':
        nextIndex = 0
        break
      case 'last':
        nextIndex = focusableElements.length - 1
        break
    }

    if (focusableElements[nextIndex]) {
      focusableElements[nextIndex].focus()
    }
  }

  // Haptic feedback (for supported devices)
  triggerHapticFeedback(type: 'light' | 'medium' | 'heavy' = 'medium'): void {
    if (!this.preferences.hapticFeedback) return

    if ('vibrate' in navigator) {
      const patterns = {
        light: 50,
        medium: [50, 50, 50],
        heavy: [100, 50, 100]
      }

      navigator.vibrate(patterns[type])
    }
  }
}

// Global accessibility service instance
export const accessibilityService = new AccessibilityService()
