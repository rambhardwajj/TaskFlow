import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const NewTaskDialog = ({ open, onOpenChange, onSubmit }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => void;
}) => {
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [desc, setDesc] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("email", email);
    formData.append("desc", desc);
    if (files) {
      Array.from(files).forEach((file) => {
        formData.append("attachments", file); 
      });
    }
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1a1a] border border-zinc-700 max-w-xl mx-auto rounded-xl p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle className="max-w-[30vw] text-white text-2xl font-semibold">Create New Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Title */}
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="max-w-[30vw] bg-zinc-900 text-white border-zinc-700"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="bg-zinc-900 text-white border-zinc-700"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">Description</label>
            <Textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Describe the task"
              className="max-w-[30vw] bg-zinc-900 text-white border-zinc-700 min-h-[100px]"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">Attachments</label>
            <Input
              type="file"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="bg-zinc-900 text-white border-zinc-700 file:text-white file:bg-zinc-800 file:border-zinc-600 file:rounded file:px-3"
            />
          </div>
        </div>

        <DialogFooter className="pt-6">
          <Button
            onClick={handleSubmit}
            className= " cursor-pointer bg-cyan-600 hover:bg-cyan-700 text-white w-full sm:w-auto"
          >
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
