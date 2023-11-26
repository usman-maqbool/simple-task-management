import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import { Route, Routes, useNavigate , Navigate} from "react-router-dom";
import Login from "./pages/Login";
import { baseURL } from "./Configuration";
import axios from "axios";
import Signup from "./pages/Signup";
function App() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([
    {
      id: Math.floor(Math.random() * 1000),
      isCompleted: false,
      user: {
        name: "umar",
        bio: "I am React Developer",
      },
      taskText: "Make Website Responsive",
    },
    {
      id: Math.floor(Math.random() * 1000),
      isCompleted: false,
      user: {
        name: "usman",
        bio: "I am Fullstack developer and CEO of DjenericSol pvt",
      },
      taskText: "Make payment to Bluedart",
    },
    {
      id: Math.floor(Math.random() * 1000),
      isCompleted: false,
      user: {
        name: "Tanvir",
        bio: "I am Python Django Developer",
      },
      taskText: "Add Paypal credit method in Mixed_Tenure",
    },
  ]);
  const localUserData = JSON.parse(localStorage.getItem("userData"));
  const [userData, setUserData] = useState(
    localUserData ? localUserData : null
  );
  const [allChanged, setAllChanged] = useState(false);
  const handleAddTask = (task) => {
    setTasks([task, ...tasks]);
  };
  const handleRemoveTask = (id) => {
     axios.delete(`${baseURL}/delete-task/${id}`, {
      headers: {
        Authorization: `Bearer ${userData.access_token}` ,
        "Content-Type": "application/json",
      },
    })
    .then(response => {
      const filteredTasks = tasks.filter((task) => task.id !== id);
      setTasks([...filteredTasks]);
    })
    .catch(err => console.error(err));
    // 
  };
  const handleUpdateTask = (updatedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks([...updatedTasks]);
  };
  const handleAllChangedTask = (boolean) => {
    const allChangedTasks = tasks.map((task) =>
      boolean
        ? {
            ...task,
            isCompleted: true,
          }
        : {
            ...task,
            isCompleted: false,
          }
    );
    setTasks([...allChangedTasks]);
    setAllChanged(boolean);
  };
  const handleChangedTask = (changeTask) => {
    const changedTasks = tasks.map((task) =>
      task.id === changeTask.id ? changeTask : task
    );
    setTasks([...changedTasks]);
  };
  
 
  useEffect(() => {
    const completedCount = tasks.reduce(
      (counter, task) => (task.isCompleted ? counter + 1 : counter),
      0
    );
    switch (completedCount) {
      case tasks.length:
        setAllChanged(true);
        break;
      default:
        setAllChanged(false);
        break;
    }
  }, [tasks]);
  useEffect(() => {
    if (!userData) {
      navigate("/login");
    }
    
  }, []);
  return (
    <div className="app flex-center">
      <div className="wrapper p-3 my-4">
        <Routes>
        <Route path="/" element={<Navigate to={`${userData ? '/tasks' : '/login'}`} />} />
          <Route
            path="/tasks"
            element={
              <HomePage
                userData={userData}
                setTasks={setTasks}
                tasks={tasks}
                handleAddTask={handleAddTask}
                allChanged={allChanged}
                handleAllChangedTask={handleAllChangedTask}
                handleChangedTask={handleChangedTask}
                handleRemoveTask={handleRemoveTask}
                handleUpdateTask={handleUpdateTask}
              />
            }
          />
          <Route path="/login" element={<Login setUserData={setUserData} />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
