import React, { useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function DangKy() {
  const [form, setForm] = useState({
    tenkhachhang: "",
    username: "",
    sdt: "",
    address: "",
    password: "",
    confirm: "",
  });

  const [accountInfo, setAccountInfo] = useState(null); // Lưu Username + Password như template gốc

  // Hàm update input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Hàm submit
 const handleSubmit = async (e) => {
  e.preventDefault();

  // Kiểm tra required
  for (let key in form) {
    if (!form[key].trim()) {
      Swal.fire("Thiếu thông tin", "Vui lòng nhập đầy đủ dữ liệu.", "warning");
      return;
    }
  }

  if (form.password !== form.confirm) {
    Swal.fire("Lỗi", "Mật khẩu xác nhận không trùng khớp.", "warning");
    return;
  }

  // Gửi đúng format backend yêu cầu
  const body = {
    makh: "KH" + Math.floor(Math.random() * 100000), // auto create
    tenkh: form.tenkhachhang,
    sdt: form.sdt,
    diachi: form.address,
    capdotv: "TV0", // mặc định hoặc bạn quy định
    tentk: form.username,
    matkhau: form.password,
  };

  try {
    const res = await fetch("http://127.0.0.1:8000/api/dangky/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data.status === "error") {
      Swal.fire("Lỗi", data.message, "error");
      return;
    }

    if (data.status === "success") {
      Swal.fire("Thành công", data.message, "success");

      setAccountInfo({
        Username: body.tentk,
        Password: body.matkhau,
      });

      setForm({
        tenkhachhang: "",
        username: "",
        sdt: "",
        address: "",
        password: "",
        confirm: "",
      });
    }
  } catch (err) {
    Swal.fire("Lỗi", "Không thể kết nối máy chủ.", "error");
    console.error(err);
  }
};

  return (
    <div className="container" style={{ maxWidth: 600, marginTop: 50, fontFamily:'Times New Roman' }}>
      <h2 className="text-center">Đăng ký khách hàng</h2>

      <form onSubmit={handleSubmit}>

        {/* Họ và Tên */}
        <div className="mb-3">
          <label className="form-label">Họ và tên:</label>
          <input
            type="text"
            className="form-control"
            name="tenkhachhang"
            value={form.tenkhachhang}
            onChange={handleChange}
          />
        </div>

        {/* Username */}
        <div className="mb-3">
          <label className="form-label">Username:</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={form.username}
            onChange={handleChange}
          />
        </div>

        {/* Số điện thoại */}
        <div className="mb-3">
          <label className="form-label">Số điện thoại:</label>
          <input
            type="text"
            className="form-control"
            name="sdt"
            value={form.sdt}
            onChange={handleChange}
          />
        </div>

        {/* Địa chỉ */}
        <div className="mb-3">
          <label className="form-label">Địa chỉ:</label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={form.address}
            onChange={handleChange}
          />
        </div>

        {/* Mật khẩu */}
        <div className="mb-3">
          <label className="form-label">Mật khẩu:</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        {/* Xác nhận mật khẩu */}
        <div className="mb-3">
          <label className="form-label">Xác nhận mật khẩu:</label>
          <input
            type="password"
            className="form-control"
            name="confirm"
            value={form.confirm}
            onChange={handleChange}
          />
        </div>

        {/* Nút đăng ký */}
        <button type="submit" className="btn btn-primary w-100">
          Đăng ký
        </button>
      </form>

      {/* Khu vực tài khoản – giống template Django */}
      {accountInfo && (
        <div className="alert alert-info mt-3">
          <p>Tài khoản và mật khẩu của bạn là:</p>
          <strong>Tài khoản:</strong> {accountInfo.Username} <br />
          <strong>Mật khẩu:</strong> {accountInfo.Password}
        </div>
      )}

      {/* Nút điều hướng */}
      <div className="text-center mt-4">
        <Link to="/dangnhap" className="btn btn-success w-100">
          Đăng Nhập
        </Link>
      </div>

      <div className="text-center mt-4">
        <Link to="/" className="btn btn-secondary w-100">
          Quay về trang chủ
        </Link>
      </div>
    </div>
  );
}
