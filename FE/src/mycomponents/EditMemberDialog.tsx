import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";

export const EditMemberDialog = ({
  open,
  onOpenChange,
  member,
  projectId,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: any;
  projectId: string;
  onSuccess: () => void;
}) => {
  const [role, setRole] = useState(member.role);
  const [loading, setLoading] = useState(false);

  const handleUpdateRole = async () => {
    try {
      setLoading(true);
      await fetch(
        `http://localhost:8200/api/v1/project/${projectId}/update/${member.userInfo._id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role }),
        }
      );
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-950 border border-neutral-800 rounded-xl text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">
            Edit Member Role
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <Label className="text-neutral-400 text-xs">Name</Label>
            <p className="text-sm font-medium text-zinc-100 mt-1">
              {member.userInfo.userName}
            </p>
          </div>

          <div>
            <Label className="text-neutral-400 text-xs">Email</Label>
            <p className="text-sm text-zinc-300 mt-1">
              {member.userInfo.email}
            </p>
          </div>

          <div>
            <Label className="text-neutral-400 text-xs mb-1 block">Role</Label>
            <Select value={role} onValueChange={(val) => setRole(val)}>
              <SelectTrigger className="bg-neutral-800 text-white border border-neutral-700 focus:ring-1 focus:ring-neutral-600 rounded-md px-3 py-2">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border border-neutral-700">
                <SelectItem
                  value="owner"
                  className="text-sm text-white hover:bg-neutral-800"
                >
                  Owner
                </SelectItem>
                <SelectItem
                  value="member"
                  className="text-sm text-white hover:bg-neutral-800"
                >
                  Member
                </SelectItem>
                <SelectItem
                  value="projectAdmin"
                  className="text-sm text-white hover:bg-neutral-800"
                >
                  Project Admin
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            onClick={handleUpdateRole}
            disabled={loading}
            className="bg-zinc-200 text-black hover:bg-white font-semibold"
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
