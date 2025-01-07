import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { Skeleton } from "antd"; // Import Skeleton dari Ant Design
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Registrasi elemen Chart.js untuk Line Chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LineVillage = ({ id_desa }) => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    if (!id_desa) return;

    const fetchData = async () => {
      try {
        const kelompokResponse = await axios.get(
          `http://localhost:5000/kelompok/desa/${id_desa}`
        );

        const generusResponse = await axios.get(
          "http://localhost:5000/generus"
        );

        const kelompokData = kelompokResponse.data;
        const generusData = generusResponse.data;

        const groupedData = kelompokData.map((kelompok) => {
          const generusByKelompok = generusData.filter(
            (generus) => generus.id_kelompok === kelompok.uuid
          );

          return {
            kelompok: kelompok.kelompok,
            "Paud/TK": generusByKelompok.filter(
              (g) => g.jenjang === "Paud" || g.jenjang === "TK"
            ).length,
            Caberawit: generusByKelompok.filter((g) =>
              ["1", "2", "3", "4", "5", "6"].includes(g.jenjang)
            ).length,
            "Pra Remaja": generusByKelompok.filter((g) =>
              ["7", "8", "9"].includes(g.jenjang)
            ).length,
            Remaja: generusByKelompok.filter((g) =>
              ["10", "11", "12"].includes(g.jenjang)
            ).length,
            "Pra Nikah": generusByKelompok.filter(
              (g) => g.jenjang === "Pra Nikah"
            ).length,
          };
        });

        const labels = groupedData.map((item) => item.kelompok);

        const jenjangCategories = [
          "Paud/TK",
          "Caberawit",
          "Pra Remaja",
          "Remaja",
          "Pra Nikah",
        ];

        const datasets = jenjangCategories.map((jenjang, index) => ({
          label: jenjang,
          data: groupedData.map((item) => item[jenjang]),
          borderColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ][index],
          backgroundColor: [
            "rgba(255, 99, 132, 0.1)",
            "rgba(54, 162, 235, 0.1)",
            "rgba(255, 206, 86, 0.1)",
            "rgba(75, 192, 192, 0.1)",
            "rgba(153, 102, 255, 0.1)",
          ][index],
          fill: true,
          tension: 0.3,
        }));

        setChartData({ labels, datasets });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [id_desa]);

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: isMobile ? 10 : 12, // Ukuran font kecil di layar kecil
          },
        },
      },
      x: {
        ticks: {
          display: !isMobile, // Hilangkan teks sumbu X jika isMobile true
          autoSkip: false,
          maxRotation: 45,
          minRotation: 0,
          font: {
            size: isMobile ? 0 : 12, // Hilangkan ukuran font sepenuhnya
          },
        },
      },
    },
  };

  return (
    <div
      className="line-chart"
      style={{ width: "100%", paddingLeft: "10px", boxSizing: "border-box" }}
    >
      {loading ? (
        // Skeleton Loader saat data masih dimuat
        <Skeleton active paragraph={{ rows: 7 }} />
      ) : (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
};

export default LineVillage;
