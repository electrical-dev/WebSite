import { useContext } from "react";
import { CardContext } from "../../Context";
import {
  MdOutlineHomeWork,
  MdOutlineElectricalServices,
  MdOutlineElectricBolt,
} from "react-icons/md";
import { AiFillTool } from "react-icons/ai";
import {} from "react-icons/md";

const CardProject = (data) => {
  const context = useContext(CardContext);
  const showProject = (projectDetail) => {
    context.openProjectDetail();
    context.setProjectToShow(projectDetail);
  };

  return (
    <div className="flex flex-col justify-between items-center md:px-12 md:flex-row gap-1 md:gap-5 xl:w-3/5 2xl:w-1/2 w-3/4 md:h-auto h-100  bg-gray-300  rounded-lg border border-double border-orange-700 p-5">
      <div className="flex flex-col md:w-3/4 ">
        <p className="flex flex-grow items-center gap-1 text-base md:text-lg font-medium">
          <MdOutlineElectricBolt className=" h-5 text-orange-500" />
          <span className="w-10/12"> {data.data.name}</span>
        </p>
        <p className="flex flex-grow items-center  gap-1 text-base md:text-lg font-light">
          <MdOutlineHomeWork className=" size-5 text-orange-500" />
          <span className="w-10/12">{data.data.company}</span>
        </p>
        <p className="flex flex-grow items-center  gap-1 text-sm  md:text-base font-extralight italic">
          <AiFillTool className=" size-5 text-orange-500" />
          <span className="w-10/12">{data.data.category}</span>
        </p>
        <p
          className="  flex flex-grow items-end justify-end gap-2 text-sm md:text-base font-extralight italic  text-orange-600 cursor-pointer mr-10"
          onClick={() => showProject(data.data)}
        >
          <span className=" underline">...ver mas</span>
          <MdOutlineElectricalServices />
        </p>
      </div>
      <img
        className="flex md:h-36    h-36  w-3/4 md:w-1/2 object-cover rounded-lg"
        src={data.data.image[0]}
        alt={data.data.name}
      />
    </div>
  );
};

export default CardProject;
