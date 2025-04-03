
import { User } from '@/types/cms';

export const users: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    status: 'active',
    lastLogin: new Date('2025-04-03T08:30:00Z'),
    createdAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    email: 'editor@example.com',
    firstName: 'Editor',
    lastName: 'Smith',
    role: 'editor',
    status: 'active',
    lastLogin: new Date('2025-04-02T14:45:00Z'),
    createdAt: new Date('2023-02-10'),
  },
  {
    id: '3',
    email: 'viewer@example.com',
    firstName: 'View',
    lastName: 'Jones',
    role: 'viewer',
    status: 'active',
    lastLogin: new Date('2025-04-01T11:20:00Z'),
    createdAt: new Date('2023-03-05'),
  },
  {
    id: '4',
    email: 'pending@example.com',
    firstName: 'Pending',
    lastName: 'Approval',
    role: 'editor',
    status: 'invited',
    createdAt: new Date('2023-04-01'),
  },
];
