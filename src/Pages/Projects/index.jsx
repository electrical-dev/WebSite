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
    <Layout>
      <div className=" ">
        {/* {projectsRendered} */}
        En Construccion
      </div>
      <ProjectDetail />
    </Layout>
  );
}

export default Projects;
