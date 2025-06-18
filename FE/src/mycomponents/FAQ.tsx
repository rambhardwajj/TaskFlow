import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AppWindowMac, Plus } from "lucide-react";

const faqData = [
  {
    id: "item-1",
    question: "How to create a project?",
    answer: (
      <ul className="list-disc pl-6 space-y-1">
        <li>
          Go to the <strong>My Projects</strong> section from your dashboard.
        </li>
        <li>
          Click on the <strong>green icon</strong> to open the Project Details
          view.
        </li>
        <li>
          Or click on the <strong>project title</strong> to navigate to the
          Kanban view.
        </li>
      </ul>
    ),
  },
  {
    id: "item-2",
    question: "How to add a task in the project?",
    answer: (
      <ul className="list-disc pl-6 space-y-1">
        <li>
          Inside the <strong>My Projects</strong> section, select your project.
        </li>
        <li>
          Click on the <strong>project name</strong> to open the KanBan View.
        </li>
        <li>
          On to the <strong>TODO</strong> column. Click on{" "}
          <strong>+ Add Task</strong>.
        </li>
        <li>
          Fill in task details like title, description, assignee, and due date.
        </li>
        <li>
          Click on <strong>Create</strong> to add the task.
        </li>
      </ul>
    ),
  },
  {
    id: "item-3",
    question: "How to add a member in the project?",
    answer: (
      <ul className="list-disc pl-6 space-y-1">
        <li>
          Go to the <strong>My Projects</strong> section from your dashboard.
        </li>
        <li>
          Click on the <strong>green icon</strong> to open the Project Details
          view.
        </li>
        <li>
          <div>
            Or click on the{" "}
            <span>
              {" "}
              <AppWindowMac className="text-green-500" />
            </span>{" "}
            to navigate to the Project Detail view.
          </div>
        </li>
        <li>
          Click on the <Plus className="text-amber-400" /> to open the Add new member.
        </li>
      </ul>
    ),
  },
  {
    id: "item-4",
    question: "What are the roles and their permissions?",
    answer: (
      <div className="space-y-3">
        <p>
          <strong>Owner:</strong> Has full control over the project and its
          entities.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Manage project (create, view, edit, delete)</li>
          <li>Manage tasks (create, view, edit, delete, assign/unassign)</li>
          <li>Manage members (add, edit, delete)</li>
          <li>Manage subtasks (create, view, edit, delete)</li>
          <li>Manage notes (create, view, edit, delete)</li>
        </ul>

        <p>
          <strong>Project Admin:</strong> Manages most aspects except project
          creation.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Manage project (view, edit, delete)</li>
          <li>Manage tasks (create, view, edit, delete, assign/unassign)</li>
          <li>Manage members (add, edit, delete)</li>
          <li>Manage subtasks (create, view, edit, delete)</li>
          <li>Manage notes (create, view, edit, delete)</li>
        </ul>

        <p>
          <strong>Member:</strong> Focused on their assigned work only.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Project view access</li>
          <li>Can create and view their own tasks</li>
          <li>Manage subtasks (create, view, edit, delete)</li>
          <li>Manage notes (create, view, edit, delete)</li>
        </ul>
      </div>
    ),
  },
  {
    id: "item-5",
    question: "How to change the password?",
    answer: `Go to your Profile Settings and click on "Security". Enter your current password and
    the new one, then submit.`,
  },
];

export const FAQ = () => {
  return (
    <section className="mb-8 w-[71vw]  flex-col justify-center ">
      <h2 className="text-xl font-semibold mb-4 bg-cyan-950 py-3 rounded-xs text-neutral-100 text-center">
        Frequently Asked <span className="text--500">Questions</span> ❓
      </h2>
      <Accordion type="single" collapsible className="space-y-2">
        {faqData.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger className=" text-cyan-100 text-sm cursor-pointer ">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-neutral-300 ">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
