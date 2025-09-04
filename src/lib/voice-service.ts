export interface VoiceMessage {
  id: string
  transcript: string
  confidence: number
  language: string
  duration: number
  audioUrl?: string
  timestamp: Date
}

export interface SpeechSynthesisOptions {
  voice?: SpeechSynthesisVoice
  rate?: number
  pitch?: number
  volume?: number
  language?: string
}

export interface VoiceCommand {
  command: string
  confidence: number
  intent: 'book' | 'cancel' | 'info' | 'help' | 'repeat' | 'unknown'
  entities: {
    service?: string
    date?: string
    time?: string
    name?: string
  }
}

export class VoiceService {
  private recognition: SpeechRecognition | null = null
  private synthesis: SpeechSynthesis | null = null
  private isListening = false
  private isSpeaking = false
  private currentTranscript = ''
  private voiceCallbacks: {
    onResult: ((message: VoiceMessage) => void)[]
    onError: ((error: string) => void)[]
    onStart: (() => void)[]
    onEnd: (() => void)[]
  } = {
    onResult: [],
    onError: [],
    onStart: [],
    onEnd: []
  }

  constructor() {
    this.initializeSpeechRecognition()
    this.initializeSpeechSynthesis()
  }

  private initializeSpeechRecognition(): void {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      this.recognition = new SpeechRecognition()

      this.recognition.continuous = true
      this.recognition.interimResults = true
      this.recognition.lang = 'en-US'
      this.recognition.maxAlternatives = 3

      this.recognition.onstart = () => {
        this.isListening = true
        this.voiceCallbacks.onStart.forEach(callback => callback())
      }

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        this.currentTranscript = finalTranscript || interimTranscript

        if (finalTranscript) {
          const voiceMessage: VoiceMessage = {
            id: this.generateId(),
            transcript: finalTranscript,
            confidence: event.results[event.results.length - 1][0].confidence || 0.8,
            language: this.recognition?.lang || 'en-US',
            duration: event.timeStamp / 1000,
            timestamp: new Date()
          }

          this.voiceCallbacks.onResult.forEach(callback => callback(voiceMessage))
        }
      }

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        this.isListening = false
        this.voiceCallbacks.onError.forEach(callback => callback(event.error))
      }

      this.recognition.onend = () => {
        this.isListening = false
        this.voiceCallbacks.onEnd.forEach(callback => callback())
      }
    }
  }

  private initializeSpeechSynthesis(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis
    }
  }

  startListening(language: string = 'en-US'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'))
        return
      }

      if (this.isListening) {
        resolve()
        return
      }

      this.recognition.lang = language
      this.currentTranscript = ''

      try {
        this.recognition.start()
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
    }
  }

  speak(text: string, options: SpeechSynthesisOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'))
        return
      }

      if (this.isSpeaking) {
        this.synthesis.cancel()
      }

      const utterance = new SpeechSynthesisUtterance(text)

      // Set options
      utterance.rate = options.rate || 1
      utterance.pitch = options.pitch || 1
      utterance.volume = options.volume || 1
      utterance.lang = options.language || 'en-US'

      if (options.voice) {
        utterance.voice = options.voice
      }

      utterance.onstart = () => {
        this.isSpeaking = true
      }

      utterance.onend = () => {
        this.isSpeaking = false
        resolve()
      }

      utterance.onerror = (error) => {
        this.isSpeaking = false
        reject(error)
      }

      this.synthesis.speak(utterance)
    })
  }

  stopSpeaking(): void {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.cancel()
      this.isSpeaking = false
    }
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return []
    return this.synthesis.getVoices()
  }

  getAvailableLanguages(): string[] {
    const voices = this.getAvailableVoices()
    return [...new Set(voices.map(voice => voice.lang))]
  }

  isSupported(): boolean {
    return !!(this.recognition && this.synthesis)
  }

  isCurrentlyListening(): boolean {
    return this.isListening
  }

  isCurrentlySpeaking(): boolean {
    return this.isSpeaking
  }

  getCurrentTranscript(): string {
    return this.currentTranscript
  }

  // Voice command processing
  processVoiceCommand(transcript: string): VoiceCommand {
    const lowerTranscript = transcript.toLowerCase()
    const command: VoiceCommand = {
      command: transcript,
      confidence: 0.8,
      intent: 'unknown',
      entities: {}
    }

    // Booking intents
    if (lowerTranscript.includes('book') || lowerTranscript.includes('schedule') || lowerTranscript.includes('appointment')) {
      command.intent = 'book'

      // Extract service
      if (lowerTranscript.includes('haircut')) command.entities.service = 'haircut'
      if (lowerTranscript.includes('beard')) command.entities.service = 'beard'
      if (lowerTranscript.includes('color')) command.entities.service = 'color'

      // Extract date/time patterns
      const dateMatch = lowerTranscript.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/)
      if (dateMatch) {
        command.entities.date = `${dateMatch[1]}/${dateMatch[2]}/${dateMatch[3]}`
      }

      const timeMatch = lowerTranscript.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i)
      if (timeMatch) {
        command.entities.time = `${timeMatch[1]}:${timeMatch[2]} ${timeMatch[3].toUpperCase()}`
      }
    }

    // Cancel intent
    else if (lowerTranscript.includes('cancel') || lowerTranscript.includes('remove')) {
      command.intent = 'cancel'
    }

    // Information intent
    else if (lowerTranscript.includes('hours') || lowerTranscript.includes('location') || lowerTranscript.includes('price')) {
      command.intent = 'info'
    }

    // Help intent
    else if (lowerTranscript.includes('help') || lowerTranscript.includes('what can you do')) {
      command.intent = 'help'
    }

    // Repeat intent
    else if (lowerTranscript.includes('repeat') || lowerTranscript.includes('say again')) {
      command.intent = 'repeat'
    }

    return command
  }

  // Event listeners
  onResult(callback: (message: VoiceMessage) => void): () => void {
    this.voiceCallbacks.onResult.push(callback)
    return () => {
      const index = this.voiceCallbacks.onResult.indexOf(callback)
      if (index > -1) {
        this.voiceCallbacks.onResult.splice(index, 1)
      }
    }
  }

  onError(callback: (error: string) => void): () => void {
    this.voiceCallbacks.onError.push(callback)
    return () => {
      const index = this.voiceCallbacks.onError.indexOf(callback)
      if (index > -1) {
        this.voiceCallbacks.onError.splice(index, 1)
      }
    }
  }

  onStart(callback: () => void): () => void {
    this.voiceCallbacks.onStart.push(callback)
    return () => {
      const index = this.voiceCallbacks.onStart.indexOf(callback)
      if (index > -1) {
        this.voiceCallbacks.onStart.splice(index, 1)
      }
    }
  }

  onEnd(callback: () => void): () => void {
    this.voiceCallbacks.onEnd.push(callback)
    return () => {
      const index = this.voiceCallbacks.onEnd.indexOf(callback)
      if (index > -1) {
        this.voiceCallbacks.onEnd.splice(index, 1)
      }
    }
  }

  private generateId(): string {
    return `voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// Global voice service instance
export const voiceService = new VoiceService()

// Voice command hooks for React
export function useVoiceService() {
  return voiceService
}
