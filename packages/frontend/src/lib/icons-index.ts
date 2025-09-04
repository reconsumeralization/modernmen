/**
 * Icons Index - Easy import/export for all icons and icon mapping
 * This file provides convenient access to all icons and mapping functionality
 */

// Re-export all icons
export * from './src/icons'

// Re-export icon mapping functionality
export * from './icon-mapping'

// Named exports for commonly used icons (for easier imports)
export { getIcon } from './icon-mapping'
export { iconMapping } from './icon-mapping'

// Import specific icons for aliases
import {
  MapPin, Search, Settings, User, Bell, Calendar, Phone, Mail, Home, Star,
  Heart, CheckCircle, AlertCircle, AlertTriangle, Plus, Minus, Edit, Trash2,
  Save, Download, Upload, RefreshCw, Loader2, Eye, EyeOff, Lock, Unlock,
  Menu, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ExternalLink,
  Copy, Send, MessageCircle, MessageSquare, Clock, Award, Scissors, Brush,
  Zap, Shield, Database, BarChart3, TrendingUp, Activity, Camera, BookOpen,
  LogOut, Filter, MoreHorizontal, MoreVertical, Grid, List, Layout, Maximize,
  Minimize, Bookmark, Gift, Sparkles, ThumbsUp, ThumbsDown, Facebook, Instagram,
  Twitter, Globe, Info, HelpCircle, Circle, Play, Pause, Volume2, VolumeX,
  RotateCcw, RotateCw, Target, Navigation, Wifi, WifiOff, Sun, Moon, ShoppingCart,
  DollarSign, Building, Briefcase, Users, UserCheck, CreditCard, Package, XCircle,
  Crown, Palette, Coffee, Wind, Trophy, Medal, Receipt, Printer, LayoutDashboard,
  PaintBucket, Music, Video, Archive, Folder, Paperclip, Link2, Share, Mic,
  MicOff, Square, SkipBack, SkipForward, Repeat, Shuffle, Columns, Rows, ZoomIn,
  ZoomOut, FlipHorizontal, FlipVertical, Crop, Move, Hand, Crosshair, Triangle,
  Hexagon, AlignLeft, Quote, Terminal, Accessibility, GitBranch, LineChart,
  TrendingDown, FileText, Image, Tag, Flag, Component, MousePointer, Type,
  Sliders, Code, GitCommit, Stop, Monitor, Smartphone, Link, ArrowLeft,
  ArrowRight, ArrowUp, ArrowDown
} from './icons'

// Icon aliases for backward compatibility
export const MapPinIcon = MapPin
export const SearchIcon = Search
export const SettingsIcon = Settings
export const UserIcon = User
export const BellIcon = Bell
export const CalendarIcon = Calendar
export const PhoneIcon = Phone
export const MailIcon = Mail
export const HomeIcon = Home
export const StarIcon = Star
export const HeartIcon = Heart
export const CheckCircleIcon = CheckCircle
export const AlertCircleIcon = AlertCircle
export const AlertTriangleIcon = AlertTriangle
export const PlusIcon = Plus
export const MinusIcon = Minus
export const EditIcon = Edit
export const Trash2Icon = Trash2
export const SaveIcon = Save
export const DownloadIcon = Download
export const UploadIcon = Upload
export const RefreshCwIcon = RefreshCw
export const Loader2Icon = Loader2
export const EyeIcon = Eye
export const EyeOffIcon = EyeOff
export const LockIcon = Lock
export const UnlockIcon = Unlock
export const MenuIcon = Menu
export const XIcon = X
export const ChevronDownIcon = ChevronDown
export const ChevronUpIcon = ChevronUp
export const ChevronLeftIcon = ChevronLeft
export const ChevronRightIcon = ChevronRight
export const ExternalLinkIcon = ExternalLink
export const CopyIcon = Copy
export const SendIcon = Send
export const MessageCircleIcon = MessageCircle
export const MessageSquareIcon = MessageSquare
export const ClockIcon = Clock
export const AwardIcon = Award
export const ScissorsIcon = Scissors
export const BrushIcon = Brush
export const ZapIcon = Zap
export const ShieldIcon = Shield
export const DatabaseIcon = Database
export const BarChart3Icon = BarChart3
export const TrendingUpIcon = TrendingUp
export const ActivityIcon = Activity
export const CameraIcon = Camera
export const BookOpenIcon = BookOpen
export const LogOutIcon = LogOut
export const FilterIcon = Filter
export const MoreHorizontalIcon = MoreHorizontal
export const MoreVerticalIcon = MoreVertical
export const GridIcon = Grid
export const ListIcon = List
export const LayoutIcon = Layout
export const MaximizeIcon = Maximize
export const MinimizeIcon = Minimize
export const BookmarkIcon = Bookmark
export const GiftIcon = Gift
export const SparklesIcon = Sparkles
export const ThumbsUpIcon = ThumbsUp
export const ThumbsDownIcon = ThumbsDown
export const FacebookIcon = Facebook
export const InstagramIcon = Instagram
export const TwitterIcon = Twitter
export const GlobeIcon = Globe
export const InfoIcon = Info
export const HelpCircleIcon = HelpCircle
export const CircleIcon = Circle
export const PlayIcon = Play
export const PauseIcon = Pause
export const Volume2Icon = Volume2
export const VolumeXIcon = VolumeX
export const RotateCcwIcon = RotateCcw
export const RotateCwIcon = RotateCw
export const TargetIcon = Target
export const NavigationIcon = Navigation
export const WifiIcon = Wifi
export const WifiOffIcon = WifiOff
export const SunIcon = Sun
export const MoonIcon = Moon
export const ShoppingCartIcon = ShoppingCart
export const DollarSignIcon = DollarSign
export const BuildingIcon = Building
export const BriefcaseIcon = Briefcase
export const UsersIcon = Users
export const UserCheckIcon = UserCheck
export const CreditCardIcon = CreditCard
export const PackageIcon = Package
export const XCircleIcon = XCircle
export const CrownIcon = Crown
export const PaletteIcon = Palette
export const CoffeeIcon = Coffee
export const WindIcon = Wind
export const TrophyIcon = Trophy
export const MedalIcon = Medal
export const ReceiptIcon = Receipt
export const PrinterIcon = Printer
export const LayoutDashboardIcon = LayoutDashboard
export const PaintBucketIcon = PaintBucket
export const MusicIcon = Music
export const VideoIcon = Video
export const ArchiveIcon = Archive
export const FolderIcon = Folder
export const PaperclipIcon = Paperclip
export const Link2Icon = Link2
export const ShareIcon = Share
export const MicIcon = Mic
export const MicOffIcon = MicOff
export const SquareIcon = Square
export const SkipBackIcon = SkipBack
export const SkipForwardIcon = SkipForward
export const RepeatIcon = Repeat
export const ShuffleIcon = Shuffle
export const ColumnsIcon = Columns
export const RowsIcon = Rows
export const ZoomInIcon = ZoomIn
export const ZoomOutIcon = ZoomOut
export const FlipHorizontalIcon = FlipHorizontal
export const FlipVerticalIcon = FlipVertical
export const CropIcon = Crop
export const MoveIcon = Move
export const HandIcon = Hand
export const CrosshairIcon = Crosshair
export const TriangleIcon = Triangle
export const HexagonIcon = Hexagon
export const AlignLeftIcon = AlignLeft
export const QuoteIcon = Quote
export const TerminalIcon = Terminal
export const AccessibilityIcon = Accessibility
export const GitBranchIcon = GitBranch
export const LineChartIcon = LineChart
export const TrendingDownIcon = TrendingDown
export const FileTextIcon = FileText
export const ImageIcon = Image
export const TagIcon = Tag
export const FlagIcon = Flag
export const ComponentIcon = Component
export const MousePointerIcon = MousePointer
export const TypeIcon = Type
export const SlidersIcon = Sliders
export const CodeIcon = Code
export const GitCommitIcon = GitCommit
export const StopIcon = Stop
export const MonitorIcon = Monitor
export const SmartphoneIcon = Smartphone
export const LinkIcon = Link
export const ArrowLeftIcon = ArrowLeft
export const ArrowRightIcon = ArrowRight
export const ArrowUpIcon = ArrowUp
export const ArrowDownIcon = ArrowDown
