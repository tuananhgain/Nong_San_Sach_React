import React, { useEffect, useState } from "react";
import "../assets/khuyenmai.css"; 

export default function TrangSanPham() {
  const [sanphams, setSanPhams] = useState([]);
  const [sort, setSort] = useState("");

  const loadData = async () => {
    const res = await fetch(
      `http://127.0.0.1:8000/api/trangsanpham/?sort=${sort}`
    );
    const data = await res.json();
    setSanPhams(data.data.sanphams);
  };

  useEffect(() => {
    loadData();
  }, [sort]);

  return (
    <div className="textall">
      {/* Banner */}
      <div
        className="banner text-center text-success py-5 mb-4"
        style={{ backgroundColor: "aquamarine" }}
      >
        <h2 className="fw-bold">Danh Sách Sản Phẩm</h2>
        <p>Mua sắm dễ dàng - Giá tốt mỗi ngày</p>
      </div>

      {/* Bộ lọc */}
      <div className="container mb-4 d-flex justify-content-between align-items-center">
        <div className="d-flex gap-2">
          <select
            className="form-select w-auto"
            value={sort}
            onChange={(e) => setSort(e.target.value)}>
            <option value="">Sắp xếp theo</option>
            <option value="masp">Mặc định</option>
            <option value="gia1dv">Giá tăng dần</option>
            <option value="-gia1dv">Giá giảm dần</option>
          </select>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="container">
        <div className="row g-4">
          {sanphams.map((sp) => (
            <div
              key={sp.masp}
              className="col-12 col-sm-6 col-md-4 col-lg-3"
            >
              <div className="card h-100 border-0 shadow-sm product-card">
                <div className="position-relative overflow-hidden">

                  {/* Ảnh */}
                  <img
                  src={`/HinhAnh/Hình ${sp.masp}/HINH1.jfif`}
                  className="card-img-top anh img-fluid product-img"
                  alt={sp.tensp}
                  />

                  {/* Tam giác khuyến mãi */}
                  {sp.makm && (
                    <div className="discount-triangle">
                      <div className="discount-text product-card">
                        -{sp.makm.giamgia}%
                      </div>
                    </div>
                  )}
                </div>

                {/* Nội dung */}
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold text-dark mb-2">
                    {sp.tensp}
                  </h5>

                  {/* Giá */}
                  {sp.gia_khuyenmai ? (
                    <div>
                      <span className="fw-bold text-decoration-line-through text-danger small">
                        {sp.gia1dv.toLocaleString()} VNĐ
                      </span>
                      <span className="fw-bold text-success fs-6 ms-1">
                        {sp.gia_khuyenmai.toLocaleString()} VNĐ
                      </span>
                    </div>
                  ) : (
                    <div className="fw-bold text-success fs-6">
                      {sp.gia1dv.toLocaleString()} VNĐ
                    </div>
                  )}

                  <a
                    href={`/sanpham/${sp.masp}`}
                    className="btn btn-success mt-3 w-100 rounded-pill"
                  >
                    Xem chi tiết
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
