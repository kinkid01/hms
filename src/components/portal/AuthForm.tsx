// Shared heading/container for the auth pages so they line up with the
// template's auth layout.
import { Box, Flex, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import { ReactNode } from 'react';

export default function AuthForm({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
}) {
  const textColor = useColorModeValue('navy.700', 'white');
  return (
    <Flex
      maxW={{ base: '100%', md: 'max-content' }}
      w="100%"
      mx={{ base: 'auto', lg: '0px' }}
      me="auto"
      h="100%"
      alignItems="start"
      justifyContent="center"
      mb={{ base: '30px', md: '60px' }}
      px={{ base: '25px', md: '0px' }}
      mt={{ base: '28px', md: '10vh' }}
      flexDirection="column"
    >
      <Box me="auto" mb="30px" maxW="420px">
        <Heading color={textColor} fontSize={{ base: '28px', md: '36px' }} mb="10px">
          {title}
        </Heading>
        <Text ms="4px" color="gray.400" fontWeight="400" fontSize="md">
          {subtitle}
        </Text>
      </Box>
      <Flex direction="column" w={{ base: '100%', md: '420px' }} maxW="100%" me="auto">
        {children}
      </Flex>
    </Flex>
  );
}
