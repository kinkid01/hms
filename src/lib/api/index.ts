// Patient portal API.
//
// Everything here is MOCKED for frontend development: state lives in
// localStorage and calls resolve after a short delay. When the backend is
// ready, replace each function body with a real request (keeping the same
// signature) and delete `lib/mock`. Patient scoping must happen on the server
// from the session token — never trust IDs sent by the client (PRD §20).

import { PAYMENT_WINDOW_MINUTES } from 'config/hospital';
import {
  DEMO_EMAIL,
  DEMO_TEMP_PASSWORD,
  appointments,
  buildSeedTransactions,
  patient,
  seedNotifications,
  virtualAccount,
  visits,
} from 'lib/mock/data';
import {
  Appointment,
  Patient,
  PaymentSession,
  PortalNotification,
  Session,
  Transaction,
  Visit,
  VisitSummary,
  Wallet,
} from 'types/hms';

export class ApiError extends Error {}

// ---------- mock persistence ----------

interface MockDb {
  password: string;
  mustChangePassword: boolean;
  balance: number;
  transactions: Transaction[];
  payments: Record<string, PaymentSession>;
  notifications: PortalNotification[];
  resetCode?: string;
}

const DB_KEY = 'hms.mock.db';
const SESSION_KEY = 'hms.session';

const seedDb = (): MockDb => {
  const { transactions, balance } = buildSeedTransactions();
  return {
    password: DEMO_TEMP_PASSWORD,
    mustChangePassword: true,
    balance,
    transactions,
    payments: {},
    notifications: seedNotifications,
  };
};

const loadDb = (): MockDb => {
  if (typeof window === 'undefined') return seedDb();
  try {
    const raw = window.localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const db = seedDb();
  saveDb(db);
  return db;
};

const saveDb = (db: MockDb) => {
  try {
    window.localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {}
};

const delay = <T>(value: T, ms = 450): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const randomDigits = (n: number) =>
  Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('');

/** Reset all mock data (handy during development). */
export const resetMockData = () => {
  window.localStorage.removeItem(DB_KEY);
  window.localStorage.removeItem(SESSION_KEY);
};

// ---------- auth ----------

export const getStoredSession = (): Session | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const storeSession = (session: Session | null) => {
  if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else window.localStorage.removeItem(SESSION_KEY);
};

export async function login(email: string, password: string): Promise<Session> {
  const db = loadDb();
  await delay(null, 700);
  if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== db.password) {
    throw new ApiError('Incorrect email or password.');
  }
  const session: Session = {
    token: `mock-${randomDigits(16)}`,
    email: DEMO_EMAIL,
    mustChangePassword: db.mustChangePassword,
    lastLoginAt: new Date().toISOString(),
  };
  storeSession(session);
  return session;
}

export async function logout(): Promise<void> {
  storeSession(null);
}

export async function changePassword(current: string, next: string): Promise<Session> {
  const db = loadDb();
  await delay(null, 700);
  if (current !== db.password) throw new ApiError('Your current password is incorrect.');
  if (current === next) throw new ApiError('New password must be different from your current password.');
  db.password = next;
  db.mustChangePassword = false;
  db.notifications.unshift({
    id: `n-${Date.now()}`,
    kind: 'security',
    title: 'Password changed',
    body: 'Your portal password was changed. If this wasn’t you, contact the hospital immediately.',
    createdAt: new Date().toISOString(),
    read: false,
  });
  saveDb(db);
  const session = { ...getStoredSession(), mustChangePassword: false };
  storeSession(session);
  return session;
}

/** Sends a one-time code to the patient's registered email or phone. */
export async function requestPasswordReset(identifier: string): Promise<{ destination: string }> {
  const db = loadDb();
  db.resetCode = '123456'; // fixed in mock mode so the flow can be tested
  saveDb(db);
  await delay(null, 800);
  // Real backend: respond identically whether or not the account exists.
  const masked = identifier.includes('@')
    ? identifier.replace(/^(.).*(@.*)$/, '$1•••$2')
    : identifier.replace(/.(?=.{3})/g, '•');
  return delay({ destination: masked }, 0);
}

export async function verifyResetCode(code: string): Promise<{ resetToken: string }> {
  const db = loadDb();
  await delay(null, 600);
  if (!db.resetCode || code !== db.resetCode) throw new ApiError('That code is invalid or has expired.');
  return { resetToken: `reset-${randomDigits(10)}` };
}

export async function resetPassword(_resetToken: string, next: string): Promise<void> {
  const db = loadDb();
  await delay(null, 700);
  db.password = next;
  db.mustChangePassword = false;
  db.resetCode = undefined;
  saveDb(db);
}

// ---------- patient ----------

export async function getPatient(): Promise<Patient> {
  return delay(patient);
}

// ---------- medical records ----------

export async function listVisits(): Promise<VisitSummary[]> {
  const summaries = visits
    .map(({ records, ...v }) => ({
      ...v,
      recordCount: records.length,
      recordTypes: Array.from(new Set(records.map((r) => r.type))),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
  return delay(summaries);
}

export async function getVisit(id: string): Promise<Visit> {
  const visit = visits.find((v) => v.id === id);
  await delay(null);
  if (!visit) throw new ApiError('Record not found.');
  return visit;
}

/**
 * Starts a PDF download for a whole visit, or one record within it.
 * Mock: opens the printable view so the browser can "Save as PDF".
 * Real backend: GET /records/:visitId/pdf?record=… returning application/pdf
 * (generated server-side with the verification reference / QR code).
 */
export function downloadRecordPdf(visitId: string, recordId?: string) {
  const qs = recordId ? `?record=${encodeURIComponent(recordId)}` : '';
  window.open(`/print/visit/${encodeURIComponent(visitId)}${qs}`, '_blank', 'noopener');
}

// ---------- appointments ----------

/** All of the patient's appointments, oldest first. Read-only. */
export async function listAppointments(): Promise<Appointment[]> {
  return delay([...appointments].sort((a, b) => a.date.localeCompare(b.date)));
}

// ---------- wallet ----------

export async function getWallet(): Promise<Wallet> {
  const db = loadDb();
  return delay({ balance: db.balance, currency: 'NGN', updatedAt: new Date().toISOString() });
}

export async function listTransactions(): Promise<Transaction[]> {
  return delay(loadDb().transactions);
}

/**
 * Creates a funding transaction and asks the payment provider for virtual
 * account details. The session is valid for PAYMENT_WINDOW_MINUTES.
 */
export async function createPaymentSession(amount: number): Promise<PaymentSession> {
  const db = loadDb();
  await delay(null, 1000);
  const session: PaymentSession = {
    reference: `CGH-FND-${randomDigits(10)}`,
    amount,
    bankName: virtualAccount.bankName,
    accountName: virtualAccount.accountName,
    accountNumber: `78${randomDigits(8)}`,
    expiresAt: new Date(Date.now() + PAYMENT_WINDOW_MINUTES * 60_000).toISOString(),
    status: 'pending',
  };
  db.payments[session.reference] = session;
  saveDb(db);
  return session;
}

/** Status is decided by the backend (via provider webhook), not the UI timer. */
export async function getPaymentSession(reference: string): Promise<PaymentSession> {
  const db = loadDb();
  const session = db.payments[reference];
  if (!session) throw new ApiError('Payment session not found.');
  if (session.status === 'pending' && Date.now() > new Date(session.expiresAt).getTime()) {
    session.status = 'expired';
    recordFunding(db, session, 'Expired');
    saveDb(db);
  }
  return delay(session, 300);
}

const recordFunding = (db: MockDb, session: PaymentSession, status: 'Successful' | 'Expired') => {
  const before = db.balance;
  if (status === 'Successful') db.balance += session.amount;
  db.transactions.unshift({
    id: `TXN-2026-${randomDigits(6)}`,
    date: new Date().toISOString(),
    description: 'Wallet Funding',
    type: 'Credit',
    amount: session.amount,
    status,
    method: 'Bank Transfer',
    balanceBefore: before,
    balanceAfter: db.balance,
  });
  db.notifications.unshift({
    id: `n-${Date.now()}`,
    kind: status === 'Successful' ? 'wallet' : 'payment-failed',
    title: status === 'Successful' ? 'Wallet funded' : 'Payment session expired',
    body:
      status === 'Successful'
        ? `Your wallet was credited with ₦${session.amount.toLocaleString()} via bank transfer.`
        : `A ₦${session.amount.toLocaleString()} funding session expired before payment was received.`,
    createdAt: new Date().toISOString(),
    read: false,
    href: '/portal/wallet/transactions',
  });
};

/**
 * MOCK ONLY — stands in for the provider webhook confirming a transfer.
 * There is no equivalent in the real API.
 */
export async function mockSimulateTransfer(reference: string): Promise<void> {
  const db = loadDb();
  const session = db.payments[reference];
  if (!session || session.status !== 'pending') return;
  session.status = 'successful';
  recordFunding(db, session, 'Successful');
  saveDb(db);
}

// ---------- notifications ----------

export async function listNotifications(): Promise<PortalNotification[]> {
  return delay(loadDb().notifications, 250);
}

export async function markNotificationRead(id: string): Promise<void> {
  const db = loadDb();
  const n = db.notifications.find((x) => x.id === id);
  if (n) n.read = true;
  saveDb(db);
}

export async function markAllNotificationsRead(): Promise<void> {
  const db = loadDb();
  db.notifications.forEach((n) => (n.read = true));
  saveDb(db);
}
