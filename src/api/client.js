import axios from "axios";
<<<<<<< HEAD
=======
import Cookies from "universal-cookie";

>>>>>>> d957b4301669c0108cdc6fb647706f356807623f

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
	localStorage.removeItem("token");
	localStorage.removeItem("date");
	localStorage.removeItem("refresh_token");
	delete client.defaults.headers.common["Authorization"];
}
