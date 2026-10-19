'use client';
// Forced on first login, when the patient is still using the temporary
// password issued at registration (PRD §6).
import { Alert, AlertDescription, AlertIcon, Button } from '@chakra-ui/react';
import AuthForm from 'components/portal/AuthForm';
import { PageLoader } from 'components/portal/LoadState';
import { PasswordChecklist, PasswordInput, isStrongPassword } from 'components/portal/PasswordFields';
import { useAuth } from 'contexts/AuthContext';
import DefaultAuthLayout from 'layouts/auth/Default';
import * as api from 'lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ChangeTemporaryPassword() {
  const router = useRouter();
  const { session, ready, setSession, signOut } = useAuth();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!session) router.replace('/auth/sign-in');
    else if (!session.mustChangePassword) router.replace('/portal/dashboard');
  }, [ready, session, router]);

  if (!ready || !session?.mustChangePassword) return <PageLoader />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!current) errs.current = 'Enter the temporary password you were given.';
    if (!isStrongPassword(next)) errs.next = 'Password doesn’t meet the requirements below.';
    if (next !== confirm) errs.confirm = 'Passwords don’t match.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    try {
      setSession(await api.changePassword(current, next));
      router.replace('/portal/dashboard');
    } catch (err) {
      setErrors({ current: (err as Error).message });
      setSaving(false);
    }
  };

  return (
    <DefaultAuthLayout>
      <AuthForm title="Set your password" subtitle="For your security, replace the temporary password you received at registration.">
        <Alert status="info" borderRadius="14px" mb="20px" fontSize="sm">
          <AlertIcon />
          <AlertDescription>You need to do this once before using the portal.</AlertDescription>
        </Alert>
        <form onSubmit={submit} noValidate>
          <PasswordInput
            id="temp-password"
            label="Temporary password"
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
          <Button type="submit" variant="brand" w="100%" h="50" mb="12px" isLoading={saving}>
            Save and continue
          </Button>
          <Button variant="ghost" w="100%" size="sm" onClick={() => signOut()}>
            Sign out
          </Button>
        </form>
      </AuthForm>
    </DefaultAuthLayout>
  );
}
