import React from "react";
import { useNavigate, Outlet } from "react-router";

const RoleAccess = ({ roles = [] }) => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');
    return !roles.length || roles.includes(role)
      ? <Outlet />

      : navigate("/login");
  };
export default RoleAccess;