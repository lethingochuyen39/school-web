import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/client';

const DateChecker = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let date = new Date(localStorage.getItem('date') * 1000);
    let dateNow = new Date();

    if (date < dateNow) {
        logout();
      navigate('/login');
    }
  }, [navigate]);

  return null; // Since this component is only for side effects, it doesn't render anything
};

export default DateChecker;