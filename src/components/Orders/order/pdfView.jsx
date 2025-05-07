// import { useId } from "react";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import axios from "axios";
import { API_IMAGE_URL } from "../../../Url/Url";
import { API_BASE_URL } from "../../../Url/Url";
import logo from "../../../assets/logoNew.png";
import MySwal from "../../../swal";
import "./PdfSec.css";
import NotoSansThaiRegular from "../../../assets/fonts/NotoSansThai-Regular-normal";
export const OrderPdfView = () => {
  const location = useLocation();
  const [companyAddress, setCompanyAddress] = useState("");
  const [result, setResult] = useState("");
  const [result1, setResult1] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadingModal = MySwal.mixin({
    title: "Loading...",
    didOpen: () => {
      MySwal.showLoading();
    },
    showCancelButton: false,
    showConfirmButton: false,
    allowOutsideClick: false,
  });
  const [messageSet1, setMassageSet1] = useState("");

  const [data, setData] = useState("");
  const [totalDetails, setTotalDetails] = useState("");
  const [tableData, setTableData] = useState([]);
  const { from } = location.state || {};
  console.log(from);
  console.log("hello this is new");
  console.log(from.Order_ID);
  const pdfAllData = () => {
    axios
      .post(`${API_BASE_URL}/OrderPdfDetails`, {
        order_id: from?.Order_ID,
      })
      .then((response) => {
        console.log(response.data);
        setCompanyAddress(response?.data?.Company_Address);
        setData(response?.data?.data);

        setTableData(response?.data?.data);
        setTotalDetails(response?.data?.totalDetails);
        setResult(response?.data?.result);
        setResult1(response?.data?.orderDetails);
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

  console.log(from);

  const delivery = () => {
    axios
      .post(`${API_BASE_URL}/pdf_delivery_by`, {
        order_id: from?.Order_ID,
      })
      .then((response) => {
        console.log(response.status);
        if (response.data.success === true) {
          setMassageSet1(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 400) {
          setMassageSet1(error.response.data.message);
        }
        return false;
      });
  };

  useEffect(() => {
    pdfAllData();
    delivery();
  }, []);
  const generatePdf = async () => {
    const doc = new jsPDF();
    doc.addFileToVFS("NotoSansThai-Regular.ttf", NotoSansThaiRegular); // NotoSansThaiRegular is the variable exported from the .js file
    doc.addFont("NotoSansThai-Regular.ttf", "NotoSansThai", "normal");

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
      doc.text(`${companyAddress.Line_1}`, 30, 8);
      doc.setTextColor(0, 0, 0);
      doc.text(`${companyAddress.Line_2}`, 30, 12);
      const longTextOne = `${companyAddress.Line_3}`;
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
      doc.setFont("NotoSansThai");
      //       doc.setFont("ThaiFont");
      // Place text inside the rectangle
      doc.text("Order/Load", 130, 9.5);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const maxWidthLeft = 30; // Maximum width in pixels
      let yLeft = 16;
      const yIncrementLeft = 1; // Adjust this value based on your spacing requirements

      const textDataLeft = [
        { label: "Order :", value: `${from?.Order_Number}` },
        { label: "TT Ref :", value: `${from.Shipment_ref}` },
        { label: " PO Number :", value: "" },
        { label: "AWB :", value: `${result?.bl ? result?.bl : ""}` },
      ];

      textDataLeft.forEach((item) => {
        const labelXLeft = 95;
        const valueXLeft = 123;
        const valueLinesLeft = doc.splitTextToSize(item.value, maxWidthLeft);
        doc.text(item.label, labelXLeft, yLeft);
        valueLinesLeft.forEach((line, index) => {
          doc.text(line, valueXLeft, yLeft + index * 4); // Adjust y position for each line of value
        });
        yLeft += valueLinesLeft.length * 4 + yIncrementLeft; // Adjust spacing between sections
      });
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
        { label: "Date:", value: `${formatDate(from.created)}` },
        { label: "Due Date : ", value: "" },
        {
          label: "Ship Date :",
          value: `${result1[0]?.Ship_date ? result1[0]?.Ship_date : ""}`,
        },
        { label: "Delivery By :", value: `${messageSet1 ? messageSet1 : ""}` },
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
    };
    await addLogoWithDetails(); // Wait for logo and details to be added
    let yTop = 33;
    // Sample table data
    const headers = [
      [
        {
          content: "Product details",
          colSpan: 4,
          rowSpan: 1,
          styles: { halign: "center" },
        },
        {
          content: "Order",
          colSpan: 3,
          rowSpan: 1,
          styles: { halign: "center" },
        },
        {
          content: "Load",
          colSpan: 1,
          rowSpan: 2,
          styles: { halign: "center" },
        },
      ],
      [
        { content: "Packing", styles: { halign: "center" } },
        { content: "Boxes", styles: { halign: "center" } },
        { content: "Brand	", styles: { halign: "center" } },
        { content: "ITF", styles: { halign: "center" } },
        { content: "EAN", styles: { halign: "center" } },
        { content: " Net Weight	", styles: { halign: "center" } },
        { content: "BOXES" },
        { content: "empty1", styles: { halign: "center" } },
      ],
    ];
    const rows = tableData.map((item, index) => ({
      index: item.Packaging,
      itf_th: item.Boxes1,
      HS_CODE: item.Brand,
      Net_Weight: item.itf,
      unit: formatterThree.format(item.ean_weight),
      Boxes: formatterThree.format(item.Net_Weight),
      FOB: formatterNo.format(item.Boxes2),
    }));

    // Adding the table to the PDF
    doc.autoTable({
      head: headers,
      body: rows.map((row) => [
        {
          content: row.index ? row.index : "",
          styles: { font: "NotoSansThai", fontSize: 10 },
        },
        {
          content: row.itf_th ? row.itf_th : "",
          styles: { font: "NotoSansThai", fontSize: 10 },
        },
        row.HS_CODE,
        row.Net_Weight,
        row.unit,
        row.Boxes,
        row.FOB,
      ]),
      startY: yTop,
      theme: "grid",
      headStyles: {
        fillColor: [32, 55, 100], // Set the header background color
        textColor: [255, 255, 255], // Set the header text color
        halign: "center",
      },
      styles: {
        textColor: (0, 0, 0), // Text color for body cells
        // cellWidth: "wrap",
        valign: "middle",
        lineWidth: 0.01, // Adjust the border width
        lineColor: [26, 35, 126], // Border color
      },
      margin: {
        left: 7,
        right: 7,
      },
      tableWidth: "auto",
      columnStyles: {
        6: { halign: "center" },
        5: { halign: "right" },
      },
      headStyles: {
        fillColor: [32, 55, 100], // Set the header background color
        textColor: [255, 255, 255], // Set the header text color
      },
    });
    yTop = doc.autoTable.previous.finalY + 1;
    const finalY = doc.autoTable.previous.finalY + 4;
    //note end
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
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;
    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${from?.Order_Number || "default"}_Operation_${dateTime}.pdf`
    );
    setIsLoading(true);
    loadingModal.fire();
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${from?.Order_Number}_Operation_${dateTime}.pdf`
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
    maximumFractionDigits: 3,
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

  return (
    <div>
      <button onClick={generatePdf}>Generate PDF</button>
    </div>
  );
};
