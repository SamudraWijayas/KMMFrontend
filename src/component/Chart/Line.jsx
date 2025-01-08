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

const StatisticsLine = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const desaResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/desa`);
        const desaData = desaResponse.data;

        const generusResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/generus`
        );
        const generusData = generusResponse.data;

        const groupedData = desaData.map((desa) => {
          const desaGenerus = generusData.filter(
            (generus) => generus.id_desa === desa.uuid
          );

          const jenjangCounts = {
            Paud: 0,
            Caberawit: 0,
            "Pra Remaja": 0,
            Remaja: 0,
            "Pra Nikah": 0,
          };

          desaGenerus.forEach((generus) => {
            if (["Paud", "TK"].includes(generus.jenjang)) jenjangCounts.Paud++;
            if (["1", "2", "3", "4", "5", "6"].includes(generus.jenjang))
              jenjangCounts.Caberawit++;
            if (["7", "8", "9"].includes(generus.jenjang))
              jenjangCounts["Pra Remaja"]++;
            if (["10", "11", "12"].includes(generus.jenjang))
              jenjangCounts.Remaja++;
            if (generus.jenjang === "Pra Nikah") jenjangCounts["Pra Nikah"]++;
          });

          return {
            desa: desa.desa,
            ...jenjangCounts,
          };
        });

        const labels = groupedData.map((item) => item.desa);
        const jenjangCategories = [
          "Paud",
          "Caberawit",
          "Pra Remaja",
          "Remaja",
          "Pra Nikah",
        ];

        const datasets = jenjangCategories.map((jenjang, index) => ({
          label: jenjang,
          data: groupedData.map((item) => item[jenjang]),
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(153, 102, 255, 1)",
          ][index],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(153, 102, 255, 0.2)",
          ][index],
          fill: true,
          tension: 0.3,
          borderWidth: 2,
        }));

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

    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
            size: isMobile ? 10 : 12,
          },
          padding: 15,
        },
      },
      x: {
        ticks: {
          display: !isMobile,
          autoSkip: false,
          maxRotation: 45,
          minRotation: 0,
          font: {
            size: isMobile ? 0 : 12,
          },
          padding: 10,
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", margin: "0 auto" }}>
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
        Grafik Statistik Generus Berdasarkan Desa dan Jenjang
      </h3>
      {loading ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
          <Line data={chartData} options={options} />
      )}
    </div>
  );
};

export default StatisticsLine;
