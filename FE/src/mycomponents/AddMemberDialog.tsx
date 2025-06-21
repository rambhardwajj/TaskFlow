import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {API_BASE_URL} from "../../config"

export const AddMemberDialog = ({
  open,
  onOpenChange,
  projectId,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onSuccess: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);

  const handleAddMember = async () => {
    try {
      setLoading(true);
      toast.loading("wait")
       await axios.post(
        `${API_BASE_URL}/api/v1/project/${projectId}/add`,
        { email, role },
        {
          withCredentials: true,
        }
      );

      onSuccess();
      onOpenChange(false);
      setEmail("");
      setRole("member");
      toast.dismiss()
      toast.success("user Added in the Project")
    } catch (error: any) {
      toast.dismiss()
      toast.error(error.response.data.message)
      console.error("Add member error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-950 text-white border border-neutral-800 rounded-xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-lg font-semibold">
            Add New Member
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <Label className="text-neutral-400 text-sm">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="someone@example.com"
              className="mt-1 bg-neutral-800 text-white border border-neutral-700"
            />
          </div>

          <div>
            <Label className="text-neutral-400 text-sm">Role</Label>
            <Select value={role} onValueChange={(val) => setRole(val)}>
              <SelectTrigger className="bg-neutral-800 text-white border border-neutral-700 focus:ring-1 focus:ring-neutral-600 rounded-md px-3 py-2 mt-1">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border border-neutral-700">
               
                <SelectItem value="member" className="text-white">
                  Member
                </SelectItem>
                <SelectItem value="projectAdmin" className="text-white">
                  Project Admin
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            disabled={loading || !email}
            onClick={handleAddMember}
            className="bg-zinc-200 text-black font-medium hover:bg-white"
          >
            {loading ? "Adding..." : "Add Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
