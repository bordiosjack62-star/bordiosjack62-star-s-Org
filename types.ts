
export enum UserRole {
  ANONYMOUS = 'Anonymous',
  ADMIN = 'Admin',
  TEACHER = 'Teacher',
  GUIDANCE = 'Guidance'
}

export enum IncidentType {
  BULLYING = 'Bullying',
  LANGUAGE = 'Language Misuse',
  DIGITAL = 'Digital Misuse',
  ACADEMIC = 'Academic Dishonesty',
  VANDALISM = 'Vandalism',
  MEDICAL = 'Medical/Emergency',
  BEHAVIORAL = 'Behavioral Issue',
  OTHER = 'Other'
}

export type IncidentStatus = 'New' | 'Under Review' | 'Under Counseling' | 'Action Taken' | 'Resolved' | 'Seen' | 'Forwarded';

export interface Incident {
  id: string;
  studentName: string;
  gradeSection: string;
  incidentType: IncidentType;
  description: string;
  date: string;
  status: IncidentStatus;
  reportedBy: UserRole;
  severity: 'Low' | 'Medium' | 'High';
  adminNotes?: string;
  teacherRemarks?: string;
  guidanceNotes?: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  active: boolean;
}
