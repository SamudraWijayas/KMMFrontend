import axios from "axios";
import { useAuth } from "../context/index"; // Sesuaikan dengan lokasi context Anda

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response, // Jika respons sukses, kembalikan seperti biasa
  (error) => {
    const { logout } = useAuth(); // Akses logout dari context

    if (error.response?.status === 401) {
      // Token kadaluarsa
      alert("Session expired. Please log in again.");
      logout(); // Logout user
      window.location.href = "/login"; // Redirect ke login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
