// import React from "react";
// import { useQuery } from "react-query";
// import { Link, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { API_BASE_URL } from "../../Url/Url";
// import { Card } from "../../card";
// import { TableView } from "../table";
// import MySwal from "../../swal";
// import { toast } from "react-toastify";

// const Claim = () => {
//   const navigate = useNavigate();

//   const [data, setData] = useState([]);

//   const listClaim = () => {
//     axios.get(`${API_BASE_URL}/getClaim`).then((res) => {
//       setData(res.data.data || []);
//     });
//   };
//   useEffect(() => {
//     listClaim();
//   }, []);
//   // const { data } = useQuery("getViewToReceving");
//   console.log(data);
//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
//     const day = String(date.getDate()).padStart(2, "0");
//     return `${year}/${month}/${day}`;
//   };
//   const deleteOrder = (id) => {
//     console.log(id);
//     MySwal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Delete",
//     }).then(async (result) => {
//       console.log(result);
//       if (result.isConfirmed) {
//         try {
//           const response = await axios.post(`${API_BASE_URL}/DeleteClaim`, {
//             claim_id: id,
//           });
//           console.log(response);
//           listClaim();
//           toast.success(response.data.messageEN);
//           toast.success(response.data.messageTH);
//         } catch (e) {
//           toast.error("Something went wrong");
//         }
//       }
//     });
//   };
//   const columns = React.useMemo(
//     () => [
//       {
//         Header: "Claim Date",
//         accessor: "Claim_date",
//         Cell: ({ value }) => formatDate(value), // Use the formatting function here
//       },
//       {
//         Header: "Claim Number",
//         accessor: "Claim_Number",
//       },
//       {
//         Header: "Client",
//         accessor: "client_name",
//       },

//       {
//         Header: "Consignee",
//         accessor: "consignee_name",
//       },
//       {
//         Header: "Invoice",
//         accessor: "Invoice_number",
//       },
//       {
//         Header: "Claimed Amount",
//         accessor: "Claimed_amount",
//       },
//       {
//         Header: "Currency",
//         accessor: "fx_currency",
//       },
//       {
//         Header: "THB Claim",
//         accessor: "THB_Claim",
//       },
//       {
//         Header: "Actions",
//         accessor: (a) => (
//           <>
//             <Link
//               className="SvgAnchor"
//               to="/claimPdf"
//               state={{ from: { ...a } }}
//             >
//               <svg
//                 className="SvgQuo"
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 24 24"
//               >
//                 <title>invoice-text-check-outline</title>
//                 <path d="M12 20L13.3 20.86C13.1 20.28 13 19.65 13 19C13 18.76 13 18.5 13.04 18.29L12 17.6L9 19.6L6 17.6L5 18.26V5H19V13C19.7 13 20.37 13.12 21 13.34V3H3V22L6 20L9 22L12 20M17 9V7H7V9H17M15 13V11H7V13H15M15.5 19L18.25 22L23 17.23L21.84 15.82L18.25 19.41L16.66 17.82L15.5 19Z"></path>
//               </svg>
//             </Link>
//             <button type="button" onClick={() => deleteOrder(a.Claim_id)}>
//               <i
//                 className="mdi mdi-delete "
//                 style={{
//                   width: "20px",
//                   color: "#203764",
//                   fontSize: "22px",
//                   marginTop: "10px",
//                 }}
//               />
//             </button>
//           </>
//         ),
//       },
//     ],
//     []
//   );
//   return (
//     <Card title="Claim">
//       <TableView columns={columns} data={data} />
//     </Card>
//   );
// };

// export default Claim;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import MySwal from "../../swal";
import { API_BASE_URL } from "../../Url/Url";
import { API_IMAGE_URL } from "../../Url/Url";
import jsPDF from "jspdf";
import logo from "../../assets/logoT.jpg";

import { Card } from "../../card";
import { TableView } from "../table";
import { useTranslation } from "react-i18next";

const Claim = () => {
  const { t } = useTranslation("global");
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filterData1, setFilterData1] = useState("");

  const [itemDetails, setItemDetails] = useState(false);
  const handleAgreedPricingChange1 = (e) => {
    setItemDetails(e.target.checked);
    console.log(itemDetails);
    // pdfAllData();
  };
  const [selectedInvoice, setSelectedInvoice] = useState("Client");
  const handleRadioChange = (event) => {
    setSelectedInvoice(event.target.value);
  };
  const clearData = () => {
    setItemDetails(false);

    setSelectedInvoice("Client");
  };
  const generatePdf = async () => {
    const isConsignee = selectedInvoice === "Consignee" ? 1 : 0;
    const invoiceResponse = await axios.post(`${API_BASE_URL}/claimPdf`, {
      claim_id: filterData1,
      CustomName: itemDetails ? 1 : 0,
      InvoiceName: isConsignee,
    });
    console.log(invoiceResponse);

    const headers = invoiceResponse?.data?.tableHeaders || {};
    const rowsData = invoiceResponse?.data?.tableRow1 || [];
    const head = [Object.values(headers)];
    const body = rowsData.map((row) => {
      const sortedKeys = Object.keys(row)
        .filter((key) => key.startsWith("Col")) // Fix here
        .sort(
          (a, b) => Number(a.replace("Col", "")) - Number(b.replace("Col", ""))
        );
      return sortedKeys.map((key) => row[key]);
    });
    console.log(body);
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
      doc.text(`${invoiceResponse?.data?.Company_Address?.Line_1}`, 30, 8);
      doc.setTextColor(0, 0, 0);
      doc.text(`${invoiceResponse?.data?.Company_Address?.Line_2}`, 30, 12);
      const longTextOne = `${invoiceResponse?.data?.Company_Address?.Line_3}`;
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
      doc.text(
        `${invoiceResponse?.data?.claimHeader['Concat("Claim : ",Claim.Claim_Number)']}`,
        130,
        9.5
      );
      // rect end
      // order part

      // **************************************************
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const maxWidthLeft = 30; // Maximum width in pixels
      let yLeft = 16;
      const yIncrementLeft = 1; // Adjust this value based on your spacing requirements

      const textDataLeft = [
        {
          label: invoiceResponse?.data?.claimMetaLabels?.Row1,
          value: `${invoiceResponse?.data?.claimMetaValues.Row1 || ""}`,
        },
        {
          label: invoiceResponse?.data?.claimMetaLabels?.Row2,
          value: `${invoiceResponse?.data?.claimMetaValues.Row2 || ""}`,
        },
        {
          label: invoiceResponse?.data?.claimMetaLabels?.Row3,
          value: `${invoiceResponse?.data?.claimMetaValues.Row3 || ""}`,
        },
        {
          label: invoiceResponse?.data?.AWBLabel?.AWB,
          value: `${invoiceResponse?.data?.AWBInfo.AWB || ""}`,
        },
      ];

      textDataLeft.forEach((item) => {
        const isAWB = item.label?.toLowerCase().includes("awb"); // ✅ updated

        const labelXLeft = isAWB ? 94.5 : 95;
        const valueXLeft = 119;
        const adjustedMaxWidth = isAWB ? 83 : maxWidthLeft; // ✅ set to 83

        const valueLinesLeft = doc.splitTextToSize(
          item.value,
          adjustedMaxWidth
        );

        doc.text(item.label, labelXLeft, yLeft);

        valueLinesLeft.forEach((line, index) => {
          doc.text(line, valueXLeft, yLeft + index * 4);
        });

        yLeft += valueLinesLeft.length * 4 + yIncrementLeft;
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
        {
          label: invoiceResponse?.data?.dateLabels?.Row1,
          value: `${formatDate(invoiceResponse?.data?.dateValues.Row1) || ""}`,
        },
        {
          label: invoiceResponse?.data?.dateLabels?.Row2,
          value: `${formatDate(invoiceResponse?.data?.dateValues.Row2) || ""}`,
        },
        {
          label: invoiceResponse?.data?.dateLabels?.Row3,
          value: `${invoiceResponse?.data?.dateValues.Row3 || ""}`,
        },
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
    };
    doc.setFont("Helvetica");
    doc.setFontSize(11);

    // 🔁 Reusable function for rendering wrapped text
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

    // 🧾 Client (left block)
    const maxWidth1 = 92;
    const startX1 = 8;
    let currentY1 = 45;
    const lineHeight = 4.2;

    const textBlock1 = [
      invoiceResponse.data?.client_address.client_name,
      invoiceResponse.data?.client_address.client_tax_number,
      invoiceResponse.data?.client_address.Address1,
      invoiceResponse.data?.client_address.Address2,
      invoiceResponse.data?.client_address.Address3,
      invoiceResponse.data?.client_address.Address4,
      invoiceResponse.data?.client_address.client_phone,
    ].filter((text) => text && text.toString().trim() !== "");

    textBlock1.forEach((text, index) => {
      if (index === 1) doc.setFontSize(10); // Decrease font size after first line
      currentY1 = renderWrappedText(
        doc,
        text,
        startX1,
        currentY1,
        maxWidth1,
        lineHeight
      );
    });

    // 🧾 Consignee (right block)
    const maxWidth2 = 92;
    const startX2 = 107;
    let currentY2 = 45;

    const textBlock2 = [
      invoiceResponse.data?.consignee_address.consignee_name,
      invoiceResponse.data?.consignee_address.consignee_tax_number,
      invoiceResponse.data?.consignee_address.Address1,
      invoiceResponse.data?.consignee_address.Address2,
      invoiceResponse.data?.consignee_address.Address3,
      invoiceResponse.data?.consignee_address.Address4,
      invoiceResponse.data?.consignee_address.consignee_email,
    ].filter((text) => text && text.toString().trim() !== "");

    doc.setFontSize(11);
    textBlock2.forEach((text, index) => {
      if (index === 1) doc.setFontSize(10); // Decrease font size after first line
      currentY2 = renderWrappedText(
        doc,
        text,
        startX2,
        currentY2,
        maxWidth2,
        lineHeight
      );
    });

    let nextY = Math.max(currentY1, currentY2); // Add some spacing
    await addLogoWithDetails(); // Wait for logo and details to be added
    doc.autoTable({
      head,
      // body: rows.map((row) => columns.map((col) => row[col.dataKey])),
      body,
      startY: nextY, // Dynamically set the startY based on the content above the table
      margin: {
        left: 7,
        right: 7,
      },
      columnStyles: {
        0: { halign: "right" },
        1: { halign: "left" },
        2: { halign: "right" },
        3: { halign: "center" },
        4: { halign: "center" },

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
    nextY = doc.autoTable.previous.finalY + 1;
    const finalY = doc.autoTable.previous.finalY + 4;

    let modalElement = document.getElementById("exampleModalCustomization");
    let modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      setItemDetails(false);
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
    const label =
      invoiceResponse.data?.summaryLabels['CONCAT("Total (",@FXName,")")'];
    let value =
      invoiceResponse.data?.summaryValues[
      'CONCAT(Format(Claim.Claim_FX,2)," (",@FXName,")")'
      ];

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
  // const generatePdf = async () => {
  //   const isConsignee = selectedInvoice === "Consignee" ? 1 : 0;
  //   const invoiceResponse = await axios.post(`${API_BASE_URL}/claimPdf`, {
  //     claim_id: filterData1,
  //     CustomName: itemDetails ? 1 : 0,
  //     InvoiceName: isConsignee,
  //   });
  //   console.log(invoiceResponse);

  //   const headers = invoiceResponse?.data?.tableHeaders || {};
  //   const rowsData = invoiceResponse?.data?.tableRow1 || [];
  //   const head = [Object.values(headers)];
  //   const body = rowsData.map((row) => {
  //     const sortedKeys = Object.keys(row)
  //       .filter((key) => key.startsWith("Col")) // Fix here
  //       .sort(
  //         (a, b) => Number(a.replace("Col", "")) - Number(b.replace("Col", ""))
  //       );
  //     return sortedKeys.map((key) => row[key]);
  //   });
  //   console.log(body);
  //   const doc = new jsPDF();
  //   // Convert image to base64
  //   const convertImageToBase64 = (url) => {
  //     return new Promise((resolve, reject) => {
  //       const img = new Image();
  //       img.crossOrigin = "Anonymous";
  //       img.src = url;
  //       img.onload = () => {
  //         const canvas = document.createElement("canvas");
  //         canvas.width = img.width;
  //         canvas.height = img.height;
  //         const ctx = canvas.getContext("2d");
  //         ctx.drawImage(img, 0, 0);
  //         const dataURL = canvas.toDataURL("image/png");
  //         resolve(dataURL);
  //       };
  //       img.onerror = (error) => reject(error);
  //     });
  //   };

  //   // Add a logo with Proforma Address and Proforma Invoice
  //   const addLogoWithDetails = async () => {
  //     const logoData = await convertImageToBase64(logo);
  //     doc.addImage(logoData, "PNG", 6, 3, 20, 20); // Adjust the position and size as needed
  //     // logo end
  //     doc.setFontSize(10);
  //     doc.setTextColor(0, 0, 0);
  //     doc.text(`${invoiceResponse?.data?.Company_Address?.Line_1}`, 30, 8);
  //     doc.setTextColor(0, 0, 0);
  //     doc.text(`${invoiceResponse?.data?.Company_Address?.Line_2}`, 30, 12);
  //     const longTextOne = `${invoiceResponse?.data?.Company_Address?.Line_3}`;
  //     const maxWidthOne = 59;
  //     const linesOne = doc.splitTextToSize(longTextOne, maxWidthOne);
  //     let startXOne = 30;
  //     let startYOne = 16;
  //     linesOne.forEach((lineOne, index) => {
  //       doc.text(lineOne, startXOne, startYOne + index * 4.2); // Adjust the line height (10) as needed
  //     });
  //     // end company
  //     doc.setFillColor(32, 55, 100);
  //     doc.setFontSize(12);
  //     doc.setTextColor(255, 255, 255);
  //     doc.rect(95, 5, 107, 7, "FD");
  //     // Place text inside the rectangle
  //     doc.text(
  //       `${invoiceResponse?.data?.claimHeader['Concat("Claim : ",Claim.Claim_Number)']}`,
  //       130,
  //       9.5
  //     );
  //     // rect end
  //     // order part

  //     // **************************************************
  //     doc.setFontSize(10);
  //     doc.setTextColor(0, 0, 0);
  //     const maxWidthLeft = 30; // Maximum width in pixels
  //     let yLeft = 16;
  //     const yIncrementLeft = 1; // Adjust this value based on your spacing requirements

  //     const textDataLeft = [
  //       {
  //         label: invoiceResponse?.data?.claimMetaLabels?.Row1,
  //         value: `${invoiceResponse?.data?.claimMetaValues.Row1 || ""}`,
  //       },
  //       {
  //         label: invoiceResponse?.data?.claimMetaLabels?.Row2,
  //         value: `${invoiceResponse?.data?.claimMetaValues.Row2 || ""}`,
  //       },
  //       {
  //         label: invoiceResponse?.data?.claimMetaLabels?.Row3,
  //         value: `${invoiceResponse?.data?.claimMetaValues.Row3 || ""}`,
  //       },
  //       {
  //         label: invoiceResponse?.data?.AWBLabel?.AWB,
  //         value: `${invoiceResponse?.data?.AWBInfo.AWB || ""}`,
  //       },
  //     ];

  //     textDataLeft.forEach((item) => {
  //       const isAWB = item.label?.toLowerCase().includes("awb"); // ✅ updated

  //       const labelXLeft = isAWB ? 94.5 : 95;
  //       const valueXLeft = 119;
  //       const adjustedMaxWidth = isAWB ? 83 : maxWidthLeft; // ✅ set to 83

  //       const valueLinesLeft = doc.splitTextToSize(
  //         item.value,
  //         adjustedMaxWidth
  //       );

  //       doc.text(item.label, labelXLeft, yLeft);

  //       valueLinesLeft.forEach((line, index) => {
  //         doc.text(line, valueXLeft, yLeft + index * 4);
  //       });

  //       yLeft += valueLinesLeft.length * 4 + yIncrementLeft;
  //     });
  //     // Second part (right side)
  //     doc.setFontSize(10);
  //     doc.setTextColor(0, 0, 0);
  //     const maxWidthRight = 32; // Maximum width in pixels
  //     let yRight = 16;
  //     const yIncrementRight = 1; // Adjust this value based on your spacing requirements
  //     function formatDate(dateString) {
  //       const date = new Date(dateString);
  //       const day = date.getDate();
  //       const month = date.getMonth() + 1;
  //       const year = date.getFullYear();

  //       // Add leading zeros if needed
  //       const formattedDay = day < 10 ? `0${day}` : day;
  //       const formattedMonth = month < 10 ? `0${month}` : month;

  //       return `${formattedDay}-${formattedMonth}-${year}`;
  //     }
  //     const textDataRight = [
  //       {
  //         label: invoiceResponse?.data?.dateLabels?.Row1,
  //         value: `${formatDate(invoiceResponse?.data?.dateValues.Row1) || ""}`,
  //       },
  //       {
  //         label: invoiceResponse?.data?.dateLabels?.Row2,
  //         value: `${formatDate(invoiceResponse?.data?.dateValues.Row2) || ""}`,
  //       },
  //       {
  //         label: invoiceResponse?.data?.dateLabels?.Row3,
  //         value: `${invoiceResponse?.data?.dateValues.Row3 || ""}`,
  //       },
  //     ];

  //     textDataRight.forEach((item) => {
  //       const labelXRight = 155;
  //       const valueXRight = 175;
  //       // Split the value text if it exceeds maxWidth
  //       const valueLinesRight = doc.splitTextToSize(item.value, maxWidthRight);
  //       // Print the label
  //       doc.text(item.label, labelXRight, yRight);
  //       valueLinesRight.forEach((line, index) => {
  //         doc.text(line, valueXRight, yRight + index * 4);
  //       });
  //       yRight += valueLinesRight.length * 4 + yIncrementRight;
  //     });
  //     // **********************************************
  //     // client
  //     doc.setFillColor(32, 55, 100);
  //     doc.setFontSize(12);
  //     doc.setTextColor(255, 255, 255);
  //     doc.rect(7, 33, 96, 7, "FD");
  //     // doc.setFont('Helvetica');
  //     doc.text("Client", 50, 37.5);
  //     // consignee
  //     doc.setFillColor(32, 55, 100);
  //     doc.setFontSize(12);
  //     doc.setTextColor(255, 255, 255);
  //     doc.rect(106, 33, 96, 7, "FD");
  //     // Place text inside the rectangle
  //     doc.text("Consignee", 145, 37.5);
  //     // client under text
  //     doc.setFontSize(11);
  //     doc.setTextColor(0, 0, 0);
  //     function renderWrappedText1(
  //       doc,
  //       text,
  //       startX,
  //       startY,
  //       maxWidth,
  //       lineHeight
  //     ) {
  //       const lines = doc.splitTextToSize(text, maxWidth);
  //       lines.forEach((line, index) => {
  //         doc.text(line, startX, startY + index * lineHeight);
  //       });
  //       return startY + lines.length * lineHeight; // Return the new Y position after rendering the text
  //     }

  //     function renderWrappedText2(
  //       doc,
  //       text,
  //       startX,
  //       startY,
  //       maxWidth,
  //       lineHeight
  //     ) {
  //       const lines = doc.splitTextToSize(text, maxWidth);
  //       lines.forEach((line, index) => {
  //         doc.text(line, startX, startY + index * lineHeight);
  //       });
  //       return startY + lines.length * lineHeight; // Return the new Y position after rendering the text
  //     }
  //     // First set of texts
  //     const maxWidth1 = 92;
  //     const startX1 = 8;
  //     let currentY1 = 45;
  //     const lineHeight1 = 4.2;
  //     doc.setFont("Helvetica");
  //     // doc.setFontSize(11);
  //     const textBlock1 = [
  //       invoiceResponse.data?.client_address.client_name,
  //       invoiceResponse.data?.client_address.client_tax_number,
  //       invoiceResponse.data?.client_address.Address1,
  //       invoiceResponse.data?.client_address.Address2,
  //       invoiceResponse.data?.client_address.Address3,
  //       invoiceResponse.data?.client_address.Address4,
  //       invoiceResponse.data?.client_address.client_phone,
  //     ].filter((text) => text && text.toString().trim() !== "");
  //     textBlock1.forEach((text, index) => {
  //       currentY1 = renderWrappedText1(
  //         doc,
  //         text,
  //         startX1,
  //         currentY1,
  //         maxWidth1,
  //         lineHeight1
  //       );
  //       if (index === 0) doc.setFontSize(10); // Adjust font size after the first text
  //     });

  //     const maxWidth2 = 92;
  //     const startX2 = 107;
  //     let currentY2 = 45;
  //     const lineHeight2 = 4.2;
  //     const textBlock2 = [
  //       invoiceResponse.data?.consignee_address.consignee_name,
  //       invoiceResponse.data?.consignee_address.consignee_tax_number,
  //       invoiceResponse.data?.consignee_address.Address1,
  //       invoiceResponse.data?.consignee_address.Address2,
  //       invoiceResponse.data?.consignee_address.Address3,
  //       invoiceResponse.data?.consignee_address.Address4,
  //       invoiceResponse.data?.consignee_address.consignee_email,
  //     ].filter((text) => text && text.toString().trim() !== "");
  //     doc.setFontSize(11);
  //     textBlock2.forEach((text, index) => {
  //       currentY2 = renderWrappedText2(
  //         doc,
  //         text,
  //         startX2,
  //         currentY2,
  //         maxWidth2,
  //         lineHeight2
  //       );
  //       if (index === 0) doc.setFontSize(10);
  //     });
  //   };

  //   await addLogoWithDetails(); // Wait for logo and details to be added
  //   let yTop = 74;

  //   doc.autoTable({
  //     head,
  //     // body: rows.map((row) => columns.map((col) => row[col.dataKey])),
  //     body,
  //     startY: yTop, // Dynamically set the startY based on the content above the table
  //     margin: {
  //       left: 7,
  //       right: 7,
  //     },
  //     columnStyles: {
  //       0: { halign: "right" },
  //       1: { halign: "left" },
  //       2: { halign: "right" },
  //       3: { halign: "right" },
  //       4: { halign: "center" },
  //       5: { halign: "right" },
  //       6: { halign: "right" },
  //     },
  //     tableWidth: "auto",
  //     headStyles: {
  //       fillColor: [32, 55, 100], // Set the header background color
  //       textColor: [255, 255, 255], // Set the header text color
  //     },
  //     styles: {
  //       textColor: (0, 0, 0), // Text color for body cells
  //       cellWidth: "wrap",
  //       valign: "middle",
  //       lineWidth: 0.1,
  //       lineColor: [32, 55, 100],
  //     },
  //     didParseCell: function (data) {
  //       if (data.section === "body") {
  //         // Apply alternate row coloring
  //         const rowIndex = data.row.index;
  //         if (rowIndex % 2 === 0) {
  //           data.cell.styles.fillColor = [250, 248, 248]; // Light gray for even rows
  //         } else {
  //           data.cell.styles.fillColor = [255, 255, 255]; // White for odd rows
  //         }
  //       }
  //     },
  //   });
  //   yTop = doc.autoTable.previous.finalY + 1;
  //   const finalY = doc.autoTable.previous.finalY + 4;

  //   let modalElement = document.getElementById("exampleModalCustomization");
  //   let modalInstance = bootstrap.Modal.getInstance(modalElement);
  //   if (modalInstance) {
  //     setItemDetails(false);
  //     setSelectedInvoice("Client");
  //     modalInstance.hide();
  //   }
  //   // total part

  //   const MARGIN = 6.8;
  //   const PAGE_WIDTH = doc.internal.pageSize.getWidth();
  //   const xLeft = 147; // Position from the left
  //   const maxValueWidth = 50; // Maximum width for the value

  //   // Helper function to truncate text if it exceeds the max width
  //   function fitText(value, maxWidth) {
  //     let truncatedValue = value;
  //     while (doc.getTextWidth(truncatedValue) > maxWidth) {
  //       truncatedValue = truncatedValue.slice(0, -1); // Remove last character
  //     }
  //     return truncatedValue;
  //   }

  //   // Setting the first label and value
  //   doc.setTextColor(0, 0, 0);
  //   const label =
  //     invoiceResponse.data?.summaryLabels['CONCAT("Total (",@FXName,")")'];
  //   let value =
  //     invoiceResponse.data?.summaryValues[
  //       'CONCAT(Format(Claim.Claim_FX,2)," (",@FXName,")")'
  //     ];

  //   value = fitText(value, maxValueWidth); // Ensure value fits within the max width
  //   const valueWidth = doc.getTextWidth(value);
  //   const xValue = PAGE_WIDTH - MARGIN - valueWidth; // Position value to the right side of the page
  //   // Draw label and value
  //   doc.setFillColor(32, 55, 100);
  //   doc.rect(xLeft, finalY + 2, 55.5, 0.2, "FD");
  //   doc.text(label, xLeft, finalY + 1);
  //   doc.text(value, xValue, finalY + 1);
  //   const addPageNumbers = (doc) => {
  //     const pageCount = doc.internal.getNumberOfPages();
  //     for (let i = 1; i <= pageCount; i++) {
  //       doc.setPage(i);
  //       doc.text(`${i} out  of ${pageCount}`, 185.2, 3.1);
  //     }
  //   };

  //   addPageNumbers(doc);
  //   const pdfBlob = doc.output("blob");
  //   console.log(pdfBlob);
  //   // Upload the PDF to the server
  //   await uploadPDF(pdfBlob);
  // };
  const uploadPDF = async (pdfBlob) => {
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;
    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${filterData1 || "default"}_Claim_${dateTime}.pdf`
    );
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(`${API_IMAGE_URL}${filterData1}_Claim_${dateTime}.pdf`);
      } else {
        console.log("Failed to upload PDF");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    return isNaN(date) ? value : date.toLocaleDateString("en-CA");
  };

  const listClaim = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/getClaim`);
      const responseData = res.data.data || [];
      const headers = res.data.head || {};

      // Step 1: Generate column keys in the correct order: Col1, Col2, ...
      const dynamicColumns = Object.keys(headers).map((label, index) => {
        const colKey = `Col${index + 1}`; // e.g., Col1, Col2...

        return {
          Header: headers[label], // visible label like "Date"
          accessor: colKey,
          Cell: ({ value }) => {
            if (label.toLowerCase().includes("date")) {
              return formatDate(value);
            }
            return value || "-";
          },
        };
      });

      // Step 2: Add actions column
      dynamicColumns.push({
        Header:  t("actions"),
        accessor: "actions",
        Cell: ({ row }) => {
          const rowData = row.original;
          return (
            <>
              <button
                type="button"
                data-bs-toggle="modal"
                onClick={() => setFilterData1(rowData.ID)}
                data-bs-target="#exampleModalCustomization"
              >
                <svg
                  className="SvgQuo"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <title>invoice-text-check-outline</title>
                  <path d="M12 20L13.3 20.86C13.1 20.28 13 19.65 13 19C13 18.76 13 18.5 13.04 18.29L12 17.6L9 19.6L6 17.6L5 18.26V5H19V13C19.7 13 20.37 13.12 21 13.34V3H3V22L6 20L9 22L12 20M17 9V7H7V9H17M15 13V11H7V13H15M15.5 19L18.25 22L23 17.23L21.84 15.82L18.25 19.41L16.66 17.82L15.5 19Z" />
                </svg>
              </button>
              <button type="button" onClick={() => deleteOrder(rowData.ID)}>
                <i
                  className="mdi mdi-delete"
                  style={{
                    width: "20px",
                    color: "#203764",
                    fontSize: "22px",
                    marginTop: "10px",
                  }}
                />
              </button>
            </>
          );
        },
      });

      setData(responseData);
      setColumns(dynamicColumns);
    } catch (error) {
      toast.error("Failed to fetch claims");
    }
  };

  const deleteOrder = async (id) => {
    if (!id) return;
    const result = await MySwal.fire({
      title: t("areYouSure"),
      text: t("irreversible"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(`${API_BASE_URL}/DeleteClaim`, {
          claim_id: id,
        });
        toast.success(response.data.message);
        // toast.success(response.data.messageTH);
        listClaim();
      } catch (e) {
        toast.error(t("genericError"));
      }
    }
  };

  useEffect(() => {
    listClaim();
  }, []);

  return (
    <>
      <Card title={t("claim")}>
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
                {t("Claim_Modal")}
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
                      <h6>{t("useCustomName")}</h6>
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
                            <span>{t("no")}</span>
                            <span>{t("yes")}</span>
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
                      <label htmlFor="html1">{t("client")}</label>

                      <input
                        type="radio"
                        id="css1"
                        name="fav_language"
                        value="Consignee"
                        checked={selectedInvoice === "Consignee"}
                        onChange={handleRadioChange}
                      />
                      <label htmlFor="css1">{t("consignee")}</label>
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
    </>
  );
};

export default Claim;
