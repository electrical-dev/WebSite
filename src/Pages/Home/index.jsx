import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import "./index.css";
import Layout from "../../Components/Layout";
import i1 from "../../assets/i1.webp";
import i2 from "../../assets/i2.webp";
import i3 from "../../assets/i3.webp";
import i4 from "../../assets/i4.webp";

function Home() {
  const logoImages = [i1, i3, i2, i4];
  const useImageTransition = () => {
    const [currentImage, setCurrentImage] = useState(0);

    const changeImage = () => {
      setCurrentImage((currentImage + 1) % logoImages.length);
    };

    useEffect(() => {
      const intervalo = setInterval(changeImage, 2000);
      return () => clearInterval(intervalo);
    }, [currentImage]);

    return currentImage;
  };

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
            src={logoImages[useImageTransition()]}
            alt={i1}
            className="flex-1 md:h-full  md:w-40  h-40 object-cover transition-transform transform hover:scale-110  border-2 border-orange-400 rounded-full"
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
