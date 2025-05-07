import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../../assets/logoNew.png";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useId, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../Url/Url";
import { API_IMAGE_URL } from "../../../Url/Url";
import MySwal from "../../../swal";
import { format } from "date-fns";
const QuotaionPdfTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messageSet, setMassageSet] = useState("");
  const loadingModal = MySwal.mixin({
    title: "Loading...",
    didOpen: () => {
      MySwal.showLoading();
    },
    showCancelButton: false,
    showConfirmButton: false,
    allowOutsideClick: false,
  });
  const [companyAddress, setCompanyAddress] = useState("");
  const [data, setData] = useState("");
  const [totalDetails, setTotalDetails] = useState("");
  const [headerData, setHeaderData] = useState("");
  const [useAgreedPricing, setUseAgreedPricing] = useState(false);
  const [itemDetails, setItemDetails] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(false);
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
  const pdfAllData = () => {
    axios
      .post(`${API_BASE_URL}/NewQuotationPDF`, {
        quotation_id: from?.Order_ID,
      })
      .then((response) => {
        console.log(response);
        setCompanyAddress(response?.data?.Company_Address);
      
        setTableData(response?.data?.quotationDetails);
        setTotalDetails(response?.data?.quotationFinance);
       
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
    pdfAllData();
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
  const twoDecimal = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formatterNg = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
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
      doc.addImage(logoData, "PNG", 6, 3, 20, 20);
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
        `${data?.Quotation_Number ? data?.Quotation_Number : ""}`,
        117,
        16
      );
      doc.text(`${formatDate(data?.created)}`, 117, 20);
      doc.text(
        `${
          data?.load_date ? format(new Date(data.load_date), "dd-MM-yyyy") : ""
        } `,
        117,
        24
      );
      doc.text(`${formatterNg.format(totalDetails[0]?.O_NW)}`, 117, 28);
      doc.text("Destination:", 143, 16);
      doc.text("Origin:", 143, 20);
      doc.text("Liner:", 143, 24);
      // doc.text("Destination:",143,28)
      doc.text(`${data?.Airport}`, 165, 16);
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
    const longText1_1 = `${data.client_name}(${data.client_tax_number})`;
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
    // Reset the starting Y position for the second block (right side) to be the same as the first block
    const maxWidth2 = 72;
    const startX2 = 106;
    let currentY2 = commonStartY; // Use the same starting Y position as the first block

    doc.setFontSize(11);
    const longText2_1 = `${data?.consignee_name}(${data?.consignee_tax_number})`;
    const longText2_2 = `${data?.consignee_address}`;
    const longText2_3 = `${data?.consignee_email}/${data?.consignee_phone}`;
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
    const rows = tableData.map((item) => ({
      ITF_Name: item.ITF_Name,
      ITF_Scientific_name: item.ITF_Scientific_name,
      ITF_HSCODE: item.ITF_HSCODE,
      quotation_price_unit: `${twoDecimal.format(item.OD_Final_price)}    ${
        item.Unit_price ? item.Unit_price : ""
      }`, // Combine Price and Unit
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
            const contentHeight = doc.getTextDimensions(data.cell.raw).h;
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
          0: { halign: "left", cellWidth: 59 },
          1: { halign: "left", cellWidth: 70 },
          2: { halign: "center", cellWidth: 30 },
          3: { halign: "center", cellWidth: 37 },
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
    addPageNumbers(doc);

    const pdfBlob = doc.output("blob");
    await uploadPDF(pdfBlob);
  };
  const uploadPDF = async (pdfBlob) => {
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;
    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${from?.Order_ID || "default"}_Quotation_Test_${dateTime}.pdf`
    );
    setIsLoading(true);
    loadingModal.fire();
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${from?.Order_ID}_Quotation_Test_${dateTime}.pdf`
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
      <button
        type="button"
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
    </div>
  );
};

export default QuotaionPdfTest;
