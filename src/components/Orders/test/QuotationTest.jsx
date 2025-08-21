import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../../assets/logoT.jpg";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { API_IMAGE_URL } from "../../../Url/Url";
import logo1 from "../../../assets/logoNew.png";
import { format } from "date-fns";
import { Card } from "../../../card";
import { TableView } from "../../table";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MySwal from "../../../swal";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Modal } from "react-bootstrap";

const QuotationTest = () => {
  const { t, i18n } = useTranslation("global");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(false);
  const [titleData, setTitleData] = useState("");
  const [useAgreedPricing, setUseAgreedPricing] = useState(false);
  const [itemDetails, setItemDetails] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState("Client");
  const [notes1, setNotes1] = useState("");
  const [deleteOrderId, setDeleteOrderId] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const loadingModal = MySwal.mixin({
    title: "Loading...",
    didOpen: () => {
      MySwal.showLoading();
    },
    showCancelButton: false,
    showConfirmButton: false,
    allowOutsideClick: false,
  });
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const [chargeVolume, setChargeVolume] = useState(false);
  const [idData, setIdData] = useState("");
  const [status, setStatus] = useState("");
  const [filterData1, setFilterData1] = useState("");
  const [isRecalculateChecked, setIsRecalculateChecked] = useState(false);
  const handleChange = (event) => {
    setStatus(event.target.value);
  };
  const handleChange3 = (e) => {
    setNotes1(e.target.value);
  };
  const handleAgreedPricingChange = (e) => {
    setIsRecalculateChecked(e.target.checked);
  };
  // const getAllQuotation = () => {
  //   axios
  //     .get(`${API_BASE_URL}/NewgetOrders`, {
  //       params: { is_quotation: 1 },
  //     })
  //     .then((res) => {
  //       console.log(res);
  //       setData(res.data.data || []);
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching quotations:", err);
  //     });
  // };
  const getAllQuotation = () => {
    axios
      .get(`${API_BASE_URL}/QuotationEN`)
      .then((res) => {
        console.log(res);

        const { head, data, title } = res.data;
        setTitleData(title);
        // Remove unwanted columns from table (Order_ID, Status_value)
        const columnsToHide = [
          "Order_ID",
          "Status_value",
          "QI1",
          "QI2",
          "QI3",
          "QI4",
          "QI5",
          "QI6",
          "QI7",
          "QI8",
          "QI9",
        ];

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
            <div className="editIcon">
              {+a.QI1 === 1 && (
                <Link to="/quotation_view" state={{ from: { ...a } }}>
                  <i className="mdi mdi-eye" />
                </Link>
              )}

              {(+a.Status_value === 1 ||
                +a.Status_value === 2 ||
                +a.QI2 !== 0) && (
                <Link to="/update_Quotation" state={{ from: { ...a } }}>
                  <i className="mdi mdi-pencil" />
                </Link>
              )}

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
                  <title>Quotation</title>
                  <path d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H8V21C8 21.6 8.4 22 9 22H9.5C9.7 22 10 21.9 10.2 21.7L13.9 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2M11 13H7V8.8L8.3 6H10.3L8.9 9H11V13M17 13H13V8.8L14.3 6H16.3L14.9 9H17V13Z"></path>
                </svg>
              </button>

              {(+a.Status_value === 1 ||
                +a.Status_value === 2 ||
                +a.Status_value === 3 ||
                +a.Status_value === 4) && (
                <button
                  type="button"
                  style={{
                    width: "20px",
                    color: "#203764",
                    fontSize: "22px",
                    marginTop: "10px",
                  }}
                  onClick={() => performaOrder(a)}
                >
                  <i className="fi fi-sr-square-p" />
                </button>
              )}

              {+a.Status_value > 2 && (
                <button
                  type="button"
                  style={{
                    width: "20px",
                    color: "#203764",
                    fontSize: "22px",
                    marginTop: "10px",
                  }}
                  onClick={() => handleEditClick1(a.Order_ID)}
                >
                  <i
                    className="mdi mdi-content-copy"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#consigneeOne"
                  />{" "}
                </button>
              )}
              {+a.Status_value === 3 && (
                <button
                  type="button"
                  onClick={() => quotationConfirmation(a.Order_ID)}
                >
                  <i className="mdi mdi-check-circle" />
                </button>
              )}
              {(+a.Status_value === 1 || +a.Status_value === 2) && (
                <button
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal1"
                  onClick={() => setDeleteOrderId(a.Order_ID)}
                >
                  <i className="mdi mdi-delete" />
                </button>
              )}

              {[1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].includes(
                a.Status_value
              ) && (
                <button
                  type="button"
                  onClick={() => quotationConfirmationForOrder(a.Order_ID)}
                >
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
              {(+a.Status_value === 1 || +a.Status_value === 2) && (
                <button
                  type="button"
                  style={{
                    width: "20px",
                    color: "#203764",
                    fontSize: "22px",
                    marginTop: "10px",
                  }}
                  onClick={() => expireQoutation(a.Order_ID)}
                >
                  <i className="mdi mdi-clock-alert" />
                </button>
              )}
              {/* {+a.QI1 === 1 && (
                <Link to="/quotation_view" state={{ from: { ...a } }}>
                  <i className="mdi mdi-eye" />
                </Link>
              )}
              {+a.QI2 !== 0 && (
                <Link to="/update_Quotation" state={{ from: { ...a } }}>
                  <i className="mdi mdi-pencil" />
                </Link>
              )} */}
            </div>
          ),
        });

        setColumns(dynamicColumns);
        setData(data || []);
      })
      .catch((err) => {
        console.error("Error fetching quotations:", err);
      });
  };
  useEffect(() => {
    getAllQuotation();
  }, [i18n]);
  // State for columns

  const handleAgreedPricingChange1 = (e) => {
    setChargeVolume(e.target.checked);
  };

  const orderData1 = () => {
    axios
      .get(`${API_BASE_URL}/getAllQuotation`, {
        params: {
          status, // This will pass the selected status value
        },
      })
      .then((res) => {
        // setData(res.data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  };

  // Optionally call the API on component mount or when the status changes
  useEffect(() => {
    if (status !== "") {
      orderData1();
    }
  }, [status]);

  const handleAgreedPricingChange3 = (e) => {
    setExchangeRate(e.target.checked);
    console.log(exchangeRate);
    // pdfAllData();
  };

  const handleAgreedPricingChange2 = (e) => {
    setUseAgreedPricing(e.target.checked);
    console.log(useAgreedPricing);
    // pdfAllData();
  };
  const handleAgreedPricingChange4 = (e) => {
    setItemDetails(e.target.checked);
    console.log(itemDetails);
    // pdfAllData();
  };
  const handleRadioChange = (event) => {
    setSelectedInvoice(event.target.value);
  };
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
      cancelButtonText: t("cancel"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(`${API_BASE_URL}/deleteQuotation`, {
            quotation_id: id,
            USER_ID: localStorage.getItem("id"),
            NOTES: "",
          });
          if (response.data.success === true) {
            console.log("API response:", response);
            toast.success(t("quotationDeletedSuccessfully"));
            getAllQuotation();
          } else {
            console.log("API response:", response);
            toast.success(response.data.message.Message_EN);
            getAllQuotation();
          }
        } catch (e) {
          console.error("API call error:", e);
          toast.error(t("tryAgain"));
        }
      }
    });
  };
  const expireQoutation = async (quotation_id) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/ExpireQuotations`, {
        quotationId: quotation_id,
      });
      console.log("API response:", response);
      getAllQuotation();
      toast.success(t("quotationExpiredSuccess"));
      // Handle the response as needed
    } catch (error) {
      console.error("API call error:", error);
      toast.error(t("quotationExpiredFailed"));
    }
  };
  const handleEditClick1 = async (quotation_id) => {
    setIdData(quotation_id);
  };
  const handleEditClick = async () => {
    loadingModal.fire();
    try {
      const response = await axios.post(`${API_BASE_URL}/copyOrder`, {
        order_id: idData,
        user: localStorage.getItem("id"),
        Is_quotation: 1,
        Recalculate: chargeVolume ? 1 : 0, // Convert boolean to 1 or 0
        // Other data you may need to pass
      });
      console.log("API response:", response);
      let modalElement = document.getElementById("consigneeOne");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }

      loadingModal.close();
      setChargeVolume(false);
      getAllQuotation();
      toast.success(t("quotationCopySuccess"));
      // Handle the response as needed
    } catch (error) {
      console.error("API call error:", error);
      loadingModal.close();
      toast.error(t("quotationCopyFailed"));
    }
  };
  const quotationConfirmation = async (quotation_id) => {
    loadingModal.fire();
    try {
      const response = await axios.post(`${API_BASE_URL}/NewconfirmQuotation`, {
        quotation_id: quotation_id,
        user_id: localStorage.getItem("id"),
        // Other data you may need to pass
      });
      console.log("API response:", response);
      loadingModal.close();
      getAllQuotation();
      toast.success(t("quotationConfirmationSuccess"));
      // Handle the response as needed
    } catch (error) {
      console.error("API call error:", error);
      loadingModal.close();
      toast.error(t("quotationConfirmationFailed"));
    }
  };

  const quotationConfirmationForOrder = async (quotation_id) => {
    loadingModal.fire();
    try {
      const response = await axios.post(`${API_BASE_URL}/QuotationConfirm`, {
        order_id: quotation_id,
        // user_id: localStorage.getItem("id"),
        // Other data you may need to pass
      });
      console.log("API response:", response);
      loadingModal.close();
      getAllQuotation();
      toast.success(t("quotationConfirmationSuccess"));
      // Handle the response as needed
    } catch (error) {
      console.error("API call error:", error);
      loadingModal.close();
      toast.error(t("quotationConfirmationFailed"));
    }
  };
  const performaOrder = async (a) => {
    try {
      let messageSet = "";
      let messageNote = "";
      // First API Call: Invoice Procedure
      const invoiceResponse = await axios.get(
        `${API_BASE_URL}/Newquotation_proforma`,
        {
          params: { quotation_id: a?.Order_ID },
        }
      );
      console.log(invoiceResponse);

      const filterData = await axios.get(`${API_BASE_URL}/NewgetOrdersById`, {
        params: { order_id: a?.Order_ID },
      });
      console.log(filterData?.data?.data);

      // Third API Call: Fetch PDF delivery details

      const doc = new jsPDF();
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
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`${invoiceResponse?.data?.Company_Address?.Line_1}`, 30, 8);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`${invoiceResponse?.data?.Company_Address?.Line_2}`, 30, 12);
        const longTextOne = `${invoiceResponse?.data?.Company_Address?.Line_3}`;
        const maxWidthOne = 90;
        const linesOne = doc.splitTextToSize(longTextOne, maxWidthOne);
        let startXOne = 30;
        let startYOne = 16;
        linesOne.forEach((lineOne, index) => {
          doc.text(lineOne, startXOne, startYOne + index * 4.2); // Adjust the line height (10) as needed
        });
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Proforma Invoice`, 127, 7.5);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(
          `${invoiceResponse.data.Section1_Labels.Row1} ${
            invoiceResponse.data.section1_Values.Row1
              ? invoiceResponse.data.section1_Values.Row1
              : ""
          }`,
          127,
          12
        );
        doc.text(
          `${invoiceResponse.data.Section1_Labels.Row2} ${
            invoiceResponse.data.section1_Values.Row2
              ? invoiceResponse.data.section1_Values.Row2
              : ""
          }`,
          127,
          16.5
        );
        doc.text(
          `${invoiceResponse.data.Section1_Labels.Row3} ${
            invoiceResponse.data.section1_Values.Row3
              ? invoiceResponse.data.section1_Values.Row3
              : ""
          }`,
          127,
          20
        );
        doc.text(
          `${invoiceResponse.data.Section1_Labels.Row4} ${
            invoiceResponse.data.section1_Values.Row4
              ? invoiceResponse.data.section1_Values.Row4
              : ""
          }`,
          127,
          24.5
        );
      };
      doc.setFillColor(32, 55, 100);
      doc.rect(7, 27, doc.internal.pageSize.width - 15, 0.5, "FD");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text("Invoice to", 7, 31.5);
      doc.text("Consignee Details", 127.2, 31.5);

      doc.setFillColor(32, 55, 100);
      // doc.rect(7, 32.5, doc.internal.pageSize.width - 15, 0.5, "FD");
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

      // Initialize the common Y position
      const commonStartY = 36.3; // Set common starting Y position for both blocks

      // First set of texts (left side)
      const maxWidth1 = 72;
      const startX1 = 7;
      const lineHeight1 = 4.2;
      let currentY1 = commonStartY; // Use the common starting Y position
      const clientAddress = invoiceResponse.data?.section2_Values || {};
      const longTexts = [
        clientAddress.client_name,
        clientAddress.client_tax_number,
        clientAddress.Address1,
        clientAddress.Address2,
        clientAddress.Address3,
        clientAddress.Address4,
        clientAddress.client_phone,
      ].filter((text) => text && text.toString().trim() !== "");
      longTexts.forEach((line) => {
        currentY1 = renderWrappedText(
          doc,
          line,
          startX1,
          currentY1,
          maxWidth1,
          lineHeight1
        );
      });
      // Render the first block of text

      doc.setFontSize(10);

      const maxWidth2 = 72;
      const startX2 = 127.2;
      let currentY2 = commonStartY; // Use the same starting Y position for the second block

      doc.setFontSize(11);
      const textBlock2 = [
        invoiceResponse.data?.section3_Values.consignee_name,
        invoiceResponse.data?.section3_Values.consignee_tax_number,
        invoiceResponse.data?.section3_Values.Address1,
        invoiceResponse.data?.section3_Values.Address2,
        invoiceResponse.data?.section3_Values.Address3,
        invoiceResponse.data?.section3_Values.Address4,
        invoiceResponse.data?.section3_Values.consignee_email,
      ].filter((text) => text && text.toString().trim() !== "");

      doc.setFontSize(11);
      textBlock2.forEach((text, index) => {
        currentY2 = renderWrappedText(
          doc,
          text,
          startX2,
          currentY2,
          maxWidth2,
          lineHeight1
        );
        if (index === 0) doc.setFontSize(10);
      });
      doc.setFontSize(10);

      const formatterNg = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 3,
      });
      const formatterNo = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      const twoDecimal = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      const NoDecimal = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      const threeDecimal = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      });
      await addLogoWithDetails(); // Wait for logo and details to be added
      const tableStartY = Math.max(currentY1, currentY2);
      const rawHeader = invoiceResponse?.data?.header;
      const rawData = invoiceResponse?.data?.data;
      const columns = Object.keys(rawHeader).map((key, index) => ({
        header: rawHeader[key], // display name
        dataKey: `COL${index + 1}`, // maps to "COL1", "COL2", etc.
      }));
      const rows = rawData.map((row) => {
        // Optional: format numbers or values here if needed
        return { ...row };
      });
      doc.autoTable({
        head: [columns.map((col) => col.header)],
        body: rows.map((row) => columns.map((col) => row[col.dataKey])),
        startY: tableStartY,
        headStyles: {
          fillColor: "#203764",
          textColor: "#FFFFFF",
        },
        pageBreak: "auto",
        bodyStyles: { valign: "top" },
        styles: {
          overflow: "linebreak",
        },
        columnStyles: {
          1: { halign: "center" },
          2: { halign: "right" },
          3: { halign: "right" },
          4: { cellWidth: 50 },
          5: { halign: "right" },
          6: { halign: "center" },
          7: { halign: "right" },
          8: { halign: "right" },
        },
        margin: {
          left: 7,
          right: 7,
        },
        tableWidth: "auto",
        headStyles: {
          fillColor: [32, 55, 100],
          textColor: [255, 255, 255],
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
      const yTop = doc.autoTable.previous.finalY + 1;
      const finalY = doc.autoTable.previous.finalY + 4;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      doc.text(
        `${invoiceResponse.data.section6_Labels.Row1} ${
          invoiceResponse.data.section6_Values.Row1
            ? invoiceResponse.data.section6_Values.Row1
            : ""
        }`,
        7,
        finalY + 1
      );
      doc.text(
        `${invoiceResponse.data.section6_Labels.Row2} ${
          invoiceResponse.data.section6_Values.Row2
            ? invoiceResponse.data.section6_Values.Row2
            : ""
        }`,
        7,
        finalY + 5
      );
      doc.text(
        `${invoiceResponse.data.section6_Labels.Row3} ${
          invoiceResponse.data.section6_Values.Row3
            ? invoiceResponse.data.section6_Values.Row3
            : ""
        }`,
        7,
        finalY + 9
      );
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      const PAGE_WIDTH = 210; // A4 page width in mm
      const MARGIN = 10; // margin from the right edge
      const formatter5 = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 2,
      });
      // Set the text and value
      const label = invoiceResponse.data.section5_Labels.Row1;

      const value = `${twoDecimal.format(
        invoiceResponse.data.section5_Values[
          "SUM(Order_Details.Final_price*Order_Details.QTY)"
        ]
      )}`;

      // Calculate the width of the label and the value
      const labelWidth = doc.getTextWidth(label);
      const valueWidth = doc.getTextWidth(value);

      // Calculate the x-coordinate for right alignment
      const xRight = PAGE_WIDTH - MARGIN - valueWidth;

      // Set the font and color for the label
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);

      // Draw the label
      doc.text(
        label,
        PAGE_WIDTH - MARGIN - labelWidth - valueWidth - 5,
        finalY + 1
      );

      // Draw the value
      doc.text(value, xRight, finalY + 1);

      doc.rect(147, finalY + 2, 55.5, 0.5, "FD");

      // ****************************************** note and delivery note part
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
      const longText =
        invoiceResponse.data?.section7_Values.Delivery_Terms || "";
      const x = 7;
      const initialY = doc.autoTable.previous.finalY + 24;
      const maxWidth = 180;

      let finalY1 = initialY;

      // 🔹 Step 1: Render longText first (if exists)
      const hasLongText = longText.trim() !== "";
      if (hasLongText) {
        finalY1 = addTextWithPagination(doc, longText, x, finalY1, maxWidth);
      }

      const inputFieldValue =
        invoiceResponse.data?.section8_Values?.NOTES || "";

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
          `${invoiceResponse.data?.section8_Labels.Notes}:`,
          inputX,
          noteLabelY + 2
        );

        // 🔹 Wrapped note text
        const lines = doc.splitTextToSize(inputFieldValue, maxTextWidth);
        const textY = noteLabelY + 5;
        doc.text(lines, inputX, textY + 2);
      }

      // ****************************************** note and delivery note part end
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
      await uploadPDF(pdfBlob, a);
    } catch (error) {
      console.error("Error fetching data:", error);

      // Handle network errors
      toast.error("Network Error", {
        autoClose: 1000,
        theme: "colored",
      });

      // Handle API errors
      if (error.response?.status === 400) {
        console.error(error.response.data.message);
      }
    }
  };
  const uploadPDF = async (pdfBlob, a) => {
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;
    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${a?.Order_ID || "default"}_Proforma_${dateTime}.pdf`
    );
    setIsLoading(true);
    loadingModal.fire();
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(`${API_IMAGE_URL}${a?.Order_ID}_Proforma_${dateTime}.pdf`);
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
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const generatePdf = async () => {
    const isConsignee = selectedInvoice === "Consignee" ? 1 : 0;
    const formatterNg = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    });
    const twoDecimal = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    try {
      // First API Call: Invoice Procedure
      const invoiceResponse = await axios.post(
        `${API_BASE_URL}/NewQuotationPDF`,
        {
          quotation_id: filterData1?.Order_ID,
          AgreedPrice: useAgreedPricing ? 1 : 0,
          CustomName: itemDetails ? 1 : 0,
          InvoiceName: isConsignee,
        }
      );
      console.log(invoiceResponse);
      const { header, quotationDetails } = invoiceResponse?.data || {};
      const columnKeys = Object.keys(header); // ["Item", "Scientific_Name", "HS Code", "Unit Price", "ITF Code"]
      const headerLabels = Object.values(header); // ["Item", "Scientific_Name", "HS Code", "Unit Price", "ITF Code"]
      const filterData = await axios.get(`${API_BASE_URL}/NewgetOrdersById`, {
        params: { order_id: filterData1?.Order_ID },
      });
      console.log(filterData1?.data?.data);

      // Third API Call: Fetch PDF delivery details

      let modalElement = document.getElementById("exampleModalCustomization");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
      const doc = new jsPDF();
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
        const logoData = await convertImageToBase64(logo1);
        doc.addImage(logoData, "PNG", 6, 3, 20, 20);
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
          doc.text(lineOne, startXOne, startYOne + index * 4.2);
        });
        // end company
        doc.setFillColor(32, 55, 100);
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.rect(95, 5, 107, 7, "FD");
        // Place text inside the rectangle
        doc.text("Quotations", 130, 9.5);
        // rect end
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(invoiceResponse?.data?.orderMetaLabels?.Row1, 95, 16);
        doc.text(invoiceResponse?.data?.orderMetaLabels?.Row2, 95, 20);
        doc.text(invoiceResponse?.data?.orderMetaLabels?.Row3, 95, 24);
        doc.text(invoiceResponse?.data?.transportTypeLabel?.Delivery, 95, 32);

        doc.text(
          `${
            invoiceResponse?.data?.orderMetaValues.Row1
              ? invoiceResponse?.data?.orderMetaValues.Row1
              : ""
          }`,
          117,
          16
        );
        doc.text(
          `${
            invoiceResponse?.data?.orderMetaValues.Row2
              ? invoiceResponse?.data?.orderMetaValues.Row2
              : ""
          }`,
          117,
          20
        );
        doc.text(
          `${
            invoiceResponse?.data?.orderMetaValues.Row3
              ? invoiceResponse?.data?.orderMetaValues.Row3
              : ""
          }`,
          117,
          24
        );
        doc.text(
          `${
            invoiceResponse?.data?.transportInfo[
              "Seller's Choice with 2 Days of Agreed ETA"
            ]
              ? invoiceResponse?.data?.transportInfo[
                  "Seller's Choice with 2 Days of Agreed ETA"
                ]
              : ""
          }`,
          117,
          32
        );
        doc.text(invoiceResponse?.data?.dateLabels?.Row1, 143, 16);
        doc.text(invoiceResponse?.data?.dateLabels?.Row2, 143, 20);
        doc.text(invoiceResponse?.data?.dateLabels?.Row3, 143, 24);
        doc.text(invoiceResponse?.data?.dateLabels?.Row4, 143, 28);
        // doc.text("Destination:",143,28)
        doc.text(`${invoiceResponse?.data?.dateValues.Row1 || ""}`, 170, 16);
        doc.text(`${invoiceResponse?.data?.dateValues.Row2}`, 165, 20);
        doc.text(`${invoiceResponse?.data?.dateValues.Row3}`, 165, 24);
        doc.text(`${invoiceResponse?.data?.dateValues.Row4}`, 172, 28);
        // ******************
        // client
        doc.setFillColor(32, 55, 100);
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.rect(7, 35, 96, 7, "FD");
        doc.text("Client", 50, 40);
        // consignee
        doc.setFillColor(32, 55, 100);
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.rect(106, 35, 96, 7, "FD");
        // Place text inside the rectangle
        doc.text("Consignee", 145, 40);
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
        return startY + lines.length * lineHeight; // Return the new Y position after rendering the text
      }
      const commonStartY = 47; // Set common starting Y position for both blocks

      // First set of texts (left side)
      const maxWidth1 = 72;
      const startX1 = 7;
      const lineHeight1 = 4.2;
      doc.setFontSize(11);
      const clientAddress = invoiceResponse.data?.client_address || {};
      const longTexts = [
        clientAddress.client_name,
        clientAddress.client_tax_number,
        clientAddress.Address1,
        clientAddress.Address2,
        clientAddress.Address3,
        clientAddress.Address4,
        clientAddress.client_phone,
      ].filter((text) => text && text.toString().trim() !== "");
      let currentY1 = commonStartY;
      doc.setFontSize(10); // Set font size once before rendering

      longTexts.forEach((line) => {
        currentY1 = renderWrappedText(
          doc,
          line,
          startX1,
          currentY1,
          maxWidth1,
          lineHeight1
        );
      });

      // Reset the starting Y position for the second block (right side) to be the same as the first block
      const maxWidth2 = 72;
      const startX2 = 106;
      let currentY2 = commonStartY; // Use the same starting Y position as the first block

      doc.setFontSize(11);
      const consigneeAddress = invoiceResponse.data?.consignee_address || {};

      const longTexts2 = [
        consigneeAddress.consignee_name,
        consigneeAddress.consignee_tax_number,
        consigneeAddress.Address1,
        consigneeAddress.Address2,
        consigneeAddress.Address3,
        consigneeAddress.Address4,
        consigneeAddress.consignee_email,
      ].filter((text) => text && text.toString().trim() !== "");

      // Render the second block of filtered text
      doc.setFontSize(10); // Set font size once
      longTexts2.forEach((line) => {
        currentY2 = renderWrappedText(
          doc,
          line,
          startX2,
          currentY2,
          maxWidth2,
          lineHeight1
        );
      });

      const tableStartY = Math.max(currentY1, currentY2);
      await addLogoWithDetails();
      const includeImage = exchangeRate;
      const imageUrl =
        "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D";
      const imgWidth = 47;
      const imgHeight = 47;
      const rows = quotationDetails.map((item) => {
        return columnKeys.map((_, index) => {
          return item[`col${index + 1}`] || item[`COL${index + 1}`] || ""; // covers both "col1" and "COL1"
        });
      });
      const renderTable = (rowsData, startY) => {
        console.log(startY);
        doc.autoTable({
          head: [headerLabels], // Dynamic headers
          body: rowsData,
          startY: tableStartY,
          willDrawCell: (data) => {
            if (data.section === "body") {
              const contentHeight = doc.getTextDimensions(
                Number(data?.cell?.raw)
              ).h;
              if (includeImage) {
                data.row.height = Math.max(contentHeight + imgHeight, 10);
              } else {
                data.row.height = Math.max(contentHeight, 10);
              }
              if (!includeImage && data.row.index % 2 === 0) {
                doc.setFillColor(242, 242, 242);
                doc.rect(
                  data.cell.x,
                  data.cell.y,
                  data.cell.width,
                  data.row.height,
                  "F"
                );
              } else {
                doc.setFillColor(255, 255, 255);
                doc.rect(
                  data.cell.x,
                  data.cell.y,
                  data.cell.width,
                  data.row.height,
                  "F"
                );
              }
            }
          },

          didDrawCell: (data) => {
            if (data.section === "body") {
              const padding = 0;
              if (includeImage && [0, 1, 2, 3].includes(data.column.index)) {
                const img = new Image();
                img.src = imageUrl;
                if (img) {
                  const imgX = data.cell.x + padding;
                  const imgY = data.cell.y + data.cell.height + padding;
                  const paddedImgWidth = imgWidth - 2 * padding; // Subtract padding from width
                  const paddedImgHeight = imgHeight - 2 * padding; // Subtract padding from height

                  // Draw the image directly below the cell with padding
                  doc.addImage(
                    img,
                    "JPEG",
                    imgX,
                    imgY,
                    paddedImgWidth,
                    paddedImgHeight
                  );

                  const bottomPadding = 0;
                  const newHeight =
                    imgY + paddedImgHeight - data.cell.y + bottomPadding;
                  data.cell.height = Math.max(newHeight, data.cell.height);
                  data.row.height = Math.max(data.row.height, newHeight);
                  const lineY = data.cell.y + data.row.height;
                  // doc.setLineWidth(0.8); // Set line width
                  // doc.line(data.cell.x, lineY, data.cell.x + data.cell.width, lineY);
                }
              } else {
                doc.rect(
                  data.cell.x,
                  data.cell.y,
                  data.cell.width,
                  data.row.height,
                  "S" // 'S' for stroke
                );
              }
            }
          },

          margin: {
            left: 7,
            right: 7,
          },
          columnStyles: {
            0: { halign: "left", cellWidth: 49 },
            1: { halign: "left", cellWidth: 49 },
            2: { halign: "center", cellWidth: 49 },
            3: { halign: "center", cellWidth: 49 },
          },
          headStyles: {
            fillColor: [32, 55, 100],
            textColor: [255, 255, 255],
            halign: "center",
          },
          styles: {
            textColor: [0, 0, 0],
            cellWidth: "wrap",
            valign: "middle",
            lineColor: [32, 55, 100],
          },
        });
      };

      // If exchangeRate is true, split the first three rows for the first page and remaining rows for subsequent pages
      if (exchangeRate) {
        const firstPageRows = rows.slice(0, 3); // First three rows for the first page
        const subsequentRows = rows.slice(3); // Remaining rows for the subsequent pages

        // Add the first page with the first three rows
        renderTable(firstPageRows, 65);

        // If `exchangeRate` is true, split the remaining rows across subsequent pages
        if (subsequentRows.length > 0) {
          const rowsPerPage = 4; // Set to 4 rows per page for subsequent pages
          let currentIndex = 0;

          while (currentIndex < subsequentRows.length) {
            doc.addPage(); // Add a new page
            const rowsForPage = subsequentRows.slice(
              currentIndex,
              currentIndex + rowsPerPage
            );
            renderTable(rowsForPage, 20); // Start subsequent tables at a different Y position
            currentIndex += rowsPerPage;
          }
        }
      } else {
        // If exchangeRate is false, render all rows on a single page
        renderTable(rows, 60);
      }
      const lastY = doc.previousAutoTable?.finalY;
      doc.setFont("helvetica", "bold"); // Set font to bold
      const noteData = invoiceResponse.data?.notesValue.NOTES;
      if (noteData) {
        doc.text(invoiceResponse.data?.notesLabel.Notes, 7, lastY + 5);
        doc.setFont("helvetica", "normal");
        const maxWidth = doc.internal.pageSize.getWidth() - 14; // Total page width minus 7px left & 7px right margin
        const text = noteData;

        // Split the text to fit within the max width
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, 7, lastY + 10); // Ensure it starts at 7px from the left
      }

      // Render the text

      // Custom page number function
      const addPageNumbers = (doc) => {
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.text(`${i} out of ${pageCount}`, 185.2, 3.1);
        }
      };

      // Call the page number function

      // Add page numbers
      addPageNumbers(doc);
      const pdfBlob = doc.output("blob");

      // Upload the PDF to the server
      await uploadPDF1(pdfBlob, filterData1);
    } catch (error) {
      console.error("Error fetching data:", error);

      // Handle network errors
      toast.error("Network Error", {
        autoClose: 1000,
        theme: "colored",
      });

      // Handle API errors
      if (error.response?.status === 400) {
        console.error(error.response.data.message);
      }
    }
  };
  const uploadPDF1 = async (pdfBlob, a) => {
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;
    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${a?.Order_ID || "default"}_Quotation_${dateTime}.pdf`
    );

    setIsLoading(true);
    loadingModal.fire();
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(`${API_IMAGE_URL}${a?.Order_ID}_Quotation_${dateTime}.pdf`);
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

  const updateBankStatus = (bankID) => {
    const request = {
      itf_id: bankID,
    };

    axios
      .post(`${API_BASE_URL}/StatusChangeItf`, request)
      .then((response) => {
        if (response.data.success == true) {
          toast.success(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
          getAllQuotation();
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // const columns = useMemo(
  //   () => [
  //     {
  //       Header: t("number"),
  //       accessor: "Quotation_Number",
  //     },
  //     {
  //       Header: t("clientName"),
  //       accessor: "client_name",
  //     },
  //     {
  //       Header: t("destinationPort"),
  //       accessor: "port_name",
  //     },
  //     {
  //       Header: t("consigneeName"),
  //       accessor: "consignee_name",
  //     },
  //     {
  //       Header: t("location"),
  //       accessor: "location_name",
  //     },
  //     {
  //       Header: t("loadDate"),
  //       accessor: "load_Before_date",
  //     },

  //     {
  //       Header: t("status"),
  //       accessor: "status_name",
  //     },
  //     {
  //       Header: t("actions"),
  //       accessor: (a) => (
  //         <div className="editIcon">
  //           <Link to="/quotation_view" state={{ from: { ...a } }}>
  //             <i className="mdi mdi-eye" />
  //           </Link>

  //           {(+a.Status === 1 || +a.Status === 2) && (
  //             <Link to="/update_Quotation" state={{ from: { ...a } }}>
  //               <i className="mdi mdi-pencil" />
  //             </Link>
  //           )}

  //           <button
  //             type="button"
  //             data-bs-toggle="modal"
  //             onClick={() => setFilterData1(a)}
  //             data-bs-target="#exampleModalCustomization"
  //           >
  //             <svg
  //               className="SvgQuo"
  //               xmlns="http://www.w3.org/2000/svg"
  //               viewBox="0 0 24 24"
  //             >
  //               <title>Quotation</title>
  //               <path d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H8V21C8 21.6 8.4 22 9 22H9.5C9.7 22 10 21.9 10.2 21.7L13.9 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2M11 13H7V8.8L8.3 6H10.3L8.9 9H11V13M17 13H13V8.8L14.3 6H16.3L14.9 9H17V13Z"></path>
  //             </svg>
  //           </button>

  //           {(+a.Status === 1 ||
  //             +a.Status === 2 ||
  //             +a.Status === 3 ||
  //             +a.Status === 4) && (
  //             <button
  //               type="button"
  //               style={{
  //                 width: "20px",
  //                 color: "#203764",
  //                 fontSize: "22px",
  //                 marginTop: "10px",
  //               }}
  //               onClick={() => performaOrder(a)}
  //             >
  //               <i className="fi fi-sr-square-p" />
  //             </button>
  //           )}

  //           {+a.Status > 2 && (
  //             <button
  //               type="button"
  //               style={{
  //                 width: "20px",
  //                 color: "#203764",
  //                 fontSize: "22px",
  //                 marginTop: "10px",
  //               }}
  //               onClick={() => handleEditClick1(a.Order_ID)}
  //             >
  //               <i
  //                 className="mdi mdi-content-copy"
  //                 type="button"
  //                 data-bs-toggle="modal"
  //                 data-bs-target="#consigneeOne"
  //               />{" "}
  //             </button>
  //           )}
  //           {+a.Status === 3 && (
  //             <button
  //               type="button"
  //               onClick={() => quotationConfirmation(a.Order_ID)}
  //             >
  //               <i className="mdi mdi-check-circle" />
  //             </button>
  //           )}
  //           {(+a.Status === 1 || +a.Status === 2) && (
  //             // <button
  //             //   type="button"
  //             //   style={{
  //             //     width: "20px",
  //             //     color: "#203764",
  //             //     fontSize: "22px",
  //             //     marginTop: "10px",
  //             //   }}
  //             //   onClick={() => deleteOrder(a.Order_ID)}
  //             // >
  //             //   <i className="mdi mdi-delete" />
  //             // </button>

  //             <button
  //               type="button"
  //               data-bs-toggle="modal"
  //               data-bs-target="#exampleModal1"
  //               onClick={() => setDeleteOrderId(a.Order_ID)}
  //             >
  //               <i className="mdi mdi-delete" />
  //             </button>
  //           )}

  //           {[1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].includes(a.Status) && (
  //             <button
  //               type="button"
  //               onClick={() => quotationConfirmationForOrder(a.Order_ID)}
  //             >
  //               <i
  //                 className="mdi mdi-check"
  //                 style={{
  //                   width: "20px",
  //                   color: "#203764",
  //                   fontSize: "22px",
  //                   marginTop: "10px",
  //                 }}
  //               />
  //             </button>
  //           )}

  //           {(+a.Status === 1 || +a.Status === 2) && (
  //             <button
  //               type="button"
  //               style={{
  //                 width: "20px",
  //                 color: "#203764",
  //                 fontSize: "22px",
  //                 marginTop: "10px",
  //               }}
  //               onClick={() => expireQoutation(a.Order_ID)}
  //             >
  //               <i className="mdi mdi-clock-alert" />
  //             </button>
  //           )}
  //         </div>
  //       ),
  //     },
  //   ],
  //   [i18n.language]
  // );
  const dataSubmit1 = () => {
    axios
      .post(`${API_BASE_URL}/deleteQuotation`, {
        quotation_id: deleteOrderId,
        USER_ID: localStorage.getItem("id"),
        NOTES: notes1,
      })
      .then((response) => {
        if (response.data.success) {
          // Close modal
          let modalElement = document.getElementById("exampleModal1");
          let modalInstance =
            bootstrap.Modal.getInstance(modalElement) ||
            new bootstrap.Modal(modalElement);
          modalInstance.hide();
          getAllQuotation();
          toast.success(t("orderDeleted"), {
            autoClose: 1000,
            theme: "colored",
          });
        } else {
          setShow(true);
        }

        setNotes1("");
        orderData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const clearData = () => {
    setExchangeRate(false);
    setUseAgreedPricing(false);
    setItemDetails(false);
    setSelectedInvoice("Client");
  };
  return (
    <>
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
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Quotation Copy
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
              <label htmlFor="">Recalculate</label>
              <br />
              <label className="toggleSwitch large">
                <input
                  type="checkbox"
                  name="Charge_Volume"
                  checked={chargeVolume}
                  onChange={handleAgreedPricingChange1}
                />
                <span>
                  <span>No</span>
                  <span>Yes</span>
                </span>
                <a></a>
              </label>
            </div>
            <div className="modal-footer justify-content-right">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleEditClick()}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
      <Card
        title={titleData?.Title}
        endElement={
          <button
            type="button"
            onClick={() => navigate("/create_Quotation")}
            className="btn button btn-info"
          >
            {t("create")}
          </button>
        }
      >
        <Box sx={{ minWidth: 120 }} className="selectActive">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              {" "}
              {t("status")}
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
              label="Status"
              onChange={handleChange}
            >
              <MenuItem value="4"> {t("all")}</MenuItem>
              <MenuItem value="0"> {t("active")}</MenuItem>
              <MenuItem value="1"> {t("used")} </MenuItem>
              <MenuItem value="2"> {t("expired")} </MenuItem>
            </Select>
          </FormControl>
        </Box>
        <TableView columns={columns} data={data} />
      </Card>

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
                      <h6> {t("useAgreedPricing")} ?</h6>
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
                    <div className="invoiceModal d-flex justify-content-between">
                      <h6> {t("useCustomName")} </h6>
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
                            onChange={handleAgreedPricingChange4}
                          />
                          <span>
                            <span> {t("no")}</span>
                            <span> {t("yes")}</span>
                          </span>
                          <a> </a>
                        </label>
                      </div>
                    </div>
                    <div className="invoiceModal">
                      <h6> {t("invoiceNameCanBe")}-</h6>
                      <input
                        type="radio"
                        id="html1"
                        name="fav_language"
                        value="Client"
                        checked={selectedInvoice === "Client"}
                        onChange={handleRadioChange}
                      />
                      <label htmlFor="html1"> {t("clients")}</label>

                      <input
                        type="radio"
                        id="css1"
                        name="fav_language"
                        value="Consignee"
                        checked={selectedInvoice === "Consignee"}
                        onChange={handleRadioChange}
                      />
                      <label htmlFor="css1"> {t("consignee")}</label>
                    </div>

                    <div className="invoiceModal d-flex justify-content-between">
                      <h6> {t("doYouWantImage")} ? </h6>
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
                onClick={dataSubmit1}
                className="btn btn-primary"
              >
                {t("ok")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuotationTest;
