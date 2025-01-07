import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600); // State to track screen size

  useEffect(() => {
    if (!id_desa) return; // Cek jika id_desa belum ada, keluar dari useEffect

    const fetchData = async () => {
      try {
        // Ambil data kelompok dan generus dari API
        const kelompokResponse = await axios.get(
          `http://localhost:5000/kelompok/desa/${id_desa}`
        );

        const generusResponse = await axios.get(
          "http://localhost:5000/generus"
        );

        const kelompokData = kelompokResponse.data; // Data kelompok
        const generusData = generusResponse.data; // Data generus

        // Kelompokkan generus berdasarkan kelompok dan jenjang
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
            ).length, // Menggunakan includes untuk memeriksa nilai jenjang
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

        // Label kelompok
        const labels = groupedData.map((item) => item.kelompok);

        // Data untuk setiap jenjang
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
          pointBackgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ][index],
          pointBorderColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ][index],
          pointRadius: 5, // Ukuran titik
          pointHoverRadius: 8, // Ukuran titik saat di-hover
          fill: true, // Mengisi area di bawah garis
          tension: 0.3, // Kelenturan garis
        }));

        // Set data chart
        setChartData({
          labels,
          datasets,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // Event listener to update `isMobile` state on window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [id_desa]);

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        // title: { display: true, text: "Jumlah Generus" },
        grid: {
          display: false, // Menonaktifkan garis horizontal (y-axis grid)
        },
      },
      x: {
        title: {
          display: true,
          // text: "Kelompok",
        },
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 0,
          font: {
            size: 10, // Mengatur ukuran font pada sumbu X
          },
        },
        grid: {
          display: false, // Menonaktifkan garis vertikal (x-axis grid)
        },
      },
    },
    // Dynamically hide dataset labels when screen is small
    datasets: {
      labels: isMobile ? [] : undefined, // Hide labels on small screens
    },
  };

  return (
    <div
      className="lines"
      style={{
        width: "100%",
        paddingLeft: "10px",
        boxSizing: "border-box",
        alignItems: "center",
      }}
    >
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading data...</p>
      ) : (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
};

export default LineVillage;
