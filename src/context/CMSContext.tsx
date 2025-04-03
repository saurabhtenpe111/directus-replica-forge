
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Collection, User, Item, Activity, Dashboard } from '@/types/cms';
import { collections as initialCollections } from '@/data/mock/collections';
import { users as initialUsers } from '@/data/mock/users';
import { activities as initialActivities } from '@/data/mock/activities';

interface CMSContextType {
  collections: Collection[];
  users: User[];
  items: Record<string, Item[]>;
  activities: Activity[];
  currentUser: User | null;
  dashboard: Dashboard;
  addCollection: (collection: Omit<Collection, 'id'>) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addItem: (collectionId: string, item: Omit<Item, 'id'>) => void;
  updateItem: (collectionId: string, id: string, updates: Partial<Item>) => void;
  deleteItem: (collectionId: string, id: string) => void;
  logActivity: (activity: Omit<Activity, 'id'>) => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export function CMSProvider({ children }: { children: ReactNode }) {
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [items, setItems] = useState<Record<string, Item[]>>({});
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  
  // Assume the first admin user is the current user for now
  const currentUser = users.find(user => user.role === 'admin') || null;
  
  // Calculate dashboard data
  const dashboard: Dashboard = {
    totalCollections: collections.length,
    totalUsers: users.length,
    totalItems: Object.values(items).reduce((acc, arr) => acc + arr.length, 0),
    recentActivity: activities.slice(0, 5),
  };
  
  // Collection operations
  const addCollection = (collection: Omit<Collection, 'id'>) => {
    const newCollection = {
      ...collection,
      id: crypto.randomUUID(),
    } as Collection;
    
    setCollections(prev => [...prev, newCollection]);
    logActivity({
      action: 'create',
      userId: currentUser?.id || '',
      collectionName: newCollection.name,
      timestamp: new Date(),
    });
  };
  
  const updateCollection = (id: string, updates: Partial<Collection>) => {
    setCollections(prev => 
      prev.map(collection => 
        collection.id === id ? { ...collection, ...updates } : collection
      )
    );
    
    logActivity({
      action: 'update',
      userId: currentUser?.id || '',
      collectionName: updates.name || collections.find(c => c.id === id)?.name || '',
      timestamp: new Date(),
    });
  };
  
  const deleteCollection = (id: string) => {
    const collection = collections.find(c => c.id === id);
    setCollections(prev => prev.filter(collection => collection.id !== id));
    
    if (collection) {
      logActivity({
        action: 'delete',
        userId: currentUser?.id || '',
        collectionName: collection.name,
        timestamp: new Date(),
      });
    }
  };
  
  // User operations
  const addUser = (user: Omit<User, 'id'>) => {
    const newUser = {
      ...user,
      id: crypto.randomUUID(),
    } as User;
    
    setUsers(prev => [...prev, newUser]);
    logActivity({
      action: 'create',
      userId: currentUser?.id || '',
      timestamp: new Date(),
    });
  };
  
  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === id ? { ...user, ...updates } : user
      )
    );
    
    logActivity({
      action: 'update',
      userId: currentUser?.id || '',
      timestamp: new Date(),
    });
  };
  
  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    
    logActivity({
      action: 'delete',
      userId: currentUser?.id || '',
      timestamp: new Date(),
    });
  };
  
  // Item operations
  const addItem = (collectionId: string, item: Omit<Item, 'id'>) => {
    const newItem = {
      ...item,
      id: crypto.randomUUID(),
    } as Item;
    
    setItems(prev => ({
      ...prev,
      [collectionId]: [...(prev[collectionId] || []), newItem],
    }));
    
    const collection = collections.find(c => c.id === collectionId);
    
    logActivity({
      action: 'create',
      userId: currentUser?.id || '',
      collectionName: collection?.name || '',
      itemId: newItem.id,
      timestamp: new Date(),
    });
  };
  
  const updateItem = (collectionId: string, id: string, updates: Partial<Item>) => {
    setItems(prev => ({
      ...prev,
      [collectionId]: (prev[collectionId] || []).map(item => 
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
    
    const collection = collections.find(c => c.id === collectionId);
    
    logActivity({
      action: 'update',
      userId: currentUser?.id || '',
      collectionName: collection?.name || '',
      itemId: id,
      timestamp: new Date(),
    });
  };
  
  const deleteItem = (collectionId: string, id: string) => {
    setItems(prev => ({
      ...prev,
      [collectionId]: (prev[collectionId] || []).filter(item => item.id !== id),
    }));
    
    const collection = collections.find(c => c.id === collectionId);
    
    logActivity({
      action: 'delete',
      userId: currentUser?.id || '',
      collectionName: collection?.name || '',
      itemId: id,
      timestamp: new Date(),
    });
  };
  
  // Activity operations
  const logActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity = {
      ...activity,
      id: crypto.randomUUID(),
    } as Activity;
    
    setActivities(prev => [newActivity, ...prev].slice(0, 100)); // Keep last 100 activities
  };
  
  return (
    <CMSContext.Provider
      value={{
        collections,
        users,
        items,
        activities,
        currentUser,
        dashboard,
        addCollection,
        updateCollection,
        deleteCollection,
        addUser,
        updateUser,
        deleteUser,
        addItem,
        updateItem,
        deleteItem,
        logActivity,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
}

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (context === undefined) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
