import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { TableView } from "../../table";
import MySwal from "../../../swal";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";

// import TextField from "@mui/material/TextField";
// import Autocomplete from "@mui/material/Autocomplete";
// import { useQuery } from "react-query";
const FreightNew = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isOn, setIsOn] = useState(true);
  const [clientId, setClientId] = useState("");
  // State to hold selected values
  const [show, setShow] = useState(false);

  const [stock, setStock] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [vendorId, setVendorId] = useState("");
  const [portOfOrigin, setPortOfOrigin] = useState("");
  const [destinationPort, setDestinationPort] = useState("");
  const [linerId, setLinerId] = useState("");

  // Fetch vendor, ports, and liner data
  const { data: vendors } = useQuery("getAllVendor");
  const { data: ports } = useQuery("getAllAirports");
  const { data: liners } = useQuery("getLiner");

  // Handle form submission
  const closeIcon = () => {
    setShow(false);
    navigate("/freightNew");
  };
  const handleSubmit = async () => {
    const payload = {
      vendor_id: vendorId,
      port_of_origin: portOfOrigin,
      destination_port: destinationPort,
      liner: linerId,
      user_id: localStorage.getItem("id"),
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/AddfreightRoute`,
        payload
      );
      getFreight();

      if (response.data.success == false) {
        setStock(response.data.message);
        setShow(true);
      } else {
        // Handle success
        toast.success("Freight  Added  Successfully", {
          autoClose: 1000,
          theme: "colored",
        });
      }
      setVendorId("");
      setPortOfOrigin("");
      setDestinationPort("");
      setLinerId("");
      let modalElement = document.getElementById("exampleModal2");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
      console.log("Success:", response.data);
      // You can show a success message here
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went Wrong ");
      // Handle error appropriately
    }
  };
  const getFreight = () => {
    axios
      .get(`${API_BASE_URL}/getFreight`)
      .then((response) => {
        setData(response.data.freightData);
      })
      .catch((error) => {
        console.log(error);
      });
  };
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
            `${API_BASE_URL}/DeletefreightRoute`,
            {
              freight_id: id,
            }
          );
          console.log(response);
          getFreight();
          toast.success("Freight delete successfully");
        } catch (e) {
          toast.error("Something went wrong");
        }
      }
    });
  };
  useEffect(() => getFreight(), []);
  const updateEanStatus = (eanID) => {
    const request = {
      Freight_Route_ID: eanID,
    };

    axios
      .post(`${API_BASE_URL}/StatusChangeFreightRoute`, request)
      .then((resp) => {
        // console.log(resp, "Check Resp")
        if (resp.data.success == true) {
          toast.success("Status Updated Successfully", {
            autoClose: 1000,
            theme: "colored",
          });
          getFreight();
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        Id: "index",
        accessor: (_rows, i) => i + 1,
      },
      {
        Header: "Freight Provider",
        accessor: (a) => a.Freight_provider_name,
      },
      {
        Header: "From Port",
        accessor: (a) => a.FromPort,
      },
      {
        Header: "Destination Port",
        accessor: (a) => a.DestinationPort,
      },
      {
        Header: "Liner",
        accessor: (a) => a.Airline,
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
              onClick={() => updateEanStatus(a.ID)}
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

      // {
      // 	Header: "Actions",
      // 	accessor: (a) => (
      // 		<Link to="/update_freight" state={{ from: a }}>
      // 			<i
      // 				i
      // 				className="mdi mdi-pencil"
      // 				style={{
      // 					width: "20px",
      // 					color: "#203764",
      // 					fontSize: "22px",
      // 					marginTop: "10px",
      // 				}}
      // 			/>
      // 		</Link>
      // 	),
      // },
      {
        Header: "Actions",
        accessor: (a) => (
          <>
            <Link to="/update_freight" state={{ from: a }}>
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
            <button type="button" onClick={() => deleteOrder(a.ID)}>
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
        accessor: (a) => " ",
      },
    ],
    []
  );

  return (
    <>
      <Card
        title="Freight Management"
        endElement={
          <div>
            <button
              type="button"
              className="btn button btn-info"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal2"
              onClick={() => {
                // Reset the Autocomplete fields when opening the modal
                setVendorId("");
                setPortOfOrigin("");
                setDestinationPort("");
                setLinerId("");
              }}
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
                      Freight Route
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      <i className="mdi mdi-close" />
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-lg-12 form-group vendorInputUnset mb-2">
                        <h6>Vendor</h6>
                        <div className="ceateTransport">
                          <Autocomplete
                            disablePortal
                            options={vendors || []} // Use your vendors array as options
                            getOptionLabel={(option) => option.name} // Display the vendor's name
                            value={
                              vendorId
                                ? vendors.find(
                                    (vendors) => vendors.ID === vendorId
                                  )
                                : null
                            } // Bind to state
                            onChange={(e, newValue) =>
                              setVendorId(newValue?.ID || "")
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
                        <h6>Port of origin</h6>
                        <div className="ceateTransport">
                          <Autocomplete
                            disablePortal
                            options={ports || []} // Use ports array as options
                            getOptionLabel={(option) => option.port_name} // Display the port name
                            value={
                              portOfOrigin
                                ? ports.find(
                                    (ports) => ports.port_id === portOfOrigin
                                  )
                                : null
                            } // Bind to state
                            onChange={(e, newValue) =>
                              setPortOfOrigin(newValue?.port_id || "")
                            }
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

                      <div className="col-lg-12 form-group mb-2">
                        <h6>Destination Port</h6>
                        <Autocomplete
                          disablePortal
                          options={ports || []} // Use the same ports array for destination port
                          getOptionLabel={(option) => option.port_name} // Display the port name
                          value={
                            destinationPort
                              ? ports.find(
                                  (ports) => ports.port_id === destinationPort
                                )
                              : null
                          } // Bind to state
                          onChange={(e, newValue) =>
                            setDestinationPort(newValue?.port_id || "")
                          }
                          sx={{ width: 300 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Search Destination Port"
                              InputLabelProps={{ shrink: false }}
                            />
                          )}
                        />
                      </div>

                      <div className="col-lg-12 form-group mb-2">
                        <h6>Liner</h6>
                        <Autocomplete
                          disablePortal
                          options={liners || []} // Use the liners array as options
                          getOptionLabel={(option) => option.liner_name} // Display the liner's name
                          value={
                            linerId
                              ? liners.find(
                                  (liner_id) => liner_id.liner_id === linerId
                                )
                              : null
                          } // Bind to state
                          onChange={(e, newValue) =>
                            setLinerId(newValue?.liner_id || "")
                          }
                          sx={{ width: 300 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Search Liner"
                              InputLabelProps={{ shrink: false }}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer justify-content-center">
                    <button
                      type="button"
                      className="UpdatePopupBtn btn btn-primary"
                      onClick={handleSubmit}
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
              Freight Check
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
              <p style={{ backgroundColor: "#631f37 " }}>
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

export default FreightNew;
