'use client';
import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { RecordTypeBadge } from 'components/portal/Badges';
import { EmptyState, ErrorState, PageLoader } from 'components/portal/LoadState';
import * as api from 'lib/api';
import { formatDate, recordTypeLabel } from 'lib/format';
import { useAsync } from 'lib/useAsync';
import NextLink from 'next/link';
import { useMemo, useState } from 'react';
import { MdChevronRight, MdLock, MdSearch } from 'react-icons/md';
import { RecordType } from 'types/hms';

export default function MedicalRecords() {
  const { data, loading, error, reload } = useAsync(api.listVisits);
  const [query, setQuery] = useState('');
  const [type, setType] = useState<RecordType | ''>('');

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const rowHover = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const lineColor = useColorModeValue('secondaryGray.400', 'whiteAlpha.200');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? []).filter(
      (v) =>
        (!type || v.recordTypes.includes(type)) &&
        (!q ||
          [v.department, v.clinician, v.reason, v.visitType].some((s) =>
            s.toLowerCase().includes(q),
          )),
    );
  }, [data, query, type]);

  // Group visits by year for the timeline.
  const byYear = useMemo(() => {
    const groups: Record<string, typeof filtered> = {};
    filtered.forEach((v) => {
      const y = new Date(v.date).getFullYear().toString();
      (groups[y] ??= []).push(v);
    });
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [filtered]);

  return (
    <Box>
      <Card mb={{ base: '12px', md: '20px' }}>
        <Flex direction={{ base: 'column', md: 'row' }} gap="12px" align={{ md: 'center' }}>
          <Box flex="1">
            <Text fontSize="lg" fontWeight="700" color={textColor}>
              Your hospital visits
            </Text>
            <Flex align="center" gap="6px" color="secondaryGray.600" fontSize="sm">
              <Icon as={MdLock} />
              Records are read-only and maintained by the hospital.
            </Flex>
          </Box>
          <InputGroup maxW={{ md: '260px' }}>
            <InputLeftElement pointerEvents="none">
              <Icon as={MdSearch} color="secondaryGray.600" />
            </InputLeftElement>
            <Input
              variant="main"
              placeholder="Search department, doctor…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              ps="40px"
            />
          </InputGroup>
          <Select
            variant="main"
            maxW={{ md: '200px' }}
            value={type}
            onChange={(e) => setType(e.target.value as RecordType | '')}
          >
            <option value="">All record types</option>
            {Object.entries(recordTypeLabel).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </Select>
        </Flex>
      </Card>

      <Card>
        {loading ? (
          <PageLoader label="Loading your records…" />
        ) : error ? (
          <ErrorState message={error.message} onRetry={reload} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No matching visits"
            description="Try a different search or record type."
          />
        ) : (
          byYear.map(([year, list]) => (
            <Box key={year} mb="10px">
              <Text fontWeight="800" color="secondaryGray.600" fontSize="sm" mb="8px">
                {year}
              </Text>
              {list.map((v) => (
                <Flex
                  key={v.id}
                  as={NextLink}
                  href={`/portal/medical-records/${v.id}`}
                  align="center"
                  gap="16px"
                  p="14px"
                  borderRadius="16px"
                  _hover={{ bg: rowHover }}
                  borderLeft="3px solid"
                  borderColor={lineColor}
                  ms="6px"
                  mb="8px"
                >
                  <Box textAlign="center" minW="56px">
                    <Text fontSize="2xl" fontWeight="800" color={textColor} lineHeight="1">
                      {new Date(v.date).getDate()}
                    </Text>
                    <Text fontSize="xs" color="secondaryGray.600" textTransform="uppercase">
                      {new Date(v.date).toLocaleString('en-NG', { month: 'short' })}
                    </Text>
                  </Box>
                  <Box flex="1" minW="0">
                    <Text fontWeight="700" color={textColor}>
                      {v.department}{' '}
                      <Text as="span" fontWeight="400" color="secondaryGray.600" fontSize="sm">
                        · {v.visitType}
                      </Text>
                    </Text>
                    <Text fontSize="sm" color="secondaryGray.600" noOfLines={1}>
                      {v.clinician} — {v.reason}
                    </Text>
                    <Flex gap="6px" wrap="wrap" mt="8px">
                      {v.recordTypes.map((t) => (
                        <RecordTypeBadge key={t} type={t} />
                      ))}
                    </Flex>
                  </Box>
                  <Text display={{ base: 'none', md: 'block' }} fontSize="sm" color="secondaryGray.600">
                    {v.recordCount} records
                  </Text>
                  <Button
                    display={{ base: 'none', md: 'inline-flex' }}
                    variant="lightBrand"
                    size="sm"
                    as="span"
                  >
                    View
                  </Button>
                  <Icon display={{ md: 'none' }} as={MdChevronRight} w="22px" h="22px" color="secondaryGray.600" />
                </Flex>
              ))}
            </Box>
          ))
        )}
        {!loading && !error && filtered.length > 0 && (
          <Text fontSize="xs" color="secondaryGray.600" mt="6px">
            Showing {filtered.length} of {data.length} visits · last updated {formatDate(new Date().toISOString())}
          </Text>
        )}
      </Card>
    </Box>
  );
}
