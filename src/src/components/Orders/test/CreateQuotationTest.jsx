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
import "../../Orders/order/CreateOrder.css";
import { ComboBox } from "../../combobox";
import Select, { components } from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa"; // Import an icon from react-icons
import { useTranslation } from "react-i18next";

const CreateQuotationTest = () => {
  const { t, i18n } = useTranslation("global");
  const [color, setColor] = useState(false);
  const { data: RoundingDataList } = useQuery("GetRoundingTable");
  const [copyData, setCopyData] = useState("");
  const [orderIdData, setOrderIdData] = useState("");

  const [selectedConsigneeData, setSelectedConsigneeData] = useState(null); // detailed data
  const [state5, setState5] = useState({
    Rounding: "", // Initial state
  });

  const handleChange5 = (e) => {
    setState5((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
  const handleSaveOrderPopulate = () => {
    const payload = {
      order_id: state.Order_ID || selectedConsigneeData.Order_ID, // You must have this in your component
      user_id: localStorage.getItem("id"), // You must also define this
      Order_NW: orderNetWeight,
      input: {
        ...computedState,
        user: localStorage.getItem("id"),
        palletized: exchangeRate2 ? 1 : 0,
        Chamber: exchangeRate3 ? 1 : 0,
        Precooling: exchangeRate4 ? 1 : 0,

        Charge_Volume: exchangeRate1 ? 1 : 0,
        is_quotation: 1,
      },
    };
    axios
      .post(`${API_BASE_URL}/OrderPopulate`, payload)
      .then((res) => {
        console.log("✅ OrderPopulate response:", res?.data); // ← Add this line

        setState((prevState) => {
          return {
            ...prevState,
            order_id: res?.data?.order_id,
          };
        });
        setOrderId(res?.data?.order_id);
        setDeleteOrderId(res?.data?.order_id);
        getOrdersDetails();
        toast.success(t("quotationPopulatedSuccess"), {
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
        toast.error(t("quotationPopulateFailed"), {
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
  // new selct
  const [orderNetWeight, setOrderNetWeight] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [consigneeNew, setConsigneeNew] = useState();
  const [consigneeNew1, setConsigneeNew1] = useState();
  const [consigneeNew2, setConsigneeNew2] = useState();

  const { from } = location.state || {};
  console.log(from);
  const isReadOnly = from?.isReadOnly;
  const [data, setData] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [orderErr, setOrderErr] = useState(true);
  const [deleteOrderId, setDeleteOrderId] = useState("");
  const [consigneesNew, setConsigneesNew] = useState([]);
  const [exchangeRate1, setExchangeRate1] = useState(0);
  const [exchangeRate2, setExchangeRate2] = useState(0);
  const [exchangeRate3, setExchangeRate3] = useState(0);
  const [exchangeRate4, setExchangeRate4] = useState(0);
  const [exchangeRate5, setExchangeRate5] = useState(1);
  const [isRecalculateClicked, setIsRecalculateClicked] = useState(false);
  const [isRecalculateClicked1, setIsRecalculateClicked1] = useState(false);
  const [massageShow, setMassageShow] = useState("");
  const [massageShow1, setMassageShow1] = useState("");
  const [calculateListData, setCalculateListData] = useState([]);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);

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
  const handleClose1 = () => setShow1(false);

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
    consignee_name: from?.consignee_name || "",
    fx_id: from?.fx_id || "",
    mark_up: from?.mark_up || 0,
    rebate: from?.rebate || 0,
    palletized: from?.palletized == "ON",
    Chamber: from?.Chamber == "ON",
    load_date: from?.load_date
      ? new Date(from?.load_date).toISOString().slice(0, 10)
      : "",
    fx_rate: from?.fx_rate,
    Q_Markup: "",
    O_Extra: "",
    Location_name: "",
  });
  console.log(state);
  const handleChange = async (event) => {
    if (isReadOnly || isLoading) return;

    const { name, value } = event.target;

    setState((prevState) => ({
      ...prevState,
      [name]: value,
      fx_rate_manually_set:
        name === "fx_rate" ? true : prevState.fx_rate_manually_set,
    }));

    const updatableFields = [
      "mark_up",
      "rebate",
      "load_date",
      "fx_rate",
      "Q_Markup",
    ];

    if (updatableFields.includes(name)) {
      try {
        await axios.post(`${API_BASE_URL}/updateOrdersValues`, {
          id: state.order_id || selectedConsigneeData.Order_ID,
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

  const oneQoutationDAta = () => {
    console.log(state.order_id);
    axios
      .get(`${API_BASE_URL}/NewgetOrdersById`, {
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
    if (state.order_id) getOrdersDetails();
  }, [orderId]);

  const threeDecimal = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
  const NoDecimal = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const handleAgreedPricingChange4 = async (e) => {
    const { name, checked } = e.target;
    const newValue = checked ? 1 : 0;

    setExchangeRate1(newValue);
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
  const handleAgreedPricingChange5 = async (e) => {
    const { name, checked } = e.target;
    const newValue = checked ? 1 : 0;

    setExchangeRate2(newValue);
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
  const handleAgreedPricingChange8 = async (e) => {
    const { name, checked } = e.target;
    const newValue = checked ? 1 : 0;

    setExchangeRate5(newValue);
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
  const handleAgreedPricingChange6 = async (e) => {
    const { name, checked } = e.target;
    const newValue = checked ? 1 : 0;

    setExchangeRate3(newValue);
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
  const handleAgreedPricingChange7 = async (e) => {
    const { name, checked } = e.target;
    const newValue = checked ? 1 : 0;

    setExchangeRate4(newValue);
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
  const updateAllOrderStatuses = async ({ id, field, value }) => {
    return axios.post(`${API_BASE_URL}/updateAllOrderStatuses`, {
      id,
      field,
      value,
    });
  };
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
      return (+v.Box % 1 !== 0) | (+v.cal_error == 1);
    });
  }, [details]);

  const isErrorCall = useMemo(() => {
    return (details?.section5_Values || []).some((v) => {
      return +v.cal_error == 1;
    });
  }, [details]);


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
            await axios.post(`${API_BASE_URL}/NewdeleteOrderDetails`, {
              id: details[i].OD_ID,
              order_id: state.order_id,
              user_id: localStorage.getItem("id"),
              Is_Recalculate: 0,
              Is_Quotation: 1,
            });
            setDetails((prevState) => {
              getOrdersDetails();
              return prevState.filter((v, index) => index != i);
            });
            toast.success(t("quotationDetailDeletedSuccess"));
          }
        });
      } catch (e) { }
    } else {
      setDetails((prevState) => {
        return prevState.filter((v, index) => index != i);
      });
    }
  };
  const handleChange3 = (e) => {
    setNotes1(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/InvoicePriceRounding`,
        {
          Order_ID: state.order_id,
          RCondition: state5.Rounding || 0,
          Is_Invoice: 0,
          Is_Quotation: data?.Is_quotation,
          Is_Recalculate: 0,
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
  const dataSubmit1 = () => {
    axios
      .post(`${API_BASE_URL}/deleteOrder`, {
        id: deleteOrderId,
        user_id: localStorage.getItem("id"),
        // NOTES: notes1,
      })
      .then((response) => {
        setStock(response.data.message.Message_EN);
        console.log(response.data.message.Message_EN);
        let modalElement = document.getElementById("exampleModal1");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        if (response.data.success) {
          toast.success(t("quotationDeletedSuccessfully"), {
            autoClose: 1000,
            theme: "colored",
          });
          navigate("/quotation");
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

  const deleteOrder = async () => {
    console.log(deleteOrderId);

    if (deleteOrderId) {
      try {
        await axios.post(`${API_BASE_URL}/deleteOrder`, { id: deleteOrderId });
        toast.success(t("quotationCancelSuccessfully"));
        navigate("/quotation");
        oneQoutationDAta();
        refetch();
      } catch (e) {
        // toast.error("Something went wrong");
        console.log(e);
      }
    } else {
      navigate("/quotation");
    }
  };
  console.log(details);

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
  const calculate = async (isClicked) => {
    setIsRecalculateClicked(isClicked);
    console.log(isRecalculateClicked);
    const reai = details?.section5_Values?.filter(
      (v) => v.ITF_Name && v.QTY && v.Unit_Name
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
            Location_name: computedState.Location_name,
          },
          details: reai,
          Is_Recalculate: isClicked ? 1 : 0, // Correctly pass the argument value
          Is_Quotation: 1,
        }
      );
      console.log(data);

      oneQoutationDAta();
      if (data.success === false) {
        calculateList();
        setShowModal(false);
        setShow(true);
        setMassageShow1(data.message);
      } else if (data.success === true) {
        calculateList();
        setShow(false);
        toast.success(t("quotationCalculatedSuccessfully"), {
          autoClose: 1000,
          theme: "colored",
        });
        setShowModal(true);
      }

      await getOrdersDetails(data.data);
      // navigate("/quotation");
      // getSummary();
    } catch (e) {
      console.error(e);
      toast.error(t("tryAgain"), {
        autoClose: 1000,
        theme: "colored",
      });
    } finally {
      MySwal.close();
      setIsLoading(false);
    }
  };
  const handleSubmit1 = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/InvoicePriceRounding`,
        {
          Order_ID: state.order_id,
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
        order_id: state.order_id,
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
  const calculate1 = async (isClicked) => {
    setIsRecalculateClicked(isClicked);
    console.log(isRecalculateClicked);
    const reai = details?.section5_Values?.filter(
      (v) => v.ITF_Name && v.QTY && v.Unit_Name
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
            Location_name: computedState.Location_name,
          },
          details: reai,
          Is_Recalculate: isClicked ? 1 : 0,
          Is_Quotation: 1,
        }
      );
      console.log(data);

      oneQoutationDAta();
      if (data.success === false) {
        calculateList();
        setShowModal(false);
        setShow(true);
        setMassageShow1(data.message);
      } else if (data.success === true) {
        calculateList();
        setShow(false);
        toast.success(t("quotationCalculatedSuccessfully"), {
          autoClose: 1000,
          theme: "colored",
        });
        setShowModal(true);
      }

      await getOrdersDetails(data.data);
      // getSummary();
    } catch (e) {
      console.error(e);
      toast.error(t("tryAgain"), {
        autoClose: 1000,
        theme: "colored",
      });
    } finally {
      MySwal.close();
      setIsLoading(false);
    }
  };

  const createTestOrder = async () => {
    const reai = details?.section5_Values?.filter(
      (v) => v.ITF_Name && v.QTY && v.Unit_Name
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
            Location_name: computedState.Location_name,
          },
          details: reai,
          Is_Recalculate: 0,
          Is_Quotation: 1,
        }
      );
      console.log(data);

      oneQoutationDAta();
      if (data.success === false) {
        calculateList();

        setShow(true);
        setMassageShow1(data.message);
      } else if (data.success === true) {
        calculateList();
        setShow(false);
        toast.success(t("quotationCreateSuccessfully"), {
          autoClose: 1000,
          theme: "colored",
        });
      }

      await getOrdersDetails(data.data);

      navigate("/quotation"); // getSummary();
    } catch (e) {
      console.error(e);
      toast.error(t("tryAgain"), {
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
  const [toEditDetails, setToEditDetails] = useState({});
  console.log(toEditDetails?.Brand_id);
  console.log(defaultDetailsValue?.Brand_id);
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
      Produce:
        toEditDetails?.Produce ?? defaultDetailsValue?.Produce ?? undefined,
      Produce_Status:
        toEditDetails?.Produce_Status ??
        defaultDetailsValue?.Produce_Status ??
        undefined,
      Claim_Markup:
        toEditDetails?.Claim_Markup ??
        defaultDetailsValue?.Claim_Markup ??
        undefined,
      HS_Code:
        toEditDetails?.HSCODE ?? defaultDetailsValue?.HS_Code ?? undefined,
      ITF_Name:
        toEditDetails?.itf_name ?? defaultDetailsValue?.ITF_Name ?? undefined,
      itf_quantity: toEditDetails?.itf_quantity ?? defaultDetailsValue?.QTY,
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
    if (!values.ITF || !values.itf_quantity || !values.itf_unit) {
      setOrderErr(true);
      return toast.error(t("fillAllFields"));
    }
    setOrderErr(false);
    loadingModal.fire();
    closeModal();
    try {
      const { data } = await axios.post(`${API_BASE_URL}/NewaddOrderInput`, {
        input: {
          ...computedState,
          order_id: selectedConsigneeData.Order_ID || null,
          user: localStorage.getItem("id"),
          palletized: exchangeRate2 ? 1 : 0,
          Chamber: exchangeRate3 ? 1 : 0,
          Precooling: exchangeRate4 ? 1 : 0,

          Charge_Volume: exchangeRate1 ? 1 : 0,
          is_quotation: 1,
        },
        details: values,
        Is_Recalculate: 0,
        Is_Quotation: 1,
      });
      oneQoutationDAta();
      setOrderId(data?.order_id);
      console.log(data.order_id);
      toast.success(t("quotationDetailAddedSuccessfully"));
      setDeleteOrderId(data?.order_id);
      setState((prevState) => {
        return {
          ...prevState,
          order_id: data?.order_id,
        };
      });

      // getSummary();
      getOrdersDetails();
      // navigate("/quotation");
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
        toast.success(t(updateSuccess));

        console.log("Consignee Response:", response.data);
      } catch (error) {
        console.error("Error fetching consignee data:", error);
        // toast.error("Something went wrong"); // Optional user feedback
      }
    }
  };

  useEffect(() => {
    consigneeValueFilter(state.consignee_id, state.order_id);
  }, [state.consignee_id]);
  useEffect(() => {
    newItfList();
    newBrandList();
  }, [state.consignee_id]);

  console.log(state);
  const closeIcon1 = () => {
    setShow1(false);
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
  const computedState = useMemo(() => {
    const r = {
      ...state,
      consignee_id: state.consignee_id,
      client_id: state.client_id,
    };

    const consigneeFind = selectedConsigneeData;
    // ? selectedConsigneeData
    // : consigneesNew?.find((v) => v.ID == state.consignee_id);
    console.log(consigneeFind);
    const portDestinationFind = ports?.find(
      (v) =>
        v.port_id == (r.destination_port_id || consigneeFind?.Destination_Port)
    );
    const portOriginFind = ports?.find(
      (v) => v.port_id == (r.from_port_ || consigneeFind?.Origin_Port)
    );

    r.fx_id = r.fx_id || consigneeFind?.FX_ID;
    r.O_Extra = r.O_Extra || consigneeFind?.Extra_cost;
    r.fx_rate =
      !state.fx_rate_manually_set && r.fx_id
        ? currency?.find((v) => +v.ID === +r.fx_id)?.fx_rate || 0
        : state.fx_rate;
    r.rebate = r.rebate || consigneeFind?.Rebate;
    r.Clearance_provider =
      r.Clearance_provider ||
      portOriginFind?.preferred_clearance ||
      consigneeFind?.Clearance_provider;
    r.loading_location = r.loading_location || consigneeFind?.loading_location;
    r.brand_id = state.brand_id || consigneeFind?.Brand_id;
    r.mark_up = r.mark_up || consigneeFind?.O_Markup;
    r.consignee_name = r.consignee_name || consigneeFind?.consignee_name;
    r.Transportation_provider =
      r.Transportation_provider || portOriginFind?.preferred_transport;
    r.from_port_ = r.from_port_ || consigneeFind?.Origin_Port;
    r.destination_port_id =
      r.destination_port_id || consigneeFind?.Destination_Port;
    r.liner_id = r.liner_id || portDestinationFind?.prefered_liner;
    r.Freight_provider_ =
      state.Freight_provider_ ||
      liners?.find((v) => v.liner_id == r.liner_id)?.preffered_supplier;
    r.Q_Markup = r.Q_Markup || consigneeFind?.Q_Markup;
    r.Location_name = consigneeFind?.name;

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
    selectedConsigneeData, // added dependency
  ]);

  // Update copyData whenever computedState changes
  useEffect(() => {
    const consigneeFind = selectedConsigneeData
      ? selectedConsigneeData
      : consigneesNew?.find((v) => v.ID == state.consignee_id);

    setCopyData(consigneeFind || null);
  }, [computedState, selectedConsigneeData, consigneesNew, state.consignee_id]);

  // useEffect(() => {
  //   // Don't run if no client
  //   if (!state.client_id) return;

  //   // Build request body
  //   const payload = {
  //     Client_id: state.client_id
  //   };

  //   console.log(state);

  //   // If we also have consignee_id, add extra params
  //   if (state.consignee_id) {
  //     payload.Consignee_ID = state.consignee_id;
  //     payload.Is_Quotation = 1;
  //     payload.User_ID = localStorage.getItem("id");
  //   }

  //   // Call same API
  //   axios.post(`${API_BASE_URL}/ConsigneeDropDown`, payload)
  //     .then(res => {
  //       console.log(res.data.data);

  //       setConsigneesNew(res.data.data);
  //     })
  //     .catch(err => {
  //       console.error("Error fetching consignees:", err);
  //     });

  // }, [state.client_id, state.consignee_id]);

  // useEffect(() => {
  //   const consigneeFind = consigneesNew?.find(
  //     (v) => v.consignee_id == state.consignee_id
  //   );

  //   if (consigneeFind) {
  //     setExchangeRate1(consigneeFind?.Charge_Volume || 0);
  //     setExchangeRate2(consigneeFind?.Palletized || 0);
  //     setExchangeRate3(consigneeFind?.CO_Chamber_Required || 0);
  //     setExchangeRate4(consigneeFind?.Precooling || 0);
  //     setExchangeRate5(consigneeFind?.Include_claims || 0);
  //   }
  // }, [state.consignee_id, consigneesNew]);
  // console.log(from);
  // console.log(computedState);
  // const fetchConsigneesNew = async () => {
  //   console.log(computedState.client_id);
  //   try {
  //     const response = await axios.post(`${API_BASE_URL}/ConsigneeDropDown`, {
  //       Client_id: computedState.client_id,
  //     });
  //     console.log(response);
  //     setConsigneesNew(response.data.data);
  //   } catch (error) {
  //     console.error("Error fetching consignees:", error);
  //   }
  // };
  // useEffect(() => {
  //   if (state.client_id) {
  //     fetchConsigneesNew();
  //   }
  // }, [state.client_id, state.consignee_id]);

  // Fetch full consignee list for a client
  useEffect(() => {
    if (!state.client_id) return;

    axios
      .post(`${API_BASE_URL}/ConsigneeDropDown`, { Client_id: state.client_id })
      .then((res) => {
        setConsigneesNew(res.data.data || []);
      })
      .catch(console.error);
  }, [state.client_id]);

  // Fetch detailed info for selected consignee
  useEffect(() => {
    if (!state.client_id || !state.consignee_id) return;
    console.log("run.............");

    axios
      .post(`${API_BASE_URL}/ConsigneeDropDown`, {
        orderId: orderIdData || "",
        Client_id: state.client_id,
        Consignee_ID: state.consignee_id,
        Is_Quotation: 1,
        User_ID: localStorage.getItem("id"),
      })
      .then((res) => {
        const detail = res.data.detailRow || null;
        setOrderIdData(res.data.detailRow.Order_ID);
        setSelectedConsigneeData(detail); // store detailed data
      })
      .catch(console.error);
  }, [state.consignee_id]);
  console.log(selectedConsigneeData);

  // Clear when unselected
  useEffect(() => {
    if (!state.consignee_id) {
      setSelectedConsigneeData(null);
      setCopyData(null);
    }
  }, [state.consignee_id]);

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
      value: v.ID, // Standardized property name for value
      label: v.itf_name,
      Produce: v.Produce, // Standardized property name for value
      Claim_Markup: v.Claim_Markup,
      HSCODE: v.HSCODE,
      Produce_Status: v.Produce_Status,
      // Standardized property name for label
    }))
    : [];
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

  return (
    <>
      <Card title={`${t("quotationTestManagement")} / ${t("createForm")}`}>
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
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer ">
                        <h6>{t("clients")}</h6>
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
                              placeholder={t("select_client")}
                              variant="outlined"
                            />
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.client_id === value?.client_id
                          } // Compare based on client_id
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>{t("consignee")}</h6>
                        <Autocomplete
                          options={consigneesNew || []} // Ensure consignees is an array
                          getOptionLabel={(option) => option.Name || ""} // Display the consignee name
                          value={
                            consigneesNew?.find(
                              (v) => v.ID === computedState.consignee_id
                            ) || null
                          } // Find the selected consignee by consignee_id
                          onChange={(event, newValue) => {
                            // Handle the change and reset multiple fields in the state
                            console.log("Updating state to:", newValue);
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
                              Q_Markup: "",
                              loading_location: "",
                              consignee_id: newValue ? newValue.ID : "", // Set consignee_id from the selected consignee
                              consignee_name: newValue ? newValue.Name : "",
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
                            option.ID === value?.consignee_id
                          } // Compare based on consignee_id
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6> {t("brands")}</h6>

                        <Autocomplete
                          options={brands || []} // Safe fallback if brands is undefined
                          getOptionLabel={(option) => option.Name_EN || ""} // Label display
                          value={
                            brands?.find(
                              (v) => v.ID === computedState.brand_id
                            ) || null
                          } // Select correct brand based on brand_id
                          onChange={(event, newValue) => {
                            setState({
                              ...state,
                              brand_id: newValue ? newValue.ID : "", // Update selected brand_id
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={t("selectBrand")}
                              variant="outlined"
                            />
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.ID === value?.ID
                          } // Important to match selected option
                        />
                      </div>

                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6> {t("currency")}</h6>

                        <Autocomplete
                          options={currency || []} // Ensure options is an array even if currency is undefined
                          getOptionLabel={(option) => option.FX || ""} // Display the name of the currency
                          value={
                            currency?.find(
                              (v) => v.ID === computedState.fx_id
                            ) || null
                          } // Find the selected currency based on fx_id
                          onChange={(event, newValue) => {
                            setState((prevState) => ({
                              ...prevState,
                              fx_id: newValue ? newValue.ID : "",
                              fx_rate:
                                newValue && newValue.fx_rate
                                  ? parseFloat(newValue.fx_rate)
                                  : 0, // auto-set fx_rate
                            }));
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={t("selectCurrency")}
                              variant="outlined"
                            />
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.ID === value?.ID
                          } // Ensure proper comparison of selected value
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6> {t("loadingLocation")}</h6>
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
                              placeholder={t("selectLoading")}
                              variant="outlined"
                            />
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value?.id
                          } // Compare option with the selected value
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>{t("portOfOrigins")}</h6>
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
                              placeholder={t("selectOrigin")}
                              variant="outlined"
                            />
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.port_id === value?.port_id
                          } // Compare option with the selected value
                        />
                      </div>
                      <div className="col-lg-3 form-group quotationSelectSer">
                        <h6> {t("portOfDestination")}</h6>

                        <Autocomplete
                          options={
                            ports?.map((v) => ({
                              id: v.port_id,
                              name: v.port_name,
                            })) || []
                          }
                          getOptionLabel={(option) => option.name || ""}
                          value={
                            computedState.destination_port_id
                              ? ports
                                ?.map((v) => ({
                                  id: v.port_id,
                                  name: v.port_name,
                                }))
                                .find(
                                  (v) =>
                                    v.id === computedState.destination_port_id
                                ) || null
                              : null
                          }
                          onChange={(e, newValue) =>
                            setState({
                              ...state,
                              destination_port_id: newValue?.id || null,
                            })
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={t("selectDestinationPort")}
                              variant="outlined"
                            />
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value?.id
                          }
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
                                  id:
                                    state.order_id ||
                                    selectedConsigneeData.Order_ID,
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
                          onChange={(e, newValue) =>
                            setState({
                              ...state,
                              liner_id: newValue?.id || null,
                            })
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Airline"
                              variant="outlined"
                            />
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value?.id
                          }
                        /> */}
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6> {t("transportation")}</h6>
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
                              placeholder={t("selectTransportation")}
                            />
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value?.id
                          }
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6> {t("clearance")}</h6>
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
                              placeholder={t("selectClearance")}
                            />
                          )}
                          isOptionEqualToValue={
                            (option, value) => option.id === value?.id // Ensure option matches value by id
                          }
                        />
                      </div>
                      <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                        <h6>{t("freightProvider")}</h6>
                        {/* <Autocomplete
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
                                  id: state.order_id || selectedConsigneeData.Order_ID,
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
                      <div className="col-lg-3 form-group">
                        <h6> {t("exRate")}</h6>
                        <input
                          type="number"
                          value={computedState.fx_rate}
                          onChange={handleChange}
                          name="fx_rate"
                        />
                      </div>
                      <div className="col-lg-2 form-group">
                        <h6> {t("markupRate")}</h6>
                        <div className="parentShip">
                          <div className="markupShip">
                            <input
                              type="number"
                              placeholder="0"
                              value={computedState.Q_Markup}
                              // value={state.mark_up || consigneeNew}
                              onChange={handleChange}
                              name="Q_Markup"
                            />
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
                              // value={state.rebate || consigneeNew1}
                              onChange={handleChange}
                              value={computedState.rebate}
                              name="rebate"
                            />
                          </div>
                          <div className="shipPercent">
                            <span>%</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-8">
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
                            <h6> {t("chargeVolume")}</h6>
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
                            <h6> {t("palletized")}</h6>
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
                            <h6> {t("precooling")}</h6>
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
                        </div>
                      </div>
                      <div className="col-lg-3 form-group">
                        <h6> {t("loadingDate")}</h6>

                        <DatePicker
                          selected={computedState.load_date}
                          onChange={(date) =>
                            handleChange({
                              target: {
                                name: "load_date",
                                value: date,
                              },
                            })
                          }
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
                          {/* {!isError && ( */}
                          <button
                            type="button"
                            onClick={() => {
                              if (!computedState.load_date) {
                                setShow1(true);
                              } else {
                                setSelectedDetails(null);
                                setToEditDetails({});
                                openModal();
                              }
                            }}
                          >
                            {t("add")}
                          </button>

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
                                    {t("quotationPopulate")}
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
                                  <label htmlFor=""> {t("netWeight")} </label>
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
                                      <h6> {t("rounding")}</h6>
                                      <Autocomplete
                                        options={RoundingDataList || []}
                                        getOptionLabel={(option) =>
                                          option?.DropDown || ""
                                        }
                                        value={
                                          (RoundingDataList || []).find(
                                            (item) =>
                                              item.ID === state5?.Rounding
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
                              className=""
                              onClick={handleSubmit3}
                            >
                              {t("lastPrice")}
                            </button>
                          </div>
                          {/* )} */}
                        </div>
                      )}
                      {isError && (
                        <div className="my-4 text-red-500">
                          <i className="mdi mdi-alert" /> {t("pleaseAdjustITF")}
                        </div>
                      )}
                      {isErrorCall && (
                        <div className="mt-4 text-red-500 w-100 text-center">
                          <i className="mdi mdi-alert" />
                          {t("pleaseCalError")}
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
                              <th>{t("actions")}</th>
                            </tr>
                          </thead>
                        )}

                        <tbody>
                          {details?.section5_Values?.map((v, i) => {
                            const isRed = +v.Box % 1 !== 0 || +v.cal_error == 1;

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
                                      return `${rawValue}%`;
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
              {(!isError && !isErrorCall) ? (
                <button
                  className="btn btn-primary"
                  type="submit"
                  name="signup"
                  onClick={createTestOrder}
                >
                  {t("create")}
                </button>
              ) : (
                ""
              )}
              <button
                className="btn btn-danger"
                type="button"
                // data-bs-toggle="modal"
                // data-bs-target="#exampleModal1"
                onClick={dataSubmit1}
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      </Card>
      {isOpenModal && (
        <div className="fixed inset-0 flex items-center justify-center modalEanEdit">
          <div
            className="fixed w-screen h-screen bg-black/20"
            onClick={closeModal}
          />
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

                <Select
                  value={selectedOption || null}
                  onChange={handleChangeSe}
                  options={options}
                  placeholder={t("selectItf")}
                  isClearable
                  styles={customStyles}
                  components={{ DropdownIndicator }}
                  classNamePrefix="react-select"
                />
              </div>
              <div className="form-group">
                <label> {t("quantity")}</label>
                <input
                  type="number"
                  value={
                    toEditDetails?.itf_quantity ?? defaultDetailsValue?.QTY ?? 0
                  }
                  name="itf_quantity"
                  onChange={updateDetails}
                />
              </div>
              <div className="form-group mb-3 quotationSelectSer">
                <h6>{t("brands")}</h6>

                <Autocomplete
                  disablePortal
                  options={brandNew?.map((v) => ({
                    id: v.ID,
                    name: v.Name_EN,
                  }))}
                  getOptionLabel={(option) => `${option.name}` || ""} // Display both name and id
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
                      placeholder={t("selectBrand")}
                    />
                  )}
                />
              </div>
              <div className="form-group mb-3 quotationSelectSer">
                <label> {t("unit")}</label>

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
                  getOptionLabel={(option) => `${option.name} ` || ""} // Display both name and id
                  value={
                    unit
                      ?.map((v) => ({
                        id: v.ID,
                        name: v.Name_EN,
                      }))
                      .find(
                        (item) =>
                          item.id ===
                          (toEditDetails?.itf_unit || defaultDetailsValue?.Unit)
                      ) || null
                  }
                  onChange={(event, newValue) => {
                    setToEditDetails((prev) => ({
                      ...prev,
                      itf_unit: newValue ? newValue.id : null,
                      unit_name_en: newValue ? newValue.name : null,
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
                <label> {t("adjustmentPrice")}</label>
                <input
                  type="number"
                  value={
                    toEditDetails?.adjusted_price ??
                    defaultDetailsValue?.Adjusted_Price ??
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
                {t("save")}
              </button>
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
                {massageShow ? massageShow : massageShow1 ? massageShow1 : ""}
              </p>
            </div>
          </div>
        </div>
      </Modal>

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
                {t("notes")}
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
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={dataSubmit1}
                className="btn btn-primary"
              >
                {t("ok")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal className="modalError" show={show} onHide={handleClose}>
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              {t("order")}
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
              {/* <div className="modal-header">
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                >
                  <i className="mdi mdi-close"></i>
                </button>
              </div> */}
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
                          {Object.keys(calculateListData?.header || {}).map(
                            (_, colIndex) => {
                              const colKey = `COL${colIndex + 1}`; // Dynamically build COL1, COL2, ...
                              return <td key={colKey}>{row[colKey] ?? ""}</td>;
                            }
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
              {t("quotationCheck")}
            </h1>
          </div>
          <div
            className="modal-body pt-0 pb-0"
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

export default CreateQuotationTest;
