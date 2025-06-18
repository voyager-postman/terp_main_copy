import React from "react";
import { useQuery } from "react-query";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
// import axios from "axios";
import axios from "../../Url/Api";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import { TableView } from "../table";
import { toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";

const Receiving = () => {
  const navigate = useNavigate();
  const formatTwoDecimals = (value) => {
    return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value); // <-- .format moved here inside the function
  };
  const noDecimal = (value) => {
    return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value); // <-- .format moved here inside the function
  };
  const [data, setData] = useState([]);
  const [viewData, setViewData] = useState("");
  const [dataSet, setDataSet] = useState("");
  const getReceiving = () => {
    axios.get(`${API_BASE_URL}/getViewToReceving`).then((res) => {
      setData(res.data.data || []);
    });
  };
  useEffect(() => {
    getReceiving();
  }, []);

  console.log(data);
  const handleDownloadPDF = async (PODCODE, Quantity) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/ReturnToSupplier`, {
        PODCODE,
        POD_Qty: Quantity,
      });

      console.log("API Response:", response);
      getReceiving();

      toast.success("Successfully returned to supplier.");
    } catch (error) {
      console.error("Error fetching statement:", error);
      toast.error("Something went wrong.");
    }
  };

  // const handleDownloadPDF1 = async (a) => {
  //   console.log(a);

  //   try {
  //     const accessResponse = await axios.post(
  //       `${API_BASE_URL}/updateaccessfile`,
  //       {
  //         id: a.POD_ID,
  //         type: 1,
  //         accesstype: 2, // Mark as in use
  //       }
  //     );
  //     console.log(accessResponse);
  //   } catch (error) {
  //     console.error("Error fetching statement:", error);
  //   }
  //   setDataSet(a);
  //   getReceiving();
  // };
  const handleDownloadPDF1 = async (a) => {
    try {
      const accessResponse = await axios.post(
        `${API_BASE_URL}/Checkeaccessfile`,
        {
          id: a.POD_ID,
          accesstype: 2, // Mark as in use
        }
      );

      console.log(accessResponse);

      if (accessResponse?.data?.success) {
        setDataSet(a); // Set the data before opening modal

        // Open modal using Bootstrap
        const modal = new bootstrap.Modal(
          document.getElementById("exampleModal")
        );
        modal.show();
      } else {
        toast.warning(
          accessResponse?.data?.message || "This file is being accessed."
        );
      }
    } catch (error) {
      console.error("Error fetching access status:", error);
      toast.error("An error occurred while accessing the file.");
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: () => <div style={{ textAlign: "center" }}>PO CODE</div>,
        accessor: "PODCODE",
        Cell: ({ value }) => <div style={{ textAlign: "center" }}>{value}</div>,
      },
      {
        Header: () => <div style={{ textAlign: "center" }}>Vender Name</div>,
        accessor: "Vendor_Name",
        Cell: ({ value }) => <div style={{ textAlign: "left" }}>{value}</div>,
        // if your table supports it
      },
      {
        Header: () => <div style={{ textAlign: "center" }}> Name</div>,

        accessor: "Name_EN",
        Cell: ({ value }) => <div style={{ textAlign: "left" }}>{value}</div>,
        headerStyle: { textAlign: "left" },
      },

      {
        Header: () => <div style={{ textAlign: "center" }}>Date</div>,
        accessor: "Date", // assuming "Date" is a key in your data (like `a.Date`)
        Cell: ({ value }) => <div style={{ textAlign: "left" }}>{value}</div>,
        // Cell: ({ value }) => {
        //   if (!value) return null;
        //   const date = new Date(value);
        //   const formattedDate = `${date
        //     .getDate()
        //     .toString()
        //     .padStart(2, "0")}-${(date.getMonth() + 1)
        //     .toString()
        //     .padStart(2, "0")}-${date.getFullYear()}`;
        //   return <div style={{ textAlign: "center" }}>{formattedDate}</div>;
        // },
      },
      {
        Header: () => <div style={{ textAlign: "center" }}>Crates</div>,
        accessor: "Crates",
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {formatTwoDecimals(value)}{" "}
            {/* <-- correctly calling the function */}
          </div>
        ),
      },
      {
        Header: () => <div style={{ textAlign: "center" }}>Quantity</div>,
        accessor: "Quantity",
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>{formatTwoDecimals(value)}</div>
        ),
      },

      {
        Header: () => <div style={{ textAlign: "center" }}>Unit</div>,
        accessor: "Unit",
        Cell: ({ value }) => <div style={{ textAlign: "center" }}>{value}</div>,
      },

      {
        Header: () => <div style={{ textAlign: "center" }}>Cost</div>,
        accessor: "Cost",
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>{formatTwoDecimals(value)}</div>
        ),
      },
      {
        Header: () => <div style={{ textAlign: "center" }}>QTY / Crate</div>,

        accessor: "Qty/Crate",
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>{formatTwoDecimals(value)}</div>
        ),
      },
      {
        Header: () => <div style={{ textAlign: "center" }}>Status</div>,

        accessor: "Status",
        Cell: ({ value }) => <div style={{ textAlign: "left" }}>{value}</div>,
        headerStyle: { textAlign: "left" },
      },

      {
        Header: () => <div style={{ textAlign: "center" }}>Actions</div>,
        accessor: (a) => (
          <>
            {/* {a.Open === 1 ? (
              <button
                type="button"
                onClick={() => {
                  toast.warning("This file is being accessed.");
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <i
                  className="mdi mdi-check me-2"
                  style={{
                    width: "20px",
                    color: "#203764",
                    fontSize: "22px",
                    marginTop: "10px",
                  }}
                />
              </button>
            ) : ( */}
            <button type="button" onClick={() => handleDownloadPDF1(a)}>
              <i
                className="mdi mdi-check me-2"
                style={{
                  width: "20px",
                  color: "#203764",
                  fontSize: "22px",
                  marginTop: "10px",
                }}
              />
            </button>

            <button
              type="button"
              className="me-2"
              onClick={() => handleDownloadPDF(a.PODCODE, a.Quantity)}
            >
              <i
                className="mdi mdi-package-variant"
                style={{
                  width: "20px",
                  color: "#203764",
                  fontSize: "22px",
                  marginTop: "10px",
                }}
              />
            </button>
            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#modalView"
              onClick={() => setViewData(a)}
            >
              <i
                style={{
                  width: "20px",
                  color: "#203764",
                  fontSize: "22px",
                  marginTop: "10px",
                }}
                className="mdi mdi-eye"
              />
            </button>
          </>
        ),
        id: "Actions", // required when using function accessor
        Cell: ({ value }) => <div style={{ textAlign: "left" }}>{value}</div>,
      },
    ],
    []
  );
  // modal js

  // modal data here
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [color, setColor] = useState(false);

  const location = useLocation();
  // const navigate = useNavigate();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show, setShow] = useState(false);

  const [stock, setStock] = useState("");
  const { from } = location.state || {};
  console.log(from);
  const defaultState = {
    pod_code: from?.PODCODE,
    rcv_crate: from?.Crates,
    rcvd_qty: from?.Quantity,
    rcv_crate_weight: "",
    rcv_gross_weight: "",
    rcvd_unit_id: from?.Unit,
    rcvd_unit_name: "",
    user_id: localStorage.getItem("id"),
  };

  const [state, setState] = useState(defaultState);
  const [unitType, setUnitType] = useState([]);
  const closeIcon = () => {
    setShow(false);
    navigate("/receiving");
  };
  const getUnitType = () => {
    axios
      .get(`${API_BASE_URL}/getAllUnit`)
      .then((response) => {
        setUnitType(response.data.data || []);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getUnitType();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "rcvd_unit_id") {
      const selectedOption = event.target.options[event.target.selectedIndex];
      const selectedText = selectedOption.text;

      setState((prevState) => ({
        ...prevState,
        rcvd_unit_id: value,
        rcvd_unit_name: selectedText,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const addBank = () => {
    axios
      .post(`${API_BASE_URL}/addreceving`, {
        ...state,
        new_quantity: dataSet.Quantity,
        new_unit: dataSet.Unit,
        new_crates: dataSet.Crates,
        pod_code: dataSet?.PODCODE,
        pod_type_id: from?.pod_type_id,
        user_id: localStorage.getItem("id"),
      })
      .then((response) => {
        console.log(response);
        console.log(response.data.success);

        if (response.data.success === true) {
          toast.success("Receiving Added Successfully");
          setStock(response.data.message);
          dataClear();
          getReceiving();
          setColor(true);
          closeBootstrapModal(); // ✅ Close modal here
          // setShow(true); // Show your custom modal
        }
        if (response.data.success === false) {
          setStock(response.data);
          setShow(true);
          // toast.error(response.data.message)
        } else if (!response.data.success && response.data.data == "1") {
          setStock(response.data.message);
          setShow(true);
        } else if (response.data.success && response.data.data == "2") {
          toast.success("Receiving Added Successfully", {
            autoClose: 1000,
            theme: "colored",
          });
          closeBootstrapModal(); // ✅ Also close here if needed

          const accessResponse = axios.post(`${API_BASE_URL}/ReleaseAccess`, {
            id: dataSet.PO_ID,

            accesstype: 2, // Mark as in use
          });
          console.log(accessResponse);
          navigate("/receiving");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong");
        setIsButtonDisabled(false); // Re-enable the button on error
      });
  };

  // const addBank = () => {
  //   if (isButtonDisabled) return;
  //   setIsButtonDisabled(true);

  //   axios
  //     .post(`${API_BASE_URL}/addreceving`, {
  //       ...state,
  //       pod_code: dataSet?.PODCODE,
  //       pod_type_id: from?.pod_type_id,
  //       user_id: localStorage.getItem("id"),
  //     })
  //     .then((response) => {
  //       console.log(response);
  //       console.log(response.data.success, "Check response");
  //       toast.success("receiving Added Successfully");
  //       if (response.data.success && response.data.data == "1") {
  //         console.log(response.data.data.message);
  //         setStock(response.data.message);
  //         console.log(">>>>>>>>>>>>");
  //         setColor(true);
  //         closeBootstrapModal()
  //         // Open a modal here
  //         setShow(true);
  //       } else if (!response.data.success && response.data.data == "1") {
  //         console.log(response.data.data.message);
  //         setStock(response.data.message);
  //         console.log(">>>>>>>>>>>>");
  //         // Open a modal here
  //         setShow(true);
  //       } else if (response.data.success && response.data.data == "2") {
  //         toast.success("receiving Added Successfully", {
  //           autoClose: 1000,
  //           theme: "colored",
  //         });
  //         navigate("/receiving");
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setIsButtonDisabled(false); // Re-enable the button on error
  //     });
  // };

  const dataClear = async () => {
    console.log(dataSet);
    try {
      // First: update access file
      const accessResponse = await axios.post(`${API_BASE_URL}/ReleaseAccess`, {
        id: dataSet.POD_ID,
        accesstype: 2, // Mark as in use
      });

      console.log(
        "Access file updated (inside closeButton):",
        accessResponse.data
      );
      getReceiving();
      // Clear related states
      setState({
        pod_code: "",
        rcv_crate: "",
        rcvd_qty: "",
        rcv_crate_weight: "",
        rcv_gross_weight: "",
        rcvd_unit_id: "",
        user_id: localStorage.getItem("id"), // keep user ID if needed
      });

      setIsButtonDisabled(false);
    } catch (error) {
      console.error("Error updating access file in closeButton:", error);
      toast.error("An error occurred while closing.");
    }
  };

  const closeBootstrapModal = () => {
    const modalEl = document.getElementById("exampleModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) {
      modal.hide();
    }
  };

  const refreshTableData = async () => {
    console.log(dataSet);
    try {
      // First: update access file
      const accessResponse = await axios.post(`${API_BASE_URL}/ReleaseAccess`, {
        id: dataSet.POD_ID,

        accesstype: 2, // Cancel action
      });

      console.log(
        "Access file updated (inside closeButton):",
        accessResponse.data
      );
    } catch (error) {
      console.error("Error updating access file in closeButton:", error);
      toast.error("An error occurred while closing.");
    }
  };
  console.log(viewData);
  return (
    <>
      {/* view modal */}
      <div
        className="modal fade"
        id="modalView"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                View
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i class="mdi mdi-close"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="row mt-2 inputMarginUnset formCreate">
                <div className="form-group col-lg-6">
                  <div className="parentPurchaseView mb-3">
                    <div className="me-3">
                      <strong>
                        User Name <span>:</span>
                      </strong>
                    </div>
                    <div>
                      <p>{viewData?.PO_user_name}</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6"></div>
                <div className="form-group col-lg-3">
                  <div className="parentPurchaseView">
                    <div className="me-3">
                      <strong>
                        Quantity<span>:</span>
                      </strong>
                    </div>
                    <div>
                      <p>{formatTwoDecimals(viewData?.PO_Qty)}</p>
                    </div>
                  </div>
                </div>
                <div className="form-group col-lg-3">
                  <div className="parentPurchaseView">
                    <div className="me-3">
                      <strong>
                        Unit<span>:</span>
                      </strong>
                    </div>
                    <div>
                      <p>{viewData?.PO_Unit_Name_EN}</p>
                    </div>
                  </div>
                </div>
                <div className="form-group col-lg-3">
                  <div className="parentPurchaseView">
                    <div className="me-3">
                      <strong>
                        Crate<span>:</span>
                      </strong>
                    </div>
                    <div>
                      <p>{noDecimal(viewData?.PO_Crates)}</p>
                    </div>
                  </div>
                </div>
                <div className="form-group col-lg-3">
                  <div className="parentPurchaseView">
                    <div className="me-0">
                      <strong>
                        Quantity/Crate<span>:</span>
                      </strong>
                    </div>
                    <div>
                      <p>{formatTwoDecimals(viewData?.["PO_Qty/Crate"])}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer justify-content-center">
              {/* <button type="button" className="btn btn-primary">
               Submit
              </button> */}
            </div>
          </div>
        </div>
      </div>
      {/* view modal end */}
      <Card title="Receive Management">
        <TableView columns={columns} data={data} />
      </Card>

      {/* Button trigger modal */}

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modalShipTo modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Operation / Receiving
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={dataClear}
              >
                <i class="mdi mdi-close"></i>
              </button>
            </div>
            <div className="modal-body">
              <main className="main-content">
                <div>
                  <div className="top-space-search-reslute mt-0">
                    <div className="tab-content">
                      <div
                        className="tab-pane active"
                        id="header"
                        role="tabpanel"
                      >
                        <div
                          id="datatable_wrapper"
                          className="information_dataTables dataTables_wrapper dt-bootstrap4"
                        >
                          <div className="d-flex exportPopupBtn"></div>
                          <div className="formCreate mt-0">
                            <form action="">
                              <div className="row">
                                <div className="form-group col-lg-3">
                                  <div className="parentPurchaseView">
                                    <div className="me-2">
                                      <strong>POD CODE:</strong>
                                    </div>

                                    <p>{dataSet?.PODCODE} </p>
                                  </div>
                                  <div className="parentPurchaseView">
                                    <div className="me-3">
                                      <strong>Name:</strong>
                                    </div>

                                    <p>{dataSet?.Name_EN} </p>
                                  </div>
                                  <div className="flex">
                                    <div className="parentPurchaseView">
                                      <div className="me-2">
                                        <strong>Quantity:</strong>
                                      </div>

                                      <p>
                                        {formatTwoDecimals(dataSet?.Quantity)}{" "}
                                      </p>
                                    </div>
                                    <div className="parentPurchaseView ms-3">
                                      <div className="me-2">
                                        <strong> unit:</strong>
                                      </div>

                                      <p>{dataSet?.Unit} </p>
                                    </div>
                                    <div className="parentPurchaseView ms-3">
                                      <div className="me-2">
                                        <strong>Crates:</strong>
                                      </div>

                                      <p>
                                        {formatTwoDecimals(dataSet?.Crates)}{" "}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="row mt-2 inputMarginUnset">
                                <div className="form-group col-lg-6">
                                  <h6>Crate</h6>
                                  <input
                                    onChange={handleChange}
                                    type="text"
                                    name="rcv_crate"
                                    className="form-control"
                                    value={state.rcv_crate}
                                  />
                                </div>
                                <div className="form-group col-lg-6">
                                  <h6>Quantity</h6>
                                  <input
                                    onChange={handleChange}
                                    type="text"
                                    name="rcvd_qty"
                                    className="form-control"
                                    value={state.rcvd_qty}
                                  />
                                </div>
                                <div className="form-group col-lg-6">
                                  <h6>Crate Weight</h6>
                                  <input
                                    onChange={handleChange}
                                    type="text"
                                    name="rcv_crate_weight"
                                    className="form-control"
                                    value={state.rcv_crate_weight}
                                  />
                                </div>
                                <div className="form-group col-lg-6">
                                  <h6>Gross Weight</h6>
                                  <input
                                    onChange={handleChange}
                                    type="text"
                                    name="rcv_gross_weight"
                                    className="form-control"
                                    value={state.rcv_gross_weight}
                                  />
                                </div>
                                <div className="form-group col-lg-12">
                                  <h6>Unit</h6>
                                  <select
                                    onChange={handleChange}
                                    name="rcvd_unit_id"
                                    className="form-control"
                                    value={state.rcvd_unit_id}
                                  >
                                    <option value="">Select Unit</option>
                                    {unitType.map((unit) => (
                                      <option value={unit.ID}>
                                        {unit.Name_EN}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                      <div className=" ">
                        <button
                          onClick={addBank}
                          className="btn btn-primary"
                          type="submit"
                          name="signup"
                        >
                          Receive
                        </button>
                        <Link
                          className="btn btn-danger "
                          onClick={refreshTableData}
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          to="/receiving"
                        >
                          Cancel
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <Modal
                  className="modalError receiveModal"
                  show={show}
                  onHide={handleClose}
                >
                  <div className="modal-content">
                    <div
                      className="modal-header border-0"
                      style={{
                        backgroundColor: color,
                      }}
                    >
                      <h1 className="modal-title fs-5" id="exampleModalLabel">
                        Receive Check
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
                    <div
                      className="modal-body"
                      style={{
                        backgroundColor: color,
                      }}
                    >
                      <div className="eanCheck errorMessage recheckReceive">
                        <p
                          style={{
                            backgroundColor: color ? "" : "#631f37",
                          }}
                        >
                          {stock.message ? stock.message : "NULL"}
                        </p>
                        {/* <p
                          style={{
                            backgroundColor: color ? "" : "#631f37",
                          }}
                        >
                          {stock.message ? stock.message: "NULL"}
                        </p> */}
                        <div className="closeBtnRece">
                          <button onClick={closeIcon}>Close</button>
                        </div>
                      </div>
                    </div>
                    <div
                      className="modal-footer"
                      style={{
                        backgroundColor: color,
                      }}
                    ></div>
                  </div>
                </Modal>
              </main>
            </div>
            <div className="modal-footer ps-0">
              {/* <button type="button" className="btn btn-primary">
                        Update
                      </button> */}
            </div>
          </div>
        </div>
      </div>
      {/* error modal */}

      {/* error modal end */}
    </>
  );
};

export default Receiving;
