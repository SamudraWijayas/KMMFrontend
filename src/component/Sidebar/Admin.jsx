import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import { MdDashboard } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa";
import { PiDropSimpleFill } from "react-icons/pi";
import { PiGenderFemale } from "react-icons/pi";
import { TbGenderMale } from "react-icons/tb";
import { FaLayerGroup } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import Frame from "../../assets/Frame.png";

export const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(null);
  const location = useLocation();

  const isOpenSubmenu = (tabIndex) => {
    setActiveTab(activeTab === tabIndex ? null : tabIndex);
  };

  // Update activeTab based on the current location (URL)
  useEffect(() => {
    if (location.pathname === "/male" || location.pathname === "/female") {
      setActiveTab(1); // Submenu "Jenis Kelamin" aktif
    } else {
      setActiveTab(null); // Jika tidak di halaman jenis kelamin, set ke null
    }
  }, [location]);

  return (
    <>
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
            zIndex: -1,
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

          {/* Jenis Kelamin Menu */}
          <li className={activeTab === 1 ? "active" : ""}>
            <Button
              className={`w-100 ${activeTab === 1 ? "active" : ""}`}
              onClick={() => isOpenSubmenu(1)}
            >
              <span className="icon">
                <PiDropSimpleFill />
              </span>
              Jenis Kelamin
              <span className={`arrow ${activeTab === 1 ? "rotate" : ""}`}>
                <FaAngleRight />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${
                activeTab === 1 ? "expanded" : "collapsed"
              }`}
            >
              <div className="submenu">
                <ul>
                  <li
                    className={
                      location.pathname === "/male" ? "active-item" : ""
                    }
                  >
                    <Link to="/male">
                      <TbGenderMale />
                      Laki - Laki
                    </Link>
                  </li>
                  <li
                    className={
                      location.pathname === "/female" ? "active-item" : ""
                    }
                  >
                    <Link to="/female">
                      <PiGenderFemale />
                      Perempuan
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </li>

          <li
            className={location.pathname === "/listgroup" ? "active-item" : ""}
          >
            <Link to="/listgroup">
              <Button className="w-100">
                <span className="icon">
                  <FaLayerGroup />
                </span>
                Kelompok
              </Button>
            </Link>
          </li>
          <li className={location.pathname === "/generus" ? "active-item" : ""}>
            <Link to="/generus">
              <Button className="w-100">
                <span className="icon">
                  <FaUserGroup />
                </span>
                Generus
              </Button>
            </Link>
          </li>
          <li
            className={location.pathname === "/mahasiswa" ? "active-item" : ""}
          >
            <Link to="/mahasiswa">
              <Button className="w-100">
                <span className="icon">
                  <FaUserGroup />
                </span>
                Mahasiswa
              </Button>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};
