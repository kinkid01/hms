'use client';
import * as api from 'lib/api';
import { useRouter } from 'next/navigation';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Session } from 'types/hms';

// Sign the patient out after this long without activity (PRD §20).
const IDLE_TIMEOUT_MS = 15 * 60_000;

interface AuthContextValue {
  session: Session | null;
  /** False until the stored session has been read on the client. */
  ready: boolean;
  signIn: (email: string, password: string) => Promise<Session>;
  signOut: (reason?: 'idle') => Promise<void>;
  setSession: (s: Session | null) => void;
}

const AuthContext = createContext<AuthContextValue>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(api.getStoredSession());
    setReady(true);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const s = await api.login(email, password);
    setSession(s);
    return s;
  }, []);

  const signOut = useCallback(
    async (reason?: 'idle') => {
      await api.logout();
      setSession(null);
      router.replace(reason === 'idle' ? '/auth/sign-in?expired=1' : '/auth/sign-in');
    },
    [router],
  );

  useEffect(() => {
    if (!session) return;
    let timer: ReturnType<typeof setTimeout>;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => signOut('idle'), IDLE_TIMEOUT_MS);
    };
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [session, signOut]);

  return (
    <AuthContext.Provider value={{ session, ready, signIn, signOut, setSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
