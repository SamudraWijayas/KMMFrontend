import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { Skeleton } from "antd"; // Import Skeleton dari Ant Design


// Mendaftarkan komponen yang diperlukan untuk grafik Pie
ChartJS.register(ArcElement, Tooltip, Legend);

const StatisticsChart = () => {
  const [generusData, setGenerusData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fungsi untuk mengambil data generus dari API
  const fetchGenerusData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/generus`);
      setTimeout(() => {
        setGenerusData(response.data);
        setLoading(false);
      }, 1000); // Set loading selama 1 detik
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenerusData();
  }, []);

  // Mengelompokkan data berdasarkan jenjang
  const groupedData = {
    "Paud/TK": 0,
    Caberawit: 0,
    "Pra Remaja": 0,
    Remaja: 0,
    "Pra Nikah": 0,
  };

  generusData.forEach((item) => {
    // Cek jenjang dan kelompokkan ke dalam kategori yang sesuai
    if (["Paud", "TK"].includes(item.jenjang)) {
      groupedData["Paud/TK"]++;
    } else if (["1", "2", "3", "4", "5", "6"].includes(item.jenjang)) {
      groupedData["Caberawit"]++;
    } else if (["7", "8", "9"].includes(item.jenjang)) {
      groupedData["Pra Remaja"]++;
    } else if (["10", "11", "12"].includes(item.jenjang)) {
      groupedData["Remaja"]++;
    } else if (item.jenjang === "Pra Nikah") {
      groupedData["Pra Nikah"]++;
    }
  });

  // Data untuk Pie chart
  const chartData = {
    labels: Object.keys(groupedData),
    datasets: [
      {
        label: "Jumlah Generus",
        data: Object.values(groupedData),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)", // Paud/TK
          "rgba(54, 162, 235, 0.6)", // Caberawit 1-6
          "rgba(75, 192, 192, 0.6)", // Caberawit 7-9
          "rgba(255, 206, 86, 0.6)", // Caberawit 10-12
          "rgba(153, 102, 255, 0.6)", // Pra Nikah
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#000", // Mengubah warna label
          textAlign: "left", // Menambahkan rata kiri
          padding: 20, // Menambahkan jarak antara teks
          usePointStyle: true, // Menambahkan titik di samping label
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const dataValue = tooltipItem.raw;
            const totalData = Object.values(groupedData).reduce(
              (total, value) => total + value,
              0
            );
            const percentage = ((dataValue / totalData) * 100).toFixed(1);
            return `${tooltipItem.label}: ${dataValue} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="text-center w-100">
      {loading ? (
        <Skeleton active paragraph={{ rows: 7 }} />
      ) : (
        <>
          <h3 className="text-black">Grafik Generus</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20px",
              width: "100%",
            }}
          >
            <div style={{ width: "300px", height: "300px" }}>
              <Pie data={chartData} options={options} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StatisticsChart;
