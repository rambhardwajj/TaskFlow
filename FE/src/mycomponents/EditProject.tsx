import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface EditProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialName: string;
  initialDesc: string;
  onSubmit: (data: { name: string; desc: string }) => void;
}

export const EditProjectDialog = ({
  open,
  onOpenChange,
  initialName,
  initialDesc,
  onSubmit,
}: EditProjectDialogProps) => {
  const [name, setName] = useState(initialName);
  const [desc, setDesc] = useState(initialDesc);

  const handleSubmit = () => {
    onSubmit({ name, desc });
    onOpenChange(false); // Close dialog after submit
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1a1a] text-white border border-neutral-800 rounded-xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Edit Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium text-neutral-300">Project Name</label>
            <Input
              className="mt-1 bg-[#2a2a2a] border-neutral-700 text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-300">Description</label>
            <Textarea
              className="mt-1 bg-[#2a2a2a] border-neutral-700 text-white"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Describe your project..."
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-green-600 hover:bg-green-700" onClick={handleSubmit}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
