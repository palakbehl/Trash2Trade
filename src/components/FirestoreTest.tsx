import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { addSimpleTestData } from '@/utils/simpleTestData';
import { useToast } from '@/hooks/use-toast';
import { Database, Plus, ExternalLink } from 'lucide-react';

const FirestoreTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddTestData = async () => {
    setIsLoading(true);
    try {
      const result = await addSimpleTestData();
      toast({
        title: 'Test Data Added! 🎉',
        description: `Added user, waste request, and collector data. Check Firebase Console to view.`,
      });
      console.log('Test data IDs:', result);
    } catch (error) {
      toast({
        title: 'Error Adding Data',
        description: 'Check console for details.',
        variant: 'destructive',
      });
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>Firestore Test</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Add test data to Firestore and view it in the Firebase Console.
        </p>
        
        <Button 
          onClick={handleAddTestData}
          disabled={isLoading}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isLoading ? 'Adding Data...' : 'Add Test Data'}
        </Button>

        <div className="space-y-2 text-sm">
          <p className="font-medium">To view data in Firestore:</p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center">Firebase Console <ExternalLink className="h-3 w-3 ml-1" /></a></li>
            <li>Select your project</li>
            <li>Click "Firestore Database"</li>
            <li>View your collections: users, wasteRequests, collectors</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default FirestoreTest;
