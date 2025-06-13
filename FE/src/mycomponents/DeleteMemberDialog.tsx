import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import {API_BASE_URL} from "../../config"


interface DeleteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberId: string;
  projectId: string;
  onSuccess: () => void;
}

export const DeleteMemberDialog = ({ open, onOpenChange, memberId, projectId, onSuccess }: DeleteMemberDialogProps) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/project/${projectId}/remove/${memberId}`, {
        withCredentials: true,
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to delete member")
      console.error("Failed to delete member", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to remove this member?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-neutral-400">This action cannot be undone.</p>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete}>
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
