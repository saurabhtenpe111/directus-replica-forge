
import React from 'react';
import { 
  Database, 
  Users, 
  FileText, 
  Calendar 
} from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

const StatCard = ({ title, value, icon: Icon }) => (
  <Card className="overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const ActivityItem = ({ activity, users }) => {
  const user = users.find(u => u.id === activity.userId);
  const userName = user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
  
  const getActivityDescription = () => {
    switch (activity.action) {
      case 'login':
        return `logged in`;
      case 'logout':
        return `logged out`;
      case 'create':
        return `created an item in ${activity.collectionName}`;
      case 'update':
        return `updated an item in ${activity.collectionName}`;
      case 'delete':
        return `deleted an item from ${activity.collectionName}`;
      default:
        return `performed an action`;
    }
  };
  
  return (
    <div className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 bg-directus-gray rounded-full flex items-center justify-center text-directus-blue font-medium">
        {userName.charAt(0)}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium">{userName}</span>
            <span className="text-gray-600"> {getActivityDescription()}</span>
          </div>
          <span className="text-sm text-gray-500">
            {format(activity.timestamp, 'MMM d, h:mm a')}
          </span>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { dashboard, collections, users, activities } = useCMS();
  
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Collections" 
          value={dashboard.totalCollections} 
          icon={Database} 
        />
        <StatCard 
          title="Total Content Items" 
          value={collections.reduce((sum, col) => sum + col.itemCount, 0)} 
          icon={FileText} 
        />
        <StatCard 
          title="Total Users" 
          value={dashboard.totalUsers} 
          icon={Users} 
        />
        <StatCard 
          title="Last Updated" 
          value={format(new Date(), 'MMM d, yyyy')} 
          icon={Calendar} 
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {activities.slice(0, 5).map(activity => (
                <ActivityItem 
                  key={activity.id} 
                  activity={activity} 
                  users={users} 
                />
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Collections Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {collections.slice(0, 4).map(collection => (
                <div key={collection.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-directus-blue/10 rounded-md flex items-center justify-center text-directus-blue mr-3">
                      <FileText size={16} />
                    </div>
                    <span className="font-medium">{collection.name}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {collection.itemCount} items
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
