import axios from "../../Url/Api";
import React, { useEffect, useState, useRef } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import { ComboBox } from "../combobox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Button, Modal } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close";
import Select, { components } from "react-select";
import { FaCaretDown } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
const CreatePurchaseOrder = () => {
  const { t, i18n } = useTranslation("global");
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
  const [paymentSections, setPaymentSections] = useState({
    labels: {},
    data: {},
  });
  const [hasUserChangedValues, setHasUserChangedValues] = useState(false);
  const [basePayment, setBasePayment] = useState(0); // from left_pay
  const [roundingNew, setRoundingNew] = useState("0");
  const [singlePodId, setSinglePodId] = useState("");
  const [singleDataSet, setSingleDataSet] = useState("");
  const [totalBeforText, setTotalBeforText] = useState("0");
  const [singleDataSet1, setSingleDataSet1] = useState("");
  const [depositValue, setDepositValue] = useState("");
  const [buttonClicked, setButtonClicked] = React.useState(false);
  const [responceId, setResponceId] = useState("");
  const location = useLocation();
  const [dropdownItems, setDropdownItems] = useState([]);
  const { from } = location.state || {};
  console.log(from);
  const [selectedPaymentDate, setSelectedPaymentDate] = useState(null);
  const { data: paymentChannle } = useQuery("PaymentChannela");
  const [selectedPaymentChannel, setSelectedPaymentChannel] = useState("");
  const [bankReference, setBankReference] = useState("");
  const [bankChargeAmount, setBankChargeAmount] = useState("0");
  const [depositAvailable, setDepositAvailable] = useState("");
  const [roundingAmount, setRoundingAmount] = useState("0");
  const [totalPaymentAmount, setTotalPaymentAmount] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [payableDATA, setPayableData] = useState("");
  const [singleDataShow, setSingleDataShow] = useState("");
  const [show2, setShow2] = useState(false);
  const [show1, setShow1] = useState(false);
  const [stock1, setStock1] = useState("");
  const [depositAvailableNew, setDepositAvailableNew] = useState("");
  const [paymentAmmountNew, setPaymentAmmountNew] = useState("");
  const [procesureResult, setProcesureResult] = useState("");
  const [amountToPayNew, setAmountToPayNew] = useState("");
  const [depositUsedNew, newDepositUsedNew] = useState("");
  const [vatNew, setVatNew] = useState("");
  const [whtNew, setWhtNew] = useState("");
  const [roundingNew1, setRoundingNew1] = useState("0");

  const [leftRoundingNew, setLeftRoundingNew] = useState("");
  console.log(from);
  const inputRef = useRef(null); // Ref for input field
  const formatterTwo = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [stock, setStock] = useState("");
  const [color, setColor] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [details, setDetails] = React.useState([]);
  const [podId, setPodId] = useState("");
  const [tableSummary, setTableSummary] = useState("");
  const handleClose2 = () => setShow2(false);
  const closeIcon2 = () => {
    setShow2(false);
    // navigate("/purchase_orders");
  };

  // useEffect(() => {
  //   if (from?.PO_ID) {
  //     const postAccessData = async () => {
  //       try {
  //         const response = await axios.post(
  //           `${API_BASE_URL}/updateaccessfile`,
  //           {
  //             id: from.PO_ID,
  //             type: 1,
  //             accesstype: 1,
  //           }
  //         );
  //         console.log("Access updated:", response.data);
  //       } catch (error) {
  //         console.error("Error updating access file:", error);
  //       }
  //     };

  //     postAccessData();
  //   }
  // }, [from?.PO_ID]);
  const getDetils = (podId) => {
    const idToUse = podId || from?.PO_ID;
    axios
      .get(`${API_BASE_URL}/getPurchaseOrderDetails?po_id=${idToUse}`)
      .then((response) => {
        console.log(response);
        setTableSummary(response.data.data1);
        const mappedData = response.data.data.map((item) => ({
          pod_status: item.Receiving_Status,
          pod_id: item.POD_ID,
          pod_code: item.PODCODE,
          pod_type_id: item.Item,
          dropDown_id: item.Item,
          produce_name_en: item.Name_EN,
          pod_quantity: item.Qty,
          unit_count_id: item.Unit,
          Unit_Name_EN: item.Unit_Name_EN,
          Unit_Name_TH: item.Unit_Name_TH,
          item_Name_EN: item.Name_EN,
          item_Name_TH: item.Name_TH,
          pod_price: item.pod_price,
          pod_vat: item.VAT_value,
          pod_wht_id: item.WHT_value,
          pod_crate: item.Crates,
        }));
        setDetails(mappedData);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return "";
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };
  const handlePaymentChange = (field, value) => {
    // Update state
    switch (field) {
      case "Payment_Date":
        setSelectedPaymentDate(value);
        break;
      case "Payment_Channel":
        setSelectedPaymentChannel(value);
        break;
      case "Bank_Ref":
        setBankReference(value);
        break;
      case "Bank_Fees":
        setBankChargeAmount(value);
        break;
      case "available_Deposit":
        setDepositAvailableNew(value);
        break;
      case "Rounding":
        setRoundingNew(value);
        break;
      case "Payment_Amount":
        setPaymentAmmountNew(value);
        break;
      case "Notes":
        setPaymentNotes(value);
        break;
      default:
        break;
    }

    // Build payload with only the changed field
    const payload = {
      Expense_Payment_ID: singleDataSet,
      User_ID: localStorage.getItem("id"),
      [field]: value, // ✅ only the changed field gets sent
    };

    axios
      .post(`${API_BASE_URL}/POCPNPayment`, payload)
      .then((res) => {
        console.log(`✅ Updated ${field}:`, res.data);
        if (res?.data?.success) {
          toast.success(res?.data?.message || "Field updated successfully ✅");
        }
        refreshDepositValue(singleDataSet1);
        paymentViewSection();
      })
      .catch((err) => {
        console.error(`❌ Failed to update ${field}:`, err);
      });
  };

  const handleChangeAmount = (e) => {
    const input = e.target;
    const cursorPosition = input.selectionStart; // Get cursor position
    let rawValue = e.target.value.replace(/[^0-9.]/g, ""); // Remove non-numeric characters except '.'

    // Prevent multiple decimal points
    if ((rawValue.match(/\./g) || []).length > 1) return;

    // Allow only two decimals
    const parts = rawValue.split(".");
    if (parts.length === 2 && parts[1].length > 2) {
      rawValue = `${parts[0]}.${parts[1].slice(0, 2)}`; // Limit to 2 decimal places
    }

    // Update state
    setTotalPaymentAmount(rawValue);

    // Recalculate cursor position after updating the value
    let newCursorPosition = cursorPosition;

    // Adjust cursor position if deleting after decimal point
    if (
      rawValue[cursorPosition - 1] === "." ||
      rawValue[cursorPosition - 1] === ""
    ) {
      newCursorPosition = cursorPosition - 1;
    }

    // Preserve cursor position after setting state
    setTimeout(() => {
      inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };
  // useEffect(() => {
  //   const deposit = parseFloat(depositAvailableNew) || 0;
  //   const finalPayment = basePayment - deposit;
  //   setPaymentAmmountNew(finalPayment >= 0 ? finalPayment.toFixed(2) : 0);
  // }, [depositAvailableNew, basePayment]);
  const submitPaymentData = async () => {
    if (!selectedPaymentDate) {
      setShow2(true);
      return;
    }
    if (!selectedPaymentChannel) {
      setShow2(true);
      return;
    }
    if (!paymentAmmountNew) {
      setShow2(true);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/EXPPaymentStep2`, {
        ID: singleDataSet,
      });
      console.log("Payment data submitted successfully", response);
      if (response?.data?.success) {
        // If success = true, show success toast
        toast.success(response.data?.message);
        getDetils();
        const accessResponse = await axios.post(
          `${API_BASE_URL}/ReleaseAccess`,
          {
            id: from?.PO_ID,
            edit: 1,
            accesstype: 1, // Mark as in use
          }
        );

        if (podId) {
          const accessResponse = await axios.post(
            `${API_BASE_URL}/ReleaseAccess`,
            {
              id: podId,
              edit: 1,
              accesstype: 1, // Mark as in use
            }
          );
        }
        console.log("Access file updated before payment:", accessResponse.data);
        navigate("/purchase_orders");
        setSelectedPaymentDate(null);
        setSelectedPaymentChannel("");
        setBankReference("");
        setBankChargeAmount("0");
        setDepositAvailable("");
        setRoundingAmount("");
        setTotalPaymentAmount("");
        setPaymentNotes("");
        // Hide modal after successful submission
        let modalElement = document.getElementById("modalCombine");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      } else {
        toast.warning(response.data.message);
        // If success = false, show modal with API message
        // setShow1(true);
        // setStock1(response.data || "Procedure returned an error");
      }
      // Update client details and summary table with collectPaymentId from the response
    } catch (error) {
      // Handle error case for first API
      console.error("Error submitting payment data", error);
      toast.error(t("tryAgain"));
    }
  };
  function formatNumber(num) {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  }
  console.log(tableSummary);
  useEffect(() => {
    getDetils();
  }, [podId, from?.PO_ID]);

  const closeIcon = () => {
    setShow(false);
    // navigate("/purchase_orders");
  };
  const handleEditDatils = (i, e) => {
    const newEditPackaging = [...details];
    newEditPackaging[i][e.target.name] = e.target.value;
    setDetails(newEditPackaging);
  };
  // const itemData1 = async () => {
  //   try {
  //     const response = await axios.post(
  //       `${API_BASE_URL}/PurchaseTypeItemsList`
  //     );
  //     setDropdownItems(response.data.data || []);
  //   } catch (error) {
  //     console.error("Error fetching purchase type items:", error);
  //   }
  // };
  // useEffect(() => {
  //   itemData1();
  // }, []);
  // useEffect(() => {
  //   const fetchOptions = async () => {
  //     try {
  //       const response = await axios.post(
  //         `${API_BASE_URL}/PurchaseTypeItemsList`
  //       );
  //       console.log(response.data);
  //       setOptionItem(response.data.data); // Assuming data is already an array of objects
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchOptions();
  // }, []);
  // useEffect(() => {
  //   const fetchUnits = async () => {
  //     try {
  //       const response = await axios.get(`${API_BASE_URL}/getAllUnit`);
  //       console.log("API Response:", response.data.data);

  //       // Assuming response.data.data is the correct array
  //       setUnitItem(response.data.data || []);
  //     } catch (error) {
  //       console.error("Error fetching units:", error);
  //       setUnitItem([]); // Fallback to an empty array
  //     }
  //   };

  //   fetchUnits();
  // }, []);
  const fetchDropdownData = async () => {
    try {
      const [purchaseTypeRes, unitRes] = await Promise.all([
        axios.post(`${API_BASE_URL}/PurchaseTypeItemsList`),
        axios.get(`${API_BASE_URL}/getAllUnit`),
      ]);

      setOptionItem(purchaseTypeRes.data.data || []);
      setUnitItem(unitRes.data.data || []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      setOptionItem([]);
      setUnitItem([]);
    }
  };

  const deleteDetails = async (pod_id) => {
    try {
      console.log(pod_id);

      await axios.post(`${API_BASE_URL}/deletePurchaseOrderDetails`, {
        pod_id: pod_id,
      });
      toast.success(t("deleteSuccess"), {
        autoClose: 1000,
        theme: "colored",
      });
      summaryDeatils();
      getDetils(podId);
    } catch (e) {
      console.log(e);
    }
  };

  const [state, setState] = React.useState({
    po_id: from?.PO_ID,
    vendor_id: from?.Vendor,
    rounding: from?.rounding,
    vendor_name: from?.Vendor_name,
    created: from?.created || "0000-00-00",
    // `${new Date().getFullYear()}-${new Date().getMonth()}${1}-${new Date().getDate()}`,
    supplier_invoice_number: from?.supplier_invoice_number,
    supplier_invoice_date: from?.supplier_invoice_date,
    supplier_dua_date: from?.supplier_dua_date,

    user_id: localStorage.getItem("id"),
  });
  console.log(state);
  const [formsValue, setFormsvalue] = React.useState({
    pod_type_id: 0,
    unit_count_id: 0,
    POD_Selection: 0,
    pod_quantity: 0,
    pod_price: 0,
    pod_vat: 0,
    pod_wht_id: 0,
    pod_crate: 0,
    Unit_Name_EN: 0,
    Unit_Name_TH: 0,
    item_Name_EN: 0,
    item_Name_TH: 0,
  });

  const addFieldHandleChange = (e) => {
    const { name, value } = e.target;
    setFormsvalue((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const addFieldHandleChangeWname = (name, value) => {
    setFormsvalue((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const addFormFields = () => {
    setFormsvalue((prevValues) => ({
      ...prevValues,
      pod_type_id: 0,
      unit_count_id: 0,
      POD_Selection: 0,
      pod_quantity: 0,
      pod_price: 0,
      pod_vat: 0,
      pod_wht_id: 0,
      pod_crate: 0,
      Unit_Name_EN: 0,
      Unit_Name_TH: 0,
      item_Name_EN: 0,
      item_Name_TH: 0,
    }));
  };

  const removeFormFields = (i) => {
    const newFormValues = [...formsValue];
    newFormValues.splice(i, 1);
    setFormsvalue(newFormValues);
  };

  const { data: vendorList } = useQuery("getAllVendor");
  const { data: dropdownType } = useQuery("getDropdownType");
  const { data: produceList } = useQuery("getAllProduceItem");
  const { data: packagingList } = useQuery("getAllPackaging");
  const { data: BoxList } = useQuery("getAllBoxes");
  const { data: unitType } = useQuery("getAllUnit");
  useEffect(() => {
    if (!unitType?.length) return;
    getDetils();
  }, [unitType]);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const updatePurchaseOrderDetils = (id) => {
    if (!from?.PO_ID) return;
    axios
      .post(`${API_BASE_URL}/updatePurchaseOrderDetails`, {
        po_id: id,
        data: details,
      })
      .then((response) => {
        // window.location.reload(navigate("/purchase_orders"));
        navigate("/purchase_orders");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const addPurchaseOrderDetails = async (id) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/addPurchaseOrderDetails`,
        {
          po_id: id || from?.PO_ID,
          data: formDataAdd, // Send the object directly
          user_id: localStorage.getItem("id"),
        }
      );
      console.log(response);

      getDetils(id);
      setModalOne(false);
      console.log(response);
      summaryDeatils();
      setResponceId(response.data.id);
      toast.success(t("successfully"), {
        autoClose: 5000,
        theme: "colored",
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const deleteOrder = async () => {
    try {
      // First: update access file

      // Second: delete purchase
      const deleteResponse = await axios.post(
        `${API_BASE_URL}/DeletePurchase`,
        {
          po_id: podId,
          user_id: localStorage.getItem("id"),
        }
      );
      console.log("Delete purchase:", deleteResponse.data);
      const accessResponse = await axios.post(`${API_BASE_URL}/ReleaseAccess`, {
        id: from?.PO_ID,
        edit: 1,
        accesstype: 1, // Cancel action
      });
      console.log(
        "Access file updated (inside deleteOrder):",
        accessResponse.data
      );
      if (podId) {
        const accessResponse = await axios.post(
          `${API_BASE_URL}/ReleaseAccess`,
          {
            id: podId,
            edit: 1,
            accesstype: 1, // Cancel action
          }
        );
        console.log(
          "Access file updated (inside deleteOrder):",
          accessResponse.data
        );
      }
      // Optional: show toast
      // toast.success(deleteResponse.data.Message_EN);
      // toast.success(deleteResponse.data.Message_TH);

      // Finally: navigate
      navigate("/purchase_orders");
    } catch (error) {
      console.error("Error during cancel process:", error);
      toast.error(t("tryAgain"));
    }
  };

  // useEffect(() => {
  //   console.log("payableDATA:", payableDATA);
  //   console.log("roundingAmount:", roundingAmount);
  //   console.log("depositAvailable:", depositAvailable);

  //   setTotalPaymentAmount(
  //     (Number(payableDATA) || 0) +
  //       (Number(roundingAmount) || 0) -
  //       (Number(depositAvailable) || 0)
  //   );
  // }, [payableDATA, roundingAmount, depositAvailable]);
  const paymentDataClear = async () => {
    // Clear all payment-related states
    setSelectedPaymentDate(null);
    setSelectedPaymentChannel("");
    setBankReference("");
    setBankChargeAmount("0");
    setDepositAvailable("");
    setRoundingAmount("");
    setTotalPaymentAmount("");
    setPaymentNotes("");
  };

  const everyDataSet = () => {
    axios
      .get(`${API_BASE_URL}/getPurchaseOrderDetails?po_id=${responceId}`)
      .then((response) => {
        console.log(response.data?.data1);
        setSingleDataShow(response.data?.data1);
        setPayableData(response.data?.data1?.Payable);
        setDepositAvailable(response.data?.data1?.Available_deposit);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    everyDataSet();
  }, [responceId]);

  const update = async (updatedState = state) => {
    // Prevent API if mandatory fields missing
    if (!updatedState.vendor_id || !updatedState.created) {
      console.log("Vendor and PO Date are required");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/addPurchaseOrder`,
        updatedState
      );

      if (response.status === 200 && response.data.success) {
        setPodId(response.data?.po_id);
        setFormDataAdd({
          pod_type_id: 0,
          unit_count_id: 0,
          POD_Selection: 0,
          pod_quantity: 1,
          pod_price: 0,
          pod_vat: 0,
          pod_wht_id: 0,
          pod_crate: 1,
          Unit_Name_EN: 0,
          Unit_Name_TH: 0,
          item_Name_EN: 0,
          item_Name_TH: 0,
        });

        // ✅ Keep the purchase order ID and vendor details
        setState((prevState) => ({
          ...prevState,
          po_id: response.data?.po_id || from?.po_id || prevState.po_id,
          vendor_id: prevState.vendor_id,
          created: prevState.created,
          supplier_invoice_number: prevState.supplier_invoice_number,
          supplier_invoice_date: prevState.supplier_invoice_date,
          supplier_dua_date: prevState.supplier_dua_date,

          rounding: prevState.rounding,
        }));
      }
    } catch (error) {
      console.error(error);
      toast.error(t("errorOccurred"), {
        autoClose: 5000,
        theme: "colored",
      });
    }
  };

  const update1 = async (e) => {
    await fetchDropdownData(); // Load dropdown data

    // Check both at the same time
    // if (
    //   !state.vendor_id &&
    //   (!state.created || state.created === "0000-00-00")
    // ) {
    //   let data = {
    //     message_en: "Please enter purchase order supplier and date",
    //     message_th: "กรุณากรอกใบสั่งซื้อของซัพพลายเออร์และวันที่สั่งซื้อ",
    //   };
    //   setStock(data);
    //   setShow(true);
    //   setModalOne(true);
    //   return;
    // }
    setFormDataAdd({
      pod_type_id: 0,
      unit_count_id: 0,
      POD_Selection: 0,
      pod_quantity: 1,
      pod_price: 0,
      pod_vat: 0,
      pod_wht_id: 0,
      pod_crate: 1,
      Unit_Name_EN: 0,
      Unit_Name_TH: 0,
      item_Name_EN: 0,
      item_Name_TH: 0,
    });

    // ✅ If vendor missing
    if (!state.vendor_id) {
      let data = {
        message_en: "Please enter purchase order supplier",
        message_th: "กรุณากรอกใบสั่งซื้อของซัพพลายเออร์",
      };
      setStock(data);
      setShow(true);
      return; // stop here
    }

    // ✅ If date missing
    if (!state.created || state.created === "0000-00-00") {
      let data = {
        message_en: "Please enter date",
        message_th: "กรุณาระบุวันที่สั่งซื้อ",
      };
      setStock(data);
      setShow(true);
      return; // stop here
    }

    // ✅ Otherwise proceed (both filled)
    setModalOne(true);
  };

  const updateDataPayNow = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/addPurchaseOrder`,
        state
      );
      console.log(response);
      setStock(response?.data);

      // ✅ Keep purchase order ID and vendor details
      setState((prevState) => ({
        ...prevState,
        po_id: response.data?.po_id || prevState.po_id, // fixed from?.po_id
        vendor_id: prevState.vendor_id,
        created: prevState.created,
        supplier_invoice_number: prevState.supplier_invoice_number,
        supplier_invoice_date: prevState.supplier_invoice_date,
        rounding: prevState.rounding,
      }));

      if (response.status === 200 && response.data.success) {
        // ✅ Show modal
        const modalElement = document.getElementById("modalCombine");
        if (modalElement) {
          const modalInstance = new bootstrap.Modal(modalElement);
          modalInstance.show();
        } else {
          console.error("Modal element not found!");
        }

        const po_id = response.data.po_id;
        setSingleDataSet1(po_id);

        try {
          // ✅ Get purchase order details
          const poDetailsRes = await axios.get(
            `${API_BASE_URL}/getPurchaseOrderDetails?po_id=${po_id}`
          );
          console.log(poDetailsRes);

          const deposit = poDetailsRes?.data?.data1?.Available_deposit || 0;
          setDepositValue(deposit);

          // ✅ Initialize payment step
          const step1Res = await axios.post(`${API_BASE_URL}/EXPPaymentStep1`, {
            PO_ID: po_id,
            CPN: "",
            User_ID: localStorage.getItem("id"),
          });
          console.log(step1Res);
          const lastInsertId = step1Res?.data?.data?.last_insert_id;
          setSingleDataSet(lastInsertId);

          // ✅ Call with direct value instead of stale state
          paymentViewSection(po_id, lastInsertId);
        } catch (innerErr) {
          console.error("Error in PO details or payment step:", innerErr);
          toast.error(t("tryAgain"));
        }
      } else {
        setShow(true);
      }
    } catch (e) {
      console.error("Error in updateDataPayNow:", e);
      toast.error(t("errorOccurred"), {
        autoClose: 5000,
        theme: "colored",
      });
    }
  };
  const refreshDepositValue = async (poId) => {
    try {
      const res1 = await axios.get(
        `${API_BASE_URL}/getPurchaseOrderDetails?po_id=${poId}`
      );
      console.log("🔄 Refreshed Deposit:", res1);

      const deposit = res1?.data?.data1?.Available_deposit || 0;
      setDepositValue(deposit);
    } catch (error) {
      console.error("❌ Failed to refresh deposit:", error);
    }
  };

  const deleteOrderWithPayment = async () => {
    if (!singleDataSet) {
      toast.error(t("deleteError"));
      return;
    }

    try {
      // ✅ Delete API
      await axios.post(`${API_BASE_URL}/EXPPaymentDelete`, {
        Expense_Payment_ID: singleDataSet,
      });

      // ✅ Hide modal after delete
      const modal1 = document.getElementById("modalCombine");
      if (modal1) {
        const modalInstance1 = bootstrap.Modal.getInstance(modal1);
        modalInstance1?.hide();
      }

      // ✅ Release access
      await axios.post(`${API_BASE_URL}/ReleaseAccess`, {
        id: state.po_id,
        accesstype: 1, // Mark as in use
      });

      // ✅ Show toast first, then navigate
      toast.success(t("deleteSuccess"));
      navigate("/purchase_orders");
    } catch (e) {
      console.error("Delete error:", e);
      toast.error(t("deleteError"));
    }
  };

  // const deleteOrderWithPayment = async () => {
  //   try {
  //     // ✅ Delete API
  //     await axios.post(`${API_BASE_URL}/EXPPaymentDelete`, {
  //       Expense_Payment_ID: singleDataSet || "",
  //     });

  //     // ✅ Hide modal after delete
  //     const modal1 = document.getElementById("modalCombine");
  //     if (modal1) {
  //       const modalInstance1 = bootstrap.Modal.getInstance(modal1);
  //       modalInstance1?.hide();
  //     }
  //     const accessResponse = await axios.post(
  //         `${API_BASE_URL}/ReleaseAccess`,
  //         {
  //           id: singleDataSet,

  //           accesstype: 1, // Mark as in use
  //         }
  //       );
  //     navigate("/purchase_orders");
  //     toast.success(t("deleteSuccess"));
  //   } catch (e) {
  //     console.error("Delete error:", e);
  //     toast.error(t("deleteError"));
  //   }
  // };

  // const updateDataPayNow = async () => {
  //   try {
  //     const response = await axios.post(
  //       `${API_BASE_URL}/addPurchaseOrder`,
  //       state
  //     );
  //     console.log(response);
  //     setStock(response?.data);

  //     // ✅ Keep purchase order ID and vendor details
  //     setState((prevState) => ({
  //       ...prevState,
  //       po_id: response.data?.po_id || from?.po_id || prevState.po_id,
  //       vendor_id: prevState.vendor_id,
  //       created: prevState.created,
  //       supplier_invoice_number: prevState.supplier_invoice_number,
  //       supplier_invoice_date: prevState.supplier_invoice_date,
  //       rounding: prevState.rounding,
  //     }));

  //     if (response.status === 200 && response.data.success) {
  //       let modalElement = document.getElementById("modalCombine");
  //       if (modalElement) {
  //         let modalInstance = new bootstrap.Modal(modalElement);
  //         modalInstance.show();
  //       } else {
  //         console.error("Modal element not found!");
  //       }

  //       const po_id = response.data.po_id;
  //       setSingleDataSet1(response.data.po_id);

  //       try {
  //         const res1 = await axios.post(`${API_BASE_URL}/EXPPaymentStep1`, {
  //           PO_ID: po_id,
  //           CPN: "",
  //           User_ID: localStorage.getItem("id"),
  //         });
  //         console.log(res1);

  //         setSingleDataSet(res1?.data?.data?.last_insert_id);
  //         paymentViewSection();
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     } else {
  //       setShow(true);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //     toast.error(t("errorOccurred"), {
  //       autoClose: 5000,
  //       theme: "colored",
  //     });
  //   }
  // };
  const paymentViewSection = (
    po_id = state.po_id,
    expensePaymentId = singleDataSet
  ) => {
    axios
      .post(`${API_BASE_URL}/EXPPaymentView`, {
        PO_ID: po_id,
        Expense_Payment_ID: expensePaymentId,
        CPN: "",
      })
      .then((res) => {
        setPaymentSections({
          labels: res.data.section_label || {},
          data: res.data.section_data || {},
        });
        console.log("Payment updated ✅", res.data);
      })
      .catch((err) => {
        console.error("Payment update failed ❌", err);
      });
  };

  useEffect(() => {
    if (singleDataSet) {
      paymentViewSection();
    }
  }, [singleDataSet]);

  const resetPaymentFormFields = (data) => {
    console.log(data);
    // setDepositAvailableNew(data?.Available_deposit || 0);
    setBasePayment(data?.left_pay || 0);
    setVatNew(data?.Vat_payment || 0);
    setWhtNew(data?.wht_payment || 0);
    setRoundingNew1(data?.Rounding || 0);
    setTotalBeforText(data?.Total_Before_Tax || 0);

    setPaymentAmmountNew(data?.payment_amount || 0);
    setRoundingNew(data?.rounding || 0);
  };

  const canccelStatusdata = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/updateaccessfile`, {
        id: from.PO_ID,
        type: 1,
        accesstype: 0, // Cancel action
      });
      console.log("Access file updated (button click):", response.data);
      // Optionally show toast
      // toast.success("Access updated successfully!");
    } catch (error) {
      console.error("Error calling access file API:", error);
      // toast.error("Failed to update access.");
    }
  };
  useEffect(() => {
    console.log(state?.po_id);
    const modalElement = document.getElementById("modalCombine");

    if (!modalElement) return;

    const handleShow = async () => {
      if (state?.po_id) {
        try {
          const res = await axios.get(
            `${API_BASE_URL}/getPurchaseOrderDetails?po_id=${state.po_id}`
          );
          const data = res?.data?.data1;
          resetPaymentFormFields(data);
        } catch (err) {
          console.log(err);
        }
      }
    };

    modalElement.addEventListener("show.bs.modal", handleShow);

    return () => {
      modalElement.removeEventListener("show.bs.modal", handleShow);
    };
  }, [state?.po_id]);
  const updateData = async (e) => {
    try {
      const accessResponse = await axios.post(`${API_BASE_URL}/ReleaseAccess`, {
        id: state.po_id || from?.PO_ID,
        edit: 1,
        accesstype: 1, // Opening for edit
      });
      console.log("Access file updated (edit mode):", accessResponse.data);
      navigate("/purchase_orders");
    } catch (err) {
      console.error("Error in updateData:", err);
      toast.error(t("tryAgain"));
    }
  };

  // const updateData = async (e) => {
  //   try {
  //     const response = await axios.post(
  //       `${API_BASE_URL}/${"addPurchaseOrder"}`,
  //       state
  //     );
  //     console.log(response);
  //     setStock(response?.data);

  //     // 🔥 Clear the item form fields for new entry
  //     setFormDataAdd({
  //       pod_type_id: 0,
  //       unit_count_id: 0,
  //       POD_Selection: 0,
  //       pod_quantity: 0,
  //       pod_price: 0,
  //       pod_vat: 0,
  //       pod_wht_id: 0,
  //       pod_crate: 0,
  //       Unit_Name_EN: 0,
  //       Unit_Name_TH: 0,
  //       item_Name_EN: 0,
  //       item_Name_TH: 0,
  //     });

  //     // ✅ Keep the purchase order ID and vendor details
  //     setState((prevState) => ({
  //       ...prevState,
  //       po_id: response.data?.po_id || from?.po_id || prevState.po_id,
  //       vendor_id: prevState.vendor_id,
  //       created: prevState.created,
  //       supplier_invoice_number: prevState.supplier_invoice_number,
  //       supplier_invoice_date: prevState.supplier_invoice_date,
  //       rounding: prevState.rounding,
  //     }));

  //     if (response.status === 200) {
  //       if (response.data.success) {
  //         const id = response.data?.po_id || from?.po_id;
  //         console.log(id);

  //         setPodId(id);
  //         navigate("/purchase_orders");

  //         //  Clear podId to avoid fetching last item data
  //         // toast.success("Create Purchase Orders", {
  //         //   autoClose: 5000,
  //         //   theme: "colored",
  //         // });
  //       } else {
  //         setShow(true);
  //       }
  //     }
  //   } catch (e) {
  //     console.log(e);
  //     toast.error("An error has occurred", {
  //       autoClose: 5000,
  //       theme: "colored",
  //     });
  //   }
  // };
  // console.log(details);
  // console.log(formsValue);

  // js pratima
  const [optionItem, setOptionItem] = useState([]);
  const [modalOne, setModalOne] = useState(false);
  const [unitItem, setUnitItem] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  const [formDataAdd, setFormDataAdd] = useState({
    pod_type_id: 0,
    unit_count_id: 0,
    POD_Selection: 0,
    pod_quantity: 0,
    pod_price: 0,
    pod_vat: 0,
    pod_wht_id: 0,
    pod_crate: 0,
    Unit_Name_EN: 0,
    Unit_Name_TH: 0,
    item_Name_EN: 0,
    item_Name_TH: 0,
  });
  const handleChangeAdd = (e) => {
    const { name, value } = e.target;

    setFormDataAdd((prev) => {
      const updatedData = {
        ...prev,
        [name]: value,
      };

      // ✅ Ensure VAT updates dynamically when price, quantity, or VAT_Rate changes
      const price = parseFloat(updatedData.pod_price || 0);
      const quantity = parseFloat(updatedData.pod_quantity || 0);
      const vatRate = parseFloat(prev.VAT_Rate || 0);
      const whtRate = parseFloat(prev.WHT_Rate || 0);

      if (vatRate && price && quantity) {
        updatedData.pod_vat = ((vatRate / 100) * price * quantity).toFixed(2);
      } else {
        updatedData.pod_vat = 0;
      }

      if (whtRate && price && quantity) {
        updatedData.pod_wht_id = ((whtRate / 100) * price * quantity).toFixed(
          2
        );
      } else {
        updatedData.pod_wht_id = 0;
      }

      console.log("Updated VAT:", updatedData.pod_vat);
      console.log("Updated WHT:", updatedData.pod_wht_id);

      return updatedData;
    });
  };

  const handleVatChange = (e) => {
    const { value } = e.target;
    setFormDataAdd((prev) => ({
      ...prev,
      pod_vat: parseFloat(value) || 0, // Allow manual edit
    }));
  };
  const handleWhtChange = (e) => {
    const { value } = e.target;
    setFormDataAdd((prev) => ({
      ...prev,
      pod_wht_id: parseFloat(value) || 0, // Allow manual edit
    }));
  };

  const handleEditClick = async (item) => {
    await fetchDropdownData();
    setFormDataAdd(item); // Set the selected item’s data
    setModalOne(true); // Fill the form with item data
    // Open the modal
  };

  // const handleItemChange = (event, value) => {
  //   setFormDataAdd((prev) => ({
  //     ...prev,
  //     pod_type_id: value?.ID || 0,
  //     POD_Selection: value?.ID || 0, // Save selected item ID to pod_type_id
  //   }));
  // };

  // // Handle unit dropdown change (for unit_count_id)
  // const handleUnitChange = (event, value) => {
  //   setFormDataAdd((prev) => ({
  //     ...prev,
  //     unit_count_id: value?.ID || 0, // Save selected unit ID to unit_count_id
  //   }));
  // };

  const handleItemChange = (newValue) => {
    console.log("Selected Item:", newValue);
    setFormDataAdd((prev) => {
      const updatedData = {
        ...prev,
        pod_type_id: newValue ? newValue.ID : null,
        dropDown_id: newValue ? newValue.ID : null,
        POD_Selection: newValue ? newValue.ID : null,
        item_Name_EN: newValue ? newValue.Name_EN : null,
        item_Name_TH: newValue ? newValue.Name_TH : null,
        VAT_Rate: newValue ? newValue.VAT_Rate : 0,
        WHT_Rate: newValue ? newValue.WHT_Rate : 0,
      };
      console.log("Item Selected - VAT_Rate:", updatedData.VAT_Rate);

      // Ensure VAT is calculated dynamically
      if (updatedData.VAT_Rate && prev.pod_quantity && prev.pod_price) {
        updatedData.pod_vat = (
          parseFloat(updatedData.VAT_Rate / 100) *
          parseFloat(prev.pod_quantity) *
          parseFloat(prev.pod_price)
        ).toFixed(2);
      } else {
        updatedData.pod_vat = 0; // Reset if any value is missingFF
      }
      if (updatedData.WHT_Rate && prev.pod_quantity && prev.pod_price) {
        updatedData.pod_wht_id = (
          parseFloat(updatedData.WHT_Rate / 100) *
          parseFloat(prev.pod_quantity) *
          parseFloat(prev.pod_price)
        ).toFixed(2);
      } else {
        updatedData.pod_wht_id = 0;
      }
      console.log("Calculated VAT:", updatedData.pod_vat);
      return updatedData;
    });
  };

  //item_Name_EN, item_Name_TH
  const handleUnitChange = (newValue) => {
    setFormDataAdd((prev) => ({
      ...prev,
      unit_count_id: newValue ? newValue.ID : null,
      Unit_Name_EN: newValue ? newValue.Name_EN : null,
      Unit_Name_TH: newValue ? newValue.Name_TH : null,
    }));
  };
  const handleCloseModalOne = () => {
    setModalOne(false); // Hide the modal
  };

  const openModalOne = () => {
    setModalOne(true); // Show the modal
  };
  const handleChangeCreate = (event) => {
    const { name, value } = event.target;
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <FaCaretDown style={{ color: "black" }} />
      </components.DropdownIndicator>
    );
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

  const [poData, setPoData] = useState(null);
  const summaryDeatils = () => {
    axios
      .post(`${API_BASE_URL}/PO_Bottom_View_EN`, {
        po_id: state.po_id || from?.PO_ID,
      })
      .then((res) => {
        console.log("poData", res.data);
        setPoData(res.data);
      })
      .catch((err) => {
        console.error("API Error:", err);
      });
  };
  useEffect(() => {
    summaryDeatils();
  }, []);

  // Utility to render each section
  const renderSection = (labels, values) => {
    if (!labels || !values) return null;

    return Object.keys(labels).map((key, i) => (
      <div key={i}>
        <b>{labels[key]}</b> {values[key] || ""}
      </div>
    ));
  };
  return (
    <>
      <Card
        title={`${t("purchase_order")} / ${
          from?.PO_ID ? t("update") : t("create")
        } ${t("form")}`}
      >
        <div className="tab-content px-2 md:!px-4">
          <div className="tab-pane active" id="header" role="tabpanel">
            <div
              id="datatable_wrapper"
              className="information_dataTables dataTables_wrapper dt-bootstrap4"
            >
              <div className="formCreate">
                <form action="">
                  <div className="row cratePurchase">
                    <div className="col-lg-3 form-group parentFormPayment autoComplete">
                      <h6>{t("vendor")}</h6>

                      <Autocomplete
                        options={
                          vendorList?.map((vendor) => ({
                            id: vendor.ID,
                            name: vendor.name,
                          })) || []
                        }
                        getOptionLabel={(option) => option.name || ""}
                        value={
                          vendorList
                            ?.map((vendor) => ({
                              id: vendor.ID,
                              name: vendor.name,
                            }))
                            .find((option) => option.id === state.vendor_id) ||
                          null
                        }
                        onChange={async (e, newValue) => {
                          const updatedState = {
                            ...state,
                            vendor_id: newValue?.id || "",
                            vendor_name: newValue?.name || "",
                          };
                          setState(updatedState);

                          // ✅ Call API only if vendor & date exist
                          if (updatedState.vendor_id && updatedState.created) {
                            await update(updatedState);
                          }
                        }}
                        sx={{ width: 300 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t("vender")}
                            InputLabelProps={{ shrink: false }}
                            error={!state.vendor_id} // highlight if missing
                          />
                        )}
                      />
                    </div>
                    {/* PO Date Picker */}
                    <div className="col-lg-2 form-group">
                      <h6>{t("poDate")}</h6>

                      <DatePicker
                        selected={
                          state.created && !isNaN(new Date(state.created))
                            ? new Date(state.created)
                            : null
                        }
                        onChange={async (date) => {
                          const formattedDate = date
                            ? `${date.getFullYear()}-${String(
                                date.getMonth() + 1
                              ).padStart(2, "0")}-${String(
                                date.getDate()
                              ).padStart(2, "0")}`
                            : null;

                          const updatedState = {
                            ...state,
                            created: formattedDate,
                          };

                          setState(updatedState);

                          if (updatedState.vendor_id && updatedState.created) {
                            await update(updatedState);
                          }
                        }}
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        placeholderText="DD/MM/YYYY"
                        customInput={<CustomInput />}
                      />
                    </div>

                    <div className="col-lg-3 form-group">
                      <h6> {t("invoiceNumber")}</h6>
                      <input
                        className="w-full"
                        type="text"
                        name="supplier_invoice_number"
                        value={state.supplier_invoice_number}
                        onChange={async (e) => {
                          const updatedState = {
                            ...state,
                            supplier_invoice_number: e.target.value,
                          };
                          setState(updatedState);

                          // ✅ Call API only if vendor & supplier_invoice_number exist
                          if (
                            updatedState.vendor_id &&
                            updatedState.supplier_invoice_number
                          ) {
                            await update(updatedState);
                          }
                        }}
                      />
                    </div>
                    <div className="col-lg-2 form-group">
                      <h6>{t("invoiceDate")}</h6>
                      {/* <input
                        type="date"
                        name="supplier_invoice_date"
                        value={state.supplier_invoice_date}
                        onChange={handleChange}
                      />   */}
                      <DatePicker
                        selected={
                          state?.supplier_invoice_date
                            ? new Date(state.supplier_invoice_date)
                            : null
                        }
                        onChange={async (date) => {
                          const formattedDate = date
                            ? `${date.getFullYear()}-${String(
                                date.getMonth() + 1
                              ).padStart(2, "0")}-${String(
                                date.getDate()
                              ).padStart(2, "0")}`
                            : null;

                          const updatedState = {
                            ...state,
                            supplier_invoice_date: formattedDate,
                          };
                          setState(updatedState);

                          if (
                            updatedState.vendor_id &&
                            updatedState.supplier_invoice_date
                          ) {
                            await update(updatedState);
                          }
                        }}
                        dateFormat="dd/MM/yyyy"
                        placeholderText={t("selectDate")}
                        customInput={<CustomInput />}
                      />
                    </div>
                    <div className="col-lg-2 form-group">
                      <h6> {t("dueDate")}</h6>
                      {/* <input
                        type="date"
                        name="supplier_dua_date"
                        value={state.supplier_dua_date}
                        onChange={handleChange}
                      /> */}
                      <DatePicker
                        selected={state?.supplier_dua_date || null}
                        // onChange={(date) =>
                        //   handleChange({
                        //     target: { name: "supplier_dua_date", value: date },
                        //   })
                        // }
                        onChange={async (date) => {
                          const formattedDate = date
                            ? `${date.getFullYear()}-${String(
                                date.getMonth() + 1
                              ).padStart(2, "0")}-${String(
                                date.getDate()
                              ).padStart(2, "0")}`
                            : null;
                          const updatedState = {
                            ...state,
                            supplier_dua_date: formattedDate,
                          };
                          setState(updatedState);

                          // ✅ Call API only if vendor & date exist
                          if (
                            updatedState.vendor_id &&
                            updatedState.supplier_dua_date
                          ) {
                            await update(updatedState);
                          }
                        }}
                        dateFormat="dd/MM/yyyy"
                        placeholderText={t("clickToSelectDate")}
                        customInput={<CustomInput />} // Ensure `CustomInput` is defined or remove this line if not needed
                      />
                    </div>
                  </div>
                  <div className="addButton">
                    {/* Button trigger modal */}
                    <button
                      type="button"
                      className="btn btn-primary"
                      // onClick={openModalOne}
                      onClick={update1}
                    >
                      {t("add")}
                    </button>
                    {modalOne && (
                      <div
                        className="fixed inset-0 flex items-center justify-center"
                        style={{ zIndex: "9999" }}
                      >
                        <div
                          className="fixed w-screen h-screen bg-black/20"
                          onClick={handleCloseModalOne}
                        />
                        <div className="bg-white rounded-lg shadow-lg max-w-md w-full ">
                          <div className="crossArea">
                            <h3> {t("editDetails")} </h3>
                            <p onClick={handleCloseModalOne}>
                              <CloseIcon />
                            </p>
                          </div>
                          <div className="formEan formCreate">
                            <div className="modal-body modalShipTo p-0 ">
                              {/* <h1>hello</h1> */}

                              <div className="addMOdalContent formCreate mt-0 px-2">
                                <div className="col-lg-12 autoComplete mb-2 ">
                                  <h6> {t("selectItem")} </h6>

                                  <Select
                                    value={
                                      optionItem.find(
                                        (opt) =>
                                          opt.ID === formDataAdd.pod_type_id
                                      ) || null
                                    } // The selected value (set to null if no match)
                                    onChange={(selectedOption) =>
                                      handleItemChange(selectedOption)
                                    } // Handle selection
                                    options={optionItem || []} // The dropdown options
                                    getOptionLabel={(option) =>
                                      option.Name_EN || option.Name_TH || ""
                                    }
                                    getOptionValue={(option) => option.ID} // Ensure correct ID selection
                                    placeholder={t("selectItem")}
                                    isClearable // Adds a clear button
                                    styles={customStyles}
                                    classNamePrefix="react-select" // Add a prefix for CSS class names
                                  />
                                </div>
                                <div className="col-lg-12 autoComplete mb-2">
                                  <h6>{t("unit")}</h6>
                                  <Autocomplete
                                    disablePortal
                                    options={
                                      Array.isArray(unitItem) ? unitItem : []
                                    }
                                    getOptionLabel={(option) =>
                                      option.Name_EN ||
                                      option.Name_TH ||
                                      "Unknown Unit"
                                    }
                                    value={
                                      unitItem.find(
                                        (opt) =>
                                          opt.ID === formDataAdd.unit_count_id
                                      ) || null
                                    } // Set value
                                    onChange={(e, newValue) =>
                                      handleUnitChange(newValue)
                                    }
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        placeholder={t("unit")}
                                      />
                                    )}
                                  />
                                </div>
                                {/* Only show Quantity and Crate if unit is NOT "Time" */}
                                {formDataAdd.Unit_Name_EN !== "Time" &&
                                  formDataAdd.unit_count_id !== 4 && (
                                    <>
                                      <div className="col-lg-12 mb-2">
                                        <h6>{t("quantity")}</h6>
                                        <input
                                          className="mb-0"
                                          type="text"
                                          name="pod_quantity"
                                          value={formDataAdd.pod_quantity || ""}
                                          defaultValue={1}
                                          placeholder={t("quantity")}
                                          onChange={handleChangeAdd}
                                        />
                                      </div>

                                      <div className="col-lg-12 mb-2">
                                        <h6>{t("crate")}</h6>
                                        <input
                                          className="mb-0"
                                          type="text"
                                          name="pod_crate"
                                          value={formDataAdd.pod_crate}
                                          placeholder={t("crate")}
                                          onChange={handleChangeAdd}
                                        />
                                      </div>
                                    </>
                                  )}

                                <div className="col-lg-12 mb-2">
                                  <h6> {t("price")}</h6>
                                  <input
                                    className="mb-0"
                                    type="number"
                                    name="pod_price"
                                    value={formDataAdd.pod_price}
                                    placeholder={t("price")}
                                    onChange={handleChangeAdd}
                                  />
                                </div>

                                <div className="row mb-2">
                                  <div className="col-lg-6">
                                    <h6> {t("vat")}</h6>
                                    <input
                                      className="mb-0"
                                      type="number"
                                      name="pod_vat"
                                      value={formDataAdd.pod_vat}
                                      placeholder={t("vat")}
                                      onChange={handleVatChange}
                                    />
                                  </div>

                                  <div className="col-lg-6">
                                    <h6>{t("wht")}</h6>
                                    <input
                                      className="mb-0"
                                      type="number"
                                      name="pod_wht_id"
                                      value={formDataAdd.pod_wht_id}
                                      placeholder={t("wht")}
                                      onChange={handleWhtChange} // Handle manual edits
                                    />
                                  </div>
                                </div>

                                {/* <div className="row">
                                  <div className="col-lg-12 mb-2">
                                    <h6>Total</h6>
                                    <input
                                      className="mb-0"
                                      type="number"
                                      name="total"
                                      value={formDataAdd.total}
                                      placeholder="Total"
                                      onChange={handleChangeAdd}
                                    />
                                  </div>
                                </div> */}
                                <div className="row">
                                  <div className="col-lg-12 mb-2">
                                    <h6> {t("total")}</h6>
                                    <input
                                      className="mb-0 border-0"
                                      type="number"
                                      name="total"
                                      placeholder={t("total")}
                                      value={
                                        formDataAdd.pod_price &&
                                        formDataAdd.pod_quantity
                                          ? (
                                              parseFloat(
                                                formDataAdd.pod_price || 0
                                              ) *
                                                parseFloat(
                                                  formDataAdd.pod_quantity || 0
                                                ) + // price * quantity
                                              parseFloat(
                                                formDataAdd.pod_vat || 0
                                              ) - // Add VAT value
                                              parseFloat(
                                                formDataAdd.pod_wht_id || 0
                                              )
                                            ).toFixed(2) // Fix to 2 decimal places
                                          : 0 // Show 0 if price or quantity is missing
                                      }
                                      disabled={+formDataAdd.pod_status !== 1}
                                      readOnly
                                    />
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  className="UpdatePopupBtn btn btn-primary m-0"
                                  onClick={() => addPurchaseOrderDetails(podId)}
                                >
                                  {t("add")}
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="modal-footer"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* table new */}

                  <div
                    id="datatable_wrapper"
                    className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive mt-"
                  >
                    <table
                      id="example"
                      className=" tableLr display transPortCreate table table-hover table-striped borderTerpProduce table-responsive purchaseCreateTable"
                      style={{ width: "100%" }}
                    >
                      <thead>
                        <tr>
                          <th style={{ width: "170px" }}> {t("pod_Code")}</th>
                          <th style={{ width: "350px" }}> {t("item")}</th>
                          <th style={{ width: "150px" }}> {t("quantity")}</th>
                          <th style={{ width: "100px" }}> {t("unit")}</th>
                          <th style={{ width: "150px" }}> {t("price")}</th>
                          <th style={{ width: "70px" }}> {t("price")}</th>
                          <th style={{ width: "150px" }}> {t("total")}</th>
                          <th style={{ width: "100px" }}> {t("vat")}</th>
                          <th style={{ width: "100px" }}> {t("crate")}</th>
                          <th style={{ width: "100px" }}> {t("action")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {details.map((item, index) => (
                          <tr key={index}>
                            <td className="text-center">{item.pod_code}</td>
                            <td>{item.produce_name_en}</td>
                            <td className="text-right">
                              {formatterTwo.format(item.pod_quantity)}
                            </td>
                            <td className="text-center">{item.Unit_Name_EN}</td>
                            <td className="text-right">
                              {" "}
                              {formatterTwo.format(item.pod_price)}
                            </td>
                            <td className="text-right">
                              {formatterTwo.format(item.pod_vat)}
                            </td>
                            <td className="text-right">
                              {formatterTwo.format(
                                item.pod_quantity * item.pod_price
                              )}
                            </td>
                            <td className="text-right">
                              {formatterTwo.format(item.pod_wht_id)}
                            </td>
                            <td className="text-right">
                              {formatterTwo.format(item.pod_crate)}
                            </td>
                            <td>
                              {item.pod_status === 1 && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleEditClick(item)}
                                  >
                                    <i className="mdi mdi-pencil text-2xl" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => deleteDetails(item.pod_id)}
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
                  {/* table new end */}
                  <div className="row py-4">
                    <div className="col-lg-3">
                      {renderSection(
                        poData?.section1_label,
                        poData?.section1_values
                      )}
                    </div>
                    <div className="col-lg-3">
                      {renderSection(
                        poData?.section2_label,
                        poData?.section2_values
                      )}
                    </div>
                    <div className="col-lg-3">
                      {renderSection(
                        poData?.section3_label,
                        poData?.section3_values
                      )}
                    </div>
                    <div className="col-lg-3">
                      {renderSection(
                        poData?.section4_label,
                        poData?.section4_values
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="card-footer">
            {((details.length > 0 && !from?.PO_ID) || from?.PO_ID) && (
              <button
                className="btn btn-primary"
                type="submit"
                name="signup"
                onClick={updateData}
                disabled={buttonClicked}
              >
                {details.length > 0 && !from?.PO_ID ? t("create") : t("update")}
              </button>
            )}

            {/* <Link
              className="btn btn-danger"
              to={from?.PO_ID ? "/purchase_orders" : "/purchase_orders"} // Redirect if PO_ID exists
              onClick={(e) => {
                if (!podId) return; // Do nothing if podId is missing
                e.preventDefault(); // Prevent navigation if deleting

                canccelStatusdata();

                deleteOrder(podId); // Call delete function
              }}
            >
              Cancel
            </Link> */}
            <button
              className="btn btn-danger"
              onClick={() => {
                deleteOrder();
              }}
            >
              {t("cancel")}
            </button>

            {details.length > 0 && (
              <button
                className="btn btn-primary"
                type="button"
                onClick={updateDataPayNow}
              >
                {t("payNow")}
              </button>
            )}
          </div>
        </div>
      </Card>

      <Modal
        className="modalError receiveModal"
        show={show}
        onHide={handleClose}
      >
        <div className="modal-content">
          <div
            className="modal-header border-0"
            style={{ backgroundColor: color ? "#2f423c" : "" }}
          >
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              {t("purchaseOrderCheck")}
            </h1>
            <button
              style={{ color: "#fff", fontSize: "30px" }}
              type="button"
              // onClick={() => setShow(false)}
              onClick={closeIcon}
            >
              <i class="mdi mdi-close"></i>
            </button>
          </div>
          <div
            className="modal-body"
            style={{ backgroundColor: color ? "#2f423c" : "" }}
          >
            <div className="eanCheck errorMessage recheckReceive">
              <p style={{ backgroundColor: color ? "" : "#631f37" }}>
                {stock.message_en ? stock.message_en : "NULL"}
              </p>
              <p style={{ backgroundColor: color ? "" : "#631f37" }}>
                {stock.message_th ? stock.message_th : "NULL"}
              </p>
              <div className="closeBtnRece">
                <button onClick={closeIcon}> {t("close")}</button>
              </div>
            </div>
          </div>
          <div
            className="modal-footer"
            style={{ backgroundColor: color ? "#2f423c" : "" }}
          ></div>
        </div>
      </Modal>

      {/* paymentIcon */}
      <div
        className="modal fade "
        id="modalCombine"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modalShipTo modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {t("payments")}
              </h1>
              {/* <button
                type="button"
                onClick={paymentDataClear}
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="mdi mdi-close"></i>
              </button> */}
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-lg-9">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="parentFormPayment">
                        <p> {t("paymentDate")}</p>
                        <DatePicker
                          selected={
                            selectedPaymentDate &&
                            !isNaN(new Date(selectedPaymentDate))
                              ? new Date(selectedPaymentDate)
                              : null
                          }
                          onChange={(date) => {
                            const formattedDate = date
                              ? `${date.getFullYear()}-${String(
                                  date.getMonth() + 1
                                ).padStart(2, "0")}-${String(
                                  date.getDate()
                                ).padStart(2, "0")}`
                              : null;

                            setSelectedPaymentDate(formattedDate);

                            // ✅ trigger API call like before
                            handlePaymentChange("Payment_Date", formattedDate);
                          }}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Click to select a date"
                          customInput={<CustomInput />}
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="parentFormPayment autoComplete">
                        <p> {t("paymentChannel")}</p>
                        <Autocomplete
                          disablePortal
                          options={paymentChannle || []}
                          value={
                            (paymentChannle || []).find(
                              (channel) =>
                                channel.bank_id === selectedPaymentChannel
                            ) || null
                          }
                          getOptionLabel={(option) =>
                            option.Bank_nick_name || ""
                          }
                          onChange={(e, newValue) =>
                            handlePaymentChange(
                              "Payment_Channel",
                              newValue?.bank_id || ""
                            )
                          }
                          sx={{ width: 300 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Search Payment Channel"
                            />
                          )}
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 mt-3">
                      <div className="parentFormPayment">
                        <p> {t("bankRef")}</p>
                        <input
                          type="text"
                          value={bankReference}
                          onChange={(e) =>
                            handlePaymentChange("Bank_Ref", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 mt-3">
                      <div className="parentFormPayment">
                        <p> {t("bankCharges")}</p>
                        <input
                          type="text"
                          value={bankChargeAmount}
                          onChange={(e) =>
                            handlePaymentChange("Bank_Fees", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 mt-3">
                      <div className="parentFormPayment">
                        <p>
                          {t("availableDeposit")} (
                          {formatterTwo.format(Number(depositValue))})
                        </p>

                        <input
                          type="number"
                          value={depositAvailableNew}
                          onChange={(e) =>
                            handlePaymentChange(
                              "available_Deposit",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 mt-3">
                      <div className="parentFormPayment">
                        <p> {t("rounding")}</p>
                        <input
                          type="text"
                          value={roundingNew}
                          onChange={(e) =>
                            handlePaymentChange("Rounding", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="parentFormPayment col-lg-6 mt-3">
                      <p> {t("paymentAmount")}</p>
                      <input
                        type="text"
                        value={paymentAmmountNew}
                        onChange={(e) =>
                          handlePaymentChange("Payment_Amount", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-lg-6 mt-3">
                      <div className="parentFormPayment">
                        <p> {t("notes")}</p>
                        <textarea
                          value={paymentNotes}
                          onChange={(e) =>
                            handlePaymentChange("Notes", e.target.value)
                          }
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="flex ps-3 pt-5 mt-4 totalBefore">
                    <div className="pe-3" style={{ width: "85%" }}>
                      {Object.keys(paymentSections.labels).map((key) => (
                        <div className="flexBefore" key={key}>
                          <div>
                            <strong>{paymentSections.labels[key]}</strong>
                          </div>
                          <div>
                            <span>{paymentSections.data[key]}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={submitPaymentData}
                className="btn btn-primary"
              >
                {t("submit")}
              </button>
              <button
                type="button"
                onClick={deleteOrderWithPayment}
                className="btn btn-primary"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* paymentIcon end */}
      <Modal
        className="modalError receiveModal"
        show={show2}
        onHide={handleClose2}
      >
        <div className="modal-content">
          <div
            className="modal-header border-0"
            style={{ backgroundColor: color ? "#2f423c" : "" }}
          >
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              {t("purchasePaymentCheck")}
            </h1>
            <button
              style={{ color: "#fff", fontSize: "30px" }}
              type="button"
              // onClick={() => setShow(false)}
              onClick={closeIcon2}
            >
              <i class="mdi mdi-close"></i>
            </button>
          </div>
          <div
            className="modal-body"
            style={{ backgroundColor: color ? "#2f423c" : "" }}
          >
            <div className="eanCheck errorMessage recheckReceive">
              {!selectedPaymentDate ? (
                <p style={{ backgroundColor: color ? "" : "#631f37" }}>
                  {t("paymentDateRequired")}
                </p>
              ) : (
                ""
              )}

              {!selectedPaymentChannel ? (
                <p style={{ backgroundColor: color ? "" : "#631f37" }}>
                  {t("paymentChannelRequired")}
                </p>
              ) : (
                ""
              )}
              {!paymentAmmountNew ? (
                <p style={{ backgroundColor: color ? "" : "#631f37" }}>
                  {"Payment amount is Required"}
                </p>
              ) : (
                ""
              )}
              <div className="closeBtnRece">
                <button onClick={closeIcon2}>{t("close")}</button>
              </div>
            </div>
          </div>
          <div
            className="modal-footer"
            style={{ backgroundColor: color ? "#2f423c" : "" }}
          ></div>
        </div>
      </Modal>
    </>
  );
};

export default CreatePurchaseOrder;
