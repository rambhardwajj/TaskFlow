import { TaskStatus } from "@/redux/slices/projectsTasksSlice";
import { AppDispatch } from "@/redux/store/store";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const sections: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];


const MyTasks = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [userTasks, setUserTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await axios.get(`http://localhost:8200/api/v1/task/getAll`, {
        withCredentials: true,
      });

      console.log(res.data.data);
      setUserTasks(res.data.data);
    };

    fetchTasks();
  }, []);

 

  return (
    <div>
     
    </div>
  );
};

export default MyTasks;
