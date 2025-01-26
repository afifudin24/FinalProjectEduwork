import React from 'react';
// eslint-disable-next-line no-unused-vars
import { Card, Button, Alert } from 'react-bootstrap';
// eslint-disable-next-line no-unused-vars
import { NavLink, Link } from 'react-router-dom';

import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

// eslint-disable-next-line no-unused-vars
import { CopyToClipboard } from 'react-copy-to-clipboard';

import AuthLogin from './JWTLogin';

const Signin1 = () => {
  document.title = 'Login';
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
          <Card className="borderless text-center">
            <Card.Body>
              <div className="mb-4">
                <i className="feather icon-unlock auth-icon" />
              </div>
              <AuthLogin />
              {/* <p className="mb-2 text-muted">
                Forgot password?{' '}
                <NavLink to={'#'} className="f-w-400">
                  Reset
                </NavLink>
              </p> */}
              <p className="mb-0 text-muted">
                Don’t have an account?{' '}
                <NavLink to="/signup" className="f-w-400">
                  Signup
                </NavLink>
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Signin1;
