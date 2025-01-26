import React, { useEffect, useState } from 'react';

import { Row, Col, Card, Table, Form, Button, Modal } from 'react-bootstrap';
import apiServices from 'services/api';
import { toast } from 'react-toastify';
import { Bounce } from 'react-toastify';
const DashDefault = () => {
  const [deliveryPrice, setDeliveryPrice] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [newDeliveryPrice, setNewDeliveryPrice] = useState(null);
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
  const getDataDeliveryPrice = async () => {
    try {
      const response = await apiServices.getDeliveryPrice();
      console.log(response);
      setDeliveryPrice(response.data.data);
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
    setNewDeliveryPrice(null);
    setAddModal(false);
    setDetailModal(false);
    setEditModal(false);
    setDeleteModal(false);
  };
  const handleEditChange = (e, editType) => {
    const { name, value } = e.target;
    switch (editType) {
      case 'add':
        setNewDeliveryPrice((prevData) => ({
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
    try {
      const response = await apiServices.postDeliveryPrice(newDeliveryPrice);
      console.log(response);
      if (response.status === 200) {
        showToast('success', 'Success Add Delivery Price');
        setDeliveryPrice((prevData) => [...prevData, response.data]);
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
      const response = await apiServices.deleteDeliveryPrice(selectedData._id);
      console.log(response);
      if (response.status === 200) {
        setDeliveryPrice((prevData) => prevData.filter((data) => data._id !== selectedData._id));
        showToast('success', 'Delivery Price deleted successfully');
        handleClose(); // Close the modal
      } else {
        showToast('error', 'Delivery Price deleted failed');
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
      const response = await apiServices.updateDeliveryPrice(selectedData._id, selectedData);
      console.log(response);
      if (response.error !== 1) {
        setDeliveryPrice((prevData) => prevData.map((data) => (data._id === selectedData._id ? selectedData : data)));
        showToast('success', 'Delivery Price updated successfully');
        handleClose();
      } else {
        showToast('error', 'Delivery Price updated failed');
        handleClose();
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getDataDeliveryPrice();
  }, []);
  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Button onClick={() => handleShowModal('add')} size="sm">
                Add Delivery Price
              </Button>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>#</th>

                    <th>City Name</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryPrice.length > 0 ? (
                    deliveryPrice.map((ct, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{ct.kabupaten}</td>
                        <td>{ct.price}</td>
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
          <Modal.Title style={{ fontSize: '1.2rem' }}>Edit Delivery Price</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>City Name</Form.Label>
              <Form.Control
                type="text"
                name="kabupaten"
                value={selectedData ? selectedData.kabupaten : ''}
                onChange={(e) => handleEditChange(e, 'edit')}
                placeholder="Enter City"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                name="price"
                value={selectedData ? selectedData.price : ''}
                onChange={(e) => handleEditChange(e, 'edit')}
                placeholder="Enter Price"
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
          <Modal.Title style={{ fontSize: '1.2rem' }}>Add Delivery Price</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>City Name</Form.Label>
              <Form.Control
                type="text"
                name="kabupaten"
                value={newDeliveryPrice ? newDeliveryPrice.kabupaten : ''}
                onChange={(e) => handleEditChange(e, 'add')}
                placeholder="Enter City"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={newDeliveryPrice ? newDeliveryPrice.price : ''}
                onChange={(e) => handleEditChange(e, 'add')}
                placeholder="Enter Price"
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
        <Modal.Body>Are you sure you want to delete this delivery price?</Modal.Body>
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
