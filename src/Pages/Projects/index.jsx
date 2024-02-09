import { useState, useEffect, useContext } from "react";
import Layout from "../../Components/Layout";
import CardProject from "../../Components/CardProject";
import ProjectDetail from "../../Components/ProjectDetail";
import { CardContext } from "../../Context";

function Projects() {
  const context = useContext(CardContext);

  const projectsRendered = context.items ? (
    context.items.map((item) => <CardProject key={item.id} data={item} />)
  ) : (
    // Display a loading indicator or placeholder while data is fetched
    <div>Loading projects...</div>
  );

  return (
    <div className=" bg-gradient-to-t from-slate-600 to-black ">
      <Layout>
        <h1 className="felx justify-center text-2xl text-orange-600 mb-2">
          Proyectos y experiencia
        </h1>
        {/* {projectsRendered} */}

        <div className="flex flex-col justify-center items-center gap-y-10 w-full ">
          {projectsRendered}
        </div>
        <ProjectDetail />
      </Layout>
    </div>
  );
}

export default Projects;
