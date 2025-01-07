import React from "react";
import Frame from "../../../assets/Frame.png";

const DashboardBox = (props) => {
  const colors = props.color || ["#ccc", "#ddd"]; // Warna default jika tidak ada props.color
  const count = props.count || 233; // Teks angka default

  return (
    // <div
    //   className="dashboardbox"
    //   style={{
    //     backgroundImage: `url(${Frame}), linear-gradient(to right, ${colors[0]}, ${colors[1]})`,
    //     backgroundSize: "cover",
    //     backgroundPosition: "center",
    //     backgroundRepeat: "no-repeat",
    //   }}
    // >
    //   <div
    //     style={{
    //       position: "absolute",
    //       top: 0,
    //       left: 0,
    //       width: "100%",
    //       height: "100%",
    //       backgroundImage: `url(${Frame})`,
    //       backgroundSize: "cover",
    //       backgroundPosition: "center",
    //       backgroundRepeat: "no-repeat",
    //       opacity: 0.5, // Atur opacity hanya untuk gambar
    //       zIndex: 1, // Di bawah konten
    //     }}
    //   ></div>
    //   <div className="d-flex w-100 justify-content-between align-items-center">
    //     <div className="col1">
    //       {props.title ? <h4 className="text-white">{props.title}</h4> : ""}
    //       {props.count ? <span className="text-white">{props.count}</span> : ""}
    //       {/* Menggunakan props.count */}
    //     </div>
    //     <div className="ml-auto">
    //       {props.icon ? <span className="icon">{props.icon}</span> : ""}
    //     </div>
    //   </div>
    // </div>
    <div
      className="dashboardbox"
      style={{
        position: "relative",
        background: `linear-gradient(to right, ${colors[0]}, ${colors[1]})`, // Warna gradien
      }}
    >
      {/* Gambar sebagai overlay dengan opacity */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${Frame})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.4, // Atur opacity hanya untuk gambar
          zIndex: 1, // Di bawah konten
        }}
      ></div>

      {/* Konten di atas layer */}
      <div
        className="d-flex w-100 justify-content-between align-items-center"
        style={{ position: "relative", zIndex: 2 }}
      >
        <div className="col1">
          <h4 className="text-white">{props.title}</h4>
          <span className="text-white">{props.count}</span>
        </div>
        <div className="ml-auto">
          {props.icon ? <span className="icon">{props.icon}</span> : ""}
        </div>
      </div>
    </div>
  );
};

export default DashboardBox;
