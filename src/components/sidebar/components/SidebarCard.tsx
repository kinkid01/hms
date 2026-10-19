import { Button, Flex, Icon, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { MdAccountBalanceWallet } from 'react-icons/md';

// Shortcut to the most common patient action: funding the wallet remotely.
export default function SidebarCard() {
  return (
    <Flex
      direction="column"
      align="center"
      bg="linear-gradient(135deg, #868CFF 0%, #4318FF 100%)"
      borderRadius="30px"
      me="20px"
      px="20px"
      py="24px"
      textAlign="center"
    >
      <Flex
        align="center"
        justify="center"
        w="56px"
        h="56px"
        borderRadius="50%"
        bg="whiteAlpha.300"
        mb="14px"
      >
        <Icon as={MdAccountBalanceWallet} color="white" w="28px" h="28px" />
      </Flex>
      <Text fontSize="lg" color="white" fontWeight="bold" mb="8px">
        Skip the cash point
      </Text>
      <Text fontSize="sm" color="white" mb="16px">
        Top up your hospital wallet by bank transfer from anywhere.
      </Text>
      <Button
        as={NextLink}
        href="/portal/wallet/fund"
        bg="whiteAlpha.300"
        _hover={{ bg: 'whiteAlpha.200' }}
        _active={{ bg: 'whiteAlpha.100' }}
        color="white"
        fontWeight="500"
        fontSize="sm"
        w="100%"
      >
        Fund Wallet
      </Button>
    </Flex>
  );
}
