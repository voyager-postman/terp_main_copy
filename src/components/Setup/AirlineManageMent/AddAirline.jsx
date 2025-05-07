import axios from "axios";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { useQuery } from "react-query";
import { ComboBox } from "../../combobox";
import { Autocomplete, TextField } from "@mui/material";

const AddAirline = () => {
  const { data: dummyData } = useQuery("Providerdropdown");
  const location = useLocation();
  const { from } = location.state || {};
  const navigate = useNavigate();
  const [state, setState] = useState({
    liner_id: from?.liner_id ?? undefined,
    liner_name: from?.liner_name || "",
    liner_code: from?.liner_code || "",
    liner_type_id: from?.liner_type_id || 1,
    preffered_supplier: from?.preffered_supplier || "",
    user_id: localStorage.getItem("id"),
  });
  console.log(dummyData);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const update = () => {
    axios
      .post(`${API_BASE_URL}/updateLiner`, state)
      .then((response) => {
        toast[response.data.success ? "success" : "error"](
          response.data.success ? "Success" : "Error",
          {
            autoClose: 1000,
            theme: "colored",
          }
        );
        navigate("/airlinenew");
      })
      .catch((error) => {
        // console.log(error)
      });
  };
  const dataComparison = [
    { id: 1, label: "Air" },
    { id: 2, label: "Sea" },
    { id: 3, label: "Land" },
  ];
  return (
    <Card
      title={`Liner Management / ${
        typeof state.liner_id !== "undefined" ? "Update" : "Create"
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
                  <div className="row justify-content-center">
                    <div className="form-group col-lg-3">
                      <h6>Name</h6>
                      <input
                        type="text"
                        name="liner_name"
                        className="form-control"
                        placeholder="name"
                        onChange={handleChange}
                        value={state.liner_name}
                      />
                    </div>
                    <div className="form-group col-lg-3">
                      <h6>Code</h6>
                      <input
                        type="text"
                        name="liner_code"
                        className="form-control"
                        placeholder="code"
                        onChange={handleChange}
                        value={state.liner_code}
                      />
                    </div>
                    <div className="form-group col-lg-3 radioLiner autoComplete">
                      <h6>Liner Type</h6>
                      {/* <select
                        value={state.liner_type_id}
                        name="liner_type_id"
                        onChange={handleChange}
                      >
                        <option value={1}>Air</option>
                        <option value={2}>Sea</option>
                        <option value={3}>Land</option>
                      </select> */}
                      <Autocomplete
                        disablePortal
                        options={dataComparison} // Pass the dataComparison array with {id, label}
                        getOptionLabel={(option) => option.label} // Use label for displaying in the dropdown
                        value={
                          dataComparison.find(
                            (option) => option.id === state.liner_type_id
                          ) || null
                        } // Match the selected value with the option
                        onChange={(event, newValue) => {
                          // Update the state when the selection changes
                          handleChange({
                            target: {
                              name: "liner_type_id",
                              value: newValue ? newValue.id : null, // Set null if no value is selected
                            },
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select Liner Type" // Placeholder text
                          />
                        )}
                      />
                    </div>
                    <div className="col-lg-4 form-group autoComplete">
                      <h6>Preferred Provider</h6>
                      {/* <ComboBox
                        options={dummyData?.map((v) => ({
                          id: v.vendor_id,
                          name: v.name,
                        }))}
                        value={state.preffered_supplier}
                        onChange={(e) =>
                          setState({ ...state, preffered_supplier: e })
                        }
                      /> */}
                      {/* <Autocomplete
                        options={dummyData?.map((v) => ({
                          client_id: v.vendor_id, // Assuming vendor_id is used as client_id
                          client_name: v.name, // Assuming name is used as client_name
                        })) || []}
                        getOptionLabel={(option) => option.client_name || ""}
                        onChange={(event, newValue) => {
                          setState({
                            ...state,
                            preffered_supplier: newValue ? { client_id: newValue.client_id, client_name: newValue.client_name } : null,
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select Preferred Provider"
                            variant="outlined"
                          />
                        )}
                        value={state.preffered_supplier || null}
                        isOptionEqualToValue={(option, value) => option.client_id === value.client_id}
                      /> */}
                      <Autocomplete
                        options={
                          dummyData?.map((v) => ({
                            id: v.vendor_id,
                            name: v.name,
                          })) || []
                        }
                        getOptionLabel={(option) => option.name || ""}
                        onChange={(event, newValue) => {
                          setState((prevState) => ({
                            ...prevState,
                            preffered_supplier: newValue ? newValue.id : null, // Store only the ID
                          }));
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select Preferred Supplier"
                            variant="outlined"
                          />
                        )}
                        value={
                          dummyData?.find(
                            (v) => v.vendor_id === state.preffered_supplier
                          ) || null
                        }
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                      />
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
                onClick={update}
                name="signup"
              >
                {typeof state.liner_id !== "undefined" ? "Update" : "Create"}
              </button>
              <Link className="btn btn-danger" to="/airlineNew">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AddAirline;
