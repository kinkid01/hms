'use client';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Flex,
  Icon,
  SimpleGrid,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { PasswordChecklist, PasswordInput, isStrongPassword } from 'components/portal/PasswordFields';
import { useAuth } from 'contexts/AuthContext';
import { usePortal } from 'contexts/PortalContext';
import * as api from 'lib/api';
import { formatDateTime } from 'lib/format';
import { useState } from 'react';
import { MdDevices, MdLogout, MdShield, MdTimer } from 'react-icons/md';

function ChangePasswordCard() {
  const toast = useToast();
  const { setSession } = useAuth();
  const { refreshNotifications } = usePortal();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!current) errs.current = 'Enter your current password.';
    if (!isStrongPassword(next)) errs.next = 'Password doesn’t meet the requirements below.';
    if (next !== confirm) errs.confirm = 'Passwords don’t match.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    try {
      setSession(await api.changePassword(current, next));
      refreshNotifications();
      toast({ status: 'success', title: 'Password changed' });
      setCurrent('');
      setNext('');
      setConfirm('');
    } catch (err) {
      setErrors({ current: (err as Error).message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card as="form" onSubmit={submit} noValidate>
      <Text fontSize="lg" fontWeight="700" color={textColor} mb="4px">
        Change password
      </Text>
      <Text fontSize="sm" color="secondaryGray.600" mb={{ base: '12px', md: '20px' }}>
        Choose a strong password you don’t use anywhere else.
      </Text>
      <PasswordInput
        id="current-password"
        label="Current password"
        value={current}
        onChange={setCurrent}
        error={errors.current}
        autoComplete="current-password"
      />
      <PasswordInput
        id="new-password"
        label="New password"
        value={next}
        onChange={setNext}
        error={errors.next}
        autoComplete="new-password"
      />
      <PasswordChecklist password={next} />
      <PasswordInput
        id="confirm-password"
        label="Confirm new password"
        value={confirm}
        onChange={setConfirm}
        error={errors.confirm}
        autoComplete="new-password"
      />
      <Button type="submit" variant="brand" isLoading={saving} alignSelf="flex-start" px="30px">
        Update password
      </Button>
    </Card>
  );
}

function SecurityCard() {
  const { session, signOut } = useAuth();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const rowBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  const rows = [
    { icon: MdDevices, label: 'Current session', value: session ? `Signed in ${formatDateTime(session.lastLoginAt)}` : '—' },
    { icon: MdTimer, label: 'Automatic sign-out', value: 'After 15 minutes of inactivity' },
    { icon: MdShield, label: 'Security alerts', value: 'Sent to your registered email and phone' },
  ];

  return (
    <Card>
      <Text fontSize="lg" fontWeight="700" color={textColor} mb="4px">
        Security
      </Text>
      <Text fontSize="sm" color="secondaryGray.600" mb={{ base: '12px', md: '20px' }}>
        How your account is protected.
      </Text>
      <Flex direction="column" gap="10px" mb={{ base: '12px', md: '20px' }}>
        {rows.map((r) => (
          <Flex key={r.label} align="center" gap="14px" p="14px" borderRadius="14px" bg={rowBg}>
            <Icon as={r.icon} w="22px" h="22px" color="brand.500" />
            <Box>
              <Text fontWeight="600" fontSize="sm" color={textColor}>
                {r.label}
              </Text>
              <Text fontSize="sm" color="secondaryGray.600">
                {r.value}
              </Text>
            </Box>
          </Flex>
        ))}
      </Flex>
      <Alert status="warning" borderRadius="14px" fontSize="sm" mb={{ base: '12px', md: '20px' }}>
        <AlertIcon />
        <AlertDescription>
          Hospital staff will never ask for your password. Don’t share it with anyone.
        </AlertDescription>
      </Alert>
      <Button
        variant="outline"
        colorScheme="red"
        leftIcon={<Icon as={MdLogout} />}
        alignSelf="flex-start"
        onClick={() => signOut()}
      >
        Sign out
      </Button>
    </Card>
  );
}

export default function SettingsPage() {
  return (
    <SimpleGrid columns={{ base: 1, xl: 2 }} gap={{ base: '12px', md: '20px' }} alignItems="start">
      <ChangePasswordCard />
      <SecurityCard />
    </SimpleGrid>
  );
}
