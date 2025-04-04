
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

const DeleteAccountDialog: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const handleDelete = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    
    try {
      // Delete the user's profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
      
      if (profileError) {
        console.error('Error deleting profile:', profileError);
        throw profileError;
      }
      
      // Delete the user account
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (authError) {
        console.error('Error deleting user:', authError);
        throw authError;
      }
      
      // Sign out the user
      await signOut();
      
      toast({
        title: 'Account deleted',
        description: 'Your account has been successfully deleted.',
      });
    } catch (error) {
      console.error('Error during account deletion:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete account. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };
  
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="mt-8 border-t pt-8">
        <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Delete Account
          </Button>
        </AlertDialogTrigger>
      </div>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove all of your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4">
          <p className="text-sm font-medium mb-2">
            Type "delete" to confirm:
          </p>
          <Input
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder="delete"
            className="mb-2"
          />
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting || confirmation !== 'delete'}
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccountDialog;
