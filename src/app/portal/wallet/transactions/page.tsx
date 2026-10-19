'use client';
import {
  Box,
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
import { EmptyState, ErrorState, PageLoader } from 'components/portal/LoadState';
import TransactionTable from 'components/portal/TransactionTable';
import * as api from 'lib/api';
import { useAsync } from 'lib/useAsync';
import { useMemo, useState } from 'react';
import { MdSearch } from 'react-icons/md';
import { TransactionStatus, TransactionType } from 'types/hms';

export default function TransactionsPage() {
  const { data, loading, error, reload } = useAsync(api.listTransactions);
  const [query, setQuery] = useState('');
  const [type, setType] = useState<TransactionType | ''>('');
  const [status, setStatus] = useState<TransactionStatus | ''>('');
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? []).filter(
      (t) =>
        (!type || t.type === type) &&
        (!status || t.status === status) &&
        (!q || [t.description, t.id, t.service ?? '', t.method].some((s) => s.toLowerCase().includes(q))),
    );
  }, [data, query, type, status]);

  return (
    <Card>
      <Flex direction={{ base: 'column', md: 'row' }} gap="12px" align={{ md: 'center' }} mb="16px">
        <Box flex="1">
          <Text fontSize="lg" fontWeight="700" color={textColor}>
            All transactions
          </Text>
          <Text fontSize="sm" color="secondaryGray.600">
            Select a transaction to see full details.
          </Text>
        </Box>
        <InputGroup maxW={{ md: '240px' }}>
          <InputLeftElement pointerEvents="none">
            <Icon as={MdSearch} color="secondaryGray.600" />
          </InputLeftElement>
          <Input
            variant="main"
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            ps="40px"
          />
        </InputGroup>
        <Select variant="main" maxW={{ md: '150px' }} value={type} onChange={(e) => setType(e.target.value as any)}>
          <option value="">All types</option>
          <option value="Credit">Credits</option>
          <option value="Debit">Debits</option>
        </Select>
        <Select variant="main" maxW={{ md: '160px' }} value={status} onChange={(e) => setStatus(e.target.value as any)}>
          <option value="">All statuses</option>
          <option value="Successful">Successful</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
          <option value="Expired">Expired</option>
        </Select>
      </Flex>

      {loading ? (
        <PageLoader />
      ) : error ? (
        <ErrorState message={error.message} onRetry={reload} />
      ) : filtered.length === 0 ? (
        <EmptyState title="No transactions found" description="Try changing your filters." />
      ) : (
        <TransactionTable transactions={filtered} />
      )}
    </Card>
  );
}
