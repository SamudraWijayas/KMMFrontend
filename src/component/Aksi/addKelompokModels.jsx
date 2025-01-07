import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Select, message, Spin } from "antd";
import axios from "axios";
import "../../css/modal.css"; // Pastikan CSS ini terhubung dengan benar

const AddGroupModel = ({ onAddData }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [desaList, setDesaList] = useState([]);
  const [form] = Form.useForm();

  const fetchDesa = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/desa`);
      const data = await response.json();
      setDesaList(data);
    } catch (error) {
      message.error("Gagal memuat data desa!");
      console.error("Error fetching desa data:", error);
    }
  };

  useEffect(() => {
    fetchDesa();
  }, []);

  const handleOk = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields(); // Validasi input form
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/kelompok`,
        values, // Data JSON yang dikirim
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        // Tunda pesan sukses hingga loading selesai
        setTimeout(() => {
          message.success("Kelompok berhasil ditambahkan!");
          if (onAddData) onAddData(); // Callback untuk memberi tahu komponen induk
          setOpen(false);
          form.resetFields(); // Reset form setelah submit
          setLoading(false);
        }, 500); // Tambahkan sedikit jeda untuk efek loading
      }
    } catch (error) {
      console.error("Error during submission:", error);
      setTimeout(() => {
        message.error("Gagal menambahkan kelompok. Silakan coba lagi.");
        setLoading(false);
      }, 500); // Tambahkan sedikit jeda untuk efek loading
    }
  };
  const showLoading = () => {
    setOpen(true);
    setLoading(true);

    // Simulasi loading selesai dalam 2 detik.
    setTimeout(() => {
      setLoading(false);
    }, 400);
  };
  return (
    <>
      <Button
        type="primary"
        onClick={showLoading}
        className="btns btn-light me-2 mb-2 mb-md-0 add-btn"
      >
        Add Kelompok
      </Button>
      <Modal
        open={open}
        title="Tambah Kelompok"
        footer={[
          <Button key="back" onClick={() => setOpen(false)}>
            Kembali
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            loading={loading}
          >
            Kirim
          </Button>,
        ]}
        onCancel={() => setOpen(false)}
      >
        <Spin spinning={loading} size="large">
          <Form form={form} layout="vertical" name="addKelompokForm">
            <Form.Item
              name="kelompok"
              label="Nama Kelompok"
              rules={[
                { required: true, message: "Tolong masukkan nama kelompok!" },
              ]}
            >
              <Input placeholder="Masukkan nama kelompok" />
            </Form.Item>
            <Form.Item
              name="id_desa"
              label="Desa"
              rules={[{ required: true, message: "Tolong pilih desa!" }]}
            >
              <Select placeholder="Pilih Desa">
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
