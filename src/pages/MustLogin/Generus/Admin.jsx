import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import { MdModeEdit, MdDelete } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { FaFilter, FaFileExport } from "react-icons/fa";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";

import Header from "../../../component/Header";
import { Sidebar } from "../../../component/Sidebar/Admin";
import ReactPaginate from "react-paginate";
import FormControl from "@mui/material/FormControl";
import { Form, InputGroup } from "react-bootstrap";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import axios from "axios";
import useFetchUserData from "../../../hooks/useFetchUserData";
import { message, Tabs } from "antd";
import Modals from "../../../component/Aksi/addModalGenerus";
import EditModal from "../../../component/Aksi/editGenerus";
import ViewGenerus from "../../../component/Aksi/viewGenerus";
import * as XLSX from "xlsx"; // Import library xlsx

const Generus = () => {
  const { userData } = useFetchUserData();
  const usernames = userData?.username;
  const avatar = userData?.avatar;
  const id_desa = userData?.id_desa;
  const [generusData, setGenerusData] = useState([]);
  const [kelompokData, setKelompokData] = useState([]);
  const [desaData, setDesaData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [mergedData, setMergedData] = useState([]);
  const [activeTab, setActiveTab] = useState("0"); // Menggunakan string sebagai key
  const [showAgeFilter, setShowAgeFilter] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]); // State untuk ID yang dipilih
  const [showAddModal, setShowAddModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State untuk sidebar
  const [data, setData] = useState([]); // Data yang akan ditampilkan di tabel
  const [editData, setEditData] = useState(null); // Data yang akan diedit
  const [viewData, setViewData] = useState(null); // Data yang akan diedit
  const [isModalVisible, setIsModalVisible] = useState(false); // Kontrol visibilitas modal

  const handleFilterClick = () => {
    setShowAgeFilter(!showAgeFilter); // Toggle the display of the age filter inputs
  };

  // Menangani klik tombol edit
  const handleEditClick = async (id) => {
    // Fetch data based on id when edit button is clicked
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/generus/${id}`
      );
      setEditData(response.data); // Set the fetched data into the editData state
      setIsModalVisible(true); // Show the modal
    } catch (error) {
      console.error("Error fetching data for edit:", error);
      message.error("Gagal memuat data untuk diedit!");
    }
  };
  // Menangani klik tombol edit
  const handleViewClick = async (id) => {
    // Fetch data based on id when edit button is clicked
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/generus/${id}`
      );
      setViewData(response.data); // Set the fetched data into the editData state
      setIsModalVisible(true); // Show the modal
    } catch (error) {
      console.error("Error fetching data for edit:", error);
      message.error("Gagal memuat data untuk diedit!");
    }
  };

  // Menutup modal
  const handleModalClose = () => {
    setIsModalVisible(false); // Menutup modal
    setEditData(null); // Menghapus data edit
  };
  // Menutup modal
  const handleViewClose = () => {
    setIsModalVisible(false); // Menutup modal
    setViewData(null); // Menghapus data edit
  };

  const handleBackClick = () => {
    setShowAgeFilter(false); // Hide age filter inputs
    setMinAge(""); // Clear Min Age
    setMaxAge(""); // Clear Max Age
  };

  // Fetching data functions
  const fetchGenerus = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/generus`
      );
      const formattedData = response.data.map((item) => {
        const birthdate = new Date(item.tgl_lahir);
        const today = new Date();
        let age = today.getFullYear() - birthdate.getFullYear();
        const monthDifference = today.getMonth() - birthdate.getMonth();

        if (
          monthDifference < 0 ||
          (monthDifference === 0 && today.getDate() < birthdate.getDate())
        ) {
          age--;
        }

        return {
          ...item,
          tgl_lahir: birthdate.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          umur: age,
        };
      });
      setGenerusData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDesa = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/desa`);
      setDesaData(response.data);
    } catch (error) {
      console.error("Error fetching desa data:", error);
    }
  };

  const fetchKelompok = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/kelompok`
      );
      setKelompokData(response.data);
    } catch (error) {
      console.error("Error fetching kelompok data:", error);
    }
  };

  const handleAddData = () => {
    fetchGenerus(); // Memuat ulang data setelah data baru ditambahkan
  };

  useEffect(() => {
    fetchGenerus();
    fetchDesa();
    fetchKelompok();
  }, []);

  // Fungsi untuk memetakan jenjang ke nama
  const mapJenjangq = (jenjang) => {
    if (["1", "2", "3", "4", "5", "6"].includes(jenjang)) {
      return (
        <>
          Caberawit{" "}
          <span style={{ color: "#D91656" }}>( Kelas {jenjang} )</span>
        </>
      );
    } else if (["7", "8", "9"].includes(jenjang)) {
      return (
        <>
          Pra Remaja{" "}
          <span style={{ color: "#D91656" }}>( Kelas {jenjang} )</span>
        </>
      );
    } else if (["10", "11", "12"].includes(jenjang)) {
      return (
        <>
          Remaja <span style={{ color: "#D91656" }}>( Kelas {jenjang} )</span>
        </>
      );
    } else if (jenjang === "Paud") {
      return "Paud"; // Tampilkan "Paud" langsung
    } else if (jenjang === "TK") {
      return "TK"; // Tampilkan "TK" langsung
    } else if (jenjang === "Pra Nikah") {
      return "Pra Nikah";
    }
    return "Jenjang Tidak Diketahui";
  };

  const mapJenjang = (jenjang) => {
    if (["1", "2", "3", "4", "5", "6"].includes(jenjang)) {
      return `Caberawit (Kelas ${jenjang})`;
    } else if (["7", "8", "9"].includes(jenjang)) {
      return `Pra Remaja (Kelas ${jenjang})`;
    } else if (["10", "11", "12"].includes(jenjang)) {
      return `Remaja (Kelas ${jenjang})`;
    } else if (jenjang === "Paud") {
      return "Paud";
    } else if (jenjang === "TK") {
      return "TK";
    } else if (jenjang === "Pra Nikah") {
      return "Pra Nikah";
    }
    return "Jenjang Tidak Diketahui";
  };

  // Merging data from generus, desa, and kelompok
  useEffect(() => {
    if (
      generusData.length > 0 &&
      desaData.length > 0 &&
      kelompokData.length > 0
    ) {
      const merged = generusData.map((generus) => {
        const desa = desaData.find((desa) => desa.uuid === generus.id_desa);
        const kelompok = kelompokData.find(
          (kelompok) => kelompok.uuid === generus.id_kelompok
        );
        return {
          ...generus,
          desa: desa ? desa.desa : "Desa Tidak Ditemukan",
          kelompok: kelompok ? kelompok.kelompok : "Kelompok Tidak Ditemukan",
          jenjang: mapJenjang(generus.jenjang), // Menggunakan fungsi pemetaan
        };
      });
      setMergedData(merged);
    }
  }, [generusData, desaData, kelompokData]);

  // Filter data based on the selected tab and search criteria
  // Filter data based on the selected tab and search criteria
  const filteredData = mergedData.filter((item) => {
    const matchesSearch = Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    );

    const matchesAge =
      (minAge === "" || item.umur >= parseInt(minAge, 10)) &&
      (maxAge === "" || item.umur <= parseInt(maxAge, 10));

    // Filter berdasarkan tab yang dipilih
    let matchesJenjang = true; // Defaultnya semua jenjang ditampilkan

    if (activeTab === "0") {
      matchesJenjang = true; // Menampilkan semua jenjang
    } else if (activeTab === "1") {
      matchesJenjang = item.jenjang === "Paud" || item.jenjang === "TK";
    } else if (activeTab === "2") {
      matchesJenjang = item.jenjang.startsWith("Caberawit"); // Caberawit
    } else if (activeTab === "3") {
      matchesJenjang = item.jenjang.startsWith("Pra Remaja"); // Pra Remaja
    } else if (activeTab === "4") {
      matchesJenjang = item.jenjang.startsWith("Remaja"); // Remaja
    } else if (activeTab === "5") {
      matchesJenjang = item.jenjang === "Pra Nikah";
    }

    return matchesSearch && matchesAge && matchesJenjang;
  });

  // Handling page change
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleEntriesChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(0); // Reset ke halaman pertama saat tab berubah
  };

  const displayData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleSelect = (id) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === mergedData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(mergedData.map((item) => item.id)); // Asumsikan "id" adalah unik
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/generus/${id}`);
      message.success("Data Berhasil Dihapus!");
      fetchGenerus(); // Refresh data setelah penghapusan
    } catch (error) {
      console.error("Error deleting data:", error);
      message.error("Gagal menghapus data!");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) =>
          axios.delete(`${import.meta.env.VITE_API_URL}/api/generus/${id}`)
        )
      );
      message.success("Data Berhasil Dihapus!");
      setSelectedIds([]); // Reset pilihan setelah penghapusan
      fetchGenerus(); // Refresh data
    } catch (error) {
      console.error("Error deleting data:", error);
      message.error("Gagal menghapus data!");
    }
  };

  const handleExport = () => {
    // Data untuk diekspor
    const dataToExport = filteredData.map((item, index) => ({
      No: index + 1,
      Nama: item.nama,
      Kelompok: item.kelompok,
      Desa: item.desa,
      Jenjang: item.jenjang,
      "Tgl Lahir": item.tgl_lahir,
      Umur: item.umur,
      "Jenis Kelamin": item.jenis_kelamin,
      "Gol. Darah": item.gol_darah,
    }));

    // Buat worksheet dan workbook
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Generus");

    // Simpan file
    XLSX.writeFile(workbook, "Data_Generus.xlsx");
  };

  return (
    <>
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
            id_desa={id_desa}
          />
        </div>
        <div className={`content ${sidebarOpen ? "open" : "closed"}`}>
          <div className="right-content">
            <div className="right-text">
              <h1>Data Generus</h1>
            </div>
            <div className="card p-4 mb-3">
              <div className="container">
                <Tabs
                  activeKey={activeTab}
                  onChange={handleTabChange}
                  className="custom-tabs"
                  items={[
                    { label: "All", key: "0" },
                    { label: "PAUD/TK", key: "1" },
                    { label: "Caberawit", key: "2" },
                    { label: "Pra Remaja", key: "3" },
                    { label: "Remaja", key: "4" },
                    { label: "Pra Nikah", key: "5" },
                  ]}
                />
              </div>

              <div className="tab-content mt-4">
                <div className="tab-pane fade show active">
                  <div className="row">
                    {/*  */}
                    <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap table-fitur">
                      <div className="d-flex align-items-center mb-2 mb-md-0 kiri">
                        <Box sx={{ minWidth: 120 }}>
                          <FormControl
                            variant="standard"
                            sx={{ m: 1, minWidth: 120 }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Show Entries
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={itemsPerPage}
                              onChange={handleEntriesChange}
                              style={{ width: "120px" }}
                            >
                              <MenuItem value={5}>5</MenuItem>
                              <MenuItem value={10}>10</MenuItem>
                              <MenuItem value={20}>20</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                      </div>
                      <div
                        className={`d-flex align-items-center justify-content-end flex-wrap kanan ${
                          showAgeFilter ? "filter-active" : "filter-inactive"
                        }`}
                      >
                        <InputGroup className="searchInput me-2 mb-2 mb-md-0">
                          <Form.Control
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                          />
                        </InputGroup>

                        {/* Filter Age Section with Transition */}
                        {showAgeFilter && (
                          <div className="filter-section d-flex align-items-center justify-content-end minmax">
                            <InputGroup className="me-2 mb-2 mb-md-0">
                              <Form.Control
                                type="number"
                                placeholder="Min Age"
                                value={minAge}
                                onChange={(e) => setMinAge(e.target.value)}
                                style={{ width: "120px" }}
                              />
                            </InputGroup>
                            <InputGroup className="me-2 mb-2 mb-md-0">
                              <Form.Control
                                type="number"
                                placeholder="Max Age"
                                value={maxAge}
                                onChange={(e) => setMaxAge(e.target.value)}
                                style={{ width: "120px" }}
                              />
                            </InputGroup>
                            <Button
                              className="btn btn-light me-2 delete-btn"
                              onClick={handleBackClick}
                            >
                              Back
                            </Button>
                          </div>
                        )}

                        {/* Other Buttons with Conditional Rendering */}
                        {!showAgeFilter && (
                          <div className="action-buttons d-flex align-items-center flex-wrap but">
                            <Button
                              className="btn btn-light me-2 mb-2 mb-md-0 delete-btn"
                              disabled={selectedIds.length === 0}
                              onClick={handleBulkDelete}
                              style={{
                                display:
                                  selectedIds.length === 0
                                    ? "none"
                                    : "inline-block",
                              }}
                            >
                              Delete Selected
                            </Button>
                            <Button
                              className="btn btn-light me-2 mb-2 mb-md-0 filter-btn"
                              onClick={handleFilterClick}
                            >
                              <FaFilter className="me-2" />
                              Age
                            </Button>

                            <Button
                              className="btn btn-light me-2 mb-2 mb-md-0 export-btn"
                              onClick={handleExport}
                            >
                              <FaFileExport className="me-2" />
                              Export
                            </Button>
                            <Modals onAddData={handleAddData} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="table-responsive generus">
                      <table className="table table-stripeda">
                        <thead className="thead-dark">
                          <tr>
                            <th className="check">
                              <Form.Check
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={
                                  selectedIds.length === generusData.length &&
                                  generusData.length > 0
                                }
                              />
                            </th>
                            <th>No</th>
                            <th>Nama</th>
                            <th>Kelompok</th>
                            <th>Desa</th>
                            <th>Jenjang</th>
                            <th>Tgl Lahir</th>
                            <th>Umur</th>
                            <th>Mahasiswa</th>
                            <th>Jenis Kelamin</th>
                            <th>Gol. Darah</th>
                            <th>Nama Ortu</th>
                            <th>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayData.map((item, index) => (
                            <tr key={item.id}>
                              <td>
                                <Form.Check
                                  type="checkbox"
                                  onChange={() => handleSelect(item.id)}
                                  checked={selectedIds.includes(item.id)}
                                />
                              </td>
                              <td>{currentPage * itemsPerPage + index + 1}</td>
                              <td>
                                <div className="d-flex name-box">
                                  <div className="img-in-table me-3">
                                    <div className="img card">
                                      <img
                                        // className="rounded-circle"
                                        // height="30"
                                        src={
                                          item.gambar
                                            ? `${import.meta.env.VITE_API_URL}${
                                                item.gambar
                                              }`
                                            : `${
                                                import.meta.env.VITE_API_URL
                                              }/uploads/profil.png`
                                        }
                                        // width="30"
                                      />
                                    </div>
                                  </div>

                                  {item.nama}
                                </div>
                              </td>
                              <td>{item.kelompok}</td>
                              <td>{item.desa}</td>
                              <td>{item.jenjang}</td>
                              <td>{item.tgl_lahir}</td>
                              <td>{item.umur}</td>
                              <td>
                                <span
                                  className={
                                    !item.mahasiswa
                                      ? "" // Jika datanya kosong, className kosong
                                      : item.mahasiswa === "Active"
                                      ? "badge-active" // Jika "active", className "badge-social"
                                      : "badge-nonactive" // Jika "non-active", className "badge-danger"
                                  }
                                >
                                  {item.mahasiswa}
                                </span>
                              </td>

                              <td>{item.jenis_kelamin}</td>
                              <td>{item.gol_darah}</td>
                              <td>{item.nama_ortu}</td>
                              <td>
                                <div className="actions d-flex align-items-center">
                                  <Button
                                    className="secondary text-black"
                                    color="secondary"
                                    onClick={() => handleViewClick(item.id)}
                                  >
                                    <FaEye />
                                  </Button>
                                  <Button
                                    className="success text-black"
                                    color="secondary"
                                    onClick={() => handleEditClick(item.id)}
                                  >
                                    <MdModeEdit />
                                  </Button>
                                  <Button
                                    className="error text-black"
                                    color="secondary"
                                    onClick={() => handleDelete(item.id)}
                                  >
                                    <MdDelete />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          <EditModal
                            show={isModalVisible}
                            editData={editData} // Ensure that editData contains the correct data
                            onClose={handleModalClose}
                            onUpdate={fetchGenerus}
                          />
                          <ViewGenerus
                            show={isModalVisible}
                            editData={viewData} // Ensure that editData contains the correct data
                            onClose={handleViewClose}
                            onUpdate={fetchGenerus}
                          />
                        </tbody>
                      </table>
                    </div>
                    <div className="d-flex flex-wrap justify-content-between align-items-center">
                      <div className="mb-2 text-muted">
                        Showing {currentPage * itemsPerPage + 1} to{" "}
                        {Math.min(
                          (currentPage + 1) * itemsPerPage,
                          filteredData.length
                        )}{" "}
                        of {filteredData.length} entries
                      </div>
                      <div>
                        <ReactPaginate
                          pageCount={Math.ceil(
                            filteredData.length / itemsPerPage
                          )}
                          onPageChange={handlePageClick}
                          containerClassName="pagination mb-0"
                          activeClassName="active"
                          previousLabel={<GrPrevious />}
                          nextLabel={<GrNext />}
                          breakLabel={"..."}
                          marginPagesDisplayed={1} // Always show the first and last page buttons
                          pageRangeDisplayed={3} // Show only 3 page buttons at a time
                          pageClassName={"page-item"}
                          pageLinkClassName={"page-link"}
                          previousClassName={"page-item"}
                          previousLinkClassName={"page-link"}
                          nextClassName={"page-item"}
                          nextLinkClassName={"page-link"}
                          breakClassName={"page-item"}
                          breakLinkClassName={"page-link"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Generus;
