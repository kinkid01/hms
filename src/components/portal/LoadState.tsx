import { Button, Flex, Icon, Spinner, Text } from '@chakra-ui/react';
import { MdErrorOutline, MdInbox } from 'react-icons/md';

export function PageLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <Flex direction="column" align="center" justify="center" py="80px" gap="12px">
      <Spinner color="brand.500" thickness="3px" size="lg" />
      <Text color="secondaryGray.600" fontSize="sm">
        {label}
      </Text>
    </Flex>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Flex direction="column" align="center" justify="center" py="60px" gap="10px" textAlign="center">
      <Icon as={MdErrorOutline} w="40px" h="40px" color="red.500" />
      <Text fontWeight="600">{message}</Text>
      {onRetry && (
        <Button size="sm" variant="lightBrand" onClick={onRetry}>
          Try again
        </Button>
      )}
    </Flex>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <Flex direction="column" align="center" justify="center" py="50px" gap="6px" textAlign="center">
      <Icon as={MdInbox} w="40px" h="40px" color="secondaryGray.500" />
      <Text fontWeight="600">{title}</Text>
      {description && (
        <Text fontSize="sm" color="secondaryGray.600" maxW="360px">
          {description}
        </Text>
      )}
    </Flex>
  );
}
