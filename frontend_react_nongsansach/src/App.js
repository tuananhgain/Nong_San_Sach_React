import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/layout.css";
import Layout from "./components/Layout";
import Layout2 from "./components/Layout2";
import TrangChu from "./pages/TrangChu";
import SortSanPhamTheoDM from "./pages/SortSanPhamTheoDM";
import Search from "./pages/Search";
import SanPham from "./pages/SanPham";
import ChiTietSanPham from "./pages/ChiTietSanPham";
import LienHe from "./pages/LienHe";
import KhuyenMai from "./pages/KhuyenMai";
import DangKy from "./pages/DangKy";
import DangNhap from "./pages/DangNhap";
import Layout_Admin from "./components/Layout_Admin";
import QuanLyHoaDon from "./pages/QuanLy_HoaDon";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MessageProvider } from "./context/MessageContext";


export default function App() {
  return (
    <MessageProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<TrangChu />} />
          <Route path="/danhmuc/:madm" element={<SortSanPhamTheoDM />} />
          <Route path="/search" element={<Search />} />
          <Route path="/trangsanpham" element={<SanPham />} />
          <Route path="/sanpham/:masp" element={<ChiTietSanPham />} />
          <Route path="/khuyenmai" element={<KhuyenMai />} />
        </Route>
        <Route path="/dangky" element={<DangKy />} />
        <Route path="/dangnhap" element={<DangNhap/>}/>
        <Route element={<Layout2 />}>
            <Route path="/lienhe" element={<LienHe />} />
        </Route>
        <Route element={<Layout_Admin />}>
          <Route path="/quanlyhoadon" element={<QuanLyHoaDon />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </MessageProvider>
  );
}