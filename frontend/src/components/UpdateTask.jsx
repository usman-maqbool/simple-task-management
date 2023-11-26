import { Modal , Button , Form } from "react-bootstrap"
import Profile1 from '../assets/profile-1.jpg'
import { useState } from "react"
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { baseURL } from "../Configuration";
function UpdateTask({ showUpdate , handleCloseUpdate , task , handleUpdateTask , userData}) {
    const [ updateTask , setUpdateTask] = useState(task.task)
    const handleSubmit = (e) => {
        e.preventDefault();
        if(updateTask) {
          const updatedTask = {
              id : task.id,
              task : updateTask
          }
          axios.patch(`${baseURL}/update-task/${task.id}`,updatedTask, {
            headers: {
              Authorization: `Bearer ${userData.access_token}` ,
              "Content-Type": "application/json",
            },
          })
          .then(response => {
            console.log(response)
            handleUpdateTask(response.data);
            handleCloseUpdate()
          })
          .catch(err => console.error(err));
        }
    }
   
    const handleShow = () => {
      setUpdateTask(task.task)
    }
  return (
    <Modal onShow={handleShow} className="text-white" centered show={showUpdate} onHide={handleCloseUpdate}>
        <Modal.Header className="bg-dark border-0">
          <Modal.Title >
            <div className="flex-center text-capitalize">
                <img src={Profile1} alt="" className="user-profile-sm"/>
                <h3 className='ps-2'>Jack</h3>
            </div>
          </Modal.Title>
          <RxCross2 size={28} className="cursor-pointer"  onClick={handleCloseUpdate}/>
        </Modal.Header>
        <Modal.Body className="bg-dark border-0">
        <Form className="pb-4" onSubmit={handleSubmit}>
        <Form.Group  className="mt-3 mb-5  rounded-3 add-task border-primary d-flex" controlId="update-input">
            <Form.Control className='text-white m-1 ps-2 ' value={updateTask} onInput={(e) => setUpdateTask(e.target.value)} plaintext  placeholder="update Your Task"  />
            <Button type='submit' onClick={handleSubmit} variant="primary">Update</Button>
        </Form.Group>
  </Form>
        </Modal.Body>
        
      </Modal>
  )
}

export default UpdateTask
