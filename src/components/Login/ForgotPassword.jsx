import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logoNew.png";
import "./loginn.css";
import axios from "axios";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../Url/Url";

const defaultState = {
  email: "",
};

const ForgotPassword = () => {
  const [state, setState] = useState(defaultState);
  const [forgotErr, setForgotErr] = useState(false);
  const [error, setError] = useState({
    errors: {},
    isError: false,
  });
  const navigate = useNavigate();

  const forgotPass = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitData = (e) => {
    console.log(state);

    if (state.email === "") {
      setForgotErr(true);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Email is required!",
      });
    } else {
      setForgotErr(false);

      axios
        .post(`${API_BASE_URL}/forgotPassword`, { email: state.email })
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            const forgotToken = response.data.token;
            localStorage.setItem("token", forgotToken);
            Swal.fire(
              "Check your email for the OTP!",
              "You clicked the button!",
              "success"
            );
            navigate("/otp");
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Please Enter Valid Email!",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          setError({
            errors: error,
            isError: true,
          });
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Something went wrong. Please try again later.",
          });
        });
    }
  };

  return (
    <div className="mainForgot">
      <div className="forgotPass">
        <h2>Forgot Password</h2>
        <div className="lgo">
          <img src={logo} alt="logo" />
        </div>
        <label htmlFor="">Enter your email</label>
        <input
          className="form-control"
          onChange={forgotPass}
          name="email"
          value={state.email}
          type="email"
          placeholder="email"
        />
        <span style={{ color: "red" }}>
          {error.isError ? error.errors?.response?.data?.message : " "}
        </span>
        <div className="buttonForgot">
          <button onClick={submitData}>SEND OTP</button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
