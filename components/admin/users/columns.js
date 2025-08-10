// columns.js - Definisi kolom untuk Users DataTable (TanStack Table)
// JavaScript only per KISS

import { h } from 'vue';

export const createUserColumns = ({ onEdit, onDelete }) => {
  return [
    {
      id: 'name',
      header: () => h('div', { class: 'font-medium' }, 'Name'),
      accessorFn: (row) => `${row.first_name} ${row.last_name}`.trim(),
      cell: ({ getValue }) => h('div', { class: 'truncate max-w-[220px]' }, getValue()),
      enableSorting: true,
    },
    {
      accessorKey: 'email',
      header: () => h('div', { class: 'font-medium' }, 'Email'),
      cell: ({ row }) => h('div', { class: 'truncate max-w-[240px]' }, row.getValue('email')),
      enableSorting: true,
    },
    {
      accessorKey: 'phone',
      header: () => h('div', { class: 'font-medium' }, 'Phone'),
      cell: ({ row }) => h('div', { class: 'text-muted-foreground' }, row.getValue('phone') || '-'),
      enableSorting: false,
    },
    {
      accessorKey: 'username',
      header: () => h('div', { class: 'font-medium' }, 'Username'),
      cell: ({ row }) => h('div', { class: 'text-muted-foreground' }, row.getValue('username')),
      enableSorting: true,
    },
    {
      accessorKey: 'role',
      header: () => h('div', { class: 'font-medium' }, 'Role'),
      cell: ({ row }) => {
        const role = row.getValue('role');
        const badgeClass = role === 'ADMIN' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700';
        return h('span', { class: `inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badgeClass}` }, role);
      },
      enableSorting: true,
    },
    {
      accessorKey: 'created_at',
      header: () => h('div', { class: 'font-medium text-right' }, 'Created'),
      cell: ({ row }) => {
        const d = row.getValue('created_at');
        const dt = d ? new Date(d) : null;
        return h('div', { class: 'text-right text-muted-foreground' }, dt ? dt.toLocaleDateString() : '-');
      },
      enableSorting: true,
    },
    {
      id: 'actions',
      header: () => h('div', { class: 'text-right' }, ''),
      cell: ({ row }) => {
        const user = row.original;
        return h('div', { class: 'flex items-center justify-end gap-2' }, [
          h(
            'button',
            {
              class: 'text-xs px-2.5 py-1 rounded border hover:bg-sidebar-accent transition-colors',
              onClick: () => onEdit && onEdit(user),
            },
            'Edit'
          ),
          h(
            'button',
            {
              class: 'text-xs px-2.5 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 transition-colors',
              onClick: () => onDelete && onDelete(user),
            },
            'Delete'
          ),
        ]);
      },
      enableSorting: false,
    },
  ];
};
