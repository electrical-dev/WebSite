import Layout from "../../Components/Layout";
import { NavLink } from "react-router-dom";
import "./index.css";
import i1 from "../../assets/I1.png";

function Home() {
  return (
    <div className=" fondo-pantalla ">
      <Layout className=" fondo-pantalla ">
        <div className=" flex items-center justify-center relative h-screen md:text-2xl text-sm font-light text-white">
          <div className="flex-1 text-right ">
            Diseñador <span className=" text-orange-500">Electricista </span>
            Freelance
          </div>
          <div className=" m-10 ">
            <NavLink
              to="/about-me"
              className={({ isActive }) => (isActive ? activeStyle : undefined)}
            >
              <img
                src={i1}
                alt={i1}
                className="md:w-full md:h-full  w-20 h-20 object-cover transition-transform transform hover:scale-125"
              />
            </NavLink>
          </div>
          <div className="flex-1 text-left ">
            David <span className=" text-orange-500">Avila</span>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default Home;
