import { AppointmentStatus, RecordType, TransactionStatus } from 'types/hms';

const naira = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const formatNaira = (amount: number) => naira.format(amount);

export const formatSignedNaira = (amount: number, type: 'Credit' | 'Debit') =>
  `${type === 'Credit' ? '+' : '-'}${naira.format(amount)}`;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatDateTime = (iso: string) =>
  `${formatDate(iso)}, ${formatTime(iso)}`;

export const ageFrom = (isoDob: string) => {
  const dob = new Date(isoDob);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
};

export const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
};

export const recordTypeLabel: Record<RecordType, string> = {
  consultation: 'Consultation',
  diagnosis: 'Diagnosis',
  prescription: 'Prescription',
  lab: 'Laboratory Result',
  treatment: 'Treatment Summary',
};

export const recordTypeColor: Record<RecordType, string> = {
  consultation: 'blue',
  diagnosis: 'purple',
  prescription: 'orange',
  lab: 'teal',
  treatment: 'green',
};

export const appointmentStatusColor: Record<AppointmentStatus, string> = {
  Scheduled: 'blue',
  Completed: 'green',
  Cancelled: 'gray',
  Missed: 'red',
};

/** Local calendar-day key (YYYY-MM-DD) for grouping by date. */
export const dayKey = (d: Date | string) => {
  const date = typeof d === 'string' ? new Date(d) : d;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const daysUntil = (iso: string) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const target = new Date(iso);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - start.getTime()) / 86_400_000);
};

export const statusColor: Record<TransactionStatus, string> = {
  Successful: 'green',
  Pending: 'orange',
  Failed: 'red',
  Expired: 'gray',
};
