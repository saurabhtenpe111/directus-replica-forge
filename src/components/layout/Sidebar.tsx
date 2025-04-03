
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Database, Home, Layers, Settings, Users, FileText } from 'lucide-react';
import { 
  Sidebar as ShadcnSidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { useCMS } from '@/context/CMSContext';

export const Sidebar: React.FC = () => {
  const { collections } = useCMS();

  return (
    <ShadcnSidebar className="border-r border-directus-border">
      <SidebarHeader className="h-14 flex items-center justify-between px-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-directus-blue rounded-lg flex items-center justify-center text-white font-semibold mr-2">
            D
          </div>
          <span className="font-semibold text-white">Directus</span>
        </div>
        <SidebarTrigger className="text-white" />
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/" className="flex items-center gap-2">
                    <Home size={18} />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/collections" className="flex items-center gap-2">
                    <Database size={18} />
                    <span>Collections</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {collections.map(collection => (
                <SidebarMenuItem key={collection.id}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={`/collections/${collection.id}`} 
                      className="flex items-center gap-2 pl-8"
                    >
                      <FileText size={16} />
                      <span>{collection.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/users" className="flex items-center gap-2">
                    <Users size={18} />
                    <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/settings" className="flex items-center gap-2">
                    <Settings size={18} />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/activity" className="flex items-center gap-2">
                    <BarChart3 size={18} />
                    <span>Activity</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 py-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-directus-blue">
            A
          </div>
          <div className="overflow-hidden">
            <div className="truncate text-sm text-white">Admin User</div>
            <div className="truncate text-xs text-gray-400">admin@example.com</div>
          </div>
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};
