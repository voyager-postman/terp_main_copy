import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import MySwal from "../../swal";
import { ComboBox } from "../combobox";
import { TableView } from "../table";
import { Button, Modal } from "react-bootstrap";
import {
  LocalizationProvider,
  DesktopDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import { Autocomplete } from "@mui/material";

const NewEanPacking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { from } = location.state || {};
  const [closeButton, setCloseButton] = useState(true);
  console.log(from.Produce_id);
  console.log(from);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [eanListData, setEanListData] = useState([]);
  const [massageShow, setMassageShow] = useState("");
  const [massageShow1, setMassageShow1] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDate1, setSelectedDate1] = useState(new Date());
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const eanList = () => {
    axios
      .post(`${API_BASE_URL}/getEANList`, {
        item_id: from?.Produce_id,
      })
      .then((response) => {
        console.log(response);
        setEanListData(response.data.data);
      })
      .catch((error) => {
        console.error("There was an error updating the data!", error);
      });
  };
  console.log(eanListData);
  useEffect(() => {
    eanList();
  }, []);
  const handleDateChange1 = (date) => {
    setSelectedDate1(date);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    const formattedDate = date
      .toLocaleString("en-GB", options)
      .replace(",", "");
    return formattedDate.replace(/\//g, "-");
  };
  const loadingModal = MySwal.mixin({
    title: "Loading...",
    didOpen: () => {
      MySwal.showLoading();
    },
    showCancelButton: false,
    showConfirmButton: false,
    allowOutsideClick: false,
  });

  const openModal = () => {
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false);
    setData("");
  };

  const defaultState = {
    pod_code: from?.PODCODE,
    sorting_id: from?.sorting_id,
    qty_used: from?.Quantity,
    crates_used: from?.Crates,
    user_id: localStorage.getItem("id"),
    number_of_staff: "",
    start_time: "",
    end_time: "",
  };

  const defaultData = {
    ean_id: null,
    unit_id: null,
    brand_id: null,
    ean_quantity: 0,
  };

  const [state, setState] = useState(defaultState);
  const [toggle, setToggle] = useState(false);
  const [data, setData] = useState(defaultData);
  const [packingCommonId, setPackingCommonId] = useState(null);
  const [packingEanId, setPackingEanId] = useState(null);
  const [datatable, setDatatable] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  console.log(state.start_time);
  const { data: unitType } = useQuery("getAllUnit");
  const { data: brands } = useQuery("getBrand");
  const { data: eanData } = useQuery("getEan");
  console.log(packingCommonId);
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");
  const columns = useMemo(
    () => [
      {
        Header: "EAN",
        accessor: "ean_name_en",
      },
      {
        Header: "Quantity",
        accessor: "ean_qty",
      },
      {
        Header: "Unit",
        accessor: "packing_ean_unit",
      },
      {
        Header: "Ean Cost",
        accessor: "ean_cost",
      },
      {
        Header: "Average Weight",
        accessor: "average_weight",
      },
      {
        Header: "Ean Per KG",
        accessor: "EanPerKg",
      },
      {
        Header: "Ean Per Hour",
        accessor: "EanPerHour",
      },
    ],
    []
  );

  useEffect(() => {
    getPackingCommon();
  }, []);

  useEffect(() => {
    if (packingCommonId) {
      getDatatable(packingCommonId);
    }

    setState((prevState) => ({ ...prevState, defaultData }));
  }, [toggle === true]);
  const options =
    eanListData?.map((item) => ({
      id: item.EAN_ID,
      name: role === "Operation" ? item.ean_name_th : item.ean_name_en,
    })) || [];
  const getPackingCommon = () => {
    const request = {
      pod_code: from?.pod_code,
      sorting_id: from?.sorting_id,
    };

    loadingModal.fire();

    axios.post(`${API_BASE_URL}/getPackingCommon`, request).then((response) => {
      console.log(response);
      if (response.data.data) {
        const { packing_common_id, number_of_staff, start_time, end_time } =
          response.data.data;

        // setPackingCommonId((prevState) => packing_common_id);
        setState((prevState) => {
          return {
            ...prevState,
            number_of_staff: "",
            start_time: "",
            end_time: "",
          };
        });

        // getDatatable(packing_common_id);
      }

      MySwal.close();
    });
  };
  const brandOptions =
    brands?.map((item) => ({
      id: item.ID,
      name: item.Name_EN,
    })) || [];
  const getDatatable = async (packing_common_id) => {
    await axios
      .post(`${API_BASE_URL}getEanDetailViews`, {
        packing_common_id: packing_common_id,
        // last_inserted_id: filterdata,
      })
      .then((response) => {
        console.log(response);
        if (response.data.data) {
          setDatatable(response.data.data);
        }
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };
  const formatDate1 = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const closeIcon = () => {
    setShow(false);

    if (massageShow) {
      setMassageShow("");
    }

    if (massageShow1) {
      setMassageShow1("");
    }
  };
  const handleChangeData = (e, name) => {
    setData((prevState) => ({ ...prevState, [name]: e }));
  };

  const handleChangeQty = (e) => {
    setData((prevState) => ({ ...prevState, ean_quantity: e.target.value }));
  };
  const formatTwoDecimals = (value) => {
    return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };
  const noDecimal = (value) => {
    return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  // const checkPackCommonId = async () => {
  //   axios
  //     .post(`${API_BASE_URL}/CheckstartEndTime`, {
  //       start_time: formatDate(selectedDate1),
  //       end_time: formatDate(selectedDate),
  //     })
  //     .then((response) => {
  //       console.log(response);
  //       const responseData = response.data;

  //       if (responseData.success === true) {
  //         console.log(packingCommonId);
  //         if (!packingCommonId) {
  //           const {
  //             qty_used,
  //             number_of_staff,
  //             crates_used,
  //             start_time,
  //             end_time,
  //           } = state;

  //           if (
  //             !qty_used ||
  //             !crates_used ||
  //             !number_of_staff ||
  //             !selectedDate ||
  //             !selectedDate1
  //           ) {
  //             return toast.error("Please fill all fields");
  //           }
  //         }
  //         setCloseButton(false);
  //         openModal();
  //       } else if (responseData.success === false) {
  //         closeModal();
  //         // Remove unwanted line breaks and concatenate messages
  //         const message = `${responseData.message.en.trim()} ${responseData.message.th.trim()}`;

  //         toast.error(message, {
  //           className: "toast-error",
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       return toast.error(error);
  //     });
  // };
  const checkPackCommonId = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/CheckstartEndTime`, {
        start_time: formatDate(selectedDate1),
        end_time: formatDate(selectedDate),
      });

      const responseData = response.data;

      if (responseData.success === true) {
        if (!packingCommonId) {
          const { qty_used, number_of_staff, crates_used } = state;

          // Step-by-step single validation
          if (!crates_used) {
            return toast.error("Please enter Crates value");
          }

          if (!qty_used) {
            return toast.error("Please enter Quantity value");
          }

          if (!number_of_staff) {
            return toast.error("Please enter Number of Staff value");
          }

          if (!selectedDate1) {
            return toast.error("Please select Start Time");
          }

          if (!selectedDate) {
            return toast.error("Please select End Time");
          }
        }

        setCloseButton(false);
        openModal();
      } else if (responseData.success === false) {
        closeModal();
        const message = `${responseData.message.en.trim()} ${responseData.message.th.trim()}`;
        toast.error(message, {
          className: "toast-error",
        });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  const calculate = async () => {
    console.log("called");
    try {
      await axios
        .post(`${API_BASE_URL}createEanPacking`, {
          packing_common_id: packingCommonId,
          packing_ean_id: packingEanId,
        })
        .then((response) => {
          console.log(response);
          if (response.data.success == false) {
            getDatatable(packingCommonId);

            setShow(true);
            setMassageShow(response.data.message_th);
            setCloseButton(true);
          } else if (response.data.success == true) {
            getDatatable(packingCommonId);
            setShow(false);

            setCloseButton(true);
            toast.success("Ean updated successfully");
            setToggle(!toggle);
          }
        });
    } catch (error) {
      console.error("Error:", error);
      // Handle any errors here if needed, e.g., show a notification to the user
    }
  };

  const saveNewDetails = async () => {
    const { ean_id, unit_id, brand_id, ean_quantity } = data;

    if (!unit_id || brand_id === null || !ean_quantity) {
      return toast.error("Please fill all fields");
    }

    const request = {
      ean_id: ean_id,
      unit_id: unit_id,
      brand_id: brand_id,
      ean_quantity: ean_quantity,
      packing_common_id: packingCommonId,
      number_of_staff: state.number_of_staff,
      start_time: formatDate(selectedDate1),
      end_time: formatDate(selectedDate),
      user_id: localStorage.getItem("id"),
      assigned_order: selectedOrder,
      state,
    };

    axios
      .post(`${API_BASE_URL}/createEanProducne`, request)
      .then((response) => {
        console.log(response);
        setPackingCommonId(response.data.data);
        const packingEanId = response.data.packing_ean_id?.[0]?.[0]?.["@LID"];
        setPackingEanId(packingEanId);
        // const lidValue = response.data.data[0][0]["@LID"];
        // console.log(lidValue);
        // setFilterdata(lidValue);
        if (response.status === 200) {
          toast.success("EanPacking detail added successfully");
          closeModal();
          setToggle(!toggle);
          setData({
            ean_id: "",
            unit_id: "",
            brand_id: null,
            ean_quantity: "",
          });
          setSelectedOrder("");
        }
      })
      .catch((error) => {
        return toast.error(error);
      });
  };

  const handleNewSlecter = () => {
    axios
      .post(`${API_BASE_URL}/AssignOrderDropDownList`, {
        produce_id: from.Produce_id,
      })
      .then((response) => {
        console.log(response.data.data[0], "this is new item");
        setAssigned(response.data.data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    handleNewSlecter();
  }, []);

  console.log(selectedOrder, "this is selected value");

  return (
    <>
      <main className="main-content">
        <div>
          <nav
            className="navbar navbar-main navbar-expand-lg px-0 shadow-none border-radius-xl"
            id="navbarBlur"
            navbar-scroll="true"
          >
            <div className="container-fluid py-1 px-0">
              <nav aria-label="breadcrumb"></nav>
            </div>
          </nav>

          <div className=" pt-1 py-4 px-0">
            <div className="row">
              <div className="col-lg-12 col-md-12 mb-4">
                <div className="bg-white">
                  <div className="databaseTableSection pt-0">
                    <div className="grayBgColor" style={{ padding: "18px" }}>
                      <div className="row">
                        <div className="col-md-6">
                          <h6 className="font-weight-bolder mb-0">
                            Operation / EAN Packing Management
                          </h6>
                        </div>
                      </div>
                    </div>

                    <div className="top-space-search-reslute p-3">
                      <div className="tab-content px-2 md:!px-4">
                        <div
                          className="tab-pane active"
                          id="header"
                          role="tabpanel"
                        >
                          <div
                            id="datatable_wrapper"
                            className="information_dataTables dataTables_wrapper dt-bootstrap4"
                          >
                            {/* <div className="formCreate">
                              <div className="d-flex">
                                <div className="form-group me-4">
                                  <div className="flex">
                                    <h6 className="me-2">Name : </h6>
                                    <p> {from?.user_name}</p>
                                  </div>
                                </div>
                                <div className="form-group me-1">
                                  <div className="flex">
                                    <h6 className="me-2">Quantity :</h6>
                                    <p> {from?.Quantity}</p>{" "}
                                    <p>&nbsp;{from?.Unit}</p>
                                  </div>
                                </div>
                               
                              </div>
                            </div> */}
                            <div className="row mt-2 inputMarginUnset formCreate">
                              <div className="form-group col-lg-6">
                                <div className="parentPurchaseView mb-3">
                                  <div className="me-3">
                                    <strong>
                                      PODCODE <span>:</span>
                                    </strong>
                                  </div>
                                  <div>
                                    <p>{from?.PODCODE}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-6"></div>
                              <div className="form-group col-lg-4">
                                <div className="parentPurchaseView">
                                  <div className="me-3">
                                    <strong>Date :</strong>
                                  </div>
                                  <div>{formatDate1(from?.Date)}</div>
                                </div>

                                <div className="parentPurchaseView">
                                  <div className="me-3">
                                    <strong>
                                      Supplier <span>:</span>
                                    </strong>
                                  </div>
                                  <div>
                                    <p>{from?.Vendor_Name}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="form-group col-lg-4">
                                <div className="parentPurchaseView">
                                  <div className="me-3">
                                    <strong>
                                      Crate
                                      <span>:</span>
                                    </strong>
                                  </div>
                                  <div>
                                    <p>{formatTwoDecimals(from?.Crates)}</p>
                                  </div>
                                </div>
                                <div className="parentPurchaseView">
                                  <div className="me-3">
                                    <strong>
                                      Quantity
                                      <span>:</span>
                                    </strong>
                                  </div>
                                  <div>
                                    <p>{formatTwoDecimals(from?.Quantity)}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="form-group col-lg-4">
                                <div className="parentPurchaseView">
                                  <div className="me-3">
                                    <strong>
                                      Unit<span>:</span>
                                    </strong>
                                  </div>
                                  <div>
                                    <p>{from?.Unit}</p>
                                  </div>
                                </div>

                                <div className="parentPurchaseView">
                                  <div className="me-3">
                                    <strong>
                                      Quantity/crate<span>:</span>
                                    </strong>
                                  </div>
                                  <div>
                                    <p>{from["Qty/Crate"]}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="formCreate">
                              <form action="">
                                <div className="row">
                                  <div className="form-group col-lg-3">
                                    <h6>Crates used</h6>
                                    <input
                                      onChange={handleChange}
                                      type="number"
                                      name="crates_used"
                                      className="form-control"
                                      value={state.crates_used}
                                    />
                                  </div>
                                  <div className="form-group col-lg-3">
                                    <h6>Quantity used</h6>
                                    <input
                                      onChange={handleChange}
                                      type="number"
                                      name="qty_used"
                                      className="form-control"
                                      value={state.qty_used}
                                    />
                                  </div>

                                  <div className="form-group col-lg-3">
                                    <h6>Number of Staff</h6>
                                    <input
                                      onChange={handleChange}
                                      type="number"
                                      name="number_of_staff"
                                      className="form-control"
                                      value={state.number_of_staff}
                                    />
                                  </div>
                                  <div className="form-group col-lg-3 eanDateTime">
                                    <h6>Start Time</h6>
                                    <LocalizationProvider
                                      dateAdapter={AdapterDateFns}
                                    >
                                      <Box
                                        sx={{
                                          display: "flex",
                                          flexDirection: "column",
                                          alignItems: "center",
                                          mt: 4,
                                        }}
                                      >
                                        <DesktopDateTimePicker
                                          value={selectedDate1}
                                          onChange={handleDateChange1}
                                          renderInput={(params) => (
                                            <TextField {...params} />
                                          )}
                                        />
                                      </Box>
                                    </LocalizationProvider>
                                  </div>
                                  <div className="form-group col-lg-3 eanDateTime">
                                    <h6>End Time</h6>
                                    {/* <input
                                    onChange={handleChange}
                                    type="time"
                                    name="end_time"
                                    className="form-control"
                                    value={state.end_time}
                                  /> */}
                                    <LocalizationProvider
                                      dateAdapter={AdapterDateFns}
                                    >
                                      <Box
                                        sx={{
                                          display: "flex",
                                          flexDirection: "column",
                                          alignItems: "center",
                                          mt: 4,
                                        }}
                                      >
                                        <DesktopDateTimePicker
                                          value={selectedDate}
                                          onChange={handleDateChange}
                                          renderInput={(params) => (
                                            <TextField {...params} />
                                          )}
                                        />
                                      </Box>
                                    </LocalizationProvider>
                                  </div>
                                </div>
                                <div className="flex gap-2 items-center justify-between flex-wrap">
                                  <div className="addBtnEan flex flex-wrap gap-3 items-center mb-4">
                                    <button
                                      type="button"
                                      onClick={() => calculate()}
                                      disabled={!packingCommonId}
                                    >
                                      Calculate
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => checkPackCommonId()}
                                    >
                                      Add
                                    </button>
                                  </div>
                                </div>
                                {/* <TableView columns={columns} data={datatable} /> */}
                                <div className="table-responsive">
                                  <table
                                    id="example"
                                    className="display transPortCreate table table-hover table-striped borderTerpProduce table-responsive"
                                    style={{ width: "100%" }}
                                  >
                                    <thead>
                                      <tr>
                                        <th>EAN</th>
                                        <th>Quantity</th>
                                        <th>Unit</th>
                                        <th>Ean Cost</th>
                                        <th>Average Weight</th>
                                        <th>Ean Per KG</th>
                                        <th>Ean Per Hour</th>
                                        <th>Wastage</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {datatable.map((item, index) => (
                                        <tr key={index}>
                                          <td>{item.ean_name_en}</td>
                                          <td>{item.ean_qty}</td>
                                          <td>{item.packing_ean_unit}</td>
                                          <td>{item.ean_cost}</td>
                                          <td>{item.average_weight}</td>
                                          <td>{item.EanPerKg}</td>
                                          <td>{item.EanPerHour}</td>
                                          <td>{item.Wastage}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <div className="card-footer">
                        {closeButton ? (
                          // <Link className="btn btn-danger" to={"/eanPacking"}>
                          //   Close
                          // </Link>

                          <button
                            onClick={async () => {
                              try {
                                const res = await axios.post(
                                  `${API_BASE_URL}/ReleaseAccess`,
                                  {
                                    id: from?.sorting_id,
                                    accesstype: 4, // Mark as in use
                                  }
                                );

                                navigate("/eanPacking");
                              } catch (error) {
                                console.error("Access API error:", error);
                                toast.error(
                                  "Something went wrong while checking file access."
                                );
                              }
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            Close{" "}
                          </button>
                        ) : (
                          ""
                        )}
                      </div> */}
                      <div className="card-footer">
                        {closeButton ? (
                          <button
                            className="btn btn-danger"
                            onClick={async () => {
                              if (from?.sorting_id) {
                                try {
                                  const res = await axios.post(
                                    `${API_BASE_URL}/ReleaseAccess`,
                                    {
                                      id: from.sorting_id,
                                      accesstype: 4, // Mark as in use
                                    }
                                  );

                                  navigate("/eanPacking");
                                } catch (error) {
                                  console.error("Access API error:", error);
                                  toast.error(
                                    "Something went wrong while checking file access."
                                  );
                                }
                              } else {
                                // Optional: Handle the case where sorting_id is missing
                                toast.warning(
                                  "Invalid operation: Sorting ID not found."
                                );
                              }
                            }}
                            // style={{
                            //   background: "none",
                            //   border: "none",
                            //   cursor: "pointer",
                            // }}
                          >
                            Close
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isOpenModal && (
            <div className="fixed inset-0 flex items-center justify-center modalEanEdit">
              <div
                className="fixed w-screen h-screen bg-black/20"
                onClick={closeModal}
              />
              <div className="bg-white rounded-lg shadow-lg max-w-md w-full z-50">
                <div className="crossArea">
                  <h3>Edit Details</h3>
                  <p onClick={closeModal}>
                    <CloseIcon />
                  </p>
                </div>
                <div className="formEan formCreate">
                  <div className="form-group mb-3 autoComplete">
                    <label>EAN</label>
                    {/* <ComboBox
                      options={eanListData?.map((item) => ({
                        id: item.ean_id,
                        name:
                          // (email === "Plaew" && role === "Operation") ||
                          // (email === "Gam" && role === "Operation") ||
                          role === "Operation"
                            ? item.ean_name_th
                            : item.ean_name_en,
                      }))}
                      value={data?.ean_id}
                      onChange={(e) => handleChangeData(e, "ean_id")}
                    /> */}
                    <Autocomplete
                      options={options}
                      getOptionLabel={(option) => option.name}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          handleChangeData(newValue.id, "ean_id");
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select EAN"
                          variant="outlined"
                        />
                      )}
                      value={
                        options.find((option) => option.id === data?.ean_id) ||
                        null
                      }
                      disablePortal
                      sx={{ width: 300 }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Quantity</label>
                    <input
                      type="number"
                      value={data?.ean_quantity}
                      name="ean_quantity"
                      onChange={(e) => handleChangeQty(e)}
                    />
                  </div>
                  <div className="form-group mb-3 autoComplete">
                    <label>Unit</label>
                    {/* <ComboBox
                      options={unitType?.map((item) => ({
                        id: item.unit_id,
                        name: item.unit_name_en,
                      }))}
                      value={data?.unit_id}
                      onChange={(e) => handleChangeData(e, "unit_id")}
                    /> */}
                    <Autocomplete
                      options={unitType || []}
                      getOptionLabel={(option) => option.Name_EN}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          handleChangeData(newValue.ID, "unit_id");
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select Unit"
                          variant="outlined"
                        />
                      )}
                      value={
                        unitType?.find(
                          (option) => option.ID === data?.unit_id
                        ) || null
                      }
                      disablePortal
                      sx={{ width: 300 }}
                    />
                  </div>
                  <div className="form-group mb-3 autoComplete">
                    <label>Brand</label>
                    {/* <ComboBox
                      options={brands?.map((item) => ({
                        id: item.brand_id,
                        name: item.Brand_name,
                      }))}
                      value={data?.brand_id}
                      onChange={(e) => handleChangeData(e, "brand_id")}
                    /> */}
                    {/* <Autocomplete
                      options={
                        brands?.map((item) => ({
                          id: item.ID,
                          name: item.Name_EN, 
                        })) || []
                      }
                      getOptionLabel={(option) =>
                        option.name || option.Brand_name || ""
                      } // Use a fallback to avoid undefined
                      onChange={(event, newValue) => {
                        if (newValue) {
                          handleChangeData(newValue.id, "brand_id"); 
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select Brand"
                          variant="outlined"
                        />
                      )}
                      value={
                        brands?.find(
                          (option) => option.ID === data?.brand_id
                        ) || null
                      } // Ensure this matches the structure
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      } 
                      disablePortal
                      sx={{ width: 300 }} 
                    /> */}
                    <Autocomplete
                      options={brandOptions}
                      getOptionLabel={(option) => option.name || ""}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          handleChangeData(newValue.id, "brand_id");
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select Brand"
                          variant="outlined"
                        />
                      )}
                      value={
                        brandOptions.find(
                          (option) => option.id === data?.brand_id
                        ) || null
                      }
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      disablePortal
                      sx={{ width: 300 }}
                    />
                  </div>
                  <div className="form-group mb-3 autoComplete">
                    <label>Assigned Order</label>
                    {/* <select
                      value={selectedOrder}
                      onChange={(e) => setSelectedOrder(e.target.value)}
                    >
                      <option value="">Select...</option>
                      {assigned.map((item, index) => (
                        <option key={index} value={item.od_id}>
                          {item.Dropdown}
                        </option>
                      ))}
                    </select> */}
                    <Autocomplete
                      options={assigned}
                      getOptionLabel={(option) => option.Dropdown}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          setSelectedOrder(newValue.od_id);
                        } else {
                          setSelectedOrder("");
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select Order"
                          variant="outlined"
                        />
                      )}
                      value={
                        assigned.find(
                          (option) => option.od_id === selectedOrder
                        ) || null
                      }
                      disablePortal
                      sx={{ width: 300 }}
                    />
                  </div>
                </div>
                <div className="modal-footer justify-center">
                  {/* <button
                      type="button"
                      className="bg-gray-300 px-4 py-2 rounded"
                      onClick={closeModal}
                    >
                      Close
                    </button> */}
                  <button
                    type="button"
                    onClick={() => saveNewDetails()}
                    className="bg-black text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Modal show={show} onHide={handleClose} className="exampleQuo">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              ตรวจสอบการแพ็ค
            </h1>
            <button
              style={{ color: "#fff", fontSize: "30px" }}
              type="button"
              onClick={closeIcon}
            >
              <i class="mdi mdi-close"></i>
            </button>
          </div>
          <div className="modal-body">
            <div className="eanCheck">
              <p className="text-red-500">{massageShow}</p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default NewEanPacking;
