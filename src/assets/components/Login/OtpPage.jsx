import React from "react";
import axios from "axios";
import logo from "../../assets/logoNew.png";
import "./loginn.css";
import { Input as BaseInput } from "@mui/base/Input";
import { Box, styled } from "@mui/system";
import { API_BASE_URL } from "../../Url/Url";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function OTP({ separator, length, value, onChange }) {
  const inputRefs = React.useRef(new Array(length).fill(null));

  const focusInput = (targetIndex) => {
    const targetInput = inputRefs.current[targetIndex];
    if (targetInput) {
      targetInput.focus();
    }
  };

  const selectInput = (targetIndex) => {
    const targetInput = inputRefs.current[targetIndex];
    if (targetInput) {
      targetInput.select();
    }
  };

  const handleKeyDown = (event, currentIndex) => {
    switch (event.key) {
      case "ArrowUp":
      case "ArrowDown":
      case " ":
        event.preventDefault();
        break;
      case "ArrowLeft":
        event.preventDefault();
        if (currentIndex > 0) {
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
        }
        break;
      case "ArrowRight":
        event.preventDefault();
        if (currentIndex < length - 1) {
          focusInput(currentIndex + 1);
          selectInput(currentIndex + 1);
        }
        break;
      case "Delete":
        event.preventDefault();
        onChange((prevOtp) => {
          const otpArray = prevOtp.split("");
          otpArray[currentIndex] = "";
          return otpArray.join("");
        });
        break;
      case "Backspace":
        event.preventDefault();
        if (currentIndex > 0) {
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
        }
        onChange((prevOtp) => {
          const otpArray = prevOtp.split("");
          otpArray[currentIndex] = "";
          return otpArray.join("");
        });
        break;
      default:
        break;
    }
  };

  const handleChange = (event, currentIndex) => {
    const currentValue = event.target.value;
    onChange((prevOtp) => {
      const otpArray = prevOtp.split("");
      otpArray[currentIndex] = currentValue[currentValue.length - 1] || "";
      return otpArray.join("");
    });
    if (currentValue !== "") {
      if (currentIndex < length - 1) {
        focusInput(currentIndex + 1);
      }
    }
  };

  const handleClick = (event, currentIndex) => {
    selectInput(currentIndex);
  };

  const handlePaste = (event, currentIndex) => {
    event.preventDefault();
    const clipboardData = event.clipboardData.getData("text");
    const pastedText = clipboardData.substring(0, length).split("");
    onChange((prevOtp) => {
      const otpArray = prevOtp.split("");
      for (let i = 0; i < pastedText.length; i++) {
        if (currentIndex + i < length) {
          otpArray[currentIndex + i] = pastedText[i];
        }
      }
      return otpArray.join("");
    });
  };

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      {new Array(length).fill(null).map((_, index) => (
        <React.Fragment key={index}>
          <BaseInput
            slots={{
              input: InputElement,
            }}
            aria-label={`Digit ${index + 1} of OTP`}
            slotProps={{
              input: {
                ref: (ele) => {
                  inputRefs.current[index] = ele;
                },
                onKeyDown: (event) => handleKeyDown(event, index),
                onChange: (event) => handleChange(event, index),
                onClick: (event) => handleClick(event, index),
                onPaste: (event) => handlePaste(event, index),
                value: value[index] ?? "",
              },
            }}
          />
          {index === length - 1 ? null : separator}
        </React.Fragment>
      ))}
    </Box>
  );
}

const blue = {
  100: "#DAECFF",
  200: "#80BFFF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0059B2",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const InputElement = styled("input")(
  ({ theme }) => `
    width: 40px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 0px;
    border-radius: 8px;
    text-align: center;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 4px ${
      theme.palette.mode === "dark" ? "rgba(0,0,0, 0.5)" : "rgba(0,0,0, 0.05)"
    };
  
    &:hover {
      border-color: ${blue[400]};
    }
  
    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === "dark" ? blue[600] : blue[200]
      };
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = React.useState("".padEnd(4, " ")); // Initialize OTP state

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/VerifyOtp`, {
        otp: otp.trim(),
      });
      console.log(response);
      if (response.data.success == false) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: " Incorrect Otp !",
        });
      } else {
        const userId = response.data.user_id;
        localStorage.setItem("verificationId", userId);
        navigate("/generatepass");
      }
      // handle success (e.g., show a success message, navigate to another page)
    } catch (error) {
      console.error(error);
      // handle error (e.g., show an error message)
    }
  };

  return (
    <div className="mainForgot">
      <div className="forgotPass">
        <h2>OTP Verify</h2>
        <div className="lgo mb-4">
          <img src={logo} alt="logo" />
        </div>
        <p>Your code was sent to via an email</p>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <OTP
            value={otp}
            onChange={setOtp}
            length={4}
            separator={<span> </span>}
          />
        </Box>
        <div className="buttonForgot">
          <button onClick={handleSubmit}>VERIFY</button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
