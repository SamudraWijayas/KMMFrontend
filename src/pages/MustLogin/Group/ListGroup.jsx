import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../../component/Header";
import { Sidebar } from "../../../component/Sidebar/Admin";
import ReactPaginate from "react-paginate";
import Button from "@mui/material/Button";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import useFetchUserData from "../../../hooks/useFetchUserData";
import AddGroupModel from "../../../component/Aksi/addKelompokModels";
import { Helmet } from "react-helmet";

const Group = () => {
  const { userData } = useFetchUserData();
  const usernames = userData?.username;
  const avatar = userData?.avatar;
  const [kelompokData, setKelompokData] = useState([]); // Data kelompok
  const [desaData, setDesaData] = useState([]); // Data desa
  const [search, setSearch] = useState(""); // State untuk pencarian
  const [currentPage, setCurrentPage] = useState(0); // State untuk pagination
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default jumlah item per halaman

  // Ambil data kelompok
  const fetchKelompok = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/kelompok`
      );
      setKelompokData(response.data);
    } catch (error) {
      console.error("Error fetching kelompok data:", error);
    }
  };

  // Ambil data desa
  const fetchDesa = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/desa`);
      setDesaData(response.data);
    } catch (error) {
      console.error("Error fetching desa data:", error);
    }
  };

  // Gabungkan data kelompok dan desa
  const mergedData = kelompokData.map((kelompok) => {
    const desa = desaData.find((desa) => desa.uuid === kelompok.id_desa);
    return {
      ...kelompok,
      desa: desa ? desa.desa : "Desa Tidak Ditemukan",
    };
  });

  const handleAddData = () => {
    fetchKelompok();
  };

  useEffect(() => {
    fetchKelompok();
    fetchDesa();
  }, []);

  // Filter data berdasarkan pencarian
  const filteredData = mergedData.filter((item) =>
    item.kelompok.toLowerCase().includes(search.toLowerCase())
  );

  // Fungsi untuk menangani perubahan halaman
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // Menentukan data yang akan ditampilkan pada halaman saat ini
  const displayData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <>
      <Helmet>
        <title>List Kelompok</title>
        <meta name="description" content="Ini adalah halaman List Kelompok" />
      </Helmet>
      <Header username={usernames} avatar={avatar} />
      <div className="main d-flex">
        <div className="sidebarWrapper">
          <Sidebar />
        </div>
        <div className="content">
          <div className="right-content">
            <div className="right-text">
              <h1>Kelompok</h1>
            </div>
            <div className="card p-4 mb-3">
              <div className="row">
                <div className="d-flex">
                  <div className="search-bar mb-3 mt-3 d-flex justify-content-between align-items-center">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{ width: "70%" }}
                    />
                  </div>
                  <AddGroupModel onAddData={handleAddData} />
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead className="thead-dark">
                    <tr>
                      <th>No</th>
                      <th>Kelompok</th>
                      <th>Nama Desa</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.map((row, index) => (
                      <tr key={row.uuid}>
                        <td>{currentPage * itemsPerPage + index + 1}</td>
                        <td>{row.kelompok}</td>
                        <td>{row.desa}</td>
                        <td>
                          <div className="actions d-flex align-items-center">
                            <Button
                              className="success text-black"
                              color="secondary"
                            >
                              <MdModeEdit />
                            </Button>
                            <Button
                              className="error text-black"
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
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                pageCount={Math.ceil(filteredData.length / itemsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={0}
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

export default Group;
