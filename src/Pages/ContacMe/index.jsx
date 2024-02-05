import Layout from "../../Components/Layout";
import "./index.css";
import { motion } from "framer-motion";

function ContacMe() {
  return (
    <div className="fondo-pantalla2 md:bg-contain md:bg-left bg-cover bg-center  ">
      <Layout>
        <div className=" flex flex-col gap-2 md:ml-48 xl:ml-96 xl:pl-48  w-full  items-center h-1/2 overflow-y-auto">
          <motion.input
            type="text"
            id="name"
            name="name"
            placeholder="Nombre"
            className=" bg-sky-50/80 enabled:hover:bg-white rounded-md  w-3/4 md:w-1/2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.2, duration: 1 }}
            variants={{
              hidden: { opacity: 0, x: 100 },
              visible: { opacity: 1, x: 0 },
            }}
          />
          <motion.input
            type="email"
            id="email"
            name="mail"
            placeholder="email@xxxxxx"
            className=" bg-sky-50/80 enabled:hover:bg-white rounded-md w-3/4 md:w-1/2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.4, duration: 1 }}
            variants={{
              hidden: { opacity: 0, x: 120 },
              visible: { opacity: 1, x: 0 },
            }}
          />
          <motion.textarea
            name="message"
            id="message"
            cols="0"
            rows="8"
            placeholder="Escribe tu mensaje..."
            className=" bg-sky-50/80 enabled:hover:bg-white md:w-1/2 w-3/4 rounded-md"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.6, duration: 1 }}
            variants={{
              hidden: { opacity: 0, x: 140 },
              visible: { opacity: 1, x: 0 },
            }}
          ></motion.textarea>

          <motion.button
            className=" bg-orange-500 text-white font-semibold md:w-1/2 w-3/4 rounded-md"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.8, duration: 1 }}
            variants={{
              hidden: { opacity: 0, x: 160 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            ENVIAR
          </motion.button>
        </div>
      </Layout>
    </div>
  );
}

export default ContacMe;
