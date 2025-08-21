import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/logoNew.png";
import { API_BASE_URL } from "../../Url/Url";
import "./loginn.css";

const defaultState = {
  newPassword: "",
  confirmPassword: "",
};

const ForgotPassword = () => {
  const [state, setState] = useState(defaultState);
  const [resetPassErr, setResetPassErr] = useState(false);
  const [error, setError] = useState({
    errors: {},
    isError: false,
  });

  const navigate = useNavigate();

  const ResetPassword = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const resetData = async (e) => {
    e.preventDefault();
    if (state.newPassword === "" || state.confirmPassword === "") {
      setResetPassErr(true);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please fill in both fields.",
      });
      return;
    } else {
      setResetPassErr(false);
    }

    if (state.newPassword !== state.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Passwords do not match.",
      });
      return;
    }

    try {
      var idGet = localStorage.getItem("verificationId");

      const endpoint = "ResetPassword";
      const params = {
        id: idGet,
      };
      const url = `${API_BASE_URL}/${endpoint}?${new URLSearchParams(params)}`;

      const requestBody = {
        newPassword: state.newPassword,
        confirmPassword: state.confirmPassword,
      };

      const response = await axios.post(url, requestBody);
      console.log(response);

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Password Reset Successfully!",
          text: "You clicked the button!",
        }).then(() => {
          navigate("/");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Password reset failed.",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
      });
      setError({
        errors: error,
        isError: true,
      });
    }
  };

  return (
    <div className="mainForgot">
      <div className="forgotPass">
        <h2>Reset Password</h2>
        <div className="lgo">
          <img src={logo} alt="logo" />
        </div>
        <label htmlFor="">New Password</label>
        <input
          className="form-control mb-3"
          type="password"
          placeholder="Enter your new password"
          name="newPassword"
          onChange={ResetPassword}
          value={state.newPassword}
        />
        <label htmlFor="">Confirm Password</label>
        <input
          className="form-control"
          type="password"
          placeholder="Confirm password"
          name="confirmPassword"
          onChange={ResetPassword}
          value={state.confirmPassword}
        />
        <div className="buttonForgot">
          <button onClick={resetData}>RESET PASSWORD</button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
