import {
  AiFillMail,
  AiFillLinkedin,
  AiOutlineWhatsApp,
  AiFillGithub,
  AiOutlineCopyright,
} from "react-icons/ai";

const Footer = () => {
  const tab = "\u00A0";
  return (
    <nav className="md:flex  md:justify-between md:items-center fixed z-20 py-1 bottom-0 w-full  gap-6 px-10  bg-gray-800 text-white">
      <div className="flex justify-center text-sm py-2 ">
        <span className=" font-bold ">Copyright</span>
        <AiOutlineCopyright className=" text-orange-500" />
        {tab + tab} 2024 David Avila - Dev
      </div>
      <ul className="flex justify-center gap-6">
        <li>
          <a
            href="mailto:dsavilav@unal.edu.co"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fas fa-icono"></i>
            <AiFillMail className=" size-6 " alt="mail-icon" />
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/davidavila1992/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fas fa-icono"></i>
            <AiFillLinkedin className=" size-6 " alt="linkedin-icon" />
          </a>
        </li>
        <li>
          <a
            href="https://wa.link/doo55i"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fas fa-icono"></i>
            <AiOutlineWhatsApp className=" size-6 " alt="whatsapp-icon" />
          </a>
        </li>

        <li>
          <a
            href="https://github.com/electrical-dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fas fa-icono"></i>
            <AiFillGithub className=" size-6  " alt="github-icon" />
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Footer;
