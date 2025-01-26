import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import useTitle from 'components/UseTitle';
import routes, { renderRoutes } from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS

const App = () => {
  return (
    <div>
      <BrowserRouter basename={import.meta.env.VITE_APP_BASE_NAME}>{renderRoutes(routes)}</BrowserRouter>;
      <ToastContainer />
    </div>
  );
};

export default App;
