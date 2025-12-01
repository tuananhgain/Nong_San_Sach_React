import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/khuyenmai.css";

export default function SidebarDanhMuc() {
  const [dsdm, setDsdm] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/danhmuc/")
      .then((res) => res.json())
      .then((data) => setDsdm(data.dsdm));
  }, []);

  return (
    <div className=" category-sidebar textall">
      <h2 className="bg-success text-white text-center">
        DANH MỤC SẢN PHẨM
      </h2>

      <ul className="nav flex-column">
      {dsdm.map((dm) => (
        <li key={dm.madm} className="nav-item border p-2 ">
          <Link to={`/danhmuc/${dm.madm}`} className="nav-link text-success ">
            {dm.tendm}
          </Link>
        </li>
      ))}
      </ul>
    </div>
  );
}
