import Layout from "../../Components/Layout";
import i1 from "../../assets/acercaDeMi.png";

function AboutMe() {
  const tab = "\u00A0";
  return (
    <Layout>
      <div className=" md:flex  md:justify-items-center md:relative  md:items-center md:text-lg text-sm font-light mt-32 ">
        <div className=" flex text-gray-800 md:flex-col md:flex-1 md:text-right md:mx-10 m-10 justify-center max-w-full top-0">
          Soy un ingeniero electricista apasionado con experiencia en diseño
          eléctrico, iluminación y seguridad electrónica. Graduado de la
          Universidad Nacional de Colombia, estoy comprometido en brindar
          soluciones eléctricas eficientes y de calidad. Mi enfoque se centra en
          crear diseños, cumpliendo con normativas de seguridad y estándares.
          Con experiencia en campo, comprendo los desafíos y complejidades de
          implementación. Siempre busco superar expectativas y mantenerme
          actualizado en las últimas tecnologías. ¡Contáctame para discutir cómo
          puedo ayudarte en tu próximo proyecto!
        </div>
        <div className="flex  md:flex-1 m-10 md:m-0 justify-center">
          <img
            src={i1}
            alt={i1}
            className=" md:size-3/4 size-full object-cover "
          />
        </div>
      </div>
    </Layout>
  );
}

export default AboutMe;
