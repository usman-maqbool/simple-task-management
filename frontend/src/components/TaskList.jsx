import {Table , Form} from "react-bootstrap"
import Task from "./Task"
function TaskList({
  tasks , 
  handleRemoveTask, 
  handleUpdateTask , 
  handleChangedTask,
  handleAllChangedTask,
  allChanged,
  userData
}) {
  return (
        <Table variant="dark" responsive borderless size="lg" className="mt-3">
        <thead>
            <tr>
            <th><Form.Check checked={allChanged} onChange={() => handleAllChangedTask(!allChanged) } aria-label="task-complete-head" /></th>
            {/* <th>Team Member</th> */}
            <th>Task</th>
            <th className="text-end">Actions</th>
            </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <Task userData={userData} handleChangedTask={handleChangedTask} handleUpdateTask={handleUpdateTask} handleRemoveTask={handleRemoveTask} task={task} key={task.id}/>
          ))}
        </tbody>
        </Table>
  )
}

export default TaskList
