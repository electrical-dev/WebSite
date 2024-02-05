import { useRoutes, BrowserRouter } from "react-router-dom";
import Home from "../Home";
import AboutMe from "../AboutMe";
import Services from "../Services";
import Projects from "../Projects";
import NotFound from "../NotFound";
import ContacMe from "../ContacMe";
import NavBar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import "./App.css";

const AppRoutes = () => {
  let routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/about", element: <AboutMe /> },
    { path: "/services", element: <Services /> },
    { path: "/projects", element: <Projects /> },
    { path: "/contact", element: <ContacMe /> },
    { path: "/*", element: <NotFound /> },
  ]);
  return routes;
};

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />

      <NavBar />

      <Footer />
    </BrowserRouter>
  );
};

export default App;
