import "./HomePage.css";
import { Outlet } from "react-router";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";

const HomePage: React.FC = () => {
  return (
    <>
      <HeaderComponent />
      <Outlet></Outlet>
    </>
  );
};

export default HomePage;
