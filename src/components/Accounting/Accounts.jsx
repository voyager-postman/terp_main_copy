 import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { API_IMAGE_URL } from "../../Url/Url";
import { TableView } from "../table";
import { Card } from "../../card";
import MySwal from "../../swal";
import { ComboBox } from "../../components/combobox";
import jsPDF from "jspdf";
import logo from "../../assets/logoNew.png";
import NotoSansThaiRegular from "../../assets/fonts/NotoSansThai-Regular-normal";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import moment from "moment";
const Accounts = () => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [filterData, setFilterData] = useState("");

  const { data: clientVendor } = useQuery("getAllVendor");
  const loadingModal = MySwal.mixin({
    title: "Loading...",
    didOpen: () => {
      MySwal.showLoading();
    },
    showCancelButton: false,
    showConfirmButton: false,
    allowOutsideClick: false,
  });
  const [quantity, setQuantity] = useState("");
  const [selectedUnitType, setSelectedUnitType] = useState("");
  const [selectedPodItem, setSelectedPodItem] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [allAccontDetails, setAllAccountDeatils] = useState([]);
  const [bankList, setBankList] = useState([]);
  const [accountDataShow, setAccountDataShow] = useState("");
  const [paymentChanelShowData, setPaymentChanelShowData] = useState("");

  const [thbPaid, setThbPaid] = useState(0);
  const newFormatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const newFormatterTwo = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
  });
  const getAccount = () => {
    axios.get(`${API_BASE_URL}/WalletTotalAccounts`).then((res) => {
      console.log(res);
      setAllAccountDeatils(res.data.data);
      // setData(res.data.data || []);
    });
  };
  const getAccount1 = () => {
    axios.get(`${API_BASE_URL}/getBank`).then((res) => {
      console.log(res);
      setBankList(res.data.bankData);
    });
  };
  useEffect(() => {
    getAccount1();
  }, []);
  useEffect(() => {
    getAccount();
  }, []);

  // new
  // const [data, setData] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const location = useLocation();
  const { data: clients } = useQuery("getClientDataAsOptions");
  const { data: clients1 } = useQuery("getAllVendor");

  const { data: getBank } = useQuery("getBank");
  console.log(getBank);
  const { data: consignee } = useQuery("getConsignee");
  const [clientIdSet, setClientIdSet] = useState("");
  const [consigneeIdSet, setConsigneeIdSet] = useState("");
  const [consignees, setConsignees] = useState([]);
  const [collectPaymentId, setCollectPaymentId] = useState("");
  const [invoiceData, setInvoiceData] = useState(null);

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
  const [checkedItems, setCheckedItems] = useState({});
  const [toDate, setToDate] = useState("");
  console.log(clientId);

  const navigate = useNavigate();
  const [clientId1, setClientId1] = useState("");
  const [paymentTable2, setPaymentTable2] = useState([] || "");
  const [packagingTableData, setPackagingTableData] = useState([] || "");
  const [status, setStatus] = useState("");
  const [checkedItems1, setCheckedItems1] = useState({});
  const [paidAmounts1, setPaidAmounts1] = useState({});
  const [paymentDate1, setPaymentDate1] = useState("");
  const [clientPaymentRef1, setClientPaymentRef1] = useState("");
  const [paymentChannel1, setPaymentChannel1] = useState("");
  const [bankRef1, setBankRef1] = useState("");
  const [fxPayment1, setFxPayment1] = useState();
  const [fxId1, setFxId1] = useState("1");
  const [intermittentBankCharges1, setIntermittentBankCharges1] = useState("0");
  const [fxRate1, setFxRate1] = useState("1");
  const [totalPaidAmount1, setTotalPaidAmount1] = useState(0);
  const [collectPaymentId1, setCollectPaymentId1] = useState("");
  const [localBankCharges1, setLocalBankCharges1] = useState("0");
  const [lossGainOnExchangeRate1, setLossGainOnExchangeRate1] = useState("0");
  const [thbReceived1, setThbReceived1] = useState("");
  const [data, setData] = useState([]);
  const [fromBank, setFromBank] = useState(null);
  const [toBank, setToBank] = useState(null);
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");

  const [selectedInvoice, setSelectedInvoice] = useState("Client");
  const handleRadioChange = (event) => {
    setSelectedInvoice(event.target.value);
  };
  const [ref, setRef] = useState("");
  const handleCurrencyChange1 = (currencyId) => {
    if (!currencyId) {
      setFxId1(null);
      setFxRate1("");
      return;
    }

    const newFormatter = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const handleSubmit = async () => {
      const payload = {
        client_id: clientIdSet, // Use selected client_id
        consignee_id: consigneeIdSet,
        from_date: fromDate,
        to_date: toDate,
      };

      try {
        const response = await axios.post(
          `${API_BASE_URL}/getConsigneeStatement`,
          payload
        );
        console.log(response.data.data);
        getInventoryList();
        let modalElement = document.getElementById("modalState");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
          const doc = new jsPDF("landscape");
          doc.addFileToVFS("NotoSansThai-Regular.ttf", NotoSansThaiRegular);
          doc.addFont("NotoSansThai-Regular.ttf", "NotoSansThai", "normal");
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
            // adddress
            doc.setFontSize(17);
            doc.setTextColor(0, 0, 0);
            doc.text(`Statement`, 140, 11.5);
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);
            doc.text("Start Date:", 252, 9);
            doc.text("End date:", 252, 13);
            doc.text("Printed On:", 252, 17);

            doc.text(`${formatDate(fromDate)}`, 272.5, 9);
            doc.text(`${formatDate(toDate)}`, 272, 13);
            doc.text(`${formatDate(new Date())}`, 272, 17);
          };
          doc.setFillColor(32, 55, 100);
          doc.rect(7, 27, doc.internal.pageSize.width - 15, 0.5, "FD");
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(12);
          doc.text("Invoice to", 7, 32);
          doc.text("Consignee Details", 216.5, 32);
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

          const longText1_1 = `${response.data.clientAdress?.client_name}(${response.data.clientAdress?.client_tax_number})`;
          const longText1_2 = `${response.data.clientAdress?.client_address}`;
          const longText1_3 = `${response.data.clientAdress?.client_email} / ${response.data.clientAdress?.client_phone}`;

          // Render client details
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

          // Consignee details
          const maxWidth2 = 72;
          const startX2 = 216.5; // Start X position for the consignee details
          const lineHeight2 = 4.2;
          doc.setFontSize(11);

          const longText2_1 = `${response.data.consigneeAddress?.consignee_name}(${response.data.consigneeAddress?.consignee_tax_number})`;
          const longText2_2 = `${response.data.consigneeAddress?.consignee_address}`;
          const longText2_3 = `${response.data.consigneeAddress?.consignee_email}/${response.data.consigneeAddress?.consignee_phone}`;

          // Reset the startY position for consignee details to align with client details
          let startY2 = 36.5;

          // Render consignee details using the same startY for alignment
          startY2 = renderWrappedText(
            doc,
            longText2_1,
            startX2,
            startY2,
            maxWidth2,
            lineHeight2
          );
          doc.setFontSize(10);
          startY2 = renderWrappedText(
            doc,
            longText2_2,
            startX2,
            startY2,
            maxWidth2,
            lineHeight2
          );
          startY2 = renderWrappedText(
            doc,
            longText2_3,
            startX2,
            startY2,
            maxWidth2,
            lineHeight2
          );

          // Determine the maximum Y position to avoid overlap
          startY = Math.max(startY, startY2);

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
          doc.text("Pre Statement", 7, startY + 0.5);
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.text("Invoices : ", 7, startY + 5);
          doc.text(
            formatter.format(response.data.data?.pre_statement_Invoices),
            24,
            startY + 5
          );
          doc.text("Claim : ", 58, startY + 5);
          doc.text(
            formatter.format(response.data.data?.pre_statement_claims),
            71,
            startY + 5
          );
          doc.text("Payment : ", 100, startY + 5);
          doc.text(
            formatter.format(response.data.data?.pre_statement_payments),
            119,
            startY + 5
          );
          doc.text("Total : ", 150, startY + 5);
          doc.text(
            formatter.format(response.data.data?.pre_statement_Totals),
            162,
            startY + 5
          );
          await addLogoWithDetails();
          let yTop = startY + 7.5;
          const rows = response?.data?.result.map((item, index) => ({
            index: formatDate(item.Date),
            AWB: item.AWB,
            Transaction_Ref: item.Transaction_Ref,
            Currnecy: item.Currnecy,
            Invocied_Amount: item.Invocied_Amount
              ? newFormatter.format(item.Invocied_Amount)
              : "",
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
                "Payment",
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
          doc.text(
            formatter.format(response.data.data?.Total),
            162,
            finalY + 24
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
          await uploadPDF(pdfBlob, invoiceData);
        }
        // Handle the response data as needed
        setFromDate("");
        setConsigneeIdSet("");
        setClientIdSet("");
        setToDate("");
        toast.success("Statement Added successful");
      } catch (error) {
        console.error("Error fetching statement:", error);
        toast.error("Something went Wrong ");
        // Handle the error as needed
      }
    };
    setFxId1(currencyId);
    const selectedCurrency = currency.find(
      (item) => item.currency_id === parseInt(currencyId)
    );

    if (selectedCurrency) {
      setFxRate1(selectedCurrency.fx_rate);
    } else {
      setFxRate1("");
    }
  };
  const clearData = () => {
    setSelectedInvoice("Client");
  };
  useEffect(() => {
    if (clientId1) {
      paymentTable3();
    }
  }, [clientId1]);
  const paymentTable3 = () => {
    axios
      .post(`${API_BASE_URL}/purchaseOrderListByVendor`, {
        vendor_id: clientId1,
      })
      .then((res) => {
        console.log(res);
        setPaymentTable2(res.data.data);
        // setData(res.data.data);
      })
      .catch((error) => {
        console.log("There was an error fetching the data!", error);
      });
  };

  useEffect(() => {
    // Ensure THB Paid and Loss/Gain stay in sync
    const updatedLossGain = fxPayment - thbPaid;
    setLossGainOnExchangeRate1(updatedLossGain);
  }, [fxPayment]);
  const dataClear7 = () => {
    setClientIdSet("");
    setConsigneeIdSet("");
    setFromDate("");
    setToDate("");
  };
  const handleSubmit7 = async () => {
    const payload = {
      client_id: clientIdSet, // Use selected client_id
      consignee_id: consigneeIdSet,
      from_date: fromDate,
      to_date: toDate,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/getConsigneeStatement`,
        payload
      );
      console.log(response.data.data);
      getInventoryList();

      let modalElement = document.getElementById("modalConsignee");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
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
          // adddress
          doc.setFontSize(17);
          doc.setTextColor(0, 0, 0);
          doc.text(`Statement`, 140, 11.5);
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(0, 0, 0);
          doc.text("Start Date:", 252, 9);
          doc.text("End date:", 252, 13);
          doc.text("Printed On:", 252, 17);

          doc.text(`${formatDate(fromDate)}`, 272.5, 9);
          doc.text(`${formatDate(toDate)}`, 272, 13);
          doc.text(`${formatDate(new Date())}`, 272, 17);
        };
        doc.setFillColor(32, 55, 100);
        doc.rect(7, 27, doc.internal.pageSize.width - 15, 0.5, "FD");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text("Invoice to", 7, 32);
        doc.text("Consignee Details", 216.5, 32);
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

        const longText1_1 = `${response.data.clientAdress?.client_name}(${response.data.clientAdress?.client_tax_number})`;
        const longText1_2 = `${response.data.clientAdress?.client_address}`;
        const longText1_3 = `${response.data.clientAdress?.client_email} / ${response.data.clientAdress?.client_phone}`;

        // Render client details
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

        // Consignee details
        const maxWidth2 = 72;
        const startX2 = 216.5; // Start X position for the consignee details
        const lineHeight2 = 4.2;
        doc.setFontSize(11);

        const longText2_1 = `${response.data.consigneeAddress?.consignee_name}(${response.data.consigneeAddress?.consignee_tax_number})`;
        const longText2_2 = `${response.data.consigneeAddress?.consignee_address}`;
        const longText2_3 = `${response.data.consigneeAddress?.consignee_email}/${response.data.consigneeAddress?.consignee_phone}`;

        // Reset the startY position for consignee details to align with client details
        let startY2 = 36.5;

        // Render consignee details using the same startY for alignment
        startY2 = renderWrappedText(
          doc,
          longText2_1,
          startX2,
          startY2,
          maxWidth2,
          lineHeight2
        );
        doc.setFontSize(10);
        startY2 = renderWrappedText(
          doc,
          longText2_2,
          startX2,
          startY2,
          maxWidth2,
          lineHeight2
        );
        startY2 = renderWrappedText(
          doc,
          longText2_3,
          startX2,
          startY2,
          maxWidth2,
          lineHeight2
        );

        // Determine the maximum Y position to avoid overlap
        startY = Math.max(startY, startY2);

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
        doc.text("Pre Statement", 7, startY + 0.5);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Invoices : ", 7, startY + 5);
        doc.text(
          formatter.format(response.data.data?.pre_statement_Invoices),
          24,
          startY + 5
        );
        doc.text("Claim : ", 58, startY + 5);
        doc.text(
          formatter.format(response.data.data?.pre_statement_claims),
          71,
          startY + 5
        );
        doc.text("Payment : ", 100, startY + 5);
        doc.text(
          formatter.format(response.data.data?.pre_statement_payments),
          119,
          startY + 5
        );
        doc.text("Total : ", 150, startY + 5);
        doc.text(
          formatter.format(response.data.data?.pre_statement_Totals),
          162,
          startY + 5
        );
        await addLogoWithDetails();
        let yTop = startY + 7.5;
        const rows = response?.data?.result.map((item, index) => ({
          index: formatDate(item.Date),
          AWB: item.AWB,
          Transaction_Ref: item.Transaction_Ref,
          Currnecy: item.Currnecy,
          Invocied_Amount: item.Invocied_Amount
            ? newFormatter.format(item.Invocied_Amount)
            : "",
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
              "Payment",
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
        await uploadPDF7(pdfBlob);
      }
      // Handle the response data as needed
      setFromDate("");
      setConsigneeIdSet("");
      setClientIdSet("");
      setToDate("");
      toast.success("Statement Added successful");
    } catch (error) {
      console.error("Error fetching statement:", error);
      toast.error("Something went Wrong ");
      // Handle the error as needed
    }
  };
  const uploadPDF7 = async (pdfBlob) => {
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;
    const formData = new FormData();
    formData.append("document", pdfBlob, `_Statement_${dateTime}.pdf`);

    setIsLoading(true);
    loadingModal.fire();
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(`${API_IMAGE_URL}_Statement_${dateTime}.pdf`);
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
  const handleCheckboxChange1 = (invoiceNumber, isChecked) => {
    setCheckedItems1((prev) => {
      const updatedCheckedItems = { ...prev, [invoiceNumber]: isChecked };

      // Automatically set Paid Amount to the corresponding amount_to_pay if checked
      const amountToPay = isChecked
        ? paymentTable2.find((item) => item.po_id === invoiceNumber)
            ?.amount_to_pay || 0
        : "";

      // Update Paid Amounts
      setPaidAmounts1((prevPaidAmounts) => {
        const updatedPaidAmounts = {
          ...prevPaidAmounts,
          [invoiceNumber]: amountToPay,
        };

        // Calculate the total of all paid amounts for checked items only
        const totalPaidAmount = paymentTable2.reduce((sum, item) => {
          if (updatedCheckedItems[item.po_id]) {
            return sum + (parseFloat(updatedPaidAmounts[item.po_id]) || 0);
          }
          return sum;
        }, 0);

        setTotalPaidAmount1(totalPaidAmount);
        setFxPayment1(totalPaidAmount);
        const thbPaidValue =
          totalPaidAmount - (parseFloat(lossGainOnExchangeRate1) || 0);
        setThbPaid(thbPaidValue); // Se
        return updatedPaidAmounts;
      });

      return updatedCheckedItems;
    });
  };
  const handlePaidAmountChange1 = (invoiceNumber, value) => {
    setPaidAmounts1((prev) => {
      const updatedPaidAmounts = {
        ...prev,
        [invoiceNumber]: value,
      };

      // Calculate the total of all paid amounts for checked items only
      const totalPaidAmount = paymentTable2.reduce((sum, item) => {
        if (checkedItems1[item.po_id]) {
          return sum + (parseFloat(updatedPaidAmounts[item.po_id]) || 0);
        }
        return sum;
      }, 0);

      setTotalPaidAmount1(totalPaidAmount);
      setFxPayment1(totalPaidAmount);
      return updatedPaidAmounts;
    });
  };

  const handleLossGainChange = (e) => {
    const value = e.target.value || 0; // Ensure value is a number
    setThbPaid(value); // Update THB Paid state
  };
  const handleLossGainChange1 = (e) => {
    const value = e.target.value; // Parse input or fallback to 0
    setLossGainOnExchangeRate1(value);
    const thbPaidValue = fxPayment1 - value; // Ensure calculations are clear
    setThbPaid(thbPaidValue); // Update THB Paid value
    // Recalculate THB Paid
    // const thbPaidValue = fxPayment - value; // Ensure calculations are clear
    // setThbPaid(thbPaidValue); // Update THB Paid value
  };

  useEffect(() => {
    // Ensure THB Paid and Loss/Gain stay in sync
    const updatedLossGain = fxPayment1 - thbPaid;
    setLossGainOnExchangeRate1(updatedLossGain);
  }, [fxPayment1]);
  const dataCleartransfer = () => {
    setFromBank("");
    setToBank("");
    setDate("");
    setAmount("");
    setRef("");
  };
  const handleSubmitData = async () => {
    // Validate that all fields are filled

    // Constructing the data for the API request
    const data = {
      From: fromBank.id, // Bank ID for 'From'
      To: toBank.id, // Bank ID for 'To'
      Date: date,
      Amount: amount,
      REF: ref,
    };
    console.log(data);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/AccountTransfer`,
        data
      );
      console.log("Response:", response.data);
      getInventoryList();
      // Close the modal
      let modalElement = document.getElementById("modalClaim");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        clearAllFields();
        modalInstance.hide();
      }

      toast.success("Amount Transfer Successful");
    } catch (error) {
      console.error("Error during account transfer:", error);
      toast.error("Something went wrong during the transfer");
    }
  };

  // Clear form fields after submission
  const clearAllFields = () => {
    setFromBank(null);
    setToBank(null);
    setDate("");
    setAmount("");
    setRef("");
  };
  const dataAllClear = () => {
    setClientId1(""); // Clear Vendor selection
    setPaymentDate1(""); // Clear Payment Date
    setClientPaymentRef1(""); // Clear Client Payment Ref
    setPaymentChannel1(""); // Clear Payment Channel selection
    setBankRef1(""); // Clear Bank Ref
    setFxPayment1("0");
    setFxRate1("0");
    setFxId1("1");
    setIntermittentBankCharges1("0");
    setThbPaid("");
    setLocalBankCharges1("0");
    setThbReceived1("");
    setLossGainOnExchangeRate1("0");
    setPaidAmounts1({});
    setCheckedItems1({});
    setPaymentTable2([]); // Clear paymentTable1
    setNotes("");
  };

  // const dataAllClear = () => {
  //   setClientId1("");
  //   setPaymentDate1("");
  //   setClientPaymentRef1("");
  //   setPaymentChannel1("");
  //   setBankRef1("");
  //   setFxPayment1("0");
  //   setFxRate1("0");
  //   setFxId1("1");
  //   setIntermittentBankCharges1("0");
  //   setThbPaid("");
  //   setLocalBankCharges1("0");
  //   setThbReceived1("");
  //   setLossGainOnExchangeRate1("0");
  //   setPaidAmounts1({});
  //   setCheckedItems1({});
  //   setPaymentTable2([]); // Clear paymentTable1
  // };
  const handleDownloadPDF = async (Invoice_Payment_ID, a) => {
    setInvoiceData(Invoice_Payment_ID);

    // Get the modal element and instance
    const modalElement = document.getElementById("exampleModalCustomization");
    const modalInstance = new bootstrap.Modal(modalElement);

    // Show the modal
    modalInstance.show();
    document.body.style.overflow = "auto";
    modalElement.addEventListener("hidden.bs.modal", () => {
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.remove();
      }
      document.body.style.overflow = "auto";
    });
  };

  const handleDownloadPDFSlip = async (Expense_Payment_ID, a) => {
    console.log(Expense_Payment_ID);
    console.log(a);
    try {
      const response = await axios.post(`${API_BASE_URL}/expensePaymentSlip`, {
        Expense_Payment_ID: Expense_Payment_ID,
      });
      console.log(response.data.table_data);
      const doc = new jsPDF();
      doc.addFileToVFS("NotoSansThai-Regular.ttf", NotoSansThaiRegular);
      doc.addFont("NotoSansThai-Regular.ttf", "NotoSansThai", "normal");
      const imgData = logo;
      doc.addImage(imgData, "JPEG", 6, 2, 20, 20);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`${response?.data?.companyAddress?.Line_1}`, 30, 8);
      doc.setTextColor(0, 0, 0);
      doc.text(`${response?.data?.companyAddress?.Line_2}`, 30, 12);
      const longTextOne = `${response?.data?.companyAddress?.Line_3}`;
      const maxWidthOne = 90;
      const linesOne = doc.splitTextToSize(longTextOne, maxWidthOne);
      let startXOne = 30;
      let startYOne = 16;
      linesOne.forEach((lineOne, index) => {
        doc.text(lineOne, startXOne, startYOne + index * 4.2);
      });
      doc.setFillColor(33, 56, 99);
      doc.rect(7, 23, doc.internal.pageSize.width - 15, 0.5, "FD");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      const newFormatter1 = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      });
      const newFormatterZero = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      const newFormatter5 = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      const text = " Expense Payment Slip";
      const pageWidth = doc.internal.pageSize.width;
      const textWidth = doc.getTextWidth(text);
      const xPosition = (pageWidth - textWidth) / 2;
      doc.text(text, xPosition, 28);
      doc.setFillColor(33, 56, 99);
      doc.rect(7, 30, doc.internal.pageSize.width - 15, 0.5, "FD");
      doc.setFontSize(12);
      const maxWidth1 = 70;
      const startX1 = 7;
      let startY1 = 35;
      const lineHeight1 = 4.2;
      const longText1_4 = `${response?.data?.vendorAddress?.Name_exp_2}`;
      // Function to render wrapped text
      doc.setFont("NotoSansThai"); // Set the font to use
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
      doc.setFontSize(11); // Adjust font size for the next text block
      doc.setFontSize(10);
      const lineHeight = 5;
      const maxWidthValue = 70;

      function renderLabelAndValue(
        doc,
        label,
        value,
        labelX,
        valueX,
        yPosition,
        maxWidth,
        lineHeight,
        alignRight = false
      ) {
        // Render the label on the left
        doc.text(label, labelX, yPosition);
        const valueLines = doc.splitTextToSize(value, maxWidth);
        valueLines.forEach((line, index) => {
          const yOffset = index * lineHeight;
          let finalValueX = valueX;
          if (alignRight) {
            const textWidth = doc.getTextWidth(line);
            finalValueX = valueX - textWidth;
          }
          doc.text(line, finalValueX, yPosition + yOffset);
        });
        return yPosition + (valueLines.length - 1) * lineHeight;
      }
      let tableEndY = 30;
      let currentY = tableEndY + 4;
      // Right side
      let currentYRight = tableEndY + 4;
      currentYRight = renderLabelAndValue(
        doc,
        "Bank Name:",
        `${response?.data?.bank_details?.bank_name}`,
        130,
        200,
        currentYRight,
        maxWidthValue,
        lineHeight,
        true
      );
      doc.setFont("NotoSansThai"); // Set the font to use

      currentYRight = renderLabelAndValue(
        doc,
        "Account Name:",
        `${response?.data?.bank_details?.bank_account}`,
        130,
        200,
        currentYRight + lineHeight,
        maxWidthValue,
        lineHeight,
        true
      );
      currentYRight = renderLabelAndValue(
        doc,
        "Account Number:",
        `${response?.data?.bank_details?.bank_number}`,
        130,
        200,
        currentYRight + lineHeight,
        maxWidthValue,
        lineHeight,
        true
      );
      currentYRight = renderLabelAndValue(
        doc,
        "Paid On:",
        new Date(
          `${response?.data?.bank_details?.Payment_Date}`
        ).toLocaleDateString(),
        130,
        200,
        currentYRight + lineHeight,
        maxWidthValue,
        lineHeight,
        true
      );
      currentYRight = renderLabelAndValue(
        doc,
        "Paid With:",
        `${response?.data?.bank_details?.bankAccount_name}`,
        130,
        200,
        currentYRight + lineHeight,
        maxWidthValue,
        lineHeight,
        true
      );
      // currentYRight = renderLabelAndValue(doc, "Loss/Gain on Exchange Rate:", "2123.12312", 100, 149, currentYRight + lineHeight, maxWidthValue, lineHeight);
      const maxY = Math.max(startY1, currentYRight);
      const helloYPosition = maxY + 2;
      const rows = response?.data?.table_data.map((item, index) => ({
        index: index + 1,
        paidAmount: item.Date
          ? new Date(item.Date).toLocaleDateString("en-GB") // Format as DD/MM/YYYY
          : "",
        docAcc: item["PO Number"],
        invNum: item.Invoice_Number,
        unit: item.FX,
        invAmount: newFormatter5.format(item.Total_After_Tax),
        detbit: item["Debit Note"],
        net: item["Net Amount"] ? newFormatter5.format(item["Net Amount"]) : "",
      }));

      doc.autoTable({
        head: [
          [
            "#",
            "Date",
            "Document Number",
            "Invoice Number",
            "FX",
            "Invoice Amount",
            "Debit Note",
            "Net Amount",
          ],
        ],
        body: rows.map((row) => [
          row.index,
          row.paidAmount,
          row.docAcc,
          row.invNum,
          row.unit,
          row.invAmount,
          row.detbit,
          row.net,
          row.paidAmount,
        ]),
        columnStyles: {
          3: { halign: "center" },
          5: { halign: "right" },
          7: { halign: "right" },
        },
        startX: 0,
        startY: helloYPosition,
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

      const tableEndYSlip = doc.lastAutoTable.finalY;
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
      let currentYSlip = tableEndYSlip + 5;
      const totalPayAmount = parseFloat(
        response?.data?.total_all?.["Apayment Amount"]
          ? response.data.total_all["Apayment Amount"].replace(/,/g, "")
          : 0 // Default value if undefined or null
      );

      const totalAmount = parseFloat(
        response?.data?.total_all?.Total
          ? response.data.total_all.Total.replace(/,/g, "")
          : 0
      );

      // Render "Total"
      const textTotal = newFormatter5.format(totalAmount);

      renderRightAlignedText(
        doc,
        "TOTAL",
        textTotal,
        labelX,
        rightBoundary,
        fixedWidth,
        currentYSlip
      );
      currentYSlip += 5;
      const textTotalVat = newFormatter5.format(
        parseFloat(response?.data?.total_all?.VAT?.replace(/,/g, "")) || 0
      );

      renderRightAlignedText(
        doc,
        "VAT",
        textTotalVat,
        labelX,
        rightBoundary,
        fixedWidth,
        currentYSlip
      );
      currentYSlip += 5;
      const textTotalWht = newFormatter5.format(
        parseFloat(response?.data?.total_all?.WHT?.replace(/,/g, "")) || 0
      );

      renderRightAlignedText(
        doc,
        "WHT",
        textTotalWht,
        labelX,
        rightBoundary,
        fixedWidth,
        currentYSlip
      );
      doc.rect(145, tableEndYSlip + 16.5, 58, 0.5, "FD");
      currentYSlip += 5.5;
      const textTotalPay = newFormatter5.format(totalPayAmount);

      renderRightAlignedText(
        doc,
        "Payment Amount   ",
        textTotalPay,
        labelX,
        rightBoundary,
        fixedWidth,
        currentYSlip
      );
      doc.rect(145, tableEndYSlip + 22, 58, 0.5, "FD");
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
      // Upload the PDF to the server
      await uploadPDF1(pdfBlob, Expense_Payment_ID);
    } catch (error) {
      console.error("Error fetching statement:", error);
      toast.error("Something went Wrong ");
      // Handle the error as needed
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
  const uploadPDF1 = async (pdfBlob, Expense_Payment_ID) => {
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;
    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${Expense_Payment_ID}_Expense_Payment_Slip_${dateTime}.pdf`
    );
    setIsLoading(true);
    loadingModal.fire();
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${Expense_Payment_ID}_Expense_Payment_Slip_${dateTime}.pdf`
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
  const uploadPDF2 = async (pdfBlob, Expense_Payment_ID) => {
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;
    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${Expense_Payment_ID}_Commission_Payment_Slip_${dateTime}.pdf`
    );
    setIsLoading(true);
    loadingModal.fire();
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${Expense_Payment_ID}_Commission_Payment_Slip_${dateTime}.pdf`
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
  const generatePdf = async () => {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    try {
      const response = await axios.post(`${API_BASE_URL}/InvoicePaymentSlip`, {
        Invoice_Payment_ID: invoiceData,
      });
      let modalElement = document.getElementById("exampleModalCustomization");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }

      console.log(response.data);
      const doc = new jsPDF();
      const imgData = logo;
      doc.addImage(imgData, "JPEG", 6, 2, 20, 20);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`${response?.data?.companyAddress?.Line_1}`, 30, 8);
      doc.setTextColor(0, 0, 0);
      doc.text(`${response?.data?.companyAddress?.Line_2}`, 30, 12);
      const longTextOne = `${response?.data?.companyAddress?.Line_3}`;
      const maxWidthOne = 90;
      const linesOne = doc.splitTextToSize(longTextOne, maxWidthOne);
      let startXOne = 30;
      let startYOne = 16;
      linesOne.forEach((lineOne, index) => {
        doc.text(lineOne, startXOne, startYOne + index * 4.2);
      });
      doc.setFillColor(33, 56, 99);
      doc.rect(7, 23, doc.internal.pageSize.width - 15, 0.5, "FD");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      const text = "Payment Details";
      const pageWidth = doc.internal.pageSize.width;
      const textWidth = doc.getTextWidth(text);
      const xPosition = (pageWidth - textWidth) / 2;
      doc.text(text, xPosition, 28);
      doc.setFillColor(33, 56, 99);
      doc.rect(7, 30, doc.internal.pageSize.width - 15, 0.5, "FD");
      doc.setFontSize(10);
      const newFormatter1 = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      });
      const newFormatterZero = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      const newFormatter5 = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      const rows = response?.data?.table_data.map((item, index) => ({
        index: index + 1,
        pd: item.Invoice,
        qty: item["TT REF"],
        unit: item.FX,
        price: newFormatter5.format(
          parseFloat((item["Invoice Amount"] || "").replace(/,/g, "")) || 0
        ),
        vat: item["Credit Note"],
        total: newFormatter5.format(
          parseFloat((item["Net Amount"] || "").replace(/,/g, "")) || 0
        ),
        wht: newFormatter5.format(
          parseFloat((item["Paid Amount"] || "").replace(/,/g, "")) || 0
        ),
      }));

      doc.setFontSize(10);
      const lineHeight = 5; // Line height for text
      const maxWidthValue = 70; // Set maximum width for value text
      function renderLabelAndValue(
        doc,
        label,
        value,
        labelX,
        valueX,
        yPosition,
        maxWidth,
        lineHeight
      ) {
        doc.text(label, labelX, yPosition);
        const valueLines = doc.splitTextToSize(value, maxWidth);
        valueLines.forEach((line, index) => {
          const yOffset = index * lineHeight; // Adjust the y-axis for each new line
          doc.text(line, valueX, yPosition + yOffset);
        });
        return yPosition + (valueLines.length - 1) * lineHeight;
      }
      let tableEndY = 31;
      let currentY = tableEndY + 4;
      currentY = renderLabelAndValue(
        doc,
        "Client:",
        `${response?.data?.headerData?.Client}`,
        7,
        20,
        currentY,
        maxWidthValue,
        lineHeight
      );
      currentY = renderLabelAndValue(
        doc,
        "Payment Date:",
        new Date(
          `${response?.data?.headerData["Payment Date"]}`
        ).toLocaleDateString(),
        7,
        50,
        currentY + lineHeight,
        maxWidthValue,
        lineHeight
      );
      currentY = renderLabelAndValue(
        doc,
        "Payment Channel:",
        `${response?.data?.headerData["Payment Channel"]}`,
        7,
        50,
        currentY + lineHeight,
        maxWidthValue,
        lineHeight
      );
      currentY = renderLabelAndValue(
        doc,
        "Client Payment Ref:",

        `${response?.data?.headerData["Client Payment Ref"]}`,
        7,
        50,
        currentY + lineHeight,
        maxWidthValue,
        lineHeight
      );
      currentY = renderLabelAndValue(
        doc,
        "FX Payment:",
        newFormatter5.format(
          parseFloat(
            response?.data?.headerData["FX Payment"]?.replace(/,/g, "")
          ) || 0
        ),

        7,
        50,
        currentY + lineHeight,
        maxWidthValue,
        lineHeight
      );

      if (selectedInvoice === "Client") {
        currentY = renderLabelAndValue(
          doc,
          "FX:",
          `${response?.data?.headerData?.FX}`,
          7,
          50,
          currentY + lineHeight,
          maxWidthValue,
          lineHeight
        );
      }

      // Right side
      let currentYRight = tableEndY + 4;
      currentYRight = renderLabelAndValue(
        doc,
        "Consignee:",
        `${response?.data?.headerData?.Consignee}`,
        100,
        135,
        currentYRight,
        maxWidthValue,
        lineHeight
      );

      if (selectedInvoice === "Client") {
        currentYRight = renderLabelAndValue(
          doc,
          "Bank Ref:",
          `${response?.data?.headerData["Bank Ref"]}`,
          100,
          149,
          currentYRight + lineHeight,
          maxWidthValue,
          lineHeight
        );
        currentYRight = renderLabelAndValue(
          doc,
          "THB Received:",
          newFormatter5.format(
            parseFloat(
              response?.data?.headerData["THB Received"]?.replace(/,/g, "")
            ) || 0
          ),
          100,
          149,
          currentYRight + lineHeight,
          maxWidthValue,
          lineHeight
        );
        currentYRight = renderLabelAndValue(
          doc,
          "Bank Fees:",
          newFormatter5.format(
            parseFloat(
              response?.data?.headerData["Local Bank Charges"]?.replace(
                /,/g,
                ""
              )
            ) || 0
          ),
          100,
          149,
          currentYRight + lineHeight,
          maxWidthValue,
          lineHeight
        );
        currentYRight = renderLabelAndValue(
          doc,
          "Loss/Gain on Exchange Rate:",
          `${response?.data?.headerData["Loss/Gain on Exchange Rate"]}`,
          100,
          149,
          currentYRight + lineHeight,
          maxWidthValue,
          lineHeight
        );
      }
      const maxY = Math.max(currentY, currentYRight);
      const helloYPosition = maxY + 2;
      doc.autoTable({
        head: [
          [
            "#",
            "Document Number",
            "TT REF",
            "FX",
            "Invoice Amount",
            "Credit Note",
            "Net Amount",
            "Paid Amount",
          ],
        ],
        body: rows.map((row) => [
          row.index,
          row.pd,
          row.qty,
          row.unit,
          row.price,
          row.vat,
          row.total,
          row.wht,
          row.create,
        ]),
        columnStyles: {
          0: { halign: "center" },
          1: { halign: "left" },
          2: { halign: "right" },
          3: { halign: "center" },
          4: { halign: "right" },
          5: { halign: "right" },
          6: { halign: "right" },
          7: { halign: "right" },
          8: { halign: "center" },
        },
        startX: 0,
        startY: helloYPosition,
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
      // Render "Payment Date" as a single line example
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
      // Upload the PDF to the server
      await uploadPDF(pdfBlob, invoiceData);
    } catch (error) {
      console.error("Error fetching statement:", error);
      toast.error("Something went Wrong ");
      // Handle the error as needed
    }
  };
  const uploadPDF = async (pdfBlob, invoiceData) => {
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;
    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${invoiceData}_Account_Payment_Slip_${dateTime}.pdf`
    );
    setIsLoading(true);
    loadingModal.fire();
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${invoiceData}_Account_Payment_Slip_${dateTime}.pdf`
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
  const handleSubmit5 = async () => {
    const payload = {
      client_id: clientIdSet, // Use selected client_id
      consignee_id: consigneeIdSet,
      from_date: fromDate,
      to_date: toDate,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/getConsigneeStatement`,
        payload
      );
      console.log(response.data.data);
      let modalElement = document.getElementById("yt56555");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
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
          // adddress
          doc.setFontSize(17);
          doc.setTextColor(0, 0, 0);
          doc.text(`Statement`, 140, 11.5);
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(0, 0, 0);
          doc.text("Start Date:", 252, 9);
          doc.text("End date:", 252, 13);
          doc.text("Printed On:", 252, 17);

          doc.text(`${formatDate(fromDate)}`, 272.5, 9);
          doc.text(`${formatDate(toDate)}`, 272, 13);
          doc.text(`${formatDate(new Date())}`, 272, 17);
        };
        doc.setFillColor(32, 55, 100);
        doc.rect(7, 27, doc.internal.pageSize.width - 15, 0.5, "FD");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text("Invoice to", 7, 32);
        doc.text("Consignee Details", 216.5, 32);
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

        const longText1_1 = `${response.data.clientAdress?.client_name}(${response.data.clientAdress?.client_tax_number})`;
        const longText1_2 = `${response.data.clientAdress?.client_address}`;
        const longText1_3 = `${response.data.clientAdress?.client_email} / ${response.data.clientAdress?.client_phone}`;

        // Render client details
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

        // Consignee details
        const maxWidth2 = 72;
        const startX2 = 216.5; // Start X position for the consignee details
        const lineHeight2 = 4.2;
        doc.setFontSize(11);

        const longText2_1 = `${response.data.consigneeAddress?.consignee_name}(${response.data.consigneeAddress?.consignee_tax_number})`;
        const longText2_2 = `${response.data.consigneeAddress?.consignee_address}`;
        const longText2_3 = `${response.data.consigneeAddress?.consignee_email}/${response.data.consigneeAddress?.consignee_phone}`;

        // Reset the startY position for consignee details to align with client details
        let startY2 = 36.5;

        // Render consignee details using the same startY for alignment
        startY2 = renderWrappedText(
          doc,
          longText2_1,
          startX2,
          startY2,
          maxWidth2,
          lineHeight2
        );
        doc.setFontSize(10);
        startY2 = renderWrappedText(
          doc,
          longText2_2,
          startX2,
          startY2,
          maxWidth2,
          lineHeight2
        );
        startY2 = renderWrappedText(
          doc,
          longText2_3,
          startX2,
          startY2,
          maxWidth2,
          lineHeight2
        );

        // Determine the maximum Y position to avoid overlap
        startY = Math.max(startY, startY2);

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
        doc.text("Pre Statement", 7, startY + 0.5);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Invoices : ", 7, startY + 5);
        doc.text(
          formatter.format(response.data.data?.pre_statement_Invoices),
          24,
          startY + 5
        );
        doc.text("Claim : ", 58, startY + 5);
        doc.text(
          formatter.format(response.data.data?.pre_statement_claims),
          71,
          startY + 5
        );
        doc.text("Payment : ", 100, startY + 5);
        doc.text(
          formatter.format(response.data.data?.pre_statement_payments),
          119,
          startY + 5
        );
        doc.text("Total : ", 150, startY + 5);
        doc.text(
          formatter.format(response.data.data?.pre_statement_Totals),
          162,
          startY + 5
        );
        await addLogoWithDetails();
        let yTop = startY + 7.5;
        const rows = response?.data?.result.map((item, index) => ({
          index: formatDate(item.Date),
          AWB: item.AWB,
          Transaction_Ref: item.Transaction_Ref,
          Currnecy: item.Currnecy,
          Invocied_Amount: item.Invocied_Amount
            ? newFormatter.format(item.Invocied_Amount)
            : "",
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
              "Payment",
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
        await uploadPDF5(pdfBlob);
      }
      // Handle the response data as needed
      setFromDate("");
      setConsigneeIdSet("");
      setClientIdSet("");
      setToDate("");
      toast.success("Statement Added successful");
    } catch (error) {
      console.error("Error fetching statement:", error);
      toast.error("Something went Wrong ");
      // Handle the error as needed
    }
  };
  const uploadPDF5 = async (pdfBlob) => {
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;
    const formData = new FormData();
    formData.append("document", pdfBlob, `_Statement_${dateTime}.pdf`);
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(`${API_IMAGE_URL}_Statement_${dateTime}.pdf`);
      } else {
        console.log("Failed to upload PDF");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };

  const handleSubmit6 = async () => {
    const payload = {
      Vendor_ID: clientId, // Use selected client_id
      From_date: fromDate,
      To_date: toDate,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/PurchaseVendorStatement`,
        payload
      );
      console.log(response);
      getInventoryList();
      setClientId("");
      let modalElement = document.getElementById("modalVendor");
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
          doc.text("Start Date:", 252, 9);
          doc.text("End date:", 252, 13);
          doc.text("Printed On:", 252, 17);

          doc.text(`${formatDate(fromDate)}`, 272.5, 9);
          doc.text(`${formatDate(toDate)}`, 272, 13);
          doc.text(`${formatDate(new Date())}`, 272, 17);
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
          response.data.vendorData?.name ? response.data.vendorData?.name : ""
        }(${
          response.data.vendorData?.id_card
            ? response.data.vendorData?.id_card
            : ""
        })`;
        doc.setFont("helvetica", "normal");
        const longText1_2 = `${
          response.data.vendorData?.address
            ? response.data.vendorData?.address
            : ""
        }`;
        const longText1_3 = `${
          response.data.vendorData?.email ? response.data.vendorData?.email : ""
        } / ${
          response.data.vendorData?.phone ? response.data.vendorData?.phone : ""
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
        doc.text("Pre Statement", 7, startY + 0.5);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Invoices : ", 7, startY + 5);
        doc.text(
          formatter.format(response.data.data?.pre_statement_Invoices),
          24,
          startY + 5
        );
        doc.text("Claim : ", 58, startY + 5);
        doc.text(
          formatter.format(response.data.data?.pre_statement_claims),
          71,
          startY + 5
        );
        doc.text("Payment : ", 100, startY + 5);
        doc.text(
          formatter.format(response.data.data?.pre_statement_payments),
          119,
          startY + 5
        );
        doc.text("Total : ", 150, startY + 5);
        doc.text(
          formatter.format(response.data.data?.pre_statement_Totals),
          162,
          startY + 5
        );
        await addLogoWithDetails();
        let yTop = startY + 7.5;
        const rows = response?.data?.TableData?.map((item, index) => ({
          index: item.date ? formatDate(item.date) : "",
          AWB: item.PO_Number,
          Transaction_Ref: item.currency,
          Currnecy: item.Amount,
          Invocied_Amount: item.Paid_Amount
            ? newFormatter.format(item.Paid_Amount)
            : "",
          Paid_Amount: item.Vendore_Reference ? item.Vendore_Reference : "",
          Client_Reference:
            item.Invoice_Date && item.Invoice_Date !== "0000-00-00"
              ? formatDate(item.Invoice_Date)
              : "",

          TT_Reference: item.AWB,
        }));
        doc.autoTable({
          head: [
            [
              "Date",
              "PO Number",
              "Currency ",
              "Amount",
              "Paid Amount",
              "Vendor Reference",
              "Invoice Date",
              "AWB/BL",
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
        await uploadPDF6(pdfBlob);
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
  const uploadPDF6 = async (pdfBlob) => {
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;
    const formData = new FormData();
    formData.append("document", pdfBlob, `_Vender_Statement_${dateTime}.pdf`);

    setIsLoading(true);
    loadingModal.fire();
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
    } finally {
      setIsLoading(false);
      loadingModal.close();
    }
  };
  const dataClear = () => {
    setClientIdSet("");
    setClientId("");

    setFromDate("");
    setToDate("");
  };
  const handleSubmit = async () => {
    const payload = {
      Wallet_ID: clientIdSet, // Use selected client_id
      Start_Date: fromDate,
      End_Date: toDate,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/AccountWalletStatment`,
        payload
      );
      console.log(response);
      let modalElement = document.getElementById("modalState");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
        const doc = new jsPDF("landscape");
        doc.addFileToVFS("NotoSansThai-Regular.ttf", NotoSansThaiRegular);
        doc.addFont("NotoSansThai-Regular.ttf", "NotoSansThai", "normal");
        const addLogoWithDetails = async () => {
          const imgData = logo;
          doc.addImage(imgData, "JPEG", 7, 5.7, 20, 20);
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text(`${response.data.CompanyAddress?.Line_1}`, 30, 10);
          doc.text(`${response.data.CompanyAddress?.Line_2}`, 30, 14);
          const longTextOne = `${response.data.CompanyAddress?.Line_3}`;
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
          doc.text("Start Date:", 252, 9);
          doc.text("End date:", 252, 13);
          doc.text("Printed On:", 252, 17);

          doc.text(`${formatDate(fromDate)}`, 272.5, 9);
          doc.text(`${formatDate(toDate)}`, 272, 13);
          doc.text(`${formatDate(new Date())}`, 272, 17);
        };
        doc.setFillColor(32, 55, 100);
        doc.rect(7, 27, doc.internal.pageSize.width - 15, 0.5, "FD");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text("Invoice to", 7, 32);
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

        const longText1_1 = `${response.data.bankAddress?.Name_exp_2}`;

        // Render client details
        startY = renderWrappedText(
          doc,
          longText1_1,
          startX1,
          startY,
          maxWidth1,
          lineHeight1
        );
        const formatter = new Intl.NumberFormat("en-US", {
          style: "decimal",
          minimumFractionDigits: 0,
        });
        const formatterNg = new Intl.NumberFormat("en-US", {
          style: "decimal",
          minimumFractionDigits: 3,
        });
        const formatterNo = new Intl.NumberFormat("en-US", {
          style: "decimal",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        const formatterTwo = new Intl.NumberFormat("en-US", {
          style: "decimal",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        doc.setFontSize(10);
        await addLogoWithDetails();
        let yTop = startY + 1;
        const rows = response?.data?.data.map((item, index) => ({
          index: formatDate(item.Transaction_Date),
          AWB: item.Credit === "0.00" ? "" : formatterTwo.format(item.Credit),
          Transaction_Ref:
            item.Debit === "0.00" ? "" : formatterTwo.format(item.Debit),
          Currnecy: "THB",
          VendorName: item.Vendor_Client,
          Invocied_Amount: item.Reference,
        }));
        doc.autoTable({
          head: [
            ["Date", "Credit", "Debit", "Currency", "Vendor Name", "Bank Ref"],
          ],
          body: rows.map((row) => [
            row.index,
            row.AWB,
            row.Transaction_Ref,
            row.Currnecy,
            row.VendorName,
            row.Invocied_Amount,
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
          tableWidth: "auto",
          columnStyles: {
            0: { halign: "center", cellWidth: 30 },
            1: { halign: "right", overflow: "linebreak", cellWidth: 35 },
            2: { halign: "right", overflow: "linebreak", cellWidth: 35 },
            3: { halign: "center", cellWidth: 30 },
            4: { halign: "center", halign: "left", font: "NotoSansThai" },
            5: { halign: "center", cellWidth: 50 },
          },
        });

        yTop = doc.autoTable.previous.finalY + 1;
        const finalY = doc.autoTable.previous.finalY + 4;
        // middle part
        const valueWidth = 20;
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        // Invoices
        const alignmentX = 130;
        const labelX = 75;
        doc.text("Opening Balance :", labelX, finalY + 1);
        doc.text(
          formatterTwo.format(
            response.data.statement_details?.Starting_Balance
          ),
          alignmentX -
            doc.getTextWidth(
              formatterTwo.format(
                response.data.statement_details?.Starting_Balance
              )
            ),
          finalY + 1
        );
        doc.text("Credit :", labelX, finalY + 5);
        doc.text(
          formatterTwo.format(
            response.data.statement_details?.Statement_Credits
          ),
          alignmentX -
            doc.getTextWidth(
              formatterTwo.format(
                response.data.statement_details?.Statement_Credits
              )
            ),
          finalY + 5
        );

        doc.text("Debits :", labelX, finalY + 9);
        doc.text(
          formatterTwo.format(
            response.data.statement_details?.Statement_Debits
          ),
          alignmentX -
            doc.getTextWidth(
              formatterTwo.format(
                response.data.statement_details?.Statement_Debits
              )
            ),
          finalY + 9
        );

        // Draw a line under credits and debits
        doc.rect(labelX, finalY + 11, alignmentX - labelX, 0.5, "FD");

        doc.text("Statement Balance :", labelX, finalY + 16);
        doc.text(
          formatter.format(response.data.statement_details?.Statement_Balance),
          alignmentX -
            doc.getTextWidth(
              formatter.format(
                response.data.statement_details?.Statement_Balance
              )
            ),
          finalY + 16
        );

        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const addPageNumbers = (doc) => {
          const pageCount = doc.internal.getNumberOfPages();
          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text(`${i} out  of ${pageCount}`, 274, 3.1);
          }
        };
        addPageNumbers(doc);
        const pdfBlob = doc.output("blob");
        await uploadPDF(pdfBlob, clientIdSet);
      }
      setFromDate("");
      setConsigneeIdSet("");
      setClientIdSet("");
      setToDate("");
      toast.success("Statement Added successful");
    } catch (error) {
      console.error("Error fetching statement:", error);
      toast.error("Something went Wrong ");
    }
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
  const handleCheckboxChange = (invoiceNumber, isChecked) => {
    setCheckedItems((prev) => {
      const updatedCheckedItems = { ...prev, [invoiceNumber]: isChecked };
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

  const handleSubmit2 = async () => {
    if (!clientId1) {
      toast.error("Vendor  is required.");
      return;
    }
    if (!paymentDate1) {
      toast.error("Payment date is required.");
      return;
    }
    if (!paymentChannel1) {
      toast.error("Payment channel is required.");
      return;
    }

    // Calculate totalPaidAmount based on checked rows
    const totalPaidAmount = paymentTable2.reduce((total, item) => {
      if (checkedItems1[item.po_id]) {
        return total + (parseFloat(paidAmounts1[item.po_id]) || 0);
      }
      return total;
    }, 0);

    // Convert fxPayment to float for accurate comparison
    const parsedFxPayment = parseFloat(fxPayment1);

    // Prepare payment data object for the first API call
    const paymentData = {
      Vendor_ID: clientId1,
      Payment_date: moment(paymentDate1).format("YYYY-MM-DD"),
      Payment_Channel: paymentChannel1,
      FX_Payment: parsedFxPayment, // Use parsedFxPayment instead of fxPayment
      FX_ID: fxId1,
      FX_Rate: fxRate1,
      Intermittent_bank_charges: intermittentBankCharges1,
      Local_bank_Charges: localBankCharges1,
      THB_Paid: thbPaid,
      Client_payment_ref: clientPaymentRef1,
      Bank_Ref: bankRef1,
      LOSS_GAIN_THB: lossGainOnExchangeRate1,
      Notes: notes,
    };

    console.log(paymentData);

    try {
      // Send POST request to insertClientPayment endpoint (first API)
      const response = await axios.post(
        `${API_BASE_URL}/purchaseOrderPayment`,
        paymentData
      );
      console.log("Payment data submitted successfully", response);

      // Update client details and summary table with collectPaymentId from the response
      const updatedCollectPaymentId = response?.data.data;
      setCollectPaymentId(updatedCollectPaymentId);
      getInventoryList();
      // Show success toast message

      // Hide modal after successful submission
      let modalElement = document.getElementById("modalPayment1");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }

      // Now that we have the updated collectPaymentId, create selectedPaymentDetails
      const selectedPaymentDetails = paymentTable2
        .filter((item) => checkedItems1[item.po_id])
        .map((item) => ({
          PO_id: item.po_id,
          CNF_FX: paidAmounts1[item.po_id] || 0,
          V_Payment_ID: updatedCollectPaymentId, // Use updated collectPaymentId here
        }));

      // Second API call for paymentDetailsArray
      try {
        const secondApiResponse = await axios.post(
          `${API_BASE_URL}/purchaseOrderPaymentDetails`,
          { paymentDetailsArray: selectedPaymentDetails }
        );

        // Clear form fields and state after successful submission
        setClientId1("");
        setPaymentDate1("");
        setClientPaymentRef1("");
        setPaymentChannel1("");
        setBankRef1("");
        setFxPayment1("");
        setFxRate1("");
        setFxId1("");
        setIntermittentBankCharges1("");
        setLocalBankCharges1("");
        setThbReceived1("");
        setLossGainOnExchangeRate1("");
        setPaidAmounts1({});
        setCheckedItems1({});
        setPaymentTable2([]); // Clear paymentTable1
        console.log(
          "Payment details array submitted successfully",
          secondApiResponse
        );
        toast.success("Payment details submitted successfully");
      } catch (secondApiError) {
        console.error("Error submitting payment details", secondApiError);
        toast.error("Something went wrong");
      }
    } catch (error) {
      // Handle error case for first API
      console.error("Error submitting payment data", error);
      toast.error("Something went wrong");
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
      toast.success("Payment data submitted successfully");
      console.log(response);
      getInventoryList();
      // Handle successful response
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      // Handle error
    }
  };

  const handleSubmit4 = async () => {
    // Prepare payment data object
    const paymentData = {
      expense_payment_id: filterData.Expense_Payment_ID,
      invoice_payment_id: filterData.Invoice_payment_Id,
      payment_channel: text,
      payment_date: datePay,
      Bank_Ref: bankText,
    };

    try {
      // Send POST request to insertClientPayment endpoint
      const response = await axios.post(
        `${API_BASE_URL}/AccountEditViewDetails`,
        paymentData
      );
      getInventoryList();
      console.log("Payment data submitted successfully", response);

      // Update client details and summary table

      // Show success toast message
      toast.success("Account Updated successfully");
      setText("");
      setPayDate("");
      setFilterData("");
      setBankText("");
      // Hide modal after successful submission
      let modalElement = document.getElementById("accountEdit");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        clearAllFields();
        modalInstance.hide();
      }
    } catch (error) {
      // Handle error case
      console.error("Error submitting payment data", error);
      toast.error("Something went wrong");
    }
  };

  const handleSubmit1 = async () => {
    // Validate required fields
    if (!clientId) {
      toast.error("Client  is required.");
      return;
    }
    if (!consigneeId) {
      toast.error("Consignee  is required.");
      return;
    }
    if (!paymentDate) {
      toast.error("Payment Date is required.");
      return;
    }
    if (!paymentChannel) {
      toast.error("Payment Channel is required.");
      return;
    }
    if (!fxId) {
      toast.error("FX  is required.");
      return;
    }
    if (!fxRate || isNaN(parseFloat(fxRate))) {
      toast.error("Valid FX Rate is required.");
      return;
    }
    if (
      !intermittentBankCharges ||
      isNaN(parseFloat(intermittentBankCharges))
    ) {
      toast.error("Valid Intermittent Bank Charges are required.");
      return;
    }
    if (!localBankCharges || isNaN(parseFloat(localBankCharges))) {
      toast.error("Valid Local Bank Charges are required.");
      return;
    }
    if (!thbReceived || isNaN(parseFloat(thbReceived))) {
      toast.error("Valid THB Received value is required.");
      return;
    }
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

  const closeData = () => {
    setIsEditing(false);
    setBankText("");
    // navigate("/");
    setClientId((prevClientId) => "");
    setConsigneeId((prevConsigneeId) => "");
    console.log(clientId);
    console.log(consigneeId);
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
  // commission pdf
  const handleDownloadCommission = async (Expense_Payment_ID, a) => {
    console.log(Expense_Payment_ID);
    console.log(a);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/CommissionPaymentSlip`,
        {
          Expense_Payment_ID: Expense_Payment_ID,
        }
      );
      console.log(response.data.table_data);
      const doc = new jsPDF();
      doc.addFileToVFS("NotoSansThai-Regular.ttf", NotoSansThaiRegular);
      doc.addFont("NotoSansThai-Regular.ttf", "NotoSansThai", "normal");
      const imgData = logo;
      doc.addImage(imgData, "JPEG", 6, 2, 20, 20);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`${response?.data?.companyAddress?.Line_1}`, 30, 8);
      doc.setTextColor(0, 0, 0);
      doc.text(`${response?.data?.companyAddress?.Line_2}`, 30, 12);
      const longTextOne = `${response?.data?.companyAddress?.Line_3}`;
      const maxWidthOne = 90;
      const linesOne = doc.splitTextToSize(longTextOne, maxWidthOne);
      let startXOne = 30;
      let startYOne = 16;
      linesOne.forEach((lineOne, index) => {
        doc.text(lineOne, startXOne, startYOne + index * 4.2);
      });
      doc.setFillColor(33, 56, 99);
      doc.rect(7, 23, doc.internal.pageSize.width - 15, 0.5, "FD");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      const newFormatter1 = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      });
      const newFormatterZero = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      const newFormatter5 = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      const text = " Commission Payment Slip";
      const pageWidth = doc.internal.pageSize.width;
      const textWidth = doc.getTextWidth(text);
      const xPosition = (pageWidth - textWidth) / 2;
      doc.text(text, xPosition, 28);
      doc.setFillColor(33, 56, 99);
      doc.rect(7, 30, doc.internal.pageSize.width - 15, 0.5, "FD");
      doc.setFontSize(12);
      const maxWidth1 = 70;
      const startX1 = 7;
      let startY1 = 35;
      const lineHeight1 = 4.2;
      const longText1_4 = `${response?.data?.headerData.Name_exp_2}`;
      // Function to render wrapped text
      doc.setFont("NotoSansThai"); // Set the font to use
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
      doc.setFontSize(11); // Adjust font size for the next text block
      doc.setFontSize(10);
      const lineHeight = 5;
      const maxWidthValue = 70;

      function renderLabelAndValue(
        doc,
        label,
        value,
        labelX,
        valueX,
        yPosition,
        maxWidth,
        lineHeight,
        alignRight = false
      ) {
        // Render the label on the left
        doc.text(label, labelX, yPosition);

        // Split the value text if it's too long
        const valueLines = doc.splitTextToSize(value, maxWidth);

        valueLines.forEach((line, index) => {
          const yOffset = index * lineHeight;
          // Calculate the X position if aligning to the right
          let finalValueX = valueX;
          if (alignRight) {
            // Measure the width of the current line and calculate the right-aligned X position
            const textWidth = doc.getTextWidth(line);
            finalValueX = valueX - textWidth; // Shift value to the left for right alignment
          }

          // Render the value at the calculated X position
          doc.text(line, finalValueX, yPosition + yOffset);
        });

        return yPosition + (valueLines.length - 1) * lineHeight;
      }
      let tableEndY = 30;
      let currentY = tableEndY + 4;
      // Right side
      let currentYRight = tableEndY + 4;
      currentYRight = renderLabelAndValue(
        doc,
        "Bank Name:",
        `${
          response?.data?.vendorBankDetails?.bank_name
            ? response?.data?.vendorBankDetails?.bank_name
            : ""
        }`,
        130,
        200,
        currentYRight,
        maxWidthValue,
        lineHeight,
        true
      );
      doc.setFont("NotoSansThai"); // Set the font to use

      currentYRight = renderLabelAndValue(
        doc,
        "Account Name:",
        `${response?.data?.vendorBankDetails?.bank_account}`,
        130,
        200,
        currentYRight + lineHeight,
        maxWidthValue,
        lineHeight,
        true
      );
      currentYRight = renderLabelAndValue(
        doc,
        "Account Number:",
        `${response?.data?.vendorBankDetails?.bank_number}`,
        130,
        200,
        currentYRight + lineHeight,
        maxWidthValue,
        lineHeight,
        true
      );
      currentYRight = renderLabelAndValue(
        doc,
        "Paid On:",
        new Date(
          `${response?.data?.vendorBankDetails?.Payment_date}`
        ).toLocaleDateString(),
        130,
        200,
        currentYRight + lineHeight,
        maxWidthValue,
        lineHeight,
        true
      );
      currentYRight = renderLabelAndValue(
        doc,
        "Paid With:",
        `${response?.data?.vendorBankDetails?.Bank_nick_name}`,
        130,
        200,
        currentYRight + lineHeight,
        maxWidthValue,
        lineHeight,
        true
      );
      // currentYRight = renderLabelAndValue(doc, "Loss/Gain on Exchange Rate:", "2123.12312", 100, 149, currentYRight + lineHeight, maxWidthValue, lineHeight);
      const maxY = Math.max(startY1, currentYRight);
      const helloYPosition = maxY + 2;
      const rows = response?.data?.table_data.map((item, index) => ({
        index: index + 1,
        paidAmount: item.Payment_date
          ? new Date(item.Payment_date).toLocaleDateString("en-GB") // Format as DD/MM/YYYY
          : "",
        docAcc: item.Invoice_number,
        invNum: newFormatter5.format(item.Commision_THB),
        unit: "THB",
        invAmount: newFormatter5.format(item.WHT_15),

        net: item.Commision_THB_Paid
          ? newFormatter5.format(item.Commision_THB_Paid)
          : "",
      }));

      doc.autoTable({
        head: [
          [
            "#",
            "Date",
            "Invoice # ",
            "Commission Value",
            "FX",
            "Witholding Tax",
            "Net Amount",
          ],
        ],
        body: rows.map((row) => [
          row.index,
          row.paidAmount,
          row.docAcc,
          row.invNum,
          row.unit,
          row.invAmount,

          // row.net,
          row.net,
        ]),
        columnStyles: {
          3: { halign: "right" },
          4: { halign: "center" },
          5: { halign: "right" },
          6: { halign: "right" },
          7: { halign: "right" },
        },
        startX: 0,
        startY: helloYPosition,
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

      const tableEndYSlip = doc.lastAutoTable.finalY;
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
      let currentYSlip = tableEndYSlip + 5;
      const totalPayAmount = parseFloat(
        response?.data?.Toataldata?.AllTotal
          ? String(response.data.Toataldata.AllTotal).replace(/,/g, "")
          : 0 // Default value if undefined or null
      );

      const totalAmount = parseFloat(
        response?.data?.Toataldata?.total_commision_THB
          ? String(response.data.Toataldata.total_commision_THB).replace(
              /,/g,
              ""
            )
          : 0
      );

      // Render "Total"
      const textTotal = newFormatter5.format(totalAmount);

      renderRightAlignedText(
        doc,
        "TOTAL",
        textTotal,
        labelX,
        rightBoundary,
        fixedWidth,
        currentYSlip
      );
      currentYSlip += 5;
      const textTotalVat = newFormatter5.format(
        parseFloat(response?.data?.total_all?.VAT?.replace(/,/g, "")) || 0
      );

      renderRightAlignedText(
        doc,
        "VAT",
        textTotalVat,
        labelX,
        rightBoundary,
        fixedWidth,
        currentYSlip
      );
      currentYSlip += 5;
      const textTotalWht = newFormatter5.format(
        parseFloat(
          response?.data?.Toataldata?.total_WHT
            ? String(response.data.Toataldata.total_WHT).replace(/,/g, "")
            : 0
        )
      );

      renderRightAlignedText(
        doc,
        "WHT",
        textTotalWht,
        labelX,
        rightBoundary,
        fixedWidth,
        currentYSlip
      );
      doc.rect(145, tableEndYSlip + 16.5, 58, 0.5, "FD");
      currentYSlip += 5.5;
      const textTotalPay = newFormatter5.format(totalPayAmount);

      renderRightAlignedText(
        doc,
        "Payment Amount   ",
        textTotalPay,
        labelX,
        rightBoundary,
        fixedWidth,
        currentYSlip
      );
      doc.rect(145, tableEndYSlip + 22, 58, 0.5, "FD");
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
      // Upload the PDF to the server
      await uploadPDF2(pdfBlob, Expense_Payment_ID);
    } catch (error) {
      console.error("Error fetching statement:", error);
      toast.error("Something went Wrong ");
      // Handle the error as needed
    }
  };
  // commission pdf
  const { data: paymentChannle } = useQuery("PaymentChannela");
  const { data: currency } = useQuery("getCurrency");
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
  useEffect(() => {
    if (clientId && consigneeId) {
      paymentTable();
    }
  }, [clientId, consigneeId]);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const getInventoryList = () => {
    axios.get(`${API_BASE_URL}/LedgerList`).then((res) => {
      console.log(res);
      setData(res.data.details || []);
    });
  };
  useEffect(() => {
    getInventoryList();
  }, []);

  // const handleChange = (e) => {
  //   setQuantity(e.target.value);
  // };

  const inventoryBoxes = (unit_type, pod_item) => {
    setSelectedUnitType(unit_type);
    setSelectedPodItem(pod_item);
    setIsModalVisible(true);
    console.log(pod_item);
  };
  const editAccountdata = async (expense_payment_id, invoice_payment_id, a) => {
    console.log(a);
    setFilterData(a);
    console.log(expense_payment_id);
    console.log(invoice_payment_id);

    try {
      const response = await axios.post(`${API_BASE_URL}/AccountViewDetails`, {
        expense_payment_id: expense_payment_id,
        invoice_payment_id: invoice_payment_id,
      });
      console.log(response);
      setAccountDataShow(response.data.data);
      setPaymentChannel1(response.data.Payment_Channel);
      setPayDate(
        response.data.data.Payment_date
          ? new Date(response.data.data.Payment_date).toISOString().slice(0, 10)
          : ""
      );
      setText(response.data.data.Payment_Channel);
      setPaymentChanelShowData(response.data.data.payment_channel);
      setBankText(response.data.data.Bank_Ref);
    } catch (error) {
      console.error("Error fetching consignees:", error);
    }
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
            `${API_BASE_URL}/DeleteInvoicePayment`,
            {
              Invoice_payment_Id: id,
            }
          );
          console.log(response);
          getInventoryList();
          toast.success(" Credit Account delete successfully");
        } catch (e) {
          // toast.error("Something went wrong");
          console.log(e);
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
            `${API_BASE_URL}/DeleteExpensePayment`,
            {
              Expense_Payment_ID: id,
            }
          );
          console.log(response);
          getInventoryList();
          toast.success(" Debit Account delete successfully");
        } catch (e) {
          // toast.error("Something went wrong");
          console.log(e);
        }
      }
    });
  };
  const updateBoxes = () => {
    axios
      .post(`${API_BASE_URL}/StockAdjustmentPB`, {
        user_id: localStorage.getItem("id"),
        type: selectedUnitType,
        item: selectedPodItem,
        qty_on_hand: quantity,
      })
      .then((response) => {
        setIsModalVisible(false);
        console.log(response);
        toast.success("Stock Adjustment Added Successfully", {
          autoClose: 1000,
          theme: "colored",
        });
        getInventoryList();
        setQuantity("");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Network Error", {
          autoClose: 1000,
          theme: "colored",
        });
      });
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "ID",
      },
      {
        Header: "Bank Nick Name",
        accessor: "Bank_nick_name",
      },
      {
        Header: "Transaction",
        accessor: (a) => {
          if (a.Credit !== "0.00") {
            return "Credit";
          } else if (a.Debit !== "0.00") {
            return "Debit";
          }
          return ""; // return an empty string if neither condition is met
        },
        // Add this to center align the header and the data
        headerStyle: {
          halign: "center",
        },
        cellStyle: {
          halign: "center",
        },
      },
      {
        Header: "Date",
        accessor: (a) => {
          return a.Transaction_Date
            ? new Date(a.Transaction_Date).toLocaleDateString()
            : "NA";
        },
        headerStyle: {
          halign: "center",
          textAlign: "center",
        },
        cellStyle: {
          halign: "center",
        },
      },

      {
        Header: "Bank Ref",
        accessor: "Reference",
      },
      {
        Header: "Amount",
        accessor: (a) => {
          if (a.Credit !== "0.00") {
            return newFormatterTwo.format(a.Credit);
          } else if (a.Debit !== "0.00") {
            return newFormatterTwo.format(a.Debit);
          }
          return "";
        },
      },
      {
        Header: "Client / Vendor",
        accessor: "Vendor_Client",
      },
      {
        Header: "Account",
        accessor: "Account",
      },

      {
        Header: "Action",
        accessor: (a) => (
          <div className="editIcon">
            {a.Reconcile_Status === 1 && (
              <butto
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#accountEdit"
                onClick={() =>
                  editAccountdata(a.Expense_Payment_ID, a.Invoice_payment_Id, a)
                }
              >
                <i className="mdi mdi-pencil pl-2" />
              </butto>
            )}
            {a.Credit !== "0.00" ? (
              <button
                type="button"
                onClick={() => deleteOrder(a.Invoice_payment_Id)}
              >
                <i className="mdi mdi-delete " />
              </button>
            ) : a.Debit !== "0.00" ? (
              <button
                type="button"
                onClick={() => deleteOrder1(a.Expense_Payment_ID)}
              >
                <i className="mdi mdi-delete " />
              </button>
            ) : null}
            {/* Conditionally render the PDF button based on Credit or Debit */}
            {a.Credit !== "0.00" ? (
              <button
                type="button"
                className="accountSvg"
                data-bs-toggle="modal"
                data-bs-target="#exampleModalCustomization"
                onClick={() => handleDownloadPDF(a.Invoice_payment_Id, a)}
              >
                <div className="d-flex">
                  <svg
                    className="me-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#000000"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M3.5 10H20.5"
                        stroke="#203764"
                        stroke-width="2"
                        stroke-linecap="round"
                      ></path>
                      <path
                        d="M6 14H8"
                        stroke="#203764"
                        stroke-width="2"
                        stroke-linecap="round"
                      ></path>
                      <path
                        d="M11 14H13"
                        stroke="#203764"
                        stroke-width="2"
                        stroke-linecap="round"
                      ></path>{" "}
                      <path
                        d="M3 9C3 7.11438 3 6.17157 3.58579 5.58579C4.17157 5 5.11438 5 7 5H12H17C18.8856 5 19.8284 5 20.4142 5.58579C21 6.17157 21 7.11438 21 9V12V15C21 16.8856 21 17.8284 20.4142 18.4142C19.8284 19 18.8856 19 17 19H12H7C5.11438 19 4.17157 19 3.58579 18.4142C3 17.8284 3 16.8856 3 15V12V9Z"
                        stroke="#203764"
                        stroke-width="2"
                        stroke-linejoin="round"
                      ></path>{" "}
                    </g>
                  </svg>
                </div>
              </button>
            ) : a.Debit !== "0.00" ? (
              <button
                type="button"
                className="svgIconPurchase"
                onClick={() => handleDownloadPDFSlip(a.Expense_Payment_ID, a)}
              >
                <div>
                  <svg
                    fill="#203764"
                    height="200px"
                    width="200px"
                    viewBox="0 0 512 512"
                    stroke="#203764"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <g>
                        <g>
                          <g>
                            <path d="M502.747,160.381c-0.032,0-0.063,0.005-0.095,0.005H120.289c-5.11,0-9.253,4.142-9.253,9.253s4.143,9.253,9.253,9.253h373.205v55.518H18.506v-55.518h64.771c5.11,0,9.253-4.142,9.253-9.253s-4.143-9.253-9.253-9.253H18.506v-27.759c0-15.306,12.452-27.759,27.759-27.759h419.47c15.306,0,27.759,12.453,27.759,27.759c0,5.111,4.142,9.253,9.253,9.253s9.253-4.142,9.253-9.253c0-25.511-20.754-46.265-46.265-46.265H46.265C20.754,86.361,0,108.115,0,132.627v246.747c0,25.511,20.754,46.265,46.265,46.265h419.47c25.511,0,46.265-20.754,46.265-46.265V169.639v-0.005C512,164.523,507.858,160.381,502.747,160.381z M493.494,379.373c0,15.306-12.453,27.759-27.759,27.759H46.265c-15.307,0-27.759-12.453-27.759-27.759V252.916h474.988V379.373z"></path>
                            <path d="M95.614,376.289c8.799,0,17.334-2.495,24.675-7.13c7.342,4.635,15.876,7.13,24.675,7.13c25.511,0,46.265-20.754,46.265-46.265s-20.754-46.265-46.265-46.265c-8.799,0-17.333,2.495-24.675,7.13c-7.341-4.635-15.876-7.13-24.675-7.13c-25.511,0-46.265,20.754-46.265,46.265S70.103,376.289,95.614,376.289z M95.614,302.265c6.837,0,13.409,2.512,18.502,7.072c3.514,3.144,8.83,3.144,12.344,0c5.094-4.56,11.666-7.072,18.504-7.072c15.307,0,27.759,12.453,27.759,27.759s-12.452,27.759-27.759,27.759c-6.837,0-13.408-2.512-18.504-7.072c-1.757-1.572-3.964-2.359-6.171-2.359s-4.416,0.787-6.172,2.359c-5.093,4.56-11.665,7.072-18.502,7.072c-15.307,0-27.759-12.453-27.759-27.759S80.307,302.265,95.614,302.265z"></path>
                            <path d="M243.663,314.602H441.06c5.111,0,9.253-4.142,9.253-9.253c0-5.111-4.142-9.253-9.253-9.253H243.663c-5.11,0-9.253,4.142-9.253,9.253C234.41,310.461,238.553,314.602,243.663,314.602z"></path>
                            <path d="M416.386,333.108h-74.024c-5.111,0-9.253,4.142-9.253,9.253s4.142,9.253,9.253,9.253h74.024c5.111,0,9.253-4.142,9.253-9.253S421.497,333.108,416.386,333.108z"></path>
                            <path d="M243.663,351.614h61.687c5.111,0,9.253-4.142,9.253-9.253s-4.142-9.253-9.253-9.253h-61.687c-5.11,0-9.253,4.142-9.253,9.253S238.553,351.614,243.663,351.614z"></path>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </button>
            ) : null}

            {+a.Commission == 1 && (
              <button
                className="svgIconPurchase"
                onClick={() =>
                  handleDownloadCommission(a.Expense_Payment_ID, a)
                }
              >
                {" "}
                <svg
                  fill="#203764"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 64 64"
                  width="64px"
                  height="64px"
                  stroke="#203764"
                >
                  <g id="SVGRepo_iconCarrier">
                    <path d="M54.836,41.196c-0.741-0.624-1.72-0.883-2.664-0.719L32.34,43.926l-5.633-5.633C26.52,38.105,26.266,38,26,38H16 c0-0.552-0.447-1-1-1h-4H4v2h6v14H4v2h7h4c0.553,0,1-0.448,1-1h2.764l10.691,5.346c0.463,0.231,0.963,0.347,1.463,0.346 c0.568,0,1.137-0.149,1.646-0.446L54.38,46.52c0.999-0.584,1.62-1.666,1.62-2.823C56,42.73,55.575,41.818,54.836,41.196z M14,53h-2 V39h2V53z M53.371,44.793L31.556,57.518c-0.37,0.216-0.821,0.231-1.206,0.039l-10.902-5.451C19.309,52.036,19.155,52,19,52h-3V40 h9.586l7.879,7.878C33.81,48.224,34,48.683,34,49.171C34,50.18,33.18,51,32.172,51c-0.481,0-0.952-0.195-1.293-0.536l-5.172-5.171 l-1.414,1.414l5.172,5.171C30.188,52.602,31.148,53,32.172,53C34.282,53,36,51.283,36,49.171c0-1.022-0.398-1.983-1.121-2.707 l-0.809-0.809l18.444-3.208c0.372-0.065,0.747,0.038,1.034,0.279C53.835,42.968,54,43.322,54,43.697 C54,44.146,53.759,44.566,53.371,44.793z"></path>
                    <rect
                      x="26.567"
                      y="19.5"
                      transform="matrix(0.6727 -0.7399 0.7399 0.6727 -4.0396 31.8682)"
                      width="10"
                      height="10"
                    ></rect>
                    <path d="M30,20.5c1.654,0,3-1.346,3-3s-1.346-3-3-3s-3,1.346-3,3S28.346,20.5,30,20.5z M30,16.5c0.552,0,1,0.449,1,1s-0.448,1-1,1 s-1-0.449-1-1S29.448,16.5,30,16.5z"></path>
                    <path d="M35,23.5c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S35,21.846,35,23.5z M39,23.5c0,0.551-0.448,1-1,1s-1-0.449-1-1 s0.448-1,1-1S39,22.949,39,23.5z"></path>
                    <path d="M33.274,41.688C33.464,41.887,33.726,42,34,42s0.536-0.113,0.726-0.312L50.584,24.98c4.542-4.786,4.542-12.573,0-17.358 C48.367,5.286,45.416,4,42.274,4C39.148,4,36.212,5.272,34,7.584C31.788,5.272,28.852,4,25.726,4c-3.142,0-6.093,1.286-8.31,3.622 c-4.542,4.786-4.542,12.573,0,17.358L33.274,41.688z"></path>
                    <rect x="29" y="28" width="2" height="2"></rect>
                    <rect x="33" y="28" width="2" height="2"></rect>
                    <rect x="37" y="28" width="2" height="2"></rect>
                  </g>
                </svg>
              </button>
            )}
          </div>
        ),
      },
    ],
    []
  );
  // js part start for editing end
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("");
  const [datePay, setPayDate] = useState();
  const [editDate, setEditDate] = useState(false);
  const [selectedValue, setSelectedValue] = useState(paymentChannel1);
  const [editBank, setEditBank] = useState(false);
  const [bankText, setBankText] = useState("");

  const handleEditBankRef = () => {
    setEditBank(true);
  };

  const handleBankChange = (e) => {
    setBankText(e.target.value);
  };
  const handleChange = (e, newValue) => {
    setQuantity(e.target.value);
    if (newValue) {
      setSelectedValue(newValue.bank_id || ""); // Update the selected value
      setText(newValue.Bank_nick_name || ""); // Update the displayed text
    } else {
      setSelectedValue(""); // Reset the value if cleared
      setText(""); // Optionally reset the text as well
    }
  };
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };
  //  date format edit
  const handleEditDate = () => {
    setEditDate(true);
  };

  const handleDateChange = (e) => {
    setPayDate(e.target.value);
  };

  const handleBlurDate = () => {
    setEditDate(false);
  };

  // Function to safely convert datePay to a format that the date input understands (YYYY-MM-DD)
  const formatDateForInput = () => {
    if (!datePay) return "";
    const [day, month, year] = datePay.split("-");
    const formattedDate = new Date(`20${year}-${month}-${day}`);
    if (formattedDate.toString() === "Invalid Date") return "";
    return formattedDate.toISOString().split("T")[0]; // Return in 'YYYY-MM-DD' format for input field
  };
  // js part end for editing
  console.log(filterData);
  return (
    <>
      {/* {/ edit modal /} */}
      <div
        className="modal fade "
        id="accountEdit"
        tabIndex={-1}
        aria-labelledby="5"
        aria-hidden="true"
      >
        <div className="modal-dialog modalShipTo  modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="5">
                Edit
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeData}
              >
                <i class="mdi mdi-close"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-lg-3 mb-4">
                  <div className="parantEmpView">
                    {filterData.Expense_Payment_ID ? (
                      <div>
                        <h6>
                          <strong>Vender </strong>
                        </h6>
                        <p>{accountDataShow.vendor_name}</p>
                      </div>
                    ) : (
                      ""
                    )}
                    {filterData.Invoice_payment_Id ? (
                      <>
                        <div>
                          <h6>
                            <strong>Client</strong>
                          </h6>
                          <p>{accountDataShow.Client}</p>
                        </div>
                        <div>
                          <h6>
                            <strong>Consignee</strong>
                          </h6>
                          <p>{accountDataShow.Consignee}</p>
                        </div>
                      </>
                    ) : null}

                    {/*  */}
                    <div className="parantEmpView">
                      <h6>
                        <strong>Bank Name</strong>
                      </h6>
                      <p>SCB</p>
                    </div>
                    <div className="parantEmpView">
                      <h6>
                        <strong>Account Name</strong>
                      </h6>
                      <p>Mr. Zeid</p>
                    </div>
                    <div className="parantEmpView">
                      <h6>
                        <strong>Account Number</strong>
                      </h6>
                      <p>564005443344</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 mb-4">
                  <div className="parantEmpView">
                    <div>
                      <h6>
                        <strong>Client Payment Ref</strong>
                      </h6>
                      <p>{accountDataShow.Client_payment_ref}</p>
                    </div>

                    <div className="parantEmpView">
                      <h6>
                        <strong>Total Before Tax</strong>
                      </h6>
                      <p>{newFormatterTwo.format(45000)}</p>
                    </div>
                    <div className="parantEmpView">
                      <h6>
                        <strong>VAT</strong>
                      </h6>
                      <p>{newFormatterTwo.format(40)}</p>
                    </div>
                    <div className="parantEmpView">
                      <h6>
                        <strong>WHT</strong>
                      </h6>
                      <p>{newFormatterTwo.format(545)}</p>
                    </div>
                    <div className="parantEmpView">
                      <h6>
                        <strong>Rounding</strong>
                      </h6>
                      <p>{newFormatterTwo.format(40)}</p>
                    </div>
                    <div className="parantEmpView">
                      <h6>
                        <strong>Amount to Pay</strong>
                      </h6>
                      <p>{newFormatterTwo.format(2224)}</p>
                    </div>
                   
                    
                  </div>
                </div>
                <div className="col-lg-3 mb-4">
                <div className="parantEmpView d-flex"> 
                      <h6>
                        <strong>Payment Date </strong>
                      </h6>
                      <div className="editPayment">
                        {editDate ? (
                          <input
                            type="date"
                            value={datePay} // Use the function to format date for input field
                            onChange={handleDateChange}
                            onBlur={handleBlurDate}
                            autoFocus
                          />
                        ) : (
                          <p onClick={handleEditDate}>
                            {datePay || "Select Date"}
                          </p>
                        )}
                        <i
                          className="mdi mdi-pencil"
                          style={{ cursor: "pointer", marginLeft: "10px" }}
                          onClick={handleEditDate}
                        ></i>
                      </div>
                    </div>
                    <div className="parantEmpView d-flex">
                      <h6>
                        <strong>Payment Channel</strong>
                      </h6>
                      <div className="editPayment autoComplete">
                        <div style={{ width: "200px" }}>
                          {isEditing ? (
                            <Autocomplete
                              options={
                                paymentChannle?.map((vendor) => ({
                                  id: vendor.bank_id,
                                  name: vendor.Bank_nick_name,
                                })) || []
                              }
                              getOptionLabel={(option) => option.name || ""}
                              value={
                                paymentChannle
                                  ?.map((vendor) => ({
                                    id: vendor.bank_id,
                                    name: vendor.Bank_nick_name,
                                  }))
                                  .find((option) => option.id === text) || null
                              }
                              onChange={(e, newValue) => {
                                setText(newValue?.id || null); // Update `text` with the selected option's `id`
                              }}
                              sx={{ width: 300 }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Select Vendor"
                                  InputLabelProps={{ shrink: false }}
                                />
                              )}
                            />
                          ) : (
                            <p
                              onClick={handleEditClick}
                              style={{ display: "inline", cursor: "pointer" }}
                            >
                              {paymentChanelShowData}
                            </p>
                          )}
                          <i
                            className="mdi mdi-pencil"
                            style={{ cursor: "pointer", marginLeft: "10px" }}
                            onClick={handleEditClick}
                          ></i>
                        </div>
                      </div>
                    </div>
               
                    <div className=" d-flex parantEmpView editPayment">
                      <h6>
                        <strong>Bank Ref</strong>
                      </h6>

                      {editBank ? (
                        <input
                          value={bankText}
                          onChange={handleBankChange}
                          onBlur={() => setEditBank(false)}
                          autoFocus
                        />
                      ) : (
                        <div>
                          <p
                            onClick={handleEditBankRef}
                            style={{ display: "inline", marginRight: "10px" }}
                          >
                            {bankText}
                          </p>
                          <i
                            className="mdi mdi-pencil"
                            style={{ cursor: "pointer" }}
                            onClick={handleEditBankRef}
                          ></i>
                        </div>
                      )}
                    </div>

                 
                </div>
                <div className="col-lg-3">
                      
                <div className="parantEmpView">
                    <div>
                      <h6>
                        <strong>FX Payment </strong>
                      </h6>
                      <p>{accountDataShow.FX_Payment}</p>
                    </div>
                    <div>
                      <h6>
                        <strong>FX</strong>
                      </h6>
                      <p>{accountDataShow.FX_name}</p>
                    </div>
                    <div>
                      <h6>
                        <strong>FX Rate</strong>
                      </h6>
                      <p>{accountDataShow.FX_Rate}</p>
                    </div>
                  </div>
                  <div className="parantEmpView">
                    <div>
                      <h6>
                        <strong>Loss/Gain on Exchange Rate </strong>
                      </h6>
                      <p>{accountDataShow.LOSS_GAIN_THB}</p>
                    </div>
                  </div>  
                  <div className="parantEmpView">
                    <div>
                      <h6>
                        <strong> Intermittent Bank Charges</strong>
                      </h6>
                      <p>{accountDataShow.Intermittent_bank_charges}</p>
                    </div>
                    <div>
                      <h6>
                        <strong>Local Bank Charges</strong>
                      </h6>
                      <p>{accountDataShow.Local_bank_Charges}</p>
                    </div>
                    <div>
                      <h6>
                        <strong>THB Received </strong>
                      </h6>
                      <p>{accountDataShow.THB_Paid}</p>
                    </div>
                  </div>
                </div>
                 
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={handleSubmit4}
                className="btn btn-primary"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* {/ edit modal end /} */}
      <Card
        title="Account Management"
        endElement={
          <button
            type="button"
            onClick={() => navigate("/createaccounts")}
            className="btn button btn-info"
          >
            Create
          </button>
        }
      >
        <div className="mainAccFlex justify-content-center mt-5">
          <div>
            <button
              type="button"
              className="btn btn-danger"
              data-bs-toggle="modal"
              data-bs-target="#modalState"
            >
              Bank Statement
            </button>
            <button
              type="button"
              className="btn btn-danger"
              data-bs-toggle="modal"
              data-bs-target="#modalVendor"
            >
              Vendor Statement
            </button>
            <button
              type="button"
              className="btn btn-danger"
              data-bs-toggle="modal"
              data-bs-target="#modalPayment1"
            >
              Expense Payment
            </button>
            <button
              type="button"
              className="btn btn-danger"
              data-bs-toggle="modal"
              data-bs-target="#modalConsignee"
            >
              Consignee Statement
            </button>
            {/* consignee modal */}
            <div
              className="modal fade "
              id="modalConsignee"
              tabIndex={-1}
              aria-labelledby="5"
              aria-hidden="true"
            >
              <div className="modal-dialog modalShipTo">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="yt56555">
                      Consignee Statement
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={dataClear7}
                    >
                      <i className="mdi mdi-close"></i>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="client_filter mb-2 autoComplete">
                      <h6>Client</h6>
                      <Autocomplete
                        options={
                          clients?.map((v) => ({
                            client_id: v.client_id, // Ensure the property names match
                            client_name: v.client_name,
                          })) || []
                        } // Provide options for autocomplete
                        getOptionLabel={(option) => option.client_name || ""} // The text to display for each option
                        onChange={(event, newValue) => {
                          // Handle client change
                          setClientIdSet(newValue ? newValue.client_id : ""); // Update the state with the selected client_id
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select Client" // Set placeholder text
                            variant="outlined"
                          />
                        )}
                        value={
                          Array.isArray(clients)
                            ? clients.find(
                                (client) => client.client_id === clientIdSet
                              ) || null
                            : null
                        }
                        isOptionEqualToValue={(option, value) =>
                          option.client_id === value.client_id
                        } // Ensure the option matches the selected value
                      />
                      {/* <ComboBox
                        options={clients?.map((v) => ({
                          id: v.client_id,
                          name: v.client_name,
                        }))}
                        value={clientIdSet}
                        onChange={(e) => setClientIdSet(e)} // No need for { clientIdSet: e }
                      /> */}
                    </div>
                    <div className="mb-2 autoComplete">
                      <h6>Consignee</h6>
                      <Autocomplete
                        options={
                          consignees?.map((v) => ({
                            consignee_id: v.consignee_id, // Ensure the property names match
                            consignee_name: v.consignee_name,
                          })) || []
                        } // Provide options for autocomplete
                        getOptionLabel={(option) => option.consignee_name || ""} // The text to display for each option
                        onChange={(event, newValue) => {
                          // Handle consignee change
                          setConsigneeIdSet(
                            newValue ? newValue.consignee_id : ""
                          ); // Update the state with the selected consignee_id
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select Consignee" // Set placeholder text
                            variant="outlined"
                          />
                        )}
                        value={
                          // Find the consignee object corresponding to the selected ID
                          Array.isArray(consignees)
                            ? consignees.find(
                                (consignee) =>
                                  consignee.consignee_id === consigneeIdSet
                              ) || null
                            : null
                        }
                        isOptionEqualToValue={(option, value) =>
                          option.consignee_id === value.consignee_id
                        } // Ensure the option matches the selected value
                      />
                    </div>
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
                      onClick={handleSubmit7}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* consignee modal end */}
            <div
              className="modal fade "
              id="modalPayment1"
              tabIndex={-1}
              aria-labelledby="5"
              aria-hidden="true"
            >
              <div className="modal-dialog modalShipTo  modal-xl">
                <div className="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="5">
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
                            options={clients1 || []} // Ensure options is always an array
                            value={
                              (clients1 || []).find(
                                (client) => client.vendor_id === clientId1
                              ) || null
                            } // Safeguard against undefined
                            getOptionLabel={(option) => option.name || ""} // Handle cases where option.name might be undefined
                            onChange={(e, newValue) =>
                              setClientId1(newValue?.vendor_id || "")
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
                              selected={paymentDate1}
                              onChange={
                                (date) => setPaymentDate1(date) // Replace with your specific handling logic
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
                              value={clientPaymentRef1}
                              onChange={(e) =>
                                setClientPaymentRef1(e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 mt-3">
                        <div className="parentFormPayment autoComplete">
                          <p>Payment Channel </p>
                          {/* <Autocomplete
                            disablePortal
                            options={paymentChannle} // Use your payment channel array as options
                            getOptionLabel={(option) => option.Bank_nick_name} // Display the bank name
                            onChange={(e, newValue) =>
                              setPaymentChannel1(newValue?.bank_id || "")
                            } // Set the selected bank id
                            sx={{ width: 300 }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Search Payment Channel" // Adds a placeholder
                                InputLabelProps={{ shrink: false }} // Prevents floating label
                              />
                            )}
                          /> */}
                          <Autocomplete
                            disablePortal
                            options={paymentChannle || []} // Ensure options is always an array
                            value={
                              (paymentChannle || []).find(
                                (channel) => channel.bank_id === paymentChannel1
                              ) || null
                            } // Safeguard against undefined
                            getOptionLabel={(option) =>
                              option.Bank_nick_name || ""
                            } // Handle cases where Bank_nick_name might be undefined
                            onChange={(e, newValue) =>
                              setPaymentChannel1(newValue?.bank_id || "")
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
                              value={bankRef1}
                              onChange={(e) => setBankRef1(e.target.value)}
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
                              value={localBankCharges1}
                              onChange={(e) =>
                                setLocalBankCharges1(e.target.value)
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
                              // value={fxPayment1}
                              // onChange={(e) => setFxPayment1(e.target.value)}
                              // value={thbReceived}
                              // onChange={(e) => setThbReceived(e.target.value)}

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
                              value={lossGainOnExchangeRate1}
                              onChange={handleLossGainChange1} // Handle user inpu
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
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
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
                          {paymentTable2?.map((item) => {
                            return (
                              <>
                                <tr>
                                  <td>
                                    <input
                                      type="checkbox"
                                      checked={!!checkedItems1[item.po_id]}
                                      onChange={(e) =>
                                        handleCheckboxChange1(
                                          item.po_id,
                                          e.target.checked
                                        )
                                      }
                                    />
                                  </td>
                                  <td> {item.PO_Code}</td>
                                  <td>
                                    {" "}
                                    {item.PO_Date
                                      ? formatDate(item.PO_Date)
                                      : ""}
                                  </td>
                                  <td> {item.Invoice_Number}</td>
                                  {/* <td>{formatDate(item.supplier_invoice_date)}</td> */}
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
                                      value={paidAmounts1[item.po_id] || ""}
                                      onChange={(e) =>
                                        handlePaidAmountChange1(
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
                      onClick={handleSubmit2}
                      className="btn btn-primary"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Modal */}
            {/* vendor modal */}
            <div
              className="modal fade freightModalCreate "
              id="modalVendor"
              tabIndex="-1"
              aria-labelledby="5"
              aria-hidden="true"
            >
              <div className="modal-dialog  ">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="5">
                      Vendor Statement
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={dataClear}
                    >
                      <i className="mdi mdi-close" />
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-lg-12 form-group mb-2">
                        <h6>Vendor</h6>
                        <div className="ceateTransport">
                          {/* <Autocomplete
                            disablePortal
                            options={clientVendor} // Use your clients array as options
                            getOptionLabel={(option) => option.name} // Display the client's name
                            onChange={(e, newValue) =>
                              setClientId(newValue?.vendor_id || "")
                            }
                            sx={{ width: 300 }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Search Vendor" // Adds a placeholder
                                InputLabelProps={{ shrink: false }} // Prevents floating label
                              />
                            )}
                          /> */}
                          <Autocomplete
                            disablePortal
                            options={clientVendor}
                            getOptionLabel={(option) => option.name}
                            value={
                              clientVendor?.find(
                                (v) => v.vendor_id === clientId
                              ) || null
                            } // Ensure controlled component
                            onChange={(e, newValue) =>
                              setClientId(newValue?.vendor_id || "")
                            }
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
                        <h6>From</h6>
                        <input
                          className="form-control"
                          type="date"
                          id="fromDate"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                        />
                      </div>
                      <div className="col-lg-12 form-group borderInputUnset mb-2">
                        <h6>To</h6>
                        <input
                          type="date"
                          className="form-control"
                          id="toDate"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer justify-content-center">
                    <button
                      type="button"
                      className="UpdatePopupBtn btn btn-primary "
                      onClick={handleSubmit6}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* vendor moadal end */}
            <div
              className="modal fade "
              id="modalState"
              tabIndex={-1}
              aria-labelledby="5"
              aria-hidden="true"
            >
              <div className="modal-dialog modalShipTo">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="5">
                      Statement
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={dataClear}
                    >
                      <i className="mdi mdi-close"></i>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="client_filter autoComplete">
                      <h6> Account/Bank/Wallet</h6>
                      <Autocomplete
                        value={
                          bankList.find(
                            (bank) => bank.bank_id === clientIdSet
                          ) || null // Find the bank object or null
                        }
                        onChange={(event, newValue) =>
                          setClientIdSet(newValue ? newValue.bank_id : "")
                        } // Update with bank_id
                        options={bankList}
                        getOptionLabel={(option) => option.Bank_nick_name} // Display bank name
                        isOptionEqualToValue={(option, value) =>
                          option.bank_id === value.bank_id
                        } // Match option to selected value
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Select Bank"
                          />
                        )}
                        disableClearable // Prevent clearing the selected value
                      />
                    </div>

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
          </div>
          <div className="paymentSec">
            <>
              <button
                type="button"
                className="btn btn-danger"
                data-bs-toggle="modal"
                data-bs-target="#modalPayment"
              >
                Receive Payment
              </button>
              {/* Modal */}
              <div
                className="modal fade "
                id="modalPayment"
                tabIndex={-1}
                aria-labelledby="5"
                aria-hidden="true"
              >
                <div className="modal-dialog modalShipTo  modal-xl">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="5">
                        Payment
                      </h1>
                      <button
                        type="button"
                        className="btn-close"
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
                              options={
                                clients?.map((item) => ({
                                  client_id: item.client_id, // Ensure the property names match
                                  client_name: item.client_name,
                                })) || []
                              } // Provide options for autocomplete
                              getOptionLabel={(option) =>
                                option.client_name || ""
                              } // The text to display for each option
                              onChange={(event, newValue) => {
                                // Handle client change
                                setClientId(newValue ? newValue.client_id : ""); // Update the state with the selected client_id
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Select Client" // Set placeholder text
                                  variant="outlined"
                                />
                              )}
                              value={
                                // Find the client object corresponding to the selected ID
                                Array.isArray(clients)
                                  ? clients.find(
                                      (client) => client.client_id === clientId
                                    ) || null
                                  : null
                              }
                              isOptionEqualToValue={(option, value) =>
                                option.client_id === value.client_id
                              } // Ensure the option matches the selected value
                            />
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="parentFormPayment autoComplete">
                            <p>Consignee </p>
                            <Autocomplete
                              options={
                                consignees?.map((item) => ({
                                  consignee_id: item.consignee_id, // Ensure the property names match
                                  consignee_name: item.consignee_name,
                                })) || []
                              } // Provide options for autocomplete
                              getOptionLabel={(option) =>
                                option.consignee_name || ""
                              } // The text to display for each option
                              onChange={(event, newValue) => {
                                setConsigneeId(
                                  newValue ? newValue.consignee_id : ""
                                ); // Update the state with the selected consignee_id
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Select Consignee" // Set placeholder text
                                  variant="outlined"
                                />
                              )}
                              value={
                                // Find the consignee object corresponding to the selected ID
                                Array.isArray(consignees)
                                  ? consignees.find(
                                      (consignee) =>
                                        consignee.consignee_id === consigneeId
                                    ) || null
                                  : null
                              }
                              isOptionEqualToValue={(option, value) =>
                                option.consignee_id === value.consignee_id
                              } // Ensure the option matches the selected value
                            />
                            {/* <select
                              value={consigneeId}
                              onChange={(e) => setConsigneeId(e.target.value)}
                            >
                              <option value="">Select Consignee</option>
                              {consignees?.map((item) => (
                                <option
                                  key={item.consignee_id}
                                  value={item.consignee_id}
                                >
                                  {item.consignee_name}
                                </option>
                              ))}
                            </select> */}
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
                              options={
                                paymentChannle?.map((item) => ({
                                  bank_id: item.bank_id, // Ensure property names match the data structure
                                  Bank_nick_name: item.Bank_nick_name,
                                })) || []
                              } // Provide options for autocomplete
                              getOptionLabel={(option) =>
                                option.Bank_nick_name || ""
                              } // The text to display for each option
                              onChange={(event, newValue) => {
                                setPaymentChannel(
                                  newValue ? newValue.bank_id : ""
                                ); // Update state with the selected bank_id
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Select Payment Channel" // Set placeholder text
                                  variant="outlined"
                                />
                              )}
                              value={
                                // Find the payment channel object corresponding to the selected ID
                                Array.isArray(paymentChannle)
                                  ? paymentChannle.find(
                                      (channel) =>
                                        channel.bank_id === paymentChannel
                                    ) || null
                                  : null
                              }
                              isOptionEqualToValue={(option, value) =>
                                option.bank_id === value.bank_id
                              } // Ensure the option matches the selected value
                            />

                            {/* <select
                              onChange={(e) =>
                                setPaymentChannel(e.target.value)
                              }
                              value={paymentChannel}
                            >
                              <option value="">Select Payment Channel</option>
                              {paymentChannle?.map((item) => (
                                <option key={item.bank_id} value={item.bank_id}>
                                  {item.Bank_nick_name}
                                </option>
                              ))}
                            </select> */}
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
                                options={
                                  currency?.map((item) => ({
                                    currency_id: item.currency_id, // Ensure property names match the data structure
                                    currency: item.currency,
                                  })) || []
                                } // Provide options for autocomplete
                                getOptionLabel={(option) =>
                                  option.currency || ""
                                } // The text to display for each option
                                onChange={(event, newValue) => {
                                  handleCurrencyChange({
                                    target: {
                                      value: newValue
                                        ? newValue.currency_id
                                        : "",
                                    }, // Mimic the structure of an event object for compatibility
                                  });
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder="Select Fx" // Set placeholder text
                                    variant="outlined"
                                  />
                                )}
                                value={
                                  // Find the currency object corresponding to the selected fxId
                                  Array.isArray(currency)
                                    ? currency.find(
                                        (item) => item.currency_id === fxId
                                      ) || null
                                    : null
                                }
                                isOptionEqualToValue={(option, value) =>
                                  option.currency_id === value.currency_id
                                } // Ensure the option matches the selected value
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
                              {/* <th> AWB Number</th> */}
                              <th> TT REF</th>
                              <th>FX</th>
                              <th>Invoice Amount</th>

                              <th>Credit Note </th>
                              <th> Net Amount</th>
                              <th>Past Payment </th>
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
                                          !!checkedItems[item.transaction_ref]
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
                                    {/* <td>{item.bl}</td> */}
                                    <td> {item.tt_ref}</td>
                                    <td> {item.currency}</td>
                                    <td> {item.invoice_amount}</td>
                                    <td> {item.credit_note}</td>

                                    <td> {item.billed_amount}</td>
                                    <td>{item.past_payment}</td>
                                    <td>{item.amount_to_pay}</td>
                                    <td>
                                      <input
                                        type="number"
                                        value={
                                          paidAmounts[item.transaction_ref] ||
                                          ""
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
              Transfer
            </button>
            {/* Modal */}
            <div
              className="modal fade"
              id="modalClaim"
              tabIndex={-1}
              aria-labelledby="5"
              aria-hidden="true"
            >
              <div className="modal-dialog modalShipTo">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="5">
                      Account Transfer
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={dataCleartransfer}
                    >
                      <i className="mdi mdi-close"></i>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="client_filter autoComplete mb-3">
                      <h6> From</h6>
                      {/* <ComboBox
                        options={bankList?.map((v) => ({
                          id: v.bank_id,
                          name: v.Bank_nick_name,
                        }))}
                        value={fromBank}
                        onChange={(selected) => setFromBank(selected)}
                      /> */}
                      <Autocomplete
                        options={
                          bankList?.map((v) => ({
                            id: v.bank_id,
                            name: v.Bank_nick_name,
                          })) || []
                        }
                        getOptionLabel={(option) => option.name || ""}
                        onChange={(event, newValue) => {
                          setFromBank(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select Bank"
                            variant="outlined"
                          />
                        )}
                        value={fromBank || null}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value?.id
                        }
                      />
                    </div>
                    <div className="client_filter autoComplete">
                      <h6> To</h6>
                      {/* <ComboBox
                        options={bankList?.map((v) => ({
                          id: v.bank_id,
                          name: v.Bank_nick_name,
                        }))}
                        value={toBank}
                        onChange={(selected) => setToBank(selected)}
                      /> */}
                      <Autocomplete
                        options={
                          bankList?.map((v) => ({
                            id: v.bank_id, // Ensure property names match the data structure
                            name: v.Bank_nick_name,
                          })) || []
                        }
                        getOptionLabel={(option) => option.name || ""} // Text to display for each option
                        onChange={(event, newValue) => {
                          setToBank(newValue); // Update the state directly with the selected value
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select Bank" // Placeholder text
                            variant="outlined"
                          />
                        )}
                        value={toBank || null} // Use the current state value for the selected option
                        isOptionEqualToValue={(option, value) =>
                          option.id === value?.id
                        } // Ensure the options match correctly by id
                      />
                    </div>
                    <label className="mt-2" htmlFor="toDate">
                      Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="toDate"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                    <label className="mt-2" htmlFor="amount">
                      Amount
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Amount"
                    />
                    <label className="mt-2" htmlFor="ref">
                      REF
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="ref"
                      value={ref}
                      onChange={(e) => setRef(e.target.value)}
                      placeholder="Ref"
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSubmitData}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row dashCard53 mt-5 accountCard">
          {allAccontDetails?.map((item, index) => (
            <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4" key={index}>
              <div className="card  ">
                <div className="card-header p-3 pt-2">
                  <div className="icon  icon-lg icon-shape bg-gradient-primary  d-flex align-items-center text-white justify-center p-2  border-radius-xl mt-n4 position-absolute">
                    {/* <i className=" material-icons  mdi mdi-account-multiple" /> */}
                    {item.Bank_nick_name}
                  </div>
                  <div className="text-end pt-1">
                    <p className="text-sm mb-0 text-capitalize">
                      Account Details
                    </p>
                    <h4
                      className="mb-0"
                      dangerouslySetInnerHTML={{
                        __html: item.Name_exp_2
                          ? item.Name_exp_2.replace(/\r\n/g, "<br/>").replace(
                              /\n/g,
                              "<br/>"
                            )
                          : "",
                      }}
                    />
                  </div>
                </div>
                <hr className="dark horizontal my-0" />
                <div className="card-footer p-3 text-right">
                  <h4 className="mb-0 text-dark" style={{ fontWeight: 600 }}>
                    {item.Name_exp_4}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="tableviewAccount">
          <TableView columns={columns} data={data} />
        </div>
      </Card>
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
                  Account Modal
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
                        <h6>Copy Options -</h6>
                        <input
                          type="radio"
                          id="html1"
                          name="fav_language"
                          value="Client"
                          checked={selectedInvoice === "Client"}
                          onChange={handleRadioChange}
                        />
                        <label htmlFor="html1"> Internal copy</label>

                        <input
                          type="radio"
                          id="css1"
                          name="fav_language"
                          value="Consignee"
                          checked={selectedInvoice === "Consignee"}
                          onChange={handleRadioChange}
                        />
                        <label htmlFor="css1">Client copy</label>
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
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Accounts;
