import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ThongKeHoaDon() {
    const [listHD, setListHD] = useState([]);
    const [filter, setFilter] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchData = async (value) => {
        setLoading(true);
        try {
            const res = await axios.get(
                `http://127.0.0.1:8000/api/thongke_hoadon/?time=${value || ""}`
            );
            setListHD(res.data.data);
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData(filter);
    }, [filter]);

    return (
        <div className="container py-4">
            <h1 className="text-center text-success text-uppercase fw-bold mb-4">
                Thống Kê Đơn Hàng
            </h1>

            {/* Filter */}
            <div className="d-flex align-items-center gap-3 mb-4">
                <label className="fw-semibold">Thống kê:</label>
                <select
                    className="form-select w-auto shadow-sm rounded-3"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="">Tất cả</option>
                    <option value="Theo Ngày">Theo Ngày</option>
                    <option value="Theo Tuần">Theo Tuần</option>
                    <option value="Theo Tháng">Theo Tháng</option>
                    <option value="Theo Năm">Theo Năm</option>
                </select>
            </div>

            {/* Table */}
            <div className="table-responsive shadow-sm rounded-3">
                <table className="table table-hover table-striped align-middle text-center">
                    <thead className="table-success text-uppercase">
                        <tr>
                            <th>Hóa Đơn</th>
                            <th>Ngày đặt</th>
                            <th>Tổng cộng</th>
                            <th>Trạng thái</th>
                            <th>Khách hàng</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="py-4 text-muted">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : listHD.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-4 text-muted fst-italic">
                                    Không có hóa đơn nào.
                                </td>
                            </tr>
                        ) : (
                            listHD.map((hd) => (
                                <tr key={hd.mahd}>
                                    <td className="fw-semibold">{hd.mahd}</td>
                                    <td>{hd.ngaydat}</td>
                                    <td className="fw-bold text-success">
                                        {Number(hd.tongtien).toLocaleString()} VNĐ
                                    </td>

                                    {/* Màu trạng thái */}
                                    <td
                                        className={
                                            "fw-semibold " +
                                            (hd.trangthaihd === "HOÀN THÀNH"
                                                ? "text-success"
                                                : hd.trangthaihd === "ĐANG CHỜ"
                                                ? "text-warning"
                                                : hd.trangthaihd === "ĐANG GIAO"
                                                ? "text-primary"
                                                : hd.trangthaihd === "ĐÃ HỦY"
                                                ? "text-danger"
                                                : "")
                                        }
                                    >
                                        {hd.trangthaihd}
                                    </td>

                                    <td>{hd.tenkh}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* CSS */}
            <style>
                {`
                    h1 { letter-spacing: 1px; }
                    .table-hover tbody tr:hover { background-color: #e9f7ef; }
                    .form-select:focus { box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25); }
                `}
            </style>
        </div>
    );
}
