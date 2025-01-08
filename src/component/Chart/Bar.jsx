import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatisticsBar = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the APIs
        const desaResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/desa`);
        const desaData = desaResponse.data;

        const generusResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/generus`);
        const generusData = generusResponse.data;

        // Group generus data by desa and jenjang
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

        // Prepare data for the chart
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
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)", // Warna Paud
            "rgba(54, 162, 235, 0.6)", // Warna Caberawit
            "rgba(75, 192, 192, 0.6)", // Warna Pra Remaja
            "rgba(255, 206, 86, 0.6)", // Warna Remaja
            "rgba(153, 102, 255, 0.6)", // Warna Pra Nikah
          ][index],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(153, 102, 255, 1)",
          ][index],
          borderWidth: 1,
          barPercentage: 0.8, // Lebar bar dalam grup
          categoryPercentage: 0.7, // Jarak antar grup
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
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Jumlah Generus",
        },
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        title: {
          display: true,
          text: "Desa",
        },
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 0,
        },
        grid: {
          display: false, // Tidak menampilkan garis grid vertikal
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  return (
    <div>
      <h3>Grafik Statistik Generus Berdasarkan Desa dan Jenjang</h3>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div
          style={{
            width: "100%",
            height: "60vh", // Responsif untuk tinggi
            maxWidth: "1200px",
            margin: "0 auto", // Center grafik
          }}
        >
          <Bar data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default StatisticsBar;
