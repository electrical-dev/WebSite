import { useContext } from "react";
import { CardContext } from "../../Context";

const CardProject = (data) => {
  const context = useContext(CardContext);
  const showProject = (projectDetail) => {
    context.openProjectDetail();
    context.setProjectToShow(projectDetail);
  };

  return (
    <div
      className="bg-white cursor-pointer w-56 h-60 rounded-lg"
      onClick={() => showProject(data.data)}
    >
      <figure className=" relative mb-3 w-full h-4/5">
        <span className=" absolute bottom-0 left-0 bg-white/60 rounded-lg text-black text-xs m-2 px-3 py-0.5">
          {data.data.category.charAt(0).toUpperCase() +
            data.data.category.slice(1)}
        </span>
        <img
          className="w-full h-full object-cover rounded-lg"
          src={data.data.image}
          alt={data.data.name}
        />
      </figure>
      <p className=" flex justify-between">
        <span className=" text-sm font-light">{data.data.name}</span>
        <span className=" text-lg font-medium">$ {data.data.price}</span>
      </p>
    </div>
  );
};

export default CardProject;
