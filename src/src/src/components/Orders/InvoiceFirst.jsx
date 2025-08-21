import React, { useRef } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import logo from "../../assets/logoT.jpg";
import "../../components/Orders/order/PdfSec.css";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useId, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../Url/Url";
import { API_IMAGE_URL } from "../../Url/Url";
import RobotoRegular from "../../assets/fonts/Roboto_Regular";
const InvoiceFirst = () => {
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
        Invoice_id: from?.Order_ID,
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
        order_id: from?.Order_ID,
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
  const pdfAllData = () => {
    axios
      .post(`${API_BASE_URL}/InvoicePdfDetails`, {
        order_id: from?.Order_ID,
        invoice_id: from?.Invoice_id,
      })
      .then((response) => {
        console.log(response.data);
        setCompanyAddress(response?.data?.Company_Address);
        setData(from);
        setTableData(response?.data?.InvoiceDetails);
        setTotalDetails(response?.data?.TotalDetails);
        setHeaderData(response?.data?.invoice_header);
        setInvoiceData(response?.data?.invoice_total);
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
      doc.text(`Invoice ${data.Invoice_number}`, 130, 9.5);
      // **************************************************
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const maxWidthLeft = 30; // Maximum width in pixels
      let yLeft = 16;
      const yIncrementLeft = 1; // Adjust this value based on your spacing requirements
      const textDataLeft = [
        { label: "Order :", value: `${data.Order_number}` },
        { label: "TT Ref :", value: `${data.Shipment_ref}` },
        { label: "PO Number", value: `${data.Client_reference}` },
        { label: "AWB :", value: `${headerData?.bl}` },
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
        { label: "Due Date : ", value: "" },
        { label: "Ship Date :", value: `${headerData?.Ship_date}` },
        { label: "Delivery By :", value: `${messageSet1}` },
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
      const dynamicY = Math.min(yLeft, yRight); // Dynamic Y based on the largest y value

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
    const commonStartY = 48;
    const lineHeight = 4.2;
    // Block 1: Left Side
    const maxWidth1 = 72;
    const startX1 = 7;
    const textBlock1 = [
      selectedInvoice === "Consignee"
        ? `${data?.Consignee_name} (${data?.consignee_tax_number})`
        : `${data?.Client_name} (${data?.client_tax_number})`,
      selectedInvoice === "Consignee"
        ? `${data?.consignee_address}`
        : `${data?.client_address}`,
      selectedInvoice === "Consignee"
        ? `${data?.consignee_email}/${data?.consignee_phone}`
        : `${data?.client_email} / ${data?.client_phone}`,
    ];

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
      `${data?.Consignee_name}(${data?.consignee_tax_number})`,
      `${data?.consignee_address}`,
      `${data?.consignee_email}/${data?.consignee_phone}`,
    ];
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
    const rows = !itemDetails
      ? tableData.map((item, index) => ({
          index: index + 1,
          net_weight: formatterThree.format(item.net_weight),
          Number_of_boxes: formatterNo.format(item.Number_of_boxes),
          Packages: formatterNo.format(item.Packages),
          ITF_name: item.ITF_name,
          itf_quantity: formatterThree.format(item.itf_quantity),
          itf_unit_name: item.itf_unit_name,
          Final_Price: useAgreedPricing
            ? item.Price_displaye
            : item.Final_Price,
          Line_Total: useAgreedPricing
            ? newFormatter.format(item.final_Line_Total)
            : newFormatter.format(item.Line_Total),
        }))
      : tableData.map((item, index) => ({
          index: index + 1,
          net_weight: formatterThree.format(item.net_weight),
          Number_of_boxes: formatterNo.format(item.Number_of_boxes),
          Packages: formatterNo.format(item.Packages),
          /*  ITF_name:
      !item.customize_Custom_Name && item.ITF_name
        ? item.ITF_name
        : item.customize_Custom_Name && item.ITF_name
        ? item.ITF_name
        : item.customize_Custom_Name, */
          ITF_name: item.customize_Custom_Name?.trim()
            ? item.customize_Custom_Name
            : item.ITF_name,
          itf_quantity: formatterThree.format(item.itf_quantity),
          itf_unit_name: item.itf_unit_name,
          Final_Price: useAgreedPricing
            ? item.Price_displaye
            : item.Final_Price,
          Line_Total: useAgreedPricing
            ? newFormatter.format(item.final_Line_Total)
            : newFormatter.format(item.Line_Total),
        }));
    const maxRowsPerPageNew = 23; // Maximum number of rows per page
    let remainingRows = [...rows]; // Copy the original rows array
    let tableStartYNew = tableStartY; // Initial Y position for the table
    while (remainingRows.length > 0) {
      // Get the next set of rows to add (up to maxRowsPerPageNew)
      const rowsToAdd = remainingRows.slice(0, maxRowsPerPageNew);
      remainingRows = remainingRows.slice(maxRowsPerPageNew); // Remove the added rows from remaining
      doc.autoTable({
        head: [
          [
            "#",
            "N.W (KG)",
            "Box",
            "Packages",
            "Item Detail",
            "QTY",
            "Unit",
            "Unit Price",
            "Line Total",
          ],
        ],
        body: rowsToAdd.map((row) => [
          row.index,
          row.net_weight, // Ensure Thai text displays correctly
          row.Number_of_boxes,
          row.Packages,
          row.ITF_name,
          row.itf_quantity,
          row.itf_unit_name,
          row.Final_Price,
          row.Line_Total,
        ]),
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

      // Check if there are more rows to be printed and add a new page if necessary
      if (remainingRows.length > 0) {
        doc.addPage(); // Add a new page if there are more rows to display
        tableStartYNew = 5; // Reset Y position to 7 for the new page
      }
    }
    const yTop = doc.autoTable.previous.finalY + 1;
    const finalY = doc.autoTable.previous.finalY + 4;
    doc.text("Total Box : ", 7, finalY + 1);
    doc.text(`${formatterNo.format(totalDetails?.total_box)}`, 38, finalY + 1);
    doc.text("Total Packages :", 7, finalY + 5.5);
    doc.text(`${formatterNo.format(totalDetails?.packages)}`, 38, finalY + 5.5);
    doc.text("Total Items :", 7, finalY + 10);
    doc.text(`${formatterNo.format(totalDetails?.Items)}`, 38, finalY + 10);
    if (exchangeRate) {
      doc.text("Exchange Rate : ", 7, finalY + 14.5);
      doc.text(`${newFormatter.format(data?.fx_rate)}`, 38, finalY + 14.5);
    }
    doc.text(`Total Net Weight : `, 72, finalY + 1);
    doc.text(
      `${formatterThree.format(totalDetails?.Net_Weight)}`,
      110,
      finalY + 1
    );
    if (cbm) {
      doc.text("Total Gross Weight :", 72, finalY + 5.5);
      doc.text(
        `${formatterNo.format(totalDetails?.Gross_weight)}`,
        110,
        finalY + 5.5
      );
      doc.text("Total CBM : ", 72, finalY + 10);
      doc.text(`${totalDetails?.CBM}`, 110, finalY + 10);
    }
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
    let value = useAgreedPricing
      ? `${newFormatter.format(invoiceData)}`
      : `${newFormatter.format(data?.CNF_FX)}`;

    value = fitText(value, maxValueWidth); // Ensure value fits within the max width
    const valueWidth = doc.getTextWidth(value);
    const xValue = PAGE_WIDTH - MARGIN - valueWidth; // Position value to the right side of the page

    // Draw label and value
    doc.setFillColor(32, 55, 100);
    // doc.rect(xLeft, finalY + 2, 55.5, 0.2, "FD");
    doc.text(label, xLeft, finalY + 1);
    doc.text(value, xValue, finalY + 1);
    // Setting the second label and value
    const label1 = "Discount";
    const label2 = "Payable";
    // Handle value1
    let value1 = useAgreedPricing ? "0" : data?.Rounding_FX || "0";
    value1 = fitText(value1, maxValueWidth); // Ensure value fits within the max width
    const valueWidth1 = doc.getTextWidth(value1);
    const xValue1 = PAGE_WIDTH - MARGIN - valueWidth1; // Position value to the right side of the page

    // Draw first label and value
    doc.setFillColor(32, 55, 100);
    // doc.rect(xLeft, finalY + 8, 55.5, 0.2, "FD");
    doc.text(label1, xLeft, finalY + 5);
    doc.text(value1, xValue1, finalY + 5);

    // Handle value2
    let value2 = `${newFormatter.format(
      (useAgreedPricing ? invoiceData : data?.CNF_FX) -
        (useAgreedPricing ? 0 : data?.Rounding_FX || 0)
    )}`;

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
    function drawRoundedRect(doc, x, y, width, height, radius) {
      doc.roundedRect(x, y, width, height, radius, radius); // Using jsPDF method for rounded rectangles
    }
    // Example usage
    const longText = messageSet; // Assume messageSet contains your long text
    const x = 7;
    const initialY = doc.autoTable.previous.finalY + 25; // Adjust initial Y coordinate if needed
    const maxWidth = 180;

    // Add long text with pagination handling and get the final Y position
    const finalY1 = addTextWithPagination(doc, longText, x, initialY, maxWidth);
    const inputFieldValue = from?.NOTES; // Get input field value
    if (inputFieldValue && inputFieldValue.trim() !== "") {
      const inputX = 7; // Adjust as needed
      const inputY = finalY1 + 4; // Adjust as needed
      const inputWidth = 196; // Adjust as needed
      const padding = 3; // Adjust as needed
      const borderRadius = 3; // Adjust border radius as needed
      // Calculate text dimensions
      const textMetrics = doc.getTextWidth(inputFieldValue);
      const inputHeight = textMetrics + padding * 2 - 35; //
      doc.text("note:", inputX + 5, finalY1); // Label position
      drawRoundedRect(
        doc,
        inputX,
        inputY,
        inputWidth,
        inputHeight,
        borderRadius
      );
      doc.text(inputFieldValue, inputX + padding, inputY + padding + 5); // Adjust position for padding
    }

    // note end
    console.log(">>>>>>>>>>>>>>>>>>>>>>");
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
    await uploadPDF(pdfBlob);
  };
  const uploadPDF = async (pdfBlob) => {
    // Generate a unique date-time string
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;

    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${from?.Invoice_Number || "default"}_Invoice_${dateTime}.pdf`
    );

    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${
            from?.Invoice_Number || "default"
          }_Invoice_${dateTime}.pdf`
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
      <button
        data-bs-toggle="modal"
        data-bs-target="#exampleModalCustomization"
      >
        Generate PDF
      </button>
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
                      <h6> Use Agreed pricing ?</h6>
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
                            <span>No</span>
                            <span> Yes</span>
                          </span>
                          <a> </a>
                        </label>
                      </div>
                    </div>

                    <div className="invoiceModal d-flex justify-content-between">
                      <h6>Use custom name? </h6>
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
                            <span>No</span>
                            <span> Yes</span>
                          </span>
                          <a> </a>
                        </label>
                      </div>
                    </div>
                    <div className="invoiceModal d-flex justify-content-between">
                      <h6>Show Gross weight and CBM ? </h6>
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
                            <span>No</span>
                            <span> Yes</span>
                          </span>
                          <a> </a>
                        </label>
                      </div>
                    </div>

                    <div className="invoiceModal">
                      <h6>Invoice Name Can be -</h6>
                      <input
                        type="radio"
                        id="html1"
                        name="fav_language"
                        value="Client"
                        checked={selectedInvoice === "Client"}
                        onChange={handleRadioChange}
                      />
                      <label htmlFor="html1">Client</label>

                      <input
                        type="radio"
                        id="css1"
                        name="fav_language"
                        value="Consignee"
                        checked={selectedInvoice === "Consignee"}
                        onChange={handleRadioChange}
                      />
                      <label htmlFor="css1">Consignee</label>
                    </div>
                    <div className="invoiceModal d-flex justify-content-between">
                      <h6>Show exchange rate ? </h6>
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
                    <div className="invoiceModal">
                      <h6>Delivery Terms - </h6>
                      <input
                        type="radio"
                        id="cif"
                        name="delivery_term"
                        value="CIF"
                        checked={selectedDeliveryTerm === "CIF"}
                        onChange={handleChange}
                      />
                      <label htmlFor="cif">CIF</label>
                      <input
                        type="radio"
                        id="cnf"
                        name="delivery_term"
                        value="CNF"
                        checked={selectedDeliveryTerm === "CNF"}
                        onChange={handleChange}
                      />
                      <label htmlFor="cnf">CNF</label>
                      <input
                        type="radio"
                        id="dap"
                        name="delivery_term"
                        value="DAP"
                        checked={selectedDeliveryTerm === "DAP"}
                        onChange={handleChange}
                      />
                      <label htmlFor="dap">DAP</label>
                      <input
                        type="radio"
                        id="fob"
                        name="delivery_term"
                        value="FOB"
                        checked={selectedDeliveryTerm === "FOB"}
                        onChange={handleChange}
                      />
                      <label htmlFor="fob">FOB</label>
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
  );
};

export default InvoiceFirst;
