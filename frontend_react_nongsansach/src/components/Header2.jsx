import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../assets/khuyenmai.css";

export default function Header() {
  const [txt, setTxt] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [name, setName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
  const loadAuth = () => {
    const auth = localStorage.getItem("isAuth") === "true";
    const userName = localStorage.getItem("name") || "";
    setIsAuth(auth);
    setName(userName);
  };

  loadAuth(); // chạy lần đầu

  // lắng nghe khi localStorage thay đổi (đăng nhập, đăng xuất)
  window.addEventListener("storage", loadAuth);

  return () => {
    window.removeEventListener("storage", loadAuth);
  };
}, []);


  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    localStorage.removeItem("name");
    setIsAuth(false);
    navigate("/");

    Swal.fire({
    icon: "success",
    title: "Đăng xuất thành công",
    showConfirmButton: false,
    timer: 1500
  });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${txt}`);
  };

  return (
    <header className="bg-success text-white py-3 textall">
      <div className="container d-flex justify-content-between align-items-center">
        <h1 className="h3">NÔNG SẢN SẠCH</h1>

        <form className="col-md-4 d-flex" onSubmit={handleSearch}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Tìm kiếm sản phẩm..."
            value={txt}
            onChange={(e) => setTxt(e.target.value)}
          />
          <button className="btn btn-warning" type="submit">
            Tìm
          </button>
        </form>

        {/* ---- PHẦN LOGIN / LOGOUT ---- */}
        <div className="d-flex justify-content-end align-items-center">

          {isAuth ? (
            <>
              <span
                className="text-light me-3"
                style={{ fontSize: 20, fontWeight: 600 }}
              >
                Xin chào, <span className="text-danger">{name}</span>
              </span>

              <button
                className="btn btn-outline-light me-2"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-outline-light me-2" to="/dangnhap">
                Đăng nhập
              </Link>
              <Link className="btn btn-outline-light me-2" to="/dangky">
                Đăng ký
              </Link>
            </>
          )}

          <Link className="btn btn-warning text-dark ms-2" to="/giohang">
            Giỏ hàng
          </Link>
        </div>
      </div>

      <nav className="navbar navbar-expand-lg navbar-dark bg-success mt-3">
        <div className="container">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">Trang chủ</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/ttkh">Thông tin khách hàng</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/donhang">Đơn hàng</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

    </header>
  );
}
