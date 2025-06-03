import axios from "axios";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { API_IMAGE_URL } from "../../Url/Url";
import MySwal from "../../swal";
import { Card } from "../../card";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ChartConsi from "./ChartConsi";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
const CreateClient = () => {
  const location = useLocation();
  const { data: clients } = useQuery("getClientDataAsOptions");
  const { data: consignee } = useQuery("getConsignee");
  const [consignees, setConsignees] = useState([]);
  const [collectPaymentId, setCollectPaymentId] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [consigneeData, setConsigneeData] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [orderItem, setOrderItem] = useState([]);
  const [paymentTable1, setPaymentTable1] = useState([]);
  const [paidAmounts, setPaidAmounts] = useState({});
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [clientId, setClientId] = useState("");
  const [consigneeId, setConsigneeId] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [clientPaymentRef, setClientPaymentRef] = useState("");
  const [paymentChannel, setPaymentChannel] = useState("");
  const [bankRef, setBankRef] = useState("");
  const [fxPayment, setFxPayment] = useState("");
  const [fxRate, setFxRate] = useState("");
  const [fxId, setFxId] = useState("");
  const [intermittentBankCharges, setIntermittentBankCharges] = useState("");
  const [localBankCharges, setLocalBankCharges] = useState("");
  const [thbReceived, setThbReceived] = useState("");
  const [lossGainOnExchangeRate, setLossGainOnExchangeRate] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [shipDate, setShipDate] = useState("");
  const [awbNumber, setAwbNumber] = useState("");
  const [netAmount, setNetAmount] = useState("");
  const [amountToPay, setAmountToPay] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [checkedItems, setCheckedItems] = useState({});
  // new statics
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [dataPeriod, setDataPeriod] = useState([]);
  const [dataComparison, setDataComparison] = useState([]);
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [date3, setDate3] = useState("");
  const [date4, setDate4] = useState("");
  const [consigeeDetails, setconsigeeDetails] = useState("");
  const [selectedcomparison, setSelectedComparison] = useState("");
  const [value, setValue] = useState([]);
  // new statistic end
  const [toDate, setToDate] = useState("");
  console.log(selectedItemId);
  const { from } = location.state || {};
  console.log(from);
  const navigate = useNavigate();
  // new

  const getAllTimePeriod = () => {
    axios.get(`${API_BASE_URL}/statisticsDateSelection1`).then((res) => {
      console.log(res);
      setDataPeriod(res.data.details || []);
    });
  };
  const getComparisonPeriod = () => {
    axios.get(`${API_BASE_URL}/StatisticsDATESelection2`).then((res) => {
      console.log(res);
      setDataComparison(res.data.details || []);
    });
  };
  const getAllProduce = () => {
    axios.get(`${API_BASE_URL}/getAllProduceItem`).then((res) => {
      setValue(res.value.value || []);
    });
  };
  useEffect(() => {
    getAllProduce();
    getAllTimePeriod();
    getComparisonPeriod();
  }, []);
  const confirmData = () => {
    let obj = {
      Produce_ID: selectedProduceId,
      Start_Date: date1,
      Stop_Date: date2,
    };
    console.log("confirm data is", obj);
    // Validate required fields
    if (!selectedProduceId) {
      toast.error("Produce is required");
      return;
    }
    if (!date1) {
      toast.error("Start Date is required");
      return;
    }
    if (!date2) {
      toast.error("Stop Date is required");
      return;
    }
  };
  //new statics end
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
  useEffect(() => {
    if (clientId && consigneeId) {
      paymentTable();
    }
  }, [clientId, consigneeId]);

  const getClientDetails = () => {
    axios
      .post(`${API_BASE_URL}/getClientStatistics`, {
        client_id: from?.client_id,
      })
      .then((res) => {
        console.log(res);

        // setData(res.data.data);
        setConsigneeData(res.data.data);
        setOrderItem(res.data.items);
      })
      .catch((error) => {
        console.log("There was an error fetching the data!", error);
      });
  };
  const paymentTable = () => {
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
    getClientDetails();
  }, []);
  const dataClear2 = () => {
    setFromDate("");
    setToDate("");
    setClientId("");
  };
  const handleSubmit = async () => {
    const payload = {
      client_id: from?.client_id,

      from_date: fromDate,
      to_date: toDate,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/getClientStatement`,
        payload
      );
      console.log(response);
      let modalElement = document.getElementById("modalState");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        const doc = new jsPDF();

        const addLogoWithDetails = async () => {
          doc.setFontSize(17);
          doc.setTextColor(0, 0, 0);
          doc.text(`Statement`, 125, 11.5);
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(0, 0, 0);
          doc.text(`Start Date:${fromDate}`, 166.5, 9);
          doc.text(`End date: ${toDate}`, 166.5, 13);
          doc.text(`Printed On :${formatDate(new Date())}`, 166.5, 17);
        };
        doc.setFillColor(32, 55, 100);
        doc.rect(7, 19, doc.internal.pageSize.width - 15, 0.5, "FD");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text("Invoice to", 7, 24);
        // doc.text("Consignee Details", 127.2, 24);

        doc.setFillColor(32, 55, 100);
        doc.setFontSize(11);
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
          return startY + lines.length * lineHeight; // Return the new Y position after rendering the text
        }

        function renderWrappedText2(
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

        // First set of texts
        const maxWidth1 = 72;
        const startX1 = 7;
        let startY1 = 29;
        const lineHeight1 = 4.2;
        const longText1_1 = `${from?.client_name}(${from?.client_tax_number})`;
        const longText1_2 = `${from?.client_address}`;
        const longText1_3 = `${from?.client_email} / ${from?.client_phone}`;

        startY1 = renderWrappedText1(
          doc,
          longText1_1,
          startX1,
          startY1,
          maxWidth1,
          lineHeight1
        );
        doc.setFontSize(10);
        startY1 = renderWrappedText1(
          doc,
          longText1_2,
          startX1,
          startY1,
          maxWidth1,
          lineHeight1
        );
        startY1 = renderWrappedText1(
          doc,
          longText1_3,
          startX1,
          startY1,
          maxWidth1,
          lineHeight1
        );

        // Consignee detail
        const maxWidth2 = 72;
        const startX2 = 127.2;
        let startY2 = 29;
        const lineHeight2 = 4.2;
        // doc.setFontSize(11);

        // const longText2_1 = `${data?.consignee_name}(${data?.consignee_tax_number})`;
        // const longText2_2 = `${data?.consignee_address}`;
        // const longText2_3 = `${data?.consignee_email}/${data?.consignee_phone}`;

        // startY2 = renderWrappedText2(
        //   doc,
        //   longText2_1,
        //   startX2,
        //   startY2,
        //   maxWidth2,
        //   lineHeight2
        // );
        // doc.setFontSize(10);
        // startY2 = renderWrappedText2(
        //   doc,
        //   longText2_2,
        //   startX2,
        //   startY2,
        //   maxWidth2,
        //   lineHeight2
        // );
        // startY2 = renderWrappedText2(
        //   doc,
        //   longText2_3,
        //   startX2,
        //   startY2,
        //   maxWidth2,
        //   lineHeight2
        // );

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
        doc.text("Pre Statement", 7, 60);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Invoices : ", 7, 65);
        doc.text(
          formatter.format(response.data.data?.pre_statement_Invoices),
          24,
          65
        );
        doc.text("Claim : ", 58, 65);
        doc.text(
          formatter.format(response.data.data?.pre_statement_claims),
          71,
          65
        );
        doc.text("Payment : ", 100, 65);
        doc.text(
          formatter.format(response.data.data?.pre_statement_payments),
          119,
          65
        );
        doc.text("Total : ", 150, 65);
        doc.text(
          formatter.format(response.data.data?.pre_statement_Totals),
          162,
          65
        );
        await addLogoWithDetails();
        let yTop = 67;
        const rows = response?.data?.result.map((item, index) => ({
          index: formatDate(item.Date_),
          AWB: item.AWB,
          Transaction_Ref: item.Transaction_Ref,
          Currnecy: item.Currnecy,
          Invocied_Amount: item.Invocied_Amount,
          Paid_Amount: item.Paid_Amount,
          Client_Reference: item.Client_Reference,
          TT_Reference: item.TT_Reference,
        }));
        doc.autoTable({
          head: [
            [
              "Date",
              "AWB / BL",
              "Transaction Ref",
              "Currency",
              "Invoiced Amount",
              "Paid Amount",
              "Client Reference",
              "TT Reference",
            ],
          ],
          body: rows.map((row) => [
            row.index,
            row.AWB,
            row.Transaction_Ref,
            row.Currnecy,
            row.Invocied_Amount,
            row.Paid_Amount,
            row.Client_Reference,
            row.TT_Reference,
          ]),
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
            0: { halign: "left" },
            1: { halign: "left", cellWidth: 20, overflow: "linebreak" },
            2: { halign: "left", cellWidth: 30, overflow: "linebreak" },
            3: { halign: "center" },
            4: { halign: "right", cellWidth: 20 },
            5: { halign: "right" },
            6: { halign: "right", cellWidth: 30, overflow: "linebreak" },
            7: { halign: "right", cellWidth: 30, overflow: "linebreak" },
          },
        });

        yTop = doc.autoTable.previous.finalY + 1;
        const finalY = doc.autoTable.previous.finalY + 4;
        // middle part

        const valueWidth = 20; // Set the fixed width for the value column

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);

        // Invoices
        doc.text(`Invoices :  `, 75, finalY + 1);
        doc.text(
          formatter.format(response.data.data?.statement_Invoices),
          105 +
            valueWidth -
            doc.getTextWidth(
              formatter.format(response.data.data?.statement_Invoices)
            ),
          finalY + 1
        );

        // Claims
        doc.text(`Claims :`, 75, finalY + 5);
        doc.text(
          formatter.format(response.data.data?.statement_claims),
          105 +
            valueWidth -
            doc.getTextWidth(
              formatter.format(response.data.data?.statement_claims)
            ),
          finalY + 5
        );

        // Payments
        doc.text(`Payments :`, 75, finalY + 9);
        doc.text(
          formatter.format(response.data.data?.statement_payments),
          105 +
            valueWidth -
            doc.getTextWidth(
              formatter.format(response.data.data?.statement_payments)
            ),
          finalY + 9
        );

        // Line
        doc.rect(75, finalY + 11, 50, 0.5, "FD");

        // Total
        doc.text("Total :", 75, finalY + 16);
        doc.text(
          formatter.format(response.data.data?.statement_Totals),
          105 +
            valueWidth -
            doc.getTextWidth(
              formatter.format(response.data.data?.statement_Totals)
            ),
          finalY + 16
        );

        // bottom part
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Total History", 7, finalY + 20);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Invoices : ", 7, finalY + 24);
        doc.text(
          formatter.format(response.data.data?.Total_Invoices),
          24,
          finalY + 24
        );
        doc.text("Claim : ", 58, finalY + 24);
        doc.text(
          formatter.format(response.data.data?.Total_Claims),
          71,
          finalY + 24
        );
        doc.text("Payment : ", 100, finalY + 24);
        doc.text(
          formatter.format(response.data.data?.Total_Payment),
          119,
          finalY + 24
        );
        doc.text("Total : ", 150, finalY + 24);
        doc.text(formatter.format(response.data.data?.Total), 162, finalY + 24);
        // page number
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
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
        // Upload the PDF to the server
        await uploadPDF(pdfBlob);

        modalInstance.hide();
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
    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${from?.client_name || "default"}_Statement_${formatDate(
        new Date()
      )}.pdf`
    );
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${from?.client_name}_Statement_${formatDate(
            new Date()
          )}.pdf`
        );
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

  const newFormatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
  });
  const newFormatter3 = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 3,
  });
  const [state, setState] = useState({
    consignee_id: from?.consignee_id || "",
    CODE: from?.CODE || "",
    brand: from?.brand || "",
    client_id: from?.client_id || "",
    client_name: from?.client_name || "",
    client_tax_number: from?.client_tax_number || "",
    client_email: from?.client_email || "",
    client_phone: from?.client_phone || "",
    client_address: from?.client_address || "",
    Default_location: from?.Default_location || "",
    currency: from?.currency || "",
    port_of_orign: from?.port_of_orign || "",
    destination_port: from?.destination_port || "",

    Commission_Currency: from?.Commission_Currency || "FX",
    liner_Drop: from?.liner_Drop || "",
    profit: from?.profit || "",
    rebate: from?.rebate || "",
    commission: from?.commission || "",
    commission_value: from?.commission_value || "",
    notify_name: from?.notify_name || "",
    notify_tax_number: from?.notify_tax_number || "",
    notify_email: from?.notify_email || "",
    client_email: from?.client_email || "",

    notify_phone: from?.notify_phone || "",
    client_phone: from?.client_phone || "",

    notify_address: from?.notify_address || "",
    user_id: localStorage.getItem("id"),
    // bank_name: from?.bank_name || "",
    // account_name: from?.account_name || "",
    // account_number: from?.account_number || "",
    client_bank_account: from?.client_bank_account || "",
    client_bank_name: from?.client_bank_name || "",
    client_bank_number: from?.client_bank_number || "",
  });
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? (checked ? "THB" : "FX") : value;
    setState((prevState) => ({
      ...prevState,
      [name]: name === "Commission_Currency" && value === "" ? "FX" : newValue,
    }));
  };
  const [dataCustomization, setDataCustomization] = useState({
    Client_ID: from?.client_id || "",
    Consignee_id: from?.consignee_id || null,
    ITF: "",
    Custom_Name: "",
    Dummy_Price: "",
  });
  const { data: brands } = useQuery("getBrand");
  const { data: paymentChannle } = useQuery("PaymentChannela");

  const { data: client } = useQuery("getAllClients");
  const { data: getItf } = useQuery("getItf");
  console.log(getItf);
  const { data: port } = useQuery("getAllAirports");
  const { data: liner } = useQuery("getLiner");
  const { data: commission } = useQuery("getDropdownCommissionType");
  const { data: locations } = useQuery("getLocation");
  const { data: contactType } = useQuery("DropdownContactType ");
  const [state1, setState1] = useState({
    client_id: from?.client_id || "",
    contact_type_id: "",
    contact_id: "",
    consignee_id: from?.consignee_id || null, // Assuming you want to capture this in the form as well
    first_name: "",
    last_name: "",
    position: "",
    Email: "",
    mobile: "",
    landline: "",
    birthday: "",
    Notes: "",
    Nick_name: "",
  });
  const handleChange1 = (e) => {
    const { name, value } = e.target;
    setState1((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const summaryTable = async (Payment_ID) => {
    const dataToSubmit = paymentTable1
      .filter((item) => checkedItems[item.transaction_ref]) // Filter only checked items
      .map((item) => ({
        Invoice_ID: item.invoice_id,
        FX_Payment: paidAmounts[item.transaction_ref] || 0,
        Payment_ID: Payment_ID,
      }));

    try {
      const response = await axios.post(
        `${API_BASE_URL}/insertInvoicePayment`,
        {
          datas: dataToSubmit,
        }
      );
      console.log(response);
      // Handle successful response
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const handleSubmit1 = async () => {
    // Calculate totalPaidAmount based on checked rows
    const totalPaidAmount = paymentTable1.reduce((total, item) => {
      if (checkedItems[item.transaction_ref]) {
        return total + (parseFloat(paidAmounts[item.transaction_ref]) || 0);
      }
      return total;
    }, 0);

    // Convert fxPayment to float for accurate comparison
    const parsedFxPayment = parseFloat(fxPayment);
    console.log(parsedFxPayment.toFixed(2));
    console.log(totalPaidAmount.toFixed(2));

    // Check if parsedFxPayment is not equal to totalPaidAmount
    if (parsedFxPayment.toFixed(2) !== totalPaidAmount.toFixed(2)) {
      toast.error("Total Paid Amount does not match FX Payment value.");
      return;
    }

    // Filter and map selected payment details for submission
    const selectedPaymentDetails = paymentTable1
      .filter((item) => checkedItems[item.transaction_ref])
      .map((item) => ({
        transaction_ref: item.transaction_ref,
        Ship_date: item.Ship_date,
        awb: item.awb,
        CNF_FX: item.CNF_FX,
        amount_to_Pay: item.amount_to_Pay,
        paidAmount: paidAmounts[item.transaction_ref] || 0,
      }));

    // Prepare payment data object
    const paymentData = {
      user_id: localStorage.getItem("id"),
      Client_id: clientId,
      Consignee_ID: consigneeId,
      Payment_date: paymentDate,
      Payment_Channel: paymentChannel,
      FX_Payment: parsedFxPayment, // Use parsedFxPayment instead of fxPayment
      FX_ID: fxId,
      FX_Rate: fxRate,
      Intermittent_bank_charges: intermittentBankCharges,
      Local_bank_Charges: localBankCharges,
      THB_Received: thbReceived,
      Client_payment_ref: clientPaymentRef,
      Bank_Ref: bankRef,
      paymentDetails: selectedPaymentDetails,
    };

    try {
      // Send POST request to insertClientPayment endpoint
      const response = await axios.post(
        `${API_BASE_URL}/insertClientPayment`,
        paymentData
      );
      console.log("Payment data submitted successfully", response);

      // Update client details and summary table
      getClientDetails();
      setCollectPaymentId(response?.data.data.payment_id);
      summaryTable(response?.data.data.payment_id);

      // Show success toast message
      // toast.success("Payment data submitted successfully");

      // Hide modal after successful submission
      let modalElement = document.getElementById("modalPayment");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        clearAllFields();
        modalInstance.hide();
      }

      // Clear form fields and state after successful submission
      setClientId("");
      setConsigneeId("");
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
      setPaymentTable1([]);
    } catch (error) {
      // Handle error case
      console.error("Error submitting payment data", error);
      toast.error("Something went wrong");
    }
  };
  const clearAllFields = () => {
    setClientId("");
    setConsigneeId("");
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
  };
  const closeData = () => {
    navigate("/clientNew");
    setClientId((prevClientId) => "");
    setConsigneeId((prevConsigneeId) => "");
    console.log(clientId);
    console.log(consigneeId);
    // Update client details and summary table

    setClientId("");
    setConsigneeId("");
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
    setPaymentTable1([]);
  };

  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setDataCustomization((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const { data: currency } = useQuery("getCurrency");
  const [data, setData] = useState([]);
  const [customization, setCustomization] = useState([]);

  const getAllContact = () => {
    axios
      .post(`${API_BASE_URL}/getContactList`, {
        consignee_id: from?.consignee_id,
        client_id: from?.client_id,
      })
      .then((res) => {
        console.log(res);
        setData(res.data.data || []);
      });
  };
  const getAllCustomization = () => {
    axios
      .post(`${API_BASE_URL}/getConsigneeCustomization`, {
        consignee_id: from?.consignee_id,
        client_id: from?.client_id,
      })
      .then((res) => {
        console.log(res);
        setCustomization(res.data.data || []);
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
      console.log(result);
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/DeleteConsigneeCustomization`,
            {
              Customize_id: id,
            }
          );
          console.log(response);
          getAllCustomization();
          toast.success("Order delete successfully");
        } catch (e) {
          toast.error("Something went wrong");
        }
      }
    });
  };
  const deleteOrder1 = (id) => {
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
      console.log(result);
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/DeleteContactDetails`,
            {
              contact_id: id,
            }
          );
          console.log(response);
          getAllContact();
          toast.success("Contact delete successfully");
        } catch (e) {
          toast.error("Something went wrong");
        }
      }
    });
  };
  useEffect(() => {
    getAllContact();
    getAllCustomization();
  }, []);
  const handlePaidAmountChange = (invoiceNumber, value) => {
    setPaidAmounts((prev) => {
      const updatedPaidAmounts = {
        ...prev,
        [invoiceNumber]: value,
      };

      // Calculate the total of all paid amounts for checked items only
      const totalPaidAmount = paymentTable1.reduce((sum, item) => {
        if (checkedItems[item.transaction_ref]) {
          return (
            sum + (parseFloat(updatedPaidAmounts[item.transaction_ref]) || 0)
          );
        }
        return sum;
      }, 0);

      setTotalPaidAmount(totalPaidAmount);
      setFxPayment(totalPaidAmount.toFixed(2));
      return updatedPaidAmounts;
    });
  };

  const dataClear1 = () => {
    setDataCustomization({
      Consignee_id: "",
      ITF: "",
      Custom_Name: "",
      Dummy_Price: "",
    });
  };

  const submitCusomizationData = () => {
    console.log(dataCustomization);
    axios
      .post(
        `${API_BASE_URL}/createConsigneeCustomize`,
        dataCustomization // Use the updated state directly
      )
      .then((response) => {
        console.log(response);
        toast.success("Customization Data Added Successfully", {
          autoClose: 1000,
          theme: "colored",
        });
        getAllCustomization();
        setDataCustomization({
          Consignee_id: from?.consignee_id || "",
          ITF: "",
          Custom_Name: "",
          Dummy_Price: "",
        });
        let modalElement = document.getElementById("exampleModalCustomization");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Network Error", {
          autoClose: 1000,
          theme: "colored",
        });
        return false;
      });
  };
  const update = () => {
    axios
      .post(
        `${API_BASE_URL}/${from?.client_id ? "updateClientData" : "addClient"}`,
        state // Use the updated state directly
      )
      .then((response) => {
        navigate("/clientNew");
        toast.success("Updated", {
          autoClose: 1000,
          theme: "colored",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Network Error", {
          autoClose: 1000,
          theme: "colored",
        });
        return false;
      });
  };
  const customizationDataSubmit = (e) => {
    console.log(dataCustomization);
    e.preventDefault();
    axios
      .post(`${API_BASE_URL}/updateConsigneeCustomize`, dataCustomization)
      .then((response) => {
        console.log(response);
        getAllContact();
        toast.success("Customize Update  Successfully", {
          autoClose: 1000,
          theme: "colored",
        });
        // Close the modal
        getAllCustomization();
        let modalElement = document.getElementById(
          "exampleModalCustomizationEdit"
        );
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        // Clear the form fields
        setDataCustomization({
          Consignee_id: from?.consignee_id || "",
          ITF: "",
          Custom_Name: "",
          Dummy_Price: "",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Network Error", {
          autoClose: 1000,
          theme: "colored",
        });
        return false;
      });
  };

  const dataClear = () => {
    setState1({
      client_id: "",
      contact_type_id: "",
      contact_id: "",
      consignee_id: from?.consignee_id || "",
      first_name: "",
      last_name: "",
      position: "",
      Email: "",
      mobile: "",
      landline: "",
      birthday: "",
      Notes: "",
      Nick_name: "",
    });
  };
  const contactDataSubmit = (e) => {
    e.preventDefault();

    // Check for required fields
    const { contact_type_id, first_name, last_name, Email, mobile } = state1;

    if (!contact_type_id) {
      toast.error("Contact Type is required", {
        autoClose: 1000,
        theme: "colored",
      });
      return;
    }

    if (!first_name) {
      toast.error("First Name is required", {
        autoClose: 1000,
        theme: "colored",
      });
      return;
    }

    if (!last_name) {
      toast.error("Last Name is required", {
        autoClose: 1000,
        theme: "colored",
      });
      return;
    }

    if (!Email) {
      toast.error("Email is required", {
        autoClose: 1000,
        theme: "colored",
      });
      return;
    }

    if (!mobile) {
      toast.error("Mobile number is required", {
        autoClose: 1000,
        theme: "colored",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      toast.error("Invalid email format", {
        autoClose: 1000,
        theme: "colored",
      });
      return;
    }

    // Make the API call if validation passes
    axios
      .post(`${API_BASE_URL}/addContactDetails`, state1)
      .then((response) => {
        console.log(response);
        getAllContact();
        toast.success("Contact added Successfully", {
          autoClose: 1000,
          theme: "colored",
        });

        // Close the modal
        let modalElement = document.getElementById("exampleModalContact");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }

        // Clear the form fields
        setState1({
          client_id: "",
          contact_type_id: "",
          contact_id: "",
          consignee_id: from?.consignee_id || "",
          first_name: "",
          last_name: "",
          position: "",
          Email: "",
          mobile: "",
          landline: "",
          birthday: "",
          Notes: "",
          Nick_name: "",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Network Error", {
          autoClose: 1000,
          theme: "colored",
        });
        return false;
      });
  };

  // const contactDataSubmit = (e) => {
  //   console.log(state1);
  //   e.preventDefault();
  //   axios
  //     .post(`${API_BASE_URL}/addContactDetails`, state1)
  //     .then((response) => {
  //       console.log(response);
  //       getAllContact();
  //       toast.success("Contact added Successfully", {
  //         autoClose: 1000,
  //         theme: "colored",
  //       });
  //       // Close the modal
  //       let modalElement = document.getElementById("exampleModalContact");
  //       let modalInstance = bootstrap.Modal.getInstance(modalElement);
  //       if (modalInstance) {
  //         modalInstance.hide();
  //       }
  //       // Clear the form fields
  //       setState1({
  //         client_id: "",
  //         contact_type_id: "",
  //         contact_id: "",
  //         consignee_id: from?.consignee_id || "",
  //         first_name: "",
  //         last_name: "",
  //         position: "",
  //         Email: "",
  //         mobile: "",
  //         landline: "",
  //         birthday: "",
  //         Notes: "",
  //         Nick_name: "",
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       toast.error("Network Error", {
  //         autoClose: 1000,
  //         theme: "colored",
  //       });
  //       return false;
  //     });
  // };
  const handleCheckboxChange = (invoiceNumber, isChecked) => {
    setCheckedItems((prev) => {
      const updatedCheckedItems = { ...prev, [invoiceNumber]: isChecked };

      // Automatically set Paid Amount to the corresponding amount_to_pay if checked
      const amountToPay = isChecked
        ? paymentTable1.find((item) => item.transaction_ref === invoiceNumber)
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
          if (updatedCheckedItems[item.transaction_ref]) {
            return (
              sum + (parseFloat(updatedPaidAmounts[item.transaction_ref]) || 0)
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
  const contactDetailsEdit = (e) => {
    console.log(state1);
    e.preventDefault();
    axios
      .post(`${API_BASE_URL}/updateContactDetails`, state1)
      .then((response) => {
        console.log(response);
        getAllContact();
        toast.success("Contact Update Successfully", {
          autoClose: 1000,
          theme: "colored",
        });
        setState1({
          client_id: "",
          contact_type_id: "",
          contact_id: "",
          consignee_id: from?.consignee_id || "",
          first_name: "",
          last_name: "",
          position: "",
          Email: "",
          mobile: "",
          landline: "",
          birthday: "",
          Notes: "",
          Nick_name: "",
        });

        // Close the modal
        let modalElement = document.getElementById("exampleModalEdit");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Network Error", {
          autoClose: 1000,
          theme: "colored",
        });
        return false;
      });
  };
  const handleCurrencyChange = (e) => {
    const selectedCurrencyId = e.target.value;
    setFxId(selectedCurrencyId);
    const selectedCurrency = currency.find(
      (item) => item.currency_id === parseInt(selectedCurrencyId)
    );
    if (selectedCurrency) {
      setFxRate(selectedCurrency.fx_rate);
    } else {
      setFxRate("");
    }
  };
  const handleEditClick = (id) => {
    const contactId = id;
    console.log(contactId);
    const selectedUser = data?.find((item) => item.contact_id === id);

    setState1((prevData) => ({
      ...prevData,
      client_id: selectedUser?.client_id || "",
      contact_type_id: selectedUser?.contact_type_id || "",
      consignee_id: selectedUser?.consignee_id || null,
      contact_id: contactId,
      first_name: selectedUser?.first_name || "",
      last_name: selectedUser?.last_name || "",
      position: selectedUser?.position || "",
      Email: selectedUser?.Email || "",
      mobile: selectedUser?.mobile || "",
      landline: selectedUser?.landline || "",
      birthday: selectedUser
        ? new Date(selectedUser.birthday).toISOString().split("T")[0]
        : "",
      Notes: selectedUser?.Notes || "",
      Nick_name: selectedUser?.Nick_name || "",
    }));

    console.log(selectedUser);
    // Open the modal using jQuery or another method here
  };
  const handleEditClickCustomization = (id) => {
    const contactId = id;
    console.log(contactId);
    const selectedUser = customization?.find((item) => item.Id === id);
    console.log(selectedUser);
    setDataCustomization((prevData) => ({
      ...prevData,
      Consignee_Customize_id: contactId || "",
      ITF: selectedUser?.ITF || "",
      Custom_Name: selectedUser?.Custom_Name || "",
      Dummy_Price: selectedUser?.Dummy_Price || "",
    }));

    console.log(selectedUser);
    // Open the modal using jQuery or another method here
  };
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
  });
  // const formatDate = (dateString) => {
  //   if (!dateString) return "";
  //   const date = new Date(dateString);
  //   const day = date.getDate().toString().padStart(2, "0");
  //   const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
  //   const year = date.getFullYear();
  //   return `${day}-${month}-${year}`;
  // };
  console.log(state.Commission_Currency);
  return (
    <Card title={`Clients / ${from?.consignee_id ? "Update" : "Create"} Form`}>
      <div className="top-space-search-reslute newSmallCard">
        <div className="tab-content px-2 md:!px-4">
          <div className="tab-pane active" id="header" role="tabpanel">
            <ul class="nav nav-tabs" id="myTab" role="tablist">
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link active"
                  id="first-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#first-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="first-tab-pane"
                >
                  Details
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link "
                  id="home-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#home-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="home-tab-pane"
                >
                  Contact
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  id="profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#profile-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="profile-tab-pane"
                  aria-selected="false"
                >
                  Customization
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link "
                  id="notify-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#notify-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="notify-tab-pane"
                >
                  Statistics
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link "
                  id="notifyNew"
                  data-bs-toggle="tab"
                  data-bs-target="#notifyNew-pane"
                  type="button"
                  role="tab"
                  aria-controls="notifyNew-pane"
                >
                  Notify
                </button>
              </li>
              {localStorage.getItem("level") !== "Level 5" && (
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    id="contact-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#contact-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="contact-tab-pane"
                    aria-selected="false"
                  >
                    Accounting
                  </button>
                </li>
              )}
            </ul>
            <div class="tab-content" id="myTabContent">
              <div
                class="tab-pane fade show active"
                id="first-tab-pane"
                role="tabpanel"
                aria-labelledby="first-tab"
                tabindex="0"
              >
                <div
                  id="datatable_wrapper"
                  className="information_dataTables dataTables_wrapper dt-bootstrap4 "
                >
                  <div className="formCreate">
                    <form action="">
                      <div className="row">
                        {/* <div className="form-group col-lg-3">
                          <h6> Client</h6>

                          <div className=" ">
                            <select
                              name="client_id"
                              onChange={handleChange}
                              value={state.client_id}
                            >
                              <option value="">Select Client</option>
                              {client?.map((item) => (
                                <option value={item.client_id}>
                                  {item.client_name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div> */}
                        {/* <div className="form-group col-lg-4">
                          <h6>Code</h6>
                          <input
                            type="text"
                            name="CODE"
                            className="w-full"
                            value={state.CODE}
                            onChange={handleChange}
                          />
                        </div> */}
                        <div className="form-group col-lg-4">
                          <h6>Name</h6>
                          <input
                            type="text"
                            name="client_name"
                            className="w-full"
                            value={state.client_name}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-lg-4">
                          <h6>Tax Number</h6>
                          <input
                            type="text"
                            className="w-full"
                            name="client_tax_number"
                            value={state.client_tax_number}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="form-group col-lg-4">
                          <h6>Email</h6>
                          <input
                            type="email"
                            className="w-full"
                            value={state.client_email}
                            name="client_email"
                            onChange={handleChange}
                          />
                        </div>

                        <div className="form-group col-lg-6">
                          <h6>Phone Number</h6>
                          <input
                            type="email"
                            className="w-full"
                            value={state.client_phone}
                            name="client_phone"
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-lg-6">
                          <h6> Brand</h6>
                          <div className="ceateTransport autoComplete">
                            <Autocomplete
                              options={brands || []}
                              getOptionLabel={(option) => option.Name_EN || ""} // Label to display
                              onChange={(event, newValue) => {
                                handleChange({
                                  target: {
                                    name: "brand",
                                    value: newValue ? newValue.ID : "",
                                  },
                                });
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Select Brand"
                                  variant="outlined"
                                />
                              )}
                              value={
                                brands?.find(
                                  (item) => item.ID === (state.brand || "")
                                ) || null
                              }
                              isOptionEqualToValue={(option, value) =>
                                option.ID === value.ID
                              }
                            />
                          </div>
                        </div>
                        {/* 
                        <div className="form-group col-lg-3">
                          <h6> Location</h6>

                          <div className="ceateTransport">
                            <select
                              value={state.Default_location}
                              name="Default_location"
                              onChange={handleChange}
                            >
                              <option value="">Select Location</option>
                              {locations?.map((item) => (
                                <option value={item.id}>{item.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="form-group col-lg-3">
                          <h6> Port of origin</h6>
                          <div className="ceateTransport">
                            <select
                              value={state.port_of_orign}
                              name="port_of_orign"
                              onChange={handleChange}
                            >
                              <option value="">Select Airport</option>
                              {port?.map((item) => (
                                <option value={item.port_id}>
                                  {item.port_name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="form-group col-lg-3">
                          <h6> Port of Destination</h6>
                          <div className="ceateTransport">
                            <select
                              value={state.destination_port}
                              name="destination_port"
                              onChange={handleChange}
                            >
                              <option value="">Select Airport</option>
                              {port?.map((item) => (
                                <option value={item.port_id}>
                                  {item.port_name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="form-group col-lg-3">
                          <h6> Airline</h6>
                          <div className="ceateTransport">
                            <select
                              value={state.liner_Drop}
                              name="liner_Drop"
                              onChange={handleChange}
                            >
                              <option value="">Please Select Airline</option>
                              {liner?.map((item) => (
                                <option value={item.liner_id}>
                                  {item.liner_name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div> */}
                        {/* <div className="form-group col-lg-4">
                          <h6> Invoice Currency</h6>

                          <div className="ceateTransport">
                            <select
                              value={state.currency}
                              name="currency"
                              onChange={handleChange}
                            >
                              <option value="">Select Location</option>
                              {currency?.map((item) => (
                                <option value={item.currency_id}>
                                  {item.currency}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="form-group col-lg-4">
                          <h6>Markup </h6>
                          <div className="parentShip">
                            <div className="markupShip">
                              <input
                                type="number"
                                value={state.profit}
                                name="profit"
                                onChange={handleChange}
                              />
                            </div>
                            <div className="shipPercent">
                              <span>%</span>
                            </div>
                          </div>
                        </div>
                        <div className="form-group col-lg-4">
                          <h6>Rebate</h6>
                          <div className="parentShip">
                            <div className="markupShip">
                              <input
                                type="number"
                                value={state.rebate}
                                name="rebate"
                                onChange={handleChange}
                              />
                            </div>
                            <div className="shipPercent">
                              <span>%</span>
                            </div>
                          </div>
                        </div>

                        <div className="form-group col-lg-4">
                          <h6> Commission</h6>
                          <div className="ceateTransport">
                            <select
                              value={state.commission}
                              name="commission"
                              onChange={handleChange}
                            >
                              <option value="">Select Commission</option>
                              {commission?.map((item) => (
                                <option value={item.id}>
                                  {item.commission_name_en}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="form-group col-lg-4">
                          <h6>Commission Value</h6>
                          <input
                            type="number"
                            className="w-full"
                            value={state.commission_value}
                            name="commission_value"
                            onChange={handleChange}
                          />
                        </div>

                        <div className="form-group col-lg-4 shipToToggle">
                          <h6>Commission Currency</h6>
                          <label
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: "10px",
                            }}
                            className="toggleSwitch large"
                          >
                            <input
                              type="checkbox"
                              checked={state.Commission_Currency === "THB"}
                              onChange={handleChange}
                              name="Commission_Currency"
                            />
                            <span>
                              <span>FX</span>
                              <span> THB</span>
                            </span>
                            <a> </a>
                          </label>
                        </div> */}
                        <div className="form-group col-lg-12">
                          <h6>Address</h6>
                          <textarea
                            name="client_address"
                            className="border-2 rounded-md border-[#203764] w-full"
                            onChange={handleChange}
                            value={state.client_address}
                          />
                        </div>

                        {/* <div className="col-lg-12">
                          <h6
                            className="mt-4"
                            style={{
                              fontWeight: "600",
                              marginBottom: "10px",
                              fontSize: "20px",
                            }}
                          >
                            Bank Informations
                          </h6>
                          <div className="row ">
                            <div className="form-group col-lg-4">
                              <h6>Bank Name</h6>

                              <input
                                onChange={handleChange}
                                type="text"
                                id="name_en"
                                name="bank_name"
                                className="form-control"
                                placeholder="axis "
                                value={state.bank_name}
                              />
                            </div>
                            <div className="form-group col-lg-4">
                              <h6>Account Name</h6>
                              <input
                                onChange={handleChange}
                                type="text"
                                id="name_en"
                                name="account_name"
                                className="form-control"
                                placeholder="xxxxx "
                                value={state.account_name}
                              />
                            </div>
                            <div className="form-group col-lg-4">
                              <h6>Account Number</h6>
                              <input
                                onChange={handleChange}
                                type="text"
                                id="name_en"
                                name="account_number"
                                className="form-control"
                                placeholder="3345345435 "
                                value={state.account_number}
                              />
                            </div>
                          </div>
                        </div> */}
                        <div className="col-lg-12">
                          <h6
                            className="mt-4"
                            style={{
                              fontWeight: "600",
                              marginBottom: "10px",
                              fontSize: "20px",
                            }}
                          >
                            Bank Informations
                          </h6>
                          <div className="row ">
                            <div className="form-group col-lg-4">
                              <h6>Bank Name</h6>

                              <input
                                onChange={handleChange}
                                type="text"
                                id="name_en"
                                name="client_bank_account"
                                className="form-control"
                                placeholder="axis "
                                value={state.client_bank_account}
                              />
                            </div>
                            <div className="form-group col-lg-4">
                              <h6>Account Name</h6>
                              <input
                                onChange={handleChange}
                                type="text"
                                id="name_en"
                                name="client_bank_name"
                                className="form-control"
                                placeholder="xxxxx "
                                value={state.client_bank_name}
                              />
                            </div>
                            <div className="form-group col-lg-4">
                              <h6>Account Number</h6>
                              <input
                                onChange={handleChange}
                                type="text"
                                id="name_en"
                                name="client_bank_number"
                                className="form-control"
                                placeholder="3345345435 "
                                value={state.client_bank_number}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="card-footer text-center">
                    <button
                      className="btn btn-primary"
                      onClick={update}
                      type="button"
                    >
                      {from?.client_id ? "Update" : "Create"}
                    </button>
                    <Link className="btn btn-danger" to="/shipToNew">
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>

              <div
                class="tab-pane fade"
                id="home-tab-pane"
                role="tabpanel"
                aria-labelledby="home-tab"
                tabindex="0"
              >
                <div className="table-responsive">
                  <table className="  tableContact striped  table borderTerpProduce">
                    <tr className="">
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Nick Name</th>
                      <th>Position </th>
                      <th>Type</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Action</th>
                    </tr>

                    {data?.map((item) => {
                      return (
                        <tr>
                          <td>{item.first_name}</td>
                          <td>{item.last_name}</td>
                          <td>{item.Nick_name}</td>
                          <td>{item.position}</td>
                          <td>{item.type}</td>
                          <td>{item.Email}</td>
                          <td>{item.mobile}</td>
                          <td>
                            <div>
                              {/* edit popup */}
                              <button
                                type="button"
                                onClick={() => handleEditClick(item.contact_id)}
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModalEdit"
                              >
                                {" "}
                                <i class="mdi mdi-pencil"></i>
                                {/* edit popup */}
                              </button>
                              <div
                                class="modal fade"
                                id="exampleModalEdit"
                                tabindex="-1"
                                aria-labelledby="exampleModalLabel"
                                aria-hidden="true"
                              >
                                <div class="modal-dialog modalShipTo modal-xl">
                                  <div class="modal-content">
                                    <div class="modal-header">
                                      <h1
                                        class="modal-title fs-5"
                                        id="exampleModalLabel"
                                      >
                                        Contact Update
                                      </h1>
                                      <button
                                        type="button"
                                        class="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                      >
                                        <i class="mdi mdi-close"></i>
                                      </button>
                                    </div>
                                    <div class="modal-body">
                                      <div className="formCreate">
                                        <form action="">
                                          <div className="row">
                                            {/* <div className="col-lg-12">
                                              <div class="form-group col-lg-3">
                                                <h6>Client </h6>
                                                <div class="ceateTransport">
                                                  <select
                                                    name="client_id"
                                                    onChange={handleChange1}
                                                    value={state1.client_id}
                                                  >
                                                    <option value="">
                                                      Select Client
                                                    </option>
                                                    {client?.map((item) => (
                                                      <option
                                                        key={item.client_id}
                                                        value={item.client_id}
                                                      >
                                                        {item.client_name}
                                                      </option>
                                                    ))}
                                                  </select>
                                                </div>
                                              </div>
                                            </div> */}
                                            <div class="form-group col-lg-3">
                                              <h6>Contact Type </h6>
                                              <div class="ceateTransport autoComplete">
                                                <Autocomplete
                                                  disablePortal
                                                  options={contactType || []} // Use your contactType array as options
                                                  getOptionLabel={(option) =>
                                                    option.type_en || ""
                                                  } // Display the contact type name
                                                  onChange={(e, newValue) =>
                                                    setState1((prevState) => ({
                                                      ...prevState,
                                                      contact_type_id:
                                                        newValue?.contact_type_id ||
                                                        "",
                                                    }))
                                                  } // Update the state with the selected contact_type_id
                                                  value={
                                                    contactType.find(
                                                      (item) =>
                                                        item.contact_type_id ===
                                                        state1.contact_type_id
                                                    ) || null
                                                  } // Match the selected value with the current state
                                                  sx={{ width: 300 }} // Customize the width as needed
                                                  renderInput={(params) => (
                                                    <TextField
                                                      {...params}
                                                      placeholder="Select Type" // Adds a placeholder
                                                      InputLabelProps={{
                                                        shrink: false,
                                                      }} // Prevents floating label
                                                    />
                                                  )}
                                                />
                                              </div>
                                            </div>
                                            <div class="form-group col-lg-3">
                                              <h6> First Name </h6>
                                              <div class=" ">
                                                <input
                                                  type="text"
                                                  name="first_name"
                                                  onChange={handleChange1}
                                                  value={state1.first_name}
                                                  placeholder="first name"
                                                />
                                              </div>
                                            </div>
                                            <div class="form-group col-lg-3">
                                              <h6>Last Name </h6>
                                              <div class=" ">
                                                <input
                                                  type="text"
                                                  name="last_name"
                                                  onChange={handleChange1}
                                                  value={state1.last_name}
                                                  placeholder="last name"
                                                />
                                              </div>
                                            </div>
                                            <div class="form-group col-lg-3">
                                              <h6>Nick Name</h6>
                                              <div>
                                                <input
                                                  type="text"
                                                  name="Nick_name"
                                                  onChange={handleChange1}
                                                  value={state1.Nick_name}
                                                  placeholder="nick name"
                                                />
                                              </div>
                                            </div>

                                            <div class="form-group col-lg-3">
                                              <h6>Position </h6>
                                              <div class=" ">
                                                <input
                                                  type="text"
                                                  name="position"
                                                  onChange={handleChange1}
                                                  value={state1.position}
                                                  placeholder="position"
                                                />
                                              </div>
                                            </div>
                                            <div class="form-group col-lg-3">
                                              <h6>Email</h6>
                                              <div class=" ">
                                                <input
                                                  type="email"
                                                  name="Email"
                                                  onChange={handleChange1}
                                                  value={state1.Email}
                                                  placeholder="email"
                                                />
                                              </div>
                                            </div>
                                            <div class="form-group col-lg-3">
                                              <h6>Mobile</h6>
                                              <div class=" ">
                                                <input
                                                  type="number"
                                                  name="mobile"
                                                  onChange={handleChange1}
                                                  value={state1.mobile}
                                                  placeholder="mobile"
                                                />
                                              </div>
                                            </div>
                                            <div class="form-group col-lg-3">
                                              <h6>Landline</h6>
                                              <div class=" ">
                                                <input
                                                  type="number"
                                                  name="landline"
                                                  onChange={handleChange1}
                                                  value={state1.landline}
                                                  placeholder="landline"
                                                />
                                              </div>
                                            </div>
                                            <div class="form-group col-lg-4">
                                              <h6>Birthday</h6>
                                              <div>
                                                <input
                                                  type="date"
                                                  name="birthday"
                                                  onChange={handleChange1}
                                                  value={state1.birthday}
                                                  placeholder="birthday"
                                                />
                                              </div>
                                            </div>
                                            <div class="form-group col-lg-8">
                                              <h6>Notes</h6>
                                              <div>
                                                <textarea
                                                  name="Notes"
                                                  onChange={handleChange1}
                                                  value={state1.Notes}
                                                  cols="30"
                                                  rows="5"
                                                ></textarea>
                                              </div>
                                            </div>
                                          </div>
                                        </form>
                                      </div>
                                    </div>
                                    <div class="modal-footer justify-center">
                                      <button
                                        onClick={contactDetailsEdit}
                                        type="button"
                                        class="btn btn-primary mb-0"
                                      >
                                        Update
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* edit popup end */}

                              <button
                                type="button"
                                onClick={() => deleteOrder1(item.contact_id)}
                              >
                                <i class="mdi mdi-delete "></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </table>
                </div>
                <div className="row">
                  <Link
                    style={{ width: "170px" }}
                    className="btn btn-danger mb-4"
                    to="/"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModalContact"
                  >
                    Add Contact
                  </Link>
                  {/* modal */}
                  <div
                    class="modal fade"
                    id="exampleModalContact"
                    tabindex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div class="modal-dialog modalShipTo modal-xl">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h1 class="modal-title fs-5" id="exampleModalLabel">
                            Contact
                          </h1>
                          <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={dataClear}
                          >
                            <i class="mdi mdi-close"></i>
                          </button>
                        </div>
                        <div class="modal-body">
                          <div className="formCreate">
                            <form action="">
                              <div className="row">
                                <div class="form-group col-lg-3">
                                  <h6>Contact Type </h6>
                                  <div class="ceateTransport autoComplete">
                                    <Autocomplete
                                      disablePortal
                                      options={contactType}
                                      getOptionLabel={(option) =>
                                        option.type_en
                                      }
                                      isOptionEqualToValue={(option, value) =>
                                        option.contact_type_id ===
                                        value.contact_type_id
                                      }
                                      onChange={(e, newValue) =>
                                        handleChange1({
                                          target: {
                                            name: "contact_type_id",
                                            value:
                                              newValue?.contact_type_id || "",
                                          },
                                        })
                                      }
                                      value={
                                        contactType?.find(
                                          (item) =>
                                            item.contact_type_id ===
                                            state1?.contact_type_id
                                        ) || null
                                      }
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          // label="Select Type"
                                          placeholder="Select Type"
                                          variant="outlined"
                                        />
                                      )}
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-3">
                                  <h6> First Name </h6>
                                  <div class=" ">
                                    <input
                                      type="text"
                                      name="first_name"
                                      onChange={handleChange1}
                                      value={state1.first_name}
                                      placeholder="first name"
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-3">
                                  <h6>Last Name </h6>
                                  <div class=" ">
                                    <input
                                      type="text"
                                      name="last_name"
                                      onChange={handleChange1}
                                      value={state1.last_name}
                                      placeholder="last name"
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-3">
                                  <h6>Nick Name</h6>
                                  <div>
                                    <input
                                      type="text"
                                      name="Nick_name"
                                      onChange={handleChange1}
                                      value={state1.Nick_name}
                                      placeholder="nick name"
                                    />
                                  </div>
                                </div>

                                <div class="form-group col-lg-3">
                                  <h6>Position </h6>
                                  <div class=" ">
                                    <input
                                      type="text"
                                      name="position"
                                      onChange={handleChange1}
                                      value={state1.position}
                                      placeholder="position"
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-3">
                                  <h6>Email</h6>
                                  <div class=" ">
                                    <input
                                      type="email"
                                      name="Email"
                                      onChange={handleChange1}
                                      value={state1.Email}
                                      placeholder="email"
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-3">
                                  <h6>Mobile</h6>
                                  <div class=" ">
                                    <input
                                      type="number"
                                      name="mobile"
                                      onChange={handleChange1}
                                      value={state1.mobile}
                                      placeholder="mobile"
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-3">
                                  <h6>Landline</h6>
                                  <div class=" ">
                                    <input
                                      type="number"
                                      name="landline"
                                      onChange={handleChange1}
                                      value={state1.landline}
                                      placeholder="landline"
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-4">
                                  <h6>Birthday</h6>
                                  <div>
                                    <input
                                      type="date"
                                      name="birthday"
                                      onChange={handleChange1}
                                      value={state1.birthday}
                                      placeholder="birthday"
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-8">
                                  <h6>Notes</h6>
                                  <div>
                                    <textarea
                                      name="Notes"
                                      onChange={handleChange1}
                                      value={state1.Notes}
                                      cols="30"
                                      rows="5"
                                    ></textarea>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                        <div class="modal-footer">
                          <button
                            type="button"
                            class="btn btn-primary mb-0"
                            onClick={contactDataSubmit}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* modal end */}
                </div>
              </div>
              {/* statics */}
              <div
                class="tab-pane fade"
                id="notify-tab-pane"
                role="tabpanel"
                aria-labelledby="notify-tab"
                tabindex="0"
              >
                <div className="py-3">
                  <div className="row newSmallCard ">
                    <div className="flex flex-wrap">
                      {/* <div className="selectProduce me-3">
            <h6 className="mb-2"> Select Produce</h6>
            <Autocomplete
              disablePortal
              options={data}
        value={data.find((item) => item.produce_id === selectedProduceId) || null}

              getOptionLabel={(option) => option.produce_name_en || ""}
              sx={{ width: 300 }}
              onChange={(event, value) => {
                setSelectedProduceId(value ? value.produce_id : null);
                // setProduceImages(value ? value.images : null); // Update images state
              }}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select Produce" />
              )}
            />
          </div> */}
                      <div>
                        <div className="selectTimeHead">
                          <h6>Select Time Period :</h6>
                        </div>
                        <div className="selectTimeParent">
                          {dataPeriod.map((item) => (
                            <div
                              key={item.ID}
                              className="timeMonth timePeriod"
                              onClick={() =>
                                handlePeriodClick(item.Period, item.ID)
                              }
                            >
                              <p>{item.Period}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="selectProduce comparisonNone mt-2">
                        <h6 style={{ color: "#fff" }}>Comparison Period</h6>
                        <Autocomplete
                          disablePortal
                          options={dataComparison}
                          getOptionLabel={(option) => option.Name_EN || ""}
                          sx={{ width: 300 }}
                          onChange={(event, value) => {
                            setSelectedComparison(value ? value.ID : null);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Comparison Period"
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="dateSelect row">
                      <div className="col-lg-3">
                        <input
                          type="date"
                          value={date1}
                          onChange={(e) => setDate1(e.target.value)}
                        />
                      </div>
                      <div className="col-lg-3">
                        <input
                          type="date"
                          value={date2}
                          onChange={(e) => setDate2(e.target.value)}
                        />
                      </div>
                      <div className="col-lg-3">
                        <input
                          type="date"
                          value={date3}
                          onChange={(e) => setDate3(e.target.value)}
                        />
                      </div>
                      <div className="col-lg-3">
                        <input
                          type="date"
                          value={date4}
                          onChange={(e) => setDate4(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="dateSelect row">
                      <div className="col-lg-3">
                        <button
                          className="btn btn-primary"
                          type="submit"
                          onClick={confirmData}
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="row dashCard53 consigneeCard">
                    <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mb20">
                      <div className="card  ">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                            <div
                              style={{
                                fontSize: "25px",
                                color: "#d2d7e0",
                                paddingTop: "13px",
                              }}
                            >
                              {consigeeDetails?.Total_shipments}
                            </div>
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              Total Shipments
                            </p>
                            <h4 className="mb-0">
                              {formatter.format(
                                consigeeDetails?.Total_invoiced_value
                              )}
                            </h4>
                          </div>
                        </div>
                        <hr className="dark horizontal my-0" />
                        <div className="card-footer ps-3 pe-3 pt-1 pb-1">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              +55%{" "}
                            </span>
                            than lask week
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 mb20">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                            <div
                              style={{
                                fontSize: "25px",
                                color: "#d2d7e0",
                                paddingTop: "13px",
                              }}
                            >
                              {consigeeDetails?.Total_Claims}
                            </div>
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              Total Claims
                            </p>
                            <h4 className="mb-0">
                              {" "}
                              {formatter.format(
                                consigeeDetails?.Total_Claims_value
                              )}{" "}
                            </h4>
                          </div>
                        </div>
                        <hr className="dark horizontal my-0" />
                        <div className="card-footer ps-3 pe-3 pt-1 pb-1">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              +5%{" "}
                            </span>
                            than yesterday
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mb20">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                            <div
                              style={{
                                fontSize: "25px",
                                color: "#d2d7e0",
                                paddingTop: "13px",
                              }}
                            >
                              {formatter.format(
                                consigeeDetails?.Average_Payment
                                  ? consigeeDetails?.Average_Payment
                                  : 0
                              )}
                            </div>
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              {" "}
                              Total Payment{" "}
                            </p>
                            <h4 className="mb-0">
                              {" "}
                              {formatter.format(
                                consigeeDetails?.Total_payments_value
                              )}
                            </h4>
                          </div>
                        </div>
                        <hr className="dark horizontal my-0" />
                        <div className="card-footer ps-3 pe-3 pt-1 pb-1">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              -2%
                            </span>{" "}
                            than yesterday
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 mb20">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                            <i className=" material-icons  mdi mdi-credit-card-outline" />
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              Pending Payment
                            </p>
                            <h4 className="mb-0">
                              {formatter.format(consigeeDetails?.Balance)}
                            </h4>
                          </div>
                        </div>
                        <hr className="dark horizontal my-0" />
                        <div className="card-footer ps-3 pe-3 pt-1 pb-1">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              +5%{" "}
                            </span>
                            than yesterday
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row dashCard53 consigneeCard">
                    <div className="col-xl-3 col-sm-6 mb20">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                            <i className=" material-icons  mdi mdi-weight" />
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              Total Net Weigt Shipped
                            </p>
                            <h4 className="mb-0">
                              {formatter.format(consigeeDetails?.Total_NW)}
                            </h4>
                          </div>
                        </div>
                        <hr className="dark horizontal my-0" />
                        <div className="card-footer ps-3 pe-3 pt-1 pb-1">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              +5%
                            </span>
                            than yesterday
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 mb20">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                            <i className=" material-icons mdi mdi-weight-gram" />
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              Total Gross Weight Shipped
                            </p>
                            <h4 className="mb-0">
                              {formatter.format(consigeeDetails?.Total_GW)}
                            </h4>
                          </div>
                        </div>
                        <hr className="dark horizontal my-0" />
                        <div className="card-footer ps-3 pe-3 pt-1 pb-1">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              +5%
                            </span>
                            than yesterday
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 mb20">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                            <i className=" material-icons  mdi mdi-checkbox-multiple-blank-outline" />
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              Total Boxes Shipped
                            </p>
                            <h4 className="mb-0">
                              {formatter.format(consigeeDetails?.Total_Box)}
                            </h4>
                          </div>
                        </div>
                        <hr className="dark horizontal my-0" />
                        <div className="card-footer ps-3 pe-3 pt-1 pb-1">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              +5%
                            </span>
                            than yesterday
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mb20">
            <div className="card  ">
              <div className="card-header p-3 pt-2">
                <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                  <i className=" material-icons  mdi mdi-calendar-range" />
                </div>
                <div className="text-end pt-1">
                  <p className="text-sm mb-0 text-capitalize">
                    Date of First Shipment
                  </p>
                  <h4 className="mb-0" />
                  {consigeeDetails?.First_Shipment}
                </div>
              </div>
              <hr className="dark horizontal my-0" />
              <div className="card-footer p-3">
                <p className="mb-0">
                  <span className="text-success text-sm font-weight-bolder">
                    +55%{" "}
                  </span>
                  than lask week
                </p>
              </div>
            </div>
          </div> */}
                    {/* <div className="col-xl-3 col-sm-6 mb-xl-0 mb- mb20">
            <div className="card">
              <div className="card-header p-3 pt-2">
                <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                  <i className=" material-icons mdi mdi-calendar-range" />
                </div>
                <div className="text-end pt-1">
                  <p className="text-sm mb-0 text-capitalize">
                    Date of Last Shipment
                  </p>
                  <h4 className="mb-0" /> {consigeeDetails?.Last_Shipment}
                </div>
              </div>
              <hr className="dark horizontal my-0" />
              <div className="card-footer p-3">
                <p className="mb-0">
                  <span className="text-success text-sm font-weight-bolder">
                    +3% 
                  </span>
                  than lask month
                </p>
              </div>
            </div>
          </div> */}
                    <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mb20">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                            <i className=" material-icons  mdi mdi-pipe" />
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              Total Shipments
                            </p>
                            <div className="parentFirstShip mt-4">
                              <p>Date of First Shipment</p>
                              <p> {consigeeDetails?.First_Shipment} </p>
                            </div>
                            <div className="parentFirstShip">
                              <p>Date of Last Shipment</p>
                              <p>{consigeeDetails?.Last_Shipment}</p>
                            </div>
                            <div className="parentFirstShip">
                              <p> Shipments in Pipe Line</p>
                              <p>
                                {" "}
                                {formatter.format(
                                  consigeeDetails?.Pipe_Line
                                )}{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                        <hr className="dark horizontal my-0" />
                        {/* <div className="card-footer ps-3 pe-3 pt-1 pb-1">
                <p className="mb-0">
                  <span className="text-success text-sm font-weight-bolder">
                    -2%
                  </span>
                  than yesterday
                </p>
              </div> */}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 mb20">
                      <div className="itemsOrderSearch">
                        <h3 className="itemOrder">Top 5 Items Ordered</h3>

                        <div className="selectProduce">
                          <Autocomplete
                            disablePortal
                            options={value}
                            value={
                              value.find(
                                (item) => item.produce_id === selectedInvoiceId
                              ) || null
                            }
                            getOptionLabel={(option) =>
                              option.produce_name_en || ""
                            }
                            sx={{ width: 200 }}
                            onChange={(event, value) => {
                              setSelectedInvoiceId(
                                value ? value.produce_id : null
                              );
                              // setProduceImages(value ? value.images : null); // Update images state
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Invoice Value"
                              />
                            )}
                          />
                        </div>
                      </div>

                      <div className="tableCreateClient">
                        <table>
                          <tr>
                            <th>ITF Name</th>
                            <th> Last Period Kg</th>
                            <th> Current Period Kg</th>
                            <th> DIFF </th>
                            <th> % Change </th>
                          </tr>
                          <tbody>
                            <tr>
                              <td>Dragon Fruit Red-Kg x 15</td>
                              <td>1,320.00</td>
                              <td>1,320.00</td>
                              <td>1,320.00</td>
                              <td>1,320.00</td>
                            </tr>
                            <tr>
                              <td>Chilli Red-100g x 60</td>
                              <td>840.00</td>
                              <td>840.00</td>
                              <td>840.00</td>
                              <td>840.00</td>
                            </tr>
                          </tbody>
                          {/* {orderItem?.map((item) => {
                return (
                  <tr key={item?.id}>
                   
                    <td>{item?.itf_name}</td>
                    <td>{item?.Total_Kg}</td>
                    <td>{item?.Total_Kg}</td>
                    <td>{item?.Total_Kg}</td>
                  </tr>
                  
                );
              })} */}
                        </table>
                      </div>
                    </div>
                    <div className="col-lg-6 mb20 ">
                      <div className="chartConsignee">
                        <ChartConsi />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-footer text-center">
                  <Link className="btn btn-danger" to="/shipToNew">
                    Close
                  </Link>
                </div>
              </div>
              {/* customization */}
              <div
                class="tab-pane fade"
                id="profile-tab-pane"
                role="tabpanel"
                aria-labelledby="profile-tab"
                tabindex="0"
              >
                <div className="table-responsive">
                  <table className="  tableContact striped  table borderTerpProduce">
                    <tr className="">
                      <th> ITF Name</th>
                      <th>Custom Name</th>
                      <th>Dummy Price</th>

                      <th>Action</th>
                    </tr>
                    {customization?.map((item) => {
                      return (
                        <tr>
                          <td>{item.Name_EN}</td>
                          <td>{item.Custom_Name}</td>
                          <td>{item.Dummy_Price}</td>
                          <td>
                            <div>
                              <button
                                type="button"
                                onClick={() =>
                                  handleEditClickCustomization(item.Id)
                                }
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModalCustomizationEdit"
                              >
                                <i class="mdi mdi-pencil"></i>
                              </button>
                              {/* customixation modal */}
                              <div
                                className="modal fade"
                                id="exampleModalCustomizationEdit"
                                tabIndex={-1}
                                aria-labelledby="exampleModalLabel"
                                aria-hidden="true"
                              >
                                <div className=" modal-dialog modalShipTo">
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <h1
                                        className="modal-title fs-5"
                                        id="exampleModalLabel"
                                      >
                                        Update customization
                                      </h1>
                                      <button
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
                                          <div className="form-group col-lg-12 mb-2">
                                            <h6>ITF Name </h6>
                                            <div className="ceateTransport autoComplete">
                                              {/* <select
                                                name="ITF"
                                                onChange={handleChange2}
                                                value={dataCustomization.ITF}
                                              >
                                                <option value="">
                                                  Select ITF
                                                </option>
                                                {getItf?.map((item) => (
                                                  <option
                                                    key={item.itf_id}
                                                    value={item.itf_id}
                                                  >
                                                    {item.itf_name_en}
                                                  </option>
                                                ))}
                                              </select> */}
                                              <Autocomplete
                                                disablePortal
                                                options={getItf || []}
                                                getOptionLabel={(option) =>
                                                  option.ITF_Internal_Name_EN ||
                                                  ""
                                                }
                                                onChange={(e, newValue) =>
                                                  setDataCustomization(
                                                    (prevState) => ({
                                                      ...prevState,
                                                      ITF: newValue?.ID || "",
                                                    })
                                                  )
                                                }
                                                value={
                                                  getItf?.find(
                                                    (item) =>
                                                      item.ID ===
                                                      dataCustomization.ITF
                                                  ) || null
                                                }
                                                sx={{ width: 300 }}
                                                renderInput={(params) => (
                                                  <TextField
                                                    {...params}
                                                    placeholder="Select ITF"
                                                    InputLabelProps={{
                                                      shrink: false,
                                                    }}
                                                  />
                                                )}
                                              />
                                            </div>
                                          </div>
                                          <div class="form-group col-lg-12">
                                            <h6> Custom Name </h6>
                                            <div>
                                              <input
                                                type="text"
                                                name="Custom_Name"
                                                onChange={handleChange2}
                                                value={
                                                  dataCustomization.Custom_Name
                                                }
                                                placeholder="Custom Name"
                                                className="mb-2"
                                              />
                                            </div>
                                          </div>
                                          <div class="form-group col-lg-12">
                                            <h6> Agreed price </h6>
                                            <div>
                                              <input
                                                type="number"
                                                name="Dummy_Price"
                                                onChange={handleChange2}
                                                value={
                                                  dataCustomization.Dummy_Price
                                                }
                                                placeholder="Custom Name"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="modal-footer">
                                      <button
                                        type="button "
                                        onClick={customizationDataSubmit}
                                        className="btn mb-0 btn-primary"
                                      >
                                        Update{" "}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* customization modal end */}
                              <button
                                type="button"
                                onClick={() => deleteOrder(item.Id)}
                              >
                                <i class="mdi mdi-delete "></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </table>
                </div>
                <Link
                  style={{ width: "100px" }}
                  className="btn btn-danger mb-4"
                  to="/"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModalCustomization"
                >
                  Add
                </Link>
                {/* customixation modal */}
                <div
                  className="modal fade"
                  id="exampleModalCustomization"
                  tabIndex={-1}
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className=" modal-dialog  modalShipTo">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                          Add customization
                        </h1>
                        <button
                          type="button"
                          class="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          onClick={dataClear1}
                        >
                          <i class="mdi mdi-close"></i>
                        </button>
                      </div>
                      <div className="modal-body">
                        <div className="formCreate">
                          <div className="row">
                            <div className="form-group col-lg-12 mb-3">
                              <h6>ITF Name </h6>
                              <div className="ceateTransport autoComplete">
                                <Autocomplete
                                  options={getItf || []} 
                                  getOptionLabel={(option) =>
                                    option.itf_name_en || ""
                                  } 
                                  onChange={(event, newValue) => {
                                    setDataCustomization((prevState) => ({
                                      ...prevState,
                                      ITF: newValue ? newValue.itf_id : "", 
                                    }));
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder="Select ITF"
                                      variant="outlined"
                                    />
                                  )}
                                  value={
                                    getItf?.find(
                                      (item) =>
                                        item.itf_id === dataCustomization.ITF
                                    ) || null
                                  }
                                  isOptionEqualToValue={(option, value) =>
                                    option.itf_id === value.itf_id
                                  } 
                                />
                              </div>
                            </div>
                            <div class="form-group col-lg-12">
                              <h6> Custom Name </h6>
                              <div className=" ">
                                <input
                                  type="text"
                                  name="Custom_Name"
                                  onChange={handleChange2}
                                  value={dataCustomization.Custom_Name}
                                  placeholder="Custom Name"
                                />
                              </div>
                            </div>
                            <div class="form-group col-lg-12">
                              <h6> Agreed price </h6>
                              <div className=" ">
                                <input
                                  type="number"
                                  name="Dummy_Price"
                                  onChange={handleChange2}
                                  value={dataCustomization.Dummy_Price}
                                  placeholder="Custom Name"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button "
                          onClick={submitCusomizationData}
                          className="btn mb-0 btn-primary"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* customization modal end */}
              </div>
              {/* notify Section */}
              <div
                class="tab-pane fade"
                id="notifyNew-pane"
                role="tabpanel"
                aria-labelledby="notifyNew-tab"
                tabindex="0"
              >
                <div className="row formCreate my-3">
                  <div className="form-group col-lg-6">
                    <h6> Name</h6>

                    <input
                      type="text"
                      id="name_en"
                      className="form-control"
                      placeholder=" name "
                      value={state.notify_name}
                      name="notify_name"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group col-lg-6">
                    <h6>Tax Number</h6>
                    <input
                      type="number"
                      id="name_en"
                      className="form-control"
                      placeholder="123 "
                      value={state.notify_tax_number}
                      name="notify_tax_number"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group col-lg-6">
                    <h6> Email</h6>
                    <input
                      onChange={handleChange}
                      type="email"
                      id="hs_name"
                      className="form-control"
                      placeholder="admin@gmail.com"
                      value={state.notify_email}
                      name="notify_email"
                    />
                  </div>
                  <div className="form-group col-lg-6">
                    <h6> Phone Number</h6>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="123456789"
                      value={state.notify_phone}
                      name="notify_phone"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group col-lg-12">
                    <h6>Address</h6>
                    <textarea
                      className="col-lg-12 rounded h-20 w-full"
                      style={{ border: "2px solid #245486" }}
                      value={state.notify_address}
                      name="notify_address"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* accounting */}
              <div
                class="tab-pane fade"
                id="contact-tab-pane"
                role="tabpanel"
                aria-labelledby="contact-tab"
                tabindex="0"
              >
                <div className="card-footer text-center d-flex justify-content-center flex-wrap">
                  {/* Button trigger modal */}
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#modalState"
                  >
                    Statement
                  </button>
                  {/* Modal */}
                  <div
                    className="modal fade "
                    id="modalState"
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
                            Statement
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={dataClear2}
                          >
                            <i className="mdi mdi-close"></i>
                          </button>
                        </div>
                        <div className="modal-body">
                          <label htmlFor="fromDate">From Date</label>
                          <input
                            type="date"
                            className="form-control"
                            id="fromDate"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                          />
                          <label className="mt-2" htmlFor="toDate">
                            To Date
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            id="toDate"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                          />
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
                  {/* <div className="paymentSec">
                    <button
                      type="button"
                      className="btn btn-danger"
                      data-bs-toggle="modal"
                      data-bs-target="#modalPayment"
                    >
                      Payment
                    </button>
                    <div
                      className="modal fade"
                      id="modalPayment"
                      tabIndex={-1}
                      aria-labelledby="exampleModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modalShipTo modal-xl">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h1
                              className="modal-title fs-5"
                              id="exampleModalLabel"
                            >
                              Payment
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
                            <form onSubmit={handleSubmit1}>
                              <div className="row">
                                <div className="col-lg-4">
                                  <div className="parentFormPayment">
                                    <p>Client </p>
                                    <select
                                      value={clientId}
                                      onChange={(e) =>
                                        setClientId(e.target.value)
                                      }
                                    >
                                      <option value="0">
                                        select client Id
                                      </option>
                                      <option value="1">
                                        select client Id
                                      </option>
                                      <option value="2">
                                        select client Id
                                      </option>
                                    </select>
                                  </div>
                                </div>
                                <div className="col-lg-4">
                                  <div className="parentFormPayment">
                                    <p>Consignee Id</p>
                                    <select
                                      value={consigneeId}
                                      onChange={(e) =>
                                        setConsigneeId(e.target.value)
                                      }
                                    >
                                      <option value="0">
                                        select Consignee Id
                                      </option>
                                      <option value="1">option 1</option>
                                      <option value="2">option 2</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="col-lg-4">
                                  <div className="parentFormPayment">
                                    <p>Payment Date</p>
                                    <input
                                      type="date"
                                      value={paymentDate}
                                      onChange={(e) =>
                                        setPaymentDate(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-4 mt-3">
                                  <div className="parentFormPayment">
                                    <p>Client Payment Ref</p>
                                    <input
                                      type="text"
                                      value={clientPaymentRef}
                                      onChange={(e) =>
                                        setClientPaymentRef(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-4 mt-3">
                                  <div className="parentFormPayment">
                                    <p>Payment Channel</p>
                                    <input
                                      type="text"
                                      value={paymentChannel}
                                      onChange={(e) =>
                                        setPaymentChannel(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-4 mt-3">
                                  <div className="parentFormPayment">
                                    <p>Bank Ref</p>
                                    <input
                                      type="text"
                                      value={bankRef}
                                      onChange={(e) =>
                                        setBankRef(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-4 mt-3">
                                  <div className="parentFormPayment">
                                    <p>FX Payment</p>
                                    <input
                                      type="text"
                                      value={fxPayment}
                                      onChange={(e) =>
                                        setFxPayment(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-4 mt-3">
                                  <div className="parentFormPayment">
                                    <p>FX Rate</p>
                                    <input
                                      type="text"
                                      value={fxRate}
                                      onChange={(e) =>
                                        setFxRate(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-4 mt-3">
                                  <div className="parentFormPayment">
                                    <p> FX Id</p>
                                    <select
                                      value={fxId}
                                      onChange={(e) => setFxId(e.target.value)}
                                    >
                                      <option value="0">234</option>
                                      <option value="1">4534</option>
                                      <option value="2">#435</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="col-lg-6 mt-3">
                                  <div className="parentFormPayment">
                                    <p>Intermittent Bank Charges</p>
                                    <input
                                      type="text"
                                      value={intermittentBankCharges}
                                      onChange={(e) =>
                                        setIntermittentBankCharges(
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6 mt-3">
                                  <div className="parentFormPayment">
                                    <p>Local Bank Charges</p>
                                    <input
                                      type="text"
                                      value={localBankCharges}
                                      onChange={(e) =>
                                        setLocalBankCharges(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6 mt-3">
                                  <div className="parentFormPayment">
                                    <p>THB Received</p>
                                    <input
                                      type="text"
                                      value={thbReceived}
                                      onChange={(e) =>
                                        setThbReceived(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6 mt-3">
                                  <div className="parentFormPayment">
                                    <p>Loss/Gain on Exchange Rate</p>
                                    <input
                                      type="text"
                                      value={lossGainOnExchangeRate}
                                      onChange={(e) =>
                                        setLossGainOnExchangeRate(
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </form>

                            <div className="row mt-4">
                              <div className="tableCreateClient tablepayment">
                                <table>
                                  <tr>
                                    <th>Check</th>
                                    <th>Document Number</th>
                                    <th>Ship Date</th>
                                    <th>AWB Number</th>
                                    <th>Net Amount</th>
                                    <th>Amount To Pay</th>
                                    <th>Paid Amount</th>
                                  </tr>
                                  <tbody>
                                    <tr>
                                      <td>
                                        <input type="checkbox" />
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          value={documentNumber}
                                          onChange={(e) =>
                                            setDocumentNumber(e.target.value)
                                          }
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="date"
                                          value={shipDate}
                                          onChange={(e) =>
                                            setShipDate(e.target.value)
                                          }
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          value={awbNumber}
                                          onChange={(e) =>
                                            setAwbNumber(e.target.value)
                                          }
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          value={netAmount}
                                          onChange={(e) =>
                                            setNetAmount(e.target.value)
                                          }
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          value={amountToPay}
                                          onChange={(e) =>
                                            setAmountToPay(e.target.value)
                                          }
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          value={paidAmount}
                                          onChange={(e) =>
                                            setPaidAmount(e.target.value)
                                          }
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div className="modal-footer">
                              <button type="button" className="btn btn-primary">
                                Submit
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <div className="paymentSec">
                    <>
                      {/* Button trigger modal */}
                      <button
                        type="button"
                        className="btn btn-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#modalPayment"
                      >
                        Payment
                      </button>
                      {/* Modal */}
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
                              <h1
                                class="modal-title fs-5"
                                id="exampleModalLabel"
                              >
                                Payment
                              </h1>
                              <button
                                type="button"
                                class="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={closeData}
                              >
                                <i class="mdi mdi-close"></i>
                              </button>
                            </div>
                            <div className="modal-body">
                              <div className="row">
                                <div className="col-lg-4">
                                  <div className="parentFormPayment autoComplete">
                                    <p>Client </p>

                                    <Autocomplete
                                      options={clients || []}
                                      getOptionLabel={(option) =>
                                        option.client_name || ""
                                      }
                                      onChange={(event, newValue) =>
                                        setClientId(
                                          newValue ? newValue.client_id : ""
                                        )
                                      }
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          placeholder="Select Client" // Use placeholder instead of label
                                          variant="outlined"
                                        />
                                      )}
                                      value={
                                        Array.isArray(clients)
                                          ? clients.find(
                                              (item) =>
                                                item.client_id === clientId
                                            ) || null
                                          : null
                                      }
                                      isOptionEqualToValue={(option, value) =>
                                        option.client_id === value.client_id
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-4">
                                  <div className="parentFormPayment autoComplete">
                                    <p>Consignee </p>
                                    <Autocomplete
                                      options={consignees || []}
                                      getOptionLabel={(option) =>
                                        option.consignee_name || ""
                                      }
                                      onChange={(event, newValue) =>
                                        setConsigneeId(
                                          newValue ? newValue.consignee_id : ""
                                        )
                                      }
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          placeholder="Select Consignee" // Placeholder text
                                          variant="outlined"
                                        />
                                      )}
                                      value={
                                        consignees.find(
                                          (item) =>
                                            item.consignee_id === consigneeId
                                        ) || null
                                      }
                                      isOptionEqualToValue={(option, value) =>
                                        option.consignee_id ===
                                        value.consignee_id
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-4">
                                  <div className="parentFormPayment">
                                    <div>
                                      <p>Payment Date</p>
                                    </div>
                                    <div>
                                      <input
                                        type="date"
                                        value={paymentDate}
                                        onChange={(e) =>
                                          setPaymentDate(e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 mt-3">
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
                                  {/* <div className="parentFormPayment">
                                    <div>
                                      <p>Payment Channel</p>
                                    </div>
                                    <div>
                                      <input
                                        type="text"
                                        value={paymentChannel}
                                        onChange={(e) =>
                                          setPaymentChannel(e.target.value)
                                        }
                                      />
                                    </div>
                                  </div> */}
                                  <div className="parentFormPayment autoComplete">
                                    <p>Payment Channel </p>
                                    <Autocomplete
                                      options={paymentChannle || []}
                                      getOptionLabel={(option) =>
                                        option.bank_name || ""
                                      }
                                      onChange={(event, newValue) =>
                                        setPaymentChannel(
                                          newValue ? newValue.bank_id : ""
                                        )
                                      }
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          placeholder="Select Payment Channel" // Placeholder text
                                          variant="outlined"
                                        />
                                      )}
                                      value={
                                        Array.isArray(paymentChannle)
                                          ? paymentChannle.find(
                                              (item) =>
                                                item.bank_id === paymentChannel
                                            ) || null
                                          : null
                                      }
                                      isOptionEqualToValue={(option, value) =>
                                        option.bank_id === value.bank_id
                                      }
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
                                        onChange={(e) =>
                                          setBankRef(e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 mt-3">
                                  <div className="parentFormPayment">
                                    <div>
                                      <p>FX Payment</p>
                                    </div>
                                    <div>
                                      <input
                                        type="text"
                                        value={fxPayment}
                                        onChange={(e) =>
                                          setFxPayment(e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 mt-3">
                                  <div className="parentFormPayment autoComplete">
                                    <p> FX </p>
                                    <div>
                                      <Autocomplete
                                        options={currency || []}
                                        getOptionLabel={(option) =>
                                          option.currency || ""
                                        }
                                        onChange={(event, newValue) =>
                                          handleCurrencyChange({
                                            target: {
                                              value: newValue
                                                ? newValue.currency_id
                                                : "",
                                            },
                                          })
                                        }
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            placeholder="Select Fx" // Placeholder instead of label
                                            variant="outlined"
                                          />
                                        )}
                                        value={
                                          currency?.find(
                                            (item) => item.currency_id === fxId
                                          ) || null
                                        }
                                        isOptionEqualToValue={(option, value) =>
                                          option.currency_id ===
                                          value.currency_id
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 mt-3">
                                  <div className="parentFormPayment">
                                    <div>
                                      <p>FX Rate</p>
                                    </div>
                                    <div>
                                      <input
                                        type="text"
                                        value={fxRate}
                                        onChange={(e) =>
                                          setFxRate(e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="col-lg-6 mt-3">
                                  <div className="parentFormPayment">
                                    <div>
                                      <p>Intermittent Bank Charges</p>
                                    </div>
                                    <div>
                                      <input
                                        type="text"
                                        value={intermittentBankCharges}
                                        onChange={(e) =>
                                          setIntermittentBankCharges(
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-6 mt-3">
                                  <div className="parentFormPayment">
                                    <div>
                                      <p>Local Bank Charges</p>
                                    </div>
                                    <div>
                                      <input
                                        type="text"
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
                                      <p>THB Received</p>
                                    </div>
                                    <div>
                                      <input
                                        type="text"
                                        value={thbReceived}
                                        onChange={(e) =>
                                          setThbReceived(e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-6 mt-3">
                                  <div className="parentFormPayment">
                                    <div>
                                      <p>Loss/Gain on Exchange Rate</p>
                                    </div>
                                    <div>
                                      <input
                                        type="text"
                                        value={lossGainOnExchangeRate}
                                        onChange={(e) =>
                                          setLossGainOnExchangeRate(
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="row mt-4">
                                <div className="tableCreateClient tablepayment">
                                  <table>
                                    <tr>
                                      <th>Check</th>
                                      <th> Document Number</th>
                                      <th> Ship Date</th>
                                      <th> AWB Number</th>
                                      <th> Net Amount</th>
                                      <th>Amount To Pay </th>
                                      <th> Paid Amount</th>
                                    </tr>
                                    {paymentTable1?.map((item) => {
                                      return (
                                        <>
                                          <tr>
                                            <td>
                                              <input
                                                type="checkbox"
                                                checked={
                                                  !!checkedItems[
                                                    item.transaction_ref
                                                  ]
                                                }
                                                onChange={(e) =>
                                                  handleCheckboxChange(
                                                    item.transaction_ref,
                                                    e.target.checked
                                                  )
                                                }
                                              />
                                            </td>
                                            <td> {item.transaction_ref}</td>
                                            <td>{formatDate(item.date)}</td>
                                            <td>{item.bl}</td>
                                            <td> {item.invoice_amount}</td>
                                            <td>{item.amount_to_pay}</td>
                                            <td>
                                              <input
                                                type="number"
                                                value={
                                                  paidAmounts[
                                                    item.transaction_ref
                                                  ] || ""
                                                }
                                                onChange={(e) =>
                                                  handlePaidAmountChange(
                                                    item.transaction_ref,
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
                    </>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn btn-danger"
                      data-bs-toggle="modal"
                      data-bs-target="#modalClaim"
                    >
                      CLAIM LIST
                    </button>

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
                            <h1
                              className="modal-title fs-5"
                              id="exampleModalLabel"
                            >
                              Claim
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
                            <div className="claimParent">
                              <div>
                                <strong>Invoice Number : </strong>{" "}
                                <span>INV-202407019</span>{" "}
                              </div>
                              <div>
                                <strong>Client :</strong>{" "}
                                <span>Finley DWC-LLC</span>{" "}
                              </div>
                              <div>
                                <strong>Ship To :</strong>{" "}
                                <span> Cape Fresh Industries LLC</span>{" "}
                              </div>
                              <div>
                                <strong>Currency : </strong> <span>USD</span>{" "}
                              </div>
                              <div>
                                <strong>Items Info : </strong> <span>USD</span>{" "}
                              </div>
                              <div>
                                <strong>Claim Date</strong>
                                <input type="date" />{" "}
                              </div>
                            </div>
                            <div className="tableClaim">
                              <table>
                                <tr>
                                  <th>ITF</th>
                                  <th>Brand Name</th>
                                  <th>Quantity</th>
                                  <th>Unit</th>
                                  <th>Number Box</th>
                                  <th>Claim Quantity</th>
                                  <th>Unit</th>
                                  <th>Amount</th>
                                </tr>
                                <tr>
                                  <td>Papaya Holland - Kg x 3 (Frutulip)</td>
                                  <td>None</td>
                                  <td>16.00</td>
                                  <td>KG</td>
                                  <td>32.000</td>
                                  <td>
                                    <input type="number" />
                                  </td>
                                  <td>
                                    <input type="number" />
                                  </td>
                                  <td>
                                    <input type="number" />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    Lemongrass - 500g (38cm) x 20 (F) 1,600.00
                                  </td>
                                  <td>None</td>
                                  <td>16.00</td>
                                  <td>KG</td>
                                  <td>32.000</td>
                                  <td>
                                    <input type="number" />
                                  </td>
                                  <td>
                                    <input type="number" />
                                  </td>
                                  <td>
                                    <input type="number" />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    Lemongrass - 500g (38cm) x 20 (F) 1,600.00
                                  </td>
                                  <td>None</td>
                                  <td>16.00</td>
                                  <td>KG</td>
                                  <td>32.000</td>
                                  <td>
                                    <input type="number" />
                                  </td>
                                  <td>
                                    <input type="number" />
                                  </td>
                                  <td>
                                    <input type="number" />
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-primary"
                              // onClick={handleSubmit}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="statisticsContent">
                  <div className="row dashCard53 consigneeCard">
                    <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                      <div className="card  ">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                            {/* <i className=" material-icons  mdi mdi-package" /> */}
                            <div
                              style={{
                                fontSize: "25px",
                                color: "#d2d7e0",
                                paddingTop: "13px",
                              }}
                            >
                              {consigneeData?.Total_shipments}
                            </div>
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              Total Shipments
                            </p>
                            <h4 className="mb-0">
                              {" "}
                              {formatter.format(
                                consigneeData?.Total_invoiced_value
                              )}
                            </h4>
                          </div>
                        </div>
                        <hr className="dark horizontal my-0" />
                        <div className="card-footer p-3">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              +55%{" "}
                            </span>
                            than lask week
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                            {/* <i className=" material-icons mdi mdi-weight-gram" /> */}
                            <div
                              style={{
                                fontSize: "25px",
                                color: "#d2d7e0",
                                paddingTop: "13px",
                              }}
                            >
                              {consigneeData?.Total_Claims}
                            </div>
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              Total Claims
                            </p>
                            <h4 className="mb-0">
                              {formatter.format(
                                consigneeData?.Total_Claims_value
                              )}{" "}
                            </h4>
                          </div>
                        </div>
                        <hr className="dark horizontal my-0" />
                        <div className="card-footer p-3">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              +5%{" "}
                            </span>
                            than yesterday
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                            {/* <i className=" material-icons mdi mdi-cash" /> */}
                            <div
                              style={{
                                fontSize: "25px",
                                color: "#d2d7e0",
                                paddingTop: "13px",
                              }}
                            >
                              {parseInt(consigneeData?.Average_Payment)}{" "}
                            </div>
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              {" "}
                              Total Payment{" "}
                            </p>
                            <h4 className="mb-0">
                              {" "}
                              {formatter.format(
                                consigneeData?.Total_payments_value
                              )}{" "}
                            </h4>
                          </div>
                        </div>
                        <hr className="dark horizontal my-0" />
                        <div className="card-footer p-3">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              -2%
                            </span>{" "}
                            than yesterday
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                            <i className=" material-icons  mdi mdi-credit-card-outline" />
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              Pending Payment
                            </p>
                            <h4 className="mb-0">
                              {" "}
                              {formatter.format(consigneeData?.Balance)}{" "}
                            </h4>
                          </div>
                        </div>
                        <hr className="dark horizontal my-0" />
                        <div className="card-footer p-3">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              +5%{" "}
                            </span>
                            than yesterday
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                            <i className=" material-icons mdi mdi-invoice" />
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              {/* Total Invoices */}
                            </p>
                            <h4 className="mb-0">
                              {/* {" "}
                              {formatter.format(
                                consigneeData?.Total_invoiced_value
                              )} */}
                              0
                            </h4>
                          </div>
                        </div>
                        <hr className="dark horizontal my-0" />
                        <div className="card-footer p-3">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              +3%{" "}
                            </span>
                            than lask month
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                            <i className=" material-icons  mdi mdi-checkbox-multiple-blank-outline" />
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              {/* Total Profits */}
                            </p>
                            <h4 className="mb-0">0</h4>
                          </div>
                        </div>
                        <hr className="dark horizontal my-0" />
                        <div className="card-footer p-3">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              +5%{" "}
                            </span>
                            than yesterday
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                            <i className=" material-icons mdi mdi-air-humidifier" />
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              {/* average Time of Payment{" "} */}
                            </p>
                            <h4 className="mb-0">
                              {formatter.format(consigneeData?.Average_Payment)}{" "}
                            </h4>
                          </div>
                        </div>
                        <hr className="dark horizontal my-0" />
                        <div className="card-footer p-3">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              +5%{" "}
                            </span>
                            than yesterday
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer text-center">
                  <Link className="btn btn-danger" to="/shipToNew">
                    Close
                  </Link>
                </div>
              </div>

              {/* accounting end */}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CreateClient;
