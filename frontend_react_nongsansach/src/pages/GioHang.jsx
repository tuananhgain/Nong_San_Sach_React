import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OpenCart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/open_cart/", {
                withCredentials: true
            });
            setCart(res.data.cart);
        } catch (err) {
            console.error("Lỗi tải giỏ hàng:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // 🟢 API cập nhật số lượng
    const updateQuantity = async (masp, delta) => {
        await axios.post(
            "http://127.0.0.1:8000/api/update_quantity/",
            { masp, quantityChange: delta },
            { withCredentials: true }
        );
        fetchCart();
    };

    // 🟢 API xóa sản phẩm
    const removeItem = async (masp) => {
        await axios.post(
            "http://127.0.0.1:8000/api/remove_from_cart/",
            { product_id: masp },
            { withCredentials: true }
        );
        fetchCart();
    };

    if (loading) return <h3 className="text-center mt-5">Đang tải giỏ hàng...</h3>;
    if (!cart || !cart.listSP ||cart.listSP.length === 0)
        return <h3 className="text-center mt-5">Giỏ hàng trống.</h3>;

    return (
        <div className="container py-4" style={{fontFamily:"Times New Roman"}}>
            <h1 className="text-center fw-bold mb-4">Giỏ hàng</h1>

            <div className="row fw-bold border-bottom pb-2 text-center">
                <div className="col-2"></div>
                <div className="col-3">Sản phẩm</div>
                <div className="col-2">Số lượng</div>
                <div className="col-2">Giá 1 sản phẩm</div>
                <div className="col-2">Tổng cộng</div>
                <div className="col-1"></div>
            </div>

            {cart.listSP.map((item) => (
                <div className="row align-items-center text-center py-3 border-bottom" key={item.masanpham}>
                    <div className="col-2">
                        <img
                            src={`HinhAnh/Hình ${item.masanpham}/HINH1.jfif`}
                            className="img-fluid rounded"
                            alt={item.tensanpham}
                        />
                    </div>

                    <div className="col-3">{item.tensanpham}</div>

                    <div className="col-2">
                        <button
                            className="btn btn-light btn-sm"
                            onClick={() => updateQuantity(item.masanpham, -1)}
                        >
                            -
                        </button>
                        <span className="mx-2">{item.soluong}</span>
                        <button
                            className="btn btn-light btn-sm"
                            onClick={() => updateQuantity(item.masanpham, 1)}
                        >
                            +
                        </button>
                    </div>

                    <div className="col-2">
                        {Number(item.giatien).toLocaleString()} VNĐ
                    </div>

                    <div className="col-2 fw-bold text-success">
                        {Number(item.tong_tien).toLocaleString()} VNĐ
                    </div>

                    <div className="col-1">
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => removeItem(item.masanpham)}
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            ))}

            <div className="text-end fw-bold fs-4 mt-4">
                Tổng cộng: {Number(cart.tong_tien).toLocaleString()} VNĐ
            </div>

            <div className="d-flex justify-content-between mt-3">
                <a href="/trangsanpham" className="btn btn-secondary">
                    Tiếp tục mua sắm
                </a>
                <a href="/thanhtoan" className="btn btn-primary">
                    Thanh toán
                </a>
            </div>
        </div>
    );
}
