import { useState, type FormEvent } from 'react';
import { useAuth, useMe } from '../auth/auth-context';
import { Logo } from '../components/Logo';
import { Button, ErrorBanner, TextField } from '../components/ui';

/** Shown once after a new number's first login. */
export function ProfileSetup() {
  const me = useMe();
  const { saveProfile, logout } = useAuth();
  const [name, setName] = useState(me.name);
  const [email, setEmail] = useState(me.email ?? '');
  const [error, setError] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return setError(new Error('Enter your full name'));
    setBusy(true);
    setError(null);
    try {
      await saveProfile({ name: name.trim(), ...(email.trim() ? { email: email.trim() } : {}) });
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Logo className="text-3xl" />
        </div>
        <form
          onSubmit={submit}
          noValidate
          className="space-y-4 rounded-xl border border-sand-200 bg-white p-6 shadow-sm"
        >
          <h1 className="text-lg font-semibold">Welcome to PrismGo</h1>
          <p className="text-sm text-sand-600">Tell us your name to get started.</p>
          <TextField
            label="Full name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <TextField
            label="Work email (optional)"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <ErrorBanner error={error} />
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? 'Saving…' : 'Continue'}
          </Button>
          <button
            type="button"
            className="block w-full text-center text-sm text-sand-600 hover:underline"
            onClick={() => void logout()}
          >
            Log out
          </button>
        </form>
      </div>
    </div>
  );
}
