// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import Button from "@mui/material/Button";
// import Skeleton from "@mui/material/Skeleton";
// import { MdDashboard } from "react-icons/md";
// import { FaLayerGroup } from "react-icons/fa";
// import axios from "axios";
// import Frame from "../../assets/Frame.png";

// export const Sidebar = ({ username, avatar, id_desa }) => {
//   const [activeTab, setActiveTab] = useState(null);
//   const location = useLocation();
//   const [kelompokData, setKelompokData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const toggleSubmenu = (tabIndex) => {
//     setActiveTab(activeTab === tabIndex ? null : tabIndex);
//   };

//   useEffect(() => {
//     // Set submenu active based on the current location
//     if (location.pathname === "/male" || location.pathname === "/female") {
//       setActiveTab(1);
//     } else {
//       setActiveTab(null);
//     }
//   }, [location]);

//   const fetchKelompok = async (id_desa) => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/kelompok/desa/${id_desa}`
//       );
//       setKelompokData(response.data);
//     } catch (error) {
//       console.error("Error fetching kelompok data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (id_desa) {
//       fetchKelompok(id_desa);
//     }
//   }, [id_desa]);

//   return (
//     <div className="sidebar">
//       <div
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           backgroundImage: `url(${Frame})`,
//           backgroundSize: "cover", // Membuat gambar memenuhi seluruh div
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat",
//           opacity: 0.2,
//           transform: "rotate(0deg)", // Memutar gambar sebesar 270 derajat
//           transformOrigin: "center", // Menetapkan titik pusat rotasi
//         }}
//       ></div>
//       <ul>
//         {/* Dashboard Menu */}
//         <li className={location.pathname === "/" ? "active-item" : ""}>
//           <Link to="/dashboard">
//             <Button className="w-100">
//               <span className="icon">
//                 <MdDashboard />
//               </span>
//               Dashboard
//             </Button>
//           </Link>
//         </li>

//         {/* Display kelompok based on id_desa */}
//         {loading ? (
//           // Skeleton while loading
//           <>
//             {[...Array(5)].map((_, index) => (
//               <li key={index}>
//                 <Skeleton
//                   variant="text"
//                   animation="wave"
//                   width="100%"
//                   height={30}
//                   style={{ marginBottom: "10px", marginLeft: "10px" }}
//                 />
//               </li>
//             ))}
//           </>
//         ) : kelompokData.length > 0 ? (
//           kelompokData.map((kelompok) => (
//             <li
//               key={kelompok.uuid}
//               className={
//                 location.pathname === `/group/${kelompok.uuid}`
//                   ? "active-item"
//                   : ""
//               }
//             >
//               <Link to={`/group/${kelompok.uuid}`}>
//                 <Button className="w-100">
//                   <span className="icon">
//                     <FaLayerGroup />
//                   </span>
//                   {kelompok.kelompok}
//                 </Button>
//               </Link>
//             </li>
//           ))
//         ) : (
//           <li>
//             <p>Tidak ada kelompok yang ditemukan</p>
//           </li>
//         )}
//       </ul>
//     </div>
//   );
// };

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import { MdDashboard } from "react-icons/md";
import { FaLayerGroup } from "react-icons/fa";
import axios from "axios";
import Frame from "../../assets/Frame.png";

export const Sidebar = ({ username, avatar, id_desa }) => {
  const [activeTab, setActiveTab] = useState(null);
  const location = useLocation();
  const [kelompokData, setKelompokData] = useState([]);
  const [loading, setLoading] = useState(true); // Inisialisasi loading menjadi true

  const toggleSubmenu = (tabIndex) => {
    setActiveTab(activeTab === tabIndex ? null : tabIndex);
  };

  useEffect(() => {
    // Set submenu active based on the current location
    if (location.pathname === "/male" || location.pathname === "/female") {
      setActiveTab(1);
    } else {
      setActiveTab(null);
    }
  }, [location]);

  const fetchKelompok = async (id_desa) => {
    setLoading(true); // Mulai loading sebelum request
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/kelompok/desa/${id_desa}`
      );
      setKelompokData(response.data);
      // Simpan data ke localStorage setelah berhasil fetch
      localStorage.setItem("kelompokData", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching kelompok data:", error);
    } finally {
      setLoading(false); // Set loading false setelah request selesai
    }
  };

  useEffect(() => {
    // Jika id_desa ada dan data kelompok tidak ditemukan di localStorage
    const storedKelompokData = localStorage.getItem("kelompokData");
    if (storedKelompokData) {
      setKelompokData(JSON.parse(storedKelompokData));
      setLoading(false); // Set loading menjadi false jika data ada di localStorage
    } else {
      if (id_desa) {
        fetchKelompok(id_desa);
      }
    }
  }, [id_desa]); // Menambahkan id_desa sebagai dependency

  return (
    <div className="sidebar">
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${Frame})`,
          backgroundSize: "cover", // Membuat gambar memenuhi seluruh div
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.2,
          transform: "rotate(0deg)", // Memutar gambar sebesar 270 derajat
          transformOrigin: "center", // Menetapkan titik pusat rotasi
        }}
      ></div>
      <ul>
        {/* Dashboard Menu */}
        <li className={location.pathname === "/" ? "active-item" : ""}>
          <Link to="/dashboard">
            <Button className="w-100">
              <span className="icon">
                <MdDashboard />
              </span>
              Dashboard
            </Button>
          </Link>
        </li>

        {/* Display kelompok based on id_desa */}
        {loading ? (
          // Skeleton while loading
          <>
            {[...Array(5)].map((_, index) => (
              <li key={index}>
                <Skeleton
                  variant="text"
                  animation="wave"
                  width="100%"
                  height={30}
                  style={{ marginBottom: "10px", marginLeft: "10px" }}
                />
              </li>
            ))}
          </>
        ) : kelompokData.length > 0 ? (
          kelompokData.map((kelompok) => (
            <li
              key={kelompok.uuid}
              className={
                location.pathname === `/group/${kelompok.uuid}`
                  ? "active-item"
                  : ""
              }
            >
              <Link to={`/group/${kelompok.uuid}`}>
                <Button className="w-100">
                  <span className="icon">
                    <FaLayerGroup />
                  </span>
                  {kelompok.kelompok}
                </Button>
              </Link>
            </li>
          ))
        ) : (
          <li>
            <p>Tidak ada kelompok yang ditemukan</p>
          </li>
        )}
      </ul>
    </div>
  );
};
