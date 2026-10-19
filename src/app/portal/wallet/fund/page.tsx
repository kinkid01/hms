'use client';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Spinner,
  Text,
  useClipboard,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import {
  MAX_FUNDING_AMOUNT,
  MIN_FUNDING_AMOUNT,
  PAYMENT_WINDOW_MINUTES,
} from 'config/hospital';
import { usePortal } from 'contexts/PortalContext';
import * as api from 'lib/api';
import { formatNaira } from 'lib/format';
import NextLink from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import {
  MdAccessTime,
  MdArrowBack,
  MdCheck,
  MdCheckCircle,
  MdContentCopy,
  MdTimerOff,
} from 'react-icons/md';
import { PaymentSession } from 'types/hms';

const PRESETS = [5000, 10000, 20000, 50000];
const POLL_MS = 5000;
const ACTIVE_KEY = 'hms.activePayment';

function CopyRow({ label, value, display }: { label: string; value: string; display?: string }) {
  const { hasCopied, onCopy } = useClipboard(value);
  return (
    <Flex justify="space-between" align="center" py="12px" gap="12px">
      <Box>
        <Text fontSize="xs" color="secondaryGray.600" fontWeight="700" textTransform="uppercase">
          {label}
        </Text>
        <Text fontWeight="700" fontSize="lg" wordBreak="break-all">
          {display ?? value}
        </Text>
      </Box>
      <IconButton
        aria-label={`Copy ${label}`}
        icon={<Icon as={hasCopied ? MdCheck : MdContentCopy} />}
        variant="lightBrand"
        size="sm"
        onClick={onCopy}
      />
    </Flex>
  );
}

function useCountdown(expiresAt?: string) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!expiresAt) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [expiresAt]);
  const remaining = expiresAt ? Math.max(0, new Date(expiresAt).getTime() - now) : 0;
  const mm = String(Math.floor(remaining / 60000)).padStart(2, '0');
  const ss = String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0');
  return { remaining, label: `${mm}:${ss}` };
}

export default function FundWallet() {
  const toast = useToast();
  const { refreshNotifications } = usePortal();
  const [amountText, setAmountText] = useState('');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [session, setSession] = useState<PaymentSession | null>(null);
  const [checking, setChecking] = useState(false);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  const amount = Number(amountText.replace(/[^\d]/g, ''));
  const { remaining, label } = useCountdown(session?.status === 'pending' ? session.expiresAt : undefined);

  // Resume an in-progress payment after a refresh.
  useEffect(() => {
    const ref = sessionStorage.getItem(ACTIVE_KEY);
    if (ref) api.getPaymentSession(ref).then(setSession).catch(() => sessionStorage.removeItem(ACTIVE_KEY));
  }, []);

  const check = useCallback(async () => {
    if (!session) return;
    const latest = await api.getPaymentSession(session.reference);
    if (latest.status !== session.status) {
      setSession(latest);
      refreshNotifications();
      if (latest.status !== 'pending') sessionStorage.removeItem(ACTIVE_KEY);
    }
    return latest;
  }, [session, refreshNotifications]);

  // Poll the backend while waiting; the countdown is display-only (PRD §16).
  useEffect(() => {
    if (session?.status !== 'pending') return;
    const t = setInterval(check, POLL_MS);
    return () => clearInterval(t);
  }, [session?.status, check]);

  // When the timer hits zero, ask the backend for the authoritative status.
  useEffect(() => {
    if (session?.status === 'pending' && remaining === 0) check();
  }, [remaining, session?.status, check]);

  const start = async () => {
    if (!amount || amount < MIN_FUNDING_AMOUNT) {
      setError(`Minimum amount is ${formatNaira(MIN_FUNDING_AMOUNT)}.`);
      return;
    }
    if (amount > MAX_FUNDING_AMOUNT) {
      setError(`Maximum amount per top-up is ${formatNaira(MAX_FUNDING_AMOUNT)}.`);
      return;
    }
    setError('');
    setCreating(true);
    try {
      const s = await api.createPaymentSession(amount);
      sessionStorage.setItem(ACTIVE_KEY, s.reference);
      setSession(s);
    } catch (e) {
      toast({ status: 'error', title: 'Could not start payment', description: (e as Error).message });
    } finally {
      setCreating(false);
    }
  };

  const manualCheck = async () => {
    setChecking(true);
    const latest = await check();
    setChecking(false);
    if (latest?.status === 'pending') {
      toast({
        status: 'info',
        title: 'Not received yet',
        description: 'Transfers usually arrive within a minute. We’ll keep checking automatically.',
      });
    }
  };

  const reset = () => {
    sessionStorage.removeItem(ACTIVE_KEY);
    setSession(null);
  };

  const simulate = async () => {
    await api.mockSimulateTransfer(session.reference);
    await check();
  };

  return (
    <Box maxW="640px" mx="auto">
      <Button
        as={NextLink}
        href="/portal/wallet"
        variant="ghost"
        leftIcon={<Icon as={MdArrowBack} />}
        mb="12px"
        size="sm"
      >
        Back to wallet
      </Button>

      {/* Step 1 — amount */}
      {!session && (
        <Card p={{ base: '20px', md: '30px' }}>
          <Text fontSize="2xl" fontWeight="700" color={textColor}>
            Fund your wallet
          </Text>
          <Text color="secondaryGray.600" mb="24px">
            Enter an amount and we’ll give you a one-time account to transfer to. No cash point visit needed.
          </Text>
          <FormControl isInvalid={!!error}>
            <FormLabel fontSize="sm" fontWeight="600">
              Amount
            </FormLabel>
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none" color="secondaryGray.600" fontWeight="700">
                ₦
              </InputLeftElement>
              <Input
                variant="main"
                inputMode="numeric"
                placeholder="0"
                fontSize="xl"
                fontWeight="700"
                ps="40px"
                value={amount ? amount.toLocaleString('en-NG') : ''}
                onChange={(e) => {
                  setAmountText(e.target.value);
                  setError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && start()}
              />
            </InputGroup>
            {error ? (
              <FormErrorMessage>{error}</FormErrorMessage>
            ) : (
              <FormHelperText>
                Between {formatNaira(MIN_FUNDING_AMOUNT)} and {formatNaira(MAX_FUNDING_AMOUNT)}.
              </FormHelperText>
            )}
          </FormControl>
          <SimpleGrid columns={{ base: 2, md: 4 }} gap="10px" mt="16px" mb="28px">
            {PRESETS.map((p) => (
              <Button
                key={p}
                variant={amount === p ? 'brand' : 'light'}
                size="sm"
                onClick={() => {
                  setAmountText(String(p));
                  setError('');
                }}
              >
                {formatNaira(p)}
              </Button>
            ))}
          </SimpleGrid>
          <Button variant="brand" h="50px" onClick={start} isLoading={creating} loadingText="Generating account…">
            Continue to payment
          </Button>
        </Card>
      )}

      {/* Step 2 — transfer details */}
      {session?.status === 'pending' && (
        <Card p={{ base: '20px', md: '30px' }}>
          <Flex justify="space-between" align="center" mb="8px" gap="16px">
            <Box>
              <Text fontSize="sm" color="secondaryGray.600">
                Transfer exactly
              </Text>
              <Text fontSize="3xl" fontWeight="800" color={textColor}>
                {formatNaira(session.amount)}
              </Text>
            </Box>
            <CircularProgress
              value={(remaining / (PAYMENT_WINDOW_MINUTES * 60_000)) * 100}
              color={remaining < 3 * 60_000 ? 'red.400' : 'brand.500'}
              size="84px"
              thickness="8px"
            >
              <CircularProgressLabel fontSize="md" fontWeight="700">
                {label}
              </CircularProgressLabel>
            </CircularProgress>
          </Flex>
          <Flex align="center" gap="6px" fontSize="sm" color="secondaryGray.600" mb="16px">
            <Icon as={MdAccessTime} />
            These details expire in {label}. Use them for this payment only.
          </Flex>

          <Box bg={boxBg} borderRadius="16px" px="18px" py="6px" mb="16px">
            <CopyRow label="Bank" value={session.bankName} />
            <Divider />
            <CopyRow
              label="Account number"
              value={session.accountNumber}
              display={session.accountNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')}
            />
            <Divider />
            <CopyRow label="Account name" value={session.accountName} />
            <Divider />
            <CopyRow label="Amount" value={String(session.amount)} display={formatNaira(session.amount)} />
            <Divider />
            <CopyRow label="Payment reference" value={session.reference} />
          </Box>

          <Alert status="info" borderRadius="14px" mb={{ base: '12px', md: '20px' }} fontSize="sm">
            <AlertIcon />
            <AlertDescription>
              Pay from your banking app, USSD or internet banking. Your wallet is credited automatically once
              the bank confirms — no receipt upload needed.
            </AlertDescription>
          </Alert>

          <Flex align="center" justify="center" gap="10px" mb="16px" color="secondaryGray.600" fontSize="sm">
            <Spinner size="sm" color="brand.500" />
            Waiting for your transfer…
          </Flex>

          <Button variant="brand" h="50px" w="100%" onClick={manualCheck} isLoading={checking} mb="10px">
            I’ve sent the money
          </Button>
          <Button variant="ghost" w="100%" onClick={reset} size="sm">
            Cancel and change amount
          </Button>

          <Box borderTop="1px dashed" borderColor="orange.300" mt={{ base: '12px', md: '20px' }} pt="14px">
            <Text fontSize="xs" color="orange.500" mb="8px">
              Demo mode — there’s no payment provider yet. Simulate the provider’s webhook:
            </Text>
            <Button size="sm" variant="outline" colorScheme="orange" onClick={simulate}>
              Simulate transfer received
            </Button>
          </Box>
        </Card>
      )}

      {/* Step 3a — success */}
      {session?.status === 'successful' && (
        <Card p="40px" alignItems="center" textAlign="center">
          <Icon as={MdCheckCircle} w="72px" h="72px" color="green.500" mb="12px" />
          <Text fontSize="2xl" fontWeight="700" color={textColor}>
            Wallet funded
          </Text>
          <Text color="secondaryGray.600" mb="6px">
            {formatNaira(session.amount)} has been added to your hospital wallet.
          </Text>
          <Text fontSize="sm" color="secondaryGray.600" mb="24px">
            Reference: {session.reference}
          </Text>
          <Flex gap="10px" wrap="wrap" justify="center">
            <Button as={NextLink} href="/portal/wallet" variant="brand">
              View wallet
            </Button>
            <Button variant="light" onClick={reset}>
              Fund again
            </Button>
          </Flex>
        </Card>
      )}

      {/* Step 3b — expired / failed */}
      {(session?.status === 'expired' || session?.status === 'failed') && (
        <Card p="40px" alignItems="center" textAlign="center">
          <Icon as={MdTimerOff} w="72px" h="72px" color="orange.400" mb="12px" />
          <Text fontSize="2xl" fontWeight="700" color={textColor}>
            {session.status === 'expired' ? 'Payment details expired' : 'Payment failed'}
          </Text>
          <Text color="secondaryGray.600" mb="16px" maxW="440px">
            {session.status === 'expired'
              ? `We didn’t receive a transfer within ${PAYMENT_WINDOW_MINUTES} minutes, so these account details are no longer valid.`
              : 'The payment could not be completed.'}
          </Text>
          <Alert status="warning" borderRadius="14px" mb="24px" fontSize="sm" textAlign="left">
            <AlertIcon />
            <AlertDescription>
              Already sent money to this account? Don’t pay again — late transfers are reconciled and credited
              automatically. Contact the hospital with reference <b>{session.reference}</b> if it doesn’t
              appear within 24 hours.
            </AlertDescription>
          </Alert>
          <Button variant="brand" onClick={reset}>
            Generate new payment details
          </Button>
        </Card>
      )}
    </Box>
  );
}
