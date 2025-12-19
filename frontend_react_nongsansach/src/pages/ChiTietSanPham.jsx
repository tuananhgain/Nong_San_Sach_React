import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../assets/ctsp.css";

export default function ChiTietSanPham() {
  const { masp } = useParams();
  const [data, setData] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImg, setMainImg] = useState("");

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/sanpham/${masp}/`)
      .then((res) => {
        const d = res.data.data;
        if (!d) return;

        setData(d);
        setMainImg("/" + d.main_image);
      })
      .catch((err) => console.error(err));
  }, [masp]);

  // 🔥 Không loading – chỉ chặn render để không crash
  if (!data || !data.sanpham) return null;

  const sp = data.sanpham;

  const handleAddToCart = () => {
    const soluongtk = Number(sp.soluongtk);

    if (soluongtk <= 0) {
      Swal.fire("Hết hàng!", "Sản phẩm này đã hết hàng.", "error");
      return;
    }

    if (quantity > soluongtk) {
      Swal.fire(
        "Không đủ hàng",
        `Chỉ còn ${soluongtk} sản phẩm trong kho.`,
        "warning"
      );
      return;
    }

    Swal.fire({
      icon: "question",
      title: "Xác nhận?",
      text: `Thêm ${quantity} sản phẩm vào giỏ hàng?`,
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Không",
    }).then((result) => {
      if (result.isConfirmed) {
       axios
        .post(
          "http://127.0.0.1:8000/api/gio_hang/",
          {
            productId: sp.masp,
            quantity: quantity,
          },
          {
            withCredentials: true,
            
          }
        )
        .then(() =>
          Swal.fire("Thành công!", "Đã thêm vào giỏ hàng!", "success")
        )
        .catch((err) => {
          console.error("Lỗi thêm vào giỏ hàng:", err);
          Swal.fire("Lỗi", "Không thể thêm vào giỏ hàng!", "error")
        });

      }
    });
  };

  return (
    <div className="container mt-4 textall">
      <div className="row-detail d-flex">
        {/* Cột ảnh */}
        <div className="col-md-5 picture">
          <div className="product-container">
            <div className="main-image">
              <img src={mainImg} alt="" className="main-img img-fluid rounded" />
            </div>

            {/* Thumbnail list */}
            <div className="thumbnail-images d-flex gap-2 mt-2">
              {data.thumbnails.map((thumb, index) => (
                <img
                  key={index}
                  src={"/" + thumb} alt=""
                  className="thumb-img rounded"
                  style={{ cursor: "pointer" }}
                  onClick={() => setMainImg("/" + thumb)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Cột thông tin */}
        <div className="col-md-7 content">
          <h3 className="head">{sp.tensp}</h3>

          <div className="price text-danger fw-bold" style={{ fontSize: 20 }}>
            {sp.makm ? (
              <p>
                <span className="text-decoration-line-through text-danger me-2">
                  {sp.gia1dv.toLocaleString()} VNĐ
                </span>
                <span className="fw-bold text-success">
                  {sp.gia_khuyenmai.toLocaleString()} VNĐ / {sp.donvitinh}
                </span>
                
              </p>
            ) : (
              <p>
                {sp.gia1dv.toLocaleString()} VNĐ / {sp.donvitinh}
              </p>
            )}
          </div>

          {/* Số lượng */}
          <div className="mt-3">
            <label>Số lượng</label>
            <input
              type="number"
              value={quantity}
              min={1}
              max={100}
              className="form-control w-25 d-inline-block ms-2"
              onChange={(e) =>
                setQuantity(Math.max(1, Number(e.target.value)))
              }
            />
          </div>

          <div className="mt-4">
            <button
              className="btn btn-success px-4 py-2"
              onClick={handleAddToCart}
            >
              <i className="bi bi-cart-plus"></i> Thêm Vào Giỏ Hàng
            </button>
          </div>
        </div>
      </div>

      {/* Thông tin sản phẩm */}
      <div
        className="info mt-4 p-3 border rounded col-4"
        style={{ marginLeft: "45px" }}
      >
        <h4 className="text-success">Thông tin sản phẩm</h4>

        <div className="row">
          <p className="col-4">Giá bán</p>
          {sp.makm ? (
            <p className="col-8">
              <span className="fw-bold text-decoration-line-through text-danger me-2 ">{sp.gia1dv.toLocaleString()} VNĐ</span>
              <span className="fw-bold text-success">{sp.gia_khuyenmai.toLocaleString()} VNĐ</span>
            </p>
          ) : (
          <p className="col-8">{sp.gia1dv.toLocaleString()} VNĐ</p>
          )}
        </div>
        <div className="row">
          <p className="col-4">Đơn vị</p>
          <p className="col-8">{sp.donvitinh}</p>
        </div>
        <div className="row">
          <p className="col-4">Xuất xứ</p>
          <p className="col-8">{sp.xuatxu}</p>
        </div>
      </div>
    </div>
  );
}
