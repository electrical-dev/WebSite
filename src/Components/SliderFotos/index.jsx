import { CardContext } from "../../Context";
import { useContext } from "react";
import Slider from "react-slick";
import React, { useState } from "react";

const SliderFotos = () => {
  const [indiceActual, setIndiceActual] = useState(0);
  const context = useContext(CardContext);
  const fotos = context.projectToShow.image;

  const settings = {
    slidesToShow: fotos.length > 3 ? 3 : fotos.length,
    dots: true,
    arrows: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: fotos.length > 2 ? 2 : fotos.length,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Fragment>
      {fotos.length > 0 && (
        <div>
          <Slider {...settings}>
            {fotos.map((foto, index) => (
              <div key={index} className="imagen-slider">
                <img src={foto} alt={foto} />
              </div>
            ))}
          </Slider>
        </div>
      )}
    </Fragment>
  );
};
export default SliderFotos;
