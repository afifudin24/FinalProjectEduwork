import React, { useEffect, useState } from 'react';

import { Row, Col, Card, Table, Tabs, Tab, Form, Button, InputGroup, FormControl, Modal } from 'react-bootstrap';
import apiServices from 'services/api';
import { toast } from 'react-toastify';
import { Bounce } from 'react-toastify';
import { PDFDownloadLink } from '@react-pdf/renderer';
import OrderReport from './OrderReport';

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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  function generateRandomId() {
    const prefix = 'ORD';
    const timestamp = Date.now() % 100000;
    return `${prefix}${timestamp}`; // Combine prefix with timestamp
  }
  const handleExport = () => {
    // This will trigger the PDF download
    console.log('Exporting data from', startDate, 'to', endDate);
  };
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
  function formatISODateToLocale(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
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
  const getOrders = async (start_date, end_date) => {
    try {
      const response = await apiServices.getReport({ start_date, end_date });
      console.log('ini order', response);
      setDataOrder(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFilter = () => {
    getOrders(startDate, endDate);
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
            <Card.Header>
              <Form inline>
                <Form.Group className="mr-2">
                  <Form.Label className="mr-2">Start Date:</Form.Label>
                  <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </Form.Group>
                <Form.Group className="mr-2">
                  <Form.Label className="mr-2">End Date:</Form.Label>
                  <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </Form.Group>
                <Button variant="primary" onClick={handleFilter}>
                  Filter
                </Button>
                <Button variant="success" onClick={handleExport} className="ml-2 text-white">
                  <PDFDownloadLink className="text-white" document={<OrderReport dataOrder={dataOrder} />} fileName="Order_Report.pdf">
                    {({ loading }) => (loading ? 'Loading document...' : 'Export')}
                  </PDFDownloadLink>
                </Button>
              </Form>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Order Date</th>
                    <th>Total Order Item</th>
                    <th>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {dataOrder.length > 0 ? (
                    dataOrder.map((or, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{formatISODateToLocale(or.createdAt)}</td>
                        <td>{or.items_count}</td>
                        <td> Rp. {or.invoice.totals.toLocaleString()}</td>
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
      {/* Modal components for detail, edit, add, and delete remain unchanged */}
    </React.Fragment>
  );
};

export default DashDefault;
