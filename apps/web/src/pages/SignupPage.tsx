import { formatIndianMobile, normalizeIndianMobile } from '@prismgo/shared';
import { useQuery } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { Logo } from '../components/Logo';
import { Button, ErrorBanner, Field, Select, TextField } from '../components/ui';
import { get, post } from '../lib/api';
import type { SignupDepartment } from '../lib/types';

/** Public page: a new employee asks for access. Their HOD approves, then they log in. */
export function SignupPage() {
  const departments = useQuery({
    queryKey: ['access', 'departments'],
    queryFn: () => get<SignupDepartment[]>('/access/departments'),
  });
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [error, setError] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const phoneError =
    phone.length >= 10 && !normalizeIndianMobile(phone)
      ? 'Enter a valid 10-digit mobile number'
      : null;

  async function submit(e: FormEvent) {
    e.preventDefault();
    const normalized = normalizeIndianMobile(phone);
    if (name.trim().length < 2) return setError(new Error('Enter your full name'));
    if (!normalized) return setError(new Error('Enter a valid 10-digit mobile number'));
    if (!departmentId) return setError(new Error('Choose your department'));
    setBusy(true);
    setError(null);
    try {
      await post('/access/requests', {
        name: name.trim(),
        phone: normalized,
        departmentId,
        ...(email.trim() ? { email: email.trim() } : {}),
      });
      setDone(true);
    } catch (err) {
      setError(err);
    } finally {
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
          {done ? (
            <div className="space-y-4">
              <h1 className="text-lg font-semibold">Request sent</h1>
              <p className="text-sm text-sand-600">
                Your HOD will review it. Once approved, log in with{' '}
                {formatIndianMobile(normalizeIndianMobile(phone) ?? phone)} and you'll get a code on
                WhatsApp.
              </p>
              <Link to="/login" className="block text-sm text-coral-700 hover:underline">
                Back to log in
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4" noValidate>
              <h1 className="text-lg font-semibold">Request access</h1>
              <TextField
                label="Full name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <TextField
                label="Mobile number (WhatsApp)"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="98123 45678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={phoneError}
              />
              <Field label="Department" htmlFor="signup-department">
                <Select
                  id="signup-department"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  disabled={!departments.data}
                >
                  <option value="">{departments.isLoading ? 'Loading…' : 'Choose…'}</option>
                  {departments.data?.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <TextField
                label="Work email (optional)"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <ErrorBanner error={error ?? departments.error} />
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? 'Sending…' : 'Send request'}
              </Button>
              <Link to="/login" className="block text-center text-sm text-sand-600 hover:underline">
                Already have access? Log in
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
