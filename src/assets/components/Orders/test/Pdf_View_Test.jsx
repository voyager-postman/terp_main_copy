import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../../assets/logoT.jpg";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "react-query";
//import thaiFont from "../../../assets/TH Sarabun New Regular.ttf"; // Replace with your font path
import { useEffect, useId, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../Url/Url";
import { API_IMAGE_URL } from "../../../Url/Url";
export const Pdf_View_Test = () => {
  const [companyAddress, setCompanyAddress] = useState("");
  const [data, setData] = useState("");
  const [allData, setAllData] = useState("");
  const [data1, setData1] = useState("");
  const [tableData, setTableData] = useState([]);
  const [messageSet, setMassageSet] = useState("");
  const [grossWait, setGrossWait] = useState("");

  const location = useLocation();
  const { from } = location.state || {};
  console.log(from);
  console.log(from?.Order_ID);
  const delivery = () => {
    axios
      .post(`${API_BASE_URL}/Newpdf_delivery_by   `, {
        order_id: from?.Order_ID,
      })
      .then((response) => {
        console.log(response);
        setMassageSet(response.data.message);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 400) {
          setMassageSet(error.response.data.message);
        }

        return false;
      });
  };
  const tableDataAll = () => {
    axios
      .post(`${API_BASE_URL}/NeworderPdfTable`, {
        order_id: from?.Order_ID,
      })
      .then((response) => {
        console.log(response);

        setTableData(response?.data?.results);
      })
      .catch((error) => {
        console.log(error);

        return false;
      });
  };
  const oneQoutationDAta = () => {
    axios
      .get(`${API_BASE_URL}/NewgetOrdersById`, {
        params: {
          order_id: from?.Order_ID,
        },
      })
      .then((response) => {
        console.log(response.data.data);

        setData1(response.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    oneQoutationDAta();
  }, [from?.Order_ID]);

  const pdfAllData = () => {
    axios
      .post(`${API_BASE_URL}/NewGetOrderPdfDetails`, {
        order_id: from?.Order_ID,
      })
      .then((response) => {
        console.log(response.data);
        setCompanyAddress(response?.data?.Company_Address);
        setData(response?.data?.orderResults);
        setAllData(response?.data);
        setGrossWait(response?.data?.gw);
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

  useEffect(() => {
    pdfAllData();
    tableDataAll();
    delivery();
  }, []);
  const formatDate1 = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // 'en-GB' format is DD/MM/YYYY
  };
  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, "0"); // Adds leading zero if needed
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-based, add 1
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const generatePdf = async () => {
    const doc = new jsPDF();
    doc.setFont("helvetica"); // Default built-in font
    doc.setFontSize(16);
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
      // logo end
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`${companyAddress?.Line_1}`, 30, 8);
      doc.setTextColor(0, 0, 0);
      doc.text(`${companyAddress?.Line_2}`, 30, 12);
      const longTextOne = `${companyAddress?.Line_3}`;
      const maxWidthOne = 90;
      const linesOne = doc.splitTextToSize(longTextOne, maxWidthOne);
      let startXOne = 30;
      let startYOne = 16;
      linesOne.forEach((lineOne, index) => {
        doc.text(lineOne, startXOne, startYOne + index * 4.2); // Adjust the line height (10) as needed
      });
      // two line
      doc.setFillColor(32, 55, 100);
      doc.rect(7, 23, doc.internal.pageSize.width - 15, 0.5, "FD");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text("Packing List / Invoice", 83, 27.5);
      doc.setFillColor(32, 55, 100);
      doc.rect(7, 29, doc.internal.pageSize.width - 15, 0.5, "FD");
      // order part left
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const maxWidthLeft = 72; // Maximum width in pixels
      let yLeft = 33;
      const yIncrementLeft = 1; // Adjust this value based on your spacing requirements

      const textDataLeft = [
        { label: "Order :", value: `${data?.Order_Number}` },
        { label: "Loading Date :", value: `${formatDate1(data?.load_date)}` },
        { label: "Shipment Ref :", value: `${from?.Shipment_ref}` },
      ];

      textDataLeft.forEach((item) => {
        const labelXLeft = 7;
        const valueXLeft = 40;

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
      const maxWidthRight = 72; // Maximum width in pixels
      let yRight = 33;
      const yIncrementRight = 1; // Adjust this value based on your spacing requirements

      const textDataRight = [
        { label: "AWB/BL:", value: `${allData?.freightDetailsResults?.awb}` },
        {
          label: "Ship Date: ",
          value: `${formatDate1(allData?.freightDetailsResults?.ship_date)}`,
        },
        { label: "Delivery By:", value: `${messageSet}` },
      ];

      textDataRight.forEach((item) => {
        const labelXRight = 100;
        const valueXRight = 127;

        // Split the value text if it exceeds maxWidth
        const valueLinesRight = doc.splitTextToSize(item.value, maxWidthRight);

        // Print the label
        doc.text(item.label, labelXRight, yRight);
        valueLinesRight.forEach((line, index) => {
          doc.text(line, valueXRight, yRight + index * 4);
        });
        yRight += valueLinesRight.length * 4 + yIncrementRight;
      });
      // invoice to
      doc.setFontSize(12);
      doc.text("Invoice to", 7, 48.5);
      doc.text("Consignee Details", 100, 48.5);
    };
    doc.rect(7, 51, doc.internal.pageSize.width - 15, 0.5, "FD");
    doc.setFontSize(11);
    doc.setFillColor(32, 55, 100);
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
    const commonStartY = 56; // Set common starting Y position for both blocks
    // First set of texts (left side)
    const maxWidth1 = 72;
    const startX1 = 7;
    const lineHeight1 = 4.2;
    const longText1_1 = `${data1.client_name}(${data1.client_tax_number})`;
    const longText1_2 = `${data1?.client_address}`;
    const longText1_3 = `${data1?.client_email} / ${data1?.client_phone}`;
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
    const startX2 = 100;
    let currentY2 = commonStartY; // Use the same starting Y position as the first block
    doc.setFontSize(11);
    const longText2_1 = `${data1?.consignee_name}(${data1?.consignee_tax_number})`;
    const longText2_2 = `${data1?.consignee_address}`;
    const longText2_3 = `${data1?.consignee_email}/${data1?.consignee_phone}`;
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

    await addLogoWithDetails(); // Wait for logo and details to be added
    //  ***************************************************************************************
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
    const noFormatter = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    const fourFormatter = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
    const rows = tableData.map((item, index) => ({
      index: index + 1,
      itf_th: item.itf_th, // Thai text should be correctly displayed
      HS_CODE: item.HS_CODE,
      qty: newFormatter1.format(item.Net_Weight),
      unit: "KG",
      box: noFormatter.format(item.Boxes),
      fob: newFormatter5.format(item.FOB),
    }));
    const startY = 83; // Start Y position for the table

    // Draw the table
    doc.autoTable({
      head: [
        ["#", "Item Detail", "Hs Code", "Qty", "Unit", "Box", "FOB (THB)"],
      ],
      body: rows.map((row) => [
        row.index,
        row.itf_th,
        row.HS_CODE,
        row.qty,
        row.unit,
        row.box,
        row.fob,
      ]),
      columnStyles: {
        3: { halign: "right" }, // Right align the FOB column (index 6)
        2: { halign: "center" }, // Right align the FOB column (index 6)
        5: { halign: "right" }, // Right align the FOB column (index 6)
        6: { halign: "right" }, // Right align the FOB column (index 6)
      },
      startX: 0, // Start the table from the left edge
      startY: tableStartY, // Start Y position of the table
      margin: {
        left: 7,
        right: 7,
      },
      tableWidth: "auto", // Make the table width adjust to the available space
      headStyles: {
        fillColor: "#203764", // Set the header background color
        textColor: "#FFFFFF",
        halign: "center", // Set the header text color
      },
      styles: {
        textColor: "#000000", // Text color for body cells
        cellWidth: "wrap",
        valign: "middle",
        lineWidth: 0.1, // Adjust the border width
        lineColor: "#203764", // Border color
      },
    });

    // Get the Y position after the table is drawn
    const endY = doc.autoTable.previous.finalY + 1; // Adding some margin below the table
    // doc.rect(7, endY, doc.internal.pageSize.width - 15, 0.5, "FD");

    // Draw the text for the order part (left side)
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const maxWidthLeft = 45; // Maximum width in pixels
    let yLeft = endY + 4; // Start below the table
    const yIncrementLeft = 1; // Adjust this value based on your spacing requirements

    const textDataLeft = [
      {
        label: "Total:",
        value: `${data1?.O_Box} Boxes /${data1?.O_Items} Item`,
      },
      {
        label: "Total Net Weight: ",
        value: `${formatterThree.format(data1?.O_NW)}`,
      },
      {
        label: "Total Gross Weight:",
        value: ` ${formatterGross.format(data1?.O_GW)}`,
      },
      {
        label: "Total CBM:",
        value: `${newFormatter1.format(data1?.O_CBM)}`,
      },
    ];
    textDataLeft.forEach((item) => {
      const labelXLeft = 7;
      const valueXLeft = 43;

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

    // Draw the text for the order part (right side)
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const maxWidthRight = 40; // Maximum width in pixels
    let yRight = endY + 4; // Start below the table
    const yIncrementRight = 1; // Adjust this value based on your spacing requirements

    const textDataRight = [
      {
        label: "Total Packages:",
        value: `${noFormatter.format(data1?.O_Box)}`,
      },
      {
        label: "FOB (THB): ",
        value: `${newFormatter5.format(data1?.O_FOB)}`,
      },
      {
        label: "Air Freight:",
        value: `${noFormatter.format(data1?.O_Freight)}`,
      },
      {
        label: "Exchange Rate:",
        value: `${fourFormatter.format(data1?.O_FX_Rate)}`,
      },
    ];

    textDataRight.forEach((item) => {
      const labelXRight = 85;
      const valueXRight = 117;

      // Split the value text if it exceeds maxWidth
      const valueLinesRight = doc.splitTextToSize(item.value, maxWidthRight);

      // Print the label
      doc.text(item.label, labelXRight, yRight);
      valueLinesRight.forEach((line, index) => {
        doc.text(line, valueXRight, yRight + index * 4);
      });

      yRight += valueLinesRight.length * 4 + yIncrementRight;
    });
    const totalTHBText = formatter.format(data1?.O_CNF);
    const totalCurrencyText = formatter.format(data1?.O_CNF_FX);

    const totalTHBWidth = doc.getTextWidth(totalTHBText);
    const totalCurrencyWidth = doc.getTextWidth(totalCurrencyText);

    const maxWidth = 50;
    const startX_THB = 150 + maxWidth - totalTHBWidth;
    const startX_Currency = 150 + maxWidth - totalCurrencyWidth;

    doc.text("Total THB", 147, endY + 4);
    doc.text(totalTHBText, startX_THB, endY + 4);
    doc.setFillColor(32, 55, 100);
    doc.rect(147, endY + 6, 55.5, 0.5, "FD");
    doc.text(`Total ${allData?.currencyResults?.currency}`, 147, endY + 11);
    doc.text(totalCurrencyText, startX_Currency, endY + 11);
    doc.setFillColor(32, 55, 100);
    doc.rect(147, endY + 12, 55.5, 0.5, "FD");

    //*****************************************************************************************

    // Custom page number function
    const addPageNumbers = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`${i} out  of ${pageCount}`, 185.2, 3.1);
      }
    };

    // Add page numbers
    addPageNumbers(doc);

    // Generate PDF Blob
    const pdfBlob = doc.output("blob");
    // Upload the PDF to the server
    await uploadPDF(pdfBlob);
  };
  const uploadPDF = async (pdfBlob) => {
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;
    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${from?.Order_Number || "default"}_Custom_Test_${dateTime}.pdf`
    );
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${from?.Order_Number}_Custom_Test_${dateTime}.pdf`
        );
      } else {
        console.log("Failed to upload PDF");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formatterGross = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const formatterThree = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });

  return (
    <div>
      <button onClick={generatePdf}>Generate PDF</button>
    </div>
  );
};
