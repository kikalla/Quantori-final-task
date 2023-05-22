import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router";

const HomePage: React.FC = () => {
  const [authUser, setAuthUser] = useState<{ email: string | null } | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser({ email: user.email });
      } else {
        setAuthUser(null);
        navigate("/login");
      }
    });
  }, [navigate]);

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <div className="header flex">
        {authUser && (
          <>
            <p>{authUser.email}</p>
            <button className="header__button" onClick={userSignOut}>
              Log Out
            </button>
          </>
        )}
      </div>
      <Outlet></Outlet>
    </>
  );
};

export default HomePage;
