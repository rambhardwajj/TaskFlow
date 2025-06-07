import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface AssignedUserDialogProps {
  user: {
    avatar: string;
    userName: string;
    email: string;
  };
}

export default function AssignedUserDialog({
  user,
}: AssignedUserDialogProps) {
  return (
      <DialogContent className="bg-neutral-900 text-white max-w-sm rounded-xl p-0 overflow-hidden border-none">
        {/* Top Section */}
        <div className="bg-blue-500 h-20 relative flex items-center justify-center">
          <img
            src={user.avatar}
            alt={user.userName}
            className="w-20 h-20 rounded-full object-cover border-4 border-neutral-900 absolute -bottom-10"
          />
        </div>

        {/* Info Section */}
        <div className="mt-12 text-center px-4 pb-6">
          <h3 className="text-lg font-semibold">{user.userName}</h3>

          <div className="flex items-center justify-center gap-2 mt-3 text-sm text-zinc-300">
            <Mail className="w-4 h-4" />
            <span>{user.email}</span>
          </div>

          <div className="flex justify-center gap-3 mt-6">
            <Button
              variant="secondary"
              className="bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700 text-sm"
            >
              View profile
            </Button>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700 text-sm"
            >
              Assigned issues
            </Button>
          </div>
        </div>
      </DialogContent>
  );
}
