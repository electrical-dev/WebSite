import React, { createContext, useState, useEffect } from "react";

export const Images = createContext();

const TransicionImagenes = () => {
  const imagenes = ["../../public/react.svg", "../../public/react.svg"];

  const [currentImage, setcurrentImage] = useState(0);

  const cambiarImagen = () => {
    setcurrentImage((currentImage + 1) % imagenes.length);
  };

  useEffect(() => {
    const intervalo = setInterval(cambiarImagen, 3000); // Cambia la imagen cada 3000 milisegundos (3 segundos)

    return () => clearInterval(intervalo); // Limpia el intervalo cuando el componente se desmonta
  }, [currentImage]);

  //const rootImage = imagenes[currentImage];
  //return rootImage;

  return (
    <Images.Provider
      value={{
        currentImage,
      }}
    ></Images.Provider>
  );
};
