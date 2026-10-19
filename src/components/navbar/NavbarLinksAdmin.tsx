'use client';
// Chakra Imports
import {
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
// Custom Components
import NotificationIcon from 'components/portal/NotificationIcon';
import { useAuth } from 'contexts/AuthContext';
import { usePortal } from 'contexts/PortalContext';
import { timeAgo } from 'lib/format';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
// Assets
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { MdNotificationsNone } from 'react-icons/md';

export default function HeaderLinks(props: {
  secondary: boolean;
  onOpen: boolean | any;
  fixed: boolean | any;
}) {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  const { signOut } = useAuth();
  const { patient, notifications, unreadCount, markRead, markAllRead } = usePortal();
  // Chakra Color Mode
  const navbarIcon = useColorModeValue('gray.400', 'white');
  let menuBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorBrand = useColorModeValue('brand.700', 'brand.400');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const hoverBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(112, 144, 176, 0.06)',
  );

  const fullName = patient ? `${patient.firstName} ${patient.lastName}` : '';

  return (
    <Flex
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      p={{ base: '6px', md: '10px' }}
      ps={{ base: '12px', md: '16px' }}
      borderRadius="30px"
      boxShadow={shadow}
      gap={{ base: '2px', md: '6px' }}
    >
      {patient && (
        <Text
          display={{ base: 'none', xl: 'block' }}
          fontSize="sm"
          fontWeight="700"
          color="secondaryGray.600"
          me="8px"
        >
          {patient.patientId}
        </Text>
      )}
      <Menu>
        <MenuButton p="0px" position="relative" aria-label="Notifications">
          <Icon
            mt="6px"
            as={MdNotificationsNone}
            color={navbarIcon}
            w="20px"
            h="20px"
            me="10px"
          />
          {unreadCount > 0 && (
            <Box
              position="absolute"
              top="2px"
              right="6px"
              minW="16px"
              h="16px"
              px="4px"
              borderRadius="full"
              bg="red.500"
              color="white"
              fontSize="10px"
              fontWeight="700"
              lineHeight="16px"
              textAlign="center"
            >
              {unreadCount}
            </Box>
          )}
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="20px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
          mt="22px"
          me={{ base: '0px', md: 'unset' }}
          minW={{ base: 'unset', md: '400px', xl: '420px' }}
          maxW={{ base: 'calc(100vw - 24px)', md: 'unset' }}
        >
          <Flex w="100%" mb="16px">
            <Text fontSize="md" fontWeight="600" color={textColor}>
              Notifications
            </Text>
            {unreadCount > 0 && (
              <Text
                fontSize="sm"
                fontWeight="500"
                color={textColorBrand}
                ms="auto"
                cursor="pointer"
                onClick={markAllRead}
              >
                Mark all read
              </Text>
            )}
          </Flex>
          <Flex flexDirection="column">
            {notifications.slice(0, 4).map((n) => (
              <MenuItem
                key={n.id}
                _hover={{ bg: hoverBg }}
                _focus={{ bg: hoverBg }}
                bg="transparent"
                px="8px"
                py="10px"
                borderRadius="12px"
                onClick={() => {
                  markRead(n.id);
                  if (n.href) router.push(n.href);
                }}
              >
                <NotificationIcon kind={n.kind} me="12px" />
                <Flex direction="column" flex="1" minW="0">
                  <Flex align="center" gap="6px">
                    <Text fontSize="sm" fontWeight={n.read ? '500' : '700'} color={textColor}>
                      {n.title}
                    </Text>
                    {!n.read && <Box w="7px" h="7px" borderRadius="full" bg="brand.500" />}
                  </Flex>
                  <Text fontSize="xs" color="secondaryGray.600" noOfLines={2}>
                    {n.body}
                  </Text>
                </Flex>
                <Text fontSize="xs" color="secondaryGray.600" ms="8px" whiteSpace="nowrap">
                  {timeAgo(n.createdAt)}
                </Text>
              </MenuItem>
            ))}
          </Flex>
          <Button
            as={NextLink}
            href="/portal/notifications"
            variant="lightBrand"
            w="100%"
            mt="12px"
            size="sm"
          >
            View all notifications
          </Button>
        </MenuList>
      </Menu>

      <Button
        variant="no-hover"
        bg="transparent"
        p="0px"
        minW="unset"
        minH="unset"
        h="18px"
        w="max-content"
        onClick={toggleColorMode}
        aria-label="Toggle colour mode"
      >
        <Icon
          me="10px"
          h="18px"
          w="18px"
          color={navbarIcon}
          as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
        />
      </Button>
      <Menu>
        <MenuButton p="0px" aria-label="Account menu">
          <Avatar
            name={fullName || undefined}
            bg="#11047A"
            color="white"
            size="sm"
            w={{ base: '34px', md: '40px' }}
            h={{ base: '34px', md: '40px' }}
          />
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="0px"
          mt="10px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
        >
          <Flex
            direction="column"
            ps="20px"
            pt="16px"
            pb="10px"
            borderBottom="1px solid"
            borderColor={borderColor}
          >
            <Text fontSize="sm" fontWeight="700" color={textColor}>
              👋&nbsp; Hi, {patient?.firstName}
            </Text>
            <Text fontSize="xs" color="secondaryGray.600">
              {patient?.patientId}
            </Text>
          </Flex>
          <Flex flexDirection="column" p="10px">
            <MenuItem
              as={NextLink}
              href="/portal/profile"
              _hover={{ bg: hoverBg }}
              bg="transparent"
              borderRadius="8px"
              px="14px"
            >
              <Text fontSize="sm">My Profile</Text>
            </MenuItem>
            <MenuItem
              as={NextLink}
              href="/portal/settings"
              _hover={{ bg: hoverBg }}
              bg="transparent"
              borderRadius="8px"
              px="14px"
            >
              <Text fontSize="sm">Settings</Text>
            </MenuItem>
            <MenuItem
              _hover={{ bg: hoverBg }}
              bg="transparent"
              color="red.400"
              borderRadius="8px"
              px="14px"
              onClick={() => signOut()}
            >
              <Text fontSize="sm">Log out</Text>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
}
