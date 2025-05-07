import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { Autocomplete, TextField } from "@mui/material";

const UpdateClearanceNew = () => {
  const nevigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || {};
  const defaultState = {
    vendor_id: from?.Clearance_provider || "",
    custom_clearance_charges: from?.custom_clearance_charges || "",
    co_chamber_charges: from?.co_chamber_charges || "",
    phyto_charges: from?.phyto_charges || "",
    from_port: from?.from_port || "",
    extra_charges: from?.extra_charges || "",
  };

  const [vendorLists, setVendorLists] = useState([]);
  const [portslists, setPortslists] = useState([]);

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
          toast.error("Network Error", {
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
          toast.error("Network Error", {
            autoClose: 1000,
            theme: "colored",
          });
          return;
        }
      });
  };

  useEffect(() => {
    getVendorLists();
    getPortList();
  }, []);

  // Get Vendor List Api

  // Update Clearance Api

  const updateClearance = (res) => {
    const request = {
      clearance_id: from?.clearance_id,
      user_id: localStorage.getItem("id"),
      from_port: editClearance.from_port,
      vendor_id: editClearance.vendor_id,
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
          toast.error("Vender is Already exist", {
            autoClose: 1000,
            theme: "colored",
          });

          return;
        }
      })
      .catch((error) => {
        if (error) {
          toast.error("Network Error", {
            autoClose: 1000,
            theme: "colored",
          });
          return;
        }
      });
  };

  // Update Clearance Api
  return (
    <Card
      title={`Clearance Management / ${
        from?.clearance_id ? "Update" : "Create"
      } Form`}
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
                      <h6>Total Clearance Charge</h6>
                      <input
                        onChange={handleChange}
                        type="text"
                        id="name_th"
                        name="custom_clearance_charges"
                        className="form-control"
                        placeholder="name"
                        defaultValue={from?.custom_clearance_charges}
                      />
                    </div>
                    <div className="form-group col-lg-3">
                      <h6>Certificates</h6>
                      <input
                        onChange={handleChange}
                        type="text"
                        id="name_en"
                        name="phyto_charges"
                        className="form-control"
                        placeholder="width"
                        defaultValue={from?.phyto_charges}
                      />
                    </div>
                    <div className="form-group col-lg-3">
                      <h6>Chamber of Commerce</h6>
                      <input
                        onChange={handleChange}
                        type="text"
                        id="name_en"
                        name="co_chamber_charges"
                        className="form-control"
                        placeholder="lenght"
                        defaultValue={from?.co_chamber_charges}
                      />
                    </div>
                    <div className="form-group col-lg-3">
                      <h6>Extras</h6>
                      <input
                        onChange={handleChange}
                        type="text"
                        id="hs_code"
                        name="extra_charges"
                        className="form-control"
                        placeholder="height"
                        defaultValue={from?.extra_charges}
                      />
                    </div>
                    <div className="col-lg-3 form-group autoComplete">
                      <h6>
                        <h6>Vendor</h6>
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
                        } // Default to an empty array if vendorLists is undefined
                        value={
                          vendorLists.find(
                            (item) => item.vendor_id === editClearance.vendor_id
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
                            placeholder="Select Vendor"
                            variant="outlined"
                          />
                        )}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value?.id
                        } // Ensure proper comparison
                      />
                    </div>
                    <div className="col-lg-3 form-group autoComplete">
                      <h6>Port of origins</h6>
                      {/* <select
												name="from_port"
												value={editClearance.from_port}
												onChange={handleChange}
												id=""
												className=""
											>
												{portslists.map((item) => (
													<option value={item.port_id}>{item.port_name}</option>
												))}
											</select> */}
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
                            placeholder="Select Port"
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
              {from?.clearance_id ? "Update" : "Create"}
            </button>
            <Link to="/clearanceNew" className="btn btn-danger">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UpdateClearanceNew;
