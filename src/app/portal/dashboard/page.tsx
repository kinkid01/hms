'use client';
import {
  Box,
  Button,
  Flex,
  Icon,
  SimpleGrid,
  Skeleton,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import { RecordTypeBadge } from 'components/portal/Badges';
import { EmptyState } from 'components/portal/LoadState';
import TransactionTable from 'components/portal/TransactionTable';
import { usePortal } from 'contexts/PortalContext';
import * as api from 'lib/api';
import { formatDate, formatNaira, formatTime } from 'lib/format';
import { useAsync } from 'lib/useAsync';
import NextLink from 'next/link';
import {
  MdAccountBalanceWallet,
  MdAdd,
  MdBadge,
  MdCalendarMonth,
  MdChevronRight,
  MdDownload,
  MdFolderShared,
  MdLocalHospital,
  MdPerson,
  MdReceiptLong,
} from 'react-icons/md';

const quickActions = [
  { label: 'Medical Records', href: '/portal/medical-records', icon: MdFolderShared },
  { label: 'Fund Wallet', href: '/portal/wallet/fund', icon: MdAdd },
  { label: 'Transaction History', href: '/portal/wallet/transactions', icon: MdReceiptLong },
  { label: 'Profile', href: '/portal/profile', icon: MdPerson },
  { label: 'Download Records', href: '/portal/medical-records', icon: MdDownload },
];

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

export default function Dashboard() {
  const { patient } = usePortal();
  const wallet = useAsync(api.getWallet);
  const visits = useAsync(api.listVisits);
  const transactions = useAsync(api.listTransactions);
  const appointments = useAsync(api.listAppointments);
  const nextAppointment = appointments.data?.find(
    (a) => a.status === 'Scheduled' && new Date(a.date).getTime() >= Date.now(),
  );

  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const tileHover = useColorModeValue('secondaryGray.400', 'whiteAlpha.200');

  const lastVisit = visits.data?.[0];
  const statIcon = (as: any) => (
    <IconBox
      w={{ base: '48px', '2xl': '56px' }}
      h={{ base: '48px', '2xl': '56px' }}
      minW={{ base: '48px', '2xl': '56px' }}
      bg={boxBg}
      icon={<Icon w="26px" h="26px" as={as} color={brandColor} />}
    />
  );

  return (
    <Box>
      {/* Welcome */}
      <Card
        mb={{ base: '12px', md: '20px' }}
        bg="linear-gradient(135deg, #868CFF 0%, #4318FF 100%)"
        color="white"
        p={{ base: '24px', md: '30px' }}
      >
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" gap="16px">
          <Box>
            <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="700">
              {greeting()}, {patient?.firstName ?? '…'}
            </Text>
            <Text opacity={0.85} mt="4px">
              Here’s an overview of your hospital account.
            </Text>
          </Box>
          <Flex align="center" gap="10px" bg="whiteAlpha.200" borderRadius="16px" px="16px" py="10px" h="fit-content">
            <Icon as={MdBadge} w="24px" h="24px" />
            <Box>
              <Text fontSize="xs" opacity={0.8}>
                Patient ID
              </Text>
              <Text fontWeight="700" letterSpacing="0.5px">
                {patient?.patientId ?? '—'}
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Card>

      {/* Stats */}
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={{ base: '12px', md: '20px' }} mb={{ base: '12px', md: '20px' }}>
        <MiniStatistics
          startContent={statIcon(MdAccountBalanceWallet)}
          name="Wallet balance"
          value={wallet.data ? formatNaira(wallet.data.balance) : '…'}
        />
        <MiniStatistics
          startContent={statIcon(MdLocalHospital)}
          name="Most recent visit"
          value={lastVisit ? formatDate(lastVisit.date) : '…'}
          subtitle={lastVisit?.department}
        />
        <Box as={NextLink} href="/portal/appointments" _hover={{ opacity: 0.9 }}>
          <MiniStatistics
            startContent={statIcon(MdCalendarMonth)}
            name="Upcoming appointment"
            value={appointments.loading ? '…' : nextAppointment ? formatDate(nextAppointment.date) : 'None scheduled'}
            subtitle={nextAppointment && `${formatTime(nextAppointment.date)} · ${nextAppointment.department}`}
          />
        </Box>
      </SimpleGrid>

      {/* Quick actions */}
      <Card mb={{ base: '12px', md: '20px' }}>
        <Text fontSize="lg" fontWeight="700" color={textColor} mb="16px">
          Quick actions
        </Text>
        <SimpleGrid columns={{ base: 2, md: 5 }} gap="12px">
          {quickActions.map((a, i) => (
            <Flex
              key={a.label}
              gridColumn={{ base: i === quickActions.length - 1 ? 'span 2' : 'auto', md: 'auto' }}
              as={NextLink}
              href={a.href}
              direction="column"
              align="center"
              justify="center"
              gap="10px"
              p="16px"
              borderRadius="16px"
              bg={boxBg}
              textAlign="center"
              transition="background .2s"
              _hover={{ bg: tileHover }}
            >
              <Icon as={a.icon} w="26px" h="26px" color={brandColor} />
              <Text fontSize="sm" fontWeight="600" color={textColor}>
                {a.label}
              </Text>
            </Flex>
          ))}
        </SimpleGrid>
      </Card>

      <SimpleGrid columns={{ base: 1, xl: 2 }} gap={{ base: '12px', md: '20px' }}>
        {/* Last visit */}
        <Card>
          <Flex justify="space-between" align="center" mb="16px">
            <Text fontSize="lg" fontWeight="700" color={textColor}>
              Most recent visit
            </Text>
            <Button as={NextLink} href="/portal/medical-records" variant="action" size="sm">
              All records
            </Button>
          </Flex>
          {visits.loading ? (
            <Skeleton h="120px" borderRadius="16px" />
          ) : lastVisit ? (
            <Flex
              as={NextLink}
              href={`/portal/medical-records/${lastVisit.id}`}
              direction="column"
              p="18px"
              borderRadius="16px"
              bg={boxBg}
              gap="8px"
              _hover={{ bg: tileHover }}
            >
              <Flex justify="space-between" align="center">
                <Text fontWeight="700" color={textColor}>
                  {lastVisit.department}
                </Text>
                <Icon as={MdChevronRight} w="22px" h="22px" color="secondaryGray.600" />
              </Flex>
              <Text fontSize="sm" color="secondaryGray.600">
                {formatDate(lastVisit.date)} · {lastVisit.clinician} · {lastVisit.visitType}
              </Text>
              <Text fontSize="sm">{lastVisit.reason}</Text>
              <Flex gap="6px" wrap="wrap" mt="4px">
                {lastVisit.recordTypes.map((t) => (
                  <RecordTypeBadge key={t} type={t} />
                ))}
              </Flex>
            </Flex>
          ) : (
            <EmptyState title="No visits yet" />
          )}
        </Card>

        {/* Recent wallet activity */}
        <Card>
          <Flex justify="space-between" align="center" mb="8px">
            <Text fontSize="lg" fontWeight="700" color={textColor}>
              Recent wallet activity
            </Text>
            <Button as={NextLink} href="/portal/wallet/transactions" variant="action" size="sm">
              View all
            </Button>
          </Flex>
          {transactions.loading ? (
            <Skeleton h="200px" borderRadius="16px" />
          ) : (
            <TransactionTable transactions={(transactions.data ?? []).slice(0, 4)} compact />
          )}
        </Card>
      </SimpleGrid>
    </Box>
  );
}
