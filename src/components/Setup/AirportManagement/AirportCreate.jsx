import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { useQuery } from "react-query";
import { ComboBox } from "../../combobox";
import { Autocomplete, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

const AirportCreate = () => {
  const { t } = useTranslation("global");
  const { data: clearance } = useQuery("getClearancedropdown");
  const { data: linear } = useQuery("getLinerdropdown");
  const { data: transportation } = useQuery("getTransportationdropdown");
  console.log(clearance);
  const location = useLocation();
  const { from } = location.state || {};
  console.log(from);
  const navigate = useNavigate();
  const [state, setState] = useState({
    port_id: from?.port_id ?? undefined,
    user_id: localStorage.getItem("id"),
    port_type_id: from?.port_type_id ?? 1,
    port_name: from?.port_name ?? "",
    port_country: from?.port_country ?? "",
    port_city: from?.port_city ?? "",
    port_code: from?.port_code ?? "",
    Seaport_code: from?.Seaport_code ?? "",
    IATA_code: from?.IATA_code ?? "",
    ICAO_Code: from?.ICAO_Code ?? "",
    preferred_clearance: from?.preferred_clearance ?? "",
    preferred_transport: from?.preferred_transport ?? "",
    prefered_liner: from?.prefered_liner ?? "",
  });
  console.log(state);
  const [chargeVolume, setChargeVolume] = useState(false);
  useEffect(() => {
    if (from) {
      setChargeVolume(from.CO_Chamber_Required === 1); // or == "1" if string
    }
  }, [from]);
  const [portType, setPortType] = useState([]);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };
  const loadPortType = () => {
    axios
      .get(`${API_BASE_URL}/getDropdownPortType`)
      .then((response) => {
        setPortType(response.data.data);
      })
      .catch((error) => {
        if (error) {
          toast.error(t("networkError"), {
            autoClose: 1000,
            theme: "colored",
          });
          return false;
        }
      });
  };
  useEffect(() => {
    loadPortType();
  }, []);
  const handleAgreedPricingChange1 = (e) => {
    setChargeVolume(e.target.checked);
  };

  const updatePort = () => {
    axios
      .post(
        `${API_BASE_URL}/${
          typeof state.port_id === "undefined" ? "addAirport" : "updateAirPort"
        }`,
        {
          ...state,
          CO_Chamber: chargeVolume ? 1 : 0,
        },
        {
          validateStatus: () => true, // 👈 Always resolve, even if status is 400/500
        }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success(t("successfully"), {
            autoClose: 1000,
            theme: "colored",
          });
          navigate("/airportnew");
        } else {
          toast.error(response.data.message || t("networkError"), {
            autoClose: 1000,
            theme: "colored",
          });
        }
      })

      .catch((error) => {
        toast.error(t("networkError"), {
          autoClose: 1000,
          theme: "colored",
        });
      });
  };
  const handleAgreedPricingChange = async (e) => {
    const { name, checked } = e.target;
  };
  return (
    <Card
      title={`${t("port_management")} / ${
        state.port_id ? t("update") : t("create")
      } ${t("form")}`}
    >
      <div className="top-space-search-reslute">
        <div className="tab-content px-2 md:!px-4">
          <div className="tab-pane active" id="header" role="tabpanel">
            <div
              id="datatable_wrapper"
              className="information_dataTables dataTables_wrapper dt-bootstrap4"
            >
              <div className="formCreate createPackage">
                <form action="">
                  <div className="row justify-content-center">
                    <div className="col-lg-4 form-group">
                      <h6>{t("portName")}</h6>
                      <div className="parentthb packParent">
                        <div className="childThb">
                          <input
                            type="text"
                            name="port_name"
                            value={state.port_name}
                            onChange={handleChange}
                            placeholder={t("name")}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 form-group">
                      <h6>{t("country")} </h6>
                      <div className="parentthb packParent">
                        <div className="childThb">
                          <input
                            type="text"
                            name="port_country"
                            value={state.port_country}
                            onChange={handleChange}
                            placeholder={t("country")}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 form-group">
                      <h6>{t("city")}</h6>
                      <div className="parentthb packParent">
                        <div className="childThb">
                          <input
                            type="text"
                            placeholder={t("city")}
                            name="port_city"
                            value={state.port_city}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 form-group autoComplete">
                      <h6>{t("portType")}</h6>
                      
                      <Autocomplete
                        value={
                          portType.find(
                            (item) => item.port_type_id === state.port_type_id
                          ) || null
                        } // Find the selected option by matching port_type_id
                        onChange={(event, newValue) => {
                          handleChange({
                            target: {
                              name: "port_type_id",
                              value: newValue ? newValue.port_type_id : "", // Set the port_type_id when a value is selected
                            },
                          });
                        }}
                        options={portType} // Array of options for Autocomplete
                        getOptionLabel={(option) => option.port_type || ""} // Text to display for each option
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t("portType")}
                            variant="outlined"
                          />
                        )}
                        isOptionEqualToValue={(option, value) =>
                          option.port_type_id === value.port_type_id
                        } // Ensure option matches selected value
                      />
                    </div>
                    {state.port_type_id == 1 ? (
                      <>
                        <div className="col-lg-4 form-group">
                          <h6>{t("iataCode")}</h6>
                          <div className="parentthb packParent">
                            <div className="childThb">
                              <input
                                type="text"
                                placeholder={t("iataCode")}
                                name="IATA_code"
                                value={state.IATA_code}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 form-group">
                          <h6>{t("icaoCode")}</h6>
                          <div className="parentthb packParent">
                            <div className="childThb">
                              <input
                                type="text"
                                placeholder={t("icaoCode")}
                                name="ICAO_Code"
                                value={state.ICAO_Code}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 form-group autoComplete">
                          <h6> {t("preferredTransport")} </h6>

                          {/* <ComboBox
                            options={transportation?.map((v) => ({
                              id: v.vendor_id,
                              name: v.name,
                            }))}
                            value={state.preferred_transport}
                            onChange={(e) =>
                              setState({ ...state, preferred_transport: e })
                            }
                          /> */}
                          {/* <Autocomplete
                            options={transportation?.map((v) => ({
                              id: v.ID,
                              name: v.name,
                            })) || []} // Mapping transportation to id and name
                            value={transportation?.find((v) => v.ID === state.preferred_transport) || null} // Find the selected item by vendor_id
                            onChange={(event, newValue) => {
                              setState({
                                ...state,
                                preferred_transport: newValue ? newValue.id : '', // Set preferred_transport id when a value is selected
                              });
                            }}
                            getOptionLabel={(option) => option.name || ''} // The label to display (the name of transportation)
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Preferred Transport"
                                variant="outlined"
                              />
                            )}
                            isOptionEqualToValue={(option, value) => option.id === value.id} // Ensures the option and the selected value match
                          /> */}
                          <Autocomplete
                            options={
                              transportation?.map((v) => ({
                                id: v.ID,
                                name: v.name,
                              })) || []
                            }
                            value={
                              transportation?.length
                                ? transportation.find(
                                    (v) => v.ID === state.preferred_transport
                                  ) || null
                                : null
                            }
                            onChange={(event, newValue) => {
                              setState({
                                ...state,
                                preferred_transport: newValue
                                  ? newValue.id
                                  : "",
                              });
                            }}
                            getOptionLabel={(option) => option?.name || ""}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder={t("preferredTransport")}
                                variant="outlined"
                              />
                            )}
                            isOptionEqualToValue={(option, value) =>
                              option?.id === value?.id
                            }
                          />
                        </div>
                        <div className="col-lg-4 form-group autoComplete">
                          <h6>{t("preferredCustoms")}</h6>
                          {/* <Autocomplete
                            options={
                              clearance?.map((v) => ({
                                id: v.ID,
                                name: v.name,
                              })) || []
                            } // Mapping clearance to id and name
                            value={
                              clearance?.find(
                                (v) => v.ID === state.preferred_clearance
                              ) || null
                            } // Find the selected item by vendor_id
                            onChange={(event, newValue) => {
                              setState({
                                ...state,
                                preferred_clearance: newValue
                                  ? newValue.id
                                  : "", // Set preferred_clearance id when a value is selected
                              });
                            }}
                            getOptionLabel={(option) => option.name || ""} // The label to display (the name of clearance)
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Preferred Customs"
                                variant="outlined"
                              />
                            )}
                            isOptionEqualToValue={(option, value) =>
                              option.id === value.id
                            } // Ensures the option and the selected value match
                          /> */}

                          {/* <Autocomplete
                            options={
                              clearance?.map((v) => ({
                                id: v.ID,
                                name: v.name,
                              })) || []
                            }
                            value={
                              clearance?.length
                                ? clearance.find(
                                    (v) => v.ID === state.preferred_clearance
                                  ) || null
                                : null
                            }
                            onChange={(event, newValue) => {
                              setState({
                                ...state,
                                preferred_clearance: newValue
                                  ? newValue.id
                                  : "",
                              });
                            }}
                            getOptionLabel={(option) => option?.name || ""}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Preferred Customs"
                                variant="outlined"
                              />
                            )}
                            isOptionEqualToValue={(option, value) =>
                              option?.id === value?.id
                            }
                          /> */}
                          <Autocomplete
                            options={
                              clearance?.map((v) => ({
                                id: v.ID,
                                name: v.name,
                              })) || []
                            }
                            value={
                              clearance
                                ?.map((v) => ({ id: v.ID, name: v.name }))
                                .find(
                                  (option) =>
                                    option.id === state.preferred_clearance
                                ) || null
                            }
                            onChange={(event, newValue) => {
                              setState({
                                ...state,
                                preferred_clearance: newValue
                                  ? newValue.id
                                  : "", // Store only the id
                              });
                            }}
                            getOptionLabel={(option) => option?.name || ""}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder={t("preferredCustoms")}
                                variant="outlined"
                              />
                            )}
                            isOptionEqualToValue={(option, value) =>
                              option?.id === value?.id
                            }
                          />

                          {/* <ComboBox
                            options={clearance?.map((v) => ({
                              id: v.vendor_id,
                              name: v.name,
                            }))}
                            value={state.preferred_clearance}
                            onChange={(e) =>
                              setState({ ...state, preferred_clearance: e })
                            }
                          /> */}
                        </div>
                        <div className="col-lg-4 form-group autoComplete">
                          <h6>{t("preferredLiner")}</h6>
                          {/* <ComboBox
                            options={linear?.map((v) => ({
                              id: v.liner_id,
                              name: v.liner_name,
                            }))}
                            value={state.prefered_liner}
                            onChange={(e) =>
                              setState({ ...state, prefered_liner: e })
                            }
                          /> */}
                          <Autocomplete
                            options={
                              linear?.map((v) => ({
                                id: v.liner_id,
                                name: v.liner_name,
                              })) || []
                            }
                            getOptionLabel={(option) => option.name || ""}
                            onChange={(event, newValue) => {
                              console.log("Selected Value:", newValue);
                              setState({
                                ...state,
                                prefered_liner: newValue ? newValue.id : null,
                              });
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder={t("selectLiner")}
                                variant="outlined"
                              />
                            )}
                            value={
                              linear
                                ?.map((v) => ({
                                  id: v.liner_id,
                                  name: v.liner_name,
                                }))
                                .find(
                                  (option) => option.id === state.prefered_liner
                                ) || null
                            }
                            isOptionEqualToValue={(option, value) =>
                              option.id === value.id
                            }
                          />
                        </div>
                      </>
                    ) : state.port_type_id == 2 ? (
                      <>
                        <div className="col-lg-4 form-group">
                          <h6> {t("Sea_Port_Code")}</h6>
                          <div className="parentthb packParent">
                            <div className="childThb">
                              <input
                                type="text"
                                placeholder={t("code")}
                                name="Seaport_code"
                                value={state.Seaport_code}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 form-group autoComplete">
                          <h6> {t("preferredTransport")}</h6>
                          {/* <ComboBox
                            options={transportation?.map((v) => ({
                              id: v.vendor_id,
                              name: v.name,
                            }))}
                            value={state.preferred_transport}
                            onChange={(e) =>
                              setState({ ...state, preferred_transport: e })
                            }
                          /> */}
                          <Autocomplete
                            options={
                              transportation?.map((v) => ({
                                id: v.ID,
                                name: v.name,
                              })) || []
                            }
                            value={
                              transportation
                                ?.map((v) => ({ id: v.ID, name: v.name }))
                                .find(
                                  (option) =>
                                    option.id === state.preferred_transport
                                ) || null
                            }
                            onChange={(event, newValue) => {
                              setState({
                                ...state,
                                preferred_transport: newValue
                                  ? newValue.id
                                  : null, // Only store the ID
                              });
                            }}
                            getOptionLabel={(option) => option.name || ""}
                            isOptionEqualToValue={(option, value) =>
                              option.id === value
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder={t("selectTransportProvider")}
                                variant="outlined"
                              />
                            )}
                          />
                        </div>
                        <div className="col-lg-4 form-group autoComplete">
                          <h6>{t("preferredCustoms")}</h6>

                          <Autocomplete
                            options={
                              clearance?.map((v) => ({
                                id: v.ID,
                                name: v.name,
                              })) || []
                            }
                            value={
                              clearance
                                ?.map((v) => ({ id: v.ID, name: v.name }))
                                .find(
                                  (option) =>
                                    option.id === state.preferred_clearance
                                ) || null
                            }
                            onChange={(event, newValue) => {
                              setState({
                                ...state,
                                preferred_clearance: newValue
                                  ? newValue.id
                                  : "", // Store only the ID
                              });
                            }}
                            getOptionLabel={(option) => option?.name || ""}
                            isOptionEqualToValue={(option, value) =>
                              option?.id === value?.id
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder={t("selectClearanceProvider")}
                                variant="outlined"
                              />
                            )}
                          />
                        </div>
                        <div className="col-lg-4 form-group autoComplete">
                          <h6> {t("preferredLiner")}</h6>

                          <Autocomplete
                            options={
                              linear?.map((v) => ({
                                id: v.liner_id,
                                name: v.liner_name,
                              })) || []
                            }
                            value={
                              linear
                                ?.map((v) => ({
                                  id: v.liner_id,
                                  name: v.liner_name,
                                }))
                                .find(
                                  (option) => option.id === state.prefered_liner
                                ) || null
                            }
                            onChange={(event, newValue) => {
                              setState({
                                ...state,
                                prefered_liner: newValue ? newValue.id : "", // Store only the ID
                              });
                            }}
                            getOptionLabel={(option) => option?.name || ""}
                            isOptionEqualToValue={(option, value) =>
                              option?.id === value?.id
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder={t("selectLiner")}
                                variant="outlined"
                              />
                            )}
                          />
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                    <div className="col-lg-12 form-group mt-4">
                      <h6> {t("requiresCO")}</h6>
                      <label className="toggleSwitch large">
                        <input
                          type="checkbox"
                          name="Charge_Volume"
                          checked={chargeVolume}
                          onChange={handleAgreedPricingChange1}
                        />
                        <span>
                          <span>{t("off")}</span>
                          <span>{t("on")}</span>
                        </span>
                        <a></a>
                      </label>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <div className="card-footer">
              <button
                className="btn btn-primary"
                type="submit"
                name="signup"
                onClick={updatePort}
              >
                {state.port_id ? t("update") : t("create")}
              </button>
              <Link className="btn btn-danger" to="/airportNew">
                {t("cancel")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AirportCreate;
