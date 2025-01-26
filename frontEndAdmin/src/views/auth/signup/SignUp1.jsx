import React, { useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import apiServices from 'services/api';
import { toast } from 'react-toastify';
import { Bounce } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const SignUp1 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    us_name: '',
    // us_username: '',
    us_password: '',
    us_email: '',
    us_phone_number: '',
    us_address: '',
    us_id: Math.random().toString(36).substring(2, 15) // Generate random ID
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validasi
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = 'This field is required';
      }
    });
    console.log(Object.keys(newErrors));
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    console.log('kocak');

    // Kirim data ke API
    try {
      // Redirect atau tampilkan pesan sukses
      console.log('kocak');
      const response = await apiServices.register(formData);
      console.log(response);
      if (response.data.error === 1) {
        toast.error(`Register Failed, ${response.data.message}`, {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Bounce
        });
      } else {
        toast.success('Register Success', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Bounce
        });
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Tampilkan pesan kesalahan jika diperlukan
    }
  };

  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="borderless">
            <Row className="align-items-center">
              <Col>
                <Card.Body className="text-center">
                  <div className="mb-4">
                    <i className="feather icon-user-plus auth-icon" />
                  </div>
                  <h3 className="mb-4">Sign up</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        name="us_name"
                        placeholder="Username"
                        value={formData.us_name}
                        onChange={handleChange}
                      />
                      <div>{errors.us_username && <small className="text-danger form-text">{errors.us_username}</small>}</div>
                    </div>
                    <div className="form-group mb-3">
                      <input
                        type="email"
                        className="form-control"
                        name="us_email"
                        placeholder="Email address"
                        value={formData.us_email}
                        onChange={handleChange}
                      />
                      {errors.us_email && <small className="text-danger form-text">{errors.us_email}</small>}
                    </div>
                    <div className="form-group mb-3">
                      <input
                        type="password"
                        className="form-control"
                        name="us_password"
                        placeholder="Password"
                        value={formData.us_password}
                        onChange={handleChange}
                      />
                      {errors.us_password && <small className="text-danger form-text">{errors.us_password}</small>}
                    </div>
                    <div className="form-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        name="us_phone_number"
                        placeholder="Phone Number"
                        value={formData.us_phone_number}
                        onChange={handleChange}
                      />
                      {errors.us_phone_number && <small className="text-danger form-text">{errors.us_phone_number}</small>}
                    </div>
                    <div className="form-group mb-4">
                      <input
                        type="text"
                        className="form-control"
                        name="us_address"
                        placeholder="Address"
                        value={formData.us_address}
                        onChange={handleChange}
                      />
                      {errors.us_address && <small className="text-danger form-text">{errors.us_address}</small>}
                    </div>

                    <button type="submit" className="btn btn-primary mb-4">
                      Sign up
                    </button>
                    <p className="mb-2">
                      Already have an account?{' '}
                      <NavLink to={'/login'} className="f-w-400">
                        Login
                      </NavLink>
                    </p>
                  </form>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SignUp1;
