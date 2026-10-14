import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { post } from '../lib/api';
import { timeAgo } from '../lib/format';
import { keys, useNotifications } from '../lib/queries';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data } = useNotifications();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const unread = data?.filter((n) => !n.readAt).length ?? 0;

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  async function openItem(id: string, requestId: string | null | undefined) {
    setOpen(false);
    await post(`/notifications/${id}/read`);
    void qc.invalidateQueries({ queryKey: keys.notifications });
    if (requestId) void navigate(`/requests/${requestId}`);
  }

  async function readAll() {
    await post('/notifications/read-all');
    void qc.invalidateQueries({ queryKey: keys.notifications });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
        aria-expanded={open}
        className="relative rounded-lg p-2 text-sand-300 hover:bg-sand-800 hover:text-cream"
      >
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-5 rounded-full bg-coral-500 px-1 text-center text-[11px] leading-5 font-semibold text-ink">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute top-full left-0 z-20 mt-2 w-80 overflow-hidden rounded-xl border border-sand-200 bg-white text-ink shadow-xl md:left-auto md:right-0 md:translate-x-[calc(100%-2.5rem)]">
          <div className="flex items-center justify-between border-b border-sand-200 px-4 py-2">
            <span className="text-sm font-semibold">Notifications</span>
            {unread > 0 && (
              <button
                type="button"
                onClick={() => void readAll()}
                className="text-xs text-coral-700 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          <ul className="max-h-96 overflow-y-auto">
            {!data?.length && (
              <li className="px-4 py-6 text-center text-sm text-sand-500">Nothing yet.</li>
            )}
            {data?.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => void openItem(n.id, n.requestId)}
                  className={`block w-full px-4 py-3 text-left hover:bg-sand-50 ${n.readAt ? '' : 'bg-coral-50/60'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium">{n.title}</span>
                    {!n.readAt && (
                      <span
                        aria-label="unread"
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-coral-500"
                      />
                    )}
                  </div>
                  <div className="mt-0.5 text-xs text-sand-600">{n.body}</div>
                  <div className="mt-1 text-xs text-sand-500">{timeAgo(n.createdAt)}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
