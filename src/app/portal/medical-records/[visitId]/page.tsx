'use client';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Icon,
  SimpleGrid,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { RecordTypeBadge } from 'components/portal/Badges';
import { ErrorState, PageLoader } from 'components/portal/LoadState';
import RecordContent from 'components/portal/RecordContent';
import * as api from 'lib/api';
import { formatDate, formatDateTime, formatTime } from 'lib/format';
import { useAsync } from 'lib/useAsync';
import NextLink from 'next/link';
import { useParams } from 'next/navigation';
import { MdArrowBack, MdDownload, MdLock } from 'react-icons/md';

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Text fontSize="xs" fontWeight="700" textTransform="uppercase" color="secondaryGray.600">
        {label}
      </Text>
      <Text fontWeight="600">{value}</Text>
    </Box>
  );
}

export default function VisitDetails() {
  const { visitId } = useParams<{ visitId: string }>();
  const { data: visit, loading, error, reload } = useAsync(() => api.getVisit(visitId), [visitId]);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const itemBorder = useColorModeValue('secondaryGray.100', 'whiteAlpha.100');

  return (
    <Box>
      <Button
        as={NextLink}
        href="/portal/medical-records"
        variant="ghost"
        leftIcon={<Icon as={MdArrowBack} />}
        mb="12px"
        size="sm"
      >
        Back to medical records
      </Button>

      {loading ? (
        <Card>
          <PageLoader label="Loading visit…" />
        </Card>
      ) : error ? (
        <Card>
          <ErrorState message={error.message} onRetry={reload} />
        </Card>
      ) : (
        <>
          <Card mb={{ base: '12px', md: '20px' }}>
            <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" gap="16px" mb={{ base: '12px', md: '20px' }}>
              <Box>
                <Text fontSize="2xl" fontWeight="700" color={textColor}>
                  {visit.department}
                </Text>
                <Text color="secondaryGray.600">{visit.reason}</Text>
              </Box>
              <Button
                variant="brand"
                leftIcon={<Icon as={MdDownload} />}
                onClick={() => api.downloadRecordPdf(visit.id)}
                w={{ base: '100%', md: 'auto' }}
                flexShrink={0}
              >
                Download full visit (PDF)
              </Button>
            </Flex>
            <SimpleGrid columns={{ base: 2, md: 4 }} gap="16px">
              <Meta label="Date" value={formatDateTime(visit.date)} />
              <Meta label="Visit type" value={visit.visitType} />
              <Meta label="Attending" value={visit.clinician} />
              <Meta label="Records" value={String(visit.records.length)} />
            </SimpleGrid>
          </Card>

          <Card>
            <Flex align="center" gap="6px" color="secondaryGray.600" fontSize="sm" mb="12px">
              <Icon as={MdLock} />
              These records are part of your official hospital file and can’t be edited here.
            </Flex>
            <Accordion allowMultiple defaultIndex={[0]}>
              {visit.records.map((r) => (
                <AccordionItem key={r.id} borderColor={itemBorder}>
                  <AccordionButton py="16px" px="4px">
                    <Flex flex="1" align="center" gap="12px" textAlign="left" wrap="wrap">
                      <RecordTypeBadge type={r.type} />
                      <Text fontWeight="700" color={textColor}>
                        {r.title}
                      </Text>
                      <Text fontSize="sm" color="secondaryGray.600">
                        {formatTime(r.recordedAt)} · {r.recordedBy}
                      </Text>
                    </Flex>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel px="4px" pb="20px">
                    <RecordContent record={r} />
                    <Flex
                      mt="16px"
                      justify="space-between"
                      align="center"
                      gap="10px"
                      direction={{ base: 'column', md: 'row' }}
                    >
                      <Text fontSize="xs" color="secondaryGray.600">
                        Ref: {r.reference} · Recorded {formatDate(r.recordedAt)}
                      </Text>
                      <Button
                        size="sm"
                        variant="lightBrand"
                        leftIcon={<Icon as={MdDownload} />}
                        onClick={() => api.downloadRecordPdf(visit.id, r.id)}
                      >
                        Download PDF
                      </Button>
                    </Flex>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </>
      )}
    </Box>
  );
}
