// Renders the body of a medical record. Shared by the visit page and the
// printable PDF view, so both always show the same clinical content.
import {
  Badge,
  Box,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import { MedicalRecord } from 'types/hms';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box>
      <Text fontSize="xs" fontWeight="700" textTransform="uppercase" color="secondaryGray.600" mb="2px">
        {label}
      </Text>
      <Text fontSize="sm">{children}</Text>
    </Box>
  );
}

const flagColor = { High: 'red', Low: 'orange', Normal: 'green' } as const;

export default function RecordContent({ record }: { record: MedicalRecord }) {
  const headBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  switch (record.type) {
    case 'consultation':
      return (
        <SimpleGrid columns={1} spacing="14px">
          <Field label="Presenting complaint">{record.complaint}</Field>
          <Field label="Examination findings">{record.findings}</Field>
          <Field label="Plan">{record.plan}</Field>
        </SimpleGrid>
      );

    case 'diagnosis':
      return (
        <Box overflowX="auto">
          <Table size="sm">
            <Thead bg={headBg}>
              <Tr>
                <Th>Diagnosis</Th>
                <Th>ICD-10</Th>
                <Th>Type</Th>
              </Tr>
            </Thead>
            <Tbody>
              {record.diagnoses.map((d) => (
                <Tr key={d.name}>
                  <Td fontWeight="600">{d.name}</Td>
                  <Td>{d.code ?? '—'}</Td>
                  <Td>{d.status}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {record.notes && <Text fontSize="sm" mt="12px">{record.notes}</Text>}
        </Box>
      );

    case 'prescription':
      return (
        <Box overflowX="auto">
          <Table size="sm">
            <Thead bg={headBg}>
              <Tr>
                <Th>Medication</Th>
                <Th>Dosage</Th>
                <Th>Frequency</Th>
                <Th>Duration</Th>
              </Tr>
            </Thead>
            <Tbody>
              {record.items.map((i) => (
                <Tr key={i.drug}>
                  <Td fontWeight="600">{i.drug}</Td>
                  <Td>{i.dosage}</Td>
                  <Td>{i.frequency}</Td>
                  <Td>{i.duration}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {record.notes && (
            <Text fontSize="sm" mt="12px">
              <b>Note:</b> {record.notes}
            </Text>
          )}
        </Box>
      );

    case 'lab':
      return (
        <Box overflowX="auto">
          <Table size="sm">
            <Thead bg={headBg}>
              <Tr>
                <Th>Test</Th>
                <Th>Result</Th>
                <Th>Reference range</Th>
                <Th>Flag</Th>
              </Tr>
            </Thead>
            <Tbody>
              {record.results.map((r) => (
                <Tr key={r.test}>
                  <Td fontWeight="600">{r.test}</Td>
                  <Td>
                    {r.result} {r.unit}
                  </Td>
                  <Td>{r.range ?? '—'}</Td>
                  <Td>
                    {r.flag ? (
                      <Badge colorScheme={flagColor[r.flag]} variant="subtle" textTransform="none">
                        {r.flag}
                      </Badge>
                    ) : (
                      '—'
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {record.notes && <Text fontSize="sm" mt="12px">{record.notes}</Text>}
        </Box>
      );

    case 'treatment':
      return (
        <SimpleGrid columns={1} spacing="14px">
          <Field label="Summary">{record.summary}</Field>
          {record.followUp && <Field label="Follow-up">{record.followUp}</Field>}
        </SimpleGrid>
      );
  }
}
