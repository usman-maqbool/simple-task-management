import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { baseURL } from "../Configuration";
import axios from "axios";
function AddTask({ handleAddTask, userData }) {
  const [taskText, setTaskText] = useState("");
  const addTaskApi = async () => {
    const data = {
      task: taskText,
      user_id: userData.user.id,
    };
    setTaskText("");
    try {
      const response = await axios.post(`${baseURL}/create-task/`, data, {
        headers: {
          Authorization: `Bearer ${userData.access_token}`,
          "Content-Type": "application/json",
        },
      });
      handleAddTask(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      // setLoading(false);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const task = {
      id: Math.floor(Math.random() * 1000),
      isCompleted: false,
      userData: userData.user,
      taskText,
    };
    addTaskApi();
    
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group
        className="my-3 rounded-3 add-task border-primary d-flex"
        controlId="task-input"
      >
        <Form.Control
          className="text-white m-1 ps-2 "
          value={taskText}
          onInput={(e) => setTaskText(e.target.value)}
          plaintext
          placeholder="Add Your Task"
        />
        <Button type="submit" variant="primary">
          Add
        </Button>
      </Form.Group>
    </Form>
  );
}

export default AddTask;
