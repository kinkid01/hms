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
import { EmptyState } from 'components/portal/LoadState';
import TransactionTable from 'components/portal/TransactionTable';
import * as api from 'lib/api';
import { formatDateTime, formatNaira } from 'lib/format';
import { useAsync } from 'lib/useAsync';
import NextLink from 'next/link';
import { useMemo } from 'react';
import {
  MdAdd,
  MdHealing,
  MdLocalHotel,
  MdLocalPharmacy,
  MdMedicalServices,
  MdReceiptLong,
  MdScience,
} from 'react-icons/md';

const eligible = [
  { label: 'Consultations', icon: MdMedicalServices },
  { label: 'Laboratory tests', icon: MdScience },
  { label: 'Pharmacy', icon: MdLocalPharmacy },
  { label: 'Procedures', icon: MdHealing },
  { label: 'Admission charges', icon: MdLocalHotel },
];

export default function WalletPage() {
  const wallet = useAsync(api.getWallet);
  const transactions = useAsync(api.listTransactions);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const tileBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const brandColor = useColorModeValue('brand.500', 'white');

  // Month-to-date totals from successful transactions.
  const totals = useMemo(() => {
    const now = new Date();
    const thisMonth = (transactions.data ?? []).filter((t) => {
      const d = new Date(t.date);
      return t.status === 'Successful' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const sum = (type: 'Credit' | 'Debit') =>
      thisMonth.filter((t) => t.type === type).reduce((a, t) => a + t.amount, 0);
    return { funded: sum('Credit'), spent: sum('Debit') };
  }, [transactions.data]);

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, lg: 3 }} gap={{ base: '12px', md: '20px' }} mb={{ base: '12px', md: '20px' }}>
        <Card
          gridColumn={{ lg: 'span 2' }}
          bg="linear-gradient(135deg, #868CFF 0%, #4318FF 100%)"
          color="white"
          p={{ base: '22px', md: '30px' }}
        >
          <Text opacity={0.85}>Available balance</Text>
          {wallet.loading ? (
            <Skeleton h="48px" w="220px" my="8px" startColor="whiteAlpha.300" endColor="whiteAlpha.500" />
          ) : (
            <Text fontSize={{ base: '4xl', md: '5xl' }} fontWeight="800" lineHeight="1.2" my="6px">
              {wallet.data ? formatNaira(wallet.data.balance) : '—'}
            </Text>
          )}
          <Text fontSize="sm" opacity={0.75}>
            {wallet.data ? `Updated ${formatDateTime(wallet.data.updatedAt)}` : ' '}
          </Text>
          <Flex gap="12px" mt="24px" wrap="wrap">
            <Button
              as={NextLink}
              href="/portal/wallet/fund"
              leftIcon={<Icon as={MdAdd} />}
              bg="white"
              color="brand.500"
              _hover={{ bg: 'whiteAlpha.900' }}
            >
              Fund Wallet
            </Button>
            <Button
              as={NextLink}
              href="/portal/wallet/transactions"
              leftIcon={<Icon as={MdReceiptLong} />}
              bg="whiteAlpha.300"
              color="white"
              _hover={{ bg: 'whiteAlpha.400' }}
            >
              Transaction History
            </Button>
          </Flex>
        </Card>

        <Card justifyContent="center" gap="18px">
          <Box>
            <Text fontSize="sm" color="secondaryGray.600">
              Funded this month
            </Text>
            <Text fontSize="2xl" fontWeight="700" color="green.500">
              {formatNaira(totals.funded)}
            </Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="secondaryGray.600">
              Spent this month
            </Text>
            <Text fontSize="2xl" fontWeight="700" color={textColor}>
              {formatNaira(totals.spent)}
            </Text>
          </Box>
        </Card>
      </SimpleGrid>

      <Card mb={{ base: '12px', md: '20px' }}>
        <Text fontSize="lg" fontWeight="700" color={textColor} mb="4px">
          What your wallet pays for
        </Text>
        <Text fontSize="sm" color="secondaryGray.600" mb="16px">
          Use your balance at any hospital service point — just present your patient card.
        </Text>
        <SimpleGrid columns={{ base: 2, md: 5 }} gap="12px">
          {eligible.map((e) => (
            <Flex key={e.label} align="center" gap="10px" p="12px" borderRadius="14px" bg={tileBg}>
              <Icon as={e.icon} color={brandColor} w="22px" h="22px" />
              <Text fontSize="sm" fontWeight="600">
                {e.label}
              </Text>
            </Flex>
          ))}
        </SimpleGrid>
      </Card>

      <Card>
        <Flex justify="space-between" align="center" mb="8px">
          <Text fontSize="lg" fontWeight="700" color={textColor}>
            Recent transactions
          </Text>
          <Button as={NextLink} href="/portal/wallet/transactions" variant="action" size="sm">
            View all
          </Button>
        </Flex>
        {transactions.loading ? (
          <Skeleton h="240px" borderRadius="16px" />
        ) : transactions.data?.length ? (
          <TransactionTable transactions={transactions.data.slice(0, 6)} />
        ) : (
          <EmptyState title="No transactions yet" />
        )}
      </Card>
    </Box>
  );
}
