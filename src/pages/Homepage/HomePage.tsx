import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const [authUser, setAuthUser] = useState<{ email: string | null } | null>(
    null
  );
  const navigate = useNavigate();
  console.log("Home");

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
    <div>
      {authUser ? (
        <>
          <p>{`Signed In as ${authUser.email}`}</p>
          <button onClick={userSignOut}>Sign Out</button>
        </>
      ) : (
        <p>Signed Out</p>
      )}
    </div>
  );
};

export default HomePage;
