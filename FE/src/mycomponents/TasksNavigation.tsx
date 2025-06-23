import { Button } from "@/components/ui/button";
import { Project } from "./ProjectTable";
import { Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const TasksNavigation = ({currProject}: {currProject: Project }) => {
  const navigate = useNavigate()
  const {projectId} = useParams()
  return (
    <header className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold">{currProject.name}</h2>
      <Button className="bg-cyan-700 cursor-pointer hover:bg-cyan-500"
        onClick={()=>{
          navigate(`/${projectId}`)
        }}
      > Add Members<Plus /> </Button>
    </header>
  );
};

export  {TasksNavigation};
