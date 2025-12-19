import React, { useState } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.username.trim() || !form.password.trim()) {
    setErrorMessage("Vui lòng nhập đầy đủ thông tin");
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:8000/api/dangnhap/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",   
  body: JSON.stringify({username: form.username, password: form.password}),
});


    const data = await res.json();

    if (data.status === "error") {
      setErrorMessage(data.message);
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }

    // --- LƯU ĐÚNG GIÁ TRỊ CHO HEADER ---
    localStorage.setItem("isAuth", "true");
    localStorage.setItem("name", data.data.tenkh || data.data.username); 
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    if (data.role === "customer") {
      localStorage.setItem("makh", data.data.makh);
      Swal.fire("Thành công", "Đăng nhập thành công!", "success");
      navigate("/");
    } else if (data.role === "admin") {
      Swal.fire("Thành công", "Đăng nhập admin!", "success");
      navigate("/quanlyhoadon");
    }

    // thông báo cho Header biết localStorage thay đổi
    window.dispatchEvent(new Event("storage"));

  } catch (error) {
    console.error(error);
    setErrorMessage("Không thể kết nối máy chủ");
    setTimeout(() => setErrorMessage(""), 2000);
  }
};


  return (
    <div className="container" style={{ maxWidth: 600, marginTop: 50, fontFamily:'Times New Roman' }}>
      <h2 className="text-center">Đăng nhập</h2>

      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div className="mb-3">
          <label className="form-label">Tài khoản:</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={form.username}
            onChange={handleChange}
          />
        </div>

        {/* Password */}
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

        <button type="submit" className="btn btn-primary w-100">
          Đăng nhập
        </button>
      </form>

      {/* Thông báo lỗi giống Django */}
      {errorMessage && (
        <div id="error-message" className="alert alert-danger mt-3">
          {errorMessage}
        </div>
      )}

      {/* Link điều hướng */}
      <div className="d-flex justify-content-between mt-3">
        <Link to="/dangky" className="link link-warning">
          Đăng ký
        </Link>
        <Link className="link link-warning" to="#">
          Quên mật khẩu
        </Link>
        <Link to="/" className="link link-secondary">
          Quay về trang chủ
        </Link>
      </div>
    </div>
  );
}
