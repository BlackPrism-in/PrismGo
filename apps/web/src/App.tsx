import { formatIndianMobile } from '@prismgo/shared';
import { NavLink, Outlet } from 'react-router';
import { hasRole, MASTER_DATA_ROLES, ROLE_LABELS, useAuth, useMe } from './auth/auth-context';
import { ApiStatus } from './components/ApiStatus';
import { Logo } from './components/Logo';
import { NotificationBell } from './components/NotificationBell';
import { useRealtime } from './lib/realtime';
import { Button } from './components/ui';

const NAV = [
  { to: '/', label: 'Dashboard', roles: null },
  { to: '/requests', label: 'My requests', roles: ['requester', 'hod'] },
  { to: '/approvals', label: 'Approvals', roles: ['hod'] },
  { to: '/dispatch', label: 'Dispatch', roles: MASTER_DATA_ROLES },
  { to: '/live', label: 'Live map', roles: MASTER_DATA_ROLES },
  { to: '/admin/departments', label: 'Departments', roles: MASTER_DATA_ROLES },
  { to: '/admin/users', label: 'Users', roles: MASTER_DATA_ROLES },
  { to: '/admin/vehicles', label: 'Vehicles', roles: MASTER_DATA_ROLES },
  { to: '/admin/drivers', label: 'Drivers', roles: MASTER_DATA_ROLES },
] as const;

export function AppLayout() {
  const me = useMe();
  const { logout } = useAuth();
  const items = NAV.filter((item) => !item.roles || hasRole(me, ...item.roles));
  useRealtime(true);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex flex-col bg-ink text-cream md:w-60">
        <div className="flex h-14 items-center justify-between px-4 text-lg">
          <Logo />
          <NotificationBell />
        </div>
        <nav aria-label="Main" className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:pb-0">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-mint-300 text-ink'
                    : 'text-sand-300 hover:bg-sand-800 hover:text-cream'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto hidden space-y-3 border-t border-sand-800 p-4 md:block">
          <div>
            <div className="text-sm font-medium">{me.name}</div>
            <div className="text-xs text-sand-400">{formatIndianMobile(me.phone)}</div>
            <div className="mt-1 text-xs text-sand-400">
              {me.roles.map((r) => ROLE_LABELS[r]).join(', ')}
            </div>
          </div>
          <Button variant="secondary" className="w-full" onClick={() => void logout()}>
            Log out
          </Button>
          <ApiStatus />
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-8 md:px-8">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
        <div className="mt-8 md:hidden">
          <Button variant="secondary" onClick={() => void logout()}>
            Log out
          </Button>
        </div>
      </main>
    </div>
  );
}
