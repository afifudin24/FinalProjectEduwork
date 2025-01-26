import React, { useEffect, useState } from 'react';

import { Row, Col, Card, Table, Form, Button, Modal } from 'react-bootstrap';
import apiServices from 'services/api';
import { toast } from 'react-toastify';
import { Bounce } from 'react-toastify';
const DashDefault = () => {
  const [dataTags, setDataTags] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [newCategory, setNewCategory] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  function generateRandomId() {
    const prefix = 'ct';
    const timestamp = Date.now(); // Get the current timestamp
    return `${prefix}${timestamp}`; // Combine prefix with timestamp
  }
  // show toast
  const showToast = (type, message) => {
    const toastOptions = {
      position: 'top-right',
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: Bounce
    };

    if (type === 'success') {
      toast.success(message, toastOptions);
    } else if (type === 'error') {
      toast.error(message, toastOptions);
    }
  };
  const getTags = async () => {
    try {
      const response = await apiServices.getTags();
      console.log(response);
      setDataTags(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleShowModal = (modalType, ct) => {
    // Menutup semua modal sebelum membuka yang baru
    setAddModal(false);
    setDetailModal(false);
    setEditModal(false);
    setDeleteModal(false);
    setSelectedData(ct);

    // Menentukan modal mana yang akan ditampilkan
    switch (modalType) {
      case 'add':
        setAddModal(true);
        break;
      case 'detail':
        setDetailModal(true);
        break;
      case 'edit':
        setEditModal(true);
        break;
      case 'delete':
        setDeleteModal(true);
        break;
      default:
        break;
    }
  };
  const handleClose = () => {
    setSelectedData(null);
    setNewCategory(null);
    setAddModal(false);
    setDetailModal(false);
    setEditModal(false);
    setDeleteModal(false);
  };
  const handleEditChange = (e, editType) => {
    const { name, value } = e.target;
    switch (editType) {
      case 'add':
        setNewCategory((prevData) => ({
          ...prevData,
          [name]: value // Handle checkbox separately
        }));
        break;
      case 'edit':
        setSelectedData((prevData) => ({
          ...prevData,
          [name]: value // Handle checkbox separately
        }));
        break;
      default:
        break;
    }
  };

  // CRUD
  // Add
  const handleAddSubmit = async () => {
    const newCategoryWithId = {
      name: newCategory.name
    };
    console.log(newCategoryWithId);
    try {
      const response = await apiServices.postCategory(newCategoryWithId);
      console.log(response);
      if (response.status === 200) {
        showToast('success', 'Success Add Category');
        setDataCategory((prevDataCategory) => [...prevDataCategory, response.data]);
        handleClose();
      } else {
        showToast('error', 'Failed Add Category');
        handleClose();
      }
    } catch (err) {
      console.log(err);
    }
  };
  // Delete
  const handleDelete = async () => {
    try {
      const response = await apiServices.deleteCategory(selectedData._id);
      console.log(response);
      if (response.status === 200) {
        setDataCategory((prevDataCategory) => prevDataCategory.filter((category) => category._id !== selectedData._id));
        showToast('success', 'Category deleted successfully');
        handleClose(); // Close the modal
      } else {
        showToast('error', 'Category deleted failed');
        handleClose(); // Close the modal
      }
    } catch (err) {
      console.log(err);
    }
  };
  // Edit
  const handleEditSubmit = async () => {
    console.log(selectedData);
    try {
      const response = await apiServices.updateTags(selectedData._id, selectedData);
      console.log(response);
      if (response.error !== 1) {
        setDataTags((prevDataTags) => prevDataTags.map((tag) => (tag._id === selectedData._id ? selectedData : tag)));
        showToast('success', 'Category updated successfully');
        handleClose();
      } else {
        showToast('error', 'Category updated failed');
        handleClose();
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getTags();
  }, []);
  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Button onClick={() => handleShowModal('add')} size="sm">
                Add Category
              </Button>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>#</th>

                    <th>Tag Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dataTags.length > 0 ? (
                    dataTags.map((ct, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>

                        <td>{ct.name}</td>
                        <td>
                          <Button size="sm" onClick={() => handleShowModal('edit', ct)} variant="warning">
                            Edit
                          </Button>
                          <Button onClick={() => handleShowModal('delete', ct)} variant="danger" size="sm">
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center">
                        Tidak Ada Data
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal show={detailModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1.2rem' }}>Detail Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {' '}
          {selectedData ? (
            <div>
              <p>
                <strong>Category Name:</strong> {selectedData.name}
              </p>
            </div>
          ) : (
            <p>Nothing Data</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={handleClose}>
            Close
          </Button>
          {/* <Button variant="primary" size="sm" onClick={handleClose}>
            Save Changes
          </Button> */}
        </Modal.Footer>
      </Modal>
      {/* Edit Modal */}
      <Modal show={editModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1.2rem' }}>Edit Tag</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Tag Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={selectedData ? selectedData.name : ''}
                onChange={(e) => handleEditChange(e, 'edit')}
                placeholder="Enter category name"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" onClick={handleEditSubmit}>
            Save Changes
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Add Modal */}
      <Modal show={addModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1.2rem' }}>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newCategory ? newCategory.name : ''}
                onChange={(e) => handleEditChange(e, 'add')}
                placeholder="Enter category name"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" onClick={handleAddSubmit}>
            Add
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal delete */}
      <Modal show={deleteModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this category?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default DashDefault;
