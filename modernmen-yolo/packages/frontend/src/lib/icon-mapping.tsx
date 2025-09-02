// Icon mapping system for consistent icon usage across the app
// Import all available icons from lucide-react
export {
  // Basic icons that should be available
  X,
  Menu,
  Phone,
  Calendar,
  Search,
  User,
  Bell,
  Settings,
  LogOut,

  Star,
  Home,
  Camera,
  BookOpen,
  BarChart3,
  Check,
  ChevronRight,
  Circle,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  Heart,
  ShoppingCart,
  Mail,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Building,
  Briefcase,
  Award,
  TrendingUp,
  Activity,
  Zap,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Plus,
  Minus,
  Edit,
  Trash2,
  Save,
  Download,
  Upload,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Folder,
  Paperclip,
  Link2,
  ExternalLink,
  Share,
  Copy,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  List,
  Grid,
  Layout,
  Columns,
  Rows,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Crop,
  Move,
  MousePointer,
  Hand,
  Target,
  Crosshair,
  Triangle,
  Hexagon,
  AlignLeft,
  Quote,
  Globe,
  Filter,
  Loader2,
  ArrowLeft,
  ArrowRight,
  CreditCard,
  MessageSquare,
  Package,
  XCircle,
  Gift,
  Sparkles,
  Crown,
  Palette,
  Coffee,
  Wind,
  Trophy,
  Medal,
  Receipt,
  Printer,
  Database,
  LayoutDashboard,
  UserCheck,
  PaintBucket,
} from 'lucide-react'

// Custom icon components for icons that might not be available in current version
export const ChevronLeft = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

export const ChevronLeftIcon = ChevronLeft

export const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

export const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

// Additional custom icons that might be missing
export const MenuIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

export const PhoneIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  </svg>
)

export const CalendarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width={18} height={18} x={3} y={4} rx={2} ry={2} />
    <line x1={16} x2={16} y1={2} y2={6} />
    <line x1={8} x2={8} y1={2} y2={6} />
    <line x1={3} x2={21} y1={10} y2={10} />
  </svg>
)