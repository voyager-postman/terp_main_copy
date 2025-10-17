
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../../assets/logoT.jpg";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../Url/Url";
import { API_IMAGE_URL } from "../../../Url/Url";
import { format } from "date-fns";
const QuotationProformaTest = () => {
  const [companyAddress, setCompanyAddress] = useState("");
  const [data, setData] = useState("");
  const [totalDetails, setTotalDetails] = useState("");
  const [headerData, setHeaderData] = useState("");
  const [useAgreedPricing, setUseAgreedPricing] = useState(false);
  const [itemDetails, setItemDetails] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(false);
  const [messageSet1, setMassageSet1] = useState("");
  const [messageSet, setMassageSet] = useState("");
  const [cbm, setCbm] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState("Client");
  const [tableData, setTableData] = useState([]);
  const location = useLocation();
  const { from } = location.state || {};
  console.log(from);



  const oneQoutationDAta = () => {
    axios
      .get(`${API_BASE_URL}/NewgetOrdersById`, {
        params: {
          order_id: from?.Order_ID,
        },
      })
      .then((response) => {
        console.log(response.data.data);

        setData(response.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    oneQoutationDAta();
  }, [from?.Order_ID]);
  const getOrdersDetails = () => {
    axios
      .get(`${API_BASE_URL}/Newquotation_proforma`, {
        params: {
          quotation_id: from?.Order_ID,
        },
      })
      .then((response) => {
        console.log(response);
        setTableData(response?.data?.data);
        setTotalDetails(response?.data?.quotationFinance);

        setCompanyAddress(response?.data?.Company_Address);
        setHeaderData(response?.data?.invoice_header);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const dynamicMessage = () => {
    axios
      .post(`${API_BASE_URL}/Quotation_delivery_terms_new`, {
        quotation_id: from?.Order_ID,
      })
      .then((response) => {
        if (response.data.success === true) {
          setMassageSet1(response.data.message);
        }
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 400) {
          setMassageSet1(error.response.data.message);
        }
      });
  };
  const delivery = () => {
    axios
      .post(`${API_BASE_URL}/newquotation_pdf_delivery_by  `, {
        quotation_id: from?.Order_ID,
      })
      .then((response) => {
        if (response.data.success === true) {
          setMassageSet(response.data.message);
        }
        console.log(response.status);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 400) {
          setMassageSet(error.response.data.message);
        }

        return false;
      });
  };
  
  console.log(data);
  useEffect(() => {
    // pdfAllData();
    dynamicMessage();
    getOrdersDetails();
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
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`${companyAddress?.Line_1}`, 30, 8);
      doc.setFontSize(10);
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

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Proforma Invoice`, 127, 7.5);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Order: ${data?.Quotation_number? data?.Quotation_number:""}`, 127, 12);
      doc.text(`TT Ref: `, 127, 16.5);
      doc.text(
        `Loading Date: ${data?.load_date ? format(new Date(data.load_date), "dd-MM-yyyy") : ""}`,
        127,
        20
      );
            doc.text(`Delivery By: ${messageSet1}`, 127, 24.5);
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
    const longText1_1 = `${data?.client_name}(${data?.client_tax_number})`;
    const longText1_2 = `${data?.client_address}`;
    const longText1_3 = `${data?.client_email} / ${data?.client_phone}`;

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

    // Consignee details (right side)
    const maxWidth2 = 72;
    const startX2 = 127.2;
    let currentY2 = commonStartY; // Use the same starting Y position for the second block

    doc.setFontSize(11);
    const longText2_1 = `${data?.consignee_name}(${data?.consignee_tax_number})`;
    const longText2_2 = `${data?.consignee_address}`;
    const longText2_3 = `${data?.consignee_email}/${data?.consignee_phone}`;

    // Render the second block of text
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
    const columns = [
      { header: "#", dataKey: "index" },
      { header: "Hs code", dataKey: "HS_CODE" },
      { header: "N.W (KG)", dataKey: "net_weight" },
      { header: "Box", dataKey: "Number_of_boxes" },
      { header: "Item Detail", dataKey: "itf_name_en" },
      { header: "QTY", dataKey: "itf_quantity" },
      { header: "Unit", dataKey: "unit_name_en" },
      { header: "Unit Price", dataKey: "calculated_price" },
      { header: "Line Total", dataKey: "line_total" },
    ];
    const rows = tableData.map((item, index) => ({
      index: index + 1,
      HS_CODE: item.HS_CODE,
      net_weight: `${formatterNg.format(item.OD_NW)}`,
      Number_of_boxes: `${formatterNo.format(item.OD_Box)}`,
      itf_name_en: item.itf_name_en,
      itf_quantity: `${formatterNg.format(item.OD_QTY)}`,
      unit_name_en: item.unit_name_en,
      calculated_price: `${twoDecimal.format(item.OD_Final_price)}`,
      line_total: twoDecimal.format(
        item.OD_QTY * (item.OD_Quotation_Price ? item.OD_Quotation_Price : item.OD_Final_price)
      ),
    }));
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
        2: { halign: "right" },
        3: { halign: "center" },
        4: { cellWidth: 50 },
        5: { halign: "right" },
        7: { halign: "right" },
        8: { halign: "right" },
      },
      margin: {
        left: 7,
        right: 7,
      },
      tableWidth: "auto", // Make the table width adjust to the available space
      headStyles: {
        fillColor: [32, 55, 100], // Set the header background color
        textColor: [255, 255, 255],
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
    const yTop = doc.autoTable.previous.finalY + 1;
    const finalY = doc.autoTable.previous.finalY + 4;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    doc.text(
      `Total Box: ${formatterNo.format(totalDetails?.O_Box)}`,
      7,
      finalY + 1
    );
    doc.text(
      `Total Items: ${formatterNo.format(totalDetails?.O_Items)}`,
      7,
      finalY + 5
    );
    doc.text(
      `Total Net Weight: ${threeDecimal.format(totalDetails?.O_NW)}`,
      7,
      finalY + 9
    );
    // doc.text(
    //   `Total Gross Weight: ${formatterNo.format(totalDetails?.Q_GW)}`,
    //   75,
    //   finalY + 9
    // );
    // doc.text(
    //   `Total CBM: ${threeDecimal.format(totalDetails?.Q_CBM)}`,
    //   75,
    //   finalY + 1
    // );

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
    const value = `${twoDecimal.format(totalDetails?.O_CNF_FX)}`;

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
    const longText = messageSet? messageSet:"";
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
    await uploadPDF(pdfBlob);
  };
  const uploadPDF = async (pdfBlob) => {
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;
    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${from?.Order_ID || "default"}_Proforma_Test_${dateTime}.pdf`
    );
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${from?.Order_ID}_Proforma_Test_${dateTime}.pdf`
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
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
  });
  const newFormatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
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

export default QuotationProformaTest;
