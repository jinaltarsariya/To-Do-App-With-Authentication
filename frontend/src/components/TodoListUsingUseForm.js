import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button, Container, Row, Col } from "react-bootstrap";

export default function TodoListUsingUseForm() {
  const [todoList, setTodoList] = useState([]);
  const [updateTodo, setUpdateTodo] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [deleteTodo, setDeleteTodo] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchTodoList();
  }, []);

  const fetchTodoList = async () => {
    try {
      const response = await axios.get("http://localhost:4000/todos/list");
      setTodoList(response.data.todos);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const createOrUpdateTodo = async (data) => {
    try {
      if (updateTodo) {
        let response = await axios.put(
          `http://localhost:4000/todo/${updateTodo._id}`,
          data
        );

        if (response.data.flag === 0) {
          toast.error(response.data.message);
        } else {
          toast.success(response.data.message);
          setTodoList(
            todoList.map((todo) => (todo._id === updateTodo._id ? data : todo))
          );
          reset();
          setUpdateTodo(null);
        }
      } else {
        const response = await axios.post(
          "http://localhost:4000/todo/create",
          data
        );

        if (response.data.flag === 0) {
          toast.error(response.data.message);
        } else {
          toast.success(response.data.message);
          setTodoList([...todoList, response.data]);
        }
      }
      reset();
      fetchTodoList();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteBtn = async (value) => {
    try {
      setDeleteTodo(value);
      setShowConfirmationModal(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setShowConfirmationModal(false);
      const response = await axios.delete(
        `http://localhost:4000/todo/${deleteTodo._id}`
      );

      if (response.data.flag === 0) {
        toast.error(response.data.message);
      } else {
        toast.success(response.data.message);
        fetchTodoList();
      }
      reset();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdate = (value) => {
    try {
      setUpdateTodo(value);
      setValue("title", value.title);
      setValue("description", value.description);
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
      {/* Delete Confirmation Modal */}
      <Modal
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
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

      <ToastContainer />
      <Container fluid style={{ padding: "20px" }}>
        <Row className="justify-content-center">
          <Col xs={12} md={8}>
            <div className="border border-3 p-3 mb-3">
              <h3 className="text-center text-decoration-underline">
                Todo List using useForm
              </h3>
              <form onSubmit={handleSubmit(createOrUpdateTodo)}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label fs-5">
                    Title
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.title ? "is-invalid" : ""
                    }`}
                    id="title"
                    placeholder="Title"
                    {...register("title", {
                      required: "Title is required !",
                      validate: (value) =>
                        value.trim() !== "" ||
                        "Title cannot be empty or contain only whitespace characters.",
                      pattern: {
                        value: /^[a-zA-Z0-9\s]+$/,
                        message: "Title can only contain letters and digits.",
                      },
                    })}
                  />
                  {errors?.title && (
                    <div className="invalid-feedback">
                      {errors?.title?.message}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label fs-5">
                    Description
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.description ? "is-invalid" : ""
                    }`}
                    id="description"
                    placeholder="Description"
                    {...register("description", {
                      required: "Description is required!",
                      validate: (value) =>
                        value.trim() !== "" ||
                        "Description cannot be empty or contain only whitespace characters.",
                      pattern: {
                        value: /^[a-zA-Z0-9\s]+$/,
                        message:
                          "Description can only contain letters and digits.",
                      },
                    })}
                  />
                  {errors?.description && (
                    <div className="invalid-feedback">
                      {errors.description.message}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <button type="submit" className="btn btn-dark">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={12} md={8} className="pt-5">
            <div className="border border-3 p-3">
              <h3 className="text-center text-decoration-underline">
                Todo List
              </h3>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">No.</th>
                      <th scope="col">Title</th>
                      <th scope="col">Description</th>
                      <th scope="col">Created At</th>
                      <th scope="col">Actions</th>
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
                            <button
                              type="button"
                              className="btn btn-dark m-1"
                              onClick={() => handleUpdate(value)}
                            >
                              Update
                            </button>
                            <button
                              type="button"
                              className="btn btn-dark m-1"
                              onClick={() => handleDeleteBtn(value)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-3">
                          To do list not available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

{
  /* delete confirmation toast  */
}
//  <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
//  <Modal.Header closeButton>
//    <Modal.Title>Confirmation</Modal.Title>
//  </Modal.Header>
//  <Modal.Body>
//    Are you sure you want to delete this item?
//  </Modal.Body>
//  <Modal.Footer>
//    <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
//      Cancel
//    </Button>
//    <Button variant="primary" onClick={handleDeleteConfirm}>
//      Delete
//    </Button>
//  </Modal.Footer>
// </Modal>
