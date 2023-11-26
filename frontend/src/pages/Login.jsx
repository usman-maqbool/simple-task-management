import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { baseURL } from "../Configuration";
function Login({ setUserData }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isError, setisError] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    const loggedUser = {
      username,
      password,
    };
    setLoading(true);
    try {
      const response = await axios.post(`${baseURL}/login/`, loggedUser);
      console.log(response);
      setUserData(response.data);
      localStorage.setItem("userData", JSON.stringify(response.data));
      setUsername("");
      setPassword("");
      navigate("/tasks");
      setisError(false);
    } catch (error) {
      setisError(true);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const localUserData = JSON.parse(localStorage.getItem("userData"));
    if (localUserData) { 
      setUserData(localUserData);
      navigate("/tasks");
    }
  } , [])

  return (
    <Form onSubmit={handleLogin} method="post">
      <h3 className="py-4 text-center">Task Managment System</h3>
      <h6 className="pt-2">Please login to continue</h6>
      {isError ? (
        <p className="text-danger"> username or password is incorrect </p>
      ) : (
        ""
      )}
      <Form.Group className="my-3 rounded-3 add-task border-primary">
        <Form.Control
          required
          className="text-white m-1 ps-2 "
          value={username}
          onInput={(e) => setUsername(e.target.value)}
          plaintext
          placeholder="username"
        />
      </Form.Group>
      <Form.Group className="my-3 rounded-3 add-task border-primary">
        <Form.Control
          required
          type="password"
          className="text-white m-1 ps-2 bg-transparent"
          value={password}
          onInput={(e) => setPassword(e.target.value)}
          plaintext
          placeholder="Password"
        />
      </Form.Group>
      <div className="d-flex justify-content-between pt-1 pb-4">
        <p className="mt-3">Don't have account <NavLink className=' text-white-50 text-decoration-none' to={'/signup'} >Signup </NavLink></p>
        <Button
          disabled={loading}
          type="submit"
          className="ms-auto"
          variant="primary"
        >
          Login
        </Button>
      </div>
    </Form>
  );
}

export default Login;
