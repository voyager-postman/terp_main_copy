import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../../../Url/Url";

import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const CurrencyForm = () => {
  const [t] = useTranslation("global");
  const navigate = useNavigate();
  const location = useLocation();

  // check if edit mode
  const { from } = location.state || {};
  const isEdit = !!from;

  const [fx, setFx] = useState([]);
  const [selectedFx, setSelectedFx] = useState(null);
  const [fxId, setFxId] = useState("");
  const [days, setDays] = useState("");
  const [value, setValue] = useState("");

  // fetch dropdown FX list
  const getApiData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getCurrency`);
      setFx(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // pre-fill form if edit mode
  useEffect(() => {
    getApiData();

    if (isEdit) {
      setFxId(from.FX_ID || "");
      setDays(from.DAYS || "");
      setValue(from.FX_Correction || "");
      setSelectedFx({ ID: from.FX_ID, FX: from.FX_Name }); // for Autocomplete
    }
  }, [isEdit, from]);

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      FX_ID: fxId,
      DAYS: days,
      FX_Correction: value,
    };

    try {
      if (isEdit) {
        // Update API
        await axios.post(`${API_BASE_URL}/editFxCorrection`, {
          id: from.ID,
          ...payload,
        });
        toast.success("FX Correction updated successfully!");
      } else {
        // Create API
        await axios.post(`${API_BASE_URL}/createFxCorrection`, payload);
        toast.success("FX Correction created successfully!");
      }

      setTimeout(() => {
        navigate("/currency");
      }, 1000);
    } catch (error) {
      console.error("Error saving FX Correction:", error);
      toast.error("Failed to save FX Correction.");
    }
  };

  return (
    <div className="row">
      <div className="col-lg-12 col-md-12 mb-4">
        <div className="p-4">
          <div className="databaseTableSection pt-0">
            <div className="grayBgColor p-4 pt-2 pb-2">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="font-weight-bolder mb-0 pt-2">
                    {isEdit
                      ? t("currencyManagementEditForm")
                      : t("currencyManagementCreateForm")}
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
                    <div className="formCreate">
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="form-group col-lg-4 autoComplete mb-3">
                            <h6>{t("fx")}</h6>
                            <Autocomplete
                              disablePortal
                              options={fx?.data || []}
                              getOptionLabel={(option) => option?.FX || ""}
                              value={selectedFx}
                              onChange={(event, value) => {
                                setSelectedFx(value);
                                setFxId(value?.ID || "");
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                               placeholder={t("fx")}
                                  variant="outlined"
                                />
                              )}
                            />
                          </div>

                          <div className="form-group col-lg-4">
                            <h6>{t("days")}</h6>
                            <input
                              type="number"
                              className="form-control"
                              value={days}
                              onChange={(e) => setDays(e.target.value)}
                              placeholder={t("inputDays")}
                              min="0"
                            />
                          </div>

                          <div className="form-group col-lg-4">
                            <h6>{t("fxCorrection")}</h6>
                            <input
                              type="text"
                              className="form-control"
                              placeholder={t("inputValue")}
                              value={value}
                              onChange={(e) => setValue(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="card-footer">
                          <button className="btn btn-primary" type="submit">
                            {isEdit ? t("update") : t("create")}
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger ms-2"
                            onClick={() => navigate("/currency")}
                          >
                            {t("cancel")}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyForm;
