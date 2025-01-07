import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Radio,
  Upload,
  message,
  Row,
  Col,
} from "antd";
import { IoMdCloudUpload } from "react-icons/io";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";

function EditModal({ editData, onClose, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [desaList, setDesaList] = useState([]);
  const [kelompokList, setKelompokList] = useState([]);
  const [kelompokByDesa, setKelompokByDesa] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");
  const [tglLahir, setTglLahir] = useState(null); // State untuk tanggal lahir
  const [selectedJenjang, setSelectedJenjang] = useState(""); // Track selected jenjang
  const [selectedKelas, setSelectedKelas] = useState(""); // Track selected kelas

  useEffect(() => {
    if (editData?.id) {
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

      // Format data tanggal lahir menjadi objek moment
      const tglLahir = moment(data.tgl_lahir);

      // Jika tanggal lahir tidak valid, set tglLahir ke null
      if (!tglLahir.isValid()) {
        message.error("Tanggal lahir tidak valid.");
        setTglLahir(null);
      } else {
        setTglLahir(tglLahir); // Set valid tglLahir
      }

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

      // Set initial selected jenjang and kelas
      setSelectedJenjang(data.jenjang || "");
      setSelectedKelas(data.kelas || "");
    } catch (error) {
      message.error("Gagal memuat data untuk ID yang dipilih!");
    }
  };

  const fetchDesa = async () => {
    try {
      const response = await axios.get("http://localhost:5000/desa");
      setDesaList(response.data);
    } catch (error) {
      message.error("Gagal memuat data desa!");
    }
  };

  const fetchKelompok = async () => {
    try {
      const response = await axios.get("http://localhost:5000/kelompok");
      setKelompokList(response.data);
    } catch (error) {
      message.error("Gagal memuat data kelompok!");
    }
  };

  const handleDesaChange = (value) => {
    const filteredKelompok = kelompokList.filter(
      (kelompok) => kelompok.id_desa === value
    );
    setKelompokByDesa(filteredKelompok);
    form.setFieldsValue({ id_kelompok: null });
  };

  const handleJenjangChange = (value) => {
    setSelectedJenjang(value); // Update selected jenjang
    form.setFieldsValue({ kelas: undefined }); // Reset kelas when jenjang changes
  };

  const handleKelasChange = (value) => {
    setSelectedKelas(value); // Update selected kelas
    let jenjang = "";
    switch (value) {
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
        jenjang = "Caberawit";
        break;
      case "7":
      case "8":
      case "9":
        jenjang = "Pra Remaja";
        break;
      case "10":
      case "11":
      case "12":
        jenjang = "Remaja";
        break;
      case "Paud":
      case "TK":
        jenjang = "Paud/TK";
        break;
      case "Pra Nikah":
        jenjang = "Pra Nikah";
        break;
      default:
        jenjang = "";
    }

    form.setFieldsValue({ jenjang }); // Update jenjang otomatis sesuai kelas
  };

  const handleUploadChange = (info) => {
    const { fileList } = info;
    setFileList(fileList);

    if (fileList.length > 0) {
      const file = fileList[0];
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      const isSmallEnough = file.size <= 2 * 1024 * 1024;

      if (!isJpgOrPng) {
        setUploadStatus("invalid-type");
        message.error("Format gambar harus JPG atau PNG.");
      } else if (!isSmallEnough) {
        setUploadStatus("invalid-size");
        message.error("Ukuran gambar tidak boleh lebih dari 2MB.");
      } else {
        setUploadStatus("valid");
      }
    } else {
      setUploadStatus("");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const formData = new FormData();
      formData.append("nama", values.nama);
      formData.append("id_kelompok", values.id_kelompok);
      formData.append("id_desa", values.id_desa);
      formData.append("jenjang", values.jenjang);
      formData.append("kelas", values.kelas);
      formData.append("tgl_lahir", values.tgl_lahir.format("YYYY-MM-DD"));
      formData.append("jenis_kelamin", values.jenis_kelamin);
      formData.append("gol_darah", values.gol_darah);
      formData.append("nama_ortu", values.nama_ortu);

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("gambar", fileList[0].originFileObj);
      }

      await axios.put(
        `http://localhost:5000/generus/${editData.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      message.success("Data berhasil diperbarui!");
      onUpdate();
      onClose();
    } catch (error) {
      message.error("Gagal memperbarui data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={!!editData}
      title="Edit Data Generus"
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Batal
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Simpan
        </Button>,
      ]}
      className="custom-modal"
      width={800} // Set a max-width for the modal to avoid horizontal scroll
    >
      <Row gutter={16} style={{ overflow: "hidden" }}>
        <Col xs={24} sm={16} md={16} lg={16} xl={16}>
          <Form form={form} layout="vertical">
            <Form.Item
              name="nama"
              label="Nama"
              rules={[{ required: true, message: "Nama tidak boleh kosong!" }]}
            >
              <Input placeholder="Masukkan nama" />
            </Form.Item>

            <Form.Item
              name="id_desa"
              label="Desa"
              rules={[{ required: true, message: "Desa tidak boleh kosong!" }]}
            >
              <Select placeholder="Pilih Desa" onChange={handleDesaChange}>
                {desaList.map((desa) => (
                  <Select.Option key={desa.uuid} value={desa.uuid}>
                    {desa.desa}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="id_kelompok"
              label="Kelompok"
              rules={[
                { required: true, message: "Kelompok tidak boleh kosong!" },
              ]}
            >
              <Select placeholder="Pilih Kelompok">
                {kelompokByDesa.length > 0
                  ? kelompokByDesa.map((kelompok) => (
                      <Select.Option key={kelompok.uuid} value={kelompok.uuid}>
                        {kelompok.kelompok}
                      </Select.Option>
                    ))
                  : kelompokList.map((kelompok) => (
                      <Select.Option key={kelompok.uuid} value={kelompok.uuid}>
                        {kelompok.kelompok}
                      </Select.Option>
                    ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="kelas"
              label="Jenjang"
              rules={[{ required: true, message: "Tolong pilih jenjang!" }]}
            >
              <Select
                value={selectedJenjang}
                onChange={handleJenjangChange}
                placeholder="Pilih Jenjang"
              >
                <Select.Option value="Paud/TK">Paud/TK</Select.Option>
                <Select.Option value="Caberawit">Caberawit</Select.Option>
                <Select.Option value="Pra Remaja">Pra Remaja</Select.Option>
                <Select.Option value="Remaja">Remaja</Select.Option>
                <Select.Option value="Pra Nikah">Pra Nikah</Select.Option>
              </Select>
            </Form.Item>

            {/* Render kelas hanya jika jenjang dipilih */}
            {selectedJenjang && (
              <Form.Item
                name="jenjang"
                label="Kelas"
                rules={[{ required: true, message: "Tolong pilih kelas!" }]}
              >
                <Select
                  value={selectedKelas}
                  onChange={handleKelasChange}
                  placeholder="Pilih Kelas"
                >
                  {selectedJenjang === "Paud/TK" && (
                    <>
                      <Select.Option value="Paud">Paud</Select.Option>
                      <Select.Option value="TK">TK</Select.Option>
                    </>
                  )}
                  {selectedJenjang === "Caberawit" && (
                    <>
                      <Select.Option value="1">Kelas 1</Select.Option>
                      <Select.Option value="2">Kelas 2</Select.Option>
                      <Select.Option value="3">Kelas 3</Select.Option>
                      <Select.Option value="4">Kelas 4</Select.Option>
                      <Select.Option value="5">Kelas 5</Select.Option>
                      <Select.Option value="6">Kelas 6</Select.Option>
                    </>
                  )}
                  {selectedJenjang === "Pra Remaja" && (
                    <>
                      <Select.Option value="7">Kelas 7</Select.Option>
                      <Select.Option value="8">Kelas 8</Select.Option>
                      <Select.Option value="9">Kelas 9</Select.Option>
                    </>
                  )}
                  {selectedJenjang === "Remaja" && (
                    <>
                      <Select.Option value="10">Kelas 10</Select.Option>
                      <Select.Option value="11">Kelas 11</Select.Option>
                      <Select.Option value="12">Kelas 12</Select.Option>
                    </>
                  )}
                  {selectedJenjang === "Pra Nikah" && (
                    <>
                      <Select.Option value="Pra Nikah">Pra Nikah</Select.Option>
                    </>
                  )}
                </Select>
              </Form.Item>
            )}

            <Form.Item
              name="tgl_lahir"
              label="Tanggal Lahir"
              rules={[
                {
                  required: true,
                  message: "Tanggal lahir tidak boleh kosong!",
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                value={tglLahir} // pastikan tglLahir adalah objek moment
                onChange={setTglLahir} // Update tglLahir saat memilih tanggal
                format="DD-MM-YYYY" // Format yang diinginkan
              />
            </Form.Item>

            <Form.Item
              name="jenis_kelamin"
              label="Jenis Kelamin"
              rules={[{ required: true, message: "Pilih jenis kelamin!" }]}
            >
              <Radio.Group>
                <Radio value="L">Laki-laki</Radio>
                <Radio value="P">Perempuan</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="gol_darah"
              label="Golongan Darah"
              rules={[{ required: true, message: "Pilih golongan darah!" }]}
            >
              <Select>
                <Select.Option value="A">A</Select.Option>
                <Select.Option value="B">B</Select.Option>
                <Select.Option value="AB">AB</Select.Option>
                <Select.Option value="O">O</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="nama_ortu"
              label="Nama Orang Tua"
              rules={[
                {
                  required: true,
                  message: "Nama orang tua tidak boleh kosong!",
                },
              ]}
            >
              <Input placeholder="Masukkan nama orang tua" />
            </Form.Item>
          </Form>
        </Col>

        <Col xs={24} sm={8} md={8} lg={8} xl={8}>
          <Form.Item name="gambar" label="Upload Gambar">
            <Upload
              name="gambar"
              listType="picture"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
              accept=".jpg,.jpeg,.png"
            >
              <Button icon={<IoMdCloudUpload />}>Pilih Gambar</Button>
            </Upload>
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
    </Modal>
  );
}

export default EditModal;
