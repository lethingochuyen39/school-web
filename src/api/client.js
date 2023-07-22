import axios from "axios";

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
	localStorage.removeItem("refreshToken");
	localStorage.removeItem("userId");
	localStorage.removeItem("id");
	delete client.defaults.headers.common["Authorization"];
}

export function forgotpassword(payload){
	client.post("auth/forgot_password",payload);
}

export function resetpassword(payload){
	const token = window.location.search;
	client.post("auth/reset_password"+token,payload);
}

export function confirm(payload){
	client.post("/api/student/confirm",payload);
}