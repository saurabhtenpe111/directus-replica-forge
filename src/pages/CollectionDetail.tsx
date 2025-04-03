
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Filter, 
  MoreHorizontal, 
  PlusCircle, 
  Search, 
  Settings2, 
  ListFilter,
  Eye
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

const CollectionDetail: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const { collections } = useCMS();
  
  const collection = collections.find(c => c.id === collectionId);
  
  if (!collection) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Collection Not Found</h2>
          <p className="text-gray-500 mb-4">The collection you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/collections">Back to Collections</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  // Generate some mock items
  const mockItems = Array.from({ length: 5 }, (_, index) => {
    const item: any = { id: `item-${index + 1}` };
    
    collection.fields.forEach(field => {
      switch (field.type) {
        case 'string':
          item[field.name] = `${field.name} Value ${index + 1}`;
          break;
        case 'text':
          item[field.name] = `This is a sample text for ${field.name} #${index + 1}`;
          break;
        case 'number':
          item[field.name] = (index + 1) * 10;
          break;
        case 'boolean':
          item[field.name] = index % 2 === 0;
          break;
        case 'date':
          item[field.name] = new Date(2023, 0, index + 1);
          break;
        default:
          item[field.name] = `${field.name} ${index + 1}`;
      }
    });
    
    return item;
  });
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/collections">
              <ArrowLeft size={18} />
            </Link>
          </Button>
          <h2 className="text-2xl font-semibold">{collection.name}</h2>
          <span className="ml-2 text-sm text-gray-500">{collection.itemCount} items</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Settings2 size={18} />
          </Button>
          <Button>
            <PlusCircle size={18} className="mr-2" />
            New Item
          </Button>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input className="pl-10" placeholder={`Search ${collection.name.toLowerCase()}...`} />
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-gray-500">
            <Filter size={16} className="mr-2" />
            Filters
          </Button>
          
          <Button variant="outline" className="text-gray-500">
            <ListFilter size={16} className="mr-2" />
            Sort
          </Button>
          
          <Button variant="outline" className="text-gray-500">
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Table */}
      <div className="border rounded-md overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              {collection.fields.map(field => (
                <TableHead key={field.id}>{field.name}</TableHead>
              ))}
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockItems.map(item => (
              <TableRow key={item.id}>
                {collection.fields.map(field => (
                  <TableCell key={`${item.id}-${field.id}`}>
                    {field.type === 'boolean' 
                      ? (item[field.name] ? 'Yes' : 'No')
                      : field.type === 'date' 
                        ? new Date(item[field.name]).toLocaleDateString()
                        : String(item[field.name])}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye size={16} />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CollectionDetail;
