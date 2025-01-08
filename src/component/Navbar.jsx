import React from "react";
import "./../css/main.css";
import logo from "../assets/logo.png";
import { Button } from "antd";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login"); // Navigate to login page
  };

  return (
    <>
      <header
        id="header"
        className="header d-flex align-items-center fixed-top"
      >
        <div className="header-container container-fluid container-xl position-relative d-flex align-items-center justify-content-between">
          <Link
            to="/"
            className="logo d-flex align-items-center me-auto me-xl-0"
          >
            <img
              src={logo}
              alt="Logo"
              className="img-fluid"
              style={{ maxWidth: "40px" }}
            />
            <h1 className="sitename">KMM Balam</h1>
          </Link>

          <nav id="navmenu" className="navmenu">
            <ul>
              <li>
                <Link to="#hero" className="active">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/statistik">Statistik</Link>
              </li>
              {/* <li className="dropdown">
                <Link to="#">
                  <span>Dropdown</span>
                  <i className="bi bi-chevron-down toggle-dropdown"></i>
                </Link>
                <ul>
                  <li>
                    <Link to="#">Dropdown 1</Link>
                  </li>
                  <li className="dropdown">
                    <Link to="#">
                      <span>Deep Dropdown</span>
                      <i className="bi bi-chevron-down toggle-dropdown"></i>
                    </Link>
                    <ul>
                      <li>
                        <Link to="#">Deep Dropdown 1</Link>
                      </li>
                      <li>
                        <Link to="#">Deep Dropdown 2</Link>
                      </li>
                      <li>
                        <Link to="#">Deep Dropdown 3</Link>
                      </li>
                      <li>
                        <Link to="#">Deep Dropdown 4</Link>
                      </li>
                      <li>
                        <Link to="#">Deep Dropdown 5</Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link to="#">Dropdown 2</Link>
                  </li>
                  <li>
                    <Link to="#">Dropdown 3</Link>
                  </li>
                  <li>
                    <Link to="#">Dropdown 4</Link>
                  </li>
                </ul>
              </li> */}
            </ul>
          </nav>

          <Button
            className="btn-getstarted"
            onClick={handleLogin} // Trigger login action
          >
            Login
          </Button>
        </div>
      </header>
    </>
  );
};

export default Navbar;
