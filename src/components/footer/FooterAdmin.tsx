import { Flex, Link, Text, useColorModeValue } from '@chakra-ui/react';
import { hospital } from 'config/hospital';

export default function Footer() {
  const textColor = useColorModeValue('gray.400', 'white');
  return (
    <Flex
      zIndex="3"
      flexDirection={{ base: 'column', xl: 'row' }}
      alignItems={{ base: 'center', xl: 'start' }}
      justifyContent="space-between"
      px={{ base: '30px', md: '50px' }}
      pb="30px"
      gap="10px"
      color={textColor}
      fontSize="sm"
    >
      <Text textAlign={{ base: 'center', xl: 'start' }}>
        &copy; {new Date().getFullYear()} {hospital.name}. Your records are private and read-only.
      </Text>
      <Flex gap="24px">
        <Link href={`tel:${hospital.phone.replace(/\s/g, '')}`} fontWeight="500">
          {hospital.phone}
        </Link>
        <Link href={`mailto:${hospital.email}`} fontWeight="500">
          Support
        </Link>
      </Flex>
    </Flex>
  );
}
