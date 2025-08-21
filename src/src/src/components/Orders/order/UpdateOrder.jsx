import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import MySwal from "../../../swal";
import "./CreateOrder.css";
import { ComboBox } from "../../combobox";
import { Button, Modal } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Select, { components } from "react-select";
import { FaCaretDown } from "react-icons/fa"; // Import an icon from react-icon
const UpdateOrder = () => {
  // new selct
  const location = useLocation();
  const navigate = useNavigate();
  const { from } = location.state || {};
  console.log(from);
  const isReadOnly = from?.isReadOnly;
  const [isLoading, setIsLoading] = useState(false);
  const [consignees, setConsignees] = useState([]);
  const [calculateListData, setCalculateListData] = useState([]);

  const [data, setData] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [massageShow, setMassageShow] = useState("");
  const [massageShow1, setMassageShow1] = useState("");
  const [itfNew, setItfName] = useState([]);
  const [brandNew, setBrandNew] = useState([]);
  const [show, setShow] = useState(false);
  console.log(massageShow);
  console.log(massageShow1);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const loadingModal = MySwal.mixin({
    title: "Loading...",
    didOpen: () => {
      MySwal.showLoading();
    },
    showCancelButton: false,
    showConfirmButton: false,
    allowOutsideClick: false,
  });

  const [state, setState] = useState({
    created: from?.created
      ? new Date(from?.created).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    order_id: from?.Order_ID || "",
    Order_number: from?.Order_Number || "",
    brand_id: from?.Brand_id || "",
    client_id: from?.Client_id || "",
    quote_id: from?.quote_id || "",
    loading_location: from?.loading_location || "",
    Freight_provider_: from?.O_Freight_Provider || "",
    liner_id: from?.Liner_ID || "",
    from_port_: from?.Origin_Port || "",
    destination_port_id: from?.Destination_Port || "",
    Clearance_provider: from?.O_Clearance_Provider || "",
    Transportation_provider: from?.O_Transportation_Provider || "",
    consignee_id: from?.Consignee_ID || "",
    fx_id: from?.FX_ID || "",
    mark_up: from?.O_Markup || 0,
    rebate: from?.O_Rebate || 0,
    palletized: from?.palletized == "YES",
    Chamber: from?.Chamber == "YES",
    load_date: from?.load_date
      ? new Date(from?.load_date).toISOString().slice(0, 10)
      : "",
    fx_rate: "",
  });
  console.log(state);
  const handleChange = (event) => {
    if (isReadOnly || isLoading) return;
    const { name, value } = event.target;
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };
  const { data: clients } = useQuery("getClientDataAsOptions");
  const { data: brands } = useQuery("getBrand");
  const { data: locations } = useQuery("getLocation");
  const { data: freights } = useQuery("getFreight_Supplier");
  const { data: liners } = useQuery("getLiner");
  const { data: ports } = useQuery("getAllAirports");
  const { data: clearance } = useQuery("getClearance");
  const { data: transport } = useQuery("getTransportation_Supplier");
  const { data: consignee } = useQuery("getConsignee");
  const { data: currency } = useQuery("getCurrency");
  const { data: unit } = useQuery("getAllUnit");
  const { data: itf } = useQuery("getItf");
  const { data: quote } = useQuery("getAllQuotation");

  console.log(summary);
  const [orderId, setOrderId] = useState("");
  const [gross, setGross] = useState(false);
  const [freight, setFreight] = useState(false);
  const [grossMass, setGrossMass] = useState("");
  const [freightMass, setFreightMass] = useState("");
  console.log(from?.order_id);
  const oneQoutationDAta = () => {
    axios
      .get(`${API_BASE_URL}/getOrderById`, {
        params: {
          order_id: from?.Order_ID,
        },
      })
      .then((response) => {
        console.log(response.data.data);

        setData(response.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    oneQoutationDAta();
  }, [state.order_id]);
  useEffect(() => {
    if (state.order_id) getOrdersDetails();
    grossTransspotationErr();
    orderCrossFreight();
  }, [state.order_id]);
  const computedState = useMemo(() => {
    const quoteFind = quote?.find((v) => v.quote_id == state.quote_id);
    const r = {
      ...state,
      consignee_id: state.consignee_id || quoteFind?.consignee_id,
      client_id: state.client_id || quoteFind?.client_id,
    };
    const consigneeFind = consignee?.find(
      (v) => v.consignee_id == state.consignee_id
    );

    const portDestinationFind = ports?.find(
      (v) =>
        v.port_id == (r.destination_port_id || consigneeFind?.destination_port)
    );
    const portOriginFind = ports?.find(
      (v) => v.port_id == (r.from_port_ || consigneeFind?.port_of_orign)
    );
    r.fx_id = r.fx_id || consigneeFind?.currency || quoteFind?.fx_id;
    r.fx_rate =
      state.fx_rate ||
      currency?.find((v) => +v.currency_id == +r.fx_id)?.fx_rate ||
      currency?.[
        consignee?.findIndex((v) => +v.consignee_id == +r.consignee_id)
      ]?.fx_rate ||
      quoteFind?.fx_rate ||
      0;
    r.rebate = r.rebate || consigneeFind?.rebate || quoteFind?.rebate;
    r.Clearance_provider =
      r.Clearance_provider ||
      portOriginFind?.preferred_clearance ||
      consigneeFind?.Clearance_provider ||
      quoteFind?.Clearance_provider;
    r.loading_location =
      r.loading_location ||
      consigneeFind?.Default_location ||
      quoteFind?.loading_location;
    r.brand_id = state.brand_id || consigneeFind?.brand || quoteFind?.brand_id;
    r.mark_up = r.mark_up || consigneeFind?.profit || quoteFind?.profit;
    r.Transportation_provider =
      r.Transportation_provider ||
      portOriginFind?.preferred_transport ||
      quoteFind?.Transportation_provider;
    r.from_port_ =
      r.from_port_ || consigneeFind?.port_of_orign || quoteFind?.port_of_orign;
    r.destination_port_id =
      r.destination_port_id ||
      consigneeFind?.destination_port ||
      quoteFind?.destination_port_id;
    r.liner_id =
      r.liner_id || portDestinationFind?.prefered_liner || quoteFind?.liner_id;
    r.Freight_provider_ =
      state.Freight_provider_ ||
      liners?.find((v) => v.liner_id == r.liner_id)?.preffered_supplier ||
      quoteFind?.Freight_provider_;
    return r;
  }, [
    state,
    consignee,
    currency,
    ports,
    brands,
    locations,
    liners,
    transport,
    clearance,
    freights,
    unit,
    itf,
  ]);
  const { data: details, refetch: getOrdersDetails } = useQuery(
    `getOrdersDetails?id=${state.order_id}`,
    {
      enabled: !!state.order_id,
    }
  );
  console.log(details);

  const isError = useMemo(() => {
    return (details || []).some((v) => {
      return +v.OD_Box % 1 != 0;
    });
  }, [details]);
  const isMinWeightError = useMemo(() => {
    return (
      (+summary?.Gross_weight || 0) <
      freights?.find(
        (v) => v.Freight_provider == computedState.Freight_provider_
      )?.min_weight
    );
  }, [freights, summary]);
  const isMinWeightTransportError = useMemo(() => {
    return (
      (+summary?.Gross_weight || 0) <
        freights?.find(
          (v) => v.Freight_provider == computedState.Freight_provider_
        )?.min_weight &&
      (+summary?.Gross_weight || 0) >=
        transport?.find(
          (v) =>
            v.Transportation_provider == computedState.Transportation_provider
        )?.max_weight3
    );
  }, [freights, summary]);
  const isMinTransportError = useMemo(() => {
    return (
      (+summary?.Gross_weight || 0) >=
      transport?.find(
        (v) =>
          v.Transportation_provider == computedState.Transportation_provider
      )?.max_weight3
    );
  }, [freights, summary]);
  console.log(isMinWeightError);
  console.log(isMinTransportError);
  const grossTransspotationErr = async () => {
    if (state.order_id) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/OrderGrossTransportError`,
          { order_id: state.order_id }
        );
        console.log(response);
        if (response.data.success == true) {
          setGross(true);
          setGrossMass(response.data.message);
        }
        toast.success(response);
      } catch (e) {
        console.error("Something went wrong", e);
      }
    }
  };

  const calculateList = async () => {
    if (state.order_id) {
      try {
        const response = await axios.post(`${API_BASE_URL}/OrderCostModal`, {
          order_id: state.order_id,
        });
        console.log(response);

        setCalculateListData(response.data.data);
      } catch (e) {
        console.error("Something went wrong", e);
      }
    }
  };
  const newItfList = async () => {
    if (state.consignee_id) {
      try {
        const response = await axios.post(`${API_BASE_URL}/NewItfDropDown`, {
          Consignee_id: state.consignee_id,
        });
        console.log(response.data); // Log the response data
        setItfName(response.data.data);
      } catch (e) {
        console.log("Error:", e);
      }
    }
  };
  const newBrandList = async () => {
    if (state.consignee_id) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/ConsigneeBrandDropdown`,
          {
            Consignee_id: state.consignee_id,
          }
        );
        console.log(response.data); // Log the response data
        setBrandNew(response.data.data);
        // Update state or perform other actions with response data if needed
      } catch (e) {
        console.log("Error:", e);
        // toast.error("Something went wrong");
      }
    }
  };
  useEffect(() => {
    newItfList();
    newBrandList();
  }, [state.consignee_id]);
  const orderCrossFreight = async () => {
    if (state.order_id) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/OrderGrossFreightError`,
          { order_id: state.order_id }
        );
        console.log(response); // Log the response to the console
        if (response.data.success == true) {
          setFreight(true);
          setFreightMass(response.data.message);
        }
      } catch (e) {
        console.error("Something went wrong", e); // Log the error to the console
      }
    }
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
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/deleteOrderDetails`,
            {
              id: id,
            }
          );
          if (response.data.success === true) {
            console.log("API response:", response);
            toast.success("order deleted successfully");
            getOrdersDetails();
            oneQoutationDAta();
          }
        } catch (e) {
          console.error("API call error:", e);
          toast.error("Something went wrong");
        }
      }
    });
  };
  // const deleteDetail = async (i) => {
  //   if (isReadOnly || isLoading) return;
  //   if (details[i].od_id) {
  //     try {
  //       MySwal.fire({
  //         title: "Are you sure?",
  //         text: "You won't be able to revert this!",
  //         icon: "warning",
  //         showCancelButton: true,
  //         confirmButtonColor: "#3085d6",
  //         cancelButtonColor: "#d33",
  //         confirmButtonText: "Yes, delete it!",
  //       }).then(async (result) => {
  //         console.log(result)
  //         if (result.isConfirmed) {
  //           await axios.post(`${API_BASE_URL}/deleteOrderDetails`, {
  //             id: details[i].od_id,
  //           });

  //           setDetails((prevState) => {
  //             return prevState.filter((v, index) => index != i);
  //           });
  //           getOrdersDetails();
  //           toast.success("Order detail deleted successfully");
  //         }
  //       });
  //     } catch (e) {}
  //   } else {
  //     setDetails((prevState) => {
  //       return prevState.filter((v, index) => index != i);
  //     });
  //   }
  // };
  const update = async () => {
    setIsLoading(true);
    loadingModal.fire();
    try {
      const response = await axios.post(`${API_BASE_URL}/updateOrder`, {
        input: {
          ...computedState,
          user: localStorage.getItem("id"),
          palletized: !!computedState.palletized,
          Chamber: !!computedState.Chamber,
        },
        details: details?.filter((v) => v.ITF && v.OD_QTY && v.OD_Unit),
      });
      oneQoutationDAta();
      // let modalElement = document.getElementById("exampleQuo");
      // let modalInstance = bootstrap.Modal.getInstance(modalElement);

      if (response.data.success == false) {
        setShow(true);
        setMassageShow(response.data.message);
      } else if (response.data.success == true) {
        setShow(false);

        toast.success("Order updated successfully", {
          autoClose: 1000,
          theme: "colored",
        });

        navigate("/orders");
      }
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      loadingModal.close();
    }
  };
  const handleCloseModal = () => {
    setCalculateListData([]);
    setShowModal(false); // Hide the modal
  };
  const calculate = async () => {
    const reai = details?.filter((v) => v.ITF && v.OD_QTY && v.OD_Unit);
    console.log(reai);
    if (reai.length == 0) return;
    setIsLoading(true);
    loadingModal.fire();
    try {
      const { data } = await axios.post(`${API_BASE_URL}/newCalculateOrder`, {
        input: {
          ...computedState,
          user: localStorage.getItem("id"),
          palletized: !!computedState.palletized,
          Chamber: !!computedState.Chamber,
        },
        // details: details?.filter((v) => v.ITF && v.itf_quantity && v.itf_unit),
      });
      console.log(data);

      if (data.success == false) {
        calculateList();
        setShowModal(false);

        getOrdersDetails();
        oneQoutationDAta();
          oneQoutationDAta();
        setShow(true);
        setMassageShow1(data.message);
      } else if (data.success == true) {
        calculateList();
        setShow(false);
          oneQoutationDAta();
        oneQoutationDAta();
        getOrdersDetails();
        toast.success("Order Calculated successfully", {
          autoClose: 1000,
          theme: "colored",
        });

        setShowModal(true);
      }
      await getOrdersDetails(data.data.data);
      MySwal.close();
      setIsLoading(false);
    } catch (e) {
      console.error(e);
    } finally {
      MySwal.close();
      oneQoutationDAta();
      setIsLoading(false);
    }
  };
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const defaultDetailsValue = useMemo(() => {
    return details?.[selectedDetails] || null;
  }, [selectedDetails]);
  console.log(defaultDetailsValue);
  const [toEditDetails, setToEditDetails] = useState({});
  console.log(toEditDetails);
  console.log(defaultDetailsValue?.brand_id);
  console.log(defaultDetailsValue);
  const closeModal = () => {
    setIsOpenModal(false);
    setSelectedDetails(null);
  };
  const openModal = () => {
    setIsOpenModal(true);
  };
  const setDetailsEdit = (id) => {
    console.log(id);
    setSelectedDetails(id);
    setToEditDetails({});
    openModal();
  };
  console.log(toEditDetails);

  const saveNewDetails = async () => {
    const values = {
      ...toEditDetails,
      ITF: toEditDetails?.ITF ?? defaultDetailsValue?.ITF ?? undefined,
      // ITF: 1,

      itf_quantity: toEditDetails?.itf_quantity ?? defaultDetailsValue?.OD_QTY,
      itf_unit: toEditDetails?.itf_unit ?? defaultDetailsValue?.OD_Unit,
      adjusted_price:
        toEditDetails?.adjusted_price ?? defaultDetailsValue?.OD_OP ?? 0,
      od_id: defaultDetailsValue?.OD_ID || undefined,
      // od_id:"91",

      brand_id:
        toEditDetails?.brand ?? defaultDetailsValue?.OD_Brand ?? undefined,
      is_changed: true,
    };
    if (!values.ITF || !values.itf_quantity || !values.itf_unit)
      return toast.error("Please fill all fields");
    loadingModal.fire();
    closeModal();
    try {
      const { data } = await axios.post(`${API_BASE_URL}/addOrderInput`, {
        input: {
          ...computedState,
          user: localStorage.getItem("id"),
          palletized: !!computedState.palletized,
          Chamber: !!computedState.Chamber,
        },
        details: values,
      });
      oneQoutationDAta();
      setOrderId(data?.order_id);
      console.log(data);
      getOrdersDetails();
      grossTransspotationErr();
      orderCrossFreight();
      toast.success("Order detail added successfully");
      setState((prevState) => {
        return {
          ...prevState,
          order_id: from?.Order_ID,
          // order_id: data.order_id,
        };
      });

      getOrdersDetails();
      // navigate("/orders");
      MySwal.close();
      closeModal();
    } catch (e) {
      console.error(e);
      MySwal.close();
      closeModal();
      toast.error("Something went wrong");
    } finally {
      MySwal.close();
      closeModal();
    }
  };
  const updateDetails = (e) => {
    if (isReadOnly || isLoading) return;
    setToEditDetails((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  };
  const fetchConsignees = async () => {
    console.log(computedState.client_id);
    try {
      const response = await axios.post(`${API_BASE_URL}/getClientConsignee`, {
        client_id: computedState.client_id,
      });
      console.log(response);
      setConsignees(response.data.data);
    } catch (error) {
      console.error("Error fetching consignees:", error);
    }
  };
  useEffect(() => {
    if (computedState.client_id) {
      fetchConsignees();
    }
  }, [computedState.client_id]);
  const reCalculate = () => {
    setIsLoading(true);
    loadingModal.fire();

    axios
      .post(`${API_BASE_URL}/RecalculateOrder`, {
        order_id: from?.Order_ID,
        user_id: localStorage.getItem("id"),
      })
      .then((response) => {
        getOrdersDetails();

        oneQoutationDAta();
        console.log(response);
        toast.success("Order Recalculate  Successfully", {
          autoClose: 1000,
          theme: "colored",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong");
      })
      .finally(() => {
        calculate();
        setIsLoading(false);
        loadingModal.close();
      });
  };
  console.log(state);
  const closeIcon = () => {
    setShow(false);

    if (massageShow) {
      setMassageShow("");
    }

    if (massageShow1) {
      setMassageShow1("");
    }
  };
  const twoDecimal = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const NoDecimal = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const threeDecimal = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });

  const customStyles = {
    control: (base) => ({
      ...base,
      borderColor: "#ccc",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#888",
      },
    }),
    clearIndicator: (base) => ({
      ...base,
      opacity: "0", // Initially hide the clear button
      transition: "opacity 0.2s ease", // Smooth transition for visibility
    }),
    singleValue: (base) => ({
      ...base,
      color: "#333",
    }),
    container: (base) => ({
      ...base,
      "&:hover .react-select__clear-indicator": {
        opacity: "1", // Show the clear button on hover
      },
      "&:focus-within .react-select__clear-indicator": {
        opacity: "1", // Show the clear button on focus
      },
    }),
  };

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <FaCaretDown style={{ color: "#757575" }} />
      </components.DropdownIndicator>
    );
  };
  const options = itfNew
    ? itfNew.map((item) => ({
        value: item.itf_id,
        label: item.itf_name,
      }))
    : [];

  // Find the selected option
  const selectedOption = options.find(
    (option) =>
      option.value === (toEditDetails?.ITF ?? defaultDetailsValue?.ITF)
  );

  const handleChangeSe = (selected) => {
    setToEditDetails((prevDetails) => ({
      ...prevDetails,
      ITF: selected ? selected.value : "", // Update selected ITF
    }));
  };
  return (
    <>
      <Card title={`Order Management / Update Form`}>
        <div className="top-space-search-reslute">
          <div className="tab-content px-2 md:!px-4">
            <div className="tab-pane active" id="header" role="tabpanel">
              <div
                id="datatable_wrapper"
                className="information_dataTables dataTables_wrapper dt-bootstrap4"
              >
                <div className="formCreate ">
                  <form action="">
                    <div className="row formEan">
                      {/* <div className="col-lg-3 form-group">
                        <h6> Create Date </h6>
                        <input
                          type="date"
                          value={computedState.created}
                          onChange={handleChange}
                        />
                      </div> */}
                      {state.quote_id && (
                        <div className="col-lg-3 form-group">
                          <h6>Quote</h6>
                          <div className="ceateTransport">
                            <select
                              value={computedState.quote_id}
                              name="quote_id"
                            >
                              <option>Select Quote</option>
                              {quote?.map((v) => (
                                <option value={v.quote_id}>
                                  {v.client_name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="row formEan quotationRowDro">
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>Client</h6>
                        <Autocomplete
                          options={
                            clients?.map((v) => ({
                              id: v.client_id,
                              name: v.client_name,
                            })) || []
                          } // Ensure options is always an array
                          sx={{ width: 300 }}
                          getOptionLabel={(option) => option?.name || ""} // Display name of the option
                          isOptionEqualToValue={(option, value) =>
                            option.id === value?.id
                          } // Ensure proper comparison by `id`
                          value={
                            clients
                              ?.map((v) => ({
                                id: v.client_id,
                                name: v.client_name,
                              }))
                              .find(
                                (client) => client.id === state.client_id
                              ) || null // Adjust to match the option structure
                          }
                          onChange={(event, value) => {
                            setState({
                              ...state,
                              client_id: value?.id || null,
                            }); // Update state with selected `id`
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select client"
                            />
                          )}
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>Consignee</h6>
                        <Autocomplete
                          options={
                            consignees?.map((v) => ({
                              id: v.consignee_id,
                              name: v.consignee_name,
                            })) || []
                          } // Ensure options is always an array
                          value={
                            // Find the consignee in the mapped options based on consignee_id
                            consignees
                              ?.map((v) => ({
                                id: v.consignee_id,
                                name: v.consignee_name,
                              }))
                              .find(
                                (option) =>
                                  option.id === computedState.consignee_id
                              ) || null
                          } // Ensure full object as value
                          onChange={(event, newValue) => {
                            setState({
                              ...state,
                              rebate: "",
                              Clearance_provider: "",
                              Freight_provider_: "",
                              Transportation_provider: "",
                              brand_id: "",
                              fx_id: "",
                              mark_up: "",
                              fx_rate: "",
                              from_port_: "",
                              destination_port_id: "",
                              liner_id: "",
                              loading_location: "",
                              consignee_id: newValue?.id || "",
                            });
                          }}
                          getOptionLabel={(option) => option.name || ""}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value?.id
                          }
                          renderInput={(params) => <TextField {...params} />}
                          disableClearable
                          autoHighlight
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>Brands</h6>
                        <Autocomplete
                          options={
                            brands?.map((v) => ({
                              id: v.brand_id,
                              name: v.Brand_name,
                            })) || []
                          } // Ensure options is always an array
                          sx={{ width: 300 }}
                          getOptionLabel={(option) => option?.name || ""} // Display name of the option
                          isOptionEqualToValue={(option, value) =>
                            option.id === value?.id
                          } // Compare by `id`
                          value={
                            brands?.find(
                              (brand) =>
                                brand.brand_id === computedState.brand_id
                            )
                              ? {
                                  id: brands.find(
                                    (brand) =>
                                      brand.brand_id === computedState.brand_id
                                  ).brand_id,
                                  name: brands.find(
                                    (brand) =>
                                      brand.brand_id === computedState.brand_id
                                  ).Brand_name,
                                }
                              : null // Ensure value matches the structure of options
                          }
                          onChange={(event, value) => {
                            setState({ ...state, brand_id: value?.id || null }); // Update state with selected `id`
                          }}
                          renderInput={(params) => (
                            <TextField {...params} placeholder="Select brand" />
                          )}
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>Currency</h6>
                        <Autocomplete
                          options={
                            currency?.map((v) => ({
                              id: v.currency_id,
                              name: v.currency,
                            })) || []
                          } // Ensure options is always an array
                          sx={{ width: 300 }}
                          getOptionLabel={(option) => option?.name || ""} // Display name of the option
                          isOptionEqualToValue={(option, value) =>
                            option.id === value?.id
                          } // Compare by `id`
                          value={
                            currency?.find(
                              (cur) => cur.currency_id === computedState.fx_id
                            )
                              ? {
                                  id: currency.find(
                                    (cur) =>
                                      cur.currency_id === computedState.fx_id
                                  ).currency_id,
                                  name: currency.find(
                                    (cur) =>
                                      cur.currency_id === computedState.fx_id
                                  ).currency,
                                }
                              : null // Ensure value matches the structure of options
                          }
                          onChange={(event, value) => {
                            setState({ ...state, fx_id: value?.id || null }); // Update state with selected `id`
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select currency"
                            />
                          )}
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>Loading Location</h6>
                        <Autocomplete
                          options={
                            locations?.map((v) => ({
                              id: v.id,
                              name: v.name,
                            })) || []
                          } // Ensure options is always an array
                          sx={{ width: 300 }}
                          getOptionLabel={(option) => option?.name || ""} // Display name of the option
                          isOptionEqualToValue={(option, value) =>
                            option.id === value?.id
                          } // Compare by `id`
                          value={
                            locations?.find(
                              (loc) => loc.id === computedState.loading_location
                            )
                              ? {
                                  id: locations.find(
                                    (loc) =>
                                      loc.id === computedState.loading_location
                                  ).id,
                                  name: locations.find(
                                    (loc) =>
                                      loc.id === computedState.loading_location
                                  ).name,
                                }
                              : null // Ensure value matches the structure of options
                          }
                          onChange={(event, value) => {
                            setState({
                              ...state,
                              loading_location: value?.id || null,
                            }); // Update state with selected `id`
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select location"
                            />
                          )}
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>Port of Origin</h6>
                        <Autocomplete
                          options={
                            ports?.map((v) => ({
                              id: v.port_id,
                              name: v.port_name,
                            })) || []
                          } // Ensure options is always an array
                          sx={{ width: 300 }}
                          getOptionLabel={(option) => option?.name || ""} // Display name of the option
                          isOptionEqualToValue={(option, value) =>
                            option.id === value?.id
                          } // Compare by `id`
                          value={
                            ports?.find(
                              (port) =>
                                port.port_id === computedState.from_port_
                            )
                              ? {
                                  id: ports.find(
                                    (port) =>
                                      port.port_id === computedState.from_port_
                                  ).port_id,
                                  name: ports.find(
                                    (port) =>
                                      port.port_id === computedState.from_port_
                                  ).port_name,
                                }
                              : null // Ensure value matches the structure of options
                          }
                          onChange={(event, value) => {
                            setState({
                              ...state,
                              from_port_: value?.id || null,
                            }); // Update state with selected `id`
                          }}
                          renderInput={(params) => (
                            <TextField {...params} placeholder="Select port" />
                          )}
                        />
                      </div>
                      <div className="col-lg-3 form-group quotationSelectSer">
                        <h6>Port of Destination</h6>
                        <Autocomplete
                          options={
                            ports?.map((v) => ({
                              id: v.port_id,
                              name: v.port_name,
                            })) || []
                          } // Ensure options is always an array
                          sx={{ width: 300 }}
                          getOptionLabel={(option) => option?.name || ""} // Display name of the option
                          isOptionEqualToValue={(option, value) =>
                            option.id === value?.id
                          } // Compare by `id`
                          value={
                            ports?.find(
                              (port) =>
                                port.port_id ===
                                computedState.destination_port_id
                            )
                              ? {
                                  id: ports.find(
                                    (port) =>
                                      port.port_id ===
                                      computedState.destination_port_id
                                  ).port_id,
                                  name: ports.find(
                                    (port) =>
                                      port.port_id ===
                                      computedState.destination_port_id
                                  ).port_name,
                                }
                              : null // Ensure value matches the structure of options
                          }
                          onChange={(event, value) => {
                            setState({
                              ...state,
                              destination_port_id: value?.id || null,
                            }); // Update state with selected `id`
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select destination port"
                            />
                          )}
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>Airline</h6>
                        <Autocomplete
                          options={
                            liners?.map((v) => ({
                              id: v.liner_id,
                              name: v.liner_name,
                            })) || []
                          } // Ensure options is always an array
                          sx={{ width: 300 }}
                          getOptionLabel={(option) => option?.name || ""} // Display name of the option
                          isOptionEqualToValue={(option, value) =>
                            option.id === value?.id
                          } // Compare by `id`
                          value={
                            liners?.find(
                              (liner) =>
                                liner.liner_id === computedState.liner_id
                            )
                              ? {
                                  id: liners.find(
                                    (liner) =>
                                      liner.liner_id === computedState.liner_id
                                  ).liner_id,
                                  name: liners.find(
                                    (liner) =>
                                      liner.liner_id === computedState.liner_id
                                  ).liner_name,
                                }
                              : null // Ensure value matches the structure of options
                          }
                          onChange={(event, value) => {
                            setState({ ...state, liner_id: value?.id || null }); // Update state with selected `id`
                          }}
                          renderInput={(params) => (
                            <TextField {...params} placeholder="Select Liner" />
                          )}
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>Transportation</h6>
                        <Autocomplete
                          options={
                            transport?.map((v) => ({
                              id: v.Transportation_provider,
                              name: v.name,
                            })) || []
                          } // Ensure options is always an array
                          sx={{ width: 300 }}
                          getOptionLabel={(option) => option?.name || ""} // Display name of the option
                          isOptionEqualToValue={(option, value) =>
                            option.id === value?.id
                          } // Compare by `id`
                          value={
                            transport?.find(
                              (provider) =>
                                provider.Transportation_provider ===
                                computedState.Transportation_provider
                            )
                              ? {
                                  id: transport.find(
                                    (provider) =>
                                      provider.Transportation_provider ===
                                      computedState.Transportation_provider
                                  ).Transportation_provider,
                                  name: transport.find(
                                    (provider) =>
                                      provider.Transportation_provider ===
                                      computedState.Transportation_provider
                                  ).name,
                                }
                              : null // Ensure value matches the structure of options
                          }
                          onChange={(event, value) => {
                            setState({
                              ...state,
                              Transportation_provider: value?.id || null,
                            }); // Update state with selected `id`
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Transportation Provider"
                            />
                          )}
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>Clearance</h6>
                        <Autocomplete
                          options={
                            clearance?.map((v) => ({
                              id: v.Clearance_provider,
                              name: v.name,
                            })) || []
                          } // Ensure options is always an array
                          sx={{ width: 300 }}
                          getOptionLabel={(option) => option?.name || ""} // Display name of the option
                          isOptionEqualToValue={(option, value) =>
                            option.id === value?.id
                          } // Compare by `id`
                          value={
                            clearance?.find(
                              (provider) =>
                                provider.Clearance_provider ===
                                computedState.Clearance_provider
                            )
                              ? {
                                  id: clearance.find(
                                    (provider) =>
                                      provider.Clearance_provider ===
                                      computedState.Clearance_provider
                                  ).Clearance_provider,
                                  name: clearance.find(
                                    (provider) =>
                                      provider.Clearance_provider ===
                                      computedState.Clearance_provider
                                  ).name,
                                }
                              : null // Ensure value matches the structure of options
                          }
                          onChange={(event, value) => {
                            setState({
                              ...state,
                              Clearance_provider: value?.id || null,
                            }); // Update state with selected `id`
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Clearance Provider"
                            />
                          )}
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>Freight Provider</h6>
                        <Autocomplete
                          options={
                            freights?.map((v) => ({
                              id: v.Freight_provider,
                              name: v.name,
                            })) || []
                          } // Ensure options is always an array
                          sx={{ width: 300 }}
                          getOptionLabel={(option) => option?.name || ""} // Display name of the option
                          isOptionEqualToValue={(option, value) =>
                            option.id === value?.id
                          } // Compare by `id`
                          value={
                            freights?.find(
                              (provider) =>
                                provider.Freight_provider ===
                                computedState.Freight_provider_
                            )
                              ? {
                                  id: freights.find(
                                    (provider) =>
                                      provider.Freight_provider ===
                                      computedState.Freight_provider_
                                  ).Freight_provider,
                                  name: freights.find(
                                    (provider) =>
                                      provider.Freight_provider ===
                                      computedState.Freight_provider_
                                  ).name,
                                }
                              : null // Ensure value matches the structure of options
                          }
                          onChange={(event, value) => {
                            setState({
                              ...state,
                              Freight_provider_: value?.id || null,
                            }); // Update state with selected `id`
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Freight Provider"
                            />
                          )}
                        />
                      </div>
                      <div className="col-lg-3 form-group  ">
                        <h6>EX Rate</h6>
                        <input
                          type="number"
                          value={computedState.fx_rate}
                          onChange={handleChange}
                          name="fx_rate"
                        />
                      </div>

                      {localStorage.getItem("level") !== "Level 5" && (
                        <>
                          <div className="col-lg-3 form-group  ">
                            <h6>Markup Rate</h6>
                            <div className="parentShip">
                              <div className="markupShip">
                                <input
                                  type="number"
                                  placeholder="0"
                                  value={computedState.mark_up}
                                  onChange={handleChange}
                                  name="mark_up"
                                />
                              </div>
                              <div className="shipPercent">
                                <span>%</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3 form-group">
                            <h6> Rebate</h6>
                            <div className="parentShip">
                              <div className="markupShip">
                                <input
                                  type="number"
                                  placeholder="0"
                                  onChange={handleChange}
                                  value={computedState.rebate || 0}
                                  name="rebate"
                                />
                              </div>
                              <div className="shipPercent">
                                <span>%</span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      <div className="col-lg-3 form-group">
                        <h6>Palletized</h6>
                        <div className="flex gap-2 items-center">
                          <label className="toggleSwitch large" onclick="">
                            <input
                              name="palletized"
                              id="Palletized"
                              checked={computedState.palletized}
                              onChange={() => {
                                setState((prevState) => {
                                  return {
                                    ...prevState,
                                    palletized: !prevState.palletized,
                                  };
                                });
                              }}
                              type="checkbox"
                            />
                            <span>
                              <span>OFF</span>
                              <span>ON</span>
                            </span>
                            <a></a>
                          </label>
                          <label htmlFor="Palletized">Palletized</label>
                        </div>
                      </div>
                      <div className="col-lg-3 form-group">
                        <h6>CO from Chamber</h6>
                        <div className="flex gap-2 items-center">
                          <label className="toggleSwitch large" onclick="">
                            <input
                              name="Chamber"
                              id="Chamber"
                              checked={computedState.Chamber}
                              onChange={() => {
                                setState((prevState) => {
                                  return {
                                    ...prevState,
                                    Chamber: !prevState.Chamber,
                                  };
                                });
                              }}
                              type="checkbox"
                            />
                            <span>
                              <span>OFF</span>
                              <span>ON</span>
                            </span>
                            <a> </a>
                          </label>
                          <label htmlFor="Chamber">CO from Chamber</label>
                        </div>
                      </div>
                      <div className="col-lg-3 form-group">
                        <h6>Loading Date</h6>
                        <input
                          type="date"
                          onChange={handleChange}
                          value={computedState.load_date}
                          name="load_date"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 items-center justify-between flex-wrap">
                      {!isReadOnly && (
                        <div className="addBtnEan flex flex-wrap gap-3 items-center mb-4">
                          <button
                            type="button"
                            className=""
                            onClick={() => calculate()}
                          >
                            Calculate
                          </button>

                          {!isError && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedDetails(null);
                                setToEditDetails({});
                                openModal();
                              }}
                            >
                              Add
                            </button>
                          )}
                        </div>
                      )}
                      {isError && (
                        <div className="my-4 text-red-500">
                          <i className="mdi mdi-alert" /> Please adjust Select
                          ITF to complete a box
                        </div>
                      )}
                      <div className="addBtnEan mb-4">
                        <button type="button" onClick={reCalculate}>
                          Recalculate
                        </button>
                      </div>
                    </div>
                    <div
                      id="datatable_wrapper"
                      className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive mt-"
                    >
                      <table
                        id="example"
                        className="display transPortCreate table table-hover table-striped borderTerpProduce table-responsive"
                        style={{ width: "100%" }}
                      >
                        <thead>
                          <tr>
                            <th>ITF</th>
                            <th>Brand Name</th>
                            <th>Quantity</th>
                            <th>Unit</th>
                            <th> Number of Box</th>
                            <th>NW</th>
                            <th>Unit Price</th>
                            <th>Adjust Price</th>
                            {!(
                              (localStorage.getItem("level") === "Level 1" &&
                                localStorage.getItem("role") === "Admin") ||
                              localStorage.getItem("level") === "Level 5"
                            ) && <th>Profit</th>}

                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {details?.map((v, i) => (
                            <tr
                              className={[
                                "rowCursorPointer",
                                +v.OD_Box % 1 != 0
                                  ? "bg-red-500/50 [&>td]:!text-red-900"
                                  : "",
                              ].join(" ")}
                            >
                              <td>{v.ITF_Name}</td>
                              <td>{v.Brand_name}</td>
                              <td>{threeDecimal.format(v.OD_QTY)}</td>
                              <td>{v.Unit_Name}</td>
                              <td>{NoDecimal.format(v.OD_Box)}</td>
                              <td>{threeDecimal.format(v.OD_NW)}</td>
                              <td>
                                {twoDecimal.format(
                                  v.QOD_FP === "0.00" || v.QOD_FP === null
                                    ? v.OD_CP
                                    : v.QOD_FP
                                )}
                              </td>
                              <td>
                                {v.OD_OP ? twoDecimal.format(v.OD_OP) : ""}
                              </td>

                              {!(
                                (localStorage.getItem("level") === "Level 1" &&
                                  localStorage.getItem("role") === "Admin") ||
                                localStorage.getItem("level") === "Level 5"
                              ) && <td>{v.OD_Profit_Percentage}%</td>}

                              <td>
                                {!isReadOnly && v.status !== 0 && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setDetailsEdit(i);
                                        setToEditDetails({});
                                        openModal();
                                      }}
                                    >
                                      <i className="mdi mdi-pencil text-2xl" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => deleteOrder(v.OD_ID)}
                                    >
                                      <i className="mdi mdi-minus text-2xl" />
                                    </button>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* <div className="grid md:grid-cols-3 grid-cols-1 my-4">
                      <div>
                        Total NW :
                        <b>
                          {" "}
                          {threeDecimal
                            .format(+data?.O_NW || 0)
                            .toLocaleString()}
                        </b>
                      </div>
                      <div>
                        Total FOB :{" "}
                        <b>
                          {" "}
                          {twoDecimal
                            .format(+data?.O_FOB || 0)
                            .toLocaleString()}
                        </b>
                      </div>
                      <div>
                        Total Commission :
                        <b>
                          {" "}
                          {twoDecimal
                            .format(+data?.O_Commission_FX || 0)
                            .toLocaleString()}
                        </b>
                      </div>
                      <div>
                        Total GW :
                        <b>
                          {" "}
                          {NoDecimal.format(+data?.O_GW || 0).toLocaleString()}
                        </b>
                      </div>
                      <div>
                        Total Freight :
                        <b>
                          {" "}
                          {NoDecimal.format(
                            +data?.O_Freight || 0
                          ).toLocaleString()}
                        </b>
                      </div>
                      <div>
                        Total Rebate :
                        <b>{(+data?.O_Rebate || 0).toLocaleString()}</b>
                      </div>
                      <div>
                        Total Box :
                        <b>
                          {" "}
                          {NoDecimal.format(+data?.O_Box || 0).toLocaleString()}
                        </b>
                      </div>
                      <div>
                        Total CNF :{" "}
                        <b>
                          {" "}
                          {twoDecimal
                            .format(+data?.O_CNF || 0)
                            .toLocaleString()}
                        </b>
                      </div>
                      {!(
                        localStorage.getItem("level") === "Level 1" &&
                        localStorage.getItem("role") === "Admin"
                      ) && (
                        <div>
                          Total Profit :
                          <b>
                            {" "}
                            {twoDecimal
                              .format(+data?.O_Profit_Percentage || 0)
                              .toLocaleString()}
                          </b>
                        </div>
                      )}
                      <div>
                        Total CBM :{" "}
                        <b>
                          {" "}
                          {threeDecimal
                            .format(+data?.O_CBM || 0)
                            .toLocaleString()}
                        </b>
                      </div>
                      <div>
                        Total CNF FX :
                        <b>
                          {" "}
                          {twoDecimal
                            .format(+data?.O_CNF_FX || 0)
                            .toLocaleString()}
                        </b>
                      </div>
                      {!(
                        localStorage.getItem("level") === "Level 1" &&
                        localStorage.getItem("role") === "Admin"
                      ) && (
                        <div>
                          Total Profit Percentage
                          <b>
                            {(+data?.O_Profit_Percentage || 0).toLocaleString()}
                          </b>
                        </div>
                      )}
                    </div> */}
                    <div className="row py-4 px-4">
                      <div className="col-lg-3">
                        <div>
                          <b> Total NW : </b>
                          {(+data?.O_NW || 0).toLocaleString()}
                        </div>
                        <div>
                          <b> Total GW : </b>
                          {(+data?.O_GW || 0).toLocaleString()}
                        </div>
                        <div>
                          <b> Total Box : </b>
                          {(+data?.O_Box || 0).toLocaleString()}
                        </div>
                        <div>
                          <b> Total CBM : </b>
                          {(+data?.O_CBM || 0).toLocaleString()}
                        </div>
                        <div>
                          <b> Total ITF : </b>
                          {(+data?.O_Items || 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div>
                          <b>Freight : </b>
                          {(+data?.O_Freight || 0).toLocaleString()}
                        </div>
                        <div>
                          <b>TransPort : </b>
                          {(+data?.O_Transport || 0).toLocaleString()}
                        </div>
                        <div>
                          <b>Clearance : </b>
                          {(+data?.O_Clearance || 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div>
                          <b> Total FOB : </b>
                          {(+data?.O_FOB || 0).toLocaleString()}
                        </div>
                        <div>
                          <b> Total CNF : </b>
                          {(+data?.O_CNF || 0).toLocaleString()}
                        </div>
                        {!(
                          (localStorage.getItem("level") === "Level 1" &&
                            localStorage.getItem("role") === "Admin") ||
                          localStorage.getItem("level") === "Level 5"
                        ) && (
                          <div className="">
                            <b> Total Profit : </b>
                            {(+data?.O_Profit || 0).toLocaleString()}
                          </div>
                        )}
                        {localStorage.getItem("level") !== "Level 5" && (
                          <div style={{ marginLeft: "2px" }}>
                            <b> Profit % : </b>
                            {(+data?.O_Profit_Percentage || 0).toLocaleString()}
                          </div>
                        )}
                      </div>
                      <div className="col-lg-3">
                        <div>
                          <b> Total CNF FX : </b>
                          {(+data?.O_CNF_FX || 0).toLocaleString()}
                        </div>
                        <div>
                          <div>
                            <b> Total Commission FX: </b>
                            {(+data?.O_Commission_FX || 0).toLocaleString()}
                          </div>
                          <div>
                            <b> Total Rebate FX : </b>
                            {(+data?.O_Rebate_FX || 0).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="card-footer">
              {!isError ? (
                <button
                  className="btn btn-primary"
                  type="submit"
                  name="signup"
                  onClick={() => update()}
                >
                  Update
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </Card>
      {isOpenModal && (
        <div className="fixed inset-0 flex items-center justify-center modalEanEdit modalNewSelect">
          <div>
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
              <div className="crossArea">
                <h3>Edit Details</h3>
                <p onClick={closeModal}>
                  <CloseIcon />
                </p>
              </div>
              <div className="formEan formCreate">
                <div className="form-group mb-3 itfHeight quotationSelectSer">
                  <label>ITF</label>
                  {/* <Autocomplete
                    disablePortal
                    options={itfNew?.map((v) => ({
                      id: v.itf_id,
                      name: v.itf_name,
                    }))} // Standardize the options structure
                    getOptionLabel={(option) => option.name || ""} // Display ITF name as label
                    value={
                      itfNew
                        ?.map((v) => ({
                          id: v.itf_id,
                          name: v.itf_name,
                        }))
                        .find(
                          (item) =>
                            item.id ===
                            (toEditDetails?.ITF || defaultDetailsValue?.ITF)
                        ) || null
                    } // Match the value with the options
                    onChange={(event, newValue) => {
                      setToEditDetails((prev) => ({
                        ...prev,
                        ITF: newValue ? newValue.id : null, // Update ITF with the selected option
                      }));
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value?.id
                    } // Equality check by id
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="select itf"
                        variant="outlined"
                      />
                    )}
                  /> */}

                  <Select
                    value={selectedOption || null} // The selected value
                    onChange={handleChangeSe} // Handle selection
                    options={options} // The dropdown options
                    placeholder="Search or Select ITF"
                    isClearable // Adds a clear button
                    styles={customStyles}
                    components={{ DropdownIndicator }} // Use the custom indicator
                    classNamePrefix="react-select" // Add a p
                  />
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    value={
                      toEditDetails?.itf_quantity ??
                      defaultDetailsValue?.OD_QTY ??
                      0
                    }
                    name="itf_quantity"
                    onChange={updateDetails}
                  />
                </div>
                <div className="form-group mb-3 quotationSelectSer">
                  <h6>Brands</h6>
                  {/* <Autocomplete
                    disablePortal
                    options={brandNew?.map((v) => ({
                      id: v.brand_id,
                      name: v.Brand_name,
                    }))} // Standardize the options structure
                    getOptionLabel={(option) => option.name || ""} // Display brand name as label
                    value={
                      brandNew
                        ?.map((v) => ({
                          id: v.brand_id,
                          name: v.Brand_name,
                        }))
                        .find(
                          (item) =>
                            item.id ===
                            (toEditDetails?.brand ||
                              defaultDetailsValue?.OD_Brand)
                        ) || null
                    } // Match the value with the options
                    onChange={(event, newValue) => {
                      setToEditDetails((prev) => ({
                        ...prev,
                        brand: newValue ? newValue.id : null, // Update brand with the selected option
                      }));
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value?.id
                    } // Equality check by id
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="select brand"
                        variant="outlined"
                      />
                    )}
                  /> */}
                  <Autocomplete
                    disablePortal
                    // value={itf?.find((item) => item.itf_id === (toEditDetails?.ITF ?? defaultDetailsValue?.ITF)) || null}
                    value={
                      brandNew?.find(
                        (item) =>
                          item.brand_id ===
                          (toEditDetails?.brand ??
                            defaultDetailsValue?.OD_Brand)
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      setToEditDetails((prevDetails) => ({
                        ...prevDetails,
                        brand: newValue ? newValue.brand_id : "", // Set the brand when a value is selected
                      }));
                    }}
                    options={
                      brandNew
                        ? brandNew.map((v) => ({
                            brand_id: v.brand_id,
                            Brand_name: v.Brand_name,
                          }))
                        : []
                    } // Provide empty array if brandNew is undefined
                    getOptionLabel={(option) => option.Brand_name || ""} // Text to display for each option
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Brand"
                        variant="outlined"
                      />
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option.brand_id === value?.brand_id
                    } // Ensure option matches selected value
                  />
                </div>
                <div className="form-group mb-3 quotationSelectSer">
                  <label>Unit</label>
                  {/* <Autocomplete
                    disablePortal
                    options={unit?.map((v) => ({
                      id: v.unit_id,
                      name: v.unit_name_en,
                    }))} // Standardize the options structure
                    getOptionLabel={(option) => option.name || ""} // Display unit name as label
                    value={
                      unit
                        ?.map((v) => ({
                          id: v.unit_id,
                          name: v.unit_name_en,
                        }))
                        .find(
                          (item) =>
                            item.id ===
                            (toEditDetails?.itf_unit ||
                              defaultDetailsValue?.OD_Unit)
                        ) || null
                    } // Match the value with the options
                    onChange={(event, newValue) => {
                      setToEditDetails((prev) => ({
                        ...prev,
                        itf_unit: newValue ? newValue.id : null, // Update itf_unit with the selected option
                      }));
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value?.id
                    } // Equality check by id
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="select unit"
                        variant="outlined"
                      />
                    )}
                  /> */}
                  <Autocomplete
                    disablePortal
                    value={
                      unit?.find(
                        (item) =>
                          item.unit_id ===
                          (toEditDetails?.itf_unit ??
                            defaultDetailsValue?.OD_Unit)
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      setToEditDetails((prevDetails) => ({
                        ...prevDetails,
                        itf_unit: newValue ? newValue.unit_id : "", // Set the itf_unit when a value is selected
                      }));
                    }}
                    options={
                      unit
                        ? unit.map((v) => ({
                            unit_id: v.unit_id,
                            unit_name_en: v.unit_name_en,
                          }))
                        : []
                    } // Provide empty array if unit is undefined
                    getOptionLabel={(option) => option.unit_name_en || ""} // Text to display for each option
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Unit"
                        variant="outlined"
                      />
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option.unit_id === value?.unit_id
                    } // Ensure option matches selected value
                  />
                </div>
                <div className="form-group">
                  <label>Adjustment price</label>
                  <input
                    type="number"
                    value={
                      toEditDetails?.adjusted_price ??
                      defaultDetailsValue?.OD_OP ??
                      ""
                    }
                    name="adjusted_price"
                    onChange={updateDetails}
                  />
                </div>
              </div>
              <div className="modal-footer justify-center">
                <button
                  type="button"
                  onClick={saveNewDetails}
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal show={show} onHide={handleClose} className="exampleQuo">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Freight or Transport Error
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
              <p className="text-red-500">
                {" "}
                {massageShow ? massageShow : massageShow1 ? massageShow1 : ""}
              </p>
            </div>
          </div>
        </div>
      </Modal>
      {/* <div
        className="modal fade"
        id="exampleQuo"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Freight or transport Error
              </h1>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeIcon}
              >
                <span class="mdi mdi-close"></span>
              </button>
            </div>
            <div className="modal-body">
              <p>
                {" "}
                {massageShow ? massageShow : massageShow1 ? massageShow1 : ""}
              </p>
            </div>
          </div>
        </div>
      </div> */}

      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-xl modalShipTo">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                >
                  <i className="mdi mdi-close"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="row tableCombinePayment">
                  <div className="tableCreateClient tablepayment">
                    <table>
                      <thead>
                        <tr>
                          <th>ITF</th>
                          <th>Last Update</th>
                          <th>EXW</th>
                          <th>TC</th>
                          <th>Commission</th>
                          <th>FOB</th>
                          <th>GW</th>
                          <th>Freight</th>
                          <th>CNF</th>
                          <th>Margin</th>
                          <th>Fx Rate</th>
                          <th>Fx Rebate</th>
                          <th>Calculated Price</th>
                          <th>Final Price</th>
                          <th>Rebate</th>
                          <th>Base</th>
                          <th>Profit</th>
                          <th>Profit %</th>
                        </tr>
                        {calculateListData?.map((item, index) => (
                          <tr key={index}>
                            <td>{item.ITF}</td>
                            <td>
                              {item["Last Update"] ? item["Last Update"] : ""}
                            </td>
                            <td>{item.EXW}</td>
                            <td>{item.TC}</td>
                            <td>{item.Commission}</td>
                            <td>{item.FOB}</td>
                            <td>{item.GW}</td>
                            <td>{item.freight}</td>
                            <td>{item.CNF}</td>
                            <td>{item.Margin}</td>
                            <td>{item.FX_Rate}</td>
                            <td>{item.FX_Rebate}</td>
                            <td>{item.Calculated_price}</td>
                            <td>{item.FInal_Price}</td>
                            <td>{item.Rebate}</td>
                            <td>{item.base}</td>
                            <td>{item.profit}</td>
                            <td>{item.profit_Percentage}</td>
                          </tr>
                        ))}
                      </thead>
                      <tbody>{/* Add dynamic table data here */}</tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="modal-footer justify-content-center">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateOrder;
