import { useContext } from "react";
import "./style.css";
import { GoEyeClosed } from "react-icons/go";
import { CardContext } from "../../Context";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProjectDetail = () => {
  const context = useContext(CardContext);
  const fotos = context.projectToShow.image;
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 2000,
  };
  console.log(fotos);

  return (
    <aside
      className={`${
        context.isProjectDetailOpen ? "flex" : "hidden"
      } project-detail flex flex-col fixed items-center w-3/4 md:w-1/5 lg:1/5 md:right-5 border border-orange-400 rounded-lg bg-gray-800 text-white overflow-y-auto h-3/4  `}
    >
      <div className="flex flex-row  justify-between w-full  p-6 ">
        <h2 className=" font-medium text-xl text-orange-600">Descripción</h2>
        <GoEyeClosed
          className=" text-orange-700 cursor-pointer size-7 "
          onClick={() => context.closeProjectDetail()}
        ></GoEyeClosed>
      </div>
      <div className=" w-3/4">
        {fotos && fotos.length > 1 && (
          <Slider {...settings}>
            {fotos.map((image, index) => (
              <div
                key={index}
                className="border border-spacing-10 border-orange-400 rounded-sm"
              >
                <img src={image} alt={image} />
              </div>
            ))}
          </Slider>
        )}
        {fotos && fotos.length <= 1 && (
          <img
            src={fotos}
            alt={fotos}
            className="border border-spacing-10 rounded-sm"
          />
        )}
      </div>

      <p className="flex flex-col p-6 gap-3">
        <span className=" font-medium text-2xl">
          {context.projectToShow.company}
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
