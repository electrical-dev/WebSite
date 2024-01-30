import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import f1 from "../../assets/f-o.png";
import f2 from "../../assets/f-w.png";
import f3 from "../../assets/tower.png";

const Navbar = () => {
  const activeStyle = " text-orange-500 underline decoration-orange-500";

  const logoImages = [f1, f3, f2, f1];
  const imageTranstion = () => {
    const [currentImage, setCurrentImage] = useState(0);

    const changeImage = () => {
      setCurrentImage((currentImage + 1) % logoImages.length);
    };

    useEffect(() => {
      const intervalo = setInterval(changeImage, 3000);
      return () => clearInterval(intervalo);
    }, [currentImage]);

    return currentImage;
  };

  return (
    <nav className="flex justify-between items-center fixed z-10 top-0 w-full py-2 px-10 md:text-md text-sm font-light bg-black text-white">
      <ul>
        <li>
          <img src={logoImages[imageTranstion()]} className=" size-20" />
        </li>
      </ul>
      <ul className="md:flex   md:items-center md:static transition-all duration-500 ease-in gap-6">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            INICIO
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about-me"
            className={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            ACERCA DE MI
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/services"
            className={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            SERVICIOS
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/projects"
            className={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            PROYECTOS
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contac-me"
            className={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            CONTACTAME
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
