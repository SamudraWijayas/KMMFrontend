import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Upload,
  message,
  Row,
  Col,
  Spin,
} from "antd";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";

function ViewGenerus({ editData, onClose }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [desaList, setDesaList] = useState([]);
  const [kelompokList, setKelompokList] = useState([]);
  const [kelompokByDesa, setKelompokByDesa] = useState([]);
  const [tglLahir, setTglLahir] = useState(null);
  const [loading, setLoading] = useState(false); // Loading untuk menampilkan spinner
  

  useEffect(() => {
    if (editData?.id) {
      // console.log("Fetching data for ID:", editData.id);
      setLoading(true); // Aktifkan loading
      fetchDataById(editData.id);
    }

    moment.locale("id");
    fetchDesa();
    fetchKelompok();
  }, [editData]);

  const fetchDataById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/generus/${id}`);
      const data = response.data;

      // console.log("Data fetched:", data);

      const tglLahir = moment(data.tgl_lahir);
      setTglLahir(tglLahir.isValid() ? tglLahir : null);

      form.setFieldsValue({
        ...data,
        tgl_lahir: tglLahir.isValid() ? tglLahir : null,
      });

      if (data.gambar) {
        setFileList([
          {
            uid: "-1",
            name: "Gambar Profil",
            status: "done",
            url: `${import.meta.env.VITE_API_URL}${data.gambar}`,
          },
        ]);
      }

      // Simulasikan loading selama 3 detik
      setTimeout(() => {
        setLoading(false); // Matikan loading setelah 3 detik
      }, 1000);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Gagal memuat data!");
      setLoading(false); // Pastikan loading dimatikan jika terjadi error
    }
  };

  const fetchDesa = async () => {
    try {
      const response = await axios.get("http://localhost:5000/desa");
      setDesaList(response.data);
    } catch (error) {
      console.error("Error fetching desa:", error);
      message.error("Gagal memuat data desa!");
    }
  };

  const fetchKelompok = async () => {
    try {
      const response = await axios.get("http://localhost:5000/kelompok");
      setKelompokList(response.data);
    } catch (error) {
      console.error("Error fetching kelompok:", error);
      message.error("Gagal memuat data kelompok!");
    }
  };

  return (
    <Modal
      open={!!editData}
      title="Lihat Data Generus"
      onCancel={onClose}
      footer={
        <Button key="back" onClick={onClose}>
          Tutup
        </Button>
      }
      className="custom-modal"
      width={800}
    >
      {/* Indikator Loading */}
      <Spin spinning={loading} size="large">
        {/* Konten Modal */}
        <Row gutter={16}>
          <Col xs={24} sm={16} md={16} lg={16} xl={16}>
            <Form form={form} layout="vertical">
              <Form.Item name="nama" label="Nama">
                <Input disabled placeholder="Nama" />
              </Form.Item>

              <Form.Item name="id_desa" label="Desa">
                <Select disabled placeholder="Desa">
                  {desaList.map((desa) => (
                    <Select.Option key={desa.uuid} value={desa.uuid}>
                      {desa.desa}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="id_kelompok" label="Kelompok">
                <Select disabled placeholder="Kelompok">
                  {kelompokByDesa.length > 0
                    ? kelompokByDesa.map((kelompok) => (
                        <Select.Option
                          key={kelompok.uuid}
                          value={kelompok.uuid}
                        >
                          {kelompok.kelompok}
                        </Select.Option>
                      ))
                    : kelompokList.map((kelompok) => (
                        <Select.Option
                          key={kelompok.uuid}
                          value={kelompok.uuid}
                        >
                          {kelompok.kelompok}
                        </Select.Option>
                      ))}
                </Select>
              </Form.Item>

              <Form.Item name="jenjang" label="Jenjang">
                <Select disabled placeholder="Jenjang">
                  <Select.Option value="Paud/TK">Paud/TK</Select.Option>
                  <Select.Option value="Caberawit">Caberawit</Select.Option>
                  <Select.Option value="Pra Remaja">Pra Remaja</Select.Option>
                  <Select.Option value="Remaja">Remaja</Select.Option>
                  <Select.Option value="Pra Nikah">Pra Nikah</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name="tgl_lahir" label="Tanggal Lahir">
                <DatePicker
                  style={{
                    width: "100%",
                    backgroundColor: "#f5f5f5",
                  }}
                  value={tglLahir}
                  format="DD-MM-YYYY"
                  disabled
                  inputReadOnly
                />
              </Form.Item>

              <Form.Item name="jenis_kelamin" label="Jenis Kelamin">
                <Input disabled placeholder="Jenis Kelamin" />
              </Form.Item>

              <Form.Item name="gol_darah" label="Golongan Darah">
                <Select disabled>
                  <Select.Option value="A">A</Select.Option>
                  <Select.Option value="B">B</Select.Option>
                  <Select.Option value="AB">AB</Select.Option>
                  <Select.Option value="O">O</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name="nama_ortu" label="Nama Orang Tua">
                <Input disabled placeholder="Nama Orang Tua" />
              </Form.Item>
            </Form>
          </Col>

          <Col xs={24} sm={8} md={8} lg={8} xl={8}>
            <Form.Item name="gambar" label="Gambar Profil">
              <Upload
                name="gambar"
                listType="picture"
                fileList={fileList}
                beforeUpload={() => false}
              ></Upload>
              {/* Jika gambar sudah dimuat, tampilkan gambar */}
              {fileList.length > 0 && (
                <img
                  src={fileList[0]?.url}
                  alt="Uploaded"
                  style={{ width: "100%", marginTop: 10 }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Spin>
    </Modal>
  );
}

export default ViewGenerus;
