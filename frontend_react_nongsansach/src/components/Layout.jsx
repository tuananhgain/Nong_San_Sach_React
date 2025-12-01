import Header from "./Header";
import SidebarDanhMuc from "./SidebarDM";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Header />

      <section className="py-5">
        <div className="container">
          <div className="row">

            {/* Sidebar */}
            <div className="col-md-2">
              <SidebarDanhMuc />
            </div>

            {/* Nội dung trang */}
            <div className="col-md-10">
              <Outlet />
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
