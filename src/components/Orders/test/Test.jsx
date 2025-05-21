import { useForm } from "@tanstack/react-form";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useMemo, useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { API_IMAGE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import MySwal from "../../../swal";
import { ComboBox } from "../../combobox";
import { TableView } from "../../table";
import logo from "../../../assets/logoT.jpg";
import logo1 from "../../../assets/logoNew.png";
import NotoSansThaiRegular from "../../../assets/fonts/NotoSansThai-Regular-normal";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { Button, Modal } from "react-bootstrap";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CloseIcon from "@mui/icons-material/Close";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { FaCalendarAlt } from "react-icons/fa"; // Import calendar icon
const Test = () => {
  const [isLoading, setIsLoading] = useState(false);

  const CustomInput = ({ value, onClick }) => (
    <div
      className="custom-input"
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
    >
      <input
        type="text"
        value={value}
        readOnly
        style={{
          padding: "10px",
          paddingLeft: "35px",
          width: "250px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          marginBottom: "unset !important",
        }}
      />
      <FaCalendarAlt
        style={{
          position: "absolute",
          right: "10px",
          fontSize: "18px",
          color: "#888",
          marginBottom: "unset !important",
        }}
      />
    </div>
  );
  const loadingModal = MySwal.mixin({
    title: "Loading...",
    didOpen: () => {
      MySwal.showLoading();
    },
    showCancelButton: false,
    showConfirmButton: false,
    allowOutsideClick: false,
  });
  const [selectedLinerId, setSelectedLinerId] = useState(null);
  const [totalDetails, setTotalDetails] = useState("");
  const [orderId, setOrderId] = useState("");
  const [deleteOrderId, setDeleteOrderId] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [startDate1, setStartDate1] = useState(null);
  const [startDate2, setStartDate2] = useState(null);
  const [Journey, setJourney] = useState([]);
  const [notes, setNotes] = useState("");
  const [notes1, setNotes1] = useState("");
  const [notes2, setNotes2] = useState("");
  const [show, setShow] = useState(false);
  const [stock, setStock] = useState("");

  const handleClose = () => setShow(false);
  const [journeyId, setJourneyId] = useState(null);
  console.log(selectedLinerId);
  const navigate = useNavigate();
  // const { data, refetch } = useQuery("getOrders");

  const handleChange5 = (e) => {
    setInputValue(e.target.value); // Update state with the input value
  };
  const [status, setStatus] = useState("");

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const [data, setData] = useState([]);

  // const orderData1 = () => {
  //   axios
  //     .get(`${API_BASE_URL}/NewgetOrders`, {
  //       params: {
  //         status, // This will pass the selected status value
  //       },
  //     })
  //     .then((res) => {
  //       setData(res.data.data || []);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching orders:", error);
  //     });
  // };

  // Optionally call the API on component mount or when the status changes
  // useEffect(() => {
  //   if (status !== "") {
  //     orderData1();
  //   }
  // }, [status]);
  const orderData = () => {
    axios.get(`${API_BASE_URL}/NewgetOrders`).then((res) => {
      setData(res.data.data || []);
    });
  };
  useEffect(() => {
    orderData();
  }, []);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const { data: liner } = useQuery("getLiner");

  const [id, setID] = useState("");
  const [consigneeId, setConsigneeId] = useState("");
  const oneQoutationDAta = () => {
    axios
      .get(`${API_BASE_URL}/NewgetOrdersById`, {
        params: {
          order_id: id,
        },
      })
      .then((response) => {
        console.log(response);
        setTotalDetails(response.data.data);
        setStartDate(new Date(response.data.data.load_date));
        setStartDate1(new Date(response.data.data.Ship_date));
        setStartDate2(new Date(response.data.data.Arrival_date));
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    oneQoutationDAta();
  }, [id]);
  useEffect(() => {
    oneQoutationDAta();
  }, []);
  const handleStartDateChange = (date) => {
    console.log(date);
    setStartDate(date);
  };
  const handleStartDateChange1 = (date) => {
    console.log(date);
    setStartDate1(date);
  };
  const handleStartDateChange2 = (date) => {
    console.log(date);
    setStartDate2(date);
  };
  // const totalDetails = useMemo(() => {
  //   console.log(totalDetails);
  //   console.log(id);

  //   // return totalDetails?.find((v) => +v.Order_ID == +id);
  // }, [id, totalDetails]);

  console.log(totalDetails);
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    if (totalDetails) {
      setInputValue(totalDetails?.Customer_ref || ""); // Update inputValue when totalDetails changes
    }
  }, [totalDetails]);
  const form = useForm({
    defaultValues: {
      Liner: totalDetails?.Liner_ID || "",
      journey_number: totalDetails?.journey_number || "",
      Customer_ref: inputValue,
      bl: totalDetails?.BL || "",
      // Customer_ref: totalDetails?.Customer_ref || "",
      Load_date: moment(startDate).format("YYYY-MM-DD"),
      Load_time: totalDetails?.Load_time || "",
      Ship_date: moment(startDate1).format("YYYY-MM-DD"),
      ETD: totalDetails?.ETD || "",
      Arrival_date: moment(startDate2).format("YYYY-MM-DD"),
      ETA: totalDetails?.ETA || "",
    },

    onSubmit: async ({ value }) => {
      if (totalDetails?.Order_ID) {
        try {
          await axios.post(`${API_BASE_URL}/NewupdateOrderFreight`, {
            order_id: totalDetails?.Order_ID,
            consignee_id: consigneeId,
            ...value,
          });
          oneQoutationDAta();
          toast.success("Order update successfully");
          setInputValue("");
          orderData();
          refetch();
        } catch (e) {
          console.log(e);
          // toast.error("Something went wrong");
        }
      }
      closeModal();
    },
  });

  console.log(form);
  useEffect(() => {
    if (selectedLinerId !== null || totalDetails?.Liner_ID) {
      const linerId =
        selectedLinerId !== null ? selectedLinerId : totalDetails?.Liner_ID;
      axios
        .post(`${API_BASE_URL}/getjourneyNumber`, { liner_id: linerId })
        .then((response) => {
          setJourney(response.data.data || []);
          console.log(response.data.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [selectedLinerId, totalDetails?.Liner_ID]);
  const closeModal = () => {
    setIsOpenModal(false);
    setInputValue("");
  };
  const openModal = (id = null, Consignee_ID) => {
    console.log(id);
    console.log(Consignee_ID);
    setID(id);
    setConsigneeId(Consignee_ID);

    form.reset();
    setIsOpenModal(true);
  };

  const CheckBox = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/ApproveOrder`, { order_id: id });
      toast.success("Order Approved successfully");
      orderData();
    } catch (e) {
      toast.error("Something went wrong");
    }
  };
  const handleJourneySelection = async (selectedJourneyId) => {
    const journey_id = selectedJourneyId; // assuming selectedJourneyId comes directly as the ID
    const order_id = id; // Assuming 'id' is already storing the order_id you need

    console.log(journey_id);
    console.log(order_id);

    setJourneyId(selectedJourneyId);
    try {
      // Sending a POST request to the server with journey_id and order_id
      const response = await axios.post(
        `${API_BASE_URL}/NewgetorderFreightDetails`,
        {
          journey_id,
          order_id,
        }
      );
      // Logging the entire response object to see all details
      console.log("Response from NewgetorderFreightDetails:", response);

      // Show success message

      // Check if data is available and update form fields
      const data = response.data;
      if (data) {
        // Log the data object to see its structure and values
        console.log("Received data:", data.data);

        // Updating form fields with the received data
        form.setFieldValue("Load_time", data.data.Load_time);
        form.setFieldValue("ETD", data.data.ETD);
        form.setFieldValue("ETA", data.data.ETA);
        form.setFieldValue(
          "Ship_date",
          new Date(data.data.Freight_ship_date).toISOString().split("T")[0]
        );
        form.setFieldValue(
          "Arrival_date",
          new Date(data.data.Freight_arrival_date).toISOString().split("T")[0]
        );
      } else {
        // Log if data is missing or undefined
        console.log("No data received in response");
      }
    } catch (error) {
      // Log the error if the request fails
      console.error("Failed to fetch freight details:", error);
      toast.error("Error fetching freight details");
    }
  };

  const handleLoadDateSelection = async (loadDate) => {
    const journey_id = journeyId || totalDetails?.Freight_journey_number; // assuming selectedJourneyId comes directly as the ID
    const order_id = id; // Assuming 'id' is already storing the order_id you need
    const load_date = loadDate;
    try {
      // Sending a POST request to the server with journey_id and order_id
      const response = await axios.post(
        `${API_BASE_URL}/getOrderFreightDetails`,
        {
          journey_id,
          order_id,
          load_date,
        }
      );
      // Logging the entire response object to see all details
      console.log("Response from getOrderFreightDetails:", response);

      // Show success message

      // Check if data is available and update form fields
      const data = response.data;
      if (data) {
        // Log the data object to see its structure and values
        console.log("Received data:", data.data);

        // Updating form fields with the received data
        form.setFieldValue("Load_time", data.data.Load_time);
        form.setFieldValue("ETD", data.data.ETD);
        form.setFieldValue("ETA", data.data.ETA);
        form.setFieldValue(
          "Ship_date",
          new Date(data.data.Freight_ship_date).toISOString().split("T")[0]
        );
        form.setFieldValue(
          "Arrival_date",
          new Date(data.data.Freight_arrival_date).toISOString().split("T")[0]
        );
      } else {
        // Log if data is missing or undefined
        console.log("No data received in response");
      }
    } catch (error) {
      // Log the error if the request fails
      console.error("Failed to fetch freight details:", error);
      toast.error("Error fetching freight details");
    }
  };
  const handleEditClick = async (order_id) => {
    loadingModal.fire();
    try {
      const response = await axios.post(`${API_BASE_URL}/copyOrder`, {
        order_id: order_id,
        user: localStorage.getItem("id"),
        // Other data you may need to pass
      });
      console.log("API response:", response);
      loadingModal.close();
      orderData();
      toast.success(" Copy Order Procedure successfully");
      // Handle the response as needed
    } catch (error) {
      console.error("API call error:", error);
      loadingModal.close();
      toast.error("Failed to Copy Order Procedure");
    }
  };
  const handleChange2 = (e) => {
    setNotes(e.target.value);
  };
  const handleChange3 = (e) => {
    setNotes1(e.target.value);
  };
  const dataSubmit = () => {
    axios
      .post(`${API_BASE_URL}/OrderNotes`, {
        order_id: orderId,
        notes: notes,
      })
      .then((response) => {
        console.log(response);
        let modalElement = document.getElementById("exampleModal");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        console.log(response);
        toast.success("Order Note Updated Successfully", {
          autoClose: 1000,
          theme: "colored",
        });
        orderData();
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
  const dataSubmit1 = () => {
    console.log(notes1);
    axios
      .post(`${API_BASE_URL}/NewdeleteOrder`, {
        id: deleteOrderId,
        user_id: localStorage.getItem("id"),
        NOTES: notes1,
      })
      .then((response) => {
        setStock(response.data.message.Message_EN);
        setNotes1("");
        console.log(response.data.message.Message_EN);
        let modalElement = document.getElementById("exampleModal1");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        if (response.data.success) {
          toast.success("Order Deleted Successfully", {
            autoClose: 1000,
            theme: "colored",
          });
        } else {
          setShow(true);
        }
        console.log(response);
        orderData();
        setNotes1("");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const customInvoicePdf = async (a) => {
    try {
      let messageSet = "";
      let pdfResponse = null;
      // First API Call: Invoice Procedure
      const invoiceResponse = await axios.post(
        `${API_BASE_URL}/NewGetOrderPdfDetails`,
        {
          order_id: a?.Order_ID,
        }
      );
      console.log(invoiceResponse);

      // Second API Call: Fetch Order Data
      const filterData = await axios.get(`${API_BASE_URL}/NewgetOrdersById`, {
        params: { order_id: a?.Order_ID },
      });
      console.log(filterData?.data?.data);

      // Third API Call: Fetch PDF delivery details
      try {
        const deliveryApi = await axios.post(
          `${API_BASE_URL}/Newpdf_delivery_by`,
          {
            order_id: a?.Order_ID,
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
      // Fourth API Call: Fetch Invoice PDF Details
      try {
        pdfResponse = await axios.post(`${API_BASE_URL}/NeworderPdfTable`, {
          order_id: a?.Order_ID,
        });

        console.log(pdfResponse);
      } catch (error) {
        console.log(error);
      }

      // Generate the PDF (if needed)
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
      const formatterThree = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      });
      const formatterGross = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
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
        const formatDate1 = (dateString) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          return date.toLocaleDateString("en-GB"); // 'en-GB' format is DD/MM/YYYY
        };
        const textDataLeft = [
          {
            label: "Order :",
            value: `${invoiceResponse?.data?.orderResults?.Order_Number}`,
          },
          {
            label: "Loading Date :",
            value: `${formatDate1(
              invoiceResponse?.data?.orderResults?.load_date
            )}`,
          },
          {
            label: "Shipment Ref :",
            value: `${filterData?.data?.data?.Shipment_ref}`,
          },
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
          {
            label: "AWB/BL:",
            value: `${invoiceResponse?.data?.freightDetailsResults?.awb}`,
          },
          {
            label: "Ship Date: ",
            value: `${formatDate1(
              invoiceResponse?.data?.freightDetailsResults?.ship_date
            )}`,
          },
          { label: "Delivery By:", value: `${messageSet}` },
        ];

        textDataRight.forEach((item) => {
          const labelXRight = 100;
          const valueXRight = 127;

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
      const startX2 = 100;
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
      const rows = pdfResponse?.data?.results?.map((item, index) => ({
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
          value: `${filterData?.data?.data?.O_Box} Boxes /${filterData?.data?.data?.O_Items} Item`,
        },
        {
          label: "Total Net Weight: ",
          value: `${formatterThree.format(filterData?.data?.data?.O_NW)}`,
        },
        {
          label: "Total Gross Weight:",
          value: ` ${formatterGross.format(filterData?.data?.data?.O_GW)}`,
        },
        {
          label: "Total CBM:",
          value: `${newFormatter1.format(filterData?.data?.data?.O_CBM)}`,
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
          value: `${noFormatter.format(filterData?.data?.data?.O_Box)}`,
        },
        {
          label: "FOB (THB): ",
          value: `${newFormatter5.format(filterData?.data?.data?.O_FOB)}`,
        },
        {
          label: "Air Freight:",
          value: `${noFormatter.format(filterData?.data?.data?.O_Freight)}`,
        },
        {
          label: "Exchange Rate:",
          value: `${fourFormatter.format(filterData?.data?.data?.O_FX_Rate)}`,
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
      const formatter = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      const totalTHBText = formatter.format(filterData?.data?.data?.O_CNF);
      const totalCurrencyText = formatter.format(
        filterData?.data?.data?.O_CNF_FX
      );

      const totalTHBWidth = doc.getTextWidth(totalTHBText);
      const totalCurrencyWidth = doc.getTextWidth(totalCurrencyText);

      const maxWidth = 50;
      const startX_THB = 150 + maxWidth - totalTHBWidth;
      const startX_Currency = 150 + maxWidth - totalCurrencyWidth;

      doc.text("Total THB", 147, endY + 4);
      doc.text(totalTHBText, startX_THB, endY + 4);
      doc.setFillColor(32, 55, 100);
      doc.rect(147, endY + 6, 55.5, 0.5, "FD");
      doc.text(
        `Total ${invoiceResponse?.data?.currencyResults?.currency}`,
        147,
        endY + 11
      );
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
      await uploadPDF2(pdfBlob, a);
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
  const uploadPDF2 = async (pdfBlob, a) => {
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;
    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${a?.Order_Number || "default"}_Custom_Test_${dateTime}.pdf`
    );

    setIsLoading(true);
    loadingModal.fire();
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${a?.Order_Number}_Custom_Test_${dateTime}.pdf`
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
  const performaOrder = async (a) => {
    try {
      let messageSet = "";
      let messageNote = "";
      // First API Call: Invoice Procedure
      const invoiceResponse = await axios.get(
        `${API_BASE_URL}/NewproformaMain_Order`,
        {
          params: { order_id: a?.Order_ID },
        }
      );
      console.log(invoiceResponse);

      // Second API Call: Fetch Order Data
      const filterData = await axios.get(`${API_BASE_URL}/NewgetOrdersById`, {
        params: { order_id: a?.Order_ID },
      });
      console.log(filterData?.data?.data);

      // Third API Call: Fetch PDF delivery details
      try {
        const deliveryApi = await axios.post(
          `${API_BASE_URL}/Newpdf_delivery_by`,
          {
            order_id: a?.Order_ID,
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
      // Fourth API Call: Fetch Invoice PDF Details
      try {
        const pdfResponse = await axios.post(
          `${API_BASE_URL}/order_delivery_terms`,
          {
            Order_id: a?.Order_ID,
          }
        );

        console.log(pdfResponse);
      } catch (error) {
        console.log(error);
        if (error.response?.status === 400) {
          messageNote = error.response.data.message;
        }
      }

      // Generate the PDF (if needed)
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
        doc.text(`${invoiceResponse?.data?.Company_Address.Line_1}`, 30, 8);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`${invoiceResponse?.data?.Company_Address.Line_2}`, 30, 12);
        const longTextOne = `${invoiceResponse?.data?.Company_Address.Line_3}`;
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
        doc.text(`Order: ${filterData?.data?.data?.Order_Number}`, 127, 12);
        doc.text(`TT Ref: ${filterData?.data?.data.Shipment_ref}`, 127, 16.5);
        doc.text(
          `Loading Date: ${formatDate(filterData?.data?.data.load_date)}`,
          127,
          20
        );
        doc.text(`Delivery By: ${messageSet ? messageSet : ""}`, 127, 24.5);
      };
      doc.setFillColor(32, 55, 100);
      doc.rect(7, 27, doc.internal.pageSize.width - 15, 0.5, "FD");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text("Invoice to", 7, 31.5);
      doc.text("Consignee Details", 127.2, 31.5);
      doc.setFillColor(32, 55, 100);
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

      const commonStartY = 36.3;

      // First set of texts (left side)
      const maxWidth1 = 72;
      const startX1 = 7;
      const lineHeight1 = 4.2;
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
      const startX2 = 127.2;
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
      await addLogoWithDetails(); // Wait for logo and details to be added
      const columns = [
        { header: "#", dataKey: "index" },
        { header: "Hs code", dataKey: "hs_code" },
        { header: "N.W (KG)", dataKey: "net_weight" },
        { header: "Box", dataKey: "Number_of_boxes" },
        { header: "Item Detail", dataKey: "ITF_Name" },
        { header: "QTY", dataKey: "itf_quantity" },
        { header: "Unit", dataKey: "Unit_Name" },
        { header: "Unit Price", dataKey: "Final_Price" },
        { header: "Line Total", dataKey: "line_total" },
      ];
      const rows = invoiceResponse?.data?.orderDetails?.map((item, index) => ({
        index: index + 1,
        hs_code: item.hs_code,
        net_weight: `${formatterNg.format(item.OD_NW)}`,
        Number_of_boxes: `${formatterNo.format(item.OD_Box)}`,
        ITF_Name: item.ITF_Name,
        itf_quantity: `${formatterNg.format(item.OD_QTY)}`,
        Unit_Name: item.Unit_Name,
        Final_Price: `${twoDecimal.format(item.OD_Final_price)}`,
        line_total: twoDecimal.format(item?.OD_QTY * item?.OD_Final_price),
      }));

      doc.autoTable({
        head: [columns.map((col) => col.header)],
        body: rows.map((row) => columns.map((col) => row[col.dataKey])),
        startY: tableStartY,
        headStyles: {
          fillColor: "#203764",
          textColor: "#FFFFFF",
        },
        bodyStyles: { valign: "top" },
        styles: {
          textColor: "#000000",
          cellWidth: "wrap",
          valign: "middle",
          lineWidth: 0.1,
          lineColor: "#203764",
          overflow: "linebreak",
          fontSize: 10, // Reduce font size if data is large
          minCellHeight: 8, // Ensures rows have a minimum height
        },
        columnStyles: {
          2: { halign: "right" },
          3: { halign: "center" },
          5: { halign: "right" },
          7: { halign: "right" },
          8: { halign: "right" },
        },
        margin: {
          left: 7,
          right: 7,
          top: 10,
          bottom: 10,
        },
        tableWidth: "auto", // Adjusts the table width to fit within the page
        pageBreak: "auto", // Automatically adds a new page if content exceeds page height
      });

      const finalY = doc.autoTable.previous.finalY + 4;
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(
        `Total Box: ${formatterNo.format(filterData?.data?.data?.O_Box)}`,
        7,
        finalY + 1
      );
      doc.text(
        `Total Items: ${formatterNo.format(filterData?.data?.data?.O_Items)}`,
        7,
        finalY + 5
      );
      doc.text(
        `Total Net Weight: ${formatterNg.format(filterData?.data?.data?.O_NW)}`,
        7,
        finalY + 9
      );
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      const PAGE_WIDTH = 210; // A4 page width in mm
      const MARGIN = 10; // margin from the right edge
      const label = "Total USD  CNF: ";
      const value = `${formatter5.format(filterData?.data?.data?.O_CNF_FX)}`;
      const labelWidth = doc.getTextWidth(label);
      const valueWidth = doc.getTextWidth(value);
      const xRight = PAGE_WIDTH - MARGIN - valueWidth;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(
        label,
        PAGE_WIDTH - MARGIN - labelWidth - valueWidth - 5,
        finalY + 1
      );
      // Draw the value
      doc.text(value, xRight, finalY + 1);
      doc.rect(147, finalY + 2, 55.5, 0.5, "FD");
      const longText = messageNote;
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
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const formatterNg = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });

  const formatterNo = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const formatter5 = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const twoDecimal = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const uploadPDF = async (pdfBlob, a) => {
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;
    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${a?.Order_Number || "default"}_Test_Proforma_${dateTime}.pdf`
    );

    setIsLoading(true);
    loadingModal.fire();
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${a?.Order_Number}_Test_Proforma_${dateTime}.pdf`
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

  const operationPdfTest = async (a) => {
    try {
      let messageSet = "";
      let messageNote = "";
      let deliveryApi = null; // Declare deliveryApi outside the try block
      // First API Call: Invoice Procedure

      const filterData = await axios.get(`${API_BASE_URL}/NewgetOrdersById`, {
        params: { order_id: a?.Order_ID },
      });
      console.log(filterData?.data?.data);

      // Third API Call: Fetch PDF delivery details
      try {
        deliveryApi = await axios.post(`${API_BASE_URL}/NewOrderPdfDetails`, {
          order_id: a?.Order_ID,
        });

        console.log(deliveryApi);
      } catch (error) {
        console.log(error);
      }
      console.log(messageSet);
      // Fourth API Call: Fetch Invoice PDF Details
      try {
        const pdfResponse = await axios.post(
          `${API_BASE_URL}/Newpdf_delivery_by`,
          {
            Order_id: a?.Order_ID,
          }
        );
        console.log(pdfResponse.status);
        if (pdfResponse.data.success === true) {
          messageSet = pdfResponse.data.message;
        }
      } catch (error) {
        console.log(error);
        if (error.response?.status === 400) {
          messageNote = error.response.data.message;
        }
      }

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
        const logoData = await convertImageToBase64(logo1);
        doc.addImage(logoData, "PNG", 6, 3, 20, 20); // Adjust the position and size as needed
        // logo end
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`${deliveryApi?.data?.Company_Address.Line_1}`, 30, 8);
        doc.setTextColor(0, 0, 0);
        doc.text(`${deliveryApi?.data?.Company_Address.Line_2}`, 30, 12);
        const longTextOne = `${deliveryApi?.data?.Company_Address.Line_3}`;
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
          {
            label: "Order :",
            value: `${filterData?.data?.data?.Order_Number}`,
          },
          {
            label: "TT Ref :",
            value: `${filterData?.data?.data.Shipment_ref}`,
          },
          { label: " PO Number :", value: "" },
          {
            label: "AWB :",
            value: `${
              deliveryApi?.data?.result?.bl ? deliveryApi?.data?.result?.bl : ""
            }`,
          },
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
          {
            label: "Date:",
            value: `${formatDate(filterData?.data?.data.created)}`,
          },
          { label: "Due Date : ", value: "" },
          {
            label: "Ship Date :",
            value: `${
              deliveryApi?.data?.orderDetails[0]?.Ship_date
                ? deliveryApi?.data?.orderDetails[0]?.Ship_date
                : ""
            }`,
          },
          {
            label: "Delivery By :",
            value: `${messageNote ? messageNote : ""}`,
          },
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
      const formatterThree = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      });
      const rows = deliveryApi?.data?.data?.map((item, index) => ({
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
          fillColor: [32, 55, 100],
          textColor: [255, 255, 255],
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
      await uploadPDF1(pdfBlob, a);
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
      `${a?.Order_Number || "default"}_Operation_Test_${dateTime}.pdf`
    );

    setIsLoading(true);
    loadingModal.fire();
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${a?.Order_Number}_Operation_Test_${dateTime}.pdf`
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
  const inventoryBoxes = (order_id) => {
    setOrderId(order_id);
  };
  const columns = useMemo(
    () => [
      {
        Header: "Number",
        accessor: "Order_Number",
      },
      {
        Header: "Consignee Name",
        accessor: "Consignee_name",
      },
      {
        Header: "TT REF",
        accessor: "Shipment_ref",
      },
      {
        Header: "Location",
        accessor: (row) => row?.Location_name || row?.location_name || "NA",
      },
      {
        Header: "Load Date",
        accessor: (a) => {
          return a?.load_date
            ? new Date(a?.load_date).toLocaleDateString()
            : "NA";
        },
      },
      {
        Header: "Load Time",
        accessor: (a) => {
          return a?.Load_time || "NA";
        },
      },
      {
        Header: "Status",
        accessor: (a) =>
          ({
            1: "Pending",
            2: "Active",
            3: "Packed",
            4: "Shipped",
            5: "Cancelled",
          }[a.Status] || "Unknown"),
      },

      {
        Header: "Actions",
        accessor: (a) => (
          <div className="editIcon">
            {+a.is_deleted === 1 ? (
              <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal2"
                onClick={() => setNotes2(a.deleted_note)}
              >
                <i className="mdi mdi-eye" />
              </button>
            ) : (
              <Link
                to="/order_view_test"
                state={{ from: { ...a, isReadOnly: true } }}
              >
                <i className="mdi mdi-eye" />
              </Link>
            )}

            {+a.is_deleted !== 1 && (
              <>
                {(+a.Status === 1 || +a.Status === 2) && (
                  <>
                    <Link to="/updateTestOrder" state={{ from: { ...a } }}>
                      <i className="mdi mdi-pencil" />
                    </Link>
                  </>
                )}
                {(+a.Status === 1 ||
                  +a.Status === 2 ||
                  +a.Status === 3 ||
                  +a.Status === 4) && (
                  <button type="button" onClick={() => performaOrder(a)}>
                    {" "}
                    <i className="fi fi-sr-square-p"></i>
                  </button>
                )}
                {(+a.Status === 2 || +a.Status === 3 || +a.Status === 4) && (
                  <button type="button" onClick={() => operationPdfTest(a)}>
                    {" "}
                    <i class="fi fi-sr-square-o"></i>
                  </button>
                )}
                {+a.Status === 2 && (
                  <button type="button" onClick={() => customInvoicePdf(a)}>
                    {" "}
                    <svg
                      className="SvgQuo"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <title>alpha-c-box-outline</title>
                      <path d="M3,5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5M5,5V19H19V5H5M11,7H13A2,2 0 0,1 15,9V10H13V9H11V15H13V14H15V15A2,2 0 0,1 13,17H11A2,2 0 0,1 9,15V9A2,2 0 0,1 11,7Z"></path>
                    </svg>
                  </button>
                )}
                {+a.Status === 2 && (
                  <button
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => inventoryBoxes(a.Order_ID)}
                  >
                    {" "}
                    <i className="mdi mdi-note-outline" />
                  </button>
                )}
                {(+a.Status === 2 ||
                  +a.Status === 3 ||
                  +a.Status === 4 ||
                  +a.Status === 5) && (
                  <button
                    type="button"
                    style={{
                      width: "20px",
                      color: "#203764",
                      fontSize: "22px",
                      marginTop: "10px",
                    }}
                    onClick={() => handleEditClick(a.Order_ID)}
                  >
                    <i className="mdi mdi-content-copy" />
                  </button>
                )}
                {(+a.Status === 2 || +a.Status === 3) && (
                  <button
                    type="button"
                    onClick={() => openModal(a.Order_ID, a.Consignee_ID)}
                  >
                    <i className="mdi mdi-airplane-clock" />
                  </button>
                )}
                {(+a.Status === 1 || +a.Status === 2) && (
                  <button
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal1"
                    onClick={() => setDeleteOrderId(a.Order_ID)}
                  >
                    <i className="mdi mdi-delete " />
                  </button>
                )}
                {+a.Status === 1 && (
                  <button type="button" onClick={() => CheckBox(a.Order_ID)}>
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
              </>
            )}
          </div>
        ),
      },
    ],
    [data, form]
  );

  return (
    <>
      <Card
        title="Order Test Management"
        endElement={
          <button
            type="button"
            onClick={() => navigate("/createTestOrder")}
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
              <MenuItem value="0">Pending</MenuItem>
              <MenuItem value="1">Active</MenuItem>
              <MenuItem value="2">Shipped</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <TableView columns={columns} data={data} />
      </Card>

      {isOpenModal && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: "9999" }}
        >
          <div
            className="fixed w-screen h-screen bg-black/20"
            onClick={closeModal}
          />
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full ">
            <div className="crossArea">
              <h3>Edit Details</h3>
              <p onClick={closeModal}>
                <CloseIcon />
              </p>
            </div>
            <form.Provider>
              <form
                className="formEan formCreate mt-0"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  void form.handleSubmit();
                }}
              >
                <div className="p-3 bottomOrderSp">
                  <div className="form-group">
                    <label>Consignee Ref</label>

                    <input
                      type="text"
                      value={inputValue}
                      onChange={handleChange5}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Liner</label>
                    <form.Field
                      name="Liner"
                      children={(field) => (
                        <ComboBox
                          options={liner?.map((v) => ({
                            id: v.liner_id,
                            name: v.liner_name,
                          }))}
                          value={field.state.value}
                          onChange={(e) => {
                            // Here, `e` is expected to be the ID of the selected item if ComboBox passes it like that,
                            // otherwise you might need to adjust how you retrieve the value
                            field.handleChange(e);
                            setSelectedLinerId(e); // Assuming `e` directly is the liner_id, adjust if needed
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className="form-group">
                    <label>Journey Number</label>

                    <form.Field
                      name="journey_number"
                      children={(field) => (
                        <ComboBox
                          options={Journey?.map((v) => ({
                            id: v.ID,
                            name: v.journey_number,
                          }))}
                          defaultValues={totalDetails?.journey_number}
                          value={field.state.value}
                          onChange={(e) => {
                            field.handleChange(e);
                            handleJourneySelection(e);
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className="form-group">
                    <label>BL</label>
                    <form.Field
                      name="bl"
                      children={(field) => (
                        <input
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      )}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="form-group w-full">
                      <label>Load Date</label>
                      <form.Field
                        name="Load_date"
                        children={(field) => (
                          // <input
                          //   type="date"
                          //   name={field.name}
                          //   value={field.state.value}
                          //   onBlur={field.handleBlur}
                          //   onChange={(e) => {
                          //     field.handleChange(e.target.value);
                          //     handleLoadDateSelection(e.target.value);
                          //   }}
                          // />
                          <DatePicker
                            selected={startDate}
                            onChange={handleStartDateChange}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Click to select a date"
                            customInput={<CustomInput />}
                          />
                        )}
                      />
                    </div>
                    <div className="form-group loadTimeS">
                      <label>Load Time</label>
                      <form.Field
                        name="Load_time"
                        children={(field) => (
                          <input
                            type="time"
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="form-group w-full">
                      <label>Ship Date</label>
                      <form.Field
                        name="Ship_date"
                        children={(field) => (
                          // <input
                          //   type="date"
                          //   name={field.name}
                          //   value={field.state.value}
                          //   onBlur={field.handleBlur}
                          //   onChange={(e) => field.handleChange(e.target.value)}
                          // />
                          <DatePicker
                            selected={startDate1}
                            onChange={handleStartDateChange1}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Click to select a date"
                            customInput={<CustomInput />}
                          />
                        )}
                      />
                    </div>
                    <div className="form-group">
                      <label>ETD</label>
                      <form.Field
                        name="ETD"
                        children={(field) => (
                          <input
                            type="time"
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="form-group w-full">
                      <label>Arrival Date</label>
                      <form.Field
                        name="Arrival_date"
                        children={(field) => (
                          // <input
                          //   type="date"
                          //   name={field.name}
                          //   value={field.state.value}
                          //   onBlur={field.handleBlur}
                          //   onChange={(e) => field.handleChange(e.target.value)}
                          // />
                          <DatePicker
                            selected={startDate2}
                            onChange={handleStartDateChange2}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Click to select a date"
                            customInput={<CustomInput />}
                          />
                        )}
                      />
                    </div>
                    <div className="form-group">
                      <label>ETA</label>
                      <form.Field
                        name="ETA"
                        children={(field) => (
                          <input
                            type="time"
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer justify-center">
                  <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              </form>
            </form.Provider>
          </div>
        </div>
      )}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog InvoiceModal ">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Orders Note
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
        id="exampleModal1"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog   orderDelPop">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Note
              </h1>
              <textarea
                value={notes1}
                onChange={handleChange3}
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
                onClick={dataSubmit1}
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
        id="exampleModal2"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog   orderDelPop">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Note
              </h1>
              <textarea
                value={notes2}
                onChange={handleChange3}
                readOnly
                placeholder="Type Notes Here"
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary "
                data-bs-dismiss="modal"
              >
                Close
              </button>
              {/* <button
                type="button"
                onClick={dataSubmit1}
                className="btn btn-primary"
              >
                ok
              </button> */}
            </div>
          </div>
        </div>
      </div>
      <Modal className="modalError" show={show} onHide={handleClose}>
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Order
            </h1>
            <button
              style={{ color: "#fff", fontSize: "30px" }}
              type="button"
              onClick={() => setShow(false)}
            >
              <i class="mdi mdi-close"></i>
            </button>
          </div>
          <div className="modal-body">
            <div className="eanCheck errorMessage">
              <p>{stock ? stock : "NULL"}</p>
            </div>
          </div>
          <div className="modal-footer"></div>
        </div>
      </Modal>
    </>
  );
};

export default Test;
