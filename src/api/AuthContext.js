import axios from "axios";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import jwt from "jwt-decode";
import client from "./client.js";
// axios.defaults.headers.common['Authorization'] = cookies.get('token');

const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
  const [getLogin, setgetLogin] = useState({ isAuthenticated: false });
  const navigate = useNavigate();
  const login = async (payload) => {
    await client.post("/auth/login", payload).then((res) => {
      const newCookie = new Cookies();
      setgetLogin({ isAuthenticated: true });
      const token = res.data.token;
      var jwtDecode = jwt(token);
      console.log(jwtDecode);
      navigate("/", { state: { jwtDecode, token } });
      newCookie.set("token", token, { path: "/" });
    });
  };
  return (
    <>
      {/* {" "} */}
      <AuthContext.Provider value={{ getLogin, login }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthContext;
