 import { useForm } from "@tanstack/react-form";
// import axios from "axios";
import axios from "../../Url/Api";
import { useMemo, useState, useEffect } from "react";
import { useQuery } from "react-query";
import img from "../../../src/assets/image.jpeg"; // your local image
import NotoSansThaiRegular from "../../assets/fonts/NotoSansThai-Regular-normal";
import { Link, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import logo from "../../assets/logoT.jpg";
import "jspdf-autotable";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import MySwal from "../../swal";
import { TableView } from "../table";
import { API_IMAGE_URL } from "../../Url/Url";
import { Button, Modal } from "react-bootstrap";
import RobotoRegular from "../../assets/fonts/Roboto_Regular";
import DatePicker from "react-datepicker";
import Autocomplete from "@mui/material/Autocomplete";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import { FaCalendarAlt } from "react-icons/fa";
import wht from "../../assets/wht.png";
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
const WithHold = () => {
  const [t, i18n] = useTranslation("global");
  const [isLoading, setIsLoading] = useState(false);
  const [columns, setColumns] = useState([]);

  const loadingModal = MySwal.mixin({
    title: "Loading...",
    didOpen: () => {
      MySwal.showLoading();
    },
    showCancelButton: false,
    showConfirmButton: false,
    allowOutsideClick: false,
  });
  const { data: currency } = useQuery("getCurrency");
  useEffect(() => {
    if (currency) {
      console.log("Currency API Data:", currency);
    }
  }, [currency]);
  const { data: paymentChannle } = useQuery("PaymentChannela");

  const [unitPrices, setUnitPrices] = useState({});
  const [itemDetails2, setItemDetails2] = useState(false);
  const [claimReasons, setClaimReasons] = useState({});

  const handleClaimReasonChange = (id, value) => {
    setClaimReasons((prev) => ({ ...prev, [id]: value }));
  };
  const [receiptID, setReceiptID] = useState("");
  const [itemDetails, setItemDetails] = useState(false);
  const [itemDetails1, setItemDetails1] = useState(""); // Default state
  const [useAgreedPricing, setUseAgreedPricing] = useState(false);
  const [selectedInvoice1, setSelectedInvoice1] = useState("Client");
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
  const [singlePodId, setSinglePodId] = useState("");

  // const handleChange5 = (field, value) => {
  //   setPaymentForm((prev) => ({
  //     ...prev,
  //     [field]: value,
  //   }));
  // };

  const handleChange5 = async (field, value) => {
    //  Update UI state immediately
    setPaymentForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    // 2Ensure receipt ID exists
    if (!receiptID) {
      console.error("No RID found to update.");
      return;
    }

    //  Map form field names to API fields
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
    };

    const apiField = fieldMapping[field];
    if (!apiField) return;

    //  Update single field via API
    try {
      await fetch(`${API_BASE_URL}/BNPayment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          RID: receiptID,
          [apiField]: value,
        }),
      });

      //  Refresh receipt data for Invoice (using IID)
      fetchReceiptData(singlePodId.Order_ID);

      console.log(
        `Field "${apiField}" updated successfully for RID: ${receiptID}`
      );
    } catch (error) {
      console.error("Error updating field:", error);
    }
  };

  // const submitPaymentData = async () => {
  //   const paymentData = {
  //     bn_id: singlePodId.ID, // or however you get bn_id
  //     IID: singlePodId.Order_ID, // same for IID
  //     USER_ID: localStorage.getItem("id"),
  //     Receipt_Date: paymentForm.paymentDate, // from DatePicker
  //     Prepayment: paymentForm.prepayment,
  //     Payment_Channel: paymentForm.paymentChannel,
  //     FX_Received: paymentForm.thbReceived, // THB Received → FX Received (if that's correct mapping)
  //     FX: paymentForm.fx, // selected FX
  //     R_FX_Rate: paymentForm.fxRateReceived, // Rate Received
  //     BankFees_FX: paymentForm.interBankCharges, // Inter-bank charges (FX)
  //     BankFees_THB: paymentForm.localBankCharges, // Local bank charges (THB)
  //     Notes: paymentForm.notes,
  //   };

  //   console.log("BNPayment payload:", paymentData);

  //   try {
  //     const response = await axios.post(
  //       `${API_BASE_URL}/BNPayment`,
  //       paymentData
  //     );

  //     if (response?.data?.success === true) {
  //       toast.success(response.data?.message);

  //       // Reset the form
  //       setPaymentForm({
  //         paymentDate: null,
  //         fx: "",
  //         paymentChannel: "",
  //         fxRateReceived: "",
  //         clientPaymentRef: "",
  //         interBankCharges: "",
  //         paymentAmount: "",
  //         prepayment: "",
  //         bankRef: "",
  //         localBankCharges: "",
  //         thbReceived: "",
  //         rounding: "",
  //         notes: "",
  //       });

  //       // Close modal
  //       let modalElement = document.getElementById("modalCombine");
  //       let modalInstance = bootstrap.Modal.getInstance(modalElement);
  //       if (modalInstance) modalInstance.hide();

  //       // Refresh list
  //       allInvoiceData();
  //     } else {
  //       toast.warning(response.data?.message);
  //     }
  //   } catch (error) {
  //     console.error("Error submitting BNPayment data", error);
  //     toast.error(t("tryAgain"));
  //   }
  // };

  const [companyAddress, setCompanyAddress] = useState("");
  const [data3, setData3] = useState("");
  const [tableData, setTableData] = useState([]);
  const [totalDetails, setTotalDetails] = useState("");
  const [headerData, setHeaderData] = useState("");
  const [invoiceData, setInvoiceData] = useState("");
  // const [messageSet1, setMassageSet1] = useState("");
  const [messageSet2, setMassageSet2] = useState("");

  const [messageSet, setMassageSet] = useState("");
  const [filterData1, setFilterData1] = useState("");
  const [filterData2, setFilterData2] = useState("");
  const [cbm1, setCbm1] = useState(true);

  const [quantity, setQuantity] = useState("");
  const [invoiceID, setInvoiceId] = useState("");
  const [invoiceID2, setInvoiceId2] = useState("");
  const [data1, setData1] = useState();
  const [paymentDate, setPaymentDate] = useState("");
  const [paidAmounts, setPaidAmounts] = useState({});
  const [units, setUnits] = useState({});
  const [claims, setClaims] = useState({});
  const [claimOptions, setClaimOptions] = useState([]);

  const [amounts, setAmounts] = useState({});
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [invoiceID1, setInvoiceId1] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFile1, setSelectedFile1] = useState(null);
  const [show, setShow] = useState(false);
  const [notes, setNotes] = useState("");
  const [massageShow, setMassageShow] = useState("");
  const [cbm, setCbm] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState("Client");
  const [exchangeRate, setExchangeRate] = useState(false);
  const [exchangeRate1, setExchangeRate1] = useState(false);
  const [exchangeRate2, setExchangeRate2] = useState(false);
  const [exchangeRate3, setExchangeRate3] = useState(false);

  const [selectedDeliveryTerm, setSelectedDeliveryTerm] = useState(null);
  const [uploadImage, setUploadImage] = useState("");
  const [data, setData] = useState([]);
  const [invImage, setInvImage] = useState(null);
  const { data: unit } = useQuery("getAllUnit");
  const { data: claim } = useQuery("dropdownClaimReason");

  const { data: deliveryList } = useQuery("DropdownDelivery");

  console.log(deliveryList);

  const [modalHead, setModalHead] = useState(null); // Stores API head data
  const [modalData, setModalData] = useState(null); // Stores API row data
  const [loading, setLoading] = useState(false);

  const fetchInvoiceClaim = async (invoiceID2) => {
    const response = await fetch(`${API_BASE_URL}/getInvoiceClaim`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ order_id: invoiceID2 }),
    });

    if (!response.ok) {
      throw new Error(t("networkError"));
    }

    return response.json();
  };
  const { data: details, refetch: getOrdersDetails } = useQuery(
    ["getInvoiceClaim", invoiceID2],
    () => fetchInvoiceClaim(invoiceID2),
    {
      enabled: !!invoiceID2, // Only run when invoiceID2 is defined
    }
  );

  console.log(details);
  useEffect(() => {
    if (details && details.length > 0) {
      const initialUnitPrices = {};
      const initialAdjustedPrices = {};
      details.forEach((item) => {
        initialUnitPrices[item.id_id] = item.Unit_id;
        initialAdjustedPrices[item.id_id] = item.adjusted_price;
      });
      setUnitPrices(initialUnitPrices);
      setAdjustedPrices(initialAdjustedPrices);
    }
  }, [details]);

  const newFormatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const handleAgreedPricingChange = (e) => {
    setUseAgreedPricing(e.target.checked);
    console.log(useAgreedPricing);
    // pdfAllData();
  };
  const handleAgreedPricingChange1 = (e) => {
    setItemDetails(e.target.checked);
    console.log(itemDetails);
    // pdfAllData();
  };
  const handleAgreedPricingChange2 = (e) => {
    setCbm(e.target.checked);
    console.log(cbm);
    // pdfAllData();
  };

  const handleAgreedPricingChange3 = (e) => {
    setExchangeRate(e.target.checked);
    console.log(exchangeRate);
    // pdfAllData();
  };
  const handleAgreedPricingChange7 = (e) => {
    setExchangeRate1(e.target.checked);
  };
  const handleAgreedPricingChange8 = (e) => {
    setExchangeRate2(e.target.checked);
  };
  const handleAgreedPricingChange9 = (e) => {
    setExchangeRate3(e.target.checked);
  };
  const handleRadioChange6 = (event) => {
    setSelectedInvoice1(event.target.value);
  };
  const handleRadioChange = (event) => {
    setSelectedInvoice(event.target.value);
  };
  const handleAgreedPricingChange5 = (e) => {
    setItemDetails2(e.target.checked);
    console.log(itemDetails2);
  };
  const handleAgreedPricingChange4 = (e) => {
    setCbm1(e.target.checked);
    console.log(cbm);
  };
  const handleChangeDelivery = (event) => {
    setSelectedDeliveryTerm(Number(event.target.value)); // store ID
  };
  const handleFileChangeInv = (event) => {
    const fileInv = event.target.files[0];
    if (fileInv) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvImage(reader.result);
      };
      reader.readAsDataURL(fileInv);
    }
  };
  const allInvoiceData = () => {
    const lang = localStorage.getItem("language");
    const langValue = lang === "en" ? 1 : 0;

    axios
      .post(`${API_BASE_URL}/WTHView`, {
        lang: langValue,
      })
      .then((response) => {
        console.log(response);

        const { head, data } = response.data;

        // Remove unwanted columns from table (Order_ID, Status_value)
        const columnsToHide = ["Order_ID", "Status_value"];

        // Create dynamic columns excluding hidden ones
        const dynamicColumns = Object.keys(head)
          .filter((key) => !columnsToHide.includes(key))
          .map((key) => ({
            Header: t(head[key]), // Translate header if needed
            accessor: key,
          }));

        dynamicColumns.push({
          Header: t("actions"),
          accessor: (a) => (
            <>
              <div className="editIcon">
                <Link
                  to=" "
                  state={{ from: { ...a, isReadOnly: true } }}
                ></Link>
                {(+a.Status === 7 ||
                  +a.Status === 8 ||
                  +a.Status === 9 ||
                  +a.Status === 10 ||
                  +a.Status === 11 ||
                  +a.Status === 12 ||
                  +a.Status === 13) && (
                  <Link to="/invoiceview" state={{ from: { ...a } }}>
                    <i className="mdi mdi-eye" />
                  </Link>
                )}
                <>
                  {(+a.Status === 7 ||
                    +a.Status === 8 ||
                    +a.Status === 9 ||
                    +a.Status === 12) && (
                    <Link to="/invoice_edit" state={{ from: { ...a } }}>
                      <i className="mdi mdi-pencil" />
                    </Link>
                  )}
                  {(+a.Status === 7 ||
                    +a.Status === 8 ||
                    +a.Status === 9 ||
                    +a.Status === 12) && (
                    <button
                      type="button"
                      onClick={() => restoreEanPackage(a.Order_ID)}
                    >
                      <i className="mdi mdi-restore" />
                    </button>
                  )}
                </>
                {(+a.Status === 7 ||
                  +a.Status === 8 ||
                  +a.Status === 9 ||
                  +a.Status === 10 ||
                  +a.Status === 11) && (
                  <button type="button" onClick={() => generatePdf2(a)}>
                    <svg
                      className="SvgQuo"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <title>alpha-c-box-outline</title>
                      <path d="M3,5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5M5,5V19H19V5H5M11,7H13A2,2 0 0,1 15,9V10H13V9H11V15H13V14H15V15A2,2 0 0,1 13,17H11A2,2 0 0,1 9,15V9A2,2 0 0,1 11,7Z"></path>
                    </svg>
                  </button>
                )}
                {(+a.Status === 7 ||
                  +a.Status === 8 ||
                  +a.Status === 9 ||
                  +a.Status === 10 ||
                  +a.Status === 11 ||
                  +a.Status === 12 ||
                  +a.Status === 13) && (
                  <button
                    type="button"
                    data-bs-toggle="modal"
                    onClick={() => setFilterData1(a)}
                    data-bs-target="#exampleModalCustomization"
                  >
                    <svg
                      className="SvgQuo"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <title>invoice-text-check-outline</title>
                      <path d="M12 20L13.3 20.86C13.1 20.28 13 19.65 13 19C13 18.76 13 18.5 13.04 18.29L12 17.6L9 19.6L6 17.6L5 18.26V5H19V13C19.7 13 20.37 13.12 21 13.34V3H3V22L6 20L9 22L12 20M17 9V7H7V9H17M15 13V11H7V13H15M15.5 19L18.25 22L23 17.23L21.84 15.82L18.25 19.41L16.66 17.82L15.5 19Z"></path>
                    </svg>
                  </button>
                )}
                {(+a.Status === 7 ||
                  +a.Status === 8 ||
                  +a.Status === 9 ||
                  +a.Status === 10 ||
                  +a.Status === 11 ||
                  +a.Status === 12 ||
                  +a.Status === 13) && (
                  <button
                    type="button"
                    data-bs-toggle="modal"
                    onClick={() => setFilterData1(a)}
                    data-bs-target="#exampleModalCustomization5"
                  >
                    <svg
                      className="SvgQuo"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <title>package-variant-closed</title>
                      <path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L10.11,5.22L16,8.61L17.96,7.5L12,4.15M6.04,7.5L12,10.85L13.96,9.75L8.08,6.35L6.04,7.5M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z"></path>
                    </svg>
                  </button>
                )}
                {(+a.Status === 7 ||
                  +a.Status === 8 ||
                  +a.Status === 9 ||
                  +a.Status === 10 ||
                  +a.Status === 11) && (
                  <button
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal2"
                    onClick={() => quotationCopy(a.Order_ID)}
                  >
                    <i className="mdi mdi-note-outline" />
                  </button>
                )}
                {+a.Status === 7 && (
                  <button
                    type="button"
                    onClick={() => quotationConfirmation(a.Order_ID)}
                  >
                    {" "}
                    <i
                      className="mdi mdi-check"
                      style={{
                        width: "20px",
                        color: "#203764",
                        fontSize: "22px",
                        marginTop: "10px",
                      }}
                    />
                  </button>
                )}
                {+a.Status === 8 && (
                  <button onClick={() => quotationConfirmation8(a.Order_ID)}>
                    <svg
                      className="SvgQuo"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <title>truck-check-outline</title>
                      <path d="M18 18.5C18.83 18.5 19.5 17.83 19.5 17C19.5 16.17 18.83 15.5 18 15.5C17.17 15.5 16.5 16.17 16.5 17C16.5 17.83 17.17 18.5 18 18.5M19.5 9.5H17V12H21.46L19.5 9.5M6 18.5C6.83 18.5 7.5 17.83 7.5 17C7.5 16.17 6.83 15.5 6 15.5C5.17 15.5 4.5 16.17 4.5 17C4.5 17.83 5.17 18.5 6 18.5M20 8L23 12V17H21C21 18.66 19.66 20 18 20C16.34 20 15 18.66 15 17H9C9 18.66 7.66 20 6 20C4.34 20 3 18.66 3 17H1V6C1 4.89 1.89 4 3 4H17V8H20M3 6V15H3.76C4.31 14.39 5.11 14 6 14C6.89 14 7.69 14.39 8.24 15H15V6H3M5 10.5L6.5 9L8 10.5L11.5 7L13 8.5L8 13.5L5 10.5Z" />
                    </svg>
                  </button>
                )}
                {+a.Status === 12 && (
                  <button
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#modalClaim"
                    onClick={() => boxMinutes(a.Order_ID, a)}
                  >
                    <svg
                      className="SvgQuo"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <title>airport</title>
                      <path d="M14.97,5.92C14.83,5.41 14.3,5.1 13.79,5.24L10.39,6.15L5.95,2.03L4.72,2.36L7.38,6.95L4.19,7.8L2.93,6.82L2,7.07L3.66,9.95L14.28,7.11C14.8,6.96 15.1,6.43 14.97,5.92M21,10L20,12H15L14,10L15,9H17V7H18V9H20L21,10M22,20V22H2V20H15V13H20V20H22Z" />
                    </svg>
                  </button>
                )}
                {(+a.Status === 12 || +a.Status === 13) && (
                  <button onClick={() => openPdf(a.document)}>
                    <i class="mdi mdi-download"></i>
                  </button>
                )}
                {+a.Status === 12 && (
                  <button
                    data-bs-toggle="modal"
                    data-bs-target="#modalAdjustBox1"
                    type="button"
                    onClick={() => inventoryBoxes(a.Order_ID)}
                  >
                    <svg
                      className="SvgQuo"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <title>airplane-check</title>
                      <path d="M15.97 13.83C15.08 14.35 14.34 15.09 13.82 16L11.55 11.63L7.66 15.5L8 18L6.95 19.06L5.18 15.87L2 14.11L3.06 13.05L5.54 13.4L9.43 9.5L2 5.62L3.41 4.21L12.61 6.33L16.5 2.44C17.08 1.85 18.03 1.85 18.62 2.44C19.2 3.03 19.2 4 18.62 4.56L14.73 8.45L15.97 13.83M21.34 15.84L17.75 19.43L16.16 17.84L15 19L17.75 22L22.5 17.25L21.34 15.84Z" />
                    </svg>
                  </button>
                )}
                {+a.Status === 13 && (
                  <button
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#modalClaim"
                    onClick={() => boxMinutes(a.Order_ID, a)}
                  >
                    <svg
                      className="SvgQuo"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <title>text-box-minus</title>
                      <path d="M22,17V19H14V17H22M12,17V15H7V17H12M17,11H7V13H14.69C13.07,14.07 12,15.91 12,18C12,19.09 12.29,20.12 12.8,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H19A2,2 0 0,1 21,5V12.8C20.12,12.29 19.09,12 18,12L17,12.08V11M17,9V7H7V9H17Z" />
                    </svg>
                  </button>
                )}
                {(+a.Status === 10 ||
                  +a.Status === 11 ||
                  +a.Status === 12 ||
                  +a.Status === 13) && (
                  <button
                    type="button"
                    onClick={() => pdfSelectedType(a.Consignee_ID, a)}
                  >
                    <svg
                      className=" "
                      version="1.0"
                      xmlns="http://www.w3.org/2000/svg"
                      width="22px"
                      height="22px"
                      viewBox="0 0 350 350"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <g
                        transform="translate(0.000000,344.000000) scale(0.100000,-0.100000)"
                        fill="#203764"
                        stroke="none"
                      >
                        <path d="M1291 2913 c-19 -16 -21 -30 -23 -132 l-3 -115 -219 -37 c-270 -47 -265 -44 -249 -156 6 -43 11 -78 10 -79 -1 0 -96 -33 -212 -73 -203 -70 -245 -92 -245 -127 0 -33 274 -780 292 -796 15 -14 24 -15 39 -8 10 6 19 17 19 24 0 8 -61 184 -136 391 -74 208 -134 378 -132 380 2 1 90 32 196 68 135 47 194 63 197 54 2 -6 65 -372 140 -811 75 -440 141 -808 146 -817 5 -10 18 -20 28 -24 11 -3 167 19 346 50 180 31 332 54 338 52 5 -1 -165 -66 -378 -143 -213 -76 -391 -140 -394 -142 -4 -1 -71 179 -151 400 -79 222 -148 409 -153 416 -13 17 -42 15 -57 -3 -11 -13 13 -86 135 -428 81 -226 154 -422 161 -434 7 -12 22 -24 33 -28 12 -4 253 78 658 223 733 264 727 262 1016 262 181 0 186 1 201 22 14 20 16 118 16 859 l0 836 -175 167 -174 166 -625 0 c-579 0 -625 -1 -645 -17z m1189 -177 c0 -195 12 -206 220 -206 l130 0 0 -790 0 -790 -745 0 -745 0 -2 376 c-3 339 -5 378 -20 387 -12 8 -21 7 -32 -2 -14 -12 -16 -60 -16 -407 0 -344 2 -395 16 -408 13 -14 61 -16 367 -17 215 0 342 -4 327 -9 -32 -11 -801 -143 -806 -138 -2 2 -72 403 -155 892 -119 691 -150 889 -140 895 7 5 88 20 179 35 92 15 177 30 189 33 l23 5 2 -383 3 -384 30 0 30 0 3 513 2 512 570 0 570 0 0 -114z m260 -80 l44 -46 -112 0 -112 0 0 106 0 106 68 -60 c37 -33 87 -81 112 -106z" />
                        <path d="M1529 2364 c-9 -11 -10 -20 -2 -32 9 -16 58 -17 568 -17 510 0 559 1 568 17 8 12 7 21 -2 32 -12 14 -74 16 -566 16 -492 0 -554 -2 -566 -16z" />
                        <path d="M1536 2104 c-19 -19 -20 -36 -4 -52 17 -17 1109 -17 1126 0 18 18 14 46 -7 58 -13 6 -207 10 -560 10 -477 0 -541 -2 -555 -16z" />
                        <path d="M1530 1835 c-16 -19 -4 -52 23 -59 29 -8 1055 -8 1084 0 27 7 39 40 23 59 -18 22 -1112 22 -1130 0z" />
                        <path d="M1529 1564 c-9 -11 -10 -20 -2 -32 9 -16 60 -17 565 -20 597 -2 589 -3 573 48 -6 20 -11 20 -564 20 -497 0 -560 -2 -572 -16z" />
                        <path d="M1536 1304 c-9 -8 -16 -19 -16 -24 0 -5 7 -16 16 -24 14 -14 79 -16 563 -16 412 0 550 3 559 12 18 18 14 46 -7 58 -13 6 -207 10 -560 10 -477 0 -541 -2 -555 -16z" />
                      </g>
                    </svg>
                  </button>
                )}
                {+a.Status === 9 && (
                  <button
                    data-bs-toggle="modal"
                    data-bs-target="#modalAdjustBox"
                    type="button"
                    onClick={() => inventoryBoxes(a.Order_ID)}
                  >
                    <i className="mdi mdi-scale"></i>{" "}
                  </button>
                )}
                {/* <button
                  type="button"
                  className="SvgAnchor"
                  data-bs-toggle="modal"
                  data-bs-target="#modalCombine"
                  onClick={() => {
                    handleModalOpen(a);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <svg
                    className="SvgQuo"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <title>cash-check</title>
                    <path d="M3 6V18H13.32C13.1 17.33 13 16.66 13 16H7C7 14.9 6.11 14 5 14V10C6.11 10 7 9.11 7 8H17C17 9.11 17.9 10 19 10V10.06C19.67 10.06 20.34 10.18 21 10.4V6H3M12 9C10.3 9.03 9 10.3 9 12C9 13.7 10.3 14.94 12 15C12.38 15 12.77 14.92 13.14 14.77C13.41 13.67 13.86 12.63 14.97 11.61C14.85 10.28 13.59 8.97 12 9M21.63 12.27L17.76 16.17L16.41 14.8L15 16.22L17.75 19L23.03 13.68L21.63 12.27Z" />
                  </svg>
                </button> */}
                {/* <button className="iconWht" onClick={generatePdfWithBackground}>
                  WHT
                </button> */}
                <div
                  className="whtImg"
                  onClick={() => generatePdfWithBackground(a.ID)}
                >
                  <img src={wht} alt="" />
                </div>
              </div>
            </>
          ),
        });

        setColumns(dynamicColumns);
        setData(data || []);
      })
      .catch((error) => {
        console.error("Error fetching Debit Note:", error);
        toast.error(t("genericError"));
      });
  };
  const handleClose = () => setShow(false);
  useEffect(() => {
    allInvoiceData();
  }, []);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { data: liner } = useQuery("getLiner");
  const [id, setID] = useState(null);
  const dataFind = useMemo(() => {
    return data?.find((v) => +v.order_id == +id);
  }, [id, data]);
  const form = useForm({
    defaultValues: {
      Liner: dataFind?.Freight_liner || "",
      journey_number: dataFind?.Freight_journey_number || "",
      bl: dataFind?.Freight_bl || "",
      Load_date:
        new Date(dataFind?.Freight_load_date || null)
          .toISOString()
          .split("T")[0] || "",
      Load_time: dataFind?.Freight_load_time || "",
      Ship_date:
        new Date(dataFind?.Freight_ship_date || null)
          .toISOString()
          .split("T")[0] || "",
      ETD: dataFind?.Freight_etd || "",
      Arrival_date:
        new Date(dataFind?.Freight_arrival_date || null)
          .toISOString()
          .split("T")[0] || "",
      ETA: dataFind?.Freight_eta || "",
    },
    onSubmit: async ({ value }) => {
      if (dataFind?.order_id) {
        try {
          await axios.post(`${API_BASE_URL}/updateOrderFreight`, {
            order_id: dataFind?.order_id,
            ...value,
          });
          toast.success(t("orderUpdateSuccess"));
          refetch();
        } catch (e) {
          toast.error(t("genericError"));
        }
      }
      closeModal();
    },
  });
  const handleChange = (e) => {
    setQuantity(e.target.value);
  };
  const handleChange2 = (e) => {
    setNotes(e.target.value);
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };
  const boxMinutes = (invoiceId, data) => {
    console.log(invoiceId);
    console.log(data);
    setData1(data);
    setInvoiceId2(invoiceId);
  };
  const openModal = (id = null) => {
    setID(id);
    form.reset();
    setIsOpenModal(true);
  };
  const deleteOrder = (id) => {
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
          await axios.post(`${API_BASE_URL}/deleteOrder`, { id: id });
          toast.success("Order delete successfully");
          refetch();
        } catch (e) {
          toast.error("Something went wrong");
        }
      }
    });
  };

  const quotationConfirmation = async (Invoice_id) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/invoice-status-7-8`, {
        order_id: Invoice_id,
        user_id: localStorage.getItem("id"),

        // Other data you may need to pass
      });
      console.log("API response:", response);
      allInvoiceData();
      toast.success(t("invoiceLoaded"));
      // Handle the response as needed
    } catch (error) {
      console.error("API call error:", error);
      toast.error(t("invoiceLoadFailed"));
    }
  };
  const quotationConfirmation8 = async (Invoice_id) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/invoice-status-8-9`, {
        order_id: Invoice_id,
        user_id: localStorage.getItem("id"),

        // Other data you may need to pass
      });
      console.log("API response:", response);
      allInvoiceData();
      toast.success(t("invoiceLoaded"));
      // Handle the response as needed
    } catch (error) {
      console.error("API call error:", error);
      toast.error(t("invoiceLoadFailed"));
    }
  };
  const quotationConfirmation10 = async (Invoice_id, document) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/invoice-status-10-11`,
        {
          order_id: Invoice_id,
          user_id: localStorage.getItem("id"),
        }
      );

      console.log("API response:", response);
      allInvoiceData();
      toast.success(t("invoiceLoaded"));

      // Open the PDF in a new tab
      const pdfUrl = `${API_IMAGE_URL}${document}`;
      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error("API call error:", error);
      toast.error(t("invoiceLoadFailed"));
    }
  };

  const inventoryBoxes = (Invoice_id) => {
    setInvoiceId(Invoice_id);
  };
  const inventoryAirplane = (Invoice_id) => {
    setInvoiceId(Invoice_id);
  };
  const closeIcon = () => {
    setShow(false);

    if (massageShow) {
      setMassageShow("");
    }
  };
  useEffect(() => {
    if (details && Array.isArray(details)) {
      const initialPaidAmounts = {};
      const initialUnits = {};
      const initialAmounts = {};
      const initialClaims = {};

      details.forEach((item) => {
        initialPaidAmounts[item.Invoice_id] = item.paidAmount || "";
        initialUnits[item.Invoice_id] = item.unit || "";
        initialAmounts[item.Invoice_id] = item.amount || "";
        initialClaims[item.Invoice_id] = item.claim || "";
      });

      setPaidAmounts(initialPaidAmounts);
      setUnits(initialUnits);
      setAmounts(initialAmounts);
      setClaims(initialClaims);
    }
  }, [details]);
  const handleChange1 = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setErrorMessage("");
    } else {
      setErrorMessage(t("selectPdf"));
      setSelectedFile(null);
    }
  };
  const handleEditEan = async (event, id_id) => {
    const newValue = event.target.value;
    setUnitPrices((prev) => ({ ...prev, [id_id]: newValue }));

    try {
      const response = await axios.post(`${API_BASE_URL}/EditInvoiceDetails`, {
        id_id: id_id,
        Invoice_id: from?.Invoice_id,
        unit_id: newValue,
      });
      getOrdersDetails();
      console.log("API response:", response);
    } catch (error) {
      console.error("API call error:", error);
    }
  };
  const handleChange21 = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile1(file);
      setErrorMessage("");
    } else {
      setErrorMessage(t("selectPdf"));
      setSelectedFile1(null);
    }
  };
  const uploadData = () => {
    axios
      .post(`${API_BASE_URL}/invoice-status-9-10`, {
        order_id: invoiceID,
        Port_Weight: quantity,
        user_id: localStorage.getItem("id"),
      })
      .then((response) => {
        console.log(response);
        let modalElement = document.getElementById("modalAdjustBox");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        console.log(response);
        toast.success(t("invoiceWeightAdjusted"), {
          autoClose: 1000,
          theme: "colored",
        });
        allInvoiceData();
        setQuantity("");
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

  const submitInvoicePayment = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/BNPaymentSubmit`, {
        RID: receiptID, // Ensure you pass the correct receipt ID for invoice
      });

      if (response?.data?.success) {
        toast.success(
          response.data?.message || "Invoice payment submitted successfully!",
          {
            autoClose: 1000,
            theme: "colored",
          }
        );

        // Close the modal
        let modalElement = document.getElementById("modalCombine");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) modalInstance.hide();

        // Refresh invoice data
        allInvoiceData();
      } else {
        toast.warning(response?.data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error submitting invoice payment:", error);
      toast.error("Failed to submit invoice payment. Please try again.", {
        autoClose: 1000,
        theme: "colored",
      });
    }
  };

  const uploadData1 = () => {
    if (!selectedFile) {
      setErrorMessage(t("noFileSelected"));
      return;
    }

    const formData = new FormData();
    formData.append("order_id", invoiceID);
    formData.append("document", selectedFile);
    formData.append("user_id", localStorage.getItem("id"));

    axios
      .post(`${API_BASE_URL}/invoice-status-11-12`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        setSelectedFile("");
        let modalElement = document.getElementById("modalAdjustBox1");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }

        if (response.data.success == false) {
          setShow(true);
          // modalInstance.show();
          setMassageShow(response.data.message_th);
        } else if (response.data.success == true) {
          // modalInstance.hide();
          setShow(false);
        }
        console.log(response);
        toast.success(t("invoiceShipped"), {
          autoClose: 1000,
          theme: "colored",
        });

        allInvoiceData();
        // Clear the quantity field after successful update
        setSelectedFile(null); // Clear selected file
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // const dynamicMessage = async (Invoice_id) => {
  //   axios
  //     .post(`${API_BASE_URL}/invoice_procedure`, {
  //       Invoice_id: Invoice_id,
  //     })
  //     .then((response) => {
  //       console.log(response);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       if (error.response.status === 400) {
  //         setMassageSet(error.response.data.message);
  //         console.log(error.response.data.message);
  //         console.log(messageSet);
  //       }
  //     });
  // };
  // two pdf  start
  const pdfSelectedType = async (consignee_id, a) => {
    console.log(a);

    try {
      const consigneeResponse = await axios.get(
        `${API_BASE_URL}/getConsigneeByID`,
        {
          params: { consignee_id: consignee_id },
        }
      );
      console.log(consigneeResponse);
      const consigneeData = consigneeResponse?.data?.data;
      console.log(consigneeData?.invoice_options);
      // setItemDetails(consigneeData?.invoice_options !== 0);
      setItemDetails1(consigneeData?.custom_name);
      console.log(itemDetails1);
      if (consigneeData?.invoice_options === "invoice only") {
        // await generatePdf(consigneeData, a);
        const isConsignee = selectedInvoice === "Consignee" ? 1 : 0;
        const invoiceResponse = await axios.post(
          `${API_BASE_URL}/InvoicePdfDetails`,
          {
            order_id: a?.Order_ID,
            AgreedPrice: useAgreedPricing ? 1 : 0,
            CustomName: itemDetails ? 1 : 0,
            SHOWGWCBM: cbm ? 1 : 0,
            InvoiceName: isConsignee,
            ShowFXRate: exchangeRate ? 1 : 0,
            DeliveryTErms: selectedDeliveryTerm,
          }
        );
        console.log(invoiceResponse.data);

        const headers = invoiceResponse?.data?.tableHeaders || {};
        const rowsData = invoiceResponse?.data?.tableRow1 || [];
        const head = [Object.values(headers)];
        const body = rowsData.map((row) => {
          const sortedKeys = Object.keys(row)
            .filter((key) => key.startsWith("COL"))
            .sort(
              (a, b) =>
                Number(a.replace("COL", "")) - Number(b.replace("COL", ""))
            );
          return sortedKeys.map((key) => row[key]);
        });
        const doc = new jsPDF();
        doc.addFileToVFS("Roboto-Regular.ttf", RobotoRegular);
        doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
        doc.setFont("Roboto");
        // Convert image to base64

        const convertImageToBase64 = (url) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = url;
            img.onload = () => {
              const canvas = document.createElement("canvas");
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0);
              const dataURL = canvas.toDataURL("image/png");
              resolve(dataURL);
            };
            img.onerror = (error) => reject(error);
          });
        };

        // Add a logo with Proforma Address and Proforma Invoice
        const addLogoWithDetails = async () => {
          const logoData = await convertImageToBase64(logo);
          doc.addImage(logoData, "PNG", 6, 3, 20, 20); // Adjust the position and size as needed
          // logo end
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text(`${invoiceResponse?.data?.Company_Address?.Line_1}`, 30, 8);
          doc.setTextColor(0, 0, 0);
          doc.text(`${invoiceResponse?.data?.Company_Address?.Line_2}`, 30, 12);
          const longTextOne = `${invoiceResponse?.data?.Company_Address?.Line_3}`;
          const maxWidthOne = 59;
          const linesOne = doc.splitTextToSize(longTextOne, maxWidthOne);
          let startXOne = 30;
          let startYOne = 16;
          linesOne.forEach((lineOne, index) => {
            doc.text(lineOne, startXOne, startYOne + index * 4.2); // Adjust the line height (10) as needed
          });
          // end company
          doc.setFillColor(32, 55, 100);
          doc.setFontSize(12);
          doc.setTextColor(255, 255, 255);
          doc.rect(95, 5, 107, 7, "FD");
          // Place text inside the rectangle
          const invoiceNumber =
            invoiceResponse?.data?.invoiceHeader?.Invoice_Number || "";
          doc.text(invoiceNumber, 130, 9.5);
          // **************************************************
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          const maxWidthLeft = 30; // Maximum width in pixels
          let yLeft = 16;
          const yIncrementLeft = 1; // Adjust this value based on your spacing requirements
          const textDataLeft = [
            {
              label: invoiceResponse?.data?.orderMetaLabels["Order : "],
              value: `${
                invoiceResponse?.data?.orderMetaValues.Order_Number || ""
              }`,
            },
            {
              label: invoiceResponse?.data?.orderMetaLabels["TT Ref : "],
              value: `${
                invoiceResponse?.data?.orderMetaValues.Shipment_ref || ""
              }`,
            },
            {
              label: invoiceResponse?.data?.orderMetaLabels["PO Number : "],
              value: `${
                invoiceResponse?.data?.orderMetaValues.Customer_ref || ""
              }`,
            },
            {
              label: invoiceResponse?.data?.transportTypeLabel.AWB,
              value: `${invoiceResponse?.data?.transportInfo.AWB || ""}`,
            },
          ];

          textDataLeft.forEach((item) => {
            const labelXLeft = 94.5;
            const valueXLeft = 123;
            const isAWB =
              item.label === invoiceResponse?.data?.transportTypeLabel.AWB;
            doc.text(item.label, labelXLeft, yLeft);
            if (isAWB) {
              const awbValueXRight = 123;
              const awbMaxWidth = 83;
              const awbLines = doc.splitTextToSize(item.value, awbMaxWidth);
              awbLines.forEach((line, index) => {
                doc.text(line, awbValueXRight, yLeft + index * 4);
              });
              yLeft += awbLines.length * 4 + yIncrementLeft;
            } else {
              const valueLinesLeft = doc.splitTextToSize(
                item.value,
                maxWidthLeft
              );
              valueLinesLeft.forEach((line, index) => {
                doc.text(line, valueXLeft, yLeft + index * 4);
              });

              yLeft += valueLinesLeft.length * 4 + yIncrementLeft;
            }
          });
          console.log(
            ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
          );
          // Second part (right side)
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          const maxWidthRight = 32; // Maximum width in pixels
          let yRight = 16;
          const yIncrementRight = 1; // Adjust this value based on your spacing requirements

          function formatDate(dateString) {
            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            // Add leading zeros if needed
            const formattedDay = day < 10 ? `0${day}` : day;
            const formattedMonth = month < 10 ? `0${month}` : month;
            return `${formattedDay}-${formattedMonth}-${year}`;
          }

          const textDataRight = [
            {
              label: `${invoiceResponse?.data?.dateLabels["Date : "]}`,
              value: `${formatDate(invoiceResponse?.data?.dateValues.created)}`,
            },
            {
              label: `${invoiceResponse?.data?.dateLabels["Due Date : "]}`,
              value: invoiceResponse?.data?.dateValues?.["Due Date"]
                ? formatDate(invoiceResponse.data.dateValues["Due Date"])
                : "",
            },
            {
              label: `${invoiceResponse?.data?.dateLabels["Ship Date : "]}`,
              value: `${formatDate(
                invoiceResponse?.data?.dateValues.Ship_date
              )}`,
            },
            // {
            //   label: "Delivery By :",
            //   value: invoiceResponse?.data?.transportInfo?.Delivery_By || "",
            // },
          ];

          textDataRight.forEach((item) => {
            const labelXRight = 155;
            const valueXRight = 175;
            const valueLinesRight = doc.splitTextToSize(
              item.value,
              maxWidthRight
            );
            doc.text(item.label, labelXRight, yRight);

            valueLinesRight.forEach((line, index) => {
              doc.text(line, valueXRight, yRight + index * 4);
            });

            yRight += valueLinesRight.length * 4 + yIncrementRight;
          });

          // **********************************************
          // Client and Consignee rectangles
          const rectHeight = 7; // Height of the rectangle
          const dynamicY = Math.max(yLeft, yRight);
          // Client rectangle
          doc.setFillColor(32, 55, 100);
          doc.setFontSize(12);
          doc.setTextColor(255, 255, 255);
          doc.rect(7, dynamicY, 96, rectHeight, "FD");
          doc.text("Client", 50, dynamicY + rectHeight / 2 + 1.5);

          // Consignee rectangle
          doc.setFillColor(32, 55, 100);
          doc.setFontSize(12);
          doc.setTextColor(255, 255, 255);
          doc.rect(106, dynamicY, 96, rectHeight, "FD");
          doc.text("Consignee", 145, dynamicY + rectHeight / 2 + 1.5);
          // Reset font size and color
          doc.setFontSize(11);
          doc.setTextColor(0, 0, 0);
          return dynamicY;
        };
        function renderWrappedText(
          doc,
          text,
          startX,
          startY,
          maxWidth,
          lineHeight
        ) {
          const lines = doc.splitTextToSize(text, maxWidth);
          lines.forEach((line, index) => {
            doc.text(line, startX, startY + index * lineHeight);
          });
          return startY + lines.length * lineHeight;
        }
        const dynamicY = await addLogoWithDetails();
        const commonStartY = dynamicY + 12;
        const lineHeight = 4.2;
        // Block 1: Left Side
        const maxWidth1 = 72;
        const startX1 = 7;
        const textBlock1 = [
          invoiceResponse.data?.client_address.client_name,
          invoiceResponse.data?.client_address.client_tax_number,
          invoiceResponse.data?.client_address.Address1,
          invoiceResponse.data?.client_address.Address2,
          invoiceResponse.data?.client_address.Address3,
          invoiceResponse.data?.client_address.Address4,
          invoiceResponse.data?.client_address.client_phone,
        ].filter((text) => text && text.toString().trim() !== "");

        let currentY1 = commonStartY;
        doc.setFontSize(11);
        textBlock1.forEach((text, index) => {
          currentY1 = renderWrappedText(
            doc,
            text,
            startX1,
            currentY1,
            maxWidth1,
            lineHeight
          );
          if (index === 0) doc.setFontSize(10); // Adjust font size after the first text
        });
        // Block 2: Right Side
        const maxWidth2 = 72;
        const startX2 = 106;
        const textBlock2 = [
          invoiceResponse.data?.consignee_address.consignee_name,
          invoiceResponse.data?.consignee_address.consignee_tax_number,
          invoiceResponse.data?.consignee_address.Address1,
          invoiceResponse.data?.consignee_address.Address2,
          invoiceResponse.data?.consignee_address.Address3,
          invoiceResponse.data?.consignee_address.Address4,
          invoiceResponse.data?.consignee_address.consignee_email,
        ].filter((text) => text && text.toString().trim() !== "");

        let currentY2 = commonStartY;
        doc.setFontSize(11);
        textBlock2.forEach((text, index) => {
          currentY2 = renderWrappedText(
            doc,
            text,
            startX2,
            currentY2,
            maxWidth2,
            lineHeight
          );
          if (index === 0) doc.setFontSize(10);
        });
        const tableStartY = Math.max(currentY1, currentY2);
        await addLogoWithDetails();
        const formatterThree = new Intl.NumberFormat("en-US", {
          style: "decimal",
          minimumFractionDigits: 3,
        });
        const formatterNo = new Intl.NumberFormat("en-US", {
          style: "decimal",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });

        const maxRowsPerPageNew = 23;
        let remainingRows = [...body];
        let tableStartYNew = tableStartY;
        while (remainingRows.length > 0) {
          const rowsToAdd = remainingRows.slice(0, maxRowsPerPageNew);
          remainingRows = remainingRows.slice(maxRowsPerPageNew);
          doc.autoTable({
            head,
            body: rowsToAdd,
            startY: tableStartYNew, // Dynamically set the startY based on the content above the table
            margin: {
              left: 7,
              right: 7,
            },
            columnStyles: {
              0: { halign: "center" },
              1: { halign: "right" },
              2: { halign: "right" },
              3: { halign: "right" },
              4: { halign: "left", cellWidth: 60 },
              5: { halign: "right" },
              6: { halign: "center" },
              7: { halign: "right" },
              8: { halign: "right" },
            },
            tableWidth: "auto",
            headStyles: {
              fillColor: [32, 55, 100], // Set the header background color
              textColor: [255, 255, 255], // Set the header text color
            },
            styles: {
              textColor: [0, 0, 0], // Text color for body cells
              cellWidth: "wrap",
              valign: "middle",
              lineWidth: 0.1,
              lineColor: [32, 55, 100],
            },
            didParseCell: function (data) {
              if (data.section === "body") {
                const rowIndex = data.row.index;
                if (rowIndex % 2 === 0) {
                  data.cell.styles.fillColor = [250, 248, 248]; // Light gray for even rows
                } else {
                  data.cell.styles.fillColor = [255, 255, 255]; // White for odd rows
                }
              }
            },
          });

          // Check if there are more rows to be printed and add a new page if necessary
          if (remainingRows.length > 0) {
            doc.addPage(); // Add a new page if there are more rows to display
            tableStartYNew = 5; // Reset Y position to 7 for the new page
          }
        }
        const yTop = doc.autoTable.previous.finalY + 1;
        const finalY = doc.autoTable.previous.finalY + 4;

        doc.text(
          invoiceResponse?.data?.summaryLabels?.["Total Box : "] ||
            "Total Box : ",
          7,
          finalY + 1
        );
        doc.text(
          `${formatterNo.format(invoiceResponse?.data?.summaryValues?.Box)}`,
          38,
          finalY + 1
        );
        doc.text(
          invoiceResponse?.data?.summaryLabels?.["Total Packages : "] ||
            "Total Packages : ",
          7,
          finalY + 5.5
        );
        doc.text(
          `${formatterNo.format(
            invoiceResponse?.data?.summaryValues?.Packages
          )}`,
          38,
          finalY + 5.5
        );
        doc.text(
          invoiceResponse?.data?.summaryLabels?.["Total Items : "] ||
            "Total Items : ",
          7,
          finalY + 10
        );
        doc.text(
          `${formatterNo.format(invoiceResponse?.data?.summaryValues?.Items)}`,
          38,
          finalY + 10
        );
        if (exchangeRate) {
          doc.text(
            `${invoiceResponse?.data?.paymentLabels?.["Exchange Rate"]}`,
            7,
            finalY + 14.5
          );
          doc.text(
            `${invoiceResponse?.data?.paymentValues?.["Exchange Rate"]}`,
            38,
            finalY + 14.5
          );
        }
        doc.text(
          invoiceResponse?.data?.weightLabels?.["Total Net Weight : "] ||
            "Total Net Weight : ",
          72,
          finalY + 1
        );
        doc.text(
          `${invoiceResponse?.data?.weightValues?.total_nw}`,
          110,
          finalY + 1
        );
        // if (cbm) {
        doc.text(
          invoiceResponse?.data?.weightLabels?.["Total Gross Weight : "] ||
            "Total Gross Weight : ",
          72,
          finalY + 5.5
        );
        doc.text(
          `${invoiceResponse?.data?.weightValues?.total_gw}`,
          110,
          finalY + 5.5
        );
        doc.text(
          invoiceResponse?.data?.weightLabels?.["Total CBM : "] ||
            "Total CBM : ",
          72,
          finalY + 10
        );
        doc.text(
          `${invoiceResponse?.data?.weightValues?.total_cbm}`,
          110,
          finalY + 10
        );
        // }
        let modalElement = document.getElementById("exampleModalCustomization");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          setUseAgreedPricing(false);
          setItemDetails(false);
          setCbm(true);
          setExchangeRate(false);
          setSelectedInvoice("Client");
          setSelectedDeliveryTerm;
          setSelectedDeliveryTerm(null);
          modalInstance.hide();
        }
        // total part

        const MARGIN = 6.8;
        const PAGE_WIDTH = doc.internal.pageSize.getWidth();
        const xLeft = 147; // Position from the left
        const maxValueWidth = 50; // Maximum width for the value

        // Helper function to truncate text if it exceeds the max width
        function fitText(value, maxWidth) {
          let truncatedValue = value;
          while (doc.getTextWidth(truncatedValue) > maxWidth) {
            truncatedValue = truncatedValue.slice(0, -1); // Remove last character
          }
          return truncatedValue;
        }

        // Setting the first label and value
        doc.setTextColor(0, 0, 0);
        const label = invoiceResponse?.data?.paymentLabels.Total;
        let value = invoiceResponse?.data?.paymentValues.Total || "";
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

        value = fitText(value, maxValueWidth); // Ensure value fits within the max width
        const valueWidth = doc.getTextWidth(value);
        const xValue = PAGE_WIDTH - MARGIN - valueWidth; // Position value to the right side of the page
        // Draw label and value
        doc.setFillColor(32, 55, 100);
        // doc.rect(xLeft, finalY + 2, 55.5, 0.2, "FD");
        doc.text(label, xLeft, finalY + 1);
        doc.text(value, xValue, finalY + 1);
        // Setting the second label and value
        const label1 = invoiceResponse?.data?.paymentLabels.Discount;
        const label2 = invoiceResponse?.data?.paymentLabels.Payable;
        // Handle value1
        let value1 = invoiceResponse?.data?.paymentValues.Discount || "";
        value1 = fitText(value1, maxValueWidth); // Ensure value fits within the max width
        const valueWidth1 = doc.getTextWidth(value1);
        const xValue1 = PAGE_WIDTH - MARGIN - valueWidth1; // Position value to the right side of the page

        // Draw first label and value
        doc.setFillColor(32, 55, 100);
        // doc.rect(xLeft, finalY + 8, 55.5, 0.2, "FD");
        doc.text(label1, xLeft, finalY + 5);
        doc.text(value1, xValue1, finalY + 5);

        // Handle value2
        let value2 = invoiceResponse?.data?.paymentValues.Payable || "";
        value2 = fitText(value2, maxValueWidth); // Ensure value fits within the max width
        const valueWidth2 = doc.getTextWidth(value2);
        const xValue2 = PAGE_WIDTH - MARGIN - valueWidth2; // Position value to the right side of the page

        // Draw second label and value
        doc.setFillColor(32, 55, 100);
        doc.rect(xLeft, finalY + 11.5, 55.5, 0.5, "FD");
        doc.text(label2, xLeft, finalY + 9);
        doc.text(value2, xValue2, finalY + 9);
        //note
        function addTextWithPagination(doc, longText, x, y, maxWidth) {
          const lineHeight = 5; // Adjust line height if needed
          const pageHeight = doc.internal.pageSize.height;
          const textLines = doc.splitTextToSize(longText, maxWidth);
          let currentY = y;

          for (let i = 0; i < textLines.length; i++) {
            if (currentY + lineHeight > pageHeight) {
              doc.addPage();
              currentY = 10;
            }

            doc.text(textLines[i], x, currentY);
            currentY += lineHeight; // Move Y position down for next line
          }
          return currentY;
        }

        // note end
        const longText = invoiceResponse.data?.deliveryNote.deliveryNote || "";
        const x = 7;
        const initialY = doc.autoTable.previous.finalY + 24;
        const maxWidth = 180;

        let finalY1 = initialY;

        // 🔹 Step 1: Render longText first (if exists)
        const hasLongText = longText.trim() !== "";
        if (hasLongText) {
          finalY1 = addTextWithPagination(doc, longText, x, finalY1, maxWidth);
        }

        const inputFieldValue = invoiceResponse.data?.Notes.NOTES || "";

        if (inputFieldValue && inputFieldValue.trim() !== "") {
          const inputX = 7;
          const inputWidth = 196;
          const padding = 3;
          const maxTextWidth = inputWidth - padding * 2;

          const noteLabelY = finalY1 + 3; // Leave space after longText

          // 🔹 Only draw line if longText was present
          if (hasLongText) {
            const lineY = noteLabelY - 4;
            doc.setDrawColor(0);
            doc.setLineWidth(0.3);
            doc.line(inputX, lineY, inputX + inputWidth, lineY);
          }

          // 🔹 Render "Notes here" label
          doc.text(
            `${invoiceResponse.data?.notes.Notes}:`,
            inputX,
            noteLabelY + 2
          );

          // 🔹 Wrapped note text
          const lines = doc.splitTextToSize(inputFieldValue, maxTextWidth);
          const textY = noteLabelY + 5;
          doc.text(lines, inputX, textY + 2);
        }
        // Draw the value
        const addPageNumbers = (doc) => {
          const pageCount = doc.internal.getNumberOfPages();
          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text(`${i} out  of ${pageCount}`, 185.2, 3.1);
          }
        };
        // Add page numbers
        addPageNumbers(doc);
        const pdfBlob = doc.output("blob");
        console.log(pdfBlob);
        await uploadPDF7(pdfBlob, a);
      } else if (consigneeData?.invoice_options === "packing list only") {
        const isConsignee = selectedInvoice1 === "Consignee" ? 1 : 0;
        const invoiceResponse = await axios.post(
          `${API_BASE_URL}/proformaMain_Invoice`,
          {
            order_id: a?.Order_ID,
            InvoiceName: isConsignee,
            CustomName: itemDetails2 ? 1 : 0,
            SHOWGWCBM: cbm1 ? 1 : 0,
            Barcode: exchangeRate1 ? 1 : 0,
            CustomBarcode: exchangeRate2 ? 1 : 0,
            Notes: exchangeRate3 ? 1 : 0,
          }
        );
        console.log(invoiceResponse.data);
        const headers = invoiceResponse?.data?.tableHeaders || {};
        const rowsData = invoiceResponse?.data?.tableRow1 || [];
        const head = [Object.values(headers)];
        const body = rowsData.map((row) => {
          const sortedKeys = Object.keys(row)
            .filter((key) => key.startsWith("COL"))
            .sort(
              (a, b) =>
                Number(a.replace("COL", "")) - Number(b.replace("COL", ""))
            );
          return sortedKeys.map((key) => row[key]);
        });
        const doc = new jsPDF();
        const formatterNo = new Intl.NumberFormat("en-US", {
          style: "decimal",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        // Convert image to base64
        const convertImageToBase64 = (url) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = url;
            img.onload = () => {
              const canvas = document.createElement("canvas");
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0);
              const dataURL = canvas.toDataURL("image/png");
              resolve(dataURL);
            };
            img.onerror = (error) => reject(error);
          });
        };

        // Add a logo with Proforma Address and Proforma Invoice
        const addLogoWithDetails = async () => {
          const logoData = await convertImageToBase64(logo);
          doc.addImage(logoData, "PNG", 6, 3, 20, 20); // Adjust the position and size as needed
          // logo end
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text(`${invoiceResponse?.data?.Company_Address?.Line_1}`, 30, 8);
          doc.setTextColor(0, 0, 0);
          doc.text(`${invoiceResponse?.data?.Company_Address?.Line_2}`, 30, 12);
          const longTextOne = `${invoiceResponse?.data?.Company_Address?.Line_3}`;
          const maxWidthOne = 59;
          const linesOne = doc.splitTextToSize(longTextOne, maxWidthOne);
          let startXOne = 30;
          let startYOne = 16;
          linesOne.forEach((lineOne, index) => {
            doc.text(lineOne, startXOne, startYOne + index * 4.2); // Adjust the line height (10) as needed
          });
          // end company
          doc.setFillColor(32, 55, 100);
          doc.setFontSize(12);
          doc.setTextColor(255, 255, 255);
          doc.rect(95, 5, 107, 7, "FD");
          // Place text inside the rectangle
          doc.text("PACKING LIST", 130, 9.5);
          // rect end
          // order part

          // **************************************************
          // start here full
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);

          const maxWidthLeft = 30;
          let yLeft = 16;
          const yIncrementLeft = 1;

          const textDataLeft = [
            {
              label: invoiceResponse?.data?.orderMetaLabels["Order : "],
              value: `${invoiceResponse?.data?.orderMetaValues.Row1 || ""}`,
            },
            {
              label: invoiceResponse?.data?.orderMetaLabels["TT Ref : "],
              value: `${invoiceResponse?.data?.orderMetaValues.Row2 || ""}`,
            },
            {
              label: invoiceResponse?.data?.orderMetaLabels["PO Number : "],
              value: `${invoiceResponse?.data?.orderMetaValues.Row3 || ""}`,
            },
            {
              label: `${invoiceResponse?.data?.transportTypeLabel.AWB}`,
              value: invoiceResponse?.data?.transportInfo.Row1,
            },
          ];

          textDataLeft.forEach((item) => {
            const isAWB =
              item.label === invoiceResponse?.data?.transportTypeLabel.AWB;

            const labelXLeft = isAWB ? 94.5 : 95;
            const valueXLeft = isAWB ? 119 : 119;
            const adjustedMaxWidth = isAWB ? 83 : maxWidthLeft;

            const valueLinesLeft = doc.splitTextToSize(
              item.value,
              adjustedMaxWidth
            );

            // Print the label
            doc.text(item.label, labelXLeft, yLeft);

            // Print the value
            valueLinesLeft.forEach((line, index) => {
              doc.text(line, valueXLeft, yLeft + index * 4);
            });

            // Move y position for next block
            yLeft += valueLinesLeft.length * 4 + yIncrementLeft;
          });
          // end here full

          // Second part (right side)
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          const maxWidthRight = 32; // Maximum width in pixels
          let yRight = 16;
          const yIncrementRight = 1; // Adjust this value based on your spacing requirements

          const textDataRight = [
            {
              label: `${invoiceResponse?.data?.dateLabels["Date : "]}`,
              value: invoiceResponse?.data?.dateValues.Row1,
            },
            // { label: "Due Date : ", value: "12-5-2024" },
            {
              label: `${invoiceResponse?.data?.dateLabels["Ship Date : "]}`,
              value: invoiceResponse?.data?.dateValues.Row2,
            },
            {
              label: `${invoiceResponse?.data?.dateLabels[""]}`,
              value: invoiceResponse?.data?.dateValues.Row3,
            },
          ];

          textDataRight.forEach((item) => {
            const labelXRight = 155;
            const valueXRight = 175;

            // Split the value text if it exceeds maxWidth
            const valueLinesRight = doc.splitTextToSize(
              item.value,
              maxWidthRight
            );

            // Print the label
            doc.text(item.label, labelXRight, yRight);
            valueLinesRight.forEach((line, index) => {
              doc.text(line, valueXRight, yRight + index * 4);
            });

            yRight += valueLinesRight.length * 4 + yIncrementRight;
          });

          // **********************************************
          // client
          doc.setFillColor(32, 55, 100);
          doc.setFontSize(12);
          doc.setTextColor(255, 255, 255);
          doc.rect(7, 33, 96, 7, "FD");
          // doc.setFont('Helvetica');
          doc.text("Invoice to", 50, 37.5);
          // consignee
          doc.setFillColor(32, 55, 100);
          doc.setFontSize(12);
          doc.setTextColor(255, 255, 255);
          doc.rect(106, 33, 96, 7, "FD");
          // Place text inside the rectangle
          doc.text("Consignee", 145, 37.5);
          // client under text
          doc.setFontSize(11);
          doc.setTextColor(0, 0, 0);
        };
        function renderWrappedText(
          doc,
          text,
          startX,
          startY,
          maxWidth,
          lineHeight
        ) {
          const lines = doc.splitTextToSize(text, maxWidth);
          lines.forEach((line, index) => {
            doc.text(line, startX, startY + index * lineHeight);
          });
          return startY + lines.length * lineHeight;
        }
        const commonStartY = 45;
        const lineHeight = 4.2;
        // Block 1: Left Side
        const maxWidth1 = 72;
        const startX1 = 7;
        const textBlock1 = [
          invoiceResponse.data?.client_address.Row1,
          invoiceResponse.data?.client_address.Row2,
          invoiceResponse.data?.client_address.Row3,
          invoiceResponse.data?.client_address.Row4,
          invoiceResponse.data?.client_address.Row5,
          invoiceResponse.data?.client_address.Row6,
          invoiceResponse.data?.client_address.Row7,
        ].filter((text) => text && text.toString().trim() !== "");

        let currentY1 = commonStartY;
        doc.setFontSize(11);
        textBlock1.forEach((text, index) => {
          currentY1 = renderWrappedText(
            doc,
            text,
            startX1,
            currentY1,
            maxWidth1,
            lineHeight
          );
          if (index === 0) doc.setFontSize(10); // Adjust font size after the first text
        });
        // Block 2: Right Side
        const maxWidth2 = 72;
        const startX2 = 106;
        const textBlock2 = [
          invoiceResponse.data?.consignee_address.Row1,
          invoiceResponse.data?.consignee_address.Row2,
          invoiceResponse.data?.consignee_address.Row3,
          invoiceResponse.data?.consignee_address.Row4,
          invoiceResponse.data?.consignee_address.Row5,
          invoiceResponse.data?.consignee_address.Row6,
          invoiceResponse.data?.consignee_address.Row7,
        ].filter((text) => text && text.toString().trim() !== "");

        let currentY2 = commonStartY;
        doc.setFontSize(11);
        textBlock2.forEach((text, index) => {
          currentY2 = renderWrappedText(
            doc,
            text,
            startX2,
            currentY2,
            maxWidth2,
            lineHeight
          );
          if (index === 0) doc.setFontSize(10);
        });
        const tableStartY = Math.max(currentY1, currentY2);
        await addLogoWithDetails(); // Wait for logo and details to be added

        doc.autoTable({
          head,
          // body: rows.map((row) => columns.map((col) => row[col.dataKey])),
          body,
          startY: tableStartY, // Dynamically set the startY based on the content above the table
          margin: {
            left: 7,
            right: 7,
          },
          // columnStyles: {
          //   1: { halign: "right" },
          //   2: { halign: "right" },
          //   3: { halign: "right" },
          //   5: { halign: "center" },
          // },
          columnStyles: {
            0: { halign: "center", cellWidth: 10 },
            1: { halign: "right", cellWidth: 25 },
            2: { halign: "right", cellWidth: 13 },
            3: { halign: "right", cellWidth: 25 },
            4: { halign: "left" },
            5: { halign: "center", halign: "right", cellWidth: 25 },
          },
          tableWidth: "auto",
          headStyles: {
            fillColor: [32, 55, 100],
            textColor: [255, 255, 255],
            halign: "center",
          },
          styles: {
            textColor: (0, 0, 0), // Text color for body cells
            cellWidth: "wrap",
            valign: "middle",
            lineWidth: 0.1, // Adjust the border width
            lineColor: [32, 55, 100], // Border color
          },
          didParseCell: function (data) {
            if (data.section === "body") {
              // Apply alternate row coloring
              const rowIndex = data.row.index;
              if (rowIndex % 2 === 0) {
                data.cell.styles.fillColor = [250, 248, 248]; // Light gray for even rows
              } else {
                data.cell.styles.fillColor = [255, 255, 255]; // White for odd rows
              }
            }
          },
        });
        let yTop = 68;
        yTop = doc.autoTable.previous.finalY + 1;
        const finalY = doc.autoTable.previous.finalY + 4;
        doc.text(
          invoiceResponse?.data?.summaryLabels?.["Total Box : "] ||
            "Total Box : ",
          7,
          finalY + 1
        );

        doc.text(
          invoiceResponse?.data?.summaryValues?.Row1?.toString().trim() || "",
          38,
          finalY + 1
        );

        doc.text(
          invoiceResponse?.data?.summaryLabels?.["Total Packages : "] ||
            "Total Packages : ",
          7,
          finalY + 5.5
        );
        const packages = invoiceResponse?.data?.summaryValues?.Row2;
        doc.text(
          packages !== undefined && packages !== null && packages !== ""
            ? formatterNo.format(packages)
            : "",
          38,
          finalY + 5.5
        );
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

        doc.text(
          invoiceResponse?.data?.summaryLabels?.["Total Items : "] ||
            "Total Items : ",
          7,
          finalY + 10
        );
        doc.text(
          invoiceResponse?.data?.summaryValues?.Row3 != null
            ? formatterNo.format(invoiceResponse?.data?.summaryValues?.Row3)
            : "",
          38,
          finalY + 10
        );
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

        doc.text(
          invoiceResponse?.data?.weightLabels?.["Total Net Weight : "] ||
            "Total Net Weight : ",

          72,
          finalY + 1
        );
        doc.text(
          invoiceResponse?.data?.weightValues?.Row1 != null
            ? invoiceResponse?.data?.weightValues?.Row1
            : "",
          105,
          finalY + 1
        );
        if (cbm1) {
          doc.text(
            invoiceResponse?.data?.weightLabels?.["Total Gross Weight : "] ||
              "Total Gross Weight : ",
            72,
            finalY + 5.5
          );
          let weight =
            invoiceResponse?.data?.weightValues?.Row2 != null
              ? invoiceResponse?.data?.weightValues?.Row2
              : "";
          doc.text(weight, 105, finalY + 5.5);
          // doc.text(formatterNo.format(totalDetails[0]?.gw? totalDetails[0]?.gw:totalDetails[0]?.port_weight), 105, finalY + 5.5);
          doc.text(
            invoiceResponse?.data?.weightLabels?.["Total CBM : "] ||
              "Total CBM : ",
            72,
            finalY + 10
          ),
            doc.text(
              invoiceResponse?.data?.weightValues?.Row3 != null
                ? invoiceResponse?.data?.weightValues?.Row3
                : "",
              105,
              finalY + 10
            );
        }
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        const PAGE_WIDTH = 210; // A4 page width in mm
        const MARGIN = 7; // margin from the right edge

        // Set the text and value
        const label = "Total";
        const value = `${newFormatter.format(4353242342.324234)}`;
        let modalElement = document.getElementById(
          "exampleModalCustomization5"
        );
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          setItemDetails2(false);
          setCbm1(true);
          setSelectedInvoice1("Client");
          setExchangeRate1(false);
          setExchangeRate2(false);
          setExchangeRate3(false);
          modalInstance.hide();
        }
        // Calculate the width of the label and the value
        const labelWidth = doc.getTextWidth(label);
        const valueWidth = doc.getTextWidth(value);
        const xRight = PAGE_WIDTH - MARGIN - valueWidth;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);

        //note START
        doc.setFont("Helvetica", "bold"); // or use your custom font
        // line
        const margin = 7;
        const pageWidth = doc.internal.pageSize.getWidth();
        const y = finalY + 13;

        // Optional styling
        doc.setDrawColor(33, 54, 99);
        doc.setLineWidth(0.3);

        // Draw line with margin
        doc.line(margin, y, pageWidth - margin, y);

        // line
        if (exchangeRate3) {
          doc.text(invoiceResponse?.data?.notesLabel?.Notes, 7, finalY + 18);
          const maxNote = 196;
          doc.setFont("Helvetica", "normal");
          const longText = invoiceResponse?.data?.notesValue?.Row1;

          doc.text(longText, 7, finalY + 23, {
            maxWidth: maxNote,
            align: "left",
          });
        }

        const addPageNumbers = (doc) => {
          const pageCount = doc.internal.getNumberOfPages();
          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text(`${i} out  of ${pageCount}`, 185.2, 3.1);
          }
        };
        // Add page numbers
        addPageNumbers(doc);
        const pdfBlob = doc.output("blob");
        await uploadPDF11(pdfBlob, a);
      } else if (
        consigneeData?.invoice_options === "invoice and packing list"
      ) {
        const formatterNo = new Intl.NumberFormat("en-US", {
          style: "decimal",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        const isConsignee = selectedInvoice === "Consignee" ? 1 : 0;
        const invoiceResponse = await axios.post(
          `${API_BASE_URL}/InvoicePdfDetails`,
          {
            order_id: a?.Order_ID,
            AgreedPrice: useAgreedPricing ? 1 : 0,
            CustomName: itemDetails ? 1 : 0,
            SHOWGWCBM: cbm ? 1 : 0,
            InvoiceName: isConsignee,
            ShowFXRate: exchangeRate ? 1 : 0,
            DeliveryTErms: selectedDeliveryTerm,
          }
        );
        console.log(invoiceResponse.data);
        const headers = invoiceResponse?.data?.tableHeaders || {};
        const rowsData = invoiceResponse?.data?.tableRow1 || [];
        const head = [Object.values(headers)];
        const body = rowsData.map((row) => {
          const sortedKeys = Object.keys(row)
            .filter((key) => key.startsWith("COL"))
            .sort(
              (a, b) =>
                Number(a.replace("COL", "")) - Number(b.replace("COL", ""))
            );
          return sortedKeys.map((key) => row[key]);
        });

        const newFormatter = new Intl.NumberFormat("en-US", {
          style: "decimal",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        const formatterThree = new Intl.NumberFormat("en-US", {
          style: "decimal",
          minimumFractionDigits: 3,
        });
        const logoData = logo;
        const doc = new jsPDF();
        doc.addImage(logoData, "PNG", 6, 3, 20, 20);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const maxTextWidth = 59;
        doc.text(`${invoiceResponse?.data?.Company_Address?.Line_1}`, 30, 8);
        doc.setTextColor(0, 0, 0);
        doc.text(`${invoiceResponse?.data?.Company_Address?.Line_2}`, 30, 12);
        const staticText = `${invoiceResponse?.data?.Company_Address?.Line_3}`;
        const wrappedLines = doc.splitTextToSize(staticText, maxTextWidth);
        const startX = 30;
        const startY = 16;

        wrappedLines.forEach((line, index) => {
          doc.text(line, startX, startY + index * 4.2); // Adjust the line height as needed
        });
        doc.setFillColor(32, 55, 100);
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.rect(95, 5, 107, 7, "FD");
        const invoiceNumber =
          invoiceResponse?.data?.invoiceHeader?.Invoice_Number || "";
        doc.text(invoiceNumber, 130, 9.5);

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const maxWidthLeft = 30;
        let yLeft = 16;
        const yIncrementLeft = 1;

        const textDataLeft = [
          {
            label: invoiceResponse?.data?.orderMetaLabels["Order : "],
            value: `${
              invoiceResponse?.data?.orderMetaValues.Order_Number || ""
            }`,
          },
          {
            label: invoiceResponse?.data?.orderMetaLabels["TT Ref : "],
            value: `${
              invoiceResponse?.data?.orderMetaValues.Shipment_ref || ""
            }`,
          },
          {
            label: invoiceResponse?.data?.orderMetaLabels["PO Number : "],
            value: `${
              invoiceResponse?.data?.orderMetaValues.Customer_ref || ""
            }`,
          },
          {
            label: invoiceResponse?.data?.transportTypeLabel.AWB,
            value: `${invoiceResponse?.data?.transportInfo.AWB || ""}`,
          },
        ];

        textDataLeft.forEach((item) => {
          const labelXLeft = 94.5;
          const valueXLeft = 123;
          const isAWB =
            item.label === invoiceResponse?.data?.transportTypeLabel.AWB;
          doc.text(item.label, labelXLeft, yLeft);
          if (isAWB) {
            const awbValueXRight = 123;
            const awbMaxWidth = 83;
            const awbLines = doc.splitTextToSize(item.value, awbMaxWidth);
            awbLines.forEach((line, index) => {
              doc.text(line, awbValueXRight, yLeft + index * 4);
            });
            yLeft += awbLines.length * 4 + yIncrementLeft;
          } else {
            const valueLinesLeft = doc.splitTextToSize(
              item.value,
              maxWidthLeft
            );
            valueLinesLeft.forEach((line, index) => {
              doc.text(line, valueXLeft, yLeft + index * 4);
            });

            yLeft += valueLinesLeft.length * 4 + yIncrementLeft;
          }
        });

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const maxWidthRight = 32;
        let yRight = 16;
        const yIncrementRight = 1;

        function formatDate(dateString) {
          const date = new Date(dateString);
          const formattedDay = date.getDate().toString().padStart(2, "0");
          const formattedMonth = (date.getMonth() + 1)
            .toString()
            .padStart(2, "0");
          const year = date.getFullYear();
          return `${formattedDay}-${formattedMonth}-${year}`;
        }

        const textDataRight = [
          {
            label: `${invoiceResponse?.data?.dateLabels["Date : "]}`,
            value: `${formatDate(invoiceResponse?.data?.dateValues.created)}`,
          },
          {
            label: `${invoiceResponse?.data?.dateLabels["Due Date : "]}`,
            value: invoiceResponse?.data?.dateValues?.["Due Date"]
              ? formatDate(invoiceResponse.data.dateValues["Due Date"])
              : "",
          },
          {
            label: `${invoiceResponse?.data?.dateLabels["Ship Date : "]}`,
            value: `${formatDate(invoiceResponse?.data?.dateValues.Ship_date)}`,
          },
        ];

        textDataRight.forEach((item) => {
          const labelXRight = 155;
          const valueXRight = 175;
          const valueLinesRight = doc.splitTextToSize(
            item.value,
            maxWidthRight
          );
          doc.text(item.label, labelXRight, yRight);

          valueLinesRight.forEach((line, index) => {
            doc.text(line, valueXRight, yRight + index * 4);
          });

          yRight += valueLinesRight.length * 4 + yIncrementRight;
        });
        const rectHeight = 7;
        const dynamicY = Math.min(yLeft, yRight);
        doc.setFillColor(32, 55, 100);
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.rect(7, dynamicY, 96, rectHeight, "FD");
        doc.text("Client", 50, dynamicY + rectHeight / 2 + 1.5);

        // Consignee Rectangle
        doc.setFillColor(32, 55, 100);
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.rect(106, dynamicY, 96, rectHeight, "FD");
        doc.text("Consignee", 145, dynamicY + rectHeight / 2 + 1.5);
        doc.setTextColor(0, 0, 0);
        function renderWrappedText1(
          doc,
          text,
          startX,
          startY,
          maxWidth,
          lineHeight
        ) {
          const lines = doc.splitTextToSize(text, maxWidth);
          lines.forEach((line, index) => {
            doc.text(line, startX, startY + index * lineHeight);
          });
          return startY + lines.length * lineHeight;
        }
        const commonStartY1 = 48;
        const lineHeight1 = 4.2;
        const maxWidth3 = 72;
        const startX3 = 7;
        const textBlock1 = [
          invoiceResponse.data?.client_address.client_name,
          invoiceResponse.data?.client_address.client_tax_number,
          invoiceResponse.data?.client_address.Address1,
          invoiceResponse.data?.client_address.Address2,
          invoiceResponse.data?.client_address.Address3,
          invoiceResponse.data?.client_address.Address4,
          invoiceResponse.data?.client_address.client_phone,
        ].filter((text) => text && text.toString().trim() !== "");
        let currentY1 = commonStartY1;
        doc.setFontSize(11);
        textBlock1.forEach((text, index) => {
          currentY1 = renderWrappedText1(
            doc,
            text,
            startX3,
            currentY1,
            maxWidth3,
            lineHeight1
          );
          if (index === 0) doc.setFontSize(10); // Adjust font size after the first text
        });

        // Block 2: Right Side
        const maxWidth4 = 72;
        const startX4 = 106;
        const commonStartY2 = dynamicY + 12;
        const lineHeight2 = 4.2;
        const textBlock3 = [
          invoiceResponse.data?.consignee_address.consignee_name,
          invoiceResponse.data?.consignee_address.consignee_tax_number,
          invoiceResponse.data?.consignee_address.Address1,
          invoiceResponse.data?.consignee_address.Address2,
          invoiceResponse.data?.consignee_address.Address3,
          invoiceResponse.data?.consignee_address.Address4,
          invoiceResponse.data?.consignee_address.consignee_email,
        ].filter((text) => text && text.toString().trim() !== "");

        let currentY3 = commonStartY2;
        doc.setFontSize(11);
        textBlock3.forEach((text, index) => {
          currentY3 = renderWrappedText1(
            doc,
            text,
            startX4,
            currentY3,
            maxWidth4,
            lineHeight2
          );
          if (index === 0) doc.setFontSize(10);
        });

        const tableStartY1 = Math.max(currentY1, currentY3);
        const maxRowsPerPageNew = 23;
        let remainingRows = [...body];
        let tableStartYNew = tableStartY1;

        while (remainingRows.length > 0) {
          const rowsToAdd = remainingRows.slice(0, maxRowsPerPageNew);
          remainingRows = remainingRows.slice(maxRowsPerPageNew);
          doc.autoTable({
            head,
            body: rowsToAdd,
            startY: tableStartYNew,
            margin: {
              left: 7,
              right: 7,
            },
            columnStyles: {
              0: { halign: "center" },
              1: { halign: "right" },
              2: { halign: "right" },
              3: { halign: "right" },
              4: { halign: "left", cellWidth: 60 },
              5: { halign: "right" },
              6: { halign: "center" },
              7: { halign: "right" },
              8: { halign: "right" },
            },
            tableWidth: "auto",
            headStyles: {
              fillColor: [32, 55, 100], // Set the header background color
              textColor: [255, 255, 255], // Set the header text color
            },
            styles: {
              textColor: [0, 0, 0], // Text color for body cells
              cellWidth: "wrap",
              valign: "middle",
              lineWidth: 0.1,
              lineColor: [32, 55, 100],
            },
            didParseCell: function (data) {
              if (data.section === "body") {
                const rowIndex = data.row.index;
                if (rowIndex % 2 === 0) {
                  data.cell.styles.fillColor = [250, 248, 248]; // Light gray for even rows
                } else {
                  data.cell.styles.fillColor = [255, 255, 255]; // White for odd rows
                }
              }
            },
          });
        }
        const yTop = doc.autoTable.previous.finalY + 1;
        const finalY = doc.autoTable.previous.finalY + 4;

        doc.text(
          invoiceResponse?.data?.summaryLabels?.["Total Box : "] ||
            "Total Box : ",
          7,
          finalY + 1
        );
        doc.text(
          `${formatterNo.format(invoiceResponse?.data?.summaryValues?.Box)}`,
          38,
          finalY + 1
        );
        doc.text(
          invoiceResponse?.data?.summaryLabels?.["Total Packages : "] ||
            "Total Packages : ",
          7,
          finalY + 5.5
        );
        doc.text(
          `${formatterNo.format(
            invoiceResponse?.data?.summaryValues?.Packages
          )}`,
          38,
          finalY + 5.5
        );
        doc.text(
          invoiceResponse?.data?.summaryLabels?.["Total Items : "] ||
            "Total Items : ",
          7,
          finalY + 10
        );
        doc.text(
          `${formatterNo.format(invoiceResponse?.data?.summaryValues?.Items)}`,
          38,
          finalY + 10
        );
        if (exchangeRate) {
          doc.text(
            `${invoiceResponse?.data?.paymentLabels?.["Exchange Rate"]}`,
            7,
            finalY + 14.5
          );
          doc.text(
            `${invoiceResponse?.data?.paymentValues?.["Exchange Rate"]}`,
            38,
            finalY + 14.5
          );
        }
        doc.text(
          invoiceResponse?.data?.weightLabels?.["Total Net Weight : "] ||
            "Total Net Weight : ",
          72,
          finalY + 1
        );
        doc.text(
          `${invoiceResponse?.data?.weightValues?.total_nw}`,
          110,
          finalY + 1
        );
        // if (cbm) {
        doc.text(
          invoiceResponse?.data?.weightLabels?.["Total Gross Weight : "] ||
            "Total Gross Weight : ",
          72,
          finalY + 5.5
        );
        doc.text(
          `${invoiceResponse?.data?.weightValues?.total_gw}`,
          110,
          finalY + 5.5
        );
        doc.text(
          invoiceResponse?.data?.weightLabels?.["Total CBM : "] ||
            "Total CBM : ",
          72,
          finalY + 10
        );
        doc.text(
          `${invoiceResponse?.data?.weightValues?.total_cbm}`,
          110,
          finalY + 10
        );
        // }
        let modalElement = document.getElementById("exampleModalCustomization");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          setUseAgreedPricing(false);
          setItemDetails(false);
          setCbm(true);
          setExchangeRate(false);
          setSelectedInvoice("Client");
          setSelectedDeliveryTerm;
          setSelectedDeliveryTerm(null);
          modalInstance.hide();
        }

        const MARGIN = 6.8;
        const PAGE_WIDTH = doc.internal.pageSize.getWidth();
        const xLeft = 147; // Position from the left
        const maxValueWidth = 50; // Maximum width for the value
        function fitText(value, maxWidth) {
          let truncatedValue = value;
          while (doc.getTextWidth(truncatedValue) > maxWidth) {
            truncatedValue = truncatedValue.slice(0, -1); // Remove last character
          }
          return truncatedValue;
        }

        // Setting the first label and value
        doc.setTextColor(0, 0, 0);
        const label = invoiceResponse?.data?.paymentLabels.Total;
        let value = invoiceResponse?.data?.paymentValues.Total || "";
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

        value = fitText(value, maxValueWidth); // Ensure value fits within the max width
        const valueWidth = doc.getTextWidth(value);
        const xValue = PAGE_WIDTH - MARGIN - valueWidth; // Position value to the right side of the page
        doc.setFillColor(32, 55, 100);
        doc.text(label, xLeft, finalY + 1);
        doc.text(value, xValue, finalY + 1);
        const label1 = invoiceResponse?.data?.paymentLabels.Discount;
        const label2 = invoiceResponse?.data?.paymentLabels.Payable;
        let value1 = invoiceResponse?.data?.paymentValues.Discount || "";
        value1 = fitText(value1, maxValueWidth); // Ensure value fits within the max width
        const valueWidth1 = doc.getTextWidth(value1);
        const xValue1 = PAGE_WIDTH - MARGIN - valueWidth1; // Position value to the right side of the page
        doc.setFillColor(32, 55, 100);
        doc.text(label1, xLeft, finalY + 5);
        doc.text(value1, xValue1, finalY + 5);
        let value2 = invoiceResponse?.data?.paymentValues.Payable || "";
        value2 = fitText(value2, maxValueWidth); // Ensure value fits within the max width
        const valueWidth2 = doc.getTextWidth(value2);
        const xValue2 = PAGE_WIDTH - MARGIN - valueWidth2; // Position value to the right side of the page
        doc.setFillColor(32, 55, 100);
        doc.rect(xLeft, finalY + 11.5, 55.5, 0.5, "FD");
        doc.text(label2, xLeft, finalY + 9);
        doc.text(value2, xValue2, finalY + 9);
        const pageWidth = doc.internal.pageSize.width; // Get page width
        const leftMargin = 7;
        const rightMargin = 7;
        const maxWidthNote = pageWidth - leftMargin - rightMargin; // Calculate available width
        doc.setFont("helvetica", "normal"); // Set font to bold
        const textY = finalY + 20; // Y position for text
        const text = messageSet;
        const pageHeight = doc.internal.pageSize.height;
        const wrappedText = doc.splitTextToSize(text, maxWidthNote); // Wrap text within available width
        if (textY + wrappedText.length * 7 > pageHeight) {
          doc.addPage(); // Add new page if necessary
          doc.text(wrappedText, leftMargin, 7); // Reset Y position on new page
        } else {
          doc.text(wrappedText, leftMargin, textY); // Print normally if enough space
        }
        doc.addPage();

        const isConsignee1 = selectedInvoice1 === "Consignee" ? 1 : 0;
        const invoiceResponse1 = await axios.post(
          `${API_BASE_URL}/proformaMain_Invoice`,
          {
            order_id: a?.Order_ID,
            InvoiceName: isConsignee1,
            CustomName: itemDetails2 ? 1 : 0,
            SHOWGWCBM: cbm1 ? 1 : 0,
            Barcode: exchangeRate1 ? 1 : 0,
            CustomBarcode: exchangeRate2 ? 1 : 0,
            Notes: exchangeRate3 ? 1 : 0,
          }
        );
        console.log(invoiceResponse1.data);
        const headers1 = invoiceResponse1?.data?.tableHeaders || {};
        const rowsData1 = invoiceResponse1?.data?.tableRow1 || [];
        const head1 = [Object.values(headers1)];
        const body1 = rowsData1.map((row) => {
          const sortedKeys = Object.keys(row)
            .filter((key) => key.startsWith("COL"))
            .sort(
              (a, b) =>
                Number(a.replace("COL", "")) - Number(b.replace("COL", ""))
            );
          return sortedKeys.map((key) => row[key]);
        });

        const convertImageToBase64 = (url) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = url;
            img.onload = () => {
              const canvas = document.createElement("canvas");
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0);
              const dataURL = canvas.toDataURL("image/png");
              resolve(dataURL);
            };
            img.onerror = (error) => reject(error);
          });
        };
        const addLogoWithDetails = async () => {
          const logoData = await convertImageToBase64(logo);
          doc.addImage(logoData, "PNG", 6, 3, 20, 20); // Adjust the position and size as needed
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text(`${invoiceResponse1?.data?.Company_Address?.Line_1}`, 30, 8);
          doc.setTextColor(0, 0, 0);
          doc.text(
            `${invoiceResponse1?.data?.Company_Address?.Line_2}`,
            30,
            12
          );
          const longTextOne = `${invoiceResponse1?.data?.Company_Address?.Line_3}`;
          const maxWidthOne = 59;
          const linesOne = doc.splitTextToSize(longTextOne, maxWidthOne);
          let startXOne = 30;
          let startYOne = 16;
          linesOne.forEach((lineOne, index) => {
            doc.text(lineOne, startXOne, startYOne + index * 4.2); // Adjust the line height (10) as needed
          });
          doc.setFillColor(32, 55, 100);
          doc.setFontSize(12);
          doc.setTextColor(255, 255, 255);
          doc.rect(95, 5, 107, 7, "FD");
          doc.text("PACKING LIST", 130, 9.5);
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);

          const maxWidthLeft = 30;
          let yLeft = 16;
          const yIncrementLeft = 1;

          const textDataLeft = [
            {
              label: invoiceResponse1?.data?.orderMetaLabels["Order : "],
              value: `${invoiceResponse1?.data?.orderMetaValues.Row1 || ""}`,
            },
            {
              label: invoiceResponse1?.data?.orderMetaLabels["TT Ref : "],
              value: `${invoiceResponse1?.data?.orderMetaValues.Row2 || ""}`,
            },
            {
              label: invoiceResponse1?.data?.orderMetaLabels["PO Number : "],
              value: `${invoiceResponse1?.data?.orderMetaValues.Row3 || ""}`,
            },
            {
              label: `${invoiceResponse1?.data?.transportTypeLabel.AWB}`,
              value: invoiceResponse1?.data?.transportInfo.Row1,
            },
          ];

          textDataLeft.forEach((item) => {
            const isAWB =
              item.label === invoiceResponse1?.data?.transportTypeLabel.AWB;
            const labelXLeft = isAWB ? 94.5 : 95;
            const valueXLeft = isAWB ? 119 : 119;
            const adjustedMaxWidth = isAWB ? 83 : maxWidthLeft;

            const valueLinesLeft = doc.splitTextToSize(
              item.value,
              adjustedMaxWidth
            );

            doc.text(item.label, labelXLeft, yLeft);

            valueLinesLeft.forEach((line, index) => {
              doc.text(line, valueXLeft, yLeft + index * 4);
            });

            yLeft += valueLinesLeft.length * 4 + yIncrementLeft;
          });

          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          const maxWidthRight = 32;
          let yRight = 16;
          const yIncrementRight = 1;

          const textDataRight = [
            {
              label: `${invoiceResponse1?.data?.dateLabels["Date : "]}`,
              value: invoiceResponse1?.data?.dateValues.Row1,
            },
            {
              label: `${invoiceResponse1?.data?.dateLabels["Ship Date : "]}`,
              value: invoiceResponse1?.data?.dateValues.Row2,
            },
            {
              label: `${invoiceResponse1?.data?.dateLabels[""]}`,
              value: invoiceResponse1?.data?.dateValues.Row3,
            },
          ];

          textDataRight.forEach((item) => {
            const labelXRight = 155;
            const valueXRight = 175;
            const valueLinesRight = doc.splitTextToSize(
              item.value,
              maxWidthRight
            );
            doc.text(item.label, labelXRight, yRight);
            valueLinesRight.forEach((line, index) => {
              doc.text(line, valueXRight, yRight + index * 4);
            });

            yRight += valueLinesRight.length * 4 + yIncrementRight;
          });
          doc.setFillColor(32, 55, 100);
          doc.setFontSize(12);
          doc.setTextColor(255, 255, 255);
          doc.rect(7, 33, 96, 7, "FD");
          doc.text("Invoice to", 50, 37.5);
          doc.setFillColor(32, 55, 100);
          doc.setFontSize(12);
          doc.setTextColor(255, 255, 255);
          doc.rect(106, 33, 96, 7, "FD");
          doc.text("Consignee", 145, 37.5);
          doc.setFontSize(11);
          doc.setTextColor(0, 0, 0);
        };
        function renderWrappedText(
          doc,
          text,
          startX,
          startY,
          maxWidth,
          lineHeight
        ) {
          const lines = doc.splitTextToSize(text, maxWidth);
          lines.forEach((line, index) => {
            doc.text(line, startX, startY + index * lineHeight);
          });
          return startY + lines.length * lineHeight;
        }
        const commonStartY = 45;
        const lineHeight = 4.2;
        const maxWidth1 = 72;
        const startX1 = 7;
        const textBlock4 = [
          invoiceResponse1.data?.client_address.Row1,
          invoiceResponse1.data?.client_address.Row2,
          invoiceResponse1.data?.client_address.Row3,
          invoiceResponse1.data?.client_address.Row4,
          invoiceResponse1.data?.client_address.Row5,
          invoiceResponse1.data?.client_address.Row6,
          invoiceResponse1.data?.client_address.Row7,
        ].filter((text) => text && text.toString().trim() !== "");

        let currentY4 = commonStartY;
        doc.setFontSize(11);
        textBlock4.forEach((text, index) => {
          currentY4 = renderWrappedText(
            doc,
            text,
            startX1,
            currentY4, //  Correct variable
            maxWidth1,
            lineHeight
          );
          if (index === 0) doc.setFontSize(10);
        });

        // Block 2: Right Side
        const maxWidth2 = 72;
        const startX2 = 106;
        const textBlock2 = [
          invoiceResponse1.data?.consignee_address.Row1,
          invoiceResponse1.data?.consignee_address.Row2,
          invoiceResponse1.data?.consignee_address.Row3,
          invoiceResponse1.data?.consignee_address.Row4,
          invoiceResponse1.data?.consignee_address.Row5,
          invoiceResponse1.data?.consignee_address.Row6,
          invoiceResponse1.data?.consignee_address.Row7,
        ].filter((text) => text && text.toString().trim() !== "");

        let currentY2 = commonStartY;
        doc.setFontSize(11);
        textBlock2.forEach((text, index) => {
          currentY2 = renderWrappedText(
            doc,
            text,
            startX2,
            currentY2,
            maxWidth2,
            lineHeight
          );
          if (index === 0) doc.setFontSize(10);
        });
        const tableStartY = Math.max(currentY1, currentY2);
        await addLogoWithDetails();
        doc.autoTable({
          head: head1,
          body: body1,
          startY: tableStartY,
          margin: {
            left: 7,
            right: 7,
          },

          columnStyles: {
            0: { halign: "center", cellWidth: 10 },
            1: { halign: "right", cellWidth: 25 },
            2: { halign: "right", cellWidth: 13 },
            3: { halign: "right", cellWidth: 25 },
            4: { halign: "left" },
            5: { halign: "center", halign: "right", cellWidth: 25 },
          },
          tableWidth: "auto",
          headStyles: {
            fillColor: [32, 55, 100],
            textColor: [255, 255, 255],
            halign: "center",
          },
          styles: {
            textColor: (0, 0, 0), // Text color for body cells
            cellWidth: "wrap",
            valign: "middle",
            lineWidth: 0.1, // Adjust the border width
            lineColor: [32, 55, 100], // Border color
          },
          didParseCell: function (data) {
            if (data.section === "body") {
              // Apply alternate row coloring
              const rowIndex = data.row.index;
              if (rowIndex % 2 === 0) {
                data.cell.styles.fillColor = [250, 248, 248]; // Light gray for even rows
              } else {
                data.cell.styles.fillColor = [255, 255, 255]; // White for odd rows
              }
            }
          },
        });
        let yTop1 = 68;
        yTop1 = doc.autoTable.previous.finalY + 1;
        const finalY1 = doc.autoTable.previous.finalY + 4;
        doc.text(
          invoiceResponse1?.data?.summaryLabels?.["Total Box : "] ||
            "Total Box : ",
          7,
          finalY1 + 1
        );

        doc.text(
          invoiceResponse1?.data?.summaryValues?.Row1?.toString().trim() || "",
          38,
          finalY1 + 1
        );

        doc.text(
          invoiceResponse1?.data?.summaryLabels?.["Total Packages : "] ||
            "Total Packages : ",
          7,
          finalY1 + 5.5
        );
        const packages = invoiceResponse1?.data?.summaryValues?.Row2;
        doc.text(
          packages !== undefined && packages !== null && packages !== ""
            ? formatterNo.format(packages)
            : "",
          38,
          finalY1 + 5.5
        );
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

        doc.text(
          invoiceResponse1?.data?.summaryLabels?.["Total Items : "] ||
            "Total Items : ",
          7,
          finalY1 + 10
        );
        doc.text(
          invoiceResponse1?.data?.summaryValues?.Row3 != null
            ? formatterNo.format(invoiceResponse1?.data?.summaryValues?.Row3)
            : "",
          38,
          finalY1 + 10
        );
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

        doc.text(
          invoiceResponse1?.data?.weightLabels?.["Total Net Weight : "] ||
            "Total Net Weight : ",

          72,
          finalY1 + 1
        );
        doc.text(
          invoiceResponse1?.data?.weightValues?.Row1 != null
            ? invoiceResponse1?.data?.weightValues?.Row1
            : "",
          105,
          finalY1 + 1
        );
        if (cbm1) {
          doc.text(
            invoiceResponse1?.data?.weightLabels?.["Total Gross Weight : "] ||
              "Total Gross Weight : ",
            72,
            finalY1 + 5.5
          );
          let weight =
            invoiceResponse1?.data?.weightValues?.Row2 != null
              ? invoiceResponse1?.data?.weightValues?.Row2
              : "";
          doc.text(weight, 105, finalY1 + 5.5);
          doc.text(
            invoiceResponse1?.data?.weightLabels?.["Total CBM : "] ||
              "Total CBM : ",
            72,
            finalY1 + 10
          ),
            doc.text(
              invoiceResponse1?.data?.weightValues?.Row3 != null
                ? invoiceResponse1?.data?.weightValues?.Row3
                : "",
              105,
              finalY1 + 10
            );
        }
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        const PAGE_WIDTH1 = 210; // A4 page width in mm
        const MARGIN1 = 7; // margin from the right edge

        // Set the text and value
        const label3 = "Total";
        const value3 = `${newFormatter.format(4353242342.324234)}`;
        let modalElement1 = document.getElementById(
          "exampleModalCustomization5"
        );
        let modalInstance2 = bootstrap.Modal.getInstance(modalElement1);
        if (modalInstance2) {
          setItemDetails2(false);
          setCbm1(true);
          setSelectedInvoice1("Client");
          setExchangeRate1(false);
          setExchangeRate2(false);
          setExchangeRate3(false);
          modalInstance.hide();
        }
        // Calculate the width of the label and the value
        const labelWidth = doc.getTextWidth(label3);
        const valueWidth3 = doc.getTextWidth(value3);
        const xRight = PAGE_WIDTH1 - MARGIN1 - valueWidth3;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);

        //note START
        doc.setFont("Helvetica", "bold"); // or use your custom font
        // line
        const margin = 7;
        const pageWidth1 = doc.internal.pageSize.getWidth();
        const y = finalY + 13;

        // Optional styling
        doc.setDrawColor(33, 54, 99);
        doc.setLineWidth(0.3);

        // Draw line with margin
        doc.line(margin, y, pageWidth - margin, y);

        // line
        if (exchangeRate3) {
          doc.text(invoiceResponse?.data?.notesLabel?.Notes, 7, finalY + 18);
          const maxNote = 196;
          doc.setFont("Helvetica", "normal");
          const longText = invoiceResponse?.data?.notesValue?.Row1;

          doc.text(longText, 7, finalY + 23, {
            maxWidth: maxNote,
            align: "left",
          });
        }
        const pdfBlob = doc.output("blob");
        // Upload the PDF to the server
        await uploadPDF3(pdfBlob, a);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Network Error", {
        autoClose: 1000,
        theme: "colored",
      });
    }
  };
  // two pdf end
  const paymentDataClear = () => {
    setModalHead(null);
    setModalData(null);
    setLoading(false);

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
  };
  const uploadPDF11 = async (pdfBlob, a) => {
    // Generate a unique date-time string
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;

    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${a?.Invoice_Number || "default"}_packing_list_${dateTime}.pdf`
    );

    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${
            a?.Invoice_Number || "default"
          }_packing_list_${dateTime}.pdf`
        );
      } else {
        console.log("Failed to upload PDF");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };

  const uploadPDF3 = async (pdfBlob, a) => {
    console.log(a);
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;
    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${
        a?.Invoice_Number || "default"
      }_Invoice_and_packing_list_${dateTime}.pdf`
    );

    setIsLoading(true);
    loadingModal.fire();
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${a?.Invoice_Number}_Invoice_and_packing_list_${dateTime}.pdf`
        );
      } else {
        console.log("Failed to upload PDF");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    } finally {
      setIsLoading(false);
      loadingModal.close();
    }
  };
  const uploadPDF2 = async (pdfBlob, a) => {
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;
    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${a?.Invoice_number || "default"}_Invoice_${dateTime}.pdf`
    );

    setIsLoading(true);
    loadingModal.fire();
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${a?.Invoice_number}_Invoice_${dateTime}.pdf`
        );
      } else {
        console.log("Failed to upload PDF");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    } finally {
      setIsLoading(false);
      loadingModal.close();
    }
  };
  const delivery = async (order_id) => {
    axios
      .post(`${API_BASE_URL}/pdf_delivery_by  `, {
        order_id: order_id,
      })
      .then((response) => {
        setMassageSet1(response.data.message);
        console.log(response.status);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 400) {
          setMassageSet1(error.response.data.message);
        }

        return false;
      });
  };
  // const delivery1 = async (order_id) => {
  //   axios
  //     .post(`${API_BASE_URL}/pdf_delivery_by  `, {
  //       order_id: order_id,
  //     })
  //     .then((response) => {
  //       console.log(response.data.message);
  //       setMassageSet2(response.data.message);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       if (error.response.status === 400) {
  //         setMassageSet2(error.response.data.message);
  //       }

  //       return false;
  //     });
  // };
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
  };
  const uploadPDF = async (pdfBlob, a) => {
    // Generate a unique date-time string
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;

    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${a?.Invoice_number || "default"}_Invoice_${dateTime}.pdf`
    );
    setIsLoading(true);
    loadingModal.fire();
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${
            a?.Invoice_number || "default"
          }_Invoice_${dateTime}.pdf`
        );
      } else {
        console.log("Failed to upload PDF");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    } finally {
      setIsLoading(false);
      loadingModal.close();
    }
  };
  const handleEditClick1 = async (invoiceID) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/InvoiceAWBReady`, {
        Invoice_id: invoiceID,
        // Other data you may need to pass
      });
      console.log("API response:", response);

      toast.success("success");
      allInvoiceData();

      getOrdersDetails();

      // Handle the response as needed
    } catch (error) {
      console.error("API call error:", error);
      toast.error("Failed to Copy Order Procedure");
    }
  };
  const handleEditClick = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/InvoiceAWBReady`, {
        Invoice_id: invoiceID,
        // Other data you may need to pass
      });
      console.log("API response:", response);

      toast.success(t("success"));
      allInvoiceData();

      getOrdersDetails();

      // Handle the response as needed
    } catch (error) {
      console.error("API call error:", error);
      toast.error(t("copyOrderFailed"));
    }
  };
  const uploadData2 = () => {
    if (!selectedFile1) {
      setErrorMessage(t("noFileSelected"));
      return;
    }

    const formData = new FormData();
    formData.append("Invoice_id", invoiceID);
    formData.append("document", selectedFile1);

    axios
      .post(`${API_BASE_URL}/InvoiceShipped`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        handleEditClick();
        let modalElement = document.getElementById("modalAdjustBox3");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        console.log(response);
        // toast.success("Call Invoice Shipped Successfully", {
        //   autoClose: 1000,
        //   theme: "colored",
        // });

        allInvoiceData();
        // Clear the quantity field after successful update
        setSelectedFile1(""); // Clear selected file
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const quotationCopy = (Invoice_id) => {
    setInvoiceId1(Invoice_id);
  };

  const dataSubmit = () => {
    axios
      .post(`${API_BASE_URL}/InvoiceNotes`, {
        invoice_id: invoiceID1,
        notes: notes,
      })
      .then((response) => {
        console.log(response);
        let modalElement = document.getElementById("exampleModal2");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        console.log(response);
        toast.success(t("invoiceNoteUpdated"), {
          autoClose: 1000,
          theme: "colored",
        });
        allInvoiceData();
        setNotes("");
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
  const restoreEanPackage = (id) => {
    axios
      .post(`${API_BASE_URL}/cancle_invoice`, {
        Invoice_id: id,
      })
      .then((response) => {
        if (response.status === 400) {
          allInvoiceData();

          toast.warn(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
        } else if (response.status === 200) {
          allInvoiceData();

          toast.success(t("invoiceCancelled"), {
            autoClose: 1000,
            theme: "colored",
          });
        } else {
          allInvoiceData();

          toast.warn(t("genericError"), {
            autoClose: 1000,
            theme: "colored",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handlePaidAmountChange = (id_id, value) => {
    setPaidAmounts((prev) => ({
      ...prev,
      [id_id]: value,
    }));
  };
  const handleUnitChange = (id_id, value) => {
    console.log("Unit changed:", id_id, value); // Debugging
    setUnits((prev) => ({
      ...prev,
      [id_id]: value,
    }));
  };
  const handleClaimChange = (od_id, value) => {
    console.log("Claim changed:", od_id, value);
    setClaims((prev) => ({
      ...prev,
      [od_id]: value,
    }));
  };

  const handleAmountChange = (id_id, value) => {
    setAmounts((prev) => ({
      ...prev,
      [id_id]: value,
    }));
  };

  // const summaryTable = async (Claim_id) => {
  //   // Filter details to only include those with non-empty values
  //   const dataToSubmit = details
  //     .filter(
  //       (item) =>
  //         paidAmounts[item.id_id] &&
  //         amounts[item.id_id] &&
  //         units[item.id_id] &&
  //         claims[item.id_id] &&
  //         parseFloat(paidAmounts[item.id_id]) > 0 &&
  //         parseFloat(amounts[item.id_id]) > 0
  //     )
  //     .map((item) => ({
  //       Claim_id: Claim_id,
  //       id_id: item.id_id,
  //       ITF: item.ITF_ID,
  //       QTY: parseFloat(paidAmounts[item.id_id]), // Ensure it's a number
  //       Unit: units[item.id_id],
  //       claims: claims[item.id_id],

  //       Claimed_amount: parseFloat(amounts[item.id_id]), // Ensure it's a number
  //     }));

  //   if (dataToSubmit.length === 0) {
  //     console.warn("No valid data to submit");
  //     // toast.warn("No valid data to submit");
  //     return; // Exit early if there's no data to submit
  //   }

  //   try {
  //     const response = await axios.post(`${API_BASE_URL}/AddClaimDetails`, {
  //       datas: dataToSubmit,
  //     });
  //     console.log(response);
  //     // Handle successful response
  //   } catch (error) {
  //     console.error(error);
  //     // Handle error
  //   }
  // };
  const summaryTable = async (Claim_ID) => {
    if (!details?.dateValues) return;

    const dataToSubmit = details.dateValues
      .filter((item) => {
        const id = item.OD_ID;
        return (
          paidAmounts[id] &&
          amounts[id] &&
          units[id] &&
          claims[id] &&
          parseFloat(paidAmounts[id]) > 0 &&
          parseFloat(amounts[id]) > 0
        );
      })
      .map((item) => {
        const id = item.OD_ID;
        return {
          Claim_ID: Claim_ID,
          Order_ID: data1?.Order_ID,
          OD_ID: id,
          Claimed_Qty: parseFloat(paidAmounts[id]),
          Claimed_Unit: units[id],
          Claimed_Amount: parseFloat(amounts[id]),
          Claim_Reason: claims[id],
          User: localStorage.getItem("id"),
        };
      });

    if (dataToSubmit.length === 0) {
      console.warn("No valid data to submit");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/AddClaimDetails`, {
        datas: dataToSubmit,
      });
      const modalElement = document.getElementById("modalClaim");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) modalInstance.hide();
      // Reset fields
      setInvoiceId2("");
      setData1("");
      setPaidAmounts({});
      setUnits({});
      setClaims({});
      setAmounts({});
      setPaymentDate(""); // if you're using a date field
      console.log("AddClaimDetails response:", response);
      toast.success(t("claimSubmitted"));
      // Optional: show success toast or refresh data
    } catch (error) {
      console.error("Error in AddClaimDetails:", error);
      toast.error(t("errorAddClaimDetails"));
      // Optional: show error toast
    }
  };

  const handleSubmit1 = async () => {
    if (!details?.dateValues) return;

    const selectedPaymentDetails = details.dateValues
      .filter((item) => {
        const id = item.OD_ID;
        return paidAmounts[id] || units[id] || amounts[id] || claims[id];
      })
      .map((item) => {
        const id = item.OD_ID;
        return {
          id_id: id,

          ITF: item.ITF_ID,
          QTY: paidAmounts[id] || 0,
          Unit: units[id] || 0,
          claims: claims[id] || 0,
          Claimed_amount: amounts[id] || 0,
        };
      });

    const paymentData = {
      Claim_date: paymentDate,
      Client_ID: data1?.Client_id,
      Consignee_ID: data1?.Consignee_ID,
      Order_ID: data1?.Order_ID,
      FX_ID: data1?.FX_ID,
      FX_Rate: data1?.Daily_FX_Rate,
      User_id: localStorage.getItem("id"),
      claim_details: selectedPaymentDetails, // include filtered rows
    };

    console.log("Final paymentData:", paymentData);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/insertClaimDetails`,
        paymentData
      );

      if (response.status === 200) {
        console.log("Claim data submitted successfully", response);
        summaryTable(response?.data.data);

        // Close modal
      }
    } catch (error) {
      console.error("Error submitting payment data", error);
      toast.error(t("genericError"));
    }
  };

  useEffect(() => {
    getOrdersDetails();
  }, [invoiceID2]);
  const handleSubmit = () => {
    console.log(invoiceID2);
    console.log(data1);
  };
  const closeButton = () => {
    // Reset all input/select field-related state
    setInvoiceId2("");
    setData1("");
    setPaidAmounts({});
    setUnits({});
    setClaims({});
    setAmounts({});
    setPaymentDate(""); // if you're using a date field
  };

  const openPdf = (document) => {
    const pdfUrl = `${API_IMAGE_URL}${document}`; // Replace with the URL of your PDF
    window.open(pdfUrl, "_blank");
  };

  // const invoiceFirstpdf=()=>{
  //   navigate("/invoicefirsttpdf")
  // }
  const clearData = () => {
    setUseAgreedPricing(false);
    setItemDetails(false);
    setCbm(true);
    setExchangeRate(false);
    setSelectedInvoice("Client");
  };
  const everyDataSet = async (a) => {
    console.log(a);

    setSinglePodId(a);
  };
  const clearData1 = () => {
    setItemDetails2(false);
    setCbm1(true);
    setSelectedInvoice1("Client");
    setExchangeRate1(false);
    setExchangeRate2(false);
    setExchangeRate3(false);
  };

  const generatePdf5 = async () => {
    const isConsignee = selectedInvoice1 === "Consignee" ? 1 : 0;
    const invoiceResponse = await axios.post(
      `${API_BASE_URL}/proformaMain_Invoice`,
      {
        order_id: filterData1?.Order_ID,
        InvoiceName: isConsignee,
        CustomName: itemDetails2 ? 1 : 0,
        SHOWGWCBM: cbm1 ? 1 : 0,
        Barcode: exchangeRate1 ? 1 : 0,
        CustomBarcode: exchangeRate2 ? 1 : 0,
        Notes: exchangeRate3 ? 1 : 0,
      }
    );
    console.log(invoiceResponse.data);
    const headers = invoiceResponse?.data?.tableHeaders || {};
    const rowsData = invoiceResponse?.data?.tableRow1 || [];
    const head = [Object.values(headers)];
    const body = rowsData.map((row) => {
      const sortedKeys = Object.keys(row)
        .filter((key) => key.startsWith("COL"))
        .sort(
          (a, b) => Number(a.replace("COL", "")) - Number(b.replace("COL", ""))
        );
      return sortedKeys.map((key) => row[key]);
    });
    const doc = new jsPDF();
    const formatterNo = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    // Convert image to base64
    const convertImageToBase64 = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        };
        img.onerror = (error) => reject(error);
      });
    };

    // Add a logo with Proforma Address and Proforma Invoice
    const addLogoWithDetails = async () => {
      const logoData = await convertImageToBase64(logo);
      doc.addImage(logoData, "PNG", 6, 3, 20, 20); // Adjust the position and size as needed
      // logo end
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`${invoiceResponse?.data?.Company_Address?.Line_1}`, 30, 8);
      doc.setTextColor(0, 0, 0);
      doc.text(`${invoiceResponse?.data?.Company_Address?.Line_2}`, 30, 12);
      const longTextOne = `${invoiceResponse?.data?.Company_Address?.Line_3}`;
      const maxWidthOne = 59;
      const linesOne = doc.splitTextToSize(longTextOne, maxWidthOne);
      let startXOne = 30;
      let startYOne = 16;
      linesOne.forEach((lineOne, index) => {
        doc.text(lineOne, startXOne, startYOne + index * 4.2); // Adjust the line height (10) as needed
      });
      // end company
      doc.setFillColor(32, 55, 100);
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.rect(95, 5, 107, 7, "FD");
      // Place text inside the rectangle
      doc.text("PACKING LIST", 130, 9.5);
      // rect end
      // order part

      // **************************************************
      // start here full
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      const maxWidthLeft = 30;
      let yLeft = 16;
      const yIncrementLeft = 1;

      const textDataLeft = [
        {
          label: invoiceResponse?.data?.orderMetaLabels["Order : "],
          value: `${invoiceResponse?.data?.orderMetaValues.Row1 || ""}`,
        },
        {
          label: invoiceResponse?.data?.orderMetaLabels["TT Ref : "],
          value: `${invoiceResponse?.data?.orderMetaValues.Row2 || ""}`,
        },
        {
          label: invoiceResponse?.data?.orderMetaLabels["PO Number : "],
          value: `${invoiceResponse?.data?.orderMetaValues.Row3 || ""}`,
        },
        {
          label: `${invoiceResponse?.data?.transportTypeLabel.AWB}`,
          value: invoiceResponse?.data?.transportInfo.Row1,
        },
      ];

      textDataLeft.forEach((item) => {
        const isAWB =
          item.label === invoiceResponse?.data?.transportTypeLabel.AWB;

        const labelXLeft = isAWB ? 94.5 : 95;
        const valueXLeft = isAWB ? 119 : 119;
        const adjustedMaxWidth = isAWB ? 83 : maxWidthLeft;

        const valueLinesLeft = doc.splitTextToSize(
          item.value,
          adjustedMaxWidth
        );

        // Print the label
        doc.text(item.label, labelXLeft, yLeft);

        // Print the value
        valueLinesLeft.forEach((line, index) => {
          doc.text(line, valueXLeft, yLeft + index * 4);
        });

        // Move y position for next block
        yLeft += valueLinesLeft.length * 4 + yIncrementLeft;
      });
      // end here full

      // Second part (right side)
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const maxWidthRight = 32; // Maximum width in pixels
      let yRight = 16;
      const yIncrementRight = 1; // Adjust this value based on your spacing requirements

      const textDataRight = [
        {
          label: `${invoiceResponse?.data?.dateLabels["Date : "]}`,
          value: invoiceResponse?.data?.dateValues.Row1,
        },
        // { label: "Due Date : ", value: "12-5-2024" },
        {
          label: `${invoiceResponse?.data?.dateLabels["Ship Date : "]}`,
          value: invoiceResponse?.data?.dateValues.Row2,
        },
        {
          label: `${invoiceResponse?.data?.dateLabels[""]}`,
          value: invoiceResponse?.data?.dateValues.Row3,
        },
      ];

      textDataRight.forEach((item) => {
        const labelXRight = 155;
        const valueXRight = 175;

        // Split the value text if it exceeds maxWidth
        const valueLinesRight = doc.splitTextToSize(item.value, maxWidthRight);

        // Print the label
        doc.text(item.label, labelXRight, yRight);
        valueLinesRight.forEach((line, index) => {
          doc.text(line, valueXRight, yRight + index * 4);
        });

        yRight += valueLinesRight.length * 4 + yIncrementRight;
      });

      // **********************************************
      // client
      doc.setFillColor(32, 55, 100);
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.rect(7, 33, 96, 7, "FD");
      // doc.setFont('Helvetica');
      doc.text("Invoice to", 50, 37.5);
      // consignee
      doc.setFillColor(32, 55, 100);
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.rect(106, 33, 96, 7, "FD");
      // Place text inside the rectangle
      doc.text("Consignee", 145, 37.5);
      // client under text
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
    };
    function renderWrappedText(
      doc,
      text,
      startX,
      startY,
      maxWidth,
      lineHeight
    ) {
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line, index) => {
        doc.text(line, startX, startY + index * lineHeight);
      });
      return startY + lines.length * lineHeight;
    }
    const commonStartY = 45;
    const lineHeight = 4.2;
    // Block 1: Left Side
    const maxWidth1 = 72;
    const startX1 = 7;
    const textBlock1 = [
      invoiceResponse.data?.client_address.Row1,
      invoiceResponse.data?.client_address.Row2,
      invoiceResponse.data?.client_address.Row3,
      invoiceResponse.data?.client_address.Row4,
      invoiceResponse.data?.client_address.Row5,
      invoiceResponse.data?.client_address.Row6,
      invoiceResponse.data?.client_address.Row7,
    ].filter((text) => text && text.toString().trim() !== "");

    let currentY1 = commonStartY;
    doc.setFontSize(11);
    textBlock1.forEach((text, index) => {
      currentY1 = renderWrappedText(
        doc,
        text,
        startX1,
        currentY1,
        maxWidth1,
        lineHeight
      );
      if (index === 0) doc.setFontSize(10); // Adjust font size after the first text
    });
    // Block 2: Right Side
    const maxWidth2 = 72;
    const startX2 = 106;
    const textBlock2 = [
      invoiceResponse.data?.consignee_address.Row1,
      invoiceResponse.data?.consignee_address.Row2,
      invoiceResponse.data?.consignee_address.Row3,
      invoiceResponse.data?.consignee_address.Row4,
      invoiceResponse.data?.consignee_address.Row5,
      invoiceResponse.data?.consignee_address.Row6,
      invoiceResponse.data?.consignee_address.Row7,
    ].filter((text) => text && text.toString().trim() !== "");

    let currentY2 = commonStartY;
    doc.setFontSize(11);
    textBlock2.forEach((text, index) => {
      currentY2 = renderWrappedText(
        doc,
        text,
        startX2,
        currentY2,
        maxWidth2,
        lineHeight
      );
      if (index === 0) doc.setFontSize(10);
    });
    const tableStartY = Math.max(currentY1, currentY2);
    await addLogoWithDetails(); // Wait for logo and details to be added

    doc.autoTable({
      head,
      // body: rows.map((row) => columns.map((col) => row[col.dataKey])),
      body,
      startY: tableStartY, // Dynamically set the startY based on the content above the table
      margin: {
        left: 7,
        right: 7,
      },
      // columnStyles: {
      //   1: { halign: "right" },
      //   2: { halign: "right" },
      //   3: { halign: "right" },
      //   5: { halign: "center" },
      // },
      columnStyles: {
        0: { halign: "center", cellWidth: 10 },
        1: { halign: "right", cellWidth: 25 },
        2: { halign: "right", cellWidth: 13 },
        3: { halign: "right", cellWidth: 25 },
        4: { halign: "left" },
        5: { halign: "center", halign: "right", cellWidth: 25 },
      },
      tableWidth: "auto",
      headStyles: {
        fillColor: [32, 55, 100],
        textColor: [255, 255, 255],
        halign: "center",
      },
      styles: {
        textColor: (0, 0, 0), // Text color for body cells
        cellWidth: "wrap",
        valign: "middle",
        lineWidth: 0.1, // Adjust the border width
        lineColor: [32, 55, 100], // Border color
      },
      didParseCell: function (data) {
        if (data.section === "body") {
          // Apply alternate row coloring
          const rowIndex = data.row.index;
          if (rowIndex % 2 === 0) {
            data.cell.styles.fillColor = [250, 248, 248]; // Light gray for even rows
          } else {
            data.cell.styles.fillColor = [255, 255, 255]; // White for odd rows
          }
        }
      },
    });
    let yTop = 68;
    yTop = doc.autoTable.previous.finalY + 1;
    const finalY = doc.autoTable.previous.finalY + 4;
    doc.text(
      invoiceResponse?.data?.summaryLabels?.["Total Box : "] || "Total Box : ",
      7,
      finalY + 1
    );

    doc.text(
      invoiceResponse?.data?.summaryValues?.Row1?.toString().trim() || "",
      38,
      finalY + 1
    );

    doc.text(
      invoiceResponse?.data?.summaryLabels?.["Total Packages : "] ||
        "Total Packages : ",
      7,
      finalY + 5.5
    );
    const packages = invoiceResponse?.data?.summaryValues?.Row2;
    doc.text(
      packages !== undefined && packages !== null && packages !== ""
        ? formatterNo.format(packages)
        : "",
      38,
      finalY + 5.5
    );
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

    doc.text(
      invoiceResponse?.data?.summaryLabels?.["Total Items : "] ||
        "Total Items : ",
      7,
      finalY + 10
    );
    doc.text(
      invoiceResponse?.data?.summaryValues?.Row3 != null
        ? formatterNo.format(invoiceResponse?.data?.summaryValues?.Row3)
        : "",
      38,
      finalY + 10
    );
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

    doc.text(
      invoiceResponse?.data?.weightLabels?.["Total Net Weight : "] ||
        "Total Net Weight : ",

      72,
      finalY + 1
    );
    doc.text(
      invoiceResponse?.data?.weightValues?.Row1 != null
        ? invoiceResponse?.data?.weightValues?.Row1
        : "",
      105,
      finalY + 1
    );
    if (cbm1) {
      doc.text(
        invoiceResponse?.data?.weightLabels?.["Total Gross Weight : "] ||
          "Total Gross Weight : ",
        72,
        finalY + 5.5
      );
      let weight =
        invoiceResponse?.data?.weightValues?.Row2 != null
          ? invoiceResponse?.data?.weightValues?.Row2
          : "";
      doc.text(weight, 105, finalY + 5.5);
      // doc.text(formatterNo.format(totalDetails[0]?.gw? totalDetails[0]?.gw:totalDetails[0]?.port_weight), 105, finalY + 5.5);
      doc.text(
        invoiceResponse?.data?.weightLabels?.["Total CBM : "] || "Total CBM : ",
        72,
        finalY + 10
      ),
        doc.text(
          invoiceResponse?.data?.weightValues?.Row3 != null
            ? invoiceResponse?.data?.weightValues?.Row3
            : "",
          105,
          finalY + 10
        );
    }
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    const PAGE_WIDTH = 210; // A4 page width in mm
    const MARGIN = 7; // margin from the right edge

    // Set the text and value
    const label = "Total";
    const value = `${newFormatter.format(4353242342.324234)}`;
    let modalElement = document.getElementById("exampleModalCustomization5");
    let modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      setItemDetails2(false);
      setCbm1(true);
      setSelectedInvoice1("Client");
      setExchangeRate1(false);
      setExchangeRate2(false);
      setExchangeRate3(false);
      modalInstance.hide();
    }
    // Calculate the width of the label and the value
    const labelWidth = doc.getTextWidth(label);
    const valueWidth = doc.getTextWidth(value);
    const xRight = PAGE_WIDTH - MARGIN - valueWidth;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    //note START
    doc.setFont("Helvetica", "bold"); // or use your custom font
    // line
    const margin = 7;
    const pageWidth = doc.internal.pageSize.getWidth();
    const y = finalY + 13;

    // Optional styling
    doc.setDrawColor(33, 54, 99);
    doc.setLineWidth(0.3);

    // Draw line with margin
    doc.line(margin, y, pageWidth - margin, y);

    // line
    if (exchangeRate3) {
      doc.text(invoiceResponse?.data?.notesLabel?.Notes, 7, finalY + 18);
      const maxNote = 196;
      doc.setFont("Helvetica", "normal");
      const longText = invoiceResponse?.data?.notesValue?.Row1;

      doc.text(longText, 7, finalY + 23, {
        maxWidth: maxNote,
        align: "left",
      });
    }

    const addPageNumbers = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`${i} out  of ${pageCount}`, 185.2, 3.1);
      }
    };
    // Add page numbers
    addPageNumbers(doc);
    const pdfBlob = doc.output("blob");
    await uploadPDF6(pdfBlob);
  };
  const uploadPDF6 = async (pdfBlob) => {
    // Generate a unique date-time string
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;

    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${filterData1?.Invoice_Number || "default"}_Invoice_${dateTime}.pdf`
    );

    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${
            filterData1?.Invoice_Number || "default"
          }_Invoice_${dateTime}.pdf`
        );
      } else {
        console.log("Failed to upload PDF");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };

  const generatePdf = async () => {
    const isConsignee = selectedInvoice === "Consignee" ? 1 : 0;
    const invoiceResponse = await axios.post(
      `${API_BASE_URL}/InvoicePdfDetails`,
      {
        order_id: filterData1?.Order_ID,
        AgreedPrice: useAgreedPricing ? 1 : 0,
        CustomName: itemDetails ? 1 : 0,
        SHOWGWCBM: cbm ? 1 : 0,
        InvoiceName: isConsignee,
        ShowFXRate: exchangeRate ? 1 : 0,
        DeliveryTErms: selectedDeliveryTerm,
      }
    );
    console.log(invoiceResponse.data);

    const headers = invoiceResponse?.data?.tableHeaders || {};
    const rowsData = invoiceResponse?.data?.tableRow1 || [];
    const head = [Object.values(headers)];
    const body = rowsData.map((row) => {
      const sortedKeys = Object.keys(row)
        .filter((key) => key.startsWith("COL"))
        .sort(
          (a, b) => Number(a.replace("COL", "")) - Number(b.replace("COL", ""))
        );
      return sortedKeys.map((key) => row[key]);
    });
    const doc = new jsPDF();
    doc.addFileToVFS("Roboto-Regular.ttf", RobotoRegular);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto");
    // Convert image to base64

    const convertImageToBase64 = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        };
        img.onerror = (error) => reject(error);
      });
    };

    // Add a logo with Proforma Address and Proforma Invoice
    const addLogoWithDetails = async () => {
      const logoData = await convertImageToBase64(logo);
      doc.addImage(logoData, "PNG", 6, 3, 20, 20); // Adjust the position and size as needed
      // logo end
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`${invoiceResponse?.data?.Company_Address?.Line_1}`, 30, 8);
      doc.setTextColor(0, 0, 0);
      doc.text(`${invoiceResponse?.data?.Company_Address?.Line_2}`, 30, 12);
      const longTextOne = `${invoiceResponse?.data?.Company_Address?.Line_3}`;
      const maxWidthOne = 59;
      const linesOne = doc.splitTextToSize(longTextOne, maxWidthOne);
      let startXOne = 30;
      let startYOne = 16;
      linesOne.forEach((lineOne, index) => {
        doc.text(lineOne, startXOne, startYOne + index * 4.2); // Adjust the line height (10) as needed
      });
      // end company
      doc.setFillColor(32, 55, 100);
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.rect(95, 5, 107, 7, "FD");
      // Place text inside the rectangle
      const invoiceNumber =
        invoiceResponse?.data?.invoiceHeader?.Invoice_Number || "";
      doc.text(invoiceNumber, 130, 9.5);
      // **************************************************
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const maxWidthLeft = 30; // Maximum width in pixels
      let yLeft = 16;
      const yIncrementLeft = 1; // Adjust this value based on your spacing requirements
      const textDataLeft = [
        {
          label: invoiceResponse?.data?.orderMetaLabels["Order : "],
          value: `${invoiceResponse?.data?.orderMetaValues.Order_Number || ""}`,
        },
        {
          label: invoiceResponse?.data?.orderMetaLabels["TT Ref : "],
          value: `${invoiceResponse?.data?.orderMetaValues.Shipment_ref || ""}`,
        },
        {
          label: invoiceResponse?.data?.orderMetaLabels["PO Number : "],
          value: `${invoiceResponse?.data?.orderMetaValues.Customer_ref || ""}`,
        },
        {
          label: invoiceResponse?.data?.transportTypeLabel.AWB,
          value: `${invoiceResponse?.data?.transportInfo.AWB || ""}`,
        },
      ];

      textDataLeft.forEach((item) => {
        const labelXLeft = 94.5;
        const valueXLeft = 123;
        const isAWB =
          item.label === invoiceResponse?.data?.transportTypeLabel.AWB;
        doc.text(item.label, labelXLeft, yLeft);
        if (isAWB) {
          const awbValueXRight = 123;
          const awbMaxWidth = 83;
          const awbLines = doc.splitTextToSize(item.value, awbMaxWidth);
          awbLines.forEach((line, index) => {
            doc.text(line, awbValueXRight, yLeft + index * 4);
          });
          yLeft += awbLines.length * 4 + yIncrementLeft;
        } else {
          const valueLinesLeft = doc.splitTextToSize(item.value, maxWidthLeft);
          valueLinesLeft.forEach((line, index) => {
            doc.text(line, valueXLeft, yLeft + index * 4);
          });

          yLeft += valueLinesLeft.length * 4 + yIncrementLeft;
        }
      });
      console.log(
        ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
      );
      // Second part (right side)
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const maxWidthRight = 32; // Maximum width in pixels
      let yRight = 16;
      const yIncrementRight = 1; // Adjust this value based on your spacing requirements

      function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        // Add leading zeros if needed
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;
        return `${formattedDay}-${formattedMonth}-${year}`;
      }

      const textDataRight = [
        {
          label: `${invoiceResponse?.data?.dateLabels["Date : "]}`,
          value: `${formatDate(invoiceResponse?.data?.dateValues.created)}`,
        },
        {
          label: `${invoiceResponse?.data?.dateLabels["Due Date : "]}`,
          value: invoiceResponse?.data?.dateValues?.["Due Date"]
            ? formatDate(invoiceResponse.data.dateValues["Due Date"])
            : "",
        },
        {
          label: `${invoiceResponse?.data?.dateLabels["Ship Date : "]}`,
          value: `${formatDate(invoiceResponse?.data?.dateValues.Ship_date)}`,
        },
        // {
        //   label: "Delivery By :",
        //   value: invoiceResponse?.data?.transportInfo?.Delivery_By || "",
        // },
      ];

      textDataRight.forEach((item) => {
        const labelXRight = 155;
        const valueXRight = 175;
        const valueLinesRight = doc.splitTextToSize(item.value, maxWidthRight);
        doc.text(item.label, labelXRight, yRight);

        valueLinesRight.forEach((line, index) => {
          doc.text(line, valueXRight, yRight + index * 4);
        });

        yRight += valueLinesRight.length * 4 + yIncrementRight;
      });

      // **********************************************
      // Client and Consignee rectangles
      const rectHeight = 7; // Height of the rectangle
      const dynamicY = Math.max(yLeft, yRight);
      // Client rectangle
      doc.setFillColor(32, 55, 100);
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.rect(7, dynamicY, 96, rectHeight, "FD");
      doc.text("Client", 50, dynamicY + rectHeight / 2 + 1.5);

      // Consignee rectangle
      doc.setFillColor(32, 55, 100);
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.rect(106, dynamicY, 96, rectHeight, "FD");
      doc.text("Consignee", 145, dynamicY + rectHeight / 2 + 1.5);
      // Reset font size and color
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      return dynamicY;
    };
    function renderWrappedText(
      doc,
      text,
      startX,
      startY,
      maxWidth,
      lineHeight
    ) {
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line, index) => {
        doc.text(line, startX, startY + index * lineHeight);
      });
      return startY + lines.length * lineHeight;
    }
    const dynamicY = await addLogoWithDetails();
    const commonStartY = dynamicY + 12;
    const lineHeight = 4.2;
    // Block 1: Left Side
    const maxWidth1 = 72;
    const startX1 = 7;
    const textBlock1 = [
      invoiceResponse.data?.client_address.client_name,
      invoiceResponse.data?.client_address.client_tax_number,
      invoiceResponse.data?.client_address.Address1,
      invoiceResponse.data?.client_address.Address2,
      invoiceResponse.data?.client_address.Address3,
      invoiceResponse.data?.client_address.Address4,
      invoiceResponse.data?.client_address.client_phone,
    ].filter((text) => text && text.toString().trim() !== "");

    let currentY1 = commonStartY;
    doc.setFontSize(11);
    textBlock1.forEach((text, index) => {
      currentY1 = renderWrappedText(
        doc,
        text,
        startX1,
        currentY1,
        maxWidth1,
        lineHeight
      );
      if (index === 0) doc.setFontSize(10); // Adjust font size after the first text
    });
    // Block 2: Right Side
    const maxWidth2 = 72;
    const startX2 = 106;
    const textBlock2 = [
      invoiceResponse.data?.consignee_address.consignee_name,
      invoiceResponse.data?.consignee_address.consignee_tax_number,
      invoiceResponse.data?.consignee_address.Address1,
      invoiceResponse.data?.consignee_address.Address2,
      invoiceResponse.data?.consignee_address.Address3,
      invoiceResponse.data?.consignee_address.Address4,
      invoiceResponse.data?.consignee_address.consignee_email,
    ].filter((text) => text && text.toString().trim() !== "");

    let currentY2 = commonStartY;
    doc.setFontSize(11);
    textBlock2.forEach((text, index) => {
      currentY2 = renderWrappedText(
        doc,
        text,
        startX2,
        currentY2,
        maxWidth2,
        lineHeight
      );
      if (index === 0) doc.setFontSize(10);
    });
    const tableStartY = Math.max(currentY1, currentY2);
    await addLogoWithDetails();
    const formatterThree = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 3,
    });
    const formatterNo = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    const maxRowsPerPageNew = 23;
    let remainingRows = [...body];
    let tableStartYNew = tableStartY;
    while (remainingRows.length > 0) {
      const rowsToAdd = remainingRows.slice(0, maxRowsPerPageNew);
      remainingRows = remainingRows.slice(maxRowsPerPageNew);
      doc.autoTable({
        head,
        body: rowsToAdd,
        startY: tableStartYNew, // Dynamically set the startY based on the content above the table
        margin: {
          left: 7,
          right: 7,
        },
        columnStyles: {
          0: { halign: "center" },
          1: { halign: "right" },
          2: { halign: "right" },
          3: { halign: "right" },
          4: { halign: "left", cellWidth: 60 },
          5: { halign: "right" },
          6: { halign: "center" },
          7: { halign: "right" },
          8: { halign: "right" },
        },
        tableWidth: "auto",
        headStyles: {
          fillColor: [32, 55, 100], // Set the header background color
          textColor: [255, 255, 255], // Set the header text color
        },
        styles: {
          textColor: [0, 0, 0], // Text color for body cells
          cellWidth: "wrap",
          valign: "middle",
          lineWidth: 0.1,
          lineColor: [32, 55, 100],
        },
        didParseCell: function (data) {
          if (data.section === "body") {
            const rowIndex = data.row.index;
            if (rowIndex % 2 === 0) {
              data.cell.styles.fillColor = [250, 248, 248]; // Light gray for even rows
            } else {
              data.cell.styles.fillColor = [255, 255, 255]; // White for odd rows
            }
          }
        },
      });

      // Check if there are more rows to be printed and add a new page if necessary
      if (remainingRows.length > 0) {
        doc.addPage(); // Add a new page if there are more rows to display
        tableStartYNew = 5; // Reset Y position to 7 for the new page
      }
    }
    const yTop = doc.autoTable.previous.finalY + 1;
    const finalY = doc.autoTable.previous.finalY + 4;

    doc.text(
      invoiceResponse?.data?.summaryLabels?.["Total Box : "] || "Total Box : ",
      7,
      finalY + 1
    );
    doc.text(
      `${formatterNo.format(invoiceResponse?.data?.summaryValues?.Box)}`,
      38,
      finalY + 1
    );
    doc.text(
      invoiceResponse?.data?.summaryLabels?.["Total Packages : "] ||
        "Total Packages : ",
      7,
      finalY + 5.5
    );
    doc.text(
      `${formatterNo.format(invoiceResponse?.data?.summaryValues?.Packages)}`,
      38,
      finalY + 5.5
    );
    doc.text(
      invoiceResponse?.data?.summaryLabels?.["Total Items : "] ||
        "Total Items : ",
      7,
      finalY + 10
    );
    doc.text(
      `${formatterNo.format(invoiceResponse?.data?.summaryValues?.Items)}`,
      38,
      finalY + 10
    );
    if (exchangeRate) {
      doc.text(
        `${invoiceResponse?.data?.paymentLabels?.["Exchange Rate"]}`,
        7,
        finalY + 14.5
      );
      doc.text(
        `${invoiceResponse?.data?.paymentValues?.["Exchange Rate"]}`,
        38,
        finalY + 14.5
      );
    }
    doc.text(
      invoiceResponse?.data?.weightLabels?.["Total Net Weight : "] ||
        "Total Net Weight : ",
      72,
      finalY + 1
    );
    doc.text(
      `${invoiceResponse?.data?.weightValues?.total_nw}`,
      110,
      finalY + 1
    );
    // if (cbm) {
    doc.text(
      invoiceResponse?.data?.weightLabels?.["Total Gross Weight : "] ||
        "Total Gross Weight : ",
      72,
      finalY + 5.5
    );
    doc.text(
      `${invoiceResponse?.data?.weightValues?.total_gw}`,
      110,
      finalY + 5.5
    );
    doc.text(
      invoiceResponse?.data?.weightLabels?.["Total CBM : "] || "Total CBM : ",
      72,
      finalY + 10
    );
    doc.text(
      `${invoiceResponse?.data?.weightValues?.total_cbm}`,
      110,
      finalY + 10
    );
    // }
    let modalElement = document.getElementById("exampleModalCustomization");
    let modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      setUseAgreedPricing(false);
      setItemDetails(false);
      setCbm(true);
      setExchangeRate(false);
      setSelectedInvoice("Client");
      setSelectedDeliveryTerm;
      setSelectedDeliveryTerm(null);
      modalInstance.hide();
    }
    // total part

    const MARGIN = 6.8;
    const PAGE_WIDTH = doc.internal.pageSize.getWidth();
    const xLeft = 147; // Position from the left
    const maxValueWidth = 50; // Maximum width for the value

    // Helper function to truncate text if it exceeds the max width
    function fitText(value, maxWidth) {
      let truncatedValue = value;
      while (doc.getTextWidth(truncatedValue) > maxWidth) {
        truncatedValue = truncatedValue.slice(0, -1); // Remove last character
      }
      return truncatedValue;
    }

    // Setting the first label and value
    doc.setTextColor(0, 0, 0);
    const label = invoiceResponse?.data?.paymentLabels.Total;
    let value = invoiceResponse?.data?.paymentValues.Total || "";
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

    value = fitText(value, maxValueWidth); // Ensure value fits within the max width
    const valueWidth = doc.getTextWidth(value);
    const xValue = PAGE_WIDTH - MARGIN - valueWidth; // Position value to the right side of the page
    // Draw label and value
    doc.setFillColor(32, 55, 100);
    // doc.rect(xLeft, finalY + 2, 55.5, 0.2, "FD");
    doc.text(label, xLeft, finalY + 1);
    doc.text(value, xValue, finalY + 1);
    // Setting the second label and value
    const label1 = invoiceResponse?.data?.paymentLabels.Discount;
    const label2 = invoiceResponse?.data?.paymentLabels.Payable;
    // Handle value1
    let value1 = invoiceResponse?.data?.paymentValues.Discount || "";
    value1 = fitText(value1, maxValueWidth); // Ensure value fits within the max width
    const valueWidth1 = doc.getTextWidth(value1);
    const xValue1 = PAGE_WIDTH - MARGIN - valueWidth1; // Position value to the right side of the page

    // Draw first label and value
    doc.setFillColor(32, 55, 100);
    // doc.rect(xLeft, finalY + 8, 55.5, 0.2, "FD");
    doc.text(label1, xLeft, finalY + 5);
    doc.text(value1, xValue1, finalY + 5);

    // Handle value2
    let value2 = invoiceResponse?.data?.paymentValues.Payable || "";
    value2 = fitText(value2, maxValueWidth); // Ensure value fits within the max width
    const valueWidth2 = doc.getTextWidth(value2);
    const xValue2 = PAGE_WIDTH - MARGIN - valueWidth2; // Position value to the right side of the page

    // Draw second label and value
    doc.setFillColor(32, 55, 100);
    doc.rect(xLeft, finalY + 11.5, 55.5, 0.5, "FD");
    doc.text(label2, xLeft, finalY + 9);
    doc.text(value2, xValue2, finalY + 9);
    //note
    function addTextWithPagination(doc, longText, x, y, maxWidth) {
      const lineHeight = 5; // Adjust line height if needed
      const pageHeight = doc.internal.pageSize.height;
      const textLines = doc.splitTextToSize(longText, maxWidth);
      let currentY = y;

      for (let i = 0; i < textLines.length; i++) {
        if (currentY + lineHeight > pageHeight) {
          doc.addPage();
          currentY = 10;
        }

        doc.text(textLines[i], x, currentY);
        currentY += lineHeight; // Move Y position down for next line
      }
      return currentY;
    }

    // note end
    const longText = invoiceResponse.data?.deliveryNote.deliveryNote || "";
    const x = 7;
    const initialY = doc.autoTable.previous.finalY + 24;
    const maxWidth = 180;

    let finalY1 = initialY;

    // 🔹 Step 1: Render longText first (if exists)
    const hasLongText = longText.trim() !== "";
    if (hasLongText) {
      finalY1 = addTextWithPagination(doc, longText, x, finalY1, maxWidth);
    }

    const inputFieldValue = invoiceResponse.data?.Notes.NOTES || "";

    if (inputFieldValue && inputFieldValue.trim() !== "") {
      const inputX = 7;
      const inputWidth = 196;
      const padding = 3;
      const maxTextWidth = inputWidth - padding * 2;

      const noteLabelY = finalY1 + 3; // Leave space after longText

      // 🔹 Only draw line if longText was present
      if (hasLongText) {
        const lineY = noteLabelY - 4;
        doc.setDrawColor(0);
        doc.setLineWidth(0.3);
        doc.line(inputX, lineY, inputX + inputWidth, lineY);
      }

      // 🔹 Render "Notes here" label
      doc.text(`${invoiceResponse.data?.notes.Notes}:`, inputX, noteLabelY + 2);

      // 🔹 Wrapped note text
      const lines = doc.splitTextToSize(inputFieldValue, maxTextWidth);
      const textY = noteLabelY + 5;
      doc.text(lines, inputX, textY + 2);
    }
    // Draw the value
    const addPageNumbers = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`${i} out  of ${pageCount}`, 185.2, 3.1);
      }
    };
    // Add page numbers
    addPageNumbers(doc);
    const pdfBlob = doc.output("blob");
    console.log(pdfBlob);
    await uploadPDF1(pdfBlob);
  };
  const uploadPDF7 = async (pdfBlob, a) => {
    console.log(a);
    // Generate a unique date-time string
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;

    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${a?.Invoice_Number || "default"}_Invoice_${dateTime}.pdf`
    );

    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${
            a?.Invoice_Number || "default"
          }_Invoice_${dateTime}.pdf`
        );
      } else {
        console.log("Failed to upload PDF");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };

  const uploadPDF1 = async (pdfBlob, a) => {
    // Generate a unique date-time string
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;

    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${
        filterData1?.Invoice_Number || a?.Invoice_Number || "default"
      }_Invoice_${dateTime}.pdf`
    );

    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${
            filterData1?.Invoice_Number || "default"
          }_Invoice_${dateTime}.pdf`
        );
      } else {
        console.log("Failed to upload PDF");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };
  const generatePdf2 = async (a) => {
    console.log(a);
    const invoiceResponse = await axios.post(
      `${API_BASE_URL}/CustomeInvoicePdfDetails`,
      {
        order_id: a?.Order_ID,
        invoice_id: a?.Invoice_id,
      }
    );

    const tableData = invoiceResponse?.data?.tableRow1 || [];
    const tableHeader = invoiceResponse?.data?.tableHeaders || {};

    // Get keys from header in correct order (e.g., ["#", "Item", ...])
    const orderedHeaders = Object.keys(tableHeader); // e.g. ["#", "Item", "HS CODE", ...]
    const headRow = orderedHeaders.map((key) => tableHeader[key]); // ["#", "Item", "HS CODE", ...]

    // Create body rows based on COL1, COL2, ... mapping to each header key
    const dynamicBody = tableData.map((row) => {
      return orderedHeaders.map((_, index) => row[`COL${index + 1}`] ?? "");
    });

    console.log(invoiceResponse.data);
    const companyAddress = invoiceResponse?.data?.Company_Address;
    const currency = invoiceResponse?.data?.currencyResults;

    const noFormatter = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    const newFormatter1 = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    });
    const fourFormatter2 = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const fourFormatter4 = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
    const formatDate1 = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB"); // 'en-GB' format is DD/MM/YYYY
    };
    const doc = new jsPDF();
    // Convert image to base64
    const convertImageToBase64 = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        };
        img.onerror = (error) => reject(error);
      });
    };

    // Add a logo with Proforma Address and Proforma Invoice
    const addLogoWithDetails = async () => {
      const logoData = await convertImageToBase64(logo);
      doc.addImage(logoData, "PNG", 6, 3, 20, 20); // Adjust the position and size as needed
      // logo end
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`${companyAddress?.Line_1}`, 30, 8);
      doc.setTextColor(0, 0, 0);
      doc.text(`${companyAddress?.Line_2}`, 30, 12);
      const longTextOne = `${companyAddress?.Line_3}`;
      const maxWidthOne = 90;
      const linesOne = doc.splitTextToSize(longTextOne, maxWidthOne);
      let startXOne = 30;
      let startYOne = 16;
      linesOne.forEach((lineOne, index) => {
        doc.text(lineOne, startXOne, startYOne + index * 4.2); // Adjust the line height (10) as needed
      });
      // two line
      doc.setFillColor(32, 55, 100);
      doc.rect(7, 23, doc.internal.pageSize.width - 15, 0.5, "FD");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text("Packing List / Invoice", 83, 27.5);
      doc.setFillColor(32, 55, 100);
      doc.rect(7, 29, doc.internal.pageSize.width - 15, 0.5, "FD");
      // order part left
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const maxWidthLeft = 72; // Maximum width in pixels
      let yLeft = 33;
      const yIncrementLeft = 1; // Adjust this value based on your spacing requirements

      const textDataLeft = [
        {
          label: invoiceResponse?.data?.orderMetaLabels?.Row1,
          value: `${invoiceResponse?.data?.invoiceHeader.Row1 || ""}`,
        },
        {
          label: invoiceResponse?.data?.dateLabels?.Row2,
          value: invoiceResponse?.data?.invoiceHeader.Row2 || "",
        },
        {
          label: invoiceResponse?.data?.orderMetaLabels?.Row3,
          value: `${invoiceResponse?.data?.invoiceHeader.Row3 || ""}`,
        },
      ];
      doc.text(`${invoiceResponse?.data?.transportTypeLabel?.Row1}`, 7, 48);
      doc.text(`${invoiceResponse?.data?.transportInfo?.Row1}`, 40, 48);
      textDataLeft.forEach((item) => {
        const labelXLeft = 7;
        const valueXLeft = 40;
        const valueLinesLeft = doc.splitTextToSize(item.value, maxWidthLeft);
        doc.text(item.label, labelXLeft, yLeft);

        // Print the value, split into multiple lines if needed
        valueLinesLeft.forEach((line, index) => {
          doc.text(line, valueXLeft, yLeft + index * 4); // Adjust y position for each line of value
        });
        yLeft += valueLinesLeft.length * 4 + yIncrementLeft; // Adjust spacing between sections
      });

      // Second part (right side)
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const maxWidthRight = 72; // Maximum width in pixels
      let yRight = 33;
      const yIncrementRight = 1; // Adjust this value based on your spacing requirements

      const textDataRight = [
        {
          label: `${invoiceResponse?.data?.dateLabels.Row1}`,
          value: `${invoiceResponse?.data?.dateValues.Row1}`,
        },
        {
          label: `${invoiceResponse?.data?.dateLabels.Row2}`,
          value: `${invoiceResponse?.data?.dateValues?.Row2 || ""}`,
        },
        {
          label: `${invoiceResponse?.data?.dateLabels.Row3}`,
          value: `${invoiceResponse?.data?.dateValues?.Row3 || ""}`,
        },
      ];
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      textDataRight.forEach((item) => {
        const labelXRight = 100;
        const valueXRight = 127;

        // Split the value text if it exceeds maxWidth
        const valueLinesRight = doc.splitTextToSize(item.value, maxWidthRight);

        // Print the label
        doc.text(item.label, labelXRight, yRight);
        valueLinesRight.forEach((line, index) => {
          doc.text(line, valueXRight, yRight + index * 4);
        });
        yRight += valueLinesRight.length * 4 + yIncrementRight;
      });

      // invoice to
      doc.setFontSize(12);
      doc.text(
        `${invoiceResponse?.data?.clientLabel["Client Details"]}`,
        7,
        54
      );
      doc.text(
        `${invoiceResponse?.data?.consigneeLabel["Consignee Details"]}`,
        100,
        54
      );
    };
    doc.setFillColor(32, 55, 100);
    doc.rect(7, 55.5, doc.internal.pageSize.width - 15, 0.5, "FD");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    function renderWrappedText(
      doc,
      text,
      startX,
      startY,
      maxWidth,
      lineHeight
    ) {
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line, index) => {
        doc.text(line, startX, startY + index * lineHeight);
      });
      return startY + lines.length * lineHeight;
    }

    const commonStartY = 60;
    const lineHeight = 4.2;
    const maxWidth1 = 72;
    const startX1 = 7;
    const textBlock1 = [
      invoiceResponse.data?.client_address.client_name,
      invoiceResponse.data?.client_address.client_tax_number,
      invoiceResponse.data?.client_address.Address1,
      invoiceResponse.data?.client_address.Address2,
      invoiceResponse.data?.client_address.Address3,
      invoiceResponse.data?.client_address.Address4,
      invoiceResponse.data?.client_address.client_phone,
    ].filter((text) => text && text.toString().trim() !== "");

    let currentY1 = commonStartY;
    doc.setFontSize(11);
    textBlock1.forEach((text, index) => {
      currentY1 = renderWrappedText(
        doc,
        text,
        startX1,
        currentY1,
        maxWidth1,
        lineHeight
      );
      if (index === 0) doc.setFontSize(10); // Adjust font size after the first text
    });

    const maxWidth2 = 72;
    const startX2 = 100;

    const textBlock2 = [
      invoiceResponse.data?.consignee_address.consignee_name,
      invoiceResponse.data?.consignee_address.consignee_tax_number,
      invoiceResponse.data?.consignee_address.Address1,
      invoiceResponse.data?.consignee_address.Address2,
      invoiceResponse.data?.consignee_address.Address3,
      invoiceResponse.data?.consignee_address.Address4,
      invoiceResponse.data?.consignee_address.consignee_email,
    ].filter((text) => text && text.toString().trim() !== "");
    let currentY2 = commonStartY;
    doc.setFontSize(11);
    textBlock2.forEach((text, index) => {
      currentY2 = renderWrappedText(
        doc,
        text,
        startX2,
        currentY2,
        maxWidth2,
        lineHeight
      );
      if (index === 0) doc.setFontSize(10);
    });
    const tableStartY = Math.max(currentY1, currentY2);

    await addLogoWithDetails(); // Wait for logo and details to be added
    //  ***************************************************************************************

    const startY = 83;
    doc.autoTable({
      head: [headRow],
      body: dynamicBody,
      startX: 0,
      columnStyles: {
        0: { halign: "center" },
        1: { halign: "left" },
        2: { halign: "center" },
        3: { halign: "right" },
        4: { halign: "center" },
        5: { halign: "right" },
        6: { halign: "right" },
      },
      startX: 0, // Start the table from the left edge
      startY: tableStartY, // Start Y position of the table
      margin: {
        left: 7,
        right: 7,
      },
      tableWidth: "auto", // Make the table width adjust to the available space
      headStyles: {
        fillColor: "#203764", // Set the header background color
        textColor: "#FFFFFF",
        halign: "center", // Set the header text color
      },
      styles: {
        textColor: "#000000", // Text color for body cells
        cellWidth: "wrap",
        valign: "middle",
        lineWidth: 0.1, // Adjust the border width
        lineColor: "#203764", // Border color
      },
    });
    const endY = doc.autoTable.previous.finalY + 1;
    // doc.rect(7, endY, doc.internal.pageSize.width - 15, 0.5, "FD");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const maxWidthLeft = 45;
    let yLeft = endY + 4;
    const yIncrementLeft = 1;

    const textDataLeft = [
      {
        label: `${
          invoiceResponse?.data?.summaryLabels?.["Total Box : "] ||
          "Total Box : "
        }`,
        value: `${
          invoiceResponse?.data?.summaryValues?.Box
            ? invoiceResponse?.data?.summaryValues?.Box
            : ""
        }`,
      },
      {
        label: invoiceResponse?.data?.summaryLabels["Total Packages : "]
          ? invoiceResponse?.data?.summaryLabels?.["Total Packages : "]
          : "",
        value: invoiceResponse?.data?.summaryValues?.Packages
          ? invoiceResponse?.data?.summaryValues?.Packages
          : "",
      },
      {
        label: invoiceResponse?.data?.summaryLabels["Total Items : "]
          ? invoiceResponse?.data?.summaryLabels["Total Items : "]
          : "",
        value: invoiceResponse?.data?.summaryValues?.Items
          ? invoiceResponse?.data?.summaryValues?.Items
          : "",
      },
    ];
    textDataLeft.forEach((item) => {
      const labelXLeft = 7;
      const valueXLeft = 43;
      const valueLinesLeft = doc.splitTextToSize(item.value, maxWidthLeft);
      doc.text(item.label, labelXLeft, yLeft);
      valueLinesLeft.forEach((line, index) => {
        doc.text(line, valueXLeft, yLeft + index * 4); // Adjust y position for each line of value
      });
      yLeft += valueLinesLeft.length * 4 + yIncrementLeft; // Adjust spacing between sections
    });

    // Draw the text for the order part (right side)
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const maxWidthRight = 40; // Maximum width in pixels
    let yRight = endY + 4; // Start below the table
    const yIncrementRight = 1; // Adjust this value based on your spacing requirements
    const textDataRight = [
      {
        label:
          invoiceResponse?.data?.weightLabels?.["Total Net Weight : "] ||
          "Total Net Weight : ",
        value: invoiceResponse?.data?.weightValues?.total_nw
          ? invoiceResponse.data.weightValues.total_nw
          : "",
      },
      {
        label:
          invoiceResponse?.data?.weightLabels?.["Total Gross Weight : "] ||
          "Total Gross Weight : ",
        value: invoiceResponse?.data?.weightValues?.total_gw
          ? invoiceResponse?.data?.weightValues?.total_gw
          : "",
      },
      {
        label:
          invoiceResponse?.data?.weightLabels?.["Total CBM : "] ||
          "Total CBM : ",
        value: invoiceResponse?.data?.weightValues?.total_cbm
          ? invoiceResponse?.data?.weightValues?.total_cbm
          : "",
      },
    ];
    // Draw the text for the order part (right side)
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    textDataRight.forEach((item) => {
      const labelXRight = 85;
      const valueXRight = 117;

      // Split the value text if it exceeds maxWidth
      const valueLinesRight = doc.splitTextToSize(item.value, maxWidthRight);

      // Print the label
      doc.text(item.label, labelXRight, yRight);
      valueLinesRight.forEach((line, index) => {
        doc.text(line, valueXRight, yRight + index * 4);
      });

      yRight += valueLinesRight.length * 4 + yIncrementRight;
    });
    const textDataRightThree = [
      {
        label:
          invoiceResponse?.data?.dummyTotalLabels?.["FOB (THB) : "] ||
          "FOB (THB) : ",
        value: invoiceResponse?.data?.dummyTotalCalc?.FOB
          ? invoiceResponse.data.dummyTotalCalc.FOB
          : "",
      },
      {
        label:
          invoiceResponse?.data?.dummyTotalLabels?.["Freight : "] ||
          "Freight : ",
        value: invoiceResponse?.data?.dummyTotalCalc?.Freight
          ? invoiceResponse?.data?.dummyTotalCalc?.Freight
          : "",
      },
      {
        label:
          invoiceResponse?.data?.dummyTotalLabels?.["Exchange Rate "] ||
          "Exchange Rate ",
        value: invoiceResponse?.data?.dummyTotalCalc?.Daily_FX_Rate
          ? invoiceResponse?.data?.dummyTotalCalc?.Daily_FX_Rate
          : "",
      },
    ];
    let yRightNew = endY + 20;
    textDataRightThree.forEach((item) => {
      const labelXRight = 7;
      const valueXRight = 40;

      // Split the value text if it exceeds maxWidth
      const valueLinesRight = doc.splitTextToSize(item.value, maxWidthRight);

      // Print the label
      doc.text(item.label, labelXRight, yRightNew);
      valueLinesRight.forEach((line, index) => {
        doc.text(line, valueXRight, yRightNew + index * 4);
      });

      yRightNew += valueLinesRight.length * 4 + yIncrementRight;
    });

    const cnfText = invoiceResponse?.data?.paymentValues?.CNF;
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    const cnfFXText = invoiceResponse?.data?.paymentValues?.CNF_FX;
    const textWidthCNF = doc.getTextWidth(cnfText);
    const textWidthCNFFX = doc.getTextWidth(cnfFXText);
    const rightAlignX = 200;
    doc.text(
      invoiceResponse?.data?.paymentLabels?.["Total (THB) : "] ||
        "Total (THB) : ",
      147,
      endY + 4
    );
    doc.text(cnfText, rightAlignX - textWidthCNF, endY + 4);

    // Separator line
    doc.rect(147, endY + 6, 55.5, 0.5, "FD");

    // Total with currency
    doc.text(
      invoiceResponse?.data?.paymentLabels?.["total"] || "total",
      147,
      endY + 11
    );
    doc.text(cnfFXText, rightAlignX - textWidthCNFFX, endY + 11);
    doc.setFillColor(32, 55, 100);
    doc.rect(147, endY + 12, 55.5, 0.5, "FD");
    doc.text(
      invoiceResponse?.data?.paymentLabels?.["Exchange Rate "] ||
        "Exchange Rate ",
      147,
      endY + 17
    );
    const cnfFXTextNew = invoiceResponse?.data?.paymentValues?.Daily_FX_Rate;
    doc.text(cnfFXTextNew, rightAlignX - textWidthCNFFX, endY + 17);
    doc.rect(147, endY + 18, 55.5, 0.5, "FD");

    //*****************************************************************************************//

    // Custom page number function
    const addPageNumbers = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        4, 154.51;
        doc.setPage(i);
        doc.text(`${i} out  of ${pageCount}`, 185.2, 3.1);
      }
    };

    // Add page numbers
    addPageNumbers(doc);

    // Open the PDF in a new tab

    // Generate PDF Blob
    const pdfBlob = doc.output("blob");

    // Create a URL for the PDF Blob
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Open the PDF in a new window or tab

    // Upload the PDF to the server

    await uploadPDF5(pdfBlob, a);
  };
  const uploadPDF5 = async (pdfBlob, a) => {
    // Generate a unique date-time string
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;

    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${a?.Invoice_Number || "default"}_Custom_${dateTime}.pdf`
    );

    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${
            a?.Invoice_Number || "default"
          }_Custom_${dateTime}.pdf`
        );
      } else {
        console.log("Failed to upload PDF");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };
  const generatePdfWithBackground = async (PAY_ID1) => {
    try {
      // 1️⃣ Call your API with PAY_ID
      const response = await axios.post(`${API_BASE_URL}/WHT_3_PDF`, {
        PAY_ID: PAY_ID1,
      });
      const apiData = response.data;
      console.log("API Data:", apiData);

      const doc = new jsPDF("p", "mm", "a4");

      doc.addFileToVFS("NotoSansThai-Regular.ttf", NotoSansThaiRegular); // NotoSansThaiRegular is the variable exported from the .js file
      doc.addFont("NotoSansThai-Regular.ttf", "NotoSansThai", "normal");
      const pageCount = doc.internal.getNumberOfPages();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Add background image
      doc.addImage(img, "JPEG", 0, 0, 210, 297); // full A4 page
      // white rectangle
      doc.setFillColor(255, 255, 255); // red
      doc.rect(7, 0, pageWidth, 15.1, "F");
      // end white rectangle
      doc.setFont("NotoSansThai");
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.setFillColor(255, 255, 255); // red
      doc.rect(149.7, 16.1, 50, 12.2, "F");
      // PO Label + value
      doc.text("เล่มท", 165, 21.7, { align: "center" });
      doc.text("PO-20250915001", 182, 21.7, { align: "center" });

      // วาดเส้นประใต้ค่า PO
      doc.setLineDash([0.2, 0.2], 0); // เส้นประ
      doc.line(169, 22.5, 200, 22); // (x1,y1,x2,y2) กำหนดความยาวเส้นเอง
      doc.setLineDash([]); // reset

      // WHT Label + value
      doc.text("เลขท", 165, 26.7, { align: "center" });
      doc.text("WHT-202500001", 182, 26, { align: "center" });

      // วาดเส้นประใต้ค่า WHT
      doc.setLineDash([0.2, 0.2], 0);
      doc.line(169, 27.5, 200, 27);
      doc.setLineDash([]);

      doc.setFontSize(9);
      doc.setFont("NotoSansThai");
      doc.text(apiData?.Section_1?.row1 || "", 19, 39);
      const longTextOne = apiData?.Section_1?.row2 || "";
      const linesOne = doc.splitTextToSize(longTextOne);
      let startXOne = 20;
      let startYOne = 47;
      let lineHeight = 4.2;
      let lastYOne = startYOne;

      linesOne.forEach((lineOne, index) => {
        let currentY = startYOne + index * lineHeight;
        doc.text(lineOne, startXOne, currentY);
        lastYOne = currentY;
      });
      const taxId = apiData?.Section_1?.tax || ""; // Tax ID
      const boxSize = 4; // width & height of each box
      const gap = 0; // default gap
      const startX = pageWidth - 77.37;
      const startY = 30;

      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);

      // Define specific gaps after certain indexes
      const gapMap = {
        0: 2, // after 2nd digit -> 4mm gap
        1: 0.5, // after 6th digit -> 4mm gap
        2: 0.5,
        3: 0.5,
        4: 2,
        5: 0.5,
        6: 0.3,
        7: 0.1,
        8: 0.1,
        9: 2,
        10: 0.5,
        11: 2.3,
      };

      let currentX = startX;

      for (let i = 0; i < taxId.length; i++) {
        const x = currentX;
        const y = startY;
        // center digit inside
        const textX = x + boxSize / 2;
        const textY = y + boxSize / 2 + 1.2;
        doc.text(taxId[i], textX, textY, { align: "center" });

        // move forward by box + default gap
        currentX += boxSize + gap;

        // if this index has an extra gap, add it
        if (gapMap[i] !== undefined) {
          currentX += gapMap[i];
        }
      }

      // second id
      doc.text(apiData?.Section_2?.row1 || "", 20, 64.5);
      doc.text(apiData?.Section_2?.row2 || "", 23, 74);
      const secId = apiData?.Section_2?.tax || ""; // your Sec ID
      const boxSize1 = 4; // width & height of each box
      const gap1 = 0; // default gap
      const startX1 = pageWidth - 77.37; // X start position
      const startY1 = 54; // Y start position (below first row)

      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);

      // Define specific gaps after certain indexes
      const secGapMap = {
        0: 2,
        1: 0.5,
        2: 0.5,
        3: 0.5,
        4: 2,
        5: 0.5,
        6: 0.3,
        7: 0.1,
        8: 0.1,
        9: 2,
        10: 0.5,
        11: 2.3,
      };

      let currentX1 = startX1;

      for (let i = 0; i < secId.length; i++) {
        const x = currentX1;
        const y = startY1;

        // center digit inside
        const textX = x + boxSize1 / 2;
        const textY = y + boxSize1 / 2 + 1.2;
        doc.text(secId[i], textX, textY, { align: "center" });

        // move forward by box + default gap
        currentX1 += boxSize1 + gap1;

        // add extra gap if defined
        if (secGapMap[i] !== undefined) {
          currentX1 += secGapMap[i];
        }
      }

      // Assuming apiData = response.data
      const checks = apiData.WHT_Checks;

      const checkY = 74;
      const xPositions = [75, 103, 141, 168, 75, 103, 141];
      const yPositions = [
        checkY + 10,
        checkY + 10,
        checkY + 10,
        checkY + 10,
        checkY + 16.5,
        checkY + 16.5,
        checkY + 16.5,
      ];

      // Convert API object into array
      const checkValues = [
        checks.WHT1,
        checks.WHT2,
        checks.WHT3,
        checks.WHT4,
        checks.WHT5,
        checks.WHT6,
        checks.WHT7,
      ];

      // Draw only when value exists
      checkValues.forEach((val, i) => {
        if (val && val.toUpperCase() === "X") {
          doc.setFont("zapfdingbats", "normal");
          doc.setFontSize(9);

          // 52 = checkmark ✔ in ZapfDingbats
          doc.text(String.fromCharCode(52), xPositions[i], yPositions[i]);
        }
      });
      doc.setFont("NotoSansThai");
      //for table row 1
      doc.setFontSize(9);

      const startXTable = 118;
      const startYTable1 = 107.5;
      // Column 1 values
      const rows1 = [
        { text: apiData?.Section_3?.Row1 || "", y: startYTable1 },
        { text: apiData?.Section_3?.Row2 || "", y: startYTable1 + 5 },
        { text: apiData?.Section_3?.Row3 || "", y: startYTable1 + 10 },
        { text: apiData?.Section_3?.Row4 || "", y: startYTable1 + 15 },
        { text: apiData?.Section_3?.Row5 || "", y: startYTable1 + 28 },
        { text: apiData?.Section_3?.Row6 || "", y: startYTable1 + 41 },
        { text: apiData?.Section_3?.Row7 || "", y: startYTable1 + 46 },
        { text: apiData?.Section_3?.Row8 || "", y: startYTable1 + 51 },
        { text: apiData?.Section_3?.Row9 || "", y: startYTable1 + 59 },
        { text: apiData?.Section_3?.Row10 || "", y: startYTable1 + 69 },
        { text: apiData?.Section_3?.Row11 || "", y: startYTable1 + 79 },
        { text: apiData?.Section_3?.Row12 || "", y: startYTable1 + 89 },
        { text: apiData?.Section_3?.Row13 || "", y: startYTable1 + 104 },
        { text: apiData?.Section_3?.Row14 || "", y: startYTable1 + 117.4 },
      ];

      // Column 2 values
      const rows2 = [
        { text: apiData?.Section_4?.Row1 || "", y: startYTable1 },
        { text: apiData?.Section_4?.Row2 || "", y: startYTable1 + 5 },
        { text: apiData?.Section_4?.Row3 || "", y: startYTable1 + 10 },
        { text: apiData?.Section_4?.Row4 || "", y: startYTable1 + 15 },
        { text: apiData?.Section_4?.Row5 || "", y: startYTable1 + 28 },
        { text: apiData?.Section_4?.Row6 || "", y: startYTable1 + 41 },
        { text: apiData?.Section_4?.Row7 || "", y: startYTable1 + 46 },
        { text: apiData?.Section_4?.Row8 || "", y: startYTable1 + 51 },
        { text: apiData?.Section_4?.Row9 || "", y: startYTable1 + 59 },
        { text: apiData?.Section_4?.Row10 || "", y: startYTable1 + 69 },
        { text: apiData?.Section_4?.Row11 || "", y: startYTable1 + 79 },
        { text: apiData?.Section_4?.Row12 || "", y: startYTable1 + 89 },
        { text: apiData?.Section_4?.Row13 || "", y: startYTable1 + 104 },
        { text: apiData?.Section_4?.Row14 || "", y: startYTable1 + 117.4 },
      ];

      // Column 3 values
      const rows3 = [
        { text: apiData?.Section_5?.Row1 || "", y: startYTable1 },
        { text: apiData?.Section_5?.Row2 || "", y: startYTable1 + 5 },
        { text: apiData?.Section_5?.Row3 || "", y: startYTable1 + 10 },
        { text: apiData?.Section_5?.Row4 || "", y: startYTable1 + 15 },
        { text: apiData?.Section_5?.Row5 || "", y: startYTable1 + 28 },
        { text: apiData?.Section_5?.Row6 || "", y: startYTable1 + 41 },
        { text: apiData?.Section_5?.Row7 || "", y: startYTable1 + 46 },
        { text: apiData?.Section_5?.Row8 || "", y: startYTable1 + 51 },
        { text: apiData?.Section_5?.Row9 || "", y: startYTable1 + 59 },
        { text: apiData?.Section_5?.Row10 || "", y: startYTable1 + 69 },
        { text: apiData?.Section_5?.Row11 || "", y: startYTable1 + 79 },
        { text: apiData?.Section_5?.Row12 || "", y: startYTable1 + 89 },
        { text: apiData?.Section_5?.Row13 || "", y: startYTable1 + 104 },
        { text: apiData?.Section_5?.Row14 || "", y: startYTable1 + 117.4 },
      ];
      const newY1 = startYTable1 + 117.4;
      // Draw all three columns
      rows1.forEach((row) => doc.text(row.text, startXTable, row.y));
      // rows2.forEach((row) => {
      //   const value = row.text;

      //   if (value && !isNaN(value)) {
      //     // Format with commas and 2 decimals
      //     const formatted = Number(value).toLocaleString("en-US", {
      //       minimumFractionDigits: 2,
      //       maximumFractionDigits: 2,
      //     });

      //     const [int, dec] = formatted.split(".");
      //     const integerPart = int || "";
      //     const decimalPart = dec ? dec : "";

      //     doc.text(integerPart, startXTable + 28, row.y);

      //     if (decimalPart) {
      //       doc.text(decimalPart, startXTable + 50, row.y); // decimal part shifted
      //     }
      //   } else {
      //     doc.text(value, startXTable + 28, row.y);
      //   }
      // });
rows2.forEach((row) => {
  const value = row.text;

  if (value && !isNaN(value)) {
    // Format with commas and 2 decimals
    const formatted = Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const [int, dec] = formatted.split(".");
    const integerPart = int || "";
    const decimalPart = dec ? dec : "";

    // Integer column setup
    const colX = startXTable + 28;                     // left edge of integer column
    const colWidth = doc.getTextWidth("9,999,999,999"); // width for 10-digit integer

    // Measure actual text width
    const intWidth = doc.getTextWidth(integerPart);

    // Right-align integer inside the column
    const intX = colX + colWidth - intWidth;

    // Draw integer
    doc.text(integerPart, intX, row.y);

    // Draw decimal part at fixed X
    if (decimalPart) {
      doc.text(decimalPart, startXTable + 50, row.y);
    }
  } else {
    doc.text(value, startXTable + 28, row.y);
  }
});
      // rows3.forEach((row) => {
      //   const value = row.text;

      //   if (value && !isNaN(value)) {
      //     // Format with commas and 2 decimals
      //     const formatted = Number(value).toLocaleString("en-US", {
      //       minimumFractionDigits: 2,
      //       maximumFractionDigits: 2,
      //     });

      //     const [int, dec] = formatted.split(".");
      //     const integerPart = int || "";
      //     const decimalPart = dec ? dec : "";

      //     doc.text(integerPart, startXTable + 58, row.y);

      //     if (decimalPart) {
      //       doc.text(decimalPart, startXTable + 75, row.y); // decimal part shifted
      //     }
      //   } else {
      //     doc.text(value, startXTable + 58, row.y);
      //   }
      // });
rows3.forEach((row) => {
  const value = row.text;

  if (value && !isNaN(value)) {
    // Format with commas and 2 decimals
    const formatted = Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const [int, dec] = formatted.split(".");
    const integerPart = int || "";
    const decimalPart = dec ? dec : "";

    // Integer column setup
    const colX = startXTable + 58;                     // left edge of integer column
    const colWidth = doc.getTextWidth("9,999,9999"); // width for 10-digit integer

    // Measure actual text width
    const intWidth = doc.getTextWidth(integerPart);

    // Right-align integer inside the column
    const intX = colX + colWidth - intWidth;

    // Draw integer
    doc.text(integerPart, intX, row.y);

    // Draw decimal part at fixed X
    if (decimalPart) {
      doc.text(decimalPart, startXTable + 75, row.y);
    }
  } else {
    doc.text(value, startXTable + 58, row.y);
  }
});


      doc.text(apiData?.Totals?.Col1 || "", 34, newY1 + 1);
    // col-2 
{
  const value = apiData?.Totals?.Col2 || "";
  if (value && !isNaN(value)) {
    // Format with commas and 2 decimals
    const formatted = Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const [int, dec] = formatted.split(".");
    const integerPart = int || "";
    const decimalPart = dec ? dec : "";

    // Column setup
    const colX = startXTable + 28;                  // left edge of integer column
    const colWidth = doc.getTextWidth("9,999,999,999"); // max width for 7 digits + commas

    // Actual integer text width
    const intWidth = doc.getTextWidth(integerPart);

    // Right-align integer inside fixed width
    const intX = colX + colWidth - intWidth;

    // Draw integer
    doc.text(integerPart, intX, newY1 + 7);

    // Decimal part at fixed X
    if (decimalPart) {
      doc.text(decimalPart, startXTable + 50, newY1 + 7);
    }
  } else {
    doc.text(value, startXTable + 28, newY1 + 7);
  }
}

      // col-3
    {
        const value = apiData?.Totals?.Col3 || "";
        if (value && !isNaN(value)) {
          // Format with commas and 2 decimals
          const formatted = Number(value).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

          const [int, dec] = formatted.split(".");
          const integerPart = int || "";
          const decimalPart = dec ? dec : "";

          // Integer column setup
          const colX = startXTable + 58; // left boundary of integer column
         const colWidth = doc.getTextWidth("9,999,9999"); // enough for 7 digits with commas

          // Measure integer text width
          const intWidth = doc.getTextWidth(integerPart);

          // Align integer to right within the 30px width
          const intX = colX + colWidth - intWidth;

          // Draw integer part (right aligned)
          doc.text(integerPart, intX, newY1 + 7);

          // Draw decimal part at fixed X you provided
          if (decimalPart) {
            doc.text(decimalPart, startXTable + 75, newY1 + 7);
          }
        } else {
          doc.text(value, startXTable + 58, newY1 + 7);
        }
      }
function numberToThaiBahtText(amount) {
  const txtNum = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
  const txtDigit = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];
 
  if (typeof amount === "string") amount = amount.trim();
  if (isNaN(amount) || amount === "" || amount === null || amount === undefined) return "";
 
  // handle negative
  let negative = false;
  let num = Number(amount);
  if (num < 0) {
    negative = true;
    num = Math.abs(num);
  }
 
  // Round to 2 decimal places (for satang)
  num = Math.round(num * 100) / 100;
 
  const intPartNum = Math.floor(num);
  let satangNum = Math.round((num - intPartNum) * 100); // 0..99
 
  // If rounding satang bumps integer (e.g., 1.999 -> 2.00)
  if (satangNum === 100) {
    satangNum = 0;
  }
 
  // ----------- helper: convert integer (supports large numbers) -----------
  function convertIntegerText(intStr) {
    if (intStr === "0") return "ศูนย์";
 
    let result = "";
     
    const groups = [];
    let s = intStr;
    while (s.length > 0) {
      const end = s.length;
      const start = Math.max(0, end - 6);
      groups.unshift(s.substring(start, end));  
      s = s.substring(0, start);
    }
 
    for (let g = 0; g < groups.length; g++) {
      const grp = groups[g];
      const grpLen = grp.length;
      for (let i = 0; i < grpLen; i++) {
        const digit = parseInt(grp.charAt(i), 10);
        const pos = grpLen - i - 1;  
        if (digit === 0) continue;
 
        if (pos === 1) {  
          if (digit === 1) {
            result += "สิบ";
            continue;
          } else if (digit === 2) {
            result += "ยี่สิบ";
            continue;
          }
        }
 
        if (pos === 0) { // units place
          // use "เอ็ด" only when this is the last digit of the whole integer and integer > 1
          const isLastGroup = (g === groups.length - 1);
          const isSingleDigitInteger = (intStr.length === 1);
          if (digit === 1 && !isSingleDigitInteger && isLastGroup) {
            result += "เอ็ด";
            continue;
          }
        }
 
        // default
        result += txtNum[digit] + txtDigit[pos];
      }
 
      // append "ล้าน" between groups (every 6 digits)
      const groupsRemaining = groups.length - g - 1;
      if (groupsRemaining > 0) {
        result += "ล้าน";
      }
    }
 
    return result;
  }
 
  // ----------- helper: convert 2-digit satang (no "เอ็ด" for unit) -----------
  function convertSatangText(n) {
    if (n === 0) return "";
    if (n < 10) {
      // single digit satang: e.g., 5 -> ห้าสตางค์ (not "ศูนย์ห้า")
      return txtNum[n];
    }
    const tensDigit = Math.floor(n / 10);
    const unit = n % 10;
    let text = "";
 
    if (tensDigit === 1) {
      text += "สิบ";
    } else if (tensDigit === 2) {
      text += "ยี่สิบ";
    } else if (tensDigit > 2) {
      text += txtNum[tensDigit] + "สิบ";
    }
 
    if (unit > 0) {
      // For satang unit 1, use "หนึ่ง" (not "เอ็ด")
      text += (unit === 1 ? "หนึ่ง" : txtNum[unit]);
    }
    return text;
  }
 
  const intPartStr = String(intPartNum);
  const intText = intPartNum > 0 ? convertIntegerText(intPartStr) : "ศูนย์";
  const satangText = convertSatangText(satangNum);
 
  let finalText = "";
  if (negative) finalText += "ลบ";
 
  if (intPartNum > 0) {
    if (satangNum > 0) {
      finalText += intText + "บาท" + satangText + "สตางค์";
    } else {
      finalText += intText + "บาทถ้วน";
    }
  } else { // int === 0
    if (satangNum > 0) {
      finalText += satangText + "สตางค์";
    } else {
      finalText += "ศูนย์บาทถ้วน";
    }
  }
 
  return finalText;
}
 const value = apiData?.Totals?.Col3 || 0;
const englishWords = numberToThaiBahtText(value) +"ถ้วน";
 doc.setFont("NotoSansThai");
doc.text(englishWords, 66, newY1 + 14.5);
      const options = apiData?.Options || {};

      const apiValues = [options.OP1, options.OP2, options.OP3, options.OP4];
      const xPositions1 = [30.5, 63, 101, 140];
      const yPositions1 = [newY1 + 29, newY1 + 29, newY1 + 29, newY1 + 29];

      apiValues.forEach((val, i) => {
        if (val && val.toUpperCase() === "X") {
          doc.setFont("zapfdingbats", "normal");
          doc.setFontSize(9);

          // 52 = checkmark ✔ in ZapfDingbats
          doc.text(String.fromCharCode(52), xPositions1[i], yPositions1[i]);
        }
      });
      doc.setFont("NotoSansThai");
      const rawDate = apiData?.Dates?.Row2 || "";
      let formattedDate = "";

      if (rawDate) {
        const d = new Date(rawDate);
        const year = d.getUTCFullYear();
        const month = String(d.getUTCMonth() + 1).padStart(2, "0");
        const day = String(d.getUTCDate()).padStart(2, "0");
       formattedDate = `${day}-${month}-${year}`;
      }
      doc.text(apiData?.Dates?.Row1 || "", startXTable + 9, newY1 + 41);
      doc.text(formattedDate, startXTable + 19, newY1 + 45);

      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank"); // Opens PDF in a new tab
    } catch (error) {
      console.error("API Error:", error);
    }
  };
  const fetchReceiptData = async (Order_ID) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/receiptBNIDView`, {
        IID: Order_ID,
      });
      if (res.data.success) {
        setModalHead(res.data.head);
        setModalData(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching receipt data", error);
    }
  };

  // const handleModalOpen = (a) => {
  //   everyDataSet(a);            // Your existing function
  //   fetchReceiptData(a.Order_ID);  // Fetch and set modal API data
  // };

  const handleModalOpen = async (a) => {
    everyDataSet(a); // Your existing function

    try {
      // Step 1: Call BNPaymentStep API but with IID (Invoice ID)
      const res = await axios.post(`${API_BASE_URL}/BNPaymentStep`, {
        bn_id: "", // Not needed for invoice
        IID: a.Order_ID, // Pass Invoice ID here
        USER_ID: localStorage.getItem("id"),
      });

      if (res?.data?.success) {
        const latestId = res.data.latestId?.LastInsertedReceiptID;
        setReceiptID(latestId); //  Store the RID for on-change updates
        console.log("Invoice Receipt ID:", latestId);

        // Step 2: Fetch receipt data for invoice
        fetchReceiptData(a.Order_ID);
      }
    } catch (error) {
      console.error("Error opening invoice modal:", error);
    }
  };

  return (
    <>
      <Card
        title={t("withHoldingTaxManagement")}
        // endElement={
        // <button
        //   type="button"
        //   onClick={() => navigate("")}
        //   className="btn button btn-info"
        // >
        //   Create
        // </button>
        // }
      >
        <TableView columns={columns} data={data} />
      </Card>
      {/* Modal for Stock Adjustment */}
      <div
        className="modal fade"
        id="modalAdjustBox"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modalShipTo">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {t("adjustInvoiceWeight")}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="mdi mdi-close"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group col-lg-12 formCreate">
                <h6> {t("adjustInvoiceWeight")}</h6>
                <div>
                  <input
                    type="text"
                    name="quantity"
                    value={quantity}
                    onChange={handleChange}
                    placeholder="124"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={uploadData}
                className="btn mb-0 btn-primary"
              >
                {t("submit")}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for Stock Adjustment */}
      <div
        className="modal fade"
        id="modalAdjustBox1"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel1"
        aria-hidden="true"
      >
        <div className="modal-dialog modalShipTo">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel1">
                {t("callInvoiceShipped")}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="mdi mdi-close"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group col-lg-12 formCreate">
                <h6>{t("uploadPdf")}</h6>
                <div>
                  <input
                    type="file"
                    name="uploadImage"
                    accept=".pdf"
                    onChange={handleChange1}
                  />
                  {errorMessage && (
                    <p style={{ color: "red" }}>{errorMessage}</p>
                  )}
                  {selectedFile && (
                    <p>
                      {t("selectedFile")}: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={uploadData1}
                className="btn mb-0 btn-primary"
              >
                {t("submit")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModal2"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog InvoiceModal">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {t("setInvoiceNote")}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <textarea
                className="ps-2"
                value={notes}
                onChange={handleChange2}
                placeholder={t("typeNotes")}
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
                onClick={dataSubmit}
                className="btn btn-primary"
              >
                {t("ok")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="modalAdjustBox3"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modalShipTo">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel1">
                {t("uploadInvoice")}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="mdi mdi-close"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group col-lg-12 formCreate">
                <h6> {t("uploadPdf")}</h6>
                <div>
                  <input
                    type="file"
                    name="uploadImage"
                    accept=".pdf"
                    onChange={handleChange21}
                  />
                  {errorMessage && (
                    <p style={{ color: "red" }}>{errorMessage}</p>
                  )}
                  {selectedFile1 && (
                    <p>
                      {t("selectedFile")}: {selectedFile1.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={uploadData2}
                className="btn mb-0 btn-primary"
              >
                {t("submit")}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="modalClaim"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modalShipTo modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {t("claim")}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeButton}
              >
                <i className="mdi mdi-close"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="claimParent">
                <div>
                  <strong>
                    {details?.invoiceHeader?.["Invoice Number: "] ||
                      "Invoice Number:"}
                  </strong>
                  <span>
                    {details?.orderMetaLabels?.["Invoice_Number"] || "-"}
                  </span>
                </div>
                <div>
                  <strong>
                    {details?.invoiceHeader?.["Client Name: "] || "Client:"}
                  </strong>
                  <span>
                    {details?.orderMetaLabels?.["client_name"] || "-"}
                  </span>
                </div>
                <div>
                  <strong>
                    {details?.invoiceHeader?.["Consignee Name: "] ||
                      "Consignee:"}
                  </strong>
                  <span>
                    {details?.orderMetaLabels?.["Consignee_name"] || "-"}
                  </span>
                </div>
                <div>
                  <strong>
                    {details?.invoiceHeader?.["Shipment Ref: "] ||
                      "Shipment Ref:"}
                  </strong>
                  <span>
                    {details?.orderMetaLabels?.["Shipment_ref"] || "-"}
                  </span>
                </div>
                <div>
                  <strong>
                    {details?.invoiceHeader?.["Client PO: "] || "Client PO:"}
                  </strong>
                  <span>
                    {details?.orderMetaLabels?.["Customer_ref"] || "-"}
                  </span>
                </div>
                <div>
                  <strong>
                    {details?.invoiceHeader?.["Delivery Details: "] ||
                      "Delivery Details:"}
                  </strong>
                  <span>
                    {details?.orderMetaLabels?.[
                      'Concat(@Airline," (",Orders.journey_number,") ",Orders.BL)'
                    ] || "-"}
                  </span>
                </div>
              </div>

              <div className="uploadFileMain">
                <div>
                  <p>
                    <strong>{t("claimDate")}</strong>
                  </p>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                  />
                </div>
                <div className="uploadFile">
                  <p>
                    <strong>{t("upload")}</strong>
                  </p>
                  <div className="parentInsideUp">
                    <div>
                      <input type="file" onChange={handleFileChangeInv} />
                    </div>
                    {invImage && (
                      <div>
                        <img
                          src={invImage}
                          alt="Uploaded"
                          style={{ width: "300px", height: "auto" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="tableClaim">
                <table>
                  <thead>
                    <tr>
                      {details?.dateLabels &&
                        Object.values(details.dateLabels).map(
                          (label, index) => <th key={index}>{label}</th>
                        )}
                    </tr>
                  </thead>

                  <tbody>
                    {Array.isArray(details?.dateValues) &&
                      details.dateValues.map((item, i) => (
                        <tr key={i}>
                          <td>{item.Col1}</td>
                          <td>{item.Col2}</td>
                          <td>{item.Col3}</td>
                          <td>{item.Col4}</td>
                          <td>{item.Col5}</td>
                          <td>{item.Col6}</td>
                          {/* Claim Quantity */}
                          <td>
                            <div className="selectInvoiceView">
                              <select
                                name="claims_id"
                                value={claims[item.OD_ID] || ""}
                                onChange={(e) =>
                                  handleClaimChange(item.OD_ID, e.target.value)
                                }
                              >
                                <option value="" disabled>
                                  {t("selectOption")}
                                </option>
                                {claim?.map((claim) => (
                                  <option
                                    key={claim.claim_reason_id}
                                    value={claim.claim_reason_id}
                                  >
                                    {claim.cl_name_en}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>

                          <td>
                            <input
                              type="number"
                              value={paidAmounts[item.OD_ID] || ""}
                              onChange={(e) =>
                                handlePaidAmountChange(
                                  item.OD_ID,
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          {/* Claim Unit */}
                          <td>
                            <div className="selectInvoiceView">
                              <select
                                name="unit_id"
                                value={units[item.OD_ID] || ""}
                                onChange={(e) =>
                                  handleUnitChange(item.OD_ID, e.target.value)
                                }
                              >
                                <option value="" disabled>
                                  {t("selectOption")}
                                </option>
                                {unit?.map((unitItem) => (
                                  <option key={unitItem.ID} value={unitItem.ID}>
                                    {unitItem.Name_EN}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>

                          {/* Amount */}
                          <td>
                            <input
                              type="number"
                              value={amounts[item.OD_ID] || ""}
                              onChange={(e) =>
                                handleAmountChange(item.OD_ID, e.target.value)
                              }
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit1}
              >
                {t("submit")}
              </button>
            </div>
          </div>
        </div>
      </div>
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
              <p style={{ color: "#631f37" }}>
                {massageShow ? massageShow : ""}
              </p>
            </div>
          </div>
        </div>
      </Modal>

      <div
        className="modal fade"
        id="exampleModalCustomization"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className=" modal-dialog  modalShipTo modalInvoice">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {t("invoiceModal")}
              </h1>
              <button
                onClick={clearData}
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i class="mdi mdi-close"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="formCreate">
                <div className="row">
                  <div className="form-group col-lg-12">
                    <div className="invoiceModal d-flex justify-content-between">
                      <h6>{t("useAgreedPricing")} ?</h6>
                      <div>
                        <label
                          className="toggleSwitch large"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                          }}
                        >
                          <input
                            type="checkbox"
                            name="Commission_Currency"
                            checked={useAgreedPricing}
                            onChange={handleAgreedPricingChange}
                          />
                          <span>
                            <span>{t("no")}</span>
                            <span> {t("yes")}</span>
                          </span>
                          <a> </a>
                        </label>
                      </div>
                    </div>

                    <div className="invoiceModal d-flex justify-content-between">
                      <h6>{t("useCustomName")}? </h6>
                      <div>
                        <label
                          className="toggleSwitch large"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                          }}
                        >
                          <input
                            type="checkbox"
                            name="Commission_Currency"
                            checked={itemDetails}
                            onChange={handleAgreedPricingChange1}
                          />
                          <span>
                            <span>{t("no")}</span>
                            <span>{t("yes")}</span>
                          </span>
                          <a> </a>
                        </label>
                      </div>
                    </div>
                    <div className="invoiceModal d-flex justify-content-between">
                      <h6>{t("showGrossWeightAndCBM")} </h6>
                      <div>
                        <label
                          className="toggleSwitch large"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                          }}
                        >
                          <input
                            type="checkbox"
                            name="Commission_Currency"
                            checked={cbm}
                            onChange={handleAgreedPricingChange2}
                          />
                          <span>
                            <span>{t("no")}</span>
                            <span>{t("yes")}</span>
                          </span>
                          <a> </a>
                        </label>
                      </div>
                    </div>

                    <div className="invoiceModal">
                      <h6>{t("invoiceNameCanBe")} -</h6>
                      <input
                        type="radio"
                        id="html1"
                        name="fav_language"
                        value="Client"
                        checked={selectedInvoice === "Client"}
                        onChange={handleRadioChange}
                      />
                      <label htmlFor="html1">{t("client")}</label>

                      <input
                        type="radio"
                        id="css1"
                        name="fav_language"
                        value="Consignee"
                        checked={selectedInvoice === "Consignee"}
                        onChange={handleRadioChange}
                      />
                      <label htmlFor="css1">{t("consignee")}</label>
                    </div>
                    <div className="invoiceModal d-flex justify-content-between">
                      <h6>{t("showExchangeRate")} ? </h6>
                      <div>
                        <label
                          className="toggleSwitch large"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                          }}
                        >
                          <input
                            type="checkbox"
                            name="Commission_Currency"
                            checked={exchangeRate}
                            onChange={handleAgreedPricingChange3}
                          />
                          <span>
                            <span>{t("no")}</span>
                            <span>{t("yes")}</span>
                          </span>
                          <a> </a>
                        </label>
                      </div>
                    </div>

                    <div className="invoiceModal">
                      <h6>{t("deliveryTerms")}- </h6>
                      {deliveryList?.map((term) => (
                        <div key={term.id}>
                          <input
                            type="radio"
                            id={`term-${term.id}`}
                            name="delivery_term"
                            value={term.id}
                            checked={selectedDeliveryTerm === term.id}
                            onChange={handleChangeDelivery}
                          />
                          <label htmlFor={`term-${term.id}`}>
                            {term.Incoterms}
                          </label>
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
                onClick={generatePdf}
                className="btn btn-primary mb-4"
              >
                {t("submit")}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModalCustomization5"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className=" modal-dialog  modalShipTo modalInvoice">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {t("invoiceModal")}
              </h1>
              <button
                onClick={clearData1}
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i class="mdi mdi-close"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="formCreate">
                <div className="row">
                  <div className="form-group col-lg-12">
                    <div className="invoiceModal d-flex justify-content-between">
                      <h6>{t("useCustomName")}? </h6>
                      <div>
                        <label
                          className="toggleSwitch large"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                          }}
                        >
                          <input
                            type="checkbox"
                            name="Commission_Currency"
                            checked={itemDetails2}
                            onChange={handleAgreedPricingChange5}
                          />
                          <span>
                            <span>{t("no")}</span>
                            <span>{t("yes")}</span>
                          </span>
                          <a> </a>
                        </label>
                      </div>
                    </div>
                    <div className="invoiceModal d-flex justify-content-between">
                      <h6>{t("showGrossWeightAndCBM")} ? </h6>
                      <div>
                        <label
                          className="toggleSwitch large"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                          }}
                        >
                          <input
                            type="checkbox"
                            name="Commission_Currency"
                            checked={cbm1}
                            onChange={handleAgreedPricingChange4}
                          />
                          <span>
                            <span>{t("no")}</span>
                            <span>{t("yes")}</span>
                          </span>
                          <a> </a>
                        </label>
                      </div>
                    </div>

                    <div className="invoiceModal">
                      <h6>{t("invoiceNameCanBe")} -</h6>
                      <input
                        type="radio"
                        id="html1"
                        name="fav_language"
                        value="Client"
                        checked={selectedInvoice1 === "Client"}
                        onChange={handleRadioChange6}
                      />
                      <label htmlFor="html1">{t("client")}</label>

                      <input
                        type="radio"
                        id="css1"
                        name="fav_language"
                        value="Consignee"
                        checked={selectedInvoice1 === "Consignee"}
                        onChange={handleRadioChange6}
                      />
                      <label htmlFor="css1">{t("consignee")}</label>
                    </div>
                    <div className="invoiceModal d-flex justify-content-between">
                      <h6>{t("barcode")} </h6>
                      <div>
                        <label
                          className="toggleSwitch large"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                          }}
                        >
                          <input
                            type="checkbox"
                            name="Commission_Currency"
                            checked={exchangeRate1}
                            onChange={handleAgreedPricingChange7}
                          />
                          <span>
                            <span>{t("no")}</span>
                            <span>{t("yes")}</span>
                          </span>
                          <a> </a>
                        </label>
                      </div>
                    </div>
                    <div className="invoiceModal d-flex justify-content-between">
                      <h6>{t("customBarcode")}</h6>
                      <div>
                        <label
                          className="toggleSwitch large"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                          }}
                        >
                          <input
                            type="checkbox"
                            name="Commission_Currency"
                            checked={exchangeRate2}
                            onChange={handleAgreedPricingChange8}
                          />
                          <span>
                            <span>{t("no")}</span>
                            <span>{t("yes")}</span>
                          </span>
                          <a> </a>
                        </label>
                      </div>
                    </div>
                    <div className="invoiceModal d-flex justify-content-between">
                      <h6>{t("notes")} </h6>
                      <div>
                        <label
                          className="toggleSwitch large"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                          }}
                        >
                          <input
                            type="checkbox"
                            name="Commission_Currency"
                            checked={exchangeRate3}
                            onChange={handleAgreedPricingChange9}
                          />
                          <span>
                            <span>{t("no")}</span>
                            <span>{t("yes")}</span>
                          </span>
                          <a> </a>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={generatePdf5}
                className="btn btn-primary mb-4"
              >
                {t("submit")}
              </button>
            </div>
          </div>
        </div>
      </div>
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
                  <div className="row g-3">
                    <div className=" col-xl-3 col-lg-3 col-md-6">
                      <div className="parentFormPayment">
                        <p> {t("paymentDate")}</p>
                        <DatePicker
                          selected={paymentForm.paymentDate}
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
                            ) || null
                          }
                          renderInput={(params) => (
                            <TextField {...params} placeholder={t("fx")} />
                          )}
                        />
                      </div>
                    </div>

                    <div className=" col-xl-3 col-lg-3 col-md-4">
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
                          value={paymentForm.fxRateReceived}
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
                          value={paymentForm.interBankCharges}
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
                          value={paymentForm.paymentAmount}
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
                          value={paymentForm.prepayment}
                          onChange={(e) =>
                            handleChange5("prepayment", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className=" col-xl-3 col-lg-3 col-md-4">
                      <div className="parentFormPayment">
                        <p> {t("bankRef")}</p>
                        <input
                          type="text"
                          value={paymentForm.bankRef}
                          onChange={(e) =>
                            handleChange5("bankRef", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className=" col-xl-3 col-lg-3 col-md-4">
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

                    {/*  <div className=" col-xl-3 col-lg-3 col-md-4">
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
                    <div className=" col-xl-3 col-lg-3 col-md-4">
                      <div className="parentFormPayment">
                        <p> {t("rounding")}</p>
                        <input
                          type="text"
                          value={paymentForm.rounding}
                          onChange={(e) =>
                            handleChange5("rounding", e.target.value)
                          }
                        />
                      </div>
                    </div>
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
                onClick={submitInvoicePayment}
                className="btn btn-primary"
              >
                {t("submit")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WithHold;
