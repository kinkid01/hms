// Seed data for the mock API. Shapes follow `types/hms`.
import {
  Appointment,
  Patient,
  PortalNotification,
  Transaction,
  TransactionStatus,
  TransactionType,
  Visit,
} from 'types/hms';

export const DEMO_EMAIL = 'adaeze.okafor@example.com';
export const DEMO_TEMP_PASSWORD = 'Temp@1234';

export const patient: Patient = {
  patientId: 'HSP-2026-001284',
  firstName: 'Adaeze',
  lastName: 'Okafor',
  dateOfBirth: '1992-03-14',
  sex: 'Female',
  email: DEMO_EMAIL,
  phone: '+234 803 555 0142',
  address: '24 Adeola Odeku Street, Victoria Island, Lagos',
  bloodGroup: 'O+',
  genotype: 'AA',
  emergencyContact: {
    name: 'Chinedu Okafor',
    relationship: 'Brother',
    phone: '+234 802 555 0177',
  },
  nextOfKin: {
    name: 'Ngozi Okafor',
    relationship: 'Mother',
    phone: '+234 805 555 0119',
  },
  registeredAt: '2026-01-08',
};

export const visits: Visit[] = [
  {
    id: 'v-1017',
    date: '2026-10-17T09:40:00+01:00',
    department: 'General Outpatient',
    clinician: 'Dr. Tunde Bakare',
    visitType: 'Outpatient',
    reason: 'Recurring fever and headache',
    records: [
      {
        id: 'r-1017-1',
        reference: 'CGH-REC-2026-104871',
        type: 'consultation',
        title: 'Consultation Summary',
        recordedAt: '2026-10-17T09:55:00+01:00',
        recordedBy: 'Dr. Tunde Bakare',
        complaint:
          'Intermittent fever, headache and body aches for 3 days. Reduced appetite.',
        findings:
          'Temp 38.4°C, BP 118/76 mmHg, pulse 96 bpm. Mild pallor. No neck stiffness. Chest clear.',
        plan: 'Malaria parasite test and full blood count. Start treatment pending results. Review in 1 week if symptoms persist.',
      },
      {
        id: 'r-1017-2',
        reference: 'CGH-LAB-2026-058812',
        type: 'lab',
        title: 'Malaria Parasite & Full Blood Count',
        recordedAt: '2026-10-17T11:20:00+01:00',
        recordedBy: 'Lab Scientist A. Yusuf',
        results: [
          { test: 'Malaria Parasite (MP)', result: 'Positive (++)', flag: 'High' },
          { test: 'Haemoglobin', result: '11.2', unit: 'g/dL', range: '12.0 – 15.5', flag: 'Low' },
          { test: 'White Blood Cells', result: '6.8', unit: '×10⁹/L', range: '4.0 – 11.0', flag: 'Normal' },
          { test: 'Platelets', result: '182', unit: '×10⁹/L', range: '150 – 400', flag: 'Normal' },
        ],
        notes: 'Plasmodium falciparum seen.',
      },
      {
        id: 'r-1017-3',
        reference: 'CGH-DX-2026-033190',
        type: 'diagnosis',
        title: 'Diagnosis',
        recordedAt: '2026-10-17T11:45:00+01:00',
        recordedBy: 'Dr. Tunde Bakare',
        diagnoses: [
          { name: 'Uncomplicated falciparum malaria', code: 'B50.9', status: 'Primary' },
          { name: 'Mild anaemia', code: 'D64.9', status: 'Secondary' },
        ],
      },
      {
        id: 'r-1017-4',
        reference: 'CGH-RX-2026-071455',
        type: 'prescription',
        title: 'Prescription',
        recordedAt: '2026-10-17T11:50:00+01:00',
        recordedBy: 'Dr. Tunde Bakare',
        items: [
          { drug: 'Artemether/Lumefantrine 80/480 mg', dosage: '1 tablet', frequency: 'Twice daily', duration: '3 days' },
          { drug: 'Paracetamol 500 mg', dosage: '2 tablets', frequency: 'Every 8 hours as needed', duration: '3 days' },
          { drug: 'Ferrous sulphate 200 mg', dosage: '1 tablet', frequency: 'Once daily', duration: '30 days' },
        ],
        notes: 'Take Artemether/Lumefantrine with food or milk.',
      },
    ],
  },
  {
    id: 'v-0822',
    date: '2026-08-22T13:10:00+01:00',
    department: 'Internal Medicine',
    clinician: 'Dr. Ngozi Eze',
    visitType: 'Follow-up',
    reason: 'Blood pressure review',
    records: [
      {
        id: 'r-0822-1',
        reference: 'CGH-REC-2026-091204',
        type: 'consultation',
        title: 'Follow-up Consultation',
        recordedAt: '2026-08-22T13:25:00+01:00',
        recordedBy: 'Dr. Ngozi Eze',
        complaint: 'Routine review of elevated blood pressure noted at last visit.',
        findings: 'BP 132/84 mmHg (repeat 128/82). BMI 26.1. No headaches or chest pain.',
        plan: 'Lifestyle modification. Lipid profile. Repeat BP check in 3 months.',
      },
      {
        id: 'r-0822-2',
        reference: 'CGH-LAB-2026-049930',
        type: 'lab',
        title: 'Lipid Profile',
        recordedAt: '2026-08-22T15:05:00+01:00',
        recordedBy: 'Lab Scientist B. Okon',
        results: [
          { test: 'Total Cholesterol', result: '5.4', unit: 'mmol/L', range: '< 5.2', flag: 'High' },
          { test: 'LDL Cholesterol', result: '3.3', unit: 'mmol/L', range: '< 3.4', flag: 'Normal' },
          { test: 'HDL Cholesterol', result: '1.4', unit: 'mmol/L', range: '> 1.2', flag: 'Normal' },
          { test: 'Triglycerides', result: '1.6', unit: 'mmol/L', range: '< 1.7', flag: 'Normal' },
        ],
      },
      {
        id: 'r-0822-3',
        reference: 'CGH-TX-2026-012876',
        type: 'treatment',
        title: 'Treatment Summary',
        recordedAt: '2026-08-22T15:30:00+01:00',
        recordedBy: 'Dr. Ngozi Eze',
        summary:
          'High-normal blood pressure with borderline cholesterol. No medication started. Advised reduced salt intake, regular exercise (30 minutes, 5 days a week) and weight reduction.',
        followUp: 'Blood pressure review in November 2026.',
      },
    ],
  },
  {
    id: 'v-0505',
    date: '2026-05-05T10:00:00+01:00',
    department: 'Dental Clinic',
    clinician: 'Dr. Ibrahim Musa',
    visitType: 'Outpatient',
    reason: 'Bleeding gums',
    records: [
      {
        id: 'r-0505-1',
        reference: 'CGH-REC-2026-061733',
        type: 'consultation',
        title: 'Dental Consultation',
        recordedAt: '2026-05-05T10:15:00+01:00',
        recordedBy: 'Dr. Ibrahim Musa',
        complaint: 'Bleeding gums when brushing for 2 weeks.',
        findings: 'Generalised plaque and calculus deposits. Mild gingival inflammation. No caries.',
        plan: 'Scaling and polishing. Oral hygiene instruction.',
      },
      {
        id: 'r-0505-2',
        reference: 'CGH-TX-2026-007412',
        type: 'treatment',
        title: 'Scaling & Polishing',
        recordedAt: '2026-05-05T10:50:00+01:00',
        recordedBy: 'Dr. Ibrahim Musa',
        summary: 'Full-mouth scaling and polishing completed without complications.',
        followUp: 'Routine dental check in 6 months.',
      },
      {
        id: 'r-0505-3',
        reference: 'CGH-RX-2026-040981',
        type: 'prescription',
        title: 'Prescription',
        recordedAt: '2026-05-05T10:55:00+01:00',
        recordedBy: 'Dr. Ibrahim Musa',
        items: [
          { drug: 'Chlorhexidine 0.2% mouthwash', dosage: '10 mL', frequency: 'Twice daily', duration: '7 days' },
        ],
      },
    ],
  },
  {
    id: 'v-0202',
    date: '2026-02-02T19:30:00+01:00',
    department: 'Emergency',
    clinician: 'Dr. Funke Adeyemi',
    visitType: 'Emergency',
    reason: 'Right ankle injury',
    records: [
      {
        id: 'r-0202-1',
        reference: 'CGH-REC-2026-018245',
        type: 'consultation',
        title: 'Emergency Assessment',
        recordedAt: '2026-02-02T19:45:00+01:00',
        recordedBy: 'Dr. Funke Adeyemi',
        complaint: 'Twisted right ankle while descending stairs. Pain and swelling.',
        findings: 'Swelling over lateral malleolus. Able to bear weight with pain. X-ray: no fracture.',
        plan: 'RICE protocol, analgesia, compression bandage.',
      },
      {
        id: 'r-0202-2',
        reference: 'CGH-DX-2026-005511',
        type: 'diagnosis',
        title: 'Diagnosis',
        recordedAt: '2026-02-02T20:30:00+01:00',
        recordedBy: 'Dr. Funke Adeyemi',
        diagnoses: [{ name: 'Sprain of right ankle (lateral ligament)', code: 'S93.4', status: 'Primary' }],
      },
      {
        id: 'r-0202-3',
        reference: 'CGH-RX-2026-009364',
        type: 'prescription',
        title: 'Prescription',
        recordedAt: '2026-02-02T20:35:00+01:00',
        recordedBy: 'Dr. Funke Adeyemi',
        items: [
          { drug: 'Ibuprofen 400 mg', dosage: '1 tablet', frequency: 'Every 8 hours after meals', duration: '5 days' },
        ],
      },
    ],
  },
];

// Appointments are scheduled by hospital staff; patients can only view them.
export const appointments: Appointment[] = [
  {
    id: 'a-1124',
    date: '2026-10-24T10:00:00+01:00',
    durationMinutes: 20,
    department: 'General Outpatient',
    clinician: 'Dr. Tunde Bakare',
    purpose: 'Malaria treatment review',
    location: 'GOPD, Block A, Room 4',
    status: 'Scheduled',
    instructions: 'Bring your remaining medication. Arrive 15 minutes early.',
  },
  {
    id: 'a-1105',
    date: '2026-11-05T09:30:00+01:00',
    durationMinutes: 30,
    department: 'Dental Clinic',
    clinician: 'Dr. Ibrahim Musa',
    purpose: 'Routine 6-month dental check',
    location: 'Dental Clinic, Block C, Ground Floor',
    status: 'Scheduled',
  },
  {
    id: 'a-1120',
    date: '2026-11-20T13:00:00+01:00',
    durationMinutes: 20,
    department: 'Internal Medicine',
    clinician: 'Dr. Ngozi Eze',
    purpose: 'Blood pressure review',
    location: 'Medical Outpatient, Block B, Room 12',
    status: 'Scheduled',
    instructions: 'Avoid caffeine for 2 hours before your appointment.',
  },
  {
    id: 'a-0822',
    date: '2026-08-22T13:00:00+01:00',
    durationMinutes: 20,
    department: 'Internal Medicine',
    clinician: 'Dr. Ngozi Eze',
    purpose: 'Blood pressure review',
    location: 'Medical Outpatient, Block B, Room 12',
    status: 'Completed',
    visitId: 'v-0822',
  },
  {
    id: 'a-0710',
    date: '2026-07-10T11:00:00+01:00',
    durationMinutes: 20,
    department: 'Internal Medicine',
    clinician: 'Dr. Ngozi Eze',
    purpose: 'Blood pressure review',
    location: 'Medical Outpatient, Block B, Room 12',
    status: 'Missed',
  },
  {
    id: 'a-0505',
    date: '2026-05-05T10:00:00+01:00',
    durationMinutes: 30,
    department: 'Dental Clinic',
    clinician: 'Dr. Ibrahim Musa',
    purpose: 'Bleeding gums',
    location: 'Dental Clinic, Block C, Ground Floor',
    status: 'Completed',
    visitId: 'v-0505',
  },
];

// Transactions are listed oldest → newest here so balances can be computed;
// the API returns them newest first.
const ledger: [string, string, TransactionType, number, TransactionStatus, string, string?][] = [
  ['2026-02-02T19:20:00+01:00', 'Wallet Funding', 'Credit', 25000, 'Successful', 'Cash Point'],
  ['2026-02-02T20:40:00+01:00', 'Emergency Consultation', 'Debit', 10000, 'Successful', 'Wallet', 'Emergency'],
  ['2026-02-02T20:50:00+01:00', 'Pharmacy Purchase', 'Debit', 2500, 'Successful', 'Wallet', 'Pharmacy'],
  ['2026-05-05T09:50:00+01:00', 'Dental Scaling & Polishing', 'Debit', 8000, 'Successful', 'Wallet', 'Dental Clinic'],
  ['2026-08-22T13:00:00+01:00', 'Wallet Funding', 'Credit', 15000, 'Successful', 'Bank Transfer'],
  ['2026-08-22T13:30:00+01:00', 'Consultation', 'Debit', 5000, 'Successful', 'Wallet', 'Internal Medicine'],
  ['2026-08-22T15:10:00+01:00', 'Laboratory Test', 'Debit', 10000, 'Successful', 'Wallet', 'Laboratory'],
  ['2026-10-10T08:15:00+01:00', 'Wallet Funding', 'Credit', 30000, 'Successful', 'Bank Transfer'],
  ['2026-10-17T09:45:00+01:00', 'Consultation', 'Debit', 5000, 'Successful', 'Wallet', 'General Outpatient'],
  ['2026-10-17T11:25:00+01:00', 'Laboratory Test', 'Debit', 7500, 'Successful', 'Wallet', 'Laboratory'],
  ['2026-10-17T12:05:00+01:00', 'Pharmacy Purchase', 'Debit', 6200, 'Successful', 'Wallet', 'Pharmacy'],
  ['2026-10-18T07:30:00+01:00', 'Wallet Funding', 'Credit', 20000, 'Expired', 'Bank Transfer'],
  ['2026-10-18T07:55:00+01:00', 'Wallet Funding', 'Credit', 20000, 'Successful', 'Bank Transfer'],
];

export const buildSeedTransactions = (): { transactions: Transaction[]; balance: number } => {
  let balance = 0;
  const transactions = ledger.map(([date, description, type, amount, status, method, service], i) => {
    const before = balance;
    if (status === 'Successful') balance += type === 'Credit' ? amount : -amount;
    return {
      id: `TXN-2026-${String(800100 + i * 37).padStart(6, '0')}`,
      date,
      description,
      type,
      amount,
      status,
      method,
      service,
      balanceBefore: before,
      balanceAfter: balance,
    };
  });
  return { transactions: transactions.reverse(), balance };
};

export const seedNotifications: PortalNotification[] = [
  {
    id: 'n-7',
    kind: 'appointment',
    title: 'Appointment scheduled',
    body: 'Malaria treatment review with Dr. Tunde Bakare on 24 Oct at 10:00 AM.',
    createdAt: '2026-10-17T12:00:00+01:00',
    read: false,
    href: '/portal/appointments',
  },
  {
    id: 'n-6',
    kind: 'wallet',
    title: 'Wallet funded',
    body: 'Your wallet was credited with ₦20,000 via bank transfer.',
    createdAt: '2026-10-18T07:56:00+01:00',
    read: false,
    href: '/portal/wallet/transactions',
  },
  {
    id: 'n-5',
    kind: 'payment-failed',
    title: 'Payment session expired',
    body: 'A ₦20,000 funding session expired before payment was received.',
    createdAt: '2026-10-18T07:51:00+01:00',
    read: false,
    href: '/portal/wallet/transactions',
  },
  {
    id: 'n-4',
    kind: 'prescription',
    title: 'New prescription',
    body: 'Dr. Tunde Bakare added a prescription to your 17 Oct visit.',
    createdAt: '2026-10-17T11:51:00+01:00',
    read: false,
    href: '/portal/medical-records/v-1017',
  },
  {
    id: 'n-3',
    kind: 'lab',
    title: 'Laboratory results available',
    body: 'Your Malaria Parasite & Full Blood Count results are ready.',
    createdAt: '2026-10-17T11:21:00+01:00',
    read: true,
    href: '/portal/medical-records/v-1017',
  },
  {
    id: 'n-2',
    kind: 'security',
    title: 'New sign-in',
    body: 'Your account was accessed from a new device in Lagos, NG.',
    createdAt: '2026-10-10T08:02:00+01:00',
    read: true,
  },
  {
    id: 'n-1',
    kind: 'record',
    title: 'New medical record',
    body: 'A treatment summary was added to your 22 Aug visit.',
    createdAt: '2026-08-22T15:31:00+01:00',
    read: true,
    href: '/portal/medical-records/v-0822',
  },
];

// Placeholder virtual account details returned by the payment provider.
export const virtualAccount = {
  bankName: 'Wema Bank',
  accountName: 'CGH Wallet / Adaeze Okafor',
};
