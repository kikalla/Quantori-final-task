import { NavLink } from "react-router-dom";
import "./InitialComponent.css";

const Initial = () => {
  return (
    <div className="app flex">
      <h1 className="app__title">Q-1 Search</h1>
      <p className="app__paragraph">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt u
      </p>
      <NavLink className={"app__button flex"} to={"/login"}>
        Login
      </NavLink>
    </div>
  );
};

export default Initial;
