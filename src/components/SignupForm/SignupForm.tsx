import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState, FormEvent } from "react";
import { auth } from "../../firebase";
import "./SignupForm.css";
import { NavLink, useNavigate } from "react-router-dom";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [formIsValid, setFomrIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const signUp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === repeatPassword) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          navigate("/login");
        })
        .catch((error) => {
          setErrorMessage(error.message);
          setFomrIsValid(false);
        });
    } else {
      setFomrIsValid(false);
    }
  };

  return (
    <div className="signup">
      <form onSubmit={signUp} className="signup__form flex">
        <h1 className="signup__form--title">Sign Up</h1>
        <div className="form__input--wrapper flex">
          <label htmlFor="email">Email</label>
          <input
            className={`form__input ${!formIsValid && "error"}`}
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form__input--wrapper flex">
          <label htmlFor="password">Password</label>
          <input
            className={`form__input ${!formIsValid && "error"}`}
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form__input--wrapper flex">
          <label htmlFor="repeat-password">Repeat Password</label>
          <input
            className={`form__input ${!formIsValid && "error"}`}
            id="repeat-password"
            type="password"
            placeholder="Enter your password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
        </div>
        {!formIsValid && (
          <p className="form__error">
            Signup failed! Please, check you passwords and email and try again
          </p>
        )}
        {!formIsValid && <p className="form__error">{errorMessage}</p>}
        <button className="form__submit flex" type="submit">
          Sign Up
        </button>
        <div className="flex">
          <p>Don’t have an account? </p>
          <NavLink className={"form__link"} to={"/login"}>
            Login
          </NavLink>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
