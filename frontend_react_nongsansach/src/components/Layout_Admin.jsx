import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../assets/quanli.css";

export default function Layout_Admin() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    localStorage.removeItem("name");

    Swal.fire({
      icon: "success",
      title: "Đã đăng xuất",
      showConfirmButton: false,
      timer: 1500
    });

    navigate("/");
  };

  return (
    <div className="d-flex" style={{fontFamily:'Times New Roman'}}>

      <nav className="nav-sidebar d-flex flex-column flex-shrink-0 p-3 bg-success text-white" 
           style={{ width: "260px", minHeight: "100vh" }}>

        <h4 className="mb-4 text-center fw-bold">QUẢN LÍ NÔNG SẢN</h4>

        <ul className="nav nav-pills flex-column mb-auto">

          <li className="nav-item mb-2">
            <NavLink to="/quanli/donhang" className={({ isActive }) =>
              "nav-link text-white " + (isActive ? "active-link" : "")
            }>
              <i className="bi bi-bag"></i> Đơn Hàng
            </NavLink>
          </li>

          <li className="nav-item mb-2">
            <NavLink to="/quanli/khuyenmai" className={({ isActive }) =>
              "nav-link text-white " + (isActive ? "active-link" : "")
            }>
              <i className="bi bi-percent"></i> Khuyến Mãi
            </NavLink>
          </li>

          <li className="nav-item mb-2">
            <NavLink to="/quanli/thongke" className={({ isActive }) =>
              "nav-link text-white " + (isActive ? "active-link" : "")
            }>
              <i className="bi bi-bar-chart"></i> Thống kê
            </NavLink>
          </li>

          {/* ❗ ĐĂNG XUẤT CHUẨN */}
          <li className="nav-item mb-2">
            <button
              className="nav-link text-white btn btn-link text-start"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right"></i> Đăng xuất
            </button>
          </li>

        </ul>
      </nav>

      <div className="main-content flex-grow-1 p-4">
        <Outlet />
      </div>

    </div>
  );
}
