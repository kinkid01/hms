// Chakra Imports
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import AdminNavbarLinks from 'components/navbar/NavbarLinksAdmin';
import { SidebarResponsive } from 'components/sidebar/Sidebar';
import NextLink from 'next/link';
import routes from 'routes';

// Single-row navbar at every size: page title on the left, actions on the
// right. On phones the breadcrumb is hidden to keep the bar short.
export default function AdminNavbar(props: {
  secondary: boolean;
  message: string | boolean;
  brandText: string;
  logoText: string;
  fixed: boolean;
  onOpen: (...args: any[]) => any;
}) {
  const { brandText } = props;

  const mainText = useColorModeValue('navy.700', 'white');
  const secondaryText = useColorModeValue('gray.700', 'white');
  const navbarBg = useColorModeValue('rgba(244, 247, 254, 0.85)', 'rgba(11,20,55,0.85)');

  return (
    <Box
      position="fixed"
      zIndex="10"
      bg={navbarBg}
      backdropFilter="blur(20px)"
      borderRadius="16px"
      top={{ base: '8px', md: '16px', xl: '18px' }}
      right={{ base: '12px', md: '30px' }}
      w={{
        base: 'calc(100vw - 24px)',
        md: 'calc(100vw - 60px)',
        xl: 'calc(100vw - 350px)',
        '2xl': 'calc(100vw - 365px)',
      }}
      px={{ base: '10px', md: '12px' }}
      py="8px"
    >
      <Flex w="100%" align="center" gap={{ base: '6px', md: '12px' }}>
        {/* Menu button — only below xl, where the fixed sidebar is hidden */}
        <SidebarResponsive routes={routes} />
        <Box flex="1" minW="0">
          <Breadcrumb display={{ base: 'none', md: 'block' }} fontSize="sm" color={secondaryText}>
            <BreadcrumbItem>
              <BreadcrumbLink as={NextLink} href="/portal/dashboard">
                Portal
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>{brandText}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <Text
            as="h1"
            color={mainText}
            fontWeight="bold"
            fontSize={{ base: 'lg', '2sm': 'xl', md: '2xl', lg: '34px' }}
            lineHeight="1.25"
            noOfLines={1}
          >
            {brandText}
          </Text>
        </Box>
        <Box flexShrink={0}>
          <AdminNavbarLinks onOpen={props.onOpen} secondary={props.secondary} fixed={props.fixed} />
        </Box>
      </Flex>
    </Box>
  );
}
