import { NavLink } from "react-router-dom";
import "./index.css";
import Layout from "../../Components/Layout";
import i1 from "../../assets/I1.png";

function Home() {
  return (
    <div className="fondo-pantalla text-white  h-auto w-full flex justify-center bg-gray-800">
      <Layout>
        <div className=" flex flex-col md:flex-row md:w-3/4 justify-center items-center gap-5 ">
          <p className="flex-1 md:w-80 md:text-right text-center text-xl md:text-2xl">
            <span className=" "> Soluciones </span>
            <br />
            <span className=" "> en Ingenieria</span>
            <br />
            <span className=" "> Eléctrica </span>
          </p>

          <img
            src={i1}
            alt={i1}
            className="flex-1 md:h-full  md:w-40  h-40 object-cover transition-transform transform hover:scale-110"
          />
          <p className="flex-1 md:w-80 md:text-left text-center text-xl md:text-2xl">
            <span className=" text-orange-500"> David Avila </span>
          </p>
        </div>
      </Layout>
    </div>
  );
}

export default Home;
