import { useEffect, useState } from "react";
import "../assets/khuyenmai.css";

export default function TrangChu() {
  const [sanphams, setSanPhams] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/")
      .then((res) => res.json())
      .then((json) => setSanPhams(json.data.sanphams))
      .catch((err) => console.error(err));
  }, []);


  return (
    <div className="container mt-4 textall">

      <h2 className="text-center mb-4">SẢN PHẨM NỔI BẬT</h2>

      <div className="row">
        {sanphams.map((sp) => (
          <div key={sp.masp} className="col-md-4 mb-4">
            <div className="card text-center position-relative product-card">

              {/* ẢNH */}
              <div className="position-relative overflow-hidden">
                <img
                  src={`/HinhAnh/Hình ${sp.masp}/HINH1.jfif`}
                  className="card-img-top anh img-fluid product-img"
                  alt={sp.tensp}
                />



                {/* TAM GIÁC KHUYẾN MÃI */}
                {sp.makm && (
                  <div className="discount-triangle">
                    <div className="discount-text product-card">-{sp.makm.giamgia}%</div>
                  </div>
                )}
              </div>

              {/* BODY */}
              <div className="card-body">
                <h5 className="card-title">{sp.tensp}</h5>

                {/* GIÁ */}
                {sp.gia_khuyenmai ? (
                  <p className="card-text">
                    <span className="fw-bold text-decoration-line-through text-danger me-2">
                      {sp.gia1dv.toLocaleString()} VNĐ
                    </span>
                    <span className="fw-bold text-success">
                      {sp.gia_khuyenmai.toLocaleString()} VNĐ / {sp.donvitinh}
                    </span>
                  </p>
                ) : (
                  <p className="card-text fw-bold">
                    {sp.gia1dv.toLocaleString()} VNĐ / {sp.donvitinh}
                  </p>
                )}

                {/* Xem chi tiết */}
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
  );
}
