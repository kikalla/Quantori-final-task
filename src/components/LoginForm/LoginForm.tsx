import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase.js";
import "./LoginForm.css";
import { NavLink, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formIsValid, setFomrIsValid] = useState(true);
  const navigate = useNavigate();

  const signIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigate("/home");
      })
      .catch((error) => {
        setFomrIsValid(false);
        console.log(error);
      });
  };

  return (
    <div className="login">
      <form className="login__form flex" onSubmit={signIn}>
        <h1 className="login__form--title">Login</h1>
        <div className="form__input--wrapper flex">
          <label htmlFor="email">Email</label>
          <input
            className={`form__input ${!formIsValid && "error"}`}
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}></input>
        </div>
        <div className="form__input--wrapper flex">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className={`form__input ${!formIsValid && "error"}`}
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}></input>
        </div>
        {!formIsValid && (
          <p className="form__error">
            Login failed! Please, check you password and email and try again
          </p>
        )}
        <button className="form__submit flex" type="submit">
          Login
        </button>
        <div className="flex">
          <p>Don’t have an account? </p>
          <NavLink className={"form__link"} to={"/signup"}>
            Sign up
          </NavLink>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
