import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import MySwal from "../../swal";
import { ComboBox } from "../combobox";
import { Button, Modal } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Select, { components } from "react-select";
import { FaCaretDown } from "react-icons/fa"; // Import an icon from react-icon
const UpdateQutoation = () => {
  const location = useLocation();
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [toEditDetails, setToEditDetails] = useState({});
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [tableAllData, setTableAllData] = useState([]);
  const [itfNew, setItfName] = useState([]);
  const [brandNew, setBrandNew] = useState([]);

  const [consigneeNew, setConsigneeNew] = useState();

  const [data, setData] = useState("");

  const [consignees, setConsignees] = useState([]);
  const [gross, setGross] = useState(false);
  const [freight, setFreight] = useState(false);
  const [grossMass, setGrossMass] = useState("");
  const [freightMass, setFreightMass] = useState("");
  const [massageShow, setMassageShow] = useState("");
  const [massageShow1, setMassageShow1] = useState("");
  console.log(massageShow);
  console.log(massageShow1);
  const navigate = useNavigate();
  const { from } = location.state || {};
  console.log(from);
  const isReadOnly = from?.isReadOnly;
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [calculateListData, setCalculateListData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => {
    setCalculateListData([]);
    setShowModal(false); // Hide the modal
  };
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
    quotation_id: from?.Quotation_ID,
    Quote_Number: from?.Quotation_number,
    user_id: localStorage.getItem("id"),
    brand_id: from?.Brand_ID,
    client_id: from?.Client_ID,
    loading_location: from?.loading_location,
    Freight_provider_: from?.Q_Freight_Provider,
    liner_id: from?.Liner_ID,
    from_port_: from?.Origin_Port,
    destination_port_id: from?.Destination_Port,
    Clearance_provider: from?.Clearance_provider,
    Transportation_provider: from?.Q_Transportation_Provider,
    consignee_id: from?.Consignee_ID,
    fx_id: from?.FX_ID,
    mark_up: from?.Q_Markup,
    rebate: from?.rebate,
    palletized: from?.palletized,
    Chamber: from?.Chamber,
    nw: from?.Q_NW,
    gw: from?.Q_GW,
    box: from?.Q_Box,
    cbm: from?.Q_CBM,
    Items: from?.Q_Items,
    FOB: from?.Q_FOB,
    FREIGHT: from?.Q_FREIGHT,
    CNF: from?.CNF,
    CNF_FX: from?.Q_CNF,
    COMMISION_THB: from?.Q_Commission_THB,
    REBATE_THB: from?.Q_Rebate_THB,
    Order_profit: from?.Q_Profit_Percentage,

    load_date:
      from?.load_Before_date &&
      !isNaN(new Date(from.load_Before_date.split("-").reverse().join("-")))
        ? new Date(from.load_Before_date.split("-").reverse().join("-"))
            .toISOString()
            .slice(0, 10)
        : "",

    fx_rate: "",
  });

  console.log(state);
  const handleChange = (event) => {
    // if (isReadOnly || isLoading) return;
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
  const { data: quote } = useQuery("getAllQuotation");
  const { data: transport } = useQuery("getTransportation_Supplier");
  const { data: consignee } = useQuery("getConsignee");
  const { data: currency } = useQuery("getCurrency");
  const { data: unit } = useQuery("getAllUnit");
  const { data: itf } = useQuery("getItf");
  useEffect(() => {
    quotationTableData();
    getSummary();
    getQuotationDetails();
    getToCopyDetails();
  }, [state.quotation_id, grossMass, freightMass]);
  const [editValues, setEditValues] = useState([]);
  const handleEditValues = (index, e) => {
    if (isReadOnly || isLoading) return;
    const newEditProduce = [...editValues];
    newEditProduce[index][e.target.name] = e.target.value;
    setEditValues(newEditProduce);
  };
  const getQuotationDetails = () => {
    if (!state.quote_id) return;
    axios
      .get(`${API_BASE_URL}/getQuotationDetials?quote_id=${state.quote_id}`)
      .then((response) => {
        if (response.data.data.length) setEditValues(response.data.data);
      });
  };
  const [formValues, setFormValues] = useState([
    {
      ITF: "",
      itf_quantity: 0,
      itf_unit: "",
      Number_of_boxes: "",
      net_weight: "",
      exw_cost: "",
      cbm: "",
      calculated_price: 0,
    },
  ]);
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
  const { data: details, refetch: getOrdersDetails } = useQuery(
    `getQuotationDetailsView?quotation_id=${state.quotation_id}`,
    {
      enabled: !!state.quotation_id,
    }
  );
  const oneQoutationDAta = () => {
    axios
      .post(`${API_BASE_URL}/getoneQuotationData`, {
        quotation_id: state.quotation_id,
      })
      .then((res) => {
        console.log(res);
        setData(res?.data?.data[0]);
        // setData(res.data.data);
      })
      .catch((error) => {
        console.log("There was an error fetching the data!", error);
      });
  };
  useEffect(() => {
    oneQoutationDAta();
  }, [state.quotation_id]);
  console.log(from?.quotation_id);

  console.log(details);
  useEffect(() => {
    if (state.quotation_id) getOrdersDetails();
  }, []);
  console.log(details);
  const defaultDetailsValue = useMemo(() => {
    return details?.[selectedDetails] || null;
  }, [selectedDetails]);
  console.log(defaultDetailsValue);

  const updateDetails = (e) => {
    if (isReadOnly || isLoading) return;
    setToEditDetails((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  };
  // const saveNewDetails = async () => {
  //   const values = {
  //     ...toEditDetails,
  //     user: localStorage.getItem("id"),

  //     ITF: toEditDetails?.ITF ?? defaultDetailsValue?.ITF ?? undefined,
  //     Quantity: toEditDetails?.Quantity ?? defaultDetailsValue?.itf_quantity,
  //     Unit: toEditDetails?.Unit ?? defaultDetailsValue?.itf_unit,
  //     quotation_price:
  //       toEditDetails?.quotation_price ??
  //       defaultDetailsValue?.Quotation_price ??
  //       0,
  //     qod_id: defaultDetailsValue?.qod_id || undefined,
  //     // od_id:"91",

  //     Brand: toEditDetails?.Brand ?? defaultDetailsValue?.brand ?? undefined,
  //     is_changed: true,
  //   };
  //   // if (!values.ITF || !values.Quantity || !values.Unit)
  //   //   return toast.error("Please fill all fields");
  //   loadingModal.fire();
  //   closeModal();
  //   try {
  //     const { data } = await axios.post(
  //       `${API_BASE_URL}/insertQuotationDetails`,
  //       {
  //         input: {
  //           ...computedState,
  //           user: localStorage.getItem("id"),
  //           palletized: !!computedState.palletized,
  //           Chamber: !!computedState.Chamber,
  //         },
  //         details: values,
  //       }
  //     );
  //     console.log("Response:", data); // Add this line to log the response

  //     // console.log(data.order_id)
  //     // getSummary();
  //     // getOrdersDetails();
  //     // quotationTableData();

  //     if (data.success == false) {
  //       setOrderId(data?.order_id);

  //       setShow(true);
  //       setMassageShow1(data.message);
  //       getSummary();
  //       getOrdersDetails();
  //       // quotationTableData();
  //     } else if (data.success == true) {
  //       setOrderId(data?.order_id);

  //       toast.success("Quotation detail added successfully");
  //       getSummary();
  //       getOrdersDetails();
  //       // quotationTableData();
  //     }
  //     // if ((gross && freight) || gross || freight) {
  //     //   setShow(true);
  //     // } else {
  //     //   setShow(false);
  //     // }
  //     setState((prevState) => {
  //       return {
  //         ...prevState,
  //         quotation_id: data.insertId,
  //       };
  //     });
  //     // MySwal.close();
  //     // closeModal();
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
    const values = {
      ...toEditDetails,
      user: localStorage.getItem("id"),
      ITF: toEditDetails?.ITF ?? defaultDetailsValue?.ITF ?? undefined,
      Quantity: toEditDetails?.Quantity ?? defaultDetailsValue?.QOD_QTY,
      Unit: toEditDetails?.Unit ?? defaultDetailsValue?.QOD_Unit,
      quotation_price:
        toEditDetails?.quotation_price ??
        defaultDetailsValue?.Quotation_price ??
        0,
      qod_id: defaultDetailsValue?.QOD_ID || undefined,
      Brand:
        toEditDetails?.Brand ?? defaultDetailsValue?.QOD_Brand ?? undefined,
      is_changed: true,
    };

    loadingModal.fire();
    closeModal();

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/insertQuotationDetails`,
        {
          input: {
            ...computedState,
            user: localStorage.getItem("id"),
            palletized: !!computedState.palletized,
            Chamber: !!computedState.Chamber,
          },
          details: values,
        }
      );

      console.log("Response:", data); // Logging the response

      if (data.success == false) {
        // setOrderId(data?.order_id);
        setShow(true);
        setMassageShow1(data.message);
      } else if (data.success == true) {
        // setOrderId(data?.order_id);
        toast.success("Quotation detail added successfully");

        setState((prevState) => ({
          ...prevState,
          quotation_id: data.insertId,
        }));
      }

      getSummary();
      getOrdersDetails();
      oneQoutationDAta();
      quotationTableData();
    } catch (e) {
      console.error(
        "Error response:",
        e.response ? e.response.data : e.message
      ); // Improved error logging
      MySwal.close();
      closeModal();
      toast.error("Something went wrong");
    } finally {
      MySwal.close();
      closeModal();
    }
  };

  const addFieldHandleChange = (i, e) => {
    if (isReadOnly || isLoading) return;
    const newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  const addFormFields = () => {
    if (isReadOnly || isLoading) return;
    setFormValues([
      ...formValues,
      {
        ITF: "",
        itf_quantity: 0,
        itf_unit: "",
        Number_of_boxes: "",
        net_weight: "",
        exw_cost: "",
        calculated_price: 0,
        cbm: "",
      },
    ]);
  };

  const removeFormFields = (i) => {
    if (isReadOnly || isLoading) return;
    const newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };
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
    r.mark_up = r.mark_up || consigneeNew || quoteFind?.profit;
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
  console.log(computedState);
  const update = () => {
    if (isReadOnly || isLoading) return;
    setIsLoading(true);
    loadingModal.fire();

    axios
      .post(`${API_BASE_URL}/updateQuotation`, computedState)
      .then(async (response) => {
        console.log(response);
        // let modalElement = document.getElementById("exampleQuo");
        // let modalInstance = bootstrap.Modal.getInstance(modalElement);

        if (response.data.success == false) {
          setShow(true);
          // modalInstance.show();
          setMassageShow(response.data.message);
        } else if (response.data.success == true) {
          // modalInstance.hide();
          setShow(false);
          toast.success("Update Quotation Successfully", {
            autoClose: 1000,
            theme: "colored",
          });
          navigate("/quotation");
        }
      })
      .catch((e) => {
        toast.error("Something went wrong", {
          autoClose: 1000,
          theme: "colored",
        });
      })
      .finally(() => {
        setIsLoading(false);
        MySwal.close();
      });
  };
  const [summary, setSummary] = useState({});
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
  const getSummary = () => {
    if (!state.quotation_id) return;
    axios
      .get(`${API_BASE_URL}/getQuotationSummary?quote_id=${state.quotation_id}`)
      .then((response) => {
        console.log(response);
        setSummary(response.data.data);
      });
  };
  const deleteQuotationInput = (id, qid) => {
    console.log(id);
    console.log(qid);
    if (isReadOnly || isLoading) return;
    setIsLoading(true);
    axios
      .post(`${API_BASE_URL}/deleteQuotationDetials`, {
        qod_id: id,
        quotation_id: qid,

        user_id: localStorage.getItem("id"),
      })
      .then(async (response) => {
        console.log(response);

        if (response.data.success == false) {
          setShow(true);
          setMassageShow1(response.data.message);
        } else if (response.data.success == true) {
          setShow(false);
          toast.success("Deleted", {
            autoClose: 1000,
            theme: "colored",
          });
        }

        getOrdersDetails();
        oneQoutationDAta();
        quotationTableData();
        setEditValues((prevState) => {
          const copyFrom = [...prevState];
          copyFrom.splice(id, 1);
          return copyFrom;
        });
      })
      .catch((e) => {
        toast.error("Something went wrong", {
          autoClose: 1000,
          theme: "colored",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const quotationTableData = () => {
    axios
      .post(`${API_BASE_URL}/getQuotationDetailsView`, {
        quotation_id: state.quotation_id,
      })
      .then((response) => {
        console.log(response.data.data, "this is table");
        setTableAllData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getToCopyDetails = () => {
    if (!from?.to_copy_id) return;
    axios
      .get(`${API_BASE_URL}/getQuotationDetials?quote_id=${from?.to_copy_id}`)
      .then((response) => {
        setFormValues(response.data.data);
      });
  };
  console.log(details);

  const calculateList = async () => {
    if (state.quotation_id) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/QuotationCostModal`,
          {
            quotation_id: state.quotation_id,
          }
        );
        console.log(response);

        setCalculateListData(response.data.data);
      } catch (e) {
        console.error("Something went wrong", e);
      }
    }
  };

  const calculate = async () => {
    console.log(details);
    const reai = details?.filter((v) => v.ITF && v.QOD_QTY && v.QOD_Unit);
    console.log(reai);
    if (reai.length == 0) return;
    setIsLoading(true);
    loadingModal.fire();
    try {
      const { data } = await axios.post(`${API_BASE_URL}/calculateQuotation`, {
        input: {
          ...computedState,
          user: localStorage.getItem("id"),
          palletized: !!computedState.palletized,
          Chamber: !!computedState.Chamber,
        },
        details: details?.filter((v) => v.ITF && v.QOD_QTY && v.QOD_Unit),
      });
      console.log(data);

      if (data.success == false) {
        calculateList();
        setShow(true);
        setShowModal(false);

        setMassageShow1(data.message);
        getOrdersDetails();
        oneQoutationDAta();
        getSummary();
      } else if (data.success == true) {
        calculateList();
        // modalInstance.hide();
        setShow(false);
        getOrdersDetails();
        oneQoutationDAta();
        getSummary();
        toast.success("Quotation Calculated successfully", {
          autoClose: 1000,
          theme: "colored",
        });
        setShowModal(true);
      }

      setState((prevState) => {
        return {
          ...prevState,
          order_id: data.data,
        };
      });
      await getOrdersDetails(data.data);
      MySwal.close();
      setIsLoading(false);
      getSummary();
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      MySwal.close();
      setIsLoading(false);
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
  const newItfList1 = async () => {
    if (state.consignee_id) {
      try {
        const response = await axios.post(`${API_BASE_URL}/QuotationMarkup`, {
          Consignee_id: state.consignee_id,
        });
        console.log(response.data); // Log the response data
        setConsigneeNew(response.data.Quotation_Markup);
        // Update state or perform other actions with response data if needed
      } catch (e) {
        console.log("Error:", e);
        // toast.error("Something went wrong");
      }
    }
  };
  useEffect(() => {
    newItfList();
    newItfList1();
    newBrandList();
  }, [state.consignee_id]);

  const reCalculate = () => {
    setIsLoading(true);
    loadingModal.fire();

    axios
      .post(`${API_BASE_URL}/RecalculateQuotation`, {
        quotation_id: from?.Quotation_ID,
        user_id: localStorage.getItem("id"),
      })
      .then((response) => {
        console.log("data", response);

        // toast.success("Quotation Calculated successfully", {
        //   autoClose: 1000,
        //   theme: "colored",
        // })

        if (response.data.success == false) {
          setShow(true);
          // modalInstance.show();
          setMassageShow1(response.data.message);
          getOrdersDetails();
          oneQoutationDAta();
          getSummary();
        } else if (response.data.success == true) {
          setShow(false);
          getOrdersDetails();
          oneQoutationDAta();
          getSummary();
        }
      })
      .catch((error) => {
        // MySwal.close();
        // closeModal();
        toast.error("Something went wrong");

        console.log("recalculate data catch code", error);
      })
      .finally(() => {
        setIsLoading(false);
        calculate();
        // newRecalculateQuotation();
        loadingModal.close();
      });
  };

  const newRecalculateQuotation = () => {
    setIsLoading(true);
    loadingModal.fire();

    axios
      .post(`${API_BASE_URL}/newRecalculateQuotation`, {
        quotation_id: from?.Quotation_ID,
        user_id: localStorage.getItem("id"),
      })
      .then((response) => {
        console.log("newRecalculateQuotation data", response);

        if (response.data.success) {
          toast.success("New Quotation Calculated successfully", {
            autoClose: 1000,
            theme: "colored",
          });
        } else {
          toast.error("New Quotation Calculation failed", {
            autoClose: 1000,
            theme: "colored",
          });
        }
      })
      .catch((error) => {
        console.log("newRecalculateQuotation data catch code", error);
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
        loadingModal.close();
      });
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
  console.log(defaultDetailsValue?.Quotation_price);

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
      <Card title={`Quotation Management / Update Form`}>
        <div className="formCreate px-4">
          <form action="">
            <div className="row formEan">
              <div className="col-lg-3 form-group">
                <h6> Create Date </h6>
                <input
                  type="date"
                  name="created"
                  onChange={handleChange}
                  value={computedState.created}
                />
              </div>
            </div>
            <div className="row formEan quotationRowDro">
              <div className="col-lg-3 form-group quotationSelectSer">
                <h6>Client</h6>
                <div className="  ">
                  <Autocomplete
                    options={clients || []} // Ensure clients is an array even if undefined or null
                    getOptionLabel={(option) => option.client_name || ""} // Display the client name
                    value={
                      clients?.find(
                        (v) => v.client_id === computedState.client_id
                      ) || null
                    } // Find the selected client based on client_id
                    onChange={(event, newValue) => {
                      // Update the state when a new client is selected
                      setState((prevState) => ({
                        ...prevState,
                        client_id: newValue ? newValue.client_id : "", // If no value is selected, set an empty string
                      }));
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
                    } // Ensure proper comparison of selected value
                  />
                </div>
              </div>
              {/* <div className="col-lg-3 form-group">
                <h6>Consignee</h6>
                <div className="ceateTransport">
                  <select
                    value={computedState.consignee_id}
                    onChange={handleChange}
                    name="consignee_id"
                  >
                    <option>Select Consignee</option>
                    {(consignee || [])
                      .filter((v) => v.client_id == state.client_id)
                      ?.map((v) => (
                        <option value={v.consignee_id}>
                          {v.consignee_name}
                        </option>
                      ))}
                  </select>
                </div>
              </div> */}
              <div className="col-lg-3 form-group mb-3 quotationSelectSer">
                <h6>Consignee</h6>
                <Autocomplete
                  options={consignees || []} // Ensure consignees is an array
                  getOptionLabel={(option) => option.consignee_name || ""} // Display the consignee name
                  value={
                    consignees?.find(
                      (v) => v.consignee_id === computedState.consignee_id
                    ) || null
                  } // Find the selected consignee
                  onChange={(event, newValue) => {
                    // Handle the change, updating relevant state fields when consignee is selected
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
                      consignee_id: newValue ? newValue.consignee_id : "", // Update the consignee_id
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
                  } // Compare consignee_id for equality
                />
              </div>
              <div className="col-lg-3 form-group quotationSelectSer">
                <h6>Brands</h6>
                <div>
                  <Autocomplete
                    options={brands || []} // Ensure brands is an array
                    getOptionLabel={(option) => option.Brand_name || ""} // Display the Brand name
                    value={
                      brands?.find(
                        (v) => v.brand_id === computedState.brand_id
                      ) || null
                    } // Find the selected brand by brand_id
                    onChange={(event, newValue) => {
                      // Handle the change and update the brand_id in the state
                      setState({
                        ...state,
                        brand_id: newValue ? newValue.brand_id : "", // Set the brand_id from the selected brand
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
              </div>
              <div className="col-lg-3 form-group quotationSelectSer">
                <h6>Currency</h6>
                <Autocomplete
                  options={currency || []} // Ensure currency is an array
                  getOptionLabel={(option) => option.currency || ""} // Display the currency name
                  value={
                    currency?.find(
                      (v) => v.currency_id === computedState.fx_id
                    ) || null
                  } // Find the selected currency by fx_id
                  onChange={(event, newValue) => {
                    // Update the state when a new currency is selected
                    setState({
                      ...state,
                      fx_id: newValue ? newValue.currency_id : "", // Set the currency_id
                    });
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
                  } // Compare based on currency_id
                />
                {/* <div className="ceateTransport">
                  <select
                    value={computedState.fx_id}
                    onChange={handleChange}
                    name="fx_id"
                  >
                    <option>Select Currency</option>
                    {currency?.map((v) => (
                      <option value={v.fx_id}>{v.currency}</option>
                    ))}
                  </select>
                </div> */}
              </div>
              <div className="col-lg-3 form-group quotationSelectSer">
                <h6>Loading Location</h6>
                <div className=" ">
                  <Autocomplete
                    options={locations || []} // Ensure locations is an array
                    getOptionLabel={(option) => option.name || ""} // Display the location name
                    value={
                      locations?.find(
                        (v) => v.id === computedState.loading_location
                      ) || null
                    } // Find the selected location by id
                    onChange={(event, newValue) => {
                      // Handle the change and update the loading_location in the state
                      setState({
                        ...state,
                        loading_location: newValue ? newValue.id : "", // Set the location id from the selected location
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Loading Location"
                        variant="outlined"
                      />
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value?.id
                    } // Compare based on location id
                  />
                </div>
              </div>
              <div className="col-lg-3 form-group quotationSelectSer">
                <h6>Port of Origin</h6>
                <div>
                  <Autocomplete
                    options={ports || []} // Ensure ports is an array (handles null/undefined)
                    getOptionLabel={(option) => option.port_name || ""} // Display the port name
                    value={
                      ports?.find(
                        (v) => v.port_id === computedState.from_port_
                      ) || null
                    } // Match the selected port based on port_id
                    onChange={(event, newValue) => {
                      // Handle the change, update the from_port_ in the state with the selected port's port_id
                      setState({
                        ...state,
                        from_port_: newValue ? newValue.port_id : "", // If no port is selected, set to empty string
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
                    } // Ensure option comparison based on port_id
                  />
                </div>
              </div>
              <div className="col-lg-3 form-group quotationSelectSer">
                <h6>Port of Destination</h6>
                <div className=" ">
                  <Autocomplete
                    options={ports || []} // Ensure ports is an array (handles null/undefined)
                    getOptionLabel={(option) => option.port_name || ""} // Display the port name
                    value={
                      ports?.find(
                        (v) => v.port_id === computedState.destination_port_id
                      ) || null
                    } // Match the selected destination port
                    onChange={(event, newValue) => {
                      // Handle the change, update the destination_port_id in the state with the selected port's port_id
                      setState({
                        ...state,
                        destination_port_id: newValue ? newValue.port_id : "", // Set the port_id from the selected port
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Destination"
                        variant="outlined"
                      />
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option.port_id === value?.port_id
                    } // Compare based on port_id
                  />
                </div>
              </div>
              <div className="col-lg-3 form-group quotationSelectSer mb-3">
                <h6>Airline</h6>
                <div className=" ">
                  <Autocomplete
                    options={liners || []} // Ensure liners is an array (handles null/undefined)
                    getOptionLabel={(option) => option.liner_name || ""} // Display the liner name
                    value={
                      liners?.find(
                        (v) => v.liner_id === computedState.liner_id
                      ) || null
                    } // Match the selected liner
                    onChange={(event, newValue) => {
                      setState({
                        ...state,
                        liner_id: newValue ? newValue.liner_id : "", // Set the liner_id from the selected liner
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Airline"
                        variant="outlined"
                      />
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option.liner_id === value?.liner_id
                    } // Compare based on liner_id
                  />
                </div>
              </div>
              <div className="col-lg-3 form-group quotationSelectSer">
                <h6>Transportation</h6>
                <div className=" ">
                  <Autocomplete
                    options={transport || []} // Ensure transport is an array (handles null/undefined)
                    getOptionLabel={(option) => option.name || ""} // Display the transportation name
                    value={
                      transport?.find(
                        (v) =>
                          v.Transportation_provider ===
                          computedState.Transportation_provider
                      ) || null
                    } // Find the selected transportation provider
                    onChange={(event, newValue) => {
                      // Handle the change, update the transportation_provider in the state with the selected provider's ID
                      setState({
                        ...state,
                        Transportation_provider: newValue
                          ? newValue.Transportation_provider
                          : "", // Set the provider ID from the selected item
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Transportation"
                        variant="outlined"
                      />
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option.Transportation_provider ===
                      value?.Transportation_provider
                    } // Compare based on Transportation_provider ID
                  />
                </div>
              </div>

              <div className="col-lg-3 form-group quotationSelectSer">
                <h6>Clearance</h6>
                <div className=" ">
                  <Autocomplete
                    options={clearance || []} // Ensure clearance is an array (handles null/undefined)
                    getOptionLabel={(option) => option.name || ""} // Display the clearance name
                    value={
                      clearance?.find(
                        (v) =>
                          v.Clearance_provider ===
                          computedState.Clearance_provider
                      ) || null
                    } // Find the selected clearance provider
                    onChange={(event, newValue) => {
                      // Handle the change, update the clearance_provider in the state with the selected provider's ID
                      setState({
                        ...state,
                        Clearance_provider: newValue
                          ? newValue.Clearance_provider
                          : "", // Set the provider ID from the selected item
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Clearance"
                        variant="outlined"
                      />
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option.Clearance_provider === value?.Clearance_provider
                    } // Compare based on Clearance_provider ID
                  />
                </div>
              </div>
              <div className="col-lg-3 form-group quotationSelectSer">
                <h6>Freight Provider</h6>
                <div className=" ">
                  <Autocomplete
                    options={freights || []} // Ensure freights is an array (handles null/undefined)
                    getOptionLabel={(option) => option.name || ""} // Display the freight provider's name
                    value={
                      freights?.find(
                        (v) =>
                          v.Freight_provider === computedState.Freight_provider_
                      ) || null
                    } // Find the selected freight provider
                    onChange={(event, newValue) => {
                      // Handle the change, update the Freight_provider_ in the state with the selected provider's ID
                      setState({
                        ...state,
                        Freight_provider_: newValue
                          ? newValue.Freight_provider
                          : "", // Set the provider ID from the selected item
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Freight"
                        variant="outlined"
                      />
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option.Freight_provider === value?.Freight_provider
                    } // Compare based on Freight_provider ID
                  />
                </div>
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

              {localStorage.getItem("level") !== "Level 5" && (
                <>
                  <div className="col-lg-3 form-group">
                    <h6>Markup Rate</h6>
                    <div className="parentShip">
                      <div className="markupShip">
                        <input
                          type="number"
                          defaultValue={
                            consigneeNew ? consigneeNew : computedState.mark_up
                          }
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
                          value={computedState.rebate}
                          onChange={handleChange}
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
                    <a> </a>
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
                <h6>Ship Before Date</h6>
                <input
                  type="date"
                  onChange={handleChange}
                  value={computedState.load_date}
                  name="load_date"
                />
              </div>
            </div>

            <div className="flex gap-2 items-center justify-between flex-wrap">
              {isReadOnly ? null : (
                <div className="addBtnEan flex flex-wrap gap-3 items-center mb-4">
                  <button type="button" onClick={() => calculate()}>
                    Calculate
                  </button>
                  {isReadOnly ? null : (
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
              {!isReadOnly ? null : (
                <div className="my-4 text-red-500">
                  <i className="mdi mdi-alert" /> Please adjust Select ITF to
                  complete a box
                </div>
              )}
              <div className="addBtnEan mb-4">
                <button type="button" onClick={reCalculate}>
                  Recalculate
                </button>
              </div>
            </div>
            {/* <div
              id="datatable_wrapper"
              className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive w-full"
            >
              <table
                id="example"
                className="display transPortCreate table table-hover table-striped borderTerpProduce table-responsive"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>ITF</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th> Number of Box</th>
                    <th>NW</th>
                    <th>Unit Price</th>
                    <th>Adjust Price</th>
                    <th>Profit</th>
                    {!isReadOnly && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {editValues?.map((v, i) => (
                    <tr
                      className="rowCursorPointer"
                      data-bs-toggle="modal"
                      data-bs-target="#myModal"
                    >
                      <td>
                        <select
                          onChange={(e) => handleEditValues(i, e)}
                          value={v.ITF}
                          name="ITF"
                          style={{ width: "280px" }}
                        >
                          <option value="">Select ITF</option>
                          {itf?.map((v) => (
                            <option value={v.itf_id}>{v.itf_name_en}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          onChange={(e) => handleEditValues(i, e)}
                          value={v.itf_quantity}
                          name="itf_quantity"
                          type="number"
                          placeholder="enter quantity"
                        />
                      </td>
                      <td>
                        <select
                          onChange={(e) => handleEditValues(i, e)}
                          value={v.itf_unit}
                          style={{ width: "100px" }}
                          name="itf_unit"
                        >
                          <option value="">Select Unit</option>
                          {unit?.map((v) => (
                            <option value={v.unit_id}>{v.unit_name_en}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          readOnly
                          value={v.Number_of_boxes}
                          style={{ width: "100px" }}
                        />
                      </td>
                      <td>
                        <input readOnly value={v.net_weight} />
                      </td>
                      <td>
                        <input type="number" value={v.calculated_price} />
                      </td>
                      <td>
                        <input
                          type="number"
                          onChange={(e) => handleEditValues(i, e)}
                          name="adjusted_price"
                          value={v.adjusted_price || 0}
                        />
                      </td>
                      <td>
                        <div className="flex border-2 border-[#203764] rounded-md overflow-hidden items-center">
                          <input
                            className="border-0 w-20 mb-0 !rounded-none"
                            type="number"
                            placeholder="0"
                            value={v.profit_percentage}
                          />
                          <span className="px-1.5 bg-gray-200 py-2">%</span>
                        </div>
                      </td>
                      {!isReadOnly && (
                        <td>
                          <button
                            type="button"
                            className="cursor-pointer"
                            onClick={() =>
                              MySwal.fire({
                                title: "Are you sure?",
                                text: "You won't be able to revert this!",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Yes, delete it!",
                              }).then((result) => {
                                if (result.isConfirmed) deleteQuotationInput(i);
                              })
                            }
                          >
                            <i className={"mdi mdi-minus text-2xl"} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {!isReadOnly &&
                    formValues?.map((v, i) => (
                      <tr
                        className="rowCursorPointer"
                        data-bs-toggle="modal"
                        data-bs-target="#myModal"
                      >
                        <td>
                          <select
                            onChange={(e) => addFieldHandleChange(i, e)}
                            value={v.ITF}
                            name="ITF"
                            style={{ width: "280px" }}
                          >
                            <option value="">Select ITF</option>
                            {itf?.map((v) => (
                              <option value={v.itf_id}>{v.itf_name_en}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            onChange={(e) => addFieldHandleChange(i, e)}
                            value={v.itf_quantity}
                            name="itf_quantity"
                            type="number"
                            placeholder="enter quantity"
                          />
                        </td>
                        <td>
                          <select
                            onChange={(e) => addFieldHandleChange(i, e)}
                            value={v.itf_unit}
                            style={{ width: "100px" }}
                            name="itf_unit"
                          >
                            <option value="">Select Unit</option>
                            {unit?.map((v) => (
                              <option value={v.unit_id}>
                                {v.unit_name_en}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            readOnly
                            value={v.Number_of_boxes}
                            style={{ width: "100px" }}
                          />
                        </td>
                        <td>
                          <input readOnly value={v.net_weight} />
                        </td>
                        <td>
                          <input type="number" value={v.calculated_price} />
                        </td>
                        <td>
                          <input
                            type="number"
                            onChange={(e) => addFieldHandleChange(i, e)}
                            name="adjusted_price"
                            value={v.adjusted_price || 0}
                          />
                        </td>
                        <td>
                          <div className="flex border-2 border-[#203764] rounded-md overflow-hidden items-center">
                            <input
                              className="border-0 w-24 mb-0 !rounded-none"
                              type="number"
                              placeholder="0"
                              value={v.profit_percentage}
                            />
                            <span className="px-1.5 bg-gray-200 py-2">%</span>
                          </div>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="cursor-pointer"
                            onClick={() => removeFormFields(i)}
                          >
                            <i className={"mdi mdi-minus text-2xl"} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div> */}
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
                        +v.QOD_Box % 1 != 0
                          ? "bg-red-500/50 [&>td]:!text-red-900"
                          : "",
                      ].join(" ")}
                    >
                      <td>{v.itf_name_en}</td>
                      <td>{v.brand_name}</td>
                      <td>{v.QOD_QTY}</td>
                      <td>{v.unit_name_en}</td>
                      <td>{v.QOD_Box}</td>
                      <td>{v.QOD_NW}</td>
                      <td>{v.Calculated_price ? v.Calculated_price : ""}</td>
                      <td>
                        {v.QOD_QP ? v.QOD_QP : ""}
                        {/* {(+v.adjusted_price || 0).toLocaleString()} */}
                      </td>

                      {!(
                        (localStorage.getItem("level") === "Level 1" &&
                          localStorage.getItem("role") === "Admin") ||
                        localStorage.getItem("level") === "Level 5"
                      ) && <td>{v.QOD_Profit_Percentage}%</td>}

                      <td>
                        {!isReadOnly && (
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
                              onClick={() =>
                                MySwal.fire({
                                  title: "Are you sure?",
                                  text: "You won't be able to revert this!",
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonColor: "#3085d6",
                                  cancelButtonColor: "#d33",
                                  confirmButtonText: "Yes, delete it!",
                                }).then((result) => {
                                  if (result.isConfirmed)
                                    deleteQuotationInput(
                                      v.QOD_ID,
                                      v.Quotation_ID
                                    );
                                })
                              }

                              // onClick={() => {
                              //   deleteQuotationInput(v.qod_id);
                              // }}
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
          </form>
        </div>

        {/* {isReadOnly ? null : (
				<div className="addBtnEan px-4">
					<button className="mt-0" type="button" onClick={addFormFields}>
						Add
					</button>
				</div>
			)} */}

        <div className="row py-4 px-4">
          <div className="col-lg-3">
            <div>
              <b> Total NW : </b>
              {(+data?.Q_NW || 0).toLocaleString()}
            </div>
            <div className="">
              <b> Total GW : </b>
              {(+data?.Q_GW || 0).toLocaleString()}
            </div>
            <div>
              <b> Total Box : </b>
              {(+data?.Q_Box || 0).toLocaleString()}
            </div>
            <div>
              <b> Total CBM : </b>
              {(+data?.Q_CBM || 0).toLocaleString()}
            </div>
            <div>
              <b> Total ITF : </b>
              {(+data?.Q_Items || 0).toLocaleString()}
            </div>
          </div>

          <div className="col-lg-3">
            <div>
              <b>Freight : </b>
              {(+data?.Q_FREIGHT || 0).toLocaleString()}
            </div>
            <div>
              <b>Transport : </b>
              {(+data?.Q_Transport || 0).toLocaleString()}
            </div>
            <div>
              <b>Clearance : </b>
              {(+data?.Q_Clearance || 0).toLocaleString()}
            </div>
          </div>
          <div className="col-lg-3">
            <div>
              <b>Total FOB : </b>
              {(+data?.Q_FOB || 0).toLocaleString()}
            </div>
            <div className=" ">
              <b>Total CNF : </b>
              {(+data?.Q_CNF || 0).toLocaleString()}
            </div>

            {localStorage.getItem("level") !== "Level 5" && (
              <>
                <div className=" ">
                  <b>Total Profit : </b>
                  {(+data?.Q_Profit || 0).toLocaleString()}
                </div>

                <div className="">
                  <b style={{ marginLeft: "2px" }}>Profit % : </b>
                  {(+data?.Q_Profit_Percentage || 0).toLocaleString()}
                </div>
              </>
            )}
          </div>

          <div className="col-lg-3">
            <b>Total CNF FX : </b>
            {(+data?.Q_CNF_FX || 0).toLocaleString()}
            <div>
              <b>Total Commission FX : </b>
              {(+data?.Q_Commission_FX || 0).toLocaleString()}{" "}
            </div>
            <div className="">
              <b>Total Rebate FX : </b>
              {(+data?.Q_Rebate_FX || 0).toLocaleString()}
            </div>
          </div>
        </div>
        <div className="card-footer">
          {!isReadOnly ? (
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
      </Card>
      {isOpenModal && (
        <div className="fixed inset-0 flex items-center justify-center modalEanEdit">
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
                    toEditDetails?.Quantity ?? defaultDetailsValue?.QOD_QTY ?? 0
                  }
                  name="Quantity"
                  onChange={updateDetails}
                />
              </div>
              <div className="form-group mb-3 quotationSelectSer">
                <label>Unit</label>
                {/* <Autocomplete
                  disablePortal
                  options={
                    unit?.map((v) => ({
                      id: v.unit_id,
                      name: v.unit_name_en,
                    })) || []
                  } // Fallback to an empty array if `unit` is undefined
                  getOptionLabel={(option) => option.name || ""}
                  value={
                    unit
                      ?.map((v) => ({ id: v.unit_id, name: v.unit_name_en }))
                      .find(
                        (item) =>
                          item.id ===
                          (toEditDetails?.Unit ?? defaultDetailsValue?.QOD_Unit)
                      ) || null
                  }
                  onChange={(event, newValue) => {
                    setToEditDetails((prev) => ({
                      ...prev,
                      Unit: newValue ? newValue.id : null, // Save the `id` of the selected item
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
                  value={
                    unit?.find(
                      (item) =>
                        item.unit_id ===
                        (toEditDetails?.Unit ?? defaultDetailsValue?.QOD_Unit)
                    ) || null
                  } // Match the selected value based on `unit_id`
                  onChange={(event, newValue) => {
                    setToEditDetails((prev) => ({
                      ...prev,
                      Unit: newValue ? newValue.unit_id : "", // Update `Unit` with the selected item's `unit_id`
                    }));
                  }}
                  options={
                    unit
                      ? unit.map((v) => ({
                          unit_id: v.unit_id,
                          unit_name_en: v.unit_name_en,
                        }))
                      : []
                  } // Map `unit` array to structured options, fallback to empty array
                  getOptionLabel={(option) => option?.unit_name_en || ""} // Display `unit_name_en` for each option
                  isOptionEqualToValue={(option, value) =>
                    option.unit_id === value?.unit_id
                  } // Ensure the option matches the selected value by `unit_id`
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
              <div className="form-group mb-3 quotationSelectSer">
                <h6>Brands</h6>
                {/* <Autocomplete
                  disablePortal
                  options={
                    brandNew?.map((v) => ({
                      id: v.brand_id,
                      name: v.Brand_name,
                    })) || []
                  } // Fallback to an empty array if `brandNew` is undefined
                  getOptionLabel={(option) => option.name || ""}
                  value={
                    brandNew
                      ?.map((v) => ({ id: v.brand_id, name: v.Brand_name }))
                      .find(
                        (item) =>
                          item.id ===
                          (toEditDetails?.Brand ??
                            defaultDetailsValue?.QOD_Brand)
                      ) || null
                  }
                  onChange={(event, newValue) => {
                    setToEditDetails((prev) => ({
                      ...prev,
                      Brand: newValue ? newValue.id : null, // Save the `id` of the selected brand
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
                  value={
                    brandNew?.find(
                      (item) =>
                        item.brand_id ===
                        (toEditDetails?.Brand ?? defaultDetailsValue?.QOD_Brand)
                    ) || null
                  } // Match the selected value based on `brand_id`
                  onChange={(event, newValue) => {
                    setToEditDetails((prev) => ({
                      ...prev,
                      Brand: newValue ? newValue.brand_id : "", // Update `Brand` with the selected item's `brand_id`
                    }));
                  }}
                  options={
                    brandNew
                      ? brandNew.map((v) => ({
                          brand_id: v.brand_id,
                          Brand_name: v.Brand_name,
                        }))
                      : []
                  } // Map `brandNew` array to structured options, fallback to empty array
                  getOptionLabel={(option) => option?.Brand_name || ""} // Display `Brand_name` for each option
                  isOptionEqualToValue={(option, value) =>
                    option.brand_id === value?.brand_id
                  } // Ensure the option matches the selected value by `brand_id`
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

              <div className="form-group">
                <label>Adjustment price</label>
                <input
                  type="number"
                  value={
                    toEditDetails?.quotation_price ??
                    defaultDetailsValue?.Quotation_price ??
                    0
                  }
                  name="quotation_price"
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
              <p style={{ color: "#631f37" }}>
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

export default UpdateQutoation;
