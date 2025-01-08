import React, { useState } from "react";
import { Button, Modal, Form, Input, message } from "antd";
import axios from "axios";
import Cookies from "js-cookie";

// Komponen EditPassword
const EditPassword = ({ isModalOpen, setIsModalOpen }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm(); // Hook untuk menangani form

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields(); // Reset form saat modal ditutup
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    // Validasi password baru dan konfirmasi password
    if (newPassword !== confirmPassword) {
      message.error("Password baru tidak cocok dengan konfirmasi password.");
      setSubmitting(false);
      return;
    }

    try {
      const accessToken = Cookies.get("accessToken");

      // Kirim request untuk update password
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/update-password`,
        {
          oldPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Tampilkan pesan sukses
      message.success(response.data.msg);

      // Bersihkan form dan state setelah berhasil
      setIsModalOpen(false); // Tutup modal
      form.resetFields(); // Reset form input
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error during password update:", error);
      message.error(error.response?.data?.msg || "Update password gagal");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Update Password"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Password Lama"
          name="oldPassword"
          rules={[{ required: true, message: "Password lama diperlukan" }]}
        >
          <Input.Password
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Password Baru"
          name="newPassword"
          rules={[{ required: true, message: "Password baru diperlukan" }]}
        >
          <Input.Password
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Konfirmasi Password Baru"
          name="confirmPassword"
          rules={[
            { required: true, message: "Konfirmasi password diperlukan" },
          ]}
        >
          <Input.Password
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Update Password
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPassword;
