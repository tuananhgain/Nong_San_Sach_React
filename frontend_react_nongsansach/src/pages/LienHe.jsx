export default function LienHe() {
  return (
    <div className="container my-5 contact-info-section" style={{fontFamily:'Times New Roman, Times, serif'}}>
        <div className="card shadow-sm border-0 p-4">
            <h2 className="mb-3 text-success">Liên hệ với Nông Sản Sạch</h2>
            <p className="text-muted mb-4">Nếu bạn có bất kỳ câu hỏi, góp ý hoặc cần hỗ trợ, vui lòng liên hệ qua thông tin dưới đây. Chúng tôi sẽ phản hồi sớm nhất có thể.</p>

            <div className="row g-4">
                <div className="col-md-4 d-flex">
                    <div className="me-3 text-success fs-4">
                        <i className="bi bi-telephone-fill"></i>
                    </div>
                    <div>
                        <h6 className="fw-bold mb-1">Hotline hỗ trợ</h6>
                        <p className="mb-0 text-muted">(+84) 889 803 789</p>
                        <small className="text-secondary">Thứ 2 - Thứ 6: 8:00 - 17:00</small>
                    </div>
                </div>

                <div className="col-md-4 d-flex">
                    <div className="me-3 text-success fs-4">
                        <i className="bi bi-envelope-fill"></i>
                    </div>
                    <div>
                        <h6 className="fw-bold mb-1">Email liên hệ</h6>
                        <p className="mb-0 text-muted">support@nongsansach.vn</p>
                        <small className="text-secondary">Chúng tôi phản hồi trong vòng 24 giờ</small>
                    </div>
                </div>

                <div className="col-md-4 d-flex">
                    <div className="me-3 text-success fs-4">
                        <i className="bi bi-geo-alt-fill"></i>
                    </div>
                    <div>
                        <h6 className="fw-bold mb-1">Địa chỉ</h6>
                        <p className="mb-0 text-muted">Phường Chánh Hưng, TP. Hồ Chí Minh</p>
                        <small className="text-secondary">Xem bản đồ Google Maps</small>
                    </div>
                </div>

                <div className="text-center text-muted small">
                    <p className="mb-1">Bạn có thể xem thêm <a href="#" className="text-success text-decoration-none">chính sách giao hàng</a> hoặc <a href="#" className="text-success text-decoration-none">đổi trả</a>.</p>
                </div>
            </div>
        </div>
    </div>
  );
}
