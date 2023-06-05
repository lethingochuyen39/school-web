import axios from "axios";
// axios.defaults.headers.common['Authorization'] = cookies.get('token');
 const client = axios.create({
  baseURL: "http://localhost:8080",
});
export default client;

