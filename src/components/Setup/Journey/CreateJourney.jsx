import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { useQuery } from "react-query";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const CreateJourney = () => {
  const { from } = location.state || {};
  console.log(from)
  const navigate = useNavigate();
  const { data: ports } = useQuery("getAllAirports");
  const { data: liner } = useQuery("getLiner");
  console.log(ports);
  console.log(liner);

  const defaultState = {
    from_port_id: 0,
    destination_port_id: 0,
    liner_id: 0,
    journey_number: "",
    currency: "",
    load_time: "",
    transit_to_departure: "",
    etd: "",
    transit_to_arrival: "",
    eta: "",
  };

  const [state, setState] = useState(defaultState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };
  const options = ports?.map((item) => ({
    label: item.port_name,
    value: item.port_id,
  }));
  const handleAutocompleteChange = (event, newValue) => {
    handleChange({
      target: {
        name: "from_port_id",
        value: newValue ? newValue.value : 0,
      },
    });
  };
  const selectedOption = options?.find(option => option.value === state.from_port_id) || null;

  const addBank = () => {
    const request = {
      from_port: state.from_port_id,
      destination_port: state.destination_port_id,
      liner_id: state.liner_id,
      journey_number: state.journey_number,
      load_time: state.load_time,
      Transit_to_Departure: state.transit_to_departure,
      ETD: state.etd,
      Transit_to_arrival: state.transit_to_arrival,
      ETA: state.eta,
    };
    console.log(request)
    axios
      .post(`${API_BASE_URL}/Addjourneydetails`, request)
      .then((response) => {
        console.log(response, "Check responseee");
        if (response.data.success == true) {
          toast.success("Journey Added Successfully", {
            autoClose: 1000,
            theme: "colored",
          });
          navigate("/journey");
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Card title="Journey / Create Form">
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
                    <div className="form-group col-lg-3 autoComplete">
                      <h6>From Port</h6>
                      {/* <select
                        name="from_port_id"
                        onChange={handleChange}
                        value={state.from_port_id}
                      >
                        <option value={0}>Please select From </option>
                        {ports?.map((item) => (
                          <option
                            key={item.port_id}
                            value={item.port_id}
                          >
                            {item.port_name}
                          </option>
                        ))}
                      </select> */}
                      <Autocomplete
                        value={selectedOption} // Set the value based on the selected port
                        onChange={handleAutocompleteChange} // Handle value change
                        options={options || []} // Use the mapped options for the dropdown
                        getOptionLabel={(option) => option.label || ""} // Option label to display
                        isOptionEqualToValue={(option, value) => option.value === value.value} // Ensure the value comparison is correct
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Please select From"
                          />
                        )}
                      />
                    </div>
                    <div className="form-group col-lg-3 autoComplete">
                      <h6>Designation Port</h6>
                      {/* <select
                        name="destination_port_id"
                        onChange={handleChange}
                        value={state.destination_port_id}
                      >
                        <option value={0}>Please select Designation</option>
                        {ports?.map((item) => (
                          <option
                            key={item.port_id}
                            value={item.port_id}
                          >
                            {item.port_name}
                          </option>
                        ))}
                      </select> */}
                      <Autocomplete
                        options={
                          ports?.map((port) => ({
                            id: port.port_id,
                            name: port.port_name,
                          })) || []
                        } // Map ports to create options with `id` and `name`
                        getOptionLabel={(option) => option.name || ""} // Display the port name
                        value={
                          ports
                            ?.map((port) => ({
                              id: port.port_id,
                              name: port.port_name,
                            }))
                            .find((option) => option.id === state.destination_port_id) ||
                          null
                        } // Match the current `destination_port_id` in state with the options
                        onChange={(e, newValue) => {
                          setState({ ...state, destination_port_id: newValue?.id || 0 }); // Update state with selected port's `id`
                        }}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        } // Ensure proper option matching
                        sx={{ width: 300 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select Destination Port" // Adds a placeholder
                            InputLabelProps={{ shrink: false }} // Prevents floating label
                          />
                        )}
                      />
                    </div>

                    <div className="form-group col-lg-3 autoComplete">
                      <h6> Liner</h6>
                      {/* <select
                        name="liner_id"
                        onChange={handleChange}
                        value={state.liner_id}
                      >
                        <option value={0}>Please select Liner</option>
                        {liner?.map((item) => (
                          <option
                            key={item.liner_id}
                            value={item.liner_id}
                          >
                            {item.liner_name}
                          </option>
                        ))}
                      </select> */}
                      <Autocomplete
                        options={
                          liner?.map((item) => ({
                            id: item.liner_id,
                            name: item.liner_name,
                          })) || []
                        } // Map liner to create options with `id` and `name`
                        getOptionLabel={(option) => option.name || ""} // Display the liner name
                        value={
                          liner
                            ?.map((item) => ({
                              id: item.liner_id,
                              name: item.liner_name,
                            }))
                            .find((option) => option.id === state.liner_id) ||
                          null
                        } // Match the current `liner_id` in state with the options
                        onChange={(e, newValue) => {
                          setState({ ...state, liner_id: newValue?.id || 0 }); // Update state with selected liner's `id`
                        }}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        sx={{ width: 300 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select Liner" // Adds a placeholder
                            InputLabelProps={{ shrink: false }} // Prevents floating label
                          />
                        )}
                      />
                    </div>
                    <div className="form-group col-lg-3">
                      <h6>Journey Number</h6>
                      <input
                        name="journey_number"
                        onChange={handleChange}
                        value={state.journey_number}
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="row">


                    <div className="form-group col-lg-4">
                      <h6>Load Time</h6>
                      <input
                        onChange={handleChange}
                        type="time"
                        id="name_en"
                        name="load_time"
                        value={state.load_time}
                      />
                    </div>

                    <div className="form-group col-lg-4">
                      <h6>Transit to Departure</h6>
                      <input
                        onChange={handleChange}
                        type="number"
                        id="name_en"
                        name="transit_to_departure"
                        className="form-control"
                        placeholder="Transit to Departure"
                        value={state.transit_to_departure}
                      />
                    </div>

                    <div className="form-group col-lg-4">
                      <h6>ETD</h6>
                      <input
                        onChange={handleChange}
                        type="time"
                        id="name_en"
                        name="etd"
                        value={state.etd}
                      />
                    </div>
                    <div className="form-group col-lg-6">
                      <h6>Transit to Arrival</h6>
                      <input
                        onChange={handleChange}
                        type="number"
                        id="name_en"
                        name="transit_to_arrival"
                        className="form-control"
                        placeholder="Transit to Arrival"
                        value={state.transit_to_arrival}
                      />
                    </div>
                    <div className="form-group col-lg-6">
                      <h6>ETA</h6>
                      <input
                        onChange={handleChange}
                        type="time"
                        id="name_en"
                        name="eta"
                        value={state.eta}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button
              onClick={addBank}
              className="btn btn-primary"
              type="submit"
              name="signup"
            >
              Create
            </button>
            <Link className="btn btn-danger" to="/journey">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CreateJourney;
