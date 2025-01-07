import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = Cookies.get("accessToken");
    const storedRole = Cookies.get("role");

    if (storedToken && storedRole) {
      setToken(storedToken);
      setUserRole(storedRole);
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  const login = (accessToken, role) => {
    Cookies.set("accessToken", accessToken);
    Cookies.set("role", role);

    setToken(accessToken);
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("role");
    setToken(null);
    setUserRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ token, userRole, isAuthenticated, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// import React, { createContext, useContext, useEffect, useState } from "react";
// import Cookies from "js-cookie"; // Untuk menyimpan token dan role

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true); // Tambahkan state loading

//   // Cek token dari cookies saat aplikasi pertama kali dimuat
//   useEffect(() => {
//     const storedToken = Cookies.get("accessToken");
//     const storedRole = Cookies.get("role");

//     if (storedToken && storedRole) {
//       setToken(storedToken);
//       setUserRole(storedRole);
//       setIsAuthenticated(true);
//     }

//     setLoading(false); // Selesai memuat autentikasi
//   }, []);

//   // Fungsi login
//   const login = (accessToken, role) => {
//     if (!accessToken || !role) {
//       console.error("Error: Missing accessToken or role");
//       return;
//     }

//     // Simpan token dan role ke cookies dengan keamanan tambahan
//     Cookies.set("accessToken", accessToken, {
//       expires: 1 / (24 * 60 * 2), // 30 detik
//       secure: true,
//       sameSite: "Strict",
//     });
//     Cookies.set("role", role, {
//       expires: 1 / (24 * 60 * 2),
//       secure: true,
//       sameSite: "Strict",
//     });

//     setToken(accessToken);
//     setUserRole(role);
//     setIsAuthenticated(true);
//   };

//   // Fungsi logout
//   const logout = () => {
//     // Hapus token dan role dari cookies
//     Cookies.remove("accessToken");
//     Cookies.remove("role");

//     // Reset state autentikasi
//     setToken(null);
//     setUserRole(null);
//     setIsAuthenticated(false);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         token,
//         userRole,
//         isAuthenticated,
//         login,
//         logout,
//         loading, // Tambahkan loading ke context
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook untuk menggunakan AuthContext
// export const useAuth = () => useContext(AuthContext);

// import React, { createContext, useContext, useEffect, useState } from "react";
// import Cookies from "js-cookie"; // Untuk menyimpan token dan role

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // Cek apakah ada token yang valid di cookies saat aplikasi dimuat
//   useEffect(() => {
//     const storedToken = Cookies.get("accessToken");
//     const storedRole = Cookies.get("role");

//     if (storedToken && storedRole) {
//       setToken(storedToken);
//       setUserRole(storedRole);
//       setIsAuthenticated(true);
//     }
//   }, []);

//   const login = (accessToken, role) => {

//     if (!accessToken || !role) {
//       console.error("Error: Missing accessToken or role");
//       return;
//     }

//     // Simpan token dan role ke cookies
//     Cookies.set("accessToken", accessToken, { expires: 1 });
//     Cookies.set("role", role, { expires: 1 });

//     setToken(accessToken);
//     setUserRole(role);
//     setIsAuthenticated(true);
//   };

//   const logout = () => {
//     // Hapus token dan role dari cookies
//     Cookies.remove("accessToken");
//     Cookies.remove("role");

//     setToken(null);
//     setUserRole(null);
//     setIsAuthenticated(false);
//   };

//   return (
//     <AuthContext.Provider
//       value={{ token, userRole, isAuthenticated, login, logout }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

// import React, { createContext, useContext, useEffect, useState } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(null);
//   const [userData, setUserData] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const storedData = JSON.parse(localStorage.getItem("user_data"));

//   useEffect(() => {
//     if (storedData) {
//       const { userToken, user } = storedData;
//       setToken(userToken);
//       setUserData(user);
//       setIsAuthenticated(true);
//     }
//   }, []);

//   const login = (newToken, newData) => {
//     localStorage.setItem(
//       "user_data",
//       JSON.stringify({ userToken: newToken, user: newData })
//     );
//     setToken(newToken);
//     setUserData(newData);
//     setIsAuthenticated(true);
//   };

//   const logout = () => {
//     localStorage.removeItem("user_data");
//     setToken(null);
//     setUserData(null);
//     setIsAuthenticated(false);
//   };

//   return (
//     <AuthContext.Provider
//       value={{ token, isAuthenticated, login, logout, userData }} // Perbaikan di sini
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
