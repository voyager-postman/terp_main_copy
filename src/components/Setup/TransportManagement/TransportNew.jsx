import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { TableView } from "../../table";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import MySwal from "../../../swal";
import { Button, Modal } from "react-bootstrap";

const TransportNew = () => {
  const navigate = useNavigate();
  const { from } = location.state || {};
  const [data, setData] = useState([]);
  const [clientId, setClientId] = useState("");
  const [show, setShow] = useState(false);

  const [stock, setStock] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { data: fromLocation } = useQuery("getLocation");
  const { data: clients } = useQuery("getAllVendor");
  const { data: departurePort } = useQuery("getAllAirports");
  const defaultState = {
    user_id: localStorage.getItem("id"),
    transport_id: from?.transport_id || "",
    Transportation_provider: from?.Transportation_provider || 1,
    loading_from: from?.loading_from || 1,
    departure_port: from?.departure_port || 1,
    port_type: from?.port_type_id || 1,
    truck1: from?.truck1 || "",
    max_weight1: from?.max_weight1 || "",
    max_cbm1: from?.max_cbm1 || "",
    max_pallet1: from?.max_pallet1 || "",
    price1: from?.price1 || "",
    truck2: from?.truck2 || "",
    max_weight2: from?.max_weight2 || "",
    max_cbm2: from?.max_cbm2 || "",
    max_pallet2: from?.max_pallet2 || "",
    price2: from?.price2 || "",
    truck3: from?.truck3 || "",
    max_weight3: from?.max_weight3 || "",
    max_cbm3: from?.max_cbm3 || "",
    max_pallet3: from?.max_pallet3 || "",
    price3: from?.price3 || "",
  };
  const [editProduceData, setEditProduceData] = useState(defaultState);
  const [formData, setFormData] = useState({
    loading_from: "",
    departure_port: "",
    port_type: "", // In case you need this data
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const dataClear = () => {
    setClientId("");
    setFormData({
      port_type: "",
      loading_from: "",
      departure_port: "",
    });
  };
  // Handle form submission
  const handleSubmit = async () => {
    const data = {
      Transportation_provider: clientId, // Vendor
      port_type: formData.port_type,
      loading_from: formData.loading_from,
      departure_port: formData.departure_port,
      user_id: localStorage.getItem("id"), // Assuming you have userId available
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/AddTransportRoute`,
        data
      );
      console.log(response);
      // Reset form fields
      setClientId(null); // Clear vendor selection
      setFormData({
        loading_from: "",
        departure_port: "",
        port_type: "", // Reset port type if needed
      });
      let modalElement = document.getElementById("exampleModal2");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }

      getTransport();
      if (response.data.success == false) {
        setStock(response.data.message);
        setShow(true);
      } else {
        // Handle success
        toast.success("Transport  Create   Successfully", {
          autoClose: 1000,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error("Something went Wrong ");
      console.error("Error adding transport route", error);
    }
  };

  const handleChange1 = (event) => {
    const { name, value } = event.target;
    setEditProduceData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };
  const updatePort = () => {
    axios
      .post(
        `${API_BASE_URL}/${
          typeof from?.transport_id == "undefined"
            ? "addTransportation"
            : "updateTransportation"
        }`,
        editProduceData
      )
      .then((response) => {
        toast[response.data.success == true ? "success" : "error"](
          response.data.message,
          {
            autoClose: 1000,
            theme: "colored",
          }
        );
        if (response.data.success == true) navigate("/transportNew");
      })
      .catch((error) => {
        if (error) {
          toast.error("Network Error", {
            autoClose: 1000,
            theme: "colored",
          });
          return false;
        }
      });
  };
  const updateEanStatus = (eanID) => {
    const request = {
      transport_id: eanID,
    };

    axios
      .post(`${API_BASE_URL}/StatusChangeTransportRoute`, request)
      .then((resp) => {
        // console.log(resp, "Check Resp")
        if (resp.data.success == true) {
          toast.success("Status Updated Successfully", {
            autoClose: 1000,
            theme: "colored",
          });
          getTransport();
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const closeIcon = () => {
    setShow(false);
    navigate("/transportNew");
  };
  const getTransport = () => {
    axios
      .get(`${API_BASE_URL}/getTransport`)
      .then((response) => {
        if (response.data.success == true) {
          setData(response.data.transportData);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => getTransport(), []);
  const deleteOrder = (id) => {
    console.log(id);
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      console.log(result);
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/DeleteTransportRoute`,
            {
              Transportation_id: id,
            }
          );
          console.log(response);
          getTransport();
          toast.success("Transport delete successfully");
        } catch (e) {
          toast.error("Something went wrong");
        }
      }
    });
  };
  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        id: "index",
        accessor: (_row, i) => i + 1,
      },
      {
        Header: "Vendor",
        accessor: "Transportation_provider_name",
      },
      {
        Header: "Location",
        accessor: "location",
      },
      {
        Header: "Port",
        accessor: "port",
      },
      {
        Header: "Port Type",
        accessor: "port_type",
      },

      {
        Header: "Status",
        accessor: (a) => (
          <label
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
            }}
            className="toggleSwitch large"
          >
            <input
              checked={a.Status == "on" ? true : false}
              onChange={() => {
                setIsOn(!isOn);
              }}
              onClick={() => updateEanStatus(a.transport_id)}
              value={a.Status}
              type="checkbox"
            />
            <span>
              <span>OFF</span>
              <span>ON</span>
            </span>
            <a></a>
          </label>
        ),
      },
      {
        Header: "Actions",
        accessor: (a) => (
          <>
            <Link to="/updateTransport" state={{ from: a }}>
              <i
                i
                className="mdi mdi-pencil"
                style={{
                  width: "20px",
                  color: "#203764",
                  fontSize: "20px",
                  marginTop: "10px",
                }}
              />
            </Link>
            <button type="button" onClick={() => deleteOrder(a.transport_id)}>
              <i
                className="mdi mdi-delete"
                style={{
                  width: "20px",
                  color: "#203764",
                  fontSize: "22px",
                  marginTop: "10px",
                }}
              />
            </button>
          </>
        ),
      },

      {
        Header: "Stats",
        accessor: (a) => "",
      },
    ],
    []
  );

  return (
    <>
      <Card
        title="Transportation Management"
        endElement={
          <div>
            <button
              type="button"
              className="btn button btn-info"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal2"
            >
              Create
            </button>

            <div
              className="modal fade freightModalCreate"
              id="exampleModal2"
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog  ">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                      Transport Route
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={dataClear}
                    >
                      <i className="mdi mdi-close" />
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-lg-12 form-group vendorInputUnset  mb-2">
                        <h6>Vendor</h6>
                        <div className="ceateTransport">
                          <Autocomplete
                            disablePortal
                            options={clients} // Use your clients array as options
                            getOptionLabel={(option) => option.name} // Display the client's name
                            value={
                              clientId
                                ? clients.find(
                                    (client) => client.ID === clientId
                                  )
                                : null
                            } // Bind to state
                            onChange={(e, newValue) =>
                              setClientId(newValue?.ID || "")
                            }
                            sx={{ width: 300 }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Search Vendor" // Adds a placeholder
                                InputLabelProps={{ shrink: false }} // Prevents floating label
                              />
                            )}
                          />
                        </div>
                      </div>

                      <div className="col-lg-12 form-group mb-2">
                        <h6>From Location</h6>
                        <div className="ceateTransport">
                          <Autocomplete
                            disablePortal
                            options={fromLocation} // Using your fromLocation array as options
                            getOptionLabel={(option) => option.name} // Display the location's name
                            value={
                              formData.loading_from
                                ? fromLocation.find(
                                    (loc) => loc.id === formData.loading_from
                                  )
                                : null
                            } // Bind to state
                            onChange={(e, newValue) =>
                              handleChange({
                                target: {
                                  name: "loading_from",
                                  value: newValue?.id || "",
                                },
                              })
                            } // Set the selected location id
                            sx={{ width: 300 }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Search Port Of Origin" // Adds a placeholder
                                InputLabelProps={{ shrink: false }} // Prevents floating label
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12 form-group mb-2">
                        <h6>Departure Port</h6>
                        <div className="ceateTransport">
                          <Autocomplete
                            disablePortal
                            options={departurePort || []} // Ensure departurePort is an array and not undefined
                            getOptionLabel={(option) => option.port_name || ""} // Fallback in case option.port_name is undefined
                            value={
                              formData.departure_port // Use departure_port to find the selected value
                                ? departurePort.find(
                                    (port) =>
                                      port.port_id === formData.departure_port
                                  )
                                : null
                            } // Bind to state
                            onChange={(e, newValue) => {
                              if (newValue) {
                                setFormData((prevData) => ({
                                  ...prevData,
                                  departure_port: newValue.port_id,
                                  port_type: newValue.port_type_id,
                                }));
                              } else {
                                setFormData((prevData) => ({
                                  ...prevData,
                                  departure_port: "",
                                  port_type: "",
                                }));
                              }
                            }}
                            sx={{ width: 300 }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Search Port Of Origin"
                                InputLabelProps={{ shrink: false }}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer justify-content-center">
                    <button
                      type="button"
                      className="UpdatePopupBtn btn btn-primary "
                      onClick={handleSubmit} // Call handleSubmit when clicking the button
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      >
        <TableView columns={columns} data={data} />
      </Card>
      <Modal
        className="modalError receiveModal"
        show={show}
        onHide={handleClose}
      >
        <div className="modal-content">
          <div className="modal-header border-0">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Transport Check
            </h1>
            <button
              style={{ color: "#fff", fontSize: "30px" }}
              type="button"
              // onClick={() => setShow(false)}
              onClick={closeIcon}
            >
              <i class="mdi mdi-close"></i>
            </button>
          </div>
          <div className="modal-body">
            <div className="eanCheck errorMessage recheckReceive">
              <p style={{ backgroundColor: "#631f37" }}>
                {stock ? stock : "NULL"}
              </p>
            </div>
          </div>
          <div className="modal-footer"></div>
        </div>
      </Modal>
    </>
  );
};

export default TransportNew;
