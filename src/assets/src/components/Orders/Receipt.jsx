import React, { useMemo, useEffect, useState, useRef } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate, useLocation } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { ComboBox } from "../combobox";
import { Button, Modal } from "react-bootstrap";
import { Card } from "../../card";
import { TableView } from "../table";
import axios from "../../Url/Api";
import { API_BASE_URL } from "../../Url/Url";
import { API_IMAGE_URL } from "../../Url/Url";
import logo from "../../assets/logoNew.png";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ReactApexChart from "react-apexcharts";
import { toast } from "react-toastify";
import MySwal from "../../swal";
import NotoSansThaiRegular from "../../assets/fonts/NotoSansThai-Regular-normal";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import moment from "moment";
const Receipt = () => {
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
  const [formData, setFormData] = useState({
    clientId: "",
    paymentDate: null,
    dueDate: null,
  });
  const [exchangeRate3, setExchangeRate3] = useState(false);
  const handleAgreedPricingChange9 = (e) => {
    setExchangeRate3(e.target.checked);
  };
  const clearData = () => {
    setSelectedInvoice("Client");
  };
  const [hasUserChangedValues, setHasUserChangedValues] = useState(false);
  const [basePayment, setBasePayment] = useState(0);
  const [columns, setColumns] = useState([]);
  const [consigneeId, setConsigneeId] = useState("");
  const [data, setData] = useState([]);
  const [notes2, setNotes2] = useState("");
  const [singleCpnId, setSingleCpnId] = useState("");
  const [venderId, setVenderId] = useState("");
  const [amountToPayNew, setAmountToPayNew] = useState("");
  const [depositUsedNew, newDepositUsedNew] = useState("");
  const [vatNew, setVatNew] = useState("");
  const [whtNew, setWhtNew] = useState("");
  const [receptId, setReceptId] = useState(null);

  const [leftRoundingNew, setLeftRoundingNew] = useState("");
  const [dataShow, setDataShow] = useState("");
  const [roundingNew, setRoundingNew] = useState("0");
  const [roundingNew1, setRoundingNew1] = useState("0");
  const [totalBeforText, setTotalBeforText] = useState("0");
  const [procesureResult, setProcesureResult] = useState("");
  const [amountToPay, setAmountToPay] = useState({});
  const [responceId, setResponceId] = useState("");
  const [singlePodId, setSinglePodId] = useState("");
  const [podId, setPodId] = useState("");
  const [numericvalueofdata, setNumericvalueofdata] = useState("");
  const [stock1, setStock1] = useState("");
  const [show1, setShow1] = useState(false);
  const [selectedRows, setSelectedRows] = useState({});
  const [paidAmounts1, setPaidAmounts1] = useState({});
  const [units, setUnits] = useState({});
  const [amounts, setAmounts] = useState({});
  const [roundingData, setRoundingData] = useState("");
  const [VATTotal, setVATTotal] = useState(0);
  const [WHTTotal, setWHTTotal] = useState(0);
  const [TotalBeforeTaxTotal, setTotalBeforeTaxTotal] = useState(0);
  const [modalErrorMsg, setModalErrorMsg] = useState("");
  const [tableSummary, setTableSummary] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); // State to store date
  const [clientIdSet, setClientIdSet] = useState("");
  const [consigneeIdSet, setConsigneeIdSet] = useState("");
  const [paymentDate1, setPaymentDate1] = useState("");
  const [clientPaymentRef1, setClientPaymentRef1] = useState("");
  const [paymentChannel1, setPaymentChannel1] = useState("");
  const [bankRef1, setBankRef1] = useState("");
  const [fxPayment1, setFxPayment1] = useState("");
  const [fx1, setFx1] = useState("");
  const [fxRate1, setFxRate1] = useState("");
  const [intermittentBankCharges1, setIntermittentBankCharges1] = useState("");
  const [localBankCharges1, setLocalBankCharges1] = useState("");
  const [thbPaid1, setThbPaid1] = useState("");
  const [lossGainExchange1, setLossGainExchange1] = useState("");
  const [notes1, setNotes1] = useState("");

  const [clientId, setClientId] = useState("");
  const [clientId2, setClientId2] = useState("");
  console.log(clientId2);
  const { data: clients } = useQuery("getAllVendor");
  const { data: unit } = useQuery("getAllUnit");

  const { data: clientsData } = useQuery("getClientDataAsOptions");
  const { data: clientsList } = useQuery("getClientDataAsOptions");

  const { data: paymentChannle } = useQuery("PaymentChannela");
  const { data: currency } = useQuery("getCurrency");
  useEffect(() => {
    if (currency) {
      console.log("Currency API Data:", currency);
    }
  }, [currency]);
  const [purchaseStatistic, setPurchaseStatistic] = useState([]);
  const [claimTable, setClaimTable] = useState([]);
  const [claimPageData, setClaimPageData] = useState("");
  const [lossGainOnExchangeRate1, setLossGainOnExchangeRate1] = useState("");
  const [singleDataShow, setSingleDataShow] = useState("");
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);

  console.log(claimPageData);
  const [purchaseStatistic1, setPurchaseStatistic1] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  console.log(clientId);
  const [series, setSeries] = useState([0, 0, 0]);
  const [series1, setSeries1] = useState([0, 0, 0]);
  const [thbPaid, setThbPaid] = useState(0);
  // console.log(mode);
  const [selectedInvoice, setSelectedInvoice] = useState("Client");
  const handleRadioChange = (event) => {
    setSelectedInvoice(event.target.value);
  };
  console.log(series);
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (event) => {
    setStatus(event.target.value);
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
  console.log(purchaseStatistic);
  const [paymentTable1, setPaymentTable1] = useState([] || "");
  const [paymentTableVender, setPaymentTableVender] = useState([] || "");

  const [checkedRows, setCheckedRows] = useState([]); // Track checked rows
  const [paymentTable2, setPaymentTable2] = useState([] || "");

  const [packagingTableData, setPackagingTableData] = useState([] || "");
  const [consignees, setConsignees] = useState([]);

  const [status, setStatus] = useState("");
  const [checkedItems, setCheckedItems] = useState({});
  const [paidAmounts, setPaidAmounts] = useState({});
  const [paymentDate, setPaymentDate] = useState("");
  const [clientPaymentRef, setClientPaymentRef] = useState("");
  const [paymentChannel, setPaymentChannel] = useState("");
  const [bankRef, setBankRef] = useState("");
  const [fxPayment, setFxPayment] = useState();
  const [fxId, setFxId] = useState("1");
  const [intermittentBankCharges, setIntermittentBankCharges] = useState("0");
  const [fxRate, setFxRate] = useState("1");
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [collectPaymentId, setCollectPaymentId] = useState("");
  const [localBankCharges, setLocalBankCharges] = useState("0");
  const [lossGainOnExchangeRate, setLossGainOnExchangeRate] = useState("0");
  const [thbReceived, setThbReceived] = useState("");
  const [selectedPaymentDate, setSelectedPaymentDate] = useState(null);
  const [selectedPaymentChannel, setSelectedPaymentChannel] = useState("");
  const [bankReference, setBankReference] = useState("");
  const [bankChargeAmount, setBankChargeAmount] = useState("0");
  const [depositAvailable, setDepositAvailable] = useState("");
  const [paymentAmmountNew, setPaymentAmmountNew] = useState("");
  const [depositAvailableNew, setDepositAvailableNew] = useState("");
  const [roundingAmount, setRoundingAmount] = useState("0");
  const [totalPaymentAmount, setTotalPaymentAmount] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [payableDATA, setPayableData] = useState("");
  const [pdfName, setPdfName] = useState("");
  // upload image
  const [invImage, setInvImage] = useState(null);
  const fileInputRef = useRef(null); // Reference to the input field
  const handleFileChangeInv = (event) => {
    const fileInv = event.target.files[0];

    if (!fileInv) return;
    const fileType = fileInv.type;

    if (fileType.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvImage(reader.result);
        setPdfName(""); // clear pdf name
      };
      reader.readAsDataURL(fileInv);
    } else if (fileType === "application/pdf") {
      setPdfName(fileInv.name);
      setInvImage(null); // clear image
    } else {
      alert(t("invalidFile"));
    }
  };
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

  const handleChange5 = (field, value) => {
    setPaymentForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // const orderData1 = () => {
  //   axios
  //     .get(`${API_BASE_URL}/getPurchaseOrder`, {
  //       params: {
  //         status,
  //       },
  //     })
  //     .then((res) => {
  //       setData(res.data.data || []);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching orders:", error);
  //     });
  // };
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };
  const paymentTable3 = () => {
    axios
      .post(`${API_BASE_URL}/RecordCommission`, {
        client_id: clientId,
      })
      .then((res) => {
        console.log(res);
        setPaymentTable2(res.data.data);
      })
      .catch((error) => {
        console.log("There was an error fetching the data!", error);
      });
  };
  const closeIcon1 = () => {
    setShow1(false);
    // navigate("/purchase_orders");
  };
  const closeIcon2 = () => {
    setShow2(false);
    // navigate("/purchase_orders");
  };
  const closeIcon3 = () => {
    setShow3(false);
    // navigate("/purchase_orders");
  };

  const handleClose1 = () => setShow1(false);
  const handleClose2 = () => setShow2(false);
  const handleClose3 = () => setShow3(false);

  useEffect(() => {
    if (clientId) {
      paymentTable3();
    }
  }, [clientId]);

  const paymentTable5 = () => {
    axios
      .post(`${API_BASE_URL}/getInvoiceByClientID`, {
        Client_id: clientId,
        Consignee_id: consigneeId,
      })
      .then((res) => {
        console.log(res);
        setPaymentTable1(res.data.data);
        // setData(res.data.data);
      })
      .catch((error) => {
        console.log("There was an error fetching the data!", error);
      });
  };
  useEffect(() => {
    if (clientId && consigneeId) {
      paymentTable5();
    }
  }, [clientId, consigneeId]);

  useEffect(() => {
    if (claimTable && Array.isArray(claimTable)) {
      const initialPaidAmounts = {};
      const initialUnits = {};
      const initialAmounts = {};

      claimTable.forEach((item) => {
        initialPaidAmounts[item.po_id] = item.paidAmount || "";
        initialUnits[item.po_id] = item.unit || "";
        initialAmounts[item.po_id] = item.amount || "";
      });

      setPaidAmounts1(initialPaidAmounts);
      setUnits(initialUnits);
      setAmounts(initialAmounts);
    }

    console.log(paidAmounts1);
    console.log(units);
    console.log(amounts);
  }, [claimTable]);
  const handleAmountChange1 = (pod_id, value) => {
    setAmounts((prev) => ({
      ...prev,
      [pod_id]: value,
    }));
  };

  useEffect(() => {
    // Initialize state with Payable values
    const initialAmounts = paymentTableVender.reduce((acc, child, index) => {
      acc[index] = child.Total_Before_Tax - child.Payment_amount;
      return acc;
    }, {});
    setAmountToPay(initialAmounts);
  }, [paymentTableVender]);

  const handleAmountChange2 = (index, value) => {
    setAmountToPay((prev) => {
      const updatedAmounts = {
        ...prev,
        [index]: value, // Update specific index
      };

      // Recalculate VAT & WHT dynamically after updating amountToPay
      calculateCheckedAmount(childChecked, updatedAmounts);

      return updatedAmounts;
    });
  };

  const handlePaidAmountChange1 = (pod_id, value) => {
    setPaidAmounts1((prev) => ({
      ...prev,
      [pod_id]: value,
    }));
  };
  const handleUnitChange = (pod_id, value) => {
    console.log("Unit changed:", pod_id, value);
    setUnits((prev) => ({
      ...prev,
      [pod_id]: value,
    }));
  };
  const handleModalClose = () => {
    setClientId("");
    setFromDate("");
    setToDate("");
    setExchangeRate3(false);
  };

  const [buttonClicked, setButtonClicked] = React.useState(false);
  const location = useLocation();
  const [dropdownItems, setDropdownItems] = useState([]);
  const { from } = location.state || {};
  console.log(from);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [stock, setStock] = useState("");
  const [color, setColor] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [details, setDetails] = React.useState([]);
  const getDetils = () => {
    if (from?.po_id) {
      axios
        .get(`${API_BASE_URL}/getPurchaseOrderDetails?po_id=${from?.po_id}`)
        .then((response) => {
          console.log(response);
          setDetails(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const closeIcon = () => {
    setButtonClicked(false);
    setShow(false);
    navigate("/purchase_orders");
  };

  const fetchConsignees1 = async () => {
    console.log(clientIdSet);
    try {
      const response = await axios.post(`${API_BASE_URL}/getClientConsignee`, {
        client_id: clientIdSet,
      });
      console.log(response);
      setConsignees(response.data.data);
    } catch (error) {
      console.error("Error fetching consignees:", error);
    }
  };

  useEffect(() => {
    if (clientIdSet) {
      fetchConsignees1();
    }
  }, [clientIdSet]);

  const fetchConsignees = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/getClientConsignee`, {
        client_id: clientId,
      });
      setConsignees(response.data.data);
    } catch (error) {
      console.error("Error fetching consignees:", error);
    }
  };
  useEffect(() => {
    if (clientId) {
      fetchConsignees();
    }
  }, [clientId]);
  const [state, setState] = React.useState({
    po_id: from?.po_id,
    vendor_id: from?.vendor_id,
    vendor_name: from?.vendor_name,
    user: localStorage.getItem("id"),
    created: from?.created || "0000-00-00",
    // `${new Date().getFullYear()}-${new Date().getMonth()}${1}-${new Date().getDate()}`,
    supplier_invoice_number: from?.supplier_invoice_number,
    supplier_invoice_date: from?.supplier_invoice_date,
    user_id: localStorage.getItem("id"),
  });
  const [formsValue, setFormsvalue] = React.useState([
    {
      pod_type_id: 0,
      unit_count_id: 0,
      POD_Selection: 0,
      pod_quantity: 0,
      pod_price: 0,
      pod_vat: 0,
      pod_wht_id: 0,
      pod_crate: 0,
    },
  ]);
  const dataAllClearVender = () => {
    getPurchaseOrder();

    setFormData("");
    setClientId2([]);
    setPaymentTableVender([]);
    setParentChecked(false);
    setRoundingData(0);
    setVATTotal(0);
    setWHTTotal(0);
    setTotalBeforeTaxTotal(0);
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
  const handleChangeCreate = (event) => {
    const { name, value } = event.target;
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const cancelOrder = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/CancelPurchaseOrder`, {
        po_id: podId, // Fixed incorrect syntax (wrapped in an object)
      });
      console.log(response);
      toast.success(t("cancelOrderSuccess"), {
        autoClose: 5000,
        theme: "colored",
      });

      navigate("/purchase_orders"); // Navigate after success
    } catch (e) {
      console.error("Error canceling order:", e); // Debugging
      toast.error(t("errorOccurred"), {
        autoClose: 5000,
        theme: "colored",
      });
    }
  };

  // create page end
  // Optionally call the API on component mount or when the status changes

  const update = async (e) => {
    // if (buttonClicked) {
    //   return;
    // }
    setButtonClicked(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/${"addPurchaseOrder"}`,
        state
      );
      console.log(response);
      setStock(response?.data);
      setFormsvalue([
        {
          pod_type_id: 0,
          unit_count_id: 0,
          POD_Selection: 0,
          pod_quantity: 0,
          pod_price: 0,
          pod_vat: 0,
          pod_wht_id: 0,
          pod_crate: 0,
        },
      ]);
      setState((prevState) => ({
        ...prevState, // Preserve previous data
        po_id: response.data?.po_id || from?.po_id || prevState.po_id,
        vendor_id: prevState.vendor_id, // Preserve other fields
        created: prevState.created,
        supplier_invoice_number: prevState.supplier_invoice_number,
        supplier_invoice_date: prevState.supplier_invoice_date,
        rounding: prevState.rounding,
      }));

      if (response.status === 200) {
        if (response.data.success) {
          // Close only the specific modal
          // const modalElement = document.getElementById("exampleModalCreate");
          // if (modalElement) {
          //     const modalInstance = bootstrap.Modal.getInstance(modalElement);
          //     if (modalInstance) {
          //         modalInstance.hide();

          //     }

          // }
          setModalOne(true);
          const id = response.data?.po_id || from?.po_id;
          setPodId(response?.data?.po_id);

          toast.success(t("createPO"), {
            autoClose: 5000,
            theme: "colored",
          });
        } else {
          setShow(true);
        }
      }
    } catch (e) {
      setButtonClicked(false);
      toast.error(t("errorOccurred"), {
        autoClose: 5000,
        theme: "colored",
      });
    }
  };
  useEffect(() => {
    if (status !== "") {
      orderData1();
    }
  }, [status]);
  const handleChange1 = (event) => {
    setStatus(event.target.value);
  };

  const handleLossGainChange = (e) => {
    const value = e.target.value || 0;
    setThbPaid(value);
  };
  const getOrdersDetails = () => {
    axios
      .get(`${API_BASE_URL}/PurchaseStatistics`)
      .then((response) => {
        console.log(response);
        setPurchaseStatistic(response.data.Top_payable_accounts);
        setPurchaseStatistic1(response.data.All_Payable);
        const pieChart1 = response.data.All_Payable;
        setSeries1([
          parseFloat(pieChart1["@packaging_Payable"].replace(/,/g, "")),
          parseFloat(pieChart1["@produce_Payable"].replace(/,/g, "")),
          parseFloat(pieChart1["@Freight_Payable"].replace(/,/g, "")),
        ]);
        const pieChart = response.data.pie_chart;
        setSeries([
          parseFloat(pieChart["@packaging"].replace(/,/g, "")),
          parseFloat(pieChart["@produce"].replace(/,/g, "")),
          parseFloat(pieChart["@Freight"].replace(/,/g, "")),
        ]);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const formatTwoDecimal = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const getAllPackaging = () => {
    axios
      .get(`${API_BASE_URL}/PurchaseOrderPackagingPayable`)
      .then((response) => {
        console.log(response);
        setPackagingTableData(response?.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    getOrdersDetails();
    getAllPackaging();
  }, []);

  const handleLossGainChange1 = (e) => {
    const value = e.target.value; // Parse input or fallback to 0
    setLossGainOnExchangeRate(value);
    // Recalculate THB Paid
    const thbPaidValue = fxPayment - value; // Ensure calculations are clear
    setThbPaid(thbPaidValue); // Update THB Paid value
  };
  const everyDataSet1 = (a) => {
    console.log(a);

    axios
      .get(`${API_BASE_URL}/getPurchaseOrderDetails?po_id=${responceId}`)
      .then((response) => {
        console.log(response);
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
    everyDataSet1();
  }, [responceId]);

  const everyDataSet = async (a) => {
    setSinglePodId(a);
  };

  useEffect(() => {
    console.log("payableDATA:", payableDATA);
    console.log("roundingAmount:", roundingAmount);
    console.log("depositAvailable:", depositAvailable);
    setTotalPaymentAmount(
      (Number(payableDATA) || 0) - (Number(depositAvailable) || 0)
    );
  }, [payableDATA, depositAvailable]);
  const claimDetails = async (po_id, a) => {
    console.log(a);
    setClaimPageData(a);

    try {
      const accessResponse = await axios.post(
        `${API_BASE_URL}/Checkeaccessfile`,
        {
          id: a.PO_ID,

          accesstype: 1, // Mark as in use
        }
      );
      console.log(accessResponse);
      // Assuming the API returns something like { success: true } or status code 200
      if (accessResponse?.data?.success) {
        const response = await axios.post(`${API_BASE_URL}/purchaseOrderView`, {
          po_id: po_id,
        });

        setClaimTable(response.data.data);

        // Manually open the modal
        const modal = new bootstrap.Modal(
          document.getElementById("modalClaim")
        );
        modal.show();
      } else {
        toast.warning(accessResponse?.data?.message);
      }
    } catch (error) {
      console.error("Error fetching statement:", error);
      toast.error(t("fileAccessError"), {
        autoClose: 5000,
        theme: "colored",
      });
    }
  };

  const handleRoundingChange = (e) => {
    let value = e.target.value;

    if (value === "") {
      setRoundingData("");
      return;
    }

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

  const handleRoundingBlur = (e) => {
    // Reset to 0 if input is empty or only "-" on blur
    if (e.target.value === "" || e.target.value === "-") {
      setRoundingData(0);
    }
  };
  useEffect(() => {
    // Ensure THB Paid and Loss/Gain stay in sync
    const updatedLossGain = fxPayment - thbPaid;
    setLossGainOnExchangeRate(updatedLossGain);
  }, [fxPayment]);
  // const navigate = useNavigate();
  // const purchseView = () => {
  // 	navigate("/purchaseview")

  const handleSubmit = async () => {
    const payload = {
      Vendor_ID: clientId, // Use selected client_id
      From_date: fromDate,
      To_date: toDate,
      Chronological: exchangeRate3 ? 1 : 0,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/PurchaseVendorStatement`,
        payload
      );

      console.log(response);

      const labels = response?.data?.section5_Labels || {};
      const tableData = response?.data?.TableData || [];
      const headers = Object.values(labels);

      // Extract the label keys (Col1, Col2, ...)
      const keys = Object.keys(labels);

      // Format date helper
      const isDate = (val) =>
        typeof val === "string" && /^\d{4}-\d{2}-\d{2}T/.test(val);
      const formatDate = (val) => {
        const date = new Date(val);
        return `${date.getDate().toString().padStart(2, "0")}-${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${date.getFullYear().toString().slice(2)}`;
      };

      // Prepare rows
      const rows = tableData.map((rowItem) =>
        keys.map((key) => {
          const val = rowItem[key];
          if (isDate(val)) {
            return formatDate(val);
          }
          return val !== null && val !== undefined ? val : "";
        })
      );
      setClientId("");
      let modalElement = document.getElementById("exampleModal2");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
        const doc = new jsPDF("landscape");

        doc.addFileToVFS("NotoSansThai-Regular.ttf", NotoSansThaiRegular); // Load the font
        doc.addFont("NotoSansThai-Regular.ttf", "NotoSansThai", "normal"); // Register the font
        const addLogoWithDetails = async () => {
          const imgData = logo;
          doc.addImage(imgData, "JPEG", 7, 5.7, 20, 20);
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text(`${response?.data?.Company_Address?.Line_1}`, 30, 10);
          doc.text(`${response?.data?.Company_Address?.Line_2}`, 30, 14);
          const longTextOne = `${response?.data?.Company_Address?.Line_3}`;
          const maxWidthOne = 59;
          const linesOne = doc.splitTextToSize(longTextOne, maxWidthOne);
          let startXOne = 30;
          let startYOne = 18;
          linesOne.forEach((lineOne, index) => {
            doc.text(lineOne, startXOne, startYOne + index * 4.2); // Adjust the line height (10) as needed
          });
          // adddress
          doc.setFontSize(17);
          doc.setTextColor(0, 0, 0);
          doc.text(`Statement`, 140, 11.5);
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(0, 0, 0);
          const sectionLabels = response?.data?.Section1_Labels || {};
          const sectionValues = response?.data?.section1_Values || {};
          doc.text(`${sectionLabels.Row1}`, 252, 9);
          doc.text(`${sectionLabels.Row2}`, 252, 13);
          doc.text(`${sectionLabels.Row3}`, 252, 17);
          doc.text(`${sectionLabels.Row4}`, 252, 21);

          doc.text(`${sectionValues.Row1}`, 272.5, 9);
          doc.text(`${sectionValues.Row2}`, 272, 13);
          doc.text(`${formatDate(sectionValues.Row3)}`, 272, 17);
          doc.text(`${sectionValues.Row4}`, 272, 21);
        };

        doc.setFillColor(32, 55, 100);
        doc.rect(7, 27, doc.internal.pageSize.width - 15, 0.5, "FD");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text("Invoice to", 7, 32);
        // doc.text("Consignee Details", 216.5, 32);
        doc.setFillColor(32, 55, 100);
        doc.setFontSize(11);
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
          return startY + lines.length * lineHeight; // Return the new Y position after rendering the text
        }

        // Common starting Y position
        let startY = 36.5;

        // First set of texts (Client details)
        const maxWidth1 = 72;
        const startX1 = 7;
        const lineHeight1 = 4.2;

        const longText1_1 = `${
          response.data.section2_Values?.Row1
            ? response.data.section2_Values?.Row1
            : ""
        }`;
        doc.setFont("helvetica", "normal");
        const longText1_2 = `${
          response.data.section2_Values?.Row2
            ? response.data.section2_Values?.Row2
            : ""
        }`;
        const longText1_3 = `${
          response.data.section2_Values?.Row3
            ? response.data.section2_Values?.Row3
            : ""
        }`;
        const longText1_4 = `${
          response.data.section2_Values?.Row4
            ? response.data.section2_Values?.Row4
            : ""
        }`;
        const longText1_5 = `${
          response.data.section2_Values?.Row5
            ? response.data.section2_Values?.Row5
            : ""
        }`;

        // Render client details
        doc.setFont("NotoSansThai"); // Set the font to use
        startY = renderWrappedText(
          doc,
          longText1_1,
          startX1,
          startY,
          maxWidth1,
          lineHeight1
        );

        doc.setFontSize(10);
        startY = renderWrappedText(
          doc,
          longText1_2,
          startX1,
          startY,
          maxWidth1,
          lineHeight1
        );
        startY = renderWrappedText(
          doc,
          longText1_3,
          startX1,
          startY,
          maxWidth1,
          lineHeight1
        );
        startY = renderWrappedText(
          doc,
          longText1_4,
          startX1,
          startY,
          maxWidth1,
          lineHeight1
        );
        startY = renderWrappedText(
          doc,
          longText1_5,
          startX1,
          startY,
          maxWidth1,
          lineHeight1
        );

        const formatterNg = new Intl.NumberFormat("en-US", {
          style: "decimal",
          minimumFractionDigits: 3,
        });
        const formatterNo = new Intl.NumberFormat("en-US", {
          style: "decimal",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(
          `${response?.data.section3_Values["Pre Statement"]}`,
          7,
          startY + 0.5
        );
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");

        doc.text(
          `${response?.data.section4_Labels?.Col1 || ""}`,
          7,
          startY + 5
        );
        doc.text(
          `${response?.data.section4_Values?.Col1 || ""}`,
          22,
          startY + 5
        );
        doc.text(
          `${response?.data.section4_Labels?.Col2 || ""}`,
          54,
          startY + 5
        );
        doc.text(
          `${response?.data.section4_Values?.Col2 || ""}`,
          67,
          startY + 5
        );
        doc.text(
          `${response?.data.section4_Labels?.Col3 || ""}`,
          96,
          startY + 5
        );
        doc.text(
          `${response?.data.section4_Values?.Col3 || ""}`,
          115,
          startY + 5
        );
        doc.text(
          `${response?.data.section4_Labels?.Col4 || ""}`,
          146,
          startY + 5
        );
        doc.text(
          `${response?.data.section4_Values?.Col4 || ""}`,
          158,
          startY + 5
        );
        doc.text(
          `${response?.data.section4_Labels?.Col5 || ""}`,
          188,
          startY + 5
        );
        doc.text(
          `${response?.data.section4_Values?.Col5 || ""}`,
          206,
          startY + 5
        );
        doc.text(
          `${response?.data.section4_Labels?.Col6 || ""}`,
          238,
          startY + 5
        );
        doc.text(
          `${response?.data.section4_Values?.Col6 || ""}`,
          258,
          startY + 5
        );
        doc.text(
          `${response?.data.section4_Labels?.Col7 || ""}`,
          7,
          startY + 10
        );
        doc.text(
          `${response?.data.section4_Values?.Col7 || ""}`,
          22,
          startY + 10
        );
        await addLogoWithDetails();
        let yTop = startY + 13;

        doc.autoTable({
          head: [headers],
          body: rows,
          startY: yTop,
          headStyles: {
            fillColor: "#203764",
            textColor: "#FFFFFF",
            halign: "center",
          },
          bodyStyles: {
            valign: "top",
          },
          styles: {
            overflow: "linebreak",
            textColor: "#000000",
            cellWidth: "wrap",
            valign: "middle",
            lineWidth: 0.1,
            lineColor: "#203764",
          },
          margin: {
            left: 7,
            right: 7,
          },
          tableWidth: "auto", // Adjust to ensure the table fits within the page
          columnStyles: {
            0: { halign: "left", cellWidth: 22 },
            1: { halign: "left", cellWidth: 78, overflow: "linebreak" },
            2: { halign: "left", cellWidth: 23, overflow: "linebreak" },
            3: { halign: "center", cellWidth: 30 },
            4: { halign: "right", cellWidth: 30 },
            5: { halign: "right", cellWidth: 35 },
            6: { halign: "right", cellWidth: 36, overflow: "linebreak" },
            7: {
              halign: "right",
              cellWidth: 30,
              overflow: "linebreak",
              font: "NotoSansThai",
            },
          },
        });

        yTop = doc.autoTable.previous.finalY + 1;
        const finalY = doc.autoTable.previous.finalY + 4;
        // middle part

        const valueWidth = 20; // Set the fixed width for the value column

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);

        // Invoices
        doc.text(`${response?.data.section6_Labels.Row1}`, 75, finalY + 1);
        doc.text(
          `${response?.data.section6_Values.Row1 || ""}`,
          105 +
            valueWidth -
            doc.getTextWidth(`${response?.data.section6_Values.Row1 || ""}`),
          finalY + 1
        );

        // Claims
        doc.text(`${response?.data.section6_Labels.Row2}`, 75, finalY + 5);
        doc.text(
          `${response?.data.section6_Values.Row2 || ""}`,
          105 +
            valueWidth -
            doc.getTextWidth(`${response?.data.section6_Values.Row2 || ""}`),
          finalY + 5
        );

        // Payments
        doc.text(`${response?.data.section6_Labels.Row3}`, 75, finalY + 9);
        doc.text(
          `${response?.data.section6_Values.Row3 || ""}`,
          105 +
            valueWidth -
            doc.getTextWidth(`${response?.data.section6_Values.Row3 || ""}`),
          finalY + 9
        );
        // new
        doc.text(`${response?.data.section6_Labels.Row7}`, 75, finalY + 13);
        doc.text(
          `${response?.data.section6_Values.Row7 || ""}`,
          105 +
            valueWidth -
            doc.getTextWidth(`${response?.data.section6_Values.Row7 || ""}`),
          finalY + 13
        );

        doc.text(`${response?.data.section6_Labels.Row5}`, 75, finalY + 17);
        doc.text(
          `${response?.data.section6_Values.Row5 || ""}`,
          105 +
            valueWidth -
            doc.getTextWidth(`${response?.data.section6_Values.Row5 || ""}`),
          finalY + 17
        );

        doc.text(`${response?.data.section6_Labels.Row6}`, 75, finalY + 21);
        doc.text(
          `${response?.data.section6_Values.Row6 || ""}`,
          105 +
            valueWidth -
            doc.getTextWidth(`${response?.data.section6_Values.Row6 || ""}`),
          finalY + 21
        );

        // Line
        doc.rect(75, finalY + 25, 50, 0.5, "FD");

        // Total
        doc.text(`${response?.data.section6_Labels.Row4}`, 75, finalY + 29);
        doc.text(
          `${response?.data.section6_Values.Row4 || ""}`,
          105 +
            valueWidth -
            doc.getTextWidth(`${response?.data.section6_Values.Row4 || ""}`),
          finalY + 29
        );

        // bottom part
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(
          `${response?.data.section7_Values["Total History"]}`,
          7,
          finalY + 31
        );
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(
          `${response?.data.section8_Labels.Col1 || ""}`,
          7,
          finalY + 36
        );
        doc.text(
          `${response?.data.section8_Values.Col1 || ""}`,
          24,
          finalY + 36
        );
        doc.text(
          `${response?.data.section8_Labels.Col2 || ""}`,
          58,
          finalY + 36
        );
        doc.text(
          `${response?.data.section8_Values.Col2 || ""}`,
          71,
          finalY + 36
        );
        doc.text(
          `${response?.data.section8_Labels.Col3 || ""}`,
          100,
          finalY + 36
        );
        doc.text(
          `${response?.data.section8_Values.Col3 || ""}`,
          119,
          finalY + 36
        );
        doc.text(
          `${response?.data.section8_Labels.Col4 || ""}`,
          150,
          finalY + 36
        );
        doc.text(
          `${response?.data.section8_Values.Col4 || ""}`,
          162,
          finalY + 36
        );
        doc.text(
          `${response?.data.section8_Labels.Col5 || ""}`,
          7,
          finalY + 41
        );
        doc.text(
          `${response?.data.section8_Values.Col5 || ""}`,
          24,
          finalY + 41
        );
        doc.text(
          `${response?.data.section8_Labels.Col6 || ""}`,
          58,
          finalY + 41
        );
        doc.text(
          `${response?.data.section8_Values.Col6 || ""}`,
          75,
          finalY + 41
        );

        // Row7 key is mismatched with value Col7, but we’ll assume Col7 is correct
        doc.text(
          `${response?.data.section8_Labels.Row7 || ""}`,
          100,
          finalY + 41
        );
        doc.text(
          `${response?.data.section8_Values.Col7 || ""}`,
          119,
          finalY + 41
        );
        // page number
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const addPageNumbers = (doc) => {
          const pageCount = doc.internal.getNumberOfPages();
          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text(`${i} out  of ${pageCount}`, 274, 3.1);
          }
        };
        // Add page numbers
        addPageNumbers(doc);
        const pdfBlob = doc.output("blob");
        // Upload the PDF to the server
        await uploadPDF(pdfBlob);
      }
      // Handle the response data as needed
      setFromDate("");
      setToDate("");
      toast.success("Statement Added successful");
    } catch (error) {
      console.error("Error fetching statement:", error);
      toast.error("Something went Wrong ");
      // Handle the error as needed
    }
  };
  const uploadPDF = async (pdfBlob) => {
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;
    const formData = new FormData();
    formData.append("document", pdfBlob, `_Vender_Statement_${dateTime}.pdf`);
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(`${API_IMAGE_URL}_Vender_Statement_${dateTime}.pdf`);
      } else {
        console.log("Failed to upload PDF");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };
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
  // const formatter = new Intl.NumberFormat("en-US", {
  //   style: "decimal",
  //   minimumFractionDigits: 2, // Ensures at least 2 digits after the decimal point
  //   maximumFractionDigits: 2, // Ensures no more than 2 digits after the decimal point
  // });
  const handleSubmit7 = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/PDFReceipt`, {
        RID: receptId,
        LANG: "1",
        copy_options: selectedInvoice === "Client" ? 1 : 2,
      });
      console.log(response);
      let modalElement = document.getElementById("exampleModalCustomization");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
        setSelectedInvoice("Client");
      }

      const section4Labels = response?.data?.section6_label || {};
      const section4Values = response?.data?.section6_values || [];
      // Convert section4_label values into header array
      const headers = [Object.values(section4Labels)];
      // Convert section4_values into rows
      const rows = section4Values.map((item) => Object.values(item));

      const doc = new jsPDF();
      doc.addFileToVFS("NotoSansThai-Regular.ttf", NotoSansThaiRegular);
      doc.addFont("NotoSansThai-Regular.ttf", "NotoSansThai", "normal");
      // Draw the top line and center the text "Receipt"
      const imgData = logo;
      doc.addImage(imgData, "JPEG", 6, 2, 20, 20);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`${response?.data?.Company_Address?.Line_1}`, 30, 8);
      doc.setTextColor(0, 0, 0);
      doc.text(`${response?.data?.Company_Address?.Line_2}`, 30, 12);
      const longTextOne = `${response?.data?.Company_Address?.Line_3}`;
      const maxWidthOne = 90;
      const linesOne = doc.splitTextToSize(longTextOne, maxWidthOne);
      let startXOne = 30;
      let startYOne = 16;
      linesOne.forEach((lineOne, index) => {
        doc.text(lineOne, startXOne, startYOne + index * 4.2); // Adjust the line height (10) as needed
      });

      doc.setFont("helvetica", "bold"); // Set font to bold
      doc.setFontSize(19);
      const purchaseOrderTitle =
        response?.data?.section1_Title?.Title || "Billing Note";
      const pageWidth1 = doc.internal.pageSize.getWidth();

      const textWidth1 = doc.getTextWidth(purchaseOrderTitle);

      // Calculate X position: (page width - margin - text width)
      const marginRight = 7;
      const x = pageWidth1 - marginRight - textWidth1;

      doc.text(purchaseOrderTitle, x, 11);
      doc.setFont("helvetica", "normal"); // Set font to bold
      doc.setFillColor(33, 56, 99);
      doc.rect(7, 23, doc.internal.pageSize.width - 15, 0.5, "FD");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text(response?.data?.section2?.Col1 || "", 7, 28);
      const poNum = response?.data?.section2?.Col2 || "";
      const pageWidth = doc.internal.pageSize.width;
      const textWidth = doc.getTextWidth(poNum);
      const xPosition = (pageWidth - textWidth) / 2;
      doc.text(poNum, xPosition, 28);
      // doc.text("Date: ", 169, 28);
      doc.setFillColor(33, 56, 99);
      doc.rect(7, 30, doc.internal.pageSize.width - 15, 0.5, "FD");
      // Define variables for wrapped text
      doc.setFontSize(12);

      const maxWidth1 = 100;
      const startX1 = 7;
      let startY1 = 35;
      const lineHeight1 = 4.2;
      doc.setFont("NotoSansThai"); // Set the font to use
      const longText1_4 = `${response?.data?.section3?.vc_address || ""}`;

      // const longText1_3 = ``;
      // Function to render wrapped text
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
      // Render the wrapped text sections
      doc.setFontSize(12);
      startY1 = renderWrappedText1(
        doc,
        longText1_4,
        startX1,
        startY1,
        maxWidth1,
        lineHeight1
      );
      doc.setFontSize(11);
      let startDate = 28;

      doc.text(response?.data?.section2?.Col3 || "", 169, startDate);
      doc.setFontSize(10);
      const startX2 = 120;
      const startY2 = 35;

      const section4_label = {
        Row1: response?.data?.section4?.Row1 || "",
        Row2: response?.data?.section4?.Row2 || "",
        Row3: response?.data?.section4?.Row3 || "",
        Row4: response?.data?.section4?.Row4 || "",
      };

      const section4_values = {
        Row1: response?.data?.section5?.Row1 || "",
        Row2: response?.data?.section5?.Row2 || "",
        Row3: response?.data?.section5?.Row3 || "",
        Row4: response?.data?.section5?.Row4 || "",
      };

      // Set line height
      const lineHeight = 5;
      // Find max label width so values align properly
      let maxLabelWidth = 0;
      Object.values(section4_label).forEach((label) => {
        const width = doc.getTextWidth(label);
        if (width > maxLabelWidth) {
          maxLabelWidth = width;
        }
      });

      // Add padding after label
      const labelColumnWidth = maxLabelWidth + 10;

      // Start Y position
      let y = startY2;

      // Loop through rows
      Object.keys(section4_label).forEach((key) => {
        const label = section4_label[key];
        const value = section4_values[key];

        // Print label
        doc.text(label, startX2, y);

        // Print value (aligned)
        doc.text(value, startX2 + labelColumnWidth, y);

        // Next line
        y += lineHeight;
      });

      // Save PDF
      const newFormatter1 = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      });
      const newFormatter5 = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      const noDecimal = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });

      const yTop = Math.max(startY1, startY2); // Start Y position for the tabl
      doc.setFillColor(33, 56, 99);
      doc.rect(7, yTop - 0.5, doc.internal.pageSize.width - 15, 0.1, "FD");
      const rawTitle = response?.data?.section6_title?.Title || "";
      const titleString = rawTitle.replace(/\s+/g, " ").trim(); // remove newlines & extra spaces
      doc.setFontSize(12);
      doc.text(titleString, 7, yTop + 5);

      doc.autoTable({
        head: headers,
        body: rows,
        columnStyles: {
          0: { halign: "center" },
          1: { halign: "left", font: "NotoSansThai", fontSize: 10 },
          2: { halign: "right", font: "NotoSansThai" },
          3: { halign: "right", font: "NotoSansThai" },
          4: { halign: "center", font: "NotoSansThai" },
          5: { halign: "right", font: "NotoSansThai" },
          6: { halign: "right", font: "NotoSansThai" },
          7: { halign: "right", font: "NotoSansThai" },
          8: { halign: "right", font: "NotoSansThai" },
          9: { halign: "right", font: "NotoSansThai" },
        },
        startX: 0,
        startY: yTop + 7,
        margin: {
          left: 7,
          right: 7,
        },
        tableWidth: "auto",
        headStyles: {
          fillColor: "#203764",
          textColor: "#FFFFFF",
          halign: "center",
        },
        styles: {
          textColor: "#000000",
          cellWidth: "wrap",
          valign: "middle",
          lineWidth: 0.1,
          lineColor: "#203764",
        },
      });
      const tableEndY = doc.lastAutoTable.finalY;
      // autotable end
      doc.setFontSize(10);
      // Reusable function to render right-aligned text
      function renderRightAlignedText(
        doc,
        label,
        formattedText,
        labelX,
        rightBoundary,
        fixedWidth,
        y
      ) {
        doc.text(label, labelX, y); // Render label
        const textWidth = doc.getTextWidth(formattedText);
        const rightAlignedX = rightBoundary - Math.min(textWidth, fixedWidth); // Calculate the right-aligned X position
        doc.text(formattedText, rightAlignedX, y); // Remnder the value
      }
      // Constants

      const fixedWidth = 150;
      const rightBoundary = 202.7;
      const labelX = 145;
      let currentY = tableEndY + 5;
      const textTotal = response?.data?.section7_values?.Row1 || "";
      renderRightAlignedText(
        doc,
        response?.data?.section7_label?.Row1 || "",
        textTotal,
        labelX,
        rightBoundary,
        fixedWidth,
        currentY
      );
      currentY += 5;
      const textTotalVat = response?.data?.section7_values?.Row2 || "";
      renderRightAlignedText(
        doc,
        response?.data?.section7_label?.Row2 || "",
        textTotalVat,
        labelX,
        rightBoundary,
        fixedWidth,
        currentY
      );
      currentY += 5;
      const textTotalWht = response?.data?.section7_values?.Row3 || "";
      renderRightAlignedText(
        doc,
        response?.data?.section7_label?.Row3 || "",
        textTotalWht,
        labelX,
        rightBoundary,
        fixedWidth,
        currentY
      );
      doc.rect(145, tableEndY + 16.5, 60, 0.5, "FD");
      currentY += 6;
      const textTotalPay = response?.data?.section7_values?.Row4 || "";
      renderRightAlignedText(
        doc,
        response?.data?.section7_label?.Row4 || "",
        textTotalPay,
        labelX,
        rightBoundary,
        fixedWidth,
        currentY
      );
      currentY += 5;
      const textRounding = response?.data?.section7_values?.Row5 || "";
      renderRightAlignedText(
        doc,
        response?.data?.section7_label?.Row5 || "",

        textRounding,
        labelX,
        rightBoundary,
        fixedWidth,
        currentY
      );

      currentY += 5;
      const textPayable = response?.data?.section7_values?.Row6 || "";
      renderRightAlignedText(
        doc,
        response?.data?.section7_label?.Row6 || "",
        textPayable,
        labelX,
        rightBoundary,
        fixedWidth,
        currentY
      );
      currentY += 6;
      const pastPayment = response?.data?.section7_values?.Row7 || "";
      renderRightAlignedText(
        doc,
        response?.data?.section7_label?.Row7 || "",
        pastPayment,
        labelX,
        rightBoundary,
        fixedWidth,
        currentY
      );
      currentY += 5;
      const row8 = response?.data?.section7_values?.Row8 || "";
      renderRightAlignedText(
        doc,
        response?.data?.section7_label?.Row8 || "",
        row8,
        labelX,
        rightBoundary,
        fixedWidth,
        currentY
      );

      currentY += 5;
      const row9 = response?.data?.section7_values?.Row9 || "";

      renderRightAlignedText(
        doc,
        response?.data?.section7_label?.Row9 || "",
        row9,
        labelX,
        rightBoundary,
        fixedWidth,
        currentY
      );

      doc.rect(145, tableEndY + 33, 58, 0.5, "FD");
      doc.setFontSize(11);

      doc.text(
        response?.data?.payment_title["Payment Details"] || "",
        7,
        tableEndY + 25
      );

      doc.setFontSize(10);
      function renderLabelAndValue(doc, label, value, labelX, valueX, y) {
        doc.text(label, labelX, y);
        doc.text(value, valueX, y);
      }
      console.log(">>>>>>>>>>>>>>>>>>>>>>");

      renderLabelAndValue(
        doc,
        response?.data?.payment_label?.row1 || "",
        `${
          response?.data?.payment_values?.Result1 || ""
            ? response?.data?.payment_values?.Result1 || ""
            : ""
        }`,
        7,
        40,
        tableEndY + 30
      );
      renderLabelAndValue(
        doc,
        response?.data?.payment_label?.row2 || "",
        `${
          response?.data?.payment_values?.Result2 || ""
            ? response?.data?.payment_values?.Result2 || ""
            : ""
        }`,
        7,
        40,
        tableEndY + 35
      );
      renderLabelAndValue(
        doc,
        response?.data?.payment_label?.row3 || "",
        `${
          response?.data?.payment_values?.Result3 || ""
            ? response?.data?.payment_values?.Result3 || ""
            : ""
        }`,
        7,
        40,
        tableEndY + 40
      );

      renderLabelAndValue(
        doc,
        response?.data?.payment_label?.row4 || "",
        response?.data?.payment_values?.Result4 || "",
        7,
        40,
        tableEndY + 45
      );
      renderLabelAndValue(
        doc,
        response?.data?.payment_label?.row5 || "",
        response?.data?.payment_values?.Result5 || "",
        7,
        40,
        tableEndY + 50
      );

      renderLabelAndValue(
        doc,
        response?.data?.payment_label?.row6 || "",
        response?.data?.payment_values?.Result6 || "",
        7,
        40,
        tableEndY + 55
      );
      // bottom part

      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      console.log(">>>>>>>>>>>>>>>>>>>>>");

      doc.text(
        response?.data?.preStatementTitle?.Statement || "",
        7,
        tableEndY + 60
      );
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      const section8Labels = {
        Col1: response?.data?.preStatement?.Col1 || "",
        Col2: response?.data?.preStatement?.Col2 || "",
        Col3: response?.data?.preStatement?.Col3 || "",
        Col4: response?.data?.preStatement?.Col4 || "",
        Col5: response?.data?.preStatement?.Col5 || "",
        Col6: response?.data?.preStatement?.Col6 || "",
        Col7: response?.data?.preStatement?.Row7 || "",
      };

      // Column values (static)
      const section8Values = {
        Col1: response?.data?.preStatementDetails?.Col1 || "",
        Col2: response?.data?.preStatementDetails?.Col2 || "",
        Col3: response?.data?.preStatementDetails?.Col3 || "",
        Col4: response?.data?.preStatementDetails?.Col4 || "",
        Col5: response?.data?.preStatementDetails?.Col5 || "",
        Col6: response?.data?.preStatementDetails?.Col6 || "",
        Col7: response?.data?.preStatementDetails?.Col7 || "",
      };

      const startOffset = 65;
      // Build the data
      const headers1 = Object.values(section8Labels);
      const data = [Object.values(section8Values)];

      doc.autoTable({
        startY: tableEndY + 65, // Same as your start offset
        head: [headers1],
        body: data,
        theme: "grid",
        columnStyles: {
          0: { halign: "center" },
          1: { halign: "center" },
          2: { halign: "center" },
          3: { halign: "center" },
          4: { halign: "center" },
          5: { halign: "center" },
          6: { halign: "center" },
        },
        startX: 0,
        margin: {
          left: 7,
          right: 7,
        },
        styles: {
          textColor: "#000000",
          cellWidth: "wrap",
          valign: "middle",
          lineWidth: 0.01,
          lineColor: [32, 55, 100],
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: "#000000",
          halign: "center",
          fontStyle: "normal",
        },
      });

      // // Render section 8
      // doc.text(section8Labels.Col1, 7, tableEndY + startOffset);
      // doc.text(section8Values.Col1, 7, tableEndY + startOffset + 5);

      // doc.text(section8Labels.Col2, 49, tableEndY + startOffset);
      // doc.text(section8Values.Col2, 49, tableEndY + startOffset + 5);

      // doc.text(section8Labels.Col3, 75, tableEndY + startOffset);
      // doc.text(section8Values.Col3, 75, tableEndY + startOffset + 5);

      // doc.text(section8Labels.Col4, 101, tableEndY + startOffset);
      // doc.text(section8Values.Col4, 101, tableEndY + startOffset + 5);

      // doc.text(section8Labels.Col5, 127, tableEndY + startOffset);
      // doc.text(section8Values.Col5, 127, tableEndY + startOffset + 5);

      // doc.text(section8Labels.Col6, 153, tableEndY + startOffset);
      // doc.text(section8Values.Col6, 153, tableEndY + startOffset + 5);

      // doc.text(section8Labels.Col7, 179, tableEndY + startOffset);
      // doc.text(section8Values.Col7, 179, tableEndY + startOffset + 5);

      const addPageNumbers = (doc) => {
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          const pageWidth = doc.internal.pageSize.width;
          doc.text(`${i} out of ${pageCount}`, pageWidth - 25, 3.1);
        }
      };
      addPageNumbers(doc);

      // Output PDF as a Blob and open it in a new tab
      const pdfBlob = doc.output("blob");

      // window.open(pdfUrl);
      await uploadPDF5(pdfBlob, receptId);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const uploadPDF5 = async (pdfBlob, receptId) => {
    // Generate a unique date-time string
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;

    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${receptId || "default"}_Recept_Note_${dateTime}.pdf`
    );

    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${receptId || "default"}_Recept_Note_${dateTime}.pdf`
        );
      } else {
        console.log("Failed to upload PDF");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };
  const newFormatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const newFormatter3 = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 3,
  });
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
  });
  useEffect(() => {
    if (clientId) {
      paymentTable();
    }
  }, [clientId]);
  const paymentTable = () => {
    axios
      .post(`${API_BASE_URL}/purchaseOrderListByVendor`, {
        vendor_id: clientId,
      })
      .then((res) => {
        console.log(res);
        setPaymentTable1(res.data.data);
        // setData(res.data.data);
      })
      .catch((error) => {
        console.log("There was an error fetching the data!", error);
      });
  };

  useEffect(() => {
    if (clientId2) {
      paymentTable10();
    }
  }, [clientId2]);

  const paymentTable10 = () => {
    console.log(clientId2);
    axios
      .post(`${API_BASE_URL}/VendorCombinedPaymentDetails`, {
        vendor_id: clientId2,
      })
      .then((res) => {
        console.log(res);
        setPaymentTableVender(res.data.data);
        setTableSummary(res.data.totaldata);
      })
      .catch((error) => {
        console.log("There was an error fetching the data!", error);
      });
  };

  const submitPaymentDataPayNow = async () => {
    if (!selectedPaymentDate) {
      setShow2(true);
      return;
    }
    if (!selectedPaymentChannel) {
      setShow2(true);
      return;
    }

    const paymentData = {
      vendor_id: venderId.Vendor,
      Payment_Date: selectedPaymentDate,
      Payment_Channel: selectedPaymentChannel,
      Bank_Fees: bankChargeAmount,
      Rounding: roundingAmount,
      available_Deposit: depositAvailable,
      Payment_Amount: totalPaymentAmount,
      Notes: paymentNotes,
      Bank_Ref: bankReference,
      CPN_id: venderId.ID,
      User_id: localStorage.getItem("id"),
      Total_Before_Tax: procesureResult?.["Total Before Tax"],
    };

    console.log(paymentData);

    try {
      // Send POST request to insertClientPayment endpoint (first API)
      const response = await axios.post(
        `${API_BASE_URL}/POPayments`,
        paymentData
      );
      console.log("Payment data submitted successfully", response);
      if (response?.data?.success) {
        // If success = true, show success toast
        toast.success(response.data?.message);
        let modalElement = document.getElementById("modalCombine2");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      } else {
        // If success = false, show modal with API message
        setShow1(true);
        setStock1(response.data || "Procedure returned an error");
      }
      getPurchaseOrder();
      // Update client details and summary table with collectPaymentId from the response
      const updatedCollectPaymentId = response?.data.data;
      setCollectPaymentId(updatedCollectPaymentId);
      setSelectedPaymentDate(null);
      setSelectedPaymentChannel("");
      setBankReference("");
      setBankChargeAmount("0");
      setDepositAvailable("");
      setRoundingAmount("");
      setTotalPaymentAmount("");
      setPaymentNotes("");
      // Hide modal after successful submission
    } catch (error) {
      // Handle error case for first API
      console.error("Error submitting payment data", error);
      // toast.error("Something went wrong");
    }
  };
  console.log(tableSummary);

  const modalCloseWindow = () => {
    let modalElement = document.getElementById("modalCombine1");
    let modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  };
  const handleSubmitVenderDataPayNow = async () => {
    if (!clientId2) {
      setShow3(true);
      return;
    }

    const selectedRows = paymentTableVender
      .map((child, index) => ({
        ID: child.ID,
        CPN: child.CPN,
        PO_ID: child.PO_ID,
        Payment: parseFloat(amountToPay[index] || 0),
        isChecked: childChecked[index], // include this to filter later
      }))
      .filter((row) => row.isChecked)
      .map(({ isChecked, ...rest }) => rest); // remove isChecked before sending

    if (selectedRows.length === 0) {
      toast.error(t("selectRecordError"), {
        autoClose: 5000,
        theme: "colored",
      });

      return;
    }

    const payload = {
      vendor_id: clientId2,
      Payment_Date: formData.paymentDate,
      due_date: formData.dueDate,
      user_id: localStorage.getItem("id"),
      datas: selectedRows,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/AddCombinedPayment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log(result);
      getPurchaseOrder();

      if (result?.data) {
        setSingleCpnId(result?.data);

        const modal1 = document.getElementById("modalCombine1");
        if (modal1) {
          const modalInstance1 = bootstrap.Modal.getInstance(modal1);
          modalInstance1?.hide();
        }

        const modal2 = document.getElementById("modalCombine");
        if (modal2) {
          const modalInstance2 = new bootstrap.Modal(modal2);
          modalInstance2.show();
        }

        try {
          const detailsResponse = await axios.get(
            `${API_BASE_URL}/GetCombinedPaymentByID`,
            {
              params: { cpn_id: result.data },
            }
          );

          const deposit = detailsResponse.data.cpn_data?.Available_deposit || 0;
          console.log(detailsResponse);
          setDepositAvailableNew(deposit);
          setBasePayment(detailsResponse.data.cpn_data?.left_pay || 0); // set it once
          setVatNew(detailsResponse.data.cpn_data?.Vat_payment || 0);
          setWhtNew(detailsResponse.data.cpn_data?.wht_payment || 0);
          setRoundingNew1(detailsResponse.data.cpn_data?.Rounding || 0);
          setTotalBeforText(
            detailsResponse.data.cpn_data?.Total_Before_Tax || 0
          );
          setVenderId(detailsResponse.data.cpn_data);
        } catch (detailErr) {
          console.error("Error fetching deposit details:", detailErr);
        }

        toast.success(t("paymentDone"));
        dataAllClearVender();
      } else {
        setShow3(true);
        setModalErrorMsg(result);
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(t("tryAgain"));
    }
  };

  const handleSubmitVenderData = async () => {
    if (!clientId2) {
      setShow3(true);
      return;
    }
    const selectedRows = paymentTableVender
      .map((child, index) => ({
        ID: child.ID,
        CPN: child.CPN,
        PO_ID: child.PO_ID,
        Payment: parseFloat(amountToPay[index] || 0),
        total_before_tax: child.Total_Before_Tax,
      }))
      .filter((_, index) => childChecked[index]);

    if (selectedRows.length === 0) {
      toast.error(t("selectRecordError"));
    }
    const payload = {
      vendor_id: clientId2,
      Payment_Date: formData.paymentDate,
      due_date: formData.dueDate,
      user_id: localStorage.getItem("id"),
      datas: selectedRows,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/AddCombinedPayment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log(result);
      setResponceId(result.data);
      if (!result.success) {
        setShow3(true);
        setModalErrorMsg(result);
        return;
      }
      toast.success(t("paymentDone"));
      dataAllClearVender();
      getPurchaseOrder();

      let modalElement = document.getElementById("modalCombine1");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(t("tryAgain"));
    }
  };

  const handleSubmit5 = async () => {
    console.log("Selected Payment Channel:", paymentChannel);

    if (!clientId) {
      toast.error(t("clientRequired"));
      return;
    }

    if (!paymentDate) {
      toast.error(t("paymentDateRequired"));
      return;
    }

    if (!paymentChannel) {
      toast.error(t("paymentChannelRequired"));
      return;
    }

    if (!fxId) {
      toast.error(t("fxRequired"));
      return;
    }

    if (!fxRate || isNaN(Number(fxRate))) {
      toast.error(t("validFxRate"));
      return;
    }

    if (!intermittentBankCharges || isNaN(Number(intermittentBankCharges))) {
      toast.error(t("validInterBankCharges"));
      return;
    }

    if (!localBankCharges || isNaN(Number(localBankCharges))) {
      toast.error(t("validLocalBankCharges"));
      return;
    }

    if (!thbReceived || isNaN(Number(thbReceived))) {
      toast.error(t("validThbReceived"));
      return;
    }

    const totalPaidAmount = paymentTable2.reduce((total, item) => {
      const transactionRef = item["Transaction Ref"];
      if (checkedItems[transactionRef]) {
        return total + (parseFloat(paidAmounts[transactionRef]) || 0);
      }
      return total;
    }, 0);

    const parsedFxPayment = parseFloat(fxPayment);
    console.log("FX Payment:", parsedFxPayment.toFixed(2));
    console.log("Total Paid Amount:", totalPaidAmount.toFixed(2));
    if (parsedFxPayment.toFixed(2) !== totalPaidAmount.toFixed(2)) {
      toast.error(t("paymentMismatch"));
      return;
    }
    const paymentData = {
      Vendor_ID: clientId,
      Payment_date: moment(paymentDate).format("YYYY-MM-DD"),
      Payment_Channel: paymentChannel,
      FX_Payment: parsedFxPayment,
      FX_ID: fxId,
      FX_Rate: fxRate,
      Intermittent_bank_charges: intermittentBankCharges,
      Local_bank_Charges: localBankCharges,
      Client_payment_ref: clientPaymentRef,
      Bank_Ref: bankRef,
      Notes: notes1,
      user_id: localStorage.getItem("id"),
    };

    console.log("Sending Payment Data:", paymentData);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/RecordCommissionPayment`,
        paymentData
      );
      let modalElement = document.getElementById("exampleModalComm");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
      console.log("Payment data submitted successfully:", response.data.data);

      const V_payment_id = response.data.data;

      const selectedPaymentDetails = paymentTable2
        .filter((item) => checkedItems[item["Transaction Ref"]])
        .map((item) => ({
          Payment_ID: V_payment_id,
          Client_ID: clientId,
          Invoice_ID: item.Invoice_id,
          Paid_Amount: paidAmounts[item["Transaction Ref"]] || 0,
        }));
      console.log(selectedPaymentDetails);
      const commissionResponse = await axios.post(
        `${API_BASE_URL}/RecordCommissionPaymentDetails`,
        {
          paymentDetailsArray: selectedPaymentDetails,
        }
      );
      setClientId([]);
      setConsigneeId([]);
      setPaymentDate("");
      setClientPaymentRef("");
      setPaymentChannel("");
      setBankRef("");
      setFxPayment("");
      setFxRate("");
      setFxId("");
      setIntermittentBankCharges("");
      setLocalBankCharges("");
      setThbReceived("");
      setLossGainOnExchangeRate("");
      setThbPaid("");
      setPaidAmounts({});
      setCheckedItems({});
      setPaymentTable2([]); //
      setNotes1("");
      toast.success(t("paymentSuccess"));
    } catch (error) {
      console.error("Error submitting payment data:", error.message);
      toast.error(t("tryAgain"));
    }
  };

  const handleSubmit1 = async () => {
    if (!clientId) {
      toast.error(t("vendorRequired"));
      return;
    }
    if (!paymentDate) {
      toast.error(t("paymentDateRequired"));
      return;
    }
    if (!paymentChannel) {
      toast.error(t("paymentChannelRequired"));
      return;
    }
    const totalPaidAmount = paymentTable1.reduce((total, item) => {
      if (checkedItems[item.po_id]) {
        return total + (parseFloat(paidAmounts[item.po_id]) || 0);
      }
      return total;
    }, 0);
    const parsedFxPayment = parseFloat(fxPayment);
    const paymentData = {
      Vendor_ID: clientId,
      Payment_date: paymentDate,
      Payment_Channel: paymentChannel,
      FX_Payment: parsedFxPayment, // Use parsedFxPayment instead of fxPayment
      FX_ID: fxId,
      FX_Rate: fxRate,
      Intermittent_bank_charges: intermittentBankCharges,
      Local_bank_Charges: localBankCharges,
      THB_Paid: thbPaid,
      Client_payment_ref: clientPaymentRef,
      Bank_Ref: bankRef,
      LOSS_GAIN_THB: lossGainOnExchangeRate,
      Notes: notes2,
      user_id: localStorage.getItem("id"),
    };
    console.log(paymentData);
    try {
      // Send POST request to insertClientPayment endpoint (first API)
      const response = await axios.post(
        `${API_BASE_URL}/purchaseOrderPayment`,
        paymentData
      );
      console.log("Payment data submitted successfully", response);
      const updatedCollectPaymentId = response?.data.data;
      setCollectPaymentId(updatedCollectPaymentId);
      setClientId("");
      setPaymentDate("");
      setClientPaymentRef("");
      setPaymentChannel("");
      setBankRef("");
      setFxPayment("");
      setFxRate("");
      setFxId("");
      setThbPaid("");
      setNotes2("");
      setIntermittentBankCharges("");
      setLocalBankCharges("");
      setThbReceived("");
      setLossGainOnExchangeRate("");
      let modalElement = document.getElementById("modalPayment");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
      const selectedPaymentDetails = paymentTable1
        .filter((item) => checkedItems[item.po_id])
        .map((item) => ({
          PO_id: item.po_id,
          CNF_FX: paidAmounts[item.po_id] || 0,
          V_Payment_ID: updatedCollectPaymentId,
        }));

      try {
        const secondApiResponse = await axios.post(
          `${API_BASE_URL}/purchaseOrderPaymentDetails`,
          { paymentDetailsArray: selectedPaymentDetails }
        );

        setPaidAmounts({});
        setCheckedItems({});
        setPaymentTable1([]); // Clear paymentTable1
        console.log(
          "Payment details array submitted successfully",
          secondApiResponse
        );
        toast.success(t("paymentDetailsSuccess"));
      } catch (secondApiError) {
        console.error("Error submitting payment details", secondApiError);
        toast.error(t("tryAgain"));
      }
    } catch (error) {
      console.error("Error submitting payment data", error);
      toast.error(t("tryAgain"));
    }
  };

  // tushar onchnage function
  const handleDepositeAvailable = (e) => {
    const { value } = e.target;

    // Convert to number to ensure numeric comparison
    const numericValue = Number(value);
    setNumericvalueofdata(numericValue);
    // if (numericValue > depositAvailableFromAPI) {
    //   toast.error(`You cannot enter more than ${depositAvailableFromAPI}`);
    //   return;
    // }

    setHasUserChangedValues(true);
    setDepositAvailableNew(value);
  };

  const submitPaymentData = async () => {
    const paymentData = {
      bn_id: singlePodId.ID || venderId.bn_id, // or however you get bn_id
      IID: singlePodId.IID || venderId.IID, // same for IID
      USER_ID: localStorage.getItem("id"),
      Receipt_Date: paymentForm.paymentDate, // from DatePicker
      Prepayment: paymentForm.prepayment,
      FX_Received: paymentForm.thbReceived, // THB Received → FX Received (if that's correct mapping)
      FX: paymentForm.fx, // selected FX
      R_FX_Rate: paymentForm.fxRateReceived, // Rate Received
      BankFees_FX: paymentForm.interBankCharges, // Inter-bank charges (FX)
      BankFees_THB: paymentForm.localBankCharges, // Local bank charges (THB)
      Notes: paymentForm.notes,
    };

    console.log("BNPayment payload:", paymentData);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/BNPayment`,
        paymentData
      );

      if (response?.data?.success === true) {
        toast.success(response.data?.message);

        // Reset the form
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

        // Refresh list
        receipt();
      } else {
        toast.warning(response.data?.message);
      }
    } catch (error) {
      console.error("Error submitting BNPayment data", error);
      toast.error(t("tryAgain"));
    }
  };

  const paymentDataClear = async () => {
    try {
      // First: update access file
      const accessResponse = await axios.post(`${API_BASE_URL}/ReleaseAccess`, {
        id: singlePodId.PO_ID,
        accesstype: 1, // Cancel action
      });

      console.log(
        "Access file updated (inside closeButton):",
        accessResponse.data
      );

      // Clear related states

      setPaymentAmmountNew("");
      setProcesureResult("");
      setRoundingNew("");
      setDepositAvailableNew("");
      setSelectedPaymentDate(null);
      setSelectedPaymentChannel("");
      setBankReference("");
      setBankChargeAmount("0");
      setDepositAvailable("");
      setRoundingAmount("");
      setTotalPaymentAmount("");
      setPaymentNotes("");
    } catch (error) {
      console.error("Error updating access file in closeButton:", error);
      toast.error(t("closingError"));
    }
  };

  console.log(formsValue);

  console.log(details);

  const handleSubmit3 = async () => {
    console.log(claimPageData);
    const paymentData = {
      User_id: localStorage.getItem("id"),
      Debit_date: selectedDate,
      PO_ID: claimPageData.PO_ID,
      Vendor_ID: claimPageData.Vendor, // This should be a string or number, not a DOM element
      FX_ID: claimPageData.FX_ID,
    };

    console.log("Sending Payment Data:", paymentData); // Log before sending

    try {
      // Send POST request to RecordCommissionPayment endpoint
      const response = await axios.post(
        `${API_BASE_URL}/DebitNotes`,
        paymentData
      );
      let modalElement = document.getElementById("modalClaim");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
      console.log("Payment data submitted successfully:", response.data.data);

      const V_payment_id = response.data.data;
      console.log(claimTable);
      const selectedPaymentDetails = claimTable
        .filter(
          (item) =>
            paidAmounts1[item.pod_id] ||
            units[item.pod_id] ||
            amounts[item.pod_id]
        )
        .map((item) => ({
          Debit_Note_ID: V_payment_id,
          POD_ID: item.POD_ID,
          Item: item.Item,
          QTY: paidAmounts1[item.pod_id] || 0,
          Unit: units[item.pod_id] || 0,
          Debit_Amount: amounts[item.pod_id] || 0,
        }));
      console.log(selectedPaymentDetails);
      const commissionResponse = await axios.post(
        `${API_BASE_URL}/DebitNotesDetails`,
        {
          DebitNotesDetailsArray: selectedPaymentDetails,
        }
      );
      const accessResponse = await axios.post(`${API_BASE_URL}/ReleaseAccess`, {
        id: claimPageData.PO_ID,
        accesstype: 1, // Mark as in use
      });
      console.log(accessResponse);
      toast.success(t("dataSubmitSuccess"));
    } catch (error) {
      console.error("Error submitting payment data:", error.message);
      toast.error(t("genericError"));
    }
  };
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

  const handleCheckboxChange5 = (invoiceNumber, isChecked) => {
    setCheckedItems((prev) => {
      const updatedCheckedItems = { ...prev, [invoiceNumber]: isChecked };
      const amountToPay = isChecked
        ? paymentTable2.find(
            (item) => item["Transaction Ref"] === invoiceNumber
          )?.["Amount to Pay"] || 0
        : "";

      // Update Paid Amounts
      setPaidAmounts((prevPaidAmounts) => {
        const updatedPaidAmounts = {
          ...prevPaidAmounts,
          [invoiceNumber]: amountToPay,
        };
        const totalPaidAmount = paymentTable2.reduce((sum, item) => {
          if (updatedCheckedItems[item["Transaction Ref"]]) {
            return (
              sum +
              (parseFloat(updatedPaidAmounts[item["Transaction Ref"]]) || 0)
            );
          }
          return sum;
        }, 0);

        setTotalPaidAmount(totalPaidAmount);
        setFxPayment(totalPaidAmount.toFixed(2));

        return updatedPaidAmounts;
      });

      return updatedCheckedItems;
    });
  };
  const handleCheckboxChange = (invoiceNumber, isChecked) => {
    setCheckedItems((prev) => {
      const updatedCheckedItems = { ...prev, [invoiceNumber]: isChecked };

      // Automatically set Paid Amount to the corresponding amount_to_pay if checked
      const amountToPay = isChecked
        ? paymentTable1.find((item) => item.po_id === invoiceNumber)
            ?.amount_to_pay || 0
        : "";

      // Update Paid Amounts
      setPaidAmounts((prevPaidAmounts) => {
        const updatedPaidAmounts = {
          ...prevPaidAmounts,
          [invoiceNumber]: amountToPay,
        };

        // Calculate the total of all paid amounts for checked items only
        const totalPaidAmount = paymentTable1.reduce((sum, item) => {
          if (updatedCheckedItems[item.po_id]) {
            return sum + (parseFloat(updatedPaidAmounts[item.po_id]) || 0);
          }
          return sum;
        }, 0);

        setTotalPaidAmount(totalPaidAmount);
        setFxPayment(totalPaidAmount);
        const thbPaidValue =
          totalPaidAmount - (parseFloat(lossGainOnExchangeRate) || 0);
        setThbPaid(thbPaidValue); // Set the recalculated THB Paid value
        return updatedPaidAmounts;
      });

      return updatedCheckedItems;
    });
  };
  const handlePaidAmountChange = (invoiceNumber, value) => {
    setPaidAmounts((prev) => {
      const updatedPaidAmounts = {
        ...prev,
        [invoiceNumber]: value,
      };

      // Calculate the total of all paid amounts for checked items only
      const totalPaidAmount = paymentTable1.reduce((sum, item) => {
        if (checkedItems[item.po_id]) {
          return sum + (parseFloat(updatedPaidAmounts[item.po_id]) || 0);
        }
        return sum;
      }, 0);

      setTotalPaidAmount(totalPaidAmount);
      setFxPayment(totalPaidAmount);
      return updatedPaidAmounts;
    });
  };
  // const deleteOrder = async (id) => {
  //   try {
  //     // Step 1: Check file access before proceeding
  //     const accessResponse = await axios.post(
  //       `${API_BASE_URL}/Checkeaccessfile`,
  //       {
  //         id: id,
  //         accesstype: 1,
  //       }
  //     );

  //     // Step 2: If access allowed, show confirmation
  //     if (accessResponse?.data?.success) {
  //       getPurchaseOrder(); // You can keep or move this as needed

  //       const result = await MySwal.fire({
  //         title: "Are you sure?",
  //         text: "You won't be able to revert this!",
  //         icon: "warning",
  //         showCancelButton: true,
  //         confirmButtonColor: "#3085d6",
  //         cancelButtonColor: "#d33",
  //         confirmButtonText: "Delete",
  //         cancelButtonText: "Cancel",
  //         allowOutsideClick: false,
  //         allowEscapeKey: false,
  //       });

  //       if (result.isConfirmed) {
  //         try {
  //           const response = await axios.post(
  //             `${API_BASE_URL}/DeletePurchase`,
  //             {
  //               po_id: id,
  //               user_id: localStorage.getItem("id"),
  //             }
  //           );

  //           getPurchaseOrder();
  //           toast.success(response.data.Message_EN);
  //           toast.success(response.data.Message_TH);
  //         } catch (e) {
  //           toast.error(t("deleteError"));
  //         }
  //       } else {
  //         // If cancelled, release access
  //         try {
  //           await axios.post(`${API_BASE_URL}/ReleaseAccess`, {
  //             id: id,

  //             accesstype: 1,
  //           });
  //           getPurchaseOrder();
  //         } catch (e) {
  //           toast.error(t("accessUpdateError"));
  //         }
  //       }
  //     } else {
  //       toast.warning(t("fileInUse"));
  //     }
  //   } catch (e) {
  //     toast.error(t("fileAccessCheckFailed"));
  //   }
  // };

  // const deleteOrder = async (id) => {
  //   try {
  //     // Step 1: Mark access as in use
  //     await axios.post(`${API_BASE_URL}/Checkeaccessfile`, {
  //       id: id,
  //       accesstype: 1,
  //     });
  //     getPurchaseOrder();
  //     console.log(id);

  //     // Step 2: Show confirmation modal (DISABLE outside click & ESC key)
  //     MySwal.fire({
  //       title: "Are you sure?",
  //       text: "You won't be able to revert this!",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: "Delete",
  //       cancelButtonText: "Cancel",
  //       allowOutsideClick: false,
  //       allowEscapeKey: false,
  //     }).then(async (result) => {
  //       console.log(result);
  //       if (result.isConfirmed) {
  //         try {
  //           const response = await axios.post(
  //             `${API_BASE_URL}/DeletePurchase`,
  //             {
  //               po_id: id,
  //               user_id: localStorage.getItem("id"),
  //             }
  //           );
  //           console.log(response);
  //           getPurchaseOrder();
  //           toast.success(response.data.Message_EN);
  //           toast.success(response.data.Message_TH);
  //         } catch (e) {
  //           toast.error("Something went wrong during delete");
  //         }
  //       } else {
  //         try {
  //           await axios.post(`${API_BASE_URL}/updateaccessfile`, {
  //             id: id,
  //             type: 0,
  //             accesstype: 1,
  //           });
  //           getPurchaseOrder();
  //         } catch (e) {
  //           toast.error("Failed to update access file on cancel");
  //         }
  //       }
  //     });
  //   } catch (e) {
  //     toast.error("Failed to mark access before confirmation");
  //   }
  // };

  // const deleteOrder = (id) => {
  //   console.log(id);
  //   MySwal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Delete",
  //   }).then(async (result) => {
  //     console.log(result);
  //     if (result.isConfirmed) {
  //       try {
  //         const response = await axios.post(`${API_BASE_URL}/DeletePurchase`, {
  //           po_id: id,
  //           user_id: localStorage.getItem("id"),
  //         });
  //         console.log(response);
  //         getPurchaseOrder();
  //         toast.success(response.data.Message_EN);
  //         toast.success(response.data.Message_TH);
  //       } catch (e) {
  //         toast.error("Something went wrong");
  //       }
  //     }
  //   });
  // };

  const deleteReceipt = async (id) => {
    try {
      const result = await MySwal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      if (result.isConfirmed) {
        try {
          const response = await axios.post(`${API_BASE_URL}/receiptDelete`, {
            RID: id,
            user_id: localStorage.getItem("id"),
          });

          receipt();
          toast.success(response.data.Message_EN);
          toast.success(response.data.Message_TH);
        } catch (e) {
          toast.error(t("deleteError"));
          console.log(e);
        }
      }
    } catch (e) {
      toast.error(t("genericError"));
    }
  };

  const options = useMemo(
    () => ({
      chart: {
        width: 350,
        type: "pie",
      },
      labels: [t("packaging"), t("produce"), t("freight")],
      colors: ["#203764", "#FFC300", "#2ecc71"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    }),
    [t]
  );
  const formatterTwo = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const dataAllClear = () => {
    setButtonClicked(false);

    setFormsvalue([
      {
        pod_type_id: 0,
        unit_count_id: 0,
        POD_Selection: 0,
        pod_quantity: 0,
        pod_price: 0,
        pod_vat: 0,
        pod_wht_id: 0,
        pod_crate: 0,
      },
    ]);
    setState({
      po_id: "", // If you want to keep the initial value
      vendor_id: "",
      created: "", // Reset or set to a new default value
      supplier_invoice_number: "",
      supplier_invoice_date: "",
    });
    setClientId("");
    setConsigneeIdSet("");
    setClientId("");
    setPaymentDate("");
    setClientPaymentRef("");
    setPaymentChannel("");
    setBankRef("");
    setFxPayment("0");
    setFxRate("0");
    setFxId("1");
    setIntermittentBankCharges("0");
    setLocalBankCharges("0");
    setThbReceived("");
    setLossGainOnExchangeRate("0");
    setThbPaid("");
    setPaidAmounts({});
    setCheckedItems({});
    setPaymentTable1([]); // Clear paymentTable1
    setNotes2("");
  };
  const dataAllClear1 = () => {
    setClientId(null); // Clear the selected client
    setConsigneeId([]);
    setPaymentDate("");
    setClientPaymentRef("");
    setPaymentChannel("");
    setBankRef("");
    setFxPayment("");
    setFxRate("");
    setFxId("");
    setIntermittentBankCharges("");
    setLocalBankCharges("");
    setThbReceived("");
    setLossGainOnExchangeRate("");
    setPaidAmounts({});
    setCheckedItems({});
    setPaymentTable2([]); //
    setNotes1("");
  };
  const setHandleData = (a) => {
    setReceptId(a.ID);
  };
  const receipt = () => {
    const lang = localStorage.getItem("language");
    const langValue = lang === "en" ? 0 : 1;

    axios
      .post(`${API_BASE_URL}/ReceiptView`, {
        LANG: langValue,
      })
      .then((response) => {
        const { data: rows = [], head = {} } = response.data;

        // Step 1: Create dynamic columns from head
        const generatedColumns = Object.entries(head)
          .filter(([key]) => key !== "ID")
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
                  <>
                    <button
                      onClick={() =>
                        navigate("/purchaseview", { state: { from: a } })
                      }
                    >
                      <i className="mdi mdi-eye" />
                    </button>

                    {/* {a.Payment_Status === 1 &&
                      (a.Receiving_Status === 1 ||
                        a.Receiving_Status === 2) && (
                        <button
                          onClick={async () => {
                            try {
                              const res = await axios.post(
                                `${API_BASE_URL}/Checkeaccessfile`,
                                {
                                  id: a.PO_ID,
                                  accesstype: 1, // Mark as in use
                                  edit: 1,
                                }
                              );

                              if (res?.data?.success) {
                                navigate("/updatePurchaseOrder", {
                                  state: { from: a },
                                });
                              } else {
                                toast.warning(res?.data?.message);
                              }
                            } catch (error) {
                              console.error("Access API error:", error);
                              toast.error(
                                "Something went wrong while checking file access."
                              );
                            }
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          <i className="mdi mdi-pencil pl-2" />
                        </button>
                      )} */}

                    {a.is_latest === 1 && (
                      <button
                        type="button"
                        onClick={() => deleteReceipt(a.ID)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "red",
                        }}
                      >
                        <i className="ps-2 mdi mdi-delete" />
                      </button>
                    )}

                    <button
                      type="button"
                      className="svgIconPurchase"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModalCustomization"
                      onClick={() => setHandleData(a)} // ✅ Correct way
                    >
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 500 500"
                          style={{ cursor: "pointer" }}
                        >
                          <g>
                            <path d="M388,428.4H114.2V72.6h183.6l90.1,90.1V428.4z M141.6,401.1h219V174l-74.1-74.1H141.6V401.1z" />
                            <polygon points="374.3,182.1 278.5,182.1 278.5,86.2 305.9,86.2 305.9,154.7 374.3,154.7" />
                            <path d="M240.5,248.2c0,8.4-2.6,14.9-7.9,19.3c-5.3,4.5-12.7,6.7-22.4,6.7h-7.1V302h-16.6v-78.2h25c9.5,0,16.7,2,21.6,6.1 C238.1,234,240.5,240.1,240.5,248.2z M203.1,260.6h5.5c5.1,0,8.9-1,11.4-3s3.8-4.9,3.8-8.8c0-3.9-1.1-6.8-3.2-8.6s-5.4-2.8-10-2.8 h-7.5V260.6z" />
                            <path d="M318,262.8c0,12.9-3.2,22.9-9.6,29.8c-6.4,7-15.6,10.4-27.6,10.4s-21.2-3.5-27.6-10.4c-6.4-7-9.6-16.9-9.6-29.9 c0-13,3.2-23,9.7-29.8c6.4-6.9,15.7-10.3,27.7-10.3c12,0,21.2,3.5,27.6,10.4C314.9,239.9,318,249.8,318,262.8z M261,262.8 c0,8.7,1.7,15.3,5,19.7c3.3,4.4,8.3,6.6,14.9,6.6c13.2,0,19.8-8.8,19.8-26.4c0-17.6-6.6-26.4-19.7-26.4c-6.6,0-11.6,2.2-14.9,6.7 C262.7,247.5,261,254.1,261,262.8z" />
                          </g>
                        </svg>
                      </div>
                    </button>

                    {/* <button
                      type="button"
                      // data-bs-toggle="modal"
                      // data-bs-target="#modalClaim"
                      onClick={() => claimDetails(a.PO_ID, a)}
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
                        <title>text-box-minus</title>
                        <path d="M22,17V19H14V17H22M12,17V15H7V17H12M17,11H7V13H14.69C13.07,14.07 12,15.91 12,18C12,19.09 12.29,20.12 12.8,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H19A2,2 0 0,1 21,5V12.8C20.12,12.29 19.09,12 18,12L17,12.08V11M17,9V7H7V9H17Z" />
                      </svg>
                    </button> */}

                    {/* {a.Payment_Status !== 2 && a.Payment_Status !== 4 && (
                      <button
                        type="button"
                        className="SvgAnchor"
                        data-bs-toggle="modal"
                        data-bs-target="#modalCombine"
                        onClick={() => {
                          everyDataSet(a);
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
                      </button>
                    )} */}
                  </>
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
    receipt();
  }, []);

  const closeButton = async () => {
    try {
      // First: update access file
      const accessResponse = await axios.post(`${API_BASE_URL}/ReleaseAccess`, {
        id: claimPageData.PO_ID,

        accesstype: 1, // Cancel action
      });

      console.log(
        "Access file updated (inside closeButton):",
        accessResponse.data
      );

      // Clear related states
      setClaimTable([]);
      setClaimPageData("");
      setSelectedDate("");
      setInvImage(null); // Clear the image

      // Reset file input value if the ref is available
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error updating access file in closeButton:", error);
      toast.error(t("closingError"));
    }
  };

  // const closeButton = () => {
  //   setClaimTable([]);
  //   setClaimPageData("");
  //   setSelectedDate("");
  //   setInvImage(null); // Set to null to clear the image

  //   // Reset file input value
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = "";
  //   }
  // };
  console.log(formsValue);
  const [modalOne, setModalOne] = useState(false);
  const handleCloseModalOne = () => {
    setModalOne(false); // Hide the modal
  };

  const openModalOne = () => {
    setModalOne(true); // Show the modal
  };
  const handleNavigate = () => {
    navigate("/receipt_create"); // Replace '/target-route' with your desired path
  };
  const [optionItem, setOptionItem] = useState([]);
  const [unitItem, setUnitItem] = useState([]);
  const [formDataAdd, setFormDataAdd] = useState({
    quantity: "",
    crate: "",
    price: "",
    vat: "",
    wht: "",
    total: "",
  });

  const handleChangeAdd = (e) => {
    const { name, value } = e.target;
    setFormDataAdd((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/PurchaseTypeItemsList`
        );
        console.log(response);
        setOptionItem(response.data.data); // Assuming data is already an array of objects
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchOptions();
  }, []);
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getAllUnit`);
        console.log("API Response:", response.data.data);

        // Assuming response.data.data is the correct array
        setUnitItem(response.data.data || []);
      } catch (error) {
        console.error("Error fetching units:", error);
        setUnitItem([]); // Fallback to an empty array
      }
    };

    fetchUnits();
  }, []);
  function formatNumber(num) {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  }
  // table check
  const [parentChecked, setParentChecked] = useState(false);
  const [childChecked, setChildChecked] = useState({});

  useEffect(() => {
    const initialCheckedState = {};
    paymentTableVender.forEach((_, index) => {
      initialCheckedState[index] = false; // Ensure all checkboxes are initially unchecked
    });
    setChildChecked(initialCheckedState);
  }, [paymentTableVender]);

  const handleParentChange = () => {
    const newChecked = !parentChecked;
    setParentChecked(newChecked);

    // Update all child checkboxes
    const updatedChildren = {};
    paymentTableVender.forEach((_, index) => {
      updatedChildren[index] = newChecked;
    });

    setChildChecked(updatedChildren);

    // Calculate sum when selecting all
    calculateCheckedAmount(updatedChildren, newChecked ? amountToPay : {});
  };

  const calculateCheckedAmount = (checkedState, amountData = amountToPay) => {
    let sumAmountToPay = 0;
    let sumVAT = 0;
    let sumWHT = 0;
    let sumTotalBeforeTax = 0;
    let sumRounding = 0;

    paymentTableVender.forEach((child, index) => {
      if (checkedState[index]) {
        const amountToPayValue = parseFloat(amountData[index]) || 0;
        const totalBeforeTax = parseFloat(child.Total_Before_Tax || 1);
        const vatValue = parseFloat(child.VAT || 0);
        const whtValue = parseFloat(child.WHT || 0);

        sumAmountToPay += amountToPayValue;
        sumVAT += (amountToPayValue * vatValue) / totalBeforeTax;
        sumWHT += (amountToPayValue * whtValue) / totalBeforeTax;
        sumTotalBeforeTax += amountToPayValue; // Reflect proportionally selected
        sumRounding += parseFloat(child.Rounding || 0);
      }
    });

    setRoundingData(sumRounding);
    setVATTotal(sumVAT);
    setWHTTotal(sumWHT);
    setTotalBeforeTaxTotal(sumTotalBeforeTax);
  };
  const handleChildChange = async (index) => {
    const isNowChecked = !childChecked[index];

    // Update checked state immediately
    const updatedChecked = {
      ...childChecked,
      [index]: isNowChecked,
    };
    setChildChecked(updatedChecked);
    console.log(paymentTableVender);
    // If the checkbox was just checked, call validation API
    if (isNowChecked) {
      const pod_id = paymentTableVender[index]?.PO_ID;
      if (pod_id) {
        try {
          await validateCombinedPayment(pod_id); // Call your API here
        } catch (error) {
          console.error("Validation API failed:", error);
          // Optionally revert the checkbox if validation fails
          updatedChecked[index] = false;
          setChildChecked({ ...updatedChecked });
          return; // stop further processing
        }
      }
    }

    // Update parent checkbox state
    const allChecked = Object.values(updatedChecked).every(Boolean);
    setParentChecked(allChecked);

    // Recalculate totals based on updated state
    calculateCheckedAmount(updatedChecked);
  };

  const validateCombinedPayment = async (pod_id) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/ValidationCombinedPayment`,
        { pod_id: pod_id }
      );
      const data = await response.json();
      console.log("Validation result:", data); // or handle validation result
    } catch (error) {
      console.error("Validation API error:", error);
    }
  };

  useEffect(() => {
    const deposit = parseFloat(depositAvailableNew) || 0;
    const finalPayment = basePayment - deposit;
    setPaymentAmmountNew(finalPayment >= 0 ? finalPayment.toFixed(2) : 0);
  }, [depositAvailableNew, basePayment]);
  const inputRef = useRef(null); // Ref for input field

  const handleChangeAmount = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setTotalPaymentAmount(rawValue);
  };

  return (
    <>
      <Card title={t("receiptManagement")}>
        <div className="d-flex justify-content-center domesticPayment">
          <button
            type="button"
            className="btn btn-danger"
            // data-bs-toggle="modal"
            // data-bs-target="#modalCombine1"
            onClick={() => navigate("/billingNoteCreate")}
          >
            {t("billingNote")}
          </button>
          {/* <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal2"
          >
            {t("statement")}
          </button> */}

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleNavigate}
          >
            {t("create")}
          </button>
          <div
            className="modal fade "
            id="modalPayment"
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modalShipTo  modal-xl">
              <div className="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">
                    Payment
                  </h1>
                  <button
                    type="button"
                    onClick={dataAllClear}
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <i class="mdi mdi-close"></i>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="parentFormPayment autoComplete">
                        <p>Vendor </p>

                        <Autocomplete
                          disablePortal
                          options={clients || []} // Ensure options is always an array
                          value={
                            (clients || []).find(
                              (client) => client.vendor_id === clientId
                            ) || null
                          } // Safeguard against undefined
                          getOptionLabel={(option) => option.name || ""} // Handle cases where option.name might be undefined
                          onChange={(e, newValue) =>
                            setClientId(newValue?.vendor_id || "")
                          } // Update state on selection
                          sx={{ width: 300 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Search Vendor"
                              InputLabelProps={{ shrink: false }}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="parentFormPayment">
                        <div>
                          <p>Payment Date</p>
                        </div>
                        <div>
                          <DatePicker
                            selected={paymentDate}
                            onChange={
                              (date) => setPaymentDate(date) // Replace with your specific handling logic
                            }
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Click to select a date"
                            customInput={<CustomInput />} // Ensure you have the `CustomInput` component defined or imported
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 ">
                      <div className="parentFormPayment">
                        <div>
                          <p>Client Payment Ref</p>
                        </div>
                        <div>
                          <input
                            type="text"
                            value={clientPaymentRef}
                            onChange={(e) =>
                              setClientPaymentRef(e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 mt-3">
                      <div className="parentFormPayment autoComplete">
                        <p>Payment Channel </p>

                        <Autocomplete
                          disablePortal
                          options={paymentChannle || []} // Ensure options is always an array
                          value={
                            (paymentChannle || []).find(
                              (channel) => channel.bank_id === paymentChannel
                            ) || null
                          } // Safeguard against undefined
                          getOptionLabel={(option) =>
                            option.Bank_nick_name || ""
                          } // Handle cases where Bank_nick_name might be undefined
                          onChange={(e, newValue) =>
                            setPaymentChannel(newValue?.bank_id || "")
                          } // Update state on selection
                          sx={{ width: 300 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Search Payment Channel"
                              InputLabelProps={{ shrink: false }}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 mt-3">
                      <div className="parentFormPayment">
                        <div>
                          <p>Bank Ref</p>
                        </div>
                        <div>
                          <input
                            type="text"
                            value={bankRef}
                            onChange={(e) => setBankRef(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 mt-3">
                      <div className="parentFormPayment">
                        <div>
                          <p>Local Bank Charges</p>
                        </div>
                        <div>
                          <input
                            type="text"
                            defaultValue="0"
                            value={localBankCharges}
                            onChange={(e) =>
                              setLocalBankCharges(e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 mt-3">
                      <div className="parentFormPayment">
                        <div>
                          <p>THB Paid</p>
                        </div>
                        <div>
                          <input
                            type="text"
                            value={thbPaid}
                            onChange={handleLossGainChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 mt-3">
                      <div className="parentFormPayment">
                        <div>
                          <p>Roundup/Discount</p>
                        </div>
                        <div>
                          <input
                            type="text"
                            value={lossGainOnExchangeRate}
                            onChange={handleLossGainChange1} // Handle user input
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12 mt-3">
                      <div className="parentFormPayment">
                        <div>
                          <p>Notes</p>
                        </div>
                        <div>
                          <textarea
                            type="text"
                            value={notes2}
                            onChange={(e) => setNotes2(e.target.value)}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-4 tableCombinePayment">
                    <div className="tableCreateClient tablepayment">
                      <table>
                        <tr>
                          <th>Check</th>
                          <th> PO Number</th>
                          <th> PO Date </th>
                          <th> Invoice Number</th>
                          <th> Invoice Date</th>
                          <th>PO Amount</th>
                          <th>Debit Amount</th>
                          <th>Net Amount </th>
                          <th>Past Payment</th>
                          <th>Amount To Pay Paid Amount </th>
                        </tr>
                        {paymentTable1?.map((item) => {
                          return (
                            <>
                              <tr>
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={!!checkedItems[item.po_id]}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        item.po_id,
                                        e.target.checked
                                      )
                                    }
                                  />
                                </td>
                                <td> {item.PO_Code}</td>
                                <td>
                                  {" "}
                                  {item.PO_Date ? formatDate(item.PO_Date) : ""}
                                </td>
                                <td> {item.Invoice_Number}</td>
                                <td>
                                  {item.Invoice_Date
                                    ? formatDate(item.Invoice_Date)
                                    : ""}
                                </td>

                                <td> {item.PO_Amount}</td>

                                <td> {item.Debit_Note}</td>
                                <td>{item.Net_Amount}</td>
                                <td>{item.Past_payment}</td>
                                <td>
                                  <input
                                    type="number"
                                    value={paidAmounts[item.po_id] || ""}
                                    onChange={(e) =>
                                      handlePaidAmountChange(
                                        item.po_id,
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                              </tr>
                            </>
                          );
                        })}
                      </table>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={handleSubmit1}
                    className="btn btn-primary"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>

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
                    <div className="col-lg-7">
                      <div className="row g-3">
                        <div className="col-xl-3 col-lg-4 col-md-6">
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
                        <div className="col-xl-3 col-lg-4 col-md-6 autoComplete">
                          <div className="parentFormPayment">
                            <p> {t("fx")}</p>
                            <Autocomplete
                              disablePortal
                              options={currency}
                              getOptionLabel={(option) => option.FX}
                              sx={{ width: 300 }}
                              onChange={(event, newValue) =>
                                handleChange5("fx", newValue?.FX || "")
                              }
                              value={
                                (currency || []).find(
                                  (c) => c.FX === paymentForm.fx
                                ) || null
                              }
                              renderInput={(params) => (
                                <TextField {...params} placeholder="Fx" />
                              )}
                            />
                          </div>
                        </div>

                        <div className="col-xl-3 col-lg-4 col-md-4">
                          <div className="parentFormPayment autoComplete">
                            <p> {t("paymentChannel")}</p>
                            <Autocomplete
                              disablePortal
                              options={paymentChannle || []}
                              value={
                                (paymentChannle || []).find(
                                  (channel) =>
                                    channel.bank_id ===
                                    paymentForm.paymentChannel
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
                        <div className="col-xl-3 col-lg-4 col-md-4">
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
                        <div className="col-xl-3 col-lg-4 col-md-4">
                          <div className="parentFormPayment">
                            <p> {t("clientPaymentRef")}</p>
                            <input
                              type="text"
                              value={paymentForm.clientPaymentRef}
                              onChange={(e) =>
                                handleChange5(
                                  "clientPaymentRef",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-4">
                          <div className="parentFormPayment">
                            <p> {t("interBankCharges")}</p>
                            <input
                              type="text"
                              value={paymentForm.interBankCharges}
                              onChange={(e) =>
                                handleChange5(
                                  "interBankCharges",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-4">
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
                        <div className="col-xl-3 col-lg-4 col-md-4">
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
                        <div className="col-xl-3 col-lg-4 col-md-4">
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

                        <div className="col-xl-3 col-lg-4 col-md-4">
                          <div className="parentFormPayment">
                            <p> {t("localBankCharges")}</p>
                            <input
                              type="text"
                              value={paymentForm.localBankCharges}
                              onChange={(e) =>
                                handleChange5(
                                  "localBankCharges",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="col-xl-3 col-lg-4 col-md-4">
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
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-4">
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
                    <div className="col-lg-3">
                      <div className="flex totalBefore">
                        <div className="pe-3" style={{ width: "85%" }}>
                          <div className="flexBefore">
                            <div>
                              <strong> {t("averageRate")} </strong>
                            </div>
                            <div>
                              <span>
                                {Number(depositAvailableNew) +
                                  Number(paymentAmmountNew)}
                              </span>
                            </div>
                          </div>
                          <div className="flexBefore">
                            <div>
                              <strong> {t("totalBeforeTax")} </strong>
                            </div>
                            <div>
                              <span>
                                {Number(depositAvailableNew) +
                                  Number(paymentAmmountNew)}
                              </span>
                            </div>
                          </div>
                          <div className="flexBefore">
                            <div>
                              <strong> {t("vat")} : </strong>
                            </div>
                            <div>
                              <span>
                                {" "}
                                {(
                                  (Number(depositAvailableNew) +
                                    Number(paymentAmmountNew)) *
                                  Number(vatNew)
                                ).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className="flexBefore">
                            <div>
                              <strong> {t("wht")} : </strong>
                            </div>
                            <div>
                              <span>
                                {(
                                  (Number(depositAvailableNew) +
                                    Number(paymentAmmountNew)) *
                                  Number(whtNew)
                                ).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className=" form-group">
                            <div className="flexBefore">
                              <div>
                                <strong> {t("rounding")} : </strong>
                              </div>
                              <div>
                                <span>
                                  {Number(roundingNew1) + Number(roundingNew)}
                                </span>
                              </div>
                            </div>
                            <div className="flexBefore">
                              <div>
                                <strong> {t("deposit")} : </strong>
                              </div>
                              <div>
                                <span>{Number(depositAvailableNew)}</span>
                              </div>
                            </div>

                            <div className="flexBefore">
                              <div>
                                <strong> {t("amountToPay")} : </strong>{" "}
                              </div>

                              <div>
                                <span>
                                  {(
                                    Number(paymentAmmountNew) +
                                    (Number(paymentAmmountNew) +
                                      Number(depositAvailableNew)) *
                                      Number(vatNew) -
                                    (Number(paymentAmmountNew) +
                                      Number(depositAvailableNew)) *
                                      Number(whtNew) +
                                    (Number(roundingNew1) + Number(roundingNew))
                                  ).toFixed(2)}
                                </span>
                              </div>
                            </div>
                            <div className="flexBefore">
                              <div>
                                <strong>{t("remainder")} : </strong>{" "}
                              </div>

                              <div>
                                <span>
                                  {(
                                    (Number(totalBeforText) -
                                      (Number(depositAvailableNew) +
                                        Number(paymentAmmountNew))) *
                                    (1 + Number(vatNew))
                                  ).toFixed(2)}
                                </span>
                              </div>
                            </div>
                            <div className="flexBefore">
                              <div>
                                <strong>{t("lossGainFx")} : </strong>{" "}
                              </div>

                              <div>
                                <span>
                                  {(
                                    (Number(totalBeforText) -
                                      (Number(depositAvailableNew) +
                                        Number(paymentAmmountNew))) *
                                    (1 + Number(vatNew))
                                  ).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-2 mt-3">
                      <div className="parentFormPayment">
                        <p> {t("notes")}</p>
                        <textarea
                          value={paymentForm.notes}
                          onChange={(e) =>
                            handleChange5("notes", e.target.value)
                          }
                        ></textarea>
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
                </div>
              </div>
            </div>
          </div>
          {/* paymentIcon end */}

          {/* paymentIcon */}
          <div
            className="modal fade "
            id="modalCombine2"
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modalShipTo modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    Payment
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
                        {/* Payment Date */}
                        <div className="col-lg-6">
                          <div className="parentFormPayment">
                            <p>Payment Date</p>
                            <DatePicker
                              selected={selectedPaymentDate}
                              onChange={(date) => setSelectedPaymentDate(date)}
                              dateFormat="dd/MM/yyyy"
                              placeholderText="Click to select a date"
                              customInput={<CustomInput />}
                            />
                          </div>
                        </div>

                        {/* Payment Channel */}
                        <div className="col-lg-6">
                          <div className="parentFormPayment autoComplete">
                            <p>Payment Channel</p>
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
                                setSelectedPaymentChannel(
                                  newValue?.bank_id || ""
                                )
                              }
                              sx={{ width: 300 }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Search Payment Channel"
                                  InputLabelProps={{ shrink: false }}
                                />
                              )}
                            />
                          </div>
                        </div>

                        {/* Bank Ref */}
                        <div className="col-lg-6 mt-3">
                          <div className="parentFormPayment">
                            <p>Bank Ref</p>
                            <input
                              type="text"
                              value={bankReference}
                              onChange={(e) => setBankReference(e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Bank Charges */}
                        <div className="col-lg-6 mt-3">
                          <div className="parentFormPayment">
                            <p>Bank Charges</p>
                            <input
                              type="text"
                              value={bankChargeAmount}
                              onChange={(e) =>
                                setBankChargeAmount(e.target.value)
                              }
                            />
                          </div>
                        </div>

                        {/* Available Deposit */}
                        <div className="col-lg-6 mt-3">
                          <div className="parentFormPayment">
                            <p>Available Deposit</p>
                            <input
                              type="text"
                              value={depositAvailable}
                              onChange={(e) =>
                                setDepositAvailable(e.target.value)
                              }
                            />
                          </div>
                        </div>

                        {/* Rounding */}
                        <div className="col-lg-6 mt-3">
                          <div className="parentFormPayment">
                            <p>Rounding</p>
                            <input
                              type="text"
                              value={roundingAmount}
                              onChange={(e) =>
                                setRoundingAmount(e.target.value)
                              }
                            />
                          </div>
                        </div>

                        {/* Payment Amount */}
                        <div className="col-lg-6 mt-3">
                          <div className="parentFormPayment">
                            <p>Payment Amount</p>
                            <input
                              ref={inputRef} // Assign input ref
                              type="text"
                              value={totalPaymentAmount}
                              onChange={handleChangeAmount}
                            />
                          </div>
                        </div>

                        {/* Notes */}
                        <div className="col-lg-6 mt-3">
                          <div className="parentFormPayment">
                            <p>Notes</p>
                            <textarea
                              type="text"
                              value={paymentNotes}
                              onChange={(e) => setPaymentNotes(e.target.value)}
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="flex ps-3 pt-5 mt-4 totalBefore">
                        <div className="pe-3" style={{ width: "85%" }}>
                          <div className="flexBefore">
                            <div>
                              <strong>Total Before Tax : </strong>
                            </div>
                            <div>
                              <span>3,000.00</span>
                            </div>
                          </div>
                          <div className="flexBefore">
                            <div>
                              <strong>VAT : </strong>
                            </div>
                            <div>
                              <span>210</span>
                            </div>
                          </div>
                          <div className="flexBefore">
                            <div>
                              <strong>WHT : </strong>
                            </div>
                            <div>
                              <span>90</span>
                            </div>
                          </div>
                          <div className=" form-group">
                            <div className="flexBefore">
                              <div>
                                <strong>Rounding : </strong>
                              </div>
                              <div>
                                <span> 0</span>
                              </div>
                            </div>
                            <div className="flexBefore">
                              <div>
                                <strong>Deposit : </strong>
                              </div>
                              <div>
                                <span> 0</span>
                              </div>
                            </div>
                            <div className="flexBefore">
                              <div>
                                <strong>Amount to Pay : </strong>{" "}
                              </div>
                              <div>
                                <span>3,120.00</span>
                              </div>
                            </div>
                            <div className="flexBefore">
                              <div>
                                <strong>Remainder : </strong>{" "}
                              </div>
                              <div>
                                <span>0</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={submitPaymentDataPayNow}
                    className="btn btn-primary"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* paymentIcon end */}
          <div
            className="modal fade freightModalCreate "
            id="exampleModal2"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog  ">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    {t("statement")}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={handleModalClose}
                  >
                    <i className="mdi mdi-close" />
                  </button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-lg-12 form-group mb-2">
                      <h6>{t("vendor")}</h6>
                      <div className="ceateTransport">
                        <Autocomplete
                          disablePortal
                          options={clients || []} // Ensure options is always an array
                          value={
                            (clients || []).find(
                              (client) => client.ID === clientId
                            ) || null
                          } // Safeguard against undefined
                          getOptionLabel={(option) => option.name || ""} // Handle cases where option.name might be undefined
                          onChange={(e, newValue) =>
                            setClientId(newValue?.ID || "")
                          } // Update state on selection
                          sx={{ width: 300 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Search Vendor"
                              InputLabelProps={{ shrink: false }}
                            />
                          )}
                        />
                      </div>
                    </div>

                    <div className="col-lg-12 form-group borderInputUnset mb-2">
                      <h6>{t("from")}</h6>
                      {/* <input
                        className="form-control"
                        type="date"
                        id="fromDate"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                      /> */}
                      <DatePicker
                        selected={fromDate}
                        onChange={(date) => setFromDate(date)}
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        placeholderText="DD/MM/YYYY"
                        customInput={<CustomInput />}
                      />
                    </div>
                    <div className="col-lg-12 form-group borderInputUnset mb-2">
                      <h6>{t("to")}</h6>
                      {/* <input
                        type="date"
                        className="form-control"
                        id="toDate"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                      /> */}
                      <DatePicker
                        selected={toDate}
                        onChange={(date) => setToDate(date)}
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        placeholderText="DD/MM/YYYY"
                        customInput={<CustomInput />}
                      />
                    </div>
                    <div className="col-lg-12 form-group borderInputUnset mb-2">
                      <h6>{t("chronological")}</h6>

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
                <div className="modal-footer justify-content-center">
                  <button
                    type="button"
                    className="UpdatePopupBtn btn btn-primary "
                    onClick={handleSubmit}
                  >
                    {t("submit")}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* {/ combine modal /} */}
          <div
            className="modal fade "
            id="modalCombine1"
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modalShipTo  modal-xl">
              <div className="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">
                    {t("combined_payment")}
                  </h1>
                  <button
                    type="button"
                    onClick={dataAllClearVender}
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <i class="mdi mdi-close"></i>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="parentFormPayment autoComplete">
                        <p> {t("vendor")} </p>
                        <Autocomplete
                          disablePortal
                          options={
                            vendorList?.map((vendor) => ({
                              id: vendor.ID,
                              name: vendor.name,
                            })) || []
                          } // Ensure options are always an array with { id, name }
                          getOptionLabel={(option) => option.name || ""} // Display the client name
                          value={
                            vendorList
                              ?.map((vendor) => ({
                                id: vendor.ID,
                                name: vendor.name,
                              }))
                              .find((option) => option.id === clientId2) || null
                          } // Match the selected value correctly
                          onChange={(e, newValue) =>
                            setClientId2(newValue?.id || "")
                          } // Set the selected client ID
                          sx={{ width: 300 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={t("selectConsignee")}
                              InputLabelProps={{ shrink: false }} // Prevents floating label
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="parentFormPayment">
                        <div>
                          <p> {t("combinedPaymentDate")} </p>
                        </div>
                        <div>
                          <DatePicker
                            selected={formData.paymentDate}
                            onChange={(date) =>
                              setFormData((prev) => ({
                                ...prev,
                                paymentDate: date,
                              }))
                            }
                            dateFormat="dd/MM/yyyy"
                            placeholderText={t("selectDate")}
                            customInput={<CustomInput />}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="parentFormPayment">
                        <div>
                          <p>{t("dueDate")}</p>
                        </div>
                        <div>
                          <DatePicker
                            selected={formData.dueDate}
                            onChange={(date) =>
                              setFormData((prev) => ({
                                ...prev,
                                dueDate: date,
                              }))
                            }
                            dateFormat="dd/MM/yyyy"
                            placeholderText={t("selectDate")}
                            customInput={<CustomInput />}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mt-4 tableCombinePayment">
                  <div className="tableCreateClient tableLr tablepayment">
                    <table>
                      <tr>
                        <th style={{ width: "80px" }}>
                          <input
                            type="checkbox"
                            checked={parentChecked}
                            onChange={handleParentChange}
                          />
                        </th>
                        <th style={{ width: "130px" }}> {t("cpnNumber")}</th>
                        <th style={{ width: "130px" }}>{t("issueDate")} </th>
                        <th style={{ width: "130px" }}>{t("dueDate")} </th>
                        <th style={{ width: "150px" }} className="text-center">
                          {t("totalBeforeTax")}
                        </th>
                        <th style={{ width: "150px" }} className="text-center">
                          {t("pastPayment")}
                        </th>
                        <th style={{ width: "150px" }} className="text-center">
                          {t("netPayable")}
                        </th>
                        <th className="text-center" style={{ width: "150px" }}>
                          {t("fx")}
                        </th>
                        <th style={{ width: "150px" }} className="text-center">
                          {t("amountToPay")}
                        </th>
                      </tr>

                      {paymentTableVender?.map((child, index) => (
                        <tr key={index}>
                          <td style={{ textAlign: "center" }}>
                            <input
                              type="checkbox"
                              checked={!!childChecked[index]} // Use index for correct selection
                              onChange={() => handleChildChange(index)}
                            />
                          </td>
                          <td>{child.POCODE}</td>

                          <td className="text-center">
                            {new Date(child.PO_date).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </td>
                          <td className="text-center">
                            {" "}
                            {new Date(child.Due_Date).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </td>
                          <td className="text-end">
                            {formatTwoDecimal.format(child.Total_Before_Tax)}
                          </td>
                          <td className="text-end">
                            {formatTwoDecimal.format(child.Payment_amount)}
                          </td>
                          <td className="text-end">
                            {formatTwoDecimal.format(child.Payable)}
                          </td>
                          <td className="text-center">THB</td>
                          <td className="pe-3">
                            <input
                              type="number"
                              value={amountToPay[index] ?? ""}
                              onChange={(e) =>
                                handleAmountChange2(index, e.target.value)
                              }
                              onBlur={() => {
                                // Optional: auto-convert to 0 if empty
                                if (!amountToPay[index]) {
                                  handleAmountChange2(index, 0);
                                }
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </table>
                  </div>
                  <div className="flex justify-content-end mt-4 totalBefore">
                    <div className="pe-3">
                      <div className="flexBefore">
                        <div>
                          <strong>{t("totalBeforeTax")} </strong>
                        </div>
                        <div>
                          <span> {formatNumber(TotalBeforeTaxTotal ?? 0)}</span>
                        </div>
                      </div>
                      <div className="flexBefore">
                        <div>
                          <strong>{t("vat")}: </strong>{" "}
                        </div>
                        <div>
                          <span>{formatNumber(VATTotal ?? 0)}</span>
                        </div>
                      </div>

                      <div className="flexBefore">
                        <div>
                          <strong>{t("wht")}: </strong>{" "}
                        </div>
                        <div>
                          <span>{formatNumber(WHTTotal ?? 0)}</span>
                        </div>
                      </div>
                      <div className=" form-group">
                        <div className="parentFormPayment d-flex">
                          <div className="me-3">
                            <strong>{t("rounding")}:</strong>
                          </div>

                          <input
                            type="number"
                            name="rounding"
                            value={roundingData}
                            onChange={handleRoundingChange}
                            onBlur={handleRoundingBlur}
                          />
                        </div>
                        <div className="flexBefore">
                          <div>
                            <strong>{t("amountToPay")}: </strong>{" "}
                          </div>
                          <div>
                            <span>
                              {formatNumber(
                                (TotalBeforeTaxTotal ?? 0) + // Summed checked Total_Before_Tax
                                  (VATTotal ?? 0) - // Summed checked VAT
                                  (WHTTotal ?? 0) + // Summed checked WHT
                                  (Number(roundingData) || 0) // Summed checked Rounding, ensuring it's a number
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={handleSubmitVenderData}
                    className="btn btn-primary"
                  >
                    {t("submit")}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      // setMode("cpn");
                      handleSubmitVenderDataPayNow();
                    }}
                    className="btn btn-primary"
                    style={{ width: "125px" }}
                  >
                    {t("payNow")}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* {/ combine modal /} */}
        </div>
        <Box sx={{ minWidth: 120 }} className="purchaseHere selectActive">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{t("status")}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
              label="Status"
              onChange={handleChange1}
            >
              {/* <MenuItem value="4">All</MenuItem> */}
              <MenuItem value="1">{t("paid")}</MenuItem>
              <MenuItem value="0">{t("notPaid")}</MenuItem>
              {/* <MenuItem value="2">Shipped</MenuItem> */}
            </Select>
          </FormControl>
        </Box>
        <TableView
          columns={columns}
          data={data || []}
          customElement={
            <div>
              <div className="flex flex-wrap justify-center text-center gap-2">
                <div
                  className="modal fade"
                  id="exampleModal"
                  tabIndex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog ">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                          PO Status Report
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        >
                          <i className="mdi mdi-close" />
                        </button>
                      </div>
                      <div className="modal-body">
                        <div className="row">
                          <div className="col-lg-12 form-group">
                            <h6>Vendor</h6>
                            <div className="ceateTransport">
                              <select name="" id="" className="form-select">
                                <option value="">All</option>
                                <option value="">
                                  Excel Transport International Co., Ltd.
                                </option>
                              </select>
                            </div>
                          </div>
                          <div className="col-lg-6 form-group">
                            <h6>From</h6>
                            <input type="date" className="form-control" />
                          </div>

                          <div className="col-lg-6 form-group">
                            <h6>To</h6>
                            <input className="form-control" type="date" />
                          </div>
                          <div className="col-lg-6 form-group">
                            <h6>Paid</h6>
                            <div className="ceateTransport">
                              <select name="" id="" className="form-select">
                                <option value="">SCB</option>
                                <option value="">K Bank </option>
                              </select>
                            </div>
                          </div>

                          <div className="col-lg-6 form-group RadioInvocie">
                            <h6>Payment Status</h6>
                            <div style={{ textAlign: "left" }}>
                              <input
                                type="radio"
                                id="html"
                                name="fav_language"
                                value="HTML"
                              />
                              <label htmlFor="html" className="pe-3">
                                Paid
                              </label>
                              <input
                                type="radio"
                                id="css"
                                name="fav_language"
                                value="CSS"
                              />
                              <label htmlFor="css">Non Paid</label>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="UpdatePopupBtn btn btn-primary"
                        >
                          Generate
                        </button>
                      </div>
                      <div className="modal-footer"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        />
      </Card>
      <div
        className="modal fade"
        id="modalClaim"
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
                Claim
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
              <div className="claimParent row">
                <div className="col-lg-3">
                  <strong> {t("poNumber")} : </strong>
                  <span>{claimPageData.POCODE}</span>
                </div>
                <div className="col-lg-3">
                  <strong>{t("vendor")} :</strong>{" "}
                  <span>{claimPageData.Vendor_name}</span>
                </div>

                <div className="col-lg-3">
                  <strong> {t("currency")} : </strong>{" "}
                  <span>{claimPageData.currency}</span>
                </div>
              </div>
              <div className="uploadFileMain">
                <div className="claimDateMargin">
                  <p>
                    <strong>{t("claimDate")}</strong>
                  </p>
                  {/* <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                  /> */}
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) =>
                      handleDateChange({
                        target: {
                          value: date,
                        },
                      })
                    }
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/MM/yyyy"
                    customInput={<CustomInput />} // Optional: only include if you have a custom input
                  />
                </div>
                <div className="parentInsideUp">
                  <div>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChangeInv}
                    />
                  </div>

                  <div>
                    {invImage && (
                      <img
                        src={invImage}
                        alt="Uploaded"
                        style={{ width: "300px", height: "auto" }}
                      />
                    )}

                    {pdfName && <p style={{ maxWidth: "200PX" }}> {pdfName}</p>}
                  </div>
                </div>
              </div>
              <div className="tableClaim">
                <table>
                  <thead>
                    <tr>
                      <th> {t("itf")}</th>
                      <th> {t("quantity")}</th>
                      <th> {t("unit")}</th>
                      <th> {t("numberBox")}</th>
                      <th> {t("lineTotal")}</th>
                      <th>{t("claimQuantity")}</th>
                      <th>{t("unit")}</th>
                      <th> {t("amount")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claimTable.map((item, index) => (
                      <tr key={index}>
                        <td>{item.produceENname}</td>
                        <td>{item.Qty}</td>
                        <td>{item.Name_EN}</td>
                        <td>{item.Crates}</td>
                        <td>{item.Qty * item.pod_price}</td>
                        <td>
                          <input
                            type="number"
                            value={paidAmounts1[item.pod_id] || ""}
                            onChange={(e) =>
                              handlePaidAmountChange1(
                                item.pod_id,
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <div className="selectInvoiceView parentFormPayment autoComplete">
                            <select
                              name="unit_id"
                              value={units[item.pod_id] || ""} // Ensure it uses `units` state
                              onChange={(e) =>
                                handleUnitChange(item.pod_id, e.target.value)
                              }
                            >
                              <option value="" disabled>
                                Select
                              </option>{" "}
                              {/* Placeholder option */}
                              {unit?.map((unit) => (
                                <option key={unit.ID} value={unit.ID}>
                                  {unit.Name_EN}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td>
                          <input
                            type="number"
                            value={amounts[item.pod_id] || ""}
                            onChange={(e) =>
                              handleAmountChange1(item.pod_id, e.target.value)
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
                onClick={handleSubmit3}
              >
                {t("submit")}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* create modal strat */}
      <div
        className="modal fade "
        id="exampleModalCreate"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modalShipTo  modal-xl">
          <div className="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Purchase Order Create
              </h1>
              <button
                type="button"
                onClick={dataAllClear}
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i class="mdi mdi-close"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="tab-conten md:!px-4">
                <div className="tab-pane active" id="header" role="tabpanel">
                  <div
                    id="datatable_wrapper"
                    className="information_dataTables dataTables_wrapper dt-bootstrap4"
                  >
                    <div className="formCreate">
                      <form action="">
                        <div className="row cratePurchase modalPurchaseCreate">
                          <div className="col-lg-3 form-group parentFormPayment autoComplete">
                            <h6>Vendor</h6>
                            <Autocomplete
                              options={
                                vendorList?.map((vendor) => ({
                                  id: vendor.ID,
                                  name: vendor.name,
                                })) || []
                              } // Map the vendor list to create options with `id` and `name`
                              getOptionLabel={(option) => option.name || ""} // Display the vendor name
                              value={
                                vendorList
                                  ?.map((vendor) => ({
                                    id: vendor.ID,
                                    name: vendor.name,
                                  }))
                                  .find(
                                    (option) => option.id === state.vendor_id
                                  ) || null
                              } // Find the selected vendor by `vendor_id`
                              onChange={(e, newValue) => {
                                setState({
                                  ...state,
                                  vendor_id: newValue?.id || "",
                                  vendor_name: newValue?.name || "",
                                }); // Update `state.vendor_id` with the selected option's `id`
                              }}
                              sx={{ width: 300 }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Select Vendor" // Adds a placeholder
                                  InputLabelProps={{ shrink: false }} // Prevents floating label
                                />
                              )}
                            />
                          </div>
                          <div className="col-lg-3 form-group">
                            <h6>PO Date</h6>
                            <input
                              type="date"
                              name="created"
                              value={state.created}
                              onChange={handleChangeCreate}
                            />
                          </div>
                          <div className="col-lg-3 form-group">
                            <h6>Invoice Number</h6>
                            <input
                              className="w-full"
                              type="text"
                              name="supplier_invoice_number"
                              onChange={handleChangeCreate}
                              value={state.supplier_invoice_number}
                            />
                          </div>
                          <div className="col-lg-3 form-group">
                            <h6>Invoice Date</h6>
                            <input
                              type="date"
                              name="supplier_invoice_date"
                              value={state.supplier_invoice_date}
                              onChange={handleChangeCreate}
                            />
                          </div>
                          <div className="col-lg-3 form-group">
                            <h6>Rounding</h6>
                            <input
                              type="number"
                              name="rounding"
                              value={state.rounding}
                              onChange={handleChangeCreate}
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
                            Add
                          </button>
                        </div>

                        <div
                          id="datatable_wrapper"
                          className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive mt-"
                        >
                          <table
                            id="example"
                            className="display transPortCreate table table-hover table-striped borderTerpProduce table-responsive purchaseCreateTable"
                            style={{ width: "100%" }}
                          >
                            <thead>
                              <tr>
                                <th style={{ width: "170px" }}>Pod Code</th>
                                {/* <th style={{ width: "250px" }}>Type</th> */}
                                <th style={{ width: "350px" }}>Item</th>
                                <th style={{ width: "150px" }}>Quantity</th>
                                <th style={{ width: "100px" }}>Unit</th>
                                <th style={{ width: "150px" }}>Price</th>
                                <th style={{ width: "70px" }}>VAT</th>
                                <th style={{ width: "150px" }}>Total</th>
                                <th style={{ width: "100px" }}>WHT</th>
                                <th style={{ width: "100px" }}>Crate</th>
                                <th style={{ width: "100px" }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>PO-20250307001 </td>
                                <td>Produce</td>
                                <td>0 </td>
                                <td>0 </td>
                                <td>0 </td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>
                                  <button type="button">
                                    <i className="mdi mdi-pencil text-2xl" />
                                  </button>
                                  <button type="button">
                                    <i className="mdi mdi-minus text-2xl" />
                                  </button>
                                </td>
                              </tr>
                              <tr>
                                <td>PO-20250307001 </td>
                                <td>Produce</td>
                                <td>0 </td>
                                <td>0 </td>
                                <td>0 </td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>
                                  <button type="button">
                                    <i className="mdi mdi-pencil text-2xl" />
                                  </button>
                                  <button type="button">
                                    <i className="mdi mdi-minus text-2xl" />
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <button
                    className="btn btn-primary"
                    type="submit"
                    name="signup"
                    onClick={update}
                    disabled={buttonClicked} // Disable button if it has been clicked
                  >
                    {t("crate")}
                  </button>

                  <button
                    className="btn btn-primary"
                    type="submit"
                    name="signup"
                    onClick={cancelOrder}
                  >
                    {t("cancel")}
                  </button>
                </div>
              </div>
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
            </div>
            <div className="modal-footer py-4">
              {/* <button
                type="button"
                onClick={handleSubmit1}
                className="btn btn-primary"
              >
                Submit
              </button> */}
            </div>
          </div>
        </div>
      </div>
      {/* create modal end */}
      {/* Modal */}
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
              <h3> {t("editDetails")}</h3>
              <p onClick={handleCloseModalOne}>
                <CloseIcon />
              </p>
            </div>
            <div className="formEan formCreate">
              <div className="modal-body modalShipTo p-0 ">
                {/* <h1>hello</h1> */}

                <div className="addMOdalContent formCreate mt-0 px-2">
                  <div className="col-lg-12 autoComplete mb-2 ">
                    <h6> {t("selectItem")}</h6>
                    <Autocomplete
                      disablePortal
                      options={Array.isArray(optionItem) ? optionItem : []}
                      getOptionLabel={(option) =>
                        option.Name_EN || option.Name_TH || ""
                      }
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField {...params} placeholder="Select Item" />
                      )}
                    />
                  </div>
                  <div className="col-lg-12 autoComplete mb-2">
                    <h6> {t("unit")}</h6>
                    <Autocomplete
                      disablePortal
                      options={Array.isArray(unitItem) ? unitItem : []}
                      getOptionLabel={(option) =>
                        option.Name_EN || option.Name_TH || "Unknown Unit"
                      }
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField {...params} placeholder={t("unit")} />
                      )}
                    />
                  </div>
                  <div className="col-lg-12 mb-2">
                    <h6> {t("quantity")}</h6>
                    <input
                      className="mb-0"
                      type="text"
                      name="quantity"
                      value={formDataAdd.quantity || ""}
                      placeholder={t("quantity")}
                      onChange={handleChangeAdd}
                    />
                  </div>
                  <div className="col-lg-12 mb-2">
                    <h6> {t("create")}</h6>
                    <input
                      className="mb-0"
                      type="number"
                      name="crate"
                      value={formDataAdd.crate}
                      placeholder={t("create")}
                      onChange={handleChangeAdd}
                    />
                  </div>

                  <div className="col-lg-12 mb-2">
                    <h6> {t("price")}</h6>
                    <input
                      className="mb-0"
                      type="number"
                      name="price"
                      value={formDataAdd.price}
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
                        name="vat"
                        value={formDataAdd.vat}
                        placeholder={t("vat")}
                        onChange={handleChangeAdd}
                      />
                    </div>

                    <div className="col-lg-6">
                      <h6> {t("wht")}</h6>
                      <input
                        className="mb-0"
                        type="number"
                        name="wht"
                        value={formDataAdd.wht}
                        placeholder={t("wht")}
                        onChange={handleChangeAdd}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-12 mb-2">
                      <h6> {t("total")}</h6>
                      <input
                        className="mb-0"
                        type="number"
                        name="total"
                        value={formDataAdd.total}
                        placeholder={t("total")}
                        onChange={handleChangeAdd}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="UpdatePopupBtn btn btn-primary m-0"
                    onClick={() => console.log("Form Data:", formDataAdd)}
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

      {/* add modal end */}

      <Modal
        className="modalError receiveModal"
        show={show1}
        onHide={handleClose1}
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
              onClick={closeIcon1}
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
                {stock1.Message_EN ? stock1.Message_EN : "NULL"}
              </p>
              <p style={{ backgroundColor: color ? "" : "#631f37" }}>
                {stock1.Message_TH ? stock1.Message_TH : "NULL"}
              </p>
              <div className="closeBtnRece">
                <button onClick={closeIcon1}>{t("close")} </button>
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
                  {"Payment Date is Required "}
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
                <button onClick={closeIcon2}> {t("close")}</button>
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
        show={show3}
        onHide={handleClose3}
      >
        <div className="modal-content">
          <div
            className="modal-header border-0"
            style={{ backgroundColor: color ? "#2f423c" : "" }}
          >
            <h1 className="modal-title fs-5" id="exampleModalLabel5">
              {t("combinedPaymentCheck")}
            </h1>
            <button
              style={{ color: "#fff", fontSize: "30px" }}
              type="button"
              onClick={closeIcon3}
            >
              <i class="mdi mdi-close"></i>
            </button>
          </div>
          <div
            className="modal-body"
            style={{ backgroundColor: color ? "#2f423c" : "" }}
          >
            <div className="eanCheck errorMessage recheckReceive">
              {!clientId2 ? (
                <p style={{ backgroundColor: color ? "" : "#631f37" }}>
                  {"Vender is Required "}
                </p>
              ) : (
                ""
              )}

              {modalErrorMsg ? (
                <>
                  <p style={{ backgroundColor: color ? "" : "#631f37" }}>
                    {modalErrorMsg?.message_en}
                  </p>
                  <p style={{ backgroundColor: color ? "" : "#631f37" }}>
                    {modalErrorMsg?.message_th}
                  </p>
                </>
              ) : (
                ""
              )}

              <div className="closeBtnRece">
                <button onClick={closeIcon3}> {t("close")}</button>
              </div>
            </div>
          </div>
          <div
            className="modal-footer"
            style={{ backgroundColor: color ? "#2f423c" : "" }}
          ></div>
        </div>
      </Modal>
      <div>
        <div
          className="modal fade"
          id="exampleModalCustomization"
          tabIndex={-1}
          aria-labelledby="5"
          aria-hidden="true"
        >
          <div className=" modal-dialog  modalShipTo modalInvoice">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="5">
                  {t("accountModal")}
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
                      <div className="invoiceModal">
                        <h6>{t("copyOptions")} - </h6>
                        <input
                          type="radio"
                          id="html1"
                          name="fav_language"
                          value="Client"
                          checked={selectedInvoice === "Client"}
                          onChange={handleRadioChange}
                        />
                        <label htmlFor="html1"> {t("internalCopy")}</label>

                        <input
                          type="radio"
                          id="css1"
                          name="fav_language"
                          value="Consignee"
                          checked={selectedInvoice === "Consignee"}
                          onChange={handleRadioChange}
                        />
                        <label htmlFor="css1"> {t("clientCopy")}</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={handleSubmit7}
                  className="btn btn-primary mb-4"
                >
                  {t("submit")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Receipt;
