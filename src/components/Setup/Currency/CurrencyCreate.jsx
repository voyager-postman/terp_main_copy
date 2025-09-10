import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../../../Url/Url";
import { useQuery } from "react-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
const CurrencyCreate = () => {
  const [t, i18n] = useTranslation("global");
  const navigate = useNavigate();

  // Function to copy the password to clipboard

  const [fx, setFx] = useState([]);

  const [selectedFx, setSelectedFx] = useState(null);
  const [fxId, setFxId] = useState("");
  const [days, setDays] = useState("");
  const [value, setValue] = useState("");
  const getApiData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getCurrency`);

      setFx(response.data); // save response in state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getApiData();
  }, []);

  const CustomInput = ({ value, onClick }) => (
    <div
      className="custom-input"
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
    >
      <input
        type="text"
        value={value}
        readOnly
        style={{
          padding: "10px",
          paddingLeft: "35px",
          width: "250px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />
      <FaCalendarAlt
        style={{
          position: "absolute",
          right: "10px",
          fontSize: "18px",
          color: "#888",
        }}
      />
    </div>
  );
  const formattedDays = days
    ? `${days.getDate().toString().padStart(2, "0")}-${(days.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${days.getFullYear()}`
    : null;
  const createFxCorrection = async (e) => {
    e.preventDefault();
    const payload = {
      FX_ID: fxId,
      DAYS: formattedDays,
      FX_Correction: value,
    };
    console.log("pratima:", payload);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/createFxCorrection`,
        payload
      );
      console.log(response);

      toast.success("FX Correction created successfully!", {
        position: "top-right",
        autoClose: 3000, // 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        navigate("/currency"); // replace with your route
      }, 1000); // 1 second delay (optional)
    } catch (error) {
      console.error("Error creating FX Correction:", error);
      toast.error("Failed to create FX Correction.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="row">
      <div className="col-lg-12 col-md-12 mb-4">
        <div className=" p-4">
          <div className="databaseTableSection pt-0">
            <div className="grayBgColor p-4 pt-2 pb-2">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="font-weight-bolder mb-0 pt-2">
                    {t("currencyManagementCreateForm")}
                  </h6>
                </div>
              </div>
            </div>
            <div className="top-space-search-reslute">
              <div className="tab-content p-4 pt-0 pb-0">
                <div className="tab-pane active" id="header" role="tabpanel">
                  <div
                    id="datatable_wrapper"
                    className="information_dataTables dataTables_wrapper dt-bootstrap4"
                  >
                    {/*---------------------------table data---------------------*/}
                    <div className="d-flex exportPopupBtn" />

                    <div className="formCreate">
                      <form action="">
                        <div className="row">
                          <div className="form-group col-lg-4 autoComplete mb-3">
                            <h6>{t("FX")}</h6>
                            <Autocomplete
                              disablePortal
                              options={fx?.data || []}
                              getOptionLabel={(option) => option?.FX || ""}
                              value={selectedFx} // <-- controlled value
                              onChange={(event, value) => {
                                setSelectedFx(value); // stores the full object for display
                                setFxId(value?.ID || ""); // stores only the ID for API payload
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Select currency..."
                                  variant="outlined"
                                />
                              )}
                            />
                          </div>

                          <div className="form-group col-lg-4">
                            <h6>{t("inputDays")}</h6>

                            <DatePicker
                              selected={days}
                              onChange={
                                (date) => setDays(date) // Replace with your specific handling logic
                              }
                              dateFormat="dd/MM/yyyy"
                              placeholderText="Click to select a date"
                              customInput={<CustomInput />} // Ensure you have the `CustomInput` component defined or imported
                            />
                          </div>

                          <div className="form-group col-lg-4">
                            <h6>{t("inputValue")}</h6>

                            <input
                              type="text"
                              className="form-control"
                              placeholder={t("inputValue")}
                              value={value} // make input controlled
                              onChange={(e) => setValue(e.target.value)}
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                    {/*--------------------------- table data end--------------------------------*/}
                  </div>
                </div>
                <div className="card-footer">
                  <button
                    onClick={createFxCorrection}
                    className="btn btn-primary"
                    type="submit"
                    name="signup"
                  >
                    {t("create")}
                  </button>
                  <a
                    className="btn btn-danger"
                    href="#"
                    onClick={() => navigate("/currency")}
                  >
                    {t("cancel")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyCreate;
