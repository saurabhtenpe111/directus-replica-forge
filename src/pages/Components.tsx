
import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ComponentsPanel } from '@/components/ComponentsPanel';
import { fetchCollections, createField, updateField } from '@/services/CollectionService';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ComponentsPage: React.FC = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        setIsLoading(true);
        const collectionsData = await fetchCollections();
        setCollections(collectionsData);
      } catch (error) {
        console.error("Error loading collections:", error);
        toast({
          title: "Error loading collections",
          description: "There was a problem retrieving your collections.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCollections();
  }, []);

  // Function to create a new field
  const handleCreateField = async (collectionId: string, fieldData: any) => {
    try {
      setIsUpdating(true);
      console.log("Creating new field with data:", fieldData);
      
      // Call the service to create a new field
      const newField = await createField(collectionId, fieldData);
      
      console.log("New field created:", newField);
      
      // Update the collections list to include the new field
      setCollections(prevCollections => {
        return prevCollections.map(collection => {
          if (collection.id === collectionId) {
            return {
              ...collection,
              fields: [...(collection.fields || []), newField]
            };
          }
          return collection;
        });
      });

      toast({
        title: "Field created",
        description: `Field "${fieldData.name}" has been created successfully.`
      });
      
      return newField;
    } catch (error) {
      console.error("Error creating field:", error);
      toast({
        title: "Error creating field",
        description: "There was a problem creating the field.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  // Function to update an existing field
  const handleUpdateField = async (collectionId: string, fieldId: string, fieldData: any) => {
    try {
      setIsUpdating(true);
      console.log("Updating field with data:", fieldData);
      console.log("Field ID:", fieldId);
      console.log("Collection ID:", collectionId);
      
      // Call the service to update the field
      const updatedField = await updateField(collectionId, fieldId, fieldData);
      
      console.log("Field updated:", updatedField);
      
      // Update the collections list with the updated field
      setCollections(prevCollections => {
        return prevCollections.map(collection => {
          if (collection.id === collectionId) {
            const updatedFields = (collection.fields || []).map(field => {
              if (field.id === fieldId) {
                return updatedField;
              }
              return field;
            });
            
            return {
              ...collection,
              fields: updatedFields
            };
          }
          return collection;
        });
      });

      toast({
        title: "Field updated",
        description: `Field "${updatedField.name}" has been updated successfully.`
      });
      
      return updatedField;
    } catch (error) {
      console.error("Error updating field:", error);
      toast({
        title: "Error updating field",
        description: "There was a problem updating the field.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 md:p-10">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <ComponentsPanel 
            collections={collections}
            onCreateField={handleCreateField}
            onUpdateField={handleUpdateField}
            isUpdating={isUpdating}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default ComponentsPage;
