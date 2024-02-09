import { useContext } from "react";
import { CardContext } from "../../Context";

const CardProject = (data) => {
  const context = useContext(CardContext);
  const showProject = (projectDetail) => {
    context.openProjectDetail();
    context.setProjectToShow(projectDetail);
  };

  return (
    <div className="flex flex-col justify-center items-center md:flex-row gap-1 md:gap-5 md:w-1/2 w-3/4 md:h-auto h-80  bg-white  rounded-lg border border-double border-orange-700 p-5">
      <div className="flex-1 md:text-right">
        <p>
          <span className=" text-lg font-medium">{data.data.name}</span>
        </p>
        <p>
          <span className=" text-lg font-light">{data.data.company}</span>
        </p>
        <p>
          <span className=" text-base font-extralight italic">
            {data.data.category}
          </span>
        </p>
        <p>
          <span
            className=" text-base font-extralight italic  text-orange-300 cursor-pointer "
            onClick={() => showProject(data.data)}
          >
            ver mas ...
          </span>
        </p>
      </div>
      <img
        className="flex-1 md:h-36    h-36 object-cover rounded-lg"
        src={data.data.image}
        alt={data.data.name}
      />
    </div>
  );
};

export default CardProject;
