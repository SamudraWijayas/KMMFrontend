import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f8f9fa",
        textAlign: "center",
        color: "#333",
      }}
    >
      <h1 style={{ fontSize: "6rem", marginBottom: "1rem" }}>404</h1>
      <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        Halaman Tidak Ditemukan
      </h2>
      <p style={{ marginBottom: "1.5rem" }}>
        Maaf, halaman yang Anda cari belum tersedia atau tidak ditemukan.
      </p>
      <Link
        to="/"
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#007bff",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "0.25rem",
        }}
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default ErrorPage;
