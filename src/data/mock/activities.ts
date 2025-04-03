
import { Activity } from '@/types/cms';

export const activities: Activity[] = [
  {
    id: '1',
    action: 'login',
    userId: '1',
    timestamp: new Date('2025-04-03T08:30:00Z'),
  },
  {
    id: '2',
    action: 'create',
    userId: '1',
    collectionName: 'Articles',
    itemId: 'article-1',
    timestamp: new Date('2025-04-03T09:15:00Z'),
  },
  {
    id: '3',
    action: 'update',
    userId: '2',
    collectionName: 'Products',
    itemId: 'product-1',
    timestamp: new Date('2025-04-03T10:45:00Z'),
  },
  {
    id: '4',
    action: 'delete',
    userId: '1',
    collectionName: 'Categories',
    itemId: 'category-3',
    timestamp: new Date('2025-04-02T14:30:00Z'),
  },
  {
    id: '5',
    action: 'login',
    userId: '2',
    timestamp: new Date('2025-04-02T14:00:00Z'),
  },
  {
    id: '6',
    action: 'update',
    userId: '1',
    collectionName: 'Articles',
    itemId: 'article-2',
    timestamp: new Date('2025-04-02T11:20:00Z'),
  },
  {
    id: '7',
    action: 'create',
    userId: '2',
    collectionName: 'Products',
    itemId: 'product-2',
    timestamp: new Date('2025-04-02T10:15:00Z'),
  },
  {
    id: '8',
    action: 'login',
    userId: '3',
    timestamp: new Date('2025-04-01T11:20:00Z'),
  },
];
