'use client';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Code,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  PinInput,
  PinInputField,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import AuthForm from 'components/portal/AuthForm';
import { PasswordChecklist, PasswordInput, isStrongPassword } from 'components/portal/PasswordFields';
import DefaultAuthLayout from 'layouts/auth/Default';
import * as api from 'lib/api';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Step = 'identify' | 'verify' | 'reset';

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('identify');
  const [identifier, setIdentifier] = useState('');
  const [destination, setDestination] = useState('');
  const [code, setCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const textColor = useColorModeValue('navy.700', 'white');
  const linkColor = useColorModeValue('brand.500', 'white');
  const pinSize = useBreakpointValue({ base: 'md', md: 'lg' });

  const run = async (fn: () => Promise<void>) => {
    setError('');
    setLoading(true);
    try {
      await fn();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const sendCode = (e?: React.FormEvent) => {
    e?.preventDefault();
    const isEmail = /^\S+@\S+\.\S+$/.test(identifier);
    const isPhone = /^\+?\d[\d\s]{9,}$/.test(identifier);
    if (!isEmail && !isPhone) return setError('Enter your registered email address or phone number.');
    run(async () => {
      const r = await api.requestPasswordReset(identifier.trim());
      setDestination(r.destination);
      setStep('verify');
    });
  };

  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return setError('Enter the 6-digit code.');
    run(async () => {
      const r = await api.verifyResetCode(code);
      setResetToken(r.resetToken);
      setStep('reset');
    });
  };

  const reset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStrongPassword(next)) return setError('Password doesn’t meet the requirements.');
    if (next !== confirm) return setError('Passwords don’t match.');
    run(async () => {
      await api.resetPassword(resetToken, next);
      router.replace('/auth/sign-in?reset=1');
    });
  };

  const titles: Record<Step, [string, React.ReactNode]> = {
    identify: ['Forgot password', 'Enter the email or phone number registered with the hospital. We’ll send you a one-time code.'],
    verify: ['Enter code', <>We sent a 6-digit code to <b>{destination}</b>.</>],
    reset: ['New password', 'Choose a new password for your portal account.'],
  };

  return (
    <DefaultAuthLayout>
      <AuthForm title={titles[step][0]} subtitle={titles[step][1]}>
        {error && (
          <Alert status="error" borderRadius="14px" mb="20px" fontSize="sm">
            <AlertIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 'identify' && (
          <form onSubmit={sendCode} noValidate>
            <FormControl mb="24px">
              <FormLabel htmlFor="identifier" ms="4px" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
                Email or phone number
              </FormLabel>
              <Input
                id="identifier"
                variant="auth"
                size="lg"
                fontSize="sm"
                placeholder="you@example.com or +234…"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </FormControl>
            <Button type="submit" variant="brand" w="100%" h="50" mb="20px" isLoading={loading}>
              Send code
            </Button>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={verify} noValidate>
            <FormControl mb="16px" isInvalid={!!error}>
              <HStack justify="space-between" spacing={{ base: '6px', md: '8px' }}>
                <PinInput otp size={pinSize} value={code} onChange={setCode} autoFocus>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <PinInputField key={i} borderRadius="12px" />
                  ))}
                </PinInput>
              </HStack>
              <FormErrorMessage />
            </FormControl>
            <Text fontSize="xs" color="orange.500" mb="16px">
              Demo mode: the code is <Code>123456</Code>
            </Text>
            <Button type="submit" variant="brand" w="100%" h="50" mb="12px" isLoading={loading}>
              Verify code
            </Button>
            <Button variant="ghost" w="100%" size="sm" mb="20px" onClick={() => sendCode()} isDisabled={loading}>
              Resend code
            </Button>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={reset} noValidate>
            <PasswordInput id="new-password" label="New password" value={next} onChange={setNext} autoComplete="new-password" />
            <PasswordChecklist password={next} />
            <PasswordInput
              id="confirm-password"
              label="Confirm new password"
              value={confirm}
              onChange={setConfirm}
              autoComplete="new-password"
            />
            <Button type="submit" variant="brand" w="100%" h="50" mb="20px" isLoading={loading}>
              Reset password
            </Button>
          </form>
        )}

        <NextLink href="/auth/sign-in">
          <Text color={linkColor} fontSize="sm" fontWeight="500">
            ← Back to sign in
          </Text>
        </NextLink>
      </AuthForm>
    </DefaultAuthLayout>
  );
}
