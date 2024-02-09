import { useContext } from "react";
import "./style.css";
import { RxEyeClosed } from "react-icons/rx";
import { CardContext } from "../../Context";

const ProjectDetail = () => {
  const context = useContext(CardContext);

  return (
    <aside
      className={`${
        context.isProjectDetailOpen ? "flex" : "hidden"
      } project-detail flex flex-col fixed right-5 border border-black rounded-lg bg-white `}
    >
      <div className="flex justify-between items-center p-6 ">
        <h2 className=" font-medium text-xl ">Detail</h2>
        <div>
          <RxEyeClosed
            className=" text-blue-700 cursor-pointer "
            onClick={() => context.closeProjectDetail()}
          ></RxEyeClosed>
        </div>
      </div>
      <figure className=" px-6">
        <img
          className=" w-full h-full rounded-lg"
          src={context.projectToShow.image}
          alt={context.projectToShow.name}
        ></img>
      </figure>
      <p className="flex flex-col p-6">
        <span className=" font-medium text-2xl">
          $ {context.projectToShow.price}
        </span>
        <span className=" font-medium text-md">
          {context.projectToShow.name}
        </span>
        <span className=" font-light text-sm">
          {context.projectToShow.description}
        </span>
      </p>
    </aside>
  );
};

export default ProjectDetail;
