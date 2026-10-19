'use client';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { EmptyState, ErrorState, PageLoader } from 'components/portal/LoadState';
import MonthCalendar from 'components/portal/MonthCalendar';
import { hospital } from 'config/hospital';
import * as api from 'lib/api';
import { appointmentStatusColor, dayKey, daysUntil, formatDate, formatTime } from 'lib/format';
import { useAsync } from 'lib/useAsync';
import NextLink from 'next/link';
import { useMemo, useState } from 'react';
import { MdAccessTime, MdEventAvailable, MdInfoOutline, MdLocationOn, MdPerson } from 'react-icons/md';
import { Appointment } from 'types/hms';

const isUpcoming = (a: Appointment) => a.status === 'Scheduled' && new Date(a.date).getTime() >= Date.now();

const relative = (iso: string) => {
  const d = daysUntil(iso);
  return d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : `In ${d} days`;
};

function AppointmentItem({ a }: { a: Appointment }) {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const bg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  return (
    <Box p="16px" borderRadius="16px" bg={bg} mb="10px">
      <Flex justify="space-between" align="flex-start" gap="10px" mb="6px">
        <Text fontWeight="700" color={textColor}>
          {a.purpose}
        </Text>
        <Badge colorScheme={appointmentStatusColor[a.status]} variant="subtle" textTransform="none">
          {a.status}
        </Badge>
      </Flex>
      <Flex direction="column" gap="4px" fontSize="sm" color="secondaryGray.600">
        <Flex align="center" gap="6px">
          <Icon as={MdAccessTime} />
          {formatDate(a.date)} · {formatTime(a.date)} ({a.durationMinutes} min)
        </Flex>
        <Flex align="center" gap="6px">
          <Icon as={MdPerson} />
          {a.clinician} · {a.department}
        </Flex>
        <Flex align="center" gap="6px">
          <Icon as={MdLocationOn} />
          {a.location}
        </Flex>
      </Flex>
      {a.instructions && (
        <Flex align="flex-start" gap="6px" fontSize="sm" mt="10px">
          <Icon as={MdInfoOutline} mt="3px" color="blue.500" />
          <Text>{a.instructions}</Text>
        </Flex>
      )}
      {a.visitId && (
        <Button as={NextLink} href={`/portal/medical-records/${a.visitId}`} size="sm" variant="lightBrand" mt="12px">
          View visit records
        </Button>
      )}
    </Box>
  );
}

export default function AppointmentsPage() {
  const { data, loading, error, reload } = useAsync(api.listAppointments);
  const [month, setMonth] = useState(() => new Date());
  const [selected, setSelected] = useState(() => dayKey(new Date()));
  const dividerColor = useColorModeValue('secondaryGray.100', 'whiteAlpha.100');
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  const upcoming = useMemo(() => (data ?? []).filter(isUpcoming), [data]);
  const next = upcoming[0];
  const onSelectedDay = (data ?? []).filter((a) => dayKey(a.date) === selected);

  const markers = (data ?? []).map((a) => ({
    date: a.date,
    color: isUpcoming(a) ? 'brand.500' : `${appointmentStatusColor[a.status]}.400`,
  }));

  const jumpTo = (a: Appointment) => {
    setMonth(new Date(a.date));
    setSelected(dayKey(a.date));
  };

  if (loading) return <Card><PageLoader label="Loading appointments…" /></Card>;
  if (error) return <Card><ErrorState message={error.message} onRetry={reload} /></Card>;

  return (
    <Box>
      {/* Next appointment */}
      <Card mb={{ base: '12px', md: '20px' }} bg="linear-gradient(135deg, #868CFF 0%, #4318FF 100%)" color="white" p={{ base: '22px', md: '28px' }}>
        {next ? (
          <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" gap="16px" align={{ md: 'center' }}>
            <Flex gap="16px" align="center">
              <Flex direction="column" align="center" justify="center" bg="whiteAlpha.300" borderRadius="16px" w="72px" h="72px" flexShrink={0}>
                <Text fontSize="xs" textTransform="uppercase" opacity={0.85}>
                  {new Date(next.date).toLocaleString('en-NG', { month: 'short' })}
                </Text>
                <Text fontSize="2xl" fontWeight="800" lineHeight="1">
                  {new Date(next.date).getDate()}
                </Text>
              </Flex>
              <Box>
                <Text fontSize="sm" opacity={0.85}>
                  Next appointment · {relative(next.date)}
                </Text>
                <Text fontSize="xl" fontWeight="700">
                  {next.purpose}
                </Text>
                <Text fontSize="sm" opacity={0.85}>
                  {formatTime(next.date)} · {next.clinician} · {next.location}
                </Text>
              </Box>
            </Flex>
            <Button onClick={() => jumpTo(next)} bg="whiteAlpha.300" color="white" _hover={{ bg: 'whiteAlpha.400' }} flexShrink={0} w={{ base: '100%', md: 'auto' }}>
              Show on calendar
            </Button>
          </Flex>
        ) : (
          <Flex align="center" gap="12px">
            <Icon as={MdEventAvailable} w="32px" h="32px" />
            <Text fontWeight="600">You have no upcoming appointments.</Text>
          </Flex>
        )}
      </Card>

      <Grid templateColumns={{ base: '1fr', xl: '3fr 2fr' }} gap={{ base: '12px', md: '20px' }} alignItems="start">
        <Card>
          <MonthCalendar
            month={month}
            onMonthChange={setMonth}
            selected={selected}
            onSelect={setSelected}
            markers={markers}
          />
          <Flex gap="16px" mt="16px" fontSize="xs" color="secondaryGray.600" wrap="wrap">
            {[
              ['brand.500', 'Upcoming'],
              ['green.400', 'Completed'],
              ['red.400', 'Missed'],
              ['gray.400', 'Cancelled'],
            ].map(([c, l]) => (
              <Flex key={l} align="center" gap="6px">
                <Box w="8px" h="8px" borderRadius="full" bg={c} />
                {l}
              </Flex>
            ))}
          </Flex>
        </Card>

        <Box>
          <Card mb={{ base: '12px', md: '20px' }}>
            <Text fontSize="lg" fontWeight="700" color={textColor} mb="12px">
              {formatDate(selected + 'T12:00:00')}
            </Text>
            {onSelectedDay.length ? (
              onSelectedDay.map((a) => <AppointmentItem key={a.id} a={a} />)
            ) : (
              <Text fontSize="sm" color="secondaryGray.600">
                Nothing scheduled on this day.
              </Text>
            )}
          </Card>

          <Card>
            <Text fontSize="lg" fontWeight="700" color={textColor} mb="12px">
              Upcoming
            </Text>
            {upcoming.length ? (
              upcoming.map((a) => (
                <Flex
                  key={a.id}
                  as="button"
                  type="button"
                  onClick={() => jumpTo(a)}
                  w="100%"
                  textAlign="left"
                  justify="space-between"
                  align="center"
                  py="10px"
                  gap="10px"
                  borderBottom="1px solid"
                  borderColor={dividerColor}
                >
                  <Box>
                    <Text fontWeight="600" fontSize="sm" color={textColor}>
                      {a.purpose}
                    </Text>
                    <Text fontSize="xs" color="secondaryGray.600">
                      {formatDate(a.date)} · {formatTime(a.date)} · {a.department}
                    </Text>
                  </Box>
                  <Text fontSize="xs" fontWeight="700" color="brand.500" whiteSpace="nowrap">
                    {relative(a.date)}
                  </Text>
                </Flex>
              ))
            ) : (
              <EmptyState title="No upcoming appointments" />
            )}
          </Card>
        </Box>
      </Grid>

      <Alert status="info" borderRadius="16px" mt={{ base: '12px', md: '20px' }} fontSize="sm">
        <AlertIcon />
        <AlertDescription>
          Appointments are scheduled by the hospital. To reschedule or cancel, call {hospital.phone}.
        </AlertDescription>
      </Alert>
    </Box>
  );
}
