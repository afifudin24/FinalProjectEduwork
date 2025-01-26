/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import { ListGroup, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import ChatList from './ChatList';
import { toast } from 'react-toastify';
import { Bounce } from 'react-toastify';

import avatar1 from '../../../../assets/images/user/avatar-1.jpg';

const NavRight = () => {
  const [listOpen, setListOpen] = useState(false);
  const navigate = useNavigate();
  const [dataLogin, setDataLogin] = useState(null);
  useEffect(() => {
    const data = localStorage.getItem('dataLogin');
    const dataJSON = JSON.parse(data);
    setDataLogin(dataJSON);
    console.log(dataJSON);
    // Jika tidak ada data, navigasi ke /login
    if (!data) {
      navigate('/login');
    }
  }, [navigate]);

  const logout = () => {
    // Hapus semua data dari localStorage
    console.log('kocak');
    localStorage.clear();
    toast.success('Logout Success', {
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
      // Navigasi ke halaman login
      navigate('/login');
    }, 1000);
  };

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto" id="navbar-right">
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align={'end'} className="drp-user">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
              <i className="icon feather icon-settings" />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="profile-notification">
              <div className="pro-head">
                <img src={avatar1} className="img-radius" alt="User Profile" />
                <span>{dataLogin ? dataLogin.user.full_name : ''}</span>

                <div onClick={logout} className="dud-logout" style={{ cursor: 'pointer' }} title="Logout">
                  <i className="feather icon-log-out" />
                </div>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
      </ListGroup>
      <ChatList listOpen={listOpen} closed={() => setListOpen(false)} />
    </React.Fragment>
  );
};

export default NavRight;
