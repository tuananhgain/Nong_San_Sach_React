import Header2 from "./Header2";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function Layout2() {
  return (
    <>
      <Header2 />

      <section className="py-3">
        <div className="container" style={{flex:1, minHeight: 500}}>
          <Outlet />
        </div>
      </section>

      <Footer />
    </>
  );
}
