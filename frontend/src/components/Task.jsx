import { useState } from "react";
import { Form } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import UpdateTask from "./UpdateTask";

function Task({ task, handleRemoveTask, handleUpdateTask, handleChangedTask , userData }) {
  const [showUpdate, setShowUpdate] = useState(false);
  const handleCloseUpdate = () => {
    setShowUpdate(false);
  };
  const handleShowUpdate = () => {
    setShowUpdate(true);
  };

  const handleChecked = () => {
    const changedTask = {
      ...task,
      isCompleted: !task.isCompleted,
    };
    handleChangedTask(changedTask);
  };

  return (
    <tr className={`${task.isCompleted ? "completed" : " "}`}>
      <td className="pt-3">
        <Form.Check
          className="mt-1"
          onChange={handleChecked}
          checked={task.isCompleted}
          aria-label="task-complete-head"
        />
      </td>
     
      <td className="pt-3">
        <p className="mt-1">{task.task}</p>
      </td>
      <td className="pt-3">
        <div
          style={{ height: "100%" }}
          className="d-flex justify-content-end align-items-center mt-2 action-item"
        >
          <FiEdit onClick={handleShowUpdate} className="me-3" />
          <MdDelete
            onClick={() => handleRemoveTask(task.id)}
            className="text-warning"
          />
        </div>
      </td>
      <UpdateTask
        userData={userData}
        handleUpdateTask={handleUpdateTask}
        task={task}
        showUpdate={showUpdate}
        handleCloseUpdate={handleCloseUpdate}
      />
    </tr>
  );
}

export default Task;
