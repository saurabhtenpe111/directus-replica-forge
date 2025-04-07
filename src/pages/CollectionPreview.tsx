
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CollectionPreview() {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // Show a message that we're redirecting
    console.log('Redirecting to fields configuration page...');
  }, []);

  const handleBackClick = () => {
    navigate(`/collections/${collectionId}/fields`);
  };

  return (
    <MainLayout>
      <div className="p-6 md:p-10">
        <div className="flex flex-col items-center justify-center max-w-md mx-auto py-12">
          <h1 className="text-2xl font-bold mb-4">Collection Preview</h1>
          <p className="text-gray-500 text-center mb-6">
            Collection preview is now integrated directly in the field configuration page.
            You can access it by clicking the "Preview" button.
          </p>
          
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleBackClick}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go to Field Configuration
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
