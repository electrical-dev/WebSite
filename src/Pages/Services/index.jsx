import Layout from "../../Components/Layout";
import f1 from "../../assets/bombilla.webp";
import f2 from "../../assets/Ing1.webp";
import f3 from "../../assets/motor.webp";
import f4 from "../../assets/plano.webp";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { color, motion } from "framer-motion";
import "./index.css";

function Services() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const data = [
    {
      id: 1,
      tittle: "DISEÑO DE ILUMINACION",
      img: f1,
      review1: "1- Eficiente y estéticamente agradable.",
      review2:
        "2- Experiencia en el uso de herramientas y técnicas de iluminación avanzadas como DIALUX .",
      review3:
        "3- Alumbrado publico, ecenarios deportivos y iluminacion de interiores.",
      review4: "",
    },
    {
      id: 2,
      tittle: "DISEÑO ELECTRICO",
      img: f2,
      review1:
        "1- Diseño de instalaciones en: areas clasificadas, residencial, comercial e industrial.",
      review2: "2- Experiencia con software.  (Etap, Elecal y mas)",
      review3: "3- Apantallamiento y SPT.",
      review4: "4- Coordinacion de protecciones.",
    },
    {
      id: 3,
      tittle: "ESTUDIOS ELECTRICOS",
      img: f3,
      review1: "1- Medicion de aislamiento y puesta a tierra.",
      review2: "2- Termografia.",
      review3: "3- Analisis de calidad de energia.",
      review4: "4- Analisis de fallas electricas.",
    },
    {
      id: 4,
      tittle: "PLANIMETRIA",
      img: f4,
      review1: "1- Dibujo 2d. (AutoCAD)",
      review2: "2- Dibujo 3d. (AutoCAD y REVIT)",
      review3: "3- Diagramas unifilares.",
      review4: "4- Diagramas de control.",
    },
  ];

  return (
    <div className="fondo-pantalla3 bg-center  md:bg-cover h-auto flex justify-center">
      <Layout>
        {/* <h1 className="text-white text-center mb-2  text-sm md:text-2xl font-semibold ">
          Servicios
        </h1> */}
        <div className=" w-72 md:w-80 lg:w-80 xl:w-80 ">
          {/* pantalla Grande */}
          <div className=" lg:flex sm:gap-6 md:gap-1 lg:gap-6 xl:gap-24  h-1/2 justify-center hidden ">
            {data.map((d) => (
              <div
                key={d.id}
                className="  bg-gray-800 h-[450px]  rounded-xl border border-orange-500"
              >
                <div className="h-56 w-56 rounded-full m-2 bg-gray-400 hover:bg-slate-100 flex items-center ">
                  <motion.img
                    src={d.img}
                    alt=""
                    className="size-auto "
                    animate={{
                      scale: [1, 1, 1, 1, 1],
                      rotate: [0, -15, 0, 15, 0],
                    }}
                    whileHover={{ scale: 1.1, transition: { duration: 0.5 } }}
                  />
                </div>
                <div className=" flex flex-col justify-center items-center gap-1  mx-4 ">
                  <motion.h2
                    className="text-sm text-white font-semibold"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    variants={{
                      hidden: { opacity: 0, x: 100 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    {d.tittle}
                  </motion.h2>
                  <motion.div
                    className="text-sm text-white "
                    whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    variants={{
                      hidden: { opacity: 0, x: 100 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    <p> {d.review1}</p>
                    <p> {d.review2}</p>
                    <p> {d.review3}</p>
                    <p> {d.review4}</p>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
          {/* pantalla Celular */}
          <div className="  lg:hidden ">
            <Slider {...settings}>
              {data.map((d) => (
                <div
                  key={d.id}
                  className=" flex justify-items-center bg-gray-800 h-[450px]  rounded-xl m-auto border border-orange-500 "
                >
                  <div className="h-56 w-56 rounded-full mx-8 my-2 bg-gray-300 flex justify-center items-center">
                    <motion.img
                      src={d.img}
                      alt=""
                      className="size-auto hover:scale-125"
                      animate={{
                        scale: [1, 1, 1, 1, 1],
                        rotate: [0, -15, 0, 15, 0],
                      }}
                    />
                  </div>
                  <div className="flex flex-col justify-center items-center gap-4 p-2 mx-2">
                    <motion.h2
                      className="md:text-xl text-sm text-white font-semibold"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      variants={{
                        hidden: { opacity: 0, x: 100 },
                        visible: { opacity: 1, x: 0 },
                      }}
                    >
                      {d.tittle}
                    </motion.h2>

                    <motion.div
                      className="text-sm  text-white "
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      variants={{
                        hidden: { opacity: 0, x: 100 },
                        visible: { opacity: 1, x: 0 },
                      }}
                    >
                      <p> {d.review1}</p>
                      <p> {d.review2}</p>
                      <p> {d.review3}</p>
                      <p> {d.review4}</p>
                    </motion.div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default Services;
