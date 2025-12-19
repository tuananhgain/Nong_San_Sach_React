import React, { useEffect, useState } from "react";
import axios from "axios";

export default function KhuyenMaiList() {
    const [kmList, setKmList] = useState([]);
    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);

    // Form state
    const [tenKM, setTenKM] = useState("");
    const [ngayBatDau, setNgayBatDau] = useState("");
    const [ngayKetThuc, setNgayKetThuc] = useState("");
    const [phanTramGiam, setPhanTramGiam] = useState("");

    // Gọi API GET
    const loadData = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/quanli_khuyenmai/");
            setKmList(res.data.data);
        } catch (error) {
            console.log(error);
            setMessage("Lỗi tải dữ liệu!");
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Xóa khuyến mãi
    const handleDelete = async (makm) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa khuyến mãi này?")) return;

        try {
            await axios.post("http://localhost:8000/api/xoa_khuyenmai/", { makm });
            setMessage("Đã xóa khuyến mãi!");
            loadData();
        } catch (error) {
            setMessage("Lỗi xóa khuyến mãi!");
        }
    };

    // Thêm khuyến mãi
    const handleAddKM = async () => {
        if (!tenKM || !ngayBatDau || !ngayKetThuc || !phanTramGiam) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (new Date(ngayKetThuc) <= new Date(ngayBatDau)) {
            alert("Ngày kết thúc phải sau ngày bắt đầu!");
            return;
        }

        try {
            await axios.post("http://localhost:8000/api/them_khuyenmai/", {
                tenKM,
                ngayBatDau,
                ngayKetThuc,
                phanTramGiam,
            });

            setMessage("Đã thêm khuyến mãi!");
            setShowModal(false);
            loadData();

            // Reset form
            setTenKM("");
            setNgayBatDau("");
            setNgayKetThuc("");
            setPhanTramGiam("");

        } catch (error) {
            setMessage("Lỗi thêm khuyến mãi!");
        }
    };

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString("vi-VN");
    };

    return (
        <div className="container py-4">
            <h1 className="text-center text-danger fw-bold mb-4">
                Danh sách khuyến mãi
            </h1>

            {/* Thông báo */}
            {message && <div className="alert alert-info">{message}</div>}

            {/* Nút mở popup */}
            <button
                className="btn btn-warning mb-3"
                onClick={() => setShowModal(true)}
            >
                <i className="bi bi-plus-circle"></i> Thêm khuyến mãi
            </button>
            {/* Bảng */}
            <div className="table-responsive">
                <table className="table table-striped table-hover text-center">
                    <thead className="table-success">
                        <tr>
                            <th>Mã KM</th>
                            <th>Tên khuyến mãi</th>
                            <th>Ngày BD</th>
                            <th>Ngày KT</th>
                            <th>Giảm (%)</th>
                            <th>Hủy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {kmList.length > 0 ? (
                            kmList.map((km) => (
                                <tr key={km.makm}>
                                    <td>{km.makm}</td>
                                    <td>{km.tenkm}</td>
                                    <td>{formatDate(km.ngaybd)}</td>
                                    <td>{formatDate(km.ngaykt)}</td>
                                    <td className="fw-bold text-success">{km.giamgia}%</td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(km.makm)}
                                        >
                                            <i className="bi bi-trash">Hủy</i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-muted py-3">
                                    Không có khuyến mãi nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ================= POPUP (MODAL) ================= */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content shadow">

                            <div className="modal-header">
                                <h5 className="modal-title">Thêm khuyến mãi</h5>
                                <button className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>

                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Tên khuyến mãi</label>
                                    <input type="text"
                                        className="form-control"
                                        value={tenKM}
                                        onChange={(e) => setTenKM(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Ngày bắt đầu</label>
                                    <input type="date"
                                        className="form-control"
                                        value={ngayBatDau}
                                        onChange={(e) => setNgayBatDau(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Ngày kết thúc</label>
                                    <input type="date"
                                        className="form-control"
                                        value={ngayKetThuc}
                                        onChange={(e) => setNgayKetThuc(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Giảm giá (%)</label>
                                    <input type="number"
                                        className="form-control"
                                        value={phanTramGiam}
                                        onChange={(e) => setPhanTramGiam(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Đóng
                                </button>

                                <button
                                    className="btn btn-success"
                                    onClick={handleAddKM}
                                >
                                    Thêm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CSS fix modal */}
            <style>{`
                .modal {
                    background: rgba(0,0,0,0.5);
                }
            `}</style>
        </div>
    );
}
