import { FC } from "react";
import { CalendarDays, Paperclip, Plus } from "lucide-react";
import { Task } from "@/redux/slices/projectsTasksSlice";

export const TaskCard: FC<Task> = ({
  title,
  desc,
  attachments,
  updatedAt,
  assignedTo,
  assignedBy,
  status,
}) => {
  return (
    <div className="bg-neutral-950 p-4 rounded-md border border-zinc-700 hover:border-blue-500 transition-all hover:shadow-lg group cursor-pointer space-y-2">
      {/* Title */}
      <div className="flex justify-between">
        <p className="font-semibold text-cyan-500 group-hover:text-blue-300 transition">
          {title}
        </p>
        <button>
          <Plus className="w-4 cursor-pointer hover:scale-[1.3] hover:text-green-600 " />
        </button>
      </div>

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
            <Paperclip size={14} className="hover:text-cyan-800" />
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
          <span className="text-[10px] text-zinc-400 ">
            Assignie:{" "}
            {
              <p className="font-bold text-xs hover:text-cyan-600">
                {assignedTo.userName}
              </p>
            }
          </span>
        </div>
        <div className="flex items-center gap-2">
          <img
            src={assignedBy.avatar}
            alt={assignedBy.userName}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-[10px]  text-zinc-400">
            Reporter:{" "}
            {
              <p className="font-bold hover:text-cyan-600 text-xs">
                {assignedBy.userName}
              </p>
            }
          </span>
        </div>
      </div>
    </div>
  );
};
