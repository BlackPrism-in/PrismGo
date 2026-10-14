import { useState, type FormEvent } from 'react';
import {
  Button,
  cellClass,
  DataTable,
  EmptyRow,
  ErrorBanner,
  Field,
  Modal,
  PageHeader,
  Select,
  TextField,
} from '../../components/ui';
import { useDepartments, useSave, useUsers } from '../../lib/queries';
import type { CreateDepartment, Department } from '../../lib/types';

export function DepartmentsPage() {
  const { data, isLoading, error } = useDepartments();
  const [editing, setEditing] = useState<Department | 'new' | null>(null);

  return (
    <>
      <PageHeader
        title="Departments"
        description="Each department has one HOD who approves its vehicle requests."
        action={<Button onClick={() => setEditing('new')}>Add department</Button>}
      />
      <ErrorBanner error={error} />
      <DataTable head={['Name', 'HOD', 'Members', 'Cost centre']}>
        {isLoading ? (
          <EmptyRow colSpan={4}>Loading…</EmptyRow>
        ) : !data?.length ? (
          <EmptyRow colSpan={4}>No departments yet.</EmptyRow>
        ) : (
          data.map((d) => (
            <tr
              key={d.id}
              className="cursor-pointer hover:bg-sand-50"
              onClick={() => setEditing(d)}
            >
              <td className={`${cellClass} font-medium`}>{d.name}</td>
              <td className={cellClass}>
                {d.hod?.name ?? <span className="text-amber-700">No HOD assigned</span>}
              </td>
              <td className={cellClass}>{d.memberCount}</td>
              <td className={`${cellClass} text-sand-500`}>{d.costCentre ?? '—'}</td>
            </tr>
          ))
        )}
      </DataTable>
      <Modal
        open={editing !== null}
        title={editing === 'new' ? 'Add department' : 'Edit department'}
        onClose={() => setEditing(null)}
      >
        {editing !== null && (
          <DepartmentForm
            department={editing === 'new' ? null : editing}
            onDone={() => setEditing(null)}
          />
        )}
      </Modal>
    </>
  );
}

function DepartmentForm({
  department,
  onDone,
}: {
  department: Department | null;
  onDone: () => void;
}) {
  const hods = useUsers('role=hod&status=active');
  const save = useSave<CreateDepartment, Department>('departments', ['departments', 'users']);
  const [name, setName] = useState(department?.name ?? '');
  const [costCentre, setCostCentre] = useState(department?.costCentre ?? '');
  const [hodUserId, setHodUserId] = useState(department?.hod?.id ?? '');

  function submit(e: FormEvent) {
    e.preventDefault();
    save.mutate(
      {
        id: department?.id,
        body: { name, costCentre: costCentre || undefined, hodUserId: hodUserId || null },
      },
      { onSuccess: onDone },
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <TextField
        label="Cost centre"
        value={costCentre}
        onChange={(e) => setCostCentre(e.target.value)}
        hint="Optional"
      />
      <Field label="HOD" hint="Only users with the HOD role are listed">
        <Select value={hodUserId} onChange={(e) => setHodUserId(e.target.value)}>
          <option value="">No HOD</option>
          {hods.data?.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
              {u.department ? ` (${u.department.name})` : ''}
            </option>
          ))}
        </Select>
      </Field>
      <ErrorBanner error={save.error} />
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={save.isPending || name.trim().length < 2}>
          {save.isPending ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
