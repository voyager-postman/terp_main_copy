import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { API_BASE_URL } from "../../../Url/Url";
import axios from "../../../Url/Api";
import { toast } from "react-toastify";
import MySwal from "../../../swal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Select, { components } from "react-select";
import { FaCaretDown } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
const InvoiceEdit2 = () => {
  const { data: RoundingDataList } = useQuery("GetRoundingTable");
  const [state5, setState5] = useState({
    Rounding: "", // Initial state
  });
  // round
  const [color, setColor] = useState(false);
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const closeIcon1 = () => {
    setShow1(false);
  };
  // new selct
  const CustomInput = ({ value, onClick }) => (
    <div
      className="custom-input"
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
    >
      <input
        type="text"
        value={value}
        readOnly
        style={{
          padding: "10px",
          paddingLeft: "35px",
          width: "250px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />
      <FaCalendarAlt
        style={{
          position: "absolute",
          right: "10px",
          fontSize: "18px",
          color: "#888",
        }}
      />
    </div>
  );
  const location = useLocation();
  const navigate = useNavigate();
  const { from } = location.state || {};
  const [consigneeNew, setConsigneeNew] = useState();
  const [consigneeNew1, setConsigneeNew1] = useState();
  const [consigneeNew2, setConsigneeNew2] = useState();
  const [consigneesNew, setConsigneesNew] = useState([]);
  const [orderNetWeight, setOrderNetWeight] = useState("");
  const [unitPrices, setUnitPrices] = useState({});
  console.log(from);
  const isReadOnly = from?.isReadOnly;
  const [isLoading, setIsLoading] = useState(false);
  const [consignees, setConsignees] = useState([]);
  const [calculateListData, setCalculateListData] = useState([]);
  const [isRecalculateClicked, setIsRecalculateClicked] = useState(false);
  const [isRecalculateClicked1, setIsRecalculateClicked1] = useState(false);
  const [data, setData] = useState("");
  const [newdata, setNewData] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [massageShow, setMassageShow] = useState("");
  const [massageShow1, setMassageShow1] = useState("");
  const [itfNew, setItfName] = useState([]);
  const [brandNew, setBrandNew] = useState([]);
  const [show, setShow] = useState(false);
  console.log(massageShow);
  console.log(newdata);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleChange5 = (e) => {
    setState5((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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

  const [state, setState] = useState({
    created: "",
    order_id: "",
    Order_number: "",
    brand_id: "",
    client_id: "",
    quote_id: "",
    loading_location: "",
    Freight_provider_: "",
    liner_id: "",
    from_port_: "",
    destination_port_id: "",
    Clearance_provider: "",
    Transportation_provider: "",
    consignee_id: "",
    consignee_name: "",
    fx_id: "",
    mark_up: 0,
    rebate: 0,
    palletized: "",
    Chamber: "",
    load_date: "",
    fx_rate: "",
    Q_Markup: "",
    O_Extra: "",
    Location_name: "",
    Daily_FX_Rate: "",
  });
  const [exchangeRate1, setExchangeRate1] = useState();
  const [exchangeRate2, setExchangeRate2] = useState("");
  const [exchangeRate3, setExchangeRate3] = useState("");
  const [exchangeRate4, setExchangeRate4] = useState("");
  const [exchangeRate5, setExchangeRate5] = useState("");
  console.log(state);
  // const handleChange = async (event) => {
  //   if (isReadOnly || isLoading) return;
  //   const { name, value } = event.target;
  //   setState((prevState) => {
  //     return {
  //       ...prevState,
  //       [name]: value,
  //       fx_rate_manually_set:
  //         name === "fx_rate" ? true : prevState.fx_rate_manually_set,
  //     };
  //   });

  //   if (["mark_up", "rebate", "load_date", "fx_rate"].includes(name)) {
  //     try {
  //       await axios.post(`${API_BASE_URL}/updateInvoiceValues`, {
  //         id: state.order_id, // ensure state.id is initialized
  //         [name]: value,
  //       });
  //       console.log(`${name} updated successfully`);
  //     } catch (error) {
  //       console.error(`Error updating ${name}:`, error);
  //     }
  //   }
  // };
  const handleChange = async (event) => {
    if (isReadOnly || isLoading) return;

    const { name, value } = event.target;

    setState((prevState) => ({
      ...prevState,
      [name]: value,
      fx_rate_manually_set:
        name === "fx_rate" ? true : prevState.fx_rate_manually_set,
    }));

    const updatableFields = ["mark_up", "rebate", "load_date", "fx_rate"];

    if (updatableFields.includes(name)) {
      try {
        await axios.post(`${API_BASE_URL}/updateInvoiceValues`, {
          id: state.order_id,
          [name]: value,
        });
        console.log(`${name} updated successfully`);
      } catch (error) {
        console.error(`Error updating ${name}:`, error);
      }
    }
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
  // const { data: quote } = useQuery("getAllQuotation");

  const [orderId, setOrderId] = useState("");
  const [gross, setGross] = useState(false);
  const [freight, setFreight] = useState(false);
  const [grossMass, setGrossMass] = useState("");
  const [freightMass, setFreightMass] = useState("");
  console.log(from?.order_id);
  // const oneQoutationDAta = () => {
  //   axios
  //     .get(`${API_BASE_URL}/NewgetOrdersById`, {
  //       params: {
  //         order_id: from?.Order_ID,
  //       },
  //     })
  //     .then((response) => {
  //       console.log(response.data.data);
  //       setData(response.data.data);
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // };
  // useEffect(() => {
  //   oneQoutationDAta();
  // }, [state.order_id]);

  const oneQoutationDAta = () => {
    axios
      .get(`${API_BASE_URL}/getInvoiceById`, {
        params: {
          invoiceId: from?.Order_ID,
        },
      })
      .then((response) => {
        if (response.data?.data) {
          const newData = response.data.data;
          console.log(newData);
          setNewData(newData);
          // Updating state with fetched API data
          setState((prevState) => ({
            ...prevState,
            created: newData.created
              ? new Date(newData.created).toISOString().slice(0, 10)
              : prevState.created,
            order_id: newData.Order_ID || prevState.order_id,
            Order_number: newData.Order_Number || prevState.Order_number,
            brand_id: newData.Brand_id || prevState.brand_id,
            client_id: newData.Client_id || prevState.client_id,
            quote_id: newData.quote_id || prevState.quote_id,
            loading_location:
              newData.loading_location || prevState.loading_location,
            Freight_provider_:
              newData.O_Freight_Provider || prevState.Freight_provider_,
            liner_id: newData.Liner_ID || prevState.liner_id,
            from_port_: newData.Origin_Port || prevState.from_port_,
            destination_port_id:
              newData.Destination_Port || prevState.destination_port_id,
            Clearance_provider:
              newData.O_Clearance_Provider || prevState.Clearance_provider,
            Transportation_provider:
              newData.O_Transportation_Provider ||
              prevState.Transportation_provider,
            consignee_id: newData.Consignee_ID || prevState.consignee_id,
            consignee_name: newData.consignee_name || prevState.consignee_name,
            fx_id: newData.FX_ID || prevState.fx_id,
            mark_up: newData.O_Markup || prevState.mark_up,
            rebate: newData.O_Rebate || prevState.rebate,
            palletized: newData.palletized === "YES",
            Chamber: newData.Chamber === "YES",
            load_date: newData.load_date
              ? new Date(newData.load_date).toISOString().slice(0, 10)
              : prevState.load_date,
            fx_rate: prevState.fx_rate,
            Daily_FX_Rate: newData.Daily_FX_Rate,
            Q_Markup: prevState.Q_Markup,
            Location_name: newData.location_name,
          }));
          setExchangeRate1(newData.Charge_Volume || 0);
          setExchangeRate2(newData.palletized || 0);
          setExchangeRate3(newData.Chamber || 0);
          setExchangeRate4(newData.PreCooling || 0);
          setExchangeRate5(newData.Include_claims || 0);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  console.log(state);
  useEffect(() => {
    oneQoutationDAta();
  }, []);

  const computedState = useMemo(() => {
    console.log(consigneesNew);
    // const quoteFind = quote?.find((v) => v.quote_id == state.quote_id);
    const r = {
      ...state,
      consignee_id: state.consignee_id,
      client_id: state.client_id,
    };
    const consigneeFind = consigneesNew?.find(
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
    r.fx_id = r.fx_id || consigneeFind?.currency;
    r.O_Extra = r.O_Extra || consigneeFind?.Extra_cost;
    // r.fx_rate =
    //   !state.fx_rate_manually_set && r.fx_id
    //     ? currency?.find((v) => +v.ID === +r.fx_id)?.fx_rate || 0
    //     : state.fx_rate;
    r.fx_rate = (() => {
      if (state.fx_rate_manually_set) return state.fx_rate;
      if (!state.fx_rate && state.Daily_FX_Rate) return state.Daily_FX_Rate;
      const matchedCurrency = currency?.find((v) => +v.ID === +r.fx_id);
      return matchedCurrency?.fx_rate || state.fx_rate || 0;
    })();

    r.rebate = r.rebate || consigneeFind?.O_Rebate;
    r.Clearance_provider =
      r.Clearance_provider ||
      portOriginFind?.preferred_clearance ||
      consigneeFind?.Clearance_provider;
    r.loading_location = r.loading_location || consigneeFind?.Default_location;
    r.brand_id = state.brand_id || consigneeFind?.brand;
    r.mark_up = r.mark_up || consigneeFind?.O_Markup;
    r.Transportation_provider =
      r.Transportation_provider || portOriginFind?.preferred_transport;
    r.from_port_ = r.from_port_ || consigneeFind?.port_of_orign;
    r.destination_port_id =
      r.destination_port_id || consigneeFind?.destination_port;
    r.liner_id = r.liner_id || portDestinationFind?.prefered_liner;
    r.Freight_provider_ =
      state.Freight_provider_ ||
      liners?.find((v) => v.liner_id == r.liner_id)?.preffered_supplier;
    r.Q_Markup = consigneeNew2;

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
  console.log(computedState);
  // const { data: details, refetch: getOrdersDetails } = useQuery(
  //   `NewgetOrdersDetails?id=${state.order_id}`,
  //   {
  //     enabled: !!state.order_id,
  //   }
  // );
  const { data: details, refetch: getOrdersDetails } = useQuery(
    ["OrderBottomView", state.order_id, localStorage.getItem("id")],
    async () => {
      const response = await axios.post(`${API_BASE_URL}/OrderBottomView`, {
        order_id: state.order_id,
        user_id: localStorage.getItem("id"),
      });
      return response.data;
    },
    {
      enabled: !!state.order_id && !!localStorage.getItem("id"),
    }
  );
  console.log(details);

  const isError = useMemo(() => {
    return (details?.section5_Values || []).some((v) => {
      return +v.Box % 1 !== 0;
    });
  }, [details]);
  // const isMinWeightError = useMemo(() => {
  //   return (
  //     (+summary?.Gross_weight || 0) <
  //     freights?.find(
  //       (v) => v.Freight_provider == computedState.Freight_provider_
  //     )?.min_weight
  //   );
  // }, [freights, summary]);
  // const isMinWeightTransportError = useMemo(() => {
  //   return (
  //     (+summary?.Gross_weight || 0) <
  //       freights?.find(
  //         (v) => v.Freight_provider == computedState.Freight_provider_
  //       )?.min_weight &&
  //     (+summary?.Gross_weight || 0) >=
  //       transport?.find(
  //         (v) =>
  //           v.Transportation_provider == computedState.Transportation_provider
  //       )?.max_weight3
  //   );
  // }, [freights, summary]);
  // const isMinTransportError = useMemo(() => {
  //   return (
  //     (+summary?.Gross_weight || 0) >=
  //     transport?.find(
  //       (v) =>
  //         v.Transportation_provider == computedState.Transportation_provider
  //     )?.max_weight3
  //   );
  // }, [freights, summary]);
  // console.log(isMinWeightError);
  // console.log(isMinTransportError);
  // const newItfList1 = async () => {
  //   if (state.consignee_id) {
  //     try {
  //       const response = await axios.post(
  //         `${API_BASE_URL}/OrderMarkupandRebate`,
  //         {
  //           Consignee_ID: state.consignee_id,
  //         }
  //       );
  //       console.log(response.data);
  //       setConsigneeNew(response.data.Consignee_Order_Markup);
  //       setConsigneeNew1(response.data.Consignee_Rebate);
  //       setConsigneeNew2(response.data.Consignee_Quotation_Markup);
  //     } catch (e) {
  //       console.log("Error:", e);
  //     }
  //   }
  // };

  const calculateList = async () => {
    if (from?.Order_ID) {
      try {
        const response = await axios.post(`${API_BASE_URL}/InvoiceCostModal`, {
          invoice_id: from?.Order_ID,
        });
        console.log(response);

        setCalculateListData(response.data);
      } catch (e) {
        console.error("Something went wrong", e);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/InvoicePriceRounding`,
        {
          Order_ID: from?.Order_ID,
          RCondition: state5.Rounding || 0,
          Is_Invoice: 1,
          Is_Quotation: 0,
          Is_Recalculate: 0,
        }
      );
      console.log(response);
      getOrdersDetails();
      const modalEl = document.getElementById("exampleModal");
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) modalInstance.hide();
      setState5("");
      toast.success("Invoice Price updated  successfully");
    } catch (e) {
      console.error("Something went wrong", e);
    }
  };
  const handleSubmit2 = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/AgreedPrice`, {
        order_id: from?.Order_ID,
      });
      console.log(response);
      getOrdersDetails();

      toast.success("Agreed Price updated  successfully");
    } catch (e) {
      console.error("Something went wrong", e);
    }
  };
  const handleSubmit1 = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/InvoicePriceRounding`,
        {
          Order_ID: from?.Order_ID,
          RCondition: 0,
          Is_Invoice: 1,
          Is_Quotation: 0,
          Is_Recalculate: 0,
        }
      );
      console.log(response);
      getOrdersDetails();

      toast.success("Invoice Price updated  successfully");
    } catch (e) {
      console.error("Something went wrong", e);
    }
  };
  // const calculateList = async () => {
  //   if (state.order_id) {
  //     try {
  //       const response = await axios.post(`${API_BASE_URL}/NewOrderCostModal`, {
  //         order_id: state.order_id,
  //       });
  //       console.log(response);

  //       setCalculateListData(response.data);
  //     } catch (e) {
  //       console.error("Something went wrong", e);
  //     }
  //   }
  // };
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
    // newItfList1();
  }, [state.consignee_id]);
  const handleAgreedPricingChange4 = async (e) => {
    const { name, checked } = e.target;
    const newValue = checked ? 1 : 0;

    setExchangeRate1(newValue);

    try {
      const response = await updateAllOrderStatuses({
        id: state.order_id,
        field: name,
        value: newValue,
      });

      console.log("API success:", response);
      if (response?.data?.message) {
        toast.success(response.data.message, {
          autoClose: 1000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to update status", {
        autoClose: 1500,
        theme: "colored",
      });
    }
  };
  const handleAgreedPricingChange8 = async (e) => {
    const { name, checked } = e.target;
    const newValue = checked ? 1 : 0;

    setExchangeRate5(newValue);

    try {
      const response = await updateAllOrderStatuses({
        id: state.order_id,
        field: name,
        value: newValue,
      });

      console.log("API success:", response);
      if (response?.data?.message) {
        toast.success(response.data.message, {
          autoClose: 1000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to update status", {
        autoClose: 1500,
        theme: "colored",
      });
    }
  };
  const handleAgreedPricingChange5 = async (e) => {
    const { name, checked } = e.target;
    const newValue = checked ? 1 : 0;

    setExchangeRate2(newValue);

    try {
      const response = await updateAllOrderStatuses({
        id: state.order_id,
        field: name,
        value: newValue,
      });

      console.log("API success:", response);
      if (response?.data?.message) {
        toast.success(response.data.message, {
          autoClose: 1000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to update status", {
        autoClose: 1500,
        theme: "colored",
      });
    }
  };
  const handleAgreedPricingChange6 = async (e) => {
    const { name, checked } = e.target;
    const newValue = checked ? 1 : 0;

    setExchangeRate3(newValue);

    try {
      const response = await updateAllOrderStatuses({
        id: state.order_id,
        field: name,
        value: newValue,
      });

      console.log("API success:", response);
      if (response?.data?.message) {
        toast.success(response.data.message, {
          autoClose: 1000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to update status", {
        autoClose: 1500,
        theme: "colored",
      });
    }
  };
  const handleAgreedPricingChange7 = async (e) => {
    const { name, checked } = e.target;
    const newValue = checked ? 1 : 0;

    setExchangeRate4(newValue);

    try {
      const response = await updateAllOrderStatuses({
        id: state.order_id,
        field: name,
        value: newValue,
      });

      console.log("API success:", response);
      if (response?.data?.message) {
        toast.success(response.data.message, {
          autoClose: 1000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to update status", {
        autoClose: 1500,
        theme: "colored",
      });
    }
  };
  const updateAllOrderStatuses = async ({ id, field, value }) => {
    return axios.post(`${API_BASE_URL}/updateInvoiceStatuses`, {
      id,
      field,
      value,
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
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/NewdeleteOrderDetails`,
            {
              id: id,
              user_id: localStorage.getItem("id"),
              order_id: from?.Order_ID,
              Is_Recalculate: 0,
              Is_Quotation: 0,
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

  console.log(details);
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
          Charge_Volume: exchangeRate1 ? 1 : 0,
        },
        details: details?.filter((v) => v.ITF && v.OD_QTY && v.OD_Unit),
        Is_Recalculate: 0,
        Is_Quotation: 0,
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

        navigate("/order");
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

    setOrderNetWeight(""); // ✅ Clear input on close
  };
  const calculate = async (isClicked) => {
    console.log(isRecalculateClicked);
    setIsRecalculateClicked(isClicked);
    console.log(isRecalculateClicked);

    const reai = details?.filter((v) => v.ITF && v.OD_QTY && v.OD_Unit);
    console.log(reai);
    if (reai.length == 0) return;
    setIsLoading(true);
    loadingModal.fire();

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/NewcalculateRecalculateOrder`,
        {
          input: {
            ...computedState,
            user: localStorage.getItem("id"),
            palletized: exchangeRate2 ? 1 : 0,
            Chamber: exchangeRate3 ? 1 : 0,
            Precooling: exchangeRate4 ? 1 : 0,
            Include_claims: exchangeRate5 ? 1 : 0,
            Charge_Volume: exchangeRate1 ? 1 : 0,
          },
          details: reai,
          Is_Recalculate: isClicked ? 1 : 0, // Correctly pass the argument value
          Is_Quotation: 0,
        }
      );
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
        toast.success("Invoice Calculated successfully", {
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
  const updateOrderTest = async () => {
    const reai = details?.filter((v) => v.ITF && v.OD_QTY && v.OD_Unit);
    console.log(reai);
    if (reai.length == 0) return;
    setIsLoading(true);
    loadingModal.fire();

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/NewcalculateRecalculateOrder`,
        {
          input: {
            ...computedState,
            user: localStorage.getItem("id"),
            palletized: exchangeRate2 ? 1 : 0,
            Chamber: exchangeRate3 ? 1 : 0,
            Precooling: exchangeRate4 ? 1 : 0,
            Include_claims: exchangeRate5 ? 1 : 0,
            Charge_Volume: exchangeRate1 ? 1 : 0,
          },
          details: reai,
          Is_Recalculate: 0, // Correctly pass the argument value
          Is_Quotation: 0,
        }
      );
      console.log(data);

      if (data.success == false) {
        calculateList();
        getOrdersDetails();
        oneQoutationDAta();
        setMassageShow1(data.message);
      } else if (data.success == true) {
        calculateList();
        oneQoutationDAta();
        getOrdersDetails();
        toast.success("Order Update successfully", {
          autoClose: 1000,
          theme: "colored",
        });
        navigate("/order");
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
  const calculate1 = async (isClicked) => {
    console.log(isRecalculateClicked);
    setIsRecalculateClicked(isClicked);
    console.log(isRecalculateClicked);

    const reai = details?.filter((v) => v.ITF && v.OD_QTY && v.OD_Unit);
    console.log(reai);
    if (reai.length == 0) return;
    setIsLoading(true);
    loadingModal.fire();

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/NewcalculateRecalculateOrder`,
        {
          input: {
            ...computedState,
            user: localStorage.getItem("id"),
            palletized: exchangeRate2 ? 1 : 0,
            Chamber: exchangeRate3 ? 1 : 0,
            Precooling: exchangeRate4 ? 1 : 0,
            Include_claims: exchangeRate5 ? 1 : 0,
            Charge_Volume: exchangeRate1 ? 1 : 0,
          },
          details: reai,
          Is_Recalculate: isClicked ? 1 : 0, // Correctly pass the argument value
          Is_Quotation: 0,
        }
      );
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
  // const saveNewDetails1 = async () => {
  //   setOrderErr(false);
  //   loadingModal.fire();
  //   closeModal();
  //   try {
  //     const { data } = await axios.post(`${API_BASE_URL}/NewaddOrderInput`, {
  //       input: {
  //         ...computedState,
  //         user: localStorage.getItem("id"),
  //         palletized: !!computedState.palletized,
  //         Chamber: !!computedState.Chamber,
  //       },
  //     });
  //     oneQoutationDAta();
  //     setOrderId(data?.order_id);
  //     console.log(data.order_id);
  //     toast.success("Order detail added successfully");
  //     setDeleteOrderId(data?.order_id);
  //     setState((prevState) => {
  //       return {
  //         ...prevState,
  //         order_id: data?.order_id,
  //       };
  //     });

  //     getOrdersDetails();
  //     // navigate("/orders");
  //     MySwal.close();
  //     closeModal();
  //   } catch (e) {
  //     console.error(e);
  //     MySwal.close();
  //     closeModal();
  //     toast.error("Something went wrong");
  //   } finally {
  //     MySwal.close();
  //     closeModal();
  //   }
  // };
  console.log(toEditDetails);
  const saveNewDetails = async () => {
    console.log(defaultDetailsValue);
    const values = {
      ...toEditDetails,
      ITF: toEditDetails?.ITF ?? defaultDetailsValue?.ITF ?? undefined,
      // ITF: 1,
      Produce:
        toEditDetails?.Produce ?? defaultDetailsValue?.Produce ?? undefined,
      Claim_Markup:
        toEditDetails?.Claim_Markup ??
        defaultDetailsValue?.Claim_Markup ??
        undefined,
      Produce_Status:
        toEditDetails?.Produce_Status ??
        defaultDetailsValue?.Produce_Status ??
        undefined,
      HS_Code:
        toEditDetails?.HSCODE ?? defaultDetailsValue?.HS_Code ?? undefined,
      ITF_Name:
        toEditDetails?.itf_name ?? defaultDetailsValue?.ITF_Name ?? undefined,
      itf_quantity: toEditDetails?.itf_quantity ?? defaultDetailsValue?.OD_QTY,
      itf_unit: toEditDetails?.itf_unit ?? defaultDetailsValue?.OD_Unit,
      adjusted_price:
        toEditDetails?.adjusted_price ??
        defaultDetailsValue?.OD_Adjusted_Price ??
        0,
      od_id: defaultDetailsValue?.OD_ID || undefined,
      // od_id:"91",
      Brand_name:
        toEditDetails?.brand_name ??
        defaultDetailsValue?.Brand_name ??
        undefined,
      Unit_Name:
        toEditDetails?.unit_name_en ??
        defaultDetailsValue?.Unit_Name ??
        undefined,
      brand_id:
        toEditDetails?.brand_id ?? defaultDetailsValue?.OD_Brand ?? undefined,
      is_changed: true,
    };
    if (!values.ITF || !values.itf_quantity || !values.itf_unit)
      return toast.error("Please fill all fields");
    loadingModal.fire();
    closeModal();
    try {
      const { data } = await axios.post(`${API_BASE_URL}/NewaddOrderInput`, {
        input: {
          ...computedState,
          user: localStorage.getItem("id"),
          palletized: exchangeRate2 ? 1 : 0,
          Chamber: exchangeRate3 ? 1 : 0,
          Precooling: exchangeRate4 ? 1 : 0,
          Include_claims: exchangeRate5 ? 1 : 0,
          Charge_Volume: exchangeRate1 ? 1 : 0,
          is_quotation: 0,
        },
        details: values,
      });
      oneQoutationDAta();
      setOrderId(data?.order_id);
      console.log(data);
      getOrdersDetails();
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

  const fetchConsigneesNew = async () => {
    console.log(computedState.client_id);
    try {
      const response = await axios.post(`${API_BASE_URL}/ConsigneeDropDown`, {
        Client_id: computedState.client_id,
      });
      console.log(response);
      setConsigneesNew(response.data.data);
    } catch (error) {
      console.error("Error fetching consignees:", error);
    }
  };
  console.log(computedState);
  useEffect(() => {
    if (computedState.client_id) {
      fetchConsigneesNew();
    }
  }, [computedState.client_id, computedState.consignee_id]);

  const reCalculate = () => {
    setIsLoading(true);
    loadingModal.fire();

    axios
      .post(`${API_BASE_URL}/NewcalculateRecalculateOrder`, {
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
        value: item.ID, // Standardized property name for value
        label: item.itf_name,
        Produce: item.Produce, // Standardized property name for value
        Claim_Markup: item.Claim_Markup, // Standardized property name for label
        HSCODE: item.HSCODE,
        Produce_Status: item.Produce_Status,
      }))
    : [];

  // Find the selected option
  const selectedOption = options.find(
    (option) =>
      option.value === (toEditDetails?.ITF ?? defaultDetailsValue?.ITF)
  );

  const handleChangeSe = (selected) => {
    console.log(selected);
    if (selected) {
      const selectedData = options.find(
        (option) => option.value === selected.value
      );
      console.log(selectedData);
      setToEditDetails((prevDetails) => ({
        ...prevDetails,
        ITF: selected.value,
        Produce: selectedData?.Produce || "",
        Claim_Markup: selectedData?.Claim_Markup || "",
        HSCODE: selectedData?.HSCODE || "",
        itf_name: selectedData?.label || "",
        Produce_Status: selectedData.Produce_Status || "",
      }));
    } else {
      setToEditDetails((prevDetails) => ({
        ...prevDetails,
        ITF: "",
        Produce: "",
        Claim_Markup: "",
        HSCODE: "",
        itf_name: "",
        Produce_Status: "",
      }));
    }
  };

  const handleSaveOrderPopulate = () => {
    const payload = {
      order_id: from?.Order_ID, // You must have this in your component
      user_id: localStorage.getItem("id"), // You must also define this
      Order_NW: orderNetWeight,
      input: {
        ...computedState,
        user: localStorage.getItem("id"),
        palletized: exchangeRate2 ? 1 : 0,
        Chamber: exchangeRate3 ? 1 : 0,
        Precooling: exchangeRate4 ? 1 : 0,
        Include_claims: exchangeRate5 ? 1 : 0,
        Charge_Volume: exchangeRate1 ? 1 : 0,
        is_quotation: 0,
      },
    };

    axios
      .post(`${API_BASE_URL}/OrderPopulate`, payload)
      .then((res) => {
        getOrdersDetails();
        toast.success("Order populated successfully", {
          autoClose: 1000,
          theme: "colored",
        });
        // ✅ Close the modal by ID (no ref needed)
        const modalEl = document.getElementById("consigneeOne");
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();

        setOrderNetWeight("");
      })

      .catch((err) => {
        toast.error("Failed to populate order", {
          autoClose: 1000,
          theme: "colored",
        });
      });
  };
  useEffect(() => {
    const modal = document.getElementById("consigneeOne");

    const clearDataOnClose = () => {
      setOrderNetWeight(""); // Clear input value
    };

    // Listen for modal close
    modal?.addEventListener("hidden.bs.modal", clearDataOnClose);

    // Clean up the event listener on unmount
    return () => {
      modal?.removeEventListener("hidden.bs.modal", clearDataOnClose);
    };
  }, []);

  //***************************************** */ new part order********************************************************
  // const location = useLocation();
  // const navigate = useNavigate();
  // const loadingModal = MySwal.mixin({
  //   title: "Calculating...",
  //   didOpen: () => {
  //     MySwal.showLoading();
  //   },
  //   showCancelButton: false,
  //   showConfirmButton: false,
  //   allowOutsideClick: false,
  // // });
  // const { data: unit } = useQuery("getAllUnit");
  // const { from } = location.state || {};
  // const [data, setData] = useState("");
  // const [unitPrices, setUnitPrices] = useState({});
  const [adjustedPrices, setAdjustedPrices] = useState({});
  const [data1, setData1] = useState("");
  // const [calculateListData, setCalculateListData] = useState([]);
  // const [showModal, setShowModal] = useState(false);
  // const handleCloseModal = () => {
  //   setCalculateListData([]);
  //   setShowModal(false);
  // };
  console.log(from);
  useEffect(() => {
    setData(from);
  }, []);
  // const { data: details, refetch: getOrdersDetails } = useQuery(
  //   `getInvoiceDeatilsTable?invoice_id=${from?.Invoice_id}`,
  //   {
  //     enabled: !!from?.Invoice_id,
  //   }
  // );
  // console.log(details);
  // const { data: summary, refetch: getSummary } = useQuery(
  //   `getInvoiceSummary?invoice_id=${from?.Invoice_id}`,
  //   {
  //     enabled: !!from?.Invoice_id,
  //   }
  // );
  // const oneQoutationDAta = () => {
  //   axios
  //     .get(`${API_BASE_URL}/getInvoiceById`, {
  //       params: {
  //         invoiceId: from?.Invoice_id,
  //       },
  //     })
  //     .then((response) => {
  //       console.log(response.data.data);

  //       setData1(response.data.data);
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // };
  useEffect(() => {
    oneQoutationDAta();
  }, [from?.Order_ID]);

  // const calculateList = async () => {
  //   if (from?.Invoice_id) {
  //     try {
  //       const response = await axios.post(`${API_BASE_URL}/InvoiceCostModal`, {
  //         invoice_id: from?.Invoice_id,
  //       });
  //       console.log(response);

  //       setCalculateListData(response.data.data);
  //     } catch (e) {
  //       console.error("Something went wrong", e);
  //     }
  //   }
  // };

  const calculated = async () => {
    loadingModal.fire();
    try {
      const response = await axios.post(`${API_BASE_URL}/calculateInvoice`, {
        Invoice_id: from?.Order_ID,
      });
      console.log(response);
      getOrdersDetails();
      oneQoutationDAta();
      loadingModal.close();
      toast.success("Invoice Calculated successfully", {
        autoClose: 1000,
        theme: "colored",
      });
      calculateList();
      setShowModal(true);
    } catch (error) {
      console.error("API call error:", error);
      loadingModal.close();
      toast.error("Something went wrong");
    }
  };
  const invoicePrice = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/InvoiceCalculatedPrice`,
        {
          Invoice_ID: from?.Order_ID,
        }
      );
      console.log(response);
      getOrdersDetails();
      oneQoutationDAta();
      toast.success("Use Invoice Price successfully", {
        autoClose: 1000,
        theme: "colored",
      });
    } catch (error) {
      console.error("API call error:", error);
      toast.error("Something went wrong");
    }
  };
  const reduceRebate = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/RebateReduceInvoice`, {
        Invoice_id: from?.Order_ID,
      });
      console.log(response);
      getOrdersDetails();
      oneQoutationDAta();
      toast.success("Reduce Rebate successfully", {
        autoClose: 1000,
        theme: "colored",
      });
    } catch (error) {
      console.error("API call error:", error);
      toast.error("Something went wrong");
    }
  };
  const recordRebate = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/RebateRecord`, {
        Invoice_id: from?.Order_ID,
      });
      console.log(response);
      getOrdersDetails();
      oneQoutationDAta();
      toast.success("Record Rebate successfully", {
        autoClose: 1000,
        theme: "colored",
      });
    } catch (error) {
      console.error("API call error:", error);
      toast.error("Something went wrong");
    }
  };
  const closeFunction = () => {
    // First navigate to the desired route
    navigate("/invoice");

    // Then call the API
    axios
      .post(`${API_BASE_URL}/calculateInvoice`, {
        Invoice_id: from?.Order_ID,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("API call error:", error);
        toast.error("Something went wrong");
      });
  };

  // const closeFunction = async () => {
  //   try {
  //     const response = await axios.post(`${API_BASE_URL}/calculateInvoice`, {
  //       Invoice_id: from?.Invoice_id,
  //     });
  //     console.log(response);
  //     navigate("/invoice");

  //   } catch (error) {
  //     console.error("API call error:", error);
  //     toast.error("Something went wrong");
  //   }
  // };
  useEffect(() => {
    if (Array.isArray(details) && details.length > 0) {
      const initialUnitPrices = {};
      const initialAdjustedPrices = {};

      details.forEach((item) => {
        if (item?.OD_ID !== undefined) {
          initialUnitPrices[item.OD_ID] = item.Unit ?? 0;
          initialAdjustedPrices[item.OD_ID] = item.Adjusted_Price ?? 0;
        }
      });

      setUnitPrices(initialUnitPrices);
      setAdjustedPrices(initialAdjustedPrices);
    }
  }, [details]);

  // console.log(summary);
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  // Handler function to update the state and call the API
  const handleAdjustedPriceChange = (e, id_id) => {
    const newValue = e.target.value;
    setAdjustedPrices((prev) => ({
      ...prev,
      [id_id]: newValue,
    }));
  };
  const updateAdjust = async () => {
    const id_id = editAdjust;
    const newValue = adjustedPrices[id_id];

    try {
      const response = await axios.post(`${API_BASE_URL}/EditInvoiceDetails`, {
        id_id,
        Invoice_id: from?.Order_ID,
        adjusted_price: newValue,
      });
      console.log("API response:", response);
      getOrdersDetails();
    } catch (error) {
      console.error("API call error:", error);
    }

    setEditAdjust(null); // exit edit mode
  };

  // const handleEditEan = async (event, id_id) => {
  //   const newValue = event.target.value;
  //   setUnitPrices((prev) => ({ ...prev, [id_id]: newValue }));
  //   try {
  //     const response = await axios.post(`${API_BASE_URL}/EditInvoiceDetails`, {
  //       id_id: id_id,
  //       Invoice_id: from?.Order_ID,
  //       unit_id: newValue,
  //     });
  //     getOrdersDetails();
  //     console.log("API response:", response);
  //   } catch (error) {
  //     console.error("API call error:", error);
  //   }
  // };

  // const handleEditClick = async (id_id) => {
  //   try {
  //     const response = await axios.post(`${API_BASE_URL}/EditInvoiceDetails`, {
  //       id_id: id_id,
  //       Invoice_id: from?.Order_ID,
  //       // Other data you may need to pass
  //     });
  //     console.log("API response:", response);
  //     getOrdersDetails();
  //     toast.success("Invoice updated successfully");
  //   } catch (error) {
  //     console.error("API call error:", error);
  //     toast.error("Failed to update Invoice");
  //   }
  // };

  // const handleEditEanUnit = async (event, id_id) => {
  //     const newValue = event.target.value;
  //     setUnitPrices((prev) => ({ ...prev, [id_id]: newValue }));

  //     try {
  //       const response = await axios.post(`${API_BASE_URL}/EditInvoiceDetails`, {
  //         id_id: id_id,
  //         Invoice_id: from?.Invoice_id,
  //         unit_id: newValue,
  //       });
  //       getOrdersDetails();
  //       console.log("API response:", response);
  //     } catch (error) {
  //       console.error("API call error:", error);
  //     }
  //   };

  const [editAdjust, setEditAdjust] = useState([]);
  const showAdjust = (id) => {
    setEditAdjust(id);
  };
  const [editUnit, setEditUnit] = useState([]);
  const showUnit = (id) => {
    setEditUnit(id);
  };

  const handleEditEan = (event, id_id) => {
    const newValue = event.target.value;
    setUnitPrices((prev) => ({ ...prev, [id_id]: newValue }));
  };

  const updateUnit = async () => {
    const id_id = editUnit;
    const newValue = unitPrices[id_id];

    try {
      const response = await axios.post(`${API_BASE_URL}/EditInvoiceDetails`, {
        id_id,
        Invoice_id: from?.Order_ID,
        unit_id: newValue,
      });
      console.log("API response:", response);
      getOrdersDetails();
    } catch (error) {
      console.error("API call error:", error);
    }

    setEditUnit(null); // exit edit mode
  };
  const resetAdjust = async (id) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/EditInvoiceDetails`, {
        id_id: id,
        Invoice_id: from?.Order_ID,
        adjusted_price: "0.00",
      });

      console.log("Adjustment removed:", response.data);

      getOrdersDetails();

      setEditAdjust(null);
      setAdjustedPrices((prev) => ({
        ...prev,
        [id]: "",
      }));
    } catch (error) {
      console.error("Failed to reset adjustment:", error);
    }
  };

  return (
    <div>
      <div
        className="px-2 py-4 main-content"
        style={{ minHeight: "calc(-148px + 100vh)" }}
      >
        <div className="container-fluid">
          <div>
            <div className="databaseTableSection pt-0">
              <div className="top-space-search-reslute">
                <div className="tab-content p-4 pt-0 pb-0">
                  <div className="tab-pane active" id="header" role="tabpanel">
                    <div
                      id="datatable_wrapper"
                      className="information_dataTables dataTables_wrapper dt-bootstrap4 "
                    >
                      <div className="d-flex exportPopupBtn" />
                      <div className="grayBgColor p-4 pt-2 pb-2">
                        <div className="row">
                          <div className="col-md-6">
                            <h6 className="font-weight-bolder mb-0 pt-2">
                              Invoice / Edit Form
                            </h6>
                          </div>
                        </div>
                      </div>
                      <div className="formCreate ">
                        <form action="">
                          <div className="row formEan">
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
                            <div className="col-lg-4 form-group mb-3 quotationSelectSer">
                              <div className="parentPurchaseView">
                                <div className="me-3">
                                  <strong>Client :</strong>
                                </div>
                                <div>
                                  <p>
                                    {clients?.find(
                                      (client) =>
                                        client.client_id === state.client_id
                                    )?.client_name || "None selected"}
                                  </p>
                                </div>
                              </div>
                              <div className="parentPurchaseView">
                                <div className="me-3">
                                  <strong>Consignee :</strong>
                                </div>
                                <div>
                                  <p>
                                    {" "}
                                    {consigneesNew?.find(
                                      (v) =>
                                        v.consignee_id ===
                                        computedState.consignee_id
                                    )?.consignee_name || "None selected"}
                                  </p>
                                </div>
                              </div>
                              <div className="parentPurchaseView">
                                <div className="me-3">
                                  <strong>Brand :</strong>
                                </div>
                                <div>
                                  <p>
                                    {" "}
                                    {brands?.find(
                                      (brand) =>
                                        brand.ID === computedState.brand_id
                                    )?.Name_EN || "None selected"}
                                  </p>
                                </div>
                              </div>
                              <div className="parentPurchaseView">
                                <div className="me-3">
                                  <strong>Port of Destination :</strong>
                                </div>
                                <div>
                                  <p>
                                    {ports?.find(
                                      (port) =>
                                        port.port_id ===
                                        computedState.destination_port_id
                                    )?.port_name || "None selected"}
                                  </p>
                                </div>
                              </div>
                              <div className="parentPurchaseView">
                                <div className="me-3">
                                  <strong>Currency :</strong>
                                </div>
                                <div>
                                  <p>
                                    {currency?.find(
                                      (c) => c.ID === computedState.fx_id
                                    )?.FX || "None selected"}
                                  </p>
                                </div>
                              </div>
                              <div className="parentPurchaseView">
                                <div className="me-3">
                                  <strong>EX Rate :</strong>
                                </div>
                                <div>
                                  <p>{computedState.fx_rate}</p>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-4 form-group mb-3 quotationSelectSer">
                              <div className="parentPurchaseView">
                                <div className="me-3">
                                  <strong>Loading Date :</strong>
                                </div>
                                <div>
                                  <p>
                                    {computedState.load_date
                                      ? new Date(
                                          computedState.load_date
                                        ).toLocaleDateString("en-GB")
                                      : "Not selected"}
                                  </p>
                                </div>
                              </div>
                              <div className="parentPurchaseView">
                                <div className="me-3">
                                  <strong>Loading Location :</strong>
                                </div>
                                <div>
                                  <p>
                                    {locations?.find(
                                      (loc) =>
                                        loc.id ===
                                        computedState.loading_location
                                    )?.name || "None selected"}
                                  </p>
                                </div>
                              </div>
                              <div className="parentPurchaseView">
                                <div className="me-3">
                                  <strong>Port of Origin :</strong>
                                </div>
                                <div>
                                  <p>
                                    {ports?.find(
                                      (port) =>
                                        port.port_id ===
                                        computedState.from_port_
                                    )?.port_name || "None selected"}
                                  </p>
                                </div>
                              </div>
                              <div className="parentPurchaseView">
                                <div className="me-3">
                                  <strong>Airline :</strong>
                                </div>
                                <div>
                                  <p>
                                    {liners?.find(
                                      (liner) =>
                                        liner.liner_id ===
                                        computedState.liner_id
                                    )?.liner_name || "None selected"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-4 form-group mb-3 quotationSelectSer">
                              <div className="parentPurchaseView">
                                <div className="me-3">
                                  <strong>Transportation :</strong>
                                </div>
                                <div>
                                  <p>
                                    {transport?.find(
                                      (provider) =>
                                        provider.Transportation_provider ===
                                        computedState.Transportation_provider
                                    )?.name || "None selected"}
                                  </p>
                                </div>
                              </div>

                              <div className="parentPurchaseView">
                                <div className="me-3">
                                  <strong>Clearance :</strong>
                                </div>
                                <div>
                                  <p>
                                    {" "}
                                    {clearance?.find(
                                      (provider) =>
                                        provider.Clearance_provider ===
                                        computedState.Clearance_provider
                                    )?.name || "None selected"}
                                  </p>
                                </div>
                              </div>
                              <div className="parentPurchaseView">
                                <div className="me-3">
                                  <strong>Freight Provider :</strong>
                                </div>
                                <div>
                                  <p>
                                    {" "}
                                    {freights?.find(
                                      (provider) =>
                                        provider.Freight_provider ===
                                        computedState.Freight_provider_
                                    )?.name || "None selected"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-2 form-group  ">
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
                            <div className="col-lg-2 form-group">
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
                                  {/* <input
                                               type="number"
                                               defaultValue={
                                                 consigneeNew1
                                                   ? consigneeNew1
                                                   : computedState.rebate
                                               }
                                               value={computedState.rebate}
                                               onChange={handleChange}
                                               name="rebate"
                                             /> */}
                                </div>
                                <div className="shipPercent">
                                  <span>%</span>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-8">
                              <div className="IncludeClaim">
                                <div>
                                  <h6>Include Claim</h6>
                                  <div className="flex gap-2 items-center">
                                    <label
                                      className="toggleSwitch large"
                                      onclick=""
                                    >
                                      <input
                                        type="checkbox"
                                        name="Include_claims"
                                        checked={exchangeRate5 == 1}
                                        onChange={handleAgreedPricingChange8}
                                      />
                                      <span>
                                        <span>OFF</span>
                                        <span>ON</span>
                                      </span>
                                      <a></a>
                                    </label>
                                  </div>
                                </div>
                                <div>
                                  <h6>Charge Volume</h6>
                                  <div className="flex gap-2 items-center">
                                    <label
                                      className="toggleSwitch large"
                                      onclick=""
                                    >
                                      <input
                                        type="checkbox"
                                        name="Charge_Volume"
                                        checked={exchangeRate1 == 1}
                                        onChange={handleAgreedPricingChange4}
                                      />
                                      <span>
                                        <span>OFF</span>
                                        <span>ON</span>
                                      </span>
                                      <a></a>
                                    </label>
                                  </div>
                                </div>
                                <div>
                                  <h6>Palletized</h6>
                                  <div className="flex gap-2 items-center">
                                    <label className="toggleSwitch large">
                                      <input
                                        type="checkbox"
                                        name="palletized"
                                        checked={exchangeRate2 == 1}
                                        onChange={handleAgreedPricingChange5}
                                      />
                                      <span>
                                        <span>OFF</span>
                                        <span>ON</span>
                                      </span>
                                      <a></a>
                                    </label>
                                  </div>
                                </div>
                                <div>
                                  <h6>CO from Chamber</h6>
                                  <div className="flex gap-2 items-center">
                                    <label className="toggleSwitch large">
                                      <input
                                        type="checkbox"
                                        name="Chamber"
                                        checked={exchangeRate3 == 1}
                                        onChange={handleAgreedPricingChange6}
                                      />
                                      <span>
                                        <span>OFF</span>
                                        <span>ON</span>
                                      </span>
                                      <a></a>
                                    </label>
                                  </div>
                                </div>
                                <div>
                                  <h6>Precooling</h6>
                                  <div className="flex gap-2 items-center">
                                    <label className="toggleSwitch large">
                                      <input
                                        type="checkbox"
                                        name="PreCooling"
                                        checked={exchangeRate4 == 1}
                                        onChange={handleAgreedPricingChange7}
                                      />
                                      <span>
                                        <span>OFF</span>
                                        <span>ON</span>
                                      </span>
                                      <a></a>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row mt-4 mb-3">
                            <div className="col-lg-12 ">
                              <div className="addBtnEan calculateInvoice justify-content-between">
                                <div className="d-flex">
                                  <div>
                                    <button
                                      type="button"
                                      onClick={calculated}
                                      className="me-2"
                                    >
                                      Calculate
                                    </button>
                                  </div>
                                  <div>
                                    <button
                                      type="button"
                                      className="me-2"
                                      onClick={handleSubmit1}
                                    >
                                      Use Invoice Price
                                    </button>
                                  </div>
                                  <div>
                                    <button
                                      type="button"
                                      className="me-2"
                                      onClick={handleSubmit2}
                                    >
                                      Agreed Price
                                    </button>
                                  </div>
                                  <div>
                                    <button
                                      type="button"
                                      className="me-2"
                                      onClick={reduceRebate}
                                    >
                                      Reduce Rebate
                                    </button>
                                  </div>
                                  <div className="me-3">
                                    <button
                                      type="button"
                                      onClick={recordRebate}
                                    >
                                      Record Rebate
                                    </button>
                                  </div>
                                  <div>
                                    <button
                                      type="button"
                                      className="  me-2"
                                      data-bs-toggle="modal"
                                      data-bs-target="#exampleModal"
                                    >
                                      Round Price
                                    </button>

                                    {/* Button trigger modal */}

                                    {/* Modal */}
                                    <div
                                      className="modal fade"
                                      id="exampleModal"
                                      tabIndex={-1}
                                      aria-labelledby="exampleModalLabel"
                                      aria-hidden="true"
                                    >
                                      <div className="modal-dialog modalShipTo">
                                        <div className="modal-content">
                                          <div className="modal-header">
                                            <h1
                                              className="modal-title fs-5"
                                              id="exampleModalLabel"
                                            >
                                              Price Rounding
                                            </h1>
                                            <button
                                              type="button"
                                              className="btn-close"
                                              data-bs-dismiss="modal"
                                              aria-label="Close"
                                              onClick={() =>
                                                setState5({
                                                  Rounding: "",
                                                })
                                              }
                                            >
                                              <i className="mdi mdi-close"></i>
                                            </button>
                                          </div>
                                          <div className="modal-body">
                                            <div className="col-lg-12 form-group autoComplete">
                                              <h6>Rounding</h6>
                                              <Autocomplete
                                                options={RoundingDataList || []}
                                                getOptionLabel={(option) =>
                                                  option?.DropDown || ""
                                                }
                                                value={
                                                  (RoundingDataList || []).find(
                                                    (item) =>
                                                      item.ID ===
                                                      state5?.Rounding
                                                  ) || null
                                                }
                                                isOptionEqualToValue={(
                                                  option,
                                                  value
                                                ) => option.ID === value.ID}
                                                onChange={(event, newValue) => {
                                                  handleChange5({
                                                    target: {
                                                      name: "Rounding",
                                                      value: newValue?.ID || "",
                                                    },
                                                  });
                                                }}
                                                renderInput={(params) => (
                                                  <TextField
                                                    {...params}
                                                    placeholder="Select Rounding"
                                                    variant="outlined"
                                                  />
                                                )}
                                              />
                                            </div>
                                          </div>
                                          <div className="modal-footer">
                                            <button
                                              type="button"
                                              className="btn btn-primary"
                                              onClick={handleSubmit}
                                            >
                                              Submit
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {!isReadOnly && (
                                    <div className="addBtnEan flex flex-wrap gap-3 items-center mb-4">
                                      {/* <button
                            type="button"
                            className=""
                            onClick={() => calculate1(false)}
                          >
                            Calculate
                          </button> */}

                                      {/* {!isError && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (!computedState.load_date) {
                                              // Show error modal if load_date is not present
                                              setShow1(true); // assuming `show1` is controlled by `setShow1`
                                            } else {
                                              // Proceed to open the main modal if validation passes
                                              setSelectedDetails(null);
                                              setToEditDetails({});
                                              openModal();
                                            }
                                          }}
                                        >
                                          Add
                                        </button>
                                      )} */}
                                      {/* <button
                                        className="me-3"
                                        type="button"
                                        onClick={() => {
                                          if (!computedState.load_date) {
                                            setShow1(true); // Show error modal
                                          } else {
                                            const modal = new bootstrap.Modal(
                                              document.getElementById(
                                                "consigneeOne"
                                              )
                                            );
                                            modal.show(); // Manually open the modal if validation passes
                                          }
                                        }}
                                      >
                                        Add Consignee Items
                                      </button> */}
                                      {/* <div
                                        className="modal fade"
                                        id="consigneeOne"
                                        tabIndex={-1}
                                        aria-labelledby="exampleModalLabel"
                                        aria-hidden="true"
                                      >
                                        <div className="modal-dialog modalShipTo ">
                                          <div className="modal-content">
                                            <div className="modal-header">
                                              <h1
                                                className="modal-title fs-5"
                                                id="exampleModalLabel"
                                              >
                                                Order Populate
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
                                              <label htmlFor="">
                                                Order Net Weight
                                              </label>
                                              <input
                                                type="number"
                                                value={orderNetWeight}
                                                onChange={(e) =>
                                                  setOrderNetWeight(
                                                    e.target.value
                                                  )
                                                }
                                                className="form-control"
                                              />
                                            </div>
                                            <div className="modal-footer justify-content-right">
                                              <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={
                                                  handleSaveOrderPopulate
                                                }
                                              >
                                                Save
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div> */}
                                    </div>
                                  )}
                                  {/* {isError && (
                                    <div className="my-4 text-red-500">
                                      <i className="mdi mdi-alert" /> Please
                                      adjust Select ITF to complete a box
                                    </div>
                                  )}
                                </div>
                                <div className="addBtnEan mb-4">
                                  <button
                                    type="button"
                                    onClick={() => calculate(true)}
                                  >
                                    Recalculate
                                  </button> */}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div
                            id="datatable_wrapper"
                            className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive mt-"
                          >
                            <table
                              id="example"
                              className="tableEditInv display transPortCreate table table-hover table-striped borderTerpProduce table-responsive"
                              style={{ width: "100%" }}
                            >
                              {details?.section5_Labels2 && (
                                <thead>
                                  <tr>
                                    {Object.entries(
                                      details.section5_Labels2
                                    ).map(([key, label]) => {
                                      if (
                                        key === "Profit" &&
                                        ((localStorage.getItem("level") ===
                                          "Level 1" &&
                                          localStorage.getItem("role") ===
                                            "Admin") ||
                                          localStorage.getItem("level") ===
                                            "Level 5")
                                      ) {
                                        return null;
                                      }

                                      return <th key={key}>{label}</th>;
                                    })}
                                  </tr>
                                </thead>
                              )}

                              <tbody>
                                {details?.section5_Values?.map((v, i) => {
                                  const isRed = +v.Box % 1 !== 0;

                                  return (
                                    <tr
                                      key={i}
                                      className={[
                                        "rowCursorPointer",
                                        isRed
                                          ? "bg-red-500/50 [&>td]:!text-red-900"
                                          : "",
                                      ].join(" ")}
                                    >
                                      {Object.keys(
                                        details.section5_Labels2 || {}
                                      ).map((key) => {
                                        // Skip "Profit" column conditionally
                                        if (
                                          key === "Profit" &&
                                          ((localStorage.getItem("level") ===
                                            "Level 1" &&
                                            localStorage.getItem("role") ===
                                              "Admin") ||
                                            localStorage.getItem("level") ===
                                              "Level 5")
                                        ) {
                                          return null;
                                        }

                                        // Map API keys to value field names
                                        const valueMap = {
                                          Item: "ITF_Name",
                                          Brand: "Brand_name",
                                          Quantity: "QTY",
                                          Unit: "Unit_Name",
                                          boxes: "Box",
                                          "Net Weight": "NW",
                                          "Order Price": "Order_Price",
                                          "Calculated Price":
                                            "Calculated_Price",
                                          "Adjust Price": "Adjusted_Price",
                                          Price: "Adjusted_Price",
                                          Profit: "Profit_Percentage",
                                        };

                                        const field = valueMap[key] || key;
                                        const rawValue = v[field];

                                        // Render editable Unit column
                                        if (key === "Unit") {
                                          return (
                                            <td
                                              key={key}
                                              className="text-center"
                                            >
                                              <div className="selectInvoiceView selectEdit d-flex justify-content-center">
                                                {editUnit === v.OD_ID ? (
                                                  <select
                                                    className="mb-0"
                                                    name="unit_id"
                                                    value={
                                                      String(
                                                        unitPrices[v.OD_ID] ??
                                                          v.Unit ??
                                                          ""
                                                      ) // <-- fallback correctly
                                                    }
                                                    onChange={(e) =>
                                                      handleEditEan(e, v.OD_ID)
                                                    }
                                                  >
                                                    {unit
                                                      ?.slice(0, 4)
                                                      ?.map((unit) => (
                                                        <option
                                                          key={unit.ID}
                                                          value={String(
                                                            unit.ID
                                                          )}
                                                        >
                                                          {unit.Name_EN}
                                                        </option>
                                                      ))}
                                                  </select>
                                                ) : (
                                                  <p>
                                                    {unit?.find(
                                                      (u) =>
                                                        String(u.ID) ===
                                                        String(
                                                          unitPrices[v.OD_ID] ??
                                                            v.Unit
                                                        )
                                                    )?.Name_EN || ""}
                                                  </p>
                                                )}

                                                {editUnit === v.OD_ID ? (
                                                  <i
                                                    onClick={updateUnit}
                                                    className="mdi mdi-check ms-3"
                                                    style={{
                                                      fontSize: "20px",
                                                      color: "#203764",
                                                    }}
                                                  ></i>
                                                ) : (
                                                  <i
                                                    onClick={() =>
                                                      showUnit(v.OD_ID)
                                                    }
                                                    className="mdi mdi-pencil ms-3"
                                                  ></i>
                                                )}
                                              </div>
                                            </td>
                                          );
                                        }

                                        // Render editable Adjusted Price column
                                        if (
                                          key === "Adjust Price" ||
                                          key === "Price"
                                        ) {
                                          return (
                                            <td key={key} className="text-end">
                                              <div className="selectInvoiceView eanReq d-flex justify-content-end">
                                                {editAdjust === v.OD_ID ? (
                                                  <input
                                                    type="number"
                                                    placeholder="123"
                                                    className="mb-0"
                                                    value={
                                                      adjustedPrices[v.OD_ID] ||
                                                      ""
                                                    }
                                                    onChange={(e) =>
                                                      handleAdjustedPriceChange(
                                                        e,
                                                        v.OD_ID
                                                      )
                                                    }
                                                  />
                                                ) : (
                                                  <p>
                                                    {twoDecimal.format(
                                                      adjustedPrices[v.OD_ID] ??
                                                        v.Adjusted_Price
                                                    ) || ""}
                                                  </p>
                                                )}

                                                {editAdjust === v.OD_ID ? (
                                                  <div>
                                                    <i
                                                      onClick={updateAdjust}
                                                      className="mdi mdi-check ms-3"
                                                      style={{
                                                        fontSize: "20px",
                                                        color: "#203764",
                                                      }}
                                                    ></i>
                                                    <span
                                                      onClick={() =>
                                                        resetAdjust(v.OD_ID)
                                                      }
                                                      className="mdi mdi-close"
                                                    ></span>
                                                  </div>
                                                ) : (
                                                  <i
                                                    onClick={() =>
                                                      showAdjust(v.OD_ID)
                                                    }
                                                    className="mdi mdi-pencil ms-3"
                                                  ></i>
                                                )}
                                              </div>
                                            </td>
                                          );
                                        }

                                        // Render all other fields with formatting
                                        const formattedValue = (() => {
                                          if (["QTY", "NW"].includes(field))
                                            return threeDecimal.format(
                                              rawValue
                                            );
                                          if (field === "Box")
                                            return NoDecimal.format(rawValue);
                                          if (
                                            [
                                              "Order_Price",
                                              "Calculated_Price",
                                            ].includes(field)
                                          )
                                            return twoDecimal.format(rawValue);
                                          if (field === "Profit_Percentage")
                                            return `${rawValue}%`;
                                          return rawValue;
                                        })();

                                        return (
                                          <td key={key} className="text-end">
                                            {formattedValue}
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>

                          {/* <div className="row py-4 px-4">
                            <div className="col-lg-3">
                              <div>
                                <b> Total NW : </b>
                                {(+newdata?.NW || 0).toLocaleString()}
                              </div>
                              <div>
                                <b> Total GW : </b>
                                {(+newdata?.GW || 0).toLocaleString()}
                              </div>
                              <div>
                                <b> Total Box : </b>
                                {(+newdata?.Box || 0).toLocaleString()}
                              </div>
                              <div>
                                <b> Total CBM : </b>
                                {(+newdata?.CBM || 0).toLocaleString()}
                              </div>
                              <div>
                                <b> Total ITF : </b>
                                {(+newdata?.Items || 0).toLocaleString()}
                              </div>
                            </div>
                            <div className="col-lg-3">
                              <div>
                                <b>Transport : </b>
                                {(+newdata?.Transport || 0).toLocaleString()}
                              </div>
                              <div>
                                <b>Clearance : </b>
                                {(+newdata?.Clearance || 0).toLocaleString()}
                              </div>
                              {localStorage.getItem("level") !== "Level 5" && (
                                <div>
                                  <b>Extra : </b>
                                  {(+newdata?.Extra || 0).toLocaleString()}
                                </div>
                              )}
                              <div>
                                <b>Commission : </b>

                                {(
                                  +newdata?.Commision_THB || 0
                                ).toLocaleString()}
                              </div>
                              <div>
                                <b>Rebate : </b>
                                {(+newdata?.Rebate_THB || 0).toLocaleString()}
                              </div>
                            </div>
                            <div className="col-lg-3">
                              <div>
                                <b> Total FOB : </b>
                                {(+newdata?.FOB || 0).toLocaleString()}
                              </div>
                              <div>
                                <b>Freight : </b>
                                {(+newdata?.Freight || 0).toLocaleString()}
                              </div>
                              <div>
                                <b> Total CNF : </b>
                                {(+newdata?.CNF || 0).toLocaleString()}
                              </div>
                              {!(
                                (localStorage.getItem("level") === "Level 1" &&
                                  localStorage.getItem("role") === "Admin") ||
                                localStorage.getItem("level") === "Level 5"
                              ) && (
                                <div className="">
                                  <b> Total Profit : </b>
                                  {(+newdata?.Profit || 0).toLocaleString()}
                                </div>
                              )}
                              {localStorage.getItem("level") !== "Level 5" && (
                                <div style={{ marginLeft: "2px" }}>
                                  <b> Profit % : </b>
                                  {(
                                    +newdata?.Profit_Percentage || 0
                                  ).toLocaleString()}
                                </div>
                              )}
                            </div>
                            <div className="col-lg-3">
                              <div>
                                <b> Total CNF FX : </b>
                                {(+newdata?.CNF_FX || 0).toLocaleString()}
                              </div>
                              <div>
                                <div>
                                  <b> Total Commission FX: </b>
                                  {(
                                    +newdata?.Commission_FX || 0
                                  ).toLocaleString()}
                                </div>
                                <div>
                                  <b> Total Rebate FX : </b>
                                  {(+newdata?.Rebate_FX || 0).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div> */}
                          {details?.section6_Labels && (
                            <div className="row py-4 px-4">
                              <div className="col-lg-3">
                                <div>
                                  <b>
                                    {details?.section6_Labels?.[
                                      "Total Net Weight :"
                                    ] || "Total Net Weight :"}
                                  </b>
                                  {(
                                    +details?.section6_Values?.Row1 || 0
                                  ).toLocaleString()}
                                </div>
                                <div className="">
                                  <b>
                                    {details?.section6_Labels?.[
                                      "Total Gross Weight :"
                                    ] || "Total Gross Weight :"}
                                  </b>

                                  {(
                                    +details?.section6_Values?.Row2 || 0
                                  ).toLocaleString()}
                                </div>
                                <div className="">
                                  <b>
                                    {details?.section6_Labels?.[
                                      "Total Box :"
                                    ] || "Total Box :"}
                                  </b>
                                  {(
                                    +details?.section6_Values?.Row3 || 0
                                  ).toLocaleString()}
                                </div>

                                <div className="">
                                  <b>
                                    {details?.section6_Labels?.[
                                      "Total Volume :"
                                    ] || "Total Volume :"}
                                  </b>
                                  {(
                                    +details?.section6_Values?.Row4 || 0
                                  ).toLocaleString()}
                                </div>

                                <b>
                                  {details?.section6_Labels?.[
                                    "Total Items :"
                                  ] || "Total Items :"}
                                </b>
                                {(
                                  +details?.section6_Values?.Row5 || 0
                                ).toLocaleString()}
                              </div>

                              <div className="col-lg-3">
                                <div>
                                  <b>
                                    {details?.section7_Labels?.["Freight :"] ||
                                      "Freight :"}
                                  </b>
                                  {(
                                    +details?.section7_Values?.Row1 || 0
                                  ).toLocaleString()}
                                </div>
                                <div className="">
                                  <b>
                                    {details?.section7_Labels?.[
                                      "Transport :"
                                    ] || "Transport :"}
                                  </b>

                                  {(
                                    +details?.section7_Values?.Row2 || 0
                                  ).toLocaleString()}
                                </div>
                                <div className="">
                                  <b>
                                    {details?.section7_Labels?.[
                                      "Clearance :"
                                    ] || "Clearance :"}
                                  </b>
                                  {(
                                    +details?.section7_Values?.Row3 || 0
                                  ).toLocaleString()}
                                </div>

                                <div className="">
                                  <b>
                                    {details?.section7_Labels?.["Extra :"] ||
                                      "Extra :"}
                                  </b>
                                  {(
                                    +details?.section7_Values?.Row4 || 0
                                  ).toLocaleString()}
                                </div>
                                <div className="">
                                  <b>
                                    {details?.section7_Labels?.[
                                      "Pre Cooling"
                                    ] || "Pre Cooling"}
                                  </b>
                                  {(
                                    +details?.section7_Values?.Row5 || 0
                                  ).toLocaleString()}
                                </div>
                                {/* <b>
                          {details?.section7_Labels?.[""] ||
                            ""}
                        </b>
                        {(+details?.section7_Values?.Row5 || 0).toLocaleString()} */}
                              </div>
                              <div className="col-lg-3">
                                <div>
                                  <b>
                                    {details?.section8_Labels?.[
                                      "Total CNF :"
                                    ] || "Total CNF :"}
                                  </b>
                                  {(
                                    +details?.section8_Values?.Row1 || 0
                                  ).toLocaleString()}
                                </div>
                                <div className="">
                                  <b>
                                    {details?.section8_Labels?.[
                                      "Total FOB :"
                                    ] || "Total FOB :"}
                                  </b>

                                  {(
                                    +details?.section8_Values?.Row2 || 0
                                  ).toLocaleString()}
                                </div>
                                <div className="">
                                  <b>
                                    {details?.section8_Labels?.[
                                      "Total Commission :"
                                    ] || "Total Commission :"}
                                    {(
                                      +details?.section8_Values?.Row3 || 0
                                    ).toLocaleString()}
                                  </b>
                                </div>

                                <div className="">
                                  <b>
                                    {details?.section8_Labels?.[
                                      "Total Rebate :"
                                    ] || "Total Rebate :"}
                                  </b>
                                  {(
                                    +details?.section8_Values?.Row4 || 0
                                  ).toLocaleString()}
                                </div>
                                <div className="">
                                  <b>
                                    {details?.section8_Labels?.["Row5"] ||
                                      "Row5"}
                                  </b>
                                  {(
                                    +details?.section8_Values?.Row5 || 0
                                  ).toLocaleString()}
                                </div>

                                {/* <b>
                          {details?.section8_Labels?.[""] ||
                            ""}
                        </b>
                        {(+details?.section8_Values?.Row5 ).toLocaleString()}
                      */}
                              </div>

                              <div className="col-lg-3">
                                <div>
                                  <b>
                                    {details?.section9_Labels?.["Profit :"] ||
                                      "Profit :"}
                                  </b>
                                  {(
                                    +details?.section9_Values?.Row1 || 0
                                  ).toLocaleString()}
                                </div>
                                <div className="">
                                  <b>
                                    {details?.section9_Labels?.["Profit % :"] ||
                                      "Profit % :"}
                                  </b>

                                  {(
                                    +details?.section9_Values?.Row2 || 0
                                  ).toLocaleString()}
                                </div>
                                <div className="">
                                  <b>
                                    {details?.section9_Labels?.["Row3"] ||
                                      "Row3"}
                                  </b>

                                  {(
                                    +details?.section9_Values?.Row4 || 0
                                  ).toLocaleString()}
                                </div>
                                <div className="">
                                  <b>
                                    {details?.section9_Labels?.["Row4"] ||
                                      "Row4"}
                                  </b>

                                  {(
                                    +details?.section9_Values?.Row4 || 0
                                  ).toLocaleString()}
                                </div>
                                <div className="">
                                  <b>
                                    {details?.section9_Labels?.["Row5"] ||
                                      "Row5"}
                                  </b>

                                  {(
                                    +details?.section9_Values?.Row5 || 0
                                  ).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          )}
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <button className="btn btn-danger" onClick={closeFunction}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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

                  <Autocomplete
                    disablePortal
                    options={
                      brandNew?.map((v) => ({
                        id: v.ID,
                        name: v.Name_EN,
                      })) || []
                    }
                    getOptionLabel={(option) => `${option.name}` || ""}
                    value={
                      brandNew
                        ?.map((v) => ({
                          id: v.ID,
                          name: v.Name_EN,
                        }))
                        .find(
                          (item) =>
                            item?.id ===
                            (toEditDetails?.brand_id ||
                              defaultDetailsValue?.OD_Brand)
                        ) || null
                    }
                    onChange={(event, newValue) => {
                      setToEditDetails((prev) => ({
                        ...prev,
                        brand_id: newValue ? newValue.id : null,
                        brand_name: newValue ? newValue.name : null,
                      }));
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value?.id
                    }
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Select Brand"
                      />
                    )}
                  />
                </div>
                <div className="form-group mb-3 quotationSelectSer">
                  <label>Unit</label>

                  <Autocomplete
                    disablePortal
                    options={
                      unit?.map((v) => ({
                        id: v.ID,
                        name: v.Name_EN,
                      })) || []
                    }
                    getOptionLabel={(option) => option?.name || ""}
                    value={
                      (unit || [])
                        .map((v) => ({
                          id: v.ID,
                          name: v.Name_EN,
                        }))
                        .find(
                          (item) =>
                            item.id ===
                            (toEditDetails?.itf_unit ||
                              defaultDetailsValue?.OD_Unit)
                        ) || null
                    }
                    onChange={(event, newValue) => {
                      setToEditDetails((prev) => ({
                        ...prev,
                        itf_unit: newValue?.id || null,
                        unit_name_en: newValue?.name || null,
                      }));
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value?.id
                    }
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Select Unit"
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
                      defaultDetailsValue?.OD_Adjusted_Price ??
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
                    {/* <table>
                      <thead>
                        <tr>
                          <th>ITF</th>
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
                        {Array.isArray(calculateListData) &&
                          calculateListData.map((item, index) => (
                            <tr key={index}>
                              <td>{item.ITF}</td>
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
                      <tbody></tbody>
                    </table> */}
                    <table>
                      <thead>
                        <tr>
                          {Object.values(calculateListData?.header || {}).map(
                            (label, index) => (
                              <th key={index}>{label}</th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {calculateListData?.data?.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {Object.keys(calculateListData?.header || {}).map(
                              (_, colIndex) => {
                                const colKey = `COL${colIndex + 1}`;
                                return (
                                  <td key={colKey}>{row[colKey] ?? ""}</td>
                                );
                              }
                            )}
                          </tr>
                        ))}
                      </tbody>
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
    </div>
  );
};

export default InvoiceEdit2;
