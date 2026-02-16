
import React from 'react';
import { 
  ShieldAlert, 
  Users, 
  LayoutDashboard, 
  FileText, 
  LogOut, 
  Search, 
  PlusCircle, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserX,
  BookOpen,
  Hammer,
  Stethoscope,
  Frown,
  MoreHorizontal,
  ChevronRight,
  MessageSquare,
  ShieldCheck,
  Globe,
  Trash2
} from 'lucide-react';

export const APP_NAME = "BuddyGuard";

export const ICONS = {
  Dashboard: <LayoutDashboard className="w-5 h-5" />,
  Reports: <FileText className="w-5 h-5" />,
  Admin: <ShieldAlert className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Logout: <LogOut className="w-5 h-5" />,
  Search: <Search className="w-5 h-5" />,
  Add: <PlusCircle className="w-5 h-5" />,
  Alert: <AlertTriangle className="w-5 h-5" />,
  Resolved: <CheckCircle2 className="w-5 h-5" />,
  Pending: <Clock className="w-5 h-5" />,
  ChevronRight: <ChevronRight className="w-4 h-4" />,
  Notes: <MessageSquare className="w-4 h-4" />,
  Security: <ShieldCheck className="w-4 h-4" />,
  Delete: <Trash2 className="w-4 h-4" />
};

export const INCIDENT_TYPE_ICONS: Record<string, React.ReactNode> = {
  'Bullying': <UserX className="w-7 h-7" />,
  'Language Misuse': <MessageSquare className="w-7 h-7" />,
  'Digital Misuse': <Globe className="w-7 h-7" />,
  'Academic Dishonesty': <BookOpen className="w-7 h-7" />,
  'Vandalism': <Hammer className="w-7 h-7" />,
  'Medical/Emergency': <Stethoscope className="w-7 h-7" />,
  'Behavioral Issue': <Frown className="w-7 h-7" />,
  'Other': <MoreHorizontal className="w-7 h-7" />
};

export const MOCK_INCIDENTS = [
  {
    id: '1',
    studentName: 'Juan dela Cruz',
    gradeSection: 'Grade 10 - A',
    incidentType: 'Bullying',
    description: 'Physical confrontation in the hallway after lunch.',
    date: '2025-02-10',
    status: 'New',
    reportedBy: 'Anonymous',
    severity: 'High'
  },
  {
    id: '2',
    studentName: 'Mary Anne Valdez',
    gradeSection: 'Grade 8 - C',
    incidentType: 'Academic Dishonesty',
    description: 'Caught using unauthorized materials during Mathematics test.',
    date: '2025-02-11',
    status: 'Under Review',
    reportedBy: 'Teacher',
    severity: 'Medium'
  },
  {
    id: '3',
    studentName: 'Pedro Penduko',
    gradeSection: 'Grade 10 - A',
    incidentType: 'Language Misuse',
    description: 'Repeated use of inappropriate language in the cafeteria.',
    date: '2025-02-12',
    status: 'Under Counseling',
    reportedBy: 'Teacher',
    severity: 'Low'
  },
  {
    id: '4',
    studentName: 'Maria Clara Santos',
    gradeSection: 'Grade 12 - B',
    incidentType: 'Digital Misuse',
    description: 'Cyberbullying incident reported via school forum.',
    date: '2025-02-13',
    status: 'Forwarded',
    reportedBy: 'Anonymous',
    severity: 'High'
  }
];

export const MOCK_USERS = [
  { id: 'u1', name: 'Admin User', role: 'Admin', active: true },
  { id: 'u2', name: 'Mrs. Gatmaitan', role: 'Teacher', active: true },
  { id: 'u3', name: 'Dr. Dimagiba', role: 'Guidance', active: true }
];
