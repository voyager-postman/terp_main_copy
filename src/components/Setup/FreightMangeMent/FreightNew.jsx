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
import { useTranslation } from "react-i18next";

// import TextField from "@mui/material/TextField";
// import Autocomplete from "@mui/material/Autocomplete";
// import { useQuery } from "react-query";
const FreightNew = () => {
  const { t, i18n } = useTranslation("global");
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
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
        toast.success(t("freightAddSuccess"), {
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
      toast.error(t("tryAgain"));
      // Handle error appropriately
    }
  };

  const deleteOrder = (id) => {
    console.log(id);
    MySwal.fire({
      title: t("areYouSure"),
      text: t("irreversible"),
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
          toast.success(t("freightDeleteSuccess"));
        } catch (e) {
          toast.error(t("tryAgain"));
        }
      }
    });
  };

  const getFreight = () => {
    axios
      .get(`${API_BASE_URL}/Freight_EN`)
      .then((res) => {
        console.log(res);

        const { head, data, title } = res.data;
        // Remove unwanted columns from table (Order_ID, Status_value)
        const columnsToHide = ["ID"];

        // Create dynamic columns excluding hidden ones
        const dynamicColumns = Object.keys(head)
          .filter((key) => !columnsToHide.includes(key))
          .map((key) => ({
            Header: t(head[key]), // Translate header if needed
            accessor: key,
          }));

        dynamicColumns.push({
          Header: t("status"),
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
                <span>{t("off")}</span>
                <span>{t("on")}</span>
              </span>
              <a></a>
            </label>
          ),
        });

        dynamicColumns.push({
          Header: t("actions"),

          accessor: (row) => (
            <>
              <Link to="/update_freight" state={{ from: row }}>
                <i
                  className="mdi mdi-pencil"
                  style={{
                    width: "20px",
                    color: "#203764",
                    fontSize: "20px",
                    marginTop: "10px",
                  }}
                />
              </Link>
              <button type="button" >
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
        });

        setColumns(dynamicColumns);
        setData(data || []);
      })
      .catch((err) => {
        console.error("Error fetching quotations:", err);
      });
  };
  useEffect(() => {
    getFreight();
  }, [i18n]);

  const updateEanStatus = (eanID) => {
    const request = {
      Freight_Route_ID: eanID,
    };

    axios
      .post(`${API_BASE_URL}/StatusChangeFreightRoute`, request)
      .then((resp) => {
        // console.log(resp, "Check Resp")
        if (resp.data.success == true) {
          toast.success(t("statusUpdated"), {
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

  return (
    <>
      <Card
        title={t("freightManagement")}
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
              {t("create")}
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
                      {t("freightRoute")}
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
                        <h6> {t("vendor")}</h6>
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
                                placeholder={t("searchVendor")} // Adds a placeholder
                                InputLabelProps={{ shrink: false }} // Prevents floating label
                              />
                            )}
                          />
                        </div>
                      </div>

                      <div className="col-lg-12 form-group mb-2">
                        <h6>{t("portOfOrigin")}</h6>
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
                                placeholder={t("searchPortOrigin")}
                                InputLabelProps={{ shrink: false }}
                              />
                            )}
                          />
                        </div>
                      </div>

                      <div className="col-lg-12 form-group mb-2">
                        <h6> {t("destinationPort")}</h6>
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
                              placeholder={t("searchDestinationPort")}
                              InputLabelProps={{ shrink: false }}
                            />
                          )}
                        />
                      </div>

                      <div className="col-lg-12 form-group mb-2">
                        <h6>{t("liner")}</h6>
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
                              placeholder={t("searchLiner")}
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
                      {t("submit")}
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
              {t("freightCheck")}
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
