import { useEffect, useState } from "react";
import { ProjectsNavigation } from "../mycomponents/ProjectsNavigation";
import ProjectTable from "../mycomponents/ProjectTable";

export default function Dashboard() {
  // api call to get all the projects
  const [projects, setProjects] = useState([]);

  useEffect( () =>{
    
  },[])
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ProjectsNavigation />
      <main className="flex-1 p-6 overflow-auto">
        <ProjectTable projects /> 
      </main>
    </div>
  );
}
