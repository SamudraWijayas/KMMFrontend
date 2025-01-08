import React,{useEffect} from "react";
import Navbar from "../component/Navbar";
import "./../css/main.css";
import m2bl from "../assets/m2bl.jpg";
import logo from "../assets/logo.png";
import fmi from "../assets/FMI.png";
import pionir from "../assets/pionir.jpg";
import keputrian from "../assets/keputrian.jpg";
import { Link } from "react-router-dom";
import "aos/dist/aos.css"; // Import file CSS AOS
import AOS from "aos";

const Home = () => {
  useEffect(() => {
    AOS.init(); // Inisialisasi AOS hanya sekali
  }, []);
  return (
    <>
      <Navbar />
      <section id="hero" className="hero section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div
                className="hero-content"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <h1 className="mb-4">
                  Kemuda Mudian <br />
                  Bandar Lampung <br />
                </h1>

                <div className="hero-buttons">
                  <a
                    href="https://www.instagram.com/generus.bdl?igsh=MWQ3amdtejFqZmVlbA=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary me-0 me-sm-2 mx-1"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div
                className="hero-image"
                data-aos="zoom-out"
                data-aos-delay="300"
              >
                <img
                  src={m2bl}
                  alt="Hero Image"
                  className="img-fluid rounded-3"
                />
              </div>
            </div>
          </div>

          <div
            className="row stats-row gy-4 mt-5"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <div className="col-lg-3 col-md-6">
              <div className="stat-item">
                <div className="stat-icon">
                  <img src={logo} alt="" style={{ width: 40 }} />
                </div>
                <div className="stat-content">
                  <h4>M2BL</h4>
                  <p className="mb-0">Muda - Mudi Bandar Lampung</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="stat-item">
                <div className="stat-icon">
                  <img src={keputrian} alt="" style={{ width: 40 }} />
                </div>
                <div className="stat-content">
                  <h4>Keputrian</h4>
                  <p className="mb-0">Keputrian Daerah Bandar Lampung</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="stat-item">
                <div className="stat-icon">
                  <img src={fmi} alt="" style={{ width: 40 }} />
                </div>
                <div className="stat-content">
                  <h4>FMI</h4>
                  <p className="mb-0">Forum Mahasiswa Islam</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="stat-item">
                <div className="stat-icon">
                  <img src={pionir} alt="" style={{ width: 40 }} />
                </div>
                <div className="stat-content">
                  <h4>Pionir</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
