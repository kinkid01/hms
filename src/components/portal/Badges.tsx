import { Badge } from '@chakra-ui/react';
import { recordTypeColor, recordTypeLabel, statusColor } from 'lib/format';
import { RecordType, TransactionStatus } from 'types/hms';

export function StatusBadge({ status }: { status: TransactionStatus }) {
  return (
    <Badge colorScheme={statusColor[status]} variant="subtle" textTransform="none" fontSize="xs">
      {status}
    </Badge>
  );
}

export function RecordTypeBadge({ type }: { type: RecordType }) {
  return (
    <Badge colorScheme={recordTypeColor[type]} variant="subtle" textTransform="none" fontSize="xs">
      {recordTypeLabel[type]}
    </Badge>
  );
}
