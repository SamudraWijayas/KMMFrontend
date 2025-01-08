import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import Background from "../../../assets/back.jpg";
import "../../../css/profile.css";
import axios from "axios";
import { Button, Form, Input, Upload, message } from "antd";
import { IoMdCloudUpload } from "react-icons/io";
import Cookies from "js-cookie";
import useFetchUserData from "../../../hooks/useFetchUserData"; // Pastikan ini mengembalikan cache atau state yang sudah diambil
import EditPassword from "../../../component/Aksi/editPassword";
import { useAuth } from "../../../context";
import Skeleton from "@mui/material/Skeleton";

const Profile = () => {
  const { userData, loading } = useFetchUserData(); // Pastikan data hanya diambil sekali
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleGoToBeranda = () => {
    navigate("/dashboard"); // Arahkan ke halaman beranda
  };

  const handleLogout = async () => {
    await logout(); // Panggil fungsi logout dari context
    navigate("/login"); // Redirect ke halaman login
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (userData) {
      setUsername(userData.username);
      setAvatarPreview(
        userData.avatar
          ? `${import.meta.env.VITE_API_URL}${userData.avatar}`
          : `${import.meta.env.VITE_API_URL}/uploads/avatar.png`
      );
    }
  }, [userData]); // Memastikan hanya update ketika `userData` berubah

  const handleAvatarChange = (file) => {
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      message.error("Hanya file JPG atau PNG yang diperbolehkan.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
    setAvatar(file);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append("username", username);
    if (avatar) {
      formData.append("avatar", avatar); // Pastikan 'avatar' adalah nama field yang sesuai di backend
    }

    try {
      const accessToken = Cookies.get("accessToken");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      message.success(response.data.msg);
    } catch (error) {
      console.error("Error during update:", error);
      message.error(error.response?.data?.msg || "Update gagal");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="profile-container">
      <div
        className="profile-header d-flex flex-column flex-md-row align-items-center justify-content-between"
        style={{ backgroundImage: `url(${Background})` }}
      >
        <div className="d-flex align-items-center flex-column flex-md-row">
          <div className="header-img text-center d-flex align-items-center mb-3">
            <img
              src={logo}
              alt="Logo"
              className="img-fluid"
              style={{ maxWidth: 70 }}
            />
          </div>
          <div className="header-profile text-md-left">
            <h3>Muda - Mudi Bandar Lampung</h3>
            <p>M2BL</p>
          </div>
        </div>
        <div className="right mt-3 mt-md-0">
          <Button className="btn-profil me-2" onClick={handleGoToBeranda}>
            Beranda
          </Button>
          <Button
            className="btn-profil me-2"
            onClick={handleSubmit}
            loading={submitting}
          >
            Simpan
          </Button>
          <Button
            className="btn-profil"
            onClick={() => {
              handleLogout(); // Logout dan redirect
            }}
          >
            Keluar
          </Button>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-sm-12 col-md-8">
          <Form>
            <div className="form-group mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              {loading ? (
                <Skeleton animation="wave" height={40} />
              ) : (
                <Input
                  type="text"
                  value={username}
                  id="username"
                  name="username"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
              )}
            </div>
          </Form>
          <Button type="primary" onClick={showModal}>
            Ubah Password
          </Button>
          <EditPassword
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        </div>
        <div className="col-sm-12 col-md-4 text-center mt-3 mt-md-0">
          {loading ? (
            <>
              {Array.from(new Array(7)).map((_, index) => (
                <Skeleton key={index} variant="text" height={30} />
              ))}
            </>
          ) : (
            <Form.Item>
              <img
                src={avatarPreview}
                alt="Uploaded"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  marginBottom: "20px",
                }}
              />
              <Upload
                beforeUpload={(file) => {
                  handleAvatarChange(file);
                  return false; // Prevent automatic upload
                }}
                accept=".jpg,.jpeg,.png"
              >
                <Button icon={<IoMdCloudUpload />}>Ganti Foto</Button>
              </Upload>
            </Form.Item>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
