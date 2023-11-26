import { Modal  } from "react-bootstrap"
import Profile1 from '../assets/profile-1.jpg'
import { RxCross2 } from "react-icons/rx";

function UserProfile({user , showUser ,handleCloseUser }) {
  return (
    <Modal  className="text-white" centered show={showUser} onHide={handleCloseUser}>
        <Modal.Header className="bg-dark border-0 px-3 pt-4">
          <Modal.Title >
            <div className="flex-center text-capitalize">
                <img src={Profile1} alt="" className="user-profile-sm"/>
                <h3 className='ps-2'>{user.username} </h3>
            </div>
          </Modal.Title>
          <RxCross2 size={28} className="cursor-pointer"  onClick={handleCloseUser}/>
        </Modal.Header>
        <Modal.Body className="bg-dark border-0">
            <p>{user.bio} </p>
            
        </Modal.Body>
        
      </Modal>
  )
}

export default UserProfile
