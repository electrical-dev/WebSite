import Layout from "../../Components/Layout";
import { NavLink } from "react-router-dom";
import "./index.css";
import i1 from "../../assets/I1.png";

function Home() {
  const tab = "\u00A0";
  return (
    <div className="fondo-pantalla flex items-center justify-center w-full   h-screen">
      <div className=" md:flex  md:justify-items-center md:relative  md:items-center  md:text-2xl text-lg font-light text-white">
        <div className="flex md:flex-col md:flex-1 md:text-right md:m-0 m-10 justify-center md:max-w-40">
          Ingenieria
          <span className=" text-orange-500">{tab}Electrica </span>
        </div>
        <div className="flex  md:flex-1 m-10 md:m-10 justify-center">
          <NavLink to="/about-me">
            <img
              src={i1}
              alt={i1}
              className="md:w-full md:h-full  w-40 h-40 object-cover transition-transform transform hover:scale-125"
            />
          </NavLink>
        </div>
        <div className="flex md:flex-col md:flex-1 md:justify-self-start md:m-0 m-10 justify-center">
          David{tab} <span className=" text-orange-500"> Avila</span>
        </div>
      </div>
    </div>
  );
}

export default Home;
