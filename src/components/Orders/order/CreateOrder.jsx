import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import MySwal from "../../../swal";
import { Button, Modal } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import "./CreateOrder.css";
import { ComboBox } from "../../combobox";
import Select, { components } from "react-select";
import { FaCaretDown } from "react-icons/fa"; // Import an icon from react-icons
const CreateOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { from } = location.state || {};
  console.log(from);
  const isReadOnly = from?.isReadOnly;
  const [data, setData] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [orderErr, setOrderErr] = useState(true);
  const [deleteOrderId, setDeleteOrderId] = useState("");
  const [consignees, setConsignees] = useState([]);
  const [massageShow, setMassageShow] = useState("");
  const [massageShow1, setMassageShow1] = useState("");
  const [calculateListData, setCalculateListData] = useState([]);
  const [show, setShow] = useState(false);
  const [notes1, setNotes1] = useState("");
  const [stock, setStock] = useState("");
  const [itfNew, setItfName] = useState([]);
  const [brandNew, setBrandNew] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => {
    setCalculateListData([]);
    setShowModal(false); // Hide the modal
  };
  console.log(massageShow);
  console.log(massageShow1);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  console.log(massageShow);
  console.log(massageShow1);
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
    order_id: from?.order_id || "",
    Order_number: from?.Order_number || "",
    brand_id: from?.brand_id || "",
    client_id: from?.client_id || "",
    quote_id: from?.quote_id || "",
    loading_location: from?.loading_location || "",
    Freight_provider_: from?.Freight_provider_ || "",
    liner_id: from?.liner_id || "",
    from_port_: from?.from_port_ || "",
    destination_port_id: from?.destination_port_id || "",
    Clearance_provider: from?.Clearance_provider || "",
    Transportation_provider: from?.Transportation_provider || "",
    consignee_id: from?.consignee_id || "",
    fx_id: from?.fx_id || "",
    mark_up: from?.mark_up || 0,
    rebate: from?.rebate || 0,
    palletized: from?.palletized == "ON",
    Chamber: from?.Chamber == "ON",
    load_date: from?.load_date
      ? new Date(from?.load_date).toISOString().slice(0, 10)
      : "",
    fx_rate: from?.fx_rate,
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
  const { data: summary, refetch: getSummary } = useQuery(
    `getOrderSummary?quote_id=${state.order_id}`,
    {
      enabled: !!state.order_id,
    }
  );
  console.log(summary);
  const oneQoutationDAta = () => {
    axios
      .get(`${API_BASE_URL}/getOrderById`, {
        params: {
          order_id: state.order_id,
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
  const [orderId, setOrderId] = useState("");
  const [gross, setGross] = useState(false);
  const [freight, setFreight] = useState(false);
  const [grossMass, setGrossMass] = useState("");
  const [freightMass, setFreightMass] = useState("");

  console.log(from?.order_id);
  console.log(orderId);
  console.log(grossMass);
  const twoDecimal = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  useEffect(() => {
    grossTransspotationErr();
    orderCrossFreight();
    if (state.order_id) getOrdersDetails();
  }, [orderId]);
  const computedState = useMemo(() => {
    console.log(state.quote_id);
    const quoteFind = quote?.find((v) => v.quote_id == state.quote_id);
    console.log(quoteFind);
    console.log( state);
    const r = {
      ...state,
      consignee_id: state.consignee_id || quoteFind?.consignee_id,
      client_id: state.client_id || quoteFind?.client_id,
    };
    console.log(r);
    const consigneeFind = consignee?.find(
      (v) => v.consignee_id == state.consignee_id
    );
console.log(consigneeFind);
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
  console.log(from);
  console.log(computedState);
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
  console.log(isError);
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

  const deleteDetail = async (i) => {
    if (isReadOnly || isLoading) return;
    if (details[i].OD_ID) {
      try {
        MySwal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await axios.post(`${API_BASE_URL}/deleteOrderDetails`, {
              id: details[i].OD_ID,
            });
            setDetails((prevState) => {
              return prevState.filter((v, index) => index != i);
            });
            toast.success("Order detail deleted successfully");
          }
        });
      } catch (e) {}
    } else {
      setDetails((prevState) => {
        return prevState.filter((v, index) => index != i);
      });
    }
  };
  const handleChange3 = (e) => {
    setNotes1(e.target.value);
  };
  const grossTransspotationErr = async () => {
    if (orderId) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/OrderGrossTransportError`,
          { order_id: orderId }
        );
        console.log(response); // Log the response to the console
        if (response.data.success == true) {
          setGross(true);
          setGrossMass(response.data.message);
        }
        toast.success(response);
      } catch (e) {
        console.error("Something went wrong", e); // Log the error to the console
      }
    }
  };
  const dataSubmit1 = () => {
    console.log(notes1);
    axios
      .post(`${API_BASE_URL}/deleteOrder`, {
        id: deleteOrderId,
        user_id: localStorage.getItem("id"),
        NOTES: notes1,
      })
      .then((response) => {
        setStock(response.data.message.Message_EN);
        setNotes1("");
        console.log(response.data.message.Message_EN);
        let modalElement = document.getElementById("exampleModal1");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        if (response.data.success) {
          toast.success("Order Deleted Successfully", {
            autoClose: 1000,
            theme: "colored",
          });
          navigate("/orders");
        } else {
          setShow(true);
        }
        console.log(response);

        refetch();
        orderData();
        setNotes1("");
        // Clear the quantity field after successful update
      })
      .catch((error) => {
        console.log(error);
        // toast.error("Network Error", {
        //   autoClose: 1000,
        //   theme: "colored",
        // });
      });
  };
  const orderCrossFreight = async () => {
    if (orderId) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/OrderGrossFreightError`,
          { order_id: orderId }
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
  const deleteOrder = async () => {
    console.log(deleteOrderId);

    if (deleteOrderId) {
      try {
        await axios.post(`${API_BASE_URL}/deleteOrder`, { id: deleteOrderId });
        toast.success("Order cancel successfully");
        navigate("/orders");
        oneQoutationDAta();
        refetch();
      } catch (e) {
        // toast.error("Something went wrong");
        console.log(e);
      }
    } else {
      navigate("/orders");
    }
  };
  console.log(details);
  const update = async () => {
    if (orderErr) {
      toast.error("Please Add Order or Order Details");
    } else {
      try {
        const response = await axios.post(`${API_BASE_URL}/createOrder`, {
          input: {
            ...computedState,
            user: localStorage.getItem("id"),
            palletized: !!computedState.palletized,
            Chamber: !!computedState.Chamber,
            order_id: state.order_id,
          },
          details: details?.filter(
            (v) => v.ITF && v.itf_quantity && v.itf_unit
          ),
        });
        console.log(response); // Log the response here
        oneQoutationDAta();
        // let modalElement = document.getElementById("exampleQuo");
        // let modalInstance = bootstrap.Modal.getInstance(modalElement);

        if (response.data.success == false) {
          // modalInstance.show();
          setShow(true);
          setMassageShow(response.data.message);
        } else if (response.data.success == true) {
          setShow(false);

          toast.success("Order Create successfully", {
            autoClose: 1000,
            theme: "colored",
          });
          navigate("/orders");
        }
      } catch (e) {
        console.error(e); // Log the error to the console
        toast.error("Something went wrong");
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
  const calculate = async () => {
    const reai = details?.filter((v) => v.ITF && v.OD_QTY && v.OD_Unit);
    console.log(reai);
    if (reai.length === 0) return;
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
        details: reai,
      });
      console.log(data);

      // let modalElement = document.getElementById("exampleQuo");
      // let modalInstance = bootstrap.Modal.getInstance(modalElement);
      oneQoutationDAta();
      if (data.success === false) {
        calculateList();
        setShowModal(false);
        setShow(true);
        setMassageShow1(data.message);
      } else if (data.success === true) {
        calculateList();
        setShow(false);
        toast.success("Order Calculated successfully", {
          autoClose: 1000,
          theme: "colored",
        });
        setShowModal(true);
      }

      await getOrdersDetails(data.data);
      getSummary();
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong", {
        autoClose: 1000,
        theme: "colored",
      });
    } finally {
      MySwal.close();
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
  console.log(toEditDetails?.brand_id);
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

      // ITF:1,

      itf_quantity: toEditDetails?.itf_quantity ?? defaultDetailsValue?.OD_QTY,
      itf_unit: toEditDetails?.itf_unit ?? defaultDetailsValue?.OD_Unit,
      adjusted_price:
        toEditDetails?.adjusted_price ?? defaultDetailsValue?.OD_OP ?? 0,
      od_id: defaultDetailsValue?.OD_ID || undefined,
      // od_id:"91",

      brand_id:
        toEditDetails?.brand_id ?? defaultDetailsValue?.OD_Brand ?? undefined,
      is_changed: true,
    };
    if (!values.ITF || !values.itf_quantity || !values.itf_unit) {
      setOrderErr(true);
      return toast.error("Please fill all fields");
    }
    setOrderErr(false);
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
      console.log(data.order_id);
      toast.success("Order detail added successfully");
      setDeleteOrderId(data?.order_id);
      setState((prevState) => {
        return {
          ...prevState,
          order_id: data?.order_id,
        };
      });

      getSummary();
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
  const newItfList = async () => {
    if (state.consignee_id) {
      try {
        const response = await axios.post(`${API_BASE_URL}/NewItfDropDown`, {
          Consignee_id: state.consignee_id,
        });
        console.log(response.data); // Log the response data
        setItfName(response.data.data);
        // Update state or perform other actions with response data if needed
      } catch (e) {
        console.log("Error:", e);
        // toast.error("Something went wrong");
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
    axios
      .post(`${API_BASE_URL}/RecalculateOrder`, {
        order_id: state.order_id,
        user_id: localStorage.getItem("id"),
      })
      .then((response) => {
        oneQoutationDAta();
        calculate();
        getOrdersDetails();
        console.log(response);
        toast.success("Order Recalculate  Successfully", {
          autoClose: 1000,
          theme: "colored",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong");
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
        <FaCaretDown style={{ color: "black" }} />
      </components.DropdownIndicator>
    );
  };

  const options = itfNew
    ? itfNew.map((v) => ({
        value: v.itf_id, // Standardized property name for value
        label: v.itf_name, // Standardized property name for label
      }))
    : [];
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
      <Card
        title={`Order Management /Create
         Form`}
      >
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
                      <div className="col-lg-3 form-group">
                        <h6> Create Date </h6>
                        <input
                          type="date"
                          value={computedState.created}
                          onChange={handleChange}
                        />
                      </div>
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
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer ">
                        <h6>Client</h6>
                        <Autocomplete
                          options={clients || []} // Ensure clients is an array
                          getOptionLabel={(option) => option.client_name || ""} // Display the client name
                          value={
                            clients?.find(
                              (v) => v.client_id === computedState.client_id
                            ) || null
                          } // Find the selected client by client_id
                          onChange={(event, newValue) => {
                            // Handle the change and update the client_id in the state
                            setState({
                              ...state,
                              client_id: newValue ? newValue.client_id : "", // Set the client_id from the selected client
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Client"
                              variant="outlined"
                            />
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.client_id === value?.client_id
                          } // Compare based on client_id
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>Consignee</h6>
                        <Autocomplete
                          options={consignees || []} // Ensure consignees is an array
                          getOptionLabel={(option) =>
                            option.consignee_name || ""
                          } // Display the consignee name
                          value={
                            consignees?.find(
                              (v) =>
                                v.consignee_id === computedState.consignee_id
                            ) || null
                          } // Find the selected consignee by consignee_id
                          onChange={(event, newValue) => {
                            // Handle the change and reset multiple fields in the state
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
                              consignee_id: newValue
                                ? newValue.consignee_id
                                : "", // Set consignee_id from the selected consignee
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Consignee"
                              variant="outlined"
                            />
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.consignee_id === value?.consignee_id
                          } // Compare based on consignee_id
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>Brands</h6>
                        <Autocomplete
                          options={brands || []} // Ensure brands is an array
                          getOptionLabel={(option) => option.Brand_name || ""} // Display the brand name
                          value={
                            brands?.find(
                              (v) => v.brand_id === computedState.brand_id
                            ) || null
                          } // Find the selected brand by brand_id
                          onChange={(event, newValue) => {
                            // Update brand_id in the state based on the selected option
                            setState({
                              ...state,
                              brand_id: newValue ? newValue.brand_id : "", // Set brand_id from the selected brand
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Brand"
                              variant="outlined"
                            />
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.brand_id === value?.brand_id
                          } // Compare based on brand_id
                        />
                      </div>

                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>Currency</h6>

                        <Autocomplete
                          options={currency || []} // Ensure options is an array even if currency is undefined
                          getOptionLabel={(option) => option.currency || ""} // Display the name of the currency
                          value={
                            currency?.find(
                              (v) => v.currency_id === computedState.fx_id
                            ) || null
                          } // Find the selected currency based on fx_id
                          onChange={(event, newValue) => {
                            // Pass the selected value to setState
                            setState((prevState) => ({
                              ...prevState,
                              fx_id: newValue ? newValue.currency_id : "", // If no value is selected, set an empty string
                            }));
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Currency"
                              variant="outlined"
                            />
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.currency_id === value?.currency_id
                          } // Ensure proper comparison of selected value
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>Loading Location</h6>
                        <Autocomplete
                          options={locations || []} // Ensure options is an array even if locations is undefined
                          getOptionLabel={(option) => option.name || ""}
                          value={
                            locations?.find(
                              (v) => v.id === computedState.loading_location
                            ) || null
                          } // Find selected location based on id
                          onChange={(event, newValue) => {
                            // Pass the selected value to handleChange
                            handleChange({
                              target: {
                                name: "loading_location",
                                value: newValue ? newValue.id : "",
                              },
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Loading"
                              variant="outlined"
                            />
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value?.id
                          } // Compare option with the selected value
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>Port of Origin</h6>
                        <Autocomplete
                          options={ports || []} // Ensure options is an array even if ports is undefined
                          getOptionLabel={(option) => option.port_name || ""}
                          value={
                            ports?.find(
                              (v) => v.port_id === computedState.from_port_
                            ) || null
                          } // Find selected port based on port_id
                          onChange={(event, newValue) => {
                            // Pass the selected value to handleChange
                            handleChange({
                              target: {
                                name: "from_port_",
                                value: newValue ? newValue.port_id : "",
                              },
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Origin"
                              variant="outlined"
                            />
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.port_id === value?.port_id
                          } // Compare option with the selected value
                        />
                      </div>
                      <div className="col-lg-3 form-group quotationSelectSer">
                        <h6>Port of Destination</h6>
                        <Autocomplete
                          options={ports || []} // Ensure options is always an array, even if ports is undefined
                          getOptionLabel={(option) => option.port_name || ""} // Display the port_name for each option
                          value={
                            ports?.find(
                              (v) =>
                                v.port_id === computedState.destination_port_id
                            ) || null
                          } // Find the port based on destination_port_id
                          onChange={handleChange} // Update state when the selection changes
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Destination Port"
                              variant="outlined"
                            />
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.port_id === value?.port_id
                          } // Match option with the selected value based on port_id
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>Airline</h6>
                        <Autocomplete
                          options={liners || []} // Ensure options is always an array, even if liners is undefined
                          getOptionLabel={(option) => option.liner_name || ""} // Display the airline name for each option
                          value={
                            liners?.find(
                              (v) => v.liner_id === computedState.liner_id
                            ) || null
                          } // Find the airline based on liner_id
                          onChange={handleChange} // Update state when the selection changes
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Airline"
                              variant="outlined"
                            />
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.liner_id === value?.liner_id
                          } // Match option with the selected value based on liner_id
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>Transportation</h6>
                        <Autocomplete
                          options={transport?.map((v) => ({
                            id: v.Transportation_provider,
                            name: v.name,
                          }))}
                          getOptionLabel={(option) => option.name} // Display the name of the transportation provider
                          value={
                            computedState.Transportation_provider
                              ? transport?.find(
                                  (v) =>
                                    v.Transportation_provider ===
                                    computedState.Transportation_provider
                                ) || null
                              : null
                          } // Ensure value is mapped to the full object
                          onChange={(e, newValue) =>
                            setState({
                              ...state,
                              Transportation_provider: newValue?.id,
                            })
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select transportation"
                            />
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value?.id
                          }
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>Clearance</h6>
                        <Autocomplete
                          options={clearance?.map((v) => ({
                            id: v.Clearance_provider,
                            name: v.name,
                          }))}
                          getOptionLabel={(option) => option.name} // Display the name of the clearance provider
                          value={
                            computedState.Clearance_provider
                              ? clearance?.find(
                                  (v) =>
                                    v.Clearance_provider ===
                                    computedState.Clearance_provider
                                ) || null
                              : null
                          } // Map the id to the full object
                          onChange={(e, newValue) =>
                            setState({
                              ...state,
                              Clearance_provider: newValue?.id,
                            })
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select clearance"
                            />
                          )}
                          isOptionEqualToValue={
                            (option, value) => option.id === value?.id // Ensure option matches value by id
                          }
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>Freight Provider</h6>
                        <Autocomplete
                          options={freights?.map((v) => ({
                            id: v.Freight_provider,
                            name: v.name,
                          }))}
                          getOptionLabel={(option) => option.name} // Display the name of the freight provider
                          value={
                            computedState.Freight_provider_
                              ? freights?.find(
                                  (v) =>
                                    v.Freight_provider ===
                                    computedState.Freight_provider_
                                ) || null
                              : null
                          } // Map the id to the full object
                          onChange={(e, newValue) =>
                            setState({
                              ...state,
                              Freight_provider_: newValue?.id,
                            })
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Freight Provider"
                            />
                          )}
                          isOptionEqualToValue={
                            (option, value) => option.id === value?.id // Ensure option matches value by id
                          }
                        />
                      </div>
                      <div className="col-lg-3 form-group">
                        <h6>EX Rate</h6>
                        <input
                          type="number"
                          value={computedState.fx_rate}
                          onChange={handleChange}
                          name="fx_rate"
                        />
                      </div>
                      <div className="col-lg-3 form-group">
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
                              localStorage.getItem("level") === "Level 1" &&
                              localStorage.getItem("role") === "Admin"
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
                              <td>{v.OD_QTY}</td>
                              <td>{v.Unit_Name}</td>
                              <td>{v.OD_Box}</td>
                              <td>{v.OD_NW}</td>
                              <td>
                                {twoDecimal.format(
                                  v.QOD_FP === "0.00" || v.QOD_FP === null
                                    ? v.OD_CP
                                    : v.QOD_FP
                                )}
                              </td>
                              <td>{v.OD_OP ? v.OD_OP : ""}</td>
                              {!(
                                localStorage.getItem("level") === "Level 1" &&
                                localStorage.getItem("role") === "Admin"
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
                                      onClick={() => {
                                        deleteDetail(i);
                                      }}
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
                    {/* <div className="grid md:grid-cols-4 grid-cols-1 my-4">
                      <div>
                        Total NW <b>{(+data?.O_NW || 0).toLocaleString()}</b>
                      </div>
                      <div>
                        Total FOB <b>{(+data?.O_FOB || 0).toLocaleString()}</b>
                      </div>
                      <div>
                        Total Commission{" "}
                        <b>{(data?.O_Commission_FX || 0).toLocaleString()}</b>
                      </div>
                      <div>
                        Total GW <b>{(+data?.O_GW || 0).toLocaleString()}</b>
                      </div>
                      <div>
                        Total Freight{" "}
                        <b>{(+data?.O_Freight || 0).toLocaleString()}</b>
                      </div>
                      <div>
                        Total Rebate{" "}
                        <b>{(+data?.O_Rebate || 0).toLocaleString()}</b>
                      </div>
                      <div>
                        Total Box <b>{(+data?.O_Box || 0).toLocaleString()}</b>
                      </div>
                      <div>
                        Total CNF <b>{(+data?.O_CNF || 0).toLocaleString()}</b>
                      </div>
                      <div>
                        Total Profit{" "}
                        <b>
                          {(+data?.O_Profit_Percentage || 0).toLocaleString()}
                        </b>
                      </div>
                      <div>
                        Total CBM <b>{(+data?.O_CBM || 0).toLocaleString()}</b>
                      </div>
                      <div>
                        Total CNF FX{" "}
                        <b>{(+data?.O_CNF_FX || 0).toLocaleString()}</b>
                      </div>
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
                          localStorage.getItem("level") === "Level 1" &&
                          localStorage.getItem("role") === "Admin"
                        ) && (
                          <div className="">
                            <b> Total Profit : </b>
                            {(+data?.O_Profit || 0).toLocaleString()}
                          </div>
                        )}
                        <div style={{ marginLeft: "2px" }}>
                          <b> Profit % : </b>
                          {(+data?.O_Profit_Percentage || 0).toLocaleString()}
                        </div>
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
                    {/* {(gross && freight) || gross || freight ? (
                      <p className="text-red-500">
                        <i className="mdi mdi-alert" />
                        {`${grossMass}  `}
                        &nbsp;
                        {freightMass}
                      </p>
                    ) : (
                      <></>
                    )} */}
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
                  Create
                </button>
              ) : (
                ""
              )}

              {/* <Link className="btn btn-danger" to={"/orders"}>
                Cancel
              </Link> */}
              <button
                className="btn btn-danger"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Card>
      {isOpenModal && (
        // <div className="fixed inset-0 flex items-center justify-center z-50">
        //   {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        //   <div
        //     className="fixed w-screen h-screen bg-black/20"
        //     onClick={closeModal}
        //   />
        //   <div className="bg-white rounded-lg shadow-lg p-4 max-w-md w-full z-50">
        //     <h3>Edit Details</h3>
        //     <div className="formEan formCreate">
        //       <div className="form-group mb-3 itfHeight">
        //         <label>ITF</label>
        //         <ComboBox
        //           options={itf?.map((v) => ({
        //             id: v.itf_id,
        //             name: v.itf_name_en,
        //           }))}
        //           value={toEditDetails?.ITF ?? defaultDetailsValue?.ITF}
        //           onChange={(e) => setToEditDetails((v) => ({ ...v, ITF: e }))}
        //         />
        //       </div>
        //       <div className="form-group">
        //         <label>Quantity</label>
        //         <input
        //           type="number"
        //           value={
        //             toEditDetails?.itf_quantity ??
        //             defaultDetailsValue?.itf_quantity ??
        //             0
        //           }
        //           name="itf_quantity"
        //           onChange={updateDetails}
        //         />
        //       </div>
        //       <div className="form-group mb-3">
        //         <h6>Brands</h6>
        //         <ComboBox
        //           options={brands?.map((v) => ({
        //             id: v.brand_id,
        //             name: v.Brand_name,
        //           }))}
        //           value={
        //             toEditDetails?.brand_id ?? defaultDetailsValue?.brand_id
        //           }
        //           onChange={(e) =>
        //             setToEditDetails((v) => ({ ...v, brand_id: e }))
        //           }
        //         />
        //       </div>
        //       <div className="form-group mb-3">
        //         <label>Unit</label>
        //         <ComboBox
        //           options={unit?.map((v) => ({
        //             id: v.unit_id,
        //             name: v.unit_name_en,
        //           }))}
        //           value={
        //             toEditDetails?.itf_unit ?? defaultDetailsValue?.itf_unit
        //           }
        //           onChange={(e) =>
        //             setToEditDetails((v) => ({ ...v, itf_unit: e }))
        //           }
        //         />
        //       </div>
        //       <div className="form-group">
        //         <label>Adjustment price</label>
        //         <input
        //           type="number"
        //           value={
        //             toEditDetails?.adjusted_price ??
        //             defaultDetailsValue?.adjusted_price ??
        //             0
        //           }
        //           name="adjusted_price"
        //           onChange={updateDetails}
        //         />
        //       </div>
        //       <div className="flex gap-2 justify-end">
        //         <button
        //           type="button"
        //           className="bg-gray-300 px-4 py-2 rounded"
        //           onClick={closeModal}
        //         >
        //           Close
        //         </button>
        //         <button
        //           type="button"
        //           onClick={saveNewDetails}
        //           className="bg-black text-white px-4 py-2 rounded"
        //         >
        //           Save
        //         </button>
        //       </div>
        //     </div>
        //   </div>
        // </div>

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
            <div className="formEan formCreate">
              <div className="form-group mb-3 itfHeight quotationSelectSer">
                <label>ITF</label>
                {/* <Autocomplete
                  disablePortal
                  options={itfNew?.map((v) => ({
                    id: v.itf_id, // Standardizing the property name
                    name: v.itf_name,
                  }))} // Ensure mapping is consistent
                  getOptionLabel={(option) => option.name || ""}
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
                  } // Match the mapped structure
                  onChange={(event, newValue) => {
                    setToEditDetails((prev) => ({
                      ...prev,
                      ITF: newValue ? newValue.id : null, // Update based on newValue.id
                    }));
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value?.id
                  } // Handle null values
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="select ITF"
                      variant="outlined"
                    />
                  )}
                /> */}
                <Select
                  value={selectedOption || null} // The selected value (set to null if no match)
                  onChange={handleChangeSe} // Handle selection
                  options={options} // The dropdown options
                  placeholder="Search or Select ITF"
                  isClearable // Adds a clear button
                  styles={customStyles}
                  components={{ DropdownIndicator }} // Use the custom indicator
                  classNamePrefix="react-select" // Add a prefix for CSS class names
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
                <Autocomplete
                  disablePortal
                  options={brandNew?.map((v) => ({
                    id: v.brand_id,
                    name: v.Brand_name,
                  }))} // Ensure mapping matches the desired structure
                  getOptionLabel={(option) => option.name || ""} // Display name as label
                  value={
                    brandNew
                      ?.map((v) => ({
                        id: v.brand_id,
                        name: v.Brand_name,
                      }))
                      .find(
                        (item) =>
                          item.id ===
                          (toEditDetails?.brand_id ||
                            defaultDetailsValue?.OD_Brand)
                      ) || null
                  } // Match the value with mapped options
                  onChange={(event, newValue) => {
                    setToEditDetails((prev) => ({
                      ...prev,
                      brand_id: newValue ? newValue.id : null, // Update brand_id with the selected value
                    }));
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value?.id
                  } // Check equality by id
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="select brand"
                    />
                  )}
                />
              </div>
              <div className="form-group mb-3 quotationSelectSer">
                <label>Unit</label>
                <Autocomplete
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
                      variant="outlined"
                      placeholder="select unit"
                    />
                  )}
                />
              </div>
              <div className="form-group">
                <label>Adjustment price</label>
                <input
                  type="number"
                  value={
                    toEditDetails?.adjusted_price ??
                    defaultDetailsValue?.OD_OP ??
                    0
                  }
                  name="adjusted_price"
                  onChange={updateDetails}
                />
              </div>
            </div>
            <div className="modal-footer d-flex justify-content-center">
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
      <div
        className="modal fade"
        id="exampleModal1"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog   orderDelPop">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Note
              </h1>
              <textarea
                value={notes1}
                onChange={handleChange3}
                placeholder="Type Notes Here"
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary "
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={dataSubmit1}
                className="btn btn-primary"
              >
                ok
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal className="modalError" show={show} onHide={handleClose}>
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Order
            </h1>
            <button
              style={{ color: "#fff", fontSize: "30px" }}
              type="button"
              onClick={() => setShow(false)}
            >
              <i class="mdi mdi-close"></i>
            </button>
          </div>
          <div className="modal-body">
            <div className="eanCheck errorMessage">
              <p>{stock ? stock : "NULL"}</p>
            </div>
          </div>
          <div className="modal-footer"></div>
        </div>
      </Modal>
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

export default CreateOrder;
