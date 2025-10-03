import axios from "../../Url/Api";
import { useEffect, useMemo, useState, useRef } from "react";
import Barcode from "react-barcode";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import { TableView } from "../table";
import { Button, Modal } from "react-bootstrap";
import { useQuery } from "react-query";
import DatePicker from "react-datepicker";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { FaCalendarAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import moment from "moment";
import MySwal from "../../swal";
import jsPDF from "jspdf";
import logo from "../../assets/logoNew.png";
import NotoSansThaiRegular from "../../assets/fonts/NotoSansThai-Regular-normal";
import { API_IMAGE_URL } from "../../Url/Url";

const BillingNote = () => {
  const [t, i18n] = useTranslation("global");
  const [errorMessage, setErrorMessage] = useState("");
  const { data: currency } = useQuery("getCurrency");
  useEffect(() => {
    if (currency) {
      console.log("Currency API Data:", currency);
    }
  }, [currency]);
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

  const [roundingData, setRoundingData] = useState("");
  const [VATTotal, setVATTotal] = useState(0);
  const [WHTTotal, setWHTTotal] = useState(0);
  const [ridData, setRidData] = useState("");

  const [TotalBeforeTaxTotal, setTotalBeforeTaxTotal] = useState(0);
  const [sumAmountToPay, setSumAmountToPay] = useState(0);
  const [singleFilterData, setSingleFilterData] = useState("");
  const [paymentAmmountNew, setPaymentAmmountNew] = useState("");
  const [roundingNew, setRoundingNew] = useState("");
  const [hasUserChangedValues, setHasUserChangedValues] = useState(false);
  const [procesureResult, setProcesureResult] = useState("");
  const [amountToPayNew, setAmountToPayNew] = useState("");
  const [depositAvailableNew, setDepositAvailableNew] = useState("");
  const [columns, setColumns] = useState([]);

  const [depositUsedNew, newDepositUsedNew] = useState("");
  const [vatNew, setVatNew] = useState("");
  const [whtNew, setWhtNew] = useState("");
  const [basePayment, setBasePayment] = useState(0); // from left_pay
  const [roundingNew1, setRoundingNew1] = useState("0");
  const [totalBeforText, setTotalBeforText] = useState("0");
  const [leftRoundingNew, setLeftRoundingNew] = useState("");
  const [show1, setShow1] = useState("");

  const handleClose1 = () => setShow1(false);
  const closeIcon1 = () => {
    setShow1(false);
  };
  const handleRoundingChange = (e) => {
    let value = e.target.value;

    // Allow empty input (do not force 0 immediately)
    if (value === "") {
      setRoundingData("");
      return;
    }
    // Allow "-" or "+" at the start for negative/positive input
    if (value === "-" || value === "+") {
      setRoundingData(value);
      return;
    }
    // Convert to float and ensure valid number
    let parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      setRoundingData(parsedValue);
    }
  };
  function formatNumber(num) {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  }
  const handleRoundingBlur = (e) => {
    // Reset to 0 if input is empty or only "-" on blur
    if (e.target.value === "" || e.target.value === "-") {
      setRoundingData(0);
    }
  };
  useEffect(() => {
    const modal = document.getElementById("modalCombine");
    modal?.addEventListener("hidden.bs.modal", () => {
      setFormData({});
    });

    return () => {
      modal?.removeEventListener("hidden.bs.modal", () => {});
    };
  }, []);

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
  const formatterTwo = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const [data, setData] = useState([]);
  const [isOn, setIsOn] = useState(true);

  const [singleDataShow, setSingleDataShow] = useState("");

  const [selectedPaymentDate, setSelectedPaymentDate] = useState(null);
  const { data: paymentChannle } = useQuery("PaymentChannela");
  const [receiptID, setReceiptID] = useState("");
  const [bankRef, setBankRef] = useState("");
  const [bankChargeAmount, setBankChargeAmount] = useState("0");
  const [depositAvailable, setDepositAvailable] = useState("");
  const [bankReference, setBankReference] = useState("");
  const [selectedPaymentChannel, setSelectedPaymentChannel] = useState("");

  const [roundingAmount, setRoundingAmount] = useState("0");
  const [totalPaymentAmount, setTotalPaymentAmount] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [payableDATA, setPayableData] = useState("");
  const [show2, setShow2] = useState(false);
  const [color, setColor] = useState(false);
  const [modalHead, setModalHead] = useState(null); // Stores API head data
  const [modalData, setModalData] = useState(null); // Stores API row data
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const closeIcon2 = () => {
    setShow2(false);
    // navigate("/purchase_orders");
  };
  // const submitPaymentData2 = async () => {
  //   const paymentData = {
  //     bn_id: singlePodId.ID, // or however you get bn_id
  //     IID: singlePodId.IID, // same for IID
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
  //       billingNote();
  //     } else {
  //       toast.warning(response.data?.message);
  //     }
  //   } catch (error) {
  //     console.error("Error submitting BNPayment data", error);
  //     toast.error(t("tryAgain"));
  //   }
  // };

  const submitPaymentData2 = async () => {
    if (!receiptID) {
      console.error("No RID found for final submission.");
      toast.error("Receipt ID missing. Please retry.");
      return;
    }

    console.log("Submitting BNPaymentSubmit for RID:", receiptID);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/BNPaymentSubmit`,
        { RID: receiptID } // Only send RID now
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
        billingNote();
      } else {
        toast.warning(response.data?.message || "Submission failed.");
      }
    } catch (error) {
      console.error("Error submitting BNPaymentSubmit:", error);
      toast.error(t("tryAgain"));
    }
  };

  const newFormatter5 = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const handleClose2 = () => setShow2(false);
  const getCombinedPayment = () => {
    axios
      .get(`${API_BASE_URL}/getCombinedPayment`)
      .then((response) => {
        console.log(response);
        // setData(response.data.data || []);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getCombinedPayment();
  }, []);
  const billingNote = () => {
    const lang = localStorage.getItem("language");
    const langValue = lang === "en" ? 0 : 1;

    axios
      .post(`${API_BASE_URL}/BillingNoteView`, {
        LANG: langValue,
      })
      .then((response) => {
        const { data: rows = [], head = {} } = response.data;

        // Step 1: Create dynamic columns from head
        const generatedColumns = Object.entries(head)
          .filter(
            ([key]) => key !== "ID" && key !== "Payment_Status" && key !== "RID"
          )
          .map(([key, label]) => ({
            Header: t(label || key),
            accessor: key,
          }));

        // Step 2: Add actions column
        generatedColumns.push({
          Header: t("actions"),
          accessor: "actions",
          Cell: ({ row }) => {
            const a = row.original;
            return (
              <>
                <div className="editIcon">
                  <button
                    onClick={() =>
                      navigate("/billingNoteView", { state: { from: a } })
                    }
                  >
                    <i className="mdi mdi-eye" />
                  </button>
                  {a.Payment_Status === 1 && (
                    <>
                      {/* <Link to="/billingNoteCreate" state={{ from: a }}>
                        <i className="mdi mdi-pencil pl-2" />
                      </Link> */}

                      {/* <button
                        onClick={async () => {
                          try {
                            const res = await axios.post(
                              `${API_BASE_URL}/Checkeaccessfile`,
                              {
                                id: a.ID,
                                accesstype: 5, // Mark as in use
                              }
                            );

                            if (res?.data?.success) {
                              navigate("/billingNoteCreate", {
                                state: { from: a },
                              });
                            } else {
                              toast.warning(res?.data?.message);
                            }
                          } catch (error) {
                            console.error("Access API error:", error);
                            toast.error(t("genericError"));
                          }
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <i className="mdi mdi-pencil pl-2" />
                      </button> */}
                      <Link
                        to="/billingNoteCreate"
                        state={{ from: { ...a, isReadOnly: true } }}
                      >
                        <i className="mdi mdi-pencil pl-2" />{" "}
                      </Link>
                      <button type="button" onClick={() => deleteOrder(a.ID)}>
                        <i className="mdi mdi-delete " />
                      </button>
                    </>
                  )}

                  {(a.Payment_Status === 1 || a.Payment_Status === 3) && (
                    <button
                      className="SvgAnchor"
                      data-bs-toggle="modal"
                      data-bs-target="#modalCombine"
                      onClick={() => handleModalOpen(a)}
                    >
                      <svg
                        className="SvgQuo"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <title>cash-check</title>
                        <path d="M3 6V18H13.32C13.1 17.33 13 16.66 13 16H7C7 14.9 6.11 14 5 14V10C6.11 10 7 9.11 7 8H17C17 9.11 17.9 10 19 10V10.06C19.67 10.06 20.34 10.18 21 10.4V6H3M12 9C10.3 9.03 9 10.3 9 12C9 13.7 10.3 14.94 12 15C12.38 15 12.77 14.92 13.14 14.77C13.41 13.67 13.86 12.63 14.97 11.61C14.85 10.28 13.59 8.97 12 9M21.63 12.27L17.76 16.17L16.41 14.8L15 16.22L17.75 19L23.03 13.68L21.63 12.27Z"></path>
                      </svg>
                    </button>
                  )}
                  <button
                    type="button"
                    className="SvgAnchor"
                    onClick={() => handleSubmit7(a)}
                  >
                    <svg
                      className="SvgPdf"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#203764"
                    >
                      <title>pdf-generate</title>
                      <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2M14 9V3.5L19.5 9H14M7 12H8.5C9.3 12 10 12.67 10 13.5S9.3 15 8.5 15H7V12M8.5 13.2H8V14.3H8.5C8.8 14.3 9 14.05 9 13.8C9 13.45 8.8 13.2 8.5 13.2M11 12H12V13H13V12H14V15H13V14H12V15H11V12M15 12H16.5C17.33 12 18 12.67 18 13.5S17.33 15 16.5 15H15V12M16.5 13.2H16V14.3H16.5C16.8 14.3 17 14.05 17 13.8C17 13.45 16.8 13.2 16.5 13.2Z" />
                    </svg>
                  </button>
                </div>
              </>
            );
          },
        });

        setColumns(generatedColumns);
        setData(rows);
      })
      .catch((error) => {
        console.error("Error fetching Debit Note:", error);
        toast.error(t("genericError"));
      });
  };
  useEffect(() => {
    billingNote();
  }, []);
  const deleteOrder = (id) => {
    console.log(id);
    MySwal.fire({
      title: t("areYouSure"),
      text: t("irreversible"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("delete"),
    }).then(async (result) => {
      console.log(result);
      if (result.isConfirmed) {
        try {
          const response = await axios.post(`${API_BASE_URL}/DeleteBN`, {
            bn_id: id,
          });

          // Handle response
          if (response.data.success === false) {
            // Set modal message and show modal
            setErrorMessage(response.data);
            setShow1(true); // open modal
          } else {
            getCombinedPayment();
            billingNote();
            toast.success(t("combinedPaymentDeleteSuccess"));
          }
        } catch (e) {
          toast.error(t("genericError"));
        }
      }
    });
  };

  useEffect(() => {
    const deposit = parseFloat(depositAvailableNew) || 0;
    const finalPayment = basePayment - deposit;
    setPaymentAmmountNew(finalPayment >= 0 ? finalPayment.toFixed(2) : 0);
  }, [depositAvailableNew, basePayment]);

  useEffect(() => {
    console.log("payableDATA:", payableDATA);
    console.log("roundingAmount:", roundingAmount);
    console.log("depositAvailable:", depositAvailable);

    setTotalPaymentAmount(
      (Number(payableDATA) || 0) - (Number(depositAvailable) || 0)
    );
  }, [payableDATA, depositAvailable]);
  const everyDataSet = async (a) => {
    console.log(a);
    setSingleFilterData(a);
    setHasUserChangedValues(false); // reset change flag
    setSinglePodId(a);
    setDepositAvailableNew(a?.Available_deposit);
    setBasePayment(a?.left_pay || 0); // set it once
    setVatNew(a?.Vat_payment || 0);
    setWhtNew(a?.wht_payment || 0);
    setRoundingNew1(a?.Rounding || 0);
    setTotalBeforText(a?.Total_Before_Tax || 0);
  };

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
  const submitPaymentData = async () => {
    if (!selectedPaymentDate) {
      setShow2(true);
      return;
    }
    if (!selectedPaymentChannel) {
      setShow2(true);
      return;
    }

    const paymentData = {
      vendor_id: singlePodId.Vendor,
      Payment_Date: selectedPaymentDate,
      Payment_Channel: selectedPaymentChannel,
      Bank_Fees: bankChargeAmount,
      Rounding: roundingAmount,
      available_Deposit: depositAvailable,
      Payment_Amount: paymentAmmountNew,
      Notes: paymentNotes,
      Bank_Ref: bankReference,
      CPN_id: singlePodId.ID,
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
      User_id: localStorage.getItem("id"),
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/POPayments`,
        paymentData
      );
      console.log("Payment data submitted successfully", response);
      getCombinedPayment();

      if (response?.data?.success) {
        // If success = true, show success toast
        setPaymentAmmountNew("");
        setProcesureResult("");
        setRoundingNew("");
        setSelectedPaymentDate(null);
        setSelectedPaymentChannel("");
        setBankReference("");
        setBankChargeAmount("0");
        setDepositAvailable("");
        setRoundingAmount("");
        setTotalPaymentAmount("");
        setPaymentNotes("");
        toast.success(response.data?.message);
        let modalElement = document.getElementById("modalCombine");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      } else {
        toast.warning(response.data.message);
      }
      getCombinedPayment();
      const updatedCollectPaymentId = response?.data.data;
      setCollectPaymentId(updatedCollectPaymentId);
    } catch (error) {
      console.error("Error submitting payment data", error);
    }
  };
  const inputRef = useRef(null); // Ref for input field

  const fetchReceiptData = async (bn_id, receiptID) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/receiptBNIDView`, {
        bn_id,
        RID: receiptID,
      });
      if (res.data.success) {
        setModalHead(res.data.head);
        setModalData(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching receipt data", error);
    }
  };

  const handleChange5 = async (field, value) => {
    // 1. Update UI immediately
    setPaymentForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    // 2. Ensure receiptID is present
    if (!receiptID) {
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
          RID: receiptID,
          [apiField]: payloadValue,
        }),
      });

      const result = await res.json();
      console.log(`Updated "${apiField}" for RID ${receiptID}`, result);

      // 6. Refresh data using correct bn_id
      fetchReceiptData(singlePodId?.ID, receiptID); // ensure singlePodId is correct
    } catch (error) {
      console.error("❌ Error updating field:", error);
    }
  };

  /*  const handleModalOpen = (a) => {
     everyDataSet(a);            // Your existing function
     fetchReceiptData(a.ID);  // Fetch and set modal API data
   }; */

  const handleModalOpen = async (a) => {
    try {
      // 1Set existing modal data
      everyDataSet(a);
      setRidData(a?.Reciept_ID);

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

  // billing pdf

  /*   const handleSubmit7 = async () => {
      try {
        // Fetch data from API
        const res = await fetch(`${API_BASE_URL}/PDFBillingNote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ BN: "119", External: "0", RID: "36" }),
        });
        const response = await res.json();
  
        const {
          Company_Address,
          section1,
          section2_label,
          section2_Values,
          section3_label,
          section3_Values,
          section4_label,
          section4_Values,
          section5_label,
          section5_Values,
          section6_label,
          section6_Values,
        } = response;
  
        const doc = new jsPDF("p", "mm", "a4");
        doc.addFileToVFS("NotoSansThai-Regular.ttf", NotoSansThaiRegular);
        doc.addFont("NotoSansThai-Regular.ttf", "NotoSansThai", "normal");
        doc.setFont("NotoSansThai");
  
        // Add Static Logo & Company Address
        const addLogoWithDetails = () => {
          // Static Logo
          doc.addImage(logo, "JPEG", 7, 5.7, 20, 20);
  
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
  
          let startY = 10;
          const textX = 30;
          const lineSpacing = 4.2;
  
          if (Company_Address?.Line_1) {
            doc.text(Company_Address.Line_1, textX, startY);
            startY += lineSpacing;
          }
          if (Company_Address?.Line_2) {
            doc.text(Company_Address.Line_2, textX, startY);
            startY += lineSpacing;
          }
          if (Company_Address?.Line_3) {
            const lines3 = doc.splitTextToSize(Company_Address.Line_3, 150);
            lines3.forEach((line) => {
              doc.text(line, textX, startY);
              startY += lineSpacing;
            });
          }
          if (Company_Address?.Line_4) {
            const lines4 = doc.splitTextToSize(Company_Address.Line_4, 150);
            lines4.forEach((line) => {
              doc.text(line, textX, startY);
              startY += lineSpacing;
            });
          }
  
          return startY;
        };
  
        const addressEndY = addLogoWithDetails();
        doc.setFillColor(32, 55, 100);
        const pageWidth = doc.internal.pageSize.width;
        const margin = 7;
        const usableWidth = pageWidth - margin * 2;
        const startYd = 27;
        const lineHeightd = 7;
        const maxWidthLabel = 42;
        const maxWidthValue = 60;
  
        // Section 1: Heading with background lines
        doc.rect(margin, startYd, usableWidth, 0.5, "FD");
        doc.rect(margin, startYd + lineHeightd, usableWidth, 0.5, "FD");
  
        const centerXd = pageWidth / 2;
        const centerYd = startYd + lineHeightd / 2;
        doc.setFontSize(14);
        doc.text(section1.Row1, centerXd, centerYd + 1.5, { align: "center" });
  
        // Section 2 & 3: Two-column layout
        doc.setFontSize(10);
        const halfWidth = usableWidth / 2;
  
        const leftLabelX = margin;
        const leftValueX = leftLabelX + maxWidthLabel + 2;
  
        const rightLabelX = margin + halfWidth;
        const rightValueX = rightLabelX + maxWidthLabel + 2;
  
        const lineHeight = 5;
        let currentY = startYd + 15;
  
        const maxRows = Math.max(
          Object.keys(section2_label).length,
          Object.keys(section3_label).length
        );
  
        for (let i = 1; i <= maxRows; i++) {
          const leftLabel = section2_label[`Row${i}`] || "";
          const leftValue = section2_Values[`Row${i}`] || "";
          const rightLabel = section3_label[`Row${i}`] || "";
          const rightValue = section3_Values[`Row${i}`] || "";
  
          const leftLabelLines = doc.splitTextToSize(leftLabel, maxWidthLabel);
          const leftValueLines = doc.splitTextToSize(leftValue, maxWidthValue);
          const rightLabelLines = doc.splitTextToSize(rightLabel, maxWidthLabel);
          const rightValueLines = doc.splitTextToSize(rightValue, maxWidthValue);
  
          const maxLines = Math.max(
            leftLabelLines.length,
            leftValueLines.length,
            rightLabelLines.length,
            rightValueLines.length
          );
  
          for (let j = 0; j < maxLines; j++) {
            if (leftLabelLines[j])
              doc.text(leftLabelLines[j], leftLabelX, currentY + j * lineHeight);
            if (leftValueLines[j])
              doc.text(leftValueLines[j], leftValueX, currentY + j * lineHeight);
            if (rightLabelLines[j])
              doc.text(
                rightLabelLines[j],
                rightLabelX,
                currentY + j * lineHeight
              );
            if (rightValueLines[j])
              doc.text(
                rightValueLines[j],
                rightValueX,
                currentY + j * lineHeight
              );
          }
  
          currentY += maxLines * lineHeight;
        }
  
        const tableHeaders = Object.values(section4_label);
        const tableRows = section4_Values.map((row) => Object.values(row));
  
        doc.autoTable({
          head: [tableHeaders],
          body: tableRows,
          startY: currentY,
          headStyles: {
            fillColor: "#203764",
            textColor: "#FFFFFF",
            halign: "center",
          },
          bodyStyles: { valign: "top" },
          styles: {
            overflow: "linebreak",
            textColor: "#000000",
            lineColor: "#203764",
            lineWidth: 0.1,
          },
          margin: { left: 7, right: 7 },
          tableWidth: "auto",
          columnStyles: {
            0: { halign: "center" },
            1: { halign: "left" },
            2: { halign: "left" },
            3: { halign: "right" },
            4: { halign: "right" },
            5: { halign: "right" },
            6: { halign: "right" },
            7: { halign: "right" },
          },
        });
  
        const finalY = doc.autoTable.previous.finalY;
        // Render Notes
        doc.setFont("helvetica", "bold");
        doc.text("Notes", 7, finalY + 5);
  
        doc.setFont("helvetica", "normal");
        const text = `Lorem Ipsum is simply dummy text of the printing and typesetting industry... Lorem Ipsum is simply dummy text of the printing and typesetting industry... Lorem Ipsum is simply dummy text of the printing and typesetting industry...Lorem Ipsum is simply dummy text of the printing and typesetting industry...Lorem Ipsum is simply dummy text of the printing and typesetting industry...Lorem Ipsum is simply dummy text of the printing and typesetting industry...Lorem Ipsum is simply dummy text of the printing and typesetting industry...Lorem Ipsum is simply dummy text of the printing and typesetting industry...Lorem Ipsum is simply dummy text of the printing and typesetting industry...Lorem Ipsum is simply dummy text of the printing and typesetting industry...`;
        const splitText = doc.splitTextToSize(text, usableWidth);
        const textStartY = finalY + 10;
        doc.text(splitText, 7, textStartY);
  
        // Calculate last Y after notes
        const lastY = textStartY + (splitText.length - 1) * lineHeight;
        doc.rect(7, lastY, pageWidth - 15, 0.5, "FD");
  
        // //  Section 5 starts AFTER Notes
        // const labelsAndValues = Object.keys(section5_label).map((key, index) => ({
        //   label: section5_label[key],
        //   value: section5_Values[`Row${index + 1}`],
        // }));
  
        // const startX = 7;
        // const colSpacing = 35;
        // const labelY = lastY + 5;   //  Start after notes
        // const valueY = labelY + 5;
  
        // labelsAndValues.forEach((item, idx) => {
        //   const x = startX + idx * colSpacing;
        //   doc.text(item.label, x, labelY);
        //   doc.text(item.value || "-", x, valueY);
        // });
  
        // Handle Notes or Section 6 dynamically
        // Handle Notes or Section 6 dynamically
        // Handle Notes (Dynamic) or Section 6
        let nextStartY = finalY + 5; // Start after table
  
        if (typeof section5_label === "string" && typeof section5_Values === "string") {
          // ✅ Case 1: Dynamic Notes present
          doc.setFont("helvetica", "bold");
          doc.text(section5_label, 7, nextStartY); // Example: "Notes"
          doc.setFont("helvetica", "normal");
  
          const notesY = nextStartY + 5;
          doc.text(section5_Values || "-", 7, notesY); // Notes from API (single line)
  
          // Draw separator line after notes
          const notesEndY = notesY + 5;
          doc.rect(7, notesEndY, pageWidth - 15, 0.5, "FD");
  
          // Move Y position for Section 6 after notes
          nextStartY = notesEndY + 8;
  
          // ✅ Render Section 6 (only if exists)
          if (section6_label && section6_Values) {
            const section6Data = Object.keys(section6_label).map((key, index) => ({
              label: section6_label[key],
              value: section6_Values[`Row${index + 1}`],
            }));
  
            const startX = 7;
            const colSpacing = 35;
            const labelY = nextStartY;
            const valueY = labelY + 5;
  
            section6Data.forEach((item, idx) => {
              const x = startX + idx * colSpacing;
              doc.text(item.label, x, labelY);
              doc.text(item.value || "-", x, valueY);
            });
          }
  
        } else if (typeof section5_label === "object" && typeof section5_Values === "object") {
          // ✅ Case 2: No Notes → Treat section5 as Section 6
          const section6Data = Object.keys(section5_label).map((key, index) => ({
            label: section5_label[key],
            value: section5_Values[`Row${index + 1}`],
          }));
  
          const startX = 7;
          const colSpacing = 35;
          const labelY = nextStartY;
          const valueY = labelY + 5;
  
          section6Data.forEach((item, idx) => {
            const x = startX + idx * colSpacing;
            doc.text(item.label, x, labelY);
            doc.text(item.value || "-", x, valueY);
          });
        }
  
  
        //  Page Numbers
        const addPageNumbers = () => {
          const pageCount = doc.internal.getNumberOfPages();
          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(`${i} out of ${pageCount}`, 185.2, 3.1);
          }
        };
        addPageNumbers();
        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        // Open the PDF in a new tab
        window.open(pdfUrl);
        // Save the PDF
  
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    };
   */

  const handleSubmit7 = async (a) => {
    try {
      // Fetch data from API
      const res = await fetch(`${API_BASE_URL}/PDFBillingNote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          BN: a.ID,
          External: "0",
          RID: a.Reciept_ID,
          LANG: 1,
        }),
      });
      const response = await res.json();

      const {
        Company_Address,
        section1,
        section2_label,
        section2_Values,
        section3_label,
        section3_Values,
        section4_label,
        section4_Values,
        section5_label,
        section5_Values,
        section6_label,
        section6_Values,
      } = response;

      const doc = new jsPDF("p", "mm", "a4");
      doc.addFileToVFS("NotoSansThai-Regular.ttf", NotoSansThaiRegular);
      doc.addFont("NotoSansThai-Regular.ttf", "NotoSansThai", "normal");
      doc.setFont("NotoSansThai");

      // Add Static Logo & Company Address
      const addLogoWithDetails = () => {
        doc.addImage(logo, "JPEG", 7, 5.7, 20, 20);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);

        let startY = 10;
        const textX = 30;
        const lineSpacing = 4.2;

        if (Company_Address?.Line_1) {
          doc.text(Company_Address.Line_1, textX, startY);
          startY += lineSpacing;
        }
        if (Company_Address?.Line_2) {
          doc.text(Company_Address.Line_2, textX, startY);
          startY += lineSpacing;
        }
        if (Company_Address?.Line_3) {
          const lines3 = doc.splitTextToSize(Company_Address.Line_3, 150);
          lines3.forEach((line) => {
            doc.text(line, textX, startY);
            startY += lineSpacing;
          });
        }
        if (Company_Address?.Line_4) {
          const lines4 = doc.splitTextToSize(Company_Address.Line_4, 150);
          lines4.forEach((line) => {
            doc.text(line, textX, startY);
            startY += lineSpacing;
          });
        }
        return startY;
      };

      const addressEndY = addLogoWithDetails();
      doc.setFillColor(32, 55, 100);
      const pageWidth = doc.internal.pageSize.width;
      const margin = 7;
      const usableWidth = pageWidth - margin * 2;
      const startYd = 27;
      const lineHeightd = 7;
      const maxWidthLabel = 42;
      const maxWidthValue = 60;

      // Section 1: Heading
      doc.rect(margin, startYd, usableWidth, 0.5, "FD");
      doc.rect(margin, startYd + lineHeightd, usableWidth, 0.5, "FD");
      const centerXd = pageWidth / 2;
      const centerYd = startYd + lineHeightd / 2;
      doc.setFontSize(14);
      doc.text(section1.Row1, centerXd, centerYd + 1.5, { align: "center" });

      // Section 2 & 3: Two-column layout
      doc.setFontSize(10);
      const halfWidth = usableWidth / 2;
      const leftLabelX = margin;
      const leftValueX = leftLabelX + maxWidthLabel + 2;
      const rightLabelX = margin + halfWidth;
      const rightValueX = rightLabelX + maxWidthLabel + 2;
      const lineHeight = 5;
      let currentY = startYd + 15;

      const maxRows = Math.max(
        Object.keys(section2_label).length,
        Object.keys(section3_label).length
      );

      for (let i = 1; i <= maxRows; i++) {
        const leftLabel = section2_label[`Row${i}`] || "";
        const leftValue = section2_Values[`Row${i}`] || "";
        const rightLabel = section3_label[`Row${i}`] || "";
        const rightValue = section3_Values[`Row${i}`] || "";

        const leftLabelLines = doc.splitTextToSize(leftLabel, maxWidthLabel);
        const leftValueLines = doc.splitTextToSize(leftValue, maxWidthValue);
        const rightLabelLines = doc.splitTextToSize(rightLabel, maxWidthLabel);
        const rightValueLines = doc.splitTextToSize(rightValue, maxWidthValue);

        const maxLines = Math.max(
          leftLabelLines.length,
          leftValueLines.length,
          rightLabelLines.length,
          rightValueLines.length
        );

        for (let j = 0; j < maxLines; j++) {
          if (leftLabelLines[j])
            doc.text(leftLabelLines[j], leftLabelX, currentY + j * lineHeight);
          if (leftValueLines[j])
            doc.text(leftValueLines[j], leftValueX, currentY + j * lineHeight);
          if (rightLabelLines[j])
            doc.text(
              rightLabelLines[j],
              rightLabelX,
              currentY + j * lineHeight
            );
          if (rightValueLines[j])
            doc.text(
              rightValueLines[j],
              rightValueX,
              currentY + j * lineHeight
            );
        }
        currentY += maxLines * lineHeight;
      }

      // Section 4: Table
      const tableHeaders = Object.values(section4_label);
      const tableRows = section4_Values.map((row) => Object.values(row));
      doc.autoTable({
        head: [tableHeaders],
        body: tableRows,
        startY: currentY,
        headStyles: {
          fillColor: "#203764",
          textColor: "#FFFFFF",
          halign: "center",
        },
        bodyStyles: { valign: "top" },
        styles: {
          overflow: "linebreak",
          textColor: "#000000",
          lineColor: "#203764",
          lineWidth: 0.1,
        },
        margin: { left: 7, right: 7 },
        tableWidth: "auto",
        columnStyles: {
          0: { halign: "center" },
          1: { halign: "left" },
          2: { halign: "left" },
          3: { halign: "right" },
          4: { halign: "right" },
          5: { halign: "right" },
          6: { halign: "right" },
          7: { halign: "right" },
        },
      });

      const finalY = doc.autoTable.previous.finalY;
      let nextStartY = finalY + 5;

      // ✅ Dynamic Notes or Section 6
      // Case 1: Notes exist in object format (Col1)
      if (
        typeof section5_label === "object" &&
        typeof section5_Values === "object" &&
        section5_label.Col1?.toLowerCase().includes("notes")
      ) {
        // Render Notes
        doc.setFont("helvetica", "bold");
        doc.text(section5_label.Col1, 7, nextStartY);
        doc.setFont("helvetica", "normal");
        const notesY = nextStartY + 5;
        doc.text(section5_Values.Col1 || "-", 7, notesY);
        const notesEndY = notesY + 5;
        doc.rect(7, notesEndY, pageWidth - 15, 0.5, "FD");
        nextStartY = notesEndY + 8;

        // Continue to Section 6
        if (section6_label && section6_Values) {
          const section6Data = Object.keys(section6_label).map(
            (key, index) => ({
              label: section6_label[key],
              value: section6_Values[`Row${index + 1}`],
            })
          );
          const startX = 7;
          const colSpacing = 35;
          const labelY = nextStartY;
          const valueY = labelY + 5;
          section6Data.forEach((item, idx) => {
            const x = startX + idx * colSpacing;
            doc.text(item.label, x, labelY);
            doc.text(item.value || "-", x, valueY);
          });
        }
      }
      // Case 2: No Notes → Treat section5 as section6
      else if (
        typeof section5_label === "object" &&
        typeof section5_Values === "object"
      ) {
        const section6Data = Object.keys(section5_label).map((key, index) => ({
          label: section5_label[key],
          value: section5_Values[`Row${index + 1}`],
        }));
        const startX = 7;
        const colSpacing = 35;
        const labelY = nextStartY;
        const valueY = labelY + 5;
        section6Data.forEach((item, idx) => {
          const x = startX + idx * colSpacing;
          doc.text(item.label, x, labelY);
          doc.text(item.value || "-", x, valueY);
        });
      }

      // Page Numbers
      const addPageNumbers = () => {
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.text(`${i} out of ${pageCount}`, 185.2, 3.1);
        }
      };
      addPageNumbers();

      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      // window.open(pdfUrl);
      await uploadPDF5(pdfBlob, a);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
  };
  const uploadPDF5 = async (pdfBlob, a) => {
    // Generate a unique date-time string
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;

    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${a?.COL1 || "default"}_Billing_Note_${dateTime}.pdf`
    );

    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${a?.COL1 || "default"}_Billing_Note_${dateTime}.pdf`
        );
      } else {
        console.log("Failed to upload PDF");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };

  return (
    <>
      <Card
        title={t("billingNoteManagement")}
        endElement={
          <button
            type="button"
            onClick={() => navigate("/billingNoteCreate")}
            className="btn button btn-info"
          >
            {t("create")}
          </button>
        }
      >
        <TableView columns={columns} data={data} />
      </Card>

      {/* paymentIcon */}

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
                            <TextField {...params} placeholder="Fx" />
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
                onClick={submitPaymentData2}
                className="btn btn-primary"
              >
                {t("submit")}
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
                  {"Payment Channel is Required"}
                </p>
              ) : (
                ""
              )}

              <div className="closeBtnRece">
                <button onClick={closeIcon2}>{"close"}</button>
              </div>
            </div>
          </div>
          <div
            className="modal-footer"
            style={{ backgroundColor: color ? "#2f423c" : "" }}
          ></div>
        </div>
      </Modal>
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
              {t("billingNote")}
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
                className="mt-0 pt-0"
              >
                {errorMessage?.Message_EN}
              </p>
              <p
                style={{
                  backgroundColor: color ? "" : "#631f37",
                }}
                className="mt-0 pt-0"
              >
                {errorMessage?.Message_TH}
              </p>

              <div className="closeBtnRece">
                <button onClick={closeIcon1}>{t("close")}</button>
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

export default BillingNote;
