import { formatIndianMobile, normalizeIndianMobile } from '@prismgo/shared';
import { useState, type FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../auth/auth-context';
import { FullPageSpinner, Unreachable } from '../auth/guards';
import { Logo } from '../components/Logo';
import { Button, ErrorBanner, TextField } from '../components/ui';

type Step = { kind: 'phone' } | { kind: 'code'; phone: string; devCode?: string };

export function LoginPage() {
  const { state, requestCode, verifyCode, retry } = useAuth();
  const location = useLocation();
  const [step, setStep] = useState<Step>({ kind: 'phone' });
  const [phoneInput, setPhoneInput] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);

  if (state.status === 'loading') return <FullPageSpinner />;
  if (state.status === 'unreachable') return <Unreachable onRetry={retry} />;
  if (state.status === 'authenticated') {
    const from = (location.state as { from?: string } | null)?.from ?? '/';
    return <Navigate to={from} replace />;
  }

  const phoneError =
    phoneInput.length >= 10 && !normalizeIndianMobile(phoneInput)
      ? 'Enter a valid 10-digit mobile number'
      : null;

  async function sendCode(e: FormEvent) {
    e.preventDefault();
    const phone = normalizeIndianMobile(phoneInput);
    if (!phone) return setError(new Error('Enter a valid 10-digit mobile number'));
    setBusy(true);
    setError(null);
    try {
      const res = await requestCode(phone);
      setCode('');
      setStep({ kind: 'code', phone, devCode: res.devCode });
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }

  async function submitCode(e: FormEvent) {
    e.preventDefault();
    if (step.kind !== 'code' || busy) return;
    if (code.length !== 6) return setError(new Error('Enter the 6-digit code'));
    setBusy(true);
    setError(null);
    try {
      await verifyCode(step.phone, code);
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
          <p className="mt-1 text-sm text-sand-600">Vehicle requests and live tracking</p>
        </div>
        <div className="rounded-xl border border-sand-200 bg-white p-6 shadow-sm">
          {step.kind === 'phone' ? (
            <form onSubmit={sendCode} className="space-y-4" noValidate>
              <h1 className="text-lg font-semibold">Log in</h1>
              <TextField
                label="Mobile number"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="98123 45678"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                error={phoneError}
                hint="We'll send a 6-digit code on WhatsApp"
                autoFocus
              />
              <ErrorBanner error={error} />
              <Button type="submit" className="w-full" disabled={busy || !phoneInput}>
                {busy ? 'Sending…' : 'Send code'}
              </Button>
            </form>
          ) : (
            <form onSubmit={submitCode} className="space-y-4" noValidate>
              <h1 className="text-lg font-semibold">Enter code</h1>
              <p className="text-sm text-sand-600">
                If {formatIndianMobile(step.phone)} is registered, a code is on its way.
              </p>
              {step.devCode && (
                <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  Test code: <span className="font-mono font-semibold">{step.devCode}</span>
                </p>
              )}
              <TextField
                label="6-digit code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="text-center font-mono text-lg tracking-[0.5em]"
                autoFocus
              />
              <ErrorBanner error={error} />
              {/* Enabled while the code is incomplete: a disabled submit button stops Enter
                  from submitting, e.g. when Enter follows an autofilled code. */}
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? 'Checking…' : 'Log in'}
              </Button>
              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  className="text-sand-600 hover:underline"
                  onClick={() => {
                    setStep({ kind: 'phone' });
                    setError(null);
                  }}
                >
                  Change number
                </button>
                <button
                  type="button"
                  className="text-coral-700 hover:underline disabled:opacity-50"
                  disabled={busy}
                  onClick={(e) => void sendCode(e)}
                >
                  Resend code
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
