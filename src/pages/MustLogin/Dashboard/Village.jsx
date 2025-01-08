import React, { useState, useEffect } from "react";
import useFetchUserData from "../../../hooks/useFetchUserData";
import Header from "../../../component/Header";
import { Sidebar } from "../../../component/Sidebar/Desa";
import { FaUser, FaLayerGroup } from "react-icons/fa";
import { GiVillage } from "react-icons/gi";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import DashboardBox from "./DashboardBox";
import Semangat from "../../../assets/Group.png";
import StatisticsChart from "../../../component/Chart/PieVillage";
import LineVillage from "../../../component/Chart/LineVillage";
import { message } from "antd";

import "react-loading-skeleton/dist/skeleton.css";

const Village = () => {
  const { userData } = useFetchUserData();
  const usernames = userData?.username;
  const avatar = userData?.avatar;
  const id_desa = userData?.id_desa;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalGenerus: 0,
    totalKelompok: 0,
    totalMumi: 0,
    totalCaberawit: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [generusRes, kelompokRes, mumiRes, caberawitRes] =
        await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/generus/total/${id_desa}`),
          axios.get(
            `${import.meta.env.VITE_API_URL}/api/kelompok/total/${id_desa}`
          ),
          axios.get(
            `${import.meta.env.VITE_API_URL}/api/generus/total/jenjang/${id_desa}`
          ),
          axios.get(
            `${import.meta.env.VITE_API_URL}/api/generus/total/caberawit/${id_desa}`
          ),
        ]);

      setStats({
        totalGenerus: generusRes.data.totalGenerus || 0,
        totalKelompok: kelompokRes.data.totalKelompok || 0,
        totalMumi: mumiRes.data.totalMumi || 0,
        totalCaberawit: caberawitRes.data.totalCaberawit || 0,
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
      message.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id_desa) {
      fetchStats();
    }
  }, [id_desa]);

  return (
    <>
      <Header
        username={usernames}
        avatar={avatar}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="main d-flex">
        <div className={`sidebarWrapper ${sidebarOpen ? "open" : "closed"}`}>
          <Sidebar
            sidebarOpen={sidebarOpen}
            username={usernames}
            avatar={avatar}
            id_desa={id_desa}
          />
        </div>
        <div className={`content ${sidebarOpen ? "open" : "closed"}`}>
          <div className="right-content w-100">
            <div className="right-text align-items-center">
              <div className="users-info align-items-center">
                <div className="row">
                  <div className="col-md-6 content-left">
                    <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start">
                      <img src={Semangat} alt="Logo" className="semangat" />
                      <div className="d-flex flex-column info-text text-center text-md-start ms-md-4">
                        {loading ? (
                          <>
                            <Skeleton
                              variant="text"
                              width="80%"
                              height={50}
                              style={{ marginBottom: "16px" }}
                            />
                            <Skeleton variant="text" width="100%" height={30} />
                            <Skeleton
                              variant="text"
                              width="95%"
                              height={30}
                              style={{ marginTop: "8px" }}
                            />
                          </>
                        ) : (
                          <>
                            <h1>
                              Hai, <span>{usernames}</span>
                            </h1>
                            <p>
                              Saat ini Anda sedang Beramal Sholih untuk
                              MengUpdate data Generus Jamaah, dimohon untuk bisa
                              semangat dalam Beramal Sholih.
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 content-right">
                    <LineVillage id_desa={id_desa} />
                  </div>
                </div>
              </div>
            </div>
            <div className="row dashboardboxwrapperbox">
              <div className="col-md-8">
                <div className="dashboardboxwrapper d-flex">
                  <DashboardBox
                    title="Total Generus"
                    count={
                      loading ? (
                        <Skeleton animation="wave" />
                      ) : (
                        stats.totalGenerus
                      )
                    }
                    color={["#16325B", "#4066B8"]}
                    icon={<FaUser />}
                  />
                  <DashboardBox
                    title="Total Muda-Mudi"
                    count={
                      loading ? <Skeleton animation="wave" /> : stats.totalMumi
                    }
                    color={["#E1AE3E", "#F6CD46"]}
                    icon={<FaUser />}
                  />
                  <DashboardBox
                    title="Total Caberawit"
                    count={
                      loading ? (
                        <Skeleton animation="wave" />
                      ) : (
                        stats.totalCaberawit
                      )
                    }
                    color={["#E14862", "#F34F7D"]}
                    icon={<GiVillage />}
                  />
                  <DashboardBox
                    title="Total Kelompok"
                    count={
                      loading ? (
                        <Skeleton animation="wave" />
                      ) : (
                        stats.totalKelompok
                      )
                    }
                    color={["#23A66D", "#01DBB9"]}
                    icon={<FaLayerGroup />}
                  />
                </div>
              </div>
              <div className="col-md-4 d-flex align-items-center">
                <div className="pie d-flex align-items-center text-center">
                  <StatisticsChart id_desa={id_desa} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Village;
