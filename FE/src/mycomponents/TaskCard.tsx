import { FC } from "react";
import { CalendarDays, Paperclip } from "lucide-react";
import { Task } from "../pages/TasksOfProject";

export const TaskCard: FC<Task> = ({
  title,
  desc,
  attachments,
  updatedAt,
  assignedTo,
  assignedBy,
}) => {
  return (
    <div className="bg-neutral-950 p-4 rounded-md border border-zinc-700 hover:border-blue-500 transition-all hover:shadow-lg group cursor-pointer space-y-2">
      {/* Title */}
      <p className="font-semibold text-cyan-500 group-hover:text-blue-300 transition">{title}</p>

      {/* Description Tag */}
      {desc && (
        <div className="inline-block bg-zinc-800 text-zinc-300 px-2 py-1 rounded-md text-xs font-medium">
          {desc}
        </div>
      )}

      {/* Metadata Row */}
      <div className="flex items-center justify-between text-xs text-zinc-400 mt-2">
        <div className="flex items-center gap-2">
          <CalendarDays size={14} />
          <span>{new Date(updatedAt).toLocaleDateString()}</span>
        </div>

        {attachments && attachments?.length > 0 && (
          <div className="flex items-center gap-1">
            <Paperclip size={14} />
            <span>{attachments.length}</span>
          </div>
        )}
      </div>

      {/* Assigned Info */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <img
            src={assignedTo.avatar}
            alt={assignedTo.userName}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-xs text-cyan-600">To: {assignedTo.userName}</span>
        </div>
        <div className="flex items-center gap-2">
          <img
            src={assignedBy.avatar}
            alt={assignedBy.userName}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-xs text-cyan-800">By: {assignedBy.userName}</span>
        </div>
      </div>
    </div>
  );
};
