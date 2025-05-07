import React, { useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import logo from "../../assets/logoT.jpg";
import "../../components/Orders/order/PdfSec.css";

// import { usePDF } from "react-to-pdf";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useId, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../Url/Url";
import { API_IMAGE_URL } from "../../Url/Url";

const InvoiceSecPdf = () => {
  const [companyAddress, setCompanyAddress] = useState("");
  const [data, setData] = useState("");
  const [totalDetails, setTotalDetails] = useState("");
  const [messageSet, setMassageSet] = useState("");
  const [headerData, setHeaderData] = useState("");
  const [useAgreedPricing, setUseAgreedPricing] = useState(false);
  const [itemDetails, setItemDetails] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(false);
  const [cbm, setCbm] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState("Client");
  const [tableData, setTableData] = useState([]);
  const [messageSet1, setMassageSet1] = useState("");
  const location = useLocation();
  const { from } = location.state || {};
  console.log(from);
  const dynamicMessage = () => {
    axios
      .post(`${API_BASE_URL}/order_delivery_terms`, {
        Order_id: from?.order_id,
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
        console.log(response.data.message);
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
  console.log(messageSet1);
  //   const { data: summary, refetch: getSummary } = useQuery(
  //     `proformaMain_Invoice?order_id=${from.order_id}`,
  //     {
  //       enabled: !!from.order_id,
  //     }
  //   );
  //   console.log(summary);
  const getOrdersDetails = () => {
    axios
      .get(`${API_BASE_URL}/proformaMain_Invoice`, {
        params: {
          order_id: from?.order_id,
          Invoice_id: from?.Invoice_id,
        },
      })
      .then((response) => {
        console.log(response);
        setTableData(response?.data?.orderDetails);
        setCompanyAddress(response?.data?.Company_Address);
        setTotalDetails(response?.data?.invoiceDetails);

        setData(from);
        // setDetails(response.data.data || []);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const pdfAllData = () => {
    axios
      .post(`${API_BASE_URL}/InvoicePdfDetails`, {
        order_id: from?.order_id,
        invoice_id: from?.Invoice_id,
      })
      .then((response) => {
        console.log(response.data);
        // setCompanyAddress(response?.data?.Company_Address);
        setData(from);

        setHeaderData(response?.data?.invoice_header);
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
    delivery();
    getOrdersDetails();
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
      doc.text("PACKING LIST", 130, 9.5);
      // rect end
      // order part

      // **************************************************
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const maxWidthLeft = 30; // Maximum width in pixels
      let yLeft = 16;
      const yIncrementLeft = 1; // Adjust this value based on your spacing requirements

      const textDataLeft = [
        { label: "Order :", value: `${from?.Order_number}` },
        { label: "TT Ref :", value: `${from?.Shipment_ref}` },
        {
          label: "PO Number :",
          value: `${
            from?.Client_reference ? from?.Client_reference : from?.Shipment_ref
          }  `,
        },
        { label: "Delivery By :", value: `${messageSet1}` },
      ];

      textDataLeft.forEach((item) => {
        const labelXLeft = 95;
        const valueXLeft = 119;

        // Adjust the width dynamically based on the label
        const adjustedMaxWidth =
          item.label === "Delivery By :" ? 100 : maxWidthLeft;

        // Split the value text if it exceeds maxWidth
        const valueLinesLeft = doc.splitTextToSize(
          item.value,
          adjustedMaxWidth
        );

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

      const textDataRight = [
        { label: "Date:", value: formatDate(from?.created) },
        // { label: "Due Date : ", value: "12-5-2024" },
        { label: "Ship Date :", value: formatDate(from?.Ship_date) },
        { label: "AWB :", value: `${from?.bl}` },
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
      doc.text("Invoice to", 50, 37.5);
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
    const commonStartY = 45;
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
    await addLogoWithDetails(); // Wait for logo and details to be added
    let yTop = 68;

    const rows = !itemDetails
      ? tableData.map((item, index) => {
          const baseRow = {
            index: index + 1,
            net_weight: formatterThree.format(item?.net_weight),
            itf_quantity: formatterNo.format(item?.Number_of_boxes),
            buns: formatterNo.format(item.buns),
            ITF_name: item.ITF_name,
            HS_Code: item.HS_Code,
          };

          if (!itemDetails && exchangeRate) {
            return {
              ...baseRow,
              barcode: item.barcode,
            };
          }

          return baseRow;
        })
      : tableData.map((item, index) => {
          const baseRow = {
            index: index + 1,
            net_weight: formatterThree.format(item?.net_weight),
            itf_quantity: formatterNo.format(item?.Number_of_boxes),
            buns: formatterNo.format(item.buns),
            ITF_name:
              item.customize_Custom_Name &&
              item.customize_Custom_Name.trim() !== ""
                ? item.customize_Custom_Name
                : item.ITF_name,
            HS_Code: item.HS_Code,
          };

          if (!itemDetails && exchangeRate) {
            return {
              ...baseRow,
              barcode: item.barcode,
            };
          }

          return baseRow;
        });

    const headers = [
      ["#", "N.W (KG)", "Box", "Packages", "Item Detail", "HS Code"],
    ];

    if (exchangeRate) {
      headers[0].push("BarCode");
    }
    doc.autoTable({
      head: headers,
      // body: rows.map((row) => columns.map((col) => row[col.dataKey])),
      body: rows.map((row) => [
        row.index,
        row.net_weight, // Ensure Thai text displays correctly
        row.itf_quantity,
        row.buns,
        row.ITF_name,
        row.HS_Code || "",
        row.barcode,
      ]),
      startY: tableStartY, // Dynamically set the startY based on the content above the table
      margin: {
        left: 7,
        right: 7,
      },
      columnStyles: {
        1: { halign: "right" },
        2: { halign: "right" },
        3: { halign: "right" },
        5: { halign: "center" },
      },
      tableWidth: "auto",
      headStyles: {
        fillColor: [32, 55, 100],
        textColor: [255, 255, 255],
      },
      styles: {
        textColor: (0, 0, 0), // Text color for body cells
        cellWidth: "wrap",
        valign: "middle",
        lineWidth: 0.1, // Adjust the border width
        lineColor: [32, 55, 100], // Border color
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
    doc.text("Total Box:", 7, finalY + 1);

    doc.text(formatterNo.format(totalDetails[0]?.box), 38, finalY + 1);
    doc.text("Total Packages:", 7, finalY + 5.5);
    doc.text(formatterNo.format(from?.packages), 38, finalY + 5.5);

    doc.text("Total Items:", 7, finalY + 10);
    doc.text(formatterNo.format(totalDetails[0]?.Items), 38, finalY + 10);

    // doc.text("Exchange Rate:", 7, finalY + 14.5);
    // doc.text(newFormatter.format(from?.fx_rate), 35, finalY + 14.5);

    doc.text("Total Net Weight:", 72, finalY + 1);
    doc.text(formatterThree.format(totalDetails[0]?.nw), 105, finalY + 1);
    if (cbm) {
      doc.text("Gross Weight:", 72, finalY + 5.5);
      let weight = from?.PORT_GW || from?.gw || 0;
      doc.text(formatterNo.format(weight), 105, finalY + 5.5);
      // doc.text(formatterNo.format(totalDetails[0]?.gw? totalDetails[0]?.gw:totalDetails[0]?.port_weight), 105, finalY + 5.5);
      doc.text("Total CBM:", 72, finalY + 10),
        doc.text(`${totalDetails[0]?.cbm}`, 105, finalY + 10);
    }
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    const PAGE_WIDTH = 210; // A4 page width in mm
    const MARGIN = 7; // margin from the right edge

    // Set the text and value
    const label = "Total";
    const value = `${newFormatter.format(4353242342.324234)}`;
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
    // Calculate the width of the label and the value
    const labelWidth = doc.getTextWidth(label);
    const valueWidth = doc.getTextWidth(value);
    const xRight = PAGE_WIDTH - MARGIN - valueWidth;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

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
    // Upload the PDF to the server
    await uploadPDF(pdfBlob);
  };
  const uploadPDF = async (pdfBlob) => {
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;
    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${from?.Invoice_number || "default"}_Invoice_${dateTime}.pdf`
    );
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${from?.Invoice_number}_Invoice_${dateTime}.pdf`
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
    return `${d.getDate()} - ${d.getMonth() + 1} - ${d.getFullYear()}`;
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
                      <h6>Barcode </h6>
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
    </div>
  );
};

export default InvoiceSecPdf;
