import React, { useEffect } from "react";
import "./InitialPage.css";

import dnaImage from "../../assets/images/dna.png";
import { Outlet } from "react-router";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

const InitialPage: React.FC = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/home");
      }
    });
  }, [navigate]);
  return (
    <div>
      <img className="app-backgorund" src={dnaImage} alt="dna" />
      <Outlet></Outlet>
    </div>
  );
};

export default InitialPage;
