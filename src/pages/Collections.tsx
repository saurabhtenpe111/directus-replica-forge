
import React from 'react';
import { 
  MoreHorizontal, 
  PlusCircle, 
  Database, 
  FileText,
  Tag, 
  ShoppingCart 
} from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

// Map collection slugs to icons
const collectionIcons = {
  articles: FileText,
  products: Database,
  categories: Tag,
  orders: ShoppingCart,
};

const Collections: React.FC = () => {
  const { collections } = useCMS();

  const getCollectionIcon = (slug: string) => {
    const IconComponent = collectionIcons[slug] || Database;
    return <IconComponent size={20} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Collections</h2>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Collection
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {collections.map(collection => (
          <Link 
            key={collection.id}
            to={`/collections/${collection.id}`}
            className="directus-card hover:border-directus-blue transition-all duration-200"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-directus-blue/10 rounded-md flex items-center justify-center text-directus-blue mr-3">
                    {getCollectionIcon(collection.slug)}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{collection.name}</h3>
                    <p className="text-sm text-gray-500">{collection.itemCount} items</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-gray-400">
                  <MoreHorizontal size={18} />
                </Button>
              </div>
              
              <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Updated {format(collection.lastModified, 'MMM d, yyyy')}</span>
                  <span>{collection.fields.length} fields</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Collections;
