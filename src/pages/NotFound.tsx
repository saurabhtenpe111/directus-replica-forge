
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-6">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-directus-blue rounded-lg flex items-center justify-center text-white">
            <Database size={32} />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="bg-directus-blue hover:bg-directus-darkBlue">
          <Link to="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
