import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Button, Form, Modal } from 'react-bootstrap';
import apiServices from 'services/api';
import { toast } from 'react-toastify';
import { Bounce } from 'react-toastify';

const DashDefault = () => {
  const baseUrl = `http://127.0.0.1:8000`;
  const [dataCategory, setDataCategory] = useState([]);
  const [dataProduct, setDataProduct] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [newProduct, setNewProduct] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [dataTags, setDataTags] = useState([]);
  // New state variables
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [imageFile, setImageFile] = useState(null); // State for the uploaded image
  // Function to generate random ID
  function generateRandomId() {
    const prefix = 'ct';
    const timestamp = Date.now();
    return `${prefix}${timestamp}`;
  }

  // Show toast
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
  const handleTagChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
    setNewProduct((prevData) => ({
      ...prevData,
      tags: selectedOptions // Update the tags in the state
    }));
  };
  const handleTagChangeEdit = (e) => {
    console.log(e.target.selectedOptions);
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
    setSelectedData((prevData) => ({
      ...prevData,
      tags: selectedOptions // Update the tags in the state
    }));
  };

  // Fetch categories and products
  const getCategories = async () => {
    try {
      const response = await apiServices.getCategories();
      setDataCategory(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getTags = async () => {
    try {
      const response = await apiServices.getTags(); // Fetch tags from your API
      setDataTags(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getProducts = async () => {
    try {
      const response = await apiServices.getProducts();
      setDataProduct(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Handle modal visibility
  const handleShowModal = (modalType, ct) => {
    console.log(ct);
    setAddModal(false);
    setDetailModal(false);
    setEditModal(false);
    setDeleteModal(false);
    setSelectedData(ct);

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
    setImageFile(null);
    setNewProduct(null);
    setAddModal(false);
    setDetailModal(false);
    setEditModal(false);
    setDeleteModal(false);
  };
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]); // Set the selected file
  };

  const handleEditChange = (e, editType) => {
    const { name, value } = e.target;
    switch (editType) {
      case 'add':
        setNewProduct((prevData) => ({
          ...prevData,
          [name]: value
        }));
        break;
      case 'edit':
        setSelectedData((prevData) => ({
          ...prevData,
          [name]: value
        }));
        break;
      default:
        break;
    }
  };

  // CRUD operations
  const handleAddSubmit = async () => {
    const formData = new FormData(); // Create a new FormData object

    // Append each field to the FormData object
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price);
    formData.append('category', newProduct.category); // Assuming this is the category ID
    newProduct.tags.forEach((tag) => {
      formData.append('tags[]', tag); // Use 'tags[]' to indicate multiple values for the same key
    });
    if (imageFile) {
      formData.append('image', imageFile); // Include the image file if it exists
    }

    try {
      const response = await apiServices.postProduct(formData);
      console.log(response);
      if (response.data.error !== 1 && response.status === 200) {
        showToast('success', 'Success Add Product');
        getProducts();
        handleClose();
      } else {
        showToast('error', 'Failed Add Product');
        handleClose();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await apiServices.deleteProduct(selectedData._id);
      console.log(response);
      if (response.status === 200) {
        getProducts();
        showToast('success', 'Product deleted successfully');
        handleClose();
      } else {
        showToast('error', 'Product deleted failed');
        handleClose();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditSubmit = async () => {
    try {
      console.log(selectedData);
      const formData = new FormData(); // Create a new FormData object
      // Append each field to the FormData object
      formData.append('name', selectedData.name);
      formData.append('description', selectedData.description);
      formData.append('price', selectedData.price);
      formData.append('category', selectedData.category); // Assuming this is the category ID
      selectedData.tags.forEach((tag) => {
        formData.append('tags[]', tag); // Use 'tags[]' to indicate multiple values for the same key
      });
      if (imageFile) {
        formData.append('image', imageFile); // Include the image file if it exists
      }
      const response = await apiServices.updateProduct(selectedData._id, formData);
      console.log(response);
      if (response.status === 200) {
        getProducts();
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
    getCategories();
    getProducts();
    getTags();
  }, []);

  // Filter products based on search term and selected category
  const filteredProducts = dataProduct.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.category._id === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Button onClick={() => handleShowModal('add')} size="sm">
                Add Product
              </Button>
            </Card.Header>
            <Card.Body>
              <Form.Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="mr-2">
                <option value="">All Categories</option>
                {dataCategory.map((item) => (
                  <option value={item._id} key={item._id}>
                    {item.name}
                  </option>
                ))}
              </Form.Select>
              <Form inline className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mr-2"
                />
                <Row>
                  <Col md={1}>
                    Show Data
                    <Form.Select value={itemsPerPage} onChange={(e) => setItemsPerPage(e.target.value)} className="mr-2">
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </Form.Select>
                  </Col>
                </Row>
              </Form>

              <Table responsive hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Category Name</th>
                    <th>Product Name</th>
                    <th>Product Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((pd, index) => (
                      <tr key={pd._id}>
                        <th scope="row">{(currentPage - 1) * itemsPerPage + index + 1}</th>
                        <td>{pd.category.name}</td>
                        <td>{pd.name}</td>
                        <td>{pd.price}</td>
                        <td>
                          <Button size="sm" onClick={() => handleShowModal('detail', pd)} variant="success">
                            Detail
                          </Button>
                          <Button size="sm" onClick={() => handleShowModal('edit', pd)} variant="warning">
                            Edit
                          </Button>
                          <Button onClick={() => handleShowModal('delete', pd)} variant="danger" size="sm">
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center">
                        Tidak Ada Data
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {/* Pagination Controls */}
              <div className="d-flex justify-content-between">
                <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                  Previous
                </Button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                  Next
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modals for Detail, Edit, Add, and Delete remain unchanged */}
      <Modal show={detailModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1.2rem' }}>Detail Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedData ? (
            <div>
              <img
                style={{ width: '200px', height: '200px', objectFit: 'cover', margin: '10px' }}
                src={`${baseUrl}/images/products/${selectedData.image_url}`}
                loading="lazy"
                alt={selectedData.name}
              />
              <p>
                <strong>Category :</strong> {selectedData.category.name}
              </p>
              <p>
                <strong>Product Name :</strong> {selectedData.name}
              </p>
              <p>
                <strong>Product Price :</strong> {selectedData.price}
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
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={editModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1.2rem' }}>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3" controlId="formBasicCategoryId">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={selectedData && selectedData.category ? selectedData.category.name : ''}
                onChange={(e) => handleEditChange(e, 'edit')}
              >
                <option>Select Category</option>
                {dataCategory.length > 0
                  ? dataCategory.map((item) => (
                      <option value={item.name} key={item._id}>
                        {item.name}
                      </option>
                    ))
                  : ''}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={selectedData ? selectedData.name : ''}
                onChange={(e) => handleEditChange(e, 'edit')}
                placeholder="Enter product name"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={selectedData ? selectedData.description : ''}
                onChange={(e) => handleEditChange(e, 'edit')}
                placeholder="Enter product description"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPrice">
              <Form.Label>Product Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={selectedData ? selectedData.price : ''}
                onChange={(e) => handleEditChange(e, 'edit')}
                placeholder="Enter product price"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicTags">
              <Form.Label>Tags</Form.Label>
              <Form.Select
                multiple
                // value={selectedData ? selectedData.tags.map((tag) => tag._id) : []} // Map to an array of tag IDs
                onChange={handleTagChangeEdit} // Handle changes
              >
                {dataTags.length > 0
                  ? dataTags.map((tag) => (
                      <option
                        value={tag.name}
                        key={tag._id}
                        selected={selectedData ? selectedData.tags.some((selectedTag) => selectedTag._id === tag._id) : ''}
                      >
                        {' '}
                        {/* Check if the tag is selected */}
                        {tag.name}
                      </option>
                    ))
                  : ''}
              </Form.Select>
              <Form.Text className="text-muted">Hold down the Ctrl (Windows) or Command (Mac) button to select multiple options.</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicImage">
              <Form.Label>Edit Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
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
          <Modal.Title style={{ fontSize: '1.2rem' }}>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicCategoryId">
              <Form.Label>Category</Form.Label>
              <Form.Select name="category" onChange={(e) => handleEditChange(e, 'add')}>
                <option>Select Category</option>
                {dataCategory.length > 0
                  ? dataCategory.map((item) => (
                      <option value={item.name} key={item._id}>
                        {item.name}
                      </option>
                    ))
                  : ''}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newProduct ? newProduct.name : ''}
                onChange={(e) => handleEditChange(e, 'add')}
                placeholder="Enter product name"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newProduct ? newProduct.description : ''}
                onChange={(e) => handleEditChange(e, 'add')}
                placeholder="Enter product description"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPrice">
              <Form.Label>Product Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={newProduct ? newProduct.price : ''}
                onChange={(e) => handleEditChange(e, 'add')}
                placeholder="Enter product price"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicTags">
              <Form.Label>Tags</Form.Label>
              <Form.Select multiple onChange={handleTagChange}>
                {dataTags.length > 0
                  ? dataTags.map((tag) => (
                      <option value={tag.name} key={tag._id}>
                        {tag.name}
                      </option>
                    ))
                  : ''}
              </Form.Select>
              <Form.Text className="text-muted">Hold down the Ctrl (Windows) or Command (Mac) button to select multiple options.</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicImage">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
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
        <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
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
