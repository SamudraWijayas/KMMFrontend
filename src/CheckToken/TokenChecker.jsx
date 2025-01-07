import React, { useEffect } from "react";
import { useAuth } from "../context";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Pastikan SweetAlert2 diimpor

const TokenChecker = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    const checkToken = async () => {
      try {
        await axios.get("http://localhost:5000/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        if (err.response?.status === 401) {
          // Tampilkan SweetAlert dan lakukan logout setelah tombol OK ditekan
          Swal.fire({
            title: "Sesi Anda Habis",
            text: "Silakan login kembali untuk melanjutkan.",
            icon: "warning",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              logout(); // Logout setelah OK diklik
              navigate("/login"); // Arahkan ke halaman login
            }
          });
        }
      }
    };

    // Interval untuk memeriksa token setiap beberapa detik
    const interval = setInterval(checkToken, 5000);

    return () => clearInterval(interval);
  }, [token, logout, navigate]);

  return null; // Komponen ini hanya menjalankan efek, tidak perlu menampilkan apa-apa
};

export default TokenChecker;
