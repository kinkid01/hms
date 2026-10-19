'use client';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import AuthForm from 'components/portal/AuthForm';
import { PasswordInput } from 'components/portal/PasswordFields';
import { useAuth } from 'contexts/AuthContext';
import DefaultAuthLayout from 'layouts/auth/Default';
import NextLink from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { session, ready, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  const textColor = useColorModeValue('navy.700', 'white');
  const textColorBrand = useColorModeValue('brand.500', 'white');

  // Only allow internal redirects.
  const next = params.get('next')?.startsWith('/portal') ? params.get('next') : '/portal/dashboard';

  useEffect(() => {
    if (ready && session) router.replace(session.mustChangePassword ? '/auth/change-password' : next);
  }, [ready, session, router, next]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email address.';
    if (!password) errs.password = 'Enter your password.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await signIn(email, password); // redirect handled by the effect above
    } catch (err) {
      setErrors({ form: (err as Error).message });
      setLoading(false);
    }
  };

  return (
    <AuthForm title="Sign In" subtitle="Access your hospital records and wallet.">
      {params.get('expired') && (
        <Alert status="warning" borderRadius="14px" mb="20px" fontSize="sm">
          <AlertIcon />
          <AlertDescription>You were signed out after a period of inactivity.</AlertDescription>
        </Alert>
      )}
      {params.get('reset') && (
        <Alert status="success" borderRadius="14px" mb="20px" fontSize="sm">
          <AlertIcon />
          <AlertDescription>Password reset. Sign in with your new password.</AlertDescription>
        </Alert>
      )}
      {errors.form && (
        <Alert status="error" borderRadius="14px" mb="20px" fontSize="sm">
          <AlertIcon />
          <AlertDescription>{errors.form}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={submit} noValidate>
        <FormControl isInvalid={!!errors.email} mb="20px">
          <FormLabel htmlFor="email" ms="4px" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
            Email address
          </FormLabel>
          <Input
            id="email"
            variant="auth"
            fontSize="sm"
            type="email"
            placeholder="you@example.com"
            fontWeight="500"
            size="lg"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
        </FormControl>
        <PasswordInput
          id="password"
          label="Password"
          value={password}
          onChange={setPassword}
          error={errors.password}
          placeholder="Your password"
          autoComplete="current-password"
        />
        <Flex justify="flex-end" mb="24px" mt="-8px">
          <NextLink href="/auth/forgot-password">
            <Text color={textColorBrand} fontSize="sm" fontWeight="500">
              Forgot password?
            </Text>
          </NextLink>
        </Flex>
        <Button type="submit" fontSize="sm" variant="brand" fontWeight="500" w="100%" h="50" mb="24px" isLoading={loading}>
          Sign In
        </Button>
      </form>

      <Text color="gray.400" fontSize="sm">
        Don’t have portal access? Your account is created when you register at the hospital. Ask at the records
        desk.
      </Text>
    </AuthForm>
  );
}

export default function SignIn() {
  return (
    <DefaultAuthLayout>
      <Suspense>
        <SignInForm />
      </Suspense>
    </DefaultAuthLayout>
  );
}
