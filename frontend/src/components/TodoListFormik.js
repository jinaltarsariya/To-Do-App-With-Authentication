import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button, Table, Container, Row, Col } from "react-bootstrap";

export default function TodoList() {
  const [todoList, setTodoList] = useState([]);
  const [updateTodoList, setUpdateTodoList] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [deleteTodo, setDeleteTodo] = useState(null);
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchToDoListData();
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required("Title is required")
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .test(
        "not-empty",
        "Title cannot be empty or contain only whitespace characters.",
        (value) => {
          return value.trim() !== "";
        }
      ),
    description: Yup.string()
      .required("Description is required")
      .min(3, "Too Short!")
      .max(100, "Too Long!")
      .test(
        "not-empty",
        "Description cannot be empty or contain only whitespace characters.",
        (value) => {
          return value.trim() !== "";
        }
      ),
  });

  const fetchToDoListData = async () => {
    try {
      let response = await axios.get("http://localhost:4000/todos/list");
      setTodoList(response.data.todos);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const CreateTodoList = async (values, { resetForm }) => {
    try {
      if (updateTodoList) {
        let response = await axios.put(
          `http://localhost:4000/todo/${updateTodoList._id}`,
          values
        );

        if (response.data.flag === 0) {
          toast.error(response.data.message);
        } else {
          toast.success(response.data.message);
          setTodoList(
            todoList.map((todo) =>
              todo._id === updateTodoList._id ? values : todo
            )
          );
          setInitialValues({
            title: "",
            description: "",
          });
          setUpdateTodoList(null);
        }
      } else {
        let response = await axios.post(
          "http://localhost:4000/todo/create",
          values
        );
        if (response.data.flag === 0) {
          toast.error(response.data.message);
        } else {
          toast.success(response.data.message);
          setTodoList([...todoList, values]);
        }
        resetForm();
      }
      fetchToDoListData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleTodoDelete = async (values) => {
    try {
      setDeleteTodo(values);
      setShowConfirmationModal(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setShowConfirmationModal(false);
      let response = await axios.delete(
        `http://localhost:4000/todo/${deleteTodo._id}`
      );

      if (response.data.flag === 0) {
        toast.error(response.data.message);
      } else {
        toast.success(response.data.message);
        fetchToDoListData();
      }
      setInitialValues({
        title: "",
        description: "",
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleTodoUpdate = async (value) => {
    try {
      setInitialValues(value);
      setUpdateTodoList(value);
    } catch (error) {
      toast.error(error.message);
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

      {/* Confirmation Modal */}
      <Modal
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this todo list?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmationModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Container style={{ padding: "50px 30px" }}>
        <Row className="justify-content-md-center">
          <Col sm={12} md={12}>
            <div className="border border-3 p-3 mb-5">
              <h4 className="text-center text-decoration-underline mb-3">
                Todo Create using formik
              </h4>

              <Formik
                initialValues={initialValues}
                onSubmit={CreateTodoList}
                enableReinitialize={true}
                validationSchema={validationSchema}
              >
                <Form>
                  <div className="row g-3">
                    <div className="col-md-12">
                      <label htmlFor="title" className="form-label">
                        Title
                      </label>
                      <Field
                        id="title"
                        name="title"
                        placeholder="Title"
                        className="form-control"
                      />
                      <div className="text-danger">
                        <ErrorMessage name="title" />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <label htmlFor="description" className="form-label">
                        Description
                      </label>
                      <Field
                        id="description"
                        name="description"
                        placeholder="description"
                        className="form-control"
                      />
                      <div className="text-danger">
                        <ErrorMessage name="description" />
                      </div>
                    </div>

                    <div className="">
                      <Button type="submit" className="btn-dark">
                        Submit
                      </Button>
                    </div>
                  </div>
                </Form>
              </Formik>
            </div>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col sm={12} md={12}>
            <div className="border border-3 p-3 mt-3">
              <h4 className="text-center text-decoration-underline mt-2 mb-4">
                Todo List
              </h4>
              <Table responsive>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {todoList.length > 0 ? (
                    todoList.map((value, index) => (
                      <tr key={value._id}>
                        <td>{index + 1}</td>
                        <td>{value.title}</td>
                        <td>{value.description}</td>
                        <td>
                          {new Date(value.created_at)
                            .toLocaleString("en-US", {
                              timeZone: "UTC",
                              hour12: false,
                            })
                            .replace(",", "")}
                        </td>
                        <td>
                          <Button
                            variant="dark"
                            className="m-1"
                            onClick={() => handleTodoUpdate(value)}
                          >
                            Update
                          </Button>
                          <Button
                            variant="dark"
                            className="m-1"
                            onClick={() => handleTodoDelete(value)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-3">
                        <h3>To do list not available</h3>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
