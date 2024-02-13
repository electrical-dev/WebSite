import React, { createContext, useState, useEffect } from "react";

export const CardContext = createContext();

export const CardProvider = ({ children }) => {
  const [isProjectDetailOpen, setIsProjectDetailOpen] = useState(false);
  const openProjectDetail = () => setIsProjectDetailOpen(true);
  const closeProjectDetail = () => setIsProjectDetailOpen(false);

  const [projectToShow, setProjectToShow] = useState({});

  const [items, setItems] = useState(null);

  useEffect(() => {
    fetch("../products.json") // Replace with your actual data source
      .then((response) => response.json())
      .then((data) => setItems(data));
  }, []);
  return (
    <CardContext.Provider
      value={{
        isProjectDetailOpen,
        setIsProjectDetailOpen,
        openProjectDetail,
        closeProjectDetail,
        projectToShow,
        setProjectToShow,
        items, // Make sure items is included in the value
      }}
    >
      {children}
    </CardContext.Provider>
  );
};
