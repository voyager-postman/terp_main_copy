import { useForm } from "@tanstack/react-form";
// import axios from "axios";
import axios from "../../Url/Api";
import { useMemo, useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import logo from "../../assets/logoT.jpg";

import "jspdf-autotable";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import MySwal from "../../swal";
import { TableView } from "../table";
import { API_IMAGE_URL } from "../../Url/Url";
import { Button, Modal } from "react-bootstrap";
import RobotoRegular from "../../assets/fonts/Roboto_Regular";

const Invoice = () => {
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
  const [unitPrices, setUnitPrices] = useState({});
  const [itemDetails, setItemDetails] = useState(false);
  const [itemDetails1, setItemDetails1] = useState(""); // Default state
  const [useAgreedPricing, setUseAgreedPricing] = useState(false);

  const [companyAddress, setCompanyAddress] = useState("");
  const [data3, setData3] = useState("");
  const [tableData, setTableData] = useState([]);
  const [totalDetails, setTotalDetails] = useState("");
  const [headerData, setHeaderData] = useState("");
  const [invoiceData, setInvoiceData] = useState("");
  // const [messageSet1, setMassageSet1] = useState("");
  const [messageSet2, setMassageSet2] = useState("");

  const [messageSet, setMassageSet] = useState("");
  const [filterData1, setFilterData1] = useState("");

  const [quantity, setQuantity] = useState("");
  const [invoiceID, setInvoiceId] = useState("");
  const [invoiceID2, setInvoiceId2] = useState("");
  const [data1, setData1] = useState();
  const [paymentDate, setPaymentDate] = useState("");
  const [paidAmounts, setPaidAmounts] = useState({});
  const [units, setUnits] = useState({});
  const [amounts, setAmounts] = useState({});
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [invoiceID1, setInvoiceId1] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFile1, setSelectedFile1] = useState(null);
  const [show, setShow] = useState(false);
  const [notes, setNotes] = useState("");
  const [massageShow, setMassageShow] = useState("");
  const [cbm, setCbm] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState("Client");
  const [exchangeRate, setExchangeRate] = useState(false);
  const [selectedDeliveryTerm, setSelectedDeliveryTerm] = useState(null);
  const [uploadImage, setUploadImage] = useState("");
  const [data, setData] = useState([]);
  const [invImage, setInvImage] = useState(null);
  const { data: unit } = useQuery("getAllUnit");
  const { data: deliveryList } = useQuery("DropdownDelivery");
  console.log(deliveryList);
  const { data: details, refetch: getOrdersDetails } = useQuery(
    `GetinvoiceDetails?invoice_id=${invoiceID2}`,
    {
      enabled: !!invoiceID2,
    }
  );
  useEffect(() => {
    if (details && details.length > 0) {
      const initialUnitPrices = {};
      const initialAdjustedPrices = {};
      details.forEach((item) => {
        initialUnitPrices[item.id_id] = item.Unit_id;
        initialAdjustedPrices[item.id_id] = item.adjusted_price;
      });
      setUnitPrices(initialUnitPrices);
    }
  }, [details]);

  const newFormatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const handleAgreedPricingChange = (e) => {
    setUseAgreedPricing(e.target.checked);
    console.log(useAgreedPricing);
    // pdfAllData();
  };
  const handleAgreedPricingChange1 = (e) => {
    setItemDetails(e.target.checked);
    console.log(itemDetails);
    // pdfAllData();
  };
  const handleAgreedPricingChange2 = (e) => {
    setCbm(e.target.checked);
    console.log(cbm);
    // pdfAllData();
  };

  const handleAgreedPricingChange3 = (e) => {
    setExchangeRate(e.target.checked);
    console.log(exchangeRate);
    // pdfAllData();
  };
  const handleRadioChange = (event) => {
    setSelectedInvoice(event.target.value);
  };
  const handleChangeDelivery = (event) => {
    setSelectedDeliveryTerm(Number(event.target.value)); // store ID
  };
  const handleFileChangeInv = (event) => {
    const fileInv = event.target.files[0];
    if (fileInv) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvImage(reader.result);
      };
      reader.readAsDataURL(fileInv);
    }
  };
  const allInvoiceData = () => {
    axios.get(`${API_BASE_URL}/invoiceDetailsList`).then((res) => {
      setData(res.data.data || []);
    });
  };
  const handleClose = () => setShow(false);
  useEffect(() => {
    allInvoiceData();
  }, []);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { data: liner } = useQuery("getLiner");
  const [id, setID] = useState(null);
  const dataFind = useMemo(() => {
    return data?.find((v) => +v.order_id == +id);
  }, [id, data]);
  const form = useForm({
    defaultValues: {
      Liner: dataFind?.Freight_liner || "",
      journey_number: dataFind?.Freight_journey_number || "",
      bl: dataFind?.Freight_bl || "",
      Load_date:
        new Date(dataFind?.Freight_load_date || null)
          .toISOString()
          .split("T")[0] || "",
      Load_time: dataFind?.Freight_load_time || "",
      Ship_date:
        new Date(dataFind?.Freight_ship_date || null)
          .toISOString()
          .split("T")[0] || "",
      ETD: dataFind?.Freight_etd || "",
      Arrival_date:
        new Date(dataFind?.Freight_arrival_date || null)
          .toISOString()
          .split("T")[0] || "",
      ETA: dataFind?.Freight_eta || "",
    },
    onSubmit: async ({ value }) => {
      if (dataFind?.order_id) {
        try {
          await axios.post(`${API_BASE_URL}/updateOrderFreight`, {
            order_id: dataFind?.order_id,
            ...value,
          });
          toast.success("Order update successfully");
          refetch();
        } catch (e) {
          toast.error("Something went wrong");
        }
      }
      closeModal();
    },
  });
  const handleChange = (e) => {
    setQuantity(e.target.value);
  };
  const handleChange2 = (e) => {
    setNotes(e.target.value);
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };
  const boxMinutes = (invoiceId, data) => {
    console.log(invoiceId);
    console.log(data);
    setData1(data);
    setInvoiceId2(invoiceId);
  };
  const openModal = (id = null) => {
    setID(id);
    form.reset();
    setIsOpenModal(true);
  };
  const deleteOrder = (id) => {
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
          await axios.post(`${API_BASE_URL}/deleteOrder`, { id: id });
          toast.success("Order delete successfully");
          refetch();
        } catch (e) {
          toast.error("Something went wrong");
        }
      }
    });
  };

  const quotationConfirmation = async (Invoice_id) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/invoiceLoader`, {
        Invoice_id: Invoice_id,

        // Other data you may need to pass
      });
      console.log("API response:", response);
      allInvoiceData();
      toast.success("invoice  Loaded successfully");
      // Handle the response as needed
    } catch (error) {
      console.error("API call error:", error);
      toast.error("Failed to invoice  Loaded");
    }
  };
  const inventoryBoxes = (Invoice_id) => {
    setInvoiceId(Invoice_id);
  };
  const inventoryAirplane = (Invoice_id) => {
    setInvoiceId(Invoice_id);
  };
  const closeIcon = () => {
    setShow(false);

    if (massageShow) {
      setMassageShow("");
    }
  };
  useEffect(() => {
    if (details && Array.isArray(details)) {
      const initialPaidAmounts = {};
      const initialUnits = {};
      const initialAmounts = {};

      details.forEach((item) => {
        initialPaidAmounts[item.Invoice_id] = item.paidAmount || "";
        initialUnits[item.Invoice_id] = item.unit || "";
        initialAmounts[item.Invoice_id] = item.amount || "";
      });

      setPaidAmounts(initialPaidAmounts);
      setUnits(initialUnits);
      setAmounts(initialAmounts);
    }
  }, [details]);
  const handleChange1 = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setErrorMessage("");
    } else {
      setErrorMessage("Please select a PDF file.");
      setSelectedFile(null);
    }
  };
  const handleEditEan = async (event, id_id) => {
    const newValue = event.target.value;
    setUnitPrices((prev) => ({ ...prev, [id_id]: newValue }));

    try {
      const response = await axios.post(`${API_BASE_URL}/EditInvoiceDetails`, {
        id_id: id_id,
        Invoice_id: from?.Invoice_id,
        unit_id: newValue,
      });
      getOrdersDetails();
      console.log("API response:", response);
    } catch (error) {
      console.error("API call error:", error);
    }
  };
  const handleChange21 = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile1(file);
      setErrorMessage("");
    } else {
      setErrorMessage("Please select a PDF file.");
      setSelectedFile1(null);
    }
  };
  const uploadData = () => {
    axios
      .post(`${API_BASE_URL}/InvoiceAdjustWeight`, {
        Invoice_id: invoiceID,
        Port_weight: quantity,
      })
      .then((response) => {
        console.log(response);
        let modalElement = document.getElementById("modalAdjustBox");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        console.log(response);
        toast.success("Invoice Adjustment  Weight Added Successfully", {
          autoClose: 1000,
          theme: "colored",
        });
        allInvoiceData();
        setQuantity("");
        // Clear the quantity field after successful update
      })
      .catch((error) => {
        console.log(error);
        // toast.error("Network Error", {
        //   autoClose: 1000,
        //   theme: "colored",
        // });
      });
  };
  const uploadData1 = () => {
    if (!selectedFile) {
      setErrorMessage("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("Invoice_id", invoiceID);
    formData.append("document", selectedFile);

    axios
      .post(`${API_BASE_URL}/InvoiceShipped`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        let modalElement = document.getElementById("modalAdjustBox1");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }

        if (response.data.success == false) {
          setShow(true);
          // modalInstance.show();
          setMassageShow(response.data.message_th);
        } else if (response.data.success == true) {
          // modalInstance.hide();
          setShow(false);
        }
        console.log(response);
        toast.success("Call Invoice Shipped Successfully", {
          autoClose: 1000,
          theme: "colored",
        });

        allInvoiceData();
        // Clear the quantity field after successful update
        setSelectedFile(null); // Clear selected file
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // const dynamicMessage = async (Invoice_id) => {
  //   axios
  //     .post(`${API_BASE_URL}/invoice_procedure`, {
  //       Invoice_id: Invoice_id,
  //     })
  //     .then((response) => {
  //       console.log(response);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       if (error.response.status === 400) {
  //         setMassageSet(error.response.data.message);
  //         console.log(error.response.data.message);
  //         console.log(messageSet);
  //       }
  //     });
  // };
  // two pdf  start
  const pdfSelectedType = async (consignee_id, a) => {
    console.log(a);
    let messageSet = ""; // Declare messageSet outside the try-catch block
    try {
      await axios
        .post(`${API_BASE_URL}/invoice_procedure`, {
          Invoice_id: a?.Invoice_id,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
          if (error.response?.status === 400) {
            // setMassageSet(error.response.data.message);
            messageSet = error.response.data.message;
            console.log(error.response.data.message);
          }
        });
      // Fetch PDF details

      const deliveryApi = await axios.post(`${API_BASE_URL}/pdf_delivery_by`, {
        order_id: a?.order_id,
      });
      console.log(deliveryApi.data.message);

      const pdfResponse = await axios.post(
        `${API_BASE_URL}/InvoicePdfDetails`,
        {
          order_id: a?.order_id,
          invoice_id: a?.Invoice_id,
        }
      );
      console.log(messageSet);
      const invoiceDetails = pdfResponse?.data?.InvoiceDetails;
      const totalDetails = pdfResponse?.data?.TotalDetails;
      const headerData = pdfResponse?.data?.invoice_header;
      const invoiceData = pdfResponse?.data?.invoice_total;
      const companyAddress = pdfResponse?.data?.Company_Address;
      const pdfResponse1 = await axios.get(
        `${API_BASE_URL}/proformaMain_Invoice`,
        {
          params: {
            order_id: a?.order_id,
            Invoice_id: a?.Invoice_id,
          },
        }
      );
      console.log(pdfResponse1);
      const invoiceDetails1 = pdfResponse1?.data?.orderDetails;
      const totalDetails1 = pdfResponse1?.data?.invoiceDetails;

      const companyAddress1 = pdfResponse1?.data?.Company_Address;

      // Fetch consignee data after state updates
      const consigneeResponse = await axios.get(
        `${API_BASE_URL}/getConsigneeByID`,
        {
          params: { consignee_id: consignee_id },
        }
      );

      const consigneeData = consigneeResponse?.data?.data;
      console.log(consigneeData?.invoice_options);
      // setItemDetails(consigneeData?.invoice_options !== 0);
      setItemDetails1(consigneeData?.custom_name);
      console.log(itemDetails1);
      if (consigneeData?.invoice_options === "invoice only") {
        // await generatePdf(consigneeData, a);

        console.log(messageSet1);

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
          doc.text(`Invoice ${a.Invoice_number}`, 130, 9.5);
          // **************************************************
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          const maxWidthLeft = 30; // Maximum width in pixels
          let yLeft = 16;
          const yIncrementLeft = 1; // Adjust this value based on your spacing requirements
          const textDataLeft = [
            { label: "Order :", value: `${a.Order_number}` },
            { label: "TT Ref :", value: `${a.Shipment_ref}` },
            { label: "PO Number", value: `${a.Client_reference}` },
            { label: "AWB :", value: `${headerData?.bl}` },
          ];

          textDataLeft.forEach((item) => {
            const labelXLeft = 94.5;
            const valueXLeft = 123;

            // Split the value text if it exceeds maxWidth
            const valueLinesLeft = doc.splitTextToSize(
              item.value,
              maxWidthLeft
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

          function formatDate(dateString) {
            if (!dateString || isNaN(new Date(dateString).getTime())) {
              return "";
            }

            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            const formattedDay = day < 10 ? `0${day}` : day;
            const formattedMonth = month < 10 ? `0${month}` : month;

            return `${formattedDay}-${formattedMonth}-${year}`;
          }

          const textDataRight = [
            { label: "Date:", value: `${formatDate(a.created)}` },
            { label: "Due Date : ", value: "" },
            { label: "Ship Date :", value: `${headerData?.Ship_date}` },
            { label: "Delivery By :", value: `${deliveryApi.data.message}` },
          ];

          textDataRight.forEach((item) => {
            const labelXRight = 155;
            const valueXRight = 175;
            const valueLinesRight = doc.splitTextToSize(
              item.value,
              maxWidthRight
            );
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
          consigneeData.invoice_name == "Consignee"
            ? `${a?.Consignee_name} (${a?.consignee_tax_number})`
            : `${a?.Client_name} (${a?.client_tax_number})`,
          consigneeData.invoice_name == "Consignee"
            ? `${a?.consignee_address}`
            : `${a?.client_address}`,
          consigneeData.invoice_name == "Consignee"
            ? `${a?.consignee_email}/${a?.consignee_phone}`
            : `${a?.client_email} / ${a?.client_phone}`,
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
          `${a?.Consignee_name}(${a?.consignee_tax_number})`,
          `${a?.consignee_address}`,
          `${a?.consignee_email}/${a?.consignee_phone}`,
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
        console.log(!itemDetails1);
        const rows =
          itemDetails1 === 0
            ? invoiceDetails?.map((item, index) => ({
                index: index + 1,
                net_weight: formatterThree.format(item.net_weight),
                Number_of_boxes: formatterNo.format(item.Number_of_boxes),
                Packages: formatterNo.format(item.Packages),
                ITF_name: item.ITF_name,
                itf_quantity: formatterThree.format(item.itf_quantity),
                itf_unit_name: item.itf_unit_name,
                Final_Price:
                  consigneeData.agreed_price == 1
                    ? item.Price_displaye
                    : item.Final_Price,
                Line_Total:
                  consigneeData.agreed_price == 1
                    ? newFormatter.format(item.final_Line_Total)
                    : newFormatter.format(item.Line_Total),
              }))
            : invoiceDetails?.map((item, index) => ({
                index: index + 1,
                net_weight: formatterThree.format(item.net_weight),
                Number_of_boxes: formatterNo.format(item.Number_of_boxes),
                Packages: formatterNo.format(item.Packages),
                ITF_name: item.customize_Custom_Name?.trim()
                  ? item.customize_Custom_Name
                  : item.ITF_name,
                itf_quantity: formatterThree.format(item.itf_quantity),
                itf_unit_name: item.itf_unit_name,
                Final_Price:
                  consigneeData.agreed_price == 1
                    ? item.Price_displaye
                    : item.Final_Price,
                Line_Total:
                  consigneeData.agreed_price == 1
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
        doc.text(
          `${formatterNo.format(totalDetails?.total_box)}`,
          38,
          finalY + 1
        );
        doc.text("Total Packages :", 7, finalY + 5.5);
        doc.text(
          `${formatterNo.format(totalDetails?.packages)}`,
          38,
          finalY + 5.5
        );
        doc.text("Total Items :", 7, finalY + 10);
        doc.text(`${formatterNo.format(totalDetails?.Items)}`, 38, finalY + 10);
        if (consigneeData.exchange_rate == 1) {
          doc.text("Exchange Rate : ", 7, finalY + 14.5);
          doc.text(`${newFormatter.format(a?.fx_rate)}`, 38, finalY + 14.5);
        }
        doc.text(`Total Net Weight : `, 72, finalY + 1);
        doc.text(
          `${formatterThree.format(totalDetails?.Net_Weight)}`,
          110,
          finalY + 1
        );
        if (consigneeData.gw_cbm == 1) {
          doc.text("Total Gross Weight :", 72, finalY + 5.5);
          doc.text(
            `${formatterNo.format(totalDetails?.Gross_weight)}`,
            110,
            finalY + 5.5
          );
          doc.text("Total CBM : ", 72, finalY + 10);
          doc.text(`${totalDetails?.CBM}`, 110, finalY + 10);
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
        let value =
          consigneeData.agreed_price == 1
            ? `${newFormatter.format(invoiceData)}`
            : `${newFormatter.format(a?.CNF_FX)}`;

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
        let value1 =
          consigneeData.agreed_price == 1 ? "0" : a?.Rounding_FX || "0";
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
          (consigneeData.agreed_price == 1 ? invoiceData : a?.CNF_FX) -
            (consigneeData.agreed_price == 1 ? 0 : a?.Rounding_FX || 0)
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

        // Example usage
        console.log(messageSet);
        const longText = messageSet; // Assume messageSet contains your long text
        const x = 7;
        const initialY = doc.autoTable.previous.finalY + 24; // Adjust initial Y coordinate if needed
        const maxWidth = 180;

        // Add long text with pagination handling and get the final Y position
        const finalY1 = addTextWithPagination(
          doc,
          longText,
          x,
          initialY,
          maxWidth
        );
        doc.setTextColor(0, 0, 0);
        const inputX = 7; // Adjust as needed
        doc.setFont("helvetica", "bold");
        // doc.text("note:", inputX, initialY); // Label position
        // const inputFieldValue = `Lorem Ipsum is simply dummy text of the printing and typesetting industry`; // Get input field value

        // if (inputFieldValue && inputFieldValue.trim() !== "") {
        //   const inputY = finalY1;
        //   +1; // Adjust as needed
        //   const maxWidth = 196; // Maximum width before breaking into a new line
        //   const wrappedText = doc.splitTextToSize(inputFieldValue, maxWidth);

        //   // Draw text with automatic line breaks
        //   doc.setFont("helvetica", "normal");
        //   doc.text(wrappedText, inputX, inputY);
        // }

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
        await uploadPDF(pdfBlob, a);
      } else if (consigneeData?.invoice_options === "packing list only") {
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
          doc.text(`${companyAddress1?.Line_1}`, 30, 8);
          doc.setTextColor(0, 0, 0);
          doc.text(`${companyAddress1?.Line_2}`, 30, 12);
          const longTextOne = `${companyAddress1?.Line_3}`;
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
            { label: "Order :", value: `${a?.Order_number}` },
            { label: "TT Ref :", value: `${a?.Shipment_ref}` },
            {
              label: "PO Number :",
              value: `${
                a?.Client_reference ? a?.Client_reference : a?.Shipment_ref
              }  `,
            },
            { label: "Delivery By :", value: `${deliveryApi.data.message}` },
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
            { label: "Date:", value: formatDate(a?.created) },
            // { label: "Due Date : ", value: "12-5-2024" },
            { label: "Ship Date :", value: formatDate(a?.Ship_date) },
            { label: "AWB :", value: `${a?.bl}` },
          ];

          textDataRight.forEach((item) => {
            const labelXRight = 155;
            const valueXRight = 175;

            // Split the value text if it exceeds maxWidth
            const valueLinesRight = doc.splitTextToSize(
              item.value,
              maxWidthRight
            );

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
          consigneeData.invoice_name == "Consignee"
            ? `${a?.Consignee_name} (${a?.consignee_tax_number})`
            : `${a?.Client_name} (${a?.client_tax_number})`,
          consigneeData.invoice_name == "Consignee"
            ? `${a?.consignee_address}`
            : `${a?.client_address}`,
          consigneeData.invoice_name == "Consignee"
            ? `${a?.consignee_email}/${a?.consignee_phone}`
            : `${a?.client_email} / ${a?.client_phone}`,
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
          `${a?.Consignee_name}(${a?.consignee_tax_number})`,
          `${a?.consignee_address}`,
          `${a?.consignee_email}/${a?.consignee_phone}`,
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
        console.log(itemDetails1 === 0);
        const rows =
          itemDetails1 === 0
            ? invoiceDetails1?.map((item, index) => {
                const baseRow = {
                  index: index + 1,
                  net_weight: formatterThree.format(item?.net_weight),
                  itf_quantity: formatterNo.format(item?.Number_of_boxes),
                  buns: formatterNo.format(item.buns),
                  ITF_name: item.ITF_name,
                  HS_Code: item.HS_Code,
                };

                if (consigneeData?.barcode === 1) {
                  return {
                    ...baseRow,
                    barcode: item.barcode,
                  };
                }

                return baseRow;
              })
            : invoiceDetails1?.map((item, index) => {
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

                if (consigneeData?.barcode === 1) {
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

        if (consigneeData?.barcode === 1) {
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
            0: { halign: "center" },
            1: { halign: "right" },
            2: { halign: "right" },
            3: { halign: "right" },
            4: { halign: "left", cellWidth: 60 },
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

        doc.text(formatterNo.format(totalDetails1[0]?.box), 38, finalY + 1);
        doc.text("Total Packages:", 7, finalY + 5.5);
        doc.text(formatterNo.format(a?.packages), 38, finalY + 5.5);

        doc.text("Total Items:", 7, finalY + 10);
        doc.text(formatterNo.format(totalDetails1[0]?.Items), 38, finalY + 10);

        // doc.text("Exchange Rate:", 7, finalY + 14.5);
        // doc.text(newFormatter.format(from?.fx_rate), 35, finalY + 14.5);

        doc.text("Total Net Weight:", 72, finalY + 1);
        doc.text(formatterThree.format(totalDetails1[0]?.nw), 105, finalY + 1);
        if (consigneeData.gw_cbm == 1) {
          doc.text("Gross Weight:", 72, finalY + 5.5);
          let weight = a?.PORT_GW || a?.gw || 0;
          doc.text(formatterNo.format(weight), 105, finalY + 5.5);
          // doc.text(formatterNo.format(totalDetails[0]?.gw? totalDetails[0]?.gw:totalDetails[0]?.port_weight), 105, finalY + 5.5);
          doc.text("Total CBM:", 72, finalY + 10),
            doc.text(`${totalDetails1[0]?.cbm}`, 105, finalY + 10);
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
        await uploadPDF2(pdfBlob, a);
      } else if (
        consigneeData?.invoice_options === "invoice and packing list"
      ) {
        const doc = new jsPDF();
        const formatterNo = new Intl.NumberFormat("en-US", {
          style: "decimal",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        const newFormatter = new Intl.NumberFormat("en-US", {
          style: "decimal",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        const formatterThree = new Intl.NumberFormat("en-US", {
          style: "decimal",
          minimumFractionDigits: 3,
        });

        // Static invoice details
        const invoiceData = {
          Invoice_number: "Invoice INV-202501047",
          Order_number: "O-202501051",
          Shipment_ref: "F4U005-2025",
          Client_reference: "PO-0987",
          bl: "217-0307 6021",
          created: "2024-01-10",
          Ship_date: "2024-01-15",
          messageSet1: "FedEx Express",
        };
        const logoData = logo; // Replace with actual base64 string
        doc.addImage(logoData, "PNG", 6, 3, 20, 20);

        // Add company address
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const maxTextWidth = 59;
        doc.text(`${companyAddress?.Line_1}`, 30, 8);
        doc.setTextColor(0, 0, 0);
        doc.text(`${companyAddress?.Line_2}`, 30, 12);

        const staticText = `${companyAddress?.Line_3}`;

        const wrappedLines = doc.splitTextToSize(staticText, maxTextWidth);
        const startX = 30;
        const startY = 16;

        wrappedLines.forEach((line, index) => {
          doc.text(line, startX, startY + index * 4.2); // Adjust the line height as needed
        });

        // Invoice title section
        doc.setFillColor(32, 55, 100);
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.rect(95, 5, 107, 7, "FD");
        doc.text(`Invoice ${a.Invoice_number}`, 130, 9.5);

        // Order details (Left side)
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const maxWidthLeft = 30;
        let yLeft = 16;
        const yIncrementLeft = 1;
        const textDataLeft = [
          { label: "Order :", value: `${a.Order_number}` },
          { label: "TT Ref :", value: `${a.Shipment_ref}` },
          { label: "PO Number:", value: `${a.Client_reference}` },
          { label: "AWB :", value: `${headerData?.bl}` },
        ];

        textDataLeft.forEach((item) => {
          const labelXLeft = 94.5;
          const valueXLeft = 123;
          const valueLinesLeft = doc.splitTextToSize(item.value, maxWidthLeft);

          doc.text(item.label, labelXLeft, yLeft);

          valueLinesLeft.forEach((line, index) => {
            doc.text(line, valueXLeft, yLeft + index * 4);
          });

          yLeft += valueLinesLeft.length * 4 + yIncrementLeft;
        });

        // Order details (Right side)
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const maxWidthRight = 32;
        let yRight = 16;
        const yIncrementRight = 1;

        function formatDate(dateString) {
          const date = new Date(dateString);
          const formattedDay = date.getDate().toString().padStart(2, "0");
          const formattedMonth = (date.getMonth() + 1)
            .toString()
            .padStart(2, "0");
          const year = date.getFullYear();
          return `${formattedDay}-${formattedMonth}-${year}`;
        }

        const textDataRight = [
          { label: "Date:", value: `${formatDate(a.created)}` },
          { label: "Due Date:", value: "" },
          { label: "Ship Date:", value: `${headerData?.Ship_date}` },
          { label: "Delivery By:", value: `${deliveryApi.data.message}` },
        ];

        textDataRight.forEach((item) => {
          const labelXRight = 155;
          const valueXRight = 175;
          const valueLinesRight = doc.splitTextToSize(
            item.value,
            maxWidthRight
          );
          doc.text(item.label, labelXRight, yRight);

          valueLinesRight.forEach((line, index) => {
            doc.text(line, valueXRight, yRight + index * 4);
          });

          yRight += valueLinesRight.length * 4 + yIncrementRight;
        });

        // Client and Consignee rectangles
        const rectHeight = 7;
        const dynamicY = Math.min(yLeft, yRight);

        // Client Rectangle
        doc.setFillColor(32, 55, 100);
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.rect(7, dynamicY, 96, rectHeight, "FD");
        doc.text("Client", 50, dynamicY + rectHeight / 2 + 1.5);

        // Consignee Rectangle
        doc.setFillColor(32, 55, 100);
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.rect(106, dynamicY, 96, rectHeight, "FD");
        doc.text("Consignee", 145, dynamicY + rectHeight / 2 + 1.5);
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
          return startY + lines.length * lineHeight;
        }

        const commonStartY = 48;
        const lineHeight = 4.2;

        // Block 1: Left Side
        const maxWidth1 = 72;
        const startX1 = 7;
        const textBlock1 = [
          consigneeData.invoice_name == "Consignee"
            ? `${a?.Consignee_name} (${a?.consignee_tax_number})`
            : `${a?.Client_name} (${a?.client_tax_number})`,
          consigneeData.invoice_name == "Consignee"
            ? `${a?.consignee_address}`
            : `${a?.client_address}`,
          consigneeData.invoice_name == "Consignee"
            ? `${a?.consignee_email}/${a?.consignee_phone}`
            : `${a?.client_email} / ${a?.client_phone}`,
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
          `${a?.Consignee_name}(${a?.consignee_tax_number})`,
          `${a?.consignee_address}`,
          `${a?.consignee_email}/${a?.consignee_phone}`,
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
          if (index === 0) doc.setFontSize(10); // Adjust font size after the first text
        });
        const tableStartY = Math.max(currentY1, currentY2);
        const rows =
          itemDetails1 === 0
            ? invoiceDetails?.map((item, index) => ({
                index: index + 1,
                net_weight: formatterThree.format(item.net_weight),
                Number_of_boxes: formatterNo.format(item.Number_of_boxes),
                Packages: formatterNo.format(item.Packages),
                ITF_name: item.ITF_name,
                itf_quantity: formatterThree.format(item.itf_quantity),
                itf_unit_name: item.itf_unit_name,
                Final_Price:
                  consigneeData.agreed_price == 1
                    ? item.Price_displaye
                    : item.Final_Price,
                Line_Total:
                  consigneeData.agreed_price == 1
                    ? newFormatter.format(item.final_Line_Total)
                    : newFormatter.format(item.Line_Total),
              }))
            : invoiceDetails?.map((item, index) => ({
                index: index + 1,
                net_weight: formatterThree.format(item.net_weight),
                Number_of_boxes: formatterNo.format(item.Number_of_boxes),
                Packages: formatterNo.format(item.Packages),
                ITF_name: item.customize_Custom_Name?.trim()
                  ? item.customize_Custom_Name
                  : item.ITF_name,
                itf_quantity: formatterThree.format(item.itf_quantity),
                itf_unit_name: item.itf_unit_name,
                Final_Price:
                  consigneeData.agreed_price == 1
                    ? item.Price_displaye
                    : item.Final_Price,
                Line_Total:
                  consigneeData.agreed_price == 1
                    ? newFormatter.format(item.final_Line_Total)
                    : newFormatter.format(item.Line_Total),
              }));
        let rowCount = 0;
        const maxRowsPerPage = 23;

        // Function to add rows and handle page breaks
        const addRows = () => {
          let remainingRows = rows.slice(rowCount); // Get remaining rows to be added
          let startY = tableStartY; // Use 'let' instead of 'const'

          while (remainingRows.length > 0) {
            const rowsToAdd = remainingRows.slice(0, maxRowsPerPage); // Get the first 10 rows
            remainingRows = remainingRows.slice(maxRowsPerPage); // Remove the added rows
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
                row.net_weight,
                row.Number_of_boxes,
                row.Packages,
                row.ITF_name,
                row.itf_quantity,
                row.itf_unit_name,
                row.Final_Price,
                row.Line_Total,
              ]),

              startY: startY, // Start table from 7 on each page
              margin: { left: 7, right: 7 },

              tableWidth: "auto",
              headStyles: {
                fillColor: [32, 55, 100],
                textColor: [255, 255, 255],
              },
              styles: {
                textColor: [0, 0, 0],
                cellWidth: "wrap",
                valign: "middle",
                lineWidth: 0.1,
                lineColor: [32, 55, 100],
              },
              didParseCell: function (data) {
                if (data.section === "body") {
                  const rowIndex = data.row.index;
                  data.cell.styles.fillColor =
                    rowIndex % 2 === 0 ? [250, 248, 248] : [255, 255, 255];
                }
              },
              columnStyles: {
                0: { halign: "center", cellWidth: 10 },
                1: { halign: "right" },
                2: { halign: "right" },
                3: { halign: "right" },
                4: { halign: "left", cellWidth: 60 },
                5: { halign: "right" },
                6: { halign: "center" },
                7: { halign: "right" },
                8: { halign: "right" },
              },
            });

            // If there are more rows, add a new page and reset startY for the next page
            if (remainingRows.length > 0) {
              doc.addPage();
              startY = 7; // ✅ No error, since startY is now 'let'
            }
          }
        };
        addRows(); // Add rows to the PDF
        let finalY = doc.autoTable.previous.finalY + 4;
        // Check if content exceeds page height, and if so, create a new page
        const pageHeight = doc.internal.pageSize.height; // Get the page height
        const margin = 10; // Optional margin to leave space at the bottom of the page

        // Define the total height of your content
        const contentHeight = finalY + 15; // Adjust according to the amount of content you have

        if (contentHeight > pageHeight - margin) {
          doc.addPage(); // Create a new page
          finalY = margin; // Reset Y coordinate to the top of the new page
        }

        // Static data for totals
        const totalBox = 150;
        const totalPackages = 200;
        const totalItems = 300;
        const exchangeRate = 35.5;
        const totalNetWeight = 1200.75;
        const totalGrossWeight = 1300.5;
        const totalCBM = 15.75;

        doc.text("Total Box : ", 7, finalY + 1);
        doc.text(
          `${formatterNo.format(totalDetails?.total_box)}`,
          38,
          finalY + 1
        );

        doc.text("Total Packages :", 7, finalY + 5.5);
        doc.text(
          `${formatterNo.format(totalDetails?.packages)}`,
          38,
          finalY + 5.5
        );

        doc.text("Total Items :", 7, finalY + 10);
        doc.text(`${formatterNo.format(totalDetails?.Items)}`, 38, finalY + 10);

        if (exchangeRate) {
          doc.text("Exchange Rate : ", 7, finalY + 14.5);
          doc.text(`${newFormatter.format(a?.fx_rate)}`, 38, finalY + 14.5);
        }

        doc.text(`Total Net Weight : `, 72, finalY + 1);
        doc.text(
          `${formatterThree.format(totalDetails?.Net_Weight)}`,
          110,
          finalY + 1
        );

        if (totalGrossWeight) {
          doc.text("Total Gross Weight :", 72, finalY + 5.5);
          doc.text(
            `${formatterNo.format(totalDetails?.Gross_weight)}`,
            110,
            finalY + 5.5
          );

          doc.text("Total CBM : ", 72, finalY + 10);
          doc.text(`${totalDetails?.CBM}`, 110, finalY + 10);
        }

        const MARGIN = 6.8;
        const PAGE_WIDTH = doc.internal.pageSize.getWidth();
        const xLeft = 147; // Position from the left
        const maxValueWidth = 50; // Maximum width for the value

        // Static values
        const label = "Total";
        let value =
          consigneeData.agreed_price == 1
            ? `${newFormatter.format(invoiceData)}`
            : `${newFormatter.format(a?.CNF_FX)}`; // Static value for the total (e.g., replace this with your own value)

        const label1 = "Discount";
        let value1 =
          consigneeData.agreed_price == 1 ? "0" : a?.Rounding_FX || "0"; // Static value for the discount

        const label2 = "Payable";
        let value2 = `${newFormatter.format(
          (consigneeData.agreed_price == 1 ? invoiceData : a?.CNF_FX) -
            (consigneeData.agreed_price == 1 ? 0 : a?.Rounding_FX || 0)
        )}`;

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
        let formattedValue = fitText(value, maxValueWidth); // Ensure value fits within the max width
        const valueWidth = doc.getTextWidth(formattedValue);
        const xValue = PAGE_WIDTH - MARGIN - valueWidth; // Position value to the right side of the page

        // Draw label and value
        doc.setFillColor(32, 55, 100);
        doc.text(label, xLeft, finalY + 1);
        doc.text(formattedValue, xValue, finalY + 1);

        // Setting the second label and value (Discount)
        let formattedValue1 = fitText(value1, maxValueWidth); // Ensure value fits within the max width
        const valueWidth1 = doc.getTextWidth(formattedValue1);
        const xValue1 = PAGE_WIDTH - MARGIN - valueWidth1; // Position value to the right side of the page

        // Draw first label and value (Discount)
        doc.setFillColor(32, 55, 100);
        doc.text(label1, xLeft, finalY + 5);
        doc.text(formattedValue1, xValue1, finalY + 5);
        doc.setFillColor(32, 55, 100);
        doc.rect(xLeft, finalY + 11.5, 55.5, 0.5, "FD");
        doc.text(label2, xLeft, finalY + 9);

        // Setting the third label and value (Payable)
        let formattedValue2 = fitText(value2, maxValueWidth); // Ensure value fits within the max width
        const valueWidth2 = doc.getTextWidth(formattedValue2);
        const xValue2 = PAGE_WIDTH - MARGIN - valueWidth2; // Position value to the right side of the page
        doc.text(formattedValue2, xValue2, finalY + 9);

        // }
        doc.setFont("helvetica", "bold"); // Set font to bold
        doc.setTextColor(0, 0, 0);
        // doc.text("Note", 7, finalY + 20);
        // Draw second label and value (Payable)
        const pageWidth = doc.internal.pageSize.width; // Get page width
        const leftMargin = 7;
        const rightMargin = 7;
        const maxWidthNote = pageWidth - leftMargin - rightMargin; // Calculate available width

        doc.setFont("helvetica", "normal"); // Set font to bold
        const textY = finalY + 20; // Y position for text
        const text = messageSet;
        const wrappedText = doc.splitTextToSize(text, maxWidthNote); // Wrap text within available width

        // Check if text would exceed page height
        if (textY + wrappedText.length * 7 > pageHeight) {
          doc.addPage(); // Add new page if necessary
          doc.text(wrappedText, leftMargin, 7); // Reset Y position on new page
        } else {
          doc.text(wrappedText, leftMargin, textY); // Print normally if enough space
        }

        // Function to draw a rounded rectangle
        // add pdf sec
        doc.addPage();

        // Updated invoice information

        const logoImage = logo; // Replace with actual base64 string
        doc.addImage(logoImage, "PNG", 6, 3, 20, 20);

        // Adding business address
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`${companyAddress1?.Line_1}`, 30, 8);
        doc.text(`${companyAddress1?.Line_2}`, 30, 12);

        // Handling long text
        const addressText = `${companyAddress1?.Line_3}`;
        const addressMaxWidth = 59;
        const addressLines = doc.splitTextToSize(addressText, addressMaxWidth);
        let addressStartX = 30;
        let addressStartY = 16;

        addressLines.forEach((line, index) => {
          doc.text(line, addressStartX, addressStartY + index * 4.2);
        });

        // Invoice header section
        doc.setFillColor(50, 75, 120);
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.rect(95, 5, 107, 7, "FD");
        doc.text(`PACKING LIST `, 130, 9.5);
        // Set font and color
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);

        const leftColumnMaxWidth = 30; // Max width for most values
        let leftColumnY = 16; // Initial Y position
        const leftColumnSpacing = 1; // Spacing between lines

        const leftColumnData = [
          { label: "Order :", value: `${a?.Order_number}` },
          { label: "TT Ref :", value: `${a?.Shipment_ref}` },
          {
            label: "PO Number :",
            value: `${
              a?.Client_reference ? a?.Client_reference : a?.Shipment_ref
            }  `,
          },
          {
            label: "Delivery By :",
            value: `${deliveryApi.data.message}`,
          },
        ];

        leftColumnData.forEach((item) => {
          const labelX = 95;
          const valueX = 119;

          // Set a different max width for "Delivery By :"
          const maxWidth =
            item.label === "Delivery By :" ? 100 : leftColumnMaxWidth;

          // Wrap text if it exceeds max width
          const wrappedValue = doc.splitTextToSize(item.value, maxWidth);

          // Print label
          doc.text(item.label, labelX, leftColumnY);

          // Print value with line wrapping
          wrappedValue.forEach((line, index) => {
            doc.text(line, valueX, leftColumnY + index * 4);
          });

          // Adjust Y position for the next item
          leftColumnY += wrappedValue.length * 4 + leftColumnSpacing;
        });

        // Right Column
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);

        const rightColumnMaxWidth = 32;
        let rightColumnY = 16;
        const rightColumnSpacing = 1;
        const rightColumnData = [
          { label: "Date:", value: formatDate(a?.created) },
          { label: "Ship Date :", value: formatDate(a?.Ship_date) },
          { label: "AWB :", value: `${a?.bl}` },
        ];

        rightColumnData.forEach((item) => {
          const labelX = 155;
          const valueX = 175;

          // Wrap text if needed
          const wrappedValue = doc.splitTextToSize(
            item.value,
            rightColumnMaxWidth
          );

          // Print label
          doc.text(item.label, labelX, rightColumnY);
          wrappedValue.forEach((line, index) => {
            doc.text(line, valueX, rightColumnY + index * 4);
          });

          // Adjust Y position for the next item
          rightColumnY += wrappedValue.length * 4 + rightColumnSpacing;
        });

        // Header Section
        doc.setFillColor(32, 55, 100);
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.rect(7, 33, 96, 7, "FD");
        doc.text("Invoice to", 50, 37.5);

        // Consignee Section
        doc.setFillColor(32, 55, 100);
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.rect(106, 33, 96, 7, "FD");
        doc.text("Consignee", 145, 37.5);

        // Set default font size for text content
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);

        // Function to handle text wrapping
        function addWrappedText(doc, content, x, y, width, lineSpacing) {
          const wrappedLines = doc.splitTextToSize(content, width);
          wrappedLines.forEach((line, index) => {
            doc.text(line, x, y + index * lineSpacing);
          });
          return y + wrappedLines.length * lineSpacing;
        }

        // Common Y starting position
        const contentStartY = 45;
        const lineSpacing = 4.2;

        // Left Block Content (Static Values)
        const leftBlockWidth = 72;
        const leftBlockX = 7;
        const leftBlockContent = [
          consigneeData.invoice_name == "Consignee"
            ? `${a?.Consignee_name} (${a?.consignee_tax_number})`
            : `${a?.Client_name} (${a?.client_tax_number})`,
          consigneeData.invoice_name == "Consignee"
            ? `${a?.consignee_address}`
            : `${a?.client_address}`,
          consigneeData.invoice_name == "Consignee"
            ? `${a?.consignee_email}/${a?.consignee_phone}`
            : `${a?.client_email} / ${a?.client_phone}`,
        ];

        let leftBlockY = contentStartY;
        doc.setFontSize(11);
        leftBlockContent.forEach((text, index) => {
          leftBlockY = addWrappedText(
            doc,
            text,
            leftBlockX,
            leftBlockY,
            leftBlockWidth,
            lineSpacing
          );
          if (index === 0) doc.setFontSize(10);
        });

        // Right Block Content (Static Values)
        const rightBlockWidth = 72;
        const rightBlockX = 106;
        const rightBlockContent = [
          `${a?.Consignee_name}(${a?.consignee_tax_number})`,
          `${a?.consignee_address}`,
          `${a?.consignee_email}/${a?.consignee_phone}`,
        ];

        let rightBlockY = contentStartY;
        doc.setFontSize(11);
        rightBlockContent.forEach((text, index) => {
          rightBlockY = addWrappedText(
            doc,
            text,
            rightBlockX,
            rightBlockY,
            rightBlockWidth,
            lineSpacing
          );
          if (index === 0) doc.setFontSize(10);
        });

        // Determine the Y position for the next section
        const nextSectionStartY = Math.max(leftBlockY, rightBlockY);
        const rows1 =
          itemDetails1 === 0
            ? invoiceDetails1?.map((item, index) => {
                const baseRow = {
                  index: index + 1,
                  net_weight: formatterThree.format(item?.net_weight),
                  itf_quantity: formatterNo.format(item?.Number_of_boxes),
                  buns: formatterNo.format(item.buns),
                  ITF_name: item.ITF_name,
                  HS_Code: item.HS_Code,
                };

                if (consigneeData?.barcode === 1) {
                  return {
                    ...baseRow,
                    barcode: item.barcode,
                  };
                }

                return baseRow;
              })
            : invoiceDetails1?.map((item, index) => {
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

                if (consigneeData?.barcode === 1) {
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
        if (consigneeData?.barcode === 1) {
          headers[0].push("BarCode");
        }
        const maxRowsPerPageNew = 24;
        let remainingRows = [...rows1]; // Copy the original array
        let nextSectionStartYNew = nextSectionStartY; // Set initial Y position

        while (remainingRows.length > 0) {
          const rowsToAdd = remainingRows.slice(0, maxRowsPerPageNew); // Take 10 rows
          remainingRows = remainingRows.slice(maxRowsPerPageNew); // Remove them from remaining
          doc.autoTable({
            head: headers,
            body: rowsToAdd.map((row) => [
              row.index,
              row.net_weight, // Ensure Thai text displays correctly
              row.itf_quantity,
              row.buns,
              row.ITF_name,
              row.HS_Code || "",
              row.barcode,
            ]),
            startY: nextSectionStartYNew,
            margin: { left: 7, right: 7 },
            columnStyles: {
              1: { halign: "right" },
              2: { halign: "right" },
              3: { halign: "right" },
              4: { halign: "left", cellWidth: 60 },
              5: { halign: "center" },
            },
            tableWidth: "auto",
            headStyles: {
              fillColor: [32, 55, 100],
              textColor: [255, 255, 255],
            },
            styles: {
              textColor: [0, 0, 0],
              cellWidth: "wrap",
              valign: "middle",
              lineWidth: 0.1,
              lineColor: [32, 55, 100],
            },
            didParseCell: function (data) {
              if (data.section === "body") {
                const rowIndex = data.row.index;
                data.cell.styles.fillColor =
                  rowIndex % 2 === 0 ? [250, 248, 248] : [255, 255, 255];
              }
            },
          });
          if (remainingRows.length > 0) {
            doc.addPage();
            nextSectionStartYNew = 7; // Reset Y position for the new page
          }
        }
        const lastYPosition = doc.autoTable.previous.finalY + 4;
        doc.text("Total Box:", 7, lastYPosition + 1);
        doc.text(
          formatterNo.format(totalDetails1[0]?.box),
          38,
          lastYPosition + 1
        ); // Static value for total boxes

        doc.text("Total Packages:", 7, lastYPosition + 5.5);
        doc.text(formatterNo.format(a?.packages), 38, lastYPosition + 5.5); // Static value for total packages

        doc.text("Total Items:", 7, lastYPosition + 10);
        doc.text(
          formatterNo.format(totalDetails1[0]?.Items),
          38,
          lastYPosition + 10
        ); // Static value for total items

        doc.text("Total Net Weight:", 72, lastYPosition + 1);
        doc.text(
          formatterThree.format(totalDetails1[0]?.nw),
          105,
          lastYPosition + 1
        ); // Static value for total net weight
        let weight = a?.PORT_GW || a?.gw || 0;
        doc.text("Gross Weight:", 72, lastYPosition + 5.5);
        doc.text(formatterNo.format(weight), 105, lastYPosition + 5.5); // Static value for gross weight

        doc.text("Total CBM:", 72, lastYPosition + 10);
        doc.text(`${totalDetails1[0]?.cbm}`, 105, lastYPosition + 10); // Static value for CBM

        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);

        const documentWidth = 210; // A4 page width in mm
        const paddingRight = 7; // Margin from the right edge

        // Set the label and value
        const summaryLabel = "Total";
        const summaryValue = `${newFormatter.format(4353242342.324234)}`; // Static value for total amount

        // Calculate the width of the label and value
        const labelSize = doc.getTextWidth(summaryLabel);
        const valueSize = doc.getTextWidth(summaryValue);
        const textAlignmentRight = documentWidth - paddingRight - valueSize;

        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);

        // Save the PDF
        // Open the PDF in a new window (blobs the content)
        const pdfBlob = doc.output("blob");
        // Upload the PDF to the server
        await uploadPDF3(pdfBlob, a);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Network Error", {
        autoClose: 1000,
        theme: "colored",
      });
    }
  };
  // two pdf end

  const uploadPDF3 = async (pdfBlob, a) => {
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;
    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${
        a?.Invoice_number || "default"
      }_Invoice_and_packing_list_${dateTime}.pdf`
    );

    setIsLoading(true);
    loadingModal.fire();
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${a?.Invoice_number}_Invoice_and_packing_list_${dateTime}.pdf`
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
  const uploadPDF2 = async (pdfBlob, a) => {
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;
    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${a?.Invoice_number || "default"}_Invoice_${dateTime}.pdf`
    );

    setIsLoading(true);
    loadingModal.fire();
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${a?.Invoice_number}_Invoice_${dateTime}.pdf`
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
  const delivery = async (order_id) => {
    axios
      .post(`${API_BASE_URL}/pdf_delivery_by  `, {
        order_id: order_id,
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
  // const delivery1 = async (order_id) => {
  //   axios
  //     .post(`${API_BASE_URL}/pdf_delivery_by  `, {
  //       order_id: order_id,
  //     })
  //     .then((response) => {
  //       console.log(response.data.message);
  //       setMassageSet2(response.data.message);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       if (error.response.status === 400) {
  //         setMassageSet2(error.response.data.message);
  //       }

  //       return false;
  //     });
  // };
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
  };
  const uploadPDF = async (pdfBlob, a) => {
    // Generate a unique date-time string
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;

    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${a?.Invoice_number || "default"}_Invoice_${dateTime}.pdf`
    );
    setIsLoading(true);
    loadingModal.fire();
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${
            a?.Invoice_number || "default"
          }_Invoice_${dateTime}.pdf`
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
  const handleEditClick1 = async (invoiceID) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/InvoiceAWBReady`, {
        Invoice_id: invoiceID,
        // Other data you may need to pass
      });
      console.log("API response:", response);

      toast.success("success");
      allInvoiceData();

      getOrdersDetails();

      // Handle the response as needed
    } catch (error) {
      console.error("API call error:", error);
      toast.error("Failed to Copy Order Procedure");
    }
  };
  const handleEditClick = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/InvoiceAWBReady`, {
        Invoice_id: invoiceID,
        // Other data you may need to pass
      });
      console.log("API response:", response);

      toast.success("success");
      allInvoiceData();

      getOrdersDetails();

      // Handle the response as needed
    } catch (error) {
      console.error("API call error:", error);
      toast.error("Failed to Copy Order Procedure");
    }
  };
  const uploadData2 = () => {
    if (!selectedFile1) {
      setErrorMessage("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("Invoice_id", invoiceID);
    formData.append("document", selectedFile1);

    axios
      .post(`${API_BASE_URL}/InvoiceShipped`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        handleEditClick();
        let modalElement = document.getElementById("modalAdjustBox3");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        console.log(response);
        // toast.success("Call Invoice Shipped Successfully", {
        //   autoClose: 1000,
        //   theme: "colored",
        // });

        allInvoiceData();
        // Clear the quantity field after successful update
        setSelectedFile1(""); // Clear selected file
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const quotationCopy = (Invoice_id) => {
    setInvoiceId1(Invoice_id);
  };

  const dataSubmit = () => {
    axios
      .post(`${API_BASE_URL}/InvoiceNotes`, {
        invoice_id: invoiceID1,
        notes: notes,
      })
      .then((response) => {
        console.log(response);
        let modalElement = document.getElementById("exampleModal2");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        console.log(response);
        toast.success("Invoice Note Updated Successfully", {
          autoClose: 1000,
          theme: "colored",
        });
        allInvoiceData();
        setNotes("");
        // Clear the quantity field after successful update
      })
      .catch((error) => {
        console.log(error);
        // toast.error("Network Error", {
        //   autoClose: 1000,
        //   theme: "colored",
        // });
      });
  };
  const restoreEanPackage = (id) => {
    axios
      .post(`${API_BASE_URL}/cancle_invoice`, {
        Invoice_id: id,
      })
      .then((response) => {
        if (response.status === 400) {
          allInvoiceData();

          toast.warn(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
        } else if (response.status === 200) {
          allInvoiceData();

          toast.success("Invoice cancel successful", {
            autoClose: 1000,
            theme: "colored",
          });
        } else {
          allInvoiceData();

          toast.warn("Something went wrong", {
            autoClose: 1000,
            theme: "colored",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handlePaidAmountChange = (id_id, value) => {
    setPaidAmounts((prev) => ({
      ...prev,
      [id_id]: value,
    }));
  };
  const handleUnitChange = (id_id, value) => {
    console.log("Unit changed:", id_id, value); // Debugging
    setUnits((prev) => ({
      ...prev,
      [id_id]: value,
    }));
  };

  const handleAmountChange = (id_id, value) => {
    setAmounts((prev) => ({
      ...prev,
      [id_id]: value,
    }));
  };

  const summaryTable = async (Claim_id) => {
    // Filter details to only include those with non-empty values
    const dataToSubmit = details
      .filter(
        (item) =>
          paidAmounts[item.id_id] &&
          amounts[item.id_id] &&
          units[item.id_id] &&
          parseFloat(paidAmounts[item.id_id]) > 0 &&
          parseFloat(amounts[item.id_id]) > 0
      )
      .map((item) => ({
        Claim_id: Claim_id,
        id_id: item.id_id,
        ITF: item.ITF_ID,
        QTY: parseFloat(paidAmounts[item.id_id]), // Ensure it's a number
        Unit: units[item.id_id],
        Claimed_amount: parseFloat(amounts[item.id_id]), // Ensure it's a number
      }));

    if (dataToSubmit.length === 0) {
      console.warn("No valid data to submit");
      // toast.warn("No valid data to submit");
      return; // Exit early if there's no data to submit
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/AddClaimDetails`, {
        datas: dataToSubmit,
      });
      console.log(response);
      // Handle successful response
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const handleSubmit1 = async () => {
    // Filter details to only include those with non-empty values
    const selectedPaymentDetails = details
      .filter(
        (item) =>
          paidAmounts[item.id_id] || units[item.id_id] || amounts[item.id_id]
      )
      .map((item) => ({
        id_id: item.id_id,
        ITF: item.ITF_ID,
        QTY: paidAmounts[item.id_id] || 0,
        Unit: units[item.id_id] || 0,
        Claimed_amount: amounts[item.id_id] || 0,
      }));

    const paymentData = {
      Claim_date: paymentDate,
      Client_ID: data1?.Client_ID,
      Consignee_ID: data1?.Consignee_id,
      Invoice_ID: data1?.Invoice_id,
      FX_ID: data1?.fx_id,
      User_id: localStorage.getItem("id"),
    };

    console.log(paymentData);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/insertClaimDetails`,
        paymentData
      );
      console.log(response);
      if (response.status === 200) {
        console.log("Claim data submitted successfully", response);
        summaryTable(response?.data.data);
        // await axios.post(`${API_BASE_URL}/updateClaim`, {
        //   claim_id: response.data.data,
        // });
        toast.success("Claim data submitted successfully");

        let modalElement = document.getElementById("modalClaim");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        setPaidAmounts({});
        setUnits({});
        setAmounts({});
      }
    } catch (error) {
      console.error("Error submitting payment data", error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getOrdersDetails();
  }, [invoiceID2]);
  const handleSubmit = () => {
    console.log(invoiceID2);
    console.log(data1);
  };
  const closeButton = () => {
    setInvoiceId2("");
    setData1("");
  };
  const openPdf = (document) => {
    const pdfUrl = `${API_IMAGE_URL}${document}`; // Replace with the URL of your PDF
    window.open(pdfUrl, "_blank");
  };
  const handleDownload = () => {
    // Open a new tab with the API endpoint URL
    window.open(
      "http://localhost:7001/api/invoicePdfTable?invoice_id=26&order_id=1",
      "_blank"
    );
  };
  const columns = useMemo(
    () => [
      {
        Header: "Invoice Number",
        accessor: "Invoice_Number",
      },
      {
        Header: "Order Number",
        accessor: "Order_Number",
      },
      {
        Header: "Shipment Ref",
        accessor: "Shipment_ref",
      },
      {
        Header: "Consignee Name",
        accessor: "Consignee_name",
      },
      {
        Header: "Client Ref",
        accessor: "Customer_ref",
      },
      {
        Header: "AWB/BL",
        accessor: "BL",
      },

      {
        Header: "Ship Date",
        accessor: (a) =>
          `${new Date(a.Ship_date).getDate().toString().padStart(2, "0")}-${(
            new Date(a.Ship_date).getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}-${new Date(a.Ship_date).getFullYear()}`,
      },
      {
        Header: "Status",
        accessor: "status_name",
      },

      {
        Header: "Action",
        accessor: (a) => (
          <>
            <div className="editIcon">
              <Link to=" " state={{ from: { ...a, isReadOnly: true } }}></Link>
              <Link to="/invoiceview" state={{ from: { ...a } }}>
                <i className="mdi mdi-eye" />
              </Link>
              {/* {+a.Status < 2 && ( */}
              <>
                <Link to="/invoice_edit1" state={{ from: { ...a } }}>
                  <i className="mdi mdi-pencil" />
                </Link>
                <button
                  type="button"
                  onClick={() => restoreEanPackage(a.Order_ID)}
                >
                  <i className="mdi mdi-restore" />
                </button>
              </>
              {/* )} */}
              <Link
                className="SvgAnchor"
                to="/custom_invoice_pdf"
                state={{ from: { ...a } }}
              >
                <svg
                  className="SvgQuo"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <title>alpha-c-box-outline</title>
                  <path d="M3,5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5M5,5V19H19V5H5M11,7H13A2,2 0 0,1 15,9V10H13V9H11V15H13V14H15V15A2,2 0 0,1 13,17H11A2,2 0 0,1 9,15V9A2,2 0 0,1 11,7Z"></path>
                </svg>
              </Link>
              {/* <Link
                className="SvgAnchor"
                to="/invoice_pdf"
                state={{ from: { ...a } }}
              >
                <svg
                  className="SvgQuo"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <title>invoice-text-check-outline</title>
                  <path d="M12 20L13.3 20.86C13.1 20.28 13 19.65 13 19C13 18.76 13 18.5 13.04 18.29L12 17.6L9 19.6L6 17.6L5 18.26V5H19V13C19.7 13 20.37 13.12 21 13.34V3H3V22L6 20L9 22L12 20M17 9V7H7V9H17M15 13V11H7V13H15M15.5 19L18.25 22L23 17.23L21.84 15.82L18.25 19.41L16.66 17.82L15.5 19Z"></path>
                </svg>
              </Link> */}

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
                  <title>invoice-text-check-outline</title>
                  <path d="M12 20L13.3 20.86C13.1 20.28 13 19.65 13 19C13 18.76 13 18.5 13.04 18.29L12 17.6L9 19.6L6 17.6L5 18.26V5H19V13C19.7 13 20.37 13.12 21 13.34V3H3V22L6 20L9 22L12 20M17 9V7H7V9H17M15 13V11H7V13H15M15.5 19L18.25 22L23 17.23L21.84 15.82L18.25 19.41L16.66 17.82L15.5 19Z"></path>
                </svg>
              </button>
              {/* <button onClick={invoiceFirstpdf}>
            <i className="mdi mdi-file-account-outline" />
            </button> */}
              {/* <i className="mdi mdi-note-outline" title="Notes" /> */}
              <Link
                className="SvgAnchor"
                to="/packing_list_pdf"
                state={{ from: { ...a } }}
              >
                <svg
                  className="SvgQuo"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <title>package-variant-closed</title>
                  <path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L10.11,5.22L16,8.61L17.96,7.5L12,4.15M6.04,7.5L12,10.85L13.96,9.75L8.08,6.35L6.04,7.5M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z"></path>
                </svg>
              </Link>
              {/* <Link to="/invoicethirdpdf">
              <i className="mdi mdi-file-code-outline" />
            </Link> */}
              {/* {a.Status < 3 && ( */}
              <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal2"
                onClick={() => quotationCopy(a.Invoice_id)}
              >
                <i className="mdi mdi-note-outline" />
              </button>
              {/* )} */}

              {/* {+a.Status == 0 && ( */}
              <button
                type="button"
                onClick={() => quotationConfirmation(a.Invoice_id)}
              >
                {" "}
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
              {/* )} */}
              {/* {+a.Status == 1 && ( */}
              <button
                data-bs-toggle="modal"
                data-bs-target="#modalAdjustBox"
                type="button"
                onClick={() => inventoryBoxes(a.Invoice_id)}
              >
                {/* <i className="ps-2 mdi mdi-pencil" /> */}
                <svg
                  className="SvgQuo"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <title>truck-check-outline</title>
                  <path d="M18 18.5C18.83 18.5 19.5 17.83 19.5 17C19.5 16.17 18.83 15.5 18 15.5C17.17 15.5 16.5 16.17 16.5 17C16.5 17.83 17.17 18.5 18 18.5M19.5 9.5H17V12H21.46L19.5 9.5M6 18.5C6.83 18.5 7.5 17.83 7.5 17C7.5 16.17 6.83 15.5 6 15.5C5.17 15.5 4.5 16.17 4.5 17C4.5 17.83 5.17 18.5 6 18.5M20 8L23 12V17H21C21 18.66 19.66 20 18 20C16.34 20 15 18.66 15 17H9C9 18.66 7.66 20 6 20C4.34 20 3 18.66 3 17H1V6C1 4.89 1.89 4 3 4H17V8H20M3 6V15H3.76C4.31 14.39 5.11 14 6 14C6.89 14 7.69 14.39 8.24 15H15V6H3M5 10.5L6.5 9L8 10.5L11.5 7L13 8.5L8 13.5L5 10.5Z" />
                </svg>
              </button>
              {/* )} */}
              {/* {+a.Status == 2 && ( */}
              <button
                data-bs-toggle="modal"
                data-bs-target="#modalAdjustBox1"
                type="button"
                onClick={() => inventoryBoxes(a.Invoice_id)}
              >
                <svg
                  className="SvgQuo"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <title>airport</title>
                  <path d="M14.97,5.92C14.83,5.41 14.3,5.1 13.79,5.24L10.39,6.15L5.95,2.03L4.72,2.36L7.38,6.95L4.19,7.8L2.93,6.82L2,7.07L3.66,9.95L14.28,7.11C14.8,6.96 15.1,6.43 14.97,5.92M21,10L20,12H15L14,10L15,9H17V7H18V9H20L21,10M22,20V22H2V20H15V13H20V20H22Z" />
                </svg>
              </button>
              {/* // )} */}
              {/* {+a.Status == 4 && ( */}
              <button
                // data-bs-toggle="modal"
                // data-bs-target="#modalAdjustBox1"
                // type="button"
                onClick={() => openPdf(a.document)}
              >
                <i class="mdi mdi-download"></i>
              </button>
              {/* )} */}
              {/* {+a.Status == 3 && ( */}
              <button
                onClick={() => handleEditClick1(a.Invoice_id)}
                // data-bs-toggle="modal"
                // data-bs-target="#modalAdjustBox3"
                type="button"
              >
                <svg
                  className="SvgQuo"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <title>airplane-check</title>
                  <path d="M15.97 13.83C15.08 14.35 14.34 15.09 13.82 16L11.55 11.63L7.66 15.5L8 18L6.95 19.06L5.18 15.87L2 14.11L3.06 13.05L5.54 13.4L9.43 9.5L2 5.62L3.41 4.21L12.61 6.33L16.5 2.44C17.08 1.85 18.03 1.85 18.62 2.44C19.2 3.03 19.2 4 18.62 4.56L14.73 8.45L15.97 13.83M21.34 15.84L17.75 19.43L16.16 17.84L15 19L17.75 22L22.5 17.25L21.34 15.84Z" />
                </svg>
              </button>
              {/* // )} */}
              {/* {+a.Status >= 2 && ( */}
              <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#modalClaim"
                onClick={() => boxMinutes(a.Order_ID, a)}
              >
                <svg
                  className="SvgQuo"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <title>text-box-minus</title>
                  <path d="M22,17V19H14V17H22M12,17V15H7V17H12M17,11H7V13H14.69C13.07,14.07 12,15.91 12,18C12,19.09 12.29,20.12 12.8,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H19A2,2 0 0,1 21,5V12.8C20.12,12.29 19.09,12 18,12L17,12.08V11M17,9V7H7V9H17Z" />
                </svg>
              </button>
              {/* )} */}
              {/* {+a.Status >= 3 && ( */}
              <button
                type="button"
                onClick={() => pdfSelectedType(a.Consignee_id, a)}
              >
                {/* <svg
                    className="SvgQuo"
                    fill="#203764"
                    height="200px"
                    width="200px"
                    viewBox="0 0 512 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g>
                      <polygon points="433.959,121.468 433.959,464.377 171.29,464.377 171.29,512 481.582,512 481.582,121.468" />
                      <polygon points="231.944,0 231.906,0 231.906,93.559 325.503,93.559" />
                      <polygon points="355.92,60.734 355.92,386.337 100.853,386.337 100.853,433.96 403.542,433.96 403.542,60.734" />
                      <polygon points="201.489,123.976 201.489,0 30.418,0 30.418,355.919 325.503,355.919 325.503,123.976" />
                    </g>
                  </svg> */}
                <svg
                  className=" "
                  version="1.0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="22px"
                  height="22px"
                  viewBox="0 0 350 350"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g
                    transform="translate(0.000000,344.000000) scale(0.100000,-0.100000)"
                    fill="#203764"
                    stroke="none"
                  >
                    <path d="M1291 2913 c-19 -16 -21 -30 -23 -132 l-3 -115 -219 -37 c-270 -47 -265 -44 -249 -156 6 -43 11 -78 10 -79 -1 0 -96 -33 -212 -73 -203 -70 -245 -92 -245 -127 0 -33 274 -780 292 -796 15 -14 24 -15 39 -8 10 6 19 17 19 24 0 8 -61 184 -136 391 -74 208 -134 378 -132 380 2 1 90 32 196 68 135 47 194 63 197 54 2 -6 65 -372 140 -811 75 -440 141 -808 146 -817 5 -10 18 -20 28 -24 11 -3 167 19 346 50 180 31 332 54 338 52 5 -1 -165 -66 -378 -143 -213 -76 -391 -140 -394 -142 -4 -1 -71 179 -151 400 -79 222 -148 409 -153 416 -13 17 -42 15 -57 -3 -11 -13 13 -86 135 -428 81 -226 154 -422 161 -434 7 -12 22 -24 33 -28 12 -4 253 78 658 223 733 264 727 262 1016 262 181 0 186 1 201 22 14 20 16 118 16 859 l0 836 -175 167 -174 166 -625 0 c-579 0 -625 -1 -645 -17z m1189 -177 c0 -195 12 -206 220 -206 l130 0 0 -790 0 -790 -745 0 -745 0 -2 376 c-3 339 -5 378 -20 387 -12 8 -21 7 -32 -2 -14 -12 -16 -60 -16 -407 0 -344 2 -395 16 -408 13 -14 61 -16 367 -17 215 0 342 -4 327 -9 -32 -11 -801 -143 -806 -138 -2 2 -72 403 -155 892 -119 691 -150 889 -140 895 7 5 88 20 179 35 92 15 177 30 189 33 l23 5 2 -383 3 -384 30 0 30 0 3 513 2 512 570 0 570 0 0 -114z m260 -80 l44 -46 -112 0 -112 0 0 106 0 106 68 -60 c37 -33 87 -81 112 -106z" />
                    <path d="M1529 2364 c-9 -11 -10 -20 -2 -32 9 -16 58 -17 568 -17 510 0 559 1 568 17 8 12 7 21 -2 32 -12 14 -74 16 -566 16 -492 0 -554 -2 -566 -16z" />
                    <path d="M1536 2104 c-19 -19 -20 -36 -4 -52 17 -17 1109 -17 1126 0 18 18 14 46 -7 58 -13 6 -207 10 -560 10 -477 0 -541 -2 -555 -16z" />
                    <path d="M1530 1835 c-16 -19 -4 -52 23 -59 29 -8 1055 -8 1084 0 27 7 39 40 23 59 -18 22 -1112 22 -1130 0z" />
                    <path d="M1529 1564 c-9 -11 -10 -20 -2 -32 9 -16 60 -17 565 -20 597 -2 589 -3 573 48 -6 20 -11 20 -564 20 -497 0 -560 -2 -572 -16z" />
                    <path d="M1536 1304 c-9 -8 -16 -19 -16 -24 0 -5 7 -16 16 -24 14 -14 79 -16 563 -16 412 0 550 3 559 12 18 18 14 46 -7 58 -13 6 -207 10 -560 10 -477 0 -541 -2 -555 -16z" />
                  </g>
                </svg>
              </button>
              {/* )} */}
            </div>
          </>
        ),
      },
    ],
    [data, form]
  );
  // const invoiceFirstpdf=()=>{
  //   navigate("/invoicefirsttpdf")
  // }
  const clearData = () => {
    setUseAgreedPricing(false);
    setItemDetails(false);
    setCbm(true);
    setExchangeRate(false);
    setSelectedInvoice("Client");
  };
  const generatePdf = async () => {
    const invoiceResponse = await axios.post(
      `${API_BASE_URL}/InvoicePdfDetails`,
      {
        order_id: filterData1?.Order_ID,
        AgreedPrice: useAgreedPricing ? 1 : 0,
        CustomName: itemDetails ? 1 : 0,
        SHOWGWCBM: cbm ? 1 : 0,
        InvoiceName: selectedInvoice,
        ShowFXRate: exchangeRate ? 1 : 0,
        DeliveryTerms: selectedDeliveryTerm,
      }
    );
    console.log(invoiceResponse.data);
    const headers = invoiceResponse?.data?.tableHeaders || {};
    const rowsData = invoiceResponse?.data?.tableRow1 || [];
    const head = [Object.values(headers)];
    const body = rowsData.map((row) => {
      const sortedKeys = Object.keys(row)
        .filter((key) => key.startsWith("COL"))
        .sort(
          (a, b) => Number(a.replace("COL", "")) - Number(b.replace("COL", ""))
        );
      return sortedKeys.map((key) => row[key]);
    });
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
      const invoiceNumber =
        invoiceResponse?.data?.invoiceHeader?.Invoice_Number || "";
      doc.text(invoiceNumber, 130, 9.5);
      // **************************************************
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const maxWidthLeft = 30; // Maximum width in pixels
      let yLeft = 16;
      const yIncrementLeft = 1; // Adjust this value based on your spacing requirements
      const textDataLeft = [
        {
          label: invoiceResponse?.data?.orderMetaLabels["Order : "],
          value: `${invoiceResponse?.data?.orderMetaValues.Order_Number}`,
        },
        {
          label: invoiceResponse?.data?.orderMetaLabels["TT Ref : "],
          value: `${invoiceResponse?.data?.orderMetaValues.Shipment_ref}`,
        },
        {
          label: invoiceResponse?.data?.orderMetaLabels["PO Number : "],
          value: `${invoiceResponse?.data?.orderMetaValues.Customer_ref}`,
        },
        {
          label: invoiceResponse?.data?.transportTypeLabel?.awb,
          value: ``,
        },
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
        {
          label: `${invoiceResponse?.data?.dateLabels["Date : "]}`,
          value: `${formatDate(invoiceResponse?.data?.dateValues.created)}`,
        },
        {
          label: `${invoiceResponse?.data?.dateLabels["Due Date : "]}`,
          value: invoiceResponse?.data?.dateValues?.["Due Date"]
            ? formatDate(invoiceResponse.data.dateValues["Due Date"])
            : "",
        },
        {
          label: `${invoiceResponse?.data?.dateLabels["Ship Date : "]}`,
          value: `${formatDate(invoiceResponse?.data?.dateValues.Ship_date)}`,
        },
        {
          label: "Delivery By :",
          value: invoiceResponse?.data?.transportInfo?.Delivery_By || "",
        },
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
        ? `${filterData1?.Consignee_name} (${filterData1?.consignee_tax_number})`
        : `${filterData1?.Client_name} (${filterData1?.client_tax_number})`,
      selectedInvoice === "Consignee"
        ? `${filterData1?.consignee_address}`
        : `${filterData1?.client_address}`,
      selectedInvoice === "Consignee"
        ? `${filterData1?.consignee_email}/${filterData1?.consignee_phone}`
        : `${filterData1?.client_email} / ${filterData1?.client_phone}`,
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
      `${filterData1?.Consignee_name}(${filterData1?.consignee_tax_number})`,
      `${filterData1?.consignee_address}`,
      `${filterData1?.consignee_email}/${filterData1?.consignee_phone}`,
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

    const maxRowsPerPageNew = 23;
    let remainingRows = [...body];
    let tableStartYNew = tableStartY;
    while (remainingRows.length > 0) {
      const rowsToAdd = remainingRows.slice(0, maxRowsPerPageNew);
      remainingRows = remainingRows.slice(maxRowsPerPageNew);
      doc.autoTable({
        head,
        body: rowsToAdd,
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
    doc.text(
      `${formatterNo.format(invoiceResponse?.data?.TotalDetails?.total_box)}`,
      38,
      finalY + 1
    );
    doc.text("Total Packages :", 7, finalY + 5.5);
    doc.text(
      `${formatterNo.format(invoiceResponse?.data?.TotalDetails?.packages)}`,
      38,
      finalY + 5.5
    );
    doc.text("Total Items :", 7, finalY + 10);
    doc.text(
      `${formatterNo.format(invoiceResponse?.data?.TotalDetails?.Items)}`,
      38,
      finalY + 10
    );
    if (exchangeRate) {
      doc.text("Exchange Rate : ", 7, finalY + 14.5);
      doc.text(`${newFormatter.format(data?.fx_rate)}`, 38, finalY + 14.5);
    }
    doc.text(`Total Net Weight : `, 72, finalY + 1);
    doc.text(
      `${formatterThree.format(
        invoiceResponse?.data?.TotalDetails?.Net_Weight
      )}`,
      110,
      finalY + 1
    );
    if (cbm) {
      doc.text("Total Gross Weight :", 72, finalY + 5.5);
      doc.text(
        `${formatterNo.format(
          invoiceResponse?.data?.TotalDetails?.Gross_weight
        )}`,
        110,
        finalY + 5.5
      );
      doc.text("Total CBM : ", 72, finalY + 10);
      doc.text(`${invoiceResponse?.data?.TotalDetails?.CBM}`, 110, finalY + 10);
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
    const inputFieldValue = invoiceResponse.data?.deliveryNote.deliveryNote; // Get input field value
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
    await uploadPDF1(pdfBlob);
  };
  const uploadPDF1 = async (pdfBlob) => {
    // Generate a unique date-time string
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;

    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${filterData1?.Invoice_Number || "default"}_Invoice_${dateTime}.pdf`
    );

    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${
            filterData1?.Invoice_Number || "default"
          }_Invoice_${dateTime}.pdf`
        );
      } else {
        console.log("Failed to upload PDF");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };
  return (
    <>
      <Card
        title="Invoice Management"
        // endElement={
        // <button
        //   type="button"
        //   onClick={() => navigate("")}
        //   className="btn button btn-info"
        // >
        //   Create
        // </button>
        // }
      >
        <TableView columns={columns} data={data} />
      </Card>
      {/* Modal for Stock Adjustment */}
      <div
        className="modal fade"
        id="modalAdjustBox"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modalShipTo">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Invoice Adjust Weight
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
              <div className="form-group col-lg-12 formCreate">
                <h6> Invoice Adjust Weight</h6>
                <div>
                  <input
                    type="text"
                    name="quantity"
                    value={quantity}
                    onChange={handleChange}
                    placeholder="124"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={uploadData}
                className="btn mb-0 btn-primary"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for Stock Adjustment */}
      <div
        className="modal fade"
        id="modalAdjustBox1"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel1"
        aria-hidden="true"
      >
        <div className="modal-dialog modalShipTo">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel1">
                Call Invoice Shipped
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
              <div className="form-group col-lg-12 formCreate">
                <h6> Upload Pdf</h6>
                <div>
                  <input
                    type="file"
                    name="uploadImage"
                    accept=".pdf"
                    onChange={handleChange1}
                  />
                  {errorMessage && (
                    <p style={{ color: "red" }}>{errorMessage}</p>
                  )}
                  {selectedFile && <p>Selected file: {selectedFile.name}</p>}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={uploadData1}
                className="btn mb-0 btn-primary"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModal2"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog InvoiceModal">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Set Invoice Note
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <textarea
                value={notes}
                onChange={handleChange2}
                placeholder="Type Notes Here"
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary "
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={dataSubmit}
                className="btn btn-primary"
              >
                ok
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="modalAdjustBox3"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modalShipTo">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel1">
                Upload Invoice Shipe
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
              <div className="form-group col-lg-12 formCreate">
                <h6> Upload Pdf</h6>
                <div>
                  <input
                    type="file"
                    name="uploadImage"
                    accept=".pdf"
                    onChange={handleChange21}
                  />
                  {errorMessage && (
                    <p style={{ color: "red" }}>{errorMessage}</p>
                  )}
                  {selectedFile1 && <p>Selected file: {selectedFile1.name}</p>}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={uploadData2}
                className="btn mb-0 btn-primary"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="modalClaim"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modalShipTo modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Claim
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeButton}
              >
                <i className="mdi mdi-close"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="claimParent">
                <div>
                  <strong>Invoice Number : </strong>
                  <span>{data1?.Invoice_number}</span>
                </div>
                <div>
                  <strong>Client :</strong> <span>{data1?.Client_name}</span>
                </div>
                <div>
                  <strong>Ship To :</strong>{" "}
                  <span>{data1?.Consignee_name}</span>
                </div>
                <div>
                  <strong>Currency : </strong> <span>{data1?.currency}</span>
                </div>
              </div>
              <div className="uploadFileMain">
                <div>
                  <p>
                    <strong>Claim Date</strong>
                  </p>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                  />
                </div>
                <div className="uploadFile">
                  <p>
                    <strong>Upload</strong>
                  </p>
                  <div className="parentInsideUp">
                    <div>
                      <input type="file" onChange={handleFileChangeInv} />
                    </div>
                    {invImage && (
                      <div>
                        <img
                          src={invImage}
                          alt="Uploaded"
                          style={{ width: "300px", height: "auto" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="tableClaim">
                <table>
                  <thead>
                    <tr>
                      <th>ITF</th>
                      <th>Brand Name</th>
                      <th>Quantity</th>
                      <th>Unit</th>
                      <th>Number Box</th>
                      <th>Claim Quantity</th>
                      <th>Unit</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details?.map((item, i) => (
                      <tr key={i}>
                        <td>{item.ITF_name}</td>
                        <td>{item.brand_name}</td>
                        <td>{item.itf_quantity}</td>
                        <td>{item.itf_unit_name}</td>
                        <td>{item.Number_of_boxes}</td>
                        <td>
                          <input
                            type="number"
                            value={paidAmounts[item.id_id] || ""}
                            onChange={(e) =>
                              handlePaidAmountChange(item.id_id, e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <td>
                            <div className="selectInvoiceView">
                              <select
                                name="unit_id"
                                value={units[item.id_id] || ""} // Ensure it uses `units` state
                                onChange={(e) =>
                                  handleUnitChange(item.id_id, e.target.value)
                                }
                              >
                                <option value="" disabled>
                                  Select an option
                                </option>{" "}
                                {/* Placeholder option */}
                                {unit?.map((unit) => (
                                  <option
                                    key={unit.unit_id}
                                    value={unit.unit_id}
                                  >
                                    {unit.unit_name_en}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>
                        </td>

                        <td>
                          <input
                            type="number"
                            value={amounts[item.id_id] || ""}
                            onChange={(e) =>
                              handleAmountChange(item.id_id, e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit1}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal show={show} onHide={handleClose} className="exampleQuo">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Freight or Transport Error
            </h1>
            <button
              style={{ color: "#fff", fontSize: "30px" }}
              type="button"
              onClick={closeIcon}
            >
              <i class="mdi mdi-close"></i>
            </button>
          </div>
          <div className="modal-body">
            <div className="eanCheck">
              <p style={{ color: "#631f37" }}>
                {massageShow ? massageShow : ""}
              </p>
            </div>
          </div>
        </div>
      </Modal>

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
                    {/* <div className="invoiceModal">
                      <h6>Delivery Terms - </h6>
                      <input
                        type="radio"
                        id="cif"
                        name="delivery_term"
                        value="CIF"
                        checked={selectedDeliveryTerm === "CIF"}
                        onChange={handleChangeDelivery}
                      />
                      <label htmlFor="cif">CIF</label>
                      <input
                        type="radio"
                        id="cnf"
                        name="delivery_term"
                        value="CNF"
                        checked={selectedDeliveryTerm === "CNF"}
                        onChange={handleChangeDelivery}
                      />
                      <label htmlFor="cnf">CNF</label>
                      <input
                        type="radio"
                        id="dap"
                        name="delivery_term"
                        value="DAP"
                        checked={selectedDeliveryTerm === "DAP"}
                        onChange={handleChangeDelivery}
                      />
                      <label htmlFor="dap">DAP</label>
                      <input
                        type="radio"
                        id="fob"
                        name="delivery_term"
                        value="FOB"
                        checked={selectedDeliveryTerm === "FOB"}
                        onChange={handleChangeDelivery}
                      />
                      <label htmlFor="fob">FOB</label>
                    </div> */}
                    <div className="invoiceModal">
                      <h6>Delivery Terms - </h6>
                      {deliveryList?.map((term) => (
                        <div key={term.id}>
                          <input
                            type="radio"
                            id={`term-${term.id}`}
                            name="delivery_term"
                            value={term.id}
                            checked={selectedDeliveryTerm === term.id}
                            onChange={handleChangeDelivery}
                          />
                          <label htmlFor={`term-${term.id}`}>
                            {term.Incoterms}
                          </label>
                        </div>
                      ))}
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

export default Invoice;
