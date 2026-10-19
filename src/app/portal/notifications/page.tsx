'use client';
import { Box, Button, Flex, Tab, TabList, Tabs, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { EmptyState } from 'components/portal/LoadState';
import NotificationIcon from 'components/portal/NotificationIcon';
import { usePortal } from 'contexts/PortalContext';
import { formatDateTime, timeAgo } from 'lib/format';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, unreadCount, markRead, markAllRead } = usePortal();
  const [unreadOnly, setUnreadOnly] = useState(false);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const unreadBg = useColorModeValue('brand.100', 'whiteAlpha.100');
  const hoverBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.200');

  const list = unreadOnly ? notifications.filter((n) => !n.read) : notifications;

  return (
    <Card>
      <Flex justify="space-between" align="center" mb="16px" gap="12px" wrap="wrap">
        <Tabs variant="soft-rounded" colorScheme="brandTabs" size="sm" onChange={(i) => setUnreadOnly(i === 1)}>
          <TabList>
            <Tab>All</Tab>
            <Tab>Unread ({unreadCount})</Tab>
          </TabList>
        </Tabs>
        <Button size="sm" variant="lightBrand" onClick={markAllRead} isDisabled={!unreadCount}>
          Mark all as read
        </Button>
      </Flex>
      {list.length === 0 ? (
        <EmptyState title="You’re all caught up" />
      ) : (
        list.map((n) => (
          <Flex
            key={n.id}
            gap="14px"
            p="14px"
            mb="8px"
            borderRadius="16px"
            bg={n.read ? 'transparent' : unreadBg}
            cursor={n.href ? 'pointer' : 'default'}
            _hover={{ bg: hoverBg }}
            onClick={() => {
              markRead(n.id);
              if (n.href) router.push(n.href);
            }}
          >
            <NotificationIcon kind={n.kind} />
            <Box flex="1">
              <Flex justify="space-between" gap="10px">
                <Text fontWeight={n.read ? '600' : '800'} color={textColor}>
                  {n.title}
                </Text>
                <Text fontSize="xs" color="secondaryGray.600" whiteSpace="nowrap" title={formatDateTime(n.createdAt)}>
                  {timeAgo(n.createdAt)}
                </Text>
              </Flex>
              <Text fontSize="sm" color="secondaryGray.600">
                {n.body}
              </Text>
            </Box>
          </Flex>
        ))
      )}
    </Card>
  );
}
