import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";


export default function ThanhToan() {
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shipMethod, setShipMethod] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [error, setError] = useState("");

    // 🔹 Load dữ liệu thanh toán
    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/thanhtoan/", {
                withCredentials: true,
            })
            .then((res) => {
                setData(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Không thể tải trang thanh toán");
                setLoading(false);
            });
    }, []);

    // 🔹 Đặt hàng
    const handleDatHang = async () => {
        if (!shipMethod || !paymentMethod) {
            Swal.fire({
                icon: "warning",
                title: "Thiếu thông tin",
                text: "Vui lòng chọn phương thức giao hàng và thanh toán",
                confirmButtonColor: "#198754",
            });
            return;
        }

        try {
            await axios.post(
                "http://127.0.0.1:8000/api/dathang/",
                {
                    ship_method: shipMethod,
                    payment_method: paymentMethod,
                },
                { withCredentials: true }
            );

            Swal.fire({
                icon: "success",
                title: "Đặt hàng thành công!",
                text: "Đơn hàng của bạn đang được xử lý",
                confirmButtonText: "OK",
                confirmButtonColor: "#198754",
            }).then(() => {
                navigate("/"); // hoặc "/donhang"
            });

        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Đặt hàng thất bại",
                text: err.response?.data?.message || "Có lỗi xảy ra",
                confirmButtonColor: "#dc3545",
            });
        }
    };


    if (loading) return <h3 className="text-center mt-5">Đang tải...</h3>;
    if (error) return <div className="alert alert-danger text-center">{error}</div>;

    const { cart, khach, giamgia, tong_tien_goc, tong_tien_sau_giam } = data;

    return (
        <div className="container py-5" style={{ fontFamily: "Times New Roman" }}>
            <h1 className="mb-4 text-center">Xác Nhận Thanh Toán</h1>

            {/* ✅ Thông tin khách hàng */}
            {khach && (
                <div className="card shadow-sm border-0 mb-4">
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-3">
                                <label className="fw-bold">Họ tên</label>
                                <input className="form-control" value={khach.tenkh} readOnly />
                            </div>
                            <div className="col-md-3">
                                <label className="fw-bold">Điện thoại</label>
                                <input className="form-control" value={khach.sdt} readOnly />
                            </div>
                            <div className="col-md-3">
                                <label className="fw-bold">Địa chỉ</label>
                                <input className="form-control" value={khach.diachi} readOnly />
                            </div>
                            <div className="col-md-3">
                                <label className="fw-bold">Mã KH</label>
                                <input className="form-control" value={khach.makh} readOnly />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ Danh sách sản phẩm */}
            <div className="card mb-4">
                <div className="card-header bg-success text-white text-center">
                    <strong>Sản phẩm trong giỏ hàng</strong>
                </div>
                <div className="card-body p-0">
                    <table className="table table-bordered mb-0">
                        <thead className="table-light">
                            <tr className="text-center">
                                <th>Tên sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Giá</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.listSP.map((sp) => (
                                <tr className="text-center" key={sp.masanpham}>
                                    <td>{sp.tensanpham}</td>
                                    <td>{sp.soluong}</td>
                                    <td>{Number(sp.giatien).toLocaleString()} VNĐ</td>
                                    <td className="text-danger fw-bold">
                                        {Number(sp.thanhtien).toLocaleString()} VNĐ
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ✅ Tổng tiền */}
            <div className="card mb-4">
                <div className="card-body">
                    <p><strong>Trước giảm:</strong> {tong_tien_goc.toLocaleString()} đ</p>
                    <p><strong>Giảm giá:</strong> {giamgia}%</p>
                    <p className="fs-5 text-danger">
                        <strong>Sau giảm:</strong> {tong_tien_sau_giam.toLocaleString()} đ
                    </p>
                </div>
            </div>

            {/* ✅ Phương thức giao hàng */}
            <div className="card mb-4">
                <div className="card-header bg-success text-white">
                    <strong>Phương thức giao hàng</strong>
                </div>
                <div className="card-body">
                    {["Giao hàng thường", "Giao hàng nhanh", "Giao hàng hỏa tốc"].map((m) => (
                        <div className="form-check" key={m}>
                            <input
                                className="form-check-input"
                                type="radio"
                                name="ship"
                                value={m}
                                onChange={(e) => setShipMethod(e.target.value)}
                            />
                            <label className="form-check-label">{m}</label>
                        </div>
                    ))}
                </div>
            </div>

            {/* ✅ Phương thức thanh toán */}
            <div className="card mb-4">
                <div className="card-header bg-success text-white">
                    <strong>Phương thức thanh toán</strong>
                </div>
                <div className="card-body">
                    {["Tiền mặt", "Chuyển khoản"].map((p) => (
                        <div className="form-check" key={p}>
                            <input
                                className="form-check-input"
                                type="radio"
                                name="payment"
                                value={p}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <label className="form-check-label">{p}</label>
                        </div>
                    ))}
                </div>
            </div>

            {/* ✅ Nút */}
            <div className="text-center">
                <Link to="/giohang" className="btn btn-secondary me-2">
                    ⬅ Quay lại giỏ hàng
                </Link>
                <button className="btn btn-success" onClick={handleDatHang}>
                    ✅ Xác nhận đặt hàng
                </button>
            </div>
        </div>
    );
}
