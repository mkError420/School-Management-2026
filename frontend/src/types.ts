export type UserRole = 'super_admin' | 'admin' | 'teacher' | 'staff' | 'guardian' | 'student';

export type Language = 'bn' | 'en';

export interface User {
  id: string;
  name: string;
  nameBangla: string;
  email?: string;
  username: string;
  role: UserRole;
  avatar?: string;
  phone: string;
  designation?: string;
  permissions: string[];
  studentId?: string; // For guardian/student role
  tenantId?: string; // For multitenancy
}

export interface Tenant {
  id: string;
  tenantCode: string;
  schoolNameEn: string;
  schoolNameBn: string;
  domain: string;
  subdomain: string;
  address: string;
  upazila: string;
  district: string;
  phone: string;
  email: string;
  logoUrl?: string;
  status: 'active' | 'suspended' | 'inactive';
  subscriptionPlan: 'free' | 'basic' | 'premium' | 'enterprise';
  subscriptionExpiry?: string;
  maxStudents: number;
  maxTeachers: number;
  settings?: Record<string, any>;
  userCount?: number;
  studentCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SystemStats {
  totalTenants: number;
  activeTenants: number;
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  recentLogins: number;
  dbSizeMb: number;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentRoll: number;
  className: string;
  section: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  inTime?: string;
  markedBy: string;
  markedByName: string;
  smsSent: boolean;
  smsStatus?: 'delivered' | 'pending' | 'failed' | 'not_sent';
  remarks?: string;
}

export interface SubjectMarks {
  subjectCode: string;
  subjectName: string;
  subjectNameBangla: string;
  writtenMarks: number; // CQ
  mcqMarks: number;     // MCQ
  practicalMarks: number; // Practical
  obtainedMarks: number; // Total
  fullMarks: number;
  grade: 'A+' | 'A' | 'A-' | 'B' | 'C' | 'D' | 'F';
  gradePoint: number;
  isOptional?: boolean; // 4th subject
}

export interface ExamGradeRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentRoll: number;
  className: string;
  section: string;
  examType: '1st_term' | 'mid_term' | 'final' | 'model_test' | 'test_exam';
  examYear: number;
  subjects: SubjectMarks[];
  totalMarks: number;
  totalFullMarks: number;
  percentage: number;
  gpa: number;
  finalGrade: 'A+' | 'A' | 'A-' | 'B' | 'C' | 'D' | 'F';
  isPassed: boolean;
  positionInClass?: number;
  positionInSection?: number;
  attendancePercentage: number;
  conductRemarks: string;
  publishedDate: string;
}

export interface TeacherPayroll {
  id: string;
  voucherNo: string;
  teacherId: string;
  teacherName: string;
  teacherNameBangla: string;
  designation: string;
  month: string; // e.g. "August 2026"
  monthBangla: string;
  year: number;
  basicSalary: number;
  houseRentAllowance: number; // বাড়ি ভাড়া (approx 40-50% of basic)
  medicalAllowance: number;   // চিকিৎসা ভাতা (approx 1500 BDT)
  conveyanceAllowance: number;// যাতায়াত ভাতা
  festivalBonus: number;      // উৎসব বোনাস (Eid/Puja)
  specialAllowance: number;
  grossSalary: number;
  providentFundDeduction: number; // কল্যাণ তহবিল / পিএফ (approx 10%)
  taxDeduction: number;
  advanceLoanDeduction: number;
  totalDeductions: number;
  netPayable: number;
  status: 'pending' | 'approved' | 'disbursed';
  paymentMethod?: 'bKash' | 'Nagad' | 'Bank Transfer' | 'Cash' | 'Rocket';
  disbursedDate?: string;
  transactionRef?: string;
  remarks?: string;
}

export interface ExtracurricularAchievement {
  id: string;
  title: string;
  year: number;
  category: 'sports' | 'olympiad' | 'cultural' | 'debate' | 'scout' | 'science' | 'other';
  level: 'School' | 'Thana / Upazila' | 'District' | 'Division' | 'National' | 'International';
  position: string; // e.g. "Champion", "1st Runner Up", "Gold Medal", "Special Mention"
  description?: string;
}

export interface ExtracurricularActivity {
  clubs: string[]; // e.g. ['Science Club', 'English Debate Club', 'Rover Scout Unit', 'Red Crescent Youth']
  sports: string[]; // e.g. ['Cricket', 'Football', 'Badminton', 'Chess']
  leadershipRoles: string[]; // e.g. ['Class Prefect', 'Scout Patrol Leader', 'Debate Secretary']
  hobbies: string[]; // e.g. ['Robotics', 'Calligraphy', 'Photography', 'Coding']
  achievements: ExtracurricularAchievement[];
}

export interface MedicalHistory {
  bloodGroup: string;
  knownAllergies: string[]; // e.g. ['Peanuts', 'Penicillin', 'Dust & Pollen']
  chronicConditions: string[]; // e.g. ['Mild Asthma', 'Type 1 Diabetes', 'None']
  regularMedications: string[]; // e.g. ['Salbutamol Inhaler (PRN)']
  specialNeeds?: string; // e.g. ['Vision corrective lenses (prescribed)']
  primaryPhysicianName?: string; // e.g. 'Dr. M. A. Karim, MBBS, FCPS'
  primaryPhysicianPhone?: string; // e.g. '+8801711223344'
  emergencyMedicalInstructions?: string; // e.g. 'In case of asthma attack, administer inhaler in sickbay and contact parent immediately.'
  lastHealthCheckupDate?: string;
  vaccinationStatus?: 'Complete' | 'Partial' | 'Exempted';
}

export interface EmergencyContactPerson {
  name: string;
  relation: string; // e.g. 'Father', 'Mother', 'Paternal Uncle', 'Legal Guardian'
  phonePrimary: string;
  phoneSecondary?: string;
  email?: string;
  addressOrWorkplace?: string;
  isAuthorizedForPickup: boolean;
}

export interface EmergencyContactInfo {
  primaryContact: EmergencyContactPerson;
  secondaryContact: EmergencyContactPerson;
  preferredHospital: string; // e.g. 'Dhaka Medical College Hospital'
  ambulanceContact?: string;
  specialPickupInstructions?: string;
}

export interface PreviousAcademicRecord {
  id: string;
  previousSchoolName: string;
  schoolAddress?: string;
  educationBoard: string; // e.g. 'Dhaka Board', 'Chattogram Board', 'NCTB'
  examPassedOrClass: string; // e.g. 'Class 8 Annual', 'JSC / JDC', 'Primary School Certificate (PSC)'
  passingYear: number;
  rollNumber?: string;
  registrationNumber?: string;
  gpaObtained: number;
  percentageOrMarks?: number;
  transferCertificateNo?: string;
  tcDate?: string;
  conductRating?: 'Excellent' | 'Good' | 'Satisfactory';
  remarks?: string;
}

export interface Student {
  id: string;
  studentCode: string; // e.g. "DIMS-2026-042"
  roll: number;
  nameEnglish: string;
  nameBangla: string;
  className: string; // "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"
  section: string;   // "Padma", "Meghna", "Jamuna", "A", "B"
  gender: 'male' | 'female';
  dob?: string;
  dateOfBirth?: string;
  bloodGroup: string;
  birthRegNumber?: string;
  birthCertificateNo?: string; // 17-digit Bangladeshi Birth Certificate No
  religion: 'Islam' | 'Hinduism' | 'Buddhism' | 'Christianity' | string;
  fatherName: string;
  fatherNameBangla?: string;
  fatherNid?: string;
  motherName: string;
  motherNameBangla?: string;
  motherNid?: string;
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string; // Bangladeshi +8801...
  guardianEmail?: string;
  emergencyContact?: string;
  presentAddress: any;
  permanentAddress?: any;
  upazila?: string;
  district?: string;
  admissionDate: string;
  previousSchool?: string;
  sessionYear?: number;
  status: 'active' | 'transferred' | 'graduated';
  avatarUrl: string;
  totalFeesDue?: number;
  totalFeesPaid?: number;
  attendanceRate: number; // e.g. 94.5%
  lastExamGPA?: number;    // e.g. 4.85
  gpa?: number;
  isFeeClear?: boolean;
  
  // Extended Detailed Student Fields
  extracurricular?: ExtracurricularActivity;
  medicalHistory?: MedicalHistory;
  emergencyContactInfo?: EmergencyContactInfo;
  previousAcademicRecords?: PreviousAcademicRecord[];
}

export type StudentFeePayment = FeePayment;

export interface Teacher {
  id: string;
  teacherCode: string;
  nameEnglish: string;
  nameBangla: string;
  designation: string;
  designationBangla: string;
  department: string;
  phone: string;
  email: string;
  nid: string;
  bloodGroup: string;
  joiningDate: string;
  basicSalary: number;
  bankAccountNo?: string;
  bkashNumber?: string;
  avatarUrl: string;
  assignedClasses: { className: string; section: string; subject: string }[];
}

export interface SMSNotification {
  id: string;
  recipientPhone: string;
  studentId?: string;
  studentName: string;
  guardianName: string;
  messageBangla: string;
  messageEnglish: string;
  type: 'attendance_absence' | 'attendance_late' | 'exam_result' | 'fee_due' | 'emergency_notice' | 'school_broadcast';
  status: 'delivered' | 'pending' | 'failed';
  gatewayResponseId?: string;
  costBDT: number;
  sentAt: string;
  characterCount: number;
}

export interface SchoolNotice {
  id: string;
  titleEnglish: string;
  titleBangla: string;
  contentEnglish: string;
  contentBangla: string;
  category: 'academic' | 'holiday' | 'emergency' | 'sports' | 'exam' | 'administrative';
  priority: 'urgent' | 'high' | 'normal';
  publishedBy: string;
  publishedDate: string;
  targetAudience: 'all' | 'students_guardians' | 'teachers' | 'staff';
  smsBroadcastSent: boolean;
  attachedDocument?: string;
}

export interface FeePayment {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  studentRoll: number;
  className: string;
  section: string;
  feeType?: 'Tuition Fee' | 'Exam Fee' | 'Admission Fee' | 'Digital & ICT Fee' | 'Library & Lab Fee' | 'Session Charge' | string;
  feeTypeBangla?: string;
  month: string;
  year?: number;
  amount?: number;
  tuitionFee?: number;
  examFee?: number;
  labIctFee?: number;
  lateFine?: number;
  fineAmount?: number;
  discountAmount?: number;
  waiverDiscount?: number;
  totalAmount?: number;
  netAmount: number;
  paidAmount?: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Cash' | 'Bank' | string;
  transactionId?: string;
  transactionRef?: string;
  paidDate?: string;
  paymentDate?: string;
  collectedBy: string;
  status?: 'paid' | 'pending';
  paymentStatus?: 'paid' | 'pending';
}

export interface GuardianInquiry {
  id: string;
  studentId: string;
  studentName: string;
  guardianName: string;
  guardianPhone: string;
  subject: string;
  message: string;
  status: 'open' | 'answered' | 'resolved';
  createdAt: string;
  response?: string;
  respondedBy?: string;
  respondedAt?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  ipAddress: string;
  action: string;
  module: string;
  status: 'success' | 'warning' | 'error';
  details: string;
}

export interface OfflineSyncItem {
  id: string;
  actionType: 'CREATE_ATTENDANCE' | 'UPDATE_GRADE' | 'DISBURSE_SALARY' | 'CREATE_STUDENT';
  payload: any;
  queuedAt: string;
  retryCount: number;
}
