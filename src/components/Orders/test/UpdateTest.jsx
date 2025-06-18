import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import MySwal from "../../../swal";
// import "./CreateOrder.css";
import "../../Orders/order/CreateOrder.css";
import { ComboBox } from "../../combobox";
import { Button, Modal } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Select, { components } from "react-select";
import { FaCaretDown } from "react-icons/fa"; // Import an icon from react-icon
import { set } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

const UpdateTest = () => {
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

  console.log(state);
  const handleChange = (event) => {
    if (isReadOnly || isLoading) return;
    const { name, value } = event.target;
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
        fx_rate_manually_set:
          name === "fx_rate" ? true : prevState.fx_rate_manually_set,
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
      .get(`${API_BASE_URL}/NewgetOrdersById`, {
        params: {
          order_id: from?.Order_ID,
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
          setExchangeRate4(newData.Precooling || 0);
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

  useEffect(() => {
    if (state.order_id) grossTransspotationErr();
    orderCrossFreight();
  }, [state.order_id]);
  const computedState = useMemo(() => {
    console.log(consigneesNew);
    const quoteFind = quote?.find((v) => v.quote_id == state.quote_id);
    const r = {
      ...state,
      consignee_id: state.consignee_id || quoteFind?.consignee_id,
      client_id: state.client_id || quoteFind?.client_id,
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
    r.fx_id = r.fx_id || consigneeFind?.currency || quoteFind?.fx_id;
    r.O_Extra = r.O_Extra || consigneeFind?.Extra_cost || quoteFind?.O_Extra;
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

    r.rebate = r.rebate || consigneeFind?.O_Rebate || quoteFind?.rebate;
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
    r.mark_up = r.mark_up || consigneeFind?.O_Markup || quoteFind?.profit;
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
  const { data: details, refetch: getOrdersDetails } = useQuery(
    `NewgetOrdersDetails?id=${state.order_id}`,
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
  const newItfList1 = async () => {
    if (state.consignee_id) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/OrderMarkupandRebate`,
          {
            Consignee_ID: state.consignee_id,
          }
        );
        console.log(response.data);
        setConsigneeNew(response.data.Consignee_Order_Markup);
        setConsigneeNew1(response.data.Consignee_Rebate);
        setConsigneeNew2(response.data.Consignee_Quotation_Markup);
      } catch (e) {
        console.log("Error:", e);
      }
    }
  };
  const grossTransspotationErr = async () => {
    // if (state.order_id) {
    //   try {
    //     const response = await axios.post(
    //       `${API_BASE_URL}/OrderGrossTransportError`,
    //       { order_id: state.order_id }
    //     );
    //     console.log(response);
    //     if (response.data.success == true) {
    //       setGross(true);
    //       setGrossMass(response.data.message);
    //     }
    //     toast.success(response);
    //   } catch (e) {
    //     console.error("Something went wrong", e);
    //   }
    // }
  };

  const calculateList = async () => {
    if (state.order_id) {
      try {
        const response = await axios.post(`${API_BASE_URL}/NewOrderCostModal`, {
          order_id: state.order_id,
        });
        console.log(response);

        setCalculateListData(response.data);
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
    newItfList1();
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
    return axios.post(`${API_BASE_URL}/updateAllOrderStatuses`, {
      id,
      field,
      value,
    });
  };
  const orderCrossFreight = async () => {
    // if (state.order_id) {
    //   try {
    //     const response = await axios.post(
    //       `${API_BASE_URL}/OrderGrossFreightError`,
    //       { order_id: state.order_id }
    //     );
    //     console.log(response); // Log the response to the console
    //     if (response.data.success == true) {
    //       setFreight(true);
    //       setFreightMass(response.data.message);
    //     }
    //   } catch (e) {
    //     console.error("Something went wrong", e); // Log the error to the console
    //   }
    // }
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

        navigate("/test");
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
        navigate("/test");
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

          Charge_Volume: exchangeRate1 ? 1 : 0,
          is_quotation: 0,
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
  }, [computedState.client_id]);

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
                          }
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
                          options={consigneesNew || []} // Ensure consignees is an array
                          getOptionLabel={(option) =>
                            option.consignee_name || ""
                          } // Display the consignee name
                          value={
                            consigneesNew?.find(
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
                              consignee_name: newValue
                                ? newValue.consignee_name
                                : "",
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
                        {/* <Autocomplete
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
                        /> */}
                        <Autocomplete
                          options={
                            brands?.map((v) => ({
                              id: v.ID,
                              name: v.Name_EN,
                            })) || []
                          }
                          sx={{ width: 300 }}
                          getOptionLabel={(option) => option?.name || ""}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value?.id
                          }
                          value={
                            computedState.brand_id
                              ? brands
                                  ?.map((v) => ({
                                    id: v.ID,
                                    name: v.Name_EN,
                                  }))
                                  .find(
                                    (brand) =>
                                      brand.id === computedState.brand_id
                                  ) || null
                              : null
                          }
                          onChange={(event, value) => {
                            setState({ ...state, brand_id: value?.id || null });
                          }}
                          renderInput={(params) => (
                            <TextField {...params} placeholder="Select brand" />
                          )}
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>Currency</h6>
                        {/* <Autocomplete
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
                        /> */}
                        <Autocomplete
                          options={
                            currency?.map((v) => ({
                              id: v.ID,
                              name: v.FX,
                            })) || []
                          }
                          sx={{ width: 300 }}
                          getOptionLabel={(option) => option?.name || ""}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value?.id
                          }
                          value={
                            computedState.fx_id
                              ? currency
                                  ?.map((v) => ({
                                    id: v.ID,
                                    name: v.FX,
                                  }))
                                  .find(
                                    (cur) => cur.id === computedState.fx_id
                                  ) || null
                              : null
                          }
                          onChange={(event, value) => {
                            const selectedFxRate =
                              currency.find((c) => c.ID === value?.id)
                                ?.fx_rate || 0;
                            setState({
                              ...state,
                              fx_id: value?.id || null,
                              fx_rate: selectedFxRate, // update fx_rate with selected currency's rate
                            });
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
                            {/* <input
                              type="number"
                              defaultValue={
                                consigneeNew
                                  ? consigneeNew
                                  : computedState.mark_up
                              }
                              value={computedState.mark_up}
                              onChange={handleChange}
                              name="mark_up"
                            /> */}
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
                      <div className="col-lg-2 form-group">
                        <h6>Charge Volume</h6>
                        <div className="flex gap-2 items-center">
                          <label className="toggleSwitch large" onclick="">
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
                      <div className="col-lg-2 form-group">
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
                      <div className="col-lg-2 form-group">
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
                      <div className="col-lg-2 form-group">
                        <h6>Precooling</h6>
                        <div className="flex gap-2 items-center">
                          <label className="toggleSwitch large">
                            <input
                              type="checkbox"
                              name="PreColling"
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
                      <div className="col-lg-3 form-group">
                        <h6>Loading Date</h6>
                        {/* <input
                          type="date"
                          onChange={handleChange}
                          value={computedState.load_date}
                          name="load_date"
                        /> */}
                        <DatePicker
                          selected={
                            computedState.load_date
                              ? new Date(computedState.load_date)
                              : null
                          }
                          onChange={(date) =>
                            handleChange({
                              target: {
                                name: "load_date",
                                value: date,
                              },
                            })
                          }
                          name="load_date"
                          dateFormat="dd/MM/yyyy"
                          placeholderText="dd/MM/yyyy"
                          customInput={<CustomInput />} // Optional: only include if you have a custom input
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 items-center justify-between flex-wrap">
                      {!isReadOnly && (
                        <div className="addBtnEan flex flex-wrap gap-3 items-center mb-4">
                          <button
                            type="button"
                            className=""
                            onClick={() => calculate1(false)}
                          >
                            Calculate
                          </button>

                          {!isError && (
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
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              if (!computedState.load_date) {
                                setShow1(true); // Show error modal
                              } else {
                                const modal = new bootstrap.Modal(
                                  document.getElementById("consigneeOne")
                                );
                                modal.show(); // Manually open the modal if validation passes
                              }
                            }}
                          >
                            Add Consignee Items
                          </button>
                          <div
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
                                  <label htmlFor="">Order Net Weight</label>
                                  <input
                                    type="number"
                                    value={orderNetWeight}
                                    onChange={(e) =>
                                      setOrderNetWeight(e.target.value)
                                    }
                                    className="form-control"
                                  />
                                </div>
                                <div className="modal-footer justify-content-right">
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSaveOrderPopulate}
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {isError && (
                        <div className="my-4 text-red-500">
                          <i className="mdi mdi-alert" /> Please adjust Select
                          ITF to complete a box
                        </div>
                      )}
                      <div className="addBtnEan mb-4">
                        <button type="button" onClick={() => calculate(true)}>
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
                              <td>{twoDecimal.format(v.unit_price)}</td>
                              <td>
                                {v.OD_Adjusted_Price
                                  ? twoDecimal.format(v.OD_Adjusted_Price)
                                  : ""}
                              </td>
                              {!(
                                (localStorage.getItem("level") === "Level 1" &&
                                  localStorage.getItem("role") === "Admin") ||
                                localStorage.getItem("level") === "Level 5"
                              ) && <td>{v.OD_Profit_Percentage}%</td>}
                              <td>
                                {!isReadOnly && v.Order_Details_Edit_Status !== 0 && (
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
                        {/* <div>
                          <b> Total Item : </b>
                          {(+data?.O_NW || 0).toLocaleString()}
                        </div> */}
                        <div>
                          <b> Total NW : </b>
                          {(+newdata?.O_NW || 0).toLocaleString()}
                        </div>
                        <div>
                          <b> Total GW : </b>
                          {(+newdata?.O_GW || 0).toLocaleString()}
                        </div>
                        <div>
                          <b> Total Box : </b>
                          {(+newdata?.O_Box || 0).toLocaleString()}
                        </div>
                        <div>
                          <b> Total CBM : </b>
                          {(+newdata?.O_CBM || 0).toLocaleString()}
                        </div>
                        <div>
                          <b> Total ITF : </b>
                          {(+newdata?.O_Items || 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div>
                          <b>Transport : </b>
                          {(+newdata?.O_Transport || 0).toLocaleString()}
                        </div>
                        <div>
                          <b>Clearance : </b>
                          {(+newdata?.O_Clearance || 0).toLocaleString()}
                        </div>
                        {localStorage.getItem("level") !== "Level 5" && (
                          <div>
                            <b>Extra : </b>
                            {(+newdata?.O_Extra || 0).toLocaleString()}
                          </div>
                        )}
                        <div>
                          <b>Commission : </b>

                          {(+newdata?.O_Commision_THB || 0).toLocaleString()}
                        </div>
                        <div>
                          <b>Rebate : </b>
                          {(+newdata?.O_Rebate_THB || 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div>
                          <b> Total FOB : </b>
                          {(+newdata?.O_FOB || 0).toLocaleString()}
                        </div>
                        <div>
                          <b>Freight : </b>
                          {(+newdata?.O_Freight || 0).toLocaleString()}
                        </div>
                        <div>
                          <b> Total CNF : </b>
                          {(+newdata?.O_CNF || 0).toLocaleString()}
                        </div>
                        {!(
                          (localStorage.getItem("level") === "Level 1" &&
                            localStorage.getItem("role") === "Admin") ||
                          localStorage.getItem("level") === "Level 5"
                        ) && (
                          <div className="">
                            <b> Total Profit : </b>
                            {(+newdata?.O_Profit || 0).toLocaleString()}
                          </div>
                        )}
                        {localStorage.getItem("level") !== "Level 5" && (
                          <div style={{ marginLeft: "2px" }}>
                            <b> Profit % : </b>
                            {(
                              +newdata?.O_Profit_Percentage || 0
                            ).toLocaleString()}
                          </div>
                        )}
                      </div>
                      <div className="col-lg-3">
                        <div>
                          <b> Total CNF FX : </b>
                          {(+newdata?.O_CNF_FX || 0).toLocaleString()}
                        </div>
                        <div>
                          <div>
                            <b> Total Commission FX: </b>
                            {(+newdata?.O_Commission_FX || 0).toLocaleString()}
                          </div>
                          <div>
                            <b> Total Rebate FX : </b>
                            {(+newdata?.O_Rebate_FX || 0).toLocaleString()}
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
                  onClick={updateOrderTest}
                >
                  UPDATE AND CLOSE
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
                  {/* <Autocomplete
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
                  /> */}
                  {/* <Autocomplete
                    disablePortal
                    options={brandNew?.map((v) => ({
                      id: v.brand_id,
                      name: v.Brand_name,
                    }))}
                    getOptionLabel={(option) => `${option.name}` || ""} // Display both name and id
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
                    }
                    onChange={(event, newValue) => {
                      setToEditDetails((prev) => ({
                        ...prev,
                        brand_id: newValue ? newValue.id : null,
                        brand_name: newValue ? newValue.name : null, // Set brand_name in state as well
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
                  /> */}
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
                            item.id ===
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
                  {/* <Autocomplete
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
                  /> */}
                  {/* <Autocomplete
                    disablePortal
                    options={unit?.map((v) => ({
                      id: v.unit_id,
                      name: v.unit_name_en,
                    }))}
                    getOptionLabel={(option) => `${option.name} ` || ""} // Display both name and id
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
                    }
                    onChange={(event, newValue) => {
                      setToEditDetails((prev) => ({
                        ...prev,
                        itf_unit: newValue ? newValue.id : null, // Update unit_id
                        unit_name_en: newValue ? newValue.name : null, // Update unit_name_en
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
                  /> */}
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
                                const colKey = `COL${colIndex + 1}`; // Dynamically build COL1, COL2, ...
                                return (
                                  <td key={colKey}>{row[colKey] ?? ""}</td>
                                );
                              }
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {/* <table>
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
                            <td>{item.TCC}</td>
                            <td>{item.Commission}</td>
                            <td>{item.FOB_Cost}</td>
                            <td>{item.GW}</td>
                            <td>{item.freight}</td>
                            <td>{item.CNF_COST}</td>
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
                      <tbody>{/* Add dynamic table data here */}
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
              Order Check
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
                style={{
                  backgroundColor: color ? "" : "#631f37",
                }}
                className="pt-0"
              >
                Loading Date missing
              </p>

              <div className="closeBtnRece">
                <button onClick={closeIcon1}>Close</button>
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

export default UpdateTest;
