import { NavLink } from "react-router-dom";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import "./ErrorPage.css";

const ErrorPage: React.FC = () => {
  return (
    <>
      <HeaderComponent />
      <div className="error__wrapper flex">
        <h1 className="error__title">404</h1>
        <p className="error__text">Page not found</p>
        <NavLink to={"/home"} className="error__button">
          Back to Search
        </NavLink>
      </div>
    </>
  );
};

export default ErrorPage;
