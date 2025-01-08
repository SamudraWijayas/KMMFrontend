import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const useFetchUserData = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      // Cek apakah data sudah ada
      if (userData) {
        return; // Jika sudah ada data, jangan ambil lagi
      } 
      setLoading(true);
      const token = Cookies.get("accessToken");
      if (!token) {
        setError("No token found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setTimeout(() => {
          setUserData(data);
          setLoading(false);
        }, 1000); // Set loading for 2 seconds
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { userData, error, loading };
};

export default useFetchUserData;

// import { useState, useEffect } from "react";
// import Cookies from "js-cookie";

// const useFetchUserData = () => {
//   const [userData, setUserData] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const token = Cookies.get("accessToken");
//       if (!token) {
//         setError("No token found");
//         return;
//       }

//       try {
//         const response = await fetch("http://localhost:5000/me", {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch user data");
//         }

//         const data = await response.json();
//         setUserData(data);
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     fetchUser();
//   }, []);

//   return { userData, error }; // Tidak lagi mengembalikan 'loading'
// };

// export default useFetchUserData;
