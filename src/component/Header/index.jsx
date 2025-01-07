import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Tambahkan useNavigate
import logo from "../../assets/logo.png";
import profil from "../../assets/profil.jpg";
import Button from "@mui/material/Button";
import { RiMenu2Line } from "react-icons/ri";
import { FaRegLightbulb } from "react-icons/fa";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useAuth } from "../../context";

const Header = ({ username, avatar, sidebarOpen, setSidebarOpen }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { logout } = useAuth();
  const navigate = useNavigate(); // Inisialisasi navigate

  const handleGoToProfile = () => {
    handleClose(); // Tutup menu
    navigate("/profile"); // Arahkan ke halaman profil
  };

  const handleLogout = async () => {
    await logout(); // Panggil fungsi logout dari context
    navigate("/login"); // Redirect ke halaman login
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Toggle Sidebar state
  };

  return (
    <>
      <header className="d-flex align-items-center py-2">
        <div className="container-fluid">
          <div className="row d-flex align-items-center justify-content-between">
            {/* Logo */}
            <div className="col-6 col-sm-3 d-flex align-items-center">
              <Link
                to={"/dashboard"}
                className="d-flex align-items-center logo"
              >
                <img
                  src={logo}
                  alt="Logo"
                  className="img-fluid"
                  style={{ maxWidth: "40px" }}
                />
                <span className="ms-2 header-text">KMM Bandar Lampung</span>
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="col-6 col-sm-6 d-flex align-items-center justify-content-end">
              <Button className="round me-3" onClick={toggleSidebar}>
                <RiMenu2Line />
              </Button>
              <Button className="round me-3">
                <FaRegLightbulb />
              </Button>

              {/* <div className="d-none d-sm-flex align-items-center">
                <Button className="round me-3">
                  <IoMdNotificationsOutline />
                </Button>
              </div> */}

              {/* Profile Button */}
              <Button
                className="myprof d-flex align-items-center"
                onClick={handleClick}
              >
                <div className="userimg">
                  <span className="round">
                    <img
                      src={
                        avatar
                          ? `${import.meta.env.VITE_API_URL}${avatar}`
                          : `${import.meta.env.VITE_API_URL}/uploads/avatar.png`
                      }
                      alt="Profile"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                      }}
                    />
                  </span>
                </div>

                <div className="profinfo px-2 d-none d-sm-block">
                  <h4 className="m-0">{username}</h4>
                </div>
              </Button>

              {/* Dropdown Menu */}
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={handleGoToProfile}>
                  <ListItemIcon>
                    <PersonAdd fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    handleClose();
                    handleLogout(); // Logout dan redirect
                  }}
                >
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
