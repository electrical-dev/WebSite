import Layout from "../../Components/Layout";
import { motion } from "framer-motion";

function Calculator() {
  return (
    <div className="fondo-pantalla2 h-full mt-20  md:bg-contain md:bg-left bg-cover bg-center ">
      <Layout>
        {/* <h1 className="text-white text-center mb-2  text-3xl font-semibold ">
          {" "}
          Contactame{" "}
        </h1> */}
        <form
          action="https://formsubmit.co/dsavilav@unal.edu.co"
          method="POST"
          className=" flex flex-col md:gap-y-10 gap-y-5  items-center  justify-center md:items-end relative h-1/2 w-4/5 "
        >
          <motion.input
            type="text"
            id="name"
            name="name"
            placeholder="Nombre"
            className=" bg-sky-50/80 enabled:hover:bg-white rounded-md  w-full md:w-1/2 h-14"
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
            name="email"
            placeholder="email@xxxxxx"
            className=" bg-sky-50/80 enabled:hover:bg-white rounded-md w-full md:w-1/2 h-14"
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
            className=" bg-sky-50/80 enabled:hover:bg-white w-full md:w-1/2 rounded-md "
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
            className=" bg-orange-500 text-white font-semibold w-full md:w-1/2 rounded-md h-14 "
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
          {/* <input type="hidden" name="_captcha" value="false"></input> */}
          <input
            type="hidden"
            name="_next"
            value="https://david-avila-elec.vercel.app/contact"
          ></input>
        </form>
      </Layout>
    </div>
  );
}

export default Calculator;
