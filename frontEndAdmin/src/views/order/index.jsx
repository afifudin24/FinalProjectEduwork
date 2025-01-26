import React, { useEffect, useState } from 'react';

import { Row, Col, Card, Table, Tabs, Tab, Form, Button, InputGroup, FormControl, Modal } from 'react-bootstrap';
import apiServices from 'services/api';
import { toast } from 'react-toastify';
import { Bounce } from 'react-toastify';
import baseUrl from 'services/baseUrl';
const DashDefault = () => {
  const [dataOrder, setDataOrder] = useState([]);
  const [dataProduct, setDataProduct] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [newOrder, setNewOrder] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  function generateRandomId() {
    const prefix = 'ORD';
    const timestamp = Date.now() % 100000;
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
  const statusOptions = [
    { value: 'waiting_payment', label: 'Waiting Payment' },
    { value: 'processing', label: 'Processing' },
    { value: 'in_delivery', label: 'In Delivery' },
    { value: 'delivered', label: 'Delivered' }
  ];

  const paymentStatusOptions = [
    {
      value: 'waiting_payment',
      label: 'Waiting Payment'
    },
    {
      value: 'paid',
      label: 'Paid'
    }
  ];
  const handleChange = async (or, event) => {
    const newStatus = event.target.value;
    const data = {
      status: newStatus
    };
    try {
      const response = await apiServices.updateOrder(or._id, data);
      console.log(response);
      if (response.status === 200) {
        // Update the order status in the orders array
        const updatedOrders = dataOrder.map((order) => {
          if (order._id === or._id) {
            return { ...order, status: newStatus }; // Update the status
          }
          return order; // Return the unchanged order
        });

        setDataOrder(updatedOrders); // Update the state with the new orders array
      }
    } catch (err) {
      console.log(err);
    }

    // Optionally, you can also make an API call to update the status in the backend
    // updateOrderStatus(or._id, newStatus);
  };
  const handleChangePaymentStatus = async (or, event) => {
    const newStatus = event.target.value;
    const data = {
      payment_status: newStatus
    };
    try {
      const response = await apiServices.updateInvoice(or._id, data);
      console.log(response);
      if (response.status === 200) {
        const updatedOrders = dataOrder.map((order) => {
          if (order._id === or._id) {
            return {
              ...order,
              invoice: {
                ...order.invoice, // Spread the existing invoice properties
                payment_status: newStatus // Update the payment_status
              }
            };
          }
          return order; // Return the unchanged order
        });

        setDataOrder(updatedOrders);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getOrders = async () => {
    try {
      const response = await apiServices.getOrders();
      console.log('ini order', response);
      setDataOrder(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getProducts = async () => {
    try {
      const response = await apiServices.getProducts();
      console.log('product', response);
      setDataProduct(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleShowModal = (modalType, or) => {
    // Menutup semua modal sebelum membuka yang baru
    setAddModal(false);
    setDetailModal(false);
    setEditModal(false);
    setDeleteModal(false);
    setSelectedData(or);
    console.log('or', or);
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
    setNewOrder(null);
    setAddModal(false);
    setDetailModal(false);
    setEditModal(false);
    setDeleteModal(false);
  };
  const handleEditChange = (e, editType) => {
    const { name, value } = e.target;
    switch (editType) {
      case 'add':
        setNewOrder((prevData) => ({
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
    console.log(newOrder);
    const newOrderWithId = {
      or_id: generateRandomId(), // Call the function to generate the ID
      or_pd_id: newOrder.or_pd_id,
      or_amount: newOrder.or_amount
    };

    try {
      const response = await apiServices.postOrder(newOrderWithId);
      console.log(response);
      if (response.status === 201) {
        showToast('success', 'Success Add Order');
        setDataOrder([]);
        getOrders();
        handleClose();
      } else {
        showToast('error', 'Failed Add Order');
        handleClose();
      }
    } catch (err) {
      console.log(err);
    }
  };
  // Delete
  const handleDelete = async () => {
    try {
      const response = await apiServices.deleteOrder(selectedData._id);
      console.log(response);
      if (response.status === 200) {
        setDataOrder([]);
        getOrders();
        showToast('success', 'Product deleted successfully');
        handleClose(); // Close the modal
      } else {
        showToast('error', 'Product deleted failed');
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
      const response = await apiServices.updateOrder(selectedData._id, selectedData);
      console.log('res', response);
      if (response.status === 200) {
        setDataOrder([]);
        getOrders();
        showToast('success', 'Product updated successfully');
        handleClose();
      } else {
        showToast('error', 'Product updated failed');
        handleClose();
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getOrders();
    // getProducts();
  }, []);
  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header></Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Status Order</th>
                    <th>Status Payment</th>
                    <th>Order Amount</th>
                    <th>Payment Confirmation</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dataOrder.length > 0 ? (
                    dataOrder.map((or, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{or.user.full_name}</td>
                        <td>
                          <Form.Select value={or.status} onChange={(event) => handleChange(or, event)}>
                            {statusOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Form.Select>
                        </td>
                        <td>
                          <Form.Select value={or.invoice.payment_status} onChange={(event) => handleChangePaymentStatus(or, event)}>
                            {paymentStatusOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Form.Select>
                        </td>
                        <td> Rp. {or.invoice.totals.toLocaleString()}</td>
                        <td>
                          {or.invoice.uploadBukti !== 'default' ? (
                            <img
                              style={{
                                maxWidth: '200px',
                                maxHeight: '200px',
                                marginBottom: '10px',
                                borderRadius: '8px'
                              }}
                              src={`${baseUrl}/images/invoices/${or.invoice.uploadBukti}`}
                              alt=""
                            />
                          ) : (
                            'Nothing Data'
                          )}
                        </td>

                        <td>
                          <Button size="sm" onClick={() => handleShowModal('detail', or)} variant="success">
                            Detail
                          </Button>

                          <Button onClick={() => handleShowModal('delete', or)} variant="danger" size="sm">
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center">
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
          <Modal.Title style={{ fontSize: '1.2rem' }}>Detail Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {' '}
          {selectedData ? (
            <Table striped bordered hover>
              <tbody>
                <tr>
                  <td>
                    <strong>Name</strong>
                  </td>
                  <td>{selectedData.user.full_name}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Status Order</strong>
                  </td>
                  <td>{statusOptions.find((option) => option.value === selectedData.status)?.label || 'Unknown Status'}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Status Payment</strong>
                  </td>
                  <td>
                    {paymentStatusOptions.find((option) => option.value === selectedData.invoice.payment_status)?.label || 'Unknown Status'}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Order Item</strong>
                  </td>
                  <td>
                    <ul>
                      {selectedData.order_items.map((item, index) => (
                        <li key={index}>
                          {item.product.name} x {item.qty} ({item.price.toLocaleString()})
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>

                <tr>
                  <td>
                    <strong>Delivery Address:</strong>
                  </td>
                  <td>
                    {`${selectedData.delivery_address.kelurahan}, ${selectedData.delivery_address.kecamatan},`} <br />
                    {`${selectedData.delivery_address.kabupaten}, ${selectedData.delivery_address.provinsi}`}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Delivery Fee:</strong>
                  </td>
                  <td>{selectedData.delivery_fee}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Order Amount:</strong>
                  </td>
                  <td>{selectedData.invoice.totals.toLocaleString()}</td>
                </tr>
              </tbody>
            </Table>
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
          <Modal.Title style={{ fontSize: '1.2rem' }}>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicCategoryId">
              <Form.Label>Order</Form.Label>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPrice">
              <Form.Label>Amount Order</Form.Label>
              <Form.Control
                type="number"
                name="or_amount"
                value={selectedData ? selectedData.or_amount : ''}
                onChange={(e) => handleEditChange(e, 'edit')}
                placeholder="Enter Amount Order"
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
          <Modal.Title style={{ fontSize: '1.2rem' }}>Add Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicCategoryId">
              <Form.Label>Product</Form.Label>
              <Form.Select name="or_pd_id" onChange={(e) => handleEditChange(e, 'add')}>
                <option>Select Product</option>
                {dataProduct.length > 0
                  ? dataProduct.map((item, index) => (
                      <option key={index} value={item._id}>
                        {item.pd_name}
                      </option>
                    ))
                  : ''}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPrice">
              <Form.Label>Amount Order</Form.Label>
              <Form.Control
                type="number"
                name="or_amount"
                value={newOrder ? newOrder.pd_price : ''}
                onChange={(e) => handleEditChange(e, 'add')}
                placeholder="Enter Amount Order"
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
        <Modal.Body>Are you sure you want to delete this Order?</Modal.Body>
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
