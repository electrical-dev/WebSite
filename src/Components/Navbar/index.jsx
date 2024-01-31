import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ImMenu } from "react-icons/im";
import { GoEyeClosed } from "react-icons/go";
import f1 from "../../assets/f-o.png";
import f2 from "../../assets/f-w.png";
import f3 from "../../assets/tower.png";

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("");
  const navigate = useNavigate();

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

  let Links = [
    { name: "INICIO", link: "/" },
    { name: "ACERCA DE MI", link: "/about-me" },
    { name: "SERVICIOS", link: "/services" },
    { name: "PROYECTOS", link: "/projects" },
    { name: "CONTACTAME", link: "/contac-me" },
  ];
  let [isOpen, setIsOpen] = useState(false);
  return (
    <div className="shadow-md w-full fixed top-0 left-0">
      <div className="md:flex items-center justify-between bg-black py-2 md:px-10 px-7">
        <div>
          <img
            src={logoImages[imageTranstion()]}
            className=" md:size-20 size-16 "
          />
        </div>

        {/* menu icon */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="text-3xl absolute right-8 top-6 cursor-pointer md:hidden "
        >
          {isOpen ? (
            <GoEyeClosed className=" text-orange-500" />
          ) : (
            <ImMenu className=" text-orange-500 " />
          )}
        </div>
        {/* nav links here */}
        <ul
          className={`md:flex   md:items-center md:pb-0 pb-0 absolute md:static md:z-auto z-[-1] right-0 md:w-auto md:pl-0  pl-5 pr-5 transition-all duration-500 ease-in ${
            isOpen ? "top-20 bg-black " : "top-[-460px]"
          } md:opacity-100 `}
        >
          {Links.map((link) => (
            <li key={link.name} className=" md:ml-8 md:text-base md:my-0 my-3">
              <Link
                to={link.link}
                className={`text-white hover:text-orange-400  ${
                  activeSection === link.name ? "text-orange-600 underline" : "" // Agrega la clase para la sección activa
                }`}
                onClick={() => {
                  navigate(link.link); // Navega a la ruta
                  setActiveSection(link.name); // Actualiza el estado
                }}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
