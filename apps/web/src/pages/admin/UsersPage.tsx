import { formatIndianMobile, ROLES, type Role } from '@prismgo/shared';
import { useDeferredValue, useState, type FormEvent } from 'react';
import { ROLE_LABELS, useMe } from '../../auth/auth-context';
import {
  Badge,
  Button,
  cellClass,
  DataTable,
  EmptyRow,
  ErrorBanner,
  Field,
  Input,
  Modal,
  PageHeader,
  Select,
  TextField,
} from '../../components/ui';
import { useDepartments, useSave, useUsers } from '../../lib/queries';
import type { CreateUser, UpdateUser, User } from '../../lib/types';

export function UsersPage() {
  const [q, setQ] = useState('');
  const [role, setRole] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const search = useDeferredValue(q.trim());
  const params = new URLSearchParams(
    Object.entries({ q: search, role, departmentId }).filter(([, v]) => v),
  ).toString();
  const { data, isLoading, error } = useUsers(params);
  const departments = useDepartments();
  const [editing, setEditing] = useState<User | 'new' | null>(null);

  return (
    <>
      <PageHeader
        title="Users"
        description="Everyone who logs in with their phone number."
        action={<Button onClick={() => setEditing('new')}>Add user</Button>}
      />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Input
          placeholder="Search name or phone"
          aria-label="Search users"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Select aria-label="Filter by role" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Filter by department"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
        >
          <option value="">All departments</option>
          {departments.data?.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </Select>
      </div>
      <ErrorBanner error={error} />
      <DataTable head={['Name', 'Phone', 'Roles', 'Department', 'Status']}>
        {isLoading ? (
          <EmptyRow colSpan={5}>Loading…</EmptyRow>
        ) : !data?.length ? (
          <EmptyRow colSpan={5}>No users match.</EmptyRow>
        ) : (
          data.map((u) => (
            <tr
              key={u.id}
              className="cursor-pointer hover:bg-sand-50"
              onClick={() => setEditing(u)}
            >
              <td className={`${cellClass} font-medium`}>{u.name}</td>
              <td className={`${cellClass} text-sand-600`}>{formatIndianMobile(u.phone)}</td>
              <td className={cellClass}>
                <div className="flex gap-1">
                  {u.roles.map((r) => (
                    <Badge key={r} tone="blue">
                      {ROLE_LABELS[r]}
                    </Badge>
                  ))}
                </div>
              </td>
              <td className={cellClass}>{u.department?.name ?? '—'}</td>
              <td className={cellClass}>
                <Badge tone={u.status === 'active' ? 'green' : 'slate'}>{u.status}</Badge>
              </td>
            </tr>
          ))
        )}
      </DataTable>
      <Modal
        open={editing !== null}
        title={editing === 'new' ? 'Add user' : 'Edit user'}
        onClose={() => setEditing(null)}
      >
        {editing !== null && (
          <UserForm user={editing === 'new' ? null : editing} onDone={() => setEditing(null)} />
        )}
      </Modal>
    </>
  );
}

function UserForm({ user, onDone }: { user: User | null; onDone: () => void }) {
  const me = useMe();
  const departments = useDepartments();
  const save = useSave<CreateUser | UpdateUser, User>('users', ['users', 'departments']);
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user ? formatIndianMobile(user.phone) : '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [roles, setRoles] = useState<Role[]>(user?.roles ?? ['requester']);
  const [departmentId, setDepartmentId] = useState(user?.department?.id ?? '');
  const [active, setActive] = useState(user ? user.status === 'active' : true);
  const isSelf = user?.id === me.id;

  function toggleRole(role: Role) {
    setRoles((current) =>
      current.includes(role) ? current.filter((r) => r !== role) : [...current, role],
    );
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const body: UpdateUser = {
      name,
      phone,
      email: email || null,
      roles,
      departmentId: departmentId || null,
      ...(user ? { status: active ? 'active' : 'inactive' } : {}),
    };
    save.mutate({ id: user?.id, body }, { onSuccess: onDone });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <TextField
        label="Mobile number"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        hint="Used to log in"
        required
      />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        hint="Optional"
      />
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-sand-700">Roles</legend>
        <div className="grid grid-cols-2 gap-2">
          {ROLES.map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={roles.includes(r)}
                onChange={() => toggleRole(r)}
                className="h-4 w-4 rounded border-sand-300 text-coral-700"
              />
              {ROLE_LABELS[r]}
            </label>
          ))}
        </div>
      </fieldset>
      <Field label="Department">
        <Select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
          <option value="">No department</option>
          {departments.data?.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </Select>
      </Field>
      {user && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={active}
            disabled={isSelf}
            onChange={(e) => setActive(e.target.checked)}
            className="h-4 w-4 rounded border-sand-300"
          />
          Active {isSelf && <span className="text-sand-500">(you can't deactivate yourself)</span>}
        </label>
      )}
      <ErrorBanner error={save.error} />
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={save.isPending || roles.length === 0 || !name || !phone}>
          {save.isPending ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
