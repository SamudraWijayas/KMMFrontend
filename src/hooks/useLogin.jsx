import { useState } from "react";
import { useAuth } from "../context";
import { message } from "antd";

const useLogin = () => {
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  const loginUser = async (values) => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (res.status === 200) {
        message.success("Login Berhasil");
        login(data.accessToken, data.role); // Arahkan pengguna sesuai dengan role
      } else if (res.status === 404) {
        if (data.msg === "Username tidak terdaftar") {
          setError("Username tidak terdaftar");
        } else if (data.msg === "Password Salah") {
          setError("Password salah. Silakan coba lagi.");
        } else {
          setError("Login Gagal. Silakan coba lagi.");
        }
      } else {
        message.error("Terjadi kesalahan pada server. Silakan coba lagi.");
      }
    } catch (error) {
      message.error("Login Gagal. Periksa koneksi Anda.");
    } finally {
      setLoading(false);
    }
  };
  return { loading, error, loginUser };
};

export default useLogin;
// import { useState } from "react";
// import { useAuth } from "../context";
// import { message } from "antd";

// const useLogin = () => {
//   const { login } = useAuth();
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(null);

//   const loginUser = async (values) => {
//     if (!import.meta.env.VITE_API_URL) {
//       console.error(
//         "VITE_API_URL tidak terdefinisi dalam environment variables."
//       );
//       return;
//     }

//     try {
//       setError(null);
//       setLoading(true);

//       const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(values),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(
//           errorData.message || `HTTP error! Status: ${res.status}`
//         );
//       }

//       const data = await res.json();

//       if (res.status === 200) {
//         message.success("Login Berhasil");
//         login(data.accessToken, data.role); // Arahkan pengguna sesuai dengan role
//       }
//     } catch (error) {
//       const errorMessage =
//         error.message || "Login Gagal. Periksa koneksi Anda.";
//       setError(errorMessage);
//       message.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { loading, error, loginUser };
// };

// export default useLogin;
