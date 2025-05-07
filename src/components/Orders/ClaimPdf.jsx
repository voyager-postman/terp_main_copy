import React, { useRef } from "react";
import jsPDF from "jspdf";
import { toast } from "react-toastify";

import logo from "../../assets/logoT.jpg";
import "../../components/Orders/order/PdfSec.css";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useId, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../Url/Url";
import { API_IMAGE_URL } from "../../Url/Url";

const ClaimPdf = () => {
  const [companyAddress, setCompanyAddress] = useState("");
  const [data, setData] = useState("");
  const [selectedDeliveryTerm, setSelectedDeliveryTerm] = useState("CIF");
  const [totalDetails, setTotalDetails] = useState("");
  const [headerData, setHeaderData] = useState("");
  const [invoiceData, setInvoiceData] = useState("");
  const [useAgreedPricing, setUseAgreedPricing] = useState(false);
  const [itemDetails, setItemDetails] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(false);
  const [messageSet, setMassageSet] = useState("");
  const [messageSet1, setMassageSet1] = useState("");
  const [cbm, setCbm] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState("Client");
  const [tableData, setTableData] = useState([]);
  const location = useLocation();
  const { from } = location.state || {};
  console.log(from);
  console.log(itemDetails);

  const dynamicMessage = () => {
    axios
      .post(`${API_BASE_URL}/invoice_procedure`, {
        Invoice_id: from?.Invoice_number,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 400) {
          setMassageSet(error.response.data.message);
        }
      });
  };
  const delivery = () => {
    axios
      .post(`${API_BASE_URL}/pdf_delivery_by  `, {
        order_id: from?.order_id,
      })
      .then((response) => {
        console.log(response.status);
        setMassageSet1(response.data.message);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 400) {
          setMassageSet1(error.response.data.message);
        }

        return false;
      });
  };
  const pdfAllData = () => {
    axios
      .post(`${API_BASE_URL}/getClaimDetails`, {
        claim_id: from?.Claim_id,
      })
      .then((response) => {
        console.log(response.data.data);
        setCompanyAddress(response?.data?.Company_Address);
        setData(from);

        setTableData(response?.data?.data);
        setTotalDetails(response?.data?.TotalDetails);
        // setHeaderData(response?.data?.invoice_header);
        // setInvoiceData(response?.data?.invoice_total);
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
  console.log(data);
  useEffect(() => {
    pdfAllData();
    dynamicMessage();
    delivery();
  }, []);
  const handleAgreedPricingChange = (e) => {
    setUseAgreedPricing(e.target.checked);
    console.log(useAgreedPricing);
    pdfAllData();
  };
  const handleAgreedPricingChange1 = (e) => {
    setItemDetails(e.target.checked);
    console.log(itemDetails);
    pdfAllData();
  };
  const handleAgreedPricingChange2 = (e) => {
    setCbm(e.target.checked);
    console.log(cbm);
    pdfAllData();
  };

  const handleAgreedPricingChange3 = (e) => {
    setExchangeRate(e.target.checked);
    console.log(exchangeRate);
    pdfAllData();
  };
  const clearData = () => {
    setUseAgreedPricing(false);
    setItemDetails(false);
    setCbm(true);
    setExchangeRate(false);
    setSelectedInvoice("Client");
  };
  const handleRadioChange = (event) => {
    setSelectedInvoice(event.target.value);
  };
  const generatePdf = async () => {
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
      doc.text(`Claim ${data.Claim_Number}`, 130, 9.5);
      // rect end
      // order part

      // **************************************************
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const maxWidthLeft = 30; // Maximum width in pixels
      let yLeft = 16;
      const yIncrementLeft = 1; // Adjust this value based on your spacing requirements

      const textDataLeft = [
        { label: "Invoice:", value: `${data.Invoice_number}` },
        { label: "TT Ref :", value: `${data.Shipment_ref}` },
        { label: "PO Number :", value: `${data.Client_reference}` },
        { label: "AWB :", value: `${data.awb}` },
      ];

      textDataLeft.forEach((item) => {
        const labelXLeft = 94.5;
        const valueXLeft = 123;

        // Split the value text if it exceeds maxWidth
        const valueLinesLeft = doc.splitTextToSize(item.value, maxWidthLeft);

        // Print the label
        doc.text(item.label, labelXLeft, yLeft);

        // Print the value, split into multiple lines if needed
        valueLinesLeft.forEach((line, index) => {
          doc.text(line, valueXLeft, yLeft + index * 4); // Adjust y position for each line of value
        });

        // Increment y to move to the next section
        yLeft += valueLinesLeft.length * 4 + yIncrementLeft; // Adjust spacing between sections
      });

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
        { label: "Date:", value: `${formatDate(data.created)}` },
        { label: "Ship Date :", value: `${formatDate(data?.Ship_date)}` },
        { label: "Delivery By :", value: `${messageSet1}` },
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
      doc.text("Client", 50, 37.5);
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
      const maxWidth1 = 92;
      const startX1 = 8;
      let startY1 = 45;
      const lineHeight1 = 4.2;
      doc.setFont("Helvetica");
      // doc.setFontSize(11);
      const longText1_1 = `${data.client_name} (${data.client_tax_number})`;
      const longText1_2 = `${data?.client_address}`;
      const longText1_3 = `${data?.client_email} / ${data?.client_phone}`;
      //     const longText1_2 = `${data?.client_address}`;
      // const longText1_3 = `${data?.client_email} / ${data?.client_phone}`;

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
      const maxWidth2 = 92;
      const startX2 = 107;
      let startY2 = 45;
      const lineHeight2 = 4.2;
      const longText2_1 = `${data?.consignee_name}(${data?.consignee_tax_number})`;
      const longText2_2 = `${data?.consignee_address}`;
      const longText2_3 = `${data?.consignee_email}/${data?.consignee_phone}`;
      doc.setFontSize(11);

      startY2 = renderWrappedText2(
        doc,
        longText2_1,
        startX2,
        startY2,
        maxWidth2,
        lineHeight2
      );
      doc.setFontSize(10);

      startY2 = renderWrappedText2(
        doc,
        longText2_2,
        startX2,
        startY2,
        maxWidth2,
        lineHeight2
      );
      startY2 = renderWrappedText2(
        doc,
        longText2_3,
        startX2,
        startY2,
        maxWidth2,
        lineHeight2
      );
    };

    await addLogoWithDetails(); // Wait for logo and details to be added
    let yTop = 68;

    // Sample table data
    const formatterThree = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 3,
    });
    const formatterNo = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    const rows = tableData.map((item, index) => ({
      index: index + 1,
      itf_name_en: item.itf_name_en,
      QTY: item.QTY ? formatterThree.format(item.QTY) : "",
      unit_name_en: item.unit_name_en,
      ITF_name:
        item.QTY && item.Claimed_amount
          ? newFormatter.format(item.Claimed_amount / item.QTY)
          : "",
      Claimed_amount: formatterThree.format(item.Claimed_amount),
    }));

    doc.autoTable({
      head: [["#", "Item Detail", "QTY", "Unit", "Unit Price", "Total"]],
      body: rows.map((row) => [
        row.index,
        row.itf_name_en, // Ensure Thai text displays correctly
        row.QTY,
        row.unit_name_en,
        row.ITF_name,
        row.Claimed_amount,
      ]),
      startY: yTop, // Dynamically set the startY based on the content above the table
      margin: {
        left: 7,
        right: 7,
      },
      columnStyles: {
        0: { halign: "right" },
        1: { halign: "left" },
        2: { halign: "right" },
        3: { halign: "right" },
        4: { halign: "center" },
        5: { halign: "right" },
        6: { halign: "right" },
      },
      tableWidth: "auto",
      headStyles: {
        fillColor: [32, 55, 100], // Set the header background color
        textColor: [255, 255, 255], // Set the header text color
      },
      styles: {
        textColor: (0, 0, 0), // Text color for body cells
        cellWidth: "wrap",
        valign: "middle",
        lineWidth: 0.1,
        lineColor: [32, 55, 100],
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
    yTop = doc.autoTable.previous.finalY + 1;
    const finalY = doc.autoTable.previous.finalY + 4;

    let modalElement = document.getElementById("exampleModalCustomization");
    let modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      setUseAgreedPricing(false);
      setItemDetails(false);
      setCbm(true);
      setExchangeRate(false);
      setSelectedInvoice("Client");
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
    const label = "Total";
    let value = `${newFormatter.format(`${data.Claimed_amount}`)}`;

    value = fitText(value, maxValueWidth); // Ensure value fits within the max width
    const valueWidth = doc.getTextWidth(value);
    const xValue = PAGE_WIDTH - MARGIN - valueWidth; // Position value to the right side of the page
    // Draw label and value
    doc.setFillColor(32, 55, 100);
    doc.rect(xLeft, finalY + 2, 55.5, 0.2, "FD");
    doc.text(label, xLeft, finalY + 1);
    doc.text(value, xValue, finalY + 1);
    const addPageNumbers = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`${i} out  of ${pageCount}`, 185.2, 3.1);
      }
    };

    addPageNumbers(doc);
    const pdfBlob = doc.output("blob");
    console.log(pdfBlob);
    // Upload the PDF to the server
    await uploadPDF(pdfBlob);
  };
  const uploadPDF = async (pdfBlob) => {
    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${from?.Claim_Number || "default"}_Claim_${formatDate(new Date())}.pdf`
    );
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${from?.Claim_Number}_Claim_${formatDate(
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
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
  };
  const newFormatter2 = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
  });
  const formatterNo = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const formatterThree = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 3,
  });
  const newFormatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const newFormatter3 = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 3,
  });
  const handleChange = (event) => {
    setSelectedDeliveryTerm(event.target.value);
  };
  return (
    <div>
      <button type="button" onClick={generatePdf}>
        Generate PDF
      </button>
    </div>
  );
};

export default ClaimPdf;
