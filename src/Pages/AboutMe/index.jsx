import Layout from "../../Components/Layout";
import i1 from "../../assets/acercaDeMi.png";

import { motion, AnimatePresence } from "framer-motion";

function AboutMe() {
  const tab = "\u00A0";
  return (
    <Layout>
      <div className="flex items-center justify-center w-full md:mt-16 mt-14 h-auto md:px-8 ">
        <div className=" md:flex  md:justify-items-center  md:items-center md:text-base text-sm font-light ">
          <motion.p
            className=" flex text-gray-800 md:flex-col md:flex-1 md:text-right md:mx-10 m-10 justify-center max-w-full top-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            variants={{
              hidden: { opacity: 0, y: 100 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            Soy un ingeniero electricista apasionado con experiencia en diseño
            eléctrico, iluminación y seguridad electrónica. Graduado de la
            Universidad Nacional de Colombia, estoy comprometido en brindar
            soluciones eléctricas eficientes y de calidad. Mi enfoque se centra
            en crear diseños, cumpliendo con normativas de seguridad y
            estándares. Con experiencia en campo, comprendo los desafíos y
            complejidades de implementación. Siempre busco superar expectativas
            y mantenerme actualizado en las últimas tecnologías. ¡Contáctame
            para discutir cómo puedo ayudarte en tu próximo proyecto!
          </motion.p>
          <div className="flex  md:flex-1 m-10 md:m-0 justify-center">
            <motion.img
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0 },
              }}
              src={i1}
              alt={i1}
              className=" md:size-3/4 size-full object-scale-down "
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AboutMe;
