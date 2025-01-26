/* eslint-disable no-unused-vars */
import React from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import { useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import apiServices from 'services/api';
import { toast } from 'react-toastify';
import { Bounce } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const JWTLogin = () => {
  const navigate = useNavigate();
  const [dataLogin, setDataLogin] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataLogin((prevData) => ({
      ...prevData,
      [name]: name === 'remember' ? e.target.checked : value // Handle checkbox separately
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsSubmitting(true);
    setErrors({}); // Reset errors

    // Validation
    const validationSchema = Yup.object().shape({
      email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
      password: Yup.string().max(255).required('Password is required')
    });
    try {
      await validationSchema.validate(dataLogin, { abortEarly: false });
      console.log('Login action');
      console.log(dataLogin); // Use the form values here
      const data = {
        email: dataLogin.email,
        password: dataLogin.password
      };
      const response = await apiServices.login(data);
      console.log(response);
      if (response.data.error === 1 || response.status !== 200) {
        toast.error(response.data.message, {
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
        localStorage.setItem('dataLogin', JSON.stringify(response.data));
        toast.success('Login Success', {
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
          navigate('/dashboard');
        }, 1000);
      }
      // Reset form or redirect on success
    } catch (validationErrors) {
      const formattedErrors = {};
      validationErrors.inner.forEach((error) => {
        formattedErrors[error.path] = error.message;
      });
      setErrors(formattedErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="form-group mb-3">
        <input
          className="form-control"
          label="Email Address / Username"
          name="email"
          placeholder="Email Address"
          onBlur={handleChange}
          onChange={handleChange}
          type="email"
          value={dataLogin.email}
        />
        {errors.email && <small className="text-danger form-text">{errors.email}</small>}
      </div>
      <div className="form-group mb-4">
        <input
          className="form-control"
          label="Password"
          name="password"
          onBlur={handleChange}
          placeholder="Password"
          onChange={handleChange}
          type="password"
          value={dataLogin.password}
        />
        {errors.password && <small className="text-danger form-text">{errors.password}</small>}
      </div>

      {errors.submit && (
        <Col sm={12}>
          <Alert color="danger">{errors.submit}</Alert>
        </Col>
      )}

      <Row>
        <Col>
          <Button className="btn-block mb-4" color="primary" disabled={isSubmitting} size="large" type="submit">
            Sign In
          </Button>
        </Col>
      </Row>
    </form>
  );
};

export default JWTLogin;
