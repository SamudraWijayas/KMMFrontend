import React from "react";
import "../../css/loading.css";

const LoadingComponent = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Memuat data, harap tunggu...</p>
    </div>
  );
};

export default LoadingComponent;
