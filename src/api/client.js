import axios from "axios";
import Login from "../pages/login";
import { Navigate, useNavigate } from "react-router-dom";

const client = axios.create({
	baseURL: "http://localhost:8080",
});

// Thêm interceptor để cập nhật giá trị của Authorization header
client.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default client;

// Đăng xuất: xóa token và làm Axios client không gửi token
export function logout() {
	localStorage.removeItem("role");
	localStorage.removeItem("token");
	localStorage.removeItem("date");
	localStorage.removeItem("refresh_token");
	delete client.defaults.headers.common["Authorization"];
	
}
