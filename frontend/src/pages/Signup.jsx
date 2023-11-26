import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import axios from "axios";
import { baseURL } from "../Configuration";
import { useNavigate } from 'react-router-dom';
function Signup() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const HanldeSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseURL}/signup/`, {
        email,
        username,
        password,
        bio
      });
      navigate('/login')
      console.log(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      // setLoading(false);
    }
  };
  return (
    <Form onSubmit={HanldeSignup}>
      <h3 className="py-4 text-center">Task Managment System</h3>
      <Form.Group className="mb-3" controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control value={username} onChange={(e) => setUsername(e.target.value)} required className=' bg-transparent text-white border-primary shadow-none' type="text" placeholder="Enter email" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="email">
        <Form.Label>Email address</Form.Label>
        <Form.Control value={email} onChange={(e) => setEmail(e.target.value)}  required className=' bg-transparent text-white border-primary shadow-none' type="email" placeholder="Enter email" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control value={password} onChange={(e) => setPassword(e.target.value)} required className=' bg-transparent text-white border-primary shadow-none' type="password" placeholder="Password" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="bio">
        <Form.Label>About Yourself</Form.Label>
        <Form.Control value={bio} onChange={(e) => setBio(e.target.value)} required as='textarea' rows={3} className=' bg-transparent text-white border-primary shadow-none' type="email" placeholder="Enter email" />
      </Form.Group>
      <div className="d-flex justify-content-end pt-1 pb-4">
        <Button type='submit' className='ms-auto'  variant="primary">Sign Up</Button>
      </div>
    </Form>
  );
}

export default Signup;