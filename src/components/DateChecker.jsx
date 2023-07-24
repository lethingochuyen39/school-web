import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client, { logout, noToken } from '../api/client';
import jwtDecode from 'jwt-decode';

const DateChecker = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let date = new Date(localStorage.getItem('date') * 1000);
    let dateNow = new Date();
    if(date){
      
    if (date < dateNow) {
      // const role = localStorage.getItem('role');
        logout();
      // navigate('/login');
      localStorage.removeItem('date');
      client.post('/auth/refreshtoken', {refreshToken: localStorage.getItem('refreshToken')}).then((res)=>{
        const token = res.data.token;
			// var role = res.data.roles[0];
			// console.log(role);
			// localStorage.setItem("role", role);
			// let date = new Date(jwtDecode(token).exp * 1000);
			// console.log(date);
			const dateUnix = jwtDecode(token).exp;
			localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("date", dateUnix);
			localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role[0]);
      });
    }
    }
  }, [navigate]);

  return null; // Since this component is only for side effects, it doesn't render anything
};

export default DateChecker;