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
const QuotationTest = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(false);

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
  const [chargeVolume, setChargeVolume] = useState(false);

  const [idData, setIdData] = useState("");
  const [status, setStatus] = useState("");
  const [filterData1, setFilterData1] = useState("");
  const [isRecalculateChecked, setIsRecalculateChecked] = useState(false);
  const handleChange = (event) => {
    setStatus(event.target.value);
  };
  const handleAgreedPricingChange = (e) => {
    setIsRecalculateChecked(e.target.checked);
  };
  const getAllQuotation = () => {
    axios
      .get(`${API_BASE_URL}/NewgetOrders`, {
        params: { is_quotation: 1 }, // or is_quotation: 1
      })
      .then((res) => {
        console.log(res);
        setData(res.data.data || []);
      })
      .catch((err) => {
        console.error("Error fetching quotations:", err);
      });
  };
  const handleAgreedPricingChange1 = (e) => {
    setChargeVolume(e.target.checked);
  };

  useEffect(() => {
    getAllQuotation();
  }, []);
  const orderData1 = () => {
    axios
      .get(`${API_BASE_URL}/getAllQuotation`, {
        params: {
          status, // This will pass the selected status value
        },
      })
      .then((res) => {
        setData(res.data.data || []);
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
      if (result.isConfirmed) {
        try {
          const response = await axios.post(`${API_BASE_URL}/deleteQuotation`, {
            quotation_id: id,
          });
          if (response.data.success === true) {
            console.log("API response:", response);
            toast.success("Quotation deleted successfully");
            getAllQuotation();
          } else {
            console.log("API response:", response);
            toast.success(response.data.message.Message_EN);
            getAllQuotation();
          }
        } catch (e) {
          console.error("API call error:", e);
          toast.error("Something went wrong");
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
      toast.success("Quotation Expired  successfully");
      // Handle the response as needed
    } catch (error) {
      console.error("API call error:", error);
      toast.error("Failed to Quotation Expired  ");
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
      toast.success("Quotation Copy successfully");
      // Handle the response as needed
    } catch (error) {
      console.error("API call error:", error);
      loadingModal.close();
      toast.error("Failed to Quotation Copy");
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
      toast.success("Quotation Confirmation successfully");
      // Handle the response as needed
    } catch (error) {
      console.error("API call error:", error);
      loadingModal.close();
      toast.error("Failed to Quotation Confirmation");
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
      toast.success("Quotation Confirmation successfully");
      // Handle the response as needed
    } catch (error) {
      console.error("API call error:", error);
      loadingModal.close();
      toast.error("Failed to Quotation Confirmation");
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
      try {
        const deliveryApi = await axios.post(
          `${API_BASE_URL}/newquotation_pdf_delivery_by`,
          {
            quotation_id: a?.Order_ID,
          }
        );

        console.log(deliveryApi.status);
        if (deliveryApi.data.success === true) {
          messageSet = deliveryApi.data.message;
        }
      } catch (error) {
        console.log(error);
        if (error.response?.status === 400) {
          messageSet = error.response.data.message;
        }
      }
      console.log(messageSet);
      try {
        const pdfResponse = await axios.post(
          `${API_BASE_URL}/Quotation_delivery_terms_new`,
          {
            quotation_id: a?.Order_ID,
          }
        );

        console.log(pdfResponse);
      } catch (error) {
        console.log(error);
        if (error.response?.status === 400) {
          messageNote = error.response.data.message;
        }
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
          `Order: ${
            filterData?.data?.data?.Quotation_Number
              ? filterData?.data?.data?.Quotation_Number
              : ""
          }`,
          127,
          12
        );
        doc.text(`TT Ref: `, 127, 16.5);
        doc.text(
          `Loading Date: ${
            filterData?.data?.data?.load_date
              ? format(new Date(filterData?.data?.data.load_date), "dd-MM-yyyy")
              : ""
          }`,
          127,
          20
        );
        doc.text(`Delivery By: ${messageNote}`, 127, 24.5);
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
      const longText1_1 = `${filterData?.data?.data?.client_name}(${filterData?.data?.data?.client_tax_number})`;
      const longText1_2 = `${filterData?.data?.data?.client_address}`;
      const longText1_3 = `${filterData?.data?.data?.client_email} / ${filterData?.data?.data?.client_phone}`;

      // Render the first block of text
      let currentY1 = commonStartY; // Use the common starting Y position
      currentY1 = renderWrappedText(
        doc,
        longText1_1,
        startX1,
        currentY1,
        maxWidth1,
        lineHeight1
      );
      doc.setFontSize(10);
      currentY1 = renderWrappedText(
        doc,
        longText1_2,
        startX1,
        currentY1,
        maxWidth1,
        lineHeight1
      );
      currentY1 = renderWrappedText(
        doc,
        longText1_3,
        startX1,
        currentY1,
        maxWidth1,
        lineHeight1
      );

      const maxWidth2 = 72;
      const startX2 = 127.2;
      let currentY2 = commonStartY; // Use the same starting Y position for the second block

      doc.setFontSize(11);
      const longText2_1 = `${filterData?.data?.data?.consignee_name}(${filterData?.data?.data?.consignee_tax_number})`;
      const longText2_2 = `${filterData?.data?.data?.consignee_address}`;
      const longText2_3 = `${filterData?.data?.data?.consignee_email}/${filterData?.data?.data?.consignee_phone}`;

      currentY2 = renderWrappedText(
        doc,
        longText2_1,
        startX2,
        currentY2,
        maxWidth2,
        lineHeight1
      );
      doc.setFontSize(10);
      currentY2 = renderWrappedText(
        doc,
        longText2_2,
        startX2,
        currentY2,
        maxWidth2,
        lineHeight1
      );
      currentY2 = renderWrappedText(
        doc,
        longText2_3,
        startX2,
        currentY2,
        maxWidth2,
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
        `Total Box: ${formatterNo.format(
          invoiceResponse?.data?.quotationFinance?.O_Box
        )}`,
        7,
        finalY + 1
      );
      doc.text(
        `Total Items: ${formatterNo.format(
          invoiceResponse?.data?.quotationFinance?.O_Items
        )}`,
        7,
        finalY + 5
      );
      doc.text(
        `Total Net Weight: ${threeDecimal.format(
          invoiceResponse?.data?.quotationFinance?.O_NW
        )}`,
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
      const label = "Total USD CNF : ";
      const value = `${twoDecimal.format(
        invoiceResponse?.data?.quotationFinance?.O_CNF_FX
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
      const longText = messageSet ? messageSet : "";
      const textX = 7;
      const textY = finalY + 15;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(doc.splitTextToSize(longText, 201), textX, textY);

      const inputX = 20; // X position of the input field
      const inputY = textY + 8; // Y position of the input field
      const inputWidth = 180; // Width of the input field
      const inputHeight = 10; // Height of the input field
      doc.setDrawColor(123, 128, 154); // Set the color of the rectangle
      const inputFieldValue = data?.NOTES;
      if (inputFieldValue && inputFieldValue.trim() !== "") {
        // Add the input field value inside the rectangle
        doc.rect(inputX, inputY, inputWidth, inputHeight); // Draw the rectangle
        doc.text(inputFieldValue, inputX + 2, inputY + 7); // Adjust position for padding
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
      `${a?.Order_ID || "default"}_Proforma_Test_${dateTime}.pdf`
    );
    setIsLoading(true);
    loadingModal.fire();
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${a?.Order_ID}_Proforma_Test_${dateTime}.pdf`
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
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const generatePdf = async () => {
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
      let messageSet = "";
      let messageNote = "";
      // First API Call: Invoice Procedure
      const invoiceResponse = await axios.post(
        `${API_BASE_URL}/NewQuotationPDF`,
        {
          quotation_id: filterData1?.Order_ID,
        }
      );
      console.log(invoiceResponse);

      const filterData = await axios.get(`${API_BASE_URL}/NewgetOrdersById`, {
        params: { order_id: filterData1?.Order_ID },
      });
      console.log(filterData1?.data?.data);

      // Third API Call: Fetch PDF delivery details
      try {
        const deliveryApi = await axios.post(
          `${API_BASE_URL}/newquotation_pdf_delivery_by`,
          {
            quotation_id: filterData1?.Order_ID,
          }
        );

        console.log(deliveryApi.status);
        if (deliveryApi.data.success === true) {
          messageSet = deliveryApi.data.message;
        }
      } catch (error) {
        console.log(error);
        if (error.response?.status === 400) {
          messageSet = error.response.data.message;
        }
      }
      console.log(messageSet);
      try {
        const pdfResponse = await axios.post(
          `${API_BASE_URL}/Quotation_delivery_terms_new`,
          {
            quotation_id: filterData1?.Order_ID,
          }
        );

        console.log(pdfResponse);
      } catch (error) {
        console.log(error);
        if (error.response?.status === 400) {
          messageNote = error.response.data.message;
        }
      }
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
        doc.text("Quotation :", 95, 16);
        doc.text("date :", 95, 20);
        doc.text("Valid Before :", 95, 24);
        doc.text("Min Weight :", 95, 28);
        doc.text(
          `${
            filterData?.data?.data?.Quotation_Number
              ? filterData?.data?.data?.Quotation_Number
              : ""
          }`,
          117,
          16
        );
        doc.text(`${formatDate(filterData?.data?.data?.created)}`, 117, 20);
        doc.text(
          `${
            filterData?.data?.data?.load_date
              ? format(new Date(filterData?.data?.data.load_date), "dd-MM-yyyy")
              : ""
          } `,
          117,
          24
        );
        doc.text(
          `${formatterNg.format(
            invoiceResponse?.data?.quotationFinance[0]?.O_NW
          )}`,
          117,
          28
        );
        doc.text("Destination:", 143, 16);
        doc.text("Origin:", 143, 20);
        doc.text("Liner:", 143, 24);
        // doc.text("Destination:",143,28)
        doc.text(`${filterData?.data?.data?.Airport}`, 165, 16);
        doc.text("Thailand", 165, 20);
        doc.text("Sellers'Choice", 165, 24);
        // ******************
        // client
        doc.setFillColor(32, 55, 100);
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.rect(7, 30, 96, 7, "FD");
        doc.text("Client", 50, 35);
        // consignee
        doc.setFillColor(32, 55, 100);
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.rect(106, 30, 96, 7, "FD");
        // Place text inside the rectangle
        doc.text("Consignee", 145, 35);
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
      const commonStartY = 43; // Set common starting Y position for both blocks

      // First set of texts (left side)
      const maxWidth1 = 72;
      const startX1 = 7;
      const lineHeight1 = 4.2;
      doc.setFontSize(11);
      const longText1_1 = `${filterData?.data?.data.client_name}(${filterData?.data?.data.client_tax_number})`;
      const longText1_2 = `${filterData?.data?.data?.client_address}`;
      const longText1_3 = `${filterData?.data?.data?.client_email} / ${filterData?.data?.data?.client_phone}`;
      // Render the first block of text
      let currentY1 = commonStartY; // Use the common starting Y position
      currentY1 = renderWrappedText(
        doc,
        longText1_1,
        startX1,
        currentY1,
        maxWidth1,
        lineHeight1
      );
      doc.setFontSize(10);
      currentY1 = renderWrappedText(
        doc,
        longText1_2,
        startX1,
        currentY1,
        maxWidth1,
        lineHeight1
      );
      currentY1 = renderWrappedText(
        doc,
        longText1_3,
        startX1,
        currentY1,
        maxWidth1,
        lineHeight1
      );
      // Reset the starting Y position for the second block (right side) to be the same as the first block
      const maxWidth2 = 72;
      const startX2 = 106;
      let currentY2 = commonStartY; // Use the same starting Y position as the first block

      doc.setFontSize(11);
      const longText2_1 = `${filterData?.data?.data?.consignee_name}(${filterData?.data?.data?.consignee_tax_number})`;
      const longText2_2 = `${filterData?.data?.data?.consignee_address}`;
      const longText2_3 = `${filterData?.data?.data?.consignee_email}/${filterData?.data?.data?.consignee_phone}`;
      // Use the same Y position for all the text in the second block
      currentY2 = renderWrappedText(
        doc,
        longText2_1,
        startX2,
        currentY2,
        maxWidth2,
        lineHeight1
      );
      doc.setFontSize(10);
      currentY2 = renderWrappedText(
        doc,
        longText2_2,
        startX2,
        currentY2,
        maxWidth2,
        lineHeight1
      );
      currentY2 = renderWrappedText(
        doc,
        longText2_3,
        startX2,
        currentY2,
        maxWidth2,
        lineHeight1
      );
      const tableStartY = Math.max(currentY1, currentY2);
      await addLogoWithDetails();
      const includeImage = exchangeRate;
      const imageUrl =
        "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D";
      const imgWidth = 47;
      const imgHeight = 47;
      const rows = invoiceResponse?.data?.quotationDetails.map((item) => ({
        ITF_Name: item.col1,
        ITF_Scientific_name: item.col2,
        ITF_HSCODE: item.col3,
        quotation_price_unit: item.col4,
      }));
      const renderTable = (rowsData, startY) => {
        console.log(startY);
        doc.autoTable({
          head: [["Item", "Scientific Name", "Hs Code", "Price & Unit"]],
          body: rowsData.map((row) => [
            row.ITF_Name,
            row.ITF_Scientific_name,
            row.ITF_HSCODE,
            row.quotation_price_unit,
          ]),
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

      if (messageSet) {
        doc.text("note:", 7, lastY + 5);
        doc.setFont("helvetica", "normal");
        const maxWidth = doc.internal.pageSize.getWidth() - 14; // Total page width minus 7px left & 7px right margin
        const text = messageSet ? messageSet : "";

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
      `${a?.Order_ID || "default"}_Quotation_Test_${dateTime}.pdf`
    );

    setIsLoading(true);
    loadingModal.fire();
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${a?.Order_ID}_Quotation_Test_${dateTime}.pdf`
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
  const columns = useMemo(
    () => [
      {
        Header: "Number",
        accessor: "Quotation_Number",
      },
      {
        Header: "Client Name",
        accessor: "client_name",
      },
      {
        Header: "Destination port ",
        accessor: "port_name",
      },
      {
        Header: "Consignee Name",
        accessor: "consignee_name",
      },
      {
        Header: "Location",
        accessor: "location_name",
      },
      {
        Header: "Load date",
        accessor: "load_Before_date",
        // accessor: (a) => {
        //   return a?.load_Before_date
        //     ? new Date(a?.load_Before_date).toLocaleDateString()
        //     : "NA";
        // },
      },
      // {
      //   Header: "Precooling",
      //   accessor: (a) => (
      //     <label
      //       style={{
      //         display: "flex",
      //         justifyContent: "center",
      //         alignItems: "center",
      //         marginBottom: "10px",
      //       }}
      //       className="toggleSwitch large"
      //       onclick=""
      //     >
      //       <input
      //         onClick={(e) => {
      //           e.stopPropagation();
      //           updateBankStatus(a.ID);
      //         }}
      //         checked={a.Available == "1" ? true : false}
      //         type="checkbox"
      //         style={{
      //           width: "20px",
      //           height: "20px",
      //           cursor: "pointer",
      //         }}
      //       />
      //       <span
      //         style={{
      //           pointerEvents: "none",
      //         }}
      //       >
      //         <span>OFF</span>
      //         <span>ON</span>
      //       </span>
      //       <a></a>
      //     </label>
      //   ),
      // },

      // {
      //   Header: "Status",
      //   accessor: (a) =>
      //     ({
      //       1: "Pending",
      //       2: "Active",
      //       3: "Packed",
      //       4: "Shipped",
      //       5: "Cancelled",
      //       6: "Expired",
      //     }[a.Status] || "Unknown"),
      // },
      {
        Header: "Status",
        accessor: "status_name",
      },
      {
        Header: "Actions",
        accessor: (a) => (
          <div className="editIcon">
            {(+a.Status === 1 ||
              +a.Status === 2 ||
              +a.Status === 6 ||
              (a.Is_quotation === 0 &&
                +a.Status >= 2 &&
                a.Quotation_Number != null &&
                a.Quotation_Number !== "")) && (
              <Link to="/quotation_view_test" state={{ from: { ...a } }}>
                <i className="mdi mdi-eye" />
              </Link>
            )}
            {/* {(+a.Status === 1 || +a.Status === 2) && (
              <Link to="/updateTestQuotation" state={{ from: { ...a } }}>
                <i className="mdi mdi-pencil" />
              </Link>
            )} */}
            {(+a.Status === 1 || +a.Status === 2) &&
              !([2, 3, 4, 5].includes(+a.Status) && +a.Is_quotation === 0) && (
                <Link to="/updateTestQuotation" state={{ from: { ...a } }}>
                  <i className="mdi mdi-pencil" />
                </Link>
              )}

            {(+a.Status === 1 ||
              +a.Status === 2 ||
              +a.Status === 6 ||
              (a.Is_quotation === 0 &&
                +a.Status >= 2 &&
                a.Quotation_Number != null &&
                a.Quotation_Number !== "")) && (
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
            )}
            {(+a.Status === 1 || +a.Status === 2) && (
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
            {(+a.Status === 2 ||
              +a.Status === 6 ||
              (a.Is_quotation === 0 &&
                +a.Status >= 2 &&
                a.Quotation_Number != null &&
                a.Quotation_Number !== "")) && (
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

            {(+a.Status === 2 ||
              (a.Is_quotation === 0 &&
                +a.Status >= 2 &&
                +a.Status < 6 &&
                a.Quotation_Number != null &&
                a.Quotation_Number !== "")) && (
              <button
                type="button"
                onClick={() => quotationConfirmation(a.Order_ID)}
              >
                <i className="mdi mdi-check-circle" />
              </button>
            )}

            {(+a.Status === 1 ||
              +a.Status === 2 ||
              (a.Is_quotation === 0 &&
                +a.Status === 2 &&
                a.Quotation_Number != null &&
                a.Quotation_Number !== "")) &&
              !([2, 3, 4, 5].includes(+a.Status) && +a.Is_quotation === 0) && (
                <button
                  type="button"
                  style={{
                    width: "20px",
                    color: "#203764",
                    fontSize: "22px",
                    marginTop: "10px",
                  }}
                  onClick={() => deleteOrder(a.Order_ID)}
                >
                  <i className="mdi mdi-delete " />
                </button>
              )}
            {+a.Status === 1 && (
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
            {+a.Status == 1 && (
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
          </div>
        ),
      },
    ],
    []
  );
  const clearData = () => {
    setExchangeRate(false);
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
        title="Quotation  Management"
        endElement={
          <button
            type="button"
            onClick={() => navigate("/createTestQuotation")}
            className="btn button btn-info"
          >
            Create
          </button>
        }
      >
        <Box sx={{ minWidth: 120 }} className="selectActive">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
              label="Status"
              onChange={handleChange}
            >
              <MenuItem value="4">All</MenuItem>
              <MenuItem value="0">Active</MenuItem>
              <MenuItem value="1">Used </MenuItem>
              <MenuItem value="2">Expired </MenuItem>
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
                Invoice Modal
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
                      <h6>Do you want image ? </h6>
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
                            <span>No</span>
                            <span> Yes</span>
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
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuotationTest;
