import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { expect, it, vi } from 'vitest';
import { AuthContext, type AuthContextValue } from '../auth/auth-context';
import { LoginPage } from './LoginPage';

function renderLogin(overrides: Partial<AuthContextValue> = {}) {
  const value: AuthContextValue = {
    state: { status: 'anonymous' },
    requestCode: vi.fn().mockResolvedValue({ sent: true, devCode: '424242' }),
    verifyCode: vi.fn().mockResolvedValue(undefined),
    logout: vi.fn(),
    retry: vi.fn(),
    ...overrides,
  };
  render(
    <AuthContext.Provider value={value}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
  return value;
}

it('sends a code to the normalised number, then verifies it', async () => {
  const auth = renderLogin();

  fireEvent.change(screen.getByLabelText('Mobile number'), { target: { value: '90000 00005' } });
  fireEvent.click(screen.getByRole('button', { name: 'Send code' }));

  await screen.findByText('Enter code');
  expect(auth.requestCode).toHaveBeenCalledWith('+919000000005');
  expect(screen.getByText('424242')).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText('6-digit code'), { target: { value: '42-42-42' } });
  fireEvent.click(screen.getByRole('button', { name: 'Log in' }));
  await waitFor(() => expect(auth.verifyCode).toHaveBeenCalledWith('+919000000005', '424242'));
});

it('logs in when Enter is pressed in the code field', async () => {
  const auth = renderLogin();
  fireEvent.change(screen.getByLabelText('Mobile number'), { target: { value: '9000000005' } });
  fireEvent.submit(screen.getByLabelText('Mobile number'));
  await screen.findByText('Enter code');

  // Enter submits through the form's submit button, so it must not be disabled.
  expect(screen.getByRole('button', { name: 'Log in' })).toBeEnabled();
  fireEvent.change(screen.getByLabelText('6-digit code'), { target: { value: '424242' } });
  fireEvent.submit(screen.getByLabelText('6-digit code'));
  await waitFor(() => expect(auth.verifyCode).toHaveBeenCalledWith('+919000000005', '424242'));
});

it('asks for all 6 digits instead of verifying a short code', async () => {
  const auth = renderLogin();
  fireEvent.change(screen.getByLabelText('Mobile number'), { target: { value: '9000000005' } });
  fireEvent.click(screen.getByRole('button', { name: 'Send code' }));
  await screen.findByText('Enter code');
  fireEvent.change(screen.getByLabelText('6-digit code'), { target: { value: '4242' } });
  fireEvent.submit(screen.getByLabelText('6-digit code'));
  expect(await screen.findByRole('alert')).toHaveTextContent('Enter the 6-digit code');
  expect(auth.verifyCode).not.toHaveBeenCalled();
});

it('flags an invalid number without calling the API', () => {
  const auth = renderLogin();
  fireEvent.change(screen.getByLabelText('Mobile number'), { target: { value: '5812345678' } });
  expect(screen.getByText('Enter a valid 10-digit mobile number')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Send code' }));
  expect(auth.requestCode).not.toHaveBeenCalled();
});

it('shows the API error when the code is wrong', async () => {
  renderLogin({ verifyCode: vi.fn().mockRejectedValue(new Error('Incorrect code')) });
  fireEvent.change(screen.getByLabelText('Mobile number'), { target: { value: '9000000005' } });
  fireEvent.click(screen.getByRole('button', { name: 'Send code' }));
  await screen.findByText('Enter code');
  fireEvent.change(screen.getByLabelText('6-digit code'), { target: { value: '111111' } });
  fireEvent.click(screen.getByRole('button', { name: 'Log in' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Incorrect code');
});
