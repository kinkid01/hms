import { Flex, Link, Text, useColorModeValue } from '@chakra-ui/react';
import { hospital } from 'config/hospital';

export default function Footer(props: { [x: string]: any }) {
  const textColor = useColorModeValue('gray.400', 'white');
  return (
    <Flex
      zIndex="3"
      flexDirection={{ base: 'column', lg: 'row' }}
      alignItems={{ base: 'center', xl: 'start' }}
      gap="10px"
      px={{ base: '30px', md: '0px' }}
      pb="30px"
      mt="auto"
      color={textColor}
      fontSize="sm"
      {...props}
    >
      <Text>
        &copy; {new Date().getFullYear()} {hospital.name}
      </Text>
      <Text display={{ base: 'none', lg: 'block' }}>·</Text>
      <Text>
        Need help signing in?{' '}
        <Link href={`mailto:${hospital.email}`} fontWeight="600">
          Contact the records desk
        </Link>
      </Text>
    </Flex>
  );
}
