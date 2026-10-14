import { describe, expect, it } from 'vitest';
import { canPerform, nextRequestStatus } from './request-workflow';

describe('request workflow', () => {
  it('moves through the happy path', () => {
    expect(nextRequestStatus('draft', 'submit')).toBe('pending_approval');
    expect(nextRequestStatus('pending_approval', 'approve')).toBe('approved');
    expect(nextRequestStatus('approved', 'assign')).toBe('assigned');
    expect(nextRequestStatus('assigned', 'start')).toBe('in_progress');
    expect(nextRequestStatus('in_progress', 'complete')).toBe('completed');
  });

  it('rejects invalid transitions', () => {
    expect(nextRequestStatus('draft', 'approve')).toBeNull();
    expect(nextRequestStatus('in_progress', 'cancel')).toBeNull();
    expect(nextRequestStatus('rejected', 'assign')).toBeNull();
  });

  it('only lets the right role act', () => {
    expect(canPerform('approve', 'hod')).toBe(true);
    expect(canPerform('approve', 'requester')).toBe(false);
    expect(canPerform('assign', 'transport_manager')).toBe(true);
    expect(canPerform('start', 'system')).toBe(true);
  });
});
