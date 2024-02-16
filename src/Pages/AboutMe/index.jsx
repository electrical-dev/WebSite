import Layout from "../../Components/Layout";
import i1 from "../../assets/acercaDeMi.webp";
import { Link } from "react-router-dom";
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
          Soy un ingeniero electricista graduado de la Universidad Nacional de
          Colombia, con amplia experiencia en diseño eléctrico, iluminación y
          seguridad electrónica. Mi pasión por la ingeniería me impulsa a
          ofrecer soluciones innovadoras y eficientes, siempre cumpliendo con
          las normativas de seguridad y los más altos estándares de calidad.
          Comprendo los desafíos y complejidades de la implementación de
          proyectos eléctricos, por lo que me enfoco en brindar un
          acompañamiento cercano y personalizado a mis clientes. Mi objetivo es
          superar las expectativas y construir relaciones duraderas basadas en
          la confianza y la satisfacción. Me mantengo en constante actualización
          con las últimas tecnologías del sector eléctrico, lo que me permite
          ofrecer soluciones a la vanguardia del mercado. <br />
          <Link to="/contact">
            <span className=" text-orange-500 font-semibold text-xl cursor-pointer ">
              Si buscas un ingeniero electricista comprometido, apasionado y con
              experiencia, no dudes en contactarme.
            </span>
          </Link>
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
