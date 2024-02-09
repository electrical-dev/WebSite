import Layout from "../../Components/Layout";
import i1 from "../../assets/acercaDeMi.webp";

import { motion } from "framer-motion";

function AboutMe() {
  return (
    <Layout>
      <div className=" md:flex md:items-center md:justify-center w-full ">
        <motion.p
          className="  text-gray-800 md:text-right mx-10 md:w-2/5  "
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
          soluciones eléctricas eficientes y de calidad. Mi enfoque se centra en
          crear diseños, cumpliendo con normativas de seguridad y estándares.
          Con experiencia en campo, comprendo los desafíos y complejidades de
          implementación. Siempre busco superar expectativas y mantenerme
          actualizado en las últimas tecnologías. ¡Contáctame para discutir cómo
          puedo ayudarte en tu próximo proyecto!
        </motion.p>
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
          className="size-auto md:w-2/5  object-cover "
        />
      </div>
    </Layout>
  );
}

export default AboutMe;
