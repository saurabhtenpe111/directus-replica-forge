
import React from 'react';
import { 
  Search, 
  Calendar,
  ListFilter, 
  Download
} from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const Activity: React.FC = () => {
  const { activities, users } = useCMS();
  
  const getActionBadge = (action: string) => {
    switch (action) {
      case 'create':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Create</Badge>;
      case 'update':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Update</Badge>;
      case 'delete':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Delete</Badge>;
      case 'login':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Login</Badge>;
      case 'logout':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Logout</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };
  
  const getActivityDescription = (activity) => {
    const user = users.find(u => u.id === activity.userId);
    const userName = user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
    
    switch (activity.action) {
      case 'login':
        return <><span className="font-medium">{userName}</span> logged in</>;
      case 'logout':
        return <><span className="font-medium">{userName}</span> logged out</>;
      case 'create':
        return (
          <>
            <span className="font-medium">{userName}</span> created an item in 
            <span className="font-medium"> {activity.collectionName}</span>
          </>
        );
      case 'update':
        return (
          <>
            <span className="font-medium">{userName}</span> updated an item in 
            <span className="font-medium"> {activity.collectionName}</span>
          </>
        );
      case 'delete':
        return (
          <>
            <span className="font-medium">{userName}</span> deleted an item from 
            <span className="font-medium"> {activity.collectionName}</span>
          </>
        );
      default:
        return <><span className="font-medium">{userName}</span> performed an action</>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Activity Log</h2>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-gray-500">
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input className="pl-10" placeholder="Search activities..." />
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-gray-500">
            <Calendar size={16} className="mr-2" />
            Date Range
          </Button>
          
          <Button variant="outline" className="text-gray-500">
            <ListFilter size={16} className="mr-2" />
            Filter
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md overflow-hidden bg-white p-4">
        <div className="space-y-4">
          {activities.map(activity => (
            <div key={activity.id} className="flex items-start gap-4 p-4 border-b border-gray-100 last:border-0">
              <div className="w-10 h-10 bg-directus-gray rounded-full flex items-center justify-center text-directus-blue font-medium">
                {users.find(u => u.id === activity.userId)?.firstName.charAt(0) || '?'}
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    {getActionBadge(activity.action)}
                    <div className="text-gray-800">{getActivityDescription(activity)}</div>
                  </div>
                  
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    {format(activity.timestamp, 'MMM d, yyyy - h:mm a')}
                  </div>
                </div>
                
                {activity.itemId && (
                  <div className="mt-2 text-sm text-gray-500">
                    Item ID: {activity.itemId}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Activity;
