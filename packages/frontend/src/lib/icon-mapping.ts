// Unified icon mapping system for Modern Men Hair Salon
import React from 'react'
import type { ComponentType } from 'react'

// Import all icons from our unified icons system
import * as Icons from './src/icons'

/**
 * The default fallback icon component.
 */
const FallbackIcon: ComponentType<any> = Icons.CircleHelp

/**
 * Map of available lucide-react icons.
 * Only add icons that are actually imported and available.
 */
const lucideIcons: Record<string, ComponentType<any>> = {
    settings: Icons.Settings,
    shield: Icons.Shield,
    database: Icons.Database,
    bell: Icons.Bell,
    alertTriangle: Icons.AlertTriangle,
    checkCircle: Icons.CheckCircle,
    code: Icons.Code,
    book: Icons.BookOpen,
    arrowLeft: Icons.ArrowLeft,
    chevronRight: Icons.ChevronRight,
    menu: Icons.Menu,
    x: Icons.X,
    users: Icons.Users,
    helpCircle: Icons.CircleHelp,
    calendar: Icons.Calendar,
    fileText: Icons.FileText,
    barChart3: Icons.BarChart3,
    trendingUp: Icons.TrendingUp,
    clock: Icons.Clock,
    refreshCw: Icons.RefreshCw,
    eye: Icons.Eye,
    messageSquare: Icons.MessageSquare,
    star: Icons.Star,
    thumbsUp: Icons.ThumbsUp,
    filter: Icons.Filter,
    loader2: Icons.Loader2,
    copy: Icons.Copy,
    download: Icons.Download,
    play: Icons.Play,
    chevronDown: Icons.ChevronDown,
    externalLink: Icons.ExternalLink,
    zap: Icons.Zap,
    phone: Icons.Phone,
    mapPin: Icons.MapPin,
    scissors: Icons.Scissors,
    brush: Icons.Brush,
    award: Icons.Award,
    arrowRight: Icons.ArrowRight,
    wifiOff: Icons.WifiOff,
    home: Icons.Home,
    messageCircle: Icons.MessageCircle,
    bookOpen: Icons.BookOpen,
    facebook: Icons.Facebook,
    instagram: Icons.Instagram,
    twitter: Icons.Twitter,
    eyeOff: Icons.EyeOff,
    sliders: Icons.Sliders,
    circle: Icons.Circle,
    type: Icons.Type,
    mousePointer: Icons.MousePointer,
    rotateCw: Icons.RotateCcw,
    palette: Icons.Palette,
    navigation: Icons.Navigation,
    volume2: Icons.Volume2,
    volumeX: Icons.VolumeX,
    pause: Icons.Pause,
    target: Icons.Target,
    grid: Icons.Grid,
    list: Icons.List,
    layout: Icons.Layout,
    maximize: Icons.Maximize,
    minimize: Icons.Minimize,
    moreHorizontal: Icons.MoreHorizontal,
    moreVertical: Icons.MoreVertical,
    unlock: Icons.Unlock,
    heart: Icons.Heart,
    flag: Icons.Flag,
    tag: Icons.Tag,
    bookmark: Icons.Bookmark,
    gift: Icons.Gift,
    sparkles: Icons.Sparkles,
    gitCommit: Icons.GitCommit,
    component: Icons.Component,
    lineChart: Icons.LineChart,
    trendingDown: Icons.TrendingDown,
    activity: Icons.Activity,
    search: Icons.Search,
    logOut: Icons.LogOut,
    camera: Icons.Camera,
    chart: Icons.Chart,
}

/**
 * Enhanced icon mapping utilities for the Modern Men platform.
 * Provides a robust, type-safe, and extensible way to retrieve icon components by name,
 * including support for aliases and fallbacks.
 */

/**
 * Main icon mapping object.
 * Maps string keys (icon names and aliases) to icon components.
 * All aliases and alternate names are mapped to the closest available icon.
 */
export const iconMapping: Record<string, ComponentType<any>> = {
  // Direct mappings for available icons
  settings: Icons.Settings,
  shield: Icons.Shield,
  database: Icons.Database,
  bell: Icons.Bell,
  alertTriangle: Icons.AlertTriangle,
  checkCircle: Icons.CheckCircle,
  code: Icons.Code,
  book: Icons.BookOpen,
  arrowLeft: Icons.ArrowLeft,
  chevronRight: Icons.ChevronRight,
  menu: Icons.Menu,
  x: Icons.X,
  users: Icons.Users,
  helpCircle: Icons.CircleHelp,
  calendar: Icons.Calendar,
  fileText: Icons.FileText,
  barChart3: Icons.BarChart3,
  trendingUp: Icons.TrendingUp,
  clock: Icons.Clock,
  refreshCw: Icons.RefreshCw,
  eye: Icons.Eye,
  messageSquare: Icons.MessageSquare,
  star: Icons.Star,
  thumbsUp: Icons.ThumbsUp,
  filter: Icons.Filter,
  loader2: Icons.Loader2,
  copy: Icons.Copy,
  download: Icons.Download,
  play: Icons.Play,
  chevronDown: Icons.ChevronDown,
  externalLink: Icons.ExternalLink,
  zap: Icons.Zap,
  phone: Icons.Phone,
  mapPin: Icons.MapPin,
  scissors: Icons.Scissors,
  brush: Icons.Brush,
  award: Icons.Award,
  arrowRight: Icons.ArrowRight,
  wifiOff: Icons.WifiOff,
  home: Icons.Home,
  messageCircle: Icons.MessageCircle,
  bookOpen: Icons.BookOpen,
  facebook: Icons.Facebook,
  instagram: Icons.Instagram,
  twitter: Icons.Twitter,
  eyeOff: Icons.EyeOff,
  sliders: Icons.Sliders,
  circle: Icons.Circle,
  type: Icons.Type,
  mousePointer: Icons.MousePointer,
  rotateCw: Icons.RotateCcw,
  palette: Icons.Palette,
  navigation: Icons.Navigation,
  volume2: Icons.Volume2,
  volumeX: Icons.VolumeX,
  pause: Icons.Pause,
  target: Icons.Target,
  grid: Icons.Grid,
  list: Icons.List,
  layout: Icons.Layout,
  maximize: Icons.Maximize,
  minimize: Icons.Minimize,
  moreHorizontal: Icons.MoreHorizontal,
  moreVertical: Icons.MoreVertical,
  unlock: Icons.Unlock,
  heart: Icons.Heart,
  flag: Icons.Flag,
  tag: Icons.Tag,
  bookmark: Icons.Bookmark,
  gift: Icons.Gift,
  sparkles: Icons.Sparkles,
  gitCommit: Icons.GitCommit,
  component: Icons.Component,
  lineChart: Icons.LineChart,
  trendingDown: Icons.TrendingDown,
  activity: Icons.Activity,
  search: Icons.Search,
  logOut: Icons.LogOut,
  camera: Icons.Camera,
  chart: Icons.Chart,

  // Fallback/alias mappings for missing or alternate icon names
  globe: Icons.Globe,
  mail: Icons.Mail,
  key: Icons.Key,
  lock: Icons.Lock,
  server: Icons.Database,
  info: Icons.Info,
  alertCircle: Icons.AlertCircle,
  infoIcon: Icons.Info,
  checkCircle2: Icons.CheckCircle,
  rotateCcw: Icons.RotateCcw,
  saveIcon: Icons.Save,
  historyIcon: Icons.Clock,
  alertCircleIcon: Icons.AlertCircle,
  checkCircleIcon: Icons.CheckCircle,
  wifi: Icons.Wifi,
  paintbrush: Icons.Brush,
  loader: Icons.Loader2,
  terminal: Icons.Terminal,
  accessibility: Icons.Accessibility,
  gitBranch: Icons.GitBranch,
  thumbsDown: Icons.ThumbsDown,
  link: Icons.Link,
  barChart: Icons.BarChart3,
  xCircle: Icons.XCircle,
  upload: Icons.Upload,
  monitor: Icons.Monitor,
  smartphone: Icons.Smartphone,
  stop: Icons.Stop,
  edit: Icons.Edit,
  save: Icons.Save,
  send: Icons.Send,
  trash2: Icons.Trash2,
  plus: Icons.Plus,
  user: Icons.User,
  atSign: Icons.Mail, // Use Mail as fallback for AtSign
}

/**
 * Returns the icon component for a given icon name, or the fallback.
 * @param iconName - The icon name to retrieve.
 * @returns The icon component.
 */
export function getIcon(iconName: string): ComponentType<any> {
  return iconMapping[iconName] || FallbackIcon
}

// Re-export all icons from the icons module for direct import if needed
export * from './src/icons'

// Direct exports for commonly used capitalized icon names
export const Award = Icons.Award
export const Scissors = Icons.Scissors
export const Zap = Icons.Zap
export const Brush = Icons.Brush
export const Star = Icons.Star
export const Facebook = Icons.Facebook
export const Instagram = Icons.Instagram
export const Mail = Icons.Mail
export const Search = Icons.Search
export const LogOut = Icons.LogOut
export const Camera = Icons.Camera
export const Book = Icons.BookOpen
export const Chart = Icons.Chart

// Additional icons needed by CustomerCommunication component
export const MessageSquare = Icons.MessageSquare
export const Send = Icons.Send
export const Phone = Icons.Phone
export const Calendar = Icons.Calendar
export const UserIcon = Icons.User
export const Clock = Icons.Clock
export const CheckCircle = Icons.CheckCircle
export const AlertCircle = Icons.AlertCircle
export const XCircle = Icons.XCircle
export const Eye = Icons.Eye
export const Edit = Icons.Edit
export const Trash2 = Icons.Trash2
export const Plus = Icons.Plus
export const Filter = Icons.Filter
export const MoreHorizontal = Icons.MoreHorizontal
export const Bell = Icons.Bell
export const MessageCircle = Icons.MessageCircle
export const AtSign = Icons.Mail
export const AtSignIcon = Icons.Mail