import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { LicenceExpiry } from './DriversPage';

const today = new Date('2026-10-14T00:00:00Z');

it('marks expired licences', () => {
  render(<LicenceExpiry date="2026-10-01" today={today} />);
  expect(screen.getByText('Expired 2026-10-01')).toBeInTheDocument();
});

it('warns within 30 days', () => {
  render(<LicenceExpiry date="2026-11-03" today={today} />);
  expect(screen.getByText(/20d left/)).toBeInTheDocument();
});

it('shows a plain date when far off', () => {
  render(<LicenceExpiry date="2030-03-31" today={today} />);
  expect(screen.getByText('2030-03-31')).toBeInTheDocument();
});
