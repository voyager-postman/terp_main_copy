import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { Autocomplete, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

const UpdateClearanceNew = () => {
  const { t } = useTranslation("global");
  const nevigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || {};
  const [fromData, setFromData] = useState();

  console.log(fromData);
  const defaultState = {
    vendor_id: fromData?.Clearance_provider || "",
    custom_clearance_charges: fromData?.custom_clearance_charges || "",
    co_chamber_charges: fromData?.co_chamber_charges || "",
    phyto_charges: fromData?.phyto_charges || "",
    from_port: fromData?.from_port || "",
    extra_charges: fromData?.extra_charges || "",
  };

  const [vendorLists, setVendorLists] = useState([]);
  const [portslists, setPortslists] = useState([]);
  const [portTypeList, setPortTypeList] = useState([]);
  const [editClearance, setEditClearance] = useState(defaultState);


  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditClearance((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  // Get Vendor List Api
  console.log(editClearance);
  const getVendorLists = () => {
    axios
      .get(`${API_BASE_URL}/getVendorList`)
      .then((response) => {
        setVendorLists(response.data.vendorList);
      })
      .catch((error) => {
        console.log(error);
        if (error) {
          toast.error(t("networkError"), {
            autoClose: 1000,
            theme: "colored",
          });
          return;
        }
      });
  };

  const getPortList = () => {
    axios
      .get(`${API_BASE_URL}/getAllAirports`)
      .then((response) => {
        setPortslists(response.data.data);
      })
      .catch((error) => {
        console.log(error);
        if (error) {
          toast.error(t("networkError"), {
            autoClose: 1000,
            theme: "colored",
          });
          return;
        }
      });
  };

  // Fetch data from API
  const getPortTypes = () => {
    axios
      .get(`${API_BASE_URL}/getDropdownPortType`)
      .then((response) => {
        setPortTypeList(response.data.data); // API returns [{port_type_id, port_type}]
      })
      .catch((error) => {
        console.error(error);
        toast.error(t("networkError"), {
          autoClose: 1000,
          theme: "colored",
        });
      });
  };

  useEffect(() => {
    getVendorLists();
    getPortList();
    getPortTypes();
  }, []);

  // Get Vendor List Api

  // Update Clearance Api

  const updateClearance = (res) => {
    const request = {
      clearance_id: from?.clearance_id,
      user_id: localStorage.getItem("id"),
      from_port: editClearance.from_port,
      vendor_id: editClearance.vendor_id || editClearance.Clearance_provider,
      Port_Type: editClearance.port_type || editClearance.Port_Type,
      custom_clearance_charges: editClearance.custom_clearance_charges,
      co_chamber_charges: editClearance.co_chamber_charges,
      phyto_charges: editClearance.phyto_charges,
      extra_charges: editClearance.extra_charges,
    };

    axios
      .post(
        `${API_BASE_URL}/${
          request.clearance_id ? "updateClearance" : "addClearance"
        }`,
        request
      )
      .then((response) => {
        if (response.data.success == true) {
          toast.success(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
          nevigate("/clearanceNew");
          return;
        }

        if (response.data.status == 400) {
          toast.error(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
          return false;
        }
        if (response.data.success == false) {
          toast.error(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });

          return;
        }
      })
      .catch((error) => {
        if (error) {
          toast.error(t("networkError"), {
            autoClose: 1000,
            theme: "colored",
          });
          return;
        }
      });
  };
  useEffect(() => {
    if (from?.clearance_id) {
      axios
        .post(`${API_BASE_URL}getClearanceByID`, {
          clearance_id: from.clearance_id, // send in body
        })
        .then((res) => {
          console.log("freightNew", res);
          const data = res.data.data;

          console.log(data);

          // Pre-fill form with API response
          setFromData(data);
          setEditClearance(data)
          
        })
        .catch((err) => console.error("Error fetching clearance:", err));
    }
  }, [from]);
  // Update Clearance Api

  console.log(editClearance);
  
  return (
    <Card
      title={`${t("clearanceManagement")} / ${
        from?.clearance_id ? t("update") : t("create")
      } ${t("form")}`}
    >
      <div className="top-space-search-reslute">
        <div className="tab-content px-2 md:!px-4">
          <div className="tab-pane active" id="header" role="tabpanel">
            <div
              id="datatable_wrapper"
              className="information_dataTables dataTables_wrapper dt-bootstrap4"
            >
              <div className="formCreate">
                <form action="">
                  <div className="row">
                    <div className="form-group col-lg-3">
                      <h6>{t("totalClearanceCharge")}</h6>
                      <input
                        onChange={handleChange}
                        type="text"
                        id="name_th"
                        name="custom_clearance_charges"
                        className="form-control"
                        placeholder={t("totalClearanceCharge")}
                        defaultValue={fromData?.custom_clearance_charges}
                      />
                    </div>
                    <div className="form-group col-lg-3">
                      <h6>{t("certificates")}</h6>
                      <input
                        onChange={handleChange}
                        type="text"
                        id="name_en"
                        name="phyto_charges"
                        className="form-control"
                        placeholder={t("certificates")}
                        defaultValue={fromData?.phyto_charges}
                      />
                    </div>
                    <div className="form-group col-lg-3">
                      <h6>{t("chamberOfCommerce")}</h6>
                      <input
                        onChange={handleChange}
                        type="text"
                        id="name_en"
                        name="co_chamber_charges"
                        className="form-control"
                        placeholder={t("chamberOfCommerce")}
                        defaultValue={fromData?.co_chamber_charges}
                      />
                    </div>
                    <div className="form-group col-lg-3">
                      <h6>{t("extras")}</h6>
                      <input
                        onChange={handleChange}
                        type="text"
                        id="hs_code"
                        name="extra_charges"
                        className="form-control"
                        placeholder={t("extras")}
                        defaultValue={fromData?.extra_charges}
                      />
                    </div>
                    <div className="col-lg-3 form-group autoComplete">
                      <h6>
                        <h6>{t("selectVendor")}</h6>
                      </h6>
                      {/* <select
												name="vendor_id"
												value={editClearance.vendor_id}
												onChange={handleChange}
												id=""
												className=""
											>
												{vendorLists.map((item) => (
													<option value={item.vendor_id}>{item.name}</option>
												))}
											</select> */}
                      <Autocomplete
                        options={
                          vendorLists?.map((item) => ({
                            id: item.vendor_id, // Map the vendor ID to `id`
                            name: item.name, // Map the vendor name to `name`
                          })) || []
                        }
                        value={
                          vendorLists.find(
                            (item) => item.vendor_id === (editClearance.vendor_id || editClearance.Clearance_provider)
                          ) || null
                        } // Find the selected value based on vendor_id
                        onChange={(event, newValue) => {
                          handleChange({
                            target: {
                              name: "vendor_id",
                              value: newValue ? newValue.id : "",
                            },
                          });
                        }} // Update the state using handleChange
                        getOptionLabel={(option) => option.name || ""} // Display the vendor name
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t("selectVendor")}
                            variant="outlined"
                          />
                        )}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value?.id
                        } // Ensure proper comparison
                      />
                    </div>
                    <div className="col-lg-3 form-group autoComplete">
                      <h6>{t("portOfOrigins")}</h6>

                      <Autocomplete
                        options={portslists || []}
                        getOptionLabel={(option) => option.port_name || ""} // Label to display
                        onChange={(event, newValue) => {
                          handleChange({
                            target: {
                              name: "from_port",
                              value: newValue ? newValue.port_id : "",
                            },
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t("searchPortOrigin")}
                            variant="outlined"
                          />
                        )}
                        value={
                          portslists?.find(
                            (item) => item.port_id === editClearance.from_port
                          ) || null
                        }
                        isOptionEqualToValue={(option, value) =>
                          option.port_id === value?.port_id
                        }
                      />
                    </div>
                    <div className="col-lg-3 form-group autoComplete">
                      <h6>{t("portType")}</h6>
                      <Autocomplete
                        options={portTypeList || []}
                        getOptionLabel={(option) => option.port_type || ""} // label from API
                        onChange={(event, newValue) => {
                          handleChange({
                            target: {
                              name: "port_type",
                              value: newValue ? newValue.port_type_id : "",
                            },
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t("portType")}
                            variant="outlined"
                          />
                        )}
                        value={
                          portTypeList?.find(
                            (item) =>
                              item.port_type_id === (editClearance.port_type || editClearance.Port_Type)
                          ) || null
                        }
                        isOptionEqualToValue={(option, value) =>
                          option.port_type_id === value?.port_type_id
                        }
                        sx={{ width: 300 }}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="card-footer buttonCreate">
            <button
              onClick={updateClearance}
              className="btn btn-primary"
              style={{ width: "125px" }}
              type="submit"
              name="signup"
            >
              {from?.clearance_id ? t("update") : t("create")}
            </button>
            <Link to="/clearanceNew" className="btn btn-danger">
              {t("cancel")}
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UpdateClearanceNew;
