
import React from 'react';
import { 
  MoreHorizontal, 
  PlusCircle, 
  Search, 
  UserPlus,
  User, 
  Shield
} from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const Users: React.FC = () => {
  const { users } = useCMS();
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Admin</Badge>;
      case 'editor':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Editor</Badge>;
      case 'viewer':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Viewer</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'invited':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Invited</Badge>;
      case 'blocked':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Blocked</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Users</h2>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input className="pl-10" placeholder="Search users..." />
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-gray-500">
            <Shield size={16} className="mr-2" />
            Roles
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-directus-blue/10 rounded-full flex items-center justify-center text-directus-blue">
                      <User size={16} />
                    </div>
                    <div>
                      <div className="font-medium">{user.firstName} {user.lastName}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>
                  {user.lastLogin 
                    ? format(user.lastLogin, 'MMM d, yyyy')
                    : '—'}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Reset Password</DropdownMenuItem>
                      {user.status === 'active' ? (
                        <DropdownMenuItem>Deactivate</DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem>Activate</DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Users;
