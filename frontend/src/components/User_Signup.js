import axios from "axios";
import React from "react";
import { Button, Col, Form, Row, Container } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

export default function User_Signup() {
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
    watch,
  } = useForm();
  const password = watch("password");

  const history = useHistory();

  const handleUserSignup = async (values) => {
    console.log("values", values);
    try {
      const response = await axios.post(
        "http://localhost:4000/user/signup",
        values
      );
      console.log("response --> ", response.data);
      if (response.data.flag === 0) {
        toast.error(response.data.message);
      } else {
        reset();
        toast.success(response.data.message);
        setTimeout(() => {
          history.push("/");
        }, 3000);
      }
    } catch (error) {
      console.error("Error occurred during signup:", error);
      toast.error("An error occurred during signup. Please try again.");
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
        <Container className="p-5 border">
          <h4 className="text-center text-decoration-underline mb-3">
            User Registration
          </h4>
          <Form onSubmit={handleSubmit(handleUserSignup)}>
            <Row className="mb-3">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="fs-5">Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    name="name"
                    id="name"
                    {...register("name", {
                      required: "Name is required field!",
                      pattern: {
                        value: /^[A-Za-z]+(?:\s+[A-Za-z]+)*$/,
                        message:
                          "Please enter a valid name without special characters!",
                      },
                      minLength: {
                        value: 3,
                        message: "Name must be at least 3 characters long!",
                      },
                      maxLength: {
                        value: 50,
                        message: "Name is too long!",
                      },
                    })}
                  />
                  {errors?.name && (
                    <h6 className="text-danger my-2">
                      {errors?.name?.message}
                    </h6>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className="fs-5">Email</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="example@gmail.com"
                    name="email"
                    id="email"
                    {...register("email", {
                      required: "Email is required field!",
                      pattern: {
                        value: /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Enter a valid email address!",
                      },
                    })}
                  />
                  {errors?.email && (
                    <h6 className="text-danger my-2">
                      {errors?.email?.message}
                    </h6>
                  )}
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className="fs-5">Mobile Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="1234567890"
                    name="mobileNumber"
                    id="mobileNumber"
                    {...register("mobileNumber", {
                      required: "Mobile number is required field!",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Please enter a valid number!",
                      },
                      minLength: {
                        value: 6,
                        message:
                          "Mobile number must be 6 to 10 characters long!",
                      },
                      maxLength: {
                        value: 10,
                        message:
                          "Mobile number must be 6 to 10 characters long!",
                      },
                    })}
                  />
                  {errors?.mobileNumber && (
                    <h6 className="text-danger my-2">
                      {errors?.mobileNumber?.message}
                    </h6>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className="fs-5">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    id="password"
                    {...register("password", {
                      required: "Password is required field!",
                      minLength: {
                        value: 5,
                        message: "Password must be at least 5 characters long!",
                      },
                      maxLength: {
                        value: 15,
                        message: "Password is too long!",
                      },
                    })}
                  />
                  {errors?.password && (
                    <h6 className="text-danger my-2">
                      {errors?.password?.message}
                    </h6>
                  )}
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className="fs-5">Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    id="confirmPassword"
                    {...register("confirmPassword", {
                      required: "Confirm password is required field!",
                      validate: (value) =>
                        value === password || "Passwords do not match.",
                    })}
                  />
                  {errors?.confirmPassword && (
                    <h6 className="text-danger my-2">
                      {errors?.confirmPassword?.message}
                    </h6>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Button variant="dark" type="submit">
              Submit
            </Button>
            <Link
              to="/"
              className="bg-dark p-2 ms-1 text-decoration-none text-light rounded-3"
            >
              Go to Login page
            </Link>
          </Form>
        </Container>
      </section>
    </div>
  );
}
