import {
  AiFillMail,
  AiFillLinkedin,
  AiOutlineWhatsApp,
  AiFillGithub,
  AiOutlineCopyright,
} from "react-icons/ai";

const Footer = () => {
  return (
    <nav className="flex justify-between items-center fixed z-20 bottom-0 w-full py-2 px-10  bg-black text-white">
      <div className="flex text-sm ">
        <span className=" font-bold ">Copyright</span>
        <AiOutlineCopyright className=" text-orange-500" />
        2024 David Avila - Dev
      </div>
      <ul className="flex items-center gap-6">
        <li>
          <a
            href="mailto:dsavilav@unal.edu.co"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fas fa-icono"></i>
            <AiFillMail className=" size-6 " />
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/davidavila1992/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fas fa-icono"></i>
            <AiFillLinkedin className=" size-6 " />
          </a>
        </li>
        <li>
          <a
            href="https://wa.link/doo55i"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fas fa-icono"></i>
            <AiOutlineWhatsApp className=" size-6 " />
          </a>
        </li>

        <li>
          <a
            href="https://github.com/electrical-dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fas fa-icono"></i>
            <AiFillGithub className=" size-6 " />
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Footer;
