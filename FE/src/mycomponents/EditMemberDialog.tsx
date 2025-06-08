import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import axios from "axios";

interface EditMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: any;
  projectId: string;
  onSuccess: () => void;
}

export const EditMemberDialog = ({ open, onOpenChange, member, projectId, onSuccess }: EditMemberDialogProps) => {
    console.log("member ", member)
  const [role, setRole] = useState(member.role);

  const handleUpdateRole = async () => {
    try {
      await axios.patch(
        `http://localhost:8200/api/v1/project/${projectId}/update/${member._id}`,
        { role },
        { withCredentials: true }
      );
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update role", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-900 text-white">
        <DialogHeader>
          <DialogTitle>Edit Member Role</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Label>Name</Label>
          <p className="text-white">{member.userInfo.userName}</p>

          <Label>Email</Label>
          <p className="text-white">{member.userInfo.email}</p>

          <Label>Role</Label>
          <Select value={role} onValueChange={(value) => setRole(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="projectAdmin">Project Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={handleUpdateRole}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
