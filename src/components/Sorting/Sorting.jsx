import axios from "axios";
import React, { useMemo, useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import { TableView } from "../table";
import { Button, Modal } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "react-router-dom";

const Sorting = () => {
  const navigate = useNavigate();
  const [id, setId] = useState(null);
  const [viewData, setViewData] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { data: sorted, refetch } = useQuery("getSorting");
  const [data, setData] = useState([]);
  const [restoredRows, setRestoredRows] = useState([]);
  console.log(sorted);
  const getSortData = () => {
    axios.get(`${API_BASE_URL}/getViewToSort`).then((res) => {
      console.log(res);
      setData(res.data.data || []);
    });
  };

  useEffect(() => {
    getSortData();
  }, []);
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

  const restoreSorting = async (id, id1) => {
    if (restoredRows.includes(id)) return; // Do nothing if already restored

    try {
      // Step 1: Check access
      const accessResponse = await axios.post(
        `${API_BASE_URL}/Checkeaccessfile`,
        {
          id: id,
          accesstype: 3, // Mark as in use
        }
      );

      if (!accessResponse?.data?.success) {
        toast.warn(accessResponse.data.message);
        return;
      }

      // Step 2: Restore sorting
      const response = await axios.post(`${API_BASE_URL}/restoreSorting`, {
        receiving_id: id,
        user_id: localStorage.getItem("id"),
        pod_code: id1,
      });

      if (response?.data?.success === false) {
        toast.warn(response.data.message, {
          autoClose: 1000,
          theme: "colored",
        });
      } else if (response?.data?.success === true) {
        toast.success(response.data.message, {
          autoClose: 1000,
          theme: "colored",
        });

        // Step 3: Release access
        const releaseResponse = await axios.post(
          `${API_BASE_URL}/ReleaseAccess`,
          {
            id: id,
            accesstype: 3, // Cancel action
          }
        );
        console.log("Released access:", releaseResponse?.data);
      }

      // Step 4: Refresh data and mark as restored
      getSortData();
      setRestoredRows((prev) => [...prev, id]);
    } catch (error) {
      console.error("Error during restoreSorting:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // const restoreSorting = (id, id1) => {
  //   if (restoredRows.includes(id)) {
  //     return; // Do nothing if already restored
  //   }

  //   axios
  //     .post(`${API_BASE_URL}/restoreSorting`, {
  //       receiving_id: id,
  //       user_id: localStorage.getItem("id"),
  //       pod_code: id1,
  //     })
  //     .then((response) => {
  //       if (response?.data?.success == false) {
  //         toast.warn(response.data.message, {
  //           autoClose: 1000,
  //           theme: "colored",
  //         });
  //         getSortData();
  //       }
  //       console.log(response);
  //       if (response?.data?.success == true) {
  //         toast.success(response.data.message, {
  //           autoClose: 1000,
  //           theme: "colored",
  //         });
  //         getSortData();
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  const form = useForm({
    defaultValues: {
      USER: localStorage.getItem("id"),
      Sorting_id: id,
      Qty_on_hand: "",
      Crates_on_hand: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/Adjust_sorting_stock`,
          {
            ...value,
            Qty_on_hand: parseInt(value.Qty_on_hand, 10),
            Crates_on_hand: parseInt(value.Crates_on_hand, 10),
          }
        );
        console.log(response.status); // Log the response object
        if (response.status == 200) {
          toast.success("Ean Packing update successful");
          getEanPackaging();
          setIsOpen(false);
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    },
  });
  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = (id = null) => {
    setId(id);
    form.reset();
    setIsOpen(true);
  };
  console.log(viewData);
  const columns = useMemo(
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
        accessor: (row) => {
          const date = new Date(row.Date);
          return date.toLocaleDateString("en-GB"); // 'en-GB' gives dd/mm/yyyy format
        },
        id: "Date", // important when using function accessor
        Cell: ({ value }) => <div style={{ textAlign: "center" }}>{value}</div>,
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
        Header: "Actions",
        accessor: (a) => (
          <>
            <button type="button" onClick={() => handleDownloadPDF1(a)}>
              <i
                className="mdi mdi-check me-2"
                type="button"
                // data-bs-toggle="modal"
                // data-bs-target="#exampleModal"
                style={{
                  width: "20px",
                  color: "#203764",
                  fontSize: "22px",
                  marginTop: "10px",
                }}
              />
            </button>
            {/* <button type="button" onClick={() => openModal(a.sorting_id)}>
              <i
                className="mdi mdi-delete"
                style={{
                  width: "20px",
                  color: "#203764",
                  fontSize: "22px",
                  marginTop: "10px",
                }}
              />
            </button> */}
            <button
              type="button"
              className="me-2"
              onClick={() => restoreSorting(a.receiving_id, a.pod_code)}
              // disabled={restoredRows.includes(a.receiving_id)}
            >
              <i
                className="mdi mdi-restore"
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
                className="mdi mdi-eye"
                style={{
                  width: 20,
                  color: "rgb(32, 55, 100)",
                  fontSize: 22,
                  marginTop: 10,
                }}
              />
            </button>
          </>
        ),
      },
    ],
    [restoredRows]
  );
  // modal
  const [show, setShow] = useState(false);
  const [stock, setStock] = useState("");

  const handleClose = () => setShow(false);
  const [color, setColor] = useState(false);
  const [recievingid, setRecievingid] = useState({});
  const { from } = location.state || {};
  const [unitType, setUnitType] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const handleDownloadPDF1 = async (a) => {
    try {
      const accessResponse = await axios.post(
        `${API_BASE_URL}/Checkeaccessfile`,
        {
          id: a.receiving_id,

          accesstype: 3, // Mark as in use
        }
      );
      console.log(accessResponse);
      // Assuming the API returns something like { success: true } or status code 200
      if (accessResponse?.data?.success) {
        setDataSet(a);
        setRecievingid(a);
        // Manually open the modal
        const modal = new bootstrap.Modal(
          document.getElementById("exampleModal")
        );
        modal.show();
      } else {
        toast.warning(accessResponse?.data?.message);
      }
    } catch (error) {
      console.error("Error fetching statement:", error);
      toast.error("An error occurred while accessing the file.");
    }
  };
  const closeIcon = () => {
    setShow(false);
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

  const [dataSet, setDataSet] = useState("");
  useEffect(() => {
    getUnitType();
  }, []);
  const defaultState = {
    receiving_id: dataSet?.receiving_id,
    sorting_good: from?.qty_to_sort,
    sorted_crates: from?.cartes_to_sort,
    sorting_notes: "",
    blue_crates: "",
    user_id: localStorage.getItem("id"),
  };
  console.log(recievingid);
  const [state, setState] = useState(defaultState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
    console.log(state);
  };
  const closeBootstrapModal = () => {
    const modalElement = document.getElementById("exampleModal"); // Modal ID
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide(); // Hide the modal
    }
  };

  const addBank = async () => {
    // Uncomment if you want to disable button to prevent double submission
    // if (isButtonDisabled) return;
    // setIsButtonDisabled(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/addsorting`, {
        ...state,
        receiving_id: recievingid.receiving_id,
        new_quantity: dataSet.Quantity,
        new_unit: dataSet.Unit,
        new_crates: dataSet.Crates,
        // pod_code: dataSet?.PODCODE,
        // pod_type_id: from?.pod_type_id,
        // user_id: localStorage.getItem("id"),
      });

      const res = response.data;
      console.log(res);

      if (res.message === "Done") {
        setStock(res.message);
        setColor(true);
        closeBootstrapModal();
        getSortData();
        dataClear();

        const accessResponse = await axios.post(
          `${API_BASE_URL}/ReleaseAccess`,
          {
            id: dataSet.receiving_id,

            accesstype: 3,
          }
        );

        console.log("Access file updated (edit mode):", accessResponse.data);

        toast.success("Sorting Added Successfully", {
          autoClose: 2000,
          onClose: () => {
            closeBootstrapModal();
            // setShow(true);
          },
        });
      } else if (res.success === false) {
        setStock(res);
        setShow(true);
      } else if (res.success && res.data === "2") {
        const accessResponse = await axios.post(
          `${API_BASE_URL}/ReleaseAccess`,
          {
            id: dataSet.receiving_id,

            accesstype: 3,
          }
        );

        console.log("Access file updated (edit mode):", accessResponse.data);

        toast.success("Sorting Added Successfully", {
          autoClose: 1000,
          theme: "colored",
          onClose: () => {
            closeBootstrapModal();
            navigate("/sorting");
          },
        });
      }
    } catch (error) {
      console.error("Error adding sorting:", error);
      setIsButtonDisabled(false);
    }
  };

  // const addBank = () => {
  //   // if (isButtonDisabled) return;
  //   // setIsButtonDisabled(true);

  //   axios
  //     .post(`${API_BASE_URL}/addsorting`, {
  //       ...state,
  //       receiving_id: recievingid.receiving_id,
  //       new_quantity: dataSet.Quantity,
  //       new_unit: dataSet.Unit,
  //       new_crates: dataSet.Crates,
  //       /* pod_code: dataSet?.PODCODE,
  //       pod_type_id: from?.pod_type_id,
  //       user_id: localStorage.getItem("id"), */
  //     })
  //     .then((response) => {
  //       const res = response.data;
  //       console.log(res);
  //       if (res.message === "Done") {
  //         setStock(res.message);
  //         setColor(true);
  //         closeBootstrapModal();
  //         getSortData();
  //         dataClear();
  //         toast.success("Sorting Added Successfully", {
  //           autoClose: 2000,
  //           onClose: () => {
  //             closeBootstrapModal(); // ✅ close modal after toast disappears
  //             // setShow(true); // ✅ show result modal after modal is closed
  //           },
  //         });
  //       } else if (res.success === false) {
  //         setStock(res);
  //         setShow(true);
  //       } else if (res.success && res.data === "2") {
  //         toast.success("Sorting Added Successfully", {
  //           autoClose: 1000,
  //           theme: "colored",
  //           onClose: () => {
  //             closeBootstrapModal(); // ✅ close modal after toast
  //             navigate("/sorting"); // ✅ navigate after modal is closed
  //           },
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       setIsButtonDisabled(false);
  //     });
  // };
  const habdelClickrefreshData = async () => {
    try {
      // First: update access file
      const accessResponse = await axios.post(`${API_BASE_URL}/ReleaseAccess`, {
        id: dataSet.receiving_id,

        accesstype: 3, // Cancel action
      });

      console.log(
        "Access file updated (inside closeButton):",
        accessResponse.data
      );

      getSortData();
    } catch (error) {
      console.error("Error updating access file in closeButton:", error);
      toast.error("An error occurred while closing.");
    }
  };

  const dataClear = async () => {
    try {
      // First: update access file
      const accessResponse = await axios.post(`${API_BASE_URL}/ReleaseAccess`, {
        id: dataSet.receiving_id,

        accesstype: 3, // Cancel action
      });

      console.log(
        "Access file updated (inside closeButton):",
        accessResponse.data
      );

      setState({
        pod_code: "",
        sorted_crates: "",
        blue_crates: "",
        sorting_good: "",
        sorting_notes: "",
        rcvd_unit_id: "",
        user_id: localStorage.getItem("id"), // keep user ID if needed
      });
      setIsButtonDisabled(false);
    } catch (error) {
      console.error("Error updating access file in closeButton:", error);
      toast.error("An error occurred while closing.");
    }
  };

  // const dataClear = () => {
  // setState({
  //   pod_code: "",
  //   sorted_crates: "",
  //   blue_crates: "",
  //   sorting_good: "",
  //   sorting_notes: "",
  //   rcvd_unit_id: "",
  //   user_id: localStorage.getItem("id"), // keep user ID if needed
  // });
  // setIsButtonDisabled(false);
  // };
  const deletemodalchage = (e) => {
    const { name, value } = e.target;
    setDatadelete({ ...datadelete, [name]: value });
  };

  const handleclickpostapi = async () => {
    const datapsot = {
      sorting_id: "",
      Quantity_on_Hand: "",
      Crates_on_Hand: "",
      user_id: "",
    };

    // try {
    //   const response = await axios.post(`${API_BASE_URL}SortingStockWaste`,datapsot)
    //  if(response.data.success){
    //   console.log(response)
    //  }
    // } catch (error) {
    //  console.log(error)
    // }
  };
  return (
    <div>
      {/* view modal */}
      <div
        className="modal fade"
        id="modalView"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
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
                      <p>{viewData?.user_name}</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6"></div>
                <div className="form-group col-lg-4">
                  <div className="parentPurchaseView">
                    <div className="me-3">
                      <strong>
                        Recieving Crate
                        <span>:</span>
                      </strong>
                    </div>
                    <div>
                      <p>{noDecimal(viewData?.Receiving_Crates)}</p>
                    </div>
                  </div>
                  <div className="parentPurchaseView">
                    <div className="me-3">
                      <strong>
                        Blue Crate
                        <span>:</span>
                      </strong>
                    </div>
                    <div>
                      <p>{noDecimal(viewData?.Blue_Crates)}</p>
                    </div>
                  </div>
                </div>

                <div className="form-group col-lg-8">
                  <div className="parentPurchaseView">
                    <div className="me-3">
                      <strong>
                        Sorting Good
                        <span>:</span>
                      </strong>
                    </div>
                    <div>
                      <p>{formatTwoDecimals(viewData?.Sorting_Good)}</p>
                    </div>
                  </div>
                  <div className="parentPurchaseView">
                    <div className="me-3">
                      <strong>
                        Sorting Note
                        <span>:</span>
                      </strong>
                    </div>
                    <div>
                      <p>{viewData?.sorting_Notes}</p>
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
      <Card title="Sorting Management">
        <TableView columns={columns} data={data || []} />
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabindex="-1"
        >
          <div className="modal-dialog modalShipTo modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Operation / Sorting
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
                                          <strong> Unit:</strong>
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
                                    <h6> Recieving Crate</h6>
                                    <input
                                      onChange={handleChange}
                                      type="number"
                                      name="sorted_crates"
                                      className="form-control"
                                      value={state.sorted_crates}
                                    />
                                  </div>
                                  {/* <div className="form-group col-lg-6">
                                  <h6>Quantity</h6>
                                  <input
                                    onChange={handleChange}
                                    type="text"
                                    name="rcvd_qty"
                                    className="form-control"
                                    value={state.rcvd_qty}
                                  />
                                </div> */}
                                </div>
                                <div className="row inputMarginUnset">
                                  <div className="form-group col-lg-6">
                                    <h6>Blue Crate </h6>
                                    <input
                                      onChange={handleChange}
                                      type="text"
                                      name="blue_crates"
                                      className="form-control"
                                      value={state.blue_crates}
                                    />
                                  </div>
                                  <div className="form-group col-lg-6">
                                    <h6>Sorting Good</h6>
                                    <input
                                      onChange={handleChange}
                                      type="number"
                                      name="sorting_good"
                                      className="form-control"
                                      value={state.sorting_good}
                                    />
                                  </div>
                                  <div className="form-group col-lg-12">
                                    <h6>Sorting Note</h6>
                                    <input
                                      onChange={handleChange}
                                      type="text"
                                      name="sorting_notes"
                                      className="form-control"
                                      value={state.sorting_notes}
                                    />
                                    {/* <textarea name="" id=""></textarea> */}
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
                            // disabled={isButtonDisabled}
                            type="submit"
                            name="signup"
                          >
                            Sort
                          </button>
                          <Link
                            className="btn btn-danger"
                            onClick={habdelClickrefreshData}
                            to="/sorting"
                            data-bs-dismiss="modal"
                            aria-label="Close"
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
                          backgroundColor: color ? "#2f423c" : "",
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
                          backgroundColor: color ? "#2f423c" : "",
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
                          {stock.Message_TH ? stock.Message_TH : "NULL"}
                        </p> */}
                          <div className="closeBtnRece">
                            <button onClick={closeIcon}>Close</button>
                          </div>
                        </div>
                      </div>
                      <div
                        className="modal-footer"
                        style={{
                          backgroundColor: color ? "#2f423c" : "",
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
      </Card>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center modalEanEdit">
          <div
            className="fixed w-screen h-screen bg-black/20"
            onClick={closeModal}
          />
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="crossArea">
              <h3>Edit Details</h3>
              <p onClick={closeModal}>
                <CloseIcon />
              </p>
            </div>
            <form.Provider>
              <form
                className="formEan formCreate p-0"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  void form.handleSubmit();
                }}
              >
                <div className="p-3">
                  <div className="form-group">
                    <label>Quantity on Hand</label>
                    <form.Field
                      name="Qty_on_hand "
                      children={(field) => (
                        <input
                          type="number"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={deletemodalchage}
                        />
                      )}
                    />
                  </div>
                  <div className="form-group">
                    <label>Crates on Hand</label>
                    <form.Field
                      name="Crates_on_hand "
                      children={(field) => (
                        <input
                          type="number"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={deletemodalchage}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="modal-footer d-flex justify-content-center">
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      className="bg-gray-300 px-4 py-2 rounded"
                      onClick={closeModal}
                    >
                      Close
                    </button>

                    <button
                      type="submit"
                      className="bg-black text-white px-4 py-2 rounded"
                      onClick={handleclickpostapi}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </form.Provider>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sorting;
