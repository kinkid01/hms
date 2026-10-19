import {
  Box,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { StatusBadge } from 'components/portal/Badges';
import { formatDate, formatNaira, formatSignedNaira, formatTime } from 'lib/format';
import { useState } from 'react';
import { MdArrowDownward, MdArrowUpward } from 'react-icons/md';
import { Transaction } from 'types/hms';

const wideCell = { base: 'none', md: 'table-cell' };

function amountColor(t: Transaction) {
  if (t.status !== 'Successful') return 'secondaryGray.600';
  return t.type === 'Credit' ? 'green.500' : 'red.500';
}

export function TransactionIcon({ type }: { type: Transaction['type'] }) {
  const credit = type === 'Credit';
  return (
    <Flex
      align="center"
      justify="center"
      w="36px"
      h="36px"
      minW="36px"
      borderRadius="full"
      bg={credit ? 'green.100' : 'red.100'}
    >
      <Icon as={credit ? MdArrowDownward : MdArrowUpward} color={credit ? 'green.500' : 'red.500'} />
    </Flex>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Flex justify="space-between" py="10px" gap="16px">
      <Text color="secondaryGray.600" fontSize="sm">
        {label}
      </Text>
      <Box fontSize="sm" fontWeight="600" textAlign="right">
        {value}
      </Box>
    </Flex>
  );
}

export function TransactionDetail({ tx }: { tx: Transaction }) {
  return (
    <Box>
      <Flex direction="column" align="center" py="20px">
        <TransactionIcon type={tx.type} />
        <Text fontSize="3xl" fontWeight="700" color={amountColor(tx)} mt="10px">
          {formatSignedNaira(tx.amount, tx.type)}
        </Text>
        <Text color="secondaryGray.600">{tx.description}</Text>
      </Flex>
      <Divider />
      <DetailRow label="Transaction ID" value={tx.id} />
      <DetailRow label="Date" value={formatDate(tx.date)} />
      <DetailRow label="Time" value={formatTime(tx.date)} />
      <DetailRow label="Type" value={tx.type} />
      <DetailRow label="Status" value={<StatusBadge status={tx.status} />} />
      <DetailRow label="Payment method" value={tx.method} />
      {tx.service && <DetailRow label="Hospital service" value={tx.service} />}
      <Divider my="6px" />
      <DetailRow label="Previous balance" value={formatNaira(tx.balanceBefore)} />
      <DetailRow label="Resulting balance" value={formatNaira(tx.balanceAfter)} />
    </Box>
  );
}

/** Transaction list; selecting a row opens its details (PRD §17). */
export default function TransactionTable({
  transactions,
  compact = false,
}: {
  transactions: Transaction[];
  compact?: boolean;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = useState<Transaction | null>(null);
  const hoverBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.50');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const drawerBg = useColorModeValue('white', 'navy.800');
  const tableSize = useBreakpointValue({ base: 'sm', md: 'md' });

  const open = (t: Transaction) => {
    setSelected(t);
    onOpen();
  };

  return (
    <>
      <Box overflowX="auto">
        {/* Phones: Description | Amount (+status). md+: full columns. */}
        <Table variant="simple" size={tableSize}>
          <Thead>
            <Tr>
              <Th borderColor={borderColor} ps="0">Description</Th>
              {!compact && <Th borderColor={borderColor} display={wideCell}>Date</Th>}
              {!compact && <Th borderColor={borderColor} display={{ base: 'none', lg: 'table-cell' }}>Type</Th>}
              <Th borderColor={borderColor} isNumeric pe={{ base: 0, md: undefined }}>Amount</Th>
              <Th borderColor={borderColor} pe="0" textAlign="right" display={wideCell}>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.map((t) => (
              <Tr
                key={t.id}
                cursor="pointer"
                _hover={{ bg: hoverBg }}
                onClick={() => open(t)}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && open(t)}
              >
                <Td borderColor={borderColor} ps="0" py="12px">
                  <Flex align="center" gap={{ base: '10px', md: '12px' }}>
                    <TransactionIcon type={t.type} />
                    <Box minW="0">
                      <Text fontWeight="700" fontSize="sm" noOfLines={1}>
                        {t.description}
                      </Text>
                      <Text fontSize="xs" color="secondaryGray.600" display={compact ? 'block' : { base: 'block', md: 'none' }}>
                        {formatDate(t.date)}
                      </Text>
                      {!compact && (
                        <Text fontSize="xs" color="secondaryGray.600" display={{ base: 'none', md: 'block' }}>
                          {t.service ?? t.method}
                        </Text>
                      )}
                    </Box>
                  </Flex>
                </Td>
                {!compact && (
                  <Td borderColor={borderColor} fontSize="sm" whiteSpace="nowrap" display={wideCell}>
                    {formatDate(t.date)}
                  </Td>
                )}
                {!compact && (
                  <Td borderColor={borderColor} fontSize="sm" display={{ base: 'none', lg: 'table-cell' }}>
                    {t.type}
                  </Td>
                )}
                <Td
                  borderColor={borderColor}
                  isNumeric
                  fontWeight="700"
                  fontSize="sm"
                  color={amountColor(t)}
                  whiteSpace="nowrap"
                  pe={{ base: 0, md: undefined }}
                >
                  {formatSignedNaira(t.amount, t.type)}
                  <Box display={{ base: 'block', md: 'none' }} mt="4px">
                    <StatusBadge status={t.status} />
                  </Box>
                </Td>
                <Td borderColor={borderColor} pe="0" textAlign="right" display={wideCell}>
                  <StatusBadge status={t.status} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="sm">
        <DrawerOverlay />
        <DrawerContent bg={drawerBg}>
          <DrawerCloseButton />
          <DrawerHeader>Transaction details</DrawerHeader>
          <DrawerBody>{selected && <TransactionDetail tx={selected} />}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
