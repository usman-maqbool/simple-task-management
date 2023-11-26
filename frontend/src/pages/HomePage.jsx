import React, { useEffect, useState } from "react";
import AddTask from "../components/AddTask";
import TaskList from "../components/TaskList";
import { baseURL } from "../Configuration";
import Profile1 from "../assets/profile-1.jpg";
import UserProfile from "../components/UserProfile";
import axios from "axios";
function HomePage({
  tasks,
  userData,
  setTasks,
  allChanged,
  handleAllChangedTask,
  handleChangedTask,
  handleRemoveTask,
  handleUpdateTask,
  handleAddTask,
}) {
  const [showUser, setShowUser] = useState(false);
  const handleCloseUser = () => {
    setShowUser(false);
  };
  const handleShowUser = () => {
    setShowUser(true);
  };
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${baseURL}/tasks/`, {
        headers: {
          Authorization: `Bearer ${userData.access_token}` ,
          "Content-Type": "application/json",
        },
      });
      if (!response.status === 200) {
        throw new Error(response.status);
      }
      setTasks([...response.data])
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, []);
  return (
    <>
      <div className="py-4 d-flex justify-content-between align-items-center">
        <h3 className="">Task Managment System</h3>
        <img
          onClick={handleShowUser}
          src={Profile1}
          alt=""
          className="user-profile-sm cursor-pointer"
        />
      </div>
      <UserProfile
        user={userData?.user}
        showUser={showUser}
        handleCloseUser={handleCloseUser}
      />

      <AddTask userData={userData} handleAddTask={handleAddTask} />

      {tasks?.length ? (
        <TaskList
          userData = {userData}
          allChanged={allChanged}
          handleAllChangedTask={handleAllChangedTask}
          handleChangedTask={handleChangedTask}
          handleUpdateTask={handleUpdateTask}
          handleRemoveTask={handleRemoveTask}
          tasks={tasks}
        />
      ) : (
        <h3 className="py-4"> No tasks available , Please add tasks </h3>
      )}
    </>
  );
}

export default HomePage;
