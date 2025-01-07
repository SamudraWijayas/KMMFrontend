import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import ikon yang diperlukan

const Login = () => {
  const [error, setError] = useState(null); // Menangani error
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // Toggle password visibility

  const handleLogin = (e) => {
    e.preventDefault();
    // Proses login, misalnya validasi username dan password
    // setError("Username atau password salah"); // Contoh error handling
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      {/* Login Container */}
      <div className="row border rounded-5 p-3 bg-white shadow box-area">
        {/* Left Box */}
        <div
          className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box"
          style={{ background: "#0385ff" }}
        >
          <div className="featured-image mb-3">
            <img
              src={logo}
              className="img-fluid"
              style={{ width: "250px" }}
              alt="Logo"
            />
          </div>
          <p
            className="text-white fs-2"
            style={{
              fontFamily: "'Courier New', Courier, monospace",
              fontWeight: 600,
            }}
          >
            KMM Bandar Lampung
          </p>
        </div>
        {/* Right Box */}
        <div className="col-md-6 right-box">
          <div className="align-items-center">
            <div className="header-text mb-3">
              <h2>Login</h2>
              <p>Jika anda ingin masuk harap login terlebih dahulu</p>
            </div>
            {/* Alert */}
            {error && (
              <div
                className="alert alert-danger alert-dismissible fade show mb-4"
                role="alert"
              >
                {error}
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                ></button>
              </div>
            )}
            <form onSubmit={handleLogin}>
              <div className="input-group mb-3">
                <input
                  type="text"
                  name="username"
                  className="form-control form-control-lg bg-light fs-6"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="input-group mb-3">
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  id="password"
                  className="form-control form-control-lg bg-light fs-6"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="input-group-text toggle-password"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  style={{ cursor: "pointer" }}
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />} {/* Ganti dengan komponen React */}
                </span>
              </div>
              <div className="input-group mb-3">
                <button
                  type="submit"
                  name="login"
                  className="btn btn-lg btn-primary w-100 fs-6"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
