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
import { useTranslation } from "react-i18next";

const UpdateTest = () => {
  const { t, i18n } = useTranslation("global");
  const [color, setColor] = useState(false);
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const [data1, setData1] = useState("");
  const [copyData, setCopyData] = useState("");

  const closeIcon1 = () => {
    setShow1(false);
  };
  const { data: RoundingDataList } = useQuery("GetRoundingTable");
  const [state5, setState5] = useState({
    Rounding: "", // Initial state
  });
  // new selct
  const handleChange5 = (e) => {
    setState5((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/InvoicePriceRounding`,
        {
          Order_ID: from?.Order_ID,
          RCondition: state5.Rounding || 0,
          Is_Invoice: 0,
          Is_Quotation: 0,
          Is_Recalculate: 1,
        }
      );
      console.log(response);
      getOrdersDetails();
      const modalEl = document.getElementById("exampleModal");
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) modalInstance.hide();
      setState5("");
      toast.success(`${t("price")} ${t("updateSuccess")}`);
    } catch (e) {
      console.error("Something went wrong", e);
    }
  };
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
  const [exchangeRate5, setExchangeRate5] = useState("");
  const [exchangeRate6, setExchangeRate6] = useState("");

  console.log(state);
  // const handleChange = (event) => {
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
        await axios.post(`${API_BASE_URL}/updateOrdersValues`, {
          id: state.order_id,
          [name]: value,
        });
        console.log(`${name} updated successfully`);
        toast.success(t("updateSuccess"), {
          autoClose: 1000,
          theme: "colored",
        });
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
              newData.Freight_Provider || prevState.Freight_provider_,
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
          setExchangeRate5(newData.Include_claims || 0);
          setExchangeRate6(newData.Total_R || 0);
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
  console.log(state);
  useEffect(() => {
    if (state.order_id) orderCrossFreight();
  }, [state.order_id]);
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
  const computedState = useMemo(() => {
    console.log(consigneesNew);

    const r = {
      ...state,
      consignee_id: state.consignee_id,
      client_id: state.client_id,
    };
    const consigneeFind = consigneesNew?.find(
      (v) => v.consignee_id == state.consignee_id
    );
    console.log(consigneeFind);
    setCopyData(consigneeFind);
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

  const isError = useMemo(() => {
    return (details?.section5_Values || []).some((v) => {
      return +v.Col5 % 1 !== 0 || +v.cal_error == 1;
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
  const consigneeValueFilter = async (consigneeId, orderId) => {
    console.log(consigneeId);
    console.log(orderId);
    if (consigneeId && orderId) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/OrderConsigneePopulate`,
          {
            Consignee_ID: consigneeId,
            Order_ID: orderId,
            input: copyData,
          }
        );
        toast.success(t("updateSuccess"));

        console.log("Consignee Response:", response.data);
      } catch (error) {
        console.error("Error fetching consignee data:", error);
        // toast.error("Something went wrong"); // Optional user feedback
      }
    }
  };

  useEffect(() => {
    consigneeValueFilter(state.consignee_id, state.order_id);
  }, [state.consignee_id, state.order_id]);
  const fetchConsigneesNew1 = async () => {
    console.log(computedState.client_id);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/OrderConsigneeUpdate`,
        {
          Client_id: computedState.client_id,
          Consignee_ID: computedState.consignee_id,
          Order_ID: state.order_id,
          User_ID: localStorage.getItem("id"),
        }
      );
      console.log(response);
      oneQoutationDAta();
      // setConsigneesNew(response.data.data);
    } catch (error) {
      console.error("Error fetching consignees:", error);
    }
  };
  console.log(computedState);

  useEffect(() => {
    if (state.client_id) {
      fetchConsigneesNew();
    }
    if (state.client_id && state.consignee_id) {
      fetchConsigneesNew1();
    }
  }, [state.client_id, state.consignee_id]);
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
            Client_id: state.client_id,
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
      toast.error(t("failedToUpdateStatus"), {
        autoClose: 1500,
        theme: "colored",
      });
    }
  };

  const handleAgreedPricingChange9 = async (e) => {
    const { name, checked } = e.target;
    const newValue = checked ? 1 : 0;

    setExchangeRate6(newValue);
    if (state?.order_id || selectedConsigneeData.Order_ID) {
      try {
        const response = await updateAllOrderStatuses({
          id: state.order_id || selectedConsigneeData.Order_ID,
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
        toast.error(t("failedToUpdateStatus"), {
          autoClose: 1500,
          theme: "colored",
        });
      }
    }
  };

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
      toast.error(t("failedToUpdateStatus"), {
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
      toast.error(t("failedToUpdateStatus"), {
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
      toast.error(t("failedToUpdateStatus"), {
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
      toast.error(t("failedToUpdateStatus"), {
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
            toast.success(t("orderDeletedSuccess"));
            getOrdersDetails();
            oneQoutationDAta();
          }
        } catch (e) {
          console.error("API call error:", e);
          toast.error(t("tryAgain"));
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

        toast.success(t("orderUpdateSuccess"), {
          autoClose: 1000,
          theme: "colored",
        });

        navigate("/order");
      }
    } catch (e) {
      toast.error(t("tryAgain"));
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
    const reai = details?.section5_Values?.filter(
      (v) => v.Col1 && v.Col3 && v.Col4
    );
    console.log("Filtered details:", reai);

    if (!reai || reai.length === 0) return;

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
        toast.success(t("orderCalculated"), {
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
    const reai = details?.section5_Values?.filter(
      (v) => v.Col1 && v.Col3 && v.Col4
    );
    console.log("Filtered details:", reai);

    if (!reai || reai.length === 0) return;

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
        toast.success(t("orderUpdatedSuccess"), {
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
    console.log(details);
    const reai = details?.section5_Values?.filter(
      (v) => v.Col1 && v.Col3 && v.Col4
    );
    console.log("Filtered details:", reai);

    if (!reai || reai.length === 0) return;

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
        toast.success(t("orderCalculated"), {
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
  const [toEditDetails, setToEditDetails] = useState({});

  const [selectedDetails, setSelectedDetails] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const defaultDetailsValue = useMemo(() => {
    if (
      selectedDetails === null ||
      !Array.isArray(details?.section5_Values) ||
      typeof selectedDetails !== "number"
    ) {
      return null;
    }

    return details.section5_Values[selectedDetails] || null;
  }, [selectedDetails, details]);

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
      itf_quantity: toEditDetails?.itf_quantity ?? defaultDetailsValue?.Col3,
      itf_unit: toEditDetails?.itf_unit ?? defaultDetailsValue?.Unit,
      adjusted_price:
        toEditDetails?.adjusted_price ??
        defaultDetailsValue?.Adjusted_Price ??
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
        toEditDetails?.brand_id ?? defaultDetailsValue?.Brand ?? undefined,
      is_changed: true,
    };
    if (!values.ITF || !values.itf_quantity || !values.itf_unit)
      return toast.error(t("fillAllFields"));
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
      orderCrossFreight();
      toast.success(t("orderDetailAdded"));
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
      toast.error(t("tryAgain"));
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
        toast.success(t("orderRecalculatedSuccess"), {
          autoClose: 1000,
          theme: "colored",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error(t("tryAgain"));
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
  const handleSubmit1 = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/InvoicePriceRounding`,
        {
          Order_ID: from?.Order_ID,
          RCondition: 0,
          Is_Invoice: 0,
          Is_Quotation: 1,
          Is_Recalculate: 0,
        }
      );
      console.log(response);
      getOrdersDetails();

      toast.success(`${t("invoicePrice")} ${t("updateSuccess")}`);
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

      toast.success(`${t("agreedPrice")} ${t("updateSuccess")}`);
    } catch (e) {
      console.error("Something went wrong", e);
    }
  };
  const handleSubmit3 = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/LASTPrice`, {
        Order_ID: state.order_id,
      });
      console.log(response);
      getOrdersDetails();

      toast.success(`${t("lastPrice")} ${t("updateSuccess")}`);
    } catch (e) {
      console.error("Something went wrong", e);
    }
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
        toast.success(t("orderPopulated"), {
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
        toast.error(t("orderFailed"), {
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
      <Card title={`${t("orderManagement")} / ${t("updateForm")}`}>
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
                        <h6>{t("clients")}</h6>
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
                              placeholder={t("select_client")}
                            />
                          )}
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>{t("consignee")}</h6>
                        {/* <Autocomplete
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
                              placeholder={t("selectConsignee")}
                              variant="outlined"
                            />
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.consignee_id === value?.consignee_id
                          } // Compare based on consignee_id
                        /> */}
                        <Autocomplete
                          options={
                            consigneesNew?.map((v) => ({
                              consignee_id: v.ID, // normalize API field to match state
                              consignee_name: v.Name, // normalize name
                            })) || []
                          }
                          getOptionLabel={(option) =>
                            option.consignee_name || ""
                          }
                          value={
                            consigneesNew
                              ?.map((v) => ({
                                consignee_id: v.ID,
                                consignee_name: v.Name,
                              }))
                              .find(
                                (c) => c.consignee_id === state.consignee_id
                              ) || null
                          }
                          isOptionEqualToValue={(option, value) =>
                            option.consignee_id === value?.consignee_id
                          }
                          onChange={(event, newValue) => {
                            const consigneeId = newValue
                              ? newValue.consignee_id
                              : "";

                            // ✅ Update state consistently
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
                              Q_Markup: "",
                              destination_port_id: "",
                              liner_id: "",
                              loading_location: "",
                              consignee_id: consigneeId,
                              consignee_name: newValue
                                ? newValue.consignee_name
                                : "",
                            });

                            // 🔥 Call API immediately after consignee change
                            if (consigneeId) {
                              fetchConsigneesNew1();
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={t("selectConsignee")}
                              variant="outlined"
                            />
                          )}
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>{t("brands")}</h6>
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
                            <TextField
                              {...params}
                              placeholder={t("selectBrand")}
                            />
                          )}
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>{t("currency")}</h6>
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
                              placeholder={t("selectCurrency")}
                            />
                          )}
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>{t("loadingLocation")}</h6>
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
                              placeholder={t("selectLoading")}
                            />
                          )}
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>{t("portOfOrigins")}</h6>
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
                            <TextField
                              {...params}
                              placeholder={t("selectOrigin")}
                            />
                          )}
                        />
                      </div>
                      <div className="col-lg-3 form-group quotationSelectSer">
                        <h6>{t("portOfDestination")}</h6>
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
                              placeholder={t("selectDestinationPort")}
                            />
                          )}
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6> {t("airline")}</h6>
                        <Autocomplete
                          options={
                            liners?.map((v) => ({
                              id: v.liner_id,
                              name: v.liner_name,
                            })) || []
                          }
                          getOptionLabel={(option) => option.name || ""}
                          value={
                            computedState.liner_id
                              ? liners
                                ?.map((v) => ({
                                  id: v.liner_id,
                                  name: v.liner_name,
                                }))
                                .find(
                                  (v) => v.id === computedState.liner_id
                                ) || null
                              : null
                          }
                          onChange={async (e, newValue) => {
                            const newId = newValue?.id || null;
                            setState((prev) => ({ ...prev, liner_id: newId }));

                            try {
                              await axios.post(
                                `${API_BASE_URL}/updateOrdersValues`,
                                {
                                  id: state.order_id,
                                  liner_id: newId,
                                  Freight_provider_: state.Freight_provider_,
                                }
                              );
                              toast.success(t("updateSuccess"), {
                                autoClose: 1000,
                                theme: "colored",
                              });
                              console.log("liner_id updated successfully");
                            } catch (error) {
                              console.error("Error updating liner_id:", error);
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={t("selectAirline")}
                              variant="outlined"
                            />
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value?.id
                          }
                        />

                        {/* <Autocomplete
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
                        /> */}
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>{t("transportation")}</h6>
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
                              placeholder={t("selectTransportation")}
                            />
                          )}
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>{t("clearance")}</h6>
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
                              placeholder={t("selectClearance")}
                            />
                          )}
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>{t("freightProvider")}</h6>
                        {/* <Autocomplete
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
                        /> */}
                        <Autocomplete
                          options={freights?.map((v) => ({
                            id: v.Freight_provider,
                            name: v.name,
                          }))}
                          getOptionLabel={(option) => option.name}
                          value={
                            computedState.Freight_provider_
                              ? freights?.find(
                                (v) =>
                                  v.Freight_provider ===
                                  computedState.Freight_provider_
                              ) || null
                              : null
                          }
                          onChange={async (e, newValue) => {
                            const newId = newValue?.id || null;
                            setState((prev) => ({
                              ...prev,
                              Freight_provider_: newId,
                            }));

                            try {
                              await axios.post(
                                `${API_BASE_URL}/updateOrdersValues`,
                                {
                                  id: state.order_id,
                                  Freight_provider_: newId,
                                }
                              );
                              toast.success(t("updateSuccess"), {
                                autoClose: 1000,
                                theme: "colored",
                              });
                              console.log(
                                "Freight_provider_ updated successfully"
                              );
                            } catch (error) {
                              console.error(
                                "Error updating Freight_provider_:",
                                error
                              );
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={t("selectFreightProvider")}
                            />
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value?.id
                          }
                        />
                      </div>
                      <div className="col-lg-3 form-group  ">
                        <h6> {t("exRate")}</h6>
                        <input
                          type="number"
                          value={computedState.fx_rate}
                          onChange={handleChange}
                          name="fx_rate"
                        />
                      </div>
                      <div className="col-lg-2 form-group  ">
                        <h6>{t("markupRate")}</h6>
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
                        <h6> {t("rebate")}</h6>
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
                      <div className="col-lg-8 form-group">
                        <div className="IncludeClaim">
                          <div>
                            <h6>{t("includeClaim")}</h6>
                            <div className="flex gap-2 items-center">
                              <label className="toggleSwitch large" onclick="">
                                <input
                                  type="checkbox"
                                  name="Include_claims"
                                  checked={exchangeRate5 == 1}
                                  onChange={handleAgreedPricingChange8}
                                />
                                <span>
                                  <span> {t("off")}</span>
                                  <span> {t("on")}</span>
                                </span>
                                <a></a>
                              </label>
                            </div>
                          </div>
                          <div>
                            <h6>{t("chargeVolume")}</h6>
                            <div className="flex gap-2 items-center">
                              <label className="toggleSwitch large" onclick="">
                                <input
                                  type="checkbox"
                                  name="Charge_Volume"
                                  checked={exchangeRate1 == 1}
                                  onChange={handleAgreedPricingChange4}
                                />
                                <span>
                                  <span> {t("off")}</span>
                                  <span> {t("on")}</span>
                                </span>
                                <a></a>
                              </label>
                            </div>
                          </div>
                          <div>
                            <h6>{t("palletized")}</h6>
                            <div className="flex gap-2 items-center">
                              <label className="toggleSwitch large">
                                <input
                                  type="checkbox"
                                  name="palletized"
                                  checked={exchangeRate2 == 1}
                                  onChange={handleAgreedPricingChange5}
                                />
                                <span>
                                  <span> {t("off")}</span>
                                  <span> {t("on")}</span>
                                </span>
                                <a></a>
                              </label>
                            </div>
                          </div>
                          <div>
                            <h6>{t("coFromChamber")}</h6>
                            <div className="flex gap-2 items-center">
                              <label className="toggleSwitch large">
                                <input
                                  type="checkbox"
                                  name="Chamber"
                                  checked={exchangeRate3 == 1}
                                  onChange={handleAgreedPricingChange6}
                                />
                                <span>
                                  <span> {t("off")}</span>
                                  <span> {t("on")}</span>
                                </span>
                                <a></a>
                              </label>
                            </div>
                          </div>
                          <div>
                            <h6>{t("precooling")}</h6>
                            <div className="flex gap-2 items-center">
                              <label className="toggleSwitch large">
                                <input
                                  type="checkbox"
                                  name="PreColling"
                                  checked={exchangeRate4 == 1}
                                  onChange={handleAgreedPricingChange7}
                                />
                                <span>
                                  <span> {t("off")}</span>
                                  <span> {t("on")}</span>
                                </span>
                                <a></a>
                              </label>
                            </div>
                          </div>
                          <div>
                            <h6>{t("roundTotal")}</h6>
                            <div className="flex gap-2 items-center">
                              <label className="toggleSwitch large">
                                <input
                                  type="checkbox"
                                  name="roundTotal"
                                  checked={exchangeRate6 == 1}
                                  onChange={handleAgreedPricingChange9}
                                />
                                <span>
                                  <span> {t("off")}</span>
                                  <span> {t("on")}</span>
                                </span>
                                <a></a>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 form-group">
                        <h6>{t("loadingDate")}</h6>

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
                            {t("calculate")}
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
                              {t("add")}
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
                            {t("addConsigneeItems")}
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
                                    {t("orderPopulate")}
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
                                  <label htmlFor="">{t("netWeight")}</label>
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
                                    {t("save")}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <button
                              type="button"
                              className="  me-2"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal"
                            >
                              {t("roundPrice")}
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
                                      {t("priceRounding")}
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
                                      <h6>{t("rounding")}</h6>
                                      <Autocomplete
                                        options={RoundingDataList || []}
                                        getOptionLabel={(option) =>
                                          option?.DropDown || ""
                                        }
                                        value={
                                          (RoundingDataList || []).find(
                                            (item) => item.ID === state5?.Rounding
                                          ) || null
                                        }
                                        isOptionEqualToValue={(option, value) =>
                                          option.ID === value.ID
                                        }
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
                                            placeholder={t("selectRounding")}
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
                                      {t("submit")}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <button
                              type="button"
                              className="me-2"
                              onClick={handleSubmit1}
                            >
                              {t("useInvoicePrice")}
                            </button>
                          </div>
                          <div>
                            <button
                              type="button"
                              className="me-2"
                              onClick={handleSubmit2}
                            >
                              {t("agreedPrice")}
                            </button>
                          </div>
                          <div>
                            <button
                              type="button"
                              className="me-1"
                              onClick={handleSubmit3}
                            >
                              {t("lastPrice")}
                            </button>
                          </div>
                        </div>
                      )}
                      {isError && (
                        <div className="my-4 text-red-500">
                          <i className="mdi mdi-alert" /> {t("pleaseAdjustITF")}
                        </div>
                      )}
                      <div className="addBtnEan mb-4">
                        <button type="button" onClick={() => calculate(true)}>
                          {t("recalculate")}
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
                        {details?.section5_Labels2 && (
                          <thead>
                            <tr role="row" className="borderTh">
                              {Object.entries(details.section5_Labels2).map(
                                ([key, label]) => {
                                  if (
                                    key === "Profit" &&
                                    ((localStorage.getItem("level") ===
                                      "Level 1" &&
                                      localStorage.getItem("role") ===
                                      "Admin") ||
                                      localStorage.getItem("level") ===
                                      "Level 5")
                                  ) {
                                    return null; // Hide "Profit"
                                  }

                                  return <th key={key}>{label}</th>;
                                }
                              )}
                              <th> {t("action")}</th>
                            </tr>
                          </thead>
                        )}

                        <tbody>
                          {details?.section5_Values?.map((v, i) => {
                            const isRed =
                              +v.Col5 % 1 !== 0 || +v.cal_error == 1; // Apply red styling if Box is decimal

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
                                  // Handle Profit visibility
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

                                  const valueMap = {
                                    Item: "ITF_Name",
                                    Brand: "Brand_name",
                                    Quantity: "QTY",
                                    Unit: "Unit_Name",
                                    boxes: "Box",
                                    "Net Weight": "NW",
                                    "Calculated Price": "Calculated_Price",
                                    Price: "Adjusted_Price",
                                    Profit: "Profit_Percentage",
                                  };

                                  const field = valueMap[key] || key;
                                  const rawValue = v[field];

                                  // Format values conditionally
                                  const displayValue = (() => {
                                    if (["QTY", "NW"].includes(field))
                                      return threeDecimal.format(rawValue);
                                    if (field === "Box")
                                      return NoDecimal.format(rawValue);
                                    if (
                                      [
                                        "Calculated_Price",
                                        "Adjusted_Price",
                                      ].includes(field)
                                    ) {
                                      return rawValue
                                        ? twoDecimal.format(rawValue)
                                        : "";
                                    }
                                    if (field === "Profit_Percentage")
                                      return `${rawValue}`;
                                    return rawValue;
                                  })();

                                  return <td key={key}>{displayValue}</td>;
                                })}

                                {/* Action Buttons */}
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
                            );
                          })}
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
                              {details?.section6_Labels?.["Total Box :"] ||
                                "Total Box :"}
                            </b>
                            {(
                              +details?.section6_Values?.Row3 || 0
                            ).toLocaleString()}
                          </div>

                          <div className="">
                            <b>
                              {details?.section6_Labels?.["Total Volume :"] ||
                                "Total Volume :"}
                            </b>
                            {(
                              +details?.section6_Values?.Row4 || 0
                            ).toLocaleString()}
                          </div>

                          <b>
                            {details?.section6_Labels?.["Total Items :"] ||
                              "Total Items :"}
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
                              {details?.section7_Labels?.["Transport :"] ||
                                "Transport :"}
                            </b>

                            {(
                              +details?.section7_Values?.Row2 || 0
                            ).toLocaleString()}
                          </div>
                          <div className="">
                            <b>
                              {details?.section7_Labels?.["Clearance :"] ||
                                "Clearance :"}
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
                              {details?.section7_Labels?.["Pre Cooling"] ||
                                "Pre Cooling"}
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
                              {details?.section8_Labels?.["Total CNF :"] ||
                                "Total CNF :"}
                            </b>
                            {(
                              +details?.section8_Values?.Row1 || 0
                            ).toLocaleString()}
                          </div>
                          <div className="">
                            <b>
                              {details?.section8_Labels?.["Total FOB :"] ||
                                "Total FOB :"}
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
                              {details?.section8_Labels?.["Total Rebate :"] ||
                                "Total Rebate :"}
                            </b>
                            {(
                              +details?.section8_Values?.Row4 || 0
                            ).toLocaleString()}
                          </div>
                          <div className="">
                            <b>
                              {details?.section8_Labels?.["Row5"] || "Row5"}
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
                              {details?.section9_Labels?.["Row3"] || "Row3"}
                            </b>

                            {(
                              +details?.section9_Values?.Row4 || 0
                            ).toLocaleString()}
                          </div>
                          <div className="">
                            <b>
                              {details?.section9_Labels?.["Row4"] || "Row4"}
                            </b>

                            {(
                              +details?.section9_Values?.Row4 || 0
                            ).toLocaleString()}
                          </div>
                          <div className="">
                            <b>
                              {details?.section9_Labels?.["Row5"] || "Row5"}
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
              {!isError ? (
                <button
                  className="btn btn-primary"
                  type="submit"
                  name="signup"
                  onClick={updateOrderTest}
                >
                  {t("updateAndClose")}
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
                <h3>{t("editDetails")}</h3>
                <p onClick={closeModal}>
                  <CloseIcon />
                </p>
              </div>
              <div className="formEan formCreate">
                <div className="form-group mb-3 itfHeight quotationSelectSer">
                  <label>{t("itf")}</label>
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
                    placeholder={t("selectItf")}
                    isClearable // Adds a clear button
                    styles={customStyles}
                    components={{ DropdownIndicator }} // Use the custom indicator
                    classNamePrefix="react-select" // Add a p
                  />
                </div>
                <div className="form-group">
                  <label>{t("quantity")}</label>
                  <input
                    type="number"
                    value={
                      toEditDetails?.itf_quantity ??
                      defaultDetailsValue?.Col3 ??
                      0
                    }
                    name="itf_quantity"
                    onChange={updateDetails}
                  />
                </div>
                <div className="form-group mb-3 quotationSelectSer">
                  <h6>{t("brands")}</h6>
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
                              defaultDetailsValue?.Brand)
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
                        placeholder={t("selectBrand")}
                      />
                    )}
                  />
                </div>
                <div className="form-group mb-3 quotationSelectSer">
                  <label>{t("unit")}</label>
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
                      unit
                        ?.slice(0, 4) // ✅ Only top 4 units
                        .map((v) => ({
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
                              defaultDetailsValue?.Unit)
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
                        placeholder={t("selectUnit")}
                      />
                    )}
                  />
                </div>
                <div className="form-group">
                  <label>{t("adjustmentPrice")}</label>
                  <input
                    type="number"
                    value={
                      toEditDetails?.adjusted_price ??
                      defaultDetailsValue?.Adjusted_Price ??
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
                  {t("save")}
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
              {t("freightError")}
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
          className="fixed inset-0 flex items-center justify-center "
          style={{ zIndex: "999" }}
        >
          <div
            className="fixed w-screen h-screen bg-black/20 "
            onClick={handleCloseModal}
          />
          <div
            className="bg-white rounded-lg shadow-lg max-w-md w-full modalBillingTable"
            style={{ maxWidth: "1530px" }}
          >
            <div className="formEan">
              <div className="modal-body modalShipTo p-0 ">
                <div className="formEan">
                  <div className="addMOdalContent">
                    <div className="row tableCombinePayment">
                      <div className="tableCreateClient tableLr tablepayment">
                        <table>
                          <thead>
                            <tr>
                              {Object.values(
                                calculateListData?.header || {}
                              ).map((label, index) => (
                                <th key={index}>{label}</th>
                              ))}
                              <th>
                                {" "}
                                <i
                                  type="button"
                                  onClick={handleCloseModal}
                                  className="mdi mdi-close"
                                ></i>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {calculateListData?.data?.map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {Object.keys(
                                  calculateListData?.header || {}
                                ).map((_, colIndex) => {
                                  const colKey = `COL${colIndex + 1}`; // Dynamically build COL1, COL2, ...
                                  return (
                                    <td key={colKey}>{row[colKey] ?? ""}</td>
                                  );
                                })}
                                <td></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer justify-content-center">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  {t("close")}
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
              {t("orderCheck")}
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
                {t("loadingDateMissing")}
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

export default UpdateTest;
