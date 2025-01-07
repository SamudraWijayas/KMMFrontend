import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Header from "../../../component/Header";
import { Sidebar } from "../../../component/Sidebar/Admin";
import ReactPaginate from "react-paginate";
import { FormControl } from "react-bootstrap";
import Button from "@mui/material/Button";
import profil from "../../../assets/profil.jpg";

import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormmControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import useFetchUserData from "../../../hooks/useFetchUserData";

const Male = () => {
  const { userData } = useFetchUserData();
  const usernames = userData?.username;
  const avatar = userData?.avatar;
  
  const [search, setSearch] = useState(""); // State untuk pencarian
  const [currentPage, setCurrentPage] = useState(0); // State untuk pagination
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default jumlah item per halaman
  const [minAge, setMinAge] = useState(""); // State untuk umur minimal
  const [maxAge, setMaxAge] = useState(""); // State untuk umur maksimal

  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  // Contoh data tabel
  const data = [
    {
      id: 1,
      name: "John Doe",
      group: "Kelompok A",
      village: "Desa X",
      birthdate: "01/01/2000",
      age: 24,
      education1: "SD",
      education2: "SMP",
      education3: "SMA",
    },
    {
      id: 2,
      name: "Jane Smith",
      group: "Kelompok B",
      village: "Desa Y",
      birthdate: "02/02/1995",
      age: 29,
      education1: "SD",
      education2: "SMP",
      education3: "SMA",
    },
    {
      id: 3,
      name: "Alice Brown",
      group: "Kelompok C",
      village: "Desa Z",
      birthdate: "03/03/1990",
      age: 34,
      education1: "SD",
      education2: "SMP",
      education3: "SMA",
    },
    {
      id: 4,
      name: "Bob Johnson",
      group: "Kelompok D",
      village: "Desa W",
      birthdate: "04/04/1985",
      age: 39,
      education1: "SD",
      education2: "SMP",
      education3: "SMA",
    },
    {
      id: 5,
      name: "Charlie White",
      group: "Kelompok E",
      village: "Desa V",
      birthdate: "05/05/1980",
      age: 44,
      education1: "SD",
      education2: "SMP",
      education3: "SMA",
    },
    {
      id: 6,
      name: "David Green",
      group: "Kelompok F",
      village: "Desa U",
      birthdate: "06/06/1975",
      age: 49,
      education1: "SD",
      education2: "SMP",
      education3: "SMA",
    },
    {
      id: 7,
      name: "Emma Black",
      group: "Kelompok G",
      village: "Desa T",
      birthdate: "07/07/1970",
      age: 54,
      education1: "SD",
      education2: "SMP",
      education3: "SMA",
    },
    // Tambahkan data lainnya jika diperlukan
  ];

  // Filter data berdasarkan pencarian
  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.group.toLowerCase().includes(search.toLowerCase()) ||
      item.village.toLowerCase().includes(search.toLowerCase());

    const matchesAge =
      (minAge === "" || item.age >= parseInt(minAge, 10)) &&
      (maxAge === "" || item.age <= parseInt(maxAge, 10));

    return matchesSearch && matchesAge;
  });

  // Fungsi untuk menangani perubahan halaman
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // Fungsi untuk menangani perubahan jumlah entri per halaman
  const handleEntriesChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0); // Reset halaman ke 1 setiap kali jumlah entri berubah
  };

  // Menentukan data yang akan ditampilkan pada halaman saat ini
  const displayData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  return (
    <>
      <Header username={usernames} avatar={avatar} />
      <div className="main d-flex">
        <div className="sidebarWrapper">
          <Sidebar />
        </div>
        <div className="content">
          <div className="right-content">
            <div className="right-text">
              <h1>Laki-Laki</h1>
            </div>
            <div className="card p-4 mb-3">
              <div className="row">
                <div className="col-md">
                  <label htmlFor="minAge">Min Umur</label>
                  <FormControl
                    type="number"
                    id="minAge"
                    placeholder="Min Age"
                    className="form-control w-100"
                    value={minAge}
                    onChange={(e) => setMinAge(e.target.value)}
                    style={{ width: "120px" }}
                  />
                </div>
                <div className="col-md">
                  <label htmlFor="maxAge">Max Umur</label>
                  <FormControl
                    type="number"
                    id="maxAge"
                    className="form-control w-100"
                    placeholder="Max Age"
                    value={maxAge}
                    onChange={(e) => setMaxAge(e.target.value)}
                    style={{ width: "120px" }}
                  />
                </div>
              </div>
              <div className="row">
                <div className="search-bar mb-3 mt-3 d-flex justify-content-between align-items-center">
                  <Box sx={{ minWidth: 120 }}>
                    <FormmControl
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
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={15}>15</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                      </Select>
                    </FormmControl>
                  </Box>
                  <FormControl
                    className="inputsearch"
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: "70%" }}
                  />
                </div>
              </div>
              <div className="table-responsive">
                <div className="table">
                  <table className="thead-dark w-100">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Nama</th>
                        <th>Kelompok</th>
                        <th>Desa</th>
                        <th>Jenjang</th>
                        <th>Tgl Lahir</th>
                        <th>Umur</th>
                        <th>Jenis Kelamin</th>
                        <th>Gol. Darah</th>
                        <th>Nama Ortu</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayData.map((row, index) => (
                        <tr key={row.id}>
                          <td>{currentPage * itemsPerPage + index + 1}</td>
                          <td>
                            <img className="gambar" src={profil} />
                            {row.name}
                          </td>
                          <td>{row.group}</td>
                          <td>{row.village}</td>
                          <td>{row.birthdate}</td>
                          <td>{row.age}</td>
                          <td>{row.education1}</td>
                          <td>{row.education2}</td>
                          <td>{row.education3}</td>
                          <td>{row.education3}</td>
                          <td>
                            <div className="actions d-flex align-items-center">
                              <Button
                                className="secondary text-black"
                                color="secondary"
                              >
                                <FaEye />
                              </Button>
                              <Button
                                className="secondary text-black"
                                color="secondary"
                              >
                                <MdModeEdit />
                              </Button>
                              <Button
                                className="secondary text-black"
                                color="secondary"
                              >
                                <MdDelete />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                pageCount={Math.ceil(filteredData.length / itemsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                activeClassName={"active"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Male;
