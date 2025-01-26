import React from 'react';
import { useLocation } from 'react-router-dom';

const useTitle = () => {
  const location = useLocation();
  const route = routes.find((route) => route.path === location.pathname) || {};
  const title = route.title || 'Default Title'; // Ganti 'Default Title' sesuai kebutuhan

  React.useEffect(() => {
    document.title = title;
  }, [title]);
};

export default useTitle;
