import { ProjectsNavigation } from "../mycomponents/ProjectsNavigation";
import ProjectTable from "../mycomponents/ProjectTable";


export default function Dashboard() {

  
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ProjectsNavigation />
      <main className="flex-1 p-6 overflow-auto">
        <ProjectTable /> 
      </main>
    </div>
  );
}
