import React, { useState, useEffect } from "react";
import axios from "axios";

export default function QuanLiDonHang() {
  const [orders, setOrders] = useState([]); // MUST BE array
  const [status, setStatus] = useState("");

  // Load danh sách hóa đơn
  const loadOrders = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/hoadon/", {
        params: { status: status }
      });
      setOrders(res.data.data || []); // always array
    } catch (error) {
      console.log("Lỗi tải hóa đơn:", error);
      setOrders([]);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [status]);

  // Hàm đổi trạng thái
  const changeStatus = async (mahd, changeStatus) => {
    try {
      await axios.post("http://127.0.0.1:8000/api/change_status/", {
        mahd,
        changeStatus
      });

      loadOrders(); // reload after updating
    } catch (err) {
      console.error(err);
    }
  };

  // Màu cho trạng thái hóa đơn
const statusColor = (status) => {
  if (!status) return "";

  const s = status.toUpperCase();

  if (s === "HOÀN THÀNH") return "text-success fw-bold";
  if (s === "ĐANG CHỜ") return "text-warning fw-bold";
  if (s === "ĐANG GIAO") return "text-primary fw-bold";
  if (s === "ĐÃ HỦY") return "text-danger fw-bold";

  return "";
};

// Màu cho phương thức thanh toán
const paymentColor = (method) => {
  if (!method) return "";
  if (method === "Cash") return "text-success fw-bold";
  if (method === "Bank") return "text-warning fw-bold";
  return "";
};


  return (
    <div className="container-fluid py-4">
      <h1 className="fw-bold text-danger text-center">QUẢN LÍ ĐƠN HÀNG</h1>

      {/* Filter */}
      <div className="col-md-4 mb-3">
        <label className="form-label fw-semibold">Lọc trạng thái:</label>
        <select
          className="form-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Tất cả</option>
          <option value="HOÀN THÀNH">Hoàn thành</option>
          <option value="ĐANG CHỜ">Đang chờ</option>
          <option value="ĐANG GIAO">Đang giao</option>
          <option value="ĐÃ HỦY">Đã hủy</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-responsive shadow-sm rounded-3">
        <table className="table table-bordered text-center table-hover align-middle">
          <thead className="table-success text-uppercase fw-semibold">
            <tr>
              <th>Hóa Đơn</th>
              <th>Ngày đặt</th>
              <th>Ngày giao</th>
              <th>PT giao hàng</th>
              <th>Trạng thái</th>
              <th>Thanh toán</th>
              <th>Khách</th>
              <th>Khuyến mãi</th>
              <th>NV giao</th>
              <th>Tổng cộng</th>
              <th>Thay đổi</th>
            </tr>
          </thead>

          <tbody>
            {orders && orders.length > 0 ? (
                orders.map((item) => (
                <tr key={item.mahd}>
                    <td>{item.mahd}</td>
                    <td>{item.ngaydat}</td>
                    <td>{item.ngaygiao}</td>
                    <td>{item.phuongthucgh}</td>

                    {/* MÀU TRẠNG THÁI */}
                    <td className={statusColor(item.trangthaihd)}>
                    {item.trangthaihd}
                    </td>

                    {/* MÀU THANH TOÁN */}
                    <td className={paymentColor(item.phuongthucthtoan)}>
                    {item.phuongthucthtoan}
                    </td>

                    <td>{item.makh}</td>
                    <td>{item.makm}</td>
                    <td>{item.manv}</td>
                    <td>{item.tongtien} VNĐ</td>

                    <td>
                    {item.trangthaihd === "ĐANG CHỜ" ? (
                        <button
                        className="btn btn-warning text-white fw-semibold w-100"
                        onClick={() => changeStatus(item.mahd, "ĐANG GIAO")}
                        >
                        Duyệt giao
                        </button>
                    ) : item.trangthaihd === "ĐANG GIAO" ? (
                        <button
                        className="btn btn-primary text-white fw-semibold w-100"
                        onClick={() => changeStatus(item.mahd, "HOÀN THÀNH")}
                        >
                        Đã giao
                        </button>
                    ) : (
                        <button className="btn btn-secondary fw-semibold w-100" disabled>
                        Không khả dụng
                        </button>
                    )}
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan="11">Không có dữ liệu</td>
                </tr>
            )}
            </tbody>

        </table>
      </div>    
    </div>
  );
}
