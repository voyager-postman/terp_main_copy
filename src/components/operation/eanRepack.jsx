import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import MySwal from "../../swal";
import { ComboBox } from "../combobox";
import { TableView } from "../table";
import CloseIcon from "@mui/icons-material/Close";

import {
  LocalizationProvider,
  DesktopDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Autocomplete } from "@mui/material";

const EanRepack = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { from } = location.state || {};
  console.log(from);
  const [closeButton, setCloseButton] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [eanListData, setEanListData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDate1, setSelectedDate1] = useState(new Date());
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  console.log(from?.packing_ean_produce_id);
  const eanList = () => {
    axios
      .post(`${API_BASE_URL}/getEANList`, {
        item_id: from?.packing_ean_produce_id,
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
    pod_code: from?.pod_code,
    sorting_id: from?.sorting_id,
    oldqty: from?.qty_available,
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
  // const [filterdata, setFilterdata] = useState("");

  const [packingCommonId, setPackingCommonId] = useState(null);
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

  useEffect(() => {
    getPackingCommon();
  }, []);

  useEffect(() => {
    if (packingCommonId) {
      getDatatable(packingCommonId);
    }

    setState((prevState) => ({ ...prevState, defaultData }));
  }, [toggle === true]);

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

  const getDatatable = async (packing_common_id) => {
    await axios
      .post(`${API_BASE_URL}getEanDetailViews`, {
        packing_common_id: packing_common_id,
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

  const handleChangeData = (e, name) => {
    setData((prevState) => ({ ...prevState, [name]: e }));
  };

  const handleChangeQty = (e) => {
    setData((prevState) => ({ ...prevState, ean_quantity: e.target.value }));
  };

  const checkPackCommonId = async () => {
    axios
      .post(`${API_BASE_URL}/CheckstartEndTime`, {
        start_time: formatDate(selectedDate1),
        end_time: formatDate(selectedDate),
      })
      .then((response) => {
        console.log(response);
        const responseData = response.data;

        if (responseData.success === true) {
          console.log(packingCommonId);
          if (!packingCommonId) {
            const { oldqty, number_of_staff, start_time, end_time } = state;

            if (
              !oldqty ||
              !number_of_staff ||
              !selectedDate ||
              !selectedDate1
            ) {
              return toast.error("Please fill all fields");
            }
          }
          setCloseButton(false);
          openModal();
        } else if (responseData.success === false) {
          closeModal();
          // Remove unwanted line breaks and concatenate messages
          const message = `${responseData.message.en.trim()} ${responseData.message.th.trim()}`;

          toast.error(message, {
            className: "toast-error",
          });
        }
      })
      .catch((error) => {
        return toast.error(error);
      });
  };

  const calculate = async () => {
    loadingModal.fire();

    await axios
      .post(`${API_BASE_URL}createEanPacking`, {
        packing_common_id: packingCommonId,
      })
      .then((response) => {
        if (response.status === 200) {
          setCloseButton(true);
          toast.success("Ean updated successfully");
          setToggle(!toggle);
        }
      });

    MySwal.close();
  };

  const saveNewDetails = async () => {
    const { ean_id, unit_id, brand_id, ean_quantity } = data;

    if (!unit_id || brand_id === null || !ean_quantity) {
      return toast.error("Please fill all fields");
    }

    const request = {
      ean_id: ean_id,
      ean_unit: unit_id,
      ean_brand: brand_id,
      ean_qty: ean_quantity,
      packing_ean_id: from?.packing_ean_id,
      number_of_staff: state.number_of_staff,
      start_time: formatDate(selectedDate1),
      end_time: formatDate(selectedDate),
      user_id: localStorage.getItem("id"),
      assigned_order: selectedOrder,
      oldqty: state.oldqty,
    };

    axios
      .post(`${API_BASE_URL}/doRepackEan`, request)
      .then((response) => {
        console.log(response);
        setPackingCommonId(response.data.packing_common_id);

        if (response.status === 200) {
          toast.success("Ean Repack  detail added successfully");
          closeModal();
          setToggle(!toggle);
          setCloseButton(true);
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
        produce_id: from?.Produce_id,
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

        <div className="container-fluid pt-1 py-4 px-0">
          <div className="row">
            <div className="col-lg-12 col-md-12 mb-4">
              <div className="bg-white">
                <div className="databaseTableSection pt-0">
                  <div className="grayBgColor" style={{ padding: "18px" }}>
                    <div className="row">
                      <div className="col-md-6">
                        <h6 className="font-weight-bolder mb-0">Repack Ean</h6>
                      </div>
                    </div>
                  </div>
                  <div className="top-space-search-reslute p-2">
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
                          <div className="formCreate">
                            <div className="row">
                              <div className="form-group col-lg-3 removeBorder">
                                <h6>Name : </h6>
                                <p> {from?.name}</p>
                              </div>
                              <div className="form-group col-lg-3 removeBorder">
                                <h6>Brand : </h6>
                                <p> {from?.brand}</p>
                              </div>
                              <div className="form-group col-lg-3 removeBorder">
                                <h6> Quantity : </h6>
                                <p> {from?.Qty}</p>
                              </div>
                              <div className="form-group col-lg-3 removeBorder">
                                <h6> Unit : </h6>
                                <p> {from?.unit}</p>
                              </div>
                            </div>
                          </div>
                          <div className="formCreate">
                            <form action="">
                              <div className="row">
                                <div className="form-group col-lg-3 ">
                                  <h6>Quantity used</h6>
                                  <input
                                    onChange={handleChange}
                                    type="number"
                                    name="oldqty"
                                    className="form-control"
                                    value={state.oldqty}
                                  />
                                </div>
                                <div className="form-group col-lg-3 ">
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
                                  {/* <button
                                    type="button"
                                    onClick={() => calculate()}
                                    disabled={!packingCommonId}
                                  >
                                    Calculate
                                  </button> */}
                                  <button
                                    type="button"
                                    onClick={() => checkPackCommonId()}
                                  >
                                    Add
                                  </button>
                                </div>
                              </div>
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
                    <div className="card-footer">
                      {closeButton ? (
                        <Link className="btn btn-danger" to={"/adjustEan"}>
                          Close
                        </Link>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isOpenModal && (
          <div className="fixed inset-0 flex items-center justify-center  modalEanEdit">
            <div
              className="fixed w-screen h-screen bg-black/20"
              onClick={closeModal}
            />
            <div className="bg-white rounded-lg shadow-lg  max-w-md w-full z-50">
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
                        (email === "Plaew" && role === "Operation") ||
                          (email === "Gam" && role === "Operation") ||
                          (email === "Look Sorn" && role === "Operation")
                          ? item.ean_name_th
                          : item.ean_name_en,
                    }))}
                    value={data?.ean_id}
                    onChange={(e) => handleChangeData(e, "ean_id")}
                  /> */}

                  <Autocomplete
                    disablePortal
                    options={eanListData?.map((item) => ({
                      id: item.ean_id,
                      name:
                        (email === "Plaew" && role === "Operation") ||
                        (email === "Gam" && role === "Operation") ||
                        (email === "Look Sorn" && role === "Operation")
                          ? item.ean_name_th
                          : item.ean_name_en,
                    }))}
                    getOptionLabel={(option) => option.name} // Display the name in the dropdown
                    onChange={(event, newValue) => {
                      if (newValue) {
                        handleChangeData(newValue.id, "ean_id"); // Pass the id to the handler
                      }
                    }}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Select EAN" />
                    )}
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
                    disablePortal
                    options={
                      unitType
                        ? unitType.map((item) => ({
                            id: item.ID,
                            name: item.Name_EN,
                          }))
                        : []
                    }
                    getOptionLabel={(option) => option.name || ""}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        handleChangeData(newValue.id, "unit_id"); // Pass the id to the handler
                      }
                    }}
                    value={
                      unitType
                        ? unitType
                            .map((item) => ({
                              id: item.ID,
                              name: item.Name_EN,
                            }))
                            .find((item) => item.id === data?.unit_id) || null
                        : null
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    } // Compare using the same key
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Select Unit" />
                    )}
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

                  <Autocomplete
                    disablePortal
                    options={
                      brands
                        ? brands.map((item) => ({
                            id: item.ID,
                            name: item.Name_EN,
                          }))
                        : []
                    }
                    getOptionLabel={(option) => option.name || ""}
                    value={
                      brands
                        ? brands
                            .map((item) => ({
                              id: item.ID,
                              name: item.Name_EN,
                            }))
                            .find((brand) => brand.id === data?.brand_id) ||
                          null
                        : null
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    onChange={(event, newValue) => {
                      handleChangeData(
                        newValue ? newValue.id : null,
                        "brand_id"
                      );
                    }}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Select Brand" />
                    )}
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
                    disablePortal
                    options={assigned.map((item) => ({
                      id: item.od_id,
                      label: item.Dropdown,
                    }))}
                    getOptionLabel={(option) => option.label || ""}
                    value={
                      assigned
                        .map((item) => ({
                          id: item.od_id,
                          label: item.Dropdown,
                        }))
                        .find((option) => option.id === selectedOrder) || null
                    }
                    onChange={(event, newValue) => {
                      setSelectedOrder(newValue ? newValue.id : "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select..."
                        variant="outlined"
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex justify-center modal-footer">
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
  );
};

export default EanRepack;
