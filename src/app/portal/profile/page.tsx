'use client';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Icon,
  SimpleGrid,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { PageLoader } from 'components/portal/LoadState';
import { usePortal } from 'contexts/PortalContext';
import { ageFrom, formatDate } from 'lib/format';
import { MdBloodtype, MdEditNote, MdLock } from 'react-icons/md';
import { Contact } from 'types/hms';

function Field({ label, value }: { label: string; value?: string }) {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  return (
    <Box>
      <Text fontSize="xs" fontWeight="700" textTransform="uppercase" color="secondaryGray.600" mb="2px">
        {label}
      </Text>
      <Text fontWeight="600" color={textColor} wordBreak="break-word">
        {value || '—'}
      </Text>
    </Box>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  return (
    <Card>
      <Text fontSize="lg" fontWeight="700" color={textColor} mb="18px">
        {title}
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap="18px">
        {children}
      </SimpleGrid>
    </Card>
  );
}

const contactFields = (c: Contact) => (
  <>
    <Field label="Name" value={c.name} />
    <Field label="Relationship" value={c.relationship} />
    <Field label="Phone" value={c.phone} />
  </>
);

export default function ProfilePage() {
  const { patient } = usePortal();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const chipBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  if (!patient) return <PageLoader />;
  const fullName = `${patient.firstName} ${patient.lastName}`;

  return (
    <Box>
      <Card mb={{ base: '12px', md: '20px' }}>
        <Flex direction={{ base: 'column', md: 'row' }} align={{ base: 'flex-start', md: 'center' }} gap={{ base: '12px', md: '20px' }}>
          <Avatar name={fullName} size="xl" bg="#11047A" color="white" />
          <Box flex="1">
            <Text fontSize="2xl" fontWeight="700" color={textColor}>
              {fullName}
            </Text>
            <Text color="secondaryGray.600" mb="10px">
              Patient ID <b>{patient.patientId}</b> · Registered {formatDate(patient.registeredAt)}
            </Text>
            <Flex gap="8px" wrap="wrap">
              <Badge bg={chipBg} textTransform="none" display="flex" alignItems="center" gap="4px">
                <Icon as={MdBloodtype} color="red.500" /> {patient.bloodGroup}
              </Badge>
              {patient.genotype && (
                <Badge bg={chipBg} textTransform="none">
                  Genotype {patient.genotype}
                </Badge>
              )}
              <Badge bg={chipBg} textTransform="none">
                {patient.sex}, {ageFrom(patient.dateOfBirth)} yrs
              </Badge>
            </Flex>
          </Box>
          <Tooltip label="Coming soon — corrections will be reviewed by hospital staff" hasArrow>
            <Button variant="light" leftIcon={<Icon as={MdEditNote} />} isDisabled w={{ base: '100%', md: 'auto' }}>
              Request information update
            </Button>
          </Tooltip>
        </Flex>
      </Card>

      <Alert status="info" borderRadius="16px" mb={{ base: '12px', md: '20px' }} fontSize="sm">
        <AlertIcon as={MdLock} />
        <AlertDescription>
          Your profile is managed by the hospital and is read-only. If anything is incorrect, please contact the
          records desk.
        </AlertDescription>
      </Alert>

      <SimpleGrid columns={{ base: 1, xl: 2 }} gap={{ base: '12px', md: '20px' }}>
        <Section title="Personal information">
          <Field label="Full name" value={fullName} />
          <Field label="Patient ID" value={patient.patientId} />
          <Field label="Date of birth" value={formatDate(patient.dateOfBirth)} />
          <Field label="Age" value={`${ageFrom(patient.dateOfBirth)} years`} />
          <Field label="Sex" value={patient.sex} />
          <Field label="Registration date" value={formatDate(patient.registeredAt)} />
        </Section>
        <Section title="Contact details">
          <Field label="Email address" value={patient.email} />
          <Field label="Phone number" value={patient.phone} />
          <Box gridColumn={{ md: 'span 2' }}>
            <Field label="Residential address" value={patient.address} />
          </Box>
        </Section>
        <Section title="Clinical information">
          <Field label="Blood group" value={patient.bloodGroup} />
          <Field label="Genotype" value={patient.genotype ?? 'Not recorded'} />
        </Section>
        <Section title="Emergency contact">{contactFields(patient.emergencyContact)}</Section>
        <Section title="Next of kin">{contactFields(patient.nextOfKin)}</Section>
      </SimpleGrid>
    </Box>
  );
}
