
import { Globe, Boxes, Radar, Calendar, BarChart2, LineChart, FileText, Settings, User, Bell, Database, Info, BookOpen } from "lucide-react";

export const mainMenuItems = [
  {
    id: 'uptime-monitoring',
    path: '/dashboard',
    icon: Globe,
    translationKey: 'uptimeMonitoring',
    color: 'text-purple-400',
    hasNavigation: true
  },
  {
    id: 'instance-monitoring',
    path: null,
    icon: Boxes,
    translationKey: 'instanceMonitoring',
    color: 'text-blue-400',
    hasNavigation: false
  },
  {
    id: 'ssl-domain',
    path: '/ssl-domain',
    icon: Radar,
    translationKey: 'sslDomain',
    color: 'text-cyan-400',
    hasNavigation: true
  },
  {
    id: 'schedule-incident',
    path: '/schedule-incident',
    icon: Calendar,
    translationKey: 'scheduleIncident',
    color: 'text-emerald-400',
    hasNavigation: true
  },
  {
    id: 'operational-page',
    path: '/operational-page',
    icon: BarChart2,
    translationKey: 'operationalPage',
    color: 'text-amber-400',
    hasNavigation: true
  },
  {
    id: 'reports',
    path: null,
    icon: LineChart,
    translationKey: 'reports',
    color: 'text-rose-400',
    hasNavigation: false
  },
  {
    id: 'api-documentation',
    path: null,
    icon: FileText,
    translationKey: 'apiDocumentation',
    color: 'text-indigo-400',
    hasNavigation: false
  }
];

export const settingsMenuItems = [
  {
    id: 'general',
    icon: Settings,
    translationKey: 'generalSettings'
  },
  {
    id: 'users',
    icon: User,
    translationKey: 'userManagement'
  },
  {
    id: 'notifications',
    icon: Bell,
    translationKey: 'notificationSettings'
  },
  {
    id: 'templates',
    icon: BookOpen,
    translationKey: 'alertsTemplates'
  },
  {
    id: 'data-retention',
    icon: Database,
    translationKey: 'dataRetention'
  },
  {
    id: 'about',
    icon: Info,
    translationKey: 'aboutSystem'
  }
];