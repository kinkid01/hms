'use client';
// Printable medical record. In mock mode the patient saves this as PDF from
// the print dialog; the real backend will generate the PDF server-side using
// the same layout.
import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  LightMode,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { RecordTypeBadge } from 'components/portal/Badges';
import { ErrorState, PageLoader } from 'components/portal/LoadState';
import RecordContent from 'components/portal/RecordContent';
import { hospital } from 'config/hospital';
import { useAuth } from 'contexts/AuthContext';
import * as api from 'lib/api';
import { formatDate, formatDateTime } from 'lib/format';
import { useParams, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { MdLocalHospital, MdPrint } from 'react-icons/md';
import { Patient, Visit } from 'types/hms';

function Info({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Text fontSize="10px" fontWeight="700" textTransform="uppercase" color="gray.500">
        {label}
      </Text>
      <Text fontSize="sm" fontWeight="600">
        {value}
      </Text>
    </Box>
  );
}

function PrintableRecord() {
  const { visitId } = useParams<{ visitId: string }>();
  const recordId = useSearchParams().get('record');
  const { session, ready } = useAuth();
  const [data, setData] = useState<{ visit: Visit; patient: Patient } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatedAt] = useState(() => new Date().toISOString());

  useEffect(() => {
    if (!ready || !session) return;
    Promise.all([api.getVisit(visitId), api.getPatient()])
      .then(([visit, patient]) => setData({ visit, patient }))
      .catch((e) => setError(e.message));
  }, [ready, session, visitId]);

  const records = data
    ? recordId
      ? data.visit.records.filter((r) => r.id === recordId)
      : data.visit.records
    : [];

  useEffect(() => {
    if (records.length) {
      const t = setTimeout(() => window.print(), 400);
      return () => clearTimeout(t);
    }
  }, [records.length]);

  if (ready && !session) return <ErrorState message="Please sign in to the patient portal to download records." />;
  if (error) return <ErrorState message={error} />;
  if (!data) return <PageLoader label="Preparing document…" />;
  if (!records.length) return <ErrorState message="Record not found." />;

  const { visit, patient } = data;
  const single = records.length === 1 && recordId;
  const docRef = single ? records[0].reference : `${hospital.shortName}-VIS-${visit.id.toUpperCase()}`;

  return (
    <Box maxW="820px" mx="auto" p={{ base: '20px', md: '40px' }} bg="white" color="gray.800">
      <Flex className="no-print" justify="flex-end" mb="20px">
        <Button leftIcon={<Icon as={MdPrint} />} colorScheme="purple" onClick={() => window.print()}>
          Save as PDF / Print
        </Button>
      </Flex>

      {/* Header */}
      <Flex justify="space-between" align="flex-start" gap={{ base: '12px', md: '20px' }} direction={{ base: 'column', md: 'row' }}>
        <Flex gap="12px" align="center">
          <Flex
            w="48px"
            h="48px"
            borderRadius="12px"
            bg="#422AFB"
            align="center"
            justify="center"
            sx={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}
          >
            <Icon as={MdLocalHospital} color="white" w="28px" h="28px" />
          </Flex>
          <Box>
            <Text fontSize="xl" fontWeight="800">
              {hospital.name}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {hospital.address} · {hospital.phone}
            </Text>
          </Box>
        </Flex>
        <Box textAlign={{ base: 'left', md: 'right' }}>
          <Text fontWeight="800" textTransform="uppercase" fontSize="sm" letterSpacing="1px">
            {single ? 'Medical Record' : 'Visit Record'}
          </Text>
          <Text fontSize="xs" color="gray.500">
            Ref: {docRef}
          </Text>
        </Box>
      </Flex>
      <Divider my="20px" borderColor="gray.300" />

      {/* Patient & visit */}
      <SimpleGrid columns={{ base: 2, md: 4 }} gap="14px" mb="20px">
        <Info label="Patient name" value={`${patient.firstName} ${patient.lastName}`} />
        <Info label="Patient ID" value={patient.patientId} />
        <Info label="Date of birth" value={formatDate(patient.dateOfBirth)} />
        <Info label="Sex" value={patient.sex} />
        <Info label="Visit date" value={formatDateTime(visit.date)} />
        <Info label="Department" value={visit.department} />
        <Info label="Attending" value={visit.clinician} />
        <Info label="Visit type" value={visit.visitType} />
      </SimpleGrid>

      {/* Records */}
      {records.map((r) => (
        <Box key={r.id} border="1px solid" borderColor="gray.200" borderRadius="12px" p="16px" mb="16px" sx={{ breakInside: 'avoid' }}>
          <Flex justify="space-between" align="center" mb="12px" gap="10px" wrap="wrap">
            <Flex align="center" gap="10px">
              <RecordTypeBadge type={r.type} />
              <Text fontWeight="700">{r.title}</Text>
            </Flex>
            <Text fontSize="xs" color="gray.500">
              {formatDateTime(r.recordedAt)} · {r.recordedBy} · {r.reference}
            </Text>
          </Flex>
          <RecordContent record={r} />
        </Box>
      ))}

      {/* Footer */}
      <Divider my="20px" borderColor="gray.300" />
      <Text fontSize="xs" color="gray.600">
        This document was electronically generated by {hospital.name} from the patient’s official
        hospital record on {formatDateTime(generatedAt)}. It does not require a signature. To verify
        its authenticity, contact {hospital.email} quoting reference <b>{docRef}</b>.
      </Text>
    </Box>
  );
}

export default function PrintVisitPage() {
  return (
    <LightMode>
      <Box bg="white" minH="100vh">
        <style>{`@media print { .no-print { display: none !important; } body { background: white !important; } }`}</style>
        <Suspense fallback={<PageLoader />}>
          <PrintableRecord />
        </Suspense>
      </Box>
    </LightMode>
  );
}
