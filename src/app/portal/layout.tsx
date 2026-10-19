'use client';
// Chakra imports
import { Portal, Box, useDisclosure, useColorModeValue } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin';
// Layout components
import Navbar from 'components/navbar/NavbarAdmin';
import { PageLoader } from 'components/portal/LoadState';
import Sidebar from 'components/sidebar/Sidebar';
import { useAuth } from 'contexts/AuthContext';
import { PortalProvider } from 'contexts/PortalContext';
import { SidebarContext } from 'contexts/SidebarContext';
import { usePathname, useRouter } from 'next/navigation';
import { PropsWithChildren, useEffect, useState } from 'react';
import routes, { hiddenRoutes } from 'routes';
import { getActiveNavbar, getActiveRoute } from 'utils/navigation';

const titleRoutes = [...routes, ...hiddenRoutes];

// `dvh` follows the visible viewport on mobile (excludes the browser's
// address bar); browsers without support fall back to `vh`.
const fullHeight = {
  height: '100vh',
  '@supports (height: 100dvh)': { height: '100dvh' },
};

export default function PortalLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  const { session, ready } = useAuth();
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const { onOpen } = useDisclosure();
  const bg = useColorModeValue('secondaryGray.300', 'navy.900');

  useEffect(() => {
    window.document.documentElement.dir = 'ltr';
  }, []);

  // Client-side guard for the mock. The real backend must also reject
  // unauthenticated API calls; this only controls what the UI shows.
  useEffect(() => {
    if (!ready) return;
    if (!session) router.replace(`/auth/sign-in?next=${encodeURIComponent(pathname)}`);
    else if (session.mustChangePassword) router.replace('/auth/change-password');
  }, [ready, session, router, pathname]);

  if (!ready || !session || session.mustChangePassword) {
    return (
      <Box h="100vh" bg={bg}>
        <PageLoader />
      </Box>
    );
  }

  const brandText = getActiveRoute(titleRoutes, pathname);

  return (
    <PortalProvider>
      <Box bg={bg} sx={fullHeight} w="100%" overflow="hidden">
        <SidebarContext.Provider value={{ toggleSidebar, setToggleSidebar }}>
          <Sidebar routes={routes} display="none" />
          <Box
            float="right"
            height="100%"
            overflowY="auto"
            overflowX="hidden"
            position="relative"
            w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
            maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
            transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
            transitionDuration=".2s, .2s, .35s"
            transitionProperty="top, bottom, width"
            transitionTimingFunction="linear, linear, ease"
          >
            <Portal>
              <Box>
                <Navbar
                  onOpen={onOpen}
                  logoText="Patient Portal"
                  brandText={brandText}
                  secondary={getActiveNavbar(titleRoutes, pathname)}
                  message={brandText}
                  fixed={false}
                />
              </Box>
            </Portal>

            <Box
              mx="auto"
              maxW="1600px"
              px={{ base: '12px', md: '30px' }}
              pb={{ base: '20px', md: '30px' }}
              pt={{ base: '80px', md: '115px', lg: '125px' }}
              minH="calc(100% - 90px)"
            >
              {children}
            </Box>
            <Box>
              <Footer />
            </Box>
          </Box>
        </SidebarContext.Provider>
      </Box>
    </PortalProvider>
  );
}
