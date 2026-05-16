import axios from "axios";

// khởi tạo cấu hình
const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    Accept: "application/json",
  },
});

// thêm interceptor để tự động thêm token vào header của mỗi request
axiosClient.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bear  er ${token}`;
  } 
  return config;
});

export default axiosClient; 