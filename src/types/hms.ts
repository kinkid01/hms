// Domain types for the patient portal. These mirror the shapes the backend
// is expected to return, so the mock API in `lib/api` can be swapped out
// without touching the pages.

export type Sex = 'Male' | 'Female';

export interface Contact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Patient {
  patientId: string; // e.g. HSP-2026-001284 (resolves from the card barcode)
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO date
  sex: Sex;
  email: string;
  phone: string;
  address: string;
  bloodGroup: string;
  genotype?: string;
  emergencyContact: Contact;
  nextOfKin: Contact;
  registeredAt: string; // ISO date
}

export interface Session {
  token: string;
  email: string;
  mustChangePassword: boolean;
  lastLoginAt: string;
}

// ---------- Medical records ----------

export type RecordType =
  | 'consultation'
  | 'diagnosis'
  | 'prescription'
  | 'lab'
  | 'treatment';

interface RecordBase {
  id: string;
  reference: string; // printed on the PDF for verification
  type: RecordType;
  title: string;
  recordedAt: string; // ISO datetime
  recordedBy: string;
}

export interface ConsultationRecord extends RecordBase {
  type: 'consultation';
  complaint: string;
  findings: string;
  plan: string;
}

export interface DiagnosisRecord extends RecordBase {
  type: 'diagnosis';
  diagnoses: { name: string; code?: string; status: 'Primary' | 'Secondary' }[];
  notes?: string;
}

export interface PrescriptionRecord extends RecordBase {
  type: 'prescription';
  items: { drug: string; dosage: string; frequency: string; duration: string }[];
  notes?: string;
}

export interface LabRecord extends RecordBase {
  type: 'lab';
  results: {
    test: string;
    result: string;
    unit?: string;
    range?: string;
    flag?: 'High' | 'Low' | 'Normal';
  }[];
  notes?: string;
}

export interface TreatmentRecord extends RecordBase {
  type: 'treatment';
  summary: string;
  followUp?: string;
}

export type MedicalRecord =
  | ConsultationRecord
  | DiagnosisRecord
  | PrescriptionRecord
  | LabRecord
  | TreatmentRecord;

export interface Visit {
  id: string;
  date: string; // ISO datetime
  department: string;
  clinician: string;
  visitType: 'Outpatient' | 'Inpatient' | 'Emergency' | 'Follow-up';
  reason: string;
  records: MedicalRecord[];
}

export type VisitSummary = Omit<Visit, 'records'> & {
  recordCount: number;
  recordTypes: RecordType[];
};

// ---------- Appointments (read-only; booking is a future feature) ----------

export type AppointmentStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'Missed';

export interface Appointment {
  id: string;
  date: string; // ISO datetime
  durationMinutes: number;
  department: string;
  clinician: string;
  purpose: string;
  location: string;
  status: AppointmentStatus;
  instructions?: string;
  visitId?: string; // set once the appointment has become a visit
}

// ---------- Wallet ----------

export type TransactionType = 'Credit' | 'Debit';
export type TransactionStatus = 'Successful' | 'Pending' | 'Failed' | 'Expired';

export interface Transaction {
  id: string;
  date: string; // ISO datetime
  description: string;
  type: TransactionType;
  amount: number; // in Naira, always positive; sign comes from `type`
  status: TransactionStatus;
  method: string; // e.g. Bank Transfer, Wallet
  service?: string; // related hospital service, for debits
  balanceBefore: number;
  balanceAfter: number;
}

export interface Wallet {
  balance: number;
  currency: 'NGN';
  updatedAt: string;
}

export type PaymentSessionStatus = 'pending' | 'successful' | 'expired' | 'failed';

export interface PaymentSession {
  reference: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  expiresAt: string; // ISO datetime, 20 minutes after creation
  status: PaymentSessionStatus;
}

// ---------- Notifications ----------

export type NotificationKind =
  | 'wallet'
  | 'payment-failed'
  | 'record'
  | 'lab'
  | 'prescription'
  | 'appointment'
  | 'security';

export interface PortalNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href?: string;
}
