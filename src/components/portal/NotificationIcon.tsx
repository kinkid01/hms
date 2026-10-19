import { Flex, FlexProps, Icon } from '@chakra-ui/react';
import {
  MdAccountBalanceWallet,
  MdErrorOutline,
  MdEvent,
  MdLocalPharmacy,
  MdOutlineDescription,
  MdScience,
  MdShield,
} from 'react-icons/md';
import { NotificationKind } from 'types/hms';

const config: Record<NotificationKind, { icon: any; color: string; bg: string }> = {
  wallet: { icon: MdAccountBalanceWallet, color: 'green.500', bg: 'green.100' },
  'payment-failed': { icon: MdErrorOutline, color: 'red.500', bg: 'red.100' },
  record: { icon: MdOutlineDescription, color: 'brand.500', bg: 'brand.100' },
  lab: { icon: MdScience, color: 'teal.500', bg: 'teal.50' },
  prescription: { icon: MdLocalPharmacy, color: 'orange.500', bg: 'orange.100' },
  appointment: { icon: MdEvent, color: 'blue.500', bg: 'blue.50' },
  security: { icon: MdShield, color: 'navy.700', bg: 'secondaryGray.300' },
};

export default function NotificationIcon({ kind, ...rest }: { kind: NotificationKind } & FlexProps) {
  const c = config[kind];
  return (
    <Flex
      align="center"
      justify="center"
      w="40px"
      h="40px"
      minW="40px"
      borderRadius="12px"
      bg={c.bg}
      {...rest}
    >
      <Icon as={c.icon} color={c.color} w="20px" h="20px" />
    </Flex>
  );
}
