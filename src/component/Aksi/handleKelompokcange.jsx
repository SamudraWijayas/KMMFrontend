import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Select, Spin, message } from "antd";
import axios from "axios";

const AddGroupModel = () => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [kelompokList, setKelompokList] = useState([]); // State untuk kelompok data
  const [desaList, setDesaList] = useState([]); // State untuk desa data
  const [form] = Form.useForm(); // Hook untuk menangani form

  const fetchKelompok = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/kelompok`);
      const data = await response.json();
      setKelompokList(data); // Simpan data kelompok ke state
    } catch (error) {
      message.error("Gagal memuat data kelompok!");
      console.error("Error fetching kelompok data:", error);
    }
  };

  const fetchDesa = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/desa`);
      const data = await response.json();
      setDesaList(data); // Simpan data desa ke state
    } catch (error) {
      message.error("Gagal memuat data desa!");
      console.error("Error fetching desa data:", error);
    }
  };

  useEffect(() => {
    fetchKelompok(); // Ambil data kelompok saat komponen dimuat
    fetchDesa();
  }, []); // Hanya dijalankan sekali saat komponen dimuat

  const handleKelompokChange = (kelompokId) => {
    // Temukan kelompok yang dipilih
    const selectedKelompok = kelompokList.find(
      (kelompok) => kelompok.uuid === kelompokId
    );

    if (selectedKelompok) {
      // Perbarui input desa berdasarkan kelompok yang dipilih
      form.setFieldsValue({
        id_desa: selectedKelompok.id_desa,
      });
    }
  };

  const handleOk = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields(); // Validasi form
      console.log("Form Values:", values);

      // Kirim data ke backend
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/kelompok`,
        values
      );

      if (response.status === 201) {
        message.success("Data berhasil disubmit!");
        setTimeout(() => {
          setLoading(false);
          setOpen(false);
          form.resetFields(); // Reset form setelah submit
        }, 2000);
      }
    } catch (error) {
      console.log("Form validation failed:", error);
      message.error("Submission gagal. Coba lagi.");
      setLoading(false);
    }
  };

  const showLoading = () => {
    setOpen(true);
    setLoading(true);

    // Simulasi loading
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  return (
    <>
      <Button type="primary" onClick={showLoading}>
        Add Data
      </Button>
      <Modal
        open={open}
        title="Tambah Kelompok"
        onOk={handleOk}
        footer={[
          <Button key="back" onClick={() => setOpen(false)}>
            Kembali
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Kirim
          </Button>,
        ]}
        onCancel={() => setOpen(false)}
      >
        <Spin spinning={loading} size="large">
          <Form form={form} layout="vertical" name="kelompokForm">
            <Form.Item
              name="id_kelompok"
              label="Kelompok"
              rules={[{ required: true, message: "Tolong pilih kelompok!" }]}
            >
              <Select
                placeholder="Pilih Kelompok"
                onChange={handleKelompokChange}
              >
                {kelompokList.length > 0 ? (
                  kelompokList.map((kelompok) => (
                    <Select.Option key={kelompok.uuid} value={kelompok.uuid}>
                      {kelompok.kelompok}
                    </Select.Option>
                  ))
                ) : (
                  <Select.Option value="" disabled>
                    Tidak ada kelompok
                  </Select.Option>
                )}
              </Select>
            </Form.Item>

            <Form.Item
              name="id_desa"
              label="Desa"
              rules={[{ required: true, message: "Tolong pilih desa!" }]}
            >
              <Select placeholder="Desa akan otomatis terisi" disabled>
                {desaList.length > 0 ? (
                  desaList.map((desa) => (
                    <Select.Option key={desa.uuid} value={desa.uuid}>
                      {desa.desa}
                    </Select.Option>
                  ))
                ) : (
                  <Select.Option value="" disabled>
                    Tidak ada desa
                  </Select.Option>
                )}
              </Select>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default AddGroupModel;
