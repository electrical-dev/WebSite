import { useRoutes, BrowserRouter } from "react-router-dom";
import { CardProvider } from "../../Context";
import Home from "../Home";
import AboutMe from "../AboutMe";
import Services from "../Services";
import Projects from "../Projects";
import NotFound from "../NotFound";
import ContacMe from "../ContacMe";
import Calculator from "../Calculator";
import NavBar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import "./App.css";
import { Analytics } from "@vercel/analytics/react";

const AppRoutes = () => {
  let routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/about", element: <AboutMe /> },
    { path: "/services", element: <Services /> },
    { path: "/calculator", element: <Calculator /> },
    { path: "/projects", element: <Projects /> },
    { path: "/contact", element: <ContacMe /> },
    { path: "/*", element: <NotFound /> },
  ]);
  return routes;
};

const App = () => {
  return (
    <CardProvider>
      <BrowserRouter>
        <div className="flex flex-col">
          <AppRoutes />
          <NavBar />
          <Footer />
        </div>
        <Analytics />
      </BrowserRouter>
    </CardProvider>
  );
};

export default App;
