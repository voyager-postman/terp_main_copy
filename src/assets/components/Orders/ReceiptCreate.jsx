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
const ReceiptCreate = () => {
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

  const [hasUserChangedValues, setHasUserChangedValues] = useState(false);
  const [basePayment, setBasePayment] = useState(0); // from left_pay
  const [roundingNew, setRoundingNew] = useState("0");
  const [singlePodId, setSinglePodId] = useState("");
  const [singleDataSet, setSingleDataSet] = useState("");
  const [totalBeforText, setTotalBeforText] = useState("0");
  const [poData, setPoData] = useState(null);
  const [depositValue, setDepositValue] = useState("");
  const [singleDataSet1, setSingleDataSet1] = useState("");
  const [paymentSections, setPaymentSections] = useState({
    labels: {},
    data: {},
  });
  const [modalData, setModalData] = useState(null);
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
  const { data: currency } = useQuery("getCurrency");
  useEffect(() => {
    if (currency) {
      console.log("Currency API Data:", currency);
    }
  }, [currency]);
  const [loading, setLoading] = useState(false);
  const [modalHead, setModalHead] = useState(null); // Stores API head data

  const [paymentForm, setPaymentForm] = useState({
    paymentDate: null,
    fx: "",
    paymentChannel: "",
    fxRateReceived: "",
    clientPaymentRef: "",
    interBankCharges: "",
    paymentAmount: "",
    prepayment: "",
    bankRef: "",
    localBankCharges: "",
    thbReceived: "",
    rounding: "",
    notes: "",
  });
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
  const summaryDeatils = () => {
    axios
      .post(`${API_BASE_URL}/Receipt_Bottom_View`, {
        RID: state.po_id || from?.PO_ID,
        LANG: 1,
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
  const renderSection = (labels, values) => {
    if (!labels || !values) return null;

    return Object.keys(labels).map((key, i) => (
      <div key={i}>
        <b>{labels[key]}</b> {values[key] || ""}
      </div>
    ));
  };
  const getDetils = (podId) => {
    const idToUse = podId || from?.PO_ID;
    axios
      .get(`${API_BASE_URL}/getReceiptDetails?rid=${idToUse}`)
      .then((response) => {
        console.log(response);
        setTableSummary(response.data.data1);
        const mappedData = response.data.data.map((item) => ({
          pod_status: item.Receiving_Status,
          pod_id: item.ID,
          pod_code: item.Account,
          pod_type_id: item.POD,
          dropDown_id: item.POD,
          produce_name_en: item.Name_EN,
          pod_quantity: item.QTY,
          unit_count_id: item.Unit,
          Unit_Name_EN: item.Unit_Name_EN,
          Unit_Name_TH: item.Unit_Name_TH,
          item_Name_EN: item.Name_EN,
          item_Name_TH: item.Name_TH,
          pod_price: item.Price,
          pod_vat: item.VAT,
          pod_wht_id: item.WHT,
          pod_crate: item.Crates,
          Notes: item.Notes,
        }));
        setDetails(mappedData);
        fetchReceiptData(null, idToUse);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const deposit = parseFloat(depositAvailableNew) || 0;
    const finalPayment = basePayment - deposit;
    setPaymentAmmountNew(finalPayment >= 0 ? finalPayment.toFixed(2) : 0);
  }, [depositAvailableNew, basePayment]);
  const submitPaymentData = async () => {
    if (!selectedPaymentDate) {
      setShow2(true);
      return;
    }
    if (!selectedPaymentChannel) {
      setShow2(true);
      return;
    }

    // Prepare payment data object for the first API call
    const paymentData = {
      vendor_id: singleDataShow?.Vendor || singleDataSet?.Vendor,
      Payment_Date: selectedPaymentDate,
      Payment_Channel: selectedPaymentChannel,
      Bank_Fees: bankChargeAmount,
      Rounding: roundingAmount,
      available_Deposit: depositAvailable,
      Payment_Amount: paymentAmmountNew,
      Notes: paymentNotes,
      Bank_Ref: bankReference,
      PO_id: singleDataShow?.PO_ID || singleDataSet?.PO_ID,
      User_id: localStorage.getItem("id"),
      amount_to_pay: (
        Number(paymentAmmountNew) +
        (Number(paymentAmmountNew) + Number(depositAvailableNew)) *
        Number(vatNew) -
        (Number(paymentAmmountNew) + Number(depositAvailableNew)) *
        Number(whtNew) +
        (Number(roundingNew1) + Number(roundingNew))
      ).toFixed(2),
      Deposit_Used: Number(depositAvailableNew),
      VAT: (
        (Number(depositAvailableNew) + Number(paymentAmmountNew)) *
        Number(vatNew)
      ).toFixed(2),
      WHT: (
        (Number(depositAvailableNew) + Number(paymentAmmountNew)) *
        Number(whtNew)
      ).toFixed(2),
      left_Rounding: Number(roundingNew1) + Number(roundingNew),
      Total_Before_Tax: Number(depositAvailableNew) + Number(paymentAmmountNew),
    };

    console.log(paymentData);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/POPayments`,
        paymentData
      );
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
        navigate("/reciept");
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
  }, []);
  const fetchReceiptData = async (bn_id, receiptID) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/receiptBNIDView`, {
        RID: receiptID || responceId,
        Lang: 1,
      });
      if (res.data.success) {
        setModalHead(res.data.head);
        setModalData(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching receipt data", error);
    }
  };

  const handleChange5 = async (field, value, extraData = {}) => {
    // 1. Update UI immediately
    setPaymentForm((prev) => ({
      ...prev,
      [field]: value,
      ...extraData, // store extra data if provided
    }));

    // 2. Ensure receiptID is present
    if (!podId) {
      console.error("❌ No RID found. API won't run.");
      return;
    }

    // 3. Map fields to API params
    const fieldMapping = {
      paymentDate: "Receipt_Date",
      prepayment: "Prepayment",
      fx: "FX",
      fxRateReceived: "R_FX_Rate",
      interBankCharges: "BankFees_FX",
      localBankCharges: "BankFees_THB",
      notes: "Notes",
      paymentChannel: "Payment_Channel",
      clientPaymentRef: "Client_Ref",
      bankRef: "Bank_Ref",
      paymentAmount: "payment_amount",
      rounding: "Rounding",
      Payor_ID: "Payor_ID",
      Payor: "Payor",
    };

    const apiField = fieldMapping[field];
    if (!apiField) return;

    // 4. Prepare value (e.g., format date)
    const payloadValue =
      field === "paymentDate" && value instanceof Date
        ? value.toISOString().split("T")[0] // format date
        : value;

    try {
      // 5. Call BNPayment API
      const res = await fetch(`${API_BASE_URL}/BNPayment`, {
        method: "POST", //  Use PUT for updates
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          RID: podId,
          BNID: singlePodId?.ID,
          [apiField]: payloadValue,
          ...extraData,
        }),
      });

      const result = await res.json();
      console.log(`Updated "${apiField}" for RID ${podId}`, result);

      // 6. Refresh data using correct bn_id
      fetchReceiptData(singlePodId?.ID, podId); // ensure singlePodId is correct
    } catch (error) {
      console.error("❌ Error updating field:", error);
    }
  };

  const closeIcon = () => {
    setShow(false);
    // navigate("/purchase_orders");
  };
  const handleEditDatils = (i, e) => {
    const newEditPackaging = [...details];
    newEditPackaging[i][e.target.name] = e.target.value;
    setDetails(newEditPackaging);
  };

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

      await axios.post(`${API_BASE_URL}/deleteReceipDetails`, {
        ID: pod_id,
      });
      toast.success(t("deleteSuccess"), {
        autoClose: 1000,
        theme: "colored",
      });
      getDetils(podId);
    } catch (e) { }
  };

  const [state, setState] = React.useState({
    po_id: from?.PO_ID,
    vendor_id: from?.Vendor,
    rounding: from?.rounding,
    vendor_name: from?.Vendor_name,
    Notes: from?.Notes,
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

  const { data: vendorList } = useQuery("getAllVendor");
  const { data: recieptDroupDown } = useQuery("RecieptsDropdown");

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
  const addPurchaseOrderDetails = async (id) => {
    try {
      const payload = {
        ID: formDataAdd?.pod_id || null, // optional, only if updating
        POD_Selection: formDataAdd.dropDown_id,
        RID: id || from?.PO_ID, // required
        dropDown_id: formDataAdd.dropDown_id,
        Unit: formDataAdd.unit_count_id, // mapping old Unit_Name_EN → Unit
        Price: formDataAdd.pod_price, // mapping old pod_price → Price
        QTY: formDataAdd.pod_quantity, // mapping old pod_quantity → QTY
        Notes: formDataAdd.Notes || "", // add notes if you have it
        user_id: localStorage.getItem("id"), // still passing user_id
      };

      const response = await axios.post(
        `${API_BASE_URL}/addOrUpdateReceiptDetail`,
        payload
      );

      console.log("✅ Receipt Detail Added:", response);

      getDetils(id);
      setModalOne(false);
      summaryDeatils();
      setResponceId(response.data.id);

      toast.success(t("successfully"), {
        autoClose: 5000,
        theme: "colored",
      });
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error(t("errorOccurred"), {
        autoClose: 5000,
        theme: "colored",
      });
    }
  };

  // const addPurchaseOrderDetails = async (id) => {
  //   try {
  //     const response = await axios.post(
  //       `${API_BASE_URL}/addOrUpdateReceiptDetail`,
  //       {
  //         RID: id || from?.PO_ID,
  //         data: formDataAdd, // Send the object directly
  //         user_id: localStorage.getItem("id"),
  //       }
  //     );
  //     console.log(response);

  //     getDetils(id);
  //     setModalOne(false);
  //     console.log(response);
  //     summaryDeatils();
  //     setResponceId(response.data.id);
  //     toast.success(t("successfully"), {
  //       autoClose: 5000,
  //       theme: "colored",
  //     });
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };
  const deleteOrder = async () => {
    try {
      // First: update access file

      // Second: delete purchase
      const deleteResponse = await axios.post(`${API_BASE_URL}/deleteReceipt`, {
        ID: podId,
        user_id: localStorage.getItem("id"),
      });
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

      navigate("/reciept");
    } catch (error) {
      console.error("Error during cancel process:", error);
      toast.error(t("tryAgain"));
    }
  };

  useEffect(() => {
    console.log("payableDATA:", payableDATA);
    console.log("roundingAmount:", roundingAmount);
    console.log("depositAvailable:", depositAvailable);

    setTotalPaymentAmount(
      (Number(payableDATA) || 0) +
      (Number(roundingAmount) || 0) -
      (Number(depositAvailable) || 0)
    );
  }, [payableDATA, roundingAmount, depositAvailable]);
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
      .get(`${API_BASE_URL}/getReceiptDetails?rid=${responceId}`)
      .then((response) => {
        console.log(response.data?.data1);
        setSingleDataShow(response.data?.data1);
        setPayableData(response.data?.data1?.Payable);
        setDepositAvailable(response.data?.data1?.Available_deposit);
        setTableSummary(response.data.data1);
        fetchReceiptData(null, responceId);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    everyDataSet();
  }, [responceId]);

  const update = async (e) => {
    await fetchDropdownData(); // Load dropdown data

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
  // const update = async (e) => {
  //   await fetchDropdownData(); // Load dropdown data
  //   setButtonClicked(false);
  //   try {
  //     const response = await axios.post(
  //       `${API_BASE_URL}/${"addPurchaseOrder"}`,
  //       state
  //     );
  //     console.log(response);
  //     setStock(response?.data);
  //     setFormDataAdd({
  //       pod_type_id: 0,
  //       unit_count_id: 0,
  //       POD_Selection: 0,
  //       pod_quantity: 0,
  //       pod_price: 0,
  //       pod_vat: 0,
  //       pod_wht_id: 0,
  //       pod_crate: 1,
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
  //       supplier_dua_date: prevState.supplier_dua_date,

  //       rounding: prevState.rounding,
  //     }));
  //     console.log(state);
  //     if (response.status === 200) {
  //       if (response.data.success) {
  //         const id = response.data?.po_id || from?.po_id;
  //         console.log(id);

  //         setPodId(id); //  Clear podId to avoid fetching last item data
  //         setModalOne(true);
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
  //     toast.error(t("errorOccurred"), {
  //       autoClose: 5000,
  //       theme: "colored",
  //     });
  //   }
  // };
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
            `${API_BASE_URL}/getReceiptDetails?rid=${po_id}`
          );
          console.log(poDetailsRes);
          setTableSummary(poDetailsRes?.data?.data1);
          const deposit = poDetailsRes?.data?.data1?.Available_deposit || 0;

          setDepositValue(deposit);
          fetchReceiptData(null, po_id);

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
  const refreshDepositValue = async (poId) => {
    try {
      const res1 = await axios.get(
        `${API_BASE_URL}/getReceiptDetails?rid=${poId}`
      );
      console.log("🔄 Refreshed Deposit:", res1);
      setTableSummary(res1?.data?.data1);
      const deposit = res1?.data?.data1?.Available_deposit || 0;
      setDepositValue(deposit);
      fetchReceiptData(null, poId);
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
      navigate("/reciept");
    } catch (e) {
      console.error("Delete error:", e);
      toast.error(t("deleteError"));
    }
  };
  const resetPaymentFormFields = (data) => {
    console.log(data);
    setDepositAvailableNew(data?.Available_deposit || 0);
    setBasePayment(data?.left_pay || 0);
    setVatNew(data?.Vat_payment || 0);
    setWhtNew(data?.wht_payment || 0);
    setRoundingNew1(data?.Rounding || 0);
    setTotalBeforText(data?.Total_Before_Tax || 0);

    setPaymentAmmountNew(data?.payment_amount || 0);
    setRoundingNew(data?.rounding || 0);
  };

  useEffect(() => {
    console.log(state?.po_id);
    const modalElement = document.getElementById("modalCombine");

    if (!modalElement) return;

    const handleShow = async () => {
      if (state?.po_id) {
        try {
          const res = await axios.get(
            `${API_BASE_URL}/getReceiptDetails?rid=${state.po_id}`
          );
          const data = res?.data?.data1;
          setTableSummary(data);
          resetPaymentFormFields(data);
          setSingleDataSet(data);
          fetchReceiptData(null, state.po_id);
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
  const updateDataOnchange = async (updatedState = state) => {
    // Prevent API if mandatory fields missing
    if (!updatedState.vendor_id || !updatedState.created) {
      console.log("Vendor and Receipt Date are required");
      return;
    }

    try {
      // 🔹 Remap keys for new API
      const payload = {
        RID: updatedState.po_id, // old po_id → RID
        Receipt_Date: updatedState.created, // old created → Receipt_Date
        Payor_ID: updatedState.vendor_id, // old vendor_id → Payor_ID
        Bank_Ref: updatedState.bank_ref, // stays same
        Payor: updatedState.vendor_name, // old vendor_name → Payor
        user_id: updatedState.user_id, // keep if needed
      };

      const response = await axios.post(
        `${API_BASE_URL}/addupdateReceipt`,
        payload
      );

      if (response.data.success) {
        console.log(response, ">>>>>>>>>>>>>>>>>>>>>>>>");
        setPodId(response.data?.RID);
        toast.success(t("receiptUpdated"), {
          autoClose: 3000,
          theme: "colored",
        });

        setState((prevState) => ({
          ...prevState,
          po_id: response.data?.RID || from?.RID || prevState.RID,
          Receipt_Date: prevState.created,
          Payor_ID: prevState.vendor_id,
          Bank_Ref: prevState.bank_ref,
          Payor: prevState.vendor_name,
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
  const submitPaymentData2 = async () => {
    if (!podId) {
      console.error("No RID found for final submission.");
      toast.error("Receipt ID missing. Please retry.");
      return;
    }

    console.log("Submitting BNPaymentSubmit for RID:", podId);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/BNPaymentSubmit`,
        { RID: podId } // Only send RID now
      );

      if (response?.data?.success === true) {
        toast.success("Payment submitted successfully!");

        // Reset form
        setPaymentForm({
          paymentDate: null,
          fx: "",
          paymentChannel: "",
          fxRateReceived: "",
          clientPaymentRef: "",
          interBankCharges: "",
          paymentAmount: "",
          prepayment: "",
          bankRef: "",
          localBankCharges: "",
          thbReceived: "",
          rounding: "",
          notes: "",
        });

        // Close modal
        let modalElement = document.getElementById("modalCombine");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) modalInstance.hide();

        // Refresh parent list
        //
        navigate("/reciept");
      } else {
        toast.warning(response.data?.message || "Submission failed.");
      }
    } catch (error) {
      console.error("Error submitting BNPaymentSubmit:", error);
      toast.error(t("tryAgain"));
    }
  };
  const [payorDropdown, setPayorDropdown] = useState([]);
  const handleModalOpen = async () => {
    try {
      // 1Set existing modal data
      // everyDataSet(a);
      // setRidData(a?.RID);
      console.log("hii");

      const res2 = await fetch(`${API_BASE_URL}/Receipt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          RID: podId, // Pass BN ID from selected record
        }),
      });
      const data2 = await res2.json();
      console.log(data2);

      // const res1 = await fetch(`${API_BASE_URL}/BNPayorDropDown`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     bn_id: a.ID, // Pass BN ID from selected record
      //   }),
      // });
      // const data1 = await res1.json();
      // console.log(data1);
      // console.log(data1.alldata);

      // // alldata
      // setPayorDropdown(data1.alldata);

      //  Call BNPaymentStep API to get LastInsertedReceiptID
      const res = await fetch(`${API_BASE_URL}/BNPaymentStep`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bn_id: a.ID, // Pass BN ID from selected record
          IID: "", // Keep empty if not applicable
          USER_ID: localStorage.getItem("id"), // Replace with logged-in user ID
        }),
      });

      const data = await res.json();

      if (data.success) {
        const latestId = data.latestId?.LastInsertedReceiptID || null;
        if (latestId) {
          console.log("Stored Receipt ID:", latestId);
          setReceiptID(latestId); // <-- Store in state for modal use
          fetchReceiptData(a.ID, latestId);
        }
      } else {
        console.error("BNPaymentStep Error:", data.message);
      }
    } catch (error) {
      console.error("handleModalOpen Error:", error);
    }
  };
  useEffect(() => {
    if (singleDataSet) {
      paymentViewSection();
    }
  }, [singleDataSet]);
  return (
    <>
      <Card
        title={`${t("receipts")} / ${from?.PO_ID ? t("update") : t("create")
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
                      <h6>{t("vendorsAndClients")}</h6>

                      {/* <Autocomplete
                        options={
                          recieptDroupDown?.map((vendor) => ({
                            id: vendor.ID, // ✅ use ID
                            name: vendor.Name, // ✅ use Name
                          })) || []
                        }
                        getOptionLabel={(option) => option.name || ""}
                        value={
                          recieptDroupDown
                            ?.map((vendor) => ({
                              id: vendor.ID,
                              name: vendor.Name,
                            }))
                            .find((option) => option.id === state.vendor_id) ||
                          null
                        }
                        onChange={(e, newValue) => {
                          setState({
                            ...state,
                            vendor_id: newValue?.id || "",
                            vendor_name: newValue?.name || "",
                          });
                        }}
                        sx={{ width: 300 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t("vendorsAndClients")}
                            InputLabelProps={{ shrink: false }}
                          />
                        )}
                      /> */}
                      <Autocomplete
                        options={
                          recieptDroupDown?.map((vendor) => ({
                            id: vendor.ID, // ✅ use ID
                            name: vendor.Name, // ✅ use Name
                          })) || []
                        }
                        getOptionLabel={(option) => option.name || ""}
                        value={
                          recieptDroupDown
                            ?.map((vendor) => ({
                              id: vendor.ID,
                              name: vendor.Name,
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

                          // ✅ Call API only if vendor & created exist
                          if (updatedState.vendor_id && updatedState.created) {
                            await updateDataOnchange(updatedState);
                          }
                        }}
                        sx={{ width: 300 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t("vendorsAndClients")}
                            InputLabelProps={{ shrink: false }}
                            error={!state.vendor_id} // highlight missing vendor
                          />
                        )}
                      />
                    </div>
                    <div className="col-lg-3 form-group">
                      <h6>{t("receiptDate")}</h6>
                      {/* <DatePicker
                        selected={
                          state.created && !isNaN(new Date(state.created))
                            ? new Date(state.created)
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

                          // अगर आप state को object में maintain कर रहे हैं (जैसे formData)
                          setState((prev) => ({
                            ...prev,
                            created: formattedDate,
                          }));
                        }}
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        placeholderText="DD/MM/YYYY"
                        customInput={<CustomInput />}
                      /> */}
                      {/* <DatePicker
                        selected={
                          state.receipt_date &&
                          !isNaN(new Date(state.receipt_date))
                            ? new Date(state.receipt_date)
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
                            receipt_date: formattedDate, // ✅ separate field for receipt date
                          };

                          setState(updatedState);

                          // ✅ Call API only if vendor & receipt_date exist
                          if (
                            updatedState.vendor_id &&
                            updatedState.receipt_date
                          ) {
                            await updateDataOnchange(updatedState);
                          }
                        }}
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        placeholderText="DD/MM/YYYY"
                        customInpu
                        t={<CustomInput />}
                      /> */}
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
                            await updateDataOnchange(updatedState);
                          }
                        }}
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        placeholderText="DD/MM/YYYY"
                        customInput={<CustomInput />}
                      />
                    </div>

                    <div className="col-lg-3 form-group">
                      <h6> {t("bankRef")}</h6>
                      {/* <input
                        className="w-full"
                        type="text"
                        name="supplier_invoice_number"
                        onChange={handleChange}
                        value={state.supplier_invoice_number}
                      /> */}
                      <input
                        className="w-full"
                        type="text"
                        name="bank_ref"
                        value={state.bank_ref || ""}
                        onChange={async (e) => {
                          const updatedState = {
                            ...state,
                            bank_ref: e.target.value,
                          };
                          setState(updatedState);

                          // ✅ Call API only if vendor & bank_ref exist
                          if (updatedState.vendor_id && updatedState.bank_ref) {
                            await updateDataOnchange(updatedState);
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="addButton">
                    {/* Button trigger modal */}
                    <button
                      type="button"
                      className="btn btn-primary"
                      // onClick={openModalOne}
                      onClick={update}
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
                                {formDataAdd.Unit_Name_EN !== "Time" &&
                                  formDataAdd.unit_count_id !== 4 && (
                                    <>
                                      <div className="col-lg-12 mb-2">
                                        <h6> {t("quantity")}</h6>
                                        <input
                                          className="mb-0"
                                          type="text"
                                          name="pod_quantity"
                                          value={formDataAdd.pod_quantity || ""}
                                          placeholder={t("quantity")}
                                          onChange={handleChangeAdd}
                                        />
                                      </div>
                                      <div className="col-lg-12 mb-2">
                                        <h6> {t("crate")}</h6>
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
                                <div className="col-lg-12 mb-2 parentFormPayment">
                                  <h6>{t("notes")}</h6>
                                  <textarea
                                    className="mb-0 form-control"
                                    name="Notes"
                                    value={formDataAdd.Notes || ""}
                                    placeholder={t("note")}
                                    onChange={handleChangeAdd}
                                    rows={3} // you can adjust the number of rows
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
                    className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive"
                  >
                    <table
                      id="example"
                      className=" tableLr display transPortCreate table table-hover table-striped borderTerpProduce table-responsive purchaseCreateTable"
                      style={{ width: "100%" }}
                    >
                      <thead>
                        <tr>
                          <th style={{ width: "170px" }}> {t("account")}</th>
                          <th style={{ width: "350px" }}> {t("item")}</th>
                          <th style={{ width: "150px" }}> {t("quantity")}</th>
                          <th style={{ width: "100px" }}> {t("unit")}</th>
                          <th style={{ width: "70px" }}> {t("price")}</th>
                          <th style={{ width: "150px" }}> {t("total")}</th>
                          <th style={{ width: "100px" }}> {t("vat")}</th>
                          {/* <th style={{ width: "100px" }}> {t("crate")}</th> */}
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
                              {formatterTwo.format(
                                item.pod_quantity * item.pod_price
                              )}
                            </td>
                            <td className="text-right">
                              {formatterTwo.format(item.pod_wht_id)}
                            </td>
                            {/* <td className="text-right">
                              {formatterTwo.format(item.pod_crate)}
                            </td> */}
                            <td>
                              {/* {item.pod_status === 1 && ( */}
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
                              {/* )} */}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>


                    {/* <div className="row py-4">
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
                    </div> */}
                  </div>
                  <div className="row pt-3 justify-content-end">
                    
                    <div className="col-lg-3">
                      <div className="flex totalBefore">
                        <div className="pe-3" style={{ width: "85%" }}>
                          {loading ? (
                            <p>Loading...</p>
                          ) : modalHead ? (
                            <>
                              {Object.keys(modalHead)
                                .slice(0, 6) // Show only first 6 items
                                .map((key) => (
                                  <div className="flexBefore" key={key}>
                                    <div>
                                      <strong>{modalHead[key]}</strong>
                                    </div>
                                    <div>
                                      <span>
                                        {modalData
                                          ? modalData[key] || ""
                                          : ""}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                            </>
                          ) : (
                            <p>{""}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="card-footer">
            {/* <button
              className="btn btn-primary"
              type="submit"
              name="signup"
              onClick={updateData}
              disabled={buttonClicked}
            >
              {from?.PO_ID ? t("update") : t("create")}
            </button> */}
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
            <div className="row">
              <div className="col-lg-2">
                <p style={{ color: "#fff" }}> {t("paymentChannel")}</p>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    deleteOrder();
                  }}
                >
                  {t("cancel")}
                </button>
              </div>
              <div className="col-xl-2 col-lg-2 col-md-4">
                <div className="parentFormPayment autoComplete">
                  <p> {t("paymentChannel")}</p>
                  <Autocomplete
                    disablePortal
                    options={paymentChannle || []}
                    value={
                      (paymentChannle || []).find(
                        (channel) =>
                          channel.bank_id === paymentForm.paymentChannel
                      ) || null
                    }
                    getOptionLabel={(option) => option.Bank_nick_name || ""}
                    onChange={(e, newValue) =>
                      handleChange5("paymentChannel", newValue?.bank_id || "")
                    }
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={t("paymentChannel")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-xl-2 col-lg-2 col-md-4">
                <div className="parentFormPayment">
                  <p> {t("rounding")}</p>
                  <input
                    type="text"
                    value={paymentForm.rounding}
                    onChange={(e) => handleChange5("rounding", e.target.value)}
                  />
                </div>
              </div>
              <div className="col-xl-2 col-lg-2 col-md-4">
                <div className="parentFormPayment">
                  <p> {t("bankRef")}</p>
                  <input
                    type="text"
                    value={paymentForm.bankRef}
                    onChange={(e) => handleChange5("bankRef", e.target.value)}
                  />
                </div>
              </div>
              <div className=" col-xl-2 col-lg-2 col-md-4">
                <div className="parentFormPayment">
                  <p> {t("localBankCharges")}</p>
                  <input
                    type="text"
                    value={paymentForm.localBankCharges}
                    onChange={(e) =>
                      handleChange5("localBankCharges", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="col-lg-2">
                <p style={{ color: "#fff" }}> {t("paymentChannel")}</p>

                <button
                  className="btn btn-primary"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#modalCombine"
                  onClick={() => handleModalOpen()}
                >
                  {t("payNow")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>
      {/* pay now modal */}
      <div
        className="modal fade "
        id="modalCombine"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
      >
        <div className="modal-dialog modalShipTo modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {t("receipts")}
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
                  <div className="row g-3">
                    {/* <div className=" col-xl-3 col-lg-3 col-md-4">
                       <div className="parentFormPayment autoComplete">
                        <p>{t("Payor")}</p>
                        <Autocomplete
                          disablePortal
                          options={payorDropdown || []}
                          value={
                            (payorDropdown || []).find(
                              (p) => p.Client === paymentForm.payor_id
                            ) || null
                          }
                          getOptionLabel={(option) => option.name || ""}
                          onChange={(e, newValue) => {
                            setPaymentForm((prev) => ({
                              ...prev,
                              payor_id: newValue?.Client || "",
                              Payor: newValue?.name || "",
                            }));

                            handleChange5("Payor_ID", newValue?.Client || "", {
                              Payor: newValue?.name || "",
                            });
                          }}
                          sx={{ width: 300 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={t("Select Payor")}
                            />
                          )}
                        />
                      </div> 
                    </div> */}
                    <div className=" col-xl-3 col-lg-3 col-md-6">
                      <div className="parentFormPayment">
                        <p> {t("paymentDate")}</p>
                        <DatePicker
                          // selected={paymentForm.paymentDate || state.Receipt_Date}
                          selected={
                            paymentForm.paymentDate &&
                              !isNaN(new Date(paymentForm.paymentDate))
                              ? new Date(paymentForm.paymentDate)
                              : state.Receipt_Date &&
                                !isNaN(new Date(state.Receipt_Date))
                                ? new Date(state.Receipt_Date)
                                : new Date() // fallback to today
                          }
                          onChange={(date) =>
                            handleChange5("paymentDate", date)
                          }
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Click to select a date"
                          customInput={<CustomInput />}
                        />
                      </div>
                    </div>
                    <div className=" col-xl-3 col-lg-3 col-md-6 autoComplete">
                      <div className="parentFormPayment">
                        <p> {t("fx")}</p>
                        <Autocomplete
                          disablePortal
                          options={currency || []}
                          getOptionLabel={(option) => option.FX || ""}
                          sx={{ width: 300 }}
                          onChange={(event, newValue) =>
                            handleChange5("fx", newValue?.ID || "")
                          }
                          value={
                            (currency || []).find(
                              (c) => c.ID === paymentForm.fx
                            ) ||
                            (currency && currency.length > 0
                              ? currency[0]
                              : null)
                          }
                          renderInput={(params) => (
                            <TextField {...params} placeholder="Fx" />
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-4">
                      <div className="parentFormPayment autoComplete">
                        <p> {t("paymentChannel")}</p>
                        <Autocomplete
                          disablePortal
                          options={paymentChannle || []}
                          value={
                            (paymentChannle || []).find(
                              (channel) =>
                                channel.bank_id === paymentForm.paymentChannel
                            ) || null
                          }
                          getOptionLabel={(option) =>
                            option.Bank_nick_name || ""
                          }
                          onChange={(e, newValue) =>
                            handleChange5(
                              "paymentChannel",
                              newValue?.bank_id || ""
                            )
                          }
                          sx={{ width: 300 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={t("paymentChannel")}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className=" col-xl-3 col-lg-3 col-md-4">
                      <div className="parentFormPayment">
                        <p> {t("fxRateReceived")}</p>
                        <input
                          type="text"
                          value={paymentForm.fxRateReceived || 1}
                          onChange={(e) =>
                            handleChange5("fxRateReceived", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className=" col-xl-3 col-lg-3 col-md-4">
                      <div className="parentFormPayment">
                        <p> {t("clientPaymentRef")}</p>
                        <input
                          type="text"
                          value={paymentForm.clientPaymentRef}
                          onChange={(e) =>
                            handleChange5("clientPaymentRef", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className=" col-xl-3 col-lg-3 col-md-4">
                      <div className="parentFormPayment">
                        <p> {t("interBankCharges")}</p>
                        <input
                          type="text"
                          value={paymentForm.interBankCharges || 0}
                          onChange={(e) =>
                            handleChange5("interBankCharges", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className=" col-xl-3 col-lg-3 col-md-4">
                      <div className="parentFormPayment">
                        <p> {t("paymentAmount")}</p>
                        <input
                          type="text"
                          value={
                            paymentForm.paymentAmount ||
                            tableSummary?.Total - tableSummary?.Rounding
                          }
                          onChange={(e) =>
                            handleChange5("paymentAmount", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className=" col-xl-3 col-lg-3 col-md-4">
                      <div className="parentFormPayment">
                        <p> {t("prepayment")}</p>
                        <input
                          type="text"
                          value={paymentForm.prepayment || 0}
                          onChange={(e) =>
                            handleChange5("prepayment", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* <div className=" col-xl-3 col-lg-3 col-md-4">
                      <div className="parentFormPayment">
                        <p> {t("thbReceived")}</p>
                        <input
                          type="number"
                          value={paymentForm.thbReceived}
                          onChange={(e) =>
                            handleChange5("thbReceived", e.target.value)
                          }
                        />
                      </div>
                    </div> */}
                  </div>
                </div>
                {/* <div className="col-lg-3">
                  <div className="flex totalBefore">
                    <div className="pe-3" style={{ width: "85%" }}>
                      <div className="flexBefore">
                        <div>
                          <strong> {t("averageRate")} </strong>
                        </div>
                        <div>
                          <span>0</span>
                        </div>
                      </div>
                      <div className="flexBefore">
                        <div>
                          <strong> {t("totalBeforeTax")} </strong>
                        </div>
                        <div>
                          <span>0</span>
                        </div>
                      </div>
                      <div className="flexBefore">
                        <div>
                          <strong> {t("vat")} : </strong>
                        </div>
                        <div>
                          <span>0</span>
                        </div>
                      </div>

                      <div className="flexBefore">
                        <div>
                          <strong> {t("wht")} : </strong>
                        </div>
                        <div>
                          <span>0</span>
                        </div>
                      </div>

                      <div className=" form-group">
                        <div className="flexBefore">
                          <div>
                            <strong> {t("rounding")} : </strong>
                          </div>
                          <div>
                            <span>0</span>
                          </div>
                        </div>
                        <div className="flexBefore">
                          <div>
                            <strong> {t("deposit")} : </strong>
                          </div>
                          <div>
                            <span>0</span>
                          </div>
                        </div>

                        <div className="flexBefore">
                          <div>
                            <strong> {t("amountToPay")} : </strong>{" "}
                          </div>

                          <div>
                            <span>0</span>
                          </div>
                        </div>
                        <div className="flexBefore">
                          <div>
                            <strong>{t("remainder")} : </strong>{" "}
                          </div>

                          <div>
                            <span>0</span>
                          </div>
                        </div>
                        <div className="flexBefore">
                          <div>
                            <strong>{t("lossGainFx")} : </strong>{" "}
                          </div>

                          <div>
                            <span>0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="col-lg-3">
                  <div className="flex totalBefore">
                    <div className="pe-3" style={{ width: "85%" }}>
                      {loading ? (
                        <p>Loading...</p>
                      ) : modalHead ? (
                        <>
                          {Object.keys(modalHead).map((key) => (
                            <div className="flexBefore" key={key}>
                              <div>
                                <strong>{modalHead[key]}</strong>
                              </div>
                              <div>
                                <span>
                                  {modalData ? modalData[key] || 0 : 0}
                                </span>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <p>{""}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-lg-4 mt-3">
                  <div className="parentFormPayment">
                    <p> {t("notes")}</p>
                    <textarea
                      value={paymentForm.notes}
                      onChange={(e) => handleChange5("notes", e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={submitPaymentData2}
                className="btn btn-primary"
              >
                {t("submit")}
              </button>
              <button
                type="button"
                onClick={paymentDataClear}
                className="btn btn-primary"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*  */}
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
                {t("payment")}
              </h1>
              <button
                type="button"
                onClick={paymentDataClear}
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="mdi mdi-close"></i>
              </button>
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
                              placeholder={t("paymentChannel")}
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

export default ReceiptCreate;
