import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { API_IMAGE_URL } from "../../Url/Url";
import { Card } from "../../card";
import { TableView } from "../table";
import logo from "../../assets/logoNew.png";
import jsPDF from "jspdf";
import MySwal from "../../swal";
import "jspdf-autotable";
import { useQuery } from "react-query";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const ClientNew = () => {
  const navigate = useNavigate();
  const { data: clients } = useQuery("getClientDataAsOptions");
  const { data: paymentChannle } = useQuery("PaymentChannela");
  const { data: currency } = useQuery("getCurrency");

  const [isOn, setIsOn] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toDate, setToDate] = useState("");
  const [selectedClientId, setSelectedClientId] = useState(null); // New state for client_id
  const [data, setData] = useState([]);
  const [consignees, setConsignees] = useState([]);
  const [collectPaymentId, setCollectPaymentId] = useState("");

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [consigneeData, setConsigneeData] = useState("");
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
  const loadingModal = MySwal.mixin({
    title: "Loading...",
    didOpen: () => {
      MySwal.showLoading();
    },
    showCancelButton: false,
    showConfirmButton: false,
    allowOutsideClick: false,
  });
  const handleSubmit = async () => {
    console.log(selectedClientId);
    if (!selectedClientId?.client_id) {
      toast.error("Please select a client");
      return;
    }

    const payload = {
      client_id: selectedClientId?.client_id, // Use selected client_id
      from_date: fromDate,
      to_date: toDate,
    };
    try {
      const response = await axios.post(
        `${API_BASE_URL}/getClientStatement`,
        payload
      );
      console.log(response.data.data);
      let modalElement = document.getElementById("modalState");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        const doc = new jsPDF("landscape");
        const addLogoWithDetails = async () => {
          const imgData = logo;
          doc.addImage(imgData, "JPEG", 7, 5.7, 20, 20);
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text("Siam Eats Co.,Ltd. (0395561000010) ", 30, 10);
          doc.text("16/8 Mu 11 ", 30, 14);
          const longTextOne =
            "Khlong Nueng, Khlong Luang, Pathum Thani 12120 THAILAND";
          const maxWidthOne = 59;
          const linesOne = doc.splitTextToSize(longTextOne, maxWidthOne);
          let startXOne = 30;
          let startYOne = 18;
          linesOne.forEach((lineOne, index) => {
            doc.text(lineOne, startXOne, startYOne + index * 4.2); // Adjust the line height (10) as needed
          });
          //
          doc.setFontSize(17);
          doc.setTextColor(0, 0, 0);
          doc.text(`Statement`, 140, 11.5);
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(0, 0, 0);
          doc.text("Start Date:", 252, 9);
          doc.text("End date:", 252, 13);
          doc.text("Printed On:", 252, 17);
          doc.text(` ${formatDate(fromDate)}`, 272, 9);
          doc.text(` ${formatDate(toDate)}`, 272, 13);
          doc.text(` ${formatDate(new Date())}`, 272, 17);
        };
        doc.setFillColor(32, 55, 100);
        doc.rect(7, 27, doc.internal.pageSize.width - 15, 0.5, "FD");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text("Invoice to", 7, 32);
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
        let startY1 = 36.5;
        const lineHeight1 = 4.2;
        const longText1_1 = `${selectedClientId?.client_name}(${selectedClientId?.client_tax_number})`;
        const longText1_2 = `${selectedClientId?.client_address}`;
        const longText1_3 = `${selectedClientId?.client_email} / ${selectedClientId?.client_phone}`;

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
        doc.text("Pre Statement", 7, startY1 + 0.5);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Invoices : ", 7, startY1 + 5);
        doc.text(
          formatter.format(response.data.data?.pre_statement_Invoices),
          24,
          startY1 + 5
        );
        doc.text("Claim : ", 58, startY1 + 5);
        doc.text(
          formatter.format(response.data.data?.pre_statement_claims),
          71,
          startY1 + 5
        );
        doc.text("Payment : ", 100, startY1 + 5);
        doc.text(
          formatter.format(response.data.data?.pre_statement_payments),
          119,
          startY1 + 5
        );
        doc.text("Total : ", 150, startY1 + 5);
        doc.text(
          formatter.format(response.data.data?.pre_statement_Totals),
          162,
          startY1 + 5
        );
        await addLogoWithDetails();
        let yTop = startY1 + 7.5;
        const rows = response?.data?.result.map((item, index) => ({
          index: formatDate(item.Date_),
          AWB: item.AWB,
          Transaction_Ref: item.Transaction_Ref,
          Currnecy: item.Currnecy,
          Invocied_Amount: item.Invocied_Amount
            ? formatter.format(item.Invocied_Amount)
            : "",
          Paid_Amount: item.Paid_Amount
            ? formatter.format(item.Paid_Amount)
            : "",
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
            0: { halign: "left", cellWidth: 25 },
            1: { halign: "left", cellWidth: 42, overflow: "linebreak" },
            2: { halign: "left", cellWidth: 50, overflow: "linebreak" },
            3: { halign: "center", cellWidth: 25 },
            4: { halign: "right" },
            5: { halign: "right", cellWidth: 30 },
            6: { halign: "right", cellWidth: 40, overflow: "linebreak" },
            7: { halign: "right", cellWidth: 35, overflow: "linebreak" },
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
            doc.text(`${i} out  of ${pageCount}`, 274, 3.1);
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
      setSelectedClientId(null); // Reset client_id
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
      `${selectedClientId?.client_name || "default"}_Statement_${formatDate(
        new Date()
      )}.pdf`
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
            selectedClientId?.client_name
          }_Statement_${formatDate(new Date())}.pdf`
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
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2, // Ensures at least 2 digits after the decimal point
    maximumFractionDigits: 2, // Ensures no more than 2 digits after the decimal point
  });

  const newFormatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
  });
  const newFormatter3 = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 3,
  });
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
  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        id: "index",
        accessor: (_row, i) => i + 1,
      },

      {
        Header: "Name / Company",
        accessor: "client_name",
      },

      {
        Header: "Email",
        accessor: "client_email",
      },

      {
        Header: "Status",
        accessor: (a) => (
          <label
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px",
            }}
            className="toggleSwitch large"
            onclick=""
          >
            <input
              onChange={() => setIsOn(!isOn)}
              type="checkbox"
              defaultChecked
            />
            <span>
              <span>OFF</span>
              <span>ON</span>
            </span>
            <a> </a>
          </label>
        ),
      },

      {
        Header: "Actions",
        accessor: (a) => (
          <div className="" state={{ from: a }}>
            <Link
              to="/updateClient"
              className="mdi mdi-pencil"
              style={{
                width: "20px",
                color: "#203764",
                fontSize: "22px",
                marginTop: "10px",
              }}
              state={{ from: a }}
            />
            {/* <Link
              to="/ClientDash"
              state={{ from: { ...a } }}
              className="SvgAnchor"
            >
              {" "}
              <svg
                className="SvgQuo"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <title>chart-bubble</title>
                <path d="M7.2,11.2C8.97,11.2 10.4,12.63 10.4,14.4C10.4,16.17 8.97,17.6 7.2,17.6C5.43,17.6 4,16.17 4,14.4C4,12.63 5.43,11.2 7.2,11.2M14.8,16A2,2 0 0,1 16.8,18A2,2 0 0,1 14.8,20A2,2 0 0,1 12.8,18A2,2 0 0,1 14.8,16M15.2,4A4.8,4.8 0 0,1 20,8.8C20,11.45 17.85,13.6 15.2,13.6A4.8,4.8 0 0,1 10.4,8.8C10.4,6.15 12.55,4 15.2,4Z" />
              </svg>
            </Link>

            <Link
              to="/Clientdashtwo"
              state={{ from: { ...a } }}
              className="SvgAnchor"
            >
              <svg
                className="SvgQuo"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <title>chart-timeline-variant</title>
                <path d="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></path>
              </svg>{" "}
            </Link> */}

            <button
              type="button"
              className="SvgAnchor"
              data-bs-toggle="modal"
              data-bs-target="#modalPayment"
            >
              {" "}
              <svg
                className="SvgQuo"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <title>cash-check</title>
                <path d="M3 6V18H13.32C13.1 17.33 13 16.66 13 16H7C7 14.9 6.11 14 5 14V10C6.11 10 7 9.11 7 8H17C17 9.11 17.9 10 19 10V10.06C19.67 10.06 20.34 10.18 21 10.4V6H3M12 9C10.3 9.03 9 10.3 9 12C9 13.7 10.3 14.94 12 15C12.38 15 12.77 14.92 13.14 14.77C13.41 13.67 13.86 12.63 14.97 11.61C14.85 10.28 13.59 8.97 12 9M21.63 12.27L17.76 16.17L16.41 14.8L15 16.22L17.75 19L23.03 13.68L21.63 12.27Z"></path>
              </svg>
            </button>

            {/* Button trigger modal */}

            {/* Modal */}

            <button
              onClick={() => setSelectedClientId(a)} // Set client_id on button click
              className="SvgAnchor"
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#modalState"
            >
              <svg
                className="SvgQuo"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <title>currency-eth</title>
                <path d="M6,5H18V7H6M7,11H17V13H7M5.5,17H18.5V19H5.5"></path>
              </svg>
            </button>
          </div>
        ),
      },
      {
        Header: "Salary",
        accessor: (a) => <>{"100000000"}</>,
      },
    ],
    []
  );
  const getAirportData = () => {
    axios
      .get(`${API_BASE_URL}/getAllClients`)
      .then((response) => {
        if (response.data.success == true) {
          setData(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error) {
          toast.error("Network Error", {
            autoClose: 1000,
            theme: "colored",
          });
          return false;
        }
      });
  };

  useEffect(() => {
    getAirportData();
  }, []);

  return (
    <>
      <Card
        title="Client Management"
        endElement={
          <button
            type="button"
            onClick={() => navigate("/createClient")}
            className="btn button btn-info"
          >
            Create
          </button>
        }
      >
        <TableView columns={columns} data={data} />
      </Card>
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
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Statement
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
                      getOptionLabel={(option) => option.client_name || ""} // Label to display
                      onChange={(event, newValue) => {
                        setClientId(newValue ? newValue.client_id : ""); // Update clientId on selection
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select Client"
                          variant="outlined"
                        />
                      )}
                      value={
                        clients?.find((item) => item.client_id === clientId) ||
                        null
                      } // Selected value based on clientId
                      isOptionEqualToValue={(option, value) =>
                        option.client_id === value.client_id
                      } // Ensure option matching
                    />
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="parentFormPayment autoComplete">
                    <p>Consignee </p>
                    <Autocomplete
                      options={consignees || []}
                      getOptionLabel={(option) => option.consignee_name || ""} // Label to display
                      onChange={(event, newValue) => {
                        setConsigneeId(newValue ? newValue.consignee_id : ""); // Update consigneeId on selection
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select Consignee"
                          variant="outlined"
                        />
                      )}
                      value={
                        consignees?.find(
                          (item) => item.consignee_id === consigneeId
                        ) || null
                      } // Selected value based on consigneeId
                      isOptionEqualToValue={(option, value) =>
                        option.consignee_id === value.consignee_id
                      } // Ensure option matching
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
                        onChange={(e) => setPaymentDate(e.target.value)}
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
                        onChange={(e) => setClientPaymentRef(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 mt-3">
                  <div className="parentFormPayment autoComplete">
                    <p>Payment Channel </p>

                    <Autocomplete
                      options={paymentChannle || []} // Use paymentChannle as options
                      getOptionLabel={(option) => option.bank_name || ""} // Label to display
                      onChange={(event, newValue) => {
                        setPaymentChannel(newValue ? newValue.bank_id : ""); // Update paymentChannel on selection
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select Payment Channel"
                          variant="outlined"
                        />
                      )}
                      value={
                        paymentChannle?.find(
                          (item) => item.bank_id === paymentChannel
                        ) || null
                      } // Selected value based on paymentChannel
                      isOptionEqualToValue={(option, value) =>
                        option.bank_id === value.bank_id
                      } // Ensure option matching
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
                      <p>FX Payment</p>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={fxPayment}
                        onChange={(e) => setFxPayment(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 mt-3">
                  <div className="parentFormPayment autoComplete">
                    <p> FX </p>
                    <div>
                      <Autocomplete
                        options={currency || []} // List of currencies
                        getOptionLabel={(option) => option.currency || ""} // Display label
                        onChange={(event, newValue) => {
                          setFxId(newValue ? newValue.currency_id : ""); // Update selected fxId
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select Fx"
                            variant="outlined"
                          />
                        )}
                        value={
                          currency?.find((item) => item.currency_id === fxId) ||
                          null
                        } // Set value based on selected fxId
                        isOptionEqualToValue={(option, value) =>
                          option.currency_id === value.currency_id
                        } // Option comparison
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
                        onChange={(e) => setFxRate(e.target.value)}
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
                          setIntermittentBankCharges(e.target.value)
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
                        onChange={(e) => setLocalBankCharges(e.target.value)}
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
                        onChange={(e) => setThbReceived(e.target.value)}
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
                          setLossGainOnExchangeRate(e.target.value)
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
                                checked={!!checkedItems[item.transaction_ref]}
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
                                value={paidAmounts[item.transaction_ref] || ""}
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
  );
};

export default ClientNew;
