import React from "react";
import axios from "axios";
import { Button, Col, Form, Row, Container } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

export default function User_login() {
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm();

  const history = useHistory();

  const handleUserSinup = async (values) => {
    console.log("values", values);
    let response = await axios.post("http://localhost:4000/user/login", values);
    if (response.data.flag === 0) {
      toast.error(response.data.message);
    } else {
      toast.success(response.data.message);
      reset();
      localStorage.setItem("UserToken", response.data.data);
      setTimeout(() => {
        history.push("/user/todo/list");
      }, 3000);
    }
  };

  return (
    <div
      className="bg-color"
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ToastContainer />

      <section>
        <Container className="border p-5">
          <h4 className="text-center text-decoration-underline mb-4">
            User Login Page
          </h4>
          <Form onSubmit={handleSubmit(handleUserSinup)}>
            {/* name  */}
            <Row>
              <Form.Group>
                <Form.Label className="fs-5">Email / Mobile Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  name="username"
                  id="username"
                  {...register("username", {
                    required: "Username is required field!",
                    validate: (value) =>
                      value.trim() !== "" ||
                      "Username cannot be empty or contain only whitespace characters.",
                  })}
                />
                {errors?.username && (
                  <h6 className="text-danger my-2">
                    {errors?.username?.message}
                  </h6>
                )}
              </Form.Group>
            </Row>

            {/* password  */}
            <Row>
              <Form.Group as={Col}>
                <Form.Label className="fs-5">Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  id="password"
                  {...register("password", {
                    required: "Password is required field!",
                    validate: (value) =>
                      value.trim() !== "" ||
                      "Password cannot be empty or contain only whitespace characters.",
                  })}
                />
                {errors?.password && (
                  <h6 className="text-danger my-2">
                    {errors?.password?.message}
                  </h6>
                )}
              </Form.Group>
            </Row>

            <div className="mt-3">
              <Button variant="dark" type="submit" className="mb-3 mt-2">
                Submit
              </Button>
              <Link
                to="/user/signup"
                className="bg-dark p-2 ms-1 text-decoration-none text-light rounded-3"
              >
                Signup Page
              </Link>
            </div>
          </Form>
        </Container>
      </section>
    </div>
  );
}
