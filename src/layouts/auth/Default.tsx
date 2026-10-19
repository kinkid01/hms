// Chakra imports
import { Box, Flex, Icon, List, ListIcon, ListItem, Text, useColorModeValue } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAuth';
import FixedPlugin from 'components/fixedPlugin/FixedPlugin';
import { hospital } from 'config/hospital';
import { ReactNode } from 'react';
import { MdCheckCircle, MdLocalHospital } from 'react-icons/md';

const benefits = [
  'View your visit history and medical records',
  'Download records as PDF for another doctor',
  'Fund your hospital wallet without the cash point',
  'Track every payment and wallet transaction',
];

function AuthIllustration(props: { children: ReactNode; illustrationBackground?: string }) {
  const authBg = useColorModeValue('white', 'navy.900');
  const { children } = props;
  return (
    <Flex minH="100vh" w="100%" bg={authBg} position="relative" overflowX="hidden">
      <Flex
        minH="100vh"
        w="100%"
        maxW={{ base: '100%', md: '420px', lg: '1313px' }}
        mx={{ md: 'auto' }}
        px={{ lg: '30px', xl: '0px' }}
        ps={{ xl: '70px' }}
        justifyContent="start"
        direction="column"
      >
        <Flex align="center" gap="10px" mt={{ base: '24px', md: '40px' }} ps={{ base: '25px', md: '0px' }}>
          <Flex
            align="center"
            justify="center"
            w="36px"
            h="36px"
            borderRadius="10px"
            bg="linear-gradient(135deg, #868CFF 0%, #4318FF 100%)"
          >
            <Icon as={MdLocalHospital} color="white" w="22px" h="22px" />
          </Flex>
          <Text fontWeight="800" color={useColorModeValue('navy.700', 'white')}>
            {hospital.name}
          </Text>
        </Flex>
        {children}
        <Box
          display={{ base: 'none', lg: 'block' }}
          h="100%"
          minH="100vh"
          w={{ lg: '46vw', '2xl': '44vw' }}
          position="absolute"
          top="0"
          right="0px"
        >
          <Flex
            bg="linear-gradient(160deg, #868CFF 0%, #4318FF 55%, #11047A 100%)"
            direction="column"
            justify="center"
            w="100%"
            h="100%"
            position="absolute"
            borderBottomLeftRadius={{ lg: '120px', xl: '200px' }}
            color="white"
            px={{ md: '60px', xl: '90px' }}
          >
            <Icon as={MdLocalHospital} w="64px" h="64px" mb="20px" opacity={0.9} />
            <Text fontSize={{ md: '3xl', xl: '4xl' }} fontWeight="800" lineHeight="1.2" mb="12px">
              Your hospital card, now online.
            </Text>
            <Text fontSize="lg" opacity={0.85} mb="28px" maxW="460px">
              Sign in with the email and password the hospital gave you at registration.
            </Text>
            <List spacing="12px">
              {benefits.map((b) => (
                <ListItem key={b} display="flex" alignItems="center">
                  <ListIcon as={MdCheckCircle} color="whiteAlpha.900" />
                  {b}
                </ListItem>
              ))}
            </List>
          </Flex>
        </Box>
        <Footer mb={{ xl: '3vh' }} />
      </Flex>
      <FixedPlugin />
    </Flex>
  );
}

export default AuthIllustration;
