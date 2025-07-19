import axios from "../../Url/Api";
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import MySwal from "../../swal";
import { ComboBox } from "../combobox";
import moment from "moment";
import { TableView } from "../table";
import { Button, Modal } from "react-bootstrap";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TextField from "@mui/material/TextField";
import { format } from "date-fns";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import { Autocomplete } from "@mui/material";
import { useTranslation } from "react-i18next";

const NewEanPacking = () => {
  const { t, i18n } = useTranslation("global");
  const location = useLocation();
  const navigate = useNavigate();
  const { from } = location.state || {};
  const [color, setColor] = useState(false);
  const [closeButton, setCloseButton] = useState(true);
  console.log(from.Produce_id);
  const handleClose1 = () => setShow1(false);
  const [show1, setShow1] = useState(false);
  const closeIcon1 = () => {
    setShow1(false);
  };
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
  // const eanList = () => {
  //   axios
  //     .post(`${API_BASE_URL}/getEANList`, {
  //       item_id: from?.Produce_id,
  //     })
  //     .then((response) => {
  //       console.log(response);
  //       setEanListData(response.data.data);
  //     })
  //     .catch((error) => {
  //       console.error("There was an error updating the data!", error);
  //     });
  // };

  const eanList = () => {
    axios
      .post(`${API_BASE_URL}/PEANDropdownList`, {
        produce_id: from?.Produce_id,
      })
      .then((response) => {
        console.log(response.data);
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
        Header: t("ean"),
        accessor: "ean_name_en",
      },
      {
        Header: t("quantity"),
        accessor: "ean_qty",
      },
      {
        Header: t("unit"),
        accessor: "packing_ean_unit",
      },
      {
        Header: t("eanCost"),
        accessor: "ean_cost",
      },
      {
        Header: t("averageWeight"),
        accessor: "average_weight",
      },
      {
        Header: t("eanPerKg"),
        accessor: "EanPerKg",
      },
      {
        Header: t("eanPerHour"),
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
  // const options =
  //   eanListData?.map((item) => ({
  //     id: item.ean_id,
  //     name: role === "Operation" ? item.ean_name_th : item.ean_name_en,
  //   })) || [];
  const options =
    eanListData?.map((item) => ({
      id: item.ID,
      name: role === "Operation" ? item.EAN_Internal_TH : item.EAN_Internal_EN,
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

  const getPackingCommonCancel = async () => {
    console.log(packingCommonId);
    try {
      loadingModal.fire(); // Show loading modal

      // 1. Release Access
      await axios.post(`${API_BASE_URL}/ReleaseAccess`, {
        id: from.sorting_id,
        accesstype: 4,
      });

      // 2. Get Packing Common if packingCommonId exists
      if (packingCommonId) {
        const response = await axios.post(`${API_BASE_URL}/PEANRESTORE`, {
          packing_common_id: packingCommonId,
        });

        console.log(response);

        if (response.data?.message === "success") {
          toast.success(t("packingFetchSuccess"), {
            position: "top-right",
            autoClose: 3000,
          });

          // Optional: you can handle response data here
          // setData(response.data.data);
        }
      }

      // 3. Navigate after everything
      navigate("/eanPacking");
    } catch (error) {
      console.error("Error in getPackingCommonCancel:", error);
      toast.error(t("packingFetchFail"));
    } finally {
      loadingModal.close(); // Always close modal
    }
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
    const cratesUsed = name === "crates_used" ? +value : +state.crates_used;
    const qtyPerCrate = +from["Qty/Crate"] || 0;

    const newState = {
      ...state,
      [name]: value,
    };

    if (name === "crates_used") {
      newState.qty_used = cratesUsed * qtyPerCrate;
    }

    setState(newState);
  };

  // const handleChange = (event) => {
  //   const { name, value } = event.target;
  //   setState((prevState) => {
  //     return {
  //       ...prevState,
  //       [name]: value,
  //     };
  //   });
  // };
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
    console.log(name);
    console.log(e);
    setData((prevState) => ({ ...prevState, [name]: e }));
  };
  console.log(data);
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
            return toast.error(t("enterCrates"));
          }

          if (!qty_used) {
            return toast.error(t("enterQuantity"));
          }

          if (!number_of_staff) {
            return toast.error(t("enterStaffNumber"));
          }

          if (!selectedDate1) {
            return toast.error(t("selectStartTime"));
          }

          if (!selectedDate) {
            return toast.error(t("selectEndTime"));
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
      toast.error(t("genericError"));
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
          qty_used: state.qty_used,
          crates_used: state.crates_used,
          number_of_staff: state.number_of_staff,
          start_time: moment(selectedDate1).format("DD-MM-YYYY HH:mm:ss"),
          end_time: moment(selectedDate).format("DD-MM-YYYY HH:mm:ss"),
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
            // toast.success(t("returnToSupplierSuccess"));
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
      return toast.error(t("pleaseFillAllFields"));
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
      OD_ID: selectedOrder,
      state,
    };

    axios
      .post(`${API_BASE_URL}/createEanProducne`, request)
      .then((response) => {
        console.log(response);
        console.log(response);
        setPackingCommonId(response.data.data);
        const packingEanId = response.data.packing_ean_id?.[0]?.[0]?.["@LID"];
        setPackingEanId(packingEanId);
        // const lidValue = response.data.data[0][0]["@LID"];
        // console.log(lidValue);
        // setFilterdata(lidValue);
        if (response.status === 200) {
          toast.success(t("eanPackingAddSuccess"));
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

  // const handleNewSlecter = () => {
  //   axios
  //     .post(`${API_BASE_URL}/AssignOrderDropDownList`, {
  //       produce_id: from.Produce_id,
  //     })
  //     .then((response) => {
  //       console.log(response.data.data[0], "this is new item");
  //       setAssigned(response.data.data[0]);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  // useEffect(() => {
  //   handleNewSlecter();
  // }, []);

  console.log(selectedOrder, "this is selected value");
  useEffect(() => {
    console.log(data.brand_id);
    console.log(data?.ean_id);
    if (data?.ean_id && data?.brand_id) {
      // Call the PEANORDER API
      fetchPEANORDER(data.ean_id, data.brand_id);
    }
  }, [data?.ean_id, data?.brand_id]);

  const fetchPEANORDER = (eanId, brandId) => {
    axios
      .post(`${API_BASE_URL}/PEANORDER`, {
        EAN: eanId,
        Brand: brandId,
      })
      .then((res) => {
        setAssigned(res?.data?.data);
        console.log("PEANORDER API response:", res.data);
        // Handle response if needed
      })
      .catch((err) => {
        console.error("Error calling PEANORDER:", err);
      });
  };

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
                            {t("eanPackingManagement")}
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
                            {/* <div className="row mt-2 inputMarginUnset formCreate">
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

                              <div className="col-lg-6">
                                <div className="parentPurchaseView mb-3">
                                  <div className="me-3">
                                    <strong>
                                      Name <span>:</span>
                                    </strong>
                                  </div>
                                  <div>
                                    <p>{from?.Name_EN}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="form-group col-lg-3">
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
                              <div className="form-group col-lg-3">
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

                              <div className="form-group col-lg-3">
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
                            </div> */}
                            <div className="row mt-2 inputMarginUnset formCreate">
                              <div className="form-group col-lg-3">
                                <div className="parentPurchaseView">
                                  <div className="me-3">
                                    <strong>
                                      {t("podCode")} <span>:</span>
                                    </strong>
                                  </div>
                                  <div>
                                    <p>{from?.PODCODE}</p>
                                  </div>
                                </div>
                                <div className="parentPurchaseView">
                                  <div className="me-3">
                                    <strong>
                                      {t("supplier")} <span>:</span>
                                    </strong>
                                  </div>
                                  <div>
                                    <p>{from?.Vendor_Name}</p>
                                  </div>
                                </div>
                                <div className="parentPurchaseView">
                                  <div className="me-3">
                                    <strong>{t("date")}:</strong>
                                  </div>
                                  <div>{formatDate1(from?.Date)}</div>
                                </div>
                                <div className="parentPurchaseView">
                                  <div className="me-3">
                                    <strong>
                                      {t("name")} <span>:</span>
                                    </strong>
                                  </div>
                                  <div>
                                    <p>{from?.Name_EN}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="form-group col-lg-3">
                                <div className="parentPurchaseView">
                                  <div className="me-3">
                                    <strong>
                                      {t("quantity")}
                                      <span>:</span>
                                    </strong>
                                  </div>
                                  <div>
                                    <p>{from?.Quantity}</p>
                                  </div>
                                </div>
                                <div className="parentPurchaseView">
                                  <div className="me-3">
                                    <strong>
                                      {t("unit")}<span>:</span>
                                    </strong>
                                  </div>
                                  <div>
                                    <p>{from?.Unit}</p>
                                  </div>
                                </div>
                                <div className="parentPurchaseView">
                                  <div className="me-3">
                                    <strong>
                                      {t("crate")}
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
                                      {t("quantityPerCrate")}<span>:</span>
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
                                    <h6> {t("cratesUsed")}</h6>
                                    <input
                                      onChange={handleChange}
                                      type="number"
                                      name="crates_used"
                                      className="form-control"
                                      value={state.crates_used}
                                    />
                                  </div>
                                  <div className="form-group col-lg-3">
                                    <h6>{t("quantityUsed")}</h6>
                                    <input
                                      type="number"
                                      name="qty_used"
                                      className="form-control"
                                      value={state.qty_used}
                                      readOnly
                                    />
                                  </div>

                                  <div className="form-group col-lg-3">
                                    <h6>{t("numberOfStaff")}</h6>
                                    <input
                                      onChange={handleChange}
                                      type="number"
                                      name="number_of_staff"
                                      className="form-control"
                                      value={state.number_of_staff}
                                    />
                                  </div>
                                  <div className="form-group col-lg-3 eanDateTime">
                                    <h6>{t("startTime")}</h6>

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
                                        <DateTimePicker
                                          value={selectedDate1}
                                          onChange={handleDateChange1}
                                          format="dd-MM-yyyy HH:mm"
                                          renderInput={(params) => (
                                            <TextField {...params} />
                                          )}
                                          ampm={false}
                                        />
                                      </Box>
                                    </LocalizationProvider>
                                  </div>
                                  <div className="form-group col-lg-3 eanDateTime">
                                    <h6>{t("endTime")}</h6>
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
                                        <DateTimePicker
                                          value={selectedDate}
                                          onChange={handleDateChange}
                                          format="dd-MM-yyyy HH:mm"
                                          renderInput={(params) => (
                                            <TextField {...params} />
                                          )}
                                          ampm={false}
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
                                      {t("calculate")}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (
                                          +from?.Crates < +state.crates_used
                                        ) {
                                          setShow1(true); // Show error/modal
                                        } else {
                                          checkPackCommonId(); // Call the function directly
                                        }
                                      }}
                                    >
                                      {t("add")}
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
                                        <th>{t("ean")}</th>
                                        <th>{t("quantity")}</th>
                                        <th>{t("unit")}</th>
                                        <th>{t("eanCost")}</th>
                                        <th>{t("averageWeight")}</th>
                                        <th>{t("eanPerKg")}</th>
                                        <th>{t("eanPerHour")}</th>
                                        <th>{t("wastage")}</th>
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
                                      accesstype: 4,
                                    }
                                  );

                                  navigate("/eanPacking");
                                } catch (error) {
                                  console.error("Access API error:", error);
                                  toast.error(t("genericError"));
                                }
                              } else {
                                toast.warning(
                                  "Invalid operation: Sorting ID not found."
                                );
                                //  toast.warning(t("genericError"));
                              }
                            }}
                          >
                            {t("close")}
                          </button>
                        ) : null}
                        <button
                          className="btn btn-danger"
                          onClick={getPackingCommonCancel}
                        >
                          {t("cancel")}
                        </button>
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
                  <h3>{t("editDetails")}</h3>
                  <p onClick={closeModal}>
                    <CloseIcon />
                  </p>
                </div>
                <div className="formEan formCreate">
                  <div className="form-group mb-3 autoComplete">
                    <label>{t("ean")}</label>

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
                          placeholder= {t("selectEan")}
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
                    <label>{t("quantity")}</label>
                    <input
                      type="number"
                      value={data?.ean_quantity}
                      name="ean_quantity"
                      onChange={(e) => handleChangeQty(e)}
                    />
                  </div>
                  <div className="form-group mb-3 autoComplete">
                    <label>{t("unit")}</label>

                    <Autocomplete
                      options={unitType?.slice(0, 3) || []}
                      getOptionLabel={(option) => option.Name_EN}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          handleChangeData(newValue.ID, "unit_id");
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder= {t("selectUnit")}
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
                    <label>{t("brand")}</label>

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
                          placeholder={t("selectBrand")}
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
                    <label>{t("AssignedOrder")}</label>

                    {/* <Autocomplete
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
                    /> */}
                    <Autocomplete
                      options={[
                        { Display: "Not Allocated", OD_ID: "" },
                        ...assigned,
                      ]}
                      getOptionLabel={(option) => option.Display || ""}
                      onChange={(event, newValue) => {
                        setSelectedOrder(newValue?.OD_ID || ""); // If "Not Allocated" or null is selected, set blank
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder= {t("selectOrder")}
                          variant="outlined"
                        />
                      )}
                      value={
                        [
                          { Display: "Not Allocated", OD_ID: "" },
                          ...assigned,
                        ].find((option) => option.OD_ID === selectedOrder) ||
                        null
                      }
                      isOptionEqualToValue={(option, value) =>
                        option.OD_ID === value.OD_ID
                      }
                      clearOnEscape
                      clearIcon={<i className="mdi mdi-close" />}
                      disablePortal
                      sx={{ width: 300 }}
                    />
                  </div>
                </div>
                <div className="modal-footer justify-center">
                  <button
                    type="button"
                    onClick={() => saveNewDetails()}
                    className="bg-black text-white px-4 py-2 rounded"
                  >
                    {t("save")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Modal show={show} onHide={handleClose} className="exampleQuo newError">
        <div className="modal-content">
          <div className="modal-header">
            <h1
              className="modal-title fs-5 w-100 text-center"
              id="exampleModalLabel"
            >
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
          <div className="modal-body ">
            <div className="eanCheck">
              <p className="text-center">{massageShow}</p>
              <div className="closeBtnRece">
                <button className="mb-3" onClick={closeIcon}>
                  {t("close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        className="modalError receiveModal"
        show={show1}
        onHide={handleClose1}
      >
        <div className="modal-content">
          <div
            className="modal-header border-0"
            style={{
              backgroundColor: color,
            }}
          >
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              {t("checkCratesUsed")}
            </h1>
            <button
              style={{ color: "#fff", fontSize: "30px" }}
              type="button"
              onClick={closeIcon1}
            >
              <i class="mdi mdi-close"></i>
            </button>
          </div>
          <div
            className="modal-body pt-0"
            style={{
              backgroundColor: color,
            }}
          >
            <div className="eanCheck errorMessage recheckReceive">
              <p
                className="pt-0"
                style={{
                  backgroundColor: color ? "" : "#631f37",
                }}
              >
                {t("cratesExceed")}
              </p>

              <div className="closeBtnRece">
                <button onClick={closeIcon1}> {t("close")}</button>
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
    </>
  );
};

export default NewEanPacking;
