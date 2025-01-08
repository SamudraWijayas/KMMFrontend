import React, { useState, useEffect } from "react";
import useFetchUserData from "../../../hooks/useFetchUserData";
import Header from "../../../component/Header";
import { Sidebar } from "../../../component/Sidebar/Admin";
import { FaUser } from "react-icons/fa";
import { FaLayerGroup } from "react-icons/fa";
import { GiVillage } from "react-icons/gi";
import { FaPlus } from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import axios from "axios"; // Pastikan axios diimport
import DashboardBox from "./DashboardBox";
import Button from "@mui/material/Button";
import StatisticsChart from "../../../component/Chart/Pie";
import StatisticsLine from "../../../component/Chart/Line";
import { Skeleton } from "antd"; // Import Skeleton dari Ant Design
import "react-loading-skeleton/dist/skeleton.css";
import { message } from "antd";
import { Helmet } from "react-helmet-async";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Meng-register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
);

const Dashboard = () => {
  // Always call hooks in the same order
  const { userData, loading } = useFetchUserData();
  const usernames = userData?.username;
  const avatar = userData?.avatar;
  const [sidebarOpen, setSidebarOpen] = useState(false); // State untuk sidebar

  const [villages, setVillages] = useState([]); // State untuk data desa
  const [groups, setGroups] = useState([]); // Data kelompok
  const [users, setUsers] = useState([]); // State untuk data desa
  const [isModalUser, setIsModalUser] = useState(false);
  const [isModalDesa, setIsModalDesa] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalGenerus, setTotalGenerus] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDesa, setTotalDesa] = useState(0);
  const [totalKelompok, setTotalKelompok] = useState(0);

  if (isModalUser) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  // Hitung data yang akan ditampilkan di halaman saat ini
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVillages = villages.slice(indexOfFirstItem, indexOfLastItem);

  // Hitung jumlah halaman
  const totalPages = Math.ceil(villages.length / itemsPerPage);

  // Fungsi untuk mengubah halaman
  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // ----------------------------------------------------------------------------pagination user first
  // Pagination untuk data user
  const [userPage, setUserPage] = useState(1); // Halaman aktif untuk user
  const usersPerPage = 4;
  const indexOfLastUser = userPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Hitung jumlah halaman untuk data user
  const userTotalPages = Math.ceil(users.length / usersPerPage);

  // Fungsi untuk mengubah halaman data user
  const changeUserPage = (pageNumber) => {
    setUserPage(pageNumber);
  };

  const getDisplayedPages = (currentPage, totalPages, maxPagesToShow = 3) => {
    const half = Math.floor(maxPagesToShow / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    if (currentPage <= half) {
      end = Math.min(maxPagesToShow, totalPages);
    } else if (currentPage + half > totalPages) {
      start = Math.max(1, totalPages - maxPagesToShow + 1);
    }

    return { start, end };
  };
  // ----------------------------------------------------------------------------pagination user end

  const openUser = () => setIsModalUser(true);
  const closeUser = () => setIsModalUser(false);
  const openDesa = () => setIsModalDesa(true);
  const closeDesa = () => setIsModalDesa(false);

  // State untuk form modal tambah user
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [role, setRole] = useState("");
  const [idDesa, setIdDesa] = useState("");
  const [idKelompok, setIdKelompok] = useState("");
  const [loadingVillages, setLoadingVillages] = useState(false); // Loading state untuk desa
  const [loadingUsers, setLoadingUsers] = useState(false); // Loading state untuk user
  const [errors, setError] = useState("");
  const [loadings, setLoading] = useState(false);

  // State untuk form modal tambah desa
  const [desa, setDesa] = useState("");

  // Fungsi untuk mengambil data kelompok
  const getGroups = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/kelompok`
      );
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  // Fungsi untuk mengambil data desa
  const getVillages = async () => {
    setLoadingVillages(true); // Set loading menjadi true saat memulai request
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/desa`);
      setVillages(response.data);
    } catch (error) {
      console.error("Error fetching villages:", error);
    } finally {
      setLoadingVillages(false); // Set loading menjadi false setelah data diterima
    }
  };

  // Fungsi untuk menghapus desa
  const deleteVillage = async (uuid) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/desa/${uuid}`
      );
      message.success("Desa berhasil dihapus!");
      getVillages(); // Refresh daftar desa setelah penghapusan
    } catch (error) {
      console.error("Error deleting village:", error);
      message.error("Terjadi kesalahan saat menghapus desa");
    }
  };

  // Fungsi untuk mengambil data users
  const getUsers = async () => {
    setLoadingUsers(true); // Set loading menjadi true saat memulai request
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      // Ensure loading is turned off after 1 second
      setTimeout(() => {
        setLoadingUsers(false); // Set loading menjadi false setelah data diterima
      }, 1000); // 1000 ms = 1 second
    }
  };
  const fetchTotalDesa = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/totalDesa`);
      const data = await response.json();
      setTotalDesa(data.totalDesa);
    } catch (error) {
      console.error("Error fetching total desa:", error);
    } finally {
      // Ensure loading is turned off after 1 second
      setTimeout(() => {
        setLoading(false);
      }, 1000); // 1000 ms = 1 second
    }
  };
  const fetchTotalKelompok = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/totalKelompok`
      );
      const data = await response.json();
      setTotalKelompok(data.totalKelompok);
    } catch (error) {
      console.error("Error fetching total desa:", error);
    } finally {
      // Ensure loading is turned off after 1 second
      setTimeout(() => {
        setLoading(false);
      }, 1000); // 1000 ms = 1 second
    }
  };

  const fetchTotalGenerus = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/totalGenerus`
      );
      const data = await response.json();
      setTotalGenerus(data.totalGenerus);
    } catch (error) {
      console.error("Error fetching total generus:", error);
    } finally {
      // Ensure loading is turned off after 1 second
      setTimeout(() => {
        setLoading(false);
      }, 1000); // 1000 ms = 1 second
    }
  };

  const fetchTotaUsers = async () => {
    try {
      setLoading(true); // Start loading immediately
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/totalUsers`
      );
      const data = await response.json();
      setTotalUsers(data.totalUsers);
    } catch (error) {
      console.error("Error fetching total user:", error);
    } finally {
      // Ensure loading is turned off after 1 second
      setTimeout(() => {
        setLoading(false);
      }, 1000); // 1000 ms = 1 second
    }
  };

  useEffect(() => {
    getVillages();
    getGroups();
    getUsers(); // Panggil fungsi untuk mengambil data desa saat komponen dimuat
    fetchTotalGenerus();
    fetchTotaUsers();
    fetchTotalDesa();
    fetchTotalKelompok();
  }, []);

  // if (loading) {
  //   return <LoadingComponent />;
  // }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  // if (!userData) {
  //   return <div>No user data found. Please log in.</div>;
  // }

  const submitDesa = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/desa`,
        { desa: desa },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(response.data);
      message.success("Desa berhasil ditambahkan!");
      closeDesa();
      getVillages(); // Refresh kategori
    } catch (error) {
      console.error(error);
      message.error("Terjadi kesalahan saat menambahkan kategori");
    }
  };

  // Fungsi untuk submit form tambah user
  const submitUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error message

    if (password !== confPassword) {
      setError("Password tidak cocok");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/register`,
        {
          username,
          password,
          confPassword,
          role,
          id_desa: idDesa,
          id_kelompok: idKelompok,
        }
      );

      if (response.status === 201) {
        message.success("Users berhasil ditambahkan!");
        closeUser();
        getUsers();
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        setError(error.response.data.msg || "Terjadi kesalahan");
      } else if (error.request) {
        // The request was made but no response was received
        setError(
          "Server tidak dapat dijangkau. Pastikan backend sedang berjalan."
        );
      } else {
        // Something else happened
        setError("Terjadi kesalahan saat mengirim data.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Beranda - Selamat Datang di Sistem Database</title>
        <meta
          name="description"
          content="Welcome to the Home page of My Website"
        />
      </Helmet>
      <Header
        username={usernames}
        avatar={avatar}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen} // Meneruskan setSidebarOpen ke Header
      />
      <div className="main d-flex">
        <div className={`sidebarWrapper ${sidebarOpen ? "open" : "closed"}`}>
          <Sidebar
            sidebarOpen={sidebarOpen}
            username={usernames}
            avatar={avatar}
          />
        </div>
        <div className={`content ${sidebarOpen ? "open" : "closed"}`}>
          <div className="right-content w-100">
            <div className="row gx-3 dashboardboxwrapperbox mt-3">
              <div className="col-md-8">
                <div className="dashboardboxwrapper d-flex">
                  <DashboardBox
                    title="Total Generus"
                    count={
                      loadings ? (
                        <Skeleton active paragraph={{ rows: 1 }} />
                      ) : (
                        totalGenerus
                      )
                    }
                    color={["#16325B", "#4066B8"]}
                    icon={<FaUser />}
                  />

                  <DashboardBox
                    title="Total User"
                    count={
                      loadings ? (
                        <Skeleton active paragraph={{ rows: 1 }} />
                      ) : (
                        totalUsers
                      )
                    }
                    color={["#E1AE3E", "#F6CD46"]}
                    icon={<FaUser />}
                  />
                  <DashboardBox
                    title="Total Desa"
                    count={
                      loadings ? (
                        <Skeleton active paragraph={{ rows: 1 }} />
                      ) : (
                        totalDesa
                      )
                    }
                    color={["#E14862", "#F34F7D"]}
                    icon={<GiVillage />}
                  />
                  <DashboardBox
                    title="Total Kelompok"
                    count={
                      loadings ? (
                        <Skeleton active paragraph={{ rows: 1 }} />
                      ) : (
                        totalKelompok
                      )
                    }
                    color={["#23A66D", "#01DBB9"]}
                    icon={<FaLayerGroup />}
                  />
                </div>
              </div>
              <div className="col-md-4 d-flex align-items-center">
                <div className="pie d-flex align-items-center text-center">
                  <StatisticsChart />
                </div>
              </div>
            </div>
            <div className="barwrapper mt-3">
              <div className="barbox">
                <StatisticsLine />
              </div>
            </div>
            <div className="asu mb-3">
              <div className="cok table-data">
                <div
                  className="flex-grow-1 village"
                  style={{ flexBasis: "600px" }}
                >
                  <div className="d-flex justify-content-between">
                    <h5 style={{ color: "#513b8a" }}>Desa</h5>
                    <Button
                      className="success add text-black"
                      color="success"
                      onClick={openDesa}
                    >
                      <FaPlus />
                    </Button>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Desa</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingVillages ? (
                        // Tampilkan skeleton jika data sedang dimuat
                        <tr>
                          <td colSpan="3">
                            <Skeleton count={5} />
                          </td>
                        </tr>
                      ) : currentVillages.length > 0 ? (
                        currentVillages.map((village, index) => (
                          <tr key={village.id}>
                            <td>{indexOfFirstItem + index + 1}</td>
                            <td>{village.desa}</td>
                            <td>
                              <div className="actions d-flex align-items-center">
                                <Button
                                  className="success text-black"
                                  color="success"
                                >
                                  <MdModeEdit />
                                </Button>
                                <Button
                                  className="error text-black"
                                  color="error"
                                  onClick={() => deleteVillage(village.uuid)}
                                >
                                  <MdDelete />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3">Tidak ada data desa tersedia.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <div className="pagination d-flex justify-content-end mt-4">
                    {/* Tombol "Previous" */}
                    <Button
                      variant="text" // Hilangkan border
                      size="small"
                      disabled={currentPage === 1}
                      onClick={() => changePage(currentPage - 1)}
                      className="mx-1"
                      style={{
                        minWidth: "40px",
                        padding: "2px 8px",
                        color: currentPage === 1 ? "#999" : "#0033a0", // Warna teks (putih jika aktif)
                        borderRadius: "4px", // Tambahkan radius agar terlihat lebih modern
                        fontWeight: currentPage === 1 ? "normal" : "bold", // Tebal jika tidak disable
                        cursor: currentPage === 1 ? "not-allowed" : "pointer", // Pointer untuk tombol aktif
                      }}
                    >
                      <GrPrevious />
                    </Button>

                    {/* Tombol angka halaman */}
                    {[...Array(totalPages).keys()].map((page) => {
                      const isActive = page + 1 === currentPage; // Cek jika halaman aktif
                      return (
                        <Button
                          key={page + 1}
                          variant="text" // Gunakan varian teks tanpa border
                          size="small"
                          onClick={() => changePage(page + 1)}
                          className="mx-1"
                          style={{
                            minWidth: "30px",
                            padding: "2px 6px",
                            backgroundColor: isActive
                              ? "#0033a0"
                              : "transparent", // Background untuk halaman aktif
                            color: isActive ? "white" : "#000", // Teks putih untuk halaman aktif
                            border: "none", // Hilangkan border
                            borderRadius: "4px", // Tambahkan sedikit border-radius
                            fontWeight: isActive ? "bold" : "normal", // Teks tebal untuk aktif
                          }}
                        >
                          {page + 1}
                        </Button>
                      );
                    })}

                    {/* Tombol "Next" */}
                    <Button
                      variant="text" // Hilangkan border
                      size="small"
                      disabled={currentPage === totalPages}
                      onClick={() => changePage(currentPage + 1)}
                      className="mx-1"
                      style={{
                        minWidth: "40px",
                        padding: "2px 8px",
                        color: currentPage === totalPages ? "#999" : "#0033a0", // Warna teks
                        borderRadius: "4px", // Membuat tombol lebih modern
                        fontWeight:
                          currentPage === totalPages ? "normal" : "bold", // Teks lebih tebal jika tombol aktif
                        cursor:
                          currentPage === totalPages
                            ? "not-allowed"
                            : "pointer", // Pointer untuk tombol aktif
                      }}
                    >
                      <GrNext />
                    </Button>
                  </div>
                </div>

                <div className="flex-grow-1" style={{ flexBasis: "200px" }}>
                  <div className="d-flex justify-content-between mb-2">
                    <h5 style={{ color: "#513b8a" }}>User</h5>
                    <Button
                      className="success add text-black"
                      color="success"
                      onClick={openUser}
                    >
                      <FaPlus />
                    </Button>
                  </div>
                  {loadingUsers ? (
                    // Tampilkan skeleton jika data sedang dimuat
                    <div>
                      <Skeleton count={4} height={40} />
                    </div>
                  ) : (
                    currentUsers.map((user, index) => (
                      <div className="users" key={user.id || index}>
                        <div className="d-flex align-items-center">
                          <span>{user.username}</span>
                          <span className="ms-2" style={{ fontSize: "10px" }}>
                            {user.role}
                          </span>
                        </div>
                        <div className="actions d-flex align-items-center">
                          <Button
                            className="success text-black"
                            color="success"
                          >
                            <MdModeEdit />
                          </Button>
                          <Button className="error text-black" color="error">
                            <MdDelete />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                  <div className="pagination d-flex justify-content-end mt-4">
                    {/* Tombol "Previous" */}
                    <Button
                      variant="text"
                      size="small"
                      disabled={userPage === 1}
                      onClick={() => changeUserPage(userPage - 1)}
                      className="mx-1"
                      style={{
                        minWidth: "40px",
                        padding: "2px 8px",
                        color: userPage === 1 ? "#999" : "#0033a0",
                        borderRadius: "4px",
                        fontWeight: userPage === 1 ? "normal" : "bold",
                        cursor: userPage === 1 ? "not-allowed" : "pointer",
                      }}
                    >
                      <GrPrevious />
                    </Button>

                    {/* Tombol angka halaman */}
                    {(() => {
                      const { start, end } = getDisplayedPages(
                        userPage,
                        userTotalPages
                      );
                      const pages = [];

                      if (start > 1) {
                        pages.push(
                          <Button
                            key={1}
                            variant="text"
                            size="small"
                            onClick={() => changeUserPage(1)}
                            className="mx-1"
                            style={{
                              minWidth: "30px",
                              padding: "2px 6px",
                              backgroundColor: "transparent",
                              color: "#000",
                              borderRadius: "4px",
                            }}
                          >
                            1
                          </Button>
                        );

                        if (start > 2) {
                          pages.push(
                            <span
                              key="start-dots"
                              className="mx-1"
                              style={{ color: "#999" }}
                            >
                              ...
                            </span>
                          );
                        }
                      }

                      for (let i = start; i <= end; i++) {
                        const isActive = i === userPage;
                        pages.push(
                          <Button
                            key={i}
                            variant="text"
                            size="small"
                            onClick={() => changeUserPage(i)}
                            className="mx-1"
                            style={{
                              minWidth: "30px",
                              padding: "2px 6px",
                              backgroundColor: isActive
                                ? "#0033a0"
                                : "transparent",
                              color: isActive ? "white" : "#000",
                              borderRadius: "4px",
                              fontWeight: isActive ? "bold" : "normal",
                            }}
                          >
                            {i}
                          </Button>
                        );
                      }

                      if (end < userTotalPages) {
                        if (end < userTotalPages - 1) {
                          pages.push(
                            <span
                              key="end-dots"
                              className="mx-1"
                              style={{ color: "#999" }}
                            >
                              ...
                            </span>
                          );
                        }

                        pages.push(
                          <Button
                            key={userTotalPages}
                            variant="text"
                            size="small"
                            onClick={() => changeUserPage(userTotalPages)}
                            className="mx-1"
                            style={{
                              minWidth: "30px",
                              padding: "2px 6px",
                              backgroundColor: "transparent",
                              color: "#000",
                              borderRadius: "4px",
                            }}
                          >
                            {userTotalPages}
                          </Button>
                        );
                      }

                      return pages;
                    })()}

                    {/* Tombol "Next" */}
                    <Button
                      variant="text"
                      size="small"
                      disabled={userPage === userTotalPages}
                      onClick={() => changeUserPage(userPage + 1)}
                      className="mx-1"
                      style={{
                        minWidth: "40px",
                        padding: "2px 8px",
                        color: userPage === userTotalPages ? "#999" : "#0033a0",
                        borderRadius: "4px",
                        fontWeight:
                          userPage === userTotalPages ? "normal" : "bold",
                        cursor:
                          userPage === userTotalPages
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      <GrNext />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalDesa && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Tambah Desa</h2>
            <form onSubmit={submitDesa}>
              <label>Desa</label>
              <input
                type="text"
                name="desa"
                value={desa}
                onChange={(e) => setDesa(e.target.value)}
                required
              />
              <button type="submit" className="btn">
                Tambah
              </button>
              <button type="button" className="btn" onClick={closeDesa}>
                Batal
              </button>
            </form>
          </div>
        </div>
      )}

      {isModalUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Tambah User</h2>
            <form onSubmit={submitUser}>
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <label>Role</label>
              <select
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Pilih Role</option>
                <option value="admin">Admin</option>
                <option value="daerah">Daerah</option>
                <option value="desa">Desa</option>
                <option value="kelompok">Kelompok</option>
              </select>

              {role === "desa" && (
                <>
                  <label>Desa</label>
                  <select
                    name="id_desa"
                    value={idDesa}
                    onChange={(e) => setIdDesa(e.target.value)}
                    required
                  >
                    <option value="">Pilih Desa</option>
                    {villages.map((village) => (
                      <option key={village.uuid} value={village.uuid}>
                        {village.desa}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {role === "kelompok" && (
                <>
                  <label>Kelompok</label>
                  <select
                    name="id_kelompok"
                    value={idKelompok}
                    onChange={(e) => setIdKelompok(e.target.value)}
                    required
                  >
                    <option value="">Pilih Kelompok</option>
                    {groups.map((group) => (
                      <option key={group.uuid} value={group.uuid}>
                        {group.kelompok}
                      </option>
                    ))}
                  </select>
                </>
              )}

              <label>Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <label>Konfirmasi Password</label>
              <input
                type="password"
                name="confPassword"
                value={confPassword}
                onChange={(e) => setConfPassword(e.target.value)}
                required
              />

              <button type="submit" className="btn">
                Tambah
              </button>
              <button type="button" className="btn" onClick={closeUser}>
                Batal
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
